# Kaarigar Setu — Master UI Generation Prompt
### Paste this whole document into your design tool (v0 / Lovable / Bolt / Figma AI / Claude). Generate one screen at a time, in the order listed, reusing the same token system every time.

---

## 0. What you are building

Kaarigar Setu is a **voice-first Virtual Business Manager** for low-literacy, low-income artisans (SC/OBC/EBC/DNT/Safai Karamchari communities, ~72% women in handloom, ~67% earning under ₹5,000/month). It is **not a marketplace** — it's the missing onboarding layer between an artisan and GeM/ONDC/Tribes India.

Two products, two audiences:
1. **Artisan mobile app** — Android, voice-first, deliberately restricted to **four destinations**: Home, Speak, Photo, My Products. Everything else lives as a state or sheet inside those four, not as new nav items.
2. **Facilitator web app** — responsive desktop/tablet tool for SHG/CSC workers running 20-product camp sessions.

The single hardest design constraint: **most artisan users cannot reliably read.** Every screen must work as a sequence of icons, photos, and audio before it works as text. Text is a fallback, not the primary channel.

The second hardest constraint: **honesty about what's real.** This product is being judged partly on whether it fakes integrations. Every screen touching an external system (ONDC, GeM, PAN, Udyam, GST, loans) must visibly show its integration state. This is not a legal disclaimer bolted on — it's a core piece of the visual language (see §4).

---

## 1. Reject the default look

Before designing anything, actively rule out these three patterns that AI tools default to regardless of brief — none of them belong to a craft/artisan product:

- Warm cream background (~#F4F1EA) + high-contrast serif + terracotta accent (~#D97757). This is the single most overused "warm, human" AI look right now and it is not this brand.
- Near-black background + one acid-green or vermilion accent (generic "tech startup" look).
- Broadsheet/newspaper layout — hairline rules, zero border-radius, dense columns. Wrong register for a voice-first, icon-first, low-literacy product.

Instead, ground the palette and forms in the **actual material world of Indian handloom and natural dye craft** — this is a Heritage & Culture theme, use it literally, not decoratively.

---

## 2. Design tokens (use exactly these, everywhere)

### Color — drawn from natural dye and handloom material, not from "warm startup" defaults
- `--indigo-deep`: `#2C3E52` — primary brand color, drawn from natural indigo dyeing. Used for primary actions, nav, headers.
- `--madder-red`: `#A8432F` — drawn from madder-root/aal dye used in block printing. Used sparingly, for the mic button and one signature accent only. (Deliberately *not* the AI-cliché terracotta — cooler, more brick, less peach.)
- `--turmeric`: `#D9A441` — haldi yellow, used only for "attention/needs action" states (batch exceptions, missing documents). Never used decoratively.
- `--kora-cotton`: `#F5F0E6` — undyed handloom cotton, the base background. Slightly warmer-grey than the AI-cliché cream, less pink undertone.
- `--kattha-ink`: `#3A2E28` — betel-nut brown-black, primary text color. Never pure black.
- `--sage-thread`: `#6B7F63` — muted natural green (used from indigo-yellow overdye), reserved for "Live/verified/complete" states only.
- `--slate-mist`: `#8A8F94` — neutral for secondary text, timestamps, metadata.

Integration-state colors are semantic and fixed, never reused for anything else:
- **Live** → `--sage-thread`
- **Sandbox/Export-only** → `--slate-mist` with a dashed border
- **Mock/Simulated** → `--turmeric` with a diagonal hatch pattern at 8% opacity behind the label

### Typography
- Display/headline face: a warm, slightly humanist serif with visible craft character (e.g. **Fraunces**, used at Medium/SemiBold, generous size, restraint in usage — headlines and the artisan's own product title only). Do not use it for body copy.
- Body/UI face: a geometric, highly legible sans built for screen reading at small sizes and by non-native readers (e.g. **Manrope** or **Inter**). This carries almost everything in the artisan app.
- Devanagari/regional script face: **Baloo 2** or **Noto Sans Devanagari** — rounder, warmer weight so regional-language labels don't feel like an afterthought bolted onto a Latin-first design.
- Numerals (prices, counts): tabular figures, Manrope SemiBold — prices must never visually wobble in weight between digits.

### Layout & shape language
- Corner radius: 20px on primary cards/buttons, 12px on secondary chips. Soft but not bubbly.
- The **signature element**: a woven "thread-row" motif — a thin horizontal row of short offset dashes (like a weft thread count) used as a progress indicator, a section divider, and the batch-status bar in the facilitator app. It is functional (it always represents real progress or count), never purely decorative. This is the one recognizable visual signature — do not add a second one.
- Numbered step markers (01/02/03) are allowed **only** on the camp-mode batch queue, because that content is genuinely sequential. Do not use them on Home or Speak.
- Icons: rounded-line style, 2px stroke, filled on active/selected state. Every icon ships with a one-word label underneath — never icon-only navigation.

### Motion
- One deliberate motion per screen, nothing scattered: the mic button has a single breathing pulse while listening; the thread-row fills left-to-right on progress; a card settles with a soft 150ms rise on appear. No parallax, no gradient animation, no confetti. Respect reduced-motion settings.

---

## 3. Global components (build these first, reuse everywhere)

1. **Integration State Chip** — pill-shaped tag, top-right of any card/screen touching an external system. Reads exactly one of: `Live` / `Export-ready` / `Sandbox` / `Simulated for demo`. Uses the semantic colors above. Never omit this chip on export, GST, scheme, or ONDC/GeM screens.
2. **Voice Bar** — persistent bottom-anchored component on Speak-related screens: large circular mic button (madder red, 72px), waveform when listening, and a text fallback icon (keyboard) beside it that is always tappable — voice must never be the only way forward.
3. **Confidence Tag** — small under-field label showing AI-generated content confidence: "Heard clearly" / "Please confirm" / "Couldn't catch this — try again." Never shows a raw percentage to the artisan (percentages are for the facilitator dashboard only).
4. **Thread-row progress** — the signature motif, used for: batch completion (n of 20), formalization readiness (n of 5 documents), DigiReady (n of 7 areas).
5. **Status Pill (document/task state)** — three states only, plain language, color-coded: `Not started` (slate), `In progress` (turmeric), `Done` (sage). Never shows "Verified by government" unless an authorized check actually ran.

---

## 4. Screen inventory

### A. Artisan Mobile App (4 destinations, each with internal states)
| # | Destination | Key states inside it |
|---|---|---|
| A0 | Splash → Language select | first-launch only |
| A1 | Home | default dashboard, empty state, "needs attention" state |
| A2 | Speak | listening, drafting, confirm/edit |
| A3 | Photo | guided capture, enhancing, before/after review |
| A4 | My Products | grid/list, product detail, pricing sheet, formalization sheet, export sheet, AI marketing visual sheet |

### B. Facilitator Web App
| # | Screen |
|---|---|
| B1 | Login / camp start |
| B2 | Camp dashboard (batch overview) |
| B3 | Batch capture queue |
| B4 | Bulk review & exceptions |
| B5 | Export & manifest |
| B6 | Cohort analytics (optional/stretch) |

Build in this order: A1 → A2 → A3 → A4 → A0 → B2 → B3 → B4 → B5 → B1 → B6.

---

## 5. Screen-by-screen walkthrough (what each screen must contain)

### A0 — Splash → Language Select
- Kaarigar Setu wordmark in the display serif over kora-cotton background, thread-row motif animates once as a loading indicator (not a spinner).
- Language grid: each language shown as its own script (Marathi in Devanagari, Tamil in Tamil script, etc.), tap-to-hear pronunciation before selecting — audio-first even at this first screen.
- No text instructions above the grid — a speaker icon invites tapping.

### A1 — Home
- Top: artisan's name (if known) + a single "today" status line, e.g. "3 products live, 1 needs your voice."
- One dominant card: "Add a product" — large mic + camera icon, this is the primary action, everything else is secondary.
- A slim formalization thread-row: "2 of 5 documents ready" tapping opens the formalization sheet (lives inside My Products, not a new tab).
- Bottom nav: Home / Speak / Photo / My Products — four icons, always labeled.
- Empty state (new user): illustration of a hand holding a product + one line audio prompt "Let's add your first product," no dashboard clutter.
- Needs-attention state: turmeric-colored thread-row segment + one line "1 product needs your confirmation" linking directly into that item.

### A2 — Speak
- Full-bleed card, large mic button center-low, waveform animates while listening.
- Live transcript appears line by line beneath in the artisan's script as they talk — builds trust that it heard them.
- After they stop: draft fields populate one at a time (title, material, color, story) each with a Confidence Tag, each individually replayable via a small speaker icon.
- Confirm/Edit screen: every AI-drafted field shown as a card the artisan can tap to re-record just that field (not the whole entry) — never force a full redo for one wrong word.
- Keyboard fallback icon always visible beside the mic.

### A3 — Photo
- Camera view with a soft on-screen framing guide (rounded-corner box, not a harsh AR overlay) and a one-line live coach message: "Move closer" / "More light needed" / "Hold steady."
- Capture-ready state: framing guide turns sage-green, gentle haptic-style pulse cue.
- Before/After review: original photo and enhanced photo side by side, small label "Background & lighting only — your product is unchanged," with a visible "Keep original" undo option — this screen must make the authenticity guarantee visible, not just true in code.
- Retake always one tap away.

### A4 — My Products
- Grid of product cards: photo, title, a Status Pill, and price.
- Tapping a product opens **Product Detail**, which itself contains three collapsible sheets (not new screens):
  - **Pricing sheet**: cost floor bar chart (material + labour + margin), a market-comparable range shown with source + retrieval date, editable margin slider. Integration State Chip: `Sandbox` unless real market data is live.
  - **Formalization sheet**: thread-row of 5 documents (Aadhaar, Bank, PAN, Udyam, GST), each a Status Pill, tapping one opens a plain-language explainer + "Find nearest CSC" action. Never a checkbox that silently implies government verification.
  - **Export sheet**: shows ONDC-ready and GeM-ready packages with their Integration State Chip front and center, a "What happens next" one-line explainer, and a manifest of any missing fields in turmeric.
  - **AI marketing visual sheet**: separate tab, clearly bordered apart from the primary photo, every generated image carries a visible "AI Visualization" watermark-style tag in the corner — this cannot be turned off.

### B1 — Facilitator Login / Camp Start
- Clean split layout: left panel camp/session details (location, date, expected artisan count), right panel login.
- "Start new camp" as the dominant action — this app's job starts the moment a facilitator opens a session, not at a marketing screen.

### B2 — Camp Dashboard
- Thread-row across the top: n of 20 products, colored by state (processing / ready / needs confirmation / needs retake / failed).
- Below: a table-card hybrid — each artisan a row, product thumbnail, Status Pill, one-tap "review" action.
- One failed item must visibly not block the row above/below it — show it as an isolated red-bordered card, others stay normal.

### B3 — Batch Capture Queue
- Numbered steps (01/02/03…) are appropriate here — genuine sequence. Left rail shows the queue of up to 20 slots, current slot expanded with the same Speak/Photo components from the mobile app (reused, not redesigned) sized up for a tablet/desktop viewport.
- Facilitator can jump to any slot without finishing the current one — no forced linearity.

### B4 — Bulk Review & Exceptions
- Filtered view: only items flagged (`Needs confirmation`, `Needs retake`, `Low ASR confidence`). This screen should feel calm, not like an inbox of failures — lead with a count, "6 of 20 need a quick look," not an alarming red wall.
- Side-by-side: AI draft vs. facilitator override field, with the original artisan audio replayable.

### B5 — Export & Manifest
- Big Integration State Chips for each destination package (ONDC / GeM), a manifest list of included fields and any missing ones, and a single "Generate handoff package" action.
- Explicit copy: "Exported ≠ Published." State what happens next in one sentence per destination.

### B6 — Cohort Analytics (stretch)
- Aggregate thread-row style charts: products onboarded this month, formalization completion rate, women/low-literacy completion share. Use the sage/turmeric/slate palette consistently with the states defined above — a chart should never introduce a new color meaning.

---

## 6. Copy rules (apply to every screen)

- Write from the artisan's side of the screen: "Add your product," never "Initiate SKU creation."
- Buttons keep their name through the whole flow: if a button says "Save," the confirmation toast says "Saved" — never "Submitted" then "Saved" then "Done" for the same action.
- Never state or imply government verification, certification, or guaranteed outcomes anywhere in copy — always "assessment," "readiness," "candidate scheme," "prepared."
- Empty states are an invitation to act, not an apology: "No products yet — let's add your first one," never "You have no products."
- Errors explain what happened and what to do, in plain words, no technical terms: "We couldn't hear that clearly — try again a little closer to the phone," never "ASR confidence below threshold."

---

## 7. Build instructions for the tool generating the screens

1. Build the token system and the five global components (§3) as a shared style/component layer first — every subsequent screen must import from it, not redefine colors or type.
2. Generate screens in the build order given in §4.
3. After each screen, self-check against §1 (does it accidentally look like the cream/serif/terracotta default, or the dark+neon default?) and against §6 (copy check) before moving to the next screen.
4. Keep the artisan app to exactly four bottom-nav destinations at all times — every other requirement in the PRD/SRS must be placed as a sheet, tab, or state inside Home/Speak/Photo/My Products, never as a fifth nav item.
5. Every screen touching ONDC, GeM, PAN, Udyam, GST, or loan schemes must render its Integration State Chip — treat this as a hard requirement, not a nice-to-have, since it is a named judge-level failure point in the project's own SWOT.
