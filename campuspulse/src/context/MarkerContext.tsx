import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Destination, MarkerState } from '../types';
import { SAMPLE_MARKERS } from '../data/markers';

const STORAGE_KEY = 'campuspulse_markers';

const MarkerContext = createContext<MarkerState | null>(null);

export function MarkerProvider({ children }: { children: ReactNode }) {
  const [markers, setMarkers] = useState<Destination[]>([]);

  // Initialize from localStorage or default sample data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMarkers(JSON.parse(stored) as Destination[]);
      } else {
        setMarkers(SAMPLE_MARKERS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MARKERS));
      }
    } catch {
      setMarkers(SAMPLE_MARKERS);
    }
  }, []);

  const persist = (updated: Destination[]) => {
    setMarkers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addMarker = (marker: Omit<Destination, 'id'>) => {
    const newMarker: Destination = {
      ...marker,
      id: `marker-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    persist([...markers, newMarker]);
  };

  const updateMarker = (id: string, updates: Partial<Omit<Destination, 'id'>>) => {
    persist(markers.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMarker = (id: string) => {
    persist(markers.filter((m) => m.id !== id));
  };

  const getMarker = (id: string) => markers.find((m) => m.id === id);

  return (
    <MarkerContext.Provider value={{ markers, addMarker, updateMarker, deleteMarker, getMarker }}>
      {children}
    </MarkerContext.Provider>
  );
}

export function useMarkers(): MarkerState {
  const ctx = useContext(MarkerContext);
  if (!ctx) throw new Error('useMarkers must be used within MarkerProvider');
  return ctx;
}
