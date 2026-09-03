import { useState, useEffect } from "react";
import { Mic, Package, FileCheck2, MessageCircle, ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const TIPS = [
  {
    id: "capture",
    icon: Mic,
    gradient: "from-primary to-orange-500",
    title: "Capture with Voice",
    body: "Speak about your product in your language — AI instantly creates a full catalog listing for you.",
    action: "/capture",
    actionLabel: "Try Voice Capture",
    emoji: "🎙️",
  },
  {
    id: "catalog",
    icon: Package,
    gradient: "from-blue-500 to-indigo-500",
    title: "Review Your Catalog",
    body: "Check and verify your listings before they go live on ONDC & GeM marketplaces.",
    action: "/catalog",
    actionLabel: "Open Catalog",
    emoji: "📦",
  },
  {
    id: "export",
    icon: FileCheck2,
    gradient: "from-emerald-500 to-teal-500",
    title: "Export & Go Live",
    body: "Download your verified catalog as a CSV — ready to upload on government marketplaces instantly.",
    action: "/export",
    actionLabel: "Export Now",
    emoji: "🚀",
  },
  {
    id: "kalamitr",
    icon: MessageCircle,
    gradient: "from-violet-500 to-purple-600",
    title: "Ask KalaMitr Anything",
    body: "Your AI guide for pricing, ONDC, GeM, and craft fairs — answers in your own language.",
    action: null,
    actionLabel: null,
    emoji: "✨",
  },
];

const SESSION_DISMISSED_KEY = "kala_help_dismissed";
const SESSION_DONE_KEY = "kala_help_done";

function getDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_DISMISSED_KEY) || "[]");
  } catch {
    return [];
  }
}

function setDismissedStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_DISMISSED_KEY, JSON.stringify(ids));
}

export function HelpWidgets() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((n) => n + 1);

  useEffect(() => {
    setMounted(true);
    const done = sessionStorage.getItem(SESSION_DONE_KEY) === "true";
    setIsMinimized(done);
  }, []);

  if (!mounted || typeof window === "undefined") return null;

  // Only show if user has an active session / name
  const isLoggedIn = !!localStorage.getItem("merchantName") || localStorage.getItem("onboarded") === "true";
  if (!isLoggedIn) return null;

  // If dismissed or marked done, hide completely
  if (isMinimized) return null;

  const dismissed = getDismissed();
  const remaining = TIPS.filter((t) => !dismissed.includes(t.id));

  // If all remaining are done, hide completely
  if (remaining.length === 0) return null;

  const tip = remaining[0];
  if (!tip) return null;

  const Icon = tip.icon;
  const globalIdx = TIPS.findIndex((t) => t.id === tip.id);

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissedStorage(next);

    if (next.length >= TIPS.length) {
      sessionStorage.setItem(SESSION_DONE_KEY, "true");
      setIsMinimized(true);
    }
    rerender();
  };

  const skipAll = () => {
    sessionStorage.setItem(SESSION_DONE_KEY, "true");
    setIsMinimized(true);
  };

  const handleAction = () => {
    const dest = tip.action;
    dismiss(tip.id);
    if (dest) navigate({ to: dest as any });
  };

  return (
    <div className="fixed top-[68px] sm:top-[74px] left-3 right-3 z-50 max-w-[400px] mx-auto animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="rounded-2xl bg-card border border-border shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">

        {/* Gradient header */}
        <div className={`bg-gradient-to-r ${tip.gradient} px-4 pt-4 pb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20">
                <Icon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-tight">{tip.title}</p>
                <p className="text-[11px] text-white/70 mt-0.5">{tip.emoji} Quick tip</p>
              </div>
            </div>

            <button
              onClick={skipAll}
              className="text-[11px] font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-2.5 py-1 transition-colors shrink-0"
              title="Skip guide"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed">{tip.body}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          {/* Step dots — all 4 always visible */}
          <div className="flex items-center gap-1.5">
            {TIPS.map((t) => {
              const isDismissed = dismissed.includes(t.id);
              const isCurrent = t.id === tip.id;
              return (
                <div
                  key={t.id}
                  className={`rounded-full transition-all duration-300 ${
                    isCurrent
                      ? `w-5 h-2 bg-gradient-to-r ${tip.gradient}`
                      : isDismissed
                      ? "w-2 h-2 bg-primary/30"
                      : "w-2 h-2 bg-muted-foreground/20"
                  }`}
                />
              );
            })}
            <span className="ml-1 text-[10px] text-muted-foreground font-medium">
              {globalIdx + 1}/{TIPS.length}
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => dismiss(tip.id)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Next
            </button>
            {tip.action ? (
              <button
                onClick={handleAction}
                className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r ${tip.gradient} px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity active:scale-95`}
              >
                {tip.actionLabel}
                <ArrowRight className="size-3" />
              </button>
            ) : (
              <button
                onClick={() => dismiss(tip.id)}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity active:scale-95"
              >
                <Sparkles className="size-3" /> Got it!
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
