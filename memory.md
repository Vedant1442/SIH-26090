# Kalasangam — Project Memory
> Last updated: 2026-09-03 | SIH Hackathon Round 1 Prototype

---

## 🗂️ Project Overview

**Kalasangam** is an AI-powered mobile web app that acts as a "Virtual Business Manager" for Indian artisans. It helps them digitize and list their handcraft products on **ONDC** and **GeM** government marketplaces using voice, multilingual AI, and automated cataloging.

- **Frontend:** React + Vite + TanStack Router (`d:\SIH\mobile_new`)
- **Backend:** FastAPI + SQLite + SQLAlchemy (`d:\SIH\backend`)
- **AI:** OpenRouter API → `google/gemma-3-27b-it` model
- **Deployment:** Local only (decided against Render after build issues)
- **Dev URLs:** Frontend `http://localhost:8081/`, Backend `http://localhost:8000/`

---

## ⚙️ How to Start Servers

### Backend
```powershell
cd d:\SIH\backend
.\venv\Scripts\uvicorn app.main:app --reload --port 8000
```

### Frontend
```powershell
cd d:\SIH\mobile_new
npm run dev
```
> Note: If port 8080 is taken, Vite will move to 8081. Check terminal output.

---

## 🔑 Critical Secrets & Config

| Key | Value |
|-----|-------|
| **OpenRouter API Key** | `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` |
| **AI Model** | `google/gemma-3-27b-it` (NOT `gemini-2.5-flash:free` — returns 404) |
| **DB file** | `d:\SIH\backend\sql_app.db` (SQLite, auto-recreated ## 📁 Key Files & What They Do

| File | Purpose |
|------|---------|
| `mobile_new/src/routes/index.tsx` | Dashboard / Home page — multilingual (EN/HI/TE/MR) |
| `mobile_new/src/routes/onboarding.tsx` | **6-step** onboarding: Language → Phone → OTP (mock, any 6-digit) → Name → Categories → Done. No icon logos on steps 1 & 2 |
| `mobile_new/src/routes/capture.tsx` | Voice capture page — speak to list a product via AI |
| `mobile_new/src/routes/catalog.tsx` | Catalog with working Edit Draft modal (bottom sheet), verify button, AI Market Insight |
| `mobile_new/src/routes/export.tsx` | Working CSV export (generates `kalasangam_export_DATE.csv`) |
| `mobile_new/src/routes/team.tsx` | Settings / Profile — language toggle (cycles without redirect), logout |
| `mobile_new/src/components/kala/shell.tsx` | AppShell with bottom nav + KalaMitr chatbot + HelpWidgets injected |
| `mobile_new/src/components/kala/chatbot.tsx` | **KalaMitr** floating AI chatbot — chat + voice listing |
| `mobile_new/src/components/kala/help-widgets.tsx` | **NEW** Floating help tooltip cards — shows on every login (controlled by `showHelpWidgets` localStorage key). 4 tips: Voice Capture, Catalog, Export, KalaMitr |
| `mobile_new/src/lib/store.tsx` | Global state — TanStack Query, `addProduct`, `verifyProduct`. API_URL is `API_URL` (not exported as `API`) |
| `mobile_new/src/data/kalasangam.ts` | Product type (now includes `priceReasoning?: string`), static data |
| `backend/app/api/ai_routes.py` | All AI endpoints: `/ai/enhance-image`, `/ai/generate-catalog`, `/ai/price`, `/ai/chat` |
| `backend/app/api/routes.py` | CRUD: `GET/POST /api/products`, `PUT /api/products/:id/verify`, `GET/PUT /api/docs` |
| `backend/app/models/domain.py` | SQLAlchemy `ProductModel` — includes `priceReasoning` column |
| `backend/app/models/schemas.py` | Pydantic schemas — `priceReasoning: Optional[str] = None` |
| `backend/requirements.txt` | `openai`, `rembg[cpu]`, `pillow`, `python-multipart`, `fastapi`, `uvicorn` |

---

## 🔑 Onboarding Flow (6 Steps)

1. **Language** — wordmark only, no icons. Pill badge: "Virtual Business Manager"
2. **Phone Number** — +91 prefix input, must be 10 digits
3. **OTP** — 6 individual boxes, any 6-digit code works (mock). Shows demo hint. "Change number" back button.
4. **Name** — text input, no sparkles icon
5. **Craft Categories** — 8 category tiles (Weaving, Pottery, Wood Carving, Jewelry, Painting, Leather, Natural, Mixed). Multi-select with checkmarks. Skip button.
6. **Done** — green checkmark, shows selected categories as chips

**localStorage keys set on complete:** `onboarded`, `merchantName`, `merchantLang`, `merchantPhone`, `merchantCategories` (JSON array), `showHelpWidgets` = `"true"`

---

## 💡 Help Widgets

- Controlled by `localStorage.showHelpWidgets === "true"` — set on onboarding complete
- Shows every time user is on any AppShell page (resets dismissed state each visit)
- 4 sequential tips with navigation dots: Voice Capture → Catalog → Export → KalaMitr
- Each tip has an action button (navigates to relevant page) or "Next"
- "Dismiss all" button exits entirely
- Component: `help-widgets.tsx`, injected in `AppShell` above `<main>`

---

## 🎨 UI / UX Details

- **Design system:** Tailwind CSS with custom `primary` (terracotta/clay) color
- **Components:** `AppShell`, `Panel`, `PanelRow`, `Tag` in `shell.tsx`
- **Onboarding:** Full-screen gradient (no AppShell), 6 steps with animated pill progress dots
- **KalaMitr Chatbot:**
  - Floating button: `fixed bottom-[88px] right-4 z-40`
  - Mic button records via Web Speech API → `/ai/generate-catalog` → `addProduct()` → DB
  - Uses `onend` event (NOT `onresult`) — avoids duplicate bubble bug
  - `addProduct` payload requires: `name, nameLocal, craft, status, priceLow, priceHigh, confidence, capturedBy, image, materials, timeHours, exceptions[]`
- **Catalog:** 
  - "Edit draft" button opens a **bottom-sheet modal** with editable fields (name, nameLocal, materials, price range)
  - Local edits stored in component state (frontend overlay) — backend PATCH endpoint not yet wired
  - "AI Market Insight" block shows `priceReasoning`
- **Export:** Generates real `.csv` of verified products — "Generate ONDC/GeM CSV"

---

## 🐛 Known Bugs Fixed

| Bug | Fix |
|-----|-----|
| `API` not exported from `store.tsx` | Hardcoded `http://localhost:8000` directly in chatbot.tsx |
| Voice listing creating 5+ duplicate bubbles | Changed from `onresult` to `onend` with `finalTranscript` accumulator |
| Product not saving to DB from KalaMitr | Added missing `timeHours: 24` and `capturedBy: "KalaMitr Voice AI"` to payload |
| Onboarding JSX parse error at line 55 | Full file rewrite fixed corrupted JSX |
| `priceReasoning` column missing from DB | Added to `domain.py` + `schemas.py`, deleted and recreated `sql_app.db` |
| Vite serving stale broken file | Cleared `node_modules/.vite` and restarted |
| **"Edit draft" button did nothing** | Added working bottom-sheet modal with editable form fields |
| **`priceReasoning` not in Product type** | Added `priceReasoning?: string` to `kalasangam.ts` Product type |
| **Help widgets not showing** | Created `help-widgets.tsx`, injected in AppShell, toggled via localStorage |

---

## 📦 Database

- **Type:** SQLite at `d:\SIH\backend\sql_app.db`
- **Auto-created** on first backend boot via SQLAlchemy `Base.metadata.create_all()`
- **Tables:** `products`, `doc_steps`
- **Viewer:** "SQLite Viewer" VS Code extension or DB Browser for SQLite (sqlitebrowser.org)
- **Products columns:** `id, name, nameLocal, craft, status, priceLow, priceHigh, confidence, capturedBy, image, materials, timeHours, exceptions (JSON), priceReasoning`

---

## ✅ Complete Features

- [x] Multilingual Voice-to-Catalog AI pipeline (capture.tsx + KalaMitr)
- [x] AI Background Image Remover (rembg u2netp)
- [x] Dynamic Pricing with market justification text
- [x] KalaMitr floating AI chatbot (chat + voice listing)
- [x] 4-language UI with localStorage toggle (no re-login)
- [x] Working ONDC/GeM CSV export (real download)
- [x] SQLite database with full CRUD via FastAPI
- [x] Beautiful 6-step onboarding (Language → Phone → OTP → Name → Categories → Done)
- [x] Catalog with AI Insight blocks per product
- [x] Master verification flow (draft → pending → verified)
- [x] **Working "Edit draft" bottom-sheet modal in Catalog**
- [x] **Floating help widget tooltips shown on every login**
- [x] **Mock OTP screen (any 6-digit code works)**
- [x] **Phone number collection in onboarding with Indian format validation (`^[6-9]\d{9}$`)**
- [x] **Artisan name validation (prevents purely numeric names, unicode letters allowed, min 2 chars)**
- [x] **Smart avatar initials generator (`getInitials`) discarding numbers and rendering proper letters**
- [x] **Catalog edit price validation (`priceHigh >= priceLow > 0`) with inline hints**
- [x] **Backend Pydantic validation on prices (`gt=0`), models, and new `PUT /api/products/:id` endpoint for persisted edits**
- [x] **Interactive Nearby tab with live Leaflet map, clickable terracotta pins, GPS 'Near Me' distance sorter, Google Maps turn-by-turn directions, and category filters**
- [x] **Relocated Logout button from Home dashboard header to Profile / Team (`/team`) Account section**
- [x] **Help widget visibility: auto-opens on login, disappears completely when dismissed or finished (no lingering pill)**
- [x] **Multi-account Product Isolation: products scoped by `merchantId` (phone / username) so accounts only see their own listed products**
- [x] **Mobile Device Frame on Web: Clean 430px smartphone column, studio canvas backdrop, anchored floating controls, no mock status bar**

---

## 💡 Quick Win Ideas (Not Yet Done)

- [ ] WhatsApp share link generator for catalog items
- [ ] Camera/photo upload directly in KalaMitr chat
- [ ] Confetti animation after first product verified
- [ ] Dashboard summary cards (total products, total value)
