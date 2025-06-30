import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/login');
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to logout' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // In a real app, you would update the user profile here
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="GreenGuardian - Profile">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="GreenGuardian - Profile">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Your Profile</h1>

        {message.text && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                {name.charAt(0) || 'U'}
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="text-gray-600">{email}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-md text-white ${
                    isSaving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Account Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password regularly for security</p>
                </div>
                <button className="text-green-600 hover:text-green-800">Change</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notification Preferences</p>
                  <p className="text-sm text-gray-500">Manage your email and app notifications</p>
                </div>
                <button className="text-green-600 hover:text-green-800">Manage</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <button className="text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
