---
phase: 15-conference-hub-dedicated-conference-page-and-site-wide-countdown-widget
plan: "01"
subsystem: ui
tags: [react, nextjs, sticky-bar, countdown, session-storage, tailwind]

# Dependency graph
requires:
  - phase: 06-brand-rebrand
    provides: CSS tokens (crimson/navy/gold) and Tailwind v4 globals.css pattern
  - phase: 10-take-action-page
    provides: Header navLinks array pattern with isButton flag
provides:
  - ConferenceBar client component — crimson sticky banner above header on all pages except /conference
  - cta-pulse keyframe animation utility in globals.css
  - /conference nav link wired into Header navLinks
affects:
  - 15-02 (conference page will have bar suppressed by pathname guard)
  - any future layout changes involving sticky headers

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ConferenceBar mirrors ConferenceBadge: useState<number|null>(null) init prevents hydration mismatch on static export"
    - "Session-dismiss via sessionStorage (not localStorage) — bar returns on new browser session"
    - "z-[60] on ConferenceBar vs z-50 on Header — DOM order + stacking ensures bar renders above header"
    - "Tailwind v4 custom animation via @keyframes + .animate-cta-pulse in globals.css (no tailwind.config.js)"
    - "usePathname() guard returns null early — bar suppressed on /conference before countdown runs"

key-files:
  created:
    - app/components/layout/ConferenceBar.tsx
  modified:
    - app/globals.css
    - app/layout.tsx
    - app/components/layout/Header.tsx

key-decisions:
  - "ConferenceBar z-[60] sticky top-0 rendered before Header in DOM — no CSS changes to Header needed for correct stacking"
  - "daysLeft initialized as null (not 0) — prevents hydration mismatch on static export; bar renders '...' until client hydrates"
  - "sessionStorage used (not localStorage) — deliberate: bar returns each new browser session for maximum conference awareness"
  - "conferenceHasPassed check uses new Date() >= TARGET_DATE — guards against daysLeft=0 edge case before exact midnight"

patterns-established:
  - "Sticky bar pattern: z-[60] + sticky top-0 above Header z-50; DOM order determines visual stacking"
  - "Client-only countdown: useState<number|null>(null) init + useEffect to prevent SSR/hydration mismatch"

requirements-completed: [CONF-01]

# Metrics
duration: 8min
completed: 2026-05-03
---

# Phase 15 Plan 01: ConferenceBar — Site-Wide Countdown Widget Summary

**Crimson sticky bar with days-until countdown, pulsing Register Now CTA, session-dismiss, and /conference page suppression — wired above Header in root layout**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-03T00:00:00Z
- **Completed:** 2026-05-03
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- ConferenceBar client component created with hydration-safe countdown (useState null init pattern)
- cta-pulse CSS keyframe animation added to globals.css via Tailwind v4 @keyframes pattern
- ConferenceBar wired into root layout above Header — active on all pages
- /conference nav link added to Header navLinks array (after Contact, before Take Action button)
- next build passes cleanly — 22 static pages generated

## Task Commits

Each task was committed atomically:

1. **Task 1: ConferenceBar component + pulse animation** - `1374991` (feat)
2. **Task 2: Wire ConferenceBar into layout + add /conference nav link** - `9bfcd56` (feat)

**Plan metadata:** committed with docs commit after summary creation

## Files Created/Modified

- `app/components/layout/ConferenceBar.tsx` - Client component: crimson sticky bar, countdown, session-dismiss, pathname/date guards
- `app/globals.css` - Added @keyframes cta-pulse and .animate-cta-pulse utility class
- `app/layout.tsx` - Imported ConferenceBar, placed before Header in body
- `app/components/layout/Header.tsx` - Added { href: '/conference', label: 'Conference' } to navLinks

## Decisions Made

- ConferenceBar at z-[60] sticky top-0 renders before Header (z-50) in DOM — stacking is correct without Header CSS changes
- daysLeft initialized as null prevents hydration mismatch on static export
- sessionStorage chosen over localStorage so bar re-appears each new browser session (higher awareness)
- conferenceHasPassed check uses `new Date() >= TARGET_DATE` for exact midnight handling

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — TypeScript compiled cleanly, build passed first attempt with 22 static pages.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- ConferenceBar is live and will auto-suppress itself post-June 28 2026
- /conference nav link is wired; 15-02 will build the /conference page that the bar suppresses itself on
- The usePathname guard in ConferenceBar already handles the /conference page suppression — no code changes needed in 15-02

---
*Phase: 15-conference-hub-dedicated-conference-page-and-site-wide-countdown-widget*
*Completed: 2026-05-03*
