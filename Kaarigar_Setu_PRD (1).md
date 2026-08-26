# Kaarigar Setu — Product Requirements Document (PRD)
## SIH Problem Statement 26090 — AI-Driven Market Linkage and Smart Cataloging Mobile Application for Marginalized Artisans
**Version:** 1.0 — Judge-Ready Unified Specification  
**Date:** 26 August 2026  
**Organization:** Ministry of Social Justice and Empowerment (MoSJE)  
**Category:** Software  
**Theme:** Heritage & Culture  

---

## 1. Product Definition

### 1.1 Product statement
Kaarigar Setu is a **voice-first, AI-assisted Virtual Business Manager (VBM)** for marginalized artisans and micro-entrepreneurs. It reduces the work required to turn a physical craft product into a professional digital catalog entry, helps the user understand and complete formalization steps, provides transparent pricing assistance, and prepares structured outputs for downstream commerce channels.

Kaarigar Setu is **not a marketplace**. It does not become the merchant of record, does not take custody of payments, does not own shipping or fulfillment, and does not provide marketplace dispute resolution.

### 1.2 Problem statement alignment
The SIH 26090 problem statement explicitly calls for:
1. AI Image Enhancer & Studio.
2. Multilingual Auto-Cataloger.
3. Dynamic Pricing Assistant.
4. A cross-platform, highly responsive, minimalist and accessible experience for users with low digital literacy.

The product extends those requirements with an onboarding/formalization layer, assisted field deployment, and platform-preparation workflows.

### 1.3 Core thesis
**Kaarigar Setu = Capture → Understand → Price → Formalize → Prepare → Export.**

The distinctive proposition is not “another artisan marketplace.” It is the **missing low-literacy operating layer between the artisan and digital-commerce/program ecosystems**.

---

## 2. Target Users

| Persona | Problem | Primary workflow |
|---|---|---|
| Solo artisan | Low literacy, regional language, limited digital skills | Speak + photograph + confirm |
| SHG/cluster coordinator | Must onboard many artisans efficiently | Batch capture + assisted confirmation + export |
| CSC / field facilitator | Helps artisans complete formalization | Document checklist + assisted hand-off |
| Program administrator | Needs adoption and readiness visibility | Cohort dashboard + aggregate metrics |
| B2B buyer / procurement user | Needs structured, credible supplier information | View approved catalog/profile information through downstream channels |

The final product must **not** imply that every person from a government-backed social category is automatically an artisan or automatically eligible for a particular scheme. Scheme eligibility is evaluated separately.

---

## 3. Product Goals

### Primary goals
- Reduce catalog creation from a text-heavy process to a **voice-and-photo interaction**.
- Enable facilitators to onboard many products in one session.
- Improve quality of product photographs without changing the actual product.
- Give a transparent pricing assessment rather than an unexplained black-box price.
- Help artisans identify missing formalization documents and the next practical action.
- Prepare commerce-ready structured data without falsely claiming direct publication to every external platform.
- Create an adoption pathway that works in CSC/SHG/cluster camps and low-connectivity environments.

### Non-goals
- Full marketplace checkout.
- Payment processing by Kaarigar Setu.
- Kaarigar Setu becoming a buyer/seller transaction platform.
- Automatic grant or loan approval.
- Automatic tax/legal advice.
- Fabricating product images for use as the primary listing image.

---

## 4. Product Pillars

### Pillar A — Digitize
**AI Product Capture Studio**
- Capture real product photograph.
- Detect object/product boundaries.
- Remove cluttered background.
- Correct lighting and crop.
- Preserve original file.
- Create multiple export ratios.
- Allow human undo/restore.

**Multilingual Voice Cataloger**
- User speaks in a supported language.
- Speech is transcribed.
- Text is translated/transliterated as needed.
- Structured product fields are generated.
- Description/title/search terms are drafted.
- Generated content is played back in the user's language.
- User or facilitator confirms before finalization.

**Dynamic Pricing Assessment**
- Material cost.
- Labour effort/time.
- Location/state labour reference where appropriate.
- Packaging and overheads.
- Desired margin.
- Comparable-market observations where data is available.
- B2B quantity tier guidance.
- Confidence/range shown instead of fake precision.

The MVP should use a **transparent rules + comparable-band model**. A trained ML model becomes appropriate only after sufficient, reliable historical data exists. A hard-coded “20% margin” must not be presented as universally correct; the margin is a configurable business input or scheme/program default.

### Pillar B — Formalize
**Document & Readiness Funnel**
- Aadhaar status/check guidance.
- Bank account status/check guidance.
- PAN status/check guidance.
- Udyam status/check guidance.
- GST readiness/awareness.
- Scheme-specific document checklist.
- Voice explanation of why a document matters.
- Nearest facilitator/CSC discovery.
- “I completed this step” status update.

The application must **guide, prepare and hand off** unless an official API and authorization permit direct submission. It must not pretend to issue Aadhaar, PAN, Udyam, GSTIN or loans.

### Pillar C — Connect
**DigiReady Preparation**
DigiReady is an ONDC × QCI digital-readiness certification/assessment covering seven areas: pre-requisites, digital infrastructure, product catalogue, catalogue management, packaging, payment and grievance redressal. Kaarigar Setu should prepare users for these areas and track readiness; it must not describe DigiReady itself as an ONDC catalog file format. citeturn968577search0

**Platform Export Layer**
- Seller-app-compatible structured export for ONDC ecosystem handoff.
- GeM-ready seller/catalog information package and facilitator workflow.
- Export manifest and missing-field report.
- External-platform status always shown as “Prepared / Handed Off / Accepted by External System,” never “Published” unless a real authorized integration confirms publication.

### Pillar D — Assisted Deployment
**20-Product Camp Mode**
- Facilitator starts a batch session.
- Add up to 20 products in a guided queue.
- Each product gets an actual photograph; each capture becomes an independent draft.
- Optional multi-product frame segmentation may be supported as an enhancement, but must be clearly marked as experimental because segmentation errors can occur.
- AI drafts all 20 records in the background.
- Facilitator reviews exceptions.
- Artisan voice-confirms each product or the batch where policy permits.
- Export all approved products together.

This is the primary realistic deployment mechanism for CSC/SHG/cluster camps.

---

## 5. Product Workflow

### Solo workflow
1. Choose language.
2. Voice-guided onboarding.
3. Select “Add Product.”
4. Photograph real item.
5. Enhance photo on-device.
6. Speak naturally about the item.
7. AI builds draft fields.
8. Audio playback confirms draft.
9. Pricing assistant generates a range and explains the drivers.
10. Artisan confirms or edits.
11. Formalization readiness is updated.
12. Choose export destination.
13. Generate structured package / hand-off.

### Camp workflow
1. Facilitator opens batch session.
2. Registers or selects 10–50 artisans.
3. Captures up to 20 products in a product queue per batch.
4. AI processes drafts asynchronously.
5. Exceptions are highlighted: missing price, ambiguous product type, poor image, low speech confidence, missing compliance field.
6. Artisan reviews by voice.
7. Facilitator resolves exceptions only where necessary.
8. Batch export generates catalog package, manifest and readiness summary.

---

## 6. AI Marketing Visuals — Allowed, Controlled, Separate

Kaarigar Setu may include an **optional marketing-visual generator**, but it must never replace the real product image as the primary listing image.

### Allowed use
- Lifestyle scenes.
- Campaign banners.
- Festival promotion visuals.
- Social media creatives.
- Product-in-context mockups.

### Required controls
- Input must originate from the real captured product image.
- Generated output must be labeled **“AI Visualization”** or equivalent.
- The user chooses scene/context, aspect ratio, campaign style, background type, visual mood, model/context when relevant, and text/no-text preference.
- The system must instruct the generation model to preserve product identity, major geometry, colors, motifs and construction characteristics as closely as possible.
- The real photo remains authoritative for listing authenticity.
- A provider-adapter architecture allows the image-generation provider to be replaced without changing product logic.

**Important:** the system deliberately does not generate artificial “replacement product photos.” The marketing-visual workflow is separate from catalog authenticity.

---

## 7. Financial Formalization & Loan Assistance

### 7.1 Formalization principle
The app should not say “you cannot use Kaarigar Setu because you do not have PAN/Udyam/bank account.” Instead:

**Missing document → explanation → required action → assisted channel → completion status.**

### 7.2 Bank account guidance
The app can explain account-opening options and route the user to an authorized bank/CSC/facilitator. It should not open an account itself unless an authorized banking integration explicitly permits it.

A practical low-literacy flow is:
- “Do you have a bank account?”
- If no: explain why it helps with schemes and digital commerce.
- Show “Find nearby bank/CSC.”
- Explain what documents to carry.
- Allow facilitator-assisted completion.
- Mark “Applied” / “Active” after user confirmation.

Government/RBI material supports simplified/limited-account mechanisms for some customers without standard documents, but eligibility, limits and KYC conditions can apply. The app must therefore use **current bank/RBI rules rather than promising a universal zero-document account**.

### 7.3 PAN guidance
The app may provide voice-guided assistance for PAN application, including form-field explanations and left-thumb-impression guidance where the official process allows it. A physical PAN application form explicitly supports left-hand thumb impression. citeturn962707search13

The app should not hard-code a single fee forever; fees and online/physical modes must be sourced from the current official channel.

### 7.4 Udyam guidance
Udyam registration is an official MSME registration process involving Aadhaar/PAN-related verification and an online registration certificate. The official Udyam materials also provide a government facilitation mechanism. citeturn968577search30turn968577search32

Kaarigar Setu should therefore:
- explain Udyam in the user's language;
- guide the user to the official channel/facilitator;
- help choose business/trade information;
- record “Not Started / In Progress / Registered”;
- never claim to be the Udyam portal.

### 7.5 Loan assistance
Kaarigar Setu should provide **scheme matching + readiness + application assistance**, not loan approval.

For example, PM Vishwakarma currently supports 18 traditional trades and provides collateral-free enterprise-development loans up to ₹3 lakh in two tranches, with a concessional 5% rate under the stated scheme structure. Government information also states that registration is through CSC/PM Vishwakarma channels and that the scheme includes market linkage and other support. citeturn233579search0turn233579search4

For NBCFDC, current official material shows that scheme limits and terms vary by loan product; therefore the product must **version its rules by scheme, date and source** rather than storing one universal “artisan loan” rule. citeturn395196search0turn395196search3

### 7.6 Loan application workflow
- Ask minimum eligibility questions.
- Identify candidate schemes.
- Show why a scheme may fit.
- Show documents still needed.
- Generate application checklist.
- Deep-link or hand off to the official channel where possible.
- Facilitator assists when required.
- User records status.
- Never promise approval, disbursement date or guaranteed amount.

---

## 8. GST Guidance — Rule Engine, Not Static Advice

GST is one of the highest-risk parts of the product because registration can depend on turnover, supply type, state, product classification, e-commerce/inter-state conditions and specific notifications/exceptions.

### Product requirement
The GST module shall use a **versioned tax-rule engine** with:
- effective date;
- jurisdiction/state;
- goods/services classification;
- turnover basis;
- inter-state/intra-state status;
- e-commerce channel;
- relevant exemption/exception;
- source notification/rule;
- “consult professional” flag.

The product must not display “₹40 lakh means no GST required” as a universal statement. Official CBIC materials show that thresholds and exceptions depend on conditions, and inter-state supply/e-commerce rules can change the result. citeturn962707search1turn962707search2

### Handicraft-specific rule handling
The previous draft incorrectly simplified the legal basis by treating Notification 56/2018-Central Tax as a universal handicraft exemption. CBIC records show that Notification 56/2018-Central Tax superseded Notification 32/2017-Central Tax, while handicraft inter-state registration exemptions also sit in the Integrated Tax notification framework, including Notification 8/2017-Integrated Tax and subsequent amendments. citeturn968577search1turn968577search4turn973187search1

Therefore, the app should say:
> “A special handicraft-related registration exemption may apply in specific circumstances. The app will check the current notification, product classification, turnover and transaction type; consult a GST practitioner before relying on an exemption.”

This is safer and more legally accurate than hard-coding one notification number.

### GST tracking
- Track only sales entered/confirmed inside Kaarigar Setu.
- Clearly state that off-platform sales are invisible to the app.
- Alert based on current tax-rule configuration.
- Never call the alert a legal determination.
- Store a source/version for every tax rule used.

---

## 9. Authenticity & Trust

### Product authenticity
- Real photograph is primary.
- Original photograph is preserved.
- Enhanced photograph is derived from the original.
- AI visualization is visibly separate.

### Proof-of-Hand
Optional short making/process capture can strengthen provenance, but the system must avoid presenting a simple video or metadata hash as legally certified authenticity. Use the wording **“Proof-of-Hand capture”** or **“process evidence”**, not “government-certified authenticity.”

### Human confirmation
Every important AI output must be reviewable and overridable by the artisan or authorized facilitator.

---

## 10. Accessibility & Adoption

The UI should be designed around:
- icon-first navigation;
- audio narration;
- minimal text;
- local-language voice interaction;
- large touch targets;
- high contrast;
- clear states: “Do this now,” “Needs help,” “Completed”;
- progressive disclosure rather than dense forms;
- offline drafts and delayed synchronization.

The interface must remain responsive on low-end Android devices. Exact device/RAM claims should be established from team benchmark tests, not asserted without measurement.

---

## 11. Business / Deployment Model

### Artisan
Free to use in the base social-impact deployment model.

### Institutional deployment
Potential funding channels:
- government programmes;
- CSR/NGO deployment;
- cluster federations;
- institutional licenses;
- sponsored onboarding camps;
- paid enterprise/buyer discovery services where legally and operationally appropriate.

Kaarigar Setu should not charge a transaction success fee unless the product later becomes an authorized transaction participant.

---

## 12. Success Metrics

### Adoption
- % of users completing first catalog without typing.
- % requiring facilitator correction.
- Products created per camp session.
- Median time per product.
- 20-product batch completion rate.

### Quality
- ASR correction rate.
- Catalog field completeness.
- Image acceptance rate.
- Human override frequency.
- Pricing explanation acceptance rate.

### Formalization
- PAN applications initiated.
- Udyam registrations completed.
- Bank-account actions completed.
- Scheme-readiness tasks completed.
- Loan applications handed off/initiated where appropriate.

### Market readiness
- DigiReady assessment improvement.
- Export packages generated.
- External handoffs completed.
- External acceptance/publication only where confirmed by the external platform.

### Impact
- Repeat active artisans.
- Share of activity outside physical fair periods.
- Women/low-literacy completion rates.
- Improved catalog coverage.
- User-reported change in realized price, measured carefully and without claiming causal impact unless evaluated.

---

## 13. MVP for SIH

### Must demonstrate live
1. Voice-first product capture.
2. Real-photo enhancement.
3. Multilingual catalog generation.
4. Transparent pricing assessment.
5. Document/readiness funnel.
6. One loan-scheme readiness example.
7. GST guidance with source/version and disclaimer.
8. SHG 20-product batch mode.
9. DigiReady preparation screen.
10. Export package generation.
11. Optional AI marketing visual generation from a real product image.
12. Offline draft + sync demonstration.

### Must not be claimed as live unless actually integrated
- Direct ONDC publishing.
- Direct GeM publishing.
- Loan approval/submission without authorized integration.
- PAN/Udyam/GST issuance.
- Aadhaar issuance.
- Guaranteed KYC verification.
- Government-certified product authenticity.

---

## 14. Roadmap

### Phase 1 — SIH prototype
Core cataloging + pricing + formalization + batch mode + export/demo.

### Phase 2 — Pilot
Real facilitator deployment in CSC/SHG/cluster camps; benchmark speech, image, batch and completion metrics.

### Phase 3 — Ecosystem integrations
Authorized partner/SNP workflows, deeper document status integrations and configurable scheme/tax rule synchronization.

### Phase 4 — Data-driven optimization
Demand forecasting, learned price bands, recommendation models and program-level analytics after sufficient consented data is available.

---

## 15. Judge-Level Differentiator

The winning story is not “we use many AI models.”

The winning story is:

> **“We remove the three barriers that stop an artisan from becoming digitally market-ready: creating a professional catalog, becoming administratively ready, and reaching the right downstream channel — while keeping the actual product truthful.”**

That is a coherent product rather than a feature collection.

---

# 15. ADDITIONAL PRODUCT CAPABILITIES — APPROVED EXTENSION

The following capabilities are added to the existing PRD without removing or replacing the existing requirements.

## 15.1 AI Camera Coach / Guided Capture

Kaarigar Setu shall not depend on artisans taking arbitrary product photographs. The mobile application shall provide a guided camera experience that helps the artisan prepare the product and camera position before capture.

The camera coach may provide:
- On-screen framing guides for product placement.
- Guidance to move the product or camera into the recommended position.
- Lighting-quality feedback.
- Shadow/background warnings.
- Stability/blur warnings.
- Product-centering guidance.
- Capture readiness feedback.
- Optional automatic capture after acceptable framing and lighting conditions are reached.

This capability shall be described as **guided capture / AI camera coaching**, not as guaranteed AR accuracy. The real product photo remains the source image for the authentic catalogue.

## 15.2 Voice-First, Not Voice-Only

The product shall be **voice-first** rather than voice-only.

Primary interaction:
- Voice input.
- Voice confirmation.
- Spoken guidance.
- Audio read-back.

Fallback interaction:
- Large touch controls.
- Icon-first navigation.
- Basic typing/text entry where appropriate.
- Facilitator-assisted completion.

No important workflow shall become unusable solely because speech recognition fails.

## 15.3 Mobile + Web Product Strategy

The product shall contain two complementary interfaces rather than two duplicate full applications.

### Mobile application — Artisan-facing
Primary use cases:
- Guided product capture.
- Voice-first catalog creation.
- Pricing assessment.
- Formalization guidance.
- Scheme readiness.
- Offline drafts and synchronization.
- Product confirmation.

### Responsive web application — Facilitator-facing
Primary use cases:
- SHG/cluster/CSC camp management.
- Multi-artisan onboarding.
- 20-product batch capture/review.
- Human corrections and approvals.
- Document/readiness assistance.
- Bulk export package generation.
- Operational monitoring.

### Web administration — System operations
Where implemented, the administration interface shall provide:
- Versioned government-scheme records.
- Source verification status.
- Rule/version management.
- AI-provider configuration.
- Export-template configuration.
- Audit logs.

The product shall not become a full consumer marketplace web application.

## 15.4 SHG/CSC Camp Mode — 20-Product Batch Workflow

The existing facilitator/bulk onboarding capability is extended into a dedicated camp mode.

A facilitator shall be able to process approximately 20 products in a single session without requiring each item to complete synchronously before the next item can begin.

Example workflow:

1. Start Camp Mode.
2. Select/create artisan profile.
3. Capture product 1.
4. Capture subsequent products while earlier items process asynchronously.
5. Review the batch status.
6. Correct only items that require attention.
7. Approve the ready products.
8. Generate one batch manifest/export package.

The batch dashboard shall distinguish at least:
- Ready.
- Needs confirmation.
- Needs retake.
- Processing.
- Failed/retry.

One failed product shall not block the remainder of the batch.

## 15.5 Real-Time Market Price Assessment Agent

The Dynamic Pricing Assistant shall be implemented as a **Market Price Assessment capability**, not as a claim of a machine-learning price predictor.

A market-intelligence agent may search permitted/current market sources to identify comparable products and observed prices.

The assessment shall combine, where available:
- Current comparable market prices.
- Material/input costs.
- Labour cost.
- Packaging/overhead inputs.
- Artisan-configured margin.
- Product category and characteristics.
- B2B/bulk quantity context.

The system shall return an evidence-backed **price range or assessment**, not an asserted universally optimal price.

Each market observation should retain, where technically and legally appropriate:
- Source.
- URL/reference.
- Observed price.
- Retrieval timestamp.
- Comparable-product context.
- Confidence/evidence status.

The system shall prefer authorized APIs, structured public sources and permitted public information over unrestricted scraping. Source terms and access restrictions shall be respected.

## 15.6 Government Scheme Intelligence Agent

Government scheme and loan information shall not be hard-coded as an unversioned static list.

A scheme-intelligence pipeline shall:
- Monitor authoritative government sources.
- Detect relevant updates where technically feasible.
- Extract structured scheme information.
- Verify source provenance.
- Record effective dates and version information.
- Flag conflicting or uncertain information.
- Update the versioned scheme knowledge base.

Each scheme record should contain, as applicable:
- Scheme name.
- Responsible authority.
- Target beneficiaries.
- Eligibility rules.
- Benefits/loan structure.
- Required documents.
- Application channel.
- Source URL/reference.
- Last verified time.
- Effective date/version.
- Verification status.

The application shall not silently present an unverified change as a confirmed government rule.

## 15.7 Government/GST Rule Freshness

Government rules and GST guidance shall be treated as **versioned knowledge**, not immutable application code.

Where current information cannot be verified, the application shall:
- Show the last verified information.
- Display its verification date.
- Warn the user when re-verification is required.
- Recommend an appropriate official or facilitator channel for high-impact decisions.

The application shall provide guidance and eligibility assistance and shall not represent itself as a government authority, tax practitioner, lender, registrar or certification authority.

## 15.8 Demo Environment and External Marketplace Handoff

For hackathon demonstration, Kaarigar Setu shall not claim live government-marketplace publication unless an authorized and functioning integration exists.

The demo shall instead demonstrate the real preparation/handoff boundary:

- Generate the normalized product record.
- Validate required fields.
- Generate the relevant downstream package/export.
- Show a controlled demonstration destination/preview.
- Clearly label simulated or mock destination behavior.
- Explain the facilitator/Seller Network Participant handoff required for real deployment where applicable.

The demo shall therefore prove the product capability without pretending to possess production credentials for GeM, ONDC, or another external platform.

## 15.9 AI Agent Architecture Principle

Kaarigar Setu may use specialized agents where search, reasoning, external tools or source synthesis are genuinely required.

Potential agent roles include:
- Product Content Agent.
- Market Intelligence Agent.
- Government Scheme Intelligence Agent.
- Formalization Assistant.
- Marketing Visual Agent.

Core transactional functions shall remain conventional services rather than being artificially converted into agents.

## 15.10 Optional AI Marketing Visuals

The existing AI marketing-visual capability remains optional and separate from authentic catalogue photography.

Rules:
- Real product imagery remains primary.
- AI-generated marketing visuals shall be derived from the real product image where supported.
- Generated visuals shall be clearly labelled as AI visualizations.
- Generated visuals shall not silently replace the real product image.
- ChatGPT-specific image generation is intentionally not a required listing-image dependency.

## 15.11 Updated Product Principle

The product principle for the expanded scope is:

> **Voice First. Touch Always. Text When Needed.**

And the deployment principle is:

> **One artisan can use the mobile app; one facilitator can onboard an entire batch.**
