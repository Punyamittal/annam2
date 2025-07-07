import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc,
  doc,
  writeBatch
} from 'firebase/firestore';
import type { MilkRecord, MonthlyTotal } from '../types';
import { format, subMonths } from 'date-fns';

export class DataService {
  private static RECORDS_COLLECTION = 'milk_records';
  private static MONTHLY_TOTALS_COLLECTION = 'monthly_totals';

  public static async saveRecord(record: Omit<MilkRecord, 'id'> & { id?: string }) {
    try {
      // Check if record already exists for this date
      const existingRecordQuery = query(
        collection(db, this.RECORDS_COLLECTION),
        where('date', '==', record.date)
      );
      
      const querySnapshot = await getDocs(existingRecordQuery);
      const existingRecord = querySnapshot.docs[0];

      // If record exists and we're not updating the same record, throw error
      if (existingRecord && existingRecord.id !== record.id) {
        throw new Error('A record already exists for this date');
      }

      const timestamp = new Date().toISOString();
      const recordId = record.id || crypto.randomUUID();

      const newRecord = {
        ...record,
        id: recordId,
        updated_at: timestamp,
        created_at: record.created_at || timestamp
      };

      await setDoc(
        doc(db, this.RECORDS_COLLECTION, recordId), 
        newRecord
      );

      return newRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to save record: ${message}`);
    }
  }

  public static async getMonthlyComparison(monthCount: 3 | 6 | 9 | 12): Promise<MonthlyTotal[]> {
    try {
      const endDate = new Date();
      const startDate = subMonths(endDate, monthCount - 1);
      
      // Format dates properly for query
      const startMonth = format(startDate, 'yyyy-MM');
      const endMonth = format(endDate, 'yyyy-MM');
      
      const q = query(
        collection(db, this.MONTHLY_TOTALS_COLLECTION),
        where('month', '>=', startMonth),
        where('month', '<=', endMonth)
      );

      const querySnapshot = await getDocs(q);
      const totals: MonthlyTotal[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as MonthlyTotal;
        totals.push({
          ...data,
          // Format month for display
          month: format(new Date(data.month + '-01'), 'MMM yyyy'),
          // Ensure numbers are properly formatted
          total_milk: Number(data.total_milk),
          average_daily: Number(data.average_daily),
          morning_total: Number(data.morning_total),
          evening_total: Number(data.evening_total),
          highest_day: Number(data.highest_day),
          lowest_day: Number(data.lowest_day)
        });
      });

      // Sort by date ascending
      return totals.sort((a, b) => a.month.localeCompare(b.month));
    } catch (error) {
      console.error('Error fetching monthly comparison:', error);
      return [];
    }
  }

  public static async archiveMonthlyData(month: string) {
    try {
      const records = await this.getMonthlyRecords(month);
      
      if (records.length === 0) return null;

      const monthlyTotal: MonthlyTotal = {
        month,
        total_milk: records.reduce((sum, r) => sum + r.total_milk, 0),
        morning_total: records.reduce((sum, r) => sum + r.morning_milk, 0),
        evening_total: records.reduce((sum, r) => sum + r.evening_milk, 0),
        average_daily: records.reduce((sum, r) => sum + r.total_milk, 0) / records.length,
        highest_day: Math.max(...records.map(r => r.total_milk)),
        lowest_day: Math.min(...records.map(r => r.total_milk)),
        record_count: records.length,
        archived_at: new Date().toISOString()
      };

      // Batch write operations
      const batch = writeBatch(db);
      
      // Save monthly total
      batch.set(doc(db, this.MONTHLY_TOTALS_COLLECTION, month), monthlyTotal);
      
      // Delete individual records
      records.forEach(record => {
        batch.delete(doc(db, this.RECORDS_COLLECTION, record.id));
      });

      await batch.commit();
      return monthlyTotal;

    } catch (error) {
      console.error('Error archiving monthly data:', error);
      throw error;
    }
  }

  public static async getMonthlyRecords(month: string): Promise<MilkRecord[]> {
    try {
      const q = query(
        collection(db, this.RECORDS_COLLECTION),
        where('date', '>=', `${month}-01`),
        where('date', '<=', `${month}-31`)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MilkRecord));
    } catch (error) {
      console.error('Error fetching monthly records:', error);
      return [];
    }
  }

  public static async checkAndArchiveOldMonth(): Promise<void> {
    try {
      const today = new Date();
      const previousMonth = format(subMonths(today, 1), 'yyyy-MM');
      const dayOfMonth = parseInt(format(today, 'dd'));

      // Check if we're in the first 5 days of the month
      if (dayOfMonth <= 5) {
        // Check if previous month is already archived
        const q = query(
          collection(db, this.MONTHLY_TOTALS_COLLECTION),
          where('month', '==', previousMonth)
        );
        const querySnapshot = await getDocs(q);

        // If not archived yet, archive it
        if (querySnapshot.empty) {
          await this.archiveMonthlyData(previousMonth);
        }
      }
    } catch (error) {
      console.error('Error checking and archiving old month:', error);
    }
  }
}