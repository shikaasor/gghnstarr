---
phase: 04-supporting-pages
plan: "02"
subsystem: experts-page
tags: [experts, content, next-image, server-component]
dependency_graph:
  requires: []
  provides: [experts-page, expert-card-component, corrected-experts-json]
  affects: [briefs-library]
tech_stack:
  added: []
  patterns: [Next.js Image fill layout, Server Component grid, content JSON read via getExperts()]
key_files:
  created:
    - app/components/experts/ExpertCard.tsx
  modified:
    - content/experts.json
    - content/briefs-index.json
    - app/experts/page.tsx
decisions:
  - "Expert photos use Next.js Image with fill prop inside relative aspect-square wrapper — consistent with locked user decision to use next/image"
  - "linkedinUrl omitted from all expert entries — locked no-outbound-links decision honored; Expert interface already has it as optional"
  - "week-01 and week-03 brief authorIds updated from olawale-oladipo to olawale-a alongside main task scope"
metrics:
  duration: "1 min"
  completed_date: "2026-04-21"
  tasks_completed: 2
  files_modified: 4
---

# Phase 4 Plan 2: Experts Page Summary

**One-liner:** Real STARR team profiles (Dr. Olawale A., Dr. Samson A., Piringar Mercy Niyang) replace placeholder data in experts.json; /experts page renders a 3-column Server Component grid using Next.js Image with fill layout.

## What Was Built

The /experts page now displays three expert cards built from corrected source data. Each card renders a photo area (bg-slate-100 placeholder with Next.js `<Image fill>`), name, title, organization, specialty pills, and a 2-3 sentence bio. No outbound links appear on any card per locked design decision.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite experts.json and fix authorIds | e9cf8fb | content/experts.json, content/briefs-index.json |
| 2 | Create ExpertCard component and update experts page | 5c5b6a8 | app/components/experts/ExpertCard.tsx, app/experts/page.tsx |

## Decisions Made

- `linkedinUrl` field omitted from all JSON entries — the Expert TypeScript interface already declares it as `optional`, so no type changes were needed
- `week-01` and `week-03` authorIds (olawale-oladipo) were updated to olawale-a as a required deviation — old id no longer exists in experts.json

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated stale authorIds in week-01 and week-03 briefs**
- **Found during:** Task 1
- **Issue:** briefs-index.json week-01 and week-03 entries referenced authorId "olawale-oladipo" which was removed by the experts.json rewrite
- **Fix:** Updated both entries to authorId "olawale-a" to match the new expert id
- **Files modified:** content/briefs-index.json
- **Commit:** e9cf8fb (included in same task commit)

## Verification Results

- `npx tsc --noEmit` — clean (no output)
- `npx next build` — exits 0, all 11 pages generated successfully
- /experts route confirmed in build output as static prerender
- Three expert cards with correct ids: olawale-a, samson-a, piringar-mercy-niyang
- No outbound links on any card
