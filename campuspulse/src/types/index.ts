// ============================================================
// CampusPulse Navigator — Core Type Definitions
// ============================================================

export type MarkerCategory =
  | 'Academic'
  | 'Administration'
  | 'Auditorium'
  | 'Cafeteria'
  | 'Parking'
  | 'Sports'
  | 'Hostel';

export interface Destination {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  category: MarkerCategory;
}

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface MarkerState {
  markers: Destination[];
  addMarker: (marker: Omit<Destination, 'id'>) => void;
  updateMarker: (id: string, updates: Partial<Omit<Destination, 'id'>>) => void;
  deleteMarker: (id: string) => void;
  getMarker: (id: string) => Destination | undefined;
}

export interface NavigationState {
  isNavigating: boolean;
  destination: Destination | null;
  distanceMeters: number | null;
  durationSeconds: number | null;
  hasArrived: boolean;
  startNavigation: (destination: Destination) => void;
  stopNavigation: () => void;
  dismissArrival: () => void;
  updateProgress: (currentLat: number, currentLng: number) => void;
}

export interface GeolocationState {
  position: GeolocationCoordinates | null;
  error: string | null;
  isLoading: boolean;
}

// Map provider abstraction — allows swapping OSM for SVG campus map later
export interface IMapConfig {
  center: [number, number];
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface IMapMarkerOptions {
  destination: Destination;
  isSelected?: boolean;
  onClick?: (destination: Destination) => void;
}

export const CAMPUS_CENTER: [number, number] = [10.178421, 76.430501];
export const CAMPUS_ZOOM = 18;
export const ARRIVAL_THRESHOLD_METERS = 20;

export const CATEGORY_COLORS: Record<MarkerCategory, { bg: string; text: string; border: string }> = {
  Academic:       { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
  Administration: { bg: '#ede9fe', text: '#7c3aed', border: '#c4b5fd' },
  Auditorium:     { bg: '#cffafe', text: '#0e7490', border: '#67e8f9' },
  Cafeteria:      { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
  Parking:        { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  Sports:         { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  Hostel:         { bg: '#fce7f3', text: '#be185d', border: '#f9a8d4' },
};

export const CATEGORY_ICONS: Record<MarkerCategory, string> = {
  Academic:       '🎓',
  Administration: '🏛️',
  Auditorium:     '🎭',
  Cafeteria:      '🍽️',
  Parking:        '🅿️',
  Sports:         '⚽',
  Hostel:         '🏠',
};
