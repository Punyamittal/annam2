import React, { useState, useEffect } from 'react';
import { MapPin, Info, RefreshCw, AlertCircle, Droplets, Leaf, Thermometer, Zap } from 'lucide-react';
import soilService, { SoilParameters } from '../services/soilService';

interface SoilInfoProps {
  location: string;
  onSoilDataChange: (soilData: SoilParameters) => void;
  isVisible?: boolean;
}

const SoilInfo: React.FC<SoilInfoProps> = ({ location, onSoilDataChange, isVisible = true }) => {
  const [soilData, setSoilData] = useState<SoilParameters | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSoilData = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const data = await soilService.getSoilDataFromLocation(location);
      setSoilData(data);
      onSoilDataChange(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch soil data');
      console.error('Error fetching soil data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location && isVisible) {
      fetchSoilData();
    }
  }, [location, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 rounded-t-xl border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Soil Analysis</h3>
              <p className="text-sm text-gray-600">Location: {location}</p>
            </div>
          </div>
          <button
            onClick={fetchSoilData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Analyzing soil data...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
          </div>
        )}

        {error && (
          <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium">Unable to fetch soil data</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button 
                onClick={fetchSoilData}
                className="text-sm text-red-600 hover:text-red-700 underline mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {soilData && !loading && (
          <div className="space-y-6">
            {/* Soil Type Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <Leaf className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-800">Soil Classification</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{soilData.soilType}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {soilService.getSoilTypeDescription(soilData.soilType)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Texture</p>
                  <p className="text-lg font-semibold text-gray-800 mb-1">{soilData.soilTexture}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {soilService.getSoilTextureDescription(soilData.soilTexture)}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Parameters */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span>Key Soil Parameters</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* pH Level */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">pH Level</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">
                      {soilData.soilPh.toFixed(1)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${(soilData.soilPh / 14) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Acidic</span>
                    <span>Neutral</span>
                    <span>Alkaline</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mt-2">
                    {soilData.soilPh < 6.5 ? 'Acidic soil - may need lime application' : 
                     soilData.soilPh > 7.5 ? 'Alkaline soil - good for most crops' : 
                     'Neutral pH - optimal for most plants'}
                  </p>
                </div>

                {/* Nitrogen */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Nitrogen</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">
                      {soilData.soilNitrogen} mg/kg
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((soilData.soilNitrogen / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mt-2">
                    {soilData.soilNitrogen < 30 ? 'Low nitrogen - consider fertilization' : 
                     soilData.soilNitrogen > 70 ? 'High nitrogen - good for leafy growth' : 
                     'Moderate nitrogen - suitable for most crops'}
                  </p>
                </div>

                {/* Organic Matter */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">Organic Matter</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">
                      {soilData.soilOrganicMatter.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-yellow-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((soilData.soilOrganicMatter / 5) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mt-2">
                    {soilData.soilOrganicMatter < 1.5 ? 'Low organic matter - consider compost' : 
                     soilData.soilOrganicMatter > 2.5 ? 'High organic matter - excellent soil health' : 
                     'Moderate organic matter - good soil structure'}
                  </p>
                </div>

                {/* Drainage */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Drainage</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 text-right">
                      {soilData.drainageClass}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        soilData.drainageClass.includes('Well') ? 'bg-green-500' :
                        soilData.drainageClass.includes('Moderately') ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-xs text-gray-600">
                        {soilData.drainageClass.includes('Well') ? 'Good drainage' :
                         soilData.drainageClass.includes('Moderately') ? 'Moderate drainage' :
                         'Poor drainage - may need improvement'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mt-2">
                    {soilData.drainageClass.includes('Well') ? 'Ideal for most crops' :
                     soilData.drainageClass.includes('Moderately') ? 'Suitable with proper management' :
                     'May require drainage improvement for optimal growth'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Info className="w-5 h-5 text-green-600" />
                <span>Growing Recommendations</span>
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                {soilData.soilPh < 6.5 && (
                  <p>• Consider adding lime to raise pH for better nutrient availability</p>
                )}
                {soilData.soilNitrogen < 30 && (
                  <p>• Apply nitrogen-rich fertilizers to support plant growth</p>
                )}
                {soilData.soilOrganicMatter < 1.5 && (
                  <p>• Add organic matter through compost or cover crops</p>
                )}
                {soilData.drainageClass.includes('Poorly') && (
                  <p>• Consider raised beds or drainage improvements</p>
                )}
                {soilData.soilPh >= 6.5 && soilData.soilNitrogen >= 30 && soilData.soilOrganicMatter >= 1.5 && (
                  <p>• Excellent soil conditions for most crops</p>
                )}
              </div>
            </div>

            {lastUpdated && (
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilInfo; 