import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface PollutionPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1 value representing pollution intensity
}

interface PollutionHeatMapProps {
  pollutionData: PollutionPoint[];
  radius?: number;
  blur?: number;
  maxIntensity?: number;
}

const PollutionHeatMap: React.FC<PollutionHeatMapProps> = ({
  pollutionData,
  radius = 25,
  blur = 15,
  maxIntensity = 0.8
}) => {
  const map = useMap();

  useEffect(() => {
    if (!pollutionData || pollutionData.length === 0) return;

    // Convert data to format expected by Leaflet.heat
    // [lat, lng, intensity]
    const heatData = pollutionData.map(point => [
      point.lat,
      point.lng,
      point.intensity
    ]);

    // Create and add heat layer
    const heatLayer = (L as any).heatLayer(heatData, {
      radius,
      blur,
      max: maxIntensity,
      gradient: {
        0.0: 'green',
        0.3: 'yellow',
        0.6: 'orange',
        0.8: 'red'
      }
    }).addTo(map);

    // Cleanup function to remove the layer when component unmounts
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, pollutionData, radius, blur, maxIntensity]);

  return null; // This component doesn't render anything directly
};

export default PollutionHeatMap;
