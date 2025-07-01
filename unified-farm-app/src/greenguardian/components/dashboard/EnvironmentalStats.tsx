import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

interface EnvironmentalStatsProps {
  stats: Stat[];
}

const EnvironmentalStats: React.FC<EnvironmentalStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <div className="mr-3 text-green-600">
              {stat.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
          </div>
          
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">
              {stat.value}
              {stat.unit && <span className="text-sm ml-1 text-gray-500">{stat.unit}</span>}
            </p>
            
            {stat.trend && (
              <div className={`ml-2 flex items-center text-sm ${
                stat.trend === 'up' ? 'text-red-500' : 
                stat.trend === 'down' ? 'text-green-500' : 
                'text-gray-500'
              }`}>
                {stat.trend === 'up' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
                {stat.trend === 'down' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {stat.trend === 'stable' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                  </svg>
                )}
                <span className="ml-1">{stat.trendValue}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnvironmentalStats;
