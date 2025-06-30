import React, { useState, useEffect } from 'react';
import { Sprout, Play, Pause, RotateCcw, Settings, Activity } from 'lucide-react';
import ParameterSliders from './components/ParameterSliders';
import StageDisplay from './components/StageDisplay';
import Timeline from './components/Timeline';
import TaskList from './components/TaskList';
import PhotoUpload from './components/PhotoUpload';
import PredictionPanel from './components/PredictionPanel';
import PCSeModelDisplay from './components/PCSeModelDisplay';
import { 
  getAllCrops, 
  getCropInfo, 
  getCurrentStage, 
  getUpcomingStages, 
  getPreviousStages,
  getPCSEPredictions 
} from './data/bbchDatabase';

interface Parameters {
  temperature: number;
  fertilizer: number;
  water: number;
  humidity: number;
  windSpeed: number;
}

function App() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [currentDay, setCurrentDay] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [parameters, setParameters] = useState<Parameters>({
    temperature: 0,
    fertilizer: 0,
    water: 0,
    humidity: 60,
    windSpeed: 2
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Track full BBCH stage object per day for the selected crop
  const [bbchByDay, setBbchByDay] = useState<Record<number, { code: string, stage: any, modelState: any }>>({});
  const [maxDay, setMaxDay] = useState(0);

  const crops = getAllCrops();
  const cropInfo = selectedCrop ? getCropInfo(selectedCrop) : null;
  let currentStage = null;
  if (selectedCrop && currentDay > 0 && isInitialized) {
    let stageForDay = bbchByDay[currentDay];
    if (!stageForDay) {
      // Calculate and store it
      const stage = getCurrentStage(selectedCrop, currentDay, parameters.temperature, parameters.water, parameters.fertilizer, parameters.humidity, parameters.windSpeed);
      if (stage) {
        stageForDay = stage;
        setBbchByDay(prev => ({ ...prev, [currentDay]: stageForDay }));
        if (currentDay > maxDay) setMaxDay(currentDay);
        currentStage = stage;
      }
    } else {
      currentStage = stageForDay;
    }
  }
  const upcomingStages = currentStage ? getUpcomingStages(selectedCrop, currentStage.code, 3) : [];
  const previousStages = currentStage ? getPreviousStages(selectedCrop, currentStage.code, 3) : [];
  const pcseData = (selectedCrop && currentDay > 0 && isInitialized)
    ? getPCSEPredictions(selectedCrop, currentDay, parameters.temperature, parameters.water, parameters.fertilizer, parameters.humidity, parameters.windSpeed)
    : undefined;

  // Auto-advance days when simulation is running (5 seconds per day for better animation viewing)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && currentDay >= 0) {
      interval = setInterval(() => {
        setCurrentDay(prev => prev + 1);
      }, 5000); // Changed to 5000ms (advance 1 day every 5 seconds) for better viewing
    }
    return () => clearInterval(interval);
  }, [isRunning, currentDay]);

  const handleParameterChange = (key: keyof Parameters, value: number) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop);
    if (crop && !isInitialized) {
      // Initialize with default values only when a crop is first selected
      setParameters({
        temperature: 25,
        fertilizer: 150,
        water: 20,
        humidity: 60,
        windSpeed: 2
      });
      setIsInitialized(true);
    }
  };

  const startSimulation = () => {
    if (!selectedCrop) {
      alert('Please select a crop first');
      return;
    }
    if (!isInitialized) {
      setParameters({
        temperature: 25,
        fertilizer: 150,
        water: 20,
        humidity: 60,
        windSpeed: 2
      });
      setIsInitialized(true);
    }
    // Start from day 1 when auto play begins
    if (currentDay === 0) {
      setCurrentDay(1);
    }
    setIsRunning(true);
  };

  const resetSimulation = () => {
    setCurrentDay(0);
    setIsRunning(false);
    setParameters({
      temperature: 0,
      fertilizer: 0,
      water: 0,
      humidity: 60,
      windSpeed: 2
    });
    setSelectedCrop('');
    setIsInitialized(false);
  };

  // Manual day controls
  const advanceDay = () => {
    if (!selectedCrop) {
      alert('Please select a crop first');
      return;
    }
    if (!isInitialized) {
      setParameters({
        temperature: 25,
        fertilizer: 150,
        water: 20,
        humidity: 60,
        windSpeed: 2
      });
      setIsInitialized(true);
    }
    setCurrentDay(prev => {
      const nextDay = prev === 0 ? 1 : prev + 1;
      let nextStage = bbchByDay[nextDay];
      if (!nextStage) {
        const stage = getCurrentStage(selectedCrop, nextDay, parameters.temperature, parameters.water, parameters.fertilizer, parameters.humidity, parameters.windSpeed);
        if (stage) {
          nextStage = stage;
        }
      }
      // Find the highest code up to this day (never decrease BBCH)
      let highestStage = nextStage;
      for (let d = 1; d < nextDay; d++) {
        if (bbchByDay[d] && (!highestStage || parseInt(bbchByDay[d].code) > parseInt(highestStage.code))) {
          highestStage = bbchByDay[d];
        }
      }
      // Always use the highest BBCH code so far for this day
      setBbchByDay(prevMap => ({ ...prevMap, [nextDay]: highestStage }));
      if (nextDay > maxDay) setMaxDay(nextDay);
      return nextDay;
    });
  };

  const previousDay = () => {
    setCurrentDay(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CropSim Pro</h1>
                <p className="text-sm text-gray-600">Advanced Plant Growth Simulation System</p>
              </div>
              {isInitialized && (
                <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">PCSE Model Active</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Crop Selector */}
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-600" />
                <select
                  value={selectedCrop}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a crop...</option>
                  {crops.map(crop => (
                    <option key={crop} value={crop}>
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Manual Day Controls */}
              {isInitialized && (
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={previousDay}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={currentDay <= 0}
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 text-sm font-medium text-gray-700">
                    {currentDay === 0 ? 'Not Started' : `Day ${currentDay}`}
                  </span>
                  <button
                    onClick={advanceDay}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    →
                  </button>
                </div>
              )}
              
              {/* Simulation Controls */}
              <div className="flex items-center space-x-2">
                {!isInitialized ? (
                  <button
                    onClick={startSimulation}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    disabled={!selectedCrop}
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Animation</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      isRunning 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isRunning ? 'Pause' : 'Auto Play'}</span>
                  </button>
                )}
                
                <button
                  onClick={resetSimulation}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isInitialized ? (
          // Welcome Screen
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-2xl mx-auto">
              <Sprout className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Plant Growth Simulator</h2>
              <p className="text-lg text-gray-600 mb-8">
                Watch beautiful plants grow in real-time with scientific accuracy!
              </p>
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>Getting Started:</strong>
                </p>
                <ol className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                  <li>1. Select a crop from the dropdown above</li>
                  <li>2. Click "Start Animation" to begin</li>
                  <li>3. Watch your plant grow!</li>
                  <li>4. Adjust parameters to see effects</li>
                </ol>
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Features:</strong> Animated plants • BBCH growth stages • 
                  Weather effects • Real-time parameter control • Scientific accuracy
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Parameters and PCSE Model */}
            <div className="lg:col-span-1 space-y-6">
              <ParameterSliders 
                parameters={parameters}
                onParameterChange={handleParameterChange}
              />
              
              {pcseData && (
                <PCSeModelDisplay
                  pcseData={pcseData}
                  currentStage={currentStage}
                />
              )}
              
              <PhotoUpload 
                currentDay={currentDay}
                currentStage={currentStage}
              />
            </div>

            {/* Center Panel - Plant Animation and Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <StageDisplay
                currentDay={currentDay}
                currentStage={currentStage}
                cropName={selectedCrop}
                cropInfo={cropInfo}
                pcseData={pcseData}
                parameters={parameters}
              />
              
              <Timeline
                previousStages={previousStages}
                currentStage={currentStage}
                upcomingStages={upcomingStages}
              />
            </div>

            {/* Right Panel - Tasks and Predictions */}
            <div className="lg:col-span-1 space-y-6">
              <TaskList
                currentStage={currentStage}
                parameters={parameters}
              />
              
              <PredictionPanel
                currentDay={currentDay}
                currentStage={currentStage}
                parameters={parameters}
                cropName={selectedCrop}
                pcseData={pcseData}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>CropSim Pro</strong> - Advanced Plant Growth Simulation System
            </p>
            <p className="text-sm">
              Powered by PCSE (Python Crop Simulation Environment) • Animated visualization • 
              Scientific crop growth prediction • Supports {crops.length} major crop types
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;