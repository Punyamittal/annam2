import { useState, useEffect } from 'react';
import { Sprout, BarChart3, MapPin, TrendingUp } from 'lucide-react';
import { LocationInput } from './components/LocationInput';
import { CropSelector } from './components/CropSelector';
import { PriceForecastChart } from './components/PriceForecastChart';
import { SeasonalAnalysis } from './components/SeasonalAnalysis';
import { MarketRecommendations } from './components/MarketRecommendations';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DataProcessor } from './utils/dataProcessor';
import { LocationData, PriceForecast, SeasonalPattern, VehicleInfo, MarketInfo } from './types/market';
import { VehicleInfoInput } from './components/VehicleInfoInput';
import { StateMarketRecommendations } from './components/StateMarketRecommendations';

function App() {
  const [dataProcessor] = useState(new DataProcessor());
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading market data...');
  
  // Data states
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [varieties, setVarieties] = useState<string[]>([]);
  
  // User input states
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedVariety, setSelectedVariety] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({ fuelPrice: 105, mileage: 15 });
  
  // Analysis states
  const [forecasts, setForecasts] = useState<PriceForecast[]>([]);
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>([]);
  const [recommendedMarkets, setRecommendedMarkets] = useState<MarketInfo[]>([]);
  const [bestStateMarkets, setBestStateMarkets] = useState<MarketInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const costPerKm = vehicleInfo.mileage > 0 ? vehicleInfo.fuelPrice / vehicleInfo.mileage : 0;

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoadingMessage('Loading APMC market data...');
        await dataProcessor.loadData();
        
        setLoadingMessage('Processing market information...');
        const availableStates = dataProcessor.getStates();
        const availableVarieties = dataProcessor.getVarieties();
        
        setStates(availableStates);
        setVarieties(availableVarieties);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setLoadingMessage('Error loading data. Please refresh the page.');
      }
    };

    initializeData();
  }, [dataProcessor]);

  const handleLocationChange = (newLocation: LocationData | null) => {
    setLocation(newLocation);
    // If location is cleared, also clear state-specific markets
    if (!newLocation) {
      setBestStateMarkets([]);
    }
  };

  // Update districts when state changes
  const handleStateChange = (state: string) => {
    const stateDistricts = dataProcessor.getDistricts(state);
    setDistricts(stateDistricts);
    setMarkets([]); // Clear markets when state changes
  };

  const handleDistrictChange = (state: string, district: string) => {
    if (state && district) {
      const districtMarkets = dataProcessor.getMarkets(state, district);
      setMarkets(districtMarkets);
    }
  };

  // Analyze market data when variety is selected
  useEffect(() => {
    if (selectedVariety) {
      analyzeMarket();
    }
  }, [selectedVariety, location]);

  const analyzeMarket = async () => {
    if (!selectedVariety) return;

    setIsAnalyzing(true);
    
    try {
      // Generate price forecasts
      const priceForecast = dataProcessor.generatePriceForecast(selectedVariety, 12);
      setForecasts(priceForecast);

      // Get seasonal patterns
      const patterns = dataProcessor.getSeasonalPatterns(selectedVariety);
      setSeasonalPatterns(patterns);

      // Get best markets
      const bestMarkets = dataProcessor.getBestMarkets(
        selectedVariety, 
        location?.state, 
        location?.market
      );
      setRecommendedMarkets(bestMarkets);

      // Get best markets in the state
      if (location?.state) {
        const stateMarkets = dataProcessor.getBestStateMarkets(selectedVariety, location.state, 3);
        setBestStateMarkets(stateMarkets);
      }

    } catch (error) {
      console.error('Error analyzing market data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="mx-auto text-green-600 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">APMC Market Advisor</h1>
          <LoadingSpinner message={loadingMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sprout className="text-green-600 mr-3" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">APMC Market Advisor</h1>
                <p className="text-sm text-gray-600">Smart farming decisions with AI-powered insights</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="mr-1" size={16} />
                <span>Location-based</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="mr-1" size={16} />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="mr-1" size={16} />
                <span>AI Predictions</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Controls */}
          <div className="lg:col-span-1 space-y-6">
            <LocationInput
              onLocationChange={handleLocationChange}
              states={states}
              districts={districts}
              onStateChange={handleStateChange}
              onDistrictChange={handleDistrictChange}
              markets={markets}
            />
            
            <CropSelector
              varieties={varieties}
              selectedVariety={selectedVariety}
              onVarietyChange={setSelectedVariety}
            />

            <VehicleInfoInput
              vehicleInfo={vehicleInfo}
              onVehicleInfoChange={setVehicleInfo}
            />

            {location && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Your Location</h3>
                <p className="text-sm text-gray-600">
                  {location.district}, {location.state}
                </p>
                {location.address && (
                  <p className="text-xs text-gray-500 mt-1">{location.address}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Analysis Results */}
          <div className="lg:col-span-2 space-y-8">
            {!selectedVariety ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Sprout className="mx-auto text-gray-400 mb-4" size={64} />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome to APMC Market Advisor
                </h2>
                <p className="text-gray-600 mb-6">
                  Select your location and crop variety to get personalized market insights and recommendations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="mx-auto text-green-600 mb-2" size={24} />
                    <p className="font-medium text-green-800">Price Forecasts</p>
                    <p className="text-green-600">12-month predictions</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="mx-auto text-blue-600 mb-2" size={24} />
                    <p className="font-medium text-blue-800">Seasonal Analysis</p>
                    <p className="text-blue-600">Best selling months</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <MapPin className="mx-auto text-purple-600 mb-2" size={24} />
                    <p className="font-medium text-purple-800">Market Recommendations</p>
                    <p className="text-purple-600">Nearby best markets</p>
                  </div>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-white rounded-xl shadow-lg p-12">
                <LoadingSpinner message="Analyzing market data and generating insights..." />
              </div>
            ) : (
              <>
                <PriceForecastChart 
                  forecasts={forecasts} 
                  variety={selectedVariety} 
                />
                
                <SeasonalAnalysis 
                  patterns={seasonalPatterns} 
                  variety={selectedVariety} 
                />
                
                <StateMarketRecommendations
                  markets={bestStateMarkets}
                  variety={selectedVariety}
                  state={location?.state}
                />

                <MarketRecommendations 
                  markets={recommendedMarkets} 
                  bestStateMarkets={bestStateMarkets}
                  variety={selectedVariety}
                  userLocation={location ?? undefined} 
                  vehicleInfo={vehicleInfo}
                  seasonalPatterns={seasonalPatterns}
                  costPerKm={costPerKm}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Empowering farmers with data-driven market insights
            </p>
            <p className="text-sm text-gray-500">
              Data sourced from APMC markets across India • Updated regularly
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;