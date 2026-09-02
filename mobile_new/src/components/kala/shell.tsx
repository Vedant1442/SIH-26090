import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Package, Mic, ShieldCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/catalog", label: "Catalog", icon: Package },
  { to: "/capture", label: "Capture", icon: Mic, primary: true },
  { to: "/ready", label: "Ready", icon: ShieldCheck },
  { to: "/discover", label: "Nearby", icon: MapPin },
] as const;

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", className)}>
      {(title || action) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-1">
          <span className="panel-label truncate">{title}</span>
          {action}
        </div>
      )}
      <div className="panel">{children}</div>
    </section>
  );
}

export function PanelRow({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={cn("panel-row", onClick && "transition-colors active:bg-muted", className)}>
      {children}
    </Tag>
  );
}

export function Tag({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "success" | "warning" | "primary" | "accent";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-success/12 text-success",
    warning: "bg-warning/18 text-warning-foreground",
    primary: "bg-primary/12 text-primary",
    accent: "bg-accent/12 text-accent",
  } as const;
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col border-border bg-background sm:max-w-lg sm:border-x lg:max-w-xl">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 px-4 pt-5 pb-3 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold">{title}</h1>
              {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <Link
              to="/team"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs text-primary-foreground"
              aria-label="Merchant and team"
            >
              LD
            </Link>
          </div>
        </header>

        <main className="flex-1 space-y-5 px-4 pt-4 pb-28">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:max-w-lg lg:max-w-xl">
          <ul className="grid grid-cols-5">
            {tabs.map((t) => {
              const active = pathname === t.to;
              const Icon = t.icon;
              return (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-colors",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-xl transition-colors",
                        "primary" in t && t.primary
                          ? "bg-primary text-primary-foreground"
                          : active
                            ? "bg-primary/12"
                            : "",
                      )}
                    >
                      <Icon className="size-[18px]" strokeWidth={2} />
                    </span>
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
