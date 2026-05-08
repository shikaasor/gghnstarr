# Phase 16: Education Redesign - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Rebuild the /education page — split content into Training vs Resources tabs, add multi-dimensional filtering with pagination, introduce publications/articles as a Resource format type, and add verifiable source citations on every card. This replaces the Phase 8 education page entirely.

</domain>

<decisions>
## Implementation Decisions

### Training vs Resources split
- Two tabs on one /education page — single URL, not separate pages
- Tab state stored in URL hash: `#training` and `#resources` — shareable and bookmarkable
- Default tab when no hash: Training
- **Training** = structured learning you complete: online courses (external links), webinars/recorded sessions, workshop materials/slides, certification programs
- **Resources** = everything else (articles, publications, downloads, reference materials)

### Archive & filtering
- Four filter dimensions, applied to each tab independently:
  1. Audience type (Policymaker / Healthcare Worker / General Public)
  2. Format / content type (Course, Webinar, Article, Download, Video, Publication)
  3. Topic / theme (AMR surveillance, stewardship, governance, One Health, etc.)
  4. Date / recency (sort or filter by year)
- Filter combination logic: AND within a category (selecting two topics shows items matching either topic), AND across categories (must also match the audience filter) — most intuitive behavior
- Browsing pattern: **Pagination** — not load-more or infinite scroll
- Page size: Claude's discretion (12 items per page is reasonable)

### Publications & articles
- Publications live **inside the Resources tab**, filtered by format type (no separate tab or subsection)
- Publication card metadata: title + authors, journal/publisher + year, DOI or external link
- No abstract excerpt needed
- Hosting: **mix** — external link when source is publicly accessible; hosted PDF in `public/` when not publicly available
- Each publication card should visually distinguish itself from other resource types (badge or format label)

### Verifiable references
- Source citation appears **on each resource/publication card**
- Verified = source organization + year + working external link (e.g. "WHO, 2023" with a live URL)
- Items without a confirmed source/link are shown with a visible **"Source unverified"** flag — not excluded
- No full bibliographic reference section at the bottom of the page

### Claude's Discretion
- Exact filter UI pattern (pill chips, dropdowns, or sidebar)
- Card layout and visual design within the established site design system
- Pagination control design (prev/next, numbered pages)
- How the "Source unverified" flag is styled
- Topic/theme taxonomy (derive from existing content)

</decisions>

<specifics>
## Specific Ideas

- The existing Phase 8 /education page had 12 hardcoded resources in a Server Component filtered by audience. Phase 16 replaces this entirely — the content should move to a JSON/data file so it can grow without code changes.
- Training items link out to external platforms (WHO Academy, Coursera, etc.) — none are hosted on the site except workshop material PDFs.
- The "verifiable" requirement comes from the site's credibility positioning for African health policymakers — they need to be able to trace claims back to authoritative sources (WHO, CDC, peer-reviewed journals).

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 16-education-redesign-archive-with-filters-training-vs-resources-split-publications-and-verifiable-references*
*Context gathered: 2026-05-06*
