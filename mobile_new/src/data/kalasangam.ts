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
  priceReasoning?: string;
  merchantId?: string;
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

export type CraftEvent = {
  id: string;
  name: string;
  location: string;
  date: string;
  distance: string;
  distanceKm: number;
  stallFee: string;
  tag: "Mela" | "Expo" | "Festival" | "Haat";
  isFreeWithUdyam: boolean;
  footfall: string;
  lat: number;
  lng: number;
  subsidyNote?: string;
};

export const events: CraftEvent[] = [
  {
    id: "e1",
    name: "Vijayawada Craft Mela",
    location: "P.W.D Grounds, MG Road, Vijayawada",
    date: "12–15 Sep",
    distance: "18 km",
    distanceKm: 18,
    stallFee: "₹500 / stall",
    tag: "Mela",
    isFreeWithUdyam: false,
    footfall: "20,000+ visitors",
    lat: 16.5062,
    lng: 80.648,
    subsidyNote: "50% rebate for women artisans",
  },
  {
    id: "e2",
    name: "Handloom & Silk Expo, Machilipatnam",
    location: "Zilla Parishad Convention Hall, Machilipatnam",
    date: "24 Sep",
    distance: "31 km",
    distanceKm: 31,
    stallFee: "Free for Udyam holders",
    tag: "Expo",
    isFreeWithUdyam: true,
    footfall: "12,000+ textile buyers",
    lat: 16.1875,
    lng: 81.1389,
    subsidyNote: "100% Ministry of Textiles sponsored stall",
  },
  {
    id: "e3",
    name: "Dasara Shilp Bazaar, Guntur",
    location: "BR Stadium Grounds, Guntur",
    date: "2–9 Oct",
    distance: "52 km",
    distanceKm: 52,
    stallFee: "₹1,200 / stall",
    tag: "Festival",
    isFreeWithUdyam: false,
    footfall: "35,000+ festive shoppers",
    lat: 16.3067,
    lng: 80.4365,
    subsidyNote: "Free electricity & stall tables provided",
  },
  {
    id: "e4",
    name: "Lepakshi Handicrafts Exhibition",
    location: "Gandhi Bhavan, Main Road, Kakinada",
    date: "18–22 Oct",
    distance: "85 km",
    distanceKm: 85,
    stallFee: "Free with Artisan Card",
    tag: "Haat",
    isFreeWithUdyam: true,
    footfall: "15,000+ craft enthusiasts",
    lat: 16.9891,
    lng: 82.2475,
    subsidyNote: "APCO & Lepakshi state artisan support",
  },
  {
    id: "e5",
    name: "Shilparamam Arts & Crafts Village",
    location: "Madhapur Craft Enclave, Hyderabad",
    date: "Ongoing daily",
    distance: "140 km",
    distanceKm: 140,
    stallFee: "₹800 / week",
    tag: "Haat",
    isFreeWithUdyam: true,
    footfall: "50,000+ weekend footfall",
    lat: 17.4526,
    lng: 78.3784,
    subsidyNote: "Direct B2B buyers & tourist pavilion",
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
