---
phase: 02-homepage-and-design-system
plan: "02"
subsystem: ui
tags: [nextjs, typescript, react, lucide-react, tailwind, server-component, client-component]

# Dependency graph
requires:
  - phase: 02-homepage-and-design-system
    provides: app/page.tsx orchestrator with forward-referenced imports, SiteContent.stats typed array, getSiteContent()

provides:
  - HeroSection Server Component with min-h-screen white hero, teal headline, CTA to /briefs
  - ConferenceBadge 'use client' component with null-initialized countdown and 60s update interval
  - StatStrip 'use client' component with 4s auto-rotation through AMR statistics
  - ThreePillars Server Component with Dna/TrendingUp/Globe icons, responsive 3-col grid

affects:
  - 02-03-featured-brief-partners-newsletter
  - 02-04-design-tokens

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Null-initialized client state for SSR/hydration safety (daysLeft starts as null, not 0)
    - useEffect with setInterval + cleanup for recurring client-side timers
    - Server Component + Client Component composition (HeroSection wraps ConferenceBadge)
    - as const on pillars array to preserve literal types with mapped component rendering

key-files:
  created:
    - app/components/sections/HeroSection.tsx
    - app/components/sections/ConferenceBadge.tsx
    - app/components/sections/StatStrip.tsx
    - app/components/sections/ThreePillars.tsx
  modified: []

key-decisions:
  - "ConferenceBadge initializes daysLeft to null (not 0) — server renders static fallback text, client hydrates with computed countdown"
  - "StatStrip interval fires every 4000ms; dependency array is [stats.length] not [stats] — avoids reset on every re-render"
  - "ThreePillars has no description text under pillar titles — locked decision from plan"
  - "HeroSection has no Container wrapper — full-width section with its own padding/centering"

patterns-established:
  - "Hydration-safe timer pattern: null initial state + useEffect sets value on mount"
  - "Server Component wrapping Client Component: HeroSection (server) imports ConferenceBadge (client)"

requirements-completed:
  - HOME-01
  - HOME-02

# Metrics
duration: 4min
completed: 2026-03-30
---

# Phase 2 Plan 02: Hero, Stats Strip, and Three Pillars Summary

**Four homepage section components: full-viewport hero with live conference countdown, auto-rotating AMR stats strip, and responsive three-pillar icon grid using null-safe hydration patterns**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-30T16:18:50Z
- **Completed:** 2026-03-30T16:23:16Z
- **Tasks:** 2
- **Files modified:** 4 (all created)

## Accomplishments
- Built ConferenceBadge with hydration-safe null initial state — server renders static text, client computes live countdown after mount
- Built HeroSection as a Server Component wrapping ConferenceBadge, with min-h-screen white background, teal serif headline, and CTA button linking to /briefs
- Built StatStrip with 4-second auto-rotation through AMR statistics using setInterval with proper cleanup
- Built ThreePillars with Dna, TrendingUp, Globe icons in a responsive grid (1 column on mobile, 3 columns on desktop) with no description text

## Task Commits

Each task was committed atomically:

1. **Task 1: Build HeroSection and ConferenceBadge** - `6459f1e` (feat)
2. **Task 2: Build StatStrip and ThreePillars** - `d806c97` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified
- `app/components/sections/ConferenceBadge.tsx` - 'use client' countdown badge; null initial state; 60s refresh interval; static fallback when null
- `app/components/sections/HeroSection.tsx` - Server Component; min-h-screen; teal h1; ArrowRight CTA to /briefs
- `app/components/sections/StatStrip.tsx` - 'use client'; 4s setInterval rotation; bg-slate-100 strip; large serif value display
- `app/components/sections/ThreePillars.tsx` - Server Component; grid-cols-1 md:grid-cols-3; Dna/TrendingUp/Globe icons; titles only

## Decisions Made
- `daysLeft` initialized to `null` rather than `0` — server and initial client render show static text, preventing hydration mismatch from date computation differences
- StatStrip dependency array uses `[stats.length]` not `[stats]` — prevents interval reset on object identity changes while still responding to actual array length changes
- HeroSection has no Container wrapper per plan spec — the section uses its own padding and centering for full-width control

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - TypeScript check produced exactly the 3 expected "Cannot find module" errors for FeaturedBrief, PartnerLogos, and NewsletterSignup (forward-references from plans 02-03/02-04). Build failure was only due to those same 3 missing files, as anticipated in the verify instructions.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- HeroSection and ConferenceBadge resolve the forward-references from app/page.tsx lines 2-3
- StatStrip and ThreePillars resolve app/page.tsx lines 3-4
- Remaining forward-references in page.tsx (FeaturedBrief, PartnerLogos, NewsletterSignup) will be resolved by plan 02-03
- Once 02-03 completes, the build should succeed end-to-end

---
*Phase: 02-homepage-and-design-system*
*Completed: 2026-03-30*

## Self-Check: PASSED

All files verified present. All task commits verified in git history.
- 6459f1e: feat(02-02): build HeroSection and ConferenceBadge
- d806c97: feat(02-02): build StatStrip and ThreePillars
