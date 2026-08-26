# Kaarigar Setu — Software Requirements Specification (SRS)
## SIH 26090 | Voice-first Virtual Business Manager for Marginalized Artisans
**Version:** 1.0 — 26 August 2026

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the functional, non-functional, data, interface, security, AI, workflow, and deployment requirements for Kaarigar Setu.

### 1.2 Scope
The system includes:
- Android artisan application;
- facilitator/batch onboarding mode;
- backend API and business-rule engine;
- AI processing services;
- catalog and pricing engine;
- formalization/scheme readiness engine;
- GST guidance engine;
- export/orchestration workflows;
- administrative analytics;
- optional marketing-visual generation service;
- single-page demonstration renderer for showing how a listing will appear downstream.

The system excludes transaction processing, marketplace checkout, shipping and external dispute resolution.

### 1.3 Terminology
- **VBM:** Virtual Business Manager.
- **ASR:** Automatic Speech Recognition.
- **TTS:** Text-to-Speech.
- **SNP:** Seller Network Participant in the ONDC ecosystem.
- **DigiReady:** ONDC × QCI Digital Readiness Certification/assessment.
- **PoH:** Proof-of-Hand / process evidence capture.
- **MRM:** Marketing Visual Module.
- **FR:** Functional Requirement.
- **NFR:** Non-Functional Requirement.

---

## 2. System Context

### 2.1 High-level architecture

```text
┌─────────────────────────────────────────────────────────┐
│                 Kaarigar Setu Mobile App               │
│  Voice UI | Camera | Offline Drafts | Batch Mode       │
│  Document Status | Pricing | Confirmation              │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS / queued sync
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    API / Application Layer              │
│ Auth | Product Service | Catalog Service | User Service │
│ Pricing Service | Formalization | Scheme Rules         │
│ GST Rules | Consent | Audit | Export Requests          │
└───────────────┬─────────────────────┬───────────────────┘
                │                     │
                ▼                     ▼
┌──────────────────────────┐   ┌─────────────────────────┐
│ AI / Processing Services  │   │ PostgreSQL              │
│ ASR / Translation / TTS   │   │ Users, Products, Rules  │
│ LLM structured generation │   │ Consent, Audit, Status  │
│ Image enhancement         │   └─────────────────────────┘
│ Marketing visual adapter  │
└──────────────┬─────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│ Object Storage                                           │
│ Original photos | enhanced photos | audio | videos      │
└─────────────────────────────────────────────────────────┘

                 COLD / ASYNC ORCHESTRATION
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ n8n + Redis queue                                       │
│ Export formatting | batch packaging | reminders         │
│ scheme refresh | reports | notifications                │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Architectural principle
**Hot paths:** capture, voice, catalog drafting, pricing and immediate user feedback should call application/AI services directly.  
**Cold/async paths:** packaging, exports, scheduled rule refreshes, notifications and batch administration may use n8n with queue-based workers.

n8n is an orchestration component, not the image-processing engine and not the authoritative database.

### 2.3 Technology baseline
Recommended baseline:
- Mobile: Flutter or React Native.
- Backend: FastAPI/Python.
- Database: PostgreSQL.
- Cache/queue: Redis.
- Orchestration: n8n.
- Object storage: S3-compatible storage or equivalent.
- AI services: configurable adapters for speech, translation, LLM and image generation.

The architecture is intentionally provider-neutral so government/sovereign AI services or commercial model providers can be substituted without rewriting the product.

---

## 3. Functional Requirements

### 3.1 Identity and onboarding
**FR-001** System shall support artisan, facilitator and administrator roles.  
**FR-002** System shall provide language selection before text-heavy onboarding.  
**FR-003** System shall provide audio-guided onboarding.  
**FR-004** System shall allow facilitator-assisted registration for camp deployments.  
**FR-005** System shall store minimum necessary profile data and track consent state.

### 3.2 Product capture
**FR-010** System shall capture a real product photo.  
**FR-011** System shall preserve the original photo.  
**FR-012** System shall create an enhanced derivative without overwriting the original.  
**FR-013** System shall support multiple product-image crops/ratios.  
**FR-014** System shall allow manual retake/reject.  
**FR-015** System shall record capture metadata subject to privacy settings.

### 3.3 AI cataloging
**FR-020** System shall accept voice input in configured supported languages.  
**FR-021** System shall transcribe the voice input.  
**FR-022** System shall create structured fields such as title, category, material, color, size, craft type, story and care instructions where supported by the input.  
**FR-023** System shall generate user-readable draft descriptions.  
**FR-024** System shall generate an English/Hindi version where requested and supported.  
**FR-025** System shall play back the important generated content in the user's language where TTS is available.  
**FR-026** System shall display confidence/uncertainty for fields where AI confidence is below configurable thresholds.  
**FR-027** System shall require human confirmation before a listing is considered final.

### 3.4 Pricing assessment
**FR-030** System shall capture material costs.  
**FR-031** System shall capture labour time or effort.  
**FR-032** System shall capture packaging/overhead inputs where relevant.  
**FR-033** System shall calculate a configurable cost floor.  
**FR-034** System shall allow a configurable target margin rather than a universal hard-coded margin.  
**FR-035** System shall optionally use comparable market observations.  
**FR-036** System shall display a price range and the reasons behind the range.  
**FR-037** System shall allow artisan/facilitator override.  
**FR-038** System shall record the source/date of external cost or wage reference data.  
**FR-039** System shall not claim a machine-learned price model unless a trained and validated model is actually deployed.

### 3.5 Batch mode
**FR-040** Facilitator shall start a batch session.  
**FR-041** System shall support at least 20 product records in one batch session.  
**FR-042** Products shall be processed independently so one failure does not block the batch.  
**FR-043** System shall show batch progress and exceptions.  
**FR-044** System shall support artisan voice confirmation per item.  
**FR-045** System shall allow bulk export of approved products.  
**FR-046** System shall generate a batch manifest.  
**FR-047** System shall support offline capture and later synchronization.  
**FR-048** Optional multi-product-frame segmentation shall be feature-flagged and measured separately from the default capture flow.

### 3.6 Formalization funnel
**FR-050** System shall track status for Aadhaar, bank account, PAN, Udyam and GST readiness.  
**FR-051** System shall explain each document in audio.  
**FR-052** System shall provide action checklists.  
**FR-053** System shall provide nearest authorized assistance discovery where a location service is available.  
**FR-054** System shall allow user/facilitator to mark steps as not started, in progress or completed.  
**FR-055** System shall distinguish self-declared status from externally verified status.  
**FR-056** System shall never claim that a document was issued merely because a user marked it completed.

### 3.7 Loan and scheme assistance
**FR-060** System shall maintain versioned scheme rules.  
**FR-061** System shall store eligibility questions separately from explanatory content.  
**FR-062** System shall calculate a non-binding candidate-eligibility result.  
**FR-063** System shall show reasons for an eligibility flag and missing information.  
**FR-064** System shall generate a document checklist.  
**FR-065** System shall provide official-channel handoff/deep links where available.  
**FR-066** System shall track “interest shown / application initiated / submitted externally / outcome reported” without claiming an outcome that it cannot verify.

### 3.8 GST guidance
**FR-070** System shall maintain versioned GST rules with effective dates.  
**FR-071** System shall collect the minimum facts needed for a GST guidance decision.  
**FR-072** System shall identify possible registration triggers and exceptions.  
**FR-073** System shall cite the source/rule version used for the guidance.  
**FR-074** System shall clearly identify that the result is informational.  
**FR-075** System shall route complex cases to a facilitator/GST practitioner.  
**FR-076** System shall never represent its rule engine as legal advice.

### 3.9 DigiReady preparation
**FR-080** System shall support the seven DigiReady areas.  
**FR-081** System shall show current readiness status per area.  
**FR-082** System shall generate improvement tasks.  
**FR-083** System shall not label its own export file as the DigiReady certificate.  
**FR-084** System shall allow the user to view the source/last-updated date of readiness guidance.

### 3.10 Platform export
**FR-090** System shall validate a catalog against a versioned internal export schema.  
**FR-091** System shall produce an ONDC ecosystem handoff package appropriate to the authorized downstream seller-app workflow.  
**FR-092** System shall produce GeM-oriented seller/catalog data packages and facilitator checklists.  
**FR-093** System shall produce an export manifest listing all generated artifacts and missing fields.  
**FR-094** System shall distinguish “exported” from “published/accepted externally.”  
**FR-095** n8n may perform the packaging/formatting workflow but shall not be the authoritative product database.

### 3.11 AI marketing visuals
**FR-100** System shall allow optional generation of marketing/lifestyle visuals from a real product photograph.  
**FR-101** System shall preserve the original product photo as the authoritative product image.  
**FR-102** System shall add a visible “AI Visualization” label to generated promotional visuals.  
**FR-103** System shall provide user-selectable controls including scene, context, aspect ratio, background, mood/style, campaign type and text/no-text preference.  
**FR-104** System shall pass preservation constraints to the generation provider.  
**FR-105** System shall support pluggable image-generation providers.  
**FR-106** System shall prevent AI-generated marketing images from automatically becoming the primary product listing image.

### 3.12 Consent and audit
**FR-110** System shall capture purpose-specific consent.  
**FR-111** Consent interaction shall be available in plain language and audio-assisted flow.  
**FR-112** System shall record consent event, purpose, timestamp and version.  
**FR-113** System shall support withdrawal workflows appropriate to the processing purpose.  
**FR-114** System shall retain an audit log for material AI edits and human overrides.

---

## 4. Non-Functional Requirements

### NFR-001 Performance
The application should provide responsive UI feedback immediately and queue expensive operations asynchronously. Exact image/voice latency targets must be benchmarked on the actual low-end devices selected by the team.

### NFR-002 Reliability
Offline capture shall not lose a product draft because of temporary connectivity loss.

### NFR-003 Scalability
The backend shall be horizontally scalable. AI processing shall be separable from the API tier. Batch operations shall be asynchronous. Queue workers shall be independently scalable.

### NFR-004 Accessibility
The product shall support icon-first interaction, large targets, clear contrast, audio guidance and minimal text entry.

### NFR-005 Security
- TLS in transit.
- Encryption at rest for sensitive data.
- Role-based access control.
- Short-lived signed URLs for private media.
- Least-privilege service credentials.
- Secrets stored outside source code.
- Audit logs for administrative operations.

### NFR-006 Privacy
Collect only data needed for the user’s selected task. Aadhaar/PAN and other identity data shall be processed only through authorized, consented flows. Do not store raw identity documents unless there is a defined lawful/business requirement.

The DPDP Act’s commencement is phased under the Government notification dated 13 November 2025; the product must therefore maintain a compliance schedule and implement privacy-by-design now rather than assuming every provision is already operational. citeturn815957search17turn815957search0

### NFR-007 Maintainability
AI providers, scheme rules, GST rules and export schemas shall be configuration/version driven wherever practical.

### NFR-008 Observability
Monitor:
- API latency;
- queue depth;
- processing failures;
- ASR confidence;
- catalog correction rate;
- export failures;
- storage errors;
- external dependency health.

### NFR-009 Localization
Language-specific text must be versioned independently from workflow logic.

---

## 5. Data Model

### Core entities
- User
- ArtisanProfile
- FacilitatorProfile
- Product
- ProductMedia
- VoiceInput
- CatalogDraft
- PriceAssessment
- DocumentStatus
- SchemeRule
- SchemeAssessment
- GSTRule
- GSTAssessment
- DigiReadyAssessment
- ExportJob
- ExportArtifact
- BatchSession
- ConsentEvent
- AuditEvent
- MarketingVisualRequest
- MarketingVisual

### Product minimum fields
- product_id
- artisan_id
- category
- title
- material
- dimensions
- color
- description
- artisan_story
- price_range
- final_price
- quantity
- image_original_uri
- image_enhanced_uri
- status
- created_at
- updated_at
- source/confidence metadata

---

## 6. External Interfaces

### 6.1 Speech / language
Provider adapter must support:
- ASR;
- translation;
- TTS.

BHASHINI is a preferred government-aligned integration candidate, but availability, quotas, API contracts and supported language/model combinations must be validated against the live service before production deployment.

### 6.2 DigiLocker / identity providers
Use only authorized APIs/providers and explicit consent. If unavailable, fall back to facilitator-assisted document verification.

### 6.3 ONDC
Do not implement “direct ONDC publishing” as a prototype promise. The system shall produce a downstream-ready package or use an authorized Seller Network Participant integration when a real commercial/technical agreement exists. ONDC states that Seller Network Participants connect sellers to the network through seller applications and help digitize catalogues. citeturn968577search5

### 6.4 GeM
GeM seller onboarding is portal-based. Kaarigar Setu should prepare information, check readiness, and provide facilitator assistance rather than claim unsupported public API publication. GeM’s seller registration material describes Aadhaar/PAN, mobile/email and subsequent profile information such as bank details. citeturn421163search12turn421163search15

---

## 7. AI Safety & Quality Gates

### Listing-photo gate
Reject AI-generated replacement photos as primary catalog assets.

### Voice gate
If ASR confidence is low, request repetition or facilitator correction.

### Catalog gate
AI-generated factual fields such as material, dimensions, certification and price must never be treated as true merely because an LLM produced them.

### Pricing gate
Every price recommendation must show drivers and permit override.

### Government-rule gate
Every scheme/GST answer must carry:
- rule version;
- effective date;
- source;
- “informational / verify” status.

### Marketing-image gate
Generated promotional image must be visibly labeled and must not overwrite the source product photograph.

---

## 8. Error Handling

| Failure | System response |
|---|---|
| Offline | Save locally, queue sync |
| ASR failure | Retry, then fallback/provider or facilitator entry |
| Translation failure | Preserve original transcript, request confirmation |
| Image model failure | Keep original photo, show manual crop option |
| Pricing dependency unavailable | Use locally cached rule/configuration with date, or show “manual price” |
| GST rule unavailable | Do not guess; show “verification required” |
| Scheme rule stale | Show last-updated date and require refresh before high-impact decision |
| Export schema failure | Return missing fields list |
| n8n failure | Store export request and retry independently |
| Storage failure | Retry and preserve local draft |
| Low model confidence | Human/facilitator review gate |

---

## 9. Security and Governance Requirements

- RBAC for artisan/facilitator/admin.
- Separate production secrets from application code.
- Encrypt sensitive data.
- Record who accessed identity documents.
- Record who changed pricing/catalog data.
- Record AI model/provider and prompt/template version for explainability.
- Rate-limit public APIs.
- Sanitize uploads.
- Validate file type/size.
- Scan uploaded documents/media before storage where feasible.
- Implement data-retention schedules.
- Provide account/data deletion mechanisms appropriate to the legal basis and operational need.

---

## 10. Test Requirements

### Functional test groups
1. Low-literacy solo user.
2. Regional-language voice flow.
3. Offline capture.
4. 20-product batch.
5. Low-confidence ASR.
6. Missing document flow.
7. Scheme eligibility edge cases.
8. GST edge cases.
9. Export-schema validation.
10. AI marketing visual safety.
11. Consent recording.
12. Human override.

### Acceptance targets for the prototype
- No product data lost after connectivity interruption.
- Every product can be corrected manually.
- 20-product batch can complete without blocking on one failed item.
- Original image is always recoverable.
- AI visualization cannot silently replace primary product media.
- Tax/scheme outputs expose source/version.
- Export output identifies missing required fields.

---

## 11. Scalability Strategy

### Stage 1
Single deployment with PostgreSQL + Redis and separately scaled workers.

### Stage 2
Multiple API replicas; separate AI workers; object storage; queue-based export processing.

### Stage 3
Regional/service partitioning, read replicas, autoscaling, centralized observability and versioned rule distribution.

### Important design rule
Do not use a workflow engine as a substitute for the core transactional system. n8n is an orchestration tool; PostgreSQL remains the system of record and FastAPI remains responsible for synchronous application logic.

---

## 12. Deployment Environments

- Development.
- Staging/demo.
- Production/pilot.

Each environment must use isolated credentials, databases and storage buckets.

---

## 13. Traceability Matrix

| SIH requirement | Product capability | SRS coverage |
|---|---|---|
| AI image enhancement | Real-photo enhancement | FR-010 to FR-015 |
| Multilingual auto-cataloging | Voice-to-structured listing | FR-020 to FR-027 |
| Dynamic pricing | Transparent pricing assessment | FR-030 to FR-039 |
| Accessible mobile UI | Voice/icon-first UX | NFR-004 |
| Scalable backend | API + queue + workers | NFR-003 |
| Market linkage | Export/handoff layer | FR-090 to FR-095 |
| Low-literacy adoption | Facilitator + batch mode | FR-040 to FR-048 |

---

## 14. Release Criteria

The SIH prototype is release-ready when:
- the three mandated PS features work end-to-end;
- batch mode demonstrates a realistic facilitator workflow;
- formalization guidance works without false promises;
- GST/scheme rules are source-tagged;
- export claims match the actual integration level;
- AI marketing visuals remain separate from authentic product images;
- failure handling works offline and with unavailable external services;
- the team can explain every architecture component and its justification.

---

# 15. ADDITIONAL SOFTWARE REQUIREMENTS — APPROVED EXTENSION

The following requirements are added to the existing SRS without removing or replacing the existing requirements.

## 15.1 Guided Camera / AI Capture Coach

### FR-096 — Guided framing
The mobile application shall display a visual framing guide to assist with correct product placement before capture.

### FR-097 — Lighting guidance
The mobile application shall evaluate basic image/camera conditions and provide user guidance when lighting is insufficient, uneven or likely to create strong shadows.

### FR-098 — Stability and quality guidance
The mobile application shall provide feedback for camera movement, blur risk, poor framing and other detectable capture-quality issues.

### FR-099 — Capture readiness
The mobile application shall provide a clear capture-ready state when configured minimum image-quality conditions are satisfied.

### FR-100 — Optional assisted capture
The system may automatically capture the image after the configured readiness conditions are met.

## 15.2 Voice-First With Fallback Interaction

### FR-101 — Voice-first interaction
The application shall make voice the primary interaction method for supported onboarding and cataloguing workflows.

### FR-102 — Touch fallback
The application shall provide large, accessible touch controls for major actions.

### FR-103 — Text fallback
The application shall permit basic typing/text entry for supported fields and exception cases.

### FR-104 — Human/facilitator fallback
The application shall permit a facilitator to complete or correct a workflow when automated voice interaction is insufficient.

### NFR-009 — No voice-only dependency
A failure of speech recognition shall not cause loss of user data or make the overall workflow irrecoverable.

## 15.3 Mobile and Web Interfaces

### FR-105 — Artisan mobile application
The system shall provide the primary artisan interaction through the Android mobile application.

### FR-106 — Facilitator web application
The system shall provide a responsive web interface for SHG, cluster and CSC-style facilitator workflows.

### FR-107 — Camp dashboard
The facilitator web interface shall provide a batch dashboard for multiple products/artisans and their processing status.

### FR-108 — Administrative interface
Where enabled, the system shall provide authorized administrative functions for source/rule/version management, export templates and audit visibility.

### NFR-010 — Responsive layout
The facilitator web application shall be responsive across desktop and tablet-class screen sizes and maintain accessible controls.

## 15.4 20-Product Camp Mode

### FR-109 — Batch session
The system shall allow a facilitator to create a batch session containing multiple artisan/product records.

### FR-110 — Asynchronous processing
The system shall permit subsequent product capture while previously submitted items are being processed asynchronously.

### FR-111 — Independent item failure
Failure of one product shall not block the processing of other items in the same batch.

### FR-112 — Batch states
Each batch item shall expose at least: Processing, Ready, Needs Confirmation, Needs Retake, Failed/Retry.

### FR-113 — Bulk review
The facilitator shall be able to review and correct multiple generated catalog entries before export.

### FR-114 — Batch export
The system shall generate a batch manifest and export package for selected ready items.

### NFR-011 — Batch resilience
An interrupted connection or single-item error shall not discard successful items already stored.

## 15.5 Market Intelligence Agent

### FR-115 — Comparable market discovery
The system shall support an agent/service that searches permitted current sources for comparable products and observed prices.

### FR-116 — Evidence record
Each market observation shall store source/reference information and retrieval time where technically available.

### FR-117 — Assessment range
The system shall generate a price assessment/range from available evidence and seller inputs rather than asserting an unexplained optimal value.

### FR-118 — Cost-aware assessment
The pricing engine shall combine applicable material, labour, packaging/overhead and seller-margin inputs with available market evidence.

### FR-119 — Source failure fallback
If market sources are unavailable, the pricing service shall fall back to the last permitted evidence, local cost-based calculation or an explicitly limited assessment rather than inventing a live market price.

### NFR-012 — Source compliance
The market intelligence subsystem shall respect applicable source terms, API limits and permitted access mechanisms.

## 15.6 Government Scheme Intelligence

### FR-120 — Source monitoring
The system shall support scheduled or on-demand monitoring of configured authoritative government sources for scheme information.

### FR-121 — Scheme normalization
The system shall normalize verified scheme information into a structured, versioned representation.

### FR-122 — Scheme versioning
Each published scheme record shall have a source, verification status, version/effective-date information and last-verified timestamp where available.

### FR-123 — Conflict detection
The system shall flag conflicting or uncertain scheme information for review instead of silently selecting one version as authoritative.

### FR-124 — Scheme update propagation
Once an authorized update is verified, the system shall make the new scheme record available to the eligibility/readiness engine without requiring hard-coded changes in the mobile UI.

### FR-125 — Stale information handling
When a current refresh cannot be completed, the application shall display the last verified information and its verification date.

### FR-126 — No false authority
The system shall identify scheme guidance as informational/assistive and shall not present itself as the government authority responsible for scheme approval or loan sanction.

## 15.7 Government/GST Knowledge Architecture

### FR-127 — Versioned rules
Government and GST rules used by the application shall be maintained as versioned knowledge/configuration wherever practicable rather than being embedded as unversioned frontend constants.

### FR-128 — Source-linked rule
High-impact government/tax outputs shall link to or identify the underlying authoritative source/reference when technically and legally appropriate.

### FR-129 — Verification date
The system shall display the last verification date for time-sensitive government/tax information.

### FR-130 — Escalation
The system shall provide a facilitator/official-source escalation path when the rule engine encounters insufficient or conflicting information.

## 15.8 Demo / External Integration Boundary

### FR-131 — Demo adapter
The system shall provide a controlled demonstration adapter for downstream marketplace handoff when live external credentials are unavailable.

### FR-132 — Honest integration state
The system shall distinguish clearly between:
- Live authorized integration.
- Export/package generation.
- Simulated/mock demonstration.

### FR-133 — Export validation
The export pipeline shall validate required data before generating the handoff package.

### NFR-013 — No simulated-live misrepresentation
The user interface and presentation mode shall not represent a mock or simulated destination as a live government-marketplace publication.

## 15.9 Agent Architecture

### FR-134 — Agent adapters
Agent-backed functions shall be exposed behind application interfaces/adapters so providers or implementations can be replaced without changing the core business domain.

### FR-135 — Specialized agent roles
The system may use separate implementations for Product Content, Market Intelligence, Government Scheme Intelligence, Formalization Assistance and Marketing Visual generation.

### FR-136 — Conventional core services
Authentication, persistence, transactional state management, file storage, queueing, validation and deterministic rule execution shall remain conventional services rather than being delegated to an agent without necessity.

## 15.10 Additional Data Entities

The system should support the following logical records:

| Entity | Purpose |
|---|---|
| CaptureSession | Guided camera session and quality state |
| BatchSession | SHG/CSC multi-product onboarding session |
| MarketObservation | Comparable price evidence and source metadata |
| SchemeRecord | Versioned government scheme information |
| SchemeSource | Source and verification metadata |
| RuleVersion | Effective/versioned business or government rule |
| IntegrationState | Live/export/mock status for downstream systems |
| AgentRun | Audit trail for tool-using agent execution |

## 15.11 Additional Failure Handling

- Camera guidance unavailable → normal camera capture remains available.
- Market source blocked/unavailable → fallback to cost-based assessment and last permitted data.
- Scheme source unavailable → show last verified record and verification date.
- Scheme sources conflict → flag for review; do not silently overwrite the active verified version.
- Voice unavailable → touch/text fallback.
- Web connectivity interrupted during batch → preserve completed items and retry pending items.
- External marketplace credentials unavailable → export/demo adapter rather than fabricated publication success.

## 15.12 Additional Demo Acceptance Criteria

The SIH prototype shall be able to demonstrate:
1. Guided capture of a product.
2. Voice-first catalog creation with touch/text fallback.
3. Market evidence and price assessment with source/timestamp metadata.
4. Government-scheme information with source/version/verification status.
5. 20-product facilitator batch mode.
6. Mobile artisan flow plus responsive web facilitator flow.
7. Clearly separated live/export/mock downstream states.
8. Optional AI marketing visualization that cannot replace the real product image.
