const WEATHER_API_KEY = 'faf1b6f8f3aa495a8a9213010253006';
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    humidity: number;
    wind_kph: number;
    wind_mph: number;
    condition: {
      text: string;
      icon: string;
    };
    feelslike_c: number;
    uv: number;
    pressure_mb: number;
    precip_mm: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        avghumidity: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        humidity: number;
        wind_kph: number;
        condition: {
          text: string;
          icon: string;
        };
      }>;
    }>;
  };
}

export interface SimulationWeatherParams {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
}

export class WeatherService {
  private static instance: WeatherService;
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  private constructor() {}

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(location: string): Promise<WeatherData> {
    const cacheKey = `current_${location}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${WEATHER_API_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data: WeatherData = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getWeatherForecast(location: string, days: number = 7): Promise<WeatherData> {
    const cacheKey = `forecast_${location}_${days}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=${days}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data: WeatherData = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }

  extractSimulationParams(weatherData: WeatherData): SimulationWeatherParams {
    return {
      temperature: weatherData.current.temp_c,
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.wind_kph / 3.6, // Convert km/h to m/s
      precipitation: weatherData.current.precip_mm,
      uvIndex: weatherData.current.uv
    };
  }

  getWeatherDescription(weatherData: WeatherData): string {
    return weatherData.current.condition.text;
  }

  getWeatherIcon(weatherData: WeatherData): string {
    return weatherData.current.condition.icon;
  }

  // Get weather data for a specific day in the forecast
  getDayForecast(weatherData: WeatherData, dayOffset: number = 0): SimulationWeatherParams | null {
    if (!weatherData.forecast || !weatherData.forecast.forecastday[dayOffset]) {
      return null;
    }

    const dayData = weatherData.forecast.forecastday[dayOffset].day;
    
    return {
      temperature: dayData.avgtemp_c,
      humidity: dayData.avghumidity,
      windSpeed: dayData.maxwind_kph / 3.6, // Convert km/h to m/s
      precipitation: dayData.totalprecip_mm,
      uvIndex: 5 // Default UV index for forecast data
    };
  }

  // Get hourly weather data for a specific day
  getHourlyForecast(weatherData: WeatherData, dayOffset: number = 0): SimulationWeatherParams[] {
    if (!weatherData.forecast || !weatherData.forecast.forecastday[dayOffset]) {
      return [];
    }

    return weatherData.forecast.forecastday[dayOffset].hour.map(hour => ({
      temperature: hour.temp_c,
      humidity: hour.humidity,
      windSpeed: hour.wind_kph / 3.6, // Convert km/h to m/s
      precipitation: 0, // Hourly precipitation not available in this format
      uvIndex: 5 // Default UV index for hourly data
    }));
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
}

export default WeatherService.getInstance(); 