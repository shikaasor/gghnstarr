# Phase 2: Homepage & Design System - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the full homepage with all sections and the reusable UI primitives this page establishes for the rest of the site. Scope: hero, stats strip, three pillars, featured brief, partner logos, and newsletter signup. No new pages, no content management UI — just the homepage and its components.

</domain>

<decisions>
## Implementation Decisions

### Hero section
- White background with brand teal for headline text, badge, and CTA button
- Full viewport height (100vh) — dramatic, full-screen opening
- Text-only layout, centered — badge above headline, sub-headline below, CTA button last
- Conference badge is a dynamic countdown timer showing days until June 28, 2026 — needs `'use client'` component for live count
- Badge format: calendar icon + "X days to June 28, 2026" with the Inter-Ministerial Conference name

### Page section order (top to bottom)
1. Hero (100vh)
2. Stats Strip (auto-rotating AMR stat)
3. Three Pillars icon grid
4. Featured Brief
5. Partner Logos
6. Newsletter Signup
7. Footer

### Section backgrounds
- Alternating white / light-grey backgrounds for visual separation — no borders between sections

### Three Pillars
- 3-column layout: icon + bold title only — no description text
- Icons should be simple, symbolic (e.g. DNA/microscope for Genomic Surveillance, chart for Predictive Analytics, globe for One Health Governance)
- On mobile: stacks to single column

### Stats Strip
- Stats data comes from `site.json` (editable by non-developers without code changes)
- Display: auto-rotating single stat — one stat at a time, cycling on a timer
- Each stat: large number + label line (e.g. "700,000 deaths/year — attributed to AMR globally")
- Needs `'use client'` for rotation

### Featured Brief
- Determined by `featured: true` flag on the brief entry in `briefs-index.json` — team manually flags which brief to feature each week
- Displays: title + key messages list (bullet points from `key_messages` field) + prominent "Download PDF" button
- Does NOT show full executive summary — key messages only for scannability

### Partner Logos
- Full colour logos (not grayscale)
- Single horizontal row on desktop
- Logos: GUCGHPI, Fleming Fund, Africa CDC, WHO AFRO

### Newsletter Signup
- Backend: Google Apps Script Web App — accepts POST request, appends row to Google Sheet, sends email notification via Gmail
- Placement: dedicated section near bottom of page, before footer
- Fields: email address only (keep friction low)
- Success state: inline confirmation message replaces the form (no toast, no redirect)
- Error state: Claude's Discretion

### Claude's Discretion
- Exact icon choices for the Three Pillars
- Newsletter error state handling
- Spacing, padding, and typography scale across sections
- Mobile breakpoint behaviour for partner logos row (can wrap or scroll)
- Exact animation/transition duration for stats rotation and countdown display
- CTA button text in hero (requirement says "Read the Latest Policy Brief" — use that unless there's a strong reason not to)

</decisions>

<specifics>
## Specific Ideas

- Countdown timer in badge creates urgency for policymakers — the June 28 deadline is the conference this whole initiative is building toward
- Key messages list (not executive summary) was chosen for scannability — a minister should be able to read the brief's value in 15 seconds
- Google Apps Script chosen over Mailchimp/Formspree to keep subscriber data in a Google Sheet the team already controls
- Stats auto-rotate to give impact without overwhelming the page with numbers all at once

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-homepage-and-design-system*
*Context gathered: 2026-03-28*
