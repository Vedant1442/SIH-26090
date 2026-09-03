import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Phone,
  ShieldCheck,
  Palette,
  Scissors,
  Layers,
  Package,
  Star,
  Leaf,
  Gem,
  RefreshCw,
  Tag as TagIcon,
  Wifi,
  BatteryMedium,
} from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Welcome to Kalasangam" }],
  }),
  component: OnboardingPage,
});

const LANGUAGES = [
  "English (Indian)",
  "తెలుగు (Telugu)",
  "हिंदी (Hindi)",
  "मराठी (Marathi)",
];

const CRAFT_CATEGORIES = [
  { label: "Weaving & Textiles", icon: Layers },
  { label: "Pottery & Ceramics", icon: Package },
  { label: "Wood Carving", icon: Scissors },
  { label: "Jewelry & Metalwork", icon: Gem },
  { label: "Painting & Art", icon: Palette },
  { label: "Leather Craft", icon: TagIcon },
  { label: "Natural & Organic", icon: Leaf },
  { label: "Mixed Crafts", icon: Star },
];

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i + 1 === current
              ? "w-6 h-2 bg-primary"
              : i + 1 < current
              ? "w-2 h-2 bg-primary/50"
              : "w-2 h-2 bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setOtpError(false);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length === 6) {
      setStep(4);
    } else {
      setOtpError(true);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const isPhoneValid = /^[6-9]\d{9}$/.test(phone);

  const trimmedName = name.trim();
  const hasLetters = /\p{L}/u.test(trimmedName);
  const hasOnlyValidChars = /^[\p{L}\s.'-]+$/u.test(trimmedName);
  const isNameValid = trimmedName.length >= 2 && trimmedName.length <= 50 && hasLetters && hasOnlyValidChars;

  const nameError =
    trimmedName.length > 0 && !hasLetters
      ? "Name cannot be numbers or symbols only. Please enter letters."
      : trimmedName.length > 0 && !hasOnlyValidChars
      ? "Name should contain letters, spaces, hyphens, or dots only."
      : trimmedName.length === 1
      ? "Name must be at least 2 characters long."
      : "";

  const handleComplete = () => {
    localStorage.setItem("onboarded", "true");
    localStorage.setItem("merchantName", trimmedName || "Artisan");
    localStorage.setItem("merchantLang", language || "English");
    localStorage.setItem("merchantPhone", phone);
    localStorage.setItem("merchantCategories", JSON.stringify(selectedCategories));
    localStorage.setItem("showHelpWidgets", "true");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("kala_help_done");
      sessionStorage.removeItem("kala_help_dismissed");
    }
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-background sm:border-x border-border/80 shadow-[0_0_70px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-center px-6">
        {/* Mock Mobile Phone Status Bar */}
        <div className="hidden sm:flex absolute top-0 inset-x-0 items-center justify-between px-6 pt-2.5 pb-1 text-[11px] font-semibold text-muted-foreground select-none bg-background/80 backdrop-blur z-20">
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

        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/20 blur-3xl -z-10" />
        <div className="absolute top-48 -left-24 size-48 rounded-full bg-orange-500/10 blur-3xl -z-10" />

      {/* STEP 1: Language */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-md mx-auto w-full">
          <StepDots current={1} total={6} />
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl font-bold tracking-tight text-foreground">
              Kalasangam
            </h1>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Virtual Business Manager
              </span>
            </div>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Your AI-powered bridge to ONDC &amp; GeM.<br />
              Choose your preferred language.
            </p>
          </div>
          <div className="space-y-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setStep(2); }}
                className="group relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-card hover:shadow-md focus:outline-none"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-primary transform origin-bottom scale-y-0 transition-transform group-hover:scale-y-100" />
                <div className="flex items-center justify-between pl-2">
                  <span className="text-lg font-medium">{lang}</span>
                  <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Phone Number */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-md mx-auto w-full">
          <StepDots current={2} total={6} />
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Phone className="size-7" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Enter your mobile number
            </h1>
            <p className="mt-2 text-muted-foreground">
              We'll send an OTP to verify your identity.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex gap-2">
                <div className="flex items-center justify-center rounded-2xl border border-border bg-card/50 backdrop-blur px-4 py-5 text-lg font-medium text-muted-foreground shrink-0">
                  +91
                </div>
                <input
                  type="tel"
                  autoFocus
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && isPhoneValid && setStep(3)}
                  placeholder="10-digit number"
                  className={`w-full rounded-2xl border bg-card/50 backdrop-blur px-6 py-5 text-lg outline-none transition-all focus:ring-1 shadow-inner ${
                    phone.length === 10 && !isPhoneValid
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                />
              </div>
              {phone.length === 10 && !isPhoneValid && (
                <p className="text-xs text-destructive mt-2 pl-2">
                  Indian mobile numbers must start with 6, 7, 8, or 9.
                </p>
              )}
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!isPhoneValid}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
            >
              Send OTP <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: OTP */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-md mx-auto w-full">
          <StepDots current={3} total={6} />
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="size-7" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Verify OTP
            </h1>
            <p className="mt-2 text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-foreground">+91 {phone}</span>
            </p>
          </div>
          <div className="space-y-5">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all ${
                    otpError
                      ? "border-destructive bg-destructive/5"
                      : digit
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card/50"
                  } focus:border-primary focus:ring-1 focus:ring-primary`}
                />
              ))}
            </div>
            {otpError && (
              <p className="text-center text-sm text-destructive">
                Please enter a valid 6-digit OTP.
              </p>
            )}
            <button
              onClick={verifyOtp}
              disabled={otp.join("").length !== 6}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
            >
              Verify &amp; Continue <ArrowRight className="size-5" />
            </button>
            <button
              onClick={() => { setOtp(["", "", "", "", "", ""]); setOtpError(false); setStep(2); }}
              className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="size-3.5" /> Change number
            </button>
            <p className="text-center text-xs text-muted-foreground bg-muted/40 rounded-xl px-4 py-2.5">
              💡 <span className="font-medium">Demo mode:</span> Any 6-digit OTP works!
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: Name */}
      {step === 4 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-md mx-auto w-full">
          <StepDots current={4} total={6} />
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              What should we call you?
            </h1>
            <p className="mt-2 text-muted-foreground">
              KalaMitr will use this to greet you personally.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                autoFocus
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && isNameValid && setStep(5)}
                placeholder="e.g. Lakshmi Devi or Krishna Crafts"
                className={`w-full rounded-2xl border bg-card/50 backdrop-blur px-6 py-5 text-lg outline-none transition-all focus:ring-1 shadow-inner ${
                  nameError
                    ? "border-destructive focus:border-destructive focus:ring-destructive"
                    : "border-border focus:border-primary focus:ring-primary"
                }`}
              />
              {nameError && (
                <p className="text-xs text-destructive mt-2 pl-2">
                  {nameError}
                </p>
              )}
            </div>
            <button
              onClick={() => setStep(5)}
              disabled={!isNameValid}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
            >
              Continue <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Craft Categories */}
      {step === 5 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-md mx-auto w-full">
          <StepDots current={5} total={6} />
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Your craft categories
            </h1>
            <p className="mt-2 text-muted-foreground">
              Select all that apply — we'll personalise your dashboard.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {CRAFT_CATEGORIES.map(({ label, icon: Icon }) => {
              const selected = selectedCategories.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleCategory(label)}
                  className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center text-sm font-medium transition-all active:scale-95 ${
                    selected
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-card/50 text-foreground hover:border-primary/40"
                  }`}
                >
                  {selected && (
                    <div className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="size-3" />
                    </div>
                  )}
                  <Icon className="size-6" />
                  {label}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStep(6)}
            disabled={selectedCategories.length === 0}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
          >
            Continue <ArrowRight className="size-5" />
          </button>
          <button
            onClick={() => setStep(6)}
            className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      )}

      {/* STEP 6: Done */}
      {step === 6 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 text-center duration-500 max-w-md mx-auto w-full">
          <StepDots current={6} total={6} />
          <div className="mx-auto mb-6 grid size-24 place-items-center rounded-full bg-green-500/20 text-green-600">
            <CheckCircle2 className="size-12" />
          </div>
          <h1 className="mb-3 font-display text-3xl font-bold text-foreground">
            Ready, {name.split(" ")[0] || "Artisan"}!
          </h1>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Your Virtual Business Manager is set up in {language.split(" ")[0]}.
          </p>
          {selectedCategories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-1.5 justify-center">
              {selectedCategories.map((c) => (
                <span key={c} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {c}
                </span>
              ))}
            </div>
          )}
          <p className="mb-8 text-sm text-muted-foreground">
            Start capturing products using voice!
          </p>
          <button
            onClick={handleComplete}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 py-4 text-lg font-bold text-white shadow-lg hover:opacity-90 active:scale-95"
          >
            <CheckCircle2 className="size-5" /> Go to Dashboard
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
