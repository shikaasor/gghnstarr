# Phase 21: Tools Directory — Pattern Map

**Mapped:** 2026-05-25
**Files analyzed:** 7 (5 new, 2 modified)
**Analogs found:** 7 / 7 (every file has an exact analog — this phase is a near-clone of Phases 16 + 20)

## File Classification

| New/Modified File | New/Mod | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|---------|------|-----------|----------------|---------------|
| `resources/tools/extract_oh_tools.py` | NEW | build script | batch / transform (xlsx→JSON) | `resources/tools/extract_education.py` | exact (same idiom, same dir) |
| `content/oh-tools.json` | NEW | data | file-I/O (build artifact) | `content/education.json` | exact (output of the script) |
| `app/lib/types.ts` | EDIT | model / types | n/a | existing `EducationItem` block (lines 52–103) | exact |
| `app/components/tools/ToolsGrid.tsx` | NEW | component (client) | event-driven (filter/search state) | `app/components/education/EducationTabs.tsx` | role-match (tabless variant) |
| `app/components/tools/ToolCard.tsx` | NEW | component (presentational) | request-response (render props) | `app/components/education/EducationCard.tsx` | exact |
| `app/components/tools/ToolsFilters.tsx` | NEW | component (presentational) | event-driven (chip toggles) | `app/components/education/EducationFilters.tsx` | exact |
| `app/tools-directory/page.tsx` | NEW | route (RSC) | file-I/O → render | `app/education/page.tsx` | exact |
| `app/components/layout/Header.tsx` | EDIT | layout / nav | n/a | existing `navLinks` array (lines 9–20) | exact (append one entry) |

## Pattern Assignments

### `resources/tools/extract_oh_tools.py` (build script, batch/transform)

**Analog:** `resources/tools/extract_education.py`

**Module docstring + imports + path constants** (lines 1–16):
```python
"""
Extraction script: AMR Resource Repository.xlsx -> content/education.json
One-shot, re-runnable. Committed for provenance.
"""

import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

import openpyxl

XLSX_PATH = Path(__file__).parent / "AMR Resource Repository.xlsx"
OUTPUT_PATH = Path(__file__).parent.parent.parent / "content" / "education.json"
```
> Adapt: `XLSX_PATH = Path(__file__).parent / "Table 1_One Health Tools Inventory_13Feb2024_ohjpa_Annex2_v4-1.xlsx"`, `OUTPUT_PATH = ... / "content" / "oh-tools.json"`. Tools have no curated baseline, so drop the `CURATED_PATH` machinery (lines 17–18, 206–211) — the JSON is 100% script-generated.

**slugify helper** (lines 88–92) — copy verbatim:
```python
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text
```

**fix_url helper** (lines 120–127) — copy and extend for messy C13 (bare `www.`/host with no scheme — see RESEARCH Pitfall 2):
```python
def fix_url(url_val: str) -> str:
    url_val = (url_val or "").strip()
    if not url_val:
        return ""
    if url_val.lower().startswith("http"):
        return url_val
    # Bare DOI
    return f"https://doi.org/{url_val}"
```
> Adapt: add a regex to pull the first `https?://…` or `www\.…` out of prose, and prefix bare `www.`/host with `https://`; return `""` if none found. Reuse the lowercase-startswith guard.

**Row-loop + dedup-by-slug + build-dict pattern** (lines 139–198) — this is the core. Note the **whitespace-collapse** that RESEARCH mandates is NOT in the education script (it uses plain `.strip()`); add a `clean()` helper (`re.sub(r"\s+", " ", str(v).strip())`) for the multi-line C1/C3 cells (RESEARCH Pitfall 4):
```python
def build_items() -> list[dict]:
    wb = openpyxl.load_workbook(XLSX_PATH, data_only=True)
    ws = wb.active   # ADAPT: ws = wb["Table 1 OHHLEP Tools Inventory"]
    rows = list(ws.iter_rows(min_row=2, values_only=True))   # ADAPT: iterate range(3, 53) — see below

    seen_ids: set[str] = set()
    items: list[dict] = []
    for row in rows:
        title = (str(row[0]) if row[0] is not None else "").strip()
        ...
        base_slug = "amr-" + slugify(title)[:60]    # ADAPT prefix to "oh-" or none
        slug = base_slug
        if slug in seen_ids:
            h = hashlib.md5(title.encode()).hexdigest()[:6]
            slug = f"{base_slug}-{h}"
        seen_ids.add(slug)
        ...
        items.append(item)
    return items
```
> **CRITICAL adaptation (RESEARCH Pitfall 1):** Do NOT use `iter_rows(min_row=2)` — footnote rows 54–64 would leak in. Iterate `for r in range(3, 53):` reading `ws.cell(r, col).value`, OR guard on `year is not None`. Expected record count = exactly 50.
> Comma-combined cells C4/C5/C8/C9 must be `.split(",")` + normalized into arrays per the `ToolItem` token unions.

**`__main__` block** (lines 201–217) — copy the count-print + write idiom, but DROP the curated-merge (tools have no curated file):
```python
if __name__ == "__main__":
    items = build_items()
    print(len(items))           # MUST print 50 (validation gate)
    print(items[0])
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        f.write("\n")
```

---

### `app/tools-directory/page.tsx` (route, RSC — file-I/O → render)

**Analog:** `app/education/page.tsx` (clone in full)

**Imports + readFileSync data load** (lines 1–17) — copy structure exactly:
```tsx
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import EducationTabs from '@/components/education/EducationTabs';   // → ToolsGrid
import type { EducationItem } from '@/lib/types';                  // → ToolItem

export const metadata: Metadata = { title: '...', description: '...' };

export default function EducationPage() {
  const items: EducationItem[] = JSON.parse(
    readFileSync(join(process.cwd(), 'content/education.json'), 'utf-8')
  );
```
> Adapt: import `ToolsGrid` from `@/components/tools/ToolsGrid`, `ToolItem` type, read `content/oh-tools.json`, prop name `tools`.

**Hero + content section markup** (lines 19–46) — copy verbatim (teal-600 hero band, badge pill, serif h1, then `bg-slate-50` section wrapping the grid):
```tsx
<main>
  <section className="bg-teal-600 text-white py-14">
    <Container>
      <div className="max-w-2xl">
        <span className="inline-block bg-white/20 ... rounded-full mb-4 uppercase tracking-wide">Education Library</span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">AMR Learning Resources</h1>
        <p className="text-teal-100 text-lg leading-relaxed">...</p>
      </div>
    </Container>
  </section>
  <section className="py-14 bg-slate-50">
    <Container><EducationTabs items={items} /></Container>
  </section>
</main>
```
> Adapt copy text to tools; replace `<EducationTabs items=...>` with `<ToolsGrid tools={tools} />`.

---

### `app/components/tools/ToolsGrid.tsx` (client component, event-driven)

**Analog:** `app/components/education/EducationTabs.tsx` — clone the state/filter/grid/pagination machinery but **STRIP the tab machinery** (RESEARCH anti-pattern: tools have no training/resources split).

**`'use client'` + state declarations** (lines 1–32) — keep filter state arrays, DROP `activeTab`/`useEffect` hash sync (lines 15–25, 34–44) and `tabItems` derivation (lines 47–50). Replace the five education filter dimensions with the three tool dimensions + a new search string:
```tsx
'use client';
import { useState, useMemo } from 'react';
import type { ToolItem, OHOrganizationLevel, OHAudienceType, OHScope } from '@/lib/types';
import ToolCard from './ToolCard';
import ToolsFilters from './ToolsFilters';

const PAGE_SIZE = 12;  // optional — 50 items; pagination reusable but not required (A3)
// state: selectedOrgLevels, selectedAudienceTypes, selectedScopes, searchQuery, currentPage
```

**available-options useMemo** (lines 52–75) — copy the `[...new Set(items.flatMap(...))].sort()` idiom per dimension (operate over `items`, not `tabItems`).

**Core filter useMemo — OR-within / AND-across** (lines 78–96) — this is the load-bearing pattern to copy. Each dimension is `selected.length === 0 || selected.some(x => item.field.includes(x))`:
```tsx
const filtered = useMemo(() => {
  return tabItems.filter((item) => {
    const audienceMatch =
      selectedAudiences.length === 0 ||
      selectedAudiences.some((a) => item.audiences.includes(a));
    const formatMatch =
      selectedFormats.length === 0 || selectedFormats.includes(item.format);
    ...
    return audienceMatch && formatMatch && topicMatch && yearMatch && regionMatch;
  });
}, [tabItems, selectedAudiences, ...]);
```
> **NET-NEW (RESEARCH Pattern 3):** add a `searchMatch` term inside this same useMemo — `searchQuery === '' || [item.name, item.organization, item.description].join(' ').toLowerCase().includes(searchQuery.toLowerCase())` — and AND it with the rest. This controlled `<input>` is the only logic not already in the repo.

**Pagination block** (lines 98–124, 209–245) — copy verbatim if desired: `safePage` clamp, windowed `pageNumbers`, Prev/Next buttons. (Optional for 50 items — A3.)

**Result count + grid + empty-state** (lines 189–206) — copy verbatim, swap `EducationCard`→`ToolCard`, `item`→`tool`:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {paginated.map((item) => (<EducationCard key={item.id} item={item} />))}
</div>
{paginated.length === 0 && (<p className="text-slate-500 text-sm py-8 text-center">No items match the selected filters.</p>)}
```

**Filter wiring** (lines 148–187) — copy the `onXChange` setters that also `setCurrentPage(1)` and `onClearAll`. Add an `onSearchChange` + clear-search into `onClearAll`.

---

### `app/components/tools/ToolCard.tsx` (presentational component, render-props)

**Analog:** `app/components/education/EducationCard.tsx`

**Card shell + url-or-span title pattern** (lines 7–42) — copy verbatim. The `item.url ? <a> : <span>` guard directly solves RESEARCH Pitfall 2 (missing URLs):
```tsx
<div className="group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
  <div className="flex items-center justify-between gap-2">
    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{item.source}</span>
    {/* badge */}
  </div>
  <h3 className="font-serif font-semibold text-navy-950 text-sm leading-snug">
    {item.url ? (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 ...">{item.title}</a>
    ) : (<span>{item.title}</span>)}
  </h3>
```
> Adapt: `item.source`→`item.organization`, `item.title`→`item.name`. **Keep `rel="noopener noreferrer"`** (RESEARCH Security: untrusted external tool links).

**line-clamp description** (lines 44–49) — copy verbatim; solves RESEARCH Pitfall 5 (197–2047 char descriptions):
```tsx
{item.description && (
  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
)}
```

**Footer tag/badge/year row** (lines 86–103) — copy the `mt-auto flex flex-wrap` pattern; map education's `audiences`/`region`/`year` chips onto tools' `audienceTypes`/`organizationLevels`/`year`:
```tsx
<div className="mt-auto flex flex-wrap items-center gap-2">
  {item.audiences.map((a) => (<span key={a} className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium">{a}</span>))}
  {item.year !== undefined && (<span className="text-xs text-slate-400 ml-auto">{item.year}</span>)}
</div>
```
> Drop the Publication/DOI/platform/sourceVerified blocks (lines 51–83) — not applicable to tools.

---

### `app/components/tools/ToolsFilters.tsx` (presentational component, event-driven chips)

**Analog:** `app/components/education/EducationFilters.tsx`

**`toggleValue` generic helper** (lines 24–28) — copy verbatim:
```tsx
function toggleValue<T>(current: T[], value: T): T[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}
```

**`hasActiveFilters` derivation** (lines 48–53) — copy, adapt to the 3 tool dimensions (+ search).

**Per-dimension chip-row block** (lines 57–79, repeated) — copy this exact block once per dimension (Organization Level, Audience Type, Scope). Selected chip = `bg-teal-600 text-white`, unselected = `bg-slate-100 text-slate-600 hover:bg-slate-200`:
```tsx
{audiences.length > 0 && (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Audience</span>
    <div className="flex flex-wrap gap-2">
      {audiences.map((audience) => (
        <button key={audience} onClick={() => onAudienceChange(toggleValue(selectedAudiences, audience))}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            selectedAudiences.includes(audience) ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          {audience}
        </button>
      ))}
    </div>
  </div>
)}
```

**Clear-filters button** (lines 178–185) — copy verbatim.
> **NET-NEW:** add a controlled search `<input>` above the chip rows (no education analog). Style to match (`text-sm`, rounded border, `border-slate-200`); optional lucide `Search` icon (RESEARCH Standard Stack — only if planner wants it).

---

### `app/lib/types.ts` (model/types — EDIT)

**Analog:** the existing Phase 16/20 `Education*` token unions + `EducationItem` interface (lines 52–103). Append a new Phase 21 block in the same style. RESEARCH provides the verified token unions:
```ts
// Phase 21: One Health Tools Directory
export type OHOrganizationLevel = 'Quadripartite' | 'National' | 'International/Regional' | 'NGO' | 'Academic';
export type OHAudienceType = 'Multisectoral' | 'Policymakers' | 'Animal health' | 'Laboratory' | 'Environment' | 'Public health';
export type OHScope = 'Assessment' | 'Implementation' | 'Monitoring' | 'Action Plans' | 'Prioritisation';

export interface ToolItem {
  id: string;
  name: string;
  year: number;
  organization: string;
  organizationLevels: OHOrganizationLevel[];
  scopes: OHScope[];
  audienceLevels: string[];
  audienceTypes: OHAudienceType[];
  description: string;
  url: string;
}
```
> Follow existing convention: union types above the interface, inline `// field` comments, no default export. Place after the `NewsArticle` block (end of file, line 118).

---

### `app/components/layout/Header.tsx` (layout/nav — EDIT)

**Analog:** the existing `navLinks` array (lines 9–20). Append one entry between `Education` and `News` (or wherever planner decides). No other change — both desktop (line 43, `gap-6`) and mobile renderers map over the same array:
```tsx
const navLinks = [
  ...
  { href: '/education', label: 'Education' },
  { href: '/tools-directory', label: 'Tools' },   // ← NEW
  { href: '/news', label: 'News' },
  ...
];
```
> RESEARCH note: this becomes the 11th link; desktop nav uses `gap-6` and is hidden below `md`. Flag spacing for the 21-03 visual checkpoint.

## Shared Patterns

### External-link safety
**Source:** `EducationCard.tsx` lines 31–36
**Apply to:** `ToolCard.tsx` (every `target="_blank"` anchor)
```tsx
<a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 transition-colors focus:outline-none focus-visible:underline">
```
Mitigates tab-nabbing on untrusted spreadsheet URLs (RESEARCH Security Domain). React auto-escapes text, so no `dangerouslySetInnerHTML`.

### Filter combination logic (OR-within / AND-across)
**Source:** `EducationTabs.tsx` lines 78–96
**Apply to:** `ToolsGrid.tsx` `filtered` useMemo
Each dimension: `selected.length === 0 || selected.some(x => item.field.includes(x))`; all dimensions ANDed. Extend with the search `.toLowerCase().includes()` term.

### Chip toggle + immutable update
**Source:** `EducationFilters.tsx` lines 24–28 (`toggleValue<T>`)
**Apply to:** `ToolsFilters.tsx` (all chip rows)

### Brand visual tokens
**Source:** `education/page.tsx` (teal-600 hero, `bg-slate-50` content section, `Container`) + `EducationFilters`/`EducationCard` (teal-600 active chip, `bg-slate-100` idle, `rounded-full`, `line-clamp-3`)
**Apply to:** all new tools components — reuse verbatim for visual consistency.

### Whitespace-collapse on extraction
**Source:** NOT in `extract_education.py` (it uses plain `.strip()`) — net-new helper required.
**Apply to:** `extract_oh_tools.py` every text field (C1 name, C3 org) — `re.sub(r"\s+", " ", str(v).strip())` (RESEARCH Pitfall 4).

## No Analog Found

Two pieces of logic have no existing analog and must be built from RESEARCH guidance (not copied):

| Item | Role | Data Flow | Reason |
|------|------|-----------|--------|
| Free-text search `<input>` + `searchMatch` term | component | event-driven | Phase 16/20 had filters but no text search (RESEARCH Pattern 3 / State of the Art) |
| Whitespace-collapse `clean()` helper + multi-line cell handling | build script | transform | education script used plain `.strip()`; tools cells contain embedded `\n` (RESEARCH Pitfall 4) |
| Messy-URL regex extraction (prose + bare `www.`) | build script | transform | `fix_url` only handles http/bare-DOI; tools C13 needs scheme-less host + buried-URL handling (RESEARCH Pitfall 2) |

## Metadata

**Analog search scope:** `app/education/`, `app/components/education/`, `app/components/layout/`, `resources/tools/`, `app/lib/`
**Files scanned:** 7 analogs (all named explicitly in RESEARCH — no codebase search needed; direct reads)
**Pattern extraction date:** 2026-05-25
