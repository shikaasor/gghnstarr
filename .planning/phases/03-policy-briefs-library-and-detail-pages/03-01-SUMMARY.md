---
phase: 03-policy-briefs-library-and-detail-pages
plan: 01
subsystem: ui
tags: [react, nextjs, tailwind, typescript, filtering]

# Dependency graph
requires:
  - phase: 01-foundation-and-infrastructure
    provides: types.ts (Brief/Expert interfaces), content.ts (getAllBriefs/getExperts), layout components
  - phase: 02-homepage-and-design-system
    provides: Container component, nav/footer shell, Tailwind v4 design tokens
provides:
  - BriefCard presentational component (thumbnail-top, download buttons, slug link)
  - BriefGrid client component with month/theme filter state and responsive grid
  - /briefs route as Server Component reading content at build time
  - Placeholder thumbnail images for 3 seeded briefs
affects:
  - 03-02 (brief detail pages link FROM /briefs/[slug] cards built here)
  - 03-03 (content guide references BriefCard/BriefGrid as canonical display components)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component reads data at build time, passes serialized arrays to client component as props
    - 'use client' component owns all filter state — never calls fs-using functions
    - useMemo for derived filter options (months, themes) and filtered results
    - flatMap+Set pattern for unique theme derivation from multi-value arrays

key-files:
  created:
    - app/components/briefs/BriefCard.tsx
    - app/components/briefs/BriefGrid.tsx
    - public/images/thumbnails/week-01-amr-governance-frameworks.jpg
    - public/images/thumbnails/week-02-laboratory-systems-capacity.jpg
    - public/images/thumbnails/week-03-predictive-analytics-amr-burden.jpg
  modified:
    - app/briefs/page.tsx

key-decisions:
  - "BriefCard has no 'use client' — purely presentational Server Component (no interactivity needed)"
  - "BriefGrid owns all filter state — getAllBriefs()/getExperts() only called in Server Component page.tsx"
  - "Theme filtering uses b.themes.includes(themeFilter) not equality — briefs have multiple themes"
  - "Download buttons use target=_blank without download attribute — external URLs cannot be force-downloaded cross-origin"
  - "Placeholder thumbnails copied from existing image — real thumbnails uploaded by content editors"

patterns-established:
  - "Server/client split for data+filter pages: Server Component reads data, client component handles interactivity"
  - "Month label derivation: toLocaleString('en-US', { month: 'long', year: 'numeric' }) for consistent display and filtering"

requirements-completed: [BREF-01, BREF-02, BREF-03, BREF-04]

# Metrics
duration: 2min
completed: 2026-04-01
---

# Phase 3 Plan 01: Policy Briefs Library Summary

**Filterable /briefs grid with BriefCard (thumbnail+downloads) and BriefGrid (month/theme filter state) backed by Server Component data reads at build time**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-01T06:46:51Z
- **Completed:** 2026-04-01T06:49:05Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- BriefCard component renders thumbnail, week/date tag, title link to detail page, author name, and two equal-weight download buttons (PDF + Infographic) with target="_blank"
- BriefGrid client component derives Month and Theme filter options dynamically from brief data, filters via useMemo, shows empty state with Clear filters button
- /briefs page.tsx replaced stub with full Server Component that reads briefs and experts at build time and passes to BriefGrid — `npm run build` succeeds with /briefs statically prerendered

## Task Commits

Each task was committed atomically:

1. **Task 1: Create placeholder thumbnails and BriefCard component** - `0af5955` (feat)
2. **Task 2: Build BriefGrid client component with filter bar** - `92bd4c0` (feat)
3. **Task 3: Replace briefs page stub with Server Component orchestrator** - `9001ccb` (feat)

## Files Created/Modified
- `app/components/briefs/BriefCard.tsx` - Presentational card: thumbnail at top, week/date, title, author, two download buttons
- `app/components/briefs/BriefGrid.tsx` - Client component: filter dropdowns, memoized filtering, responsive grid, empty state
- `app/briefs/page.tsx` - Server Component: reads data at build time, passes to BriefGrid inside Container
- `public/images/thumbnails/week-01-amr-governance-frameworks.jpg` - Placeholder thumbnail for brief 1
- `public/images/thumbnails/week-02-laboratory-systems-capacity.jpg` - Placeholder thumbnail for brief 2
- `public/images/thumbnails/week-03-predictive-analytics-amr-burden.jpg` - Placeholder thumbnail for brief 3

## Decisions Made
- BriefCard is a Server Component (no 'use client') — no client-side interactivity needed on the card itself
- BriefGrid owns all filter state and never calls fs-using content functions — clean server/client boundary
- Theme filtering uses `b.themes.includes(themeFilter)` because briefs carry multiple themes arrays, not single values
- No `download` attribute on external PDF links — cross-origin resources cannot be force-downloaded
- Thumbnails seeded as copies of existing image — content editors will replace with real thumbnails

## Deviations from Plan

None - plan executed exactly as written. BriefCard.tsx was pre-created (found in untracked files); content matched plan spec exactly, so it was committed as Task 1.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- /briefs route is live and fully functional with 3 seeded brief cards, filter controls, and download buttons
- BriefCard links to /briefs/[slug] — Plan 02 (detail pages) must be built for those links to resolve
- BriefGrid filter options populate from real content data — adding new briefs to briefs-index.json automatically appears in dropdowns

---
*Phase: 03-policy-briefs-library-and-detail-pages*
*Completed: 2026-04-01*
