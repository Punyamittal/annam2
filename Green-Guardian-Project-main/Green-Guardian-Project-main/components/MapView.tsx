import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const useMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMap),
  { ssr: false }
);

// Fix for default marker icons in Leaflet with Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Only import L when on client side
let L: any;
let DefaultIcon: any;

if (typeof window !== 'undefined') {
  L = require('leaflet');
  DefaultIcon = L.icon({
    iconUrl: icon.src || '/marker-icon.png',
    shadowUrl: iconShadow.src || '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;
}

interface RiskZone {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

interface MapViewProps {
  onLocationSelect: (location: string) => void;
}

// Component to update map view when center changes
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const MapView: React.FC<MapViewProps> = ({ onLocationSelect }) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]); // Default world view
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Set map as ready when component mounts on client side
    setIsMapReady(true);
    
    // Get user's current location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          
          // Reverse geocode to get location name
          fetchLocationName(latitude, longitude).then(locationName => {
            if (locationName) {
              setSelectedLocation({
                lat: latitude,
                lng: longitude,
                name: locationName
              });
              onLocationSelect(locationName);
            }
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Default to a world view if geolocation fails
          setMapCenter([20, 0]);
        }
      );
    }

    // Fetch risk zones - replace with actual API call in production
    fetchRiskZones();
  }, []);

  const fetchRiskZones = async () => {
    try {
      // In a real app, you would fetch this data from your backend
      // For now, we'll use mock data
      const mockZones: RiskZone[] = [
        {
          id: '1',
          lat: 51.505,
          lng: -0.09,
          radius: 1000,
          riskLevel: 'high',
          description: 'High pollution area with elevated PM2.5 levels'
        },
        {
          id: '2',
          lat: 51.51,
          lng: -0.1,
          radius: 800,
          riskLevel: 'medium',
          description: 'Moderate air quality concerns'
        },
        {
          id: '3',
          lat: 51.49,
          lng: -0.08,
          radius: 1200,
          riskLevel: 'low',
          description: 'Low risk area with good air quality'
        }
      ];

      setRiskZones(mockZones);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching risk zones:', error);
      setIsLoading(false);
    }
  };

  // Function to fetch location name from coordinates using Nominatim
  const fetchLocationName = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location name');
      }
      
      const data = await response.json();
      
      // Extract a meaningful location name
      const address = data.address;
      let locationName = '';
      
      if (address.city) {
        locationName = address.city;
      } else if (address.town) {
        locationName = address.town;
      } else if (address.village) {
        locationName = address.village;
      } else if (address.county) {
        locationName = address.county;
      } else if (address.state) {
        locationName = address.state;
      }
      
      if (address.country && locationName) {
        locationName += `, ${address.country}`;
      } else if (address.country) {
        locationName = address.country;
      }
      
      return locationName || 'Unknown location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return null;
    }
  };

  // Function to geocode a location name to coordinates using Nominatim
  const geocodeLocation = async (locationName: string) => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to geocode location');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        setSelectedLocation({
          lat: latitude,
          lng: longitude,
          name: display_name
        });
        
        setMapCenter([latitude, longitude]);
        onLocationSelect(display_name);
      } else {
        setErrorMessage('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      setErrorMessage('Error finding location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    await geocodeLocation(searchInput);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get location name
          const locationName = await fetchLocationName(latitude, longitude);
          
          if (locationName) {
            setSelectedLocation({
              lat: latitude,
              lng: longitude,
              name: locationName
            });
            
            setMapCenter([latitude, longitude]);
            onLocationSelect(locationName);
            setSearchInput(locationName);
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setErrorMessage('Could not access your location. Please check your browser permissions.');
          setIsLoading(false);
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser.');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#ff0000';
      case 'medium': return '#ffa500';
      case 'low': return '#ffff00';
      default: return '#00ff00';
    }
  };

  if (isLoading && !selectedLocation) {
    return <div className="h-96 flex items-center justify-center bg-gray-100">Loading map data...</div>;
  }

  return (
    <div className="relative w-full h-[600px]">
      {!isMapReady ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-4 left-4 z-[1000] w-64 bg-white p-4 rounded-lg shadow-lg">
            <form onSubmit={handleSearch} className="space-y-4">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search location..."
                className="w-full p-2 border rounded"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Use Current Location
                </button>
              </div>
            </form>
            {errorMessage && (
              <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
            )}
            {selectedLocation && (
              <div className="mt-4">
                <h3 className="font-semibold">Selected Location:</h3>
                <p className="text-sm text-gray-600">{selectedLocation.name}</p>
              </div>
            )}
          </div>

          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ChangeMapView center={mapCenter} />
            
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                <Popup>
                  <div>
                    <h3 className="font-semibold">{selectedLocation.name}</h3>
                  </div>
                </Popup>
              </Marker>
            )}

            {riskZones.map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: getRiskColor(zone.riskLevel),
                  fillColor: getRiskColor(zone.riskLevel),
                  fillOpacity: 0.2
                }}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold">Risk Level: {zone.riskLevel}</h3>
                    <p className="text-sm">{zone.description}</p>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </>
      )}
    </div>
  );
};

export default MapView;
