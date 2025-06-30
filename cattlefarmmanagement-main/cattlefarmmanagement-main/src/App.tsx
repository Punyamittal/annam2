import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import CowManagement from './components/CowManagement';
import CowDetails from './components/cows/CowDetails';
import { ErrorProvider } from './contexts/ErrorContext';
import { ErrorNotification } from './components/ErrorNotification';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/data-entry" element={<DataEntry />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/cows" element={<CowManagement />} />
                  <Route path="/cows/:id" element={<CowDetails />} />
                </Routes>
              </div>
            </main>
            <ErrorNotification />
          </div>
        </Router>
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default App;