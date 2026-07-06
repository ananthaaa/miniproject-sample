import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, ChevronRight } from 'lucide-react';
import type { Destination, MarkerCategory } from '../../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../types';

interface StudentSidebarProps {
  markers: Destination[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (destination: Destination) => void;
  onSelect: (destination: Destination) => void;
}

const ALL = 'All';
const CATEGORIES: (typeof ALL | MarkerCategory)[] = [
  ALL, 'Academic', 'Administration', 'Auditorium', 'Cafeteria', 'Parking', 'Sports', 'Hostel',
];

export function StudentSidebar({ markers, isOpen, onClose, onNavigate, onSelect }: StudentSidebarProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<typeof ALL | MarkerCategory>(ALL);

  const filtered = useMemo(() => {
    return markers.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === ALL || m.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [markers, search, activeCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 320,
            zIndex: 900,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-secondary, #fff)',
            boxShadow: 'var(--shadow-xl)',
            borderRight: '1px solid var(--border-color)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 20px 0',
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>Campus Navigator</div>
                <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: 0 }}>Find a Place</h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: 10,
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Search bar */}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
            }}>
              <Search size={16} color="rgba(255,255,255,0.8)" />
              <input
                type="text"
                placeholder="Search buildings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: 14,
                  flex: 1,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 0 }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category filter chips */}
            <div style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 16,
              scrollbarWidth: 'none',
            }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const colors = cat !== ALL ? CATEGORY_COLORS[cat as MarkerCategory] : null;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      flexShrink: 0,
                      padding: '5px 12px',
                      borderRadius: 20,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s',
                      background: isActive ? 'white' : 'rgba(255,255,255,0.2)',
                      color: isActive
                        ? (colors ? colors.text : '#0066ff')
                        : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {cat !== ALL && CATEGORY_ICONS[cat as MarkerCategory]} {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                <MapPin size={32} style={{ opacity: 0.4, marginBottom: 12 }} />
                <div style={{ fontSize: 14 }}>No places found</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Try a different search term</div>
              </div>
            ) : (
              filtered.map((dest) => {
                const colors = CATEGORY_COLORS[dest.category];
                return (
                  <motion.div
                    key={dest.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'var(--bg-primary, #f8fafc)',
                      borderRadius: 14,
                      padding: '14px 16px',
                      marginBottom: 8,
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.2s',
                    }}
                    onClick={() => onSelect(dest)}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 42, height: 42,
                      background: colors.bg,
                      border: `1.5px solid ${colors.border}`,
                      borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                    }}>
                      {CATEGORY_ICONS[dest.category]}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: 'var(--text-primary)',
                        marginBottom: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {dest.name}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {dest.description}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        background: colors.bg,
                        color: colors.text,
                        borderRadius: 20,
                        padding: '1px 8px',
                        fontSize: 10,
                        fontWeight: 600,
                        marginTop: 4,
                      }}>
                        {dest.category}
                      </div>
                    </div>
                    {/* Navigate button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigate(dest); }}
                      style={{
                        background: 'linear-gradient(135deg, #0066ff, #0052cc)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        width: 36, height: 36,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(0,102,255,0.3)',
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Count footer */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-color)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}>
            {filtered.length} of {markers.length} places
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
