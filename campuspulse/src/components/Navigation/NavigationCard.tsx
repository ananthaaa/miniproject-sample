import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Clock, MapPin, ChevronRight } from 'lucide-react';
import type { Destination } from '../../types';

interface NavigationCardProps {
  destination: Destination;
  distanceMeters: number | null;
  durationSeconds: number | null;
  onStop: () => void;
}

function formatDistance(meters: number | null): string {
  if (meters === null) return '—';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return '—';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.ceil(seconds / 60);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function NavigationCard({
  destination,
  distanceMeters,
  durationSeconds,
  onStop,
}: NavigationCardProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'absolute',
          bottom: 24,
          left: 16,
          right: 16,
          zIndex: 1000,
          pointerEvents: 'all',
        }}
      >
        <div className="glass" style={{ borderRadius: 24, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 10,
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Navigation size={18} color="white" />
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 500 }}>
                  Navigating to
                </div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                  {destination.name}
                </div>
              </div>
            </div>
            <button
              onClick={onStop}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 10,
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            >
              <X size={18} />
            </button>
          </div>

          {/* Stats */}
          <div style={{
            padding: '16px 20px',
            display: 'flex',
            gap: 16,
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                <MapPin size={14} style={{ color: 'var(--campus-blue, #0066ff)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary, #64748b)', fontWeight: 500 }}>DISTANCE</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary, #0a1628)' }}>
                {formatDistance(distanceMeters)}
              </div>
            </div>

            <div style={{
              width: 1,
              background: 'var(--border-color, rgba(148,163,184,0.3))',
              margin: '4px 0',
            }} />

            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                <Clock size={14} style={{ color: 'var(--campus-green, #10b981)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary, #64748b)', fontWeight: 500 }}>ETA</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary, #0a1628)' }}>
                {formatDuration(durationSeconds)}
              </div>
            </div>
          </div>

          {/* Route hint */}
          <div style={{
            padding: '0 20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--text-secondary, #64748b)',
            fontSize: 12,
          }}>
            <ChevronRight size={14} />
            <span>Walking route — follow the blue line on the map</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
