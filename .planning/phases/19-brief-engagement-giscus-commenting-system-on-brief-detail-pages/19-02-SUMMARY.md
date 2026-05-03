---
phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages
plan: "02"
subsystem: ui
tags: [giscus, commenting, github-discussions, next-js, static-export, origin-hardening]

# Dependency graph
requires:
  - phase: 19-01
    provides: GiscusComments React component wrapping Giscus iframe
provides:
  - GiscusComments wired into every brief detail page below Prev/Next nav
  - public/giscus.json restricting Giscus iframe to authorized origins
affects:
  - 19-02 Task 3 continuation (GitHub setup + repoId/categoryId placeholder fill-in — awaiting human action)

# Tech tracking
tech-stack:
  added: []
  patterns: ["Server Component page importing Client Component (GiscusComments) — same pattern as DownloadButton and InfographicBlock", "public/giscus.json origin allowlist for third-party iframe hardening"]

key-files:
  created:
    - public/giscus.json
  modified:
    - app/briefs/[slug]/page.tsx

key-decisions:
  - "GiscusComments placed after closing </nav> of Prev/Next block, inside Container but outside max-w-3xl — allows iframe to span full Container width"
  - "giscus.json origins: gghnstarr.vercel.app + www.gghnstarr.org + localhost:3000 — update if custom domain differs"
  - "No React.Suspense or dynamic() wrapping — not needed for static export; loading=lazy on Giscus component handles deferred load"

patterns-established:
  - "public/giscus.json: serve domain allowlist from /public for Giscus iframe origin restriction"

requirements-completed: [BENG-01, BENG-02]

# Metrics
duration: 1min
completed: 2026-05-03
---

# Phase 19 Plan 02: Brief Detail Page Giscus Integration Summary

**GiscusComments wired into every brief detail page below Prev/Next nav, and public/giscus.json created for origin hardening — widget awaits one-time GitHub setup (Task 3 checkpoint)**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-05-03T12:53:14Z
- **Completed:** 2026-05-03T12:53:59Z
- **Tasks:** 2 of 3 complete (Task 3 is a human-action checkpoint)
- **Files modified:** 2

## Accomplishments
- Added `import { GiscusComments } from '@/components/briefs/GiscusComments'` to brief detail page
- Rendered `<GiscusComments />` after the closing `</nav>` of Prev/Next navigation, inside Container but outside max-w-3xl content div
- Created `public/giscus.json` with origin allowlist restricting Giscus iframe to gghnstarr.vercel.app, www.gghnstarr.org, and localhost:3000
- TypeScript compilation clean with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire GiscusComments into brief detail page** - `08c4038` (feat)
2. **Task 2: Create public/giscus.json for origin hardening** - `91161c7` (feat)

*Task 3 (GitHub setup + fill in repoId/categoryId) is a checkpoint:human-action — awaiting user action*

## Files Created/Modified
- `app/briefs/[slug]/page.tsx` - Added GiscusComments import and JSX rendering after Prev/Next nav
- `public/giscus.json` - Domain allowlist served at /giscus.json; Giscus checks this file to validate allowed origins

## Decisions Made
- GiscusComments placed after `</nav>` of Prev/Next block, inside `<Container>` but outside the `max-w-3xl` content div — ensures iframe spans full Container width for comfortable display
- `public/giscus.json` includes `www.gghnstarr.org` as likely custom domain — remove if not in use
- No React.Suspense or dynamic() wrapping added — not needed for static Next.js export; `loading="lazy"` on the Giscus component handles deferred iframe loading

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

**Task 3 is a blocking human-action checkpoint.** The user must complete the following before the commenting widget goes live:

1. **Enable GitHub Discussions** — GitHub → shikaasor/gghnstarr → Settings → Features → tick "Discussions"
2. **Install Giscus GitHub App** — https://github.com/apps/giscus → Install → select shikaasor/gghnstarr
3. **Get repoId and categoryId** — https://giscus.app → enter shikaasor/gghnstarr → copy `data-repo-id` and `data-category-id` from the generated snippet
4. **Fill in placeholders** — Replace `PLACEHOLDER_REPO_ID` and `PLACEHOLDER_CATEGORY_ID` in `app/components/briefs/GiscusComments.tsx`
5. **Verify locally** — `npm run dev` → visit any /briefs/[slug] page → scroll to bottom → Giscus comment box should appear
6. **Run build** — `npm run build` should pass cleanly

## Next Phase Readiness
- GiscusComments is now rendering on every brief detail page
- Widget will load as soon as real repoId/categoryId values are filled in (Task 3)
- After Task 3 completion, Phase 19 is fully live — no further code changes needed

---
*Phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages*
*Completed: 2026-05-03*
