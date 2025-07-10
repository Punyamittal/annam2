import React from 'react';
import { Leaf, Calendar, Info } from 'lucide-react';
import { BBCHStage } from '../data/bbchDatabase';
import PlantAnimation from './PlantAnimation';

interface StageDisplayProps {
  currentDay: number;
  currentStage: { code: string; stage: BBCHStage; modelState?: any } | null;
  cropName: string;
  cropInfo: any;
  pcseData?: {
    yieldPrediction: number;
    stressIndicators: {
      waterStress: number;
      nitrogenStress: number;
      temperatureStress: number;
    };
    leafAreaIndex: number;
    totalBiomass: number;
    developmentStage: number;
    rootDepth: number;
  };
  parameters: {
    temperature: number;
    fertilizer: number;
    water: number;
    humidity: number;
    windSpeed: number;
    soilPh: number;
    soilNitrogen: number;
    soilOrganicMatter: number;
    soilTexture: string;
    drainageClass: string;
  };
}

const StageDisplay: React.FC<StageDisplayProps> = ({ 
  currentDay, 
  currentStage, 
  cropName, 
  cropInfo,
  pcseData,
  parameters 
}) => {
  const getStageColor = (stageType: string) => {
    const colors = {
      germination: 'from-yellow-400 to-orange-400',
      leaf_development: 'from-green-400 to-green-500',
      tillering: 'from-green-500 to-green-600',
      stem_elongation: 'from-blue-400 to-blue-500',
      booting: 'from-purple-400 to-purple-500',
      heading: 'from-indigo-400 to-indigo-500',
      flowering: 'from-pink-400 to-pink-500',
      fruit_development: 'from-orange-400 to-red-400',
      ripening: 'from-amber-400 to-yellow-500',
      senescence: 'from-gray-400 to-gray-500'
    };
    return colors[stageType as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  const formatStageType = (stageType: string) => {
    return stageType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Plant Growth Simulation</h2>
            <p className="text-green-100">
              {cropInfo?.common_names?.join(', ') || cropName} • {currentDay === 0 ? 'Not Started' : `Day ${currentDay}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {currentStage ? `BBCH ${currentStage.code}` : 'N/A'}
            </div>
            <div className="text-green-100 text-sm">Growth Code</div>
          </div>
        </div>
      </div>

      {/* Plant Animation */}
      <div className="p-6">
        <PlantAnimation 
          currentStage={currentStage}
          cropName={cropName}
          currentDay={currentDay}
          parameters={parameters}
        />
      </div>

      {/* Stage Details */}
      {currentStage ? (
        <div className="p-6 pt-0">
          <div className={`bg-gradient-to-r ${getStageColor(currentStage.stage.stage_type)} p-4 rounded-lg mb-4`}>
            <div className="flex items-center space-x-3 text-white">
              <Leaf className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">{formatStageType(currentStage.stage.stage_type)}</h3>
                <p className="text-white/90">{currentStage.stage.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Timeline</span>
              </div>
              <p className="text-sm text-gray-600">
                {currentDay === 0 ? 'Not Started' : `Day ${currentDay} of growth cycle`}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Stage Type</span>
              </div>
              <p className="text-sm text-gray-600">
                {formatStageType(currentStage.stage.stage_type)}
              </p>
            </div>
          </div>

          {/* Scientific Information */}
          {cropInfo && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">Crop Information</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Scientific Names:</strong> {cropInfo.scientific_names?.join(', ')}</p>
                <p><strong>Common Names:</strong> {cropInfo.common_names?.join(', ')}</p>
                <p><strong>Total Growth Stages:</strong> {Object.keys(cropInfo.growth_stages || {}).length}</p>
                {pcseData && (
                  <p><strong>Predicted Yield:</strong> {pcseData.yieldPrediction.toFixed(1)} tons/ha</p>
                )}
              </div>
            </div>
          )}

          {/* Soil Effects */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">Soil Impact on Growth</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">pH Level</span>
                  <span className="text-sm font-medium text-green-800">{parameters.soilPh.toFixed(1)}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(parameters.soilPh / 14) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-600">
                  {parameters.soilPh < 6.5 ? 'Acidic - may limit nutrient uptake' : 
                   parameters.soilPh > 7.5 ? 'Alkaline - good for most crops' : 
                   'Optimal pH for nutrient availability'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Nitrogen (mg/kg)</span>
                  <span className="text-sm font-medium text-green-800">{parameters.soilNitrogen}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((parameters.soilNitrogen / 100) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-600">
                  {parameters.soilNitrogen < 30 ? 'Low nitrogen - growth may be limited' : 
                   parameters.soilNitrogen > 70 ? 'High nitrogen - excellent for growth' : 
                   'Moderate nitrogen - adequate for growth'}
                </p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Soil Texture:</span>
                <span className="font-medium text-green-800">{parameters.soilTexture}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Drainage:</span>
                <span className="font-medium text-green-800">{parameters.drainageClass}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          <Leaf className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>{currentDay === 0 ? 'Select a crop and start the simulation' : 'No stage data available'}</p>
        </div>
      )}
    </div>
  );
};

export default StageDisplay;