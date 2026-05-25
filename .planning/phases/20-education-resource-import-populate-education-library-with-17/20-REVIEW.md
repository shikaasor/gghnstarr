---
phase: 20-education-resource-import-populate-education-library-with-17
reviewed: 2026-05-25T00:00:00Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - app/components/education/EducationCard.tsx
  - app/components/education/EducationFilters.tsx
  - app/components/education/EducationTabs.tsx
  - app/lib/types.ts
  - content/education.json
  - resources/tools/extract_education.py
findings:
  critical: 3
  warning: 6
  info: 3
  total: 12
status: issues_found
---

# Phase 20: Code Review Report

**Reviewed:** 2026-05-25T00:00:00Z
**Depth:** standard
**Files Reviewed:** 6
**Status:** issues_found

## Summary

This phase imports 172 records from an AMR Resource Repository spreadsheet and renders them through a filterable, paginated education library. The React components (EducationCard, EducationFilters, EducationTabs) are generally well-structured. The critical defects are concentrated in the Python extraction script and the data it produced in `content/education.json`: the `source` field is populated with full academic citations rather than organization names, the `map_region` function silently maps empty-column rows to `"All regions"` instead of omitting the field, and the `EducationCard` component renders `item.url` directly in an anchor without any validation — accepting blank or malformed URLs from the data layer. Additionally, 92% of imported records (172/187) have `["Research"]` as their only topic, making the topic filter nearly useless.

---

## Critical Issues

### CR-01: `map_region` maps empty region column to `"All regions"` instead of omitting the field

**File:** `resources/tools/extract_education.py:67-73`

**Issue:** When `region_col` is an empty string (i.e., the spreadsheet cell is blank), `(region_val or "").lower().strip()` produces `""`. `REGION_MAP.get("")` returns `None`, which triggers the `WARNING` branch and unconditionally returns `"All regions"`. This causes 9+ records in the JSON to carry `region: "All regions"` when the actual intent is "no region specified". The `WARNING` printout is also swallowed at import time (script is not run interactively on each deploy). A blank cell does not mean the resource is globally applicable — it means region is unknown. These items then appear in the Region filter under "All regions" alongside legitimate globally-scoped resources.

**Fix:**
```python
def map_region(region_val: str) -> str | None:
    key = (region_val or "").lower().strip()
    if not key:
        return None  # blank cell -> omit region entirely
    result = REGION_MAP.get(key)
    if result is None:
        print(f"WARNING: unmapped region '{region_val}' -> skipping", file=sys.stderr)
        return None
    return result
```
Then in `build_items`, only add `"region"` key when `map_region` returns a non-None value:
```python
region = map_region(region_col)
if region is not None:
    item["region"] = region
```

---

### CR-02: `source` field populated with full academic citations instead of organization name

**File:** `resources/tools/extract_education.py:93-99, 136-137` / `content/education.json` (98 of 187 records)

**Issue:** The `derive_source` function is called with `source_col` which, for imported records, contains the full academic citation string (e.g., `"Lewies, A., Du Plessis, L.H. & Wentzel, J.F. Antimicrobial Peptides: the Achilles' Heel of Antibiotic Resistance?. Probiotics & Antimicro. Prot. 11, 370-381 (2019)."`). Because `s` is non-empty, the function returns the citation verbatim. `EducationCard` renders `item.source` in a `<span>` at the top of each card — intended to display a short organization name like "WHO" or "Africa CDC". Instead, 98 cards will display a 100–508-character citation string overflowing the card header. The median `source` length for imported records is 126 characters.

**Fix:** In `build_items`, use a separate column (e.g., column index 4 as the "Sponsor/Organisation" field) for the display source, and store the full citation string in the `authors` field for publications. Alternatively, truncate or strip to just the first author institution:
```python
# Use a dedicated organisation column if available, otherwise derive from URL
source = derive_source(sponsor_org_col, url)  # sponsor_org_col is a different column
```
The `education.json` data must be regenerated or the 98 affected records manually corrected.

---

### CR-03: `EducationCard` renders `item.url` in an anchor without validation — blank or bare-DOI URLs cause broken links

**File:** `app/components/education/EducationCard.tsx:30-38`

**Issue:** The `<a href={item.url}>` anchor is rendered unconditionally. The `fix_url` function in the extraction script converts bare DOIs to `https://doi.org/{url_val}` — but only when `url_val` does not start with `http`. If `url_val` is an empty string, `fix_url` returns `""` and the anchor href becomes `""` (relative URL resolving to the current page). While the current dataset has no records with empty `url`, the schema marks `url` as `string` with no constraint, and `fix_url` explicitly handles the empty case by returning `""`. A future re-run with a spreadsheet row missing the URL column will silently produce a broken relative link.

**Fix:** Guard the title anchor and add a fallback in the component:
```tsx
{item.url ? (
  <a
    href={item.url}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-teal-700 transition-colors focus:outline-none focus-visible:underline"
  >
    {item.title}
  </a>
) : (
  <span>{item.title}</span>
)}
```
And in `fix_url`, return `null` / raise for empty URL so the extraction script rejects incomplete rows rather than emitting broken records.

---

## Warnings

### WR-01: 92% of imported records have `["Research"]` as their only topic — topic filter is effectively useless

**File:** `resources/tools/extract_education.py:146`

**Issue:** `build_items` hardcodes `"topics": ["Research"]` for every imported record (line 146). 172 of 187 records in `education.json` carry only `["Research"]` as a topic. The `EducationTabs` component derives `availableTopics` from the data and renders a topic filter row. With 172 items tagged `["Research"]` only, selecting any other topic (Stewardship, Governance, etc.) hides all imported records, and selecting "Research" shows 172 out of 172 — the filter conveys no information for the imported corpus.

**Fix:** Map the spreadsheet "Purpose" column (`row[2]`) to `TopicTag` values using a lookup table similar to `TYPE_TO_FORMAT`, or at minimum use a multi-topic default based on the `purpose` text. This requires the xlsx file to be re-processed after mapping is added.

---

### WR-02: `currentPage` is not reset when filter state changes via `onClearAll` or individual handlers if called outside the component

**File:** `app/components/education/EducationTabs.tsx:156-183`

**Issue:** Each filter change handler calls `setCurrentPage(1)` inline — this is correct. However, `onClearAll` at line 176 also calls `setCurrentPage(1)` — also correct. The issue is that the `filtered` memo is recomputed on every filter state change, but `currentPage` is NOT part of the memo dependencies. If `currentPage` is 3 and the user changes a filter that reduces `totalPages` to 2, the pagination renders `totalPages=2` pages, but `currentPage` remains 3. The `paginated` slice then computes `filtered.slice(2*12, 3*12)` which is an empty array. The "No items match" message appears even though there are matching items — they are on page 1.

**Fix:** Add a `useEffect` that resets `currentPage` to 1 whenever `filtered.length` changes in a way that would exceed `totalPages`:
```tsx
useEffect(() => {
  if (currentPage > Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))) {
    setCurrentPage(1);
  }
}, [filtered.length, currentPage]);
```
Or more simply, clamp in the paginated slice:
```tsx
const safePage = Math.min(currentPage, Math.max(1, totalPages));
const paginated = filtered.slice(
  (safePage - 1) * PAGE_SIZE,
  safePage * PAGE_SIZE
);
```

---

### WR-03: `slugify` truncates at 80 characters — different titles with the same first 80 characters share the same base slug, and the counter suffix produces fragile IDs

**File:** `resources/tools/extract_education.py:55-58, 127-133`

**Issue:** `base_slug = "amr-" + slugify(title)[:80]` truncates the slug at 80 characters after slugification. Three records in the current dataset already required counter suffixes (`-2`). If the script is re-run against a different or extended spreadsheet (or the xlsx row order changes), the counter values change — a record that was `-2` could become `-3`, breaking any external links, bookmarks, or analytics tied to those IDs. IDs are also produced from `ws.active` (the first/active worksheet), which silently processes a different sheet if the xlsx structure changes.

**Fix:** Use a content hash or DOI/URL-derived suffix instead of a sequential counter to produce stable IDs:
```python
import hashlib
base_slug = "amr-" + slugify(title)[:60]
if base_slug in seen_ids:
    # Append hash of full title for stability
    h = hashlib.md5(title.encode()).hexdigest()[:6]
    base_slug = f"{base_slug}-{h}"
```

---

### WR-04: `EducationCard` displays the DOI link even when `item.url` already points to the DOI resolver — user sees two identical links

**File:** `app/components/education/EducationCard.tsx:57-65`

**Issue:** The DOI anchor renders `https://doi.org/{item.doi}` unconditionally when `item.doi` is set. For records where `fix_url` already promoted a bare DOI to `https://doi.org/10.xxx/...` (the primary `item.url`), the card displays two identical links — the title anchor and the DOI badge. This is confirmed by the extraction script: `fix_url` converts bare DOIs to `https://doi.org/...` which becomes `item.url`, while `item.doi` is also set for publications.

**Fix:** In `EducationCard`, suppress the DOI link when `item.url` already contains the DOI:
```tsx
{item.doi && !item.url.includes(item.doi) && (
  <a href={`https://doi.org/${item.doi}`} ...>
    DOI: {item.doi}
  </a>
)}
```

---

### WR-05: `extract_year` uses the **last** year found in the citation string — may extract the journal volume year rather than publication year

**File:** `resources/tools/extract_education.py:76-80`

**Issue:** `re.findall(r"(?:19|20)\d{2}", source_val)` then `matches[-1]` takes the last year match. For citations like `"... Journal of Global Antimicrobial Resistance, Volume 21, 2020, Pages 148-153"`, the last year is `2020` which is correct. But for citations with embedded page numbers resembling years (e.g., `"... Pages 2016-2025"`) or volume years, the extracted year may be wrong. More critically, this function is only called with `source_col` (the citation text), which is the correct column for year extraction — however, the `description` column (`row[3]`) is available and may contain a more reliable year. This is a data quality risk rather than a crash, but incorrect years corrupt the year filter.

**Fix:** Extract year from a dedicated year/date column in the spreadsheet if one exists, and fall back to regex on the citation only when the dedicated column is empty. At minimum, validate that the extracted year is plausible (1990–current year):
```python
def extract_year(source_val: str) -> int | None:
    matches = re.findall(r"(?:19|20)\d{2}", source_val or "")
    for year in reversed(matches):
        y = int(year)
        if 1990 <= y <= 2026:
            return y
    return None
```

---

### WR-06: `aria-selected` used on `<button>` without `role="tab"` — invalid ARIA usage

**File:** `app/components/education/EducationTabs.tsx:132-133`

**Issue:** The tab buttons use `aria-selected={activeTab === tab}` but the elements have no `role="tab"` attribute. `aria-selected` is only valid on elements with roles `option`, `row`, `tab`, `treeitem`, or `gridcell`. A plain `<button>` does not have `role="tab"` by default, so `aria-selected` is ignored by assistive technologies. Screen readers will not announce which tab is currently active.

**Fix:**
```tsx
<button
  key={tab}
  role="tab"
  aria-selected={activeTab === tab}
  onClick={() => handleTabClick(tab)}
  ...
>
```
Also wrap the tab bar `<div>` with `role="tablist"`.

---

## Info

### IN-01: `'use client'` directive is on `EducationTabs` but not on `EducationCard` or `EducationFilters` — harmless but asymmetric

**File:** `app/components/education/EducationTabs.tsx:1`

**Issue:** `EducationTabs` is a client component (uses `useState`, `useEffect`, `useMemo`) and correctly marks itself `'use client'`. `EducationCard` and `EducationFilters` are pure presentational components with no hooks — they will automatically be treated as client components because they are imported by a client component. No `'use client'` directive is needed on them, and they have none. This is correct behavior; noting for awareness.

**Fix:** No change needed. Optionally add a comment above each component noting it is intentionally a server-renderable presentational component.

---

### IN-02: 20 training items lack a `platform` field — `EducationCard` silently shows nothing for the "via {platform}" line

**File:** `content/education.json` (20 records) / `app/components/education/EducationCard.tsx:70-72`

**Issue:** `EducationCard` renders `<p>via {item.platform}</p>` only when `item.tab === 'training' && item.platform`. 20 of the training items have no `platform` field (confirmed by analysis). The UI silently omits the line — this is the intended defensive rendering — but the missing data means users cannot identify where to access 20 training resources.

**Fix:** Add platform values for the 20 affected records in `education.json`, or add a fallback display in `EducationCard`:
```tsx
{item.tab === 'training' && (
  <p className="text-xs text-slate-500">
    via {item.platform ?? 'platform not specified'}
  </p>
)}
```

---

### IN-03: Script prints debug output (`print(len(items))`, `print(items[0])`) at runtime

**File:** `resources/tools/extract_education.py:162-163`

**Issue:** The `__main__` block contains `print(len(items))` and `print(items[0])` debug prints that fire on every execution. While the script is a one-shot tool, these lines produce raw dict output alongside the final summary message, which is confusing and may leak internal data structure details in CI logs.

**Fix:** Remove lines 162-163 or wrap in a `--verbose` flag:
```python
if __name__ == "__main__":
    items = build_items()
    # debug removed: print(len(items)); print(items[0])
    with open(CURATED_PATH, encoding="utf-8") as f:
        curated = json.load(f)
    combined = curated + items
    ...
```

---

_Reviewed: 2026-05-25T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
