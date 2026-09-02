import { createFileRoute, Link } from "@tanstack/react-router";
import { Volume2, MapPin, Check } from "lucide-react";
import { AppShell, Panel, PanelRow, Tag } from "@/components/kala/shell";
import { digiReady } from "@/data/kalasangam";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/ready")({
  head: () => ({
    meta: [
      { title: "Formalization & DigiReady — Kalasangam" },
      {
        name: "description",
        content:
          "Track Aadhaar, bank, PAN, Udyam and GST readiness with voice explanations, nearby CSC help and DigiReady progress.",
      },
      { property: "og:title", content: "Formalization & DigiReady — Kalasangam" },
      {
        property: "og:description",
        content: "Know the next practical step to become digitally and officially ready.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReadyPage,
});

const tone = (s: string) =>
  s === "Active" || s === "Registered" ? "success" : s === "In progress" ? "warning" : "muted";

function ReadyPage() {
  const { docSteps, updateDocStatus } = useStore();
  const done = digiReady.filter((d) => d.done).length;

  const cycleStatus = (id: string, current: string) => {
    if (current === "Not started") updateDocStatus(id, "In progress");
    else if (current === "In progress") updateDocStatus(id, "Active");
    else updateDocStatus(id, "Not started");
  };

  return (
    <AppShell title="Readiness" subtitle="Documents, schemes and DigiReady">
      <Panel title="Documents">
        {docSteps.map((d) => (
          <div 
            key={d.id} 
            onClick={() => cycleStatus(d.id, d.status)}
            className="cursor-pointer transition-colors hover:bg-muted/50"
          >
            <PanelRow>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.title}</p>
                <p className="truncate text-xs text-muted-foreground">{d.why}</p>
              </div>
              <Tag tone={tone(d.status) as "success" | "warning" | "muted"}>{d.status}</Tag>
            </PanelRow>
          </div>
        ))}
        <div className="hairline grid grid-cols-2">
          <button className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary">
            <Volume2 className="size-4" /> Explain in Telugu
          </button>
          <button className="flex items-center justify-center gap-2 border-l border-border py-3 text-sm font-medium">
            <MapPin className="size-4" /> Nearby CSC
          </button>
        </div>
      </Panel>

      <Panel title={`DigiReady · ${done} of 7 areas`}>
        <div className="p-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(done / 7) * 100}%` }} />
          </div>
        </div>
        {digiReady.map((a) => (
          <PanelRow key={a.area}>
            <span
              className={`grid size-5 shrink-0 place-items-center rounded-full ${
                a.done ? "bg-success text-success-foreground" : "border border-border"
              }`}
            >
              {a.done && <Check className="size-3" />}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">{a.area}</span>
          </PanelRow>
        ))}
      </Panel>

      <Panel title="Scheme match">
        <PanelRow>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">PM Vishwakarma</p>
            <p className="text-xs text-muted-foreground">
              Collateral-free loan up to ₹3 lakh · 5% concessional rate
            </p>
          </div>
          <Tag tone="primary">Eligible*</Tag>
        </PanelRow>
        <PanelRow>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Handicrafts marketing assistance</p>
            <p className="text-xs text-muted-foreground">Needs Udyam registration first</p>
          </div>
          <Tag tone="warning">Blocked</Tag>
        </PanelRow>
        <p className="hairline px-4 py-3 text-xs text-muted-foreground">
          *Kalasangam prepares and hands off applications. Eligibility and approval are decided by the
          official channel.
        </p>
      </Panel>

      <Link
        to="/export"
        className="block w-full rounded-xl bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground"
      >
        Go to export layer
      </Link>
    </AppShell>
  );
}
