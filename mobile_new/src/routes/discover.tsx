import { createFileRoute } from "@tanstack/react-router";
import { MapPin, CalendarDays } from "lucide-react";
import { AppShell, Panel, PanelRow, Tag } from "@/components/kala/shell";
import { events } from "@/data/kalasangam";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Nearby Melas & Selling Events — Kalasangam" },
      {
        name: "description",
        content:
          "Discover melas, craft fairs and exhibitions near your village, with dates, distance and stall fees.",
      },
      { property: "og:title", content: "Nearby Melas & Selling Events — Kalasangam" },
      {
        property: "og:description",
        content: "Find where to sell your craft in person this season.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <AppShell title="Nearby" subtitle="Melas, fairs and exhibitions">
      <div className="panel relative h-40 bg-muted">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:28px_28px]" />
        {[
          { top: "30%", left: "24%" },
          { top: "55%", left: "62%" },
          { top: "20%", left: "74%" },
        ].map((pos, i) => (
          <span
            key={i}
            style={pos}
            className="absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <MapPin className="size-4" />
          </span>
        ))}
        <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
          Within 80 km
        </span>
      </div>

      {events.map((e) => (
        <Panel key={e.id}>
          <div className="p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <h2 className="truncate text-base font-semibold">{e.name}</h2>
              <Tag tone="accent">{e.tag}</Tag>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> {e.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {e.distance}
              </span>
            </div>
          </div>
          <PanelRow>
            <span className="panel-label flex-1">Stall fee</span>
            <span className="shrink-0 text-sm font-medium">{e.stallFee}</span>
          </PanelRow>
          <button className="panel-row hairline justify-center text-sm font-medium text-primary">
            Save & get directions
          </button>
        </Panel>
      ))}
    </AppShell>
  );
}
