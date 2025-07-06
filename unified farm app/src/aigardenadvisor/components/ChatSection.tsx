import React, { useState, useEffect } from 'react';
import { Bot, Leaf as Plant, Clock, Droplets, Calendar, BookmarkPlus, Check, Users, Target, AlertCircle, CheckCircle, Bug, Beaker, Lightbulb, Gauge, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { getCropRecommendations, CropRecommendationRequest, CropRecommendation } from '../services/geminiService';
import { journalService } from '../services/journalService';
import { getRandomGardeningFact } from '../utils/gardeningFacts';

interface GardenFormData {
  location: string;
  gardenSize: 'Small' | 'Medium' | 'Large';
  cropType: 'Vegetables' | 'Flowers' | 'Herbs' | 'Mixed';
  soilType: 'Clay' | 'Sandy' | 'Loamy' | 'Silty' | 'Rocky' | 'Unknown';
  sunExposure: 'Full Sun' | 'Partial Sun' | 'Partial Shade' | 'Full Shade';
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  budget: 'Low' | 'Medium' | 'High';
  wateringFrequency: 'Daily' | 'Every 2-3 days' | 'Weekly' | 'Bi-weekly';
  gardenPurpose: 'Food Production' | 'Aesthetic/Beauty' | 'Wildlife Habitat' | 'Mixed Purpose';
  maintenanceLevel: 'Low Maintenance' | 'Moderate' | 'High Maintenance';
  previousCrops: string;
  specificGoals: string;
  growingMethod: 'In-ground' | 'Raised Beds' | 'Containers' | 'Hydroponic';
  climateZone: string;
  expectedSowingTime: string;
  soilPH: 'Acidic (below 6.5)' | 'Neutral (6.5-7.5)' | 'Alkaline (above 7.5)' | 'Unknown';
  frostDates: string;
  gardenSpace: string;
  pestConcerns: string;
  organicPreference: 'Yes' | 'No' | 'Preferred but not required';
  timeCommitment: 'Less than 1 hour/week' | '1-3 hours/week' | '3-5 hours/week' | 'More than 5 hours/week';
  harvestGoals: string;
}

interface FormErrors {
  location?: string;
}

interface ChatSectionProps {
  onOpenJournal?: () => void;
}

// Did You Know Component
const DidYouKnowSection: React.FC = () => {
  const [currentFact, setCurrentFact] = useState<string>('');

  useEffect(() => {
    setCurrentFact(getRandomGardeningFact());
  }, []);

  const getNewFact = () => {
    setCurrentFact(getRandomGardeningFact());
  };

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 border border-green-200 shadow-md">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="bg-green-600 rounded-full p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
              Did You Know?
            </h3>
            <p className="text-green-700 text-base leading-relaxed mb-4">
              {currentFact}
            </p>
            <button
              onClick={getNewFact}
              className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors duration-200 flex items-center"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Show me another fact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatSection: React.FC<ChatSectionProps> = ({ onOpenJournal }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GardenFormData>({
    location: '',
    gardenSize: 'Small',
    cropType: 'Vegetables',
    soilType: 'Unknown',
    sunExposure: 'Full Sun',
    experience: 'Beginner',
    budget: 'Medium',
    wateringFrequency: 'Every 2-3 days',
    gardenPurpose: 'Food Production',
    maintenanceLevel: 'Moderate',
    previousCrops: '',
    specificGoals: '',
    growingMethod: 'In-ground',
    climateZone: '',
    expectedSowingTime: '',
    soilPH: 'Unknown',
    frostDates: '',
    gardenSpace: '',
    pestConcerns: '',
    organicPreference: 'Preferred but not required',
    timeCommitment: '1-3 hours/week',
    harvestGoals: ''
  });
  
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [savedCrops, setSavedCrops] = useState<Set<string>>(new Set());
  const [savingCrop, setSavingCrop] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const totalSteps = 5;

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: FormErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.location.trim()) {
          errors.location = 'Location is required';
        }
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canProceedToNext = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.location.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleStepComplete = async () => {
    if (currentStep === totalSteps) {
      await handleRecommendationSubmit();
    }
  };

  const handleRecommendationSubmit = async () => {
    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const request: CropRecommendationRequest = {
        ...formData,
        season: 'Spring'
      };
      
      const cropRecommendations = await getCropRecommendations(request);
      setRecommendations(cropRecommendations);
      setShowRecommendations(true);
      
      // Check which crops are already saved
      const alreadySaved = new Set<string>();
      cropRecommendations.forEach(crop => {
        if (journalService.isCropSaved(crop.name)) {
          alreadySaved.add(crop.name);
        }
      });
      setSavedCrops(alreadySaved);
    } catch (err) {
      setError('Failed to get recommendations. Please check your internet connection and try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCrop = async (crop: CropRecommendation) => {
    try {
      setSavingCrop(crop.name);
      
      await journalService.saveCrop(
        crop,
        formData.location,
        formData.gardenSize,
        formData.cropType
      );
      
      setSavedCrops(prev => new Set([...prev, crop.name]));
      
      setTimeout(() => setSavingCrop(null), 1000);
    } catch (error) {
      console.error('Error saving crop:', error);
      setSavingCrop(null);
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

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-6 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((step) => {
          const status = getStepStatus(step);
          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  status === 'completed'
                    ? 'bg-green-600 text-white'
                    : status === 'current'
                    ? 'bg-green-600 text-white ring-4 ring-green-200'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {status === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
              {step < 5 && (
                <div
                  className={`w-8 h-1 mx-1 transition-all duration-200 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Basic Garden Information</h3>
              <p className="text-gray-600">Tell us about your garden location and setup</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location (City, State/Province, Country) *
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, location: e.target.value }));
                    if (formErrors.location) {
                      setFormErrors(prev => ({ ...prev, location: undefined }));
                    }
                  }}
                  className={`w-full border rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    formErrors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Seattle, WA, USA"
                />
                {formErrors.location && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.location}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="climateZone" className="block text-sm font-medium text-gray-700 mb-2">
                    Climate Zone (if known)
                  </label>
                  <input
                    type="text"
                    id="climateZone"
                    value={formData.climateZone}
                    onChange={(e) => setFormData(prev => ({ ...prev, climateZone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="e.g., Zone 8b, Mediterranean, Tropical"
                  />
                </div>

                <div>
                  <label htmlFor="frostDates" className="block text-sm font-medium text-gray-700 mb-2">
                    Last/First Frost Dates (if known)
                  </label>
                  <input
                    type="text"
                    id="frostDates"
                    value={formData.frostDates}
                    onChange={(e) => setFormData(prev => ({ ...prev, frostDates: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="e.g., Last: March 15, First: November 10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gardenSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Garden Size *
                  </label>
                  <select
                    id="gardenSize"
                    value={formData.gardenSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, gardenSize: e.target.value as GardenFormData['gardenSize'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Small">Small (containers/balcony)</option>
                    <option value="Medium">Medium (backyard plot)</option>
                    <option value="Large">Large (extensive garden)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="gardenSpace" className="block text-sm font-medium text-gray-700 mb-2">
                    Available Space (dimensions)
                  </label>
                  <input
                    type="text"
                    id="gardenSpace"
                    value={formData.gardenSpace}
                    onChange={(e) => setFormData(prev => ({ ...prev, gardenSpace: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="e.g., 4x8 feet, 20 containers, 1/4 acre"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="growingMethod" className="block text-sm font-medium text-gray-700 mb-2">
                  Growing Method *
                </label>
                <select
                  id="growingMethod"
                  value={formData.growingMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, growingMethod: e.target.value as GardenFormData['growingMethod'] }))}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="In-ground">In-ground planting</option>
                  <option value="Raised Beds">Raised beds</option>
                  <option value="Containers">Container gardening</option>
                  <option value="Hydroponic">Hydroponic system</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Soil & Growing Conditions</h3>
              <p className="text-gray-600">Help us understand your garden environment</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 mb-2">
                    Soil Type *
                  </label>
                  <select
                    id="soilType"
                    value={formData.soilType}
                    onChange={(e) => setFormData(prev => ({ ...prev, soilType: e.target.value as GardenFormData['soilType'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Unknown">Unknown/Not sure</option>
                    <option value="Clay">Clay (heavy, holds water)</option>
                    <option value="Sandy">Sandy (drains quickly)</option>
                    <option value="Loamy">Loamy (ideal garden soil)</option>
                    <option value="Silty">Silty (smooth, fertile)</option>
                    <option value="Rocky">Rocky (well-draining)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="soilPH" className="block text-sm font-medium text-gray-700 mb-2">
                    Soil pH (if known)
                  </label>
                  <select
                    id="soilPH"
                    value={formData.soilPH}
                    onChange={(e) => setFormData(prev => ({ ...prev, soilPH: e.target.value as GardenFormData['soilPH'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Unknown">Unknown/Not tested</option>
                    <option value="Acidic (below 6.5)">Acidic (below 6.5)</option>
                    <option value="Neutral (6.5-7.5)">Neutral (6.5-7.5)</option>
                    <option value="Alkaline (above 7.5)">Alkaline (above 7.5)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sunExposure" className="block text-sm font-medium text-gray-700 mb-2">
                    Sun Exposure *
                  </label>
                  <select
                    id="sunExposure"
                    value={formData.sunExposure}
                    onChange={(e) => setFormData(prev => ({ ...prev, sunExposure: e.target.value as GardenFormData['sunExposure'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Full Sun">Full Sun (6+ hours direct sun)</option>
                    <option value="Partial Sun">Partial Sun (4-6 hours sun)</option>
                    <option value="Partial Shade">Partial Shade (2-4 hours sun)</option>
                    <option value="Full Shade">Full Shade (less than 2 hours)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="wateringFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Watering Schedule *
                  </label>
                  <select
                    id="wateringFrequency"
                    value={formData.wateringFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, wateringFrequency: e.target.value as GardenFormData['wateringFrequency'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Daily">Daily watering</option>
                    <option value="Every 2-3 days">Every 2-3 days</option>
                    <option value="Weekly">Weekly watering</option>
                    <option value="Bi-weekly">Bi-weekly watering</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Preference *
                </label>
                <select
                  id="cropType"
                  value={formData.cropType}
                  onChange={(e) => setFormData(prev => ({ ...prev, cropType: e.target.value as GardenFormData['cropType'] }))}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Flowers">Flowers</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Mixed">Mixed garden</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Gardening Profile</h3>
              <p className="text-gray-600">Let us know about your experience and preferences</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value as GardenFormData['experience'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget *
                  </label>
                  <select
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value as GardenFormData['budget'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Low">Low ($0-50)</option>
                    <option value="Medium">Medium ($50-200)</option>
                    <option value="High">High ($200+)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeCommitment" className="block text-sm font-medium text-gray-700 mb-2">
                    Time Available *
                  </label>
                  <select
                    id="timeCommitment"
                    value={formData.timeCommitment}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeCommitment: e.target.value as GardenFormData['timeCommitment'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Less than 1 hour/week">Less than 1 hour/week</option>
                    <option value="1-3 hours/week">1-3 hours/week</option>
                    <option value="3-5 hours/week">3-5 hours/week</option>
                    <option value="More than 5 hours/week">More than 5 hours/week</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maintenanceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Preference *
                  </label>
                  <select
                    id="maintenanceLevel"
                    value={formData.maintenanceLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, maintenanceLevel: e.target.value as GardenFormData['maintenanceLevel'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Low Maintenance">Low maintenance</option>
                    <option value="Moderate">Moderate maintenance</option>
                    <option value="High Maintenance">High maintenance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="organicPreference" className="block text-sm font-medium text-gray-700 mb-2">
                    Organic Preference *
                  </label>
                  <select
                    id="organicPreference"
                    value={formData.organicPreference}
                    onChange={(e) => setFormData(prev => ({ ...prev, organicPreference: e.target.value as GardenFormData['organicPreference'] }))}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Yes">Yes, organic only</option>
                    <option value="Preferred but not required">Preferred but not required</option>
                    <option value="No">No preference</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="gardenPurpose" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Garden Purpose *
                </label>
                <select
                  id="gardenPurpose"
                  value={formData.gardenPurpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, gardenPurpose: e.target.value as GardenFormData['gardenPurpose'] }))}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="Food Production">Food production</option>
                  <option value="Aesthetic/Beauty">Aesthetic/Beauty</option>
                  <option value="Wildlife Habitat">Wildlife habitat</option>
                  <option value="Mixed Purpose">Mixed purpose</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Planting Timeline & Goals</h3>
              <p className="text-gray-600">Tell us about your planting schedule and objectives</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="expectedSowingTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Sowing Time
                </label>
                <input
                  type="text"
                  id="expectedSowingTime"
                  value={formData.expectedSowingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedSowingTime: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="e.g., Early March, Mid-April, When soil is workable"
                />
              </div>

              <div>
                <label htmlFor="harvestGoals" className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Goals
                </label>
                <textarea
                  id="harvestGoals"
                  value={formData.harvestGoals}
                  onChange={(e) => setFormData(prev => ({ ...prev, harvestGoals: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  rows={3}
                  placeholder="e.g., Fresh salads all summer, preserve for winter, share with neighbors, specific quantities needed"
                />
              </div>

              <div>
                <label htmlFor="pestConcerns" className="block text-sm font-medium text-gray-700 mb-2">
                  Pest Concerns or Previous Issues
                </label>
                <textarea
                  id="pestConcerns"
                  value={formData.pestConcerns}
                  onChange={(e) => setFormData(prev => ({ ...prev, pestConcerns: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  rows={3}
                  placeholder="e.g., Aphids on previous crops, deer problems, slugs, specific pests in your area"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Additional Details</h3>
              <p className="text-gray-600">Final touches to personalize your recommendations</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="previousCrops" className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Crops Grown
                </label>
                <textarea
                  id="previousCrops"
                  value={formData.previousCrops}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousCrops: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  rows={3}
                  placeholder="e.g., Tomatoes, lettuce, herbs, beans (helps with crop rotation recommendations)"
                />
              </div>

              <div>
                <label htmlFor="specificGoals" className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Goals or Preferences
                </label>
                <textarea
                  id="specificGoals"
                  value={formData.specificGoals}
                  onChange={(e) => setFormData(prev => ({ ...prev, specificGoals: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  rows={3}
                  placeholder="e.g., Want colorful flowers, prefer heirloom varieties, need pest-resistant plants, want continuous harvest, attract pollinators"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="chat-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get Personalized AI Garden Recommendations</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Complete our comprehensive questionnaire for highly customized crop recommendations
            tailored to your unique growing situation and goals.
          </p>
          {onOpenJournal && (
            <div className="mt-4">
              <Button variant="outline" onClick={onOpenJournal}>
                View My Journal
              </Button>
            </div>
          )}
        </div>

        {/* Did You Know Section */}
        <DidYouKnowSection />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-6 w-6 text-white" />
                  <h3 className="ml-2 text-white font-medium">AI Garden Advisor</h3>
                </div>
                <div className="text-white text-sm">
                  Step {currentStep} of {totalSteps}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 h-2">
              <div 
                className="bg-green-600 h-2 transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            
            <div className="p-6">
              {renderStepIndicator()}
              
              {renderStepContent()}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    disabled={!canProceedToNext(currentStep)}
                    className={!canProceedToNext(currentStep) ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleStepComplete}
                    disabled={loading || !canProceedToNext(1)}
                    className={loading || !canProceedToNext(1) ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Getting Personalized Recommendations...
                      </div>
                    ) : (
                      'Get AI Recommendations'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {showRecommendations && recommendations.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Your Personalized Crop Recommendations
                </h3>
                <p className="text-gray-600">
                  Based on your comprehensive garden profile for {formData.location}
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {recommendations.map((crop, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
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
                          onClick={() => handleSaveCrop(crop)}
                          disabled={savedCrops.has(crop.name) || savingCrop === crop.name}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            savedCrops.has(crop.name)
                              ? 'bg-green-100 text-green-600 cursor-default'
                              : savingCrop === crop.name
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                          }`}
                          title={
                            savedCrops.has(crop.name) 
                              ? 'Already saved to journal' 
                              : savingCrop === crop.name
                              ? 'Saving...'
                              : 'Save to journal'
                          }
                        >
                          {savedCrops.has(crop.name) ? (
                            <Check className="h-4 w-4" />
                          ) : savingCrop === crop.name ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : (
                            <BookmarkPlus className="h-4 w-4" />
                          )}
                        </button>
                      </div>
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

                      {crop.companion_plants && (
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-700">Companion Plants</p>
                            <p className="text-sm text-gray-600">{crop.companion_plants}</p>
                          </div>
                        </div>
                      )}

                      {crop.expected_yield && (
                        <div className="flex items-start">
                          <Target className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-700">Expected Yield</p>
                            <p className="text-sm text-gray-600">{crop.expected_yield}</p>
                          </div>
                        </div>
                      )}

                      {crop.care_tips && (
                        <div className="flex items-start">
                          <Lightbulb className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-700">Care Tips</p>
                            <p className="text-sm text-gray-600">{crop.care_tips}</p>
                          </div>
                        </div>
                      )}

                      {crop.pest_management && (
                        <div className="flex items-start">
                          <Bug className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-700">Pest Management</p>
                            <p className="text-sm text-gray-600">{crop.pest_management}</p>
                          </div>
                        </div>
                      )}

                      {crop.soil_requirements && (
                        <div className="flex items-start">
                          <Beaker className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-700">Soil Requirements</p>
                            <p className="text-sm text-gray-600">{crop.soil_requirements}</p>
                          </div>
                        </div>
                      )}

                      {crop.growth_tips && (
                        <div className="flex items-start">
                          <Plant className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-700">Growth Tips</p>
                            <p className="text-sm text-gray-600">{crop.growth_tips}</p>
                          </div>
                        </div>
                      )}

                      {crop.spacing_requirements && (
                        <div className="flex items-start">
                          <Gauge className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-700">Spacing Requirements</p>
                            <p className="text-sm text-gray-600">{crop.spacing_requirements}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};