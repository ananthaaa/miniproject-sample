import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Destination, NavigationState } from '../types';
import { ARRIVAL_THRESHOLD_METERS } from '../types';

// Haversine formula — great-circle distance in meters
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const NavigationContext = createContext<NavigationState | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [hasArrived, setHasArrived] = useState(false);

  const startNavigation = useCallback((dest: Destination) => {
    setDestination(dest);
    setIsNavigating(true);
    setHasArrived(false);
    setDistanceMeters(null);
    setDurationSeconds(null);
  }, []);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setDestination(null);
    setDistanceMeters(null);
    setDurationSeconds(null);
    setHasArrived(false);
  }, []);

  const dismissArrival = useCallback(() => {
    setHasArrived(false);
    stopNavigation();
  }, [stopNavigation]);

  // Called by routing machine once route is computed
  const updateProgress = useCallback(
    (currentLat: number, currentLng: number) => {
      if (!destination || !isNavigating) return;
      const dist = haversineMeters(currentLat, currentLng, destination.lat, destination.lng);
      setDistanceMeters(dist);
      // Walking speed ~1.4 m/s
      setDurationSeconds(Math.round(dist / 1.4));
      if (dist <= ARRIVAL_THRESHOLD_METERS && !hasArrived) {
        setHasArrived(true);
      }
    },
    [destination, isNavigating, hasArrived]
  );

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        destination,
        distanceMeters,
        durationSeconds,
        hasArrived,
        startNavigation,
        stopNavigation,
        dismissArrival,
        updateProgress,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationState {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
