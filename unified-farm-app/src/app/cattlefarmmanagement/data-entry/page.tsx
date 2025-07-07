"use client";

import DataEntry from '../../../cattlefarmmanagement/components/DataEntry';
import { ErrorProvider } from '../../../cattlefarmmanagement/contexts/ErrorContext';
import { ErrorNotification } from '../../../cattlefarmmanagement/components/ErrorNotification';
import ErrorBoundary from '../../../cattlefarmmanagement/components/ErrorBoundary';

function CattleFarmManagementDataEntryPage() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto">
              <DataEntry />
            </div>
          </main>
          <ErrorNotification />
        </div>
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default CattleFarmManagementDataEntryPage;