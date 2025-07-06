import React, { useState, useEffect } from 'react';

interface Crop {
  id: string;
  name: string;
  plantingSeason: string[];
  harvestingSeason: string[];
  growthDuration: number; // in days
  waterRequirements: 'low' | 'medium' | 'high';
  sunRequirements: 'full' | 'partial' | 'shade';
  soilType: string[];
  description: string;
  imageUrl?: string;
}

interface CropCalendarProps {
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  currentMonth?: number; // 1-12
}

const CropCalendar: React.FC<CropCalendarProps> = ({ 
  location,
  currentMonth = new Date().getMonth() + 1 // Default to current month
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [cropList, setCropList] = useState<Crop[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all'); // 'all', 'planting', 'harvesting'
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchCropData();
  }, [location, selectedMonth]);

  const fetchCropData = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would call an API with the location and month
      // For now, we'll use location-specific mock data
      
      // Get the current month name
      const currentMonthName = months[selectedMonth - 1];
      
      // Generate crops based on location and month
      const mockCrops = generateLocationSpecificCrops(location?.name || '', currentMonthName);
      setCropList(mockCrops);
    } catch (error) {
      console.error("Error fetching crop data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateLocationSpecificCrops = (locationName: string, monthName: string): Crop[] => {
    // Normalize location name for easier matching
    const normalizedLocation = locationName.toLowerCase();
    
    // Check if it's an Indian location
    const isIndianLocation = isIndianRegion(normalizedLocation);
    
    // Get season based on month and location
    const season = getSeason(monthName, isIndianLocation);
    
    // Get region type (tropical, temperate, etc.)
    const regionType = getRegionType(normalizedLocation);
    
    // Generate crops based on location, month, and region type
    return getCropsByRegionAndSeason(regionType, season, monthName);
  };
  
  const isIndianRegion = (location: string): boolean => {
    const indianKeywords = [
      'india', 'delhi', 'mumbai', 'kolkata', 'chennai', 'bengaluru', 'bangalore', 
      'hyderabad', 'ahmedabad', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
      'karnataka', 'tamil nadu', 'kerala', 'andhra pradesh', 'telangana', 'maharashtra',
      'gujarat', 'rajasthan', 'uttar pradesh', 'madhya pradesh', 'bihar', 'west bengal',
      'assam', 'odisha', 'punjab', 'haryana', 'uttarakhand', 'himachal', 'jharkhand'
    ];
    
    return indianKeywords.some(keyword => location.includes(keyword));
  };
  
  const getSeason = (month: string, isIndian: boolean): string => {
    if (isIndian) {
      // Indian agricultural seasons
      if (['June', 'July', 'August', 'September', 'October'].includes(month)) {
        return 'kharif'; // Monsoon season
      } else if (['November', 'December', 'January', 'February', 'March'].includes(month)) {
        return 'rabi'; // Winter season
      } else {
        return 'zaid'; // Summer season
      }
    } else {
      // Western seasons
      if (['March', 'April', 'May'].includes(month)) {
        return 'spring';
      } else if (['June', 'July', 'August'].includes(month)) {
        return 'summer';
      } else if (['September', 'October', 'November'].includes(month)) {
        return 'fall';
      } else {
        return 'winter';
      }
    }
  };
  
  const getRegionType = (location: string): string => {
    // Tropical regions
    if (
      location.includes('kerala') || 
      location.includes('tamil') || 
      location.includes('chennai') || 
      location.includes('bengaluru') || 
      location.includes('bangalore') || 
      location.includes('mumbai') || 
      location.includes('goa') ||
      location.includes('florida') ||
      location.includes('hawaii')
    ) {
      return 'tropical';
    }
    
    // Arid/Semi-arid regions
    if (
      location.includes('rajasthan') || 
      location.includes('gujarat') || 
      location.includes('arizona') || 
      location.includes('nevada') || 
      location.includes('jaipur') ||
      location.includes('ahmedabad') ||
      location.includes('phoenix')
    ) {
      return 'arid';
    }
    
    // Cold regions
    if (
      location.includes('himachal') || 
      location.includes('uttarakhand') || 
      location.includes('alaska') || 
      location.includes('montana') || 
      location.includes('shimla') ||
      location.includes('minnesota')
    ) {
      return 'cold';
    }
    
    // Default to temperate
    return 'temperate';
  };

  const getFilteredCrops = () => {
    const currentMonthName = months[selectedMonth - 1];
    
    if (filter === 'all') {
      return cropList;
    } else if (filter === 'planting') {
      return cropList.filter(crop => crop.plantingSeason.includes(currentMonthName));
    } else {
      return cropList.filter(crop => crop.harvestingSeason.includes(currentMonthName));
    }
  };

  const getWaterRequirementIcon = (level: 'low' | 'medium' | 'high') => {
    const baseClasses = "h-5 w-5";
    const colorClass = level === 'low' ? 'text-blue-300' : 
                      level === 'medium' ? 'text-blue-500' : 
                      'text-blue-700';
    
    return (
      <div className="flex">
        <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} ${colorClass}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        {level === 'medium' && (
          <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} ${colorClass}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {level === 'high' && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} ${colorClass}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${baseClasses} ${colorClass}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </div>
    );
  };

  const getSunRequirementIcon = (level: 'full' | 'partial' | 'shade') => {
    if (level === 'full') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      );
    } else if (level === 'partial') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-4">
        <h2 className="text-xl font-medium">Crop Calendar</h2>
        <p className="text-sm opacity-90">
          {location ? `Planting guide for ${location.name}` : 'Select a location to get personalized recommendations'}
        </p>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Month
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All Crops
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'planting' ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setFilter('planting')}
            >
              Planting Now
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'harvesting' ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setFilter('harvesting')}
            >
              Harvesting Now
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading crop data...</p>
          </div>
        ) : (
          <div>
            {getFilteredCrops().length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-gray-600">No crops found for the selected filter in {months[selectedMonth - 1]}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFilteredCrops().map(crop => (
                  <div
                    key={crop.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                      selectedCrop?.id === crop.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedCrop(selectedCrop?.id === crop.id ? null : crop)}
                  >
                    <div className="flex">
                      {crop.imageUrl && (
                        <div className="w-1/3">
                          <img
                            src={crop.imageUrl}
                            alt={crop.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className={`p-3 ${crop.imageUrl ? 'w-2/3' : 'w-full'}`}>
                        <h3 className="font-medium">{crop.name}</h3>
                        
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Plant: {crop.plantingSeason.join(', ')}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span>Harvest: {crop.harvestingSeason.join(', ')}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Growth: {crop.growthDuration} days</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex space-x-4">
                          <div className="flex items-center" title={`Water: ${crop.waterRequirements}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            {getWaterRequirementIcon(crop.waterRequirements)}
                          </div>
                          <div className="flex items-center" title={`Sun: ${crop.sunRequirements}`}>
                            {getSunRequirementIcon(crop.sunRequirements)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedCrop?.id === crop.id && (
                      <div className="p-3 bg-gray-50 border-t">
                        <p className="text-sm text-gray-700">{crop.description}</p>
                        <div className="mt-2">
                          <h4 className="text-xs font-medium text-gray-500">SOIL TYPE</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {crop.soilType.map(soil => (
                              <span key={soil} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                {soil}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-xs font-medium text-gray-500 mb-1">PLANTING TIPS</h4>
                          <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                            <li>Plant seeds {crop.name.toLowerCase() === 'tomatoes' || crop.name.toLowerCase() === 'bell peppers' ? '1/4 inch deep' : '1/2 inch deep'}</li>
                            <li>Space plants {crop.name.toLowerCase() === 'lettuce' || crop.name.toLowerCase() === 'spinach' ? '6-8 inches' : '12-18 inches'} apart</li>
                            <li>Water {crop.waterRequirements === 'low' ? 'sparingly' : crop.waterRequirements === 'medium' ? 'regularly' : 'frequently'}</li>
                            <li>Fertilize every {crop.name.toLowerCase() === 'tomatoes' || crop.name.toLowerCase() === 'bell peppers' ? '2 weeks' : '3-4 weeks'}</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropCalendar;
  const getCropsByRegionAndSeason = (regionType: string, season: string, month: string): Crop[] => {
    const crops: Crop[] = [];
    
    // Indian Kharif (Monsoon) crops
    if (season === 'kharif') {
      crops.push(
        {
          id: 'k1',
          name: 'Rice (Paddy)',
          plantingSeason: ['June', 'July'],
          harvestingSeason: ['October', 'November'],
          growthDuration: 120,
          waterRequirements: 'high',
          sunRequirements: 'full',
          soilType: ['Clayey', 'Loamy'],
          description: 'Major kharif crop that thrives in monsoon conditions. Requires standing water during most of its growing period.',
          imageUrl: 'https://images.unsplash.com/photo-1568347355280-d83c8a7abc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'k2',
          name: 'Cotton',
          plantingSeason: ['May', 'June', 'July'],
          harvestingSeason: ['November', 'December', 'January'],
          growthDuration: 180,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Black cotton soil', 'Loamy'],
          description: 'Important commercial crop suited for warm, humid conditions. Requires well-drained soil and moderate rainfall.',
          imageUrl: 'https://images.unsplash.com/photo-1594641146604-50042e8c8abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'k3',
          name: 'Maize',
          plantingSeason: ['June', 'July'],
          harvestingSeason: ['September', 'October'],
          growthDuration: 90,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Sandy loam'],
          description: 'Versatile crop that grows well in various Indian soils. Requires good drainage and moderate fertility.',
          imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'k4',
          name: 'Soybean',
          plantingSeason: ['June', 'July'],
          harvestingSeason: ['September', 'October'],
          growthDuration: 100,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Well-drained', 'Loamy'],
          description: 'Important oilseed and protein crop. Fixes nitrogen in soil and is good for crop rotation.',
          imageUrl: 'https://images.unsplash.com/photo-1599401464312-a6bc6e3d2b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    // Indian Rabi (Winter) crops
    if (season === 'rabi') {
      crops.push(
        {
          id: 'r1',
          name: 'Wheat',
          plantingSeason: ['October', 'November', 'December'],
          harvestingSeason: ['March', 'April'],
          growthDuration: 120,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Clay loam'],
          description: 'Major rabi crop suited for cooler temperatures. Requires 4-5 irrigations during the growing period.',
          imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'r2',
          name: 'Chickpea (Gram)',
          plantingSeason: ['October', 'November'],
          harvestingSeason: ['February', 'March'],
          growthDuration: 120,
          waterRequirements: 'low',
          sunRequirements: 'full',
          soilType: ['Sandy loam', 'Clay loam'],
          description: 'Important pulse crop that fixes nitrogen in soil. Drought-tolerant and requires minimal irrigation.',
          imageUrl: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'r3',
          name: 'Mustard',
          plantingSeason: ['October', 'November'],
          harvestingSeason: ['February', 'March'],
          growthDuration: 110,
          waterRequirements: 'low',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Sandy loam'],
          description: 'Oilseed crop that requires less water. Grows well in moderately fertile soils.',
          imageUrl: 'https://images.unsplash.com/photo-1518013431397-eb5e1aec015f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'r4',
          name: 'Potato',
          plantingSeason: ['October', 'November'],
          harvestingSeason: ['January', 'February'],
          growthDuration: 90,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Sandy loam', 'Loamy'],
          description: 'Important vegetable crop grown in winter. Requires well-drained, loose soil and regular irrigation.',
          imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    // Indian Zaid (Summer) crops
    if (season === 'zaid') {
      crops.push(
        {
          id: 'z1',
          name: 'Watermelon',
          plantingSeason: ['February', 'March'],
          harvestingSeason: ['May', 'June'],
          growthDuration: 90,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Sandy', 'Sandy loam'],
          description: 'Heat-tolerant fruit crop for summer season. Requires well-drained soil and regular irrigation.',
          imageUrl: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'z2',
          name: 'Cucumber',
          plantingSeason: ['February', 'March'],
          harvestingSeason: ['April', 'May'],
          growthDuration: 60,
          waterRequirements: 'high',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Rich in organic matter'],
          description: 'Quick-growing vegetable for summer. Requires consistent moisture and fertile soil.',
          imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'z3',
          name: 'Muskmelon',
          plantingSeason: ['February', 'March'],
          harvestingSeason: ['May', 'June'],
          growthDuration: 90,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Sandy loam', 'Loamy'],
          description: 'Summer fruit crop with good market value. Requires well-drained soil and regular irrigation.',
          imageUrl: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    // Western Spring crops
    if (season === 'spring') {
      crops.push(
        {
          id: 's1',
          name: 'Lettuce',
          plantingSeason: ['February', 'March', 'April'],
          harvestingSeason: ['April', 'May', 'June'],
          growthDuration: 45,
          waterRequirements: 'medium',
          sunRequirements: 'partial',
          soilType: ['Loamy', 'Rich in organic matter'],
          description: 'Cool-season crop that grows best in spring and fall. Has shallow roots and requires consistent moisture.',
          imageUrl: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 's2',
          name: 'Peas',
          plantingSeason: ['February', 'March', 'April'],
          harvestingSeason: ['May', 'June'],
          growthDuration: 60,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Well-drained'],
          description: 'Cool-season crop that can be planted as soon as soil can be worked. Fixes nitrogen in the soil.',
          imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 's3',
          name: 'Radishes',
          plantingSeason: ['March', 'April', 'May'],
          harvestingSeason: ['April', 'May', 'June'],
          growthDuration: 25,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Sandy', 'Loamy'],
          description: 'Quick-growing crop for early harvest. Can be succession planted throughout spring.',
          imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    // Western Summer crops
    if (season === 'summer') {
      crops.push(
        {
          id: 'su1',
          name: 'Tomatoes',
          plantingSeason: ['April', 'May', 'June'],
          harvestingSeason: ['July', 'August', 'September'],
          growthDuration: 90,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Well-drained'],
          description: 'Warm-season crop sensitive to frost. Requires consistent watering and benefits from staking or caging for support.',
          imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'su2',
          name: 'Bell Peppers',
          plantingSeason: ['April', 'May'],
          harvestingSeason: ['July', 'August', 'September'],
          growthDuration: 90,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Well-drained', 'Rich in organic matter'],
          description: 'Warm-season crops that require a long growing season. Prefer consistent moisture and benefit from staking.',
          imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'su3',
          name: 'Cucumbers',
          plantingSeason: ['May', 'June'],
          harvestingSeason: ['July', 'August'],
          growthDuration: 60,
          waterRequirements: 'high',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Rich in organic matter'],
          description: 'Fast-growing summer crop. Requires consistent moisture and warm soil temperatures.',
          imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    // Western Fall crops
    if (season === 'fall') {
      crops.push(
        {
          id: 'f1',
          name: 'Kale',
          plantingSeason: ['July', 'August', 'September'],
          harvestingSeason: ['September', 'October', 'November', 'December'],
          growthDuration: 60,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Rich in organic matter'],
          description: 'Cold-hardy crop that improves with frost. Can be harvested throughout fall and winter in mild climates.',
          imageUrl: 'https://images.unsplash.com/photo-1515192088926-be19b3b7eef5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'f2',
          name: 'Spinach',
          plantingSeason: ['August', 'September'],
          harvestingSeason: ['October', 'November', 'December'],
          growthDuration: 40,
          waterRequirements: 'medium',
          sunRequirements: 'partial',
          soilType: ['Loamy', 'Rich in organic matter'],
          description: 'Cool-season crop that grows quickly. Can overwinter in many climates for early spring harvest.',
          imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'f3',
          name: 'Garlic',
          plantingSeason: ['September', 'October', 'November'],
          harvestingSeason: ['June', 'July'],
          growthDuration: 240,
          waterRequirements: 'low',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Well-drained'],
          description: 'Planted in fall for harvest next summer. Requires a period of cold temperatures for proper bulb formation.',
          imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    // Western Winter crops
    if (season === 'winter') {
      crops.push(
        {
          id: 'w1',
          name: 'Cover Crops',
          plantingSeason: ['October', 'November'],
          harvestingSeason: ['March', 'April'],
          growthDuration: 150,
          waterRequirements: 'low',
          sunRequirements: 'partial',
          soilType: ['Any'],
          description: 'Winter rye, vetch, or clover to improve soil. Prevents erosion and adds organic matter when tilled in spring.',
          imageUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'w2',
          name: 'Winter Wheat',
          plantingSeason: ['September', 'October'],
          harvestingSeason: ['June', 'July'],
          growthDuration: 270,
          waterRequirements: 'low',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Clay loam'],
          description: 'Planted in fall, goes dormant in winter, and resumes growth in spring. Good for areas with mild winters.',
          imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'w3',
          name: 'Microgreens (Indoor)',
          plantingSeason: ['January', 'February', 'November', 'December'],
          harvestingSeason: ['Year-round'],
          growthDuration: 14,
          waterRequirements: 'medium',
          sunRequirements: 'partial',
          soilType: ['Seed starting mix'],
          description: 'Quick-growing crops for indoor winter production. Ready to harvest in 1-3 weeks.',
          imageUrl: 'https://images.unsplash.com/photo-1511993226957-cd166aba52d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    // Add region-specific crops
    if (regionType === 'tropical') {
      crops.push(
        {
          id: 'tr1',
          name: 'Coconut',
          plantingSeason: ['June', 'July'],
          harvestingSeason: ['Year-round'],
          growthDuration: 365,
          waterRequirements: 'medium',
          sunRequirements: 'full',
          soilType: ['Sandy', 'Loamy'],
          description: 'Perennial crop well-suited to coastal regions. Takes 6-10 years to bear fruit but then produces for decades.',
          imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'tr2',
          name: 'Banana',
          plantingSeason: ['Year-round'],
          harvestingSeason: ['Year-round'],
          growthDuration: 365,
          waterRequirements: 'high',
          sunRequirements: 'full',
          soilType: ['Loamy', 'Rich in organic matter'],
          description: 'Tropical fruit that grows well in warm, humid conditions. Requires protection from strong winds.',
          imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    if (regionType === 'arid') {
      crops.push(
        {
          id: 'ar1',
          name: 'Millet',
          plantingSeason: ['June', 'July'],
          harvestingSeason: ['September', 'October'],
          growthDuration: 90,
          waterRequirements: 'low',
          sunRequirements: 'full',
          soilType: ['Sandy', 'Sandy loam'],
          description: 'Drought-resistant grain crop suitable for arid regions. Requires minimal irrigation.',
          imageUrl: 'https://images.unsplash.com/photo-1603883410954-9c11ece28f3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 'ar2',
          name: 'Dates',
          plantingSeason: ['Year-round'],
          harvestingSeason: ['August', 'September', 'October'],
          growthDuration: 365,
          waterRequirements: 'low',
          sunRequirements: 'full',
          soilType: ['Sandy', 'Loamy'],
          description: 'Desert fruit that thrives in hot, arid conditions. Requires deep watering but infrequent irrigation.',
          imageUrl: 'https://images.unsplash.com/photo-1569870499705-504209102861?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      );
    }
    
    // Filter crops by current month for planting or harvesting
    const filteredCrops = crops.filter(crop => {
      return crop.plantingSeason.includes(month) || crop.harvestingSeason.includes(month);
    });
    
    // If no crops match the current month, return all crops for the season
    return filteredCrops.length > 0 ? filteredCrops : crops;
  };
