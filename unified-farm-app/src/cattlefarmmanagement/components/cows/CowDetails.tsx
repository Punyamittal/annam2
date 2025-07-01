// src/components/cows/CowDetails.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// import { useRouter } from 'next/router'; // Removed unused import
import { format } from 'date-fns';
import { Edit, Trash2, Plus } from 'lucide-react';
import { CowService } from '../../lib/cowService';
import type { Cow, HealthRecord, BreedingRecord } from '../../types';
import AddEditCowModal from './AddEditCowModal';
import AddRecordModal from './AddRecordModal';

export default function CowDetails() {
  const params = useParams();
  const id = params.id as string; // Cast id to string
  const router = useRouter(); // Keep useRouter for navigation
  const [cow, setCow] = useState<Cow | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addRecordModal, setAddRecordModal] = useState<'health' | 'breeding' | null>(null);

  useEffect(() => {
    if (id) loadCowData();
  }, [id]); // Add id to dependency array

  const loadCowData = async () => {
    try {
      setLoading(true);
      setError('');
      const cows = await CowService.getCows();
      const currentCow = cows.find(c => c.id === id);
      if (!currentCow) throw new Error('Cow not found');
      
      setCow(currentCow);
      const healthData = await CowService.getHealthRecords(id);
      const breedingData = await CowService.getBreedingRecords(id);
      
      setHealthRecords(healthData);
      setBreedingRecords(breedingData);
    } catch (error) {
      console.error('Error loading cow details:', error);
      setError('Failed to load cow details');
    } finally {
      setLoading(false);
    }
  };

  // In CowDetails.tsx

// Add a helper function to safely format dates
const formatDate = (date: string | undefined) => {
  if (!date) return 'Not set';
  try {
    return format(new Date(date), 'dd MMM yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};


  const handleSave = async (updatedCow: Omit<Cow, 'id'>) => {
    try {
      if (!id) return;
      await CowService.saveCow({ ...updatedCow, id: id });
      await loadCowData();
      setEditModal(false);
    } catch (error) {
      setError('Failed to update cow');
      console.error(error);
    }
  };

  const handleSaveRecord = async (record: Omit<HealthRecord | BreedingRecord, 'id'>) => {
    try {
      if (addRecordModal === 'health') {
        await CowService.saveHealthRecord(record as Omit<HealthRecord, 'id'>);
      } else {
        await CowService.saveBreedingRecord(record as Omit<BreedingRecord, 'id'>);
      }
      await loadCowData();
      setAddRecordModal(null);
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await CowService.deleteCow(id);
      router.push('/cattlefarmmanagement/cows');
    } catch (error) {
      setError('Failed to delete cow');
      console.error(error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  if (!cow) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-yellow-700">Cow not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{cow.tag_number}</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setEditModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cow Details Card */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500 dark:text-black-500">Tag Number</span>
              <p className="font-medium dark:text-black">{cow.tag_number}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-black-500">Gender</span>
              <p className="font-medium dark:text-black">{cow.gender}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-black-500">Date of Birth</span>
                <p className="font-medium dark:text-black">
                  {cow.date_of_birth ? formatDate(cow.date_of_birth) : 'Not set'}
                </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-black-500">Color</span>
              <p className="font-medium dark:text-black">{cow.color}</p>
            </div>
            {/* Add Markings field */}
            <div>
              <span className="text-sm text-gray-500 dark:text-black-500">Markings</span>
              <p className="font-medium dark:text-black">{cow.markings || 'No markings recorded'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-black-500">Status</span>
              <p className="font-medium dark:text-black">{cow.status}</p>
            </div>
          </div>
        </div>

        {/* Health Records Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-black">Health Records</h2>
              <button
                onClick={() => setAddRecordModal('health')}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </button>
            </div>
            {/* Health Records List */}
            {healthRecords.map(record => (
              <div key={record.id} className="border-t py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium dark:text-black">{format(new Date(record.date), 'dd MMM yyyy')}</p>
                    <p className="text-sm text-gray-600 dark:text-black">{record.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-black">{record.record_type}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Breeding Records Section */}
          {cow.age_category === 'Adult' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold dark:text-black">Breeding Records</h2>
                <button
                  onClick={() => setAddRecordModal('breeding')}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </button>
              </div>
              {breedingRecords.map(record => (
                <div key={record.id} className="border-t py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium dark:text-black">{format(new Date(record.date), 'dd MMM yyyy')}</p>
                      <p className="text-sm text-gray-600 dark:text-black">{record.notes}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-black">{record.record_type}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-center text-gray-500 dark:text-black py-8">
                <p className='dark:text-black text-gray-500'>Breeding records are only available for adult cattle</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editModal && (
        <AddEditCowModal
          cow={cow || undefined}
          onClose={() => setEditModal(false)}
          onSave={handleSave}
        />
      )}

      {addRecordModal && (
        <AddRecordModal
          type={addRecordModal as 'health' | 'breeding'}
          cowId={id}
          onClose={() => setAddRecordModal(null)}
          onSave={handleSaveRecord}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Cow</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 dark:text-black">
                  Are you sure you want to delete this cow? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}