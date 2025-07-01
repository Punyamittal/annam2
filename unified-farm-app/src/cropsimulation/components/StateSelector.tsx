import React, { useState, useEffect } from 'react';
import { MapPin, Globe } from 'lucide-react';

interface StateSelectorProps {
  onStateChange: (state: string, country: string) => void;
  currentLocation?: string;
}

interface StateData {
  name: string;
  code?: string;
  cities?: string[];
}

interface CountryStates {
  [country: string]: StateData[];
}

const StateSelector: React.FC<StateSelectorProps> = ({ onStateChange, currentLocation }) => {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityInput, setShowCityInput] = useState(false);

  // State data for different countries
  const countryStates: CountryStates = {
    'India': [
      { name: 'Andhra Pradesh', code: 'AP' },
      { name: 'Arunachal Pradesh', code: 'AR' },
      { name: 'Assam', code: 'AS' },
      { name: 'Bihar', code: 'BR' },
      { name: 'Chhattisgarh', code: 'CG' },
      { name: 'Goa', code: 'GA' },
      { name: 'Gujarat', code: 'GJ' },
      { name: 'Haryana', code: 'HR' },
      { name: 'Himachal Pradesh', code: 'HP' },
      { name: 'Jharkhand', code: 'JH' },
      { name: 'Karnataka', code: 'KA' },
      { name: 'Kerala', code: 'KL' },
      { name: 'Madhya Pradesh', code: 'MP' },
      { name: 'Maharashtra', code: 'MH' },
      { name: 'Manipur', code: 'MN' },
      { name: 'Meghalaya', code: 'ML' },
      { name: 'Mizoram', code: 'MZ' },
      { name: 'Nagaland', code: 'NL' },
      { name: 'Odisha', code: 'OD' },
      { name: 'Punjab', code: 'PB' },
      { name: 'Rajasthan', code: 'RJ' },
      { name: 'Sikkim', code: 'SK' },
      { name: 'Tamil Nadu', code: 'TN' },
      { name: 'Telangana', code: 'TS' },
      { name: 'Tripura', code: 'TR' },
      { name: 'Uttar Pradesh', code: 'UP' },
      { name: 'Uttarakhand', code: 'UK' },
      { name: 'West Bengal', code: 'WB' },
      { name: 'Delhi', code: 'DL' },
      { name: 'Jammu and Kashmir', code: 'JK' },
      { name: 'Ladakh', code: 'LA' },
      { name: 'Chandigarh', code: 'CH' },
      { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN' },
      { name: 'Lakshadweep', code: 'LD' },
      { name: 'Puducherry', code: 'PY' },
      { name: 'Andaman and Nicobar Islands', code: 'AN' }
    ],
    'USA': [
      { name: 'Alabama', code: 'AL' },
      { name: 'Alaska', code: 'AK' },
      { name: 'Arizona', code: 'AZ' },
      { name: 'Arkansas', code: 'AR' },
      { name: 'California', code: 'CA' },
      { name: 'Colorado', code: 'CO' },
      { name: 'Connecticut', code: 'CT' },
      { name: 'Delaware', code: 'DE' },
      { name: 'Florida', code: 'FL' },
      { name: 'Georgia', code: 'GA' },
      { name: 'Hawaii', code: 'HI' },
      { name: 'Idaho', code: 'ID' },
      { name: 'Illinois', code: 'IL' },
      { name: 'Indiana', code: 'IN' },
      { name: 'Iowa', code: 'IA' },
      { name: 'Kansas', code: 'KS' },
      { name: 'Kentucky', code: 'KY' },
      { name: 'Louisiana', code: 'LA' },
      { name: 'Maine', code: 'ME' },
      { name: 'Maryland', code: 'MD' },
      { name: 'Massachusetts', code: 'MA' },
      { name: 'Michigan', code: 'MI' },
      { name: 'Minnesota', code: 'MN' },
      { name: 'Mississippi', code: 'MS' },
      { name: 'Missouri', code: 'MO' },
      { name: 'Montana', code: 'MT' },
      { name: 'Nebraska', code: 'NE' },
      { name: 'Nevada', code: 'NV' },
      { name: 'New Hampshire', code: 'NH' },
      { name: 'New Jersey', code: 'NJ' },
      { name: 'New Mexico', code: 'NM' },
      { name: 'New York', code: 'NY' },
      { name: 'North Carolina', code: 'NC' },
      { name: 'North Dakota', code: 'ND' },
      { name: 'Ohio', code: 'OH' },
      { name: 'Oklahoma', code: 'OK' },
      { name: 'Oregon', code: 'OR' },
      { name: 'Pennsylvania', code: 'PA' },
      { name: 'Rhode Island', code: 'RI' },
      { name: 'South Carolina', code: 'SC' },
      { name: 'South Dakota', code: 'SD' },
      { name: 'Tennessee', code: 'TN' },
      { name: 'Texas', code: 'TX' },
      { name: 'Utah', code: 'UT' },
      { name: 'Vermont', code: 'VT' },
      { name: 'Virginia', code: 'VA' },
      { name: 'Washington', code: 'WA' },
      { name: 'West Virginia', code: 'WV' },
      { name: 'Wisconsin', code: 'WI' },
      { name: 'Wyoming', code: 'WY' }
    ],
    'Canada': [
      { name: 'Alberta', code: 'AB' },
      { name: 'British Columbia', code: 'BC' },
      { name: 'Manitoba', code: 'MB' },
      { name: 'New Brunswick', code: 'NB' },
      { name: 'Newfoundland and Labrador', code: 'NL' },
      { name: 'Nova Scotia', code: 'NS' },
      { name: 'Ontario', code: 'ON' },
      { name: 'Prince Edward Island', code: 'PE' },
      { name: 'Quebec', code: 'QC' },
      { name: 'Saskatchewan', code: 'SK' },
      { name: 'Northwest Territories', code: 'NT' },
      { name: 'Nunavut', code: 'NU' },
      { name: 'Yukon', code: 'YT' }
    ],
    'Australia': [
      { name: 'New South Wales', code: 'NSW' },
      { name: 'Victoria', code: 'VIC' },
      { name: 'Queensland', code: 'QLD' },
      { name: 'Western Australia', code: 'WA' },
      { name: 'South Australia', code: 'SA' },
      { name: 'Tasmania', code: 'TAS' },
      { name: 'Australian Capital Territory', code: 'ACT' },
      { name: 'Northern Territory', code: 'NT' }
    ]
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setShowCityInput(false);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
    setShowCityInput(true);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (city.trim()) {
      const locationString = `${city}, ${selectedState}, ${selectedCountry}`;
      onStateChange(locationString, selectedCountry);
    }
  };

  const handleManualLocation = () => {
    setShowCityInput(true);
  };

  // Parse current location to pre-select country and state if possible
  useEffect(() => {
    if (currentLocation) {
      const parts = currentLocation.split(',').map(part => part.trim());
      if (parts.length >= 2) {
        const country = parts[parts.length - 1];
        const state = parts[parts.length - 2];
        
        if (countryStates[country]) {
          setSelectedCountry(country);
          const stateData = countryStates[country].find(s => 
            s.name.toLowerCase() === state.toLowerCase() || 
            s.code?.toLowerCase() === state.toLowerCase()
          );
          if (stateData) {
            setSelectedState(stateData.name);
            setShowCityInput(true);
            if (parts.length >= 3) {
              setSelectedCity(parts[0]);
            }
          }
        }
      }
    }
  }, [currentLocation]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Globe className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Location Selector</h2>
      </div>

      <div className="space-y-4">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {Object.keys(countryStates).map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* State/Province Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select a state/province...</option>
            {countryStates[selectedCountry]?.map(state => (
              <option key={state.name} value={state.name}>
                {state.name} {state.code && `(${state.code})`}
              </option>
            ))}
          </select>
        </div>

        {/* City Input */}
        {showCityInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Manual Location Option */}
        {!showCityInput && (
          <div className="pt-2">
            <button
              onClick={handleManualLocation}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Or enter location manually
            </button>
          </div>
        )}

        {/* Selected Location Display */}
        {selectedCity && selectedState && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Selected Location</span>
            </div>
            <div className="text-sm text-green-700">
              <p><strong>City:</strong> {selectedCity}</p>
              <p><strong>State:</strong> {selectedState}</p>
              <p><strong>Country:</strong> {selectedCountry}</p>
            </div>
          </div>
        )}

        {/* Location Tips */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Location Selection Tips</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Select your country first</p>
            <p>• Choose your state/province</p>
            <p>• Enter your city for precise weather data</p>
            <p>• Weather data will be fetched automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateSelector; 