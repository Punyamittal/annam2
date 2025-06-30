/**
 * Utility functions for formatting data in the GreenGuardian app
 */

/**
 * Formats a risk score (0-100) into a descriptive category
 * @param score - Numerical risk score between 0-100
 * @returns Risk category as string
 */
export const formatRiskScore = (score: number): string => {
  if (score >= 80) return 'low';
  if (score >= 50) return 'medium';
  return 'high';
};

/**
 * Formats a date object into a human-readable string
 * @param date - Date object to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

/**
 * Formats AQI (Air Quality Index) value with appropriate label
 * @param aqi - Air Quality Index value
 * @returns Object containing formatted value and label
 */
export const formatAQI = (aqi: number): { value: number; label: string; color: string } => {
  if (aqi <= 50) {
    return { value: aqi, label: 'Good', color: '#00e400' };
  } else if (aqi <= 100) {
    return { value: aqi, label: 'Moderate', color: '#ffff00' };
  } else if (aqi <= 150) {
    return { value: aqi, label: 'Unhealthy for Sensitive Groups', color: '#ff7e00' };
  } else if (aqi <= 200) {
    return { value: aqi, label: 'Unhealthy', color: '#ff0000' };
  } else if (aqi <= 300) {
    return { value: aqi, label: 'Very Unhealthy', color: '#99004c' };
  } else {
    return { value: aqi, label: 'Hazardous', color: '#7e0023' };
  }
};

/**
 * Formats UV index with appropriate risk level
 * @param uvIndex - UV index value (typically 0-11+)
 * @returns Object containing formatted value and risk level
 */
export const formatUVIndex = (uvIndex: number): { value: number; risk: string; color: string } => {
  if (uvIndex <= 2) {
    return { value: uvIndex, risk: 'Low', color: '#299501' };
  } else if (uvIndex <= 5) {
    return { value: uvIndex, risk: 'Moderate', color: '#f7e401' };
  } else if (uvIndex <= 7) {
    return { value: uvIndex, risk: 'High', color: '#f95901' };
  } else if (uvIndex <= 10) {
    return { value: uvIndex, risk: 'Very High', color: '#d90011' };
  } else {
    return { value: uvIndex, risk: 'Extreme', color: '#6c49cb' };
  }
};
