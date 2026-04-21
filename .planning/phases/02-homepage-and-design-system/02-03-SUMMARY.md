---
phase: 02-homepage-and-design-system
plan: "03"
subsystem: ui
tags: [nextjs, react, server-components, tailwind]

# Dependency graph
requires:
  - phase: 02-01
    provides: "page.tsx with FeaturedBrief and PartnerLogos imports, Brief and SiteContent types"
provides:
  - FeaturedBrief Server Component with key messages list and Download PDF anchor
  - PartnerLogos Server Component with 4 partner logos in flex-wrap row
  - NewsletterSignup stub component enabling full build to succeed
affects:
  - 02-04 (NewsletterSignup stub will be replaced by full implementation)
  - page.tsx (all 6 section components now resolve)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Components consuming typed props from getSiteContent / getFeaturedBrief
    - Native <a> tags for file downloads and external links (not Next.js Link)
    - Plain <img> tags for static export with images.unoptimized:true
    - Alternating bg-slate-100 / bg-white section backgrounds for visual rhythm

key-files:
  created:
    - app/components/sections/FeaturedBrief.tsx
    - app/components/sections/PartnerLogos.tsx
    - app/components/sections/NewsletterSignup.tsx
  modified: []

key-decisions:
  - "FeaturedBrief uses default export to match page.tsx import style"
  - "Download PDF uses native <a> with download attribute — downloads are not Next.js routes"
  - "PartnerLogos uses plain <img> not next/image — static export with images.unoptimized:true"
  - "p.url uses null-coalescing fallback to '#' — url is optional in SiteContent type"
  - "NewsletterSignup stub (returns null) created as Rule 3 fix to unblock build — replaced in 02-04"

patterns-established:
  - "Server Component sections: no 'use client', typed props, default export"
  - "External links use <a target='_blank' rel='noopener noreferrer'>"

requirements-completed:
  - HOME-02
  - HOME-03

# Metrics
duration: 10min
completed: 2026-03-30
---

# Phase 2 Plan 03: Featured Brief and Partner Logos Summary

**FeaturedBrief Server Component with dash-prefixed key messages and download anchor, PartnerLogos flex-wrap strip with 4 partner logos — full static build passes with out/index.html containing both sections**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-30T16:26:27Z
- **Completed:** 2026-03-30T16:36:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- FeaturedBrief.tsx: bg-slate-100 section, serif title, key messages as teal-dash list, Download PDF anchor with download attribute
- PartnerLogos.tsx: bg-white section, 4 partner logos in flex-wrap row, plain img tags, opacity-80 hover effects, external links
- Full npm run build passes; "Featured Policy Brief" and "Partners" confirmed in out/index.html

## Task Commits

Each task was committed atomically:

1. **Task 1: Build FeaturedBrief section** - `1b45237` (feat)
2. **Task 2: Build PartnerLogos section** - `de9f792` (feat)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `app/components/sections/FeaturedBrief.tsx` - Featured brief with key messages and Download PDF anchor
- `app/components/sections/PartnerLogos.tsx` - Partner logo strip with flex-wrap layout and external links
- `app/components/sections/NewsletterSignup.tsx` - Stub (returns null) — placeholder for plan 02-04

## Decisions Made

- FeaturedBrief exports as default (not named) to match existing page.tsx import style
- Used native `<a download>` for PDF downloads (not Next.js Link) — downloads are not routes
- Used plain `<img>` not next/image — static export with images.unoptimized:true avoids wrapper overhead
- `p.url ?? '#'` null-coalescing because url is optional in SiteContent type
- NewsletterSignup stub created as Rule 3 deviation fix — plan 02-04 will replace it with full implementation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created NewsletterSignup stub to unblock build**
- **Found during:** Task 2 (PartnerLogos build verification — npm run build)
- **Issue:** page.tsx imports NewsletterSignup which doesn't exist; build failed with "Module not found"
- **Fix:** Created minimal stub exporting `default function NewsletterSignup() { return null; }` to satisfy module resolution
- **Files modified:** app/components/sections/NewsletterSignup.tsx (new file)
- **Verification:** npm run build succeeded; out/index.html exists at 28KB
- **Committed in:** de9f792 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to satisfy plan's own success criterion ("Build succeeds"). No scope added — stub is a placeholder for plan 02-04. Plan 02-04 will replace it with full implementation.

## Issues Encountered

- TypeScript reported FeaturedBrief had no default export — plan specified named export style in the action block but page.tsx uses default imports. Fixed immediately by changing `export function` to `export default function`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plans 02-02 and 02-03 complete: all 6 homepage sections exist (HeroSection, ConferenceBadge, StatStrip, ThreePillars, FeaturedBrief, PartnerLogos)
- Plan 02-04 (NewsletterSignup) is the final piece of Phase 2 — requires Google Apps Script Web App URL
- Full homepage renders and builds correctly as static export

---
*Phase: 02-homepage-and-design-system*
*Completed: 2026-03-30*
