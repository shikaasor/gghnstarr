---
phase: 06-brand-rebrand
plan: 02
subsystem: ui
tags: [next/image, branding, logo, header, footer, tailwind]

# Dependency graph
requires:
  - phase: 06-01
    provides: AMR brand palette tokens applied to globals.css (teal/navy hex values)
provides:
  - AMR logo JPEG served at /amr-logo.jpeg from public/
  - Header.tsx displays AMR logo via next/image with priority and mixBlendMode multiply
  - Footer.tsx displays AMR logo via next/image with mixBlendMode multiply
  - Text wordmark "GGHN STARR" removed from all layout components
affects:
  - 06-03
  - any phase modifying Header.tsx or Footer.tsx

# Tech tracking
tech-stack:
  added: [next/image (already in Next.js, now used for logo)]
  patterns: [mixBlendMode multiply for JPEG logos on dark backgrounds, priority flag for above-fold images]

key-files:
  created:
    - public/amr-logo.jpeg
  modified:
    - app/components/layout/Header.tsx
    - app/components/layout/Footer.tsx

key-decisions:
  - "Used mixBlendMode multiply inline style to eliminate white JPEG background on dark navy header"
  - "Header logo 160x64 with priority flag for LCP optimization; Footer logo 140x56 (secondary branding)"

patterns-established:
  - "Logo-on-dark-bg: use style={{ mixBlendMode: 'multiply' }} to avoid white box artifact from JPEG"
  - "next/image priority prop on above-fold branding images to prevent LCP penalty"

requirements-completed: [BRAND-01]

# Metrics
duration: 8min
completed: 2026-04-28
---

# Phase 6 Plan 02: AMR Logo in Header and Footer Summary

**AMR logo JPEG placed in public/ and rendered via next/image in Header and Footer, replacing the GGHN STARR text wordmark, using mixBlendMode multiply to eliminate the white JPEG box on the dark navy background.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-28T18:05:00Z
- **Completed:** 2026-04-28T18:13:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Copied AMR Logo_Feb2026.jpeg to public/amr-logo.jpeg (46KB) — now served by Next.js static export
- Header.tsx: text link wordmark replaced with next/image at 160x64, priority flag set, mixBlendMode multiply applied
- Footer.tsx: text paragraph wordmark replaced with next/image at 140x56, mixBlendMode multiply applied
- "GGHN STARR" text removed from both layout components; next build exits 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Copy AMR logo to public/** - `10312ef` (chore)
2. **Task 2: Update Header and Footer to display the AMR logo** - `b9862e6` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `public/amr-logo.jpeg` - AMR Logo_Feb2026.jpeg copied from resources/, served by Next.js at /amr-logo.jpeg
- `app/components/layout/Header.tsx` - Imports next/image; text wordmark replaced with Image at 160x64 with priority and mixBlendMode multiply
- `app/components/layout/Footer.tsx` - Imports next/image; text paragraph replaced with Image at 140x56 with mixBlendMode multiply

## Decisions Made
- `mixBlendMode: 'multiply'` inline style selected over CSS filter or background-removal: zero dependencies, no preprocessing, works correctly on CSS dark backgrounds
- Header logo sized 160x64 (larger, primary brand placement); Footer logo 140x56 (smaller, secondary position)
- `priority` on Header logo only — footer is below fold, not an LCP candidate

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- AMR logo now appears in header and footer on every page of the site
- BRAND-01 requirement satisfied
- 06-03 (final plan of Phase 6) can proceed immediately
- Both layout components are clean — no legacy GGHN STARR text remains

---
*Phase: 06-brand-rebrand*
*Completed: 2026-04-28*
