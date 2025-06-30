import React, { useState, useEffect } from 'react';

interface TrendData {
  date: string;
  airQuality: number;
  temperature: number;
  rainfall: number;
}

interface HistoricalTrendsProps {
  location: string;
  dataType: 'air' | 'temperature' | 'rainfall';
  timeRange: 'week' | 'month' | 'year';
}

const HistoricalTrends: React.FC<HistoricalTrendsProps> = ({ location, dataType, timeRange }) => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location) {
      setIsLoading(true);
      fetchHistoricalData(location, dataType, timeRange);
    }
  }, [location, dataType, timeRange]);

  const fetchHistoricalData = (loc: string, type: string, range: string) => {
    // Generate mock data based on parameters
    const mockData: TrendData[] = [];
    
    // Determine number of data points based on time range
    let dataPoints = 7;
    if (range === 'month') dataPoints = 30;
    if (range === 'year') dataPoints = 12;
    
    // Generate dates
    const today = new Date();
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date();
      
      if (range === 'week') {
        // Daily for week
        date.setDate(today.getDate() - (dataPoints - i - 1));
      } else if (range === 'month') {
        // Daily for month
        date.setDate(today.getDate() - (dataPoints - i - 1));
      } else {
        // Monthly for year
        date.setMonth(today.getMonth() - (dataPoints - i - 1));
      }
      
      // Generate realistic but random data with trends
      const baseAirQuality = 50 + Math.sin(i / (dataPoints / 2) * Math.PI) * 20;
      const baseTemp = 15 + Math.sin(i / (dataPoints / 4) * Math.PI) * 10;
      const baseRainfall = 5 + Math.sin(i / (dataPoints / 3) * Math.PI) * 15;
      
      mockData.push({
        date: range === 'year' 
          ? date.toLocaleString('default', { month: 'short' }) 
          : date.toLocaleDateString(),
        airQuality: Math.round(baseAirQuality + (Math.random() * 10 - 5)),
        temperature: Math.round((baseTemp + (Math.random() * 4 - 2)) * 10) / 10,
        rainfall: Math.round((baseRainfall + (Math.random() * 5 - 2.5)) * 10) / 10
      });
    }
    
    // Simulate API fetch
    setTimeout(() => {
      setTrendData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const renderChart = () => {
    if (trendData.length === 0) return null;
    
    // Find max value for scaling
    let maxValue = 0;
    const values = trendData.map(item => {
      let value = 0;
      if (dataType === 'air') value = item.airQuality;
      else if (dataType === 'temperature') value = item.temperature;
      else value = item.rainfall;
      
      if (value > maxValue) maxValue = value;
      return value;
    });
    
    // Add 10% padding to max
    maxValue = maxValue * 1.1;
    
    return (
      <div className="mt-4">
        <div className="flex h-40 items-end space-x-1">
          {values.map((value, index) => {
            // Calculate height percentage
            const heightPercent = (value / maxValue) * 100;
            
            // Determine color based on data type
            let barColor = 'bg-blue-500';
            if (dataType === 'air') {
              if (value > 100) barColor = 'bg-red-500';
              else if (value > 50) barColor = 'bg-yellow-500';
              else barColor = 'bg-green-500';
            } else if (dataType === 'temperature') {
              if (value > 30) barColor = 'bg-red-500';
              else if (value > 20) barColor = 'bg-orange-500';
              else if (value > 10) barColor = 'bg-yellow-500';
              else barColor = 'bg-blue-500';
            } else {
              if (value > 20) barColor = 'bg-blue-700';
              else if (value > 10) barColor = 'bg-blue-500';
              else barColor = 'bg-blue-300';
            }
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full ${barColor} rounded-t`} 
                  style={{ height: `${heightPercent}%` }}
                  title={`${value} ${getUnitLabel()}`}
                ></div>
                <div className="text-xs mt-1 text-gray-500 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                  {trendData[index].date}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'air': return 'Air Quality';
      case 'temperature': return 'Temperature';
      case 'rainfall': return 'Rainfall';
      default: return 'Data';
    }
  };

  const getUnitLabel = () => {
    switch (dataType) {
      case 'air': return 'AQI';
      case 'temperature': return '°C';
      case 'rainfall': return 'mm';
      default: return '';
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week': return 'Past Week';
      case 'month': return 'Past Month';
      case 'year': return 'Past Year';
      default: return '';
    }
  };

  if (isLoading) {
    return <div className="p-4 bg-white rounded-lg shadow-md">Loading historical data...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{getDataTypeLabel()} Trends</h2>
        <span className="text-sm text-gray-500">{getTimeRangeLabel()}</span>
      </div>
      
      {trendData.length === 0 ? (
        <p className="text-gray-500">No historical data available for this location.</p>
      ) : (
        <>
          {renderChart()}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <div>
                <span className="text-sm text-gray-500">Average:</span>
                <span className="ml-1 font-medium">
                  {Math.round(trendData.reduce((sum, item) => {
                    if (dataType === 'air') return sum + item.airQuality;
                    else if (dataType === 'temperature') return sum + item.temperature;
                    else return sum + item.rainfall;
                  }, 0) / trendData.length * 10) / 10} {getUnitLabel()}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Trend:</span>
                <span className="ml-1 font-medium text-green-600">Improving</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoricalTrends;
