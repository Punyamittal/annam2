// src/components/cows/AddEditCowModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import type { Cow } from '../../types';

interface Props {
  cow?: Partial<Cow>;
  onClose: () => void;
  onSave: (cow: Omit<Cow, 'id'>) => Promise<void>;
}

const AddEditCowModal = ({ cow, onClose, onSave }: Props) => {
  const [form, setForm] = useState({
    tag_number: cow?.tag_number || '',
    gender: cow?.gender || 'Female',
    date_of_birth: cow?.date_of_birth || '',
    color: cow?.color || '',
    markings: cow?.markings || '',
    age_category: cow?.age_category || 'Calf',
    status: 'Active' as Cow['status']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      await onSave({
        ...form,
        name: '',
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to save cow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md bg-white shadow-lg rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{cow ? 'Edit Cow' : 'Add New Cow'}</h3>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-black">
              Tag Number*
            </label>
            <input
              type="text"
              value={form.tag_number}
              onChange={e => setForm(f => ({ ...f, tag_number: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-black">
              Gender*
            </label>
            <select
              value={form.gender}
              onChange={e => setForm(f => ({ ...f, gender: e.target.value as Cow['gender'] }))}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-black">
              Age Category*
            </label>
            <select
              value={form.age_category}
              onChange={e => setForm(f => ({ ...f, age_category: e.target.value as Cow['age_category'] }))}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            >
              <option value="Calf">Calf</option>
              <option value="Adult">Adult</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-black">
              Date of Birth
            </label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-black">
              Color*
            </label>
            <input
              type="text"
              value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-black">
              Markings & Description
            </label>
            <textarea
              value={form.markings}
              onChange={e => setForm(f => ({ ...f, markings: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300"
              rows={3}
              placeholder="Describe any distinctive markings or features"
            />
          </div>

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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : cow ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCowModal;