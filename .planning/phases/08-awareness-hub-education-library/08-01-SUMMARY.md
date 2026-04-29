---
phase: 08-awareness-hub-education-library
plan: 01
subsystem: types, navigation, CTAs
tags: [types, header, navigation, CTAs, foundation]
dependency_graph:
  requires: [07-03]
  provides: [EducationResource type, /awareness nav link, /education nav link, enabled CTAs]
  affects: [app/lib/types.ts, app/components/layout/Header.tsx, app/components/sections/AudienceCTAs.tsx]
tech_stack:
  added: []
  patterns: [TypeScript union types, TypeScript interface extension]
key_files:
  created: []
  modified:
    - app/lib/types.ts
    - app/components/layout/Header.tsx
    - app/components/sections/AudienceCTAs.tsx
decisions:
  - AudienceType union matches the three AudienceCTAs card groups for type-safe audience filtering
  - ResourceFormat covers three content modalities: Article, Download, Video
  - Header navLinks array extended — both desktop and mobile nav auto-inherit the new items
  - AudienceCTAs Take Action links remain live: false pending Phase 10
metrics:
  duration: 92s
  completed: 2026-04-29
  tasks_completed: 3
  files_modified: 3
---

# Phase 08 Plan 01: Foundation — Types, Nav, and CTA Enablement Summary

**One-liner:** Shared Phase 8 foundation: EducationResource TypeScript types added, Awareness and Education nav links wired into Header, and four dormant AudienceCTAs links enabled with correct /awareness and /education hrefs.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add EducationResource types to types.ts | 8ce1cd4 | app/lib/types.ts |
| 2 | Add Awareness and Education nav links to Header.tsx | 4fedbd4 | app/components/layout/Header.tsx |
| 3 | Enable awareness and education CTAs in AudienceCTAs.tsx | 2fa3bca | app/components/sections/AudienceCTAs.tsx |

## Verification Results

- `npx tsc --noEmit`: zero errors after each task
- `npm run build`: 18 static pages generated successfully
- `/awareness` and `/education` nav links present in both desktop and mobile Header nav
- 7 total `live: true` / `primaryLive: true` occurrences in AudienceCTAs (4 newly enabled, 3 pre-existing)

## Decisions Made

- AudienceType union ('Policymaker' | 'Healthcare Worker' | 'General Public') mirrors the three AudienceCTAs card groups for type-safe audience filtering in the Education Library
- ResourceFormat ('Article' | 'Download' | 'Video') covers the three expected content modalities
- Header navLinks array extended by two entries — both desktop and mobile nav automatically inherit new items via the shared map
- AudienceCTAs Take Action links remain `live: false` (Phase 10 — not yet in scope)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- app/lib/types.ts: modified with AudienceType, ResourceFormat, EducationResource exports
- app/components/layout/Header.tsx: modified with /awareness and /education navLinks entries
- app/components/sections/AudienceCTAs.tsx: modified with 4 enabled live CTAs
- Commits 8ce1cd4, 4fedbd4, 2fa3bca: all present in git log
