---
plan: 20-01
phase: 20-education-resource-import-populate-education-library-with-17
status: complete
started: 2026-05-25
completed: 2026-05-25
---

## Summary

Extended the `EducationItem` type and imported 172 records from the AMR Resource Repository spreadsheet, bringing the education library from 15 to 187 records.

## What Was Built

- **`app/lib/types.ts`**: Added `WHORegion` union type (7 values: AFRO, EURO, PAHO, EMRO, WPRO, SEARO, All regions). Made `year` optional (`year?: number`). Added `description?: string` and `region?: WHORegion` fields to `EducationItem`.
- **`app/components/education/EducationTabs.tsx`**: Fixed year filter logic to handle optional year — filters out `undefined` from `availableYears`, guards `selectedYears.includes` against undefined `item.year`.
- **`resources/tools/extract_education.py`**: One-shot extraction script using openpyxl. Maps Type→ContentFormat, Region→WHORegion, extracts year from source citation, infers tab from type/purpose, defaults topics to `['Research']`. 172 records extracted with no errors.
- **`content/education.json`**: 187 records (15 curated first, 172 imported appended). All imported records carry `description` and `region`. 62 records omit `year` (no extractable year in source).

## Verification

- `content/education.json` parses as valid JSON with exactly 187 records.
- First 15 records unchanged from curated set.
- All 172 imported records have non-empty `description` and valid `WHORegion` token.
- 62 imported records correctly omit `year` key.
- `npx next build` completes with zero TypeScript/build errors.

## Self-Check: PASSED

All must-haves verified:
- [x] `WHORegion` exported with 7 values
- [x] `EducationItem` has `year?`, `description?`, `region?`
- [x] `content/education.json` contains 187 records
- [x] Every imported record has title, format, audiences, topics, source, url, description, region
- [x] `next build` type-checks 187-item JSON with zero errors

## Key Files

key-files.created:
  - app/lib/types.ts
  - resources/tools/extract_education.py
  - content/education.json

## Commits

- `feat(20-01): extend EducationItem with WHORegion, description?, region?, year?`
- `feat(20-01): add extraction script for AMR Resource Repository`
- `feat(20-01): generate 187-record education.json (15 curated + 172 imported)`
