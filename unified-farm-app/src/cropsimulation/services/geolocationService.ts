export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationData {
  name: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export class GeolocationService {
  private static instance: GeolocationService;
  private cache: Map<string, LocationData> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {}

  public static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  // Get current position using browser geolocation
  async getCurrentPosition(): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  // Convert coordinates to location name using reverse geocoding
  async getLocationFromCoordinates(lat: number, lon: number): Promise<LocationData> {
    const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      
      const locationData: LocationData = {
        name: data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown City',
        region: data.address?.state || data.address?.province || '',
        country: data.address?.country || 'Unknown Country',
        coordinates: {
          lat: parseFloat(data.lat),
          lon: parseFloat(data.lon)
        }
      };

      // Cache the result
      this.cache.set(cacheKey, locationData);
      
      return locationData;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      // Fallback to coordinates if geocoding fails
      return {
        name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        region: '',
        country: 'Unknown',
        coordinates: { lat, lon }
      };
    }
  }

  // Get current location with name
  async getCurrentLocation(): Promise<LocationData> {
    try {
      const position = await this.getCurrentPosition();
      const location = await this.getLocationFromCoordinates(position.latitude, position.longitude);
      return location;
    } catch (error) {
      throw error;
    }
  }

  // Format location for display
  formatLocation(location: LocationData): string {
    const parts = [location.name];
    if (location.region && location.region !== location.name) {
      parts.push(location.region);
    }
    if (location.country && location.country !== 'Unknown') {
      parts.push(location.country);
    }
    return parts.join(', ');
  }

  // Check if geolocation is supported
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  // Check if location permission is granted
  async checkPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      // Try to get current position with a very short timeout
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { timeout: 1000, maximumAge: 0 }
        );
      });
      return true;
    } catch (error) {
      return false;
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
}

export default GeolocationService.getInstance(); 