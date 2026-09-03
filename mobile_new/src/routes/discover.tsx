import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  MapPin,
  CalendarDays,
  Navigation,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  LocateFixed,
  Users,
  Building2,
  Gift,
  Search,
} from "lucide-react";
import { AppShell, Panel, PanelRow, Tag } from "@/components/kala/shell";
import { events as defaultEvents, type CraftEvent } from "@/data/kalasangam";
import { NearbyMap } from "@/components/kala/nearby-map";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Nearby Melas & Selling Events — Kalasangam" },
      {
        name: "description",
        content:
          "Discover melas, craft fairs and exhibitions near your village, with live map, dates, distance and stall fees.",
      },
      { property: "og:title", content: "Nearby Melas & Selling Events — Kalasangam" },
      {
        property: "og:description",
        content: "Find where to sell your craft in person with live map and Google Maps directions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiscoverPage,
});

// Haversine distance calculator in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

type FilterCategory = "all" | "free" | "Mela" | "Expo" | "Haat" | "saved";

function DiscoverPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [category, setCategory] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [eventsList, setEventsList] = useState<CraftEvent[]>(defaultEvents);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("kala_saved_events") || "[]");
      setSavedEventIds(saved);
    } catch {
      setSavedEventIds([]);
    }
  }, []);

  // Geolocation trigger
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setIsLocating(false);

        // Recalculate distances based on user's real GPS
        const updated = defaultEvents.map((ev) => {
          const distKm = calculateDistanceKm(coords.lat, coords.lng, ev.lat, ev.lng);
          return {
            ...ev,
            distanceKm: distKm,
            distance: `${distKm} km`,
          };
        });
        // Sort by nearest distance
        updated.sort((a, b) => a.distanceKm - b.distanceKm);
        setEventsList(updated);
      },
      (err) => {
        setIsLocating(false);
        alert("Unable to retrieve location. Defaulting to Pedana artisan cluster.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Toggle bookmark
  const toggleSaveEvent = (id: string) => {
    let next: string[];
    if (savedEventIds.includes(id)) {
      next = savedEventIds.filter((item) => item !== id);
    } else {
      next = [...savedEventIds, id];
    }
    setSavedEventIds(next);
    localStorage.setItem("kala_saved_events", JSON.stringify(next));
  };

  // Filter logic
  const filteredEvents = eventsList.filter((ev) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ev.name.toLowerCase().includes(q);
      const matchLoc = ev.location.toLowerCase().includes(q);
      if (!matchName && !matchLoc) return false;
    }

    if (category === "saved") {
      return savedEventIds.includes(ev.id);
    }
    if (category === "free") {
      return ev.isFreeWithUdyam;
    }
    if (category === "all") {
      return true;
    }
    return ev.tag === category;
  });

  return (
    <AppShell title="Nearby" subtitle="Melas, fairs and exhibitions near you">
      {/* Search & Location Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search melas, cities, grounds..."
            className="w-full rounded-2xl border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2.5 text-xs font-semibold shadow-sm transition-all active:scale-95 ${
            userCoords
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:bg-muted text-foreground"
          }`}
          title="Detect live GPS location"
        >
          <LocateFixed className={`size-4 ${isLocating ? "animate-spin" : ""}`} />
          <span>{userCoords ? "Located" : "Near me"}</span>
        </button>
      </div>

      {/* Interactive Leaflet Map */}
      <NearbyMap
        events={filteredEvents}
        selectedEventId={selectedEventId}
        onSelectEvent={(id) => {
          setSelectedEventId(id);
          const el = document.getElementById(`event-card-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }}
        userCoords={userCoords}
      />

      {/* Category Filter Chips */}
      <div className="-mx-4 overflow-x-auto px-4 py-1">
        <div className="flex w-max gap-2">
          {(
            [
              { id: "all", label: `All (${eventsList.length})` },
              { id: "free", label: "Free with Udyam 🎁" },
              { id: "Mela", label: "Melas" },
              { id: "Expo", label: "Expos" },
              { id: "Haat", label: "Craft Haats" },
              { id: "saved", label: `Saved (${savedEventIds.length})` },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-all ${
                category === cat.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-border p-6 bg-muted/20">
            <p className="text-sm font-semibold text-foreground">No events found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try switching category filter or clearing your search term.
            </p>
          </div>
        ) : (
          filteredEvents.map((e) => {
            const isSelected = e.id === selectedEventId;
            const isSaved = savedEventIds.includes(e.id);

            return (
              <Panel
                key={e.id}
                className={`transition-all duration-200 ${
                  isSelected ? "ring-2 ring-primary shadow-lg" : ""
                }`}
              >
                <div id={`event-card-${e.id}`} className="p-4 space-y-3">
                  {/* Title & Tag Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-foreground leading-snug">
                          {e.name}
                        </h2>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Building2 className="size-3.5 shrink-0" />
                        <span className="truncate">{e.location}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Tag tone={e.isFreeWithUdyam ? "success" : "primary"}>
                        {e.tag}
                      </Tag>
                      <button
                        onClick={() => toggleSaveEvent(e.id)}
                        className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                        title={isSaved ? "Remove bookmark" : "Save event"}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="size-4 text-primary fill-primary/20" />
                        ) : (
                          <Bookmark className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Subsidy Highlight Banner if free or subsidized */}
                  {e.subsidyNote && (
                    <div className="flex items-center gap-2 rounded-xl bg-primary/8 border border-primary/20 px-3 py-2 text-xs text-primary font-medium">
                      <Gift className="size-4 shrink-0 text-primary" />
                      <span className="truncate">{e.subsidyNote}</span>
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/50 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">Date</span>
                      <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                        <CalendarDays className="size-3 text-muted-foreground" /> {e.date}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">Distance</span>
                      <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 text-muted-foreground" /> {e.distance}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">Footfall</span>
                      <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                        <Users className="size-3 text-muted-foreground" /> {e.footfall.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stall Fee Row */}
                <PanelRow>
                  <span className="panel-label flex-1">Stall Booking Fee</span>
                  <span
                    className={`shrink-0 text-sm font-bold ${
                      e.isFreeWithUdyam ? "text-success" : "text-foreground"
                    }`}
                  >
                    {e.stallFee}
                  </span>
                </PanelRow>

                {/* Actions: Focus on Map + Real Google Maps Navigation */}
                <div className="grid grid-cols-2 hairline">
                  <button
                    onClick={() => {
                      setSelectedEventId(e.id);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className="py-3 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapPin className="size-3.5" /> View on Map
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 text-xs font-semibold text-primary border-l border-border hover:bg-primary/5 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="size-3.5" /> Get Directions
                  </a>
                </div>
              </Panel>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
