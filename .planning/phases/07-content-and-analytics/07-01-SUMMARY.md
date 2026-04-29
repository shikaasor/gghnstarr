---
phase: 07-content-and-analytics
plan: "01"
subsystem: analytics, ui, types
tags: [nextjs, ga4, google-analytics, next-font, montserrat, inter, typescript, brief-types]

# Dependency graph
requires:
  - phase: 06-brand-rebrand
    provides: Tailwind @theme tokens (teal/navy color palette) used in BriefCard and layout
provides:
  - Updated Brief interface with optional infographicPdfUrl, infographicImageUrl, authorId
  - GA4 GoogleAnalytics pageview component in layout.tsx
  - app/lib/analytics.ts with 5 named event helpers for Phase 7+ components
  - Montserrat + Inter fonts via next/font/google with CSS variables in @theme
  - Conditional BriefCard infographic button (renders only when infographicPdfUrl present)
affects: [07-02, 07-03, 07-04, 07-05, Phase 10, Phase 11]

# Tech tracking
tech-stack:
  added:
    - "@next/third-parties@latest — GoogleAnalytics component and sendGAEvent for GA4"
    - "next/font/google — Montserrat (headings 600/700) + Inter (body 400/500/600)"
  patterns:
    - "GA4 event helpers in analytics.ts imported only from 'use client' components (sendGAEvent is client-side)"
    - "GoogleAnalytics placed outside <body> but inside <html> per Next.js docs pattern"
    - "Conditional rendering pattern: {brief.infographicPdfUrl && <a>} for optional fields"
    - "next/font CSS variables injected on <html> className, consumed via @theme in globals.css"

key-files:
  created:
    - app/lib/analytics.ts
  modified:
    - app/lib/types.ts
    - app/layout.tsx
    - app/globals.css
    - app/components/briefs/BriefCard.tsx

key-decisions:
  - "infographicPdfUrl made optional: Phase 7 real briefs have no infographic PDFs — required for TypeScript build"
  - "infographicImageUrl added as optional field for inline JPEG on brief detail pages (e.g. Rwanda infographic)"
  - "authorId made optional for forward-compatibility with entries that have no explicit author"
  - "trackPledgeSubmit and trackQuizComplete are intentional no-ops — will be implemented in Phase 10 and Phase 11 respectively"
  - "GoogleAnalytics guarded by process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID check to prevent undefined gaId locally"
  - "NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-PLACEHOLDER in .env.local for local rendering test; real ID goes in Vercel dashboard"

patterns-established:
  - "Analytics helpers (analytics.ts): always import from 'use client' boundary — never from Server Components"
  - "Font tokens: next/font sets CSS variables on <html>, @theme consumes via var() with fallbacks"

requirements-completed: [ANAL-01, ANAL-02]

# Metrics
duration: 3min
completed: 2026-04-28
---

# Phase 7 Plan 01: Foundation — Analytics + Type Schema + Typography Summary

**GA4 pageview tracking wired via @next/third-parties GoogleAnalytics, 5 named event helpers in analytics.ts, Brief interface updated for 15 real briefs (optional infographicPdfUrl/authorId), and Montserrat+Inter fonts via next/font/google with CSS variables**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-28T11:34:00Z
- **Completed:** 2026-04-28T11:37:07Z
- **Tasks:** 2
- **Files modified:** 5 (+ package.json, package-lock.json, .env.local)

## Accomplishments
- Brief interface type-safe for 15 real Phase 7 briefs (infographicPdfUrl, authorId now optional; infographicImageUrl added)
- BriefCard conditionally renders infographic download button — no broken link for briefs without infographic PDFs
- GA4 GoogleAnalytics component in layout.tsx provides automatic pageview tracking on every route
- 5 named analytics helpers in analytics.ts ready for Phase 7 component wiring (trackPdfDownload, trackInfographicView, trackNewsletterSignup, trackPledgeSubmit, trackQuizComplete)
- Montserrat (headings) + Inter (body) loaded via next/font/google, CSS variables wired through @theme

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix Brief type schema and conditional BriefCard infographic button** - `7ba2623` (feat)
2. **Task 2: Install @next/third-parties, create analytics helpers, wire GA4 + fonts in layout.tsx** - `82278dd` (feat)

## Files Created/Modified
- `app/lib/types.ts` - Brief interface: infographicPdfUrl optional, infographicImageUrl added optional, authorId optional
- `app/components/briefs/BriefCard.tsx` - Conditional infographic button with adaptive grid layout
- `app/lib/analytics.ts` - NEW: 5 GA4 event helper functions (client-side only)
- `app/layout.tsx` - Montserrat+Inter fonts via next/font/google + GoogleAnalytics component
- `app/globals.css` - @theme --font-sans and --font-serif now reference next/font CSS variables

## Decisions Made
- infographicPdfUrl made optional: Phase 7 real briefs have no infographic PDFs — TypeScript build would fail without this
- infographicImageUrl added as separate optional field for inline JPEG display (separate from PDF download)
- trackPledgeSubmit and trackQuizComplete are intentional no-ops pending Phase 10 and Phase 11
- GoogleAnalytics guarded by env var check so local dev without a real GA4 ID does not error

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — TypeScript passed cleanly after type changes, build completed without errors.

## User Setup Required

**GA4 measurement ID must be set in Vercel dashboard before production deploy.**

The `.env.local` placeholder `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-PLACEHOLDER` allows local testing.
To enable real analytics in production:
1. Create a GA4 property at analytics.google.com
2. Copy the Measurement ID (format: G-XXXXXXXXXX)
3. Add to Vercel: Settings → Environment Variables → `NEXT_PUBLIC_GA4_MEASUREMENT_ID` = your real ID
4. Redeploy

## Next Phase Readiness
- analytics.ts ready for Phase 07-02 (DownloadButton client component wires trackPdfDownload)
- Brief type schema accepts all 15 real briefs without TypeScript errors
- Font tokens in place — all Phase 7 typography work uses Montserrat/Inter via the CSS variables

---
*Phase: 07-content-and-analytics*
*Completed: 2026-04-28*

## Self-Check: PASSED

- app/lib/analytics.ts — FOUND
- app/lib/types.ts — FOUND
- app/layout.tsx — FOUND
- app/globals.css — FOUND
- app/components/briefs/BriefCard.tsx — FOUND
- Commit 7ba2623 — FOUND
- Commit 82278dd — FOUND
