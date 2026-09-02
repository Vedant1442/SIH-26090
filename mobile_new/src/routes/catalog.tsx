import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { AppShell, Panel, PanelRow, Tag } from "@/components/kala/shell";
import { type ProductStatus } from "@/data/kalasangam";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalog & Verification — Kalasangam" },
      {
        name: "description",
        content:
          "Review staff-captured drafts, verify listings as the master artisan and keep your craft catalog export-ready.",
      },
      { property: "og:title", content: "Catalog & Verification — Kalasangam" },
      {
        property: "og:description",
        content: "Master verification queue for artisan product listings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

const filters: { id: ProductStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "To verify" },
  { id: "verified", label: "Verified" },
  { id: "draft", label: "Drafts" },
];

function CatalogPage() {
  const { products, verifyProduct } = useStore();
  const [filter, setFilter] = useState<ProductStatus | "all">("all");

  const list = products.filter((p) => {
    return filter === "all" || p.status === filter;
  });

  return (
    <AppShell title="Catalog" subtitle={`${products.length} products · master verification`}>
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {list.map((p) => {
        const isVerified = p.status === "verified";
        return (
          <Panel key={p.id}>
            <div className="flex gap-3 p-3">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="size-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <Tag tone={isVerified ? "success" : p.status === "draft" ? "muted" : "warning"}>
                    {isVerified ? "Verified" : p.status === "draft" ? "Draft" : "Pending"}
                  </Tag>
                </div>
                <p className="truncate text-xs text-muted-foreground">{p.nameLocal}</p>
                <p className="mt-1.5 font-display text-base">
                  ₹{p.priceLow.toLocaleString("en-IN")} – ₹{p.priceHigh.toLocaleString("en-IN")}
                </p>
                <p className="panel-label mt-0.5 truncate">
                  {p.confidence} confidence · {p.craft}
                </p>
              </div>
            </div>

            {p.exceptions.length > 0 && !isVerified && (
              <div className="hairline space-y-1 bg-warning/10 px-4 py-2.5">
                {p.exceptions.map((e) => (
                  <p key={e} className="flex items-center gap-2 text-xs text-warning-foreground">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    <span className="min-w-0 truncate">{e}</span>
                  </p>
                ))}
              </div>
            )}

            <div className="hairline grid grid-cols-2">
              <button className="py-3 text-sm font-medium text-muted-foreground">Edit draft</button>
              <button
                disabled={isVerified}
                onClick={() => verifyProduct(p.id)}
                className="flex items-center justify-center gap-1.5 border-l border-border py-3 text-sm font-medium text-primary disabled:text-muted-foreground"
              >
                <Check className="size-4" />
                {isVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </Panel>
        );
      })}
    </AppShell>
  );
}
