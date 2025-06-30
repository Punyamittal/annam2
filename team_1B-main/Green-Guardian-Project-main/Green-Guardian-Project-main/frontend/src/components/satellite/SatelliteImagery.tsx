import React, { useState, useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface SatelliteImageryProps {
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
}

interface ImageAnalysisResult {
  vegetationHealthScore: number;
  waterBodyChanges: number;
  urbanDevelopmentScore: number;
  deforestationRisk: 'low' | 'medium' | 'high';
  analysisDate: string;
}

const SatelliteImagery: React.FC<SatelliteImageryProps> = ({ location }) => {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysisResult | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1month' | '6months' | '1year'>('6months');
  const [analysisType, setAnalysisType] = useState<'vegetation' | 'water' | 'urban'>('vegetation');

  // NASA Earth Observation API endpoint (this is a mock - you would use the actual API)
  const NASA_API_BASE = 'https://api.nasa.gov/planetary/earth/assets';
  const NASA_API_KEY = 'DEMO_KEY'; // Replace with your actual API key

  useEffect(() => {
    if (!location) return;
    
    fetchSatelliteImages();
  }, [location, selectedTimeframe, analysisType]);

  const fetchSatelliteImages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would fetch actual satellite images from NASA API
      // For demo purposes, we'll use placeholder images based on the analysis type
      
      // Calculate dates for before and after images
      const today = new Date();
      let beforeDate = new Date();
      
      switch (selectedTimeframe) {
        case '1month':
          beforeDate.setMonth(today.getMonth() - 1);
          break;
        case '1year':
          beforeDate.setFullYear(today.getFullYear() - 1);
          break;
        default: // 6months
          beforeDate.setMonth(today.getMonth() - 6);
      }
      
      // Format dates for API (YYYY-MM-DD)
      const todayFormatted = today.toISOString().split('T')[0];
      const beforeFormatted = beforeDate.toISOString().split('T')[0];
      
      // In a real implementation, you would make API calls like:
      /*
      const beforeResponse = await fetch(
        `${NASA_API_BASE}?lon=${location.lng}&lat=${location.lat}&date=${beforeFormatted}&dim=0.15&api_key=${NASA_API_KEY}`
      );
      const afterResponse = await fetch(
        `${NASA_API_BASE}?lon=${location.lng}&lat=${location.lat}&date=${todayFormatted}&dim=0.15&api_key=${NASA_API_KEY}`
      );
      */
      
      // For demo, use placeholder images based on analysis type
      let beforeImageUrl, afterImageUrl;
      
      switch (analysisType) {
        case 'vegetation':
          beforeImageUrl = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
          afterImageUrl = 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
          break;
        case 'water':
          beforeImageUrl = 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
          afterImageUrl = 'https://images.unsplash.com/photo-1621244335745-a24cf8b755f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
          break;
        case 'urban':
          beforeImageUrl = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
          afterImageUrl = 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
          break;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBeforeImage(beforeImageUrl);
      setAfterImage(afterImageUrl);
      
      // Generate mock analysis results
      generateAnalysisResults();
    } catch (err) {
      console.error('Error fetching satellite images:', err);
      setError('Failed to fetch satellite imagery. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalysisResults = () => {
    // In a real implementation, this would be the result of computer vision analysis
    // For demo purposes, we'll generate random scores
    
    const getRandomScore = (min: number, max: number) => {
      return Math.round((Math.random() * (max - min) + min) * 100) / 100;
    };
    
    const getRandomRisk = (): 'low' | 'medium' | 'high' => {
      const risks: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      return risks[Math.floor(Math.random() * risks.length)];
    };
    
    const results: ImageAnalysisResult = {
      vegetationHealthScore: getRandomScore(0, 1),
      waterBodyChanges: getRandomScore(-0.3, 0.3),
      urbanDevelopmentScore: getRandomScore(0, 0.5),
      deforestationRisk: getRandomRisk(),
      analysisDate: new Date().toISOString().split('T')[0]
    };
    
    setAnalysisResults(results);
  };

  const getScoreColor = (score: number, type: 'vegetation' | 'water' | 'urban') => {
    if (type === 'vegetation') {
      return score > 0.7 ? 'text-green-600' : score > 0.4 ? 'text-yellow-600' : 'text-red-600';
    } else if (type === 'water') {
      return score > 0.1 ? 'text-red-600' : score < -0.1 ? 'text-red-600' : 'text-green-600';
    } else {
      return score > 0.3 ? 'text-red-600' : score > 0.15 ? 'text-yellow-600' : 'text-green-600';
    }
  };

  const getRiskBadgeColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-4">
        <h2 className="text-xl font-medium">Satellite Imagery Analysis</h2>
        <p className="text-sm opacity-90">
          {location ? `Analyzing ${location.name}` : 'Select a location to analyze'}
        </p>
      </div>
      
      <div className="p-4">
        {!location ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600">Select a location to view satellite imagery analysis</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="space-x-2">
                <span className="text-sm text-gray-600">Timeframe:</span>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as '1month' | '6months' | '1year')}
                  className="text-sm border rounded p-1"
                >
                  <option value="1month">1 Month</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>
              
              <div className="space-x-2">
                <span className="text-sm text-gray-600">Analysis Type:</span>
                <select 
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value as 'vegetation' | 'water' | 'urban')}
                  className="text-sm border rounded p-1"
                >
                  <option value="vegetation">Vegetation Health</option>
                  <option value="water">Water Bodies</option>
                  <option value="urban">Urban Development</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing satellite imagery...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700">
                <p>{error}</p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Before & After Comparison</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Slide to compare satellite images from {selectedTimeframe === '1month' ? 'last month' : 
                    selectedTimeframe === '6months' ? '6 months ago' : 'last year'} to today.
                  </p>
                  
                  <div className="h-[400px] w-full border rounded-lg overflow-hidden">
                    {beforeImage && afterImage && (
                      <ReactCompareSlider
                        itemOne={<ReactCompareSliderImage src={beforeImage} alt="Before" />}
                        itemTwo={<ReactCompareSliderImage src={afterImage} alt="After" />}
                        position={50}
                        style={{ height: '100%', width: '100%' }}
                      />
                    )}
                  </div>
                </div>
                
                {analysisResults && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Vegetation Health</h4>
                        <div className={`text-2xl font-bold ${getScoreColor(analysisResults.vegetationHealthScore, 'vegetation')}`}>
                          {Math.round(analysisResults.vegetationHealthScore * 100)}%
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              analysisResults.vegetationHealthScore > 0.7 ? 'bg-green-500' : 
                              analysisResults.vegetationHealthScore > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${analysisResults.vegetationHealthScore * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Water Body Changes</h4>
                        <div className={`text-2xl font-bold ${getScoreColor(analysisResults.waterBodyChanges, 'water')}`}>
                          {analysisResults.waterBodyChanges > 0 ? '+' : ''}{Math.round(analysisResults.waterBodyChanges * 100)}%
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-1/2 bottom-0 w-0.5 bg-gray-400"></div>
                          {analysisResults.waterBodyChanges > 0 ? (
                            <div 
                              className="h-2 bg-blue-500 absolute top-0 left-1/2"
                              style={{ width: `${Math.abs(analysisResults.waterBodyChanges) * 100}%` }}
                            ></div>
                          ) : (
                            <div 
                              className="h-2 bg-orange-500 absolute top-0 right-1/2"
                              style={{ width: `${Math.abs(analysisResults.waterBodyChanges) * 100}%` }}
                            ></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Urban Development</h4>
                        <div className={`text-2xl font-bold ${getScoreColor(analysisResults.urbanDevelopmentScore, 'urban')}`}>
                          +{Math.round(analysisResults.urbanDevelopmentScore * 100)}%
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              analysisResults.urbanDevelopmentScore > 0.3 ? 'bg-red-500' : 
                              analysisResults.urbanDevelopmentScore > 0.15 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${analysisResults.urbanDevelopmentScore * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center">
                      <div className="mr-4">
                        <h4 className="text-sm font-medium text-gray-500">Deforestation Risk</h4>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(analysisResults.deforestationRisk)}`}>
                          {analysisResults.deforestationRisk.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex-grow text-right text-xs text-gray-500">
                        Analysis date: {analysisResults.analysisDate}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SatelliteImagery;
