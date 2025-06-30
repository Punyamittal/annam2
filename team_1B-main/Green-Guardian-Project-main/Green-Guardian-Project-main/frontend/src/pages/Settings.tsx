import React, { useState, useEffect } from 'react';

interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const Settings: React.FC = () => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([
    { id: '1', name: 'Home', lat: 40.7128, lng: -74.0060 },
    { id: '2', name: 'Work', lat: 40.7484, lng: -73.9857 },
    { id: '3', name: 'Farm', lat: 40.6782, lng: -73.9442 }
  ]);
  
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationLat, setNewLocationLat] = useState('');
  const [newLocationLng, setNewLocationLng] = useState('');
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    dailySummary: true,
    alerts: true
  });
  
  const [dataPreferences, setDataPreferences] = useState({
    airQuality: true,
    weather: true,
    pollutionZones: true,
    agriculturalData: false
  });
  
  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLocationName || !newLocationLat || !newLocationLng) {
      alert('Please fill in all fields');
      return;
    }
    
    const lat = parseFloat(newLocationLat);
    const lng = parseFloat(newLocationLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Latitude and longitude must be valid numbers');
      return;
    }
    
    const newLocation: SavedLocation = {
      id: Date.now().toString(),
      name: newLocationName,
      lat,
      lng
    };
    
    setSavedLocations([...savedLocations, newLocation]);
    
    // Reset form
    setNewLocationName('');
    setNewLocationLat('');
    setNewLocationLng('');
  };
  
  const handleDeleteLocation = (id: string) => {
    setSavedLocations(savedLocations.filter(location => location.id !== id));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications({
      ...notifications,
      [name]: checked
    });
  };
  
  const handleDataPreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDataPreferences({
      ...dataPreferences,
      [name]: checked
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Locations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Saved Locations</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Add New Location</h3>
            <form onSubmit={handleAddLocation} className="space-y-3">
              <div>
                <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  id="locationName"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="e.g. Home, Work, Farm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="locationLat" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="locationLat"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newLocationLat}
                    onChange={(e) => setNewLocationLat(e.target.value)}
                    placeholder="e.g. 40.7128"
                  />
                </div>
                
                <div>
                  <label htmlFor="locationLng" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="locationLng"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newLocationLng}
                    onChange={(e) => setNewLocationLng(e.target.value)}
                    placeholder="e.g. -74.0060"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Add Location
              </button>
            </form>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Your Saved Locations</h3>
            {savedLocations.length === 0 ? (
              <p className="text-gray-500">No saved locations yet.</p>
            ) : (
              <div className="space-y-2">
                {savedLocations.map(location => (
                  <div key={location.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-gray-500">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                    </div>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteLocation(location.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Notification & Data Preferences */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-4">Notification Preferences</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="text-gray-700">Email Notifications</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="email"
                    name="email"
                    checked={notifications.email}
                    onChange={handleNotificationChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="email"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notifications.email ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="push" className="text-gray-700">Push Notifications</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="push"
                    name="push"
                    checked={notifications.push}
                    onChange={handleNotificationChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="push"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notifications.push ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="dailySummary" className="text-gray-700">Daily Summary</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="dailySummary"
                    name="dailySummary"
                    checked={notifications.dailySummary}
                    onChange={handleNotificationChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="dailySummary"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notifications.dailySummary ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="alerts" className="text-gray-700">Risk Alerts</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="alerts"
                    name="alerts"
                    checked={notifications.alerts}
                    onChange={handleNotificationChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="alerts"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notifications.alerts ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-4">Data Preferences</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="airQuality" className="text-gray-700">Air Quality Data</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="airQuality"
                    name="airQuality"
                    checked={dataPreferences.airQuality}
                    onChange={handleDataPreferenceChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="airQuality"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      dataPreferences.airQuality ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="weather" className="text-gray-700">Weather Data</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="weather"
                    name="weather"
                    checked={dataPreferences.weather}
                    onChange={handleDataPreferenceChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="weather"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      dataPreferences.weather ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="pollutionZones" className="text-gray-700">Pollution Zones</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="pollutionZones"
                    name="pollutionZones"
                    checked={dataPreferences.pollutionZones}
                    onChange={handleDataPreferenceChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="pollutionZones"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      dataPreferences.pollutionZones ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="agriculturalData" className="text-gray-700">Agricultural Data</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="agriculturalData"
                    name="agriculturalData"
                    checked={dataPreferences.agriculturalData}
                    onChange={handleDataPreferenceChange}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="agriculturalData"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      dataPreferences.agriculturalData ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-4">Account</h2>
            <button className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors mb-3">
              Update Profile
            </button>
            <button className="w-full border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
