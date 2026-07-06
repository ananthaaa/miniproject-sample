import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Destination } from '../../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../types';

interface DestinationMarkerProps {
  destination: Destination;
  isSelected?: boolean;
  onNavigate?: (destination: Destination) => void;
  isAdminMode?: boolean;
  onEdit?: (destination: Destination) => void;
  onDelete?: (id: string) => void;
}

/**
 * Category-colored destination marker with rich popup.
 * Abstracted so it can be replaced with SVG pins without changing
 * StudentDashboard or AdminDashboard logic.
 */
export function DestinationMarker({
  destination,
  isSelected = false,
  onNavigate,
  isAdminMode = false,
  onEdit,
  onDelete,
}: DestinationMarkerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  const colors = CATEGORY_COLORS[destination.category];
  const icon = CATEGORY_ICONS[destination.category];

  const createIcon = (selected: boolean) =>
    L.divIcon({
      className: '',
      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -52],
      html: `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
          <div style="
            width:${selected ? '44px' : '40px'};
            height:${selected ? '44px' : '40px'};
            background:${colors.bg};
            border:2.5px solid ${colors.border};
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:${selected ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)'};
            display:flex;align-items:center;justify-content:center;
            transition:all 0.2s;
          ">
            <span style="
              transform:rotate(45deg);
              font-size:${selected ? '18px' : '16px'};
              display:block;
            ">${icon}</span>
          </div>
          ${selected ? `<div style="
            position:absolute;bottom:-8px;
            width:8px;height:8px;
            background:${colors.border};
            border-radius:50%;
          "></div>` : ''}
        </div>
      `,
    });

  useEffect(() => {
    const buildPopupContent = () => {
      const container = document.createElement('div');
      container.style.cssText = 'padding:0;min-width:240px;font-family:Inter,sans-serif;';

      const header = document.createElement('div');
      header.style.cssText = `
        background:linear-gradient(135deg,${colors.bg},${colors.border}40);
        padding:16px 20px 12px;
        border-bottom:1px solid ${colors.border}60;
      `;
      header.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <span style="font-size:22px;">${icon}</span>
          <div>
            <div style="font-weight:700;font-size:15px;color:${colors.text};line-height:1.2;">${destination.name}</div>
            <div style="
              display:inline-block;
              background:${colors.bg};
              color:${colors.text};
              border:1px solid ${colors.border};
              border-radius:20px;
              padding:1px 8px;
              font-size:10px;
              font-weight:600;
              text-transform:uppercase;
              letter-spacing:0.5px;
              margin-top:3px;
            ">${destination.category}</div>
          </div>
        </div>
      `;

      const body = document.createElement('div');
      body.style.cssText = 'padding:12px 20px 16px;';
      body.innerHTML = `
        <p style="margin:0 0 12px;font-size:13px;color:var(--text-secondary,#64748b);line-height:1.5;">
          ${destination.description}
        </p>
        <div style="display:flex;gap:6px;font-size:11px;color:var(--text-secondary,#64748b);margin-bottom:${isAdminMode ? '12px' : '0'};">
          <span>📍 ${destination.lat.toFixed(6)}, ${destination.lng.toFixed(6)}</span>
        </div>
      `;

      if (!isAdminMode && onNavigate) {
        const navBtn = document.createElement('button');
        navBtn.textContent = '🗺️  Navigate Here';
        navBtn.style.cssText = `
          width:100%;
          background:linear-gradient(135deg,#0066ff,#0052cc);
          color:white;
          border:none;
          border-radius:10px;
          padding:10px 16px;
          font-weight:600;
          font-size:13px;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:6px;
          transition:all 0.2s;
          margin-top:12px;
          font-family:Inter,sans-serif;
          box-shadow:0 4px 12px rgba(0,102,255,0.3);
        `;
        navBtn.onmouseenter = () => { navBtn.style.transform = 'translateY(-1px)'; navBtn.style.boxShadow = '0 6px 20px rgba(0,102,255,0.4)'; };
        navBtn.onmouseleave = () => { navBtn.style.transform = ''; navBtn.style.boxShadow = '0 4px 12px rgba(0,102,255,0.3)'; };
        navBtn.onclick = () => {
          if (popupRef.current) map.closePopup(popupRef.current);
          onNavigate(destination);
        };
        body.appendChild(navBtn);
      }

      if (isAdminMode) {
        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:8px;margin-top:8px;';

        if (onEdit) {
          const editBtn = document.createElement('button');
          editBtn.textContent = '✏️  Edit';
          editBtn.style.cssText = `
            flex:1;background:linear-gradient(135deg,#6366f1,#4f46e5);
            color:white;border:none;border-radius:8px;padding:8px 12px;
            font-weight:600;font-size:12px;cursor:pointer;font-family:Inter,sans-serif;
          `;
          editBtn.onclick = () => {
            if (popupRef.current) map.closePopup(popupRef.current);
            onEdit(destination);
          };
          btnRow.appendChild(editBtn);
        }

        if (onDelete) {
          const delBtn = document.createElement('button');
          delBtn.textContent = '🗑️  Delete';
          delBtn.style.cssText = `
            flex:1;background:linear-gradient(135deg,#ef4444,#dc2626);
            color:white;border:none;border-radius:8px;padding:8px 12px;
            font-weight:600;font-size:12px;cursor:pointer;font-family:Inter,sans-serif;
          `;
          delBtn.onclick = () => {
            if (confirm(`Delete "${destination.name}"?`)) {
              if (popupRef.current) map.closePopup(popupRef.current);
              onDelete(destination.id);
            }
          };
          btnRow.appendChild(delBtn);
        }
        body.appendChild(btnRow);
      }

      container.appendChild(header);
      container.appendChild(body);
      return container;
    };

    const popup = L.popup({ maxWidth: 300, minWidth: 240, closeButton: true })
      .setContent(buildPopupContent());

    popupRef.current = popup;

    markerRef.current = L.marker([destination.lat, destination.lng], {
      icon: createIcon(isSelected),
    })
      .bindPopup(popup)
      .addTo(map);

    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [map, destination.id, isAdminMode]);

  // Update icon when selection changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(createIcon(isSelected));
    }
  }, [isSelected]);

  return null;
}
