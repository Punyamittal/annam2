import React, { useState, useEffect } from 'react';
import { Leaf as Plant, Clock, Droplets, Calendar, Trash2, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from './Button';
import { journalService, SavedCrop } from '../services/journalService';

interface JournalProps {
  onBack: () => void;
}

export const Journal: React.FC<JournalProps> = ({ onBack }) => {
  const [savedCrops, setSavedCrops] = useState<SavedCrop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedCrops();
  }, []);

  const loadSavedCrops = () => {
    try {
      const crops = journalService.getSavedCrops();
      setSavedCrops(crops);
    } catch (error) {
      console.error('Error loading saved crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCrop = (cropId: string) => {
    try {
      journalService.removeCrop(cropId);
      setSavedCrops(prev => prev.filter(crop => crop.id !== cropId));
    } catch (error) {
      console.error('Error removing crop:', error);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            size="md"
            onClick={onBack}
            className="mb-6 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Garden Journal</h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your collection of saved crop recommendations and planting plans
            </p>
          </div>
        </div>

        {/* Saved Crops Grid */}
        {savedCrops.length === 0 ? (
          <div className="text-center py-16">
            <Plant className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No saved crops yet</h2>
            <p className="text-gray-500 mb-6">
              Start by getting AI recommendations and save your favorite crops to build your garden journal.
            </p>
            <Button variant="primary" onClick={onBack}>
              Get Recommendations
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                You have <span className="font-semibold text-green-600">{savedCrops.length}</span> saved crop{savedCrops.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedCrops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Plant className="h-6 w-6 text-green-600" />
                      <h4 className="ml-2 text-lg font-semibold text-gray-900">{crop.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(crop.difficulty_level)}`}>
                        {crop.difficulty_level}
                      </span>
                      <button
                        onClick={() => handleRemoveCrop(crop.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove from journal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Saved date and location info */}
                  <div className="mb-3 p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700">
                      <span className="font-medium">Saved:</span> {formatDate(crop.saved_date)}
                    </p>
                    {crop.location && (
                      <p className="text-xs text-green-700">
                        <span className="font-medium">Location:</span> {crop.location}
                      </p>
                    )}
                    {crop.garden_size && crop.crop_type && (
                      <p className="text-xs text-green-700">
                        <span className="font-medium">Garden:</span> {crop.garden_size} • {crop.crop_type}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-700">Planting Time</p>
                        <p className="text-sm text-gray-600">{crop.planting_time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-700">Harvest Time</p>
                        <p className="text-sm text-gray-600">{crop.harvest_time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Droplets className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-700">Watering</p>
                        <p className="text-sm text-gray-600">{crop.watering_frequency}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Care Tips:</span><br />
                        {crop.care_tips}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};