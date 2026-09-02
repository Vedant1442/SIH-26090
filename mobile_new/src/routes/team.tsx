import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserPlus, ShieldCheck, Languages, Wifi } from "lucide-react";
import { AppShell, Panel, PanelRow, Tag } from "@/components/kala/shell";
import { staff } from "@/data/kalasangam";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team & Master Verification — Kalasangam" },
      {
        name: "description",
        content:
          "Invite staff sub-accounts to capture products while the master artisan verifies every listing before export.",
      },
    ],
  }),
  component: TeamPage,
});

const t = {
  English: {
    title: "Team",
    masterAccount: "master account",
    merchant: "Merchant",
    village: "Artisan Village",
    master: "Master",
    verificationQueue: "Verification queue",
    pending: "pending",
    staffAccounts: "Staff sub-accounts",
    drafts: "drafts",
    inviteStaff: "Invite staff",
    preferences: "Preferences",
    appLanguage: "App language",
    lowConn: "Low-connectivity mode",
    on: "On",
    off: "Off",
    inviteMsg: "Invite link copied to clipboard!"
  },
  Hindi: {
    title: "टीम",
    masterAccount: "मास्टर खाता",
    merchant: "व्यापारी",
    village: "शिल्पकार गांव",
    master: "मास्टर",
    verificationQueue: "सत्यापन कतार",
    pending: "बाकी",
    staffAccounts: "स्टाफ खाते",
    drafts: "ड्राफ्ट",
    inviteStaff: "स्टाफ को आमंत्रित करें",
    preferences: "प्राथमिकताएं",
    appLanguage: "ऐप की भाषा",
    lowConn: "कम-कनेक्टिविटी मोड",
    on: "चालू",
    off: "बंद",
    inviteMsg: "आमंत्रण लिंक कॉपी हो गया!"
  },
  Telugu: {
    title: "బృందం",
    masterAccount: "మాస్టర్ ఖాతా",
    merchant: "వ్యాపారి",
    village: "కళాకారుల గ్రామం",
    master: "మాస్టర్",
    verificationQueue: "ధృవీకరణ క్యూ",
    pending: "పెండింగ్‌లో ఉంది",
    staffAccounts: "సిబ్బంది ఖాతాలు",
    drafts: "డ్రాఫ్ట్‌లు",
    inviteStaff: "సిబ్బందిని ఆహ్వానించండి",
    preferences: "ప్రాధాన్యతలు",
    appLanguage: "యాప్ భాష",
    lowConn: "తక్కువ-కనెక్టివిటీ మోడ్",
    on: "ఆన్",
    off: "ఆఫ్",
    inviteMsg: "ఆహ్వాన లింక్ కాపీ చేయబడింది!"
  },
  Marathi: {
    title: "संघ",
    masterAccount: "मुख्य खाते",
    merchant: "व्यापारी",
    village: "शिल्पकार गाव",
    master: "मुख्य",
    verificationQueue: "सत्यापन रांग",
    pending: "बाकी",
    staffAccounts: "कर्मचारी खाती",
    drafts: "मसुदे",
    inviteStaff: "कर्मचाऱ्यांना आमंत्रित करा",
    preferences: "प्राधान्ये",
    appLanguage: "अॅप भाषा",
    lowConn: "कमी-कनेक्टिव्हिटी मोड",
    on: "चालू",
    off: "बंद",
    inviteMsg: "आमंत्रण लिंक कॉपी केली!"
  }
};

function TeamPage() {
  const navigate = useNavigate();
  const { products } = useStore();
  const [merchantName, setMerchantName] = useState("");
  const [merchantLang, setMerchantLang] = useState<"English" | "Hindi" | "Telugu" | "Marathi">("English");
  const [lowConn, setLowConn] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
  }, []);

  const pendingCount = products.filter((p) => p.status !== "verified").length;
  const langText = t[merchantLang];

  return (
    <AppShell title={langText.title} subtitle={`${merchantName} · ${langText.masterAccount}`}>
      <Panel title={langText.merchant}>
        <PanelRow>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs text-primary-foreground">
            {merchantName.substring(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{merchantName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {langText.village}
            </p>
          </div>
          <Tag tone="primary">{langText.master}</Tag>
        </PanelRow>
        <PanelRow>
          <ShieldCheck className="size-4 shrink-0 text-success" />
          <span className="min-w-0 flex-1 truncate text-sm">{langText.verificationQueue}</span>
          <Tag tone={pendingCount ? "warning" : "success"}>{pendingCount} {langText.pending}</Tag>
        </PanelRow>
      </Panel>

      <Panel title={langText.staffAccounts}>
        {staff.map((s) => (
          <PanelRow key={s.id}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted font-mono text-[11px]">
              {s.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{s.name}</p>
              <p className="truncate text-xs text-muted-foreground">{s.role}</p>
            </div>
            <Tag>{s.drafts} {langText.drafts}</Tag>
          </PanelRow>
        ))}
        <button 
          className="panel-row hairline text-primary w-full text-left hover:bg-muted/50 transition-colors"
          onClick={() => alert(langText.inviteMsg)}
        >
          <UserPlus className="size-4 shrink-0" />
          <span className="text-sm font-medium">{langText.inviteStaff}</span>
        </button>
      </Panel>

      <Panel title={langText.preferences}>
        <button 
          className="panel-row hover:bg-muted/50 transition-colors w-full text-left"
          onClick={() => {
            const nextLang = merchantLang === "English" ? "Hindi" : merchantLang === "Hindi" ? "Telugu" : merchantLang === "Telugu" ? "Marathi" : "English";
            setMerchantLang(nextLang);
            const saveStr = nextLang === "Hindi" ? "हिंदी (Hindi)" : nextLang === "Telugu" ? "తెలుగు (Telugu)" : nextLang === "Marathi" ? "मराठी (Marathi)" : "English (Indian)";
            localStorage.setItem("merchantLang", saveStr);
            window.dispatchEvent(new Event("storage"));
          }}
        >
          <Languages className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm">{langText.appLanguage}</span>
          <span className="shrink-0 text-sm text-primary font-medium">{merchantLang}</span>
        </button>
        <button 
          className="panel-row hover:bg-muted/50 transition-colors w-full text-left hairline"
          onClick={() => setLowConn(!lowConn)}
        >
          <Wifi className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm">{langText.lowConn}</span>
          <Tag tone={lowConn ? "success" : "muted"}>{lowConn ? langText.on : langText.off}</Tag>
        </button>
      </Panel>
    </AppShell>
  );
}
