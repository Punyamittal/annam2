import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PollutionHeatMap from './PollutionHeatMap';

// Fix Leaflet icon issue in React
// This is needed because of how webpack handles assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface PollutionZone {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  level: 'low' | 'medium' | 'high';
  description: string;
}

interface PollutionPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1 value representing pollution intensity
}

interface EnvironmentalMapProps {
  center: [number, number];
  zoom: number;
  pollutionZones: PollutionZone[];
  pollutionPoints?: PollutionPoint[]; // New prop for heat map data
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Component to handle map location changes
const LocationMarker: React.FC<{ onLocationSelect?: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (!onLocationSelect) return;
    
    const handleClick = (e: any) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect]);
  
  return null;
};

const EnvironmentalMap: React.FC<EnvironmentalMapProps> = ({ 
  center, 
  zoom, 
  pollutionZones,
  pollutionPoints = [],
  onLocationSelect
}) => {
  const [showHeatMap, setShowHeatMap] = useState(true);

  const getCircleColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#10b981'; // green
      case 'medium':
        return '#f59e0b'; // yellow
      case 'high':
        return '#ef4444'; // red
      default:
        return '#3b82f6'; // blue
    }
  };

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-md">
      <div className="bg-white p-2 border-b flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="heatmap-toggle"
            checked={showHeatMap}
            onChange={() => setShowHeatMap(!showHeatMap)}
            className="mr-2"
          />
          <label htmlFor="heatmap-toggle" className="text-sm">Show Pollution Heat Map</label>
        </div>
      </div>

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {pollutionZones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius}
            pathOptions={{
              color: getCircleColor(zone.level),
              fillColor: getCircleColor(zone.level),
              fillOpacity: 0.3
            }}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{zone.level.charAt(0).toUpperCase() + zone.level.slice(1)} Risk Zone</h3>
                <p>{zone.description}</p>
              </div>
            </Popup>
          </Circle>
        ))}
        
        {showHeatMap && pollutionPoints.length > 0 && (
          <PollutionHeatMap pollutionData={pollutionPoints} />
        )}
        
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default EnvironmentalMap;
