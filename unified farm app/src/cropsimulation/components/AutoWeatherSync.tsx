import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, Sun, Droplets, Wind, Thermometer, Zap, AlertCircle, MapPin } from 'lucide-react';
import weatherService, { WeatherData, SimulationWeatherParams } from '../services/weatherService';

interface AutoWeatherSyncProps {
  onWeatherParamsChange: (params: SimulationWeatherParams) => void;
  currentLocation: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const AutoWeatherSync: React.FC<AutoWeatherSyncProps> = ({
  onWeatherParamsChange,
  currentLocation,
  isEnabled,
  onToggle
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync weather data with simulation
  const syncWeatherData = async () => {
    if (!currentLocation) return;
    
    setSyncStatus('syncing');
    setError(null);
    
    try {
      const data = await weatherService.getCurrentWeather(currentLocation);
      setWeatherData(data);
      
      const simulationParams = weatherService.extractSimulationParams(data);
      onWeatherParamsChange(simulationParams);
      
      setSyncStatus('success');
      setLastSync(new Date());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync weather data');
      setSyncStatus('error');
      console.error('Weather sync error:', err);
    }
  };

  // Auto-sync when enabled
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isEnabled && currentLocation) {
      syncWeatherData();
      interval = setInterval(syncWeatherData, 1000); // 1 second
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEnabled, currentLocation]);

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Wifi className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'success':
        return <Wifi className="w-5 h-5 text-green-600" />;
      case 'error':
        return <WifiOff className="w-5 h-5 text-red-600" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-400" />;
    }
  };

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (conditionLower.includes('cloud')) return <Cloud className="w-4 h-4 text-gray-500" />;
    if (conditionLower.includes('rain')) return <Droplets className="w-4 h-4 text-blue-500" />;
    if (conditionLower.includes('wind')) return <Wind className="w-4 h-4 text-gray-400" />;
    return <Cloud className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <span>Auto Weather Sync</span>
        </h2>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
          </label>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button
          onClick={syncWeatherData}
          disabled={syncStatus === 'syncing' || !currentLocation}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
        >
          {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* Location Setup Prompt */}
      {!currentLocation || currentLocation === 'New Delhi, India' ? (
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-800">Set Up Your Location</h4>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            Get accurate weather data for your area to improve crop simulation accuracy.
          </p>
          <div className="space-y-2 text-xs text-yellow-700">
            <p>• Click "Auto Detect & Sync" to use your current location</p>
            <p>• Or enter a location manually in the weather panel below</p>
            <p>• Weather data will automatically update simulation parameters</p>
          </div>
        </div>
      ) : null}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Current Weather Status */}
      {weatherData && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getWeatherIcon(weatherData.current.condition.text)}
                <span className="font-semibold text-gray-800">
                  {weatherData.current.condition.text}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {weatherData.location.name}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">
                  {weatherData.current.temp_c}°C
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">
                  {weatherData.current.humidity}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {(weatherData.current.wind_kph / 3.6).toFixed(1)} m/s
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">
                  UV: {weatherData.current.uv}
                </span>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Sync Status</h4>
              <p className="text-sm text-gray-600">
                {syncStatus === 'success' ? 'Weather data synced successfully' :
                 syncStatus === 'syncing' ? 'Syncing weather data...' :
                 syncStatus === 'error' ? 'Sync failed' : 'Ready to sync'}
              </p>
            </div>
            {lastSync && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Last sync</p>
                <p className="text-xs text-gray-700">{lastSync.toLocaleTimeString()}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">How Auto Sync Works</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Enable auto sync to automatically update simulation parameters</p>
          <p>• Use "Auto Detect & Sync" to find your location and sync weather</p>
          <p>• Weather data updates temperature, humidity, and wind speed</p>
          <p>• Manual parameters (water, fertilizer) remain under your control</p>
          <p>• Weather data will refresh every <b>1 second</b> when auto sync is enabled</p>
        </div>
      </div>
    </div>
  );
};

export default AutoWeatherSync; 