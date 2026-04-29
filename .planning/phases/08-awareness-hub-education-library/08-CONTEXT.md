# Phase 8: Awareness Hub & Education Library - Context

**Gathered:** 2026-04-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Two new public-facing content pages:
- `/awareness` — displays 3 Fleming Fund Rwanda infographic JPEGs with captions, accordion explainer articles, and fact sheet downloads linked within the explainers
- `/education` — audience-filtered grid of education resource cards (Policymaker / Healthcare Worker / General Public) linking to real external resources

Creating or uploading new content, social sharing, and analytics event tracking are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Infographic Display (/awareness)
- 3-column responsive grid layout for the 3 Fleming Fund Rwanda JPEGs
- Clicking an infographic opens a lightbox/enlarged view
- Each image shows: title + short description underneath
- No download buttons on /awareness — images are view-only; downloads handled on /briefs detail pages

### Explainer Article Sections (/awareness)
- Accordion (expandable/collapsible) sections — collapsed by default, users expand to read
- 3 topics: "What is AMR", "Why Africa", "What You Can Do"
- Real content — proper 2-3 paragraph text per topic (not placeholders)
- Relevant fact sheets are linked as downloadable resources inside each accordion section

### Education Filter UX (/education)
- Tab bar filter: All | Policymaker | Healthcare Worker | General Public
- Default state: "All" tab active — all resources visible on arrival (no audience-selection prompt)
- Initial content: 12+ resource cards (4+ per audience)
- Content source: curated real external links (WHO, Africa CDC, PubMed, etc.) — not internal assets

### Resource Card Design (/education)
- Each card shows: title, audience tag(s), format label (with icon), source/organization
- Format labels use icon + text: document icon for Article, download arrow for Download, play button for Video
- A card can be tagged with multiple audience types — it appears under all matching filter tabs
- Clicking a card opens the external resource in a new tab (all types: Article, Download, Video)

### Claude's Discretion
- Lightbox implementation (library vs custom — choose what fits the existing Next.js static export)
- Exact AMR content text for the 3 explainer topics
- Specific WHO/CDC/etc. URLs to curate for the 12+ education resources (research and select appropriate ones)
- Grid responsiveness breakpoints (2-col on tablet, 1-col on mobile)
- Accordion open/close animation

</decisions>

<specifics>
## Specific Ideas

- The audience tab filter should match the visual style of the briefs library theme filter (pill/tab style already established in the codebase)
- /awareness infographic grid and /education card grid should feel like sibling pages — consistent card aesthetic
- Education resource sourcing: prioritize WHO AFRO, Africa CDC, Fleming Fund, and PubMed AMR resources for credibility with policymakers

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-awareness-hub-education-library*
*Context gathered: 2026-04-29*
