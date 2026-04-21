---
phase: 03-policy-briefs-library-and-detail-pages
plan: 02
subsystem: ui
tags: [nextjs, typescript, static-generation, app-router, tailwind]

# Dependency graph
requires:
  - phase: 03-01-policy-briefs-library-and-detail-pages
    provides: BriefGrid library page at /briefs with filter state
  - phase: 01-02-content-data-layer
    provides: getAllBriefs, getBriefBySlug, getExperts content functions
provides:
  - Static detail page for each brief at /briefs/[slug]
  - generateStaticParams enumerating all 3 seed slugs
  - generateMetadata with per-brief title and description
  - Prev/Next navigation between briefs
affects: [03-03-content-guide, phase-05-seo-og-tags]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js 16 async params: Promise<{slug:string}> awaited in both generateMetadata and page component"
    - "notFound() called immediately after null guard on getBriefBySlug result"
    - "generateStaticParams returns briefs.map(b => ({slug: b.slug})) for static export enumeration"

key-files:
  created:
    - app/briefs/[slug]/page.tsx
  modified: []

key-decisions:
  - "params typed as Promise<{slug:string}> and awaited — Next.js 16 App Router async params pattern"
  - "Download buttons placed in hero area only — not repeated in body sections"
  - "Author bio truncated to 200 characters with ellipsis — full bio reserved for Phase 4 experts page"
  - "Prev/Next navigation computed from getAllBriefs() sorted ascending — no separate API call"

patterns-established:
  - "Dynamic route pages: always export generateStaticParams for output:export compatibility"
  - "Hero layout pattern: flex-col md:flex-row with text flex-1 and thumbnail md:w-64"

requirements-completed: [BDET-01]

# Metrics
duration: 4min
completed: 2026-04-01
---

# Phase 03 Plan 02: Brief Detail Page Summary

**Static Next.js 16 detail page at /briefs/[slug] with generateStaticParams, async params, prev/next navigation, and download buttons in a text-first hero layout**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-01T06:51:08Z
- **Completed:** 2026-04-01T06:55:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Single file `app/briefs/[slug]/page.tsx` delivers full brief detail with hero, content sections, and navigation
- `generateStaticParams` enumerates all 3 seed slugs so `npm run build` produces static HTML for each
- `notFound()` correctly handles invalid slugs at the 404 boundary
- Prev/Next navigation links computed from sorted brief array — week-01 has no prev, week-03 has no next

## Task Commits

Each task was committed atomically:

1. **Task 1: Create directory and build brief detail page** - `8c71a8c` (feat)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified
- `app/briefs/[slug]/page.tsx` — Dynamic route page with generateStaticParams, generateMetadata, BriefDetailPage component; hero layout, content sections, prev/next nav

## Decisions Made
- `params: Promise<{ slug: string }>` and `await params` used in both `generateMetadata` and `BriefDetailPage` — Next.js 16 App Router pattern; synchronous destructuring would cause a build error
- Download buttons in hero area only — plan locked decision honored
- Author bio excerpt capped at 200 characters — full bio belongs on the dedicated experts page (Phase 4)
- Used HTML entities (`&larr;`, `&rarr;`) for arrow characters instead of unicode literals to avoid encoding issues

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 3 brief detail pages render at their full slug URLs
- `generateStaticParams` is in place; adding new briefs to briefs-index.json will automatically produce new static pages at build time
- Phase 5 can layer OG image metadata on top of the existing `generateMetadata` function
- Phase 4 experts page can link to `/briefs/[slug]` for each brief a given expert authored

---
*Phase: 03-policy-briefs-library-and-detail-pages*
*Completed: 2026-04-01*

## Self-Check: PASSED

- FOUND: app/briefs/[slug]/page.tsx
- FOUND commit: 8c71a8c
- Build output confirmed 3 static routes for /briefs/[slug]
- TypeScript check passed (npx tsc --noEmit returned no errors)
