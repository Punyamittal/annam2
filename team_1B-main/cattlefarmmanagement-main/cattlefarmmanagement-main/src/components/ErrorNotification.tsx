// src/components/ErrorNotification.tsx
import { useContext, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { ErrorContext } from '../contexts/ErrorContext';

export function ErrorNotification() {
  const { error, clearError } = useContext(ErrorContext);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-red-500 p-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <div className="ml-3 w-full">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{error.message}</p>
          <span className="text-sm text-gray-500 dark:text-gray-400">Label</span>
          <p className="text-gray-600 dark:text-gray-300">Secondary text</p>
          <a className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Link</a>
          <button
            onClick={clearError}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}