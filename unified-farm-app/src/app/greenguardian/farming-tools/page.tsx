"use client";

import React, { useState } from 'react';
import LocationSelector from '../../../greenguardian/components/common/LocationSelector';
import CropCalendar from '../../../greenguardian/components/farming/CropCalendar';
import PlantHealthAnalyzer from '../../../greenguardian/components/plant/PlantHealthAnalyzer';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const GreenGuardianFarmingToolsPage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'health'>('calendar');
  
  // Mock saved locations for demo
  const savedLocations: Location[] = [
    { id: '1', name: 'Home', lat: 40.7128, lng: -74.0060 },
    { id: '2', name: 'Work', lat: 40.7484, lng: -73.9857 },
    { id: '3', name: 'Farm', lat: 40.6782, lng: -73.9442 }
  ];
  
  const handleLocationSelect = (location: Location) => {
    setCurrentLocation(location);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Farming Tools</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1">
          <LocationSelector 
            savedLocations={savedLocations}
            onLocationSelect={handleLocationSelect}
            currentLocation={currentLocation || undefined}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium mb-2">Tools</h3>
            <div className="space-y-2">
              <button
                className={`w-full p-2 rounded-lg border ${
                  activeTab === 'calendar' ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('calendar')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Crop Calendar</span>
                </div>
              </button>
              <button
                className={`w-full p-2 rounded-lg border ${
                  activeTab === 'health' ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('health')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Plant Health Analyzer</span>
                </div>
              </button>
            </div>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium mb-2">Current Weather</h3>
            {currentLocation ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <p className="text-2xl font-semibold">72°F</p>
                      <p className="text-sm text-gray-500">Sunny</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Humidity</span>
                    <span>65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Wind</span>
                    <span>8 mph NE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Precipitation</span>
                    <span>0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Soil Moisture</span>
                    <span>Medium</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Select a location to view weather data</p>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          {activeTab === 'calendar' && (
            <CropCalendar 
              location={currentLocation || undefined}
              currentMonth={new Date().getMonth() + 1}
            />
          )}
          
          {activeTab === 'health' && (
            <PlantHealthAnalyzer />
          )}
        </div>
      </div>
    </div>
  );
};

export default GreenGuardianFarmingToolsPage;