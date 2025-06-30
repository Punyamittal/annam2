// src/lib/cowService.ts
import { db } from './firebase';
import { 
  collection, query, where, getDocs, doc,
  setDoc, orderBy, deleteDoc, writeBatch, updateDoc
} from 'firebase/firestore';
import type { Cow, HealthRecord, BreedingRecord } from '../types';

export class CowService {
  private static COWS_COLLECTION = 'cows';
  private static HEALTH_COLLECTION = 'health_records';
  private static BREEDING_COLLECTION = 'breeding_records';

  public static async addCow(cowData: Omit<Cow, 'id' | 'created_at' | 'updated_at'>): Promise<Cow> {
    try {
      const standardizedTagNumber = cowData.tag_number.trim();
      const docRef = doc(collection(db, this.COWS_COLLECTION));
      const timestamp = new Date().toISOString();
      
      const newCow: Cow = {
        ...cowData,
        tag_number: standardizedTagNumber,
        id: docRef.id,
        created_at: timestamp,
        updated_at: timestamp
      };
  
      await setDoc(docRef, newCow);
      return newCow;
    } catch (error) {
      console.error('Error adding cow:', error);
      throw error;
    }
  }
  
  public static async updateCow(id: string, cowData: Partial<Cow>): Promise<void> {
    try {
      if (cowData.tag_number) {
        cowData.tag_number = cowData.tag_number.trim();
      }
  
      const docRef = doc(db, this.COWS_COLLECTION, id);
      await updateDoc(docRef, {
        ...cowData,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating cow:', error);
      throw error;
    }
  }
  // Cow CRUD operations
  public static async saveCow(cow: Omit<Cow, 'id'> & { id?: string }): Promise<Cow> {
    try {
      const timestamp = new Date().toISOString();
      const cowId = cow.id || crypto.randomUUID();

      const newCow = {
        ...cow,
        id: cowId,
        updated_at: timestamp,
        created_at: cow.created_at || timestamp
      };

      await setDoc(
        doc(db, this.COWS_COLLECTION, cowId),
        newCow
      );

      return newCow;
    } catch (error) {
      console.error('Error saving cow:', error);
      throw error;
    }
  }

  public static async getCows(filters?: {
    status?: Cow['status'];
    search?: string;
  }): Promise<Cow[]> {
    try {
      let baseQuery = collection(db, this.COWS_COLLECTION);
      let constraints: any[] = [orderBy('created_at', 'desc')];
      
      const q = query(baseQuery, ...constraints);
      const querySnapshot = await getDocs(q);
      let cows = querySnapshot.docs.map(doc => ({ ...doc.data() } as Cow));

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        cows = cows.filter(cow => 
          cow.tag_number.toLowerCase().includes(searchTerm) ||
          cow.name?.toLowerCase().includes(searchTerm)
        );
      }
  
      return cows;
    } catch (error) {
      console.error('Error fetching cows:', error);
      return [];
    }
  }

  public static async deleteCow(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COWS_COLLECTION, id));
      // Also delete associated records
      const healthDocs = await getDocs(query(
        collection(db, this.HEALTH_COLLECTION), 
        where('cow_id', '==', id)
      ));
      const breedingDocs = await getDocs(query(
        collection(db, this.BREEDING_COLLECTION),
        where('cow_id', '==', id)  
      ));

      const batch = writeBatch(db);
      healthDocs.forEach(doc => batch.delete(doc.ref));
      breedingDocs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

    } catch (error) {
      console.error('Error deleting cow:', error);
      throw error;
    }
  }

  // Health Records
  public static async saveHealthRecord(record: Omit<HealthRecord, 'id'> & { id?: string }): Promise<HealthRecord> {
    try {
      const timestamp = new Date().toISOString();
      const recordId = record.id || crypto.randomUUID();

      const newRecord = {
        ...record,
        id: recordId,
        updated_at: timestamp,
        created_at: record.created_at || timestamp
      };

      await setDoc(
        doc(db, this.HEALTH_COLLECTION, recordId),
        newRecord
      );

      return newRecord;
    } catch (error) {
      console.error('Error saving health record:', error);
      throw error;
    }
  }

  public static async getHealthRecords(cowId: string): Promise<HealthRecord[]> {
    try {
      const q = query(
        collection(db, this.HEALTH_COLLECTION),
        where('cow_id', '==', cowId),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data() } as HealthRecord));
    } catch (error) {
      console.error('Error fetching health records:', error);
      return [];
    }
  }

  // Breeding Records
  public static async saveBreedingRecord(record: Omit<BreedingRecord, 'id'> & { id?: string }): Promise<BreedingRecord> {
    try {
      const timestamp = new Date().toISOString();
      const recordId = record.id || crypto.randomUUID();

      const newRecord = {
        ...record,
        id: recordId,
        updated_at: timestamp,
        created_at: record.created_at || timestamp
      };

      await setDoc(
        doc(db, this.BREEDING_COLLECTION, recordId),
        newRecord
      );

      return newRecord;
    } catch (error) {
      console.error('Error saving breeding record:', error);
      throw error;
    }
  }

  public static async getBreedingRecords(cowId: string): Promise<BreedingRecord[]> {
    try {
      const q = query(
        collection(db, this.BREEDING_COLLECTION),
        where('cow_id', '==', cowId),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data() } as BreedingRecord));
    } catch (error) {
      console.error('Error fetching breeding records:', error);
      return [];
    }
  }

  public static async getUpcomingAlerts(): Promise<{
    calvingAlerts: Array<{cow: Cow, date: string}>;
    followupAlerts: Array<{cow: Cow, record: HealthRecord, date: string}>;
  }> {
    try {
      const today = new Date();
      const fiveDaysFromNow = new Date();
      fiveDaysFromNow.setDate(today.getDate() + 5);

      // Get all active cows
      const cows = await this.getCows({ status: 'Active' });
      const calvingAlerts = [];
      const followupAlerts = [];

      // Process each cow
      for (const cow of cows) {
        // Get breeding records for calving alerts
        const breedingRecords = await this.getBreedingRecords(cow.id);
        
        // Fix: Log the records for debugging
        console.log('Breeding records for cow', cow.tag_number, breedingRecords);

        // Filter upcoming calvings
        const upcomingCalvings = breedingRecords.filter(record => {
          // Debug log for each record's data
          console.log('Checking record:', {
            cowId: cow.tag_number,
            record: record,
            calving_date: record.calving_date,
            pregnancy_status: record.pregnancy_status
          });

          if (!record.calving_date || record.pregnancy_status !== 'Confirmed') {
            console.log('Skipping record - missing date or not confirmed:', {
              hasCalvingDate: !!record.calving_date,
              pregnancyStatus: record.pregnancy_status
            });
            return false;
          }

          const calvingDate = new Date(record.calving_date);
          const isUpcoming = calvingDate >= today && calvingDate <= fiveDaysFromNow;
          
          console.log('Date comparison:', {
            calvingDate: calvingDate.toISOString(),
            today: today.toISOString(),
            fiveDaysFromNow: fiveDaysFromNow.toISOString(),
            isUpcoming
          });
          
          return isUpcoming;
        });

        // Add calving alerts
        calvingAlerts.push(...upcomingCalvings.map(record => ({
          cow,
          date: record.calving_date!
        })));

        // Get health records for follow-up alerts
        const healthRecords = await this.getHealthRecords(cow.id);
        const upcomingFollowups = healthRecords.filter(record => {
          if (!record.next_followup) return false;
          const followupDate = new Date(record.next_followup);
          return followupDate >= today && followupDate <= fiveDaysFromNow;
        });

        // Add follow-up alerts
        followupAlerts.push(...upcomingFollowups.map(record => ({
          cow,
          record,
          date: record.next_followup!
        })));
      }

      // Sort alerts by date
      calvingAlerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      followupAlerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Log final alerts for debugging
      console.log('Final alerts:', { calvingAlerts, followupAlerts });

      return {
        calvingAlerts,
        followupAlerts
      };
    } catch (error) {
      console.error('Error getting alerts:', error);
      return {
        calvingAlerts: [],
        followupAlerts: []
      };
    }
  }
}