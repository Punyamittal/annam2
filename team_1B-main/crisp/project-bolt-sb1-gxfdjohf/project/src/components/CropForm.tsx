import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sprout, Target, AlertTriangle } from 'lucide-react';

interface CropFormProps {
  onSubmit: (crop: string, trait: string) => void;
  isLoading: boolean;
  apiStatus: 'checking' | 'online' | 'offline';
}

interface TraitInfo {
  ensembl_id: string;
  symbol: string;
}

interface CropData {
  scientific_name: string;
  traits: { [key: string]: TraitInfo };
}

interface AvailableCropsAndTraits {
  [key: string]: CropData;
}

export const CropForm: React.FC<CropFormProps> = ({ onSubmit, isLoading, apiStatus }) => {
  const [crop, setCrop] = useState('');
  const [trait, setTrait] = useState('');
  const [availableCropsAndTraits, setAvailableCropsAndTraits] = useState<AvailableCropsAndTraits>({});

  useEffect(() => {
    const fetchCropsAndTraits = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/crops_and_traits');
        if (response.ok) {
          const data = await response.json();
          setAvailableCropsAndTraits(data);
        } else {
          console.error('Failed to fetch crops and traits:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching crops and traits:', error);
      }
    };

    if (apiStatus === 'online') {
      fetchCropsAndTraits();
    }
  }, [apiStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (crop.trim() && trait.trim() && apiStatus === 'online') {
      onSubmit(crop.trim(), trait.trim());
    }
  };

  const cropsList = Object.keys(availableCropsAndTraits);
  const traitsList = crop ? Object.keys(availableCropsAndTraits[crop]?.traits || {}) : [];

  const isFormDisabled = isLoading || apiStatus !== 'online';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Find Gene Information
        </h2>
        <p className="text-lg text-gray-600">
          Enter crop and trait information to discover relevant genes and CRISPR gRNAs
        </p>
      </div>

      {apiStatus === 'offline' && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">
                Backend Server Offline
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please ensure your Flask backend is running on http://localhost:5000
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="crop" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Sprout className="h-4 w-4 mr-2 text-green-600" />
              Crop Name
            </label>
            <select
              id="crop"
              value={crop}
              onChange={(e) => {
                setCrop(e.target.value);
                setTrait(''); // Reset trait when crop changes
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isFormDisabled}
            >
              <option value="">Select a crop</option>
              {cropsList.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1).replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Available crops:</p>
              <div className="flex flex-wrap gap-2">
                {cropsList.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCrop(c);
                      setTrait('');
                    }}
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isFormDisabled}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1).replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="trait" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Trait of Interest
            </label>
            <select
              id="trait"
              value={trait}
              onChange={(e) => setTrait(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={isFormDisabled || !crop}
            >
              <option value="">Select a trait</option>
              {traitsList.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Available traits for selected crop:</p>
              <div className="flex flex-wrap gap-2">
                {traitsList.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrait(t)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isFormDisabled}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Supported Combinations Info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Currently Supported Combinations:
            </h4>
            <div className="space-y-1">
              {Object.entries(availableCropsAndTraits).map(([cropName, cropData]) => (
                Object.keys(cropData.traits).map((traitName) => (
                  <div key={`${cropName}-${traitName}`} className="text-sm text-blue-700">
                    <span className="font-medium">{cropName.charAt(0).toUpperCase() + cropName.slice(1).replace(/_/g, ' ')}</span> → {traitName.charAt(0).toUpperCase() + traitName.slice(1).replace(/_/g, ' ')}
                  </div>
                ))
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!crop.trim() || !trait.trim() || isFormDisabled}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing Gene Database...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Find Gene Information</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};