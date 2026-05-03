---
phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages
plan: "01"
subsystem: ui
tags: [commenting, gas, anonymous, react, client-component, static-json]

# Dependency graph
requires: []
provides:
  - CommentForm React client component — anonymous GAS-backed comment submission
  - CommentList React server component — renders approved comments from static JSON
  - content/comments.json seed file — to be populated by GitHub Actions cron
affects:
  - 19-02 (brief detail page wiring — imports CommentForm and CommentList)

# Tech tracking
tech-stack:
  added: []
  patterns: ["GAS form routing via formType field — same pattern as Phase 10 pledge/commitment forms", "static JSON import via relative path for content outside app/ directory"]

key-files:
  created:
    - content/comments.json
    - app/components/briefs/CommentForm.tsx
    - app/components/briefs/CommentList.tsx
  modified:
    - app/lib/analytics.ts

key-decisions:
  - "Phase 19: replaced Giscus with GAS anonymous commenting — Giscus requires GitHub login, target audience are normies without GitHub accounts"
  - "CommentList uses relative path import '../../../content/comments.json' — @/* alias maps to app/, not project root"
  - "trackEvent generic helper added to analytics.ts — CommentForm tracks comment_submitted event"
  - "formType: 'comment' routes to comment handler in existing GAS endpoint — no new endpoint needed"

patterns-established:
  - "GAS form routing: single NEXT_PUBLIC_GAS_URL endpoint, formType field distinguishes pledge/commitment/comment"
  - "Static JSON for user-generated content: GitHub Actions cron writes file, Next.js build imports at build time"

requirements-completed: [BENG-01]

# Metrics
duration: ~5min
completed: 2026-05-03
---

# Phase 19 Plan 01: CommentForm + CommentList Components Summary

**GAS-backed anonymous commenting components created — CommentForm POSTs to existing GAS endpoint with formType routing, CommentList renders approved comments from static content/comments.json**

## Performance

- **Duration:** ~5 min
- **Completed:** 2026-05-03
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Created content/comments.json seed file (empty object, to be populated by GitHub Actions)
- Created CommentForm.tsx — 'use client', name/email/comment fields, POSTs to NEXT_PUBLIC_GAS_URL with formType: 'comment'
- Created CommentList.tsx — server component, imports content/comments.json via relative path, renders comments by slug
- Added trackEvent generic helper to app/lib/analytics.ts
- TypeScript compilation clean with zero errors

## Task Commits

1. **Task 1: Seed content/comments.json** - `ed14ae0` (chore)
2. **Task 2: Create CommentForm component** - `b9c0ab9` (feat)
3. **Task 3: Create CommentList component** - `82fcfa6` (feat)

## Files Created/Modified
- `content/comments.json` - Seed empty object; GitHub Actions cron populates with approved comments keyed by brief slug
- `app/components/briefs/CommentForm.tsx` - 'use client' form with name/email/comment; POSTs to GAS with formType: 'comment'; success/error/submitting states
- `app/components/briefs/CommentList.tsx` - Server component; imports comments.json; renders per-slug comments or empty state
- `app/lib/analytics.ts` - Added trackEvent generic helper for comment_submitted and future ad-hoc events

## Decisions Made
- Replaced Giscus with GAS anonymous commenting — target audience (African health policymakers) don't have GitHub accounts; Giscus requires GitHub login to comment
- CommentList uses `'../../../content/comments.json'` relative import — the `@/*` tsconfig alias maps to `./app/*`, not the project root; content/ lives at root
- Reuse existing NEXT_PUBLIC_GAS_URL endpoint with `formType: 'comment'` routing — same pattern as Phase 10 pledge and commitment forms; no new GAS endpoint or env var needed
- trackEvent added to analytics.ts as generic helper rather than a specific trackCommentSubmit — enables future ad-hoc events without repeated boilerplate

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing functionality] Added trackEvent to analytics.ts**
- **Found during:** Task 2 (creating CommentForm)
- **Issue:** CommentForm calls `trackEvent('comment_submitted', ...)` but analytics.ts only had specific named functions (trackPdfDownload, trackPledgeSubmit, etc.) — no generic trackEvent
- **Fix:** Added `export function trackEvent(eventName: string, params: Record<string, string> = {})` wrapping sendGAEvent
- **Files modified:** app/lib/analytics.ts
- **Commit:** b9c0ab9

**2. [Rule 1 - Bug] Fixed CommentList import path**
- **Found during:** Task 3 (creating CommentList)
- **Issue:** Plan specified `import commentsData from '@/content/comments.json'` but `@/*` alias resolves to `./app/*` — would fail at build time
- **Fix:** Used relative path `'../../../content/comments.json'`
- **Files modified:** app/components/briefs/CommentList.tsx
- **Commit:** 82fcfa6

## Next Phase Readiness
- CommentForm and CommentList ready to import in Plan 02 (brief detail page integration)
- No blockers — both components export named exports, TypeScript clean

---
*Phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages*
*Completed: 2026-05-03*
