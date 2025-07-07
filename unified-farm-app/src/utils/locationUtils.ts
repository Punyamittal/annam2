/**
 * Location utility functions for handling geolocation permissions and errors
 */

export interface LocationError {
  code: number;
  message: string;
  userGuidance: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

/**
 * Request location permission with user-friendly error handling
 */
export const requestLocationPermission = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const error: LocationError = {
        code: -1,
        message: 'Geolocation is not supported by this browser',
        userGuidance: 'Please use a modern browser with geolocation support like Chrome, Firefox, Safari, or Edge.'
      };
      reject(error);
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
        let userGuidance = '';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            userGuidance = 'To enable location access:\n\n' +
              '1. Click the location icon in your browser\'s address bar\n' +
              '2. Select "Allow" or "Always allow"\n' +
              '3. Refresh the page and try again\n\n' +
              'Alternatively, you can manually enter your location coordinates.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            userGuidance = 'Your device may not be able to determine your location. Please try:\n\n' +
              '1. Moving to an area with better GPS signal\n' +
              '2. Checking if your device\'s location services are enabled\n' +
              '3. Using manual location entry instead';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            userGuidance = 'The location request took too long. Please try:\n\n' +
              '1. Moving to an area with better GPS signal\n' +
              '2. Checking your internet connection\n' +
              '3. Using manual location entry instead';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location';
            userGuidance = 'Please try using manual location entry or contact support if the problem persists.';
        }
        
        const locationError: LocationError = {
          code: error.code,
          message: errorMessage,
          userGuidance
        };
        
        reject(locationError);
      },
      options
    );
  });
};

/**
 * Check if geolocation is supported by the browser
 */
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Check if location permission is granted (non-blocking)
 */
export const checkLocationPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!isGeolocationSupported()) {
      resolve(false);
      return;
    }

    // Try to get current position with a very short timeout
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 1000, maximumAge: 0 }
    );
  });
};

/**
 * Format location error for display
 */
export const formatLocationError = (error: LocationError): string => {
  return `${error.message}\n\n${error.userGuidance}`;
};

/**
 * Show user-friendly location error alert
 */
export const showLocationError = (error: LocationError): void => {
  const message = formatLocationError(error);
  alert(`Location Error\n\n${message}\n\nYou can still use the application with manual location settings.`);
};

/**
 * Get browser-specific location permission instructions
 */
export const getLocationPermissionInstructions = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome')) {
    return 'Chrome: Click the location icon in the address bar and select "Allow"';
  } else if (userAgent.includes('firefox')) {
    return 'Firefox: Click the location icon in the address bar and select "Allow"';
  } else if (userAgent.includes('safari')) {
    return 'Safari: Go to Safari > Preferences > Websites > Location and allow access';
  } else if (userAgent.includes('edge')) {
    return 'Edge: Click the location icon in the address bar and select "Allow"';
  } else {
    return 'Look for a location icon in your browser\'s address bar and click "Allow"';
  }
};

/**
 * Validate coordinates
 */
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}; 