import React from 'react';
import { Thermometer, Droplets, Sprout, CloudRain, Wind } from 'lucide-react';

interface Parameters {
  temperature: number;
  fertilizer: number;
  water: number;
  humidity: number;
  windSpeed: number;
  soilPh: number;
  soilNitrogen: number;
}

interface ParameterSlidersProps {
  parameters: Parameters;
  onParameterChange: (key: keyof Parameters, value: number) => void;
  useRealWeather?: boolean;
}

const ParameterSliders: React.FC<ParameterSlidersProps> = ({ parameters, onParameterChange, useRealWeather = false }) => {
  const sliderConfig = [
    {
      key: 'temperature' as keyof Parameters,
      label: 'Temperature',
      icon: Thermometer,
      min: 15,
      max: 35,
      unit: '°C',
      color: 'from-blue-400 to-red-400',
      bgColor: 'bg-gradient-to-r from-blue-50 to-red-50',
      weatherControlled: true
    },
    {
      key: 'fertilizer' as keyof Parameters,
      label: 'Fertilizer',
      icon: Sprout,
      min: 50,
      max: 300,
      unit: 'kg/ha',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      weatherControlled: false
    },
    {
      key: 'water' as keyof Parameters,
      label: 'Water/Irrigation',
      icon: Droplets,
      min: 10,
      max: 50,
      unit: 'mm/week',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      weatherControlled: false
    },
    {
      key: 'humidity' as keyof Parameters,
      label: 'Humidity',
      icon: CloudRain,
      min: 30,
      max: 100,
      unit: '%',
      color: 'from-blue-200 to-blue-500',
      bgColor: 'bg-blue-50',
      weatherControlled: true
    },
    {
      key: 'windSpeed' as keyof Parameters,
      label: 'Wind Speed',
      icon: Wind,
      min: 0,
      max: 15,
      unit: 'm/s',
      color: 'from-gray-200 to-gray-500',
      bgColor: 'bg-gray-50',
      weatherControlled: true
    },
    {
      key: 'soilPh' as keyof Parameters,
      label: 'Soil pH',
      icon: Sprout,
      min: 4,
      max: 9,
      unit: '',
      color: 'from-yellow-200 to-green-300',
      bgColor: 'bg-yellow-50',
      weatherControlled: false
    },
    {
      key: 'soilNitrogen' as keyof Parameters,
      label: 'Soil Nitrogen',
      icon: Sprout,
      min: 0,
      max: 100,
      unit: 'mg/kg',
      color: 'from-green-200 to-green-700',
      bgColor: 'bg-green-50',
      weatherControlled: false
    }
  ];

  const autoKeys = ['humidity', 'windSpeed', 'soilPh', 'soilNitrogen'];
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Environmental Parameters</h2>
      
      {sliderConfig.map(({ key, label, icon: Icon, min, max, unit, color, bgColor, weatherControlled }) => (
        <div key={key} className={`p-4 rounded-lg ${bgColor} transition-all duration-200 hover:shadow-md ${
          autoKeys.includes(key) ? 'ring-2 ring-green-200 bg-green-50' : (useRealWeather && weatherControlled ? 'ring-2 ring-blue-300 bg-blue-50' : '')
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">{label}</span>
              {autoKeys.includes(key) && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Auto (from Weather/Soil API)
                </span>
              )}
              {useRealWeather && weatherControlled && !autoKeys.includes(key) && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  Real Weather
                </span>
              )}
            </div>
            <span className="text-lg font-bold text-gray-800">
              {key === 'windSpeed' ? Number(parameters[key]).toFixed(2) : parameters[key]} {unit}
            </span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min={min}
              max={max}
              value={parameters[key] ?? min}
              onChange={(e) => onParameterChange(key, parseInt(e.target.value))}
              disabled={autoKeys.includes(key) || (useRealWeather && weatherControlled)}
              className={`w-full h-3 rounded-lg appearance-none cursor-pointer slider ${
                (autoKeys.includes(key) || (useRealWeather && weatherControlled)) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                background: `linear-gradient(to right, 
                  rgb(34, 197, 94) 0%, 
                  rgb(34, 197, 94) ${((parameters[key] - min) / (max - min)) * 100}%, 
                  rgb(229, 231, 235) ${((parameters[key] - min) / (max - min)) * 100}%, 
                  rgb(229, 231, 235) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-800 mb-2">Parameter Impact</h3>
        <div className="text-sm text-green-700 space-y-1">
          <p>• Temperature affects growth rate and development speed</p>
          <p>• Fertilizer influences plant nutrition and yield potential</p>
          <p>• Water availability impacts stress levels and growth</p>
          <p>• Humidity, wind speed, soil pH, and soil nitrogen are set automatically from live weather and soil data</p>
        </div>
      </div>
    </div>
  );
};

export default ParameterSliders;