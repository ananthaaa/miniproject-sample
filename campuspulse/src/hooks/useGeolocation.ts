import { useState, useEffect, useRef } from 'react';
import type { GeolocationState } from '../types';
import { CAMPUS_CENTER } from '../types';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * Provides real-time GPS position.
 * Falls back to campus center coordinates when permission is denied or GPS is unavailable,
 * so the user still sees the map and can navigate even without live location.
 */
export function useGeolocation(options: UseGeolocationOptions = {}): GeolocationState {
  // Pre-seed position with campus center so markers/map render immediately
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isLoading: true,
  });

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Browser has no GPS support — fall back to campus center
      setState({
        position: makeFallbackCoords(),
        error: 'Geolocation not supported — showing campus center.',
        isLoading: false,
      });
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: options.enableHighAccuracy ?? true,
      timeout: options.timeout ?? 10000,
      maximumAge: options.maximumAge ?? 5000,
    };

    const onSuccess = (pos: GeolocationPosition) => {
      setState({ position: pos.coords, error: null, isLoading: false });
    };

    const onError = (err: GeolocationPositionError) => {
      let message = 'Unable to access your location — showing campus center.';
      if (err.code === err.PERMISSION_DENIED) {
        message = 'Location permission denied — showing campus center.';
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        message = 'Location unavailable — showing campus center.';
      } else if (err.code === err.TIMEOUT) {
        message = 'Location request timed out — showing campus center.';
      }
      // Fall back to campus center so the app still works
      setState({
        position: makeFallbackCoords(),
        error: message,
        isLoading: false,
      });
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return state;
}

/** Produces a fake GeolocationCoordinates object centred on campus. */
function makeFallbackCoords(): GeolocationCoordinates {
  return {
    latitude: CAMPUS_CENTER[0],
    longitude: CAMPUS_CENTER[1],
    accuracy: 50,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    toJSON() {
      return {
        latitude: CAMPUS_CENTER[0],
        longitude: CAMPUS_CENTER[1],
        accuracy: 50,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      };
    },
  };
}
