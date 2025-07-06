import React, { useState, useEffect, useRef } from 'react';
import { Calendar, TrendingUp, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';
import { getHarvestPrediction } from '../data/bbchDatabase';
import { PCSeModel } from '../models/pcseModel';

interface PredictionPanelProps {
  currentDay: number;
  currentStage: { code: string; stage: any } | null;
  parameters: {
    temperature: number;
    fertilizer: number;
    water: number;
    humidity: number;
    windSpeed: number;
  };
  cropName: string;
  pcseData?: {
    yieldPrediction: number;
    stressIndicators: {
      waterStress: number;
      nitrogenStress: number;
      temperatureStress: number;
      diseaseRisk?: string;
      irrigationRecommendation?: string;
      fertilizerRecommendation?: string;
      diseasePreventionRecommendation?: string;
    };
    leafAreaIndex: number;
    totalBiomass: number;
    developmentStage: number;
    rootDepth: number;
  };
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ 
  currentDay, 
  currentStage, 
  parameters, 
  cropName,
  pcseData 
}) => {
  // Get BBCH-based harvest prediction
  const harvestPrediction = getHarvestPrediction(
    cropName, 
    currentDay, 
    parameters.temperature, 
    parameters.water, 
    parameters.fertilizer,
    parameters.humidity,
    parameters.windSpeed
  );

  // Calculate estimated yield with current parameters (simulate to maturity)
  let estimatedYield = 0;
  if (cropName && currentDay >= 0) {
    try {
      const model = new PCSeModel(cropName);
      // Simulate from day 0 to maturity with current parameters (fresh simulation)
      let day = 0;
      let mature = false;
      while (!mature && day < 200) {
        model.simulate(day, parameters.temperature, parameters.water, parameters.fertilizer, parameters.humidity, parameters.windSpeed);
        mature = model.state.developmentStage >= 2.0;
        day++;
      }
      estimatedYield = model.getYieldPrediction();
    } catch {}
  }

  // Calculate potential yield (simulate to maturity with optimal parameters)
  let potentialYield = 0;
  if (cropName) {
    try {
      const model = new PCSeModel(cropName);
      potentialYield = model.getOptimalYieldPrediction();
    } catch {}
  }

  // Show optimum values before simulation starts
  let showOptimum = currentDay === 0 && cropName;
  let maxDays = 0;
  if (showOptimum) {
    try {
      const model = new PCSeModel(cropName);
      const stageTimings: any = {
        cereals: {
          '00': 140, '01': 138, '03': 135, '05': 130, '07': 125, '09': 120,
          '10': 115, '11': 110, '12': 105, '13': 100, '14': 95, '15': 90,
          '16': 85, '17': 80, '18': 75, '19': 70,
          '21': 65, '22': 62, '23': 59, '24': 56, '25': 53, '26': 50,
          '27': 47, '28': 44, '29': 41,
          '30': 38, '31': 36, '32': 34, '33': 32, '34': 30, '35': 28,
          '36': 26, '37': 24, '39': 22,
          '41': 20, '43': 18, '45': 16, '47': 14, '49': 12,
          '51': 10, '52': 9, '53': 8, '54': 7, '55': 6, '56': 5, '57': 4, '59': 3,
          '61': 25, '65': 20, '69': 15,
          '71': 12, '73': 10, '75': 8, '77': 6,
          '83': 3, '85': 2, '87': 0, '89': 0
        },
        rice: {
          '00': 130, '01': 128, '03': 125, '05': 120, '07': 115, '09': 110,
          '10': 105, '11': 100, '12': 95, '13': 90, '14': 85, '15': 80,
          '16': 75, '17': 70, '18': 65, '19': 60,
          '21': 55, '22': 52, '23': 49, '24': 46, '25': 43, '26': 40,
          '27': 37, '28': 34, '29': 31,
          '30': 28, '32': 24, '34': 20, '37': 16, '39': 14,
          '41': 12, '43': 10, '45': 8, '47': 6, '49': 4,
          '51': 22, '53': 18, '55': 14, '57': 10, '59': 8,
          '61': 20, '65': 15, '69': 10,
          '71': 8, '73': 6, '75': 4, '77': 3,
          '83': 3, '85': 2, '87': 0, '89': 0
        },
        maize: {
          '00': 120, '01': 118, '03': 115, '05': 110, '07': 105, '09': 100,
          '10': 95, '11': 90, '12': 85, '13': 80, '14': 75, '15': 70,
          '16': 65, '17': 60, '18': 55, '19': 50,
          '51': 35, '53': 30, '55': 25, '59': 20,
          '61': 18, '63': 16, '65': 14, '67': 12, '69': 10,
          '71': 8, '73': 6, '75': 4, '77': 3,
          '83': 3, '85': 2, '87': 0, '89': 0
        },
        cotton: {
          '00': 180, '05': 175, '07': 170, '09': 165,
          '10': 160, '12': 150, '14': 140, '16': 130, '18': 120, '19': 110,
          '51': 80, '55': 70, '59': 60,
          '60': 50, '65': 40, '67': 35, '69': 30,
          '71': 25, '79': 10,
          '85': 5, '89': 0, '99': 0
        }
      };
      const timings = stageTimings[cropName as keyof typeof stageTimings] || stageTimings.cereals;
      const timingsRecord: Record<string, number> = timings as Record<string, number>;
      maxDays = Math.max(...Object.values(timingsRecord) as number[]);
    } catch {}
  }

  // Calculate days remaining using stageTimings and current BBCH code
  let daysRemainingFromStage = 0;
  if (currentStage && cropName) {
    const stageTimings = {
      cereals: {
        '00': 140, '01': 138, '03': 135, '05': 130, '07': 125, '09': 120,
        '10': 115, '11': 110, '12': 105, '13': 100, '14': 95, '15': 90,
        '16': 85, '17': 80, '18': 75, '19': 70,
        '21': 65, '22': 62, '23': 59, '24': 56, '25': 53, '26': 50,
        '27': 47, '28': 44, '29': 41,
        '30': 38, '31': 36, '32': 34, '33': 32, '34': 30, '35': 28,
        '36': 26, '37': 24, '39': 22,
        '41': 20, '43': 18, '45': 16, '47': 14, '49': 12,
        '51': 10, '52': 9, '53': 8, '54': 7, '55': 6, '56': 5, '57': 4, '59': 3,
        '61': 25, '65': 20, '69': 15,
        '71': 12, '73': 10, '75': 8, '77': 6,
        '83': 3, '85': 2, '87': 0, '89': 0
      },
      rice: {
        '00': 130, '01': 128, '03': 125, '05': 120, '07': 115, '09': 110,
        '10': 105, '11': 100, '12': 95, '13': 90, '14': 85, '15': 80,
        '16': 75, '17': 70, '18': 65, '19': 60,
        '21': 55, '22': 52, '23': 49, '24': 46, '25': 43, '26': 40,
        '27': 37, '28': 34, '29': 31,
        '30': 28, '32': 24, '34': 20, '37': 16, '39': 14,
        '41': 12, '43': 10, '45': 8, '47': 6, '49': 4,
        '51': 22, '53': 18, '55': 14, '57': 10, '59': 8,
        '61': 20, '65': 15, '69': 10,
        '71': 8, '73': 6, '75': 4, '77': 3,
        '83': 3, '85': 2, '87': 0, '89': 0
      },
      maize: {
        '00': 120, '01': 118, '03': 115, '05': 110, '07': 105, '09': 100,
        '10': 95, '11': 90, '12': 85, '13': 80, '14': 75, '15': 70,
        '16': 65, '17': 60, '18': 55, '19': 50,
        '51': 35, '53': 30, '55': 25, '59': 20,
        '61': 18, '63': 16, '65': 14, '67': 12, '69': 10,
        '71': 8, '73': 6, '75': 4, '77': 3,
        '83': 3, '85': 2, '87': 0, '89': 0
      },
      cotton: {
        '00': 180, '05': 175, '07': 170, '09': 165,
        '10': 160, '12': 150, '14': 140, '16': 130, '18': 120, '19': 110,
        '51': 80, '55': 70, '59': 60,
        '60': 50, '65': 40, '67': 35, '69': 30,
        '71': 25, '79': 10,
        '85': 5, '89': 0, '99': 0
      }
    };
    const timingsRecord: Record<string, number> = stageTimings[cropName as keyof typeof stageTimings] || stageTimings.cereals;
    daysRemainingFromStage = timingsRecord[currentStage.code] ?? 0;
  }

  // Check if crop is ready for harvest based on BBCH stages
  const isReadyForHarvest = () => {
    if (!currentStage) return false;
    const stageCode = parseInt(currentStage.code);
    
    // Define harvest readiness by crop type and BBCH stage
    switch (cropName) {
      case 'cereals':
      case 'rice':
        return stageCode >= 87; // Hard dough stage (BBCH 87) and beyond
      case 'maize':
        return stageCode >= 87; // Hard dough stage (BBCH 87) and beyond
      case 'cotton':
        return stageCode >= 85; // 50% of bolls open (BBCH 85) and beyond
      default:
        return stageCode >= 87;
    }
  };

  // Check if crop is overripe/past optimal harvest
  const isOverripe = () => {
    if (!currentStage) return false;
    const stageCode = parseInt(currentStage.code);
    
    switch (cropName) {
      case 'cereals':
      case 'rice':
      case 'maize':
        return stageCode >= 92; // Over-ripe stage
      case 'cotton':
        return stageCode >= 99; // Harvested product stage
      default:
        return stageCode >= 92;
    }
  };

  const getFertilizerRecommendations = () => {
    const recommendations: any[] = [];
    
    if (!currentStage || isReadyForHarvest()) return recommendations;
    
    const stageType = currentStage.stage.stage_type;
    
    // Enhanced recommendations based on PCSE stress indicators
    const nitrogenStress = pcseData?.stressIndicators.nitrogenStress || 1.0;
    const waterStress = pcseData?.stressIndicators.waterStress || 1.0;
    
    switch (stageType) {
      case 'leaf_development':
        recommendations.push({
          timing: nitrogenStress < 0.7 ? 'Immediately' : 'Within 3 days',
          type: 'Nitrogen (N)',
          amount: nitrogenStress < 0.7 ? '60-90 kg/ha' : '50-80 kg/ha',
          reason: 'Support early vegetative growth and leaf development'
        });
        break;
      case 'tillering':
        recommendations.push({
          timing: 'Within 5 days',
          type: 'Nitrogen (N)',
          amount: nitrogenStress < 0.6 ? '50-70 kg/ha' : '40-60 kg/ha',
          reason: 'Promote tiller development and establishment'
        });
        break;
      case 'stem_elongation':
        recommendations.push({
          timing: 'Within 7 days',
          type: 'NPK (15-15-15)',
          amount: '100-150 kg/ha',
          reason: 'Support stem growth and structural development'
        });
        break;
      case 'flowering':
        recommendations.push({
          timing: 'Immediately',
          type: 'Phosphorus (P)',
          amount: '30-50 kg/ha',
          reason: 'Support flower formation and reproductive development'
        });
        break;
      case 'fruit_development':
        recommendations.push({
          timing: 'Within 3 days',
          type: 'Potassium (K)',
          amount: '40-70 kg/ha',
          reason: 'Improve fruit quality, size, and grain filling'
        });
        break;
    }
    
    return recommendations;
  };

  const getWarnings = () => {
    const warnings = [];
    
    // If crop is ready for harvest, show harvest warnings instead of growth warnings
    if (isReadyForHarvest()) {
      if (isOverripe()) {
        warnings.push({
          type: 'Harvest Urgency',
          message: 'Crop is overripe! Quality may be declining. Harvest immediately to prevent losses.',
          severity: 'high' as const
        });
      } else {
        warnings.push({
          type: 'Harvest Ready',
          message: `Crop has reached optimal maturity (BBCH ${currentStage?.code}). Harvest within the next few days for best quality.`,
          severity: 'medium' as const
        });
      }
      return warnings;
    }
    
    // PCSE-based stress warnings (only show if significant)
    if (pcseData) {
      if (pcseData.stressIndicators.waterStress < 0.6) {
        warnings.push({
          type: 'Water Stress',
          message: `Water stress detected (${(pcseData.stressIndicators.waterStress * 100).toFixed(0)}%) - increase irrigation`,
          severity: pcseData.stressIndicators.waterStress < 0.4 ? 'high' as const : 'medium' as const
        });
      }
      
      if (pcseData.stressIndicators.nitrogenStress < 0.6) {
        warnings.push({
          type: 'Nitrogen Stress',
          message: `Nitrogen deficiency detected (${(pcseData.stressIndicators.nitrogenStress * 100).toFixed(0)}%) - apply fertilizer`,
          severity: pcseData.stressIndicators.nitrogenStress < 0.4 ? 'high' as const : 'medium' as const
        });
      }
      
      if (pcseData.stressIndicators.temperatureStress < 0.6) {
        warnings.push({
          type: 'Temperature Stress',
          message: `Temperature stress affecting photosynthesis (${(pcseData.stressIndicators.temperatureStress * 100).toFixed(0)}%)`,
          severity: 'medium' as const
        });
      }
    }
    
    // Critical parameter warnings
    if (parameters.water < 15) {
      warnings.push({
        type: 'Irrigation',
        message: 'Water levels critically low - immediate irrigation required',
        severity: 'high' as const
      });
    }
    
    if (parameters.fertilizer < 80) {
      warnings.push({
        type: 'Nutrition',
        message: 'Low fertilizer levels may limit growth potential',
        severity: 'medium' as const
      });
    }
    
    if (parameters.humidity > 85) {
      warnings.push({
        type: 'Humidity',
        message: 'High humidity increases disease risk and reduces evaporation.',
        severity: 'medium' as const
      });
    }
    if (parameters.humidity < 40) {
      warnings.push({
        type: 'Humidity',
        message: 'Low humidity may increase water demand and stress.',
        severity: 'medium' as const
      });
    }
    if (parameters.windSpeed > 8) {
      warnings.push({
        type: 'Wind',
        message: 'High wind speed may cause fertilizer drift and soil erosion.',
        severity: 'medium' as const
      });
    }
    
    return warnings;
  };

  const fertilizerRecs = getFertilizerRecommendations();
  const warnings = getWarnings();
  const readyForHarvest = isReadyForHarvest();

  // Day-by-day yield projection (simulate forward with current parameters)
  let yieldProjection: { day: number; yield: number }[] = [];
  let dayWiseYield = 0;
  if (cropName && currentDay >= 0) {
    try {
      const model = new PCSeModel(cropName);
      let day = currentDay;
      let mature = false;
      while (!mature && day < currentDay + 30) { // Limit to 30 days for UI clarity
        model.simulate(day, parameters.temperature, parameters.water, parameters.fertilizer, parameters.humidity, parameters.windSpeed);
        yieldProjection.push({ day, yield: model.getYieldPrediction() });
        if (day === currentDay) dayWiseYield = model.getYieldPrediction();
        mature = model.state.developmentStage >= 2.0;
        day++;
      }
    } catch {}
  }

  // Store the fixed final yield after harvest is ready
  const [fixedFinalYield, setFixedFinalYield] = useState<number | null>(null);
  const wasReadyRef = useRef(false);

  useEffect(() => {
    if (readyForHarvest && fixedFinalYield === null) {
      setFixedFinalYield(harvestPrediction.finalYield);
      wasReadyRef.current = true;
    }
    // Reset fixedFinalYield if simulation is reset (e.g., currentDay goes to 0)
    if (!readyForHarvest && wasReadyRef.current) {
      setFixedFinalYield(null);
      wasReadyRef.current = false;
    }
  }, [readyForHarvest, harvestPrediction.finalYield, currentDay]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Predictions & Recommendations</h2>
      
      {showOptimum ? (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Optimum (Potential) Values</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-green-700">{maxDays}</p>
              <p className="text-sm text-green-600">Max Days to Harvest</p>
              <p className="text-xs text-green-500 mt-1">Simulation not started</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{potentialYield.toFixed(1)}</p>
              <p className="text-sm text-blue-600">Potential Yield (t/ha)</p>
              <p className="text-xs text-blue-500 mt-1">Under optimal conditions</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Harvest Status */}
          {readyForHarvest ? (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">
                  {isOverripe() ? 'Harvest Overdue!' : 'Ready for Harvest!'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    {isOverripe() ? 'OVERDUE' : 'READY'}
                  </p>
                  <p className="text-sm text-green-600">Harvest Status</p>
                  <p className="text-xs text-green-500 mt-1">BBCH {currentStage?.code}</p>
                </div>
                <div>
                  <span className="text-xs text-blue-500 font-semibold mb-1">Final Yield (at Harvest)</span>
                  <span className="text-2xl font-bold text-blue-700">
                    {fixedFinalYield !== null ? fixedFinalYield.toFixed(1) : harvestPrediction.finalYield.toFixed(1)}
                  </span>
                  <span className="text-xs text-blue-500 mb-2">t/ha</span>
                  <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                    <strong>Action Required:</strong> {isOverripe() 
                      ? 'Harvest immediately to prevent further quality loss!' 
                      : 'Schedule harvest within the next 3-5 days for optimal quality.'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Harvest Prediction</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-green-700">{daysRemainingFromStage}</p>
                  <p className="text-sm text-green-600">Days Remaining</p>
                  <p className="text-xs text-green-500 mt-1">
                    Current: BBCH {currentStage?.code || 'N/A'}
                  </p>
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-500 font-semibold mb-1">Day-wise Yield (Current Day)</span>
                    <span className="text-2xl font-bold text-blue-700">{dayWiseYield.toFixed(1)}</span>
                    <span className="text-xs text-blue-500 mb-2">t/ha</span>
                    <span className="text-xs text-green-500 font-semibold mb-1 mt-2">Potential Yield (Best Conditions)</span>
                    <span className="text-2xl font-bold text-green-700">{potentialYield.toFixed(1)}</span>
                    <span className="text-xs text-green-500">t/ha</span>
                  </div>
                  <p className="text-xs text-blue-500 mt-1">
                    Target: BBCH {cropName === 'cotton' ? '85+' : '87+'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Recommendations & Disease Risk */}
          {pcseData && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">Climate-Aware Recommendations</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p><strong>Disease Risk:</strong> {pcseData.stressIndicators.diseaseRisk?.toUpperCase()}</p>
                <p><strong>Irrigation Advice:</strong> {pcseData.stressIndicators.irrigationRecommendation || 'N/A'}</p>
                <p><strong>Fertilizer Advice:</strong> {pcseData.stressIndicators.fertilizerRecommendation || 'N/A'}</p>
                <p><strong>Disease Prevention:</strong> {pcseData.stressIndicators.diseasePreventionRecommendation || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Fertilizer Recommendations - Only show if not ready for harvest */}
          {!readyForHarvest && fertilizerRecs.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Droplets className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Smart Fertilizer Recommendations</h3>
              </div>
              <div className="space-y-3">
                {fertilizerRecs.map((rec, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-blue-800">{rec.type}</span>
                      <span className="text-sm text-blue-600">{rec.timing}</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-1">{rec.amount}</p>
                    <p className="text-xs text-blue-600">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-800">Alerts & Warnings</h3>
              </div>
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      warning.severity === 'high' 
                        ? 'bg-red-50 border-red-200 text-red-800' 
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{warning.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        warning.severity === 'high' 
                          ? 'bg-red-200 text-red-800' 
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {warning.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{warning.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Progress Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Growth Progress</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Stage:</span>
                <p className="font-medium">
                  {currentStage ? `BBCH ${currentStage.code}` : 'N/A'}
                  {readyForHarvest && (
                    <span className="ml-2 text-green-600 font-bold">(READY)</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Days Since Planting:</span>
                <p className="font-medium">{currentDay}</p>
              </div>
              <div>
                <span className="text-gray-600">Humidity:</span>
                <p className="font-medium">{parameters.humidity} %</p>
              </div>
              <div>
                <span className="text-gray-600">Wind Speed:</span>
                <p className="font-medium">{parameters.windSpeed} m/s</p>
              </div>
              {pcseData && (
                <>
                  <div>
                    <span className="text-gray-600">Model Dev. Stage:</span>
                    <p className="font-medium">
                      {pcseData.developmentStage.toFixed(2)}
                      {pcseData.developmentStage >= 2.0 && (
                        <span className="ml-1 text-green-600">✓</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Overall Health:</span>
                    <p className="font-medium">
                      {(((pcseData.stressIndicators.waterStress + pcseData.stressIndicators.nitrogenStress + pcseData.stressIndicators.temperatureStress) / 3) * 100).toFixed(0)}%
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictionPanel;