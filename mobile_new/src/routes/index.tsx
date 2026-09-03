import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, PackageOpen, FileCheck2, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/kala/shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kalasangam — Virtual Business Manager" },
      {
        name: "description",
        content: "Empowering artisans with voice-first cataloging and formalization.",
      },
    ],
  }),
  component: Index,
});
const t = {
  English: {
    greeting: "Namaste",
    subtitle: "What would you like to do today?",
    addProduct: "Add Product",
    voiceCapture: "Voice & photo capture",
    verifiedItems: "Verified items",
    docsReady: "Docs ready",
    recentActivity: "Recent activity",
    viewAll: "View all",
    exportCatalog: "Export Catalog",
    preparePackage: "Prepare ONDC/GeM package",
    verifiedCatalog: "Verified catalog",
    pendingVerification: "Pending verification",
    noProducts: "No products yet. Add one above!"
  },
  Hindi: {
    greeting: "नमस्ते",
    subtitle: "आज आप क्या करना चाहेंगे?",
    addProduct: "उत्पाद जोड़ें",
    voiceCapture: "आवाज़ और फ़ोटो कैप्चर",
    verifiedItems: "सत्यापित उत्पाद",
    docsReady: "दस्तावेज़ तैयार",
    recentActivity: "हाल की गतिविधि",
    viewAll: "सभी देखें",
    exportCatalog: "कैटलॉग निर्यात करें",
    preparePackage: "ONDC/GeM पैकेज तैयार करें",
    verifiedCatalog: "सत्यापित कैटलॉग",
    pendingVerification: "सत्यापन बाकी है",
    noProducts: "कोई उत्पाद नहीं। ऊपर से जोड़ें!"
  },
  Telugu: {
    greeting: "నమస్కారం",
    subtitle: "మీరు ఈ రోజు ఏమి చేయాలనుకుంటున్నారు?",
    addProduct: "ఉత్పత్తిని జోడించండి",
    voiceCapture: "వాయిస్ & ఫోటో క్యాప్చర్",
    verifiedItems: "ధృవీకరించబడిన ఉత్పత్తులు",
    docsReady: "పత్రాలు సిద్ధంగా ఉన్నాయి",
    recentActivity: "ఇటీవలి కార్యాచరణ",
    viewAll: "అన్నింటినీ వీక్షించండి",
    exportCatalog: "కేటలాగ్ ఎగుమతి చేయండి",
    preparePackage: "ONDC/GeM ప్యాకేజీ సిద్ధం చేయండి",
    verifiedCatalog: "ధృవీకరించబడిన కేటలాగ్",
    pendingVerification: "ధృవీకరణ పెండింగ్‌లో ఉంది",
    noProducts: "ఉత్పత్తులు లేవు. పైన ఒకదాన్ని జోడించండి!"
  },
  Marathi: {
    greeting: "नमस्कार",
    subtitle: "आज तुम्हाला काय करायचे आहे?",
    addProduct: "उत्पादन जोडा",
    voiceCapture: "आवाज आणि फोटो कॅप्चर",
    verifiedItems: "सत्यापित उत्पादने",
    docsReady: "दस्तऐवज तयार आहेत",
    recentActivity: "अलीकडील क्रियाकलाप",
    viewAll: "सर्व पहा",
    exportCatalog: "कॅटलॉग निर्यात करा",
    preparePackage: "ONDC/GeM पॅकेज तयार करा",
    verifiedCatalog: "सत्यापित कॅटलॉग",
    pendingVerification: "सत्यापन प्रलंबित",
    noProducts: "कोणतीही उत्पादने नाहीत. एक जोडा!"
  }
};

function Index() {
  const navigate = useNavigate();
  const { products, docSteps, isLoading } = useStore();
  const [merchantName, setMerchantName] = useState("");
  const [merchantLang, setMerchantLang] = useState<"English" | "Hindi" | "Telugu" | "Marathi">("English");

  useEffect(() => {
    const onboarded = localStorage.getItem("onboarded");
    if (!onboarded) {
      navigate({ to: "/onboarding", replace: true });
    } else {
      setMerchantName(localStorage.getItem("merchantName") || "Artisan");
      const lang = localStorage.getItem("merchantLang") || "";
      if (lang.includes("Hindi")) {
        setMerchantLang("Hindi");
      } else if (lang.includes("Telugu")) {
        setMerchantLang("Telugu");
      } else if (lang.includes("Marathi")) {
        setMerchantLang("Marathi");
      } else {
        setMerchantLang("English");
      }
    }
  }, [navigate]);

  if (isLoading || !merchantName) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  const verifiedCount = products.filter((p) => p.status === "verified").length;
  const pendingCount = products.filter((p) => p.status === "pending" || p.status === "draft").length;
  const docsDone = docSteps.filter((d) => d.status === "Active").length;
  const langText = t[merchantLang];

  return (
    <AppShell title="Kalasangam" subtitle="Virtual Business Manager">
      <div className="flex flex-col gap-5">
        <div className="px-1 space-y-1">
          <p className="text-xl font-medium tracking-tight">{langText.greeting}, {merchantName}</p>
          <p className="text-sm text-muted-foreground">{langText.subtitle}</p>
        </div>

        <Link
          to="/capture"
          className="group relative overflow-hidden rounded-[1.25rem] bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-display text-2xl font-bold tracking-tight">{langText.addProduct}</p>
              <p className="text-sm font-medium text-primary-foreground/80">{langText.voiceCapture}</p>
            </div>
            <div className="grid size-12 place-items-center rounded-full bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
              <Camera className="size-6" />
            </div>
          </div>
          <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10 blur-2xl" />
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/catalog"
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:scale-95"
          >
            <div className="mb-4 text-primary">
              <PackageOpen className="size-7" />
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-foreground">{verifiedCount}</p>
              <p className="text-sm font-medium text-muted-foreground">
                {langText.verifiedItems}
                {pendingCount > 0 && <span className="ml-1 text-warning">+{pendingCount}</span>}
              </p>
            </div>
          </Link>

          <Link
            to="/ready"
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:scale-95"
          >
            <div className="mb-4 text-primary">
              <FileCheck2 className="size-7" />
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-foreground">
                {docsDone}
                <span className="text-xl text-muted-foreground">/{docSteps.length}</span>
              </p>
              <p className="text-sm font-medium text-muted-foreground">{langText.docsReady}</p>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl bg-muted/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold">{langText.recentActivity}</p>
            <Link to="/catalog" className="text-xs font-medium text-primary">
              {langText.viewAll}
            </Link>
          </div>
          <div className="space-y-4">
            {products.slice(0, 2).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.status === "verified" ? langText.verifiedCatalog : langText.pendingVerification}
                  </p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="text-sm text-muted-foreground">{langText.noProducts}</div>
            )}
          </div>
        </div>

        <Link
          to="/export"
          className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm active:scale-95"
        >
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">{langText.exportCatalog}</p>
            <p className="text-xs text-muted-foreground">{langText.preparePackage}</p>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" />
        </Link>
      </div>
    </AppShell>
  );
}
