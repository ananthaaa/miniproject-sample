import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X, WifiOff, Loader } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { CampusMapContainer } from '../components/Map/CampusMapContainer';
import { UserLocationMarker } from '../components/Map/UserLocationMarker';
import { DestinationMarker } from '../components/Map/DestinationMarker';
import { RoutingControl } from '../components/Map/RoutingControl';
import { LocateMeControl } from '../components/Map/LocateMeControl';
import { StudentSidebar } from '../components/Student/StudentSidebar';
import { NavigationCard } from '../components/Navigation/NavigationCard';
import { ArrivalModal } from '../components/Navigation/ArrivalModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNavigation } from '../context/NavigationContext';
import { useMarkers } from '../context/MarkerContext';
import type { Destination } from '../types';
import { useMap } from 'react-leaflet';

// Sub-component to fly map to selected destination
function MapFlyTo({ dest }: { dest: Destination | null }) {
  const map = useMap();
  useEffect(() => {
    if (dest) map.flyTo([dest.lat, dest.lng], 19, { duration: 1.2 });
  }, [dest, map]);
  return null;
}

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const { markers } = useMarkers();
  const { position, error: gpsError, isLoading: gpsLoading } = useGeolocation();
  const {
    isNavigating,
    destination,
    distanceMeters,
    durationSeconds,
    hasArrived,
    startNavigation,
    stopNavigation,
    dismissArrival,
    updateProgress,
  } = useNavigation();

  // Update navigation progress whenever GPS position changes
  useEffect(() => {
    if (position && isNavigating) {
      updateProgress(position.latitude, position.longitude);
    }
  }, [position, isNavigating, updateProgress]);

  const handleNavigate = useCallback((dest: Destination) => {
    setSidebarOpen(false);
    setSelectedDest(dest);
    startNavigation(dest);
  }, [startNavigation]);

  const handleSelect = useCallback((dest: Destination) => {
    setSelectedDest(dest);
  }, []);

  const handleStopNavigation = () => {
    stopNavigation();
    setSelectedDest(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar title="CampusPulse" subtitle="Student Navigator" />

      {/* Map area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <CampusMapContainer>
          {/* Map fly-to when selecting destination */}
          <MapFlyTo dest={selectedDest} />

          {/* User GPS location */}
          {position && (
            <UserLocationMarker lat={position.latitude} lng={position.longitude} />
          )}

          {/* All destination markers */}
          {markers.map((dest) => (
            <DestinationMarker
              key={dest.id}
              destination={dest}
              isSelected={selectedDest?.id === dest.id}
              onNavigate={handleNavigate}
            />
          ))}

          {/* Walking route */}
          {isNavigating && destination && position && (
            <RoutingControl
              userLat={position.latitude}
              userLng={position.longitude}
              destination={destination}
              onRouteFound={(_dist, _dur) => {
                // Route found — the NavigationContext handles distance via GPS
              }}
            />
          )}

          {/* Locate me control */}
          <LocateMeControl position="bottomright" />
        </CampusMapContainer>

        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 950,
            width: 46,
            height: 46,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.2s',
          }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* GPS status messages */}
        {gpsLoading && (
          <div style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 950,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: 'var(--shadow-md)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}>
            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
            Acquiring GPS...
          </div>
        )}

        {gpsError && !gpsLoading && (
          <div style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 950,
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 12,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: 'var(--shadow-md)',
            fontSize: 13,
            color: '#dc2626',
            maxWidth: 'calc(100vw - 120px)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            <WifiOff size={14} />
            {gpsError}
          </div>
        )}

        {/* Student sidebar */}
        <StudentSidebar
          markers={markers}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={handleNavigate}
          onSelect={handleSelect}
        />

        {/* Navigation card */}
        {isNavigating && destination && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 950, padding: '0 16px 24px', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'all' }}>
              <NavigationCard
                destination={destination}
                distanceMeters={distanceMeters}
                durationSeconds={durationSeconds}
                onStop={handleStopNavigation}
              />
            </div>
          </div>
        )}

        {/* Arrival modal */}
        <AnimatePresence>
          {hasArrived && destination && (
            <ArrivalModal
              destinationName={destination.name}
              onDismiss={dismissArrival}
            />
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
