import { motion } from 'framer-motion';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import type { Destination } from '../../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../types';

interface MarkerListProps {
  markers: Destination[];
  onEdit: (marker: Destination) => void;
  onDelete: (id: string) => void;
}

export function MarkerList({ markers, onEdit, onDelete }: MarkerListProps) {
  if (markers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
        <MapPin size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
        <div style={{ fontSize: 14, fontWeight: 600 }}>No markers yet</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Click "+ Add Marker" or click on the map to place one.</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {markers.map((marker, i) => {
        const colors = CATEGORY_COLORS[marker.category];
        return (
          <motion.div
            key={marker.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              background: 'var(--bg-primary, #f8fafc)',
              borderRadius: 14,
              padding: '12px 14px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Icon */}
            <div style={{
              width: 40, height: 40,
              background: colors.bg,
              border: `1.5px solid ${colors.border}`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>
              {CATEGORY_ICONS[marker.category]}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>
                {marker.name}
              </div>
              <div style={{
                display: 'inline-block',
                background: colors.bg,
                color: colors.text,
                borderRadius: 20,
                padding: '1px 7px',
                fontSize: 10,
                fontWeight: 600,
                marginBottom: 2,
              }}>
                {marker.category}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => onEdit(marker)}
                style={{
                  width: 34, height: 34,
                  background: '#ede9fe',
                  border: 'none',
                  borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#7c3aed',
                  transition: 'all 0.2s',
                }}
                title="Edit marker"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${marker.name}"?`)) onDelete(marker.id);
                }}
                style={{
                  width: 34, height: 34,
                  background: '#fee2e2',
                  border: 'none',
                  borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#dc2626',
                  transition: 'all 0.2s',
                }}
                title="Delete marker"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
