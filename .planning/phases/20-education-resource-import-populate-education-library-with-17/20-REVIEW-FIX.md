---
phase: 20-education-resource-import-populate-education-library-with-17
fixed_at: 2026-05-25T00:00:00Z
review_path: .planning/phases/20-education-resource-import-populate-education-library-with-17/20-REVIEW.md
iteration: 1
findings_in_scope: 9
fixed: 7
skipped: 2
status: partial
---

# Phase 20: Code Review Fix Report

**Fixed at:** 2026-05-25T00:00:00Z
**Source review:** .planning/phases/20-education-resource-import-populate-education-library-with-17/20-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 9 (3 Critical + 6 Warning)
- Fixed: 7
- Skipped: 2

**Note on worktree isolation:** The standard isolated-worktree approach failed due to a Windows long-path limitation in this repository (a file path exceeding the OS `MAX_PATH` limit prevents `git worktree add` from completing). All fixes were applied and committed directly on `main` instead. Each fix is still an atomic commit.

---

## Fixed Issues

### CR-01: `map_region` maps empty region column to "All regions" instead of omitting the field

**Files modified:** `resources/tools/extract_education.py`
**Commit:** a106a0a
**Applied fix:** Changed `map_region` return type to `str | None`. Added early-return `None` for blank keys. Changed unmapped-region fallback from returning `"All regions"` to returning `None`. In `build_items`, extracted `map_region` call into a `region` variable and added it to the item dict only when non-None, replacing the unconditional `"region": map_region(region_col)` inline assignment.

---

### CR-03: `EducationCard` renders `item.url` in an anchor without validation

**Files modified:** `app/components/education/EducationCard.tsx`
**Commit:** 350cf42
**Applied fix:** Wrapped the title anchor in a conditional: renders `<a href={item.url}>` only when `item.url` is truthy, falling back to a `<span>` for blank or missing URLs. This prevents blank strings from becoming broken relative links pointing at the current page.

---

### WR-01: 92% of imported records have `["Research"]` as their only topic

**Files modified:** `resources/tools/extract_education.py`
**Commit:** 53ea118
**Applied fix:** Added `PURPOSE_TO_TOPICS` lookup table mapping lowercase purpose keywords (stewardship, governance, surveillance, one health, diagnostics, awareness, policy, research, etc.) to lists of `TopicTag` values. Added `map_topics(purpose_val)` function that tries exact match then substring match before falling back to `["Research"]`. Updated `build_items` to use `map_topics(purpose)` instead of the hardcoded `["Research"]` literal. The xlsx file must be re-run through the script for existing records to receive updated topic tags.

---

### WR-02: `currentPage` not reset when filter state changes reduce `totalPages`

**Files modified:** `app/components/education/EducationTabs.tsx`
**Commit:** 2e28cb6
**Applied fix:** Derived a `safePage = Math.min(currentPage, totalPages)` constant immediately after computing `totalPages` (which now uses `Math.max(1, ...)` to avoid division-edge issues). All downstream pagination logic (paginated slice, pageNumbers useMemo, prev/next disabled checks, active page highlight) now uses `safePage` instead of `currentPage` directly. This ensures stale page state from a prior filter can never produce an empty results slice.

---

### WR-03: `slugify` truncates at 80 chars — sequential counter produces fragile IDs

**Files modified:** `resources/tools/extract_education.py`
**Commit:** 9ebfd94
**Applied fix:** Added `import hashlib` at the top. Reduced slug truncation from 80 to 60 characters to leave room for the hash suffix. Changed the slug-collision resolution from a `while` counter loop to a single hash-based suffix: `slug = f"{base_slug}-{hashlib.md5(title.encode()).hexdigest()[:6]}"`. IDs are now stable regardless of row order on re-runs.

---

### WR-04: DOI badge duplicated when `item.url` already resolves to the same DOI

**Files modified:** `app/components/education/EducationCard.tsx`
**Commit:** 4c0b0af
**Applied fix:** Changed the DOI anchor condition from `item.doi &&` to `item.doi && !item.url?.includes(item.doi) &&`. This suppresses the secondary DOI badge when the primary URL already contains the DOI string (e.g., when `fix_url` promoted a bare DOI to `https://doi.org/10.xxx/...`).

---

### WR-05: `extract_year` takes last regex match — page ranges can produce wrong year

**Files modified:** `resources/tools/extract_education.py`
**Commit:** 14837bd
**Applied fix:** Changed `extract_year` to iterate `reversed(matches)` and validate each candidate with a `1990 <= y <= 2026` plausibility check before returning. Returns the first candidate that passes validation, returning `None` if none pass. This filters out page-range numbers that happen to match the `19xx`/`20xx` pattern.

---

### WR-06: `aria-selected` used on `<button>` without `role="tab"` — invalid ARIA

**Files modified:** `app/components/education/EducationTabs.tsx`
**Commit:** fc1c30f
**Applied fix:** Added `role="tablist"` to the tab bar container `<div>` and `role="tab"` to each tab `<button>`. `aria-selected` is now valid because the buttons have the `tab` role, allowing screen readers to correctly announce which tab is active.

---

## Skipped Issues

### CR-02: `source` field populated with full academic citations instead of organization name

**File:** `resources/tools/extract_education.py:93-99, 136-137` / `content/education.json`
**Reason:** The fix requires identifying which spreadsheet column index holds the sponsor/organisation name separately from the citation text. However, `source_col` is already column index 4 (the only source-adjacent column mapped in the script). The review suggests "use a separate column (e.g., column index 4 as the 'Sponsor/Organisation' field)" but that IS the current source_col. Without access to the actual xlsx file to inspect its column layout, applying this fix risks reading the wrong column and silently producing incorrect source values for all 187 records. The review acknowledges "the education.json data must be regenerated or the 98 affected records manually corrected." This fix requires a human to inspect the xlsx column headers and supply the correct column index before it can be safely applied.
**Original issue:** 98 of 187 cards display 100-508 character academic citation strings in the `source` span intended for short organization names like "WHO" or "Africa CDC".

---

_Fixed: 2026-05-25T00:00:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
