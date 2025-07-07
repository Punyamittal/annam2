import React, { useState, useEffect } from 'react';
import LocationSelector from '../components/common/LocationSelector';
import TrendChart from '../components/historical/TrendChart';
import { getHistoricalData, HistoricalData as HistoricalDataType } from '../services/api';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const HistoricalData: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataType | null>(null);
  const [timeRange, setTimeRange] = useState<number>(7); // days
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock saved locations for demo
  const savedLocations: Location[] = [
    { id: '1', name: 'Home', lat: 40.7128, lng: -74.0060 },
    { id: '2', name: 'Work', lat: 40.7484, lng: -73.9857 },
    { id: '3', name: 'Farm', lat: 40.6782, lng: -73.9442 }
  ];
  
  useEffect(() => {
    if (currentLocation) {
      fetchHistoricalData(currentLocation.lat, currentLocation.lng, timeRange);
    }
  }, [currentLocation, timeRange]);
  
  const fetchHistoricalData = async (lat: number, lng: number, days: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the API
      // For demo purposes, we'll use mock data
      // const data = await getHistoricalData(lat, lng, days);
      
      // Generate mock historical data
      const mockData: HistoricalDataType = {
        airQuality: generateMockTimeSeriesData(days, 30, 60),
        temperature: generateMockTimeSeriesData(days, 15, 30),
        precipitation: generateMockTimeSeriesData(days, 0, 15),
        uvIndex: generateMockTimeSeriesData(days, 1, 10)
      };
      
      setHistoricalData(mockData);
    } catch (err) {
      setError('Failed to fetch historical data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockTimeSeriesData = (days: number, min: number, max: number) => {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat((Math.random() * (max - min) + min).toFixed(1))
      });
    }
    
    return data;
  };
  
  const handleLocationSelect = (location: Location) => {
    setCurrentLocation(location);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Historical Environmental Data</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1">
          <LocationSelector 
            savedLocations={savedLocations}
            onLocationSelect={handleLocationSelect}
            currentLocation={currentLocation || undefined}
          />
          
          {currentLocation && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Time Range</h3>
              <div className="space-y-2">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    className={`w-full p-2 rounded-lg border ${
                      timeRange === days ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setTimeRange(days)}
                  >
                    Last {days} days
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          {!currentLocation ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-xl font-medium mb-2">Select a Location</h2>
              <p className="text-gray-600">Choose a location from the sidebar or use your current location to view historical environmental data.</p>
            </div>
          ) : loading ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
              <p>Loading historical data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
              <p>{error}</p>
              <button 
                className="mt-2 text-sm underline"
                onClick={() => currentLocation && fetchHistoricalData(currentLocation.lat, currentLocation.lng, timeRange)}
              >
                Try again
              </button>
            </div>
          ) : historicalData ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-4">Historical Data for {currentLocation.name} (Last {timeRange} Days)</h2>
                <p className="text-gray-600 mb-4">
                  Track environmental trends over time to make informed decisions about outdoor activities and agricultural planning.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrendChart 
                  title="Air Quality Index"
                  data={historicalData.airQuality}
                  unit="AQI"
                  color="#10b981"
                />
                
                <TrendChart 
                  title="Temperature"
                  data={historicalData.temperature}
                  unit="°C"
                  color="#3b82f6"
                />
                
                <TrendChart 
                  title="Precipitation"
                  data={historicalData.precipitation}
                  unit="mm"
                  color="#6366f1"
                />
                
                <TrendChart 
                  title="UV Index"
                  data={historicalData.uvIndex}
                  unit=""
                  color="#f59e0b"
                />
              </div>
              
              <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-medium mb-2">Analysis Summary</h3>
                <p className="text-gray-700">
                  Based on the historical data, environmental conditions in this area have been relatively stable over the past {timeRange} days. 
                  Air quality has shown slight improvement, while temperature has increased marginally. 
                  Precipitation levels have been below average, which may affect agricultural activities.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;
