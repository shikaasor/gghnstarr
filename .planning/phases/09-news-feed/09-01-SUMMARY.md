---
phase: 09-news-feed
plan: 01
subsystem: infra
tags: [arxiv, pubmed, node-script, github-actions, cron, xml, fast-xml-parser]

# Dependency graph
requires:
  - phase: 08-awareness-hub-education-library
    provides: types.ts pattern for typed content interfaces
provides:
  - NewsArticle TypeScript interface and NewsSource type in app/lib/types.ts
  - scripts/fetch-news.mjs standalone Node.js scraper (arXiv + PubMed)
  - content/news.json pre-seeded with 200 real AMR articles
  - .github/workflows/fetch-news.yml daily cron auto-refresh workflow
affects: [09-02-news-page, future-news-ui]

# Tech tracking
tech-stack:
  added: [fast-xml-parser ^4.5.0]
  patterns: [static JSON data file refreshed by GitHub Actions cron, PubMed idlist approach for ESummary/EFetch, silent fallback to existing news.json on API error]

key-files:
  created:
    - scripts/fetch-news.mjs
    - content/news.json
    - .github/workflows/fetch-news.yml
  modified:
    - app/lib/types.ts
    - package.json
    - package-lock.json

key-decisions:
  - "PubMed idlist approach used instead of WebEnv history (ESearch usehistory=y returned undefined query_key/WebEnv — ESummary 500 error)"
  - "EFetch abstracts fetched only for first batch of 100 PubMed articles to avoid long URLs"
  - "fast-xml-parser in devDependencies (only used at build/script time, not in Next.js bundle)"
  - "GitHub Actions workflow uses npm ci so fast-xml-parser devDependency is available in CI"
  - "No Vercel deploy hook needed — pushing content/news.json to main auto-triggers Vercel rebuild"
  - "NCBI_API_KEY is optional secret — no key = 3 req/s rate limit, sufficient for daily cron"

patterns-established:
  - "API scraper pattern: ESearch idlist → ESummary by id param → EFetch by id param (avoids NCBI WebEnv 500)"
  - "Silent fallback: any API error returns [] and merges with existing articles, so news.json always has content"
  - "Deduplication key: DOI (preferred) or normalized title (lowercase, collapsed whitespace)"

requirements-completed: [NEWS-02, NEWS-03]

# Metrics
duration: 5min
completed: 2026-05-02
---

# Phase 9 Plan 01: News Feed Scraper Pipeline Summary

**arXiv + PubMed scraper writing 200 deduplicated AMR articles to content/news.json, refreshed daily via GitHub Actions cron pushing to main**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-02T06:49:18Z
- **Completed:** 2026-05-02T06:54:26Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- NewsArticle TypeScript interface and NewsSource type exported from app/lib/types.ts
- fetch-news.mjs ES module scraping arXiv (Atom XML) and PubMed (JSON+XML) with deduplication and 200-article cap
- content/news.json pre-seeded with 200 real recent AMR articles (186 PubMed + 14 arXiv)
- .github/workflows/fetch-news.yml: daily 06:00 UTC cron + workflow_dispatch, commits only on changes

## Task Commits

Each task was committed atomically:

1. **Task 1: NewsArticle type + fast-xml-parser devDependency** - `2504152` (feat)
2. **Task 2: Scraper script scripts/fetch-news.mjs** - `9b9f9fd` (feat)
3. **Task 3: Pre-seeded news.json + GitHub Actions workflow** - `ca0fd64` (feat)

## Files Created/Modified
- `app/lib/types.ts` - Added NewsSource type and NewsArticle interface
- `package.json` - Added fast-xml-parser ^4.5.0 to devDependencies
- `package-lock.json` - Updated after npm install
- `scripts/fetch-news.mjs` - Standalone Node.js scraper (arXiv + PubMed)
- `content/news.json` - Pre-seeded with 200 real AMR articles
- `.github/workflows/fetch-news.yml` - Daily cron GitHub Actions workflow

## Decisions Made
- PubMed idlist approach: ESearch returns `idlist` which is passed directly as `id=` param to ESummary/EFetch. The `usehistory=y` / WebEnv approach returned undefined query_key causing ESummary 500 errors.
- fast-xml-parser goes in devDependencies: it is only used in the Node.js script, never imported in Next.js pages, so it does not affect the browser bundle.
- EFetch abstracts for first 100 PubMed articles only: subsequent batches get empty abstract strings (acceptable — articles are still valid NewsArticle objects).
- GitHub Actions workflow uses `npm ci` (not `npm install`) to ensure deterministic installs in CI.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed PubMed WebEnv/history approach — switched to idlist direct param**
- **Found during:** Task 2 (fetch-news.mjs implementation)
- **Issue:** Plan specified `usehistory=y` ESearch then WebEnv-based ESummary. NCBI ESearch returned `count` but `query_key` and `WebEnv` were `undefined`, causing ESummary to return HTTP 500.
- **Fix:** Removed `usehistory=y`, use `idlist` from ESearch response directly, pass as `id=` CSV to ESummary and EFetch. Added batching (100 per request) to respect URL length limits.
- **Files modified:** scripts/fetch-news.mjs
- **Verification:** Node.js script exited 0, fetched 200 PubMed articles successfully
- **Committed in:** `9b9f9fd` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug in API call approach)
**Impact on plan:** Required fix for correct PubMed operation. No scope creep. arXiv approach unchanged.

## Issues Encountered
- NCBI ESearch `usehistory=y` mode did not return `query_key`/`WebEnv` fields — likely a transient API response format change or undocumented behavior. Resolved by switching to idlist direct approach which is more robust.

## User Setup Required
- Add `NCBI_API_KEY` as a GitHub Actions secret in repository Settings > Secrets for higher rate limits (10 req/s vs 3 req/s). This is optional — daily cron will work without it.
- To trigger manually: GitHub Actions tab > Fetch AMR News > Run workflow.

## Next Phase Readiness
- content/news.json exists with 200 valid AMR articles ready for 09-02 (news page UI)
- NewsArticle type exported from app/lib/types.ts for use in components
- GitHub Actions cron will keep content/news.json fresh daily after first deploy

---
*Phase: 09-news-feed*
*Completed: 2026-05-02*
