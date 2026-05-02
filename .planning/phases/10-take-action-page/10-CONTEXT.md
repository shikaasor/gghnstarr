# Phase 10: Take Action Page - Context

**Gathered:** 2026-05-02
**Status:** Ready for planning

<domain>
## Phase Boundary

A single `/take-action` page delivering three action paths: a public pledge form, a prescribing commitment form for healthcare workers, and downloadable advocacy toolkit assets. This phase builds the page, wires up form submission (configurable backend), and delivers the toolkit download infrastructure. Creating new form backends or extending other pages is out of scope.

</domain>

<decisions>
## Implementation Decisions

### Page layout
- Two form cards (Pledge + Prescribing Commitment) displayed side-by-side in a card grid — NOT tabs, NOT a vertical scroll
- Forms grouped as a visual block at the top; Advocacy Toolkit is a separate full-width section below
- Cards show a summary (title + description) by default; clicking opens/expands the form inline
- On mobile: cards stack vertically (full-width), toolkit remains full-width below
- Default state on page load (no deep link): Pledge card is pre-expanded

### Form success states
- On successful submission: card collapses back to summary view + a brief toast/notification appears at the top of the page
- Success message tone: affirming and cause-focused — ties submission back to the AMR mission (e.g. "Your pledge contributes to the fight against AMR in Africa")
- After successful submission: card is locked — cannot be re-opened or re-submitted in the same session
- On submission error: inline error message below the submit button, form stays open

### Form backend — IMPORTANT CHANGE FROM ROADMAP
- **Formspree is NOT being used.** All forms use a configurable backend:
  - Option A: Google Sheets integration (via Google Apps Script webhook — same pattern as newsletter signup)
  - Option B: Postgres DB (requires server-side endpoint — API route or separate service)
- A configuration YAML file determines which backend is active based on deployment environment
- This applies to ALL forms on the site (pledge form, prescribing commitment form)
- **Architecture note for researcher:** The static Next.js export constraint means Postgres requires a server-side API route or external service. Research must address how this works within the static export setup (or propose breaking out from static for form endpoints only)

### Advocacy toolkit
- Assets displayed as a download card grid (3-column desktop, stacks on mobile)
- Each card shows: title + short description + format label (e.g. [PDF])
- Section has an introductory heading + 1-2 sentence blurb explaining what the toolkit is for, above the cards
- Real asset files will be provided by the user — plan should set up the infrastructure (public/toolkit/ directory, DownloadCard component, download link wiring) ready to receive the files
- Minimum 3 assets: fact sheet, letter template, social media card

### Section targeting & CTAs
- Deep links from AudienceCTAs homepage section should scroll to AND auto-expand the correct card:
  - Minister CTA → `/take-action#pledge` → Pledge card auto-expands
  - Healthcare worker CTA → `/take-action#commitment` → Commitment card auto-expands
- Header nav: Add "Take Action" link rendered as a button (filled, AMR gold or green) — visually distinguished from plain nav links

### Claude's Discretion
- Exact card expand/collapse animation (accordion vs smooth height transition)
- Toast notification positioning and duration
- Session lock implementation (sessionStorage or in-component state)
- Exact spacing, typography, and icon choices within cards
- How to handle hash-based auto-expand on initial page load (URL hash detection)

</decisions>

<specifics>
## Specific Ideas

- "Take Action" in the Header nav should be a button, not a plain link — stands out as a primary CTA
- Deep links should both scroll AND auto-open the target form card (not just scroll to section)
- The two form cards should feel like they're part of the same visual block, with the toolkit as a clearly separate resource section below

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-take-action-page*
*Context gathered: 2026-05-02*
