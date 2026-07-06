import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Destination, MarkerState } from '../types';
import { supabase } from '../lib/supabase';

const MarkerContext = createContext<MarkerState | null>(null);

export function MarkerProvider({ children }: { children: ReactNode }) {
  const [markers, setMarkers] = useState<Destination[]>([]);

  useEffect(() => {
    // 1. Fetch initial markers
    const fetchMarkers = async () => {
      const { data, error } = await supabase.from('markers').select('*');
      if (error) {
        console.error('Error fetching markers:', error);
      } else if (data) {
        // Map data to match the Destination type
        setMarkers(data.map(d => ({
          ...d,
          lat: Number(d.lat),
          lng: Number(d.lng)
        })));
      }
    };

    fetchMarkers();

    // 2. Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'markers' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMarker = payload.new as Destination;
            setMarkers((prev) => [...prev, newMarker]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Destination;
            setMarkers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            setMarkers((prev) => prev.filter((m) => m.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addMarker = async (marker: Omit<Destination, 'id'>) => {
    // Optimistic UI update can go here if needed, but we rely on realtime subscription
    const { error } = await supabase.from('markers').insert([marker]);
    if (error) {
      console.error('Error adding marker:', error);
      throw error;
    }
  };

  const updateMarker = async (id: string, updates: Partial<Omit<Destination, 'id'>>) => {
    const { error } = await supabase.from('markers').update(updates).eq('id', id);
    if (error) {
      console.error('Error updating marker:', error);
      throw error;
    }
  };

  const deleteMarker = async (id: string) => {
    const { error } = await supabase.from('markers').delete().eq('id', id);
    if (error) {
      console.error('Error deleting marker:', error);
      throw error;
    }
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
