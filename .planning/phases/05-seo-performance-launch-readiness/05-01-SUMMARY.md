---
phase: 05-seo-performance-launch-readiness
plan: "01"
subsystem: seo
tags: [next.js, metadata, open-graph, twitter-card, social-share, fonts]

# Dependency graph
requires:
  - phase: 03-brief-listing-and-detail
    provides: generateMetadata and brief detail page that now receives OG/Twitter fields
  - phase: 01-foundation-and-infrastructure
    provides: globals.css @theme block with system font CSS custom properties
provides:
  - Root layout with metadataBase resolving all relative OG image paths to absolute URLs
  - Brief detail pages with full OG/Twitter metadata for WhatsApp link previews
  - System-fonts-only layout with no Google Fonts network request
affects: [all pages (metadataBase set globally), brief detail pages (OG/Twitter per-page)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - metadataBase in root layout enables relative thumbnailUrl paths to resolve as absolute OG image URLs
    - Root layout metadata template handles ' | GGHN STARR' suffix; per-page title is just brief.title
    - System font stacks defined in globals.css @theme block — no next/font/google needed

key-files:
  created: []
  modified:
    - app/layout.tsx
    - app/briefs/[slug]/page.tsx

key-decisions:
  - "metadataBase uses NEXT_PUBLIC_SITE_URL env var with gghnstarr.vercel.app fallback — user must set this in Vercel dashboard for production"
  - "Removed hardcoded ' | GGHN STARR' suffix from brief page title — root layout template handles it to avoid duplication"
  - ".env.local is gitignored (standard Next.js practice) — user must add NEXT_PUBLIC_SITE_URL as Vercel environment variable"
  - "brief.thumbnailUrl (641x360px) used as OG image — exceeds WhatsApp 300px minimum for large preview display"

patterns-established:
  - "Per-page OG metadata: use brief.thumbnailUrl with explicit width/height; metadataBase resolves to absolute URL"
  - "no-print class on nav and download divs — print-optimized brief pages"

requirements-completed: [SEO-01, SEO-03]

# Metrics
duration: 2min
completed: 2026-04-23
---

# Phase 05 Plan 01: Google Fonts Removal and Open Graph Metadata Summary

**System-fonts-only layout (no Google Fonts) with per-brief OG/Twitter Card metadata enabling WhatsApp rich link previews via metadataBase URL resolution**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-23T08:23:29Z
- **Completed:** 2026-04-23T08:25:32Z
- **Tasks:** 2
- **Files modified:** 2 (plus .env.local locally)

## Accomplishments
- Removed Playfair_Display and Inter Google Fonts imports from root layout — eliminates ~60-80KB of font files and removes a per-page network request, directly improving Lighthouse performance score for African users on constrained bandwidth
- Added metadataBase to root layout metadata export — enables all relative thumbnailUrl paths (e.g. /images/thumbnails/week-01-amr-governance-frameworks.jpg) to resolve to absolute URLs required by social crawlers
- Added full openGraph and twitter card metadata to brief detail generateMetadata — WhatsApp previews now show brief title, key takeaway, and 641x360px thumbnail image when policymakers share links

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove Google Fonts, add metadataBase and root OG defaults** - `baa1006` (feat)
2. **Task 2: Expand generateMetadata with OG/Twitter fields on brief detail page** - `ab2b471` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `app/layout.tsx` - Removed next/font/google imports and font variable classNames; added metadataBase, openGraph siteName/type/locale, twitter card defaults
- `app/briefs/[slug]/page.tsx` - Expanded generateMetadata with openGraph (images, publishedTime, article type) and twitter card fields; added .no-print to download buttons div and prev/next nav
- `.env.local` (local only, gitignored) - Appended NEXT_PUBLIC_SITE_URL=https://gghnstarr.vercel.app

## Decisions Made
- metadataBase set in root layout covers all pages — a single source of truth for absolute URL resolution
- brief.thumbnailUrl used directly as OG image because it is already a relative path that metadataBase resolves; no separate OG-specific image needed
- Removed hardcoded ' | GGHN STARR' from generateMetadata title return — root layout template `'%s | GGHN STARR'` handles it to avoid "Title | GGHN STARR | GGHN STARR" duplication

## Deviations from Plan

None - plan executed exactly as written.

One minor operational note: .env.local is gitignored in this project (standard Next.js practice), so the NEXT_PUBLIC_SITE_URL line was written to the local file but was not committed. This is expected and correct behavior.

## Issues Encountered

None — TypeScript compiled cleanly after both tasks. No build errors.

## User Setup Required

**Vercel environment variable must be set for production OG images to work:**

1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_SITE_URL` = `https://gghnstarr.vercel.app` (replace with your actual Vercel subdomain if different — check Project Settings → Domains)
3. Redeploy after adding the variable

Without this variable, the fallback `https://gghnstarr.vercel.app` is used. If your actual subdomain differs, OG images will return 404 in social crawlers.

## Next Phase Readiness
- Root layout is clean (no Google Fonts), metadataBase set — ready for any additional SEO work in subsequent plans
- Brief detail pages now emit correct OG/Twitter tags — share a brief URL on WhatsApp to verify the preview shows title + thumbnail
- System font stacks (ui-sans-serif, Georgia) from globals.css @theme block render immediately with no layout shift

---
*Phase: 05-seo-performance-launch-readiness*
*Completed: 2026-04-23*
