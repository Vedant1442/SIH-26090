// Hardcoded prototype data for Kalasangam (SIH 26090).

export type ProductStatus = "verified" | "pending" | "draft";

export type Product = {
  id: string;
  name: string;
  nameLocal: string;
  craft: string;
  status: ProductStatus;
  priceLow: number;
  priceHigh: number;
  confidence: "High" | "Medium" | "Low";
  capturedBy: string;
  image: string;
  materials: string;
  timeHours: number;
  exceptions: string[];
};

export const merchant = {
  name: "Lakshmi Devi",
  craft: "Kalamkari textiles",
  village: "Pedana, Andhra Pradesh",
  language: "తెలుగు · Telugu",
  initials: "LD",
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Kalamkari wall hanging",
    nameLocal: "కలంకారి గోడ వస్త్రం",
    craft: "Hand-block print",
    status: "verified",
    priceLow: 1450,
    priceHigh: 1780,
    confidence: "High",
    capturedBy: "Lakshmi Devi",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=70&auto=format&fit=crop",
    materials: "Cotton, natural dyes",
    timeHours: 14,
    exceptions: [],
  },
  {
    id: "p2",
    name: "Terracotta water jug",
    nameLocal: "మట్టి కూజా",
    craft: "Wheel pottery",
    status: "pending",
    priceLow: 320,
    priceHigh: 410,
    confidence: "Medium",
    capturedBy: "Ravi (staff)",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=70&auto=format&fit=crop",
    materials: "River clay",
    timeHours: 3,
    exceptions: ["Low speech confidence on size"],
  },
  {
    id: "p3",
    name: "Brass diya set",
    nameLocal: "ఇత్తడి దీపం",
    craft: "Metal casting",
    status: "pending",
    priceLow: 640,
    priceHigh: 890,
    confidence: "Medium",
    capturedBy: "Ravi (staff)",
    image:
      "https://images.unsplash.com/photo-1604608672516-f1b9b1a0a3d0?w=800&q=70&auto=format&fit=crop",
    materials: "Brass",
    timeHours: 6,
    exceptions: ["Missing packaging weight"],
  },
  {
    id: "p4",
    name: "Bamboo storage basket",
    nameLocal: "వెదురు బుట్ట",
    craft: "Weaving",
    status: "draft",
    priceLow: 240,
    priceHigh: 300,
    confidence: "Low",
    capturedBy: "Meena (staff)",
    image:
      "https://images.unsplash.com/photo-1595408076683-5d0c643e4f39?w=800&q=70&auto=format&fit=crop",
    materials: "Bamboo strips",
    timeHours: 4,
    exceptions: ["No price entered", "Photo too dark"],
  },
];

export const priceBreakdown = [
  { label: "Material cost", value: 380 },
  { label: "Labour (14 hrs · AP reference)", value: 700 },
  { label: "Packaging", value: 90 },
  { label: "Overheads", value: 120 },
  { label: "Margin (22%, editable)", value: 280 },
];

export type DocStep = {
  id: string;
  title: string;
  why: string;
  status: "Registered" | "Active" | "In progress" | "Not started";
};

export const docSteps: DocStep[] = [
  { id: "aadhaar", title: "Aadhaar", why: "Identity for every scheme", status: "Active" },
  { id: "bank", title: "Bank account", why: "Receive scheme and buyer payments", status: "Active" },
  { id: "pan", title: "PAN", why: "Needed for Udyam and GST", status: "In progress" },
  { id: "udyam", title: "Udyam registration", why: "Official MSME identity", status: "Not started" },
  { id: "gst", title: "GST readiness", why: "Required by some buyer platforms", status: "Not started" },
];

export const digiReady = [
  { area: "Pre-requisites", done: true },
  { area: "Digital infrastructure", done: true },
  { area: "Product catalogue", done: true },
  { area: "Catalogue management", done: false },
  { area: "Packaging", done: false },
  { area: "Payment", done: true },
  { area: "Grievance redressal", done: false },
];

export const events = [
  {
    id: "e1",
    name: "Vijayawada Craft Mela",
    date: "12–15 Sep",
    distance: "18 km",
    stallFee: "₹500 / stall",
    tag: "Mela",
  },
  {
    id: "e2",
    name: "Handloom Expo, Machilipatnam",
    date: "24 Sep",
    distance: "31 km",
    stallFee: "Free for Udyam holders",
    tag: "Expo",
  },
  {
    id: "e3",
    name: "Dasara Shilp Bazaar",
    date: "2–9 Oct",
    distance: "64 km",
    stallFee: "₹1,200 / stall",
    tag: "Festival",
  },
];

export const staff = [
  { id: "s1", name: "Ravi Kumar", role: "Staff · capture + draft", drafts: 2, initials: "RK" },
  { id: "s2", name: "Meena Bai", role: "Staff · capture only", drafts: 1, initials: "MB" },
];

export const exportTargets = [
  { id: "ondc", name: "ONDC seller app", state: "Prepared", missing: 0 },
  { id: "gem", name: "GeM seller package", state: "Missing fields", missing: 3 },
  { id: "csv", name: "Catalog CSV + manifest", state: "Prepared", missing: 0 },
];

export const captureSteps = [
  { id: 1, title: "Photograph the item", detail: "Real photo kept as the authentic original" },
  { id: 2, title: "Enhance on device", detail: "Background cleaned, lighting corrected" },
  { id: 3, title: "Speak about it", detail: "Telugu · 24 seconds recorded" },
  { id: 4, title: "AI drafts the listing", detail: "Title, description, search terms" },
  { id: 5, title: "Confirm by voice", detail: "Playback in your language before saving" },
];
