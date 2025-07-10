// BBCH Database Integration with PCSE Model
import { PCSeModel } from '../models/pcseModel';

export interface BBCHStage {
  code: string;
  description: string;
  stage_type: string;
}

export interface CropData {
  crop_name: string;
  scientific_names: string[];
  common_names: string[];
  growth_stages: Record<string, BBCHStage>;
}

export interface BBCHDatabase {
  general_scale: {
    principal_growth_stages: Record<string, string>;
  };
  crops: Record<string, CropData>;
}

// Import the complete BBCH database
import bbchData from './bbch_database_complete_1.json';

export const BBCH_DATABASE: BBCHDatabase = bbchData as BBCHDatabase;

// PCSE model instances for each crop
const pcseModels: Record<string, PCSeModel> = {};

// Track the highest BBCH code reached for each crop in memory
const highestBBCHCode: Record<string, string> = {};

export const getAllCrops = (): string[] => {
  return Object.keys(BBCH_DATABASE.crops);
};

export const getCropInfo = (crop: string) => {
  return BBCH_DATABASE.crops[crop] || null;
};

export const getStageDescription = (crop: string, bbchCode: string): string => {
  try {
    return BBCH_DATABASE.crops[crop].growth_stages[bbchCode].description;
  } catch {
    return `Stage ${bbchCode} not found for ${crop}`;
  }
};

export const getStageType = (crop: string, bbchCode: string): string => {
  try {
    return BBCH_DATABASE.crops[crop].growth_stages[bbchCode].stage_type;
  } catch {
    return 'unknown';
  }
};

export const getCropStages = (crop: string) => {
  return BBCH_DATABASE.crops[crop]?.growth_stages || {};
};

export const getPrincipalStageDescription = (principalStage: string): string => {
  return BBCH_DATABASE.general_scale.principal_growth_stages[principalStage] || 'Unknown stage';
};

// Initialize PCSE model for a crop
export const initializePCSEModel = (crop: string): PCSeModel => {
  if (!pcseModels[crop]) {
    pcseModels[crop] = new PCSeModel(crop);
  }
  return pcseModels[crop];
};

// FIXED: Get current stage using PCSE model simulation with proper day-BBCH alignment
export const getCurrentStage = (crop: string, day: number, temperature: number = 25, water: number = 25, fertilizer: number = 150, humidity: number = 60, windSpeed: number = 2, soilPh: number = 7.0, soilNitrogen: number = 50): { code: string; stage: BBCHStage; modelState: any } | null => {
  try {
    const model = initializePCSEModel(crop);
    
    // Calculate stress factors first
    const waterStress = water < 20 ? 0.7 : 1.0;
    const tempStress = (temperature < 15 || temperature > 35) ? 0.8 : 1.0;
    const nutrientStress = fertilizer < 100 ? 0.8 : 1.0;
    const stressEffect = waterStress * tempStress * nutrientStress;
    
    // Simulate with current parameters including soil data
    const modelState = model.simulate(day, temperature, water, fertilizer, humidity, windSpeed, soilPh, soilNitrogen);
    const bbchCode = model.getBBCHStage();
    
    const stages = getCropStages(crop);
    let finalCode = bbchCode;
    // Only allow BBCH to increase or stay the same
    if (highestBBCHCode[crop]) {
      const prev = highestBBCHCode[crop];
      // Compare as numbers if possible, else as strings
      if (!isNaN(parseInt(bbchCode)) && !isNaN(parseInt(prev))) {
        if (parseInt(bbchCode) < parseInt(prev)) {
          finalCode = prev;
        }
      } else {
        // fallback: string comparison
        if (bbchCode < prev) {
          finalCode = prev;
        }
      }
    }
    highestBBCHCode[crop] = finalCode;
    if (stages[finalCode]) {
      return {
        code: finalCode,
        stage: stages[finalCode],
        modelState: modelState
      };
    }
    
    // Enhanced fallback with better day-to-stage mapping
    const stageKeys = Object.keys(stages).sort((a, b) => parseInt(a) - parseInt(b));
    
    // More realistic day-to-stage progression
    let targetStageIndex = 0;
    const adjustedDay = day * stressEffect; // Apply stress to slow progression
    
    if (adjustedDay <= 3) targetStageIndex = 0;        // BBCH 00-05 (days 1-3)
    else if (adjustedDay <= 7) targetStageIndex = 2;   // BBCH 07-09 (days 4-7)
    else if (adjustedDay <= 15) targetStageIndex = 4;  // BBCH 10-12 (days 8-15)
    else if (adjustedDay <= 25) targetStageIndex = 6;  // BBCH 13-15 (days 16-25)
    else if (adjustedDay <= 35) targetStageIndex = 8;  // BBCH 16-19 (days 26-35)
    else if (adjustedDay <= 45) targetStageIndex = 10; // BBCH 21-25 (days 36-45)
    else if (adjustedDay <= 55) targetStageIndex = 12; // BBCH 29-32 (days 46-55)
    else if (adjustedDay <= 65) targetStageIndex = 14; // BBCH 37-39 (days 56-65)
    else if (adjustedDay <= 75) targetStageIndex = 16; // BBCH 45-51 (days 66-75)
    else if (adjustedDay <= 85) targetStageIndex = 18; // BBCH 55-59 (days 76-85)
    else if (adjustedDay <= 95) targetStageIndex = 20; // BBCH 61-65 (days 86-95)
    else if (adjustedDay <= 105) targetStageIndex = 22; // BBCH 69-71 (days 96-105)
    else if (adjustedDay <= 120) targetStageIndex = 24; // BBCH 75-77 (days 106-120)
    else if (adjustedDay <= 140) targetStageIndex = 26; // BBCH 83-85 (days 121-140)
    else if (adjustedDay <= 160) targetStageIndex = 28; // BBCH 87-89 (days 141-160)
    else targetStageIndex = Math.min(stageKeys.length - 1, 30); // BBCH 92+ (days 161+)
    
    targetStageIndex = Math.min(targetStageIndex, stageKeys.length - 1);
    const fallbackCode = stageKeys[targetStageIndex];
    
    if (fallbackCode && stages[fallbackCode]) {
      return {
        code: fallbackCode,
        stage: stages[fallbackCode],
        modelState: modelState
      };
    }
  } catch (error) {
    console.error('Error in getCurrentStage:', error);
  }
  
  return null;
};

// Get next few stages for timeline
export const getUpcomingStages = (crop: string, currentStageCode: string, count: number = 3) => {
  const stages = getCropStages(crop);
  const stageKeys = Object.keys(stages).sort((a, b) => parseInt(a) - parseInt(b));
  const currentIndex = stageKeys.indexOf(currentStageCode);
  
  return stageKeys
    .slice(currentIndex + 1, currentIndex + 1 + count)
    .map(code => ({
      code,
      stage: stages[code]
    }));
};

// Get previous stages for timeline
export const getPreviousStages = (crop: string, currentStageCode: string, count: number = 3) => {
  const stages = getCropStages(crop);
  const stageKeys = Object.keys(stages).sort((a, b) => parseInt(a) - parseInt(b));
  const currentIndex = stageKeys.indexOf(currentStageCode);
  
  return stageKeys
    .slice(Math.max(0, currentIndex - count), currentIndex)
    .map(code => ({
      code,
      stage: stages[code]
    }));
};

// Get PCSE model predictions
export const getPCSEPredictions = (crop: string, day: number, temperature: number, water: number, fertilizer: number, humidity: number = 60, windSpeed: number = 2, soilPh: number = 7.0, soilNitrogen: number = 50) => {
  const model = initializePCSEModel(crop);
  const modelState = model.simulate(day, temperature, water, fertilizer, humidity, windSpeed, soilPh, soilNitrogen);
  return {
    yieldPrediction: model.getYieldPrediction(),
    stressIndicators: {
      ...model.getStressIndicators(),
      irrigationRecommendation: model.getIrrigationRecommendation(),
      fertilizerRecommendation: model.getFertilizerRecommendation(),
      diseasePreventionRecommendation: model.getDiseasePreventionRecommendation(),
    },
    leafAreaIndex: modelState.leafAreaIndex,
    totalBiomass: modelState.totalBiomass,
    developmentStage: modelState.developmentStage,
    rootDepth: modelState.rootDepth
  };
};

// FIXED: Get harvest date prediction based on BBCH stages with proper timing
export const getHarvestPrediction = (crop: string, currentDay: number, temperature: number, water: number, fertilizer: number, humidity: number = 60, windSpeed: number = 2) => {
  const currentStage = getCurrentStage(crop, currentDay, temperature, water, fertilizer, humidity, windSpeed);
  
  if (!currentStage) {
    return {
      harvestDay: 0,
      daysRemaining: 0,
      finalYield: 0,
      isReady: false,
      potentialYield: 0
    };
  }

  const currentBBCH = parseInt(currentStage.code);
  
  // Define harvest readiness based on BBCH stages
  const isReadyForHarvest = () => {
    switch (crop) {
      case 'cereals':
      case 'rice':
        return currentBBCH >= 87; // Hard dough stage and beyond
      case 'maize':
        return currentBBCH >= 87; // Hard dough stage and beyond
      case 'cotton':
        return currentBBCH >= 85; // 50% of bolls open
      default:
        return currentBBCH >= 87;
    }
  };

  // If already ready for harvest
  if (isReadyForHarvest()) {
    const model = initializePCSEModel(crop);
    model.simulate(currentDay, temperature, water, fertilizer, humidity, windSpeed);
    
    return {
      harvestDay: currentDay,
      daysRemaining: 0,
      finalYield: model.getYieldPrediction(),
      isReady: true,
      potentialYield: model.getOptimalYieldPrediction()
    };
  }

  // Calculate stress effect on development speed
  const waterStress = water < 20 ? 0.7 : 1.0;
  const tempStress = (temperature < 15 || temperature > 35) ? 0.8 : 1.0;
  const nutrientStress = fertilizer < 100 ? 0.8 : 1.0;
  const stressEffect = waterStress * tempStress * nutrientStress;

  // Estimate days to harvest based on current BBCH stage and crop type
  let daysToHarvest = 0;
  
  // Define BBCH stage progression timing for each crop
  const stageTimings = {
    cereals: {
      // Days from current stage to harvest (BBCH 87)
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
      '71': 8, '73': 6, '75': 4, '77': 2,
      '83': 3, '85': 2, '87': 0, '89': 0
    },
    maize: {
      '00': 120, '01': 118, '03': 115, '05': 110, '07': 105, '09': 100,
      '10': 95, '11': 90, '12': 85, '13': 80, '14': 75, '15': 70,
      '16': 65, '17': 60, '18': 55, '19': 50,
      '51': 35, '53': 30, '55': 25, '59': 20,
      '61': 18, '63': 16, '65': 14, '67': 12, '69': 10,
      '71': 8, '73': 6, '75': 4, '77': 2,
      '83': 3, '85': 2, '87': 0, '89': 0
    },
    cotton: {
      '00': 180, '05': 175, '07': 170, '09': 165,
      '10': 160, '12': 150, '14': 140, '16': 130, '18': 120, '19': 110,
      '51': 80, '55': 70, '59': 60,
      '60': 50, '65': 40, '67': 35, '69': 30,
      '71': 25, '79': 10,
      '85': 0, '89': 0, '99': 0
    }
  };

  const cropTimings = stageTimings[crop as keyof typeof stageTimings] || stageTimings.cereals;
  const codeKeys = Object.keys(cropTimings).map(Number).sort((a, b) => a - b);
  const currentCodeNum = Number(currentStage.code);

  if (cropTimings.hasOwnProperty(currentStage.code)) {
  daysToHarvest = cropTimings[currentStage.code as keyof typeof cropTimings] || 0;
  } else {
    // Interpolate between nearest lower and higher BBCH codes
    let lowerIdx = -1, upperIdx = -1;
    for (let i = 0; i < codeKeys.length; i++) {
      if (codeKeys[i] <= currentCodeNum) lowerIdx = i;
      if (codeKeys[i] > currentCodeNum) {
        upperIdx = i;
        break;
      }
    }
    if (lowerIdx !== -1 && upperIdx !== -1) {
      const lowerCode = codeKeys[lowerIdx];
      const upperCode = codeKeys[upperIdx];
      const lowerDays = cropTimings[String(lowerCode) as keyof typeof cropTimings];
      const upperDays = cropTimings[String(upperCode) as keyof typeof cropTimings];
      // Linear interpolation
      const frac = (currentCodeNum - lowerCode) / (upperCode - lowerCode);
      daysToHarvest = Math.round(lowerDays + frac * (upperDays - lowerDays));
    } else if (lowerIdx !== -1) {
      // If above highest code, use lowest days (should be 0)
      daysToHarvest = cropTimings[String(codeKeys[lowerIdx]) as keyof typeof cropTimings] || 0;
    } else if (upperIdx !== -1) {
      // If below lowest code, use highest days
      daysToHarvest = cropTimings[String(codeKeys[upperIdx]) as keyof typeof cropTimings] || 0;
    } else {
      daysToHarvest = 0;
    }
  }

  // Apply stress effect (stress slows development)
  daysToHarvest = Math.round(daysToHarvest / stressEffect);

  // Calculate final yield prediction
  const model = initializePCSEModel(crop);
  const futureDay = currentDay + daysToHarvest;
  model.simulate(futureDay, temperature, water, fertilizer, humidity, windSpeed);
  const finalYield = model.getYieldPrediction();

  return {
    harvestDay: currentDay + daysToHarvest,
    daysRemaining: daysToHarvest,
    finalYield: finalYield,
    isReady: false,
    potentialYield: model.getOptimalYieldPrediction()
  };
};