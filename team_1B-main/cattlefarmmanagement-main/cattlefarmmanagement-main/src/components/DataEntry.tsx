import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Save, Trash2, Edit2 } from 'lucide-react';
import { DataService } from '../lib/dataService';
import type { MilkRecord } from '../types';

const DataEntry = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [morningMilk, setMorningMilk] = useState('');
  const [eveningMilk, setEveningMilk] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setMessage] = useState({ type: '', text: '' });
  const [editingRecord, setEditingRecord] = useState<MilkRecord | null>(null);
  const [records, setRecords] = useState<MilkRecord[]>([]);

  useEffect(() => {
    loadRecords();
  }, [date]);

  const loadRecords = async () => {
    const month = date.substring(0, 7);
    const data = await DataService.getMonthlyRecords(month);
    setRecords(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!morningMilk || !eveningMilk) {
        throw new Error('Please enter both morning and evening milk values');
      }
  
      const recordData = {
        date,
        morning_milk: parseFloat(morningMilk),
        evening_milk: parseFloat(eveningMilk),
        total_milk: parseFloat(morningMilk) + parseFloat(eveningMilk),
        user_id: '1',
        created_at: editingRecord?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(editingRecord && { id: editingRecord.id })
      };
  
      await DataService.saveRecord(recordData);
      setMessage({ 
        type: 'success', 
        text: editingRecord ? 'Record updated successfully!' : 'Record saved successfully!' 
      });
  
      resetForm();
      loadRecords();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save record' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: MilkRecord) => {
    setDate(record.date);
    setMorningMilk(record.morning_milk.toString());
    setEveningMilk(record.evening_milk.toString());
    setEditingRecord(record);
    // Remove the notes setting
  };

  const resetForm = () => {
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setMorningMilk('');
    setEveningMilk('');
    setMessage({ type: '', text: '' });
    setEditingRecord(null);
    // Remove the notes reset
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Data Entry</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Date Field */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-black">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Morning Milk Field */}
          <div>
            <label htmlFor="morningMilk" className="block text-sm font-medium text-gray-700 dark:text-black">
              Morning Milk (kg)
            </label>
            <input
              type="number"
              id="morningMilk"
              value={morningMilk}
              onChange={(e) => setMorningMilk(e.target.value)}
              step="0.1"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Evening Milk Field */}
          <div>
            <label htmlFor="eveningMilk" className="block text-sm font-medium text-gray-700 dark:text-black">
              Evening Milk (kg)
            </label>
            <input
              type="number"
              id="eveningMilk"
              value={eveningMilk}
              onChange={(e) => setEveningMilk(e.target.value)}
              step="0.1"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : editingRecord ? 'Update' : 'Save'}
          </button>
        </div>
      </form>

      {/* Records Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Morning</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evening</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {format(new Date(record.date), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.morning_milk}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.evening_milk}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.total_milk}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;