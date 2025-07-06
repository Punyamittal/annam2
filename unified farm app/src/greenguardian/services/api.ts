import axios from 'axios';

// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface EnvironmentalData {
  airQuality: {
    aqi: number;
    pollutants: {
      pm25: number;
      pm10: number;
      o3: number;
      no2: number;
      so2: number;
      co: number;
    };
    category: string;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    precipitation: number;
    uvIndex: number;
  };
  soil: {
    soilPh: number;
    soilNitrogen: number;
  };
  risks: {
    level: 'low' | 'medium' | 'high';
    summary: string;
    recommendations: string[];
  };
  pollutionZones: Array<{
    id: string;
    lat: number;
    lng: number;
    radius: number;
    level: 'low' | 'medium' | 'high';
    description: string;
  }>;
}

export interface HistoricalData {
  airQuality: Array<{
    date: string;
    value: number;
  }>;
  temperature: Array<{
    date: string;
    value: number;
  }>;
  precipitation: Array<{
    date: string;
    value: number;
  }>;
  uvIndex: Array<{
    date: string;
    value: number;
  }>;
}

// API functions
export const getEnvironmentalData = async (lat: number, lng: number): Promise<EnvironmentalData> => {
  try {
    const response = await api.get<EnvironmentalData>(`/environmental-data?lat=${lat}&lng=${lng}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    throw error;
  }
};

export const getHistoricalData = async (lat: number, lng: number, days: number = 7): Promise<HistoricalData> => {
  try {
    const response = await api.get<HistoricalData>(`/historical-data?lat=${lat}&lng=${lng}&days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

export interface ChatMessage {
  role: string;
  content: string;
}

export const getChatResponse = async (
  messages: ChatMessage[], 
  location?: string, 
  userType: string = 'citizen'
): Promise<string> => {
  try {
    const response = await api.post<{ response: string }>('/api/chat', { 
      messages, 
      location,
      user_type: userType 
    });
    return response.data.response;
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error;
  }
};

export const saveLocation = async (name: string, lat: number, lng: number): Promise<{ id: string }> => {
  try {
    const response = await api.post<{ id: string }>('/locations', { name, lat, lng });
    return response.data;
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};

export const getSavedLocations = async (): Promise<Array<{ id: string; name: string; lat: number; lng: number }>> => {
  try {
    const response = await api.get<Array<{ id: string; name: string; lat: number; lng: number }>>('/locations');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    throw error;
  }
};

export default api;
