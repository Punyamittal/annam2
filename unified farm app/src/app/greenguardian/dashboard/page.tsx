"use client";

import React, { useState, useEffect } from 'react';
import EnvironmentalStats from '../../../greenguardian/components/dashboard/EnvironmentalStats';
import RiskSummary from '../../../greenguardian/components/dashboard/RiskSummary';
import LocationSelector from '../../../greenguardian/components/common/LocationSelector';
import EnvironmentalChat from '../../../greenguardian/components/chat/EnvironmentalChat';
import { getEnvironmentalData, EnvironmentalData } from '../../../greenguardian/services/api';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const GreenGuardianDashboardPage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
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
      fetchEnvironmentalData(currentLocation.lat, currentLocation.lng);
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
  
  const handleLocationSelect = (location: Location) => {
    setCurrentLocation(location);
  };
  
  // Icons for stats
  const airQualityIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
  
  const temperatureIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  const humidityIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
  
  const uvIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Environmental Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1">
          <LocationSelector 
            savedLocations={savedLocations}
            onLocationSelect={handleLocationSelect}
            currentLocation={currentLocation || undefined}
          />
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
              <p className="text-gray-600">Choose a location from the sidebar or use your current location to view environmental data.</p>
            </div>
          ) : loading ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
              <p>Loading environmental data...</p>
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
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium mb-4">Environmental Stats for {currentLocation.name}</h2>
                <EnvironmentalStats 
                  stats={[
                    {
                      label: 'Air Quality Index',
                      value: environmentalData.airQuality.aqi,
                      icon: airQualityIcon,
                      trend: 'down',
                      trendValue: '-3'
                    },
                    {
                      label: 'Temperature',
                      value: environmentalData.weather.temperature,
                      unit: '°C',
                      icon: temperatureIcon,
                      trend: 'up',
                      trendValue: '+1.5'
                    },
                    {
                      label: 'Humidity',
                      value: environmentalData.weather.humidity,
                      unit: '%',
                      icon: humidityIcon,
                      trend: 'stable',
                      trendValue: '0'
                    },
                    {
                      label: 'UV Index',
                      value: environmentalData.weather.uvIndex,
                      icon: uvIcon,
                      trend: 'up',
                      trendValue: '+1'
                    }
                  ]}
                />
              </div>
              
              <div>
                <h2 className="text-xl font-medium mb-4">Risk Assessment</h2>
                <RiskSummary 
                  riskLevel={environmentalData.risks.level}
                  summary={environmentalData.risks.summary}
                  recommendations={environmentalData.risks.recommendations}
                />
              </div>
              
              <div>
                <h2 className="text-xl font-medium mb-4">Environmental Assistant</h2>
                <EnvironmentalChat />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GreenGuardianDashboardPage;