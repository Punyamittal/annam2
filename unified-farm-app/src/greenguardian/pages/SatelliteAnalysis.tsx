import React, { useState } from 'react';
import LocationSelector from '../components/common/LocationSelector';
import SatelliteImagery from '../components/satellite/SatelliteImagery';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const SatelliteAnalysis: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  
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
      <h1 className="text-2xl font-bold mb-6">Satellite Imagery Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1">
          <LocationSelector 
            savedLocations={savedLocations}
            onLocationSelect={handleLocationSelect}
            currentLocation={currentLocation || undefined}
          />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium mb-2">About Satellite Analysis</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our satellite imagery analysis uses computer vision to detect changes in:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Vegetation health and deforestation</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Water body changes and quality</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Urban development and land use</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Select a location to view satellite imagery analysis and track environmental changes over time.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <SatelliteImagery 
            location={currentLocation || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default SatelliteAnalysis;
