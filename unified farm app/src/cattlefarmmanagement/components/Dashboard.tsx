import { useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { Plus, TrendingUp, TrendingDown, Equal, FileSpreadsheet, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Link from 'next/link'; // Import Link from next/link
import { DataService } from '../lib/dataService';
// Add CowService import
import { CowService } from '../lib/cowService';
import type { MilkRecord, Cow, HealthRecord } from '../types';

const Dashboard = () => {
  const [todayStats, setTodayStats] = useState<MilkRecord | null>(null);
  const [yesterdayStats, setYesterdayStats] = useState<MilkRecord | null>(null);
  const [weeklyData, setWeeklyData] = useState<{ date: string; total: number }[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [monthlyRecordCount, setMonthlyRecordCount] = useState(0);
  const [monthlyRecords, setMonthlyRecords] = useState<MilkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousMonthData, setPreviousMonthData] = useState<{
    month: string;
    records: MilkRecord[];
  } | null>(null);
  // Add new state for cow statistics
  const [cowStats, setCowStats] = useState({
    total: 0,
    adults: 0,
    calves: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const currentMonth = format(currentDate, 'yyyy-MM');
        const dayOfMonth = parseInt(format(currentDate, 'dd'));
        
        // Check if we're in first 5 days of the month
        if (dayOfMonth <= 5) {
          const previousMonth = format(subMonths(currentDate, 1), 'yyyy-MM');
          const previousRecords = await DataService.getMonthlyRecords(previousMonth);
          
          if (previousRecords.length > 0) {
            setPreviousMonthData({
              month: previousMonth,
              records: previousRecords
            });
            
            // Archive previous month's data
            await DataService.checkAndArchiveOldMonth();
          }
        }

        // Fetch current month records
        const records = await DataService.getMonthlyRecords(currentMonth);
        
        // Sort records by date
        const sortedRecords = records.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setMonthlyRecords(sortedRecords);
        
        const todayDate = format(new Date(), 'yyyy-MM-dd');
        const yesterdayDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        
        // Find today's and yesterday's records
        const todayRecord = sortedRecords.find(record => record.date === todayDate);
        const yesterdayRecord = sortedRecords.find(record => record.date === yesterdayDate);
        
        setTodayStats(todayRecord || null);
        setYesterdayStats(yesterdayRecord || null);
        
        // Calculate monthly total with null check
        if (sortedRecords.length > 0) {
          const total = sortedRecords.reduce((sum, record) => sum + record.total_milk, 0);
          setMonthlyTotal(total);
          setMonthlyRecordCount(sortedRecords.length);

          // Get last 7 days data
          const last7Days = sortedRecords
            .slice(0, 7)
            .map(record => ({
              date: format(new Date(record.date), 'MMM dd'),
              total: record.total_milk
            }))
            .reverse();
          
          setWeeklyData(last7Days);
        } else {
          setMonthlyTotal(0);
          setMonthlyRecordCount(0);
          setWeeklyData([]);
        }

        // Add cow statistics fetch
        const cows = await CowService.getCows({ status: 'Active' });
        const stats = calculateCowStats(cows);
        setCowStats(stats);

      } catch (error) {
        console.error('Error fetching data:', error);
        // Reset states on error
        setMonthlyRecords([]);
        setMonthlyTotal(0);
        setMonthlyRecordCount(0);
        setWeeklyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  // Add helper function to calculate stats
  const calculateCowStats = (cows: Cow[]) => {
    const adults = cows.filter(cow => cow.age_category === 'Adult').length;
    const calves = cows.filter(cow => cow.age_category === 'Calf').length;
    return {
      total: cows.length,
      adults,
      calves
    };
  };

  const getProductionTrend = () => {
    if (!todayStats || !yesterdayStats) return null;
    
    const diff = todayStats.total_milk - yesterdayStats.total_milk;
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-500', text: `+${diff.toFixed(1)}L` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-red-500', text: `${diff.toFixed(1)}L` };
    return { icon: Equal, color: 'text-yellow-500', text: 'No change' };
  };

  const trend = getProductionTrend();

  const handleExportExcel = async (month: string, records: MilkRecord[]) => {
    try {
      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(
        records.map(record => ({
          Date: format(new Date(record.date), 'dd MMM yyyy'),
          'Morning (L)': record.morning_milk,
          'Evening (L)': record.evening_milk,
          'Total (L)': record.total_milk
        }))
      );
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Records');
      XLSX.writeFile(workbook, `milk-records-${month}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const handleExportPDF = async (month: string, records: MilkRecord[]) => {
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      autoTable(doc, {
        head: [['Date', 'Morning (L)', 'Evening (L)', 'Total (L)']],
        body: records.map(record => [
          format(new Date(record.date), 'dd MMM yyyy'),
          record.morning_milk.toString(),
          record.evening_milk.toString(),
          record.total_milk.toString()
        ]),
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      doc.save(`milk-records-${month}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <AlertsSection />
      </div>

      {/* Add Herd Statistics section before existing grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Herd Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {cowStats.total}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Animals</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {cowStats.adults}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Adult Cows</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {cowStats.calves}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Calves</p>
            </div>
          </div>
        </div>
        
        {/* Your existing Today's Stats Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Today's Production</h2>
          {todayStats ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {todayStats.total_milk}L
                </span>
              </div>
              {trend && (
                <div className="flex items-center text-sm">
                  <trend.icon className={`h-4 w-4 mr-1 ${trend.color}`} />
                  <span className={trend.color}>{trend.text} from yesterday</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Morning</div>
                  <div className="font-semibold dark:text-white">{todayStats.morning_milk}L</div>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Evening</div>
                  <div className="font-semibold dark:text-white">{todayStats.evening_milk}L</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No data recorded for today</p>
              <Link
                href="/cattlefarmmanagement/data-entry"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Today's Record
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Overview Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Monthly Overview</h2>
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {monthlyTotal.toFixed(1)}L
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Production</p>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-400">Daily Average</div>
              <div className="font-semibold dark:text-white">
                {monthlyRecordCount > 0 ? (monthlyTotal / monthlyRecordCount).toFixed(1) : '0.0'}L
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Morning</div>
                <div className="font-semibold dark:text-white">
                  {monthlyRecordCount > 0 
                    ? (monthlyRecords.reduce((sum, r) => sum + r.morning_milk, 0) / monthlyRecordCount).toFixed(1) 
                    : '0.0'}L
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Evening</div>
                <div className="font-semibold dark:text-white">
                  {monthlyRecordCount > 0 
                    ? (monthlyRecords.reduce((sum, r) => sum + r.evening_milk, 0) / monthlyRecordCount).toFixed(1) 
                    : '0.0'}L
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Weekly Trend</h2>
          <div className="space-y-2">
            {weeklyData.map((day) => (
              <div key={day.date} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-0">
                <span className="text-gray-600 dark:text-gray-400">{day.date}</span>
                <span className="font-semibold dark:text-white">{day.total}L</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Previous Month Export Section */}
      {previousMonthData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-white">
              Previous Month Records - {format(new Date(previousMonthData.month), 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExportExcel(previousMonthData.month, previousMonthData.records)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </button>
              <button
                onClick={() => handleExportPDF(previousMonthData.month, previousMonthData.records)}
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertsSection = () => {
  const [alerts, setAlerts] = useState<{
    calvingAlerts: Array<{cow: Cow, date: string}>;
    followupAlerts: Array<{cow: Cow, record: HealthRecord, date: string}>;
  }>({ calvingAlerts: [], followupAlerts: [] });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const alertData = await CowService.getUpcomingAlerts();
      setAlerts(alertData);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  if (alerts.calvingAlerts.length === 0 && alerts.followupAlerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Upcoming Alerts
      </h2>
      <div className="space-y-4">
        {alerts.calvingAlerts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Upcoming Calvings
            </h3>
            {alerts.calvingAlerts.map(({ cow, date }) => (
              <div 
                key={cow.id}
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <div>
                  <Link
                    href={`/cattlefarmmanagement/cows/${cow.id}`}
                    className="text-blue-700 dark:text-blue-400 font-medium hover:underline"
                  >
                    {cow.tag_number}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expected calving date
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {format(new Date(date), 'dd MMM yyyy')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(date), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {alerts.followupAlerts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Health Follow-ups
            </h3>
            {alerts.followupAlerts.map(({ cow, record, date }) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <div>
                  <Link
                    href={`/cattlefarmmanagement/cows/${cow.id}`}
                    className="text-green-700 dark:text-green-400 font-medium hover:underline"
                  >
                    {cow.tag_number}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {record.record_type} follow-up
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {format(new Date(date), 'dd MMM yyyy')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(date), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;