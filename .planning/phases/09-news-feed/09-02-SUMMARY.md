---
phase: 09-news-feed
plan: "02"
subsystem: ui
tags: [nextjs, react, typescript, news-feed, server-component, client-component, filtering, pagination]

# Dependency graph
requires:
  - phase: 09-01
    provides: content/news.json with 200 pre-seeded NewsArticle objects from arXiv and PubMed
provides:
  - /news route — Server Component reading content/news.json at build time
  - NewsGrid client component with source filter (All/arXiv/PubMed), date range filter (Last 7 days/Last 30 days/All time), and load-more pagination
  - NewsCard display component rendering all required article fields
  - Header nav updated with /news link in desktop and mobile menus
affects: [10-take-action, 13-accessibility]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component (page.tsx) + Client Component (NewsGrid) data-fetching boundary — fs.readFileSync at build time, useState/filter logic in client
    - Tab-style filter bar with aria-selected/role=tablist — same pattern as EducationGrid
    - Load-more pagination via visibleCount state slice (no external pagination library)
    - Abstract truncation via sentence-boundary regex (matches 2-3 sentences)

key-files:
  created:
    - app/news/page.tsx
    - app/components/news/NewsGrid.tsx
    - app/components/news/NewsCard.tsx
  modified:
    - app/components/layout/Header.tsx

key-decisions:
  - "09-02: NewsCard source displayed as plain text label (no badge/chip) — per user decision at plan time"
  - "09-02: Articles arrive pre-sorted newest-first from news.json — no client-side sort in NewsGrid"
  - "09-02: visibleCount resets to PAGE_SIZE (20) when source or date filter changes — prevents showing stale pages"
  - "09-02: abstract truncation omits element entirely when article.abstract is empty string"

patterns-established:
  - "Server Component reads static JSON via fs.readFileSync at build time, passes typed array to Client Component — pattern for all static-data feed pages"
  - "Tab filter bar with reset-on-filter-change pattern — visibleCount resets to PAGE_SIZE on any filter state change"

requirements-completed: [NEWS-01, NEWS-03, NEWS-04]

# Metrics
duration: ~15min
completed: 2026-05-02
---

# Phase 9 Plan 02: News Feed Frontend Summary

**Filterable /news feed page with Server Component static read, NewsGrid client filters (source + date range), load-more pagination, and updated header nav**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-02T07:30:00Z (approx)
- **Completed:** 2026-05-02T07:56:08Z
- **Tasks:** 3 (including 1 checkpoint)
- **Files modified:** 4

## Accomplishments

- /news page renders 200 AMR article cards from content/news.json read at Next.js build time
- Source filter tabs (All / arXiv / PubMed) and date range filter tabs (Last 7 days / Last 30 days / All time) work correctly with visibleCount reset on filter change
- Load-more button appends 20 articles per click; shows remaining count; hidden when all visible
- Header nav updated with /news link in both desktop and mobile menus
- Human visual verification completed and approved

## Task Commits

Each task was committed atomically:

1. **Task 1: Header nav + NewsCard + /news page.tsx** - `f003c7b` (feat)
2. **Task 2: NewsGrid with source + date filters and load-more** - `c733e22` (feat)
3. **Task 3: Visual verification of complete /news page** - checkpoint approved (no code changes)

## Files Created/Modified

- `app/news/page.tsx` - Server Component; reads content/news.json via fs.readFileSync at build time; renders NewsGrid with articles prop
- `app/components/news/NewsGrid.tsx` - Client Component; source + date range filter tabs; load-more pagination; empty state; aria-accessible tab UI
- `app/components/news/NewsCard.tsx` - Display component; plain source label; title link; authors; publishedDate; journal/category; abstract excerpt with sentence-boundary truncation; "Read article" external link
- `app/components/layout/Header.tsx` - Added `{ href: '/news', label: 'News' }` to navLinks array (between /education and /methodology)

## Decisions Made

- NewsCard source displayed as plain uppercase text (no badge/chip) — per user decision at plan time
- Articles arrive pre-sorted newest-first from news.json scraper — no client-side sort added to NewsGrid
- `visibleCount` resets to `PAGE_SIZE` (20) on any filter change — prevents pagination confusion when switching filters
- Abstract element omitted entirely when `article.abstract` is empty string — clean rendering for articles without abstracts

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /news page is live and fully functional with filtered AMR article feed
- Phase 10 (Take Action) can proceed independently — no dependency on news feed
- Phase 13 (Accessibility) will benefit from the tab filter pattern established here (aria-selected, role=tablist, role=tab)

---
*Phase: 09-news-feed*
*Completed: 2026-05-02*
