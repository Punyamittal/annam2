"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { LocationData } from '../types/market';
import { getCoordinates } from '../utils/geocoding';

interface LocationInputProps {
  onLocationChange: (location: LocationData | null) => void;
  states: string[];
  districts: string[];
  onStateChange: (state: string) => void;
  onDistrictChange: (state: string, district: string) => void;
  markets: string[];
}

export const LocationInput: React.FC<LocationInputProps> = ({
  onLocationChange,
  states,
  districts,
  onStateChange,
  onDistrictChange,
  markets,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [locationMethod, setLocationMethod] = useState<'auto' | 'manual'>('auto');

  const detectLocation = async () => {
    setIsDetecting(true);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding using a simple approach
      // In production, you'd use Google Maps Geocoding API
      const locationData: LocationData = {
        latitude,
        longitude,
        address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        state: selectedState || 'Unknown',
        district: selectedDistrict || 'Unknown',
        market: selectedMarket || ''
      };

      onLocationChange(locationData);
    } catch (error) {
      console.error('Error detecting location:', error);
      
      // Handle specific geolocation errors
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            alert('Location access was denied. Please enable location access in your browser settings or use manual selection below.');
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            alert('Location information is unavailable. Please try again or use manual selection.');
            break;
          case GeolocationPositionError.TIMEOUT:
            alert('Location request timed out. Please try again or use manual selection.');
            break;
          default:
            alert('An error occurred while detecting your location. Please use manual selection.');
        }
      } else {
        // Handle other types of errors (like unsupported browser)
        alert('Unable to detect location. Please select manually.');
      }
      
      setLocationMethod('manual');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualSelection = async () => {
    if (selectedState && selectedDistrict) {
      let coords = { latitude: 0, longitude: 0 };
      const placeName = `${selectedDistrict}, ${selectedState}`;

      const fetchedCoords = await getCoordinates(placeName);
      if (fetchedCoords) {
        coords = { latitude: fetchedCoords.lat, longitude: fetchedCoords.lon };
      }

      const locationData: LocationData = {
        ...coords,
        address: manualAddress || placeName,
        state: selectedState,
        district: selectedDistrict,
        market: selectedMarket
      };
      onLocationChange(locationData);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setSelectedMarket('');
    onStateChange(state);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedMarket('');
    onDistrictChange(selectedState, district);
  };

  useEffect(() => {
    const performManualSelection = async () => {
      if (selectedState && selectedDistrict) {
        const placeName = `${selectedDistrict}, ${selectedState}`;
        const fetchedCoords = await getCoordinates(placeName);

        if (fetchedCoords) {
          const locationData: LocationData = {
            latitude: fetchedCoords.lat,
            longitude: fetchedCoords.lon,
            address: manualAddress || placeName,
            state: selectedState,
            district: selectedDistrict,
            market: selectedMarket,
          };
          onLocationChange(locationData);
        } else {
          // If geocoding fails, send null to clear the location
          onLocationChange(null);
        }
      } else {
        // If state or district is not selected, also clear location
        onLocationChange(null);
      }
    };
    performManualSelection();
  }, [selectedState, selectedDistrict, selectedMarket, manualAddress]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <MapPin className="mr-2 text-green-600" size={24} />
        Your Location
      </h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setLocationMethod('auto')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            locationMethod === 'auto'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Auto Detect
        </button>
        <button
          onClick={() => setLocationMethod('manual')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            locationMethod === 'manual'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Manual Selection
        </button>
      </div>

      {locationMethod === 'auto' ? (
        <div className="space-y-4">
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isDetecting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Detecting Location...
              </>
            ) : (
              <>
                <Navigation className="mr-2" size={20} />
                Detect My Location
              </>
            )}
          </button>
          <p className="text-sm text-gray-600 text-center">
            We'll use your GPS location to find nearby markets
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {selectedState && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          )}

          {selectedDistrict && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market (Optional)
              </label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Markets in District</option>
                {markets.map(market => (
                  <option key={market} value={market}>{market}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address (Optional)
            </label>
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Enter your village/town address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};