---
phase: "05"
plan: "02"
subsystem: seo-discoverability
tags: [sitemap, robots-txt, print-css, seo, next-js]
dependency_graph:
  requires: ["05-01"]
  provides: ["sitemap.xml generation", "robots.txt generation", "print-friendly brief pages"]
  affects: ["app/globals.css", "app/sitemap.ts", "app/robots.ts"]
tech_stack:
  added: []
  patterns: ["Next.js built-in file conventions (sitemap.ts, robots.ts)", "CSS @media print", "force-static export directive for output:export"]
key_files:
  created:
    - app/sitemap.ts
    - app/robots.ts
  modified:
    - app/globals.css
decisions:
  - "Next.js built-in sitemap.ts/robots.ts file conventions over next-sitemap package — zero dependency, works natively with output:export"
  - "export const dynamic = 'force-static' required on both sitemap and robots routes for output:export mode in Next.js 16"
  - "getAllBriefs() reused from app/lib/content.ts for brief slug enumeration — avoids duplicating file-read logic"
  - "Georgia serif specified for print body font — reliable cross-platform availability in print contexts"
  - "!important on print display:none — required to override Tailwind v4 utility class specificity"
metrics:
  duration: "3 min"
  completed: "2026-04-23"
  tasks: 2
  files: 3
---

# Phase 05 Plan 02: Sitemap, Robots, and Print CSS Summary

Sitemap.xml and robots.txt generation via Next.js built-in file conventions, plus @media print CSS for clean browser printing of brief detail pages.

## What Was Built

**app/sitemap.ts** — Generates sitemap.xml with 8 total URLs at build time: 5 static pages (home, briefs, methodology, experts, contact) plus one entry per brief from getAllBriefs(). Uses NEXT_PUBLIC_SITE_URL env var with gghnstarr.vercel.app fallback.

**app/robots.ts** — Generates robots.txt allowing all crawlers (User-Agent: *) and pointing to sitemap.xml URL.

**app/globals.css @media print block** — 80+ lines of print-friendly CSS: A4 page margins, Georgia serif body font, hides header/footer/nav/.no-print/buttons, prevents mid-section page breaks via break-inside:avoid, shows inline href URLs for external links.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added force-static directive for output:export compatibility**
- **Found during:** Task 1 verification (npm run build)
- **Issue:** Next.js 16 with output:'export' requires `export const dynamic = 'force-static'` on sitemap.xml and robots.txt routes. Without it, build fails with "export const dynamic not configured on route" error.
- **Fix:** Added `export const dynamic = 'force-static'` to both app/sitemap.ts and app/robots.ts
- **Files modified:** app/sitemap.ts, app/robots.ts
- **Commit:** 2ff47d5

## Verification Results

- `out/sitemap.xml` — 8 URLs: 5 static pages + 3 brief slugs (week-01, week-02, week-03)
- `out/robots.txt` — "Allow: /" with sitemap pointer to https://gghnstarr.vercel.app/sitemap.xml
- `@media print` block in globals.css at line 37
- TypeScript: no errors on sitemap.ts or robots.ts
- Build: succeeded with 13 static pages generated

## Self-Check: PASSED

- app/sitemap.ts: FOUND
- app/robots.ts: FOUND
- app/globals.css @media print: FOUND at line 37
- Commit 1c3e903 (feat sitemap+robots): FOUND
- Commit 0a6d9df (feat print CSS): FOUND
- Commit 2ff47d5 (fix force-static): FOUND
- out/sitemap.xml: generated with 8 URLs
- out/robots.txt: generated with Allow: / and sitemap pointer
