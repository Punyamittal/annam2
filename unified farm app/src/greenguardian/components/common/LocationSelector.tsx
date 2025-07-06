import React, { useState, useEffect } from 'react';
import { geocodeLocation, GeocodingResult } from '../../services/geocoding';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface LocationSelectorProps {
  savedLocations: Location[];
  onLocationSelect: (location: Location) => void;
  currentLocation?: Location;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  savedLocations, 
  onLocationSelect,
  currentLocation
}) => {
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(savedLocations);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  useEffect(() => {
    if (searchQuery) {
      // Filter saved locations based on search query
      const filtered = savedLocations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(savedLocations);
    }
  }, [searchQuery, savedLocations]);

  const handleUseCurrentLocation = () => {
    setIsUsingCurrentLocation(true);
    setSearchError(null);
    
    // Use the browser's geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLoc: Location = {
          id: 'current',
          name: 'Current Location',
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onLocationSelect(currentLoc);
        setIsUsingCurrentLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsUsingCurrentLocation(false);
        
        // Provide more specific error messages based on the error type
        let errorMessage = 'Could not access your current location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. To enable location access:\n\n' +
              '1. Click the location icon in your browser\'s address bar\n' +
              '2. Select "Allow" or "Always allow"\n' +
              '3. Refresh the page and try again';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please try:\n\n' +
              '1. Moving to an area with better GPS signal\n' +
              '2. Checking if your device\'s location services are enabled\n' +
              '3. Using the search function instead';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try:\n\n' +
              '1. Moving to an area with better GPS signal\n' +
              '2. Checking your internet connection\n' +
              '3. Using the search function instead';
            break;
          default:
            errorMessage = 'Could not access your current location. Please use the search function instead.';
        }
        
        setSearchError(errorMessage);
      }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    
    try {
      // Use our geocoding service to find the location
      const result = await geocodeLocation(searchQuery.trim());
      
      if (result) {
        const newLocation: Location = {
          id: `search-${Date.now()}`,
          name: result.name,
          lat: result.lat,
          lng: result.lng
        };
        
        // Add to search results
        setSearchResults([newLocation]);
        
        // Select the new location
        onLocationSelect(newLocation);
        setSearchError(null);
      } else {
        // If location not found
        setSearchError(`Could not find location "${searchQuery}". Try a different city or state name.`);
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      setSearchError('An error occurred while searching for the location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Combine saved locations and search results, removing duplicates
  const allLocations = React.useMemo(() => {
    const combinedLocations = [...filteredLocations];
    
    // Add search results if they don't already exist in the list
    searchResults.forEach(result => {
      if (!combinedLocations.some(loc => 
        (loc.lat === result.lat && loc.lng === result.lng) || 
        loc.name.toLowerCase() === result.name.toLowerCase()
      )) {
        combinedLocations.unshift(result);
      }
    });
    
    return combinedLocations;
  }, [filteredLocations, searchResults]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Location</h3>
      
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Search cities or states..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          className="bg-green-700 text-white px-4 py-2 rounded-r-lg hover:bg-green-800 transition-colors"
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
        >
          {isSearching ? (
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {searchError && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {searchError}
        </div>
      )}
      
      <button 
        className={`w-full mb-4 flex items-center justify-center p-2 rounded-lg border ${
          isUsingCurrentLocation ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'
        }`}
        onClick={handleUseCurrentLocation}
        disabled={isUsingCurrentLocation}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        {isUsingCurrentLocation ? 'Getting location...' : 'Use current location'}
      </button>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {allLocations.map(location => (
          <button
            key={location.id}
            className={`w-full text-left p-2 rounded-lg hover:bg-gray-50 ${
              currentLocation?.id === location.id ? 'bg-green-50 border border-green-200' : ''
            }`}
            onClick={() => onLocationSelect(location)}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{location.name}</span>
            </div>
          </button>
        ))}
        
        {allLocations.length === 0 && !isSearching && !searchError && (
          <p className="text-gray-500 text-center py-2">No locations found</p>
        )}
        
        {isSearching && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Searching...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
