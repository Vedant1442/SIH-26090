import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { Home, Package, Mic, ShieldCheck, MapPin, Wifi, BatteryMedium } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Chatbot } from "./chatbot";
import { HelpWidgets } from "./help-widgets";

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
  const [initials, setInitials] = useState("KA");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("merchantName");
      setInitials(getInitials(name || undefined));
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col border-border/80 bg-background sm:border-x shadow-[0_0_70px_rgba(0,0,0,0.4)] relative">
        {/* Mock Mobile Phone Status Bar (Visible on desktop screens) */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-2.5 pb-1 text-[11px] font-semibold text-muted-foreground select-none bg-background/90 backdrop-blur z-20">
          <span className="font-mono text-xs text-foreground font-bold">9:41</span>
          <div className="h-4 w-20 rounded-full bg-zinc-900/90 mx-auto flex items-center justify-center">
            <div className="size-1.5 rounded-full bg-zinc-700 ml-auto mr-2" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="font-bold text-foreground">5G</span>
            <Wifi className="size-3 text-foreground" />
            <BatteryMedium className="size-3.5 text-foreground" />
          </div>
        </div>

        <header className="sticky top-0 z-20 border-b border-border bg-background/85 px-4 pt-3.5 pb-3 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold">{title}</h1>
              {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <Link
              to="/team"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs text-primary-foreground shadow-sm"
              aria-label="Merchant and team"
            >
              {initials}
            </Link>
          </div>
        </header>

        <HelpWidgets />

        <main className="flex-1 space-y-5 px-4 pt-4 pb-28">{children}</main>

        <Chatbot />

        <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:border-x">
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
