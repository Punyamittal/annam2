import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { SeasonalPattern } from '../types/market';

interface SeasonalAnalysisProps {
  patterns: SeasonalPattern[];
  variety: string;
}

export const SeasonalAnalysis: React.FC<SeasonalAnalysisProps> = ({
  patterns,
  variety
}) => {
  if (patterns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="mr-2 text-orange-600" size={20} />
          Seasonal Analysis
        </h3>
        <p className="text-gray-600">No seasonal data available for this crop.</p>
      </div>
    );
  }

  const chartData = patterns.map(p => ({
    month: p.month.substring(0, 3),
    price: p.averagePrice,
    index: p.priceIndex,
    recommendation: p.recommendation
  }));

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'average': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const bestMonths = patterns
    .filter(p => p.recommendation === 'excellent' || p.recommendation === 'good')
    .map(p => p.month);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Calendar className="mr-2 text-orange-600" size={20} />
          Seasonal Price Analysis - {variety}
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Best Selling Months</p>
          <p className="text-lg font-bold text-green-600">
            {bestMonths.slice(0, 2).join(', ')}
          </p>
        </div>
      </div>

      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'price') return [`₹${value}/quintal`, 'Average Price'];
                return [value, name];
              }}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="price" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {patterns.slice(0, 4).map((pattern, index) => (
          <div 
            key={pattern.month}
            className="p-4 rounded-lg border-2"
            style={{ 
              borderColor: getRecommendationColor(pattern.recommendation),
              backgroundColor: `${getRecommendationColor(pattern.recommendation)}10`
            }}
          >
            <p className="font-medium text-gray-800">{pattern.month}</p>
            <p className="text-lg font-bold" style={{ color: getRecommendationColor(pattern.recommendation) }}>
              ₹{pattern.averagePrice}
            </p>
            <p className="text-sm capitalize" style={{ color: getRecommendationColor(pattern.recommendation) }}>
              {pattern.recommendation}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
          <TrendingUp className="mr-2" size={16} />
          Seasonal Insights
        </h4>
        <ul className="text-orange-700 text-sm space-y-1">
          <li>• Best selling months: {bestMonths.join(', ')}</li>
          <li>• Avoid selling during low-price months for better profits</li>
          <li>• Plan your harvest timing based on seasonal trends</li>
          <li>• Store produce during low-price periods if possible</li>
        </ul>
      </div>
    </div>
  );
};