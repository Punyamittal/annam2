// Cache for geocoding results
const geocodingCache = new Map<string, { lat: number; lon: number }>();

/**
 * Gets coordinates for a given place name using Nominatim API.
 * Results are cached to avoid repeated API calls.
 * @param placeName - The name of the place (e.g., "Siyana, Bulandshahar, Uttar Pradesh")
 * @returns The latitude and longitude, or null if not found.
 */
export const getCoordinates = async (placeName: string): Promise<{ lat: number; lon: number } | null> => {
  if (geocodingCache.has(placeName)) {
    return geocodingCache.get(placeName)!;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search`;
    const params = new URLSearchParams({
      q: placeName,
      format: 'json',
      limit: '1'
    });
    
    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      const result = { lat, lon };
      geocodingCache.set(placeName, result);
      return result;
    } else {
      console.warn(`Could not find coordinates for '${placeName}'`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching coordinates for '${placeName}':`, error);
    return null;
  }
};

/**
 * Calculates the distance between two points using the Haversine formula.
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns The distance in kilometers.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}; 