import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, ArrowRight, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/kala/shell";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Welcome to Kalasangam" }],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("");
  const [name, setName] = useState("");

  const handleComplete = () => {
    localStorage.setItem("onboarded", "true");
    localStorage.setItem("merchantName", name || "Artisan");
    localStorage.setItem("merchantLang", language || "English");
    navigate({ to: "/" });
  };

  return (
    <AppShell title="Welcome" subtitle="Virtual Business Manager">
      <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto mb-8 grid size-20 place-items-center rounded-full bg-primary/10 text-primary">
              <Mic className="size-10" />
            </div>
            <h1 className="mb-2 text-center font-display text-3xl font-bold text-foreground">
              Choose Language
            </h1>
            <p className="mb-8 text-center text-muted-foreground">
              Speak and listen in your preferred language.
            </p>
            <div className="space-y-3">
              {["English (Indian)", "తెలుగు (Telugu)", "हिंदी (Hindi)", "मराठी (Marathi)"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setStep(2);
                  }}
                  className="w-full rounded-2xl border border-border bg-card p-4 text-center text-lg font-medium shadow-sm transition-all hover:border-primary hover:ring-1 hover:ring-primary focus:outline-none"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="mb-2 text-center font-display text-3xl font-bold text-foreground">
              Your Details
            </h1>
            <p className="mb-8 text-center text-muted-foreground">
              What should we call you?
            </p>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lakshmi Devi"
                  className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => setStep(3)}
                disabled={!name}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary p-4 text-lg font-bold text-primary-foreground disabled:opacity-50"
              >
                Continue <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 text-center duration-500">
            <div className="mx-auto mb-6 grid size-24 place-items-center rounded-full bg-success/20 text-success">
              <CheckCircle2 className="size-12" />
            </div>
            <h1 className="mb-4 font-display text-3xl font-bold text-foreground">
              Ready, {name.split(" ")[0]}!
            </h1>
            <p className="mb-10 text-muted-foreground">
              Your Virtual Business Manager is set up in {language.split(" ")[0]}. You can now start capturing your products using voice.
            </p>
            <button
              onClick={handleComplete}
              className="w-full rounded-xl bg-primary p-4 text-lg font-bold text-primary-foreground"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
