// PCSE-inspired Crop Growth Model
// Based on WOFOST/PCSE principles for crop simulation

export interface WeatherData {
  temperature: number;
  radiation: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface SoilData {
  waterContent: number;
  nitrogenContent: number;
  phosphorusContent: number;
  potassiumContent: number;
  pH: number;
  organicMatter: number;
}

export interface CropParameters {
  variety: string;
  plantingDate: Date;
  plantingDensity: number;
  rowSpacing: number;
}

export interface ModelState {
  day: number;
  developmentStage: number;
  leafAreaIndex: number;
  totalBiomass: number;
  grainYield: number;
  rootDepth: number;
  waterStress: number;
  nitrogenStress: number;
  temperature: number;
  water: number;
  fertilizer: number;
  humidity: number;
  windSpeed: number;
}

export class PCSeModel {
  public state: ModelState;
  private cropType: string;
  private parameters: any;
  public soil: SoilData;

  constructor(cropType: string, soil?: SoilData) {
    this.cropType = cropType;
    this.parameters = this.getCropParameters(cropType);
    this.state = this.initializeState();
    this.soil = soil || {
      waterContent: 25,
      nitrogenContent: 0.3, // percent
      phosphorusContent: 0.1,
      potassiumContent: 0.2,
      pH: 6.5,
      organicMatter: 2.0
    };
  }

  private getCropParameters(cropType: string) {
    const parameters = {
      cereals: {
        // Wheat/Barley parameters - FIXED timing for proper BBCH alignment
        TBASEM: 0.0,     // Base temperature for emergence
        TEFFMX: 30.0,    // Maximum effective temperature
        TSUMEM: 80.0,    // Temperature sum for emergence (reduced for faster germination)
        TSUM1: 800.0,    // Temperature sum emergence to anthesis (reduced)
        TSUM2: 700.0,    // Temperature sum anthesis to maturity (reduced)
        SPAN: 35.0,      // Life span of leaves
        SLATB: [0.0, 0.0022, 0.5, 0.0022, 2.0, 0.0015], // Specific leaf area
        KDIFTB: [0.0, 0.60, 2.0, 0.60], // Light extinction coefficient
        EFFTB: [0.0, 0.45, 40.0, 0.45],  // Light use efficiency
        AMAXTB: [0.0, 40.0, 1.25, 40.0, 1.50, 36.0, 1.75, 25.0, 2.0, 25.0], // Max CO2 assimilation
        TMPFTB: [0.0, 0.01, 9.0, 0.05, 16.0, 0.8, 18.0, 0.94, 20.0, 1.0, 30.0, 1.0, 36.0, 0.95, 42.0, 0.56], // Temperature effect
        CVL: 0.685,      // Conversion efficiency leaves
        CVO: 0.709,      // Conversion efficiency storage organs
        CVR: 0.694,      // Conversion efficiency roots
        CVS: 0.662,      // Conversion efficiency stems
        Q10: 2.0,        // Q10 for maintenance respiration
        RML: 0.030,      // Maintenance respiration leaves
        RMO: 0.015,      // Maintenance respiration storage organs
        RMR: 0.015,      // Maintenance respiration roots
        RMS: 0.015,      // Maintenance respiration stems
        RFSETB: [0.0, 1.0, 1.5, 1.0, 1.75, 0.75, 2.0, 0.25], // Fraction to storage organs
        FRTB: [0.0, 0.50, 0.43, 0.50, 0.95, 0.50, 1.10, 0.40, 1.20, 0.35, 1.35, 0.25, 1.65, 0.15, 2.0, 0.10], // Fraction to roots
        FLTB: [0.0, 0.33, 0.33, 0.33, 0.88, 0.33, 0.95, 0.23, 1.10, 0.15, 1.20, 0.10, 1.35, 0.05, 1.65, 0.00, 2.0, 0.00], // Fraction to leaves
        FSTB: [0.0, 0.17, 0.33, 0.17, 0.88, 0.17, 0.95, 0.27, 1.10, 0.35, 1.20, 0.40, 1.35, 0.45, 1.65, 0.15, 2.0, 0.00], // Fraction to stems
        FOTB: [0.0, 0.00, 0.95, 0.00, 1.10, 0.00, 1.20, 0.00, 1.35, 0.25, 1.65, 0.70, 2.0, 0.90], // Fraction to storage organs
      },
      rice: {
        // Rice parameters - FIXED timing
        TBASEM: 10.0,
        TEFFMX: 35.0,
        TSUMEM: 100.0,   // Reduced for faster germination
        TSUM1: 900.0,    // Reduced for proper timing
        TSUM2: 800.0,    // Reduced for proper timing
        SPAN: 40.0,
        SLATB: [0.0, 0.0025, 0.5, 0.0025, 2.0, 0.0018],
        KDIFTB: [0.0, 0.65, 2.0, 0.65],
        EFFTB: [0.0, 0.50, 40.0, 0.50],
        AMAXTB: [0.0, 45.0, 1.25, 45.0, 1.50, 40.0, 1.75, 30.0, 2.0, 30.0],
        CVL: 0.685, CVO: 0.709, CVR: 0.694, CVS: 0.662,
        Q10: 2.0, RML: 0.030, RMO: 0.015, RMR: 0.015, RMS: 0.015,
      },
      maize: {
        // Maize parameters - FIXED timing
        TBASEM: 8.0,
        TEFFMX: 35.0,
        TSUMEM: 90.0,    // Reduced for faster germination
        TSUM1: 700.0,    // Reduced for proper timing
        TSUM2: 600.0,    // Reduced for proper timing
        SPAN: 30.0,
        SLATB: [0.0, 0.0020, 0.5, 0.0020, 2.0, 0.0015],
        KDIFTB: [0.0, 0.70, 2.0, 0.70],
        EFFTB: [0.0, 0.48, 40.0, 0.48],
        AMAXTB: [0.0, 50.0, 1.25, 50.0, 1.50, 45.0, 1.75, 35.0, 2.0, 35.0],
        CVL: 0.685, CVO: 0.709, CVR: 0.694, CVS: 0.662,
        Q10: 2.0, RML: 0.030, RMO: 0.015, RMR: 0.015, RMS: 0.015,
      },
      cotton: {
        // Cotton parameters - FIXED timing
        TBASEM: 12.0,
        TEFFMX: 35.0,
        TSUMEM: 120.0,   // Reduced for faster germination
        TSUM1: 1000.0,   // Reduced for proper timing
        TSUM2: 1200.0,   // Reduced for proper timing
        SPAN: 45.0,
        SLATB: [0.0, 0.0022, 0.5, 0.0022, 2.0, 0.0016],
        KDIFTB: [0.0, 0.65, 2.0, 0.65],
        EFFTB: [0.0, 0.42, 40.0, 0.42],
        AMAXTB: [0.0, 38.0, 1.25, 38.0, 1.50, 34.0, 1.75, 28.0, 2.0, 28.0],
        CVL: 0.685, CVO: 0.709, CVR: 0.694, CVS: 0.662,
        Q10: 2.0, RML: 0.030, RMO: 0.015, RMR: 0.015, RMS: 0.015,
      }
    };
    return parameters[cropType as keyof typeof parameters] || parameters.cereals;
  }

  private initializeState(): ModelState {
    return {
      day: 0,
      developmentStage: 0.0,
      leafAreaIndex: 0.0,
      totalBiomass: 0.0,
      grainYield: 0.0,
      rootDepth: 0.1,
      waterStress: 1.0,
      nitrogenStress: 1.0,
      temperature: 20,
      water: 25,
      fertilizer: 150,
      humidity: 60,
      windSpeed: 2
    };
  }

  public simulate(
    day: number,
    temperature: number,
    water: number,
    fertilizer: number,
    humidity: number,
    windSpeed: number,
    soilPh?: number,
    soilNitrogen?: number
  ): ModelState {
    this.state.day = day;
    this.state.temperature = temperature;
    this.state.water = water;
    this.state.fertilizer = fertilizer;
    this.state.humidity = humidity;
    this.state.windSpeed = windSpeed;
    if (soilPh !== undefined) this.soil.pH = soilPh;
    if (soilNitrogen !== undefined) this.soil.nitrogenContent = soilNitrogen;

    // Calculate development stage based on temperature sum
    this.calculateDevelopmentStage();
    
    // Calculate stress factors
    this.calculateStressFactors();
    
    // Calculate leaf area index
    this.calculateLeafAreaIndex();
    
    // Calculate biomass accumulation
    this.calculateBiomassAccumulation();
    
    // Calculate grain yield
    this.calculateGrainYield();
    
    // Update root depth
    this.updateRootDepth();

    return { ...this.state };
  }

  private calculateDevelopmentStage(): void {
    // FIXED: More realistic development stage calculation based on days and temperature
    const effectiveTemp = Math.max(0, this.state.temperature - this.parameters.TBASEM);
    const tempSum = effectiveTemp * this.state.day;
    
    // Apply stress factors to slow development
    const stressEffect = Math.min(this.state.waterStress, this.state.nitrogenStress);
    const adjustedTempSum = tempSum * (0.5 + 0.5 * stressEffect);
    
    if (adjustedTempSum < this.parameters.TSUMEM) {
      // Germination phase (BBCH 00-09)
      this.state.developmentStage = adjustedTempSum / this.parameters.TSUMEM * 0.09;
    } else if (adjustedTempSum < this.parameters.TSUM1) {
      // Vegetative phase (BBCH 10-59)
      const vegetativeProgress = (adjustedTempSum - this.parameters.TSUMEM) / this.parameters.TSUM1;
      this.state.developmentStage = 0.09 + vegetativeProgress * 0.91;
    } else if (adjustedTempSum < this.parameters.TSUM1 + this.parameters.TSUM2) {
      // Reproductive phase (BBCH 60-89)
      const reproductiveProgress = (adjustedTempSum - this.parameters.TSUM1) / this.parameters.TSUM2;
      this.state.developmentStage = 1.0 + reproductiveProgress * 1.0;
    } else {
      // Maturity (BBCH 90+)
      this.state.developmentStage = 2.0;
    }
  }

  private calculateStressFactors(): void {
    // Water stress calculation (add wind/humidity effect)
    const optimalWater = 30;
    const minWater = 10;
    let evapFactor = 1.0;
    if (this.state.windSpeed > 5) evapFactor += 0.2; // more evaporation
    if (this.state.humidity > 80) evapFactor -= 0.2; // less evaporation
    if (this.state.water >= optimalWater * evapFactor) {
      this.state.waterStress = 1.0;
    } else if (this.state.water <= minWater) {
      this.state.waterStress = 0.1;
    } else {
      this.state.waterStress = 0.1 + 0.9 * (this.state.water - minWater) / (optimalWater * evapFactor - minWater);
    }

    // Nitrogen stress calculation
    const optimalFertilizer = 200;
    const minFertilizer = 50;
    if (this.state.fertilizer >= optimalFertilizer) {
      this.state.nitrogenStress = 1.0;
    } else if (this.state.fertilizer <= minFertilizer) {
      this.state.nitrogenStress = 0.3;
    } else {
      this.state.nitrogenStress = 0.3 + 0.7 * (this.state.fertilizer - minFertilizer) / (optimalFertilizer - minFertilizer);
    }
  }

  private calculateLeafAreaIndex(): void {
    const soilPhEffect = this.getSoilPhEffect(this.soil.pH);
    const soilNitrogenEffect = this.getSoilNitrogenEffect(this.soil.nitrogenContent);
    if (this.state.developmentStage < 0.1) {
      this.state.leafAreaIndex = 0.0;
    } else if (this.state.developmentStage < 1.0) {
      // Vegetative growth
      const maxLAI = 6.0 * this.state.waterStress * this.state.nitrogenStress * soilPhEffect * soilNitrogenEffect;
      this.state.leafAreaIndex = maxLAI * Math.sin(Math.PI * (this.state.developmentStage - 0.1) / 0.9);
    } else if (this.state.developmentStage < 1.5) {
      // Maintain LAI during early reproductive
      const maxLAI = 6.0 * this.state.waterStress * this.state.nitrogenStress * soilPhEffect * soilNitrogenEffect;
      this.state.leafAreaIndex = maxLAI;
    } else {
      // Senescence
      const maxLAI = 6.0 * this.state.waterStress * this.state.nitrogenStress * soilPhEffect * soilNitrogenEffect;
      const senescenceFactor = Math.max(0, 1 - (this.state.developmentStage - 1.5) / 0.5);
      this.state.leafAreaIndex = maxLAI * senescenceFactor;
    }
  }

  private calculateBiomassAccumulation(): void {
    if (this.state.developmentStage < 0.1) {
      this.state.totalBiomass = 0.1;
      return;
    }

    // Light interception
    const lightInterception = 1 - Math.exp(-0.65 * this.state.leafAreaIndex);
    
    // Temperature effect on photosynthesis
    const tempEffect = this.getTemperatureEffect(this.state.temperature);

    // Soil effects
    const soilPhEffect = this.getSoilPhEffect(this.soil.pH);
    const soilNitrogenEffect = this.getSoilNitrogenEffect(this.soil.nitrogenContent);
    
    // Daily photosynthesis (simplified)
    const dailyPhotosynthesis = 40 * lightInterception * tempEffect * this.state.waterStress * this.state.nitrogenStress * soilPhEffect * soilNitrogenEffect;
    
    // Maintenance respiration
    const maintenanceResp = this.state.totalBiomass * 0.015 * Math.pow(this.parameters.Q10, (this.state.temperature - 25) / 10);
    
    // Net biomass accumulation
    const netGrowth = Math.max(0, dailyPhotosynthesis - maintenanceResp);
    this.state.totalBiomass += netGrowth;
  }

  private calculateGrainYield(): void {
    const soilPhEffect = this.getSoilPhEffect(this.soil.pH);
    const soilNitrogenEffect = this.getSoilNitrogenEffect(this.soil.nitrogenContent);
    if (this.state.developmentStage < 1.0) {
      this.state.grainYield = 0.0;
    } else {
      // Harvest index increases during grain filling
      const harvestIndex = Math.min(0.5, (this.state.developmentStage - 1.0) * 0.5);
      this.state.grainYield = this.state.totalBiomass * harvestIndex * soilPhEffect * soilNitrogenEffect;
    }
  }

  private updateRootDepth(): void {
    const maxRootDepth = 1.5; // meters
    if (this.state.developmentStage < 1.0) {
      this.state.rootDepth = Math.min(maxRootDepth, 0.1 + this.state.developmentStage * 1.4);
    } else {
      this.state.rootDepth = maxRootDepth;
    }
  }

  private getTemperatureEffect(temperature: number): number {
    // Temperature response curve for photosynthesis
    if (temperature < 5) return 0.0;
    if (temperature < 15) return (temperature - 5) / 10 * 0.5;
    if (temperature < 25) return 0.5 + (temperature - 15) / 10 * 0.5;
    if (temperature < 35) return 1.0;
    if (temperature < 45) return 1.0 - (temperature - 35) / 10 * 0.8;
    return 0.2;
  }

  public getBBCHStage(): string {
    // FIXED: More accurate BBCH stage mapping based on development stage
    const devStage = this.state.developmentStage;
    
    // Germination stages (BBCH 00-09)
    if (devStage < 0.01) return "00"; // Dry seed
    if (devStage < 0.02) return "01"; // Beginning of imbibition
    if (devStage < 0.03) return "03"; // Imbibition complete
    if (devStage < 0.05) return "05"; // Radicle emerged
    if (devStage < 0.07) return "07"; // Coleoptile emerged
    if (devStage < 0.09) return "09"; // Emergence
    
    // Leaf development (BBCH 10-19)
    if (devStage < 0.15) return "10"; // First leaf
    if (devStage < 0.20) return "11"; // First leaf unfolded
    if (devStage < 0.25) return "12"; // 2 leaves
    if (devStage < 0.30) return "13"; // 3 leaves
    if (devStage < 0.35) return "14"; // 4 leaves
    if (devStage < 0.40) return "15"; // 5 leaves
    if (devStage < 0.45) return "16"; // 6 leaves
    if (devStage < 0.50) return "17"; // 7 leaves
    if (devStage < 0.55) return "18"; // 8 leaves
    if (devStage < 0.60) return "19"; // 9+ leaves
    
    // Tillering/Branching (BBCH 21-29)
    if (devStage < 0.65) return "21"; // First tiller
    if (devStage < 0.70) return "25"; // 5 tillers
    if (devStage < 0.75) return "29"; // End of tillering
    
    // Stem elongation (BBCH 30-39)
    if (devStage < 0.80) return "30"; // Beginning stem elongation
    if (devStage < 0.85) return "32"; // 2nd node
    if (devStage < 0.90) return "37"; // Flag leaf visible
    if (devStage < 0.95) return "39"; // Flag leaf ligule visible
    
    // Booting/Heading (BBCH 41-59)
    if (devStage < 1.0) return "45";  // Boot swollen
    if (devStage < 1.05) return "51"; // Beginning heading
    if (devStage < 1.10) return "55"; // Mid heading
    if (devStage < 1.15) return "59"; // End heading
    
    // Flowering (BBCH 61-69)
    if (devStage < 1.20) return "61"; // Beginning flowering
    if (devStage < 1.25) return "65"; // Full flowering
    if (devStage < 1.30) return "69"; // End flowering
    
    // Fruit development (BBCH 71-79)
    if (devStage < 1.40) return "71"; // Watery ripe
    if (devStage < 1.50) return "73"; // Early milk
    if (devStage < 1.60) return "75"; // Medium milk
    if (devStage < 1.70) return "77"; // Late milk
    
    // Ripening (BBCH 83-89)
    if (devStage < 1.80) return "83"; // Early dough
    if (devStage < 1.90) return "85"; // Soft dough
    if (devStage < 2.0) return "87";  // Hard dough
    if (devStage < 2.1) return "89";  // Fully ripe
    
    // Senescence (BBCH 92+)
    if (devStage < 2.2) return "92";  // Over-ripe
    return "99"; // Harvest
  }

  public getYieldPrediction(): number {
    // Final yield prediction in tons/ha
    const finalBiomass = this.state.totalBiomass * 10; // Convert to tons/ha
    const harvestIndex = 0.45; // Typical harvest index
    let yieldVal = finalBiomass * harvestIndex * this.state.waterStress * this.state.nitrogenStress;
    // Soil effects
    const soilPhEffect = this.getSoilPhEffect(this.soil.pH);
    const soilNitrogenEffect = this.getSoilNitrogenEffect(this.soil.nitrogenContent);
    yieldVal *= soilPhEffect * soilNitrogenEffect;
    // Humidity effect (disease risk)
    if (this.state.humidity > 80) yieldVal *= 0.9;
    // Wind effect
    if (this.state.windSpeed >= 2 && this.state.windSpeed <= 5) yieldVal *= 1.05; // pollination
    if (this.state.windSpeed > 8) yieldVal *= 0.9; // erosion/drift
    return yieldVal;
  }

  public getStressIndicators() {
    return {
      waterStress: this.state.waterStress,
      nitrogenStress: this.state.nitrogenStress,
      temperatureStress: this.getTemperatureEffect(this.state.temperature),
      humidity: this.state.humidity,
      windSpeed: this.state.windSpeed,
      diseaseRisk: this.getDiseaseRisk()
    };
  }

  /**
   * Simulate the crop from planting to maturity under optimal conditions and return the potential yield.
   * This does not affect the current model state.
   */
  public static getOptimalParameters() {
    return {
      temperature: 28,
      water: 30,
      fertilizer: 200,
      humidity: 60,
      windSpeed: 2
    };
  }

  public getOptimalYieldPrediction(): number {
    const originalState = { ...this.state };
    const originalSoil = { ...this.soil };
    this.state = this.initializeState();
    const optimal = PCSeModel.getOptimalParameters();
    // Use optimal soil conditions
    this.soil = {
      waterContent: 30,
      nitrogenContent: 0.3,
      phosphorusContent: 0.1,
      potassiumContent: 0.2,
      pH: 6.5,
      organicMatter: 2.0
    };
    let day = 0;
    let mature = false;
    while (!mature && day < 200) {
      this.simulate(day, optimal.temperature, optimal.water, optimal.fertilizer, optimal.humidity, optimal.windSpeed);
      mature = this.state.developmentStage >= 2.0;
      day++;
    }
    const potentialYield = this.getYieldPrediction();
    this.state = originalState;
    this.soil = originalSoil;
    return potentialYield;
  }

  public getDiseaseRisk(): 'low' | 'moderate' | 'high' {
    if (this.state.humidity > 80) return 'high';
    if (this.state.humidity >= 60) return 'moderate';
    return 'low';
  }

  public getIrrigationRecommendation(): string {
    if (this.state.humidity > 80) return 'Reduce irrigation; high humidity reduces evaporation.';
    if (this.state.windSpeed > 5) return 'Increase irrigation; high wind increases evaporation.';
    return 'Maintain normal irrigation.';
  }

  public getFertilizerRecommendation(): string {
    if (this.state.windSpeed > 8) return 'Delay fertilizer application; high wind causes drift.';
    if (this.state.windSpeed > 5) return 'Apply fertilizer with caution; moderate wind may cause some drift.';
    return 'Apply fertilizer as planned.';
  }

  public getDiseasePreventionRecommendation(): string {
    if (this.state.humidity > 80) return 'High risk of fungal disease: Use fungicides/preventive measures.';
    if (this.state.humidity >= 60) return 'Monitor for disease; moderate risk.';
    return 'Low disease risk; standard monitoring.';
  }

  // Debug: Log BBCH progression for a crop
  public static logBBCHProgression(crop: string, parameters: { temperature: number, water: number, fertilizer: number, humidity: number, windSpeed: number }) {
    const model = new PCSeModel(crop);
    let day = 0;
    let mature = false;
    console.log(`BBCH progression for ${crop} (temp=${parameters.temperature}, water=${parameters.water}, fert=${parameters.fertilizer}):`);
    while (!mature && day < 150) {
      model.simulate(day, parameters.temperature, parameters.water, parameters.fertilizer, parameters.humidity, parameters.windSpeed, undefined, undefined);
      const bbch = model.getBBCHStage();
      const devStage = model.state.developmentStage;
      console.log(`Day ${day}: BBCH ${bbch}, DevStage ${devStage.toFixed(2)}`);
      if (parseInt(bbch) >= 87 || devStage >= 2.0) mature = true;
      day++;
    }
  }

  // Soil pH effect: optimal at 6.5, penalty for deviation
  private getSoilPhEffect(pH: number): number {
    const optimalPh = 6.5;
    const deviation = Math.abs(pH - optimalPh);
    if (deviation <= 0.5) return 1.0;
    if (deviation <= 1.0) return 0.85;
    if (deviation <= 1.5) return 0.7;
    if (deviation <= 2.0) return 0.5;
    return 0.3; // severe penalty
  }

  // Soil nitrogen effect: optimal at 0.3%, penalty for deficiency
  private getSoilNitrogenEffect(nitrogenContent: number): number {
    const optimalNitrogen = 0.3; // percent
    if (nitrogenContent >= optimalNitrogen) return 1.0;
    if (nitrogenContent >= 0.2) return 0.75;
    if (nitrogenContent >= 0.1) return 0.5;
    return 0.3; // severe deficiency
  }
}