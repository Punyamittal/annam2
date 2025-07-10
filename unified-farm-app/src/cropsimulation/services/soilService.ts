export interface SoilClassificationData {
  classification: string;
  confidence: number;
  classes: Array<{
    class: string;
    percentage: number;
  }>;
  coordinates: {
    lat: number;
    lon: number;
  };
  timestamp: number;
}

export interface SoilParameters {
  soilType: string;
  soilPh: number;
  soilNitrogen: number;
  soilOrganicMatter: number;
  soilTexture: string;
  drainageClass: string;
}

export class SoilService {
  private static instance: SoilService;
  private cache: Map<string, SoilClassificationData> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly SOILGRIDS_API_BASE_URL = 'https://rest.isric.org/soilgrids/v2.0';

  private constructor() {}

  public static getInstance(): SoilService {
    if (!SoilService.instance) {
      SoilService.instance = new SoilService();
    }
    return SoilService.instance;
  }

  // Get soil classification data from ISRIC SoilGrids API
  async getSoilClassification(lat: number, lon: number, numberClasses: number = 5): Promise<SoilClassificationData> {
    const cacheKey = `soil_${lat.toFixed(4)}_${lon.toFixed(4)}_${numberClasses}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached;
    }

    try {
      const url = `${this.SOILGRIDS_API_BASE_URL}/query_layer/wrb_classification?lon=${lon}&lat=${lat}&number_classes=${numberClasses}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`SoilGrids API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the API response to our format
      const soilData: SoilClassificationData = {
        classification: data.classification || 'Unknown',
        confidence: data.confidence || 0,
        classes: data.classes || [],
        coordinates: {
          lat: lat,
          lon: lon
        },
        timestamp: Date.now()
      };

      // Cache the result
      this.cache.set(cacheKey, soilData);
      
      return soilData;
    } catch (error) {
      console.error('Error fetching soil classification data:', error);
      
      // Return fallback data if API fails
      return {
        classification: 'Unknown',
        confidence: 0,
        classes: [],
        coordinates: {
          lat: lat,
          lon: lon
        },
        timestamp: Date.now()
      };
    }
  }

  // Extract soil parameters for simulation based on soil classification
  extractSoilParameters(soilData: SoilClassificationData): SoilParameters {
    const classification = soilData.classification.toLowerCase();
    
    // Default values
    let soilPh = 7.0;
    let soilNitrogen = 50;
    let soilOrganicMatter = 2.0;
    let soilTexture = 'Loam';
    let drainageClass = 'Well drained';

    // Adjust parameters based on soil classification
    if (classification.includes('luvisol')) {
      soilPh = 6.5;
      soilNitrogen = 45;
      soilOrganicMatter = 1.8;
      soilTexture = 'Clay loam';
    } else if (classification.includes('cambisol')) {
      soilPh = 6.8;
      soilNitrogen = 55;
      soilOrganicMatter = 2.2;
      soilTexture = 'Loam';
    } else if (classification.includes('ferralsol')) {
      soilPh = 5.5;
      soilNitrogen = 35;
      soilOrganicMatter = 1.5;
      soilTexture = 'Clay';
      drainageClass = 'Moderately well drained';
    } else if (classification.includes('acrisol')) {
      soilPh = 5.2;
      soilNitrogen = 30;
      soilOrganicMatter = 1.2;
      soilTexture = 'Clay';
      drainageClass = 'Poorly drained';
    } else if (classification.includes('arenosol')) {
      soilPh = 6.0;
      soilNitrogen = 25;
      soilOrganicMatter = 0.8;
      soilTexture = 'Sandy';
      drainageClass = 'Excessively drained';
    } else if (classification.includes('vertisol')) {
      soilPh = 7.5;
      soilNitrogen = 60;
      soilOrganicMatter = 2.5;
      soilTexture = 'Clay';
      drainageClass = 'Moderately well drained';
    } else if (classification.includes('gleysol')) {
      soilPh = 6.2;
      soilNitrogen = 40;
      soilOrganicMatter = 1.8;
      soilTexture = 'Silty clay';
      drainageClass = 'Poorly drained';
    } else if (classification.includes('podzol')) {
      soilPh = 4.8;
      soilNitrogen = 20;
      soilOrganicMatter = 1.0;
      soilTexture = 'Sandy loam';
      drainageClass = 'Well drained';
    }

    return {
      soilType: soilData.classification,
      soilPh: soilPh,
      soilNitrogen: soilNitrogen,
      soilOrganicMatter: soilOrganicMatter,
      soilTexture: soilTexture,
      drainageClass: drainageClass
    };
  }

  // Get soil data for a specific location
  async getSoilDataForLocation(lat: number, lon: number): Promise<SoilParameters> {
    try {
      const soilClassification = await this.getSoilClassification(lat, lon);
      return this.extractSoilParameters(soilClassification);
    } catch (error) {
      console.error('Error getting soil data for location:', error);
      
      // Return default soil parameters
      return {
        soilType: 'Unknown',
        soilPh: 7.0,
        soilNitrogen: 50,
        soilOrganicMatter: 2.0,
        soilTexture: 'Loam',
        drainageClass: 'Well drained'
      };
    }
  }

  // Get soil data from location string (requires geocoding first)
  async getSoilDataFromLocation(locationString: string): Promise<SoilParameters> {
    try {
      // First, geocode the location to get coordinates
      const geocodingResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}&limit=1`
      );

      if (!geocodingResponse.ok) {
        throw new Error('Geocoding failed');
      }

      const geocodingData = await geocodingResponse.json();
      
      if (geocodingData.length === 0) {
        throw new Error('Location not found');
      }

      const lat = parseFloat(geocodingData[0].lat);
      const lon = parseFloat(geocodingData[0].lon);

      return await this.getSoilDataForLocation(lat, lon);
    } catch (error) {
      console.error('Error getting soil data from location string:', error);
      
      // Return default soil parameters
      return {
        soilType: 'Unknown',
        soilPh: 7.0,
        soilNitrogen: 50,
        soilOrganicMatter: 2.0,
        soilTexture: 'Loam',
        drainageClass: 'Well drained'
      };
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache status
  getCacheStatus(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  // Get soil type description
  getSoilTypeDescription(soilType: string): string {
    const descriptions: Record<string, string> = {
      'Luvisol': 'Deep, well-drained soils with clay accumulation in subsoil',
      'Cambisol': 'Young soils with moderate development and good fertility',
      'Ferralsol': 'Highly weathered tropical soils with low fertility',
      'Acrisol': 'Acidic tropical soils with clay accumulation',
      'Arenosol': 'Sandy soils with low water and nutrient holding capacity',
      'Vertisol': 'Clay-rich soils with high shrink-swell capacity',
      'Gleysol': 'Waterlogged soils with poor drainage',
      'Podzol': 'Acidic forest soils with distinct horizons'
    };

    return descriptions[soilType] || 'Soil type information not available';
  }

  // Get soil texture description
  getSoilTextureDescription(texture: string): string {
    const descriptions: Record<string, string> = {
      'Sandy': 'Coarse texture, drains quickly, low water retention',
      'Loam': 'Balanced texture, good drainage and water retention',
      'Clay': 'Fine texture, high water retention, can be poorly drained',
      'Clay loam': 'Medium-fine texture, good structure and fertility',
      'Silty clay': 'Fine texture with high water retention',
      'Sandy loam': 'Medium texture with good drainage'
    };

    return descriptions[texture] || 'Soil texture information not available';
  }

  // Convert soil nitrogen from mg/kg to percentage for PCSE model
  convertNitrogenForPCSE(nitrogenMgKg: number): number {
    // Convert mg/kg to percentage (divide by 10000)
    return nitrogenMgKg / 10000;
  }

  // Get soil parameters optimized for PCSE model
  getPCSEOptimizedParameters(soilData: SoilParameters): { soilPh: number; soilNitrogenPercent: number } {
    return {
      soilPh: soilData.soilPh,
      soilNitrogenPercent: this.convertNitrogenForPCSE(soilData.soilNitrogen)
    };
  }
}

export default SoilService.getInstance(); 