# Phase 20: Education Resource Import — Research

**Researched:** 2026-05-25
**Domain:** Data extraction (Excel → typed JSON) + content schema mapping
**Confidence:** HIGH (all findings verified directly against the source xlsx and existing codebase)

## Summary

Phase 20 imports 172 AMR resource records from `resources/tools/AMR Resource Repository.xlsx` into `content/education.json`, replacing the 15 placeholder `EducationItem` records seeded in Phase 16. The Excel file is a single sheet (`Sheet1`, A1:H173 — 1 header + **172 data rows**, exactly matching the phase goal). All eight columns were profiled directly. The data is **clean UTF-8** (no corruption — the `?`/`�` glyphs seen in raw dumps are correct curly-quotes/accented chars that simply render poorly in a terminal; `json.dumps` emits proper `’` escapes). Every row has a non-empty name, description, and URL; only 18 rows lack a Source string and 12 rows store a bare DOI instead of an `http(s)` URL. [VERIFIED: openpyxl read of source xlsx]

The **central challenge is not extraction — it is schema mapping.** The `EducationItem` TypeScript type (app/lib/types.ts) uses **closed enums** that the spreadsheet does not contain: `audiences` (3 values), `format` (6 values), `topics` (8 values), plus a **required `year: number`** field. The spreadsheet has **no audience column, no topic column, and no year column**, and its `Type`/`Purpose` columns are free-text with 22 and 43 distinct messy values respectively. It also carries **two columns the type has no home for — `Description` and `Region`** — yet the phase goal explicitly requires both to appear on each card. This means Phase 20 cannot be a pure mechanical dump; it requires (a) a deterministic mapping layer from free-text Type/Purpose → the closed enums, (b) a strategy for the missing `year`, and (c) a type extension to carry `description` and `region`. Plan 20-02 in the roadmap already anticipates adding a region filter dimension.

**Primary recommendation:** Write a one-shot Python extraction script (openpyxl + pandas are already installed) that reads the xlsx, applies an explicit Type→format and Region→region mapping table, derives `year` from the Source string where present (falls back to a sentinel), defaults `audiences`/`topics` conservatively, and writes `content/education.json`. Run it **manually once at plan time** — NOT at build time — because the source is a static one-off file and the existing page reads JSON at build via `readFileSync`. Extend `EducationItem` with optional `description?: string` and `region?: WHORegion` fields plus a `WHORegion` union type.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Excel → JSON extraction | Build-time / offline script | — | One-off tooling; runs once on a developer machine, output committed to git. Not a runtime concern. |
| Type→enum mapping logic | Build-time / offline script | — | Deterministic transform applied during extraction; result is frozen in JSON. |
| education.json read | Frontend Server (Next.js Server Component) | — | `app/education/page.tsx` already reads via `readFileSync` at build time (static export). |
| Filter/pagination UI | Browser / Client | — | `EducationTabs.tsx` is `'use client'`; derives filter options from items array at runtime. |
| Region filter (new) | Browser / Client | — | Plan 20-02 adds region as a fourth/fifth filter dimension to the existing client-side filter logic. |

## Data Source Analysis

**File:** `resources/tools/AMR Resource Repository.xlsx`
**Structure:** 1 sheet (`Sheet1`), range A1:H173 = 1 header row + 172 data rows. [VERIFIED: openpyxl]

### Columns (verbatim headers)

| Col | Header | Maps to EducationItem | Notes |
|-----|--------|----------------------|-------|
| A | `Resource name` | `title` | 0 blanks. 2 duplicate names (different URLs — keep both). |
| B | `Type (book, website, paper...)` | `format` (via mapping) | 0 blanks. **22 distinct free-text values** — needs mapping table. |
| C | `Purpose (training material, database, …)` | informs `tab` + `topics` | **1 blank**. 43 distinct free-text values. |
| D | `Description (max 100 words)` | **`description` (NEW field)** | 0 blanks. 3–165 words (median 27). |
| E | `Source` | `source` + `year` derivation | **18 blanks**. Free-text citation; year embeddable. |
| F | `Accessible from` | `url` | 0 blanks. **12 rows are bare DOIs** (no `http`). |
| G | `Region (indicate the most applicable WHO region)` | **`region` (NEW field)** | 0 blanks. 7 clean values — effectively an enum. |
| H | `Global use (Yes/No)` | (optional metadata / drop) | 0 blanks. 153 Yes / 19 No. |

### Distinct values for enum-like columns [VERIFIED: full 172-row profile]

**Type (col B) — 22 distinct, maps to `ContentFormat`:**
| Source Type values | → ContentFormat |
|---------------------|-----------------|
| Journal Paper (62), Journal article (24), Article (5), Preprint paper (1), Paper (1), Conference Paper (1), Patent (1) | `Publication` (papers) / `Article` (web articles) — see mapping note |
| Website (35) | `Article` |
| Online course (14), Online Course (1) | `Course` |
| Toolkit (7), Document (4), Report (2), Report - Public Health Agency of Canada (4), Report pending (1), Guide (1), Poster (2), Book (1), E-book (1), Book chapter (1) | `Download` |
| Mobile application (2) | `Download` (or `Article`) |
| Video (1) | `Video` |

**Purpose (col C) — 43 distinct free-text values.** Too granular to map to the 8-value `TopicTag` enum reliably. Recommend NOT deriving `topics` from Purpose mechanically; default all imported items to a single safe topic (e.g. `['AMR Surveillance']` or `['Research']`) or leave topic-tagging as a documented manual follow-up. The 43 values cluster loosely as Research (54), Training (16), Educational material (15), Review (11) — useful only for the training/resources `tab` split.

**Region (col G) — 7 distinct, clean — becomes the new `WHORegion` enum:**
| Value | Count |
|-------|-------|
| European Region (EURO) | 49 |
| Region of the Americas (PAHO) | 47 |
| African Region (AFRO) | 39 |
| Eastern Mediterranean Region (EMRO) | 11 |
| All regions | 9 |
| Western Pacific Region (WPRO) | 9 |
| South-East Asia Region (SEARO) | 8 |

**Global use (col H):** 153 Yes / 19 No — binary, no blanks.

### Sample row (row 2) [VERIFIED]
- name: "Antimicrobial Peptides: the Achilles' Heel of Antibiotic Resistance?"
- type: "Journal Paper" → `Publication`
- purpose: "Review"
- description: 100-word review of AMPs combating AMR
- source: "Lewies, A., Du Plessis, L.H. & Wentzel, J.F. … Probiotics & Antimicro. Prot. 11, 370–381 (2019)." → year 2019
- url: "https://link.springer.com/article/10.1007%2Fs12602-018-9465-0"
- region: "African Region (AFRO)"
- global use: "Yes"

## EducationItem Type Matching

Current type (app/lib/types.ts:74–91):

| Field | Required | Excel coverage | Action |
|-------|----------|----------------|--------|
| `id` | yes | none | Generate slug from title (deduplicate by appending index). |
| `tab` | yes | none directly | Derive: Online course / Training purpose → `training`; else `resources`. ~15 training items, ~157 resources. |
| `title` | yes | col A | Direct copy. |
| `audiences` | yes | none | **No audience data in Excel.** Default to a conservative value — recommend `['Healthcare Worker']` for research/clinical, `['Policymaker']` for toolkits/reports, `['General Public']` for awareness. Needs a default rule or `[ASSUMED]` flag. |
| `format` | yes | col B | Map via Type table above. |
| `topics` | yes | (col C loosely) | **Recommend a single default topic** — Purpose is too messy for the 8-value enum. |
| `year` | yes (number) | **none — 110/172 derivable from Source regex** | Regex `(19|20)\d{2}` on Source string; 62 rows have no extractable year. Need sentinel/fallback (see Pitfall 2). |
| `source` | yes (string) | col E | 18 blanks — fallback to publisher from URL host or `"Unknown"`. |
| `sourceVerified` | yes (bool) | none | Default `false` (links not yet click-tested) or `true` if a verification pass is run. **Decision needed.** |
| `url` | yes | col F | 12 bare DOIs → prefix `https://doi.org/`. |
| `platform?` | optional | none | Leave undefined or derive from Source for courses. |
| `authors?` / `journal?` / `doi?` | optional | parseable from Source for Publications | Best-effort; can defer. |
| **`description`** | **MISSING** | col D | **Add `description?: string` to type.** Phase goal requires it on cards. |
| **`region`** | **MISSING** | col G | **Add `region?: WHORegion` + `WHORegion` union.** Phase goal + Plan 20-02 require it. |

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Python | 3.14.3 | Run extraction script | Already installed [VERIFIED: `python --version`] |
| openpyxl | 3.1.5 | Read xlsx cell values | Already installed; pure-Python, reliable for .xlsx [VERIFIED: import check] |
| pandas | 3.0.1 | (optional) tabular cleaning | Already installed [VERIFIED: import check] |

No new packages required. `xlsx` (SheetJS for Node) is **NOT installed** [VERIFIED: require failed] — do not add it; Python toolchain is already present and sufficient.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Python script | Node `xlsx` (SheetJS) | Would require a new dependency; SheetJS moved off npm registry (self-hosted CDN) — extra supply-chain friction. Python is already available. |
| One-shot script | Build-time codegen | Source is a static one-off file; build-time parsing adds xlsx dependency to the build with zero benefit. JSON committed to git is simpler and reviewable. |

## Package Legitimacy Audit

> No external packages are installed in this phase. openpyxl (3.1.5) and pandas (3.0.1) are pre-existing in the local Python environment and are not added to the project's `package.json`. No npm/PyPI install occurs. Audit not applicable — **no packages to vet.**

## Import Strategy Recommendation

**Recommended: one-shot Python script, run manually once, output committed.**

1. Script reads xlsx with `openpyxl.load_workbook(..., data_only=True)`.
2. For each of 172 rows, build an `EducationItem` object:
   - `id`: slugify(title); on collision append `-2`, `-3`.
   - `tab`: `training` if Type contains "course" OR Purpose contains "Training"; else `resources`.
   - `title`: col A.
   - `format`: lookup against the explicit Type→format map; unmapped → `Download` (safe default).
   - `topics`: `['Research']` default (do not parse Purpose); flag as `[ASSUMED]`.
   - `audiences`: rule-based default by format/purpose; flag as `[ASSUMED]`.
   - `year`: regex on Source; fallback sentinel (see Pitfall 2).
   - `source`: col E or fallback.
   - `sourceVerified`: per decision (recommend `false`).
   - `url`: col F; if no `http` prefix, wrap as `https://doi.org/<value>`.
   - `description`: col D (NEW).
   - `region`: map col G to `WHORegion` (NEW).
3. `json.dump(items, f, ensure_ascii=False, indent=2)` → `content/education.json`.
4. Run `next build` to confirm the 172-item JSON type-checks against the extended `EducationItem`.

**Scope decision (Research Question 4):** Import **only the 172 AMR Repository records** in Phase 20. The One Health Tools Inventory (990 resources) is explicitly a **separate phase — Phase 21 (Tools Directory)** per the roadmap, targeting a distinct `/tools-directory` page and `content/oh-tools.json`. Do NOT mix them. [VERIFIED: ROADMAP.md Phase 21]

**Build-time vs manual (Research Question 7):** Manual once. The page already consumes JSON at build via `readFileSync` (app/education/page.tsx:15). Adding xlsx parsing to the build is unnecessary and would add a dependency. [VERIFIED: page.tsx]

## Data Quality Assessment

| Issue | Rows affected | Severity | Handling |
|-------|---------------|----------|----------|
| No `year` column; only 110/172 have a year in Source | 62 missing | HIGH (year is required) | Regex extract; sentinel fallback. Decision needed. |
| Bare DOI in URL (no scheme) | 12 | MEDIUM | Prefix `https://doi.org/`. |
| Blank Source | 18 | LOW | Fallback to URL host or "Unknown". |
| Free-text Type (22 variants) | all | MEDIUM | Explicit mapping table; default `Download`. |
| Free-text Purpose (43 variants) | all | MEDIUM | Do not map to topics; use only for tab split. |
| No audience data at all | all 172 | HIGH | Rule-based default; flag `[ASSUMED]`. |
| 2 duplicate resource names | 2 | LOW | Keep both (distinct URLs); dedupe slug IDs. |
| 1 blank Purpose | 1 | LOW | Default to `resources` tab. |
| Encoding | none | NONE | Confirmed clean UTF-8. |
| `sourceVerified` unknown | all 172 | MEDIUM | No links click-tested. Recommend default `false`. |

**No duplicate URLs. No blank titles, descriptions, or URLs.** [VERIFIED]

## Common Pitfalls

### Pitfall 1: Treating the `�` glyphs as data corruption
**What goes wrong:** A reader sees `Achilles�` in a terminal dump and "fixes" encoding, corrupting valid curly-quotes.
**Why it happens:** Terminal can't render U+2019/accented chars; the bytes are correct UTF-8 (`\xe2\x80\x99`).
**How to avoid:** Use `json.dump(..., ensure_ascii=False)` and trust openpyxl's decoded strings. Verify with `json.dumps(s)` → emits `’`. [VERIFIED]

### Pitfall 2: Required `year` field with 62 missing values
**What goes wrong:** `year: number` is non-optional; 62 rows have no extractable year. Inserting `null`/`undefined` breaks the type and the `availableYears` filter logic in EducationTabs.tsx:62.
**Why it happens:** Excel has no year column; Source strings are inconsistent.
**How to avoid:** Three options — (a) make `year` optional and have the year filter skip undefined; (b) use a sentinel like `0` and hide it in the card/filter; (c) hand-fill the 62 from URLs. Recommend (a) — cleanest for filter UX. **This is a planner decision and a likely discuss-phase question.**

### Pitfall 3: Mechanically mapping 43 Purpose strings to 8 TopicTags
**What goes wrong:** Forced fuzzy mapping produces wrong topic tags on cards (e.g. "Patent" → "Policy").
**How to avoid:** Default all to one neutral topic; treat richer topic-tagging as out of scope / manual follow-up. Flag `[ASSUMED]`.

### Pitfall 4: Pagination at 172 items with PAGE_SIZE 12
**What goes wrong:** EducationTabs renders one numbered button per page (TabsTabs.tsx:175) → ~13 page buttons in resources tab; visually cramped but functional.
**How to avoid:** Not blocking, but note for the planner — Plan 20-02's filter additions help users narrow. Consider compact pagination if it looks bad in visual verification.

## Runtime State Inventory

This is a data-import phase that overwrites a committed JSON file — not a rename/refactor. The only "state" considerations:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | `content/education.json` (15 placeholder items) is fully replaced by 172 imported items. | Overwrite file; commit. The 15 placeholders are higher-quality (real audiences/topics/years) — **decision: discard them or merge/append?** Recommend discard (phase goal says "replacing the 15 placeholder items"). |
| Live service config | None — static JSON in repo. | None. |
| OS-registered state | None. | None — verified, no schedulers/services involved. |
| Secrets/env vars | None. | None — no external API or credentials. |
| Build artifacts | `next build` static export regenerates from JSON. | Re-run `next build` to confirm 172 items type-check and render. |

## Code Examples

### Extraction skeleton (verified imports/structure)
```python
# Source: openpyxl 3.1.5 (verified installed), pattern verified against this xlsx
import openpyxl, json, re

wb = openpyxl.load_workbook('resources/tools/AMR Resource Repository.xlsx', data_only=True)
rows = list(wb['Sheet1'].iter_rows(values_only=True))[1:]  # skip header, 172 rows

TYPE_TO_FORMAT = {
    'Journal Paper': 'Publication', 'Journal article': 'Publication',
    'Online course': 'Course', 'Online Course': 'Course',
    'Website': 'Article', 'Video': 'Video',
    # ... toolkit/report/book/etc -> 'Download'
}
REGION_MAP = {  # col G is already clean; pass through to WHORegion union
    'African Region (AFRO)': 'AFRO', 'European Region (EURO)': 'EURO',
    'Region of the Americas (PAHO)': 'PAHO', 'Eastern Mediterranean Region (EMRO)': 'EMRO',
    'Western Pacific Region (WPRO)': 'WPRO', 'South-East Asia Region (SEARO)': 'SEARO',
    'All regions': 'All regions',
}
YEAR_RE = re.compile(r'(19|20)\d{2}')

def to_url(v):
    s = str(v).strip()
    return s if s.lower().startswith('http') else f'https://doi.org/{s}'

# build items, json.dump(..., ensure_ascii=False, indent=2)
```

### Proposed type extension (app/lib/types.ts)
```typescript
export type WHORegion =
  | 'AFRO' | 'EURO' | 'PAHO' | 'EMRO' | 'WPRO' | 'SEARO' | 'All regions';

export interface EducationItem {
  // ...existing fields...
  description?: string;   // Phase 20: from AMR Repository "Description" column
  region?: WHORegion;     // Phase 20: WHO region; Plan 20-02 adds region filter
}
```

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python | extraction script | ✓ | 3.14.3 | — |
| openpyxl | read xlsx | ✓ | 3.1.5 | pandas.read_excel |
| pandas | optional cleaning | ✓ | 3.0.1 | openpyxl alone |
| Node/npm | `next build` verification | ✓ (project builds) | project-pinned | — |
| Node `xlsx` (SheetJS) | (not used) | ✗ | — | Python toolchain (preferred) |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None blocking — Python path is fully available.

## Validation Architecture

> `.planning/config.json` not inspected for `nyquist_validation`; this phase is a data import with no unit-testable logic beyond the one-shot script. Validation is primarily build + visual.

### Phase Requirements → Test Map
| Behavior | Test Type | Command |
|----------|-----------|---------|
| 172 items present and valid JSON | smoke | `node -e "console.log(require('./content/education.json').length)"` → expect 172 |
| JSON type-checks against EducationItem | build | `next build` (TypeScript strict) |
| Cards render with title/format/audience/region/description/link | manual | Visual verification on `/education` |
| Region filter works (Plan 20-02) | manual | Visual verification |

### Wave 0 Gaps
- None — no test framework changes needed. Validation is `next build` + the count smoke check + human visual sign-off (consistent with prior phases' checkpoint pattern).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `audiences` defaulted by rule (no source data) | Type Matching | Cards show wrong audience tags; filter mis-segments. **Discuss-phase question.** |
| A2 | `topics` defaulted to single neutral value | Type Matching / Pitfall 3 | Topic filter becomes low-value for imported items. |
| A3 | `year` made optional with fallback for 62 rows | Pitfall 2 | If kept required, build fails or sentinel pollutes year filter. **Discuss-phase question.** |
| A4 | `sourceVerified: false` default (links not click-tested) | Type Matching | All 172 cards show "Source unverified" flag — may look alarming. **Discuss-phase question.** |
| A5 | 15 placeholder items discarded, not merged | Runtime State | Loss of higher-quality curated entries if discard is wrong call. |
| A6 | Type→format mapping (Website→Article, papers→Publication) | Data Source | Some cards get a slightly-off format badge. |

## Open Questions

1. **Required `year` for 62 yearless rows** — make optional, sentinel, or hand-fill? Recommend make `year?` optional. (HIGH priority — blocks build otherwise.)
2. **`sourceVerified` default** — `false` flags all 172 as unverified (visually loud). A verification pass is out of scope for one phase. Recommend `false` + note, or `true` with a disclaimer.
3. **Audience assignment** — no source data; accept rule-based defaults or leave a single default audience? Affects the primary filter dimension.
4. **Keep or discard the 15 curated placeholders** — phase goal says "replacing", recommend discard, but those 15 have real audiences/topics/years the 172 lack.
5. **Description display** — phase goal requires description on cards, but `EducationCard.tsx` currently renders no description. Plan must add a description block to the card (out of the literal Plan 20-01 scope, belongs in 20-01 or 20-02).

## Sources

### Primary (HIGH confidence)
- `resources/tools/AMR Resource Repository.xlsx` — full 172-row profile via openpyxl 3.1.5 (headers, distinct enum values, blank counts, URL/year analysis, encoding check)
- `app/lib/types.ts` — EducationItem definition (lines 74–91), ContentFormat/TopicTag/AudienceType enums
- `app/components/education/{EducationCard,EducationFilters,EducationTabs}.tsx` — consuming UI; confirms `description`/`region` not yet rendered/filtered
- `app/education/page.tsx` — build-time `readFileSync` JSON consumption
- `content/education.json` — current 15-item structure
- `.planning/ROADMAP.md` — Phase 20 (172 records) and Phase 21 (One Health 990 tools — separate phase) scope boundary

## Metadata

**Confidence breakdown:**
- Data source analysis: HIGH — every cell profiled directly from the xlsx
- Type matching: HIGH — type read verbatim; mismatches are factual (no audience/topic/year/description/region columns)
- Import strategy: HIGH — toolchain availability verified; build-time consumption confirmed in code
- Audience/topic/year mapping: MEDIUM — extraction is certain, the *defaults* are judgment calls (see Assumptions Log)

**Research date:** 2026-05-25
**Valid until:** 2026-06-24 (stable — local file + committed code; only changes if the xlsx is replaced)
