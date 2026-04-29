---
phase: 08-awareness-hub-education-library
plan: 02
subsystem: ui
tags: [next.js, react, yet-another-react-lightbox, accordion, awareness]

# Dependency graph
requires:
  - phase: 08-awareness-hub-education-library
    provides: InfographicGrid and AccordionSection components
provides:
  - /awareness route with static generation
  - InfographicGrid client component with lightbox
  - AccordionSection client component with real AMR content
affects: [awareness-hub, education-library]

# Tech tracking
tech-stack:
  added: [yet-another-react-lightbox]
  patterns: [Client components for interactivity, Server Component for awareness page, Plain <img> for unoptimized images in lightbox]

key-files:
  created:
    - app/components/awareness/InfographicGrid.tsx
    - app/components/awareness/AccordionSection.tsx
    - app/awareness/page.tsx
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Used plain <img> tags inside InfographicGrid instead of next/image — aligns with unoptimized images config"
  - "Imported yet-another-react-lightbox/styles.css inside the client component, not globals.css or layout.tsx"
  - "InfographicGrid uses index state to track which slide to display in the lightbox"
  - "AccordionSection uses max-h transition (0 to 2000px) instead of hidden/visible for smooth animation"
  - "All 3 accordion sections collapsed by default (openIndex = null)"

patterns-established:
  - "Client components ('use client') for all interactive UI (grid, accordion)"
  - "Server Component for page layout with metadata"
  - "Data arrays (infographics, accordionItems) defined in Server Component, passed as props to Client Components"

requirements-completed: [AWRE-01, AWRE-02]

# Metrics
duration: 10 min
completed: 2026-04-29
---

# Phase 8 Plan 2: Awareness Hub — Infographic Grid & Accordion Components

**3-column infographic grid with yet-another-react-lightbox and 3 collapsible AMR explainer sections with real content and fact sheet links**

## Performance

- **Duration:** 10 min
- **Started:** ~2026-04-29T04:56:09Z
- **Completed:** 2026-04-29T05:06:09Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- `/awareness` route statically generated and confirmed in build output
- InfographicGrid client component with responsive 3-column grid and lightbox integration
- AccordionSection client component with smooth expand/collapse animations
- Awareness page with hero, infographic grid, and accordion explainer sections
- All 3 Fleming Fund Rwanda JPEG infographics (IMG_9750/9751/9752) wired to grid

## Task Commits

Each task was committed atomically:

1. **Task 1: Install yet-another-react-lightbox and create InfographicGrid** - `a2b271c` (feat)
2. **Task 2: Create AccordionSection and awareness/page.tsx** - `cbe6018` (feat)

**Plan metadata:** (metadata commit after summary)

## Files Created/Modified
- `package.json` — added yet-another-react-lightbox dependency
- `package-lock.json` — resolved package lock
- `app/components/awareness/InfographicGrid.tsx` — client component: 3-column responsive grid with lightbox
- `app/components/awareness/AccordionSection.tsx` — client component: collapsible accordion with ChevronDown
- `app/awareness/page.tsx` — server component: awareness hub page with hero, infographic grid, and accordions

## Decisions Made
- Used plain `<img>` tags in InfographicGrid — next.config.js already sets `images: { unoptimized: true }`, no Next.js image optimization needed
- Imported `yet-another-react-lightbox/styles.css` inside InfographicGrid component, not in layout or globals
- Accordion max-h transition (0 → 2000px) over hidden/visible for smooth CSS animation

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 8 Plan 02 complete. Phase 8 has one more plan (08-03).
Ready for 08-03.

---
*Phase: 08-awareness-hub-education-library*
*Completed: 2026-04-29*