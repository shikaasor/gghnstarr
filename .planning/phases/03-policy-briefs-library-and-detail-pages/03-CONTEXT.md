# Phase 3: Policy Briefs Library & Detail Pages - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

A filterable, browsable library of AMR policy briefs with individual detail pages and PDF/infographic downloads. Non-developer content update workflow is in scope. Building new brief types, a CMS interface, or search are out of scope for this phase.

</domain>

<decisions>
## Implementation Decisions

### Brief Card Design
- Grid layout (2–3 columns), not list
- Large infographic thumbnail occupying the top half of each card
- Text below thumbnail: week number + date, brief title, author name (no key takeaway on the card)
- Two equal-weight download buttons side by side: "Download PDF" and "Download Infographic"
- Cards are clickable to navigate to the detail page

### Filter & Browse UX
- Filter controls in a top bar above the grid (not a sidebar)
- Two filters: Month and Theme (both dropdowns)
- Active filter shown inline in the dropdown control itself (e.g. "Month: March") — no separate chips/tags
- Theme values derived dynamically from brief data — not hardcoded
- Empty state when no briefs match: message + "Clear filters" button

### Brief Detail Page
- Text-first hero: week number, date, title, author name in text; thumbnail is smaller, placed beside the text
- Download buttons (PDF + Infographic) in the hero area only — not repeated lower on page
- Content sections below hero: Executive summary, Key messages (bullet list), Author bio excerpt, Prev/Next brief navigation
- URL structure: `/briefs/03` (week number slug) — already aligned with existing `slug` field in JSON

### Content Update Workflow
- Non-developer adds briefs via a Google Sheet → JSON export approach
- PDF and infographic files are hosted externally (Google Drive / Dropbox) — JSON contains external URLs, no files committed to repo
- Workflow documented in a `CONTENT-GUIDE.md` file at the project root
- Google Apps Script or a simple export step converts Sheet rows to JSON and triggers Vercel rebuild

### Claude's Discretion
- Exact card hover/focus states
- Loading skeleton or spinner while filters apply (client-side filtering is instant, but handle gracefully)
- Prev/next brief navigation placement and styling on detail page
- Exact Google Sheet → JSON export mechanism (could be GAS, could be manual export step — choose simplest)
- Card grid responsive breakpoints (2 cols on tablet, 3 on desktop, 1 on mobile)

</decisions>

<specifics>
## Specific Ideas

- The audience reads on mobile while traveling — card grid should be 1 column on mobile, stacking naturally
- External PDF links (Google Drive / Dropbox) should open in a new tab
- The content guide must be written for a non-technical audience — step-by-step with screenshots or clear instructions

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-policy-briefs-library-and-detail-pages*
*Context gathered: 2026-03-30*
