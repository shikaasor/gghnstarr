---
phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages
plan: "02"
subsystem: ui
tags: [commenting, gas, github-actions, cron, static-json, brief-detail]

# Dependency graph
requires:
  - phase: 19-01
    provides: CommentForm and CommentList components
provides:
  - Discussion section on every brief detail page below Prev/Next nav
  - fetch-comments GitHub Actions cron updating content/comments.json daily
affects:
  - All /briefs/[slug] pages (adds Discussion section)

# Tech tracking
tech-stack:
  added: []
  patterns: ["GitHub Actions cron for static content refresh — same pattern as fetch-news.yml", "Server Component page importing Client Component (CommentForm) — same pattern as DownloadButton and InfographicBlock"]

key-files:
  created:
    - .github/workflows/fetch-comments.yml
  modified:
    - app/briefs/[slug]/page.tsx

key-decisions:
  - "Phase 19: replaced Giscus with GAS anonymous commenting — Giscus requires GitHub login, target audience are normies without GitHub accounts"
  - "Discussion section uses no-print class — hidden when brief page is printed"
  - "GAS_COMMENTS_URL is a GitHub Actions secret (not a NEXT_PUBLIC_ env var) — only the cron job needs it"
  - "fetch-comments.yml gracefully skips if GAS_COMMENTS_URL secret not yet configured — safe to deploy before GAS is set up"
  - "CommentList and CommentForm placed after </nav> of Prev/Next block, inside Container but outside max-w-3xl — consistent with Giscus placement from original plan"

patterns-established:
  - "GitHub Actions secret for read-only GAS endpoints used only by cron (not browser clients)"

requirements-completed: [BENG-01, BENG-02]

# Metrics
duration: ~5min
completed: 2026-05-03
---

# Phase 19 Plan 02: Brief Detail Page Discussion Integration Summary

**Discussion section wired into every brief detail page — CommentList + CommentForm below Prev/Next nav, daily GitHub Actions cron syncs approved comments from GAS**

## Performance

- **Duration:** ~5 min
- **Completed:** 2026-05-03
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added CommentForm and CommentList imports to brief detail page
- Added Discussion section after Prev/Next nav with no-print class, CommentList (per-slug approved comments), and CommentForm (anonymous submission)
- Created .github/workflows/fetch-comments.yml — daily 06:00 UTC cron, curl GAS_COMMENTS_URL → content/comments.json, commit with [skip ci], gracefully skips if secret not set
- TypeScript compilation clean with zero errors
- npm run build completes without errors

## Task Commits

1. **Task 1: Wire Discussion section** - `004ae90` (feat)
2. **Task 2: Add fetch-comments cron** - `751d981` (chore)

## Files Created/Modified
- `app/briefs/[slug]/page.tsx` - Added CommentForm + CommentList imports; Discussion section with h2, CommentList, CommentForm after Prev/Next nav
- `.github/workflows/fetch-comments.yml` - Daily cron mirrors fetch-news.yml pattern; uses GAS_COMMENTS_URL secret; commits updated comments.json with [skip ci]

## Decisions Made
- GAS_COMMENTS_URL stored as GitHub Actions secret (not in .env.local) — the cron job reads it server-side; browser clients use the existing NEXT_PUBLIC_GAS_URL for form submission
- `[skip ci]` tag on auto-commits prevents infinite loop — GitHub Actions won't re-trigger on its own commits
- `permissions: contents: write` added to workflow — mirrors fetch-news.yml; required to push the updated comments.json back to main

## Deviations from Plan

None - plan executed exactly as written.

## Phase 19 Complete

Phase 19 is now fully implemented. The system is ready to go live once:
1. A GAS script is deployed to handle `formType: 'comment'` submissions (store in spreadsheet with moderation)
2. A GAS read endpoint returns approved comments as `{ "brief-slug": [{ name, comment, date }] }` JSON
3. `GAS_COMMENTS_URL` secret is added to GitHub repository settings (for cron fetch)
4. Trigger the `fetch-comments` workflow manually once to populate content/comments.json

No code changes required — the system is complete.

---
*Phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages*
*Completed: 2026-05-03*
