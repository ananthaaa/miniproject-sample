import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface LocateMeControlProps {
  position?: L.ControlPosition;
}

/**
 * Custom "Locate Me" Leaflet control button.
 * Fires browser geolocation and flies the map to that position.
 */
export function LocateMeControl({ position = 'bottomright' }: LocateMeControlProps) {
  const map = useMap();

  useEffect(() => {
    const LocateControl = L.Control.extend({
      options: { position },
      onAdd() {
        const btn = L.DomUtil.create('button', '');
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        `;
        btn.title = 'Locate Me';
        btn.style.cssText = `
          width: 44px; height: 44px;
          background: var(--bg-secondary, #fff);
          border: none;
          border-radius: 12px;
          box-shadow: var(--shadow-md, 0 4px 16px rgba(0,0,0,0.12));
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--campus-blue, #0066ff);
          transition: all 0.2s ease;
          font-size: 0;
        `;

        btn.onmouseenter = () => { btn.style.transform = 'scale(1.05)'; };
        btn.onmouseleave = () => { btn.style.transform = 'scale(1)'; };

        L.DomEvent.on(btn, 'click', L.DomEvent.stopPropagation);
        L.DomEvent.on(btn, 'click', () => {
          if (!navigator.geolocation) return;
          btn.style.opacity = '0.6';
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              map.flyTo([pos.coords.latitude, pos.coords.longitude], 19, { duration: 1.5 });
              btn.style.opacity = '1';
            },
            () => { btn.style.opacity = '1'; },
            { enableHighAccuracy: true, timeout: 8000 }
          );
        });

        return btn;
      },
    });

    const control = new LocateControl();
    map.addControl(control);
    return () => { map.removeControl(control); };
  }, [map, position]);

  return null;
}
