import React, { useState, useEffect } from 'react';
import { Calendar, Cloud, Sun, Droplets, Wind, Thermometer } from 'lucide-react';
import weatherService, { WeatherData } from '../services/weatherService';

interface WeatherForecastProps {
  location: string;
  currentDay: number;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ location, currentDay }) => {
  const [forecastData, setForecastData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      fetchForecast();
    }
  }, [location]);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getWeatherForecast(location, 7);
      setForecastData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forecast');
      console.error('Forecast fetch error:', err);
    } finally {
      setLoading(false);
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

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getCropImpact = (temp: number, humidity: number, wind: number, precip: number) => {
    const impacts = [];
    
    if (temp < 10) impacts.push('Slow growth');
    else if (temp > 30) impacts.push('Heat stress');
    else impacts.push('Optimal growth');
    
    if (humidity > 80) impacts.push('Disease risk');
    else if (humidity < 40) impacts.push('Water stress');
    
    if (wind > 10) impacts.push('Wind damage');
    
    if (precip > 20) impacts.push('Flooding risk');
    else if (precip < 5) impacts.push('Drought stress');
    
    return impacts;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Weather Forecast</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading forecast...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Weather Forecast</h2>
        </div>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  if (!forecastData || !forecastData.forecast) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Weather Forecast</h2>
        </div>
        <div className="text-center py-8">
          <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No weather data available</p>
          <p className="text-sm text-gray-500">Set up your location to see weather forecast</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">7-Day Weather Forecast</h2>
      </div>
      
      <div className="space-y-3">
        {forecastData.forecast.forecastday.map((day, index) => {
          const impacts = getCropImpact(
            day.day.avgtemp_c,
            day.day.avghumidity,
            day.day.maxwind_kph / 3.6,
            day.day.totalprecip_mm
          );
          
          return (
            <div 
              key={day.date} 
              className={`p-3 rounded-lg border transition-all ${
                index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">
                    {index === 0 ? 'Today' : getDayName(day.date)}
                  </span>
                  {getWeatherIcon(day.day.condition.text)}
                  <span className="text-sm text-gray-600">
                    {day.day.condition.text}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    {day.day.avgtemp_c}°C
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.day.mintemp_c}° - {day.day.maxtemp_c}°
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <Droplets className="w-3 h-3" />
                  <span>{day.day.avghumidity}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wind className="w-3 h-3" />
                  <span>{(day.day.maxwind_kph / 3.6).toFixed(1)} m/s</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Thermometer className="w-3 h-3" />
                  <span>{day.day.totalprecip_mm}mm</span>
                </div>
              </div>
              
              {impacts.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {impacts.map((impact, impactIndex) => (
                    <span 
                      key={impactIndex}
                      className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full"
                    >
                      {impact}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Forecast Impact on Crop Growth</h4>
        <div className="text-sm text-green-700 space-y-1">
          <p>• Monitor temperature extremes for stress periods</p>
          <p>• Adjust irrigation based on precipitation forecast</p>
          <p>• Plan protection measures for adverse weather</p>
          <p>• Optimize planting/harvesting timing</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast; 