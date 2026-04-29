---
phase: 07-content-and-analytics
plan: "03"
subsystem: ui
tags: [react, nextjs, lucide-react, tailwindcss, audience-segmentation]

# Dependency graph
requires:
  - phase: 07-01
    provides: font wiring and TypeScript schema fixes that this component builds on
provides:
  - AudienceCTAs section component — 3 audience cards (ministers, HCW, public) on homepage
  - Homepage section order: HeroSection → AudienceCTAs → StatStrip → ThreePillars → FeaturedBrief → PartnerLogos → NewsletterSignup
affects:
  - phase-08-awareness-hub
  - phase-10-take-action

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Disabled future-page links use href='#' with aria-disabled=true and text-slate-400 cursor-not-allowed styling"
    - "Server Component pattern — no 'use client' directive for static link sections"
    - "AudienceCard data array with primaryLive/secondaryLinks.live booleans to toggle rendered element type"

key-files:
  created:
    - app/components/sections/AudienceCTAs.tsx
  modified:
    - app/page.tsx

key-decisions:
  - "Disabled future-page primary CTAs render as <span> (not <Link>) to prevent navigation — cleaner semantics than pointer-events-none on Link"
  - "Section uses bg-slate-100 to match NewsletterSignup — creating visual bookends on the homepage"

patterns-established:
  - "AudienceCard interface: icon, headline, subtext, primaryLabel/Href/Live, secondaryLinks[] — reusable pattern for audience-segmented content"

requirements-completed:
  - HOME-01

# Metrics
duration: 6min
completed: 2026-04-29
---

# Phase 7 Plan 03: Audience CTAs Summary

**Three audience-segmented CTA cards (Landmark/Stethoscope/Users icons) inserted on homepage below hero, routing ministers to /briefs and disabling future-page links with visual inactive styling**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-29T03:09:13Z
- **Completed:** 2026-04-29T03:15:00Z
- **Tasks:** 1 of 2 (Task 2 is human-verify checkpoint)
- **Files modified:** 2

## Accomplishments
- AudienceCTAs component with 3 equal-column cards on bg-slate-100 background
- Ministers card "Browse Policy Briefs" button links live to /briefs
- Healthcare Worker and General Public primary CTAs render as disabled spans (bg-slate-300, cursor-not-allowed)
- Secondary future-page links use text-slate-400 cursor-not-allowed disabled styling
- Build passes cleanly — 25 static pages, all 15 brief slugs in output

## Task Commits

Each task was committed atomically:

1. **Task 1: Create AudienceCTAs component and wire into homepage** - `ed99496` (feat)

## Files Created/Modified
- `app/components/sections/AudienceCTAs.tsx` - Three audience-segmented CTA cards (new Server Component)
- `app/page.tsx` - AudienceCTAs imported and inserted after HeroSection

## Decisions Made
- Disabled primary CTAs render as `<span>` elements rather than `<Link href="#" aria-disabled>` — prevents any navigation semantics, cleaner HTML
- bg-slate-100 section background matches NewsletterSignup, creating consistent visual rhythm as bookend sections on the homepage

## Deviations from Plan
None — plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Homepage now routes visitors to their relevant content within the first scroll
- /awareness and /take-action links are visually present but disabled — Phase 8 and Phase 10 will activate them
- Phase 7 complete after human visual verification (Task 2 checkpoint)

---
*Phase: 07-content-and-analytics*
*Completed: 2026-04-29*
