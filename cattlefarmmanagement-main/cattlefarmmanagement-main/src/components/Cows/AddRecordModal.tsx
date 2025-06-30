// src/components/cows/AddRecordModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import type { HealthRecord, BreedingRecord } from '../../types';

interface Props {
  type: 'health' | 'breeding';
  cowId: string;
  onClose: () => void;
  onSave: (record: Omit<HealthRecord | BreedingRecord, 'id'>) => Promise<void>;
}

// Fix form state typing
interface HealthFormState {
  date: string;
  record_type: HealthRecord['record_type'];
  description: string;
  medicines: string;
  vet_name: string;
  next_followup: string;
}

interface BreedingFormState {
  date: string;
  record_type: BreedingRecord['record_type']; 
  semen_source: string;
  technician_name: string;
  pregnancy_status: BreedingRecord['pregnancy_status'];
  pregnancy_check_date: string;
  notes: string;
  calving_date?: string;
}

const AddRecordModal = ({ type, cowId, onClose, onSave }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fix: Use proper type for form state
  const [form, setForm] = useState<HealthFormState | BreedingFormState>(
    type === 'health' 
      ? {
          date: '',
          record_type: 'Checkup',
          description: '',
          medicines: '',
          vet_name: '',
          next_followup: ''
        }
      : {
          date: '',
          record_type: 'AI',
          semen_source:'',
          technician_name:'',
          pregnancy_status: 'Unknown',
          pregnancy_check_date: '',
          notes: '',
          calving_date: ''
        }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create base record
      const baseRecord = {
        ...form,
        cow_id: cowId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add specific fields for breeding records
      const record = type === 'breeding' 
        ? {
            ...baseRecord,
            pregnancy_status: (form as BreedingFormState).pregnancy_status,
            // Only include calving_date if pregnancy is confirmed
            ...(form as BreedingFormState).pregnancy_status === 'Confirmed' && {
              calving_date: (form as BreedingFormState).calving_date
            }
          }
        : baseRecord;

      console.log('Saving record:', record);
      await onSave(record);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md bg-white shadow-lg rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Add {type === 'health' ? 'Health' : 'Breeding'} Record
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-black">Date*</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-black">Record Type*</label>
            <select
              required
              value={form.record_type}
              onChange={e => setForm(f => ({ ...f, record_type: e.target.value as any }))}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              {type === 'health' ? (
                <>
                  <option value="Checkup">Checkup</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Treatment">Treatment</option>
                </>
              ) : (
                <>
                  <option value="AI">AI</option>
                  <option value="Natural">Natural</option>
                </>
              )}
            </select>
          </div>

          {type === 'health' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black">Description*</label>
                <textarea
                  required
                  value={'description' in form ? form.description : ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black">
                  Medicines (comma-separated)
                </label>
                <input
                  type="text"
                  value={'medicines' in form ? form.medicines : ''}
                  onChange={e => setForm(f => ({ ...f, medicines: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  placeholder="e.g. Medicine1, Medicine2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black">Veterinarian</label>
                <input
                  type="text"
                  value={'vet_name' in form ? form.vet_name : ''}
                  onChange={e => setForm(f => ({ ...f, vet_name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black">Next Followup</label>
                <input
                  type="date"
                  value={'next_followup' in form ? form.next_followup  : ''}
                  onChange={e => setForm(f => ({ ...f, next_followup: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black">Status</label>
                <select
                  value={'pregnancy_status' in form ? form.pregnancy_status : 'Unknown'}
                  onChange={e => setForm(f => ({ ...f, pregnancy_status: e.target.value as any }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Not Pregnant">Not Pregnant</option>
                </select>
              </div>

              {type === 'breeding' && 'pregnancy_status' in form && form.pregnancy_status === 'Confirmed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-black">
                Expected Calving Date*
              </label>
              <input
                type="date"
                required
                value={form.calving_date || ''}
                onChange={e => setForm(f => ({ ...f, calving_date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black">Notes</label>
                <textarea
                  value={'notes' in form ? form.notes : ''}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;