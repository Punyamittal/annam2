import React from 'react';
import { Dna, Leaf, Wifi, WifiOff, RotateCcw } from 'lucide-react';

interface HeaderProps {
  apiStatus: 'checking' | 'online' | 'offline';
  onRetryConnection: () => void;
}

export const Header: React.FC<HeaderProps> = ({ apiStatus, onRetryConnection }) => {
  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <RotateCcw className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'online':
        return 'API Connected';
      case 'offline':
        return 'API Offline';
      case 'checking':
        return 'Checking...';
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online':
        return 'text-green-600';
      case 'offline':
        return 'text-red-600';
      case 'checking':
        return 'text-yellow-600';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Dna className="h-8 w-8 text-blue-600" />
              <Leaf className="h-4 w-4 text-green-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Crop Gene Information System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Advanced CRISPR gRNA design for agricultural genomics
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {apiStatus === 'offline' && (
              <button
                onClick={onRetryConnection}
                className="ml-2 px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};