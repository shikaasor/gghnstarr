# Phase 7: Content & Analytics - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Publish all 15 policy briefs, surface Rwanda infographic JPEGs, integrate GA4 tracking, and add audience-segmented CTAs to the homepage. Does NOT include building /awareness, /take-action, or /tools pages — those are Phases 8, 10, 11.

</domain>

<decisions>
## Implementation Decisions

### Audience CTA section
- Placement: directly below the hero section on the homepage
- Layout: 3 side-by-side cards (equal columns)
- Background: light grey / off-white section background
- Each card has: distinct audience-specific icon + headline + primary CTA button + 2 secondary text links to related pages
- Cross-linking: each card leads to its primary destination AND links to related pages — paths between content must remain open
  - Minister → primary: /briefs | secondary: /awareness (Phase 8), /take-action (Phase 10)
  - Healthcare Worker → primary: /awareness (Phase 8) | secondary: /briefs, /take-action (Phase 10)
  - General Public → primary: /take-action (Phase 10) | secondary: /briefs, /awareness (Phase 8)
  - NOTE: Phase 8 and Phase 10 pages don't exist yet — links should be visually present but rendered as `href="#"` or disabled until those phases ship
- Icons: distinct per audience (e.g. government/parliament icon for ministers, stethoscope for HCW, person/community for public)
- Copy tone: empathetic — "Find resources for your role", "Learn what you can do" register (not cold directive tone)

### Infographic placement (IMG_9750–9752)
- These are Rwanda-specific Fleming Fund infographics — NOT generic AMR infographics
- Display location: brief detail pages for the Rwanda-related briefs only
- Display style: full-width image inline on the detail page
- Interaction: clicking the image opens it full-size (no separate download button)
- GA4 infographic click event should fire on the image click

### GA4 analytics
- Measurement ID: read from environment variable (NEXT_PUBLIC_GA4_MEASUREMENT_ID) — use placeholder value for now
- Script placement: Claude's Discretion — follow Next.js GA4 best practice (likely a separate GoogleAnalytics.tsx component with Next.js Script, imported into app/layout.tsx)
- Event helper structure: shared `lib/analytics.ts` with named functions:
  - `trackPdfDownload(briefSlug: string)`
  - `trackInfographicView(briefSlug: string)` — fires on infographic image click
  - `trackNewsletterSignup()`
  - `trackPledgeSubmit()` — no-ops until Phase 10 page exists
  - `trackQuizComplete()` — no-ops until Phase 11 page exists
- All 4 event helper functions created now; pledge/quiz silently no-op until their pages exist
- Wire existing PDF download buttons and newsletter form to fire their respective helpers

### Brief content — REPLACE briefs 1–3, ADD briefs 4–15
- **CRITICAL:** Briefs 1–3 currently in `content/briefs-index.json` are synthetic placeholder content — titles and summaries do not match the real policy briefs
- Phase 7 must REPLACE all 3 existing entries with real content AND add briefs 4–15
- The real 15 brief titles (from master implementation doc / Mercy's drafts):
  1. Multi Country PEA
  2. Why countries struggle with AMR
  3. The political economy of AMR in Africa
  4. Global impact of funding shifts
  5. A threat to health & national security
  6. Domestic Budgets, Donor Leverage & Sustainability
  7. Strengthening One Health Governance for AMR
  8. Achieving Intra and Integrated AMR/AMU Surveillance
  9. Optimising & maximising local laboratory systems
  10. Stewardship & IPC — Cost effective interventions
  11. Livestock, Food Safety, Food Security & Trade
  12. Environmental AMR — The Missing Pillar in National Plans
  13. Digital Transformation for AMR — AI, Interoperability & Real Time Data
  14. Post Shock Political-Economic Conditions
  15. Key Messages for the 5th Global AMR Conference
- Source files: `resources/GGHN STARR_5th Interministrial AMR Meeting. Mar - Jun 2026/Briefs/Mercy_s Briefs/Drafts for review/` — planner must read these .docx files to extract real titles, key messages, executive summaries
- Schema: same JSON schema as existing briefs
- `infographicPdfUrl`: not present for any of the 15 briefs (only the 3 Rwanda JPEGs exist, handled separately as inline images)
- `thumbnailUrl`: shared AMR placeholder thumbnail for all 15 briefs (one placeholder image)
- PDFs: .docx drafts in resources/ will be converted to PDF and committed under `public/briefs/` — planner must include this as an explicit task
- Briefs #14 and #15 are outlines only — include with available content; mark clearly in JSON

### Typography — Montserrat + Inter (to be implemented in Phase 7)
- Headings: **Montserrat** (Bold, modern, authoritative) via `next/font/google`
- Body: **Inter** (already referenced in codebase, just not imported via next/font yet)
- Implementation: add both fonts in `app/layout.tsx` using `next/font/google`, inject as CSS variables, update `@theme` tokens in `globals.css`
- The `globals.css` comment already anticipates this pattern — planner should follow it
- This is in scope for Phase 7 (not a separate phase) as it's a quick wiring task

### Claude's Discretion
- Exact GoogleAnalytics component structure and script strategy (afterInteractive vs lazyOnload)
- Specific icon library or SVG approach for audience CTA icons
- Secondary link styling within CTA cards
- CSS/Tailwind specifics for the light grey section background
- Font weight and size scale decisions (Montserrat Bold for h1/h2, SemiBold for h3, etc.)

</decisions>

<specifics>
## Specific Ideas

- The audience CTA section is meant to make policymakers, healthcare workers, and the public feel immediately seen — not generic "learn more" links
- Rwanda infographics are specific to Fleming Fund Rwanda work — they belong contextually on the relevant brief pages, not as generic site imagery
- GA4 event helpers are a shared utility — structured so Phase 10/11 can just call the function without wiring up gtag themselves

</specifics>

<deferred>
## Deferred Ideas

- **"About the Platform" page** — present in master implementation doc as Page 2 (mission/vision, theory of change, expertise) but not in any current roadmap phase. Needs a dedicated phase.
- **Seven unplanned master pages** — Country Dashboards, One Health Knowledge Hub, Policy Action Toolkit, Research & Evidence Library, Events & Learning, Community of Practice Forum, Monitoring & Accountability Dashboard, Partner Portal — all from master doc but out of scope for v2.0 deadline (June 28, 2026). Review for v3.0.

</deferred>

---

*Phase: 07-content-and-analytics*
*Context gathered: 2026-04-28*
