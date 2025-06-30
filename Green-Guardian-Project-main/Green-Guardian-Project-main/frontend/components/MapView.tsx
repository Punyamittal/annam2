import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

const MapView: React.FC<MapViewProps> = ({ onLocationSelect }) => {
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
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

    // Simulate API fetch
    setTimeout(() => {
      setRiskZones(mockZones);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#ff0000';
      case 'medium': return '#ffa500';
      case 'low': return '#ffff00';
      default: return '#00ff00';
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsLoading(true);
    
    try {
      // In a real app, you would use a geocoding service here
      // For this example, we'll just simulate a successful geocode
      setTimeout(() => {
        // Mock geocoding result
        const mockLocation = {
          lat: 51.505 + (Math.random() * 0.02 - 0.01),
          lng: -0.09 + (Math.random() * 0.02 - 0.01)
        };
        
        setSelectedLocation(mockLocation);
        onLocationSelect(searchInput);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error geocoding location:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center bg-gray-100">Loading map data...</div>;
  }

  return (
    <div className="flex flex-col h-96">
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter a location..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="flex-grow rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {riskZones.map((zone) => (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: getRiskColor(zone.riskLevel),
                fillColor: getRiskColor(zone.riskLevel),
                fillOpacity: 0.3
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{zone.riskLevel.toUpperCase()} RISK ZONE</h3>
                  <p>{zone.description}</p>
                </div>
              </Popup>
            </Circle>
          ))}
          
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
              <Popup>
                <div>
                  <h3 className="font-bold">Selected Location</h3>
                  <p>{searchInput}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
