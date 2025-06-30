import React, { useState, useEffect } from 'react';

interface RiskData {
  overallRisk: 'low' | 'medium' | 'high';
  airQuality: number;
  waterQuality: number;
  uvIndex: number;
  pollenCount: number;
  lastUpdated: string;
}

interface RiskSummaryProps {
  userProfile: string;
  location: string;
}

const RiskSummary: React.FC<RiskSummaryProps> = ({ userProfile, location }) => {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset when location changes
    if (location) {
      setIsLoading(true);
      fetchRiskData(location);
    }
  }, [location]);

  const fetchRiskData = (locationStr: string) => {
    // Mock data - replace with actual API call
    const mockData: RiskData = {
      overallRisk: 'medium',
      airQuality: 72,
      waterQuality: 85,
      uvIndex: 6,
      pollenCount: 120,
      lastUpdated: new Date().toLocaleString()
    };

    // Simulate API fetch
    setTimeout(() => {
      setRiskData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityIndicator = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get profile-specific metrics
  const getProfileMetrics = () => {
    if (!riskData) return null;

    switch (userProfile) {
      case 'farmer':
        return (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800">Agricultural Metrics</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span className="block text-sm text-gray-600">Soil Moisture</span>
                <span className="text-lg font-medium">65%</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Growing Degree Days</span>
                <span className="text-lg font-medium">1250</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Frost Risk</span>
                <span className="text-lg font-medium">Low</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Pest Pressure</span>
                <span className="text-lg font-medium">Moderate</span>
              </div>
            </div>
          </div>
        );
      case 'urban_planner':
        return (
          <div className="mt-4 p-3 bg-purple-50 rounded-md">
            <h3 className="font-medium text-purple-800">Urban Planning Metrics</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span className="block text-sm text-gray-600">Heat Island Effect</span>
                <span className="text-lg font-medium">+3.2°C</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Green Space %</span>
                <span className="text-lg font-medium">18%</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Flood Risk</span>
                <span className="text-lg font-medium">Moderate</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Traffic Emissions</span>
                <span className="text-lg font-medium">High</span>
              </div>
            </div>
          </div>
        );
      case 'ngo':
        return (
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <h3 className="font-medium text-green-800">Environmental Justice Metrics</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span className="block text-sm text-gray-600">Vulnerable Population</span>
                <span className="text-lg font-medium">32%</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Access to Green Space</span>
                <span className="text-lg font-medium">Limited</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Industrial Proximity</span>
                <span className="text-lg font-medium">High</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Community Resilience</span>
                <span className="text-lg font-medium">Moderate</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="p-4 bg-white rounded-lg shadow-md">Loading risk data...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Environmental Risk Summary</h2>
        {location && <span className="text-sm text-gray-500">for {location}</span>}
      </div>
      
      {riskData && (
        <>
          <div className={`p-3 rounded-md mb-4 ${getRiskColor(riskData.overallRisk)}`}>
            <span className="font-bold">Overall Risk: {riskData.overallRisk.toUpperCase()}</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Air Quality</span>
                <span>{riskData.airQuality}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getQualityIndicator(riskData.airQuality)}`} 
                  style={{ width: `${riskData.airQuality}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Water Quality</span>
                <span>{riskData.waterQuality}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getQualityIndicator(riskData.waterQuality)}`} 
                  style={{ width: `${riskData.waterQuality}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm text-gray-600">UV Index</span>
                <span className="text-lg font-medium">{riskData.uvIndex}/10</span>
              </div>
              <div>
                <span className="block text-sm text-gray-600">Pollen Count</span>
                <span className="text-lg font-medium">{riskData.pollenCount} ppm</span>
              </div>
            </div>
          </div>
          
          {/* Profile-specific metrics */}
          {getProfileMetrics()}
          
          <div className="mt-4 text-xs text-gray-500">
            Last updated: {riskData.lastUpdated}
          </div>
        </>
      )}
    </div>
  );
};

export default RiskSummary;
