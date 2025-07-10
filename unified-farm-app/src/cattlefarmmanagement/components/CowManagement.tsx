// src/components/cows/CowManagement.tsx
import { useState, useEffect, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { CowService } from '../lib/cowService';
import type { Cow } from '../types';
import AddEditCowModal from './cows/AddEditCowModal';
import SkeletonLoader from './ui/SkeletonLoader';
import CattleNavbar from "./Navbar";

const CowManagement = () => {
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'Active' as Cow['status'],
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadCows();
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [search, filters]);

  const loadCows = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await CowService.getCows({
        status: filters.status,
        search: search.trim()
      });
      setCows(data);
    } catch (error) {
      console.error('Error loading cows:', error);
      setError('Failed to load cows. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCow = async (cowData: Omit<Cow, 'id'>) => {
    try {
      setLoading(true);
      await CowService.saveCow(cowData);
      setShowAddModal(false);
      await loadCows();
    } catch (error) {
      console.error('Error saving cow:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string | undefined) => {
    if (!dob) return 'Unknown';
    const years = new Date().getFullYear() - new Date(dob).getFullYear();
    return `${years} years`;
  };

  const getStatusColor = (status: Cow['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Sold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Deceased':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Memoize cow rows
  const cowRows = useMemo(() => cows.map((cow) => (
    <tr 
      key={cow.id}
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => window.location.href = `/cows/${cow.id}`}
    >
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900  dark:text-white">
              {cow.tag_number}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {cow.gender}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {calculateAge(cow.date_of_birth)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(cow.status)}`}>
          {cow.status}
        </span>
      </td>
    </tr>
  )), [cows]);

  return (
    <>
      <CattleNavbar />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cow Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Cow
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4 dark:hover:black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4  dark:hover:black">
            <div>
              <label className="block text-sm font-medium text-gray-700  dark:text-black">Search</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && loadCows()}
                  placeholder="Search by ID..."
                  className="block w-full rounded-md border-gray-300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700  dark:text-black">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(f => ({ ...f, status: e.target.value as Cow['status'] }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="Active">Active</option>
                <option value="Sold">Sold</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Cows List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8">
              <SkeletonLoader height="h-8" width="w-1/2" className="mb-4" />
              <SkeletonLoader height="h-12" count={6} />
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                ID/Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {cowRows}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <AddEditCowModal
            onClose={() => setShowAddModal(false)}
            onSave={handleSaveCow}
          />
        )}
      </div>
    </>
  );
};

export default CowManagement;