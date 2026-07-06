import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Destination, MarkerCategory } from '../../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../types';

const CATEGORIES: MarkerCategory[] = [
  'Academic', 'Administration', 'Auditorium', 'Cafeteria', 'Parking', 'Sports', 'Hostel',
];

interface MarkerFormData {
  name: string;
  description: string;
  lat: string;
  lng: string;
  category: MarkerCategory;
}

interface MarkerFormProps {
  initial?: Destination;
  onSave: (data: Omit<Destination, 'id'>) => void;
  onCancel: () => void;
  onMapCoords?: { lat: number; lng: number } | null;
}

export function MarkerForm({ initial, onSave, onCancel, onMapCoords }: MarkerFormProps) {
  const [form, setForm] = useState<MarkerFormData>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    lat: initial?.lat.toString() ?? onMapCoords?.lat.toString() ?? '',
    lng: initial?.lng.toString() ?? onMapCoords?.lng.toString() ?? '',
    category: initial?.category ?? 'Academic',
  });
  const [errors, setErrors] = useState<Partial<MarkerFormData>>({});

  useEffect(() => {
    if (onMapCoords) {
      setForm((f) => ({
        ...f,
        lat: onMapCoords.lat.toString(),
        lng: onMapCoords.lng.toString(),
      }));
      setErrors((e) => ({ ...e, lat: '', lng: '' }));
    }
  }, [onMapCoords]);

  const set = (key: keyof MarkerFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const errs: Partial<MarkerFormData> = {};
    if (!form.name.trim()) errs.name = 'Building name is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || lat < -90 || lat > 90) errs.lat = 'Valid latitude (-90 to 90) required';
    if (isNaN(lng) || lng < -180 || lng > 180) errs.lng = 'Valid longitude (-180 to 180) required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      category: form.category,
    });
  };

  const isEditing = !!initial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        background: 'var(--bg-secondary, #fff)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        padding: '20px 24px',
      }}>
        <h3 style={{ color: 'white', margin: 0, fontSize: 18, fontWeight: 700 }}>
          {isEditing ? '✏️ Edit Marker' : '📍 Add New Marker'}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.75)', margin: '4px 0 0', fontSize: 13 }}>
          {isEditing ? `Editing: ${initial.name}` : 'Click map to set coordinates, or enter manually'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
        {/* Building Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Building Name *
          </label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Computer Science Block"
          />
          {errors.name && <p style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 0' }}>{errors.name}</p>}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Description *
          </label>
          <textarea
            className="input-field"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Brief description of this building..."
            rows={3}
            style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          />
          {errors.description && <p style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 0' }}>{errors.description}</p>}
        </div>

        {/* Coordinates row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Latitude *
            </label>
            <input
              className="input-field"
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) => set('lat', e.target.value)}
              placeholder="10.178421"
            />
            {errors.lat && <p style={{ color: '#ef4444', fontSize: 11, margin: '4px 0 0' }}>{errors.lat}</p>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Longitude *
            </label>
            <input
              className="input-field"
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) => set('lng', e.target.value)}
              placeholder="76.430501"
            />
            {errors.lng && <p style={{ color: '#ef4444', fontSize: 11, margin: '4px 0 0' }}>{errors.lng}</p>}
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Category *
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((cat) => {
              const c = CATEGORY_COLORS[cat];
              const isActive = form.category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => set('category', cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    border: `1.5px solid ${isActive ? c.border : 'var(--border-color)'}`,
                    background: isActive ? c.bg : 'transparent',
                    color: isActive ? c.text : 'var(--text-secondary)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onCancel} className="btn-ghost" style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" style={{ flex: 2 }}>
            {isEditing ? '✓ Save Changes' : '+ Add Marker'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
