# Phase 9: News Feed - Context

**Gathered:** 2026-05-02
**Status:** Ready for planning

<domain>
## Phase Boundary

A daily-refreshed feed of recent AMR research articles from arXiv and PubMed, automatically populated by a GitHub Actions cron job writing to content/news.json, displayed on a filterable /news page. Covers two deliverables: the scraper pipeline and the frontend page.

</domain>

<decisions>
## Implementation Decisions

### Article card content
- Show a truncated abstract on each card (first 2-3 sentences, ellipsis) — scannable without clicking through
- Author display: first author + "et al." for multi-author papers (standard academic convention)
- Show journal/venue: journal name for PubMed entries, arXiv category for preprints
- Source label: plain text ("arXiv" / "PubMed"), not a coloured badge

### Feed volume & freshness
- Scraper pulls last 7 days rolling on each daily run — catches missed articles and handles API downtime gracefully
- Cap news.json at 200 most recent articles — predictable file size, avoids build slowdown
- Deduplicate by title/DOI: if the same paper appears in both arXiv and PubMed, keep the PubMed entry

### Search query design
- Narrow scope: core AMR terms only — "antimicrobial resistance", "antibiotic resistance", "AMR"
- Global coverage: no geographic filter — full research pool including WHO/Lancet output
- Deduplication: title/DOI match removes cross-source duplicates, preferring PubMed entry

### Browsing & navigation
- Pagination: "Load more" button — show 20 articles initially, append next 20 on each click
- Filters: source filter (arXiv / PubMed) as scoped, PLUS a date range filter (Last 7 days / Last 30 days / All time)
- Launch state: ship with a pre-seeded news.json (~20-30 real recent AMR articles) so the page is never empty on launch

### Claude's Discretion
- Exact arXiv API query syntax and PubMed E-utilities endpoint construction
- Deduplication algorithm implementation details (exact string matching vs normalised DOI lookup)
- Error handling when API calls fail (silent fallback to existing news.json is fine)
- Card hover/interaction styling beyond the described content

</decisions>

<specifics>
## Specific Ideas

- Pre-seeded news.json should contain real recent AMR articles (not placeholder data) so the feed looks credible on launch day
- Date range filter ties into the "7-day rolling" scrape window — "Last 7 days" will always have fresh content

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-news-feed*
*Context gathered: 2026-05-02*
