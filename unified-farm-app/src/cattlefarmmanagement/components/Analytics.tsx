import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart, LineChart, PieChart, ResponsiveContainer,
  Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { DataService } from '../lib/dataService';
import SkeletonLoader from './ui/SkeletonLoader';
import CattleNavbar from "./Navbar";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonMonths, setComparisonMonths] = useState<3 | 6 | 9 | 12>(3);
  const [monthlyComparison, setMonthlyComparison] = useState<any[]>([]);
  const [productionTrends, setProductionTrends] = useState({ morning: 0, evening: 0 });
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyPattern, setWeeklyPattern] = useState<any[]>([]);

  useEffect(() => {
    loadComparison();
    loadCurrentMonthData();
  }, [comparisonMonths]);

  const timeRangeOptions = [
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 9, label: '9 Months' }, 
    { value: 12, label: '1 Year' }
  ];

  const handleTimeRangeChange = async (value: number) => {
    setComparisonMonths(value as 3 | 6 | 9 | 12);
    setLoading(true);
    await loadComparison();
  };

  const loadComparison = async () => {
    try {
      setLoading(true);
      const data = await DataService.getMonthlyComparison(comparisonMonths);
      setMonthlyComparison(data);
    } catch (error) {
      console.error('Error loading comparison:', error);
      setError('Failed to load monthly comparison data');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentMonthData = async () => {
    try {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const records = await DataService.getMonthlyRecords(currentMonth);
      
      if (records.length > 0) {
        // Process daily data
        setDailyData(records.map(record => ({
          date: format(new Date(record.date), 'dd MMM'),
          total: record.total_milk,
          morning: record.morning_milk,
          evening: record.evening_milk
        })));

        // Calculate weekly patterns
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyStats = weekDays.map(day => ({
          day,
          average: records
            .filter(r => format(new Date(r.date), 'EEE') === day)
            .reduce((acc, r) => acc + r.total_milk, 0) / records.length
        }));
        setWeeklyPattern(weeklyStats);

        // Update production trends
        const totals = records.reduce((acc, record) => ({
          morning: acc.morning + record.morning_milk,
          evening: acc.evening + record.evening_milk
        }), { morning: 0, evening: 0 });
        setProductionTrends(totals);
      }
    } catch (error) {
      console.error('Error loading current month data:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader height="h-8" width="w-1/3" className="mb-4" />
        <SkeletonLoader height="h-80" width="w-full" className="mb-6" />
        <SkeletonLoader height="h-80" width="w-full" className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader height="h-80" width="w-full" />
          <SkeletonLoader height="h-80" width="w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <>
      <CattleNavbar />
      <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white">Production Analytics</h1>
          
          <div className="relative">
            <select
              value={comparisonMonths}
              onChange={(e) => handleTimeRangeChange(Number(e.target.value))}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        </div>

        {/* Monthly Comparison Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Monthly Production Comparison</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_milk" name="Total Production" fill="#2563eb" />
                <Bar dataKey="average_daily" name="Daily Average" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Production Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Daily Production Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total" stroke="#2563eb" />
                <Line type="monotone" dataKey="morning" name="Morning" stroke="#059669" />
                <Line type="monotone" dataKey="evening" name="Evening" stroke="#dc2626" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Time Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Morning', value: productionTrends.morning },
                      { name: 'Evening', value: productionTrends.evening }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#059669" />
                    <Cell fill="#dc2626" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Pattern */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Weekly Pattern</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyPattern}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" name="Daily Average" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;