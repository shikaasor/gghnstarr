---
phase: 16-education-redesign-archive-with-filters-training-vs-resources-split-publications-and-verifiable-references
plan: "01"
subsystem: ui
tags: [typescript, json, education, filters, content-data]

# Dependency graph
requires:
  - phase: 08-awareness-hub
    provides: EducationResource type and EducationGrid.tsx component (deprecated but kept for backward compat)

provides:
  - EducationItem TypeScript interface with 4 filter dimensions (audience, format, topic, year)
  - EducationTab, ContentFormat, TopicTag union types
  - content/education.json with 15 items (12 resources + 3 training seeds) as single source of truth
  - sourceVerified flag enabling "Source unverified" UI badge
  - Publication format with authors, journal, doi fields for 3 peer-reviewed items

affects:
  - 16-02 (filter UI reads education.json and uses EducationItem)
  - 16-03 (page.tsx and EducationGrid.tsx replacement uses EducationItem)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Content-driven data: education items stored in content/education.json, never in component files"
    - "Backward-compat deprecation: @deprecated JSDoc on old type, both types coexist until Plan 03"
    - "Filter-dimension typing: union types (EducationTab, ContentFormat, TopicTag) enable compile-time filter safety"

key-files:
  created:
    - content/education.json
  modified:
    - app/lib/types.ts

key-decisions:
  - "EducationResource kept with @deprecated JSDoc — EducationGrid.tsx still uses it; both types coexist until Plan 03 replaces that component"
  - "Three Article items reclassified as Publication format (Cambridge/ASH&E, Frontiers, PubMed/JAC-AMR) with authors, journal, doi fields for visual distinction"
  - "sourceVerified: false on ECHO webinar — no confirmed direct training link; all 12 migrated resources sourceVerified: true"
  - "AudienceType reused from Phase 8 (same three values) — no duplication; both EducationResource and EducationItem reference the same type"

patterns-established:
  - "Education content lives in content/education.json — adding a resource never requires a code change"
  - "Publication items always carry authors + journal + doi fields"
  - "sourceVerified: false triggers 'Source unverified' UI treatment in Plan 02"

requirements-completed: [EDUC-01, EDUC-02]

# Metrics
duration: 8min
completed: 2026-05-08
---

# Phase 16 Plan 01: Education Data Contract and Content Migration Summary

**EducationItem TypeScript type with 4 filter dimensions plus content/education.json single source of truth — 12 resources migrated and 3 training seeds added, 3 peer-reviewed items classified as Publication with journal metadata**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-08T13:43:53Z
- **Completed:** 2026-05-08T13:51:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- EducationItem interface exported from app/lib/types.ts with all filter dimensions: audiences, format, topics, year, sourceVerified, tab, plus optional platform/authors/journal/doi
- All 12 Phase 8 education resources migrated to content/education.json without data loss — URLs, sources, and audience arrays preserved verbatim
- 3 items reclassified from Article to Publication format (Cambridge/ASH&E stewardship paper, Frontiers cellular infection paper, PubMed/JAC-AMR video review) with authors, journal, doi fields
- 3 training tab seed items added: WHO/Coursera AMR course, ECHO webinar series, WHO Academy NAP course
- TypeScript build passes with zero errors — EducationResource deprecated but still exported for EducationGrid.tsx backward compatibility

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend types.ts with EducationItem replacing EducationResource** - `56d5784` (feat)
2. **Task 2: Create content/education.json with all 15 items** - `530c679` (feat)

## Files Created/Modified
- `app/lib/types.ts` - Added EducationTab, ContentFormat, TopicTag, EducationItem; deprecated EducationResource with @deprecated JSDoc
- `content/education.json` - 15 EducationItem objects: 12 resources (3 as Publication) + 3 training seeds

## Decisions Made
- EducationResource kept with @deprecated JSDoc so EducationGrid.tsx continues to compile until Plan 03 replaces it
- Three Article items reclassified as Publication with peer-review metadata (authors, journal, doi) for planned visual distinction in the UI
- sourceVerified: false applied only to the ECHO webinar — no confirmed direct link; all 12 migrated resources retain sourceVerified: true
- AudienceType union type shared between deprecated EducationResource and new EducationItem — same three values, no duplication needed

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- content/education.json and EducationItem type ready for Plan 02 to build filter UI components
- EducationGrid.tsx still uses deprecated EducationResource — Plan 03 replaces both page.tsx and EducationGrid.tsx
- TypeScript build clean; no blockers for subsequent plans

---
*Phase: 16-education-redesign-archive-with-filters-training-vs-resources-split-publications-and-verifiable-references*
*Completed: 2026-05-08*
