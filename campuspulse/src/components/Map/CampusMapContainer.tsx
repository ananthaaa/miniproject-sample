import { useEffect, type ReactNode } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CAMPUS_CENTER, CAMPUS_ZOOM } from '../../types';

// Fix default Leaflet icon paths (Vite asset handling)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface CampusMapContainerProps {
  children?: ReactNode;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
}

/** Forces a tile repaint once the container is visible in the DOM. */
function MapInitializer() {
  const map = useMap();
  useEffect(() => {
    // Small delay ensures the container has final CSS dimensions before invalidating
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

/** Relays map click events to the parent without leaving the Leaflet context. */
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * The core map container — intentionally thin.
 * All map logic (markers, routing, controls) lives in child components.
 * This makes it easy to swap OSM tiles for an SVG campus map:
 *   - Replace <TileLayer> with <SVGCampusLayer>
 *   - Keep all child components unchanged
 */
export function CampusMapContainer({ children, className = '', onMapClick }: CampusMapContainerProps) {
  return (
    <LeafletMapContainer
      center={CAMPUS_CENTER}
      zoom={CAMPUS_ZOOM}
      minZoom={15}
      maxZoom={20}
      zoomControl={true}
      className={`${className}`}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <MapInitializer />
      <MapClickHandler onMapClick={onMapClick} />
      {/* OSM tile layer — replace this node for custom campus map */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={20}
      />
      {children}
    </LeafletMapContainer>
  );
}
