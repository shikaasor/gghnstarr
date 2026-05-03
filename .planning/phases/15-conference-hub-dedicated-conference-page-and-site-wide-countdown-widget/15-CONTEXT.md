# Phase 15: Conference Hub - Context

**Gathered:** 2026-05-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a site-wide sticky banner widget and a dedicated `/conference` gateway page for the 5th High-Level Inter-Ministerial Meeting on AMR — Abuja, June 28, 2026. The widget appears on every page to drive awareness. The page acts as a teaser that routes visitors to the official conference site. Both components auto-update after the conference date passes.

</domain>

<decisions>
## Implementation Decisions

### Site-wide widget — form and placement
- Sticky top bar pinned above the header on every page
- Background: deep red / crimson — high contrast, urgency signal distinct from the green/gold palette
- Content: event name + date + location | days countdown | "Register Now" button | dismiss (X)
- Days-only countdown (no hours/minutes) — cleaner in the slim bar
- Mobile: same bar, event name text truncated on small screens

### Widget — interactivity
- "Register Now" links to the external official conference site (https://www.5thhighlevelministerialng.com/)
- Dismiss (X) is session-only — bar returns on next browser session (no localStorage persistence)
- CTA button has a subtle CSS pulse animation to draw the eye
- Bar is hidden on the /conference page itself (user is already there — no redundancy)

### Conference page — structure
- Purpose: gateway / teaser, not a duplicate of the official site
- Sections (in order):
  1. Hero — large countdown (days) + event name + date + location + "Register Now" primary CTA
  2. About the conference — 2-3 sentence overview of the meeting's significance
  3. Key themes / agenda highlights — icons or bullets for main topics
- Primary CTA throughout: Register on the official site (external link, new tab)
- Content for "about" and "themes" sections: researcher agent should extract from https://www.5thhighlevelministerialng.com/
- No GGHN STARR involvement section (gateway only)

### Post-conference state (after June 28, 2026)
- Sticky bar: auto-hides permanently once the conference date passes — no manual removal needed
- /conference page: becomes an archive page — hero updates to "Conference held June 28", countdown is replaced with a summary note, all other sections remain for reference

### Claude's Discretion
- Exact crimson hex value (should be vivid, not dark — e.g. #DC2626 or similar)
- Hero countdown display format on the /conference page (days vs D:H:M:S — whatever reads best at full width)
- Exact truncation breakpoint for bar text on mobile
- Archive page copy for the post-conference state

</decisions>

<specifics>
## Specific Ideas

- Official conference website: https://www.5thhighlevelministerialng.com/ — researcher should scrape for about text, key themes, and any agenda highlights to populate the page content
- "Register Now" is the chosen CTA label — use it consistently in both bar and page hero

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 15-conference-hub-dedicated-conference-page-and-site-wide-countdown-widget*
*Context gathered: 2026-05-03*
