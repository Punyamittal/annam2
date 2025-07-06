import React, { useState, useEffect } from 'react';
import { MapPin, Cloud, Thermometer, Droplets, Wind, Sun, RefreshCw, AlertCircle } from 'lucide-react';
import weatherService, { WeatherData, SimulationWeatherParams } from '../services/weatherService';

interface WeatherIntegrationProps {
  onWeatherParamsChange: (params: SimulationWeatherParams) => void;
  onLocationChange?: (location: string) => void;
  currentLocation?: string;
}

const WeatherIntegration: React.FC<WeatherIntegrationProps> = ({ 
  onWeatherParamsChange, 
  onLocationChange,
  currentLocation = 'New Delhi, India' 
}) => {
  const [location, setLocation] = useState(currentLocation);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useRealWeather, setUseRealWeather] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchWeatherData = async (loc: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getCurrentWeather(loc);
      setWeatherData(data);
      setLastUpdated(new Date());
      
      if (useRealWeather) {
        const simulationParams = weatherService.extractSimulationParams(data);
        onWeatherParamsChange(simulationParams);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeatherData(location.trim());
      if (onLocationChange) {
        onLocationChange(location.trim());
      }
    }
  };

  const handleUseRealWeatherToggle = () => {
    const newUseRealWeather = !useRealWeather;
    setUseRealWeather(newUseRealWeather);
    
    if (newUseRealWeather && weatherData) {
      const simulationParams = weatherService.extractSimulationParams(weatherData);
      onWeatherParamsChange(simulationParams);
    }
  };

  const refreshWeather = () => {
    if (location.trim()) {
      fetchWeatherData(location.trim());
    }
  };

  useEffect(() => {
    // Update internal location state when currentLocation prop changes
    if (currentLocation !== location) {
      setLocation(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    // Fetch initial weather data
    fetchWeatherData(location);
  }, [location]); // Re-fetch when internal location state changes

  // Auto-update weather data
  useEffect(() => {
    if (autoUpdate && location) {
      const interval = setInterval(() => {
        fetchWeatherData(location);
      }, 5 * 60 * 1000); // Update every 5 minutes
      
      setAutoUpdateInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (autoUpdateInterval) {
      clearInterval(autoUpdateInterval);
      setAutoUpdateInterval(null);
    }
  }, [autoUpdate, location]);


  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (conditionLower.includes('cloud')) return <Cloud className="w-6 h-6 text-gray-500" />;
    if (conditionLower.includes('rain')) return <Droplets className="w-6 h-6 text-blue-500" />;
    if (conditionLower.includes('wind')) return <Wind className="w-6 h-6 text-gray-400" />;
    return <Cloud className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>Real Weather Integration</span>
        </h2>
        <button
          onClick={refreshWeather}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
          title="Refresh weather data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Location Input */}
      <form onSubmit={handleLocationSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city, country..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>
        
        
        {/* Location Info */}
      </form>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Weather Data Display */}
      {weatherData && (
        <div className="space-y-4">
          {/* Current Weather */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getWeatherIcon(weatherData.current.condition.text)}
                <span className="font-semibold text-gray-800">
                  {weatherData.current.condition.text}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {weatherData.location.name}, {weatherData.location.country}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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

          {/* Integration Toggle */}
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-green-800">Use Real Weather Data</h3>
              <p className="text-sm text-green-700">
                Automatically update simulation parameters with current weather
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useRealWeather}
                onChange={handleUseRealWeatherToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {/* Auto Update Toggle */}
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-blue-800">Auto Update Weather</h3>
              <p className="text-sm text-blue-700">
                Refresh weather data every 5 minutes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          {/* Weather Impact Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Weather Impact on Crops</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Temperature: Affects growth rate and development stages</p>
              <p>• Humidity: Influences disease risk and water requirements</p>
              <p>• Wind: Impacts pollination and evaporation rates</p>
              <p>• UV Index: Affects photosynthesis and stress levels</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Fetching weather data...</span>
        </div>
      )}
    </div>
  );
};

export default WeatherIntegration; 