import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import type { Destination } from '../../types';

interface RoutingControlProps {
  userLat: number;
  userLng: number;
  destination: Destination;
  onRouteFound?: (distanceMeters: number, durationSeconds: number) => void;
}

/**
 * Wraps Leaflet Routing Machine to draw a walking route.
 * Fully isolated — swapping to a different routing provider
 * only requires changing this file.
 */
export function RoutingControl({
  userLat,
  userLng,
  destination,
  onRouteFound,
}: RoutingControlProps) {
  const map = useMap();
  const routingRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!L.Routing) return;

    const control = (L.Routing as any).control({
      waypoints: [
        L.latLng(userLat, userLng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      addWaypoints: false,
      draggableWaypoints: false,
      // Hide the default itinerary panel (done via CSS too)
      show: false,
      createMarker: () => null, // We use our own markers
      lineOptions: {
        styles: [
          { color: '#0066ff', weight: 5, opacity: 0.85 },
          { color: '#ffffff', weight: 2, opacity: 0.5, dashArray: '6 10' },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      router: (L.Routing as any).osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot',
      }),
    });

    routingRef.current = control;

    control.on('routesfound', (e: any) => {
      const route = e.routes[0];
      if (route && onRouteFound) {
        onRouteFound(route.summary.totalDistance, route.summary.totalTime);
      }
    });

    control.addTo(map);

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }
    };
  }, [map, userLat, userLng, destination.id]);

  return null;
}
