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

### Brief data for briefs 4–15
- Schema: same JSON schema as briefs 1–3
- `infographicPdfUrl`: not present for briefs 4–15 (only the 3 Rwanda JPEGs exist, handled separately)
- `thumbnailUrl`: shared AMR placeholder thumbnail for all 12 new briefs (one placeholder image)
- PDFs: drafts will be converted to PDF and committed as part of Phase 7 execution — planner must include a task to convert .docx drafts → PDF and commit under public/briefs/
- Some briefs (#14, #15) are outlines — include them with available content; pdfUrl populated once PDF is committed

### Claude's Discretion
- Exact GoogleAnalytics component structure and script strategy (afterInteractive vs lazyOnload)
- Specific icon library or SVG approach for audience CTA icons
- Secondary link styling within CTA cards
- CSS/Tailwind specifics for the light grey section background

</decisions>

<specifics>
## Specific Ideas

- The audience CTA section is meant to make policymakers, healthcare workers, and the public feel immediately seen — not generic "learn more" links
- Rwanda infographics are specific to Fleming Fund Rwanda work — they belong contextually on the relevant brief pages, not as generic site imagery
- GA4 event helpers are a shared utility — structured so Phase 10/11 can just call the function without wiring up gtag themselves

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-content-and-analytics*
*Context gathered: 2026-04-28*
