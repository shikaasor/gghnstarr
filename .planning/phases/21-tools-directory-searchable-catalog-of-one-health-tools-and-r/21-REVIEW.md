---
phase: 21-tools-directory-searchable-catalog-of-one-health-tools-and-r
reviewed: 2026-05-25T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - app/components/layout/Header.tsx
  - app/components/tools/ToolCard.tsx
  - app/components/tools/ToolsFilters.tsx
  - app/components/tools/ToolsGrid.tsx
  - app/lib/types.ts
  - app/tools-directory/page.tsx
  - content/oh-tools.json
  - resources/tools/extract_oh_tools.py
findings:
  critical: 2
  warning: 4
  info: 3
  total: 9
status: issues_found
---

# Phase 21: Code Review Report

**Reviewed:** 2026-05-25T00:00:00Z
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

This phase implements a searchable, paginated catalog of 50 One Health tools. The overall architecture is sound: a Server Component loads the JSON at build time and passes it to a client-side `ToolsGrid` that owns all filter and pagination state. The extraction script is well-structured and re-runnable.

Two critical issues were found. The more severe one is an unhandled exception path in the page's `readFileSync` / `JSON.parse` call that will produce an unrecoverable 500 error in production if the data file is absent or corrupt. The second is a data-type inconsistency between the `ToolItem` interface and the guard used in `ToolCard`, revealing that `year` is typed as a required `number` but the component protects it as though it were optional — indicating either the type or the guard is wrong, and actual data entries may carry a non-integer value that bypasses the TypeScript type.

Four warnings cover: a missing accessible label on the search input, a regex in the extraction script that can silently mint malformed URLs, a case-inconsistent audienceLevel value in the JSON that would surface as a display bug if audienceLevels are ever rendered, and `window.scrollTo` being called bare without a `typeof window` guard (benign today but fragile).

---

## Critical Issues

### CR-01: Unhandled exception on missing or malformed JSON file in page component

**File:** `app/tools-directory/page.tsx:15-17`

**Issue:** `readFileSync` + `JSON.parse` are called in the Server Component body with no error handling. If `content/oh-tools.json` does not exist (e.g., after a checkout without running the extraction script) or contains malformed JSON, Next.js throws an unhandled exception during rendering and returns an HTTP 500 with no informative error boundary. This will silently break the entire page in production.

**Fix:**
```typescript
let tools: ToolItem[] = [];
try {
  tools = JSON.parse(
    readFileSync(join(process.cwd(), 'content/oh-tools.json'), 'utf-8')
  ) as ToolItem[];
} catch (err) {
  // Log for server-side observability; render gracefully degraded UI
  console.error('[ToolsDirectoryPage] Failed to load oh-tools.json:', err);
  // tools stays [] — ToolsGrid will render "0 tools" rather than crashing
}
```
Alternatively, keep it throwing but add a Next.js `error.tsx` boundary in the `app/tools-directory/` segment so users see a recoverable error page instead of a raw 500.

---

### CR-02: Dead conditional guard reveals type/data contract mismatch for `year`

**File:** `app/components/tools/ToolCard.tsx:58` / `app/lib/types.ts:145`

**Issue:** `ToolItem.year` is declared as `year: number` (required, non-optional) in `types.ts`. Yet `ToolCard` guards it with `tool.year !== undefined` before rendering. TypeScript considers this check always-truthy, meaning:

1. If any record in `oh-tools.json` legitimately has no year, `year: number` in the interface is wrong — it should be `year?: number`. The guard will never fire and those records will render a missing year silently only if `year` happens to be `0` or `NaN`.
2. If `year` is genuinely required, the guard is dead code masking a data contract that has never been validated at runtime.

Inspection of `oh-tools.json` confirms all 50 entries carry an integer year, so the guard is currently dead. However the extraction script writes `int(year_val)` which will raise a Python `ValueError` if a cell contains a non-numeric string — it will NOT produce `undefined` in the JSON. The disconnect is between the TypeScript type and the defensive component code; one of them is wrong.

**Fix — Option A (year is truly required):** Remove the dead guard in `ToolCard`:
```tsx
{/* year is required per ToolItem — render unconditionally */}
<span className="text-xs text-slate-400 ml-auto">{tool.year}</span>
```

**Fix — Option B (year may be absent in future):** Make the type optional and keep the guard:
```typescript
// types.ts
year?: number;  // Some tools may not have a publication year
```
Option B is safer if the source spreadsheet has blank year cells; adjust `extract_oh_tools.py` accordingly to emit `null` / omit the field rather than throwing.

---

## Warnings

### WR-01: Search input has no accessible label

**File:** `app/components/tools/ToolsFilters.tsx:50-56`

**Issue:** The search `<input>` uses only a `placeholder` attribute for its visible hint. Placeholders are not accessible labels — they disappear when the user starts typing, have low contrast in most browsers, and are not announced correctly by all screen readers. There is no `<label>` element and no `aria-label`.

**Fix:**
```tsx
<label htmlFor="tools-search" className="sr-only">Search tools</label>
<input
  id="tools-search"
  type="text"
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
  placeholder="Search tools..."
  className="text-sm rounded border border-slate-200 px-3 py-2 w-full max-w-sm"
/>
```

---

### WR-02: Fallback URL regex in extraction script can produce syntactically invalid URLs

**File:** `resources/tools/extract_oh_tools.py:62-65`

**Issue:** The third fallback in `fix_url` uses a very broad regex `r"\b[\w.-]+\.[a-z]{2,}(?:/\S*)?"` to catch scheme-less host fragments. This will match tokens that are not URLs, for example:
- Version strings: `"v2.3"` → `"https://v2.3"`
- Decimal numbers in prose: `"1.5 per thousand"` → `"https://1.5"`
- Abbreviations with periods: `"e.g. Table"` → `"https://e.g"`

If a C13 cell contains descriptive prose rather than a URL and the first two regexes fail, this fallback silently emits a malformed URL string that will be stored in the JSON and rendered as a clickable (broken) link in `ToolCard`. There is no validation that the result is a reachable or even syntactically valid URL.

**Fix:** Add a sanity check that the matched token contains at least one forward slash or a known TLD pattern, and log a warning when the fallback fires so data anomalies are visible during extraction:
```python
m = re.search(r"\b[\w.-]+\.[a-z]{2,}(?:/\S*)?", url_val, re.IGNORECASE)
if m:
    candidate = "https://" + m.group(0).rstrip(".,;")
    # Only accept if it looks like a real host (has at least one path or known TLD)
    if re.search(r"\.[a-z]{2,}/", candidate) or re.search(r"\.[a-z]{2,}$", candidate):
        import sys
        print(f"  [fix_url] fallback regex matched '{m.group(0)}' — verify manually", file=sys.stderr)
        return candidate
return ""
```

---

### WR-03: Inconsistent casing of `audienceLevel` value in oh-tools.json

**File:** `content/oh-tools.json:710`

**Issue:** The `audienceLevels` array for the "One Health Risk Analysis System (OHRAS)" entry (row index ~34) contains `"national"` (lowercase), while every other entry in the file uses `"National"` (title case). The `ToolItem` interface types `audienceLevels` as `string[]`, so TypeScript does not catch this. If `audienceLevels` is ever rendered or used for filtering, this entry would behave differently from all others (e.g., a case-sensitive filter or sort would exclude it).

```json
// line 710 — current (wrong):
"audienceLevels": ["national"]

// should be:
"audienceLevels": ["National"]
```

**Fix:** Correct the JSON directly, and add a normalization step in `extract_oh_tools.py`'s `split_clean` function to title-case audienceLevel tokens:
```python
# After splitting audienceLevels, apply title-case normalization:
audience_levels = [t.title() for t in split_clean(ws.cell(r, 8).value)]
```
This prevents future re-extractions from reintroducing the inconsistency.

---

### WR-04: `window.scrollTo` called without environment guard

**File:** `app/components/tools/ToolsGrid.tsx:82`

**Issue:** `window.scrollTo` is called directly in `goToPage`. The file has `'use client'` at the top, so Next.js will not execute it on the server during page pre-render. However, if this component is ever unit-tested in a Node.js environment (JSDOM may not define `window.scrollTo`) or if the `'use client'` directive is accidentally removed during refactoring, this will throw a `ReferenceError: window is not defined`.

**Fix:** Guard with a `typeof window` check:
```typescript
const goToPage = (page: number) => {
  setCurrentPage(page);
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
```

---

## Info

### IN-01: `audienceLevels` field is populated in data but never surfaced in the UI or filters

**File:** `app/lib/types.ts:149` / `app/components/tools/ToolsGrid.tsx` / `app/components/tools/ToolCard.tsx`

**Issue:** `ToolItem.audienceLevels` (C8: "National", "Subnational", "International", "Regional") is extracted from the spreadsheet, typed in the interface, and stored in the JSON, but is not rendered in `ToolCard` and is not offered as a filter dimension in `ToolsGrid`/`ToolsFilters`. The data exists but is invisible to users. It is unclear whether this is intentional scoping or an oversight.

**Fix:** If the omission is intentional, add a code comment in `ToolsGrid.tsx` explaining the decision so future maintainers do not add a duplicate filter. If it should be filterable, add it analogously to `organizationLevels`.

---

### IN-02: Hardcoded tool count "50" in page hero text will go stale

**File:** `app/tools-directory/page.tsx:11` and `app/tools-directory/page.tsx:32-33`

**Issue:** The metadata description and the hero paragraph both hardcode "50" as the tool count. If the source spreadsheet is updated and new tools are added via a re-extraction, these strings will silently become incorrect. The actual count is available at runtime from `tools.length`.

**Fix:**
```tsx
// Replace hardcoded "50" in the hero paragraph:
<p className="text-teal-100 text-lg leading-relaxed">
  A searchable catalog of {tools.length} One Health tools for assessment...
</p>
```
Update the `metadata` constant similarly, or make it dynamic using `generateMetadata`.

---

### IN-03: Slug truncation in extraction script can produce visually ambiguous IDs

**File:** `resources/tools/extract_oh_tools.py:131`

**Issue:** `slugify(name)[:60]` truncates slugs at 60 characters, which can cut mid-word (e.g., `"...environmental-"` ending in a trailing hyphen — though `strip("-")` in `slugify` is called before slicing, so a leading/trailing hyphen is possible post-slice). More practically, IDs like `"international-health-regulations-ihr-monitoring-evaluation-f"` end in `"-f"`, making the ID opaque and hard to reference in code or URLs.

**Fix:** Strip trailing hyphens after the slice:
```python
base_slug = slugify(name)[:60].rstrip("-")
```
Consider increasing the limit to 80 characters to reduce truncation of meaningful ID tails.

---

_Reviewed: 2026-05-25T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
