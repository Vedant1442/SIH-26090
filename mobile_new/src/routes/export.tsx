import { createFileRoute } from "@tanstack/react-router";
import { FileDown, AlertTriangle, Check } from "lucide-react";
import { AppShell, Panel, PanelRow, Tag } from "@/components/kala/shell";
import { exportTargets } from "@/data/kalasangam";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Platform Export Layer — Kalasangam" },
      {
        name: "description",
        content:
          "Prepare ONDC, GeM and CSV catalog packages from master-verified products, with a manifest and missing-field report.",
      },
      { property: "og:title", content: "Platform Export Layer — Kalasangam" },
      {
        property: "og:description",
        content: "Structured, commerce-ready handoff packages for verified artisan listings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExportPage,
});

function ExportPage() {
  const { products } = useStore();
  const verified = products.filter((p) => p.status === "verified").length;
  const pending = products.filter((p) => p.status !== "verified").length;

  return (
    <AppShell title="Export" subtitle="Prepared, never falsely 'published'">
      <Panel title="Eligible products">
        <PanelRow>
          <span className="min-w-0 flex-1 text-sm">Master-verified listings</span>
          <span className="font-display text-xl">{verified}</span>
        </PanelRow>
        <PanelRow>
          <span className="min-w-0 flex-1 text-sm text-muted-foreground">
            Waiting on verification
          </span>
          <span className="font-display text-xl text-muted-foreground">{pending}</span>
        </PanelRow>
      </Panel>

      <Panel title="Destinations">
        {exportTargets.map((t) => (
          <PanelRow key={t.id}>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {t.missing ? `${t.missing} fields missing` : "Manifest ready"}
              </p>
            </div>
            <Tag tone={t.missing ? "warning" : "success"}>{t.state}</Tag>
          </PanelRow>
        ))}
      </Panel>

      <Panel title="Missing-field report">
        {["HSN code", "Net weight", "Return policy"].map((f) => (
          <PanelRow key={f}>
            <AlertTriangle className="size-4 shrink-0 text-warning" />
            <span className="min-w-0 flex-1 truncate text-sm">{f}</span>
            <span className="panel-label shrink-0 text-primary">Fill</span>
          </PanelRow>
        ))}
        <PanelRow>
          <Check className="size-4 shrink-0 text-success" />
          <span className="min-w-0 flex-1 truncate text-sm">Images, title, price complete</span>
        </PanelRow>
      </Panel>

      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
        <FileDown className="size-4" /> Generate export package
      </button>
      <p className="px-1 text-xs text-muted-foreground">
        Status shows Prepared / Handed off / Accepted by external system. Kalasangam is not a
        marketplace and never becomes merchant of record.
      </p>
    </AppShell>
  );
}
