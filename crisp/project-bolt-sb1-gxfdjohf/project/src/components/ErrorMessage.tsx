import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss, 
  onRetry 
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              Analysis Failed
            </h3>
            <p className="text-sm text-red-700">
              {message}
            </p>
            {message.includes('Failed to analyze gene') && (
              <div className="mt-3 text-xs text-red-600">
                <p>Possible causes:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Flask backend server is not running (start with: python app.py)</li>
                  <li>API server is not accessible at http://localhost:5000</li>
                  <li>Crop or trait combination is not supported</li>
                  <li>Network connectivity issues</li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                title="Retry connection"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onDismiss}
              className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};