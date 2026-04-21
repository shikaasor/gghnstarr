---
phase: 02-homepage-and-design-system
plan: "01"
subsystem: ui
tags: [nextjs, typescript, json, content-layer, server-component]

# Dependency graph
requires:
  - phase: 01-foundation-and-infrastructure
    provides: app/lib/types.ts, app/lib/content.ts, content/ directory structure established
provides:
  - Brief interface with optional featured flag
  - SiteContent interface with typed stats array
  - getFeaturedBrief() content function
  - app/page.tsx Server Component orchestrator wiring all 6 section imports
  - AMR stats seed data (3 entries) in site.json
  - Featured brief seed data (week-03) in briefs-index.json
affects:
  - 02-02-hero-stat-strip-three-pillars
  - 02-03-featured-brief-partners-newsletter
  - 02-04-design-tokens

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component data reads at build time via getSiteContent() / getFeaturedBrief()
    - JSON content files as the single source of truth for site data
    - Optional interface fields for sparse data (featured flag on one brief only)

key-files:
  created: []
  modified:
    - content/briefs-index.json
    - content/site.json
    - app/lib/types.ts
    - app/lib/content.ts
    - app/page.tsx

key-decisions:
  - "featured field on Brief is optional boolean — only week-03 carries it; others have it undefined"
  - "stats array added to SiteContent interface — typed as Array<{value: string; label: string;}>"
  - "app/page.tsx forward-references section component files that plans 02-02 and 02-03 will create"
  - "No 'use client' in page.tsx — pure Server Component reading data at build time"

patterns-established:
  - "Homepage orchestrator pattern: page.tsx reads all data once and passes via props to section components"
  - "Forward-referenced imports are intentional placeholders until section plans execute"

requirements-completed:
  - HOME-01
  - HOME-02

# Metrics
duration: 3min
completed: 2026-03-30
---

# Phase 2 Plan 01: Content Schema and Homepage Orchestrator Summary

**Patched JSON data schemas with AMR stats and featured brief flag, extended TypeScript interfaces, added getFeaturedBrief(), and wired app/page.tsx as the Server Component orchestrator for all 6 homepage sections**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-30T16:10:02Z
- **Completed:** 2026-03-30T16:13:27Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Added `featured: true` to week-03 brief and a 3-entry AMR stats array to site.json — the two data gaps blocking section components
- Extended Brief and SiteContent TypeScript interfaces cleanly; added getFeaturedBrief() export to content.ts
- Replaced page.tsx placeholder with a Server Component that reads site data and renders 6 forward-referenced section imports in the correct order

## Task Commits

Each task was committed atomically:

1. **Task 1: Patch JSON schemas — add featured flag and stats array** - `e1d2749` (feat)
2. **Task 2: Update TypeScript interfaces and add getFeaturedBrief()** - `c9e5ada` (feat)
3. **Task 3: Wire app/page.tsx as homepage orchestrator** - `daf9d24` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified
- `content/briefs-index.json` - Added `featured: true` to week-03 entry
- `content/site.json` - Added `stats` array with 3 AMR stat objects
- `app/lib/types.ts` - Added `featured?: boolean` to Brief; added `stats` array to SiteContent
- `app/lib/content.ts` - Added exported `getFeaturedBrief()` function
- `app/page.tsx` - Replaced placeholder with Server Component orchestrator for all 6 sections

## Decisions Made
- `featured` is optional on Brief (not required) — sparse flag; most briefs will have it undefined
- `stats` typed as `Array<{ value: string; label: string; }>` — inline type sufficient, no separate interface needed
- page.tsx forward-references section files that do not exist yet — TypeScript "Cannot find module" errors are expected and intentional; resolved by plans 02-02 and 02-03

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - TypeScript verification produced exactly the 6 expected "Cannot find module" errors for forward-referenced section components, and no data type errors.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Data layer complete: briefs-index.json, site.json, types.ts, and content.ts are ready for section components
- page.tsx orchestrator is wired — plans 02-02 and 02-03 only need to create the section files; the imports are already in place
- getFeaturedBrief() tested and working: returns week-03-predictive-analytics-amr-burden

---
*Phase: 02-homepage-and-design-system*
*Completed: 2026-03-30*

## Self-Check: PASSED

All files verified present. All task commits verified in git history.
- e1d2749: feat(02-01): patch JSON schemas — add featured flag and stats array
- c9e5ada: feat(02-01): update TypeScript interfaces and add getFeaturedBrief()
- daf9d24: feat(02-01): wire app/page.tsx as homepage Server Component orchestrator
