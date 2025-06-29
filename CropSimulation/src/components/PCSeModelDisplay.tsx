import React from 'react';
import { Activity, Leaf, Droplets, TrendingUp, BarChart3, Thermometer } from 'lucide-react';

interface PCSeModelDisplayProps {
  pcseData: {
    yieldPrediction: number;
    stressIndicators: {
      waterStress: number;
      nitrogenStress: number;
      temperatureStress: number;
    };
    leafAreaIndex: number;
    totalBiomass: number;
    developmentStage: number;
    rootDepth: number;
  };
  currentStage: { code: string; stage: any; modelState?: any } | null;
}

const PCSeModelDisplay: React.FC<PCSeModelDisplayProps> = ({ pcseData, currentStage }) => {
  const getStressColor = (stress: number) => {
    if (stress >= 0.8) return 'text-green-600 bg-green-100';
    if (stress >= 0.6) return 'text-yellow-600 bg-yellow-100';
    if (stress >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStressLabel = (stress: number) => {
    if (stress >= 0.8) return 'Optimal';
    if (stress >= 0.6) return 'Good';
    if (stress >= 0.4) return 'Moderate';
    return 'Stressed';
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">PCSE Model Status</h2>
      </div>

      {/* Stress Indicators */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Stress Indicators</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">Water</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{formatNumber(pcseData.stressIndicators.waterStress * 100, 0)}%</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStressColor(pcseData.stressIndicators.waterStress)}`}>
                {getStressLabel(pcseData.stressIndicators.waterStress)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">Nitrogen</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{formatNumber(pcseData.stressIndicators.nitrogenStress * 100, 0)}%</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStressColor(pcseData.stressIndicators.nitrogenStress)}`}>
                {getStressLabel(pcseData.stressIndicators.nitrogenStress)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-700">Temperature</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{formatNumber(pcseData.stressIndicators.temperatureStress * 100, 0)}%</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStressColor(pcseData.stressIndicators.temperatureStress)}`}>
                {getStressLabel(pcseData.stressIndicators.temperatureStress)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Model Insights - Consolidated */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Model Insights</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-700">Dev. Stage</span>
            </div>
            <div className="text-lg font-bold text-purple-800">
              {formatNumber(pcseData.developmentStage, 2)}
              {pcseData.developmentStage >= 2.0 && (
                <span className="ml-2 text-green-600 text-sm font-bold">(MATURE)</span>
              )}
            </div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-700">Yield Est.</span>
            </div>
            <div className="text-lg font-bold text-orange-800">
              {formatNumber(pcseData.yieldPrediction, 1)}
            </div>
            <div className="text-xs text-orange-600">t/ha</div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700">LAI</span>
            </div>
            <div className="text-lg font-bold text-green-800">
              {formatNumber(pcseData.leafAreaIndex, 1)}
            </div>
            <div className="text-xs text-green-600">m²/m²</div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-700">Biomass</span>
            </div>
            <div className="text-lg font-bold text-blue-800">
              {formatNumber(pcseData.totalBiomass / 1000, 1)}
            </div>
            <div className="text-xs text-blue-600">t/ha</div>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Powered by</div>
          <div className="text-sm font-semibold text-gray-700">PCSE/WOFOST Model</div>
          <div className="text-xs text-gray-500">Process-based crop simulation</div>
        </div>
      </div>
    </div>
  );
};

export default PCSeModelDisplay;