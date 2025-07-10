import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileSpreadsheet, FileText, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { DataService } from '../lib/dataService';
import type { MilkRecord, MonthlyTotal } from '../types';
import { Button } from './ui/Button';
import SkeletonLoader from './ui/SkeletonLoader';
import CattleNavbar from "./Navbar";

const Reports = () => {
  const [activeMonth, setActiveMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [archivedMonths, setArchivedMonths] = useState<MonthlyTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeMonth]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load current month's records
      const currentRecords = await DataService.getMonthlyRecords(activeMonth);
      setRecords(currentRecords);

      // Load archived months data for the last 12 months
      const archived = await DataService.getMonthlyComparison(12);
      setArchivedMonths(archived);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (records: MilkRecord[], month: string) => {
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const title = `Milk Production Report - ${format(new Date(month), 'MMMM yyyy')}`;
      
      doc.setFontSize(16);
      doc.text(title, 14, 15);
  
      const tableData = records.map(record => [
        format(new Date(record.date), 'dd MMM yyyy'),
        record.morning_milk.toString(),
        record.evening_milk.toString(),
        record.total_milk.toString()
      ]);
  
      autoTable(doc, {
        head: [['Date', 'Morning (L)', 'Evening (L)', 'Total (L)']],
        body: tableData,
        startY: 25,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255 }
      });
  
      // Add summary at the bottom
      const totals = {
        morning: records.reduce((sum, r) => sum + r.morning_milk, 0),
        evening: records.reduce((sum, r) => sum + r.evening_milk, 0),
        total: records.reduce((sum, r) => sum + r.total_milk, 0)
      };
  
      autoTable(doc, {
        body: [[
          'Monthly Totals',
          totals.morning.toFixed(1),
          totals.evening.toFixed(1),
          totals.total.toFixed(1)
        ]],
        styles: { fontSize: 8, fontStyle: 'bold' },
        theme: 'plain'
      });
  
      doc.save(`milk-report-${month}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  };
  
  const generateExcel = async (records: MilkRecord[], month: string) => {
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
  
      // Add totals row
      const totals = {
        morning: records.reduce((sum, r) => sum + r.morning_milk, 0),
        evening: records.reduce((sum, r) => sum + r.evening_milk, 0),
        total: records.reduce((sum, r) => sum + r.total_milk, 0)
      };
  
      XLSX.utils.sheet_add_json(worksheet, [{
        Date: 'Monthly Totals',
        'Morning (L)': totals.morning,
        'Evening (L)': totals.evening,
        'Total (L)': totals.total
      }], { origin: -1 });
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Records');
      XLSX.writeFile(workbook, `milk-report-${month}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw new Error('Failed to generate Excel file');
    }
  };

  return (
    <>
      <CattleNavbar />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold dark:text-white">Monthly Reports</h1>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="month"
                value={activeMonth}
                onChange={(e) => setActiveMonth(e.target.value)}
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Current Month Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold dark:text-white">
                Records for {format(new Date(activeMonth), 'MMMM yyyy')}
              </h2>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  icon={FileSpreadsheet}
                  onClick={() => generateExcel(records, activeMonth)}
                  disabled={loading || records.length === 0}
                >
                  Export Excel
                </Button>
                
                <Button
                  variant="primary"
                  icon={FileText}
                  onClick={() => generatePDF(records, activeMonth)}
                  disabled={loading || records.length === 0}
                >
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8">
              <SkeletonLoader height="h-8" width="w-1/3" className="mb-4" />
              <SkeletonLoader height="h-10" count={8} />
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Morning (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Evening (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total (kg)</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {records.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(record.date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.morning_milk}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.evening_milk}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.total_milk}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {records.reduce((sum, record) => sum + record.morning_milk, 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {records.reduce((sum, record) => sum + record.evening_milk, 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {records.reduce((sum, record) => sum + record.total_milk, 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Archived Reports Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-white">Archived Reports</h2>
          </div>

          <div className="divide-y dark:divide-gray-700">
            {archivedMonths.map((month) => (
              <div key={month.month} className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpandedMonth(expandedMonth === month.month ? null : month.month)}
                    className="flex items-center text-left w-full"
                  >
                    <span className="mr-2">
                      {expandedMonth === month.month ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium dark:text-white">{month.month}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total: {month.total_milk.toFixed(1)}L | Daily Average: {month.average_daily.toFixed(1)}L
                      </p>
                    </div>
                  </button>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      icon={FileSpreadsheet}
                      onClick={() => generateExcel([], month.month)}
                      size="sm"
                    >
                      Excel
                    </Button>
                    <Button
                      variant="primary"
                      icon={FileText}
                      onClick={() => generatePDF([], month.month)}
                      size="sm"
                    >
                      PDF
                    </Button>
                  </div>
                </div>

                {expandedMonth === month.month && (
                  <div className="mt-4 pl-7">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <dt className="text-sm text-gray-500 dark:text-gray-400">Morning Total</dt>
                        <dd className="text-lg font-medium dark:text-white">{month.morning_total.toFixed(1)}L</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <dt className="text-sm text-gray-500 dark:text-gray-400">Evening Total</dt>
                        <dd className="text-lg font-medium dark:text-white">{month.evening_total.toFixed(1)}L</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <dt className="text-sm text-gray-500 dark:text-gray-400">Highest Day</dt>
                        <dd className="text-lg font-medium dark:text-white">{month.highest_day.toFixed(1)}L</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <dt className="text-sm text-gray-500 dark:text-gray-400">Lowest Day</dt>
                        <dd className="text-lg font-medium dark:text-white">{month.lowest_day.toFixed(1)}L</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Label</span>
                        <p className="text-gray-600 dark:text-gray-300">Secondary text</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <a className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Link</a>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            ))}

            {archivedMonths.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No archived reports available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;