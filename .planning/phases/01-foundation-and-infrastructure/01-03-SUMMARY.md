---
phase: 01-foundation-and-infrastructure
plan: "03"
subsystem: ui
tags: [nextjs, tailwind, react, layout, header, footer, navigation, mobile, responsive]

# Dependency graph
requires:
  - phase: 01-01
    provides: Next.js scaffold with Tailwind v4 brand tokens and globals.css theme
  - phase: 01-02
    provides: Content data layer and TypeScript interfaces

provides:
  - Shared Header component with GGHN STARR logo, 5-link desktop nav, mobile hamburger slide-out panel
  - Shared Footer component with branding, "Evidence. Advocacy. Action." tagline, partner acknowledgment, contact email, LinkedIn
  - Container wrapper component (max-w-5xl, 1024px max-width)
  - Root layout wiring all 5 page skeletons into shared Header/Footer shell
  - Page skeletons for /, /briefs, /methodology, /experts, /contact

affects:
  - phase-02-homepage (builds over page skeletons, extends Header/Footer)
  - phase-03-briefs-library (adds content to /briefs page skeleton)
  - phase-04-supporting-pages (adds content to /methodology, /experts, /contact skeletons)

# Tech tracking
tech-stack:
  added: [lucide-react (Menu/X icons)]
  patterns:
    - Server Components by default; 'use client' only when state required (Header hamburger)
    - Container component for consistent max-width layout across all pages
    - Sticky header with z-50 to stay above page content on scroll
    - Footer anchored to bottom via flex flex-col min-h-screen on body + flex-grow on main

key-files:
  created:
    - app/components/layout/Header.tsx
    - app/components/layout/Footer.tsx
    - app/components/layout/Container.tsx
    - app/briefs/page.tsx
    - app/methodology/page.tsx
    - app/experts/page.tsx
    - app/contact/page.tsx
  modified:
    - app/layout.tsx
    - app/page.tsx

key-decisions:
  - "lucide-react used for hamburger icons (Menu/X) — already present in scaffold, no new dependency"
  - "Header is 'use client' only — hamburger useState requires it; Footer and Container are Server Components"
  - "Mobile nav closes on link click (onClick setIsOpen(false)) — avoids stale open panel after navigation"
  - "Footer does NOT repeat main nav links — keeps footer focused on branding/contact per design spec"
  - "flex flex-col min-h-screen on body + flex-grow on main — footer anchors to viewport bottom on short pages"

patterns-established:
  - "Layout pattern: import from @/components/layout/* in root layout.tsx"
  - "Page skeleton pattern: Server Component + Container wrapper + placeholder h1 + coming-soon p"
  - "Mobile-first: hide desktop nav with hidden md:flex, show hamburger with md:hidden"

requirements-completed: [FOUN-03]

# Metrics
duration: ~45min (including human verification)
completed: 2026-03-27
---

# Phase 1 Plan 03: Layout Shell Summary

**Sticky navy Header with mobile hamburger slide-out, branded Footer with partner acknowledgment, and Container wrapper wired into all 5 Next.js page skeletons — human verified on live dev server**

## Performance

- **Duration:** ~45 min (including human verification)
- **Started:** 2026-03-27
- **Completed:** 2026-03-27
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files modified:** 10

## Accomplishments

- Header component built with 'use client' hamburger toggle — Desktop nav (5 links) hides on mobile, hamburger opens slide-out panel below md breakpoint
- Footer component built with GGHN STARR branding, "Evidence. Advocacy. Action." tagline, Fleming Fund / Africa CDC / WHO AFRO partner acknowledgment, contact email, LinkedIn — no nav links repeated
- Root layout updated with flex min-h-screen body so footer anchors to bottom; all 5 page skeletons created and confirmed rendering correctly
- Human verified: all 5 routes load without errors, Header/Footer render on every page, mobile hamburger opens/closes, brand colors correct

## Task Commits

Each task was committed atomically:

1. **Task 1: Build layout shell components (Header, Footer, Container)** - `e4d11c4` (feat)
2. **Task 2: Wire layout shell into root layout and create 5 page skeletons** - `79f9491` (feat)
3. **Task 3: Verify layout shell on live dev server** - human-verified (checkpoint approved)

**Plan metadata:** _(this commit)_

## Files Created/Modified

- `app/components/layout/Header.tsx` - 'use client' sticky nav header with hamburger mobile menu
- `app/components/layout/Footer.tsx` - Server Component footer with branding, partners, contact
- `app/components/layout/Container.tsx` - Server Component max-w-5xl centered wrapper
- `app/layout.tsx` - Root layout importing Header/Footer, flex min-h-screen body
- `app/page.tsx` - Homepage skeleton with Container wrapper
- `app/briefs/page.tsx` - Briefs page skeleton with metadata
- `app/methodology/page.tsx` - Methodology page skeleton with metadata
- `app/experts/page.tsx` - Experts page skeleton with metadata
- `app/contact/page.tsx` - Contact page skeleton with metadata

## Decisions Made

- lucide-react used for hamburger icons (Menu/X) — already present in scaffold, avoids new dependency
- Header is 'use client' only because hamburger uses useState; Footer and Container remain Server Components
- Mobile nav link onClick closes panel (setIsOpen(false)) — prevents stale open state after route change
- Footer deliberately omits main nav links per design spec — footer is branding/contact only
- flex flex-col min-h-screen on body + flex-grow on main ensures footer anchors to bottom on short pages

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Layout shell complete and human verified — all Phase 2 homepage components will render inside this shell
- Phase 2 can begin immediately: page skeletons for all 5 routes exist, Header/Footer wired at root layout level
- Newsletter provider decision (Mailchimp vs Formspree) still pending — needed before Phase 2 newsletter signup component

---
*Phase: 01-foundation-and-infrastructure*
*Completed: 2026-03-27*
