// Geocoding service for GreenGuardian
// This service provides functions to convert location names to coordinates and vice versa

// Type definitions
export interface GeocodingResult {
  name: string;
  lat: number;
  lng: number;
  country?: string;
  state?: string;
  city?: string;
  confidence: number; // 0-1 value representing confidence in the result
}

// Mock geocoding database for demo purposes
// In a production app, this would be replaced with a real geocoding API like Google Maps, Mapbox, or OpenStreetMap
const locationDatabase: Record<string, [number, number, string]> = {
  // Indian States and Major Cities
  "karnataka": [15.3173, 75.7139, "Karnataka, India"],
  "bengaluru": [12.9716, 77.5946, "Bengaluru, Karnataka, India"],
  "bangalore": [12.9716, 77.5946, "Bengaluru, Karnataka, India"],
  "mysore": [12.2958, 76.6394, "Mysore, Karnataka, India"],
  "mysuru": [12.2958, 76.6394, "Mysore, Karnataka, India"],
  "mangalore": [12.9141, 74.8560, "Mangalore, Karnataka, India"],
  "mangaluru": [12.9141, 74.8560, "Mangalore, Karnataka, India"],
  "hubli": [15.3647, 75.1240, "Hubli, Karnataka, India"],
  "hubballi": [15.3647, 75.1240, "Hubli, Karnataka, India"],
  "delhi": [28.7041, 77.1025, "Delhi, India"],
  "new delhi": [28.6139, 77.2090, "New Delhi, India"],
  "mumbai": [19.0760, 72.8777, "Mumbai, Maharashtra, India"],
  "bombay": [19.0760, 72.8777, "Mumbai, Maharashtra, India"],
  "kolkata": [22.5726, 88.3639, "Kolkata, West Bengal, India"],
  "calcutta": [22.5726, 88.3639, "Kolkata, West Bengal, India"],
  "chennai": [13.0827, 80.2707, "Chennai, Tamil Nadu, India"],
  "madras": [13.0827, 80.2707, "Chennai, Tamil Nadu, India"],
  "hyderabad": [17.3850, 78.4867, "Hyderabad, Telangana, India"],
  "ahmedabad": [23.0225, 72.5714, "Ahmedabad, Gujarat, India"],
  "pune": [18.5204, 73.8567, "Pune, Maharashtra, India"],
  "surat": [21.1702, 72.8311, "Surat, Gujarat, India"],
  "lucknow": [26.8467, 80.9462, "Lucknow, Uttar Pradesh, India"],
  "jaipur": [26.9124, 75.7873, "Jaipur, Rajasthan, India"],
  "kanpur": [26.4499, 80.3319, "Kanpur, Uttar Pradesh, India"],
  "nagpur": [21.1458, 79.0882, "Nagpur, Maharashtra, India"],
  "indore": [22.7196, 75.8577, "Indore, Madhya Pradesh, India"],
  "thane": [19.2183, 72.9781, "Thane, Maharashtra, India"],
  "bhopal": [23.2599, 77.4126, "Bhopal, Madhya Pradesh, India"],
  "visakhapatnam": [17.6868, 83.2185, "Visakhapatnam, Andhra Pradesh, India"],
  "vizag": [17.6868, 83.2185, "Visakhapatnam, Andhra Pradesh, India"],
  "patna": [25.5941, 85.1376, "Patna, Bihar, India"],
  "vadodara": [22.3072, 73.1812, "Vadodara, Gujarat, India"],
  "baroda": [22.3072, 73.1812, "Vadodara, Gujarat, India"],
  "ghaziabad": [28.6692, 77.4538, "Ghaziabad, Uttar Pradesh, India"],
  "ludhiana": [30.9010, 75.8573, "Ludhiana, Punjab, India"],
  "agra": [27.1767, 78.0081, "Agra, Uttar Pradesh, India"],
  "nashik": [19.9975, 73.7898, "Nashik, Maharashtra, India"],
  "faridabad": [28.4089, 77.3178, "Faridabad, Haryana, India"],
  "meerut": [28.9845, 77.7064, "Meerut, Uttar Pradesh, India"],
  "rajkot": [22.3039, 70.8022, "Rajkot, Gujarat, India"],
  "varanasi": [25.3176, 82.9739, "Varanasi, Uttar Pradesh, India"],
  "benares": [25.3176, 82.9739, "Varanasi, Uttar Pradesh, India"],
  "kashi": [25.3176, 82.9739, "Varanasi, Uttar Pradesh, India"],
  "srinagar": [34.0837, 74.7973, "Srinagar, Jammu and Kashmir, India"],
  "aurangabad": [19.8762, 75.3433, "Aurangabad, Maharashtra, India"],
  "dhanbad": [23.7957, 86.4304, "Dhanbad, Jharkhand, India"],
  "amritsar": [31.6340, 74.8723, "Amritsar, Punjab, India"],
  "allahabad": [25.4358, 81.8463, "Prayagraj, Uttar Pradesh, India"],
  "prayagraj": [25.4358, 81.8463, "Prayagraj, Uttar Pradesh, India"],
  "ranchi": [23.3441, 85.3096, "Ranchi, Jharkhand, India"],
  "howrah": [22.5958, 88.2636, "Howrah, West Bengal, India"],
  "coimbatore": [11.0168, 76.9558, "Coimbatore, Tamil Nadu, India"],
  "kovai": [11.0168, 76.9558, "Coimbatore, Tamil Nadu, India"],
  "jabalpur": [23.1815, 79.9864, "Jabalpur, Madhya Pradesh, India"],
  "gwalior": [26.2183, 78.1828, "Gwalior, Madhya Pradesh, India"],
  "vijayawada": [16.5062, 80.6480, "Vijayawada, Andhra Pradesh, India"],
  "jodhpur": [26.2389, 73.0243, "Jodhpur, Rajasthan, India"],
  "madurai": [9.9252, 78.1198, "Madurai, Tamil Nadu, India"],
  "raipur": [21.2514, 81.6296, "Raipur, Chhattisgarh, India"],
  "kochi": [9.9312, 76.2673, "Kochi, Kerala, India"],
  "cochin": [9.9312, 76.2673, "Kochi, Kerala, India"],
  "chandigarh": [30.7333, 76.7794, "Chandigarh, India"],
  "guwahati": [26.1445, 91.7362, "Guwahati, Assam, India"],
  "bhubaneswar": [20.2961, 85.8245, "Bhubaneswar, Odisha, India"],
  "dehradun": [30.3165, 78.0322, "Dehradun, Uttarakhand, India"],
  "pondicherry": [11.9416, 79.8083, "Puducherry, India"],
  "puducherry": [11.9416, 79.8083, "Puducherry, India"],
  "trivandrum": [8.5241, 76.9366, "Thiruvananthapuram, Kerala, India"],
  "thiruvananthapuram": [8.5241, 76.9366, "Thiruvananthapuram, Kerala, India"],
  "shimla": [31.1048, 77.1734, "Shimla, Himachal Pradesh, India"],
  "gangtok": [27.3389, 88.6065, "Gangtok, Sikkim, India"],
  "panaji": [15.4909, 73.8278, "Panaji, Goa, India"],
  "itanagar": [27.0844, 93.6053, "Itanagar, Arunachal Pradesh, India"],
  "dispur": [26.1433, 91.7898, "Dispur, Assam, India"],
  "shillong": [25.5788, 91.8933, "Shillong, Meghalaya, India"],
  "silvassa": [20.2735, 73.0080, "Silvassa, Dadra and Nagar Haveli, India"],
  "daman": [20.3974, 72.8328, "Daman, Daman and Diu, India"],
  "kavaratti": [10.5593, 72.6358, "Kavaratti, Lakshadweep, India"],
  "port blair": [11.6234, 92.7265, "Port Blair, Andaman and Nicobar Islands, India"],
  
  // Indian States
  "andhra pradesh": [15.9129, 79.7400, "Andhra Pradesh, India"],
  "arunachal pradesh": [28.2180, 94.7278, "Arunachal Pradesh, India"],
  "assam": [26.2006, 92.9376, "Assam, India"],
  "bihar": [25.0961, 85.3131, "Bihar, India"],
  "chhattisgarh": [21.2787, 81.8661, "Chhattisgarh, India"],
  "goa": [15.2993, 74.1240, "Goa, India"],
  "gujarat": [22.2587, 71.1924, "Gujarat, India"],
  "haryana": [29.0588, 76.0856, "Haryana, India"],
  "himachal pradesh": [31.1048, 77.1734, "Himachal Pradesh, India"],
  "jharkhand": [23.6102, 85.2799, "Jharkhand, India"],
  "kerala": [10.8505, 76.2711, "Kerala, India"],
  "madhya pradesh": [22.9734, 78.6569, "Madhya Pradesh, India"],
  "maharashtra": [19.7515, 75.7139, "Maharashtra, India"],
  "manipur": [24.6637, 93.9063, "Manipur, India"],
  "meghalaya": [25.4670, 91.3662, "Meghalaya, India"],
  "mizoram": [23.1645, 92.9376, "Mizoram, India"],
  "nagaland": [26.1584, 94.5624, "Nagaland, India"],
  "odisha": [20.9517, 85.0985, "Odisha, India"],
  "orissa": [20.9517, 85.0985, "Odisha, India"],
  "punjab": [31.1471, 75.3412, "Punjab, India"],
  "rajasthan": [27.0238, 74.2179, "Rajasthan, India"],
  "sikkim": [27.5330, 88.5122, "Sikkim, India"],
  "tamil nadu": [11.1271, 78.6569, "Tamil Nadu, India"],
  "telangana": [18.1124, 79.0193, "Telangana, India"],
  "tripura": [23.9408, 91.9882, "Tripura, India"],
  "uttar pradesh": [26.8467, 80.9462, "Uttar Pradesh, India"],
  "uttarakhand": [30.0668, 79.0193, "Uttarakhand, India"],
  "west bengal": [22.9868, 87.8550, "West Bengal, India"],
  
  // US Cities
  "new york": [40.7128, -74.0060, "New York, NY, USA"],
  "nyc": [40.7128, -74.0060, "New York, NY, USA"],
  "los angeles": [34.0522, -118.2437, "Los Angeles, CA, USA"],
  "la": [34.0522, -118.2437, "Los Angeles, CA, USA"],
  "chicago": [41.8781, -87.6298, "Chicago, IL, USA"],
  "houston": [29.7604, -95.3698, "Houston, TX, USA"],
  "phoenix": [33.4484, -112.0740, "Phoenix, AZ, USA"],
  "philadelphia": [39.9526, -75.1652, "Philadelphia, PA, USA"],
  "san antonio": [29.4241, -98.4936, "San Antonio, TX, USA"],
  "san diego": [32.7157, -117.1611, "San Diego, CA, USA"],
  "dallas": [32.7767, -96.7970, "Dallas, TX, USA"],
  "san jose": [37.3382, -121.8863, "San Jose, CA, USA"],
  "austin": [30.2672, -97.7431, "Austin, TX, USA"],
  "jacksonville": [30.3322, -81.6557, "Jacksonville, FL, USA"],
  "fort worth": [32.7555, -97.3308, "Fort Worth, TX, USA"],
  "columbus": [39.9612, -82.9988, "Columbus, OH, USA"],
  "san francisco": [37.7749, -122.4194, "San Francisco, CA, USA"],
  "sf": [37.7749, -122.4194, "San Francisco, CA, USA"],
  "charlotte": [35.2271, -80.8431, "Charlotte, NC, USA"],
  "indianapolis": [39.7684, -86.1581, "Indianapolis, IN, USA"],
  "seattle": [47.6062, -122.3321, "Seattle, WA, USA"],
  "denver": [39.7392, -104.9903, "Denver, CO, USA"],
  "washington dc": [38.9072, -77.0369, "Washington, DC, USA"],
  "washington": [38.9072, -77.0369, "Washington, DC, USA"],
  "boston": [42.3601, -71.0589, "Boston, MA, USA"],
  
  // International Cities
  "london": [51.5074, -0.1278, "London, UK"],
  "paris": [48.8566, 2.3522, "Paris, France"],
  "tokyo": [35.6762, 139.6503, "Tokyo, Japan"],
  "beijing": [39.9042, 116.4074, "Beijing, China"],
  "moscow": [55.7558, 37.6173, "Moscow, Russia"],
  "dubai": [25.2048, 55.2708, "Dubai, UAE"],
  "singapore": [1.3521, 103.8198, "Singapore"],
  "sydney": [-33.8688, 151.2093, "Sydney, Australia"],
  "rio de janeiro": [-22.9068, -43.1729, "Rio de Janeiro, Brazil"],
  "rio": [-22.9068, -43.1729, "Rio de Janeiro, Brazil"],
  "cape town": [-33.9249, 18.4241, "Cape Town, South Africa"],
  "cairo": [30.0444, 31.2357, "Cairo, Egypt"],
  "toronto": [43.6532, -79.3832, "Toronto, Canada"],
  "mexico city": [19.4326, -99.1332, "Mexico City, Mexico"],
  
  // Default locations
  "farm": [40.6782, -73.9442, "Farm"],
  "home": [40.7128, -74.0060, "Home"],
  "work": [40.7484, -73.9857, "Work"]
};

// Function to geocode a location name to coordinates
export const geocodeLocation = async (locationName: string): Promise<GeocodingResult | null> => {
  try {
    const normalizedName = locationName.trim().toLowerCase();
    
    // Check if the location exists in our database
    if (locationDatabase[normalizedName]) {
      const [lat, lng, formattedName] = locationDatabase[normalizedName];
      
      return {
        name: formattedName || locationName,
        lat,
        lng,
        confidence: 1.0 // High confidence for exact matches
      };
    }
    
    // If not found, try to find partial matches
    const partialMatches = Object.entries(locationDatabase)
      .filter(([key]) => key.includes(normalizedName) || normalizedName.includes(key))
      .map(([key, [lat, lng, formattedName]]) => ({
        key,
        lat,
        lng,
        formattedName,
        // Calculate a simple confidence score based on string similarity
        confidence: calculateStringSimilarity(normalizedName, key)
      }))
      .sort((a, b) => b.confidence - a.confidence);
    
    if (partialMatches.length > 0 && partialMatches[0].confidence > 0.6) {
      const bestMatch = partialMatches[0];
      return {
        name: bestMatch.formattedName || locationName,
        lat: bestMatch.lat,
        lng: bestMatch.lng,
        confidence: bestMatch.confidence
      };
    }
    
    // If still not found, we would typically call an external geocoding API here
    // For this example, we'll return null to indicate no match was found
    return null;
  } catch (error) {
    console.error('Error geocoding location:', error);
    return null;
  }
};

// Function to reverse geocode coordinates to a location name
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Find the closest location in our database
    let closestLocation = '';
    let minDistance = Number.MAX_VALUE;
    
    Object.entries(locationDatabase).forEach(([key, [dbLat, dbLng, formattedName]]) => {
      const distance = calculateDistance(lat, lng, dbLat, dbLng);
      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = formattedName || key;
      }
    });
    
    // If we found a reasonably close location (within ~50km)
    if (minDistance < 0.5) {
      return closestLocation;
    }
    
    // If no close match, return coordinates as string
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
};

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Helper function to calculate string similarity (simple implementation)
const calculateStringSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  // Count matching characters
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }
  
  return matches / longer.length;
};
