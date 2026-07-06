import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronLeft, ChevronRight, MousePointer } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { CampusMapContainer } from '../components/Map/CampusMapContainer';
import { DestinationMarker } from '../components/Map/DestinationMarker';
import { LocateMeControl } from '../components/Map/LocateMeControl';
import { MarkerForm } from '../components/Marker/MarkerForm';
import { MarkerList } from '../components/Marker/MarkerList';
import { useMarkers } from '../context/MarkerContext';
import type { Destination } from '../types';

type PanelView = 'list' | 'form';

export default function AdminDashboard() {
  const { markers, addMarker, updateMarker, deleteMarker } = useMarkers();
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelView, setPanelView] = useState<PanelView>('list');
  const [editingMarker, setEditingMarker] = useState<Destination | null>(null);
  const [pendingMapCoords, setPendingMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [clickMode, setClickMode] = useState(false);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (clickMode || panelView === 'form') {
      setPendingMapCoords({ lat, lng });
      setPanelView('form');
      setPanelOpen(true);
      setClickMode(false);
    }
  }, [clickMode, panelView]);

  const handleAddNew = () => {
    setEditingMarker(null);
    setPendingMapCoords(null);
    setPanelView('form');
  };

  const handleEdit = (marker: Destination) => {
    setEditingMarker(marker);
    setPendingMapCoords(null);
    setPanelView('form');
    setPanelOpen(true);
  };

  const handleSave = async (data: Omit<Destination, 'id'>) => {
    try {
      if (editingMarker) {
        await updateMarker(editingMarker.id, data);
      } else {
        await addMarker(data);
      }
      setEditingMarker(null);
      setPendingMapCoords(null);
      setPanelView('list');
    } catch (err: any) {
      alert(`Failed to save marker: ${err.message || 'Unknown error'}. Please check your Supabase Row Level Security (RLS) policies.`);
    }
  };

  const handleCancel = () => {
    setEditingMarker(null);
    setPendingMapCoords(null);
    setPanelView('list');
    setClickMode(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMarker(id);
    } catch (err: any) {
      alert(`Failed to delete marker: ${err.message || 'Unknown error'}. Please check your Supabase Row Level Security (RLS) policies.`);
    }
  };

  const PANEL_WIDTH = 360;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar title="CampusPulse Admin" subtitle="Map Editor" />

      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Map */}
        <div style={{
          flex: 1,
          position: 'relative',
          marginRight: panelOpen ? PANEL_WIDTH : 0,
          transition: 'margin-right 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <CampusMapContainer onMapClick={handleMapClick}>
            {markers.map((dest) => (
              <DestinationMarker
                key={dest.id}
                destination={dest}
                isAdminMode
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            <LocateMeControl position="bottomright" />
          </CampusMapContainer>

          {/* Floating admin toolbar */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 950,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            {/* Add Marker */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNew}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                padding: '10px 16px',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Plus size={16} />
              Add Marker
            </motion.button>

            {/* Click to place mode */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setClickMode((m) => !m); if (!clickMode) { setPanelOpen(false); } }}
              style={{
                background: clickMode ? '#10b981' : 'var(--bg-secondary)',
                color: clickMode ? 'white' : 'var(--text-primary)',
                border: `1px solid ${clickMode ? '#10b981' : 'var(--border-color)'}`,
                borderRadius: 14,
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: 'var(--shadow-md)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <MousePointer size={16} />
              {clickMode ? 'Click map to place...' : 'Click to Place'}
            </motion.button>
          </div>

          {/* Click mode overlay hint */}
          <AnimatePresence>
            {clickMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 950,
                  background: '#10b981',
                  color: 'white',
                  borderRadius: 12,
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: 13,
                  boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                  cursor: 'crosshair',
                  whiteSpace: 'nowrap',
                }}
              >
                🖱️ Click anywhere on the map to place a marker
              </motion.div>
            )}
          </AnimatePresence>

          {/* Panel toggle button */}
          <button
            onClick={() => setPanelOpen((o) => !o)}
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              zIndex: 950,
              width: 28,
              height: 56,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRight: 'none',
              borderRadius: '12px 0 0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {panelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Side panel */}
        <motion.div
          animate={{ width: panelOpen ? PANEL_WIDTH : 0, opacity: panelOpen ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0,
            width: PANEL_WIDTH,
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-color)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
          }}
        >
          <div style={{ width: PANEL_WIDTH, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Panel header */}
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>
                  {panelView === 'list' ? `${markers.length} markers` : editingMarker ? 'Edit Mode' : 'New Marker'}
                </div>
                <h2 style={{ color: 'white', fontSize: 17, fontWeight: 700, margin: 0 }}>
                  {panelView === 'list' ? 'Map Editor' : editingMarker ? 'Edit Marker' : 'Add Marker'}
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {panelView === 'list' && (
                  <button
                    onClick={handleAddNew}
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
                    <Plus size={18} />
                  </button>
                )}
                {panelView === 'form' && (
                  <button
                    onClick={handleCancel}
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
                )}
              </div>
            </div>

            {/* Panel body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <AnimatePresence mode="wait">
                {panelView === 'list' ? (
                  <motion.div key="list" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <MarkerList
                      markers={markers}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <MarkerForm
                      initial={editingMarker ?? undefined}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onMapCoords={pendingMapCoords}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
