import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, X, Save } from "lucide-react";
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

type EditDraft = {
  id: string;
  name: string;
  nameLocal: string;
  materials: string;
  priceLow: number;
  priceHigh: number;
};

function EditDraftModal({
  draft,
  onSave,
  onClose,
}: {
  draft: EditDraft;
  onSave: (updated: EditDraft) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(draft);

  const update = (key: keyof EditDraft, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const isNameValid = form.name.trim().length >= 3;
  const isPriceLowValid = Number(form.priceLow) > 0;
  const isPriceHighValid = Number(form.priceHigh) >= Number(form.priceLow);
  const isFormValid = isNameValid && isPriceLowValid && isPriceHighValid;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-3xl bg-background border-t border-border shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
          <h2 className="text-lg font-semibold">Edit Draft</h2>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Product Name (English)
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={`w-full rounded-xl border bg-card/50 px-4 py-3 text-sm outline-none focus:ring-1 ${
                !isNameValid ? "border-destructive focus:ring-destructive" : "border-border focus:border-primary focus:ring-primary"
              }`}
            />
            {!isNameValid && (
              <p className="text-xs text-destructive mt-1">Product name must be at least 3 characters.</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Local Language Name
            </label>
            <input
              value={form.nameLocal}
              onChange={(e) => update("nameLocal", e.target.value)}
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Materials Used
            </label>
            <input
              value={form.materials}
              onChange={(e) => update("materials", e.target.value)}
              placeholder="e.g. Silk, Cotton, Natural dyes"
              className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Min Price (₹)
              </label>
              <input
                type="number"
                min={1}
                value={form.priceLow || ""}
                onChange={(e) => update("priceLow", Math.max(0, parseInt(e.target.value, 10) || 0))}
                className={`w-full rounded-xl border bg-card/50 px-4 py-3 text-sm outline-none focus:ring-1 ${
                  !isPriceLowValid ? "border-destructive focus:ring-destructive" : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              {!isPriceLowValid && (
                <p className="text-[11px] text-destructive mt-1">Must be &gt; ₹0</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Max Price (₹)
              </label>
              <input
                type="number"
                min={form.priceLow || 1}
                value={form.priceHigh || ""}
                onChange={(e) => update("priceHigh", Math.max(0, parseInt(e.target.value, 10) || 0))}
                className={`w-full rounded-xl border bg-card/50 px-4 py-3 text-sm outline-none focus:ring-1 ${
                  !isPriceHighValid ? "border-destructive focus:ring-destructive" : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              {!isPriceHighValid && (
                <p className="text-[11px] text-destructive mt-1">Must be ≥ Min Price</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border">
          <button
            onClick={() => isFormValid && onSave(form)}
            disabled={!isFormValid}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all"
          >
            <Save className="size-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogPage() {
  const { products, verifyProduct, updateProduct } = useStore();
  const [filter, setFilter] = useState<ProductStatus | "all">("all");
  const [editingProduct, setEditingProduct] = useState<EditDraft | null>(null);
  const [localEdits, setLocalEdits] = useState<Record<string, Partial<EditDraft>>>({});

  const list = products.filter((p) => filter === "all" || p.status === filter);

  const handleSaveEdit = (updated: EditDraft) => {
    setLocalEdits((prev) => ({ ...prev, [updated.id]: updated }));
    updateProduct(updated.id, {
      name: updated.name,
      nameLocal: updated.nameLocal,
      materials: updated.materials,
      priceLow: updated.priceLow,
      priceHigh: updated.priceHigh,
    });
    setEditingProduct(null);
  };

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
        const overrides = localEdits[p.id] || {};
        const product = { ...p, ...overrides };
        const isVerified = product.status === "verified";
        return (
          <Panel key={product.id}>
            <div className="flex gap-3 p-3">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="size-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="truncate text-sm font-semibold">{product.name}</p>
                  <Tag tone={isVerified ? "success" : product.status === "draft" ? "muted" : "warning"}>
                    {isVerified ? "Verified" : product.status === "draft" ? "Draft" : "Pending"}
                  </Tag>
                </div>
                <p className="truncate text-xs text-muted-foreground">{product.nameLocal}</p>
                <p className="mt-1.5 font-display text-base">
                  ₹{product.priceLow.toLocaleString("en-IN")} – ₹{product.priceHigh.toLocaleString("en-IN")}
                </p>
                <p className="panel-label mt-0.5 truncate">
                  {product.confidence} confidence · {product.materials || "Natural Materials"}
                </p>
              </div>
            </div>

            {p.priceReasoning && (
              <div className="hairline bg-primary/5 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">AI Market Insight</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.priceReasoning}</p>
              </div>
            )}

            {product.exceptions.length > 0 && !isVerified && (
              <div className="hairline space-y-1 bg-warning/10 px-4 py-2.5">
                {product.exceptions.map((e) => (
                  <p key={e} className="flex items-center gap-2 text-xs text-warning-foreground">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    <span className="min-w-0 truncate">{e}</span>
                  </p>
                ))}
              </div>
            )}

            <div className="hairline grid grid-cols-2">
              <button
                onClick={() =>
                  setEditingProduct({
                    id: product.id,
                    name: product.name,
                    nameLocal: product.nameLocal,
                    materials: product.materials || "",
                    priceLow: product.priceLow,
                    priceHigh: product.priceHigh,
                  })
                }
                className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                Edit draft
              </button>
              <button
                disabled={isVerified}
                onClick={() => verifyProduct(product.id)}
                className="flex items-center justify-center gap-1.5 border-l border-border py-3 text-sm font-medium text-primary disabled:text-muted-foreground hover:bg-primary/5 transition-colors"
              >
                <Check className="size-4" />
                {isVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </Panel>
        );
      })}

      {editingProduct && (
        <EditDraftModal
          draft={editingProduct}
          onSave={handleSaveEdit}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </AppShell>
  );
}
