import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface UserLocationMarkerProps {
  lat: number;
  lng: number;
}

/**
 * Animated blue pulsing GPS dot marker — modular and replaceable
 * for the future SVG campus map without changing the parent component.
 */
export function UserLocationMarker({ lat, lng }: UserLocationMarkerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Create custom pulsing div icon
    const pulseIcon = L.divIcon({
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      html: `
        <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
          <div style="
            position:absolute;
            width:40px;height:40px;
            background:rgba(0,102,255,0.15);
            border-radius:50%;
            animation:gps-pulse 2s infinite;
          "></div>
          <div style="
            position:absolute;
            width:24px;height:24px;
            background:rgba(0,102,255,0.25);
            border-radius:50%;
            animation:gps-pulse 2s infinite 0.5s;
          "></div>
          <div style="
            width:16px;height:16px;
            background:#0066ff;
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 2px 8px rgba(0,102,255,0.7);
            animation:gps-dot-pulse 2s infinite;
            position:relative;z-index:1;
          "></div>
        </div>
      `,
    });

    markerRef.current = L.marker([lat, lng], { icon: pulseIcon, zIndexOffset: 1000 }).addTo(map);

    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [lat, lng]);

  return null;
}
