---
phase: 21-tools-directory-searchable-catalog-of-one-health-tools-and-r
plan: 01
subsystem: data-layer
tags: [extraction, openpyxl, types, one-health-tools]
requires: []
provides:
  - content/oh-tools.json (50 ToolItem records — single source of truth for Plan 21-02 page)
  - ToolItem / OHOrganizationLevel / OHAudienceType / OHScope types in app/lib/types.ts
affects:
  - app/lib/types.ts
tech-stack:
  added: []
  patterns:
    - Build-time openpyxl xlsx → JSON extraction (Phase 20 idiom, clone of extract_education.py)
    - String-literal union token types + interface in app/lib/types.ts (EducationItem convention)
key-files:
  created:
    - resources/tools/extract_oh_tools.py
    - content/oh-tools.json
  modified:
    - app/lib/types.ts
decisions:
  - "scopes/audienceTypes source variants canonicalized to verified unions (Prioritising→Prioritisation, implementation→Implementation, 'Terrestrial and aquatic animal health and welfare'→'Animal health') so JSON validates against ToolItem"
  - "fix_url() emits only https:// URLs or empty string — buried/scheme-less hosts normalized, no javascript:/data: schemes pass through"
  - "Dropped extract_education.py CURATED_PATH machinery — tools have no curated baseline; script writes the array directly"
metrics:
  duration: ~6 min
  completed: 2026-05-25
---

# Phase 21 Plan 01: Tools Directory Data Layer Summary

Build-time openpyxl extraction of the 50 OHHLEP One Health tools (Table 1, rows 3-52) into a typed `content/oh-tools.json`, plus the `ToolItem` interface and three OH token unions the JSON conforms to.

## What Was Built

- **`app/lib/types.ts`** — Added `OHOrganizationLevel`, `OHAudienceType`, `OHScope` string-literal unions and the `ToolItem` interface (id, name, year, organization, organizationLevels, scopes, audienceLevels, audienceTypes, description, url) following the existing EducationItem convention. No existing types modified.
- **`resources/tools/extract_oh_tools.py`** — One-shot, idempotent openpyxl script. Selects the `Table 1 OHHLEP Tools Inventory` sheet by name, iterates `range(3, 53)`, skips rows lacking a name or year (footnote defense), collapses embedded whitespace via `re.sub(r"\s+", " ", ...)`, splits comma-combined cells, canonicalizes token variants to the verified unions, normalizes URLs, and dedups slugs with an md5 content-hash suffix.
- **`content/oh-tools.json`** — 50 ToolItem-shaped records (1207 lines), the single source of truth Plan 21-02 will read at build time.

## Verification

- `python resources/tools/extract_oh_tools.py` prints `50`
- `npx tsc --noEmit -p tsconfig.json` exits 0 with ToolItem in scope
- JSON: 50 records, every `year` is an int, every `name` newline-free, every `url` is `""` or starts with `http`
- All `organizationLevels` / `scopes` / `audienceTypes` token values fall within their respective unions
- Re-run produces byte-identical JSON (idempotent)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Canonicalize out-of-union scope/audience tokens**
- **Found during:** Task 2 (post-extraction token scan)
- **Issue:** Source cells contained casing/spelling variants outside the verified unions: scopes `Prioritising` and lowercase `implementation`; audienceType `Terrestrial and aquatic animal health and welfare`. These would make the JSON fail to validate against `ToolItem` (a stated must-have).
- **Fix:** Added a `TOKEN_CANON` map in `split_clean()` to normalize variants to `Prioritisation`, `Implementation`, and `Animal health`.
- **Files modified:** resources/tools/extract_oh_tools.py
- **Commit:** 2447adc

## Threat Surface

No new surface beyond the plan's threat model. T-21-01 mitigated: `fix_url()` emits only `https://`-prefixed URLs or empty string. T-21-03 mitigated: text fields stored as plain whitespace-collapsed strings. T-21-SC: no package installs.

## Known Stubs

None. All 50 records are fully populated from source data.

## Commits

- 457774b: feat(21-01): add ToolItem type and OH token unions
- 2447adc: feat(21-01): extract 50 One Health tools to content/oh-tools.json

## Self-Check: PASSED
