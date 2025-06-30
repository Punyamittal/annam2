import React, { useState } from 'react';
import Layout from '../components/Layout';
import HistoricalTrends from '../components/HistoricalTrends';
import UserProfileSelector from '../components/UserProfileSelector';
import ChatButton from '../components/ChatButton';
import { useAuth } from '../contexts/AuthContext';

export default function TrendsPage() {
  const [userProfile, setUserProfile] = useState('citizen');
  const [location, setLocation] = useState('New York City');
  const [dataType, setDataType] = useState<'air' | 'temperature' | 'rainfall'>('air');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const { user } = useAuth();

  const handleProfileChange = (profile: string) => {
    setUserProfile(profile);
  };

  return (
    <Layout title="GreenGuardian - Environmental Trends">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-700">GreenGuardian</h1>
        <p className="text-gray-600">Historical Environmental Trends</p>
        {user && (
          <p className="mt-2 text-sm text-green-600">
            Welcome back, {user.name}!
          </p>
        )}
      </header>

      <UserProfileSelector onProfileChange={handleProfileChange} initialProfile={userProfile} />

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter a location..."
            />
          </div>
          
          <div>
            <label htmlFor="dataType" className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
            <select
              id="dataType"
              value={dataType}
              onChange={(e) => setDataType(e.target.value as 'air' | 'temperature' | 'rainfall')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="air">Air Quality</option>
              <option value="temperature">Temperature</option>
              <option value="rainfall">Rainfall</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoricalTrends 
          location={location} 
          dataType={dataType} 
          timeRange={timeRange} 
        />
        
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Trend Analysis</h2>
          
          {userProfile === 'farmer' && (
            <div className="space-y-4">
              <p>Based on the historical data for {location}, here are the key agricultural insights:</p>
              
              <div className="p-3 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800">Growing Season Trends</h3>
                <p className="mt-1 text-sm">The growing season has extended by approximately 5 days compared to historical averages, with earlier last frost dates.</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-md">
                <h3 className="font-medium text-yellow-800">Rainfall Patterns</h3>
                <p className="mt-1 text-sm">Precipitation has become more variable, with longer dry periods followed by intense rainfall events. Consider improved water management systems.</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md">
                <h3 className="font-medium text-green-800">Crop Recommendations</h3>
                <p className="mt-1 text-sm">Based on changing conditions, drought-resistant varieties of traditional crops may perform better. Consider diversifying crop selection.</p>
              </div>
            </div>
          )}
          
          {userProfile === 'urban_planner' && (
            <div className="space-y-4">
              <p>Based on the historical data for {location}, here are the key urban planning insights:</p>
              
              <div className="p-3 bg-red-50 rounded-md">
                <h3 className="font-medium text-red-800">Heat Island Effect</h3>
                <p className="mt-1 text-sm">Urban temperatures are increasing at a rate 1.5x faster than surrounding rural areas, with downtown showing the most significant warming.</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800">Flood Risk Areas</h3>
                <p className="mt-1 text-sm">Eastern neighborhoods have experienced a 30% increase in flood events over the past decade, suggesting inadequate stormwater infrastructure.</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-md">
                <h3 className="font-medium text-purple-800">Air Quality Patterns</h3>
                <p className="mt-1 text-sm">PM2.5 levels show strong correlation with traffic patterns. Consider expanded public transportation in high-congestion corridors.</p>
              </div>
            </div>
          )}
          
          {userProfile === 'ngo' && (
            <div className="space-y-4">
              <p>Based on the historical data for {location}, here are the key environmental justice insights:</p>
              
              <div className="p-3 bg-red-50 rounded-md">
                <h3 className="font-medium text-red-800">Pollution Inequality</h3>
                <p className="mt-1 text-sm">Lower-income neighborhoods experience 3.2x higher average air pollution levels than affluent areas, despite having fewer vehicles per capita.</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md">
                <h3 className="font-medium text-green-800">Green Space Access</h3>
                <p className="mt-1 text-sm">Only 15% of residents in southern districts have access to green space within walking distance, compared to 72% in northern districts.</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-md">
                <h3 className="font-medium text-yellow-800">Climate Vulnerability</h3>
                <p className="mt-1 text-sm">Elderly populations in underserved communities face 2.5x higher risk during extreme heat events due to limited cooling infrastructure.</p>
              </div>
            </div>
          )}
          
          {userProfile === 'citizen' && (
            <div className="space-y-4">
              <p>Based on the historical data for {location}, here are the key insights for residents:</p>
              
              <div className="p-3 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800">Seasonal Patterns</h3>
                <p className="mt-1 text-sm">Air quality typically worsens during summer months, with July and August showing the highest pollution levels.</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-md">
                <h3 className="font-medium text-yellow-800">Health Implications</h3>
                <p className="mt-1 text-sm">Pollen seasons are starting approximately 10 days earlier than a decade ago, affecting allergy sufferers for longer periods.</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md">
                <h3 className="font-medium text-green-800">Recommendations</h3>
                <p className="mt-1 text-sm">Morning hours (5-8am) consistently show the best air quality for outdoor exercise throughout the year.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Only the chat button, no other chat components */}
      <ChatButton userProfile={userProfile} location={location} />
    </Layout>
  );
}
