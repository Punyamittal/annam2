import React from 'react';
import { Clock, MapPin, Leaf, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface StatusBarProps {
  isInitialized: boolean;
  selectedCrop: string;
  currentDay: number;
  currentLocation: string;
  isRunning: boolean;
  currentStage: any;
  useRealWeather: boolean;
  showSoilInfo: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  isInitialized,
  selectedCrop,
  currentDay,
  currentLocation,
  isRunning,
  currentStage,
  useRealWeather,
  showSoilInfo
}) => {
  if (!isInitialized) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-blue-700">
              <AlertCircle className="w-4 h-4" />
              <span>Ready to start simulation</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Location: {currentLocation}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Leaf className="w-4 h-4" />
              <span>Crop: {selectedCrop || 'Not selected'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-green-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>Simulation Active</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span>Day {currentDay}</span>
            </div>
            {currentStage && (
              <div className="flex items-center space-x-2 text-blue-700">
                <Activity className="w-4 h-4" />
                <span>Stage {currentStage.code}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{currentLocation}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            {useRealWeather && (
              <div className="flex items-center space-x-1 text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Real Weather</span>
              </div>
            )}
            {showSoilInfo && (
              <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Soil Analysis</span>
              </div>
            )}
            {isRunning && (
              <div className="flex items-center space-x-1 text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Auto Play</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 