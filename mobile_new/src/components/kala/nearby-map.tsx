import { useEffect, useRef } from "react";
import type { CraftEvent } from "@/data/kalasangam";

type NearbyMapProps = {
  events: CraftEvent[];
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
  userCoords: { lat: number; lng: number } | null;
};

export function NearbyMap({
  events,
  selectedEventId,
  onSelectEvent,
  userCoords,
}: NearbyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    // Inject Leaflet CSS if not already present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map if already created
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Default center: Pedana / Krishna district artisan cluster
      const defaultCenter: [number, number] = userCoords
        ? [userCoords.lat, userCoords.lng]
        : [16.35, 80.85];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
      });

      // Subtle, clean OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom control top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      mapInstanceRef.current = map;

      // Add User Location Marker
      if (userCoords) {
        const userIcon = L.divIcon({
          className: "custom-user-marker",
          html: `<div style="
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #2563eb;
            border: 3px solid #ffffff;
            box-shadow: 0 0 12px rgba(37,99,235,0.7);
            animation: pulse 2s infinite;
          "></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
          icon: userIcon,
        })
          .addTo(map)
          .bindTooltip("You are here", { permanent: false, direction: "top" });
      }

      // Add Event Markers
      markersRef.current = {};
      events.forEach((ev) => {
        const isSelected = ev.id === selectedEventId;
        const iconHtml = `<div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? "38px" : "32px"};
          height: ${isSelected ? "38px" : "32px"};
          border-radius: 50%;
          background: ${isSelected ? "#b45309" : "#c2410c"};
          color: #ffffff;
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 14px rgba(194,65,12,0.45);
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <svg width="${isSelected ? "18" : "15"}" height="${isSelected ? "18" : "15"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>`;

        const icon = L.divIcon({
          className: `event-marker-${ev.id}`,
          html: iconHtml,
          iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
          iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16],
        });

        const marker = L.marker([ev.lat, ev.lng], { icon }).addTo(map);

        marker.on("click", () => {
          onSelectEvent(ev.id);
        });

        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; line-height: 1.4; padding: 2px;">
            <p style="font-weight: 700; color: #111827; margin: 0 0 2px 0;">${ev.name}</p>
            <p style="color: #6b7280; font-size: 11px; margin: 0 0 6px 0;">${ev.location}</p>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600;">
              <span style="color: #c2410c;">${ev.date}</span>
              <span style="color: #16a34a;">${ev.stallFee}</span>
            </div>
          </div>
        `);

        markersRef.current[ev.id] = marker;
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [events, userCoords]);

  // Handle selected event change from cards
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedEventId) return;

    const targetEvent = events.find((e) => e.id === selectedEventId);
    if (!targetEvent) return;

    mapInstanceRef.current.setView([targetEvent.lat, targetEvent.lng], 12, {
      animate: true,
      duration: 0.6,
    });

    const marker = markersRef.current[selectedEventId];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedEventId, events]);

  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-border shadow-md bg-muted">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Map overlay hint */}
      <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none rounded-full bg-background/90 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border/60 shadow-sm flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary animate-pulse" />
        Interactive Live Map · Tap pin
      </div>
    </div>
  );
}
