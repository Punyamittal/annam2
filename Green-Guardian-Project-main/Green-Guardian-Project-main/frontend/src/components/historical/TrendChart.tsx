import React from 'react';

interface DataPoint {
  date: string;
  value: number;
}

interface TrendChartProps {
  title: string;
  data: DataPoint[];
  unit: string;
  color: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ title, data, unit, color }) => {
  // In a real implementation, we would use a charting library like Chart.js or Recharts
  // For this example, we'll create a simple visual representation
  
  const maxValue = Math.max(...data.map(point => point.value));
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <div className="h-40 flex items-end space-x-1">
        {data.map((point, index) => {
          const height = (point.value / maxValue) * 100;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full rounded-t-sm" 
                style={{ 
                  height: `${height}%`, 
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              />
              <span className="text-xs mt-1 text-gray-500">
                {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Unit: {unit}</span>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">
            {data.length > 0 ? data[data.length - 1].value : 0} {unit}
          </span>
          {data.length > 1 && (
            <span className={`text-xs ${
              data[data.length - 1].value > data[data.length - 2].value
                ? 'text-red-500'
                : 'text-green-500'
            }`}>
              {data[data.length - 1].value > data[data.length - 2].value ? '↑' : '↓'}
              {Math.abs(data[data.length - 1].value - data[data.length - 2].value).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
