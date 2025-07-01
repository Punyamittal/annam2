import React, { useState, useEffect } from 'react';
import EnvironmentalMap from '../components/map/EnvironmentalMap';
import LocationSelector from '../components/common/LocationSelector';
import RiskSummary from '../components/dashboard/RiskSummary';
import { getEnvironmentalData, EnvironmentalData } from '../services/api';
import { reverseGeocode } from '../services/geocoding';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface PollutionPoint {
  lat: number;
  lng: number;
  intensity: number;
}

const MapView: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [pollutionPoints, setPollutionPoints] = useState<PollutionPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'zones' | 'heatmap'>('zones');
  
  // Mock saved locations for demo
  const savedLocations: Location[] = [
    { id: '1', name: 'Home', lat: 40.7128, lng: -74.0060 },
    { id: '2', name: 'Work', lat: 40.7484, lng: -73.9857 },
    { id: '3', name: 'Farm', lat: 40.6782, lng: -73.9442 }
  ];
  
  useEffect(() => {
    if (currentLocation) {
      fetchEnvironmentalData(currentLocation.lat, currentLocation.lng);
      generatePollutionHeatMapData(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);
  
  const fetchEnvironmentalData = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the API
      // For demo purposes, we'll use mock data
      // const data = await getEnvironmentalData(lat, lng);
      
      // Mock data
      const mockData: EnvironmentalData = {
        airQuality: {
          aqi: 42,
          pollutants: {
            pm25: 12.3,
            pm10: 25.7,
            o3: 35.2,
            no2: 15.8,
            so2: 5.2,
            co: 0.8
          },
          category: 'Good'
        },
        weather: {
          temperature: 22.5,
          humidity: 65,
          windSpeed: 8.2,
          windDirection: 'NE',
          precipitation: 0,
          uvIndex: 6
        },
        risks: {
          level: 'low',
          summary: 'Environmental conditions are favorable today with good air quality and moderate UV levels.',
          recommendations: [
            'It\'s a good day for outdoor activities',
            'Apply sunscreen if spending extended time outdoors',
            'Regular watering recommended for crops'
          ]
        },
        pollutionZones: [
          {
            id: 'zone1',
            lat: lat + 0.01,
            lng: lng + 0.01,
            radius: 1000,
            level: 'low',
            description: 'Low pollution area with good air quality'
          },
          {
            id: 'zone2',
            lat: lat - 0.02,
            lng: lng + 0.02,
            radius: 1500,
            level: 'medium',
            description: 'Moderate pollution due to traffic congestion'
          },
          {
            id: 'zone3',
            lat: lat + 0.03,
            lng: lng - 0.01,
            radius: 800,
            level: 'high',
            description: 'High pollution area due to industrial activity'
          }
        ]
      };
      
      setEnvironmentalData(mockData);
    } catch (err) {
      setError('Failed to fetch environmental data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock heat map data points around the selected location
  const generatePollutionHeatMapData = (lat: number, lng: number) => {
    const points: PollutionPoint[] = [];
    
    // Generate 200 random points around the location with varying intensities
    for (let i = 0; i < 200; i++) {
      // Random offset within ~5km
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      
      // Distance from center affects intensity (closer = higher pollution)
      const distance = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset);
      
      // Create a pattern: higher pollution in certain directions
      let intensity = 0;
      
      if (latOffset > 0 && lngOffset > 0) {
        // Northeast: industrial area (high pollution)
        intensity = 0.8 - distance * 5 + Math.random() * 0.2;
      } else if (latOffset < 0 && lngOffset < 0) {
        // Southwest: rural area (low pollution)
        intensity = 0.3 - distance * 3 + Math.random() * 0.1;
      } else {
        // Other areas: moderate pollution
        intensity = 0.5 - distance * 4 + Math.random() * 0.15;
      }
      
      // Ensure intensity is between 0 and 1
      intensity = Math.max(0, Math.min(1, intensity));
      
      points.push({
        lat: lat + latOffset,
        lng: lng + lngOffset,
        intensity
      });
    }
    
    setPollutionPoints(points);
  };
  
  const handleLocationSelect = (location: Location) => {
    setCurrentLocation(location);
  };
  
  const handleMapLocationSelect = async (lat: number, lng: number) => {
    try {
      // Use our reverse geocoding service to get a location name
      const locationName = await reverseGeocode(lat, lng);
      
      const newLocation: Location = {
        id: `custom-${Date.now()}`,
        name: locationName,
        lat,
        lng
      };
      
      setCurrentLocation(newLocation);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Fallback to coordinates if reverse geocoding fails
      const newLocation: Location = {
        id: `custom-${Date.now()}`,
        name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng
      };
      
      setCurrentLocation(newLocation);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Environmental Map</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1">
          <LocationSelector 
            savedLocations={savedLocations}
            onLocationSelect={handleLocationSelect}
            currentLocation={currentLocation || undefined}
          />
          
          {environmentalData && (
            <div className="mt-6">
              <RiskSummary 
                riskLevel={environmentalData.risks.level}
                summary={environmentalData.risks.summary}
                recommendations={environmentalData.risks.recommendations}
              />
            </div>
          )}

          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium mb-2">Map Layers</h3>
            <div className="space-y-2">
              <button
                className={`w-full p-2 rounded-lg border ${
                  mapMode === 'zones' ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setMapMode('zones')}
              >
                Pollution Zones
              </button>
              <button
                className={`w-full p-2 rounded-lg border ${
                  mapMode === 'heatmap' ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setMapMode('heatmap')}
              >
                Pollution Heat Map
              </button>
            </div>
          </div>
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
              <p className="text-gray-600">Choose a location from the sidebar or use your current location to view the environmental map.</p>
            </div>
          ) : loading ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
              <p>Loading map data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
              <p>{error}</p>
              <button 
                className="mt-2 text-sm underline"
                onClick={() => currentLocation && fetchEnvironmentalData(currentLocation.lat, currentLocation.lng)}
              >
                Try again
              </button>
            </div>
          ) : environmentalData ? (
            <div>
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-lg font-medium mb-2">Environmental Map for {currentLocation.name}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  This map shows pollution zones and environmental risk areas. Click anywhere on the map to select a new location.
                </p>
                
                <EnvironmentalMap 
                  center={[currentLocation.lat, currentLocation.lng]}
                  zoom={13}
                  pollutionZones={environmentalData.pollutionZones}
                  pollutionPoints={pollutionPoints}
                  onLocationSelect={handleMapLocationSelect}
                />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-medium mb-2">Map Legend</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                    <span>Low Risk Zone</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Medium Risk Zone</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
                    <span>High Risk Zone</span>
                  </div>
                  {mapMode === 'heatmap' && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="h-4 w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded"></div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs">Low Pollution</span>
                        <span className="text-xs">High Pollution</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MapView;
