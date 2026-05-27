---
phase: 21-tools-directory-searchable-catalog-of-one-health-tools-and-r
fixed_at: 2026-05-27T00:00:00Z
review_path: .planning/phases/21-tools-directory-searchable-catalog-of-one-health-tools-and-r/21-REVIEW.md
iteration: 1
findings_in_scope: 6
fixed: 6
skipped: 0
status: all_fixed
---

# Phase 21: Code Review Fix Report

**Fixed at:** 2026-05-27T00:00:00Z
**Source review:** `.planning/phases/21-tools-directory-searchable-catalog-of-one-health-tools-and-r/21-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 6
- Fixed: 6
- Skipped: 0

## Fixed Issues

### CR-01: Unhandled exception on missing or malformed JSON file in page component

**Files modified:** `app/tools-directory/page.tsx`
**Commit:** 76e2573
**Applied fix:** Wrapped `readFileSync` + `JSON.parse` in a try-catch block. `tools` is initialised as an empty array before the try; if the file is absent or malformed, the error is logged to stderr and the page renders gracefully with 0 tools instead of returning an HTTP 500.

---

### CR-02: Dead conditional guard reveals type/data contract mismatch for `year`

**Files modified:** `app/lib/types.ts`
**Commit:** 2e2f6a3
**Applied fix:** Changed `year: number` to `year?: number` in the `ToolItem` interface (Option B from review). This aligns the TypeScript type with the existing `tool.year !== undefined` guard already present in `ToolCard`, eliminating the always-truthy dead condition. The extraction script continues to emit integer years; if a future data import lacks a year value the component will silently omit the year display rather than breaking.

---

### WR-01: Search input has no accessible label

**Files modified:** `app/components/tools/ToolsFilters.tsx`
**Commit:** 18026a6
**Applied fix:** Added a visually hidden `<label htmlFor="tools-search" className="sr-only">Search tools</label>` immediately before the input, and added `id="tools-search"` to the input element so the label association is explicit. Screen readers will now announce the field purpose when focused.

---

### WR-02: Fallback URL regex in extraction script can produce syntactically invalid URLs

**Files modified:** `resources/tools/extract_oh_tools.py`
**Commit:** 50ef607
**Applied fix:** The third fallback in `fix_url` now builds a `candidate` string and validates it with two secondary regexes before accepting it: `re.search(r"\.[a-z]{2,}/", candidate)` (has a path after TLD) OR `re.search(r"\.[a-z]{2,}$", candidate)` (ends with a TLD). False-positive tokens like `"v2.3"` or `"e.g"` that pass the first broad regex but fail both secondary checks are discarded and `""` is returned. When the fallback does fire and accept a candidate, it emits a warning to stderr so data anomalies are visible during extraction runs.

---

### WR-03: Inconsistent casing of `audienceLevel` value in oh-tools.json

**Files modified:** `content/oh-tools.json`, `resources/tools/extract_oh_tools.py`
**Commit:** 6f0b68c
**Applied fix:** Corrected `"national"` to `"National"` on line 710 of `oh-tools.json` (OHRAS entry). Added `.title()` normalization in `build_items` of the extraction script (`audience_levels = [t.title() for t in split_clean(...)]`) so future re-extractions cannot reintroduce the inconsistency.

---

### WR-04: `window.scrollTo` called without environment guard

**Files modified:** `app/components/tools/ToolsGrid.tsx`
**Commit:** b3e43a5
**Applied fix:** Wrapped `window.scrollTo(...)` in `if (typeof window !== 'undefined') { ... }` inside `goToPage`. This makes the component safe in Node.js unit-test environments (JSDOM without `window.scrollTo`) and resilient against accidental removal of the `'use client'` directive in future refactors.

---

_Fixed: 2026-05-27T00:00:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
