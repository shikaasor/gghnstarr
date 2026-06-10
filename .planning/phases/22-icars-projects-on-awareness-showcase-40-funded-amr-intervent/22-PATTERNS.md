# Phase 22: ICARS Projects on Awareness - Pattern Map

**Mapped:** 2026-05-27
**Files analyzed:** 6 (4 new, 2 edit — Filters optional)
**Analogs found:** 6 / 6 (all exact — Phase 21 is a 1:1 blueprint)

This phase is a near-clone of Phase 21 (Tools Directory). Every new file has an exact-role
analog already shipped in `app/components/tools/`, `resources/tools/`, and `app/tools-directory/`.
Prefer transplanting the cited real code over RESEARCH.md skeletons.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `resources/tools/extract_icars_projects.py` | extraction script (build-time) | transform / file-I/O (xlsx → JSON) | `resources/tools/extract_oh_tools.py` | exact |
| `content/icars-projects.json` | data file (build artifact) | static data | `content/oh-tools.json` | exact |
| `app/lib/types.ts` (EDIT) | type definitions | n/a | existing `ToolItem` + `OHScope` block (lines 120-153) | exact |
| `app/components/awareness/IcarsProjectCard.tsx` | component (presentational) | request-response (SSR) | `app/components/tools/ToolCard.tsx` | exact |
| `app/components/awareness/IcarsProjectsSection.tsx` | component (client, stateful) | event-driven (filter state) | `app/components/tools/ToolsGrid.tsx` | exact |
| `app/components/awareness/IcarsProjectFilters.tsx` (OPTIONAL) | component (presentational) | event-driven | `app/components/tools/ToolsFilters.tsx` | exact |
| `app/awareness/page.tsx` (EDIT) | route / RSC | request-response (build-time JSON load) | `app/tools-directory/page.tsx` | exact (load pattern) |

> Note: Phase 21 split filters into `ToolsFilters.tsx`. ICARS has a SINGLE filter dimension (sector),
> so the planner MAY inline the chip row into `IcarsProjectsSection.tsx` and skip `IcarsProjectFilters.tsx`.
> Both are codebase-consistent. Pattern blocks below cover either choice.

## Pattern Assignments

### `resources/tools/extract_icars_projects.py` (extraction script, transform)

**Analog:** `resources/tools/extract_oh_tools.py`

**Module docstring + imports + path constants** (lines 1-21):
```python
"""
Extraction script: <source> xlsx -> content/oh-tools.json
One-shot, re-runnable, idempotent. Committed for provenance.
"""

import hashlib
import json
import re
from pathlib import Path

import openpyxl

XLSX_PATH = Path(__file__).parent / "<file>.xlsx"
OUTPUT_PATH = Path(__file__).parent.parent.parent / "content" / "oh-tools.json"
```
> Copy verbatim; change `XLSX_PATH` to `"International Center for Antimicrobial Resistance Solutions.xlsx"`
> and `OUTPUT_PATH` to `content/icars-projects.json`.

**`clean()` whitespace helper** (lines 28-30) — copy verbatim:
```python
def clean(v) -> str:
    """Collapse embedded newlines / runs of whitespace to single spaces."""
    return re.sub(r"\s+", " ", str(v).strip()) if v is not None else ""
```

**`slugify()`** (lines 33-37) — copy verbatim:
```python
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text
```

**Token-canonicalization dict idiom** (lines 79-91) — adapt to `SECTOR_CANON` per RESEARCH Pitfall 4:
```python
# Phase 21 canonicalizes source casing/spelling variants to the verified token
# unions in app/lib/types.ts. Keys are lowercased.
TOKEN_CANON = {
    "prioritising": "Prioritisation",
    "implementation": "Implementation",
    # ...
}
# Phase 22 equivalent (RESEARCH lines 276-284):
# SECTOR_CANON = {"humans": "Humans", "one health": "One Health",
#   "terrestrial and aquatic animals": "Terrestrial and Aquatic Animals",
#   "food and feed": "Food and Feed", "enviroment": "Environment", "environment": "Environment"}
```

**Build loop: load + per-row clean + slug-dedup + append dict** (lines 116-162):
```python
def build_items() -> list[dict]:
    wb = openpyxl.load_workbook(XLSX_PATH, data_only=True)
    ws = wb["Table 1 OHHLEP Tools Inventory"]
    seen_ids: set[str] = set()
    items: list[dict] = []
    for r in range(3, 53):
        name = clean(ws.cell(r, 1).value)
        year_val = ws.cell(r, 2).value
        if not name or year_val is None:        # defense-in-depth row guard
            continue
        # ... per-column clean/split ...
        base_slug = slugify(name)[:60]           # md5-suffix dedup keeps IDs stable
        slug = base_slug
        if slug in seen_ids:
            h = hashlib.md5(name.encode()).hexdigest()[:6]
            slug = f"{base_slug}-{h}"
        seen_ids.add(slug)
        items.append({ "id": slug, ... })
    return items
```
> Phase 22 divergences (from RESEARCH): (1) iterate `range(2, ws.max_row + 1)`; (2) detect
> country-header rows and carry `current_country` down (Pitfalls 1 & 3 — check BOTH C1 and C2);
> (3) skip rows with no title; (4) `sector` may be `None` (Pitfall 5).

**Main guard + count gate + JSON write** (lines 165-171) — copy verbatim, change assertion to 25:
```python
if __name__ == "__main__":
    items = build_items()
    print(len(items))                 # Phase 21: 50 | Phase 22: MUST print 25 (NOT 40 — RESEARCH Pitfall 2)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        f.write("\n")
```
> Invoke with `python` (not `python3`) on this Windows machine — RESEARCH Environment note.

---

### `app/lib/types.ts` — EDIT (append IcarsSector union + IcarsProject interface)

**Analog:** existing Phase 21 block (lines 120-153). Mirror its structure exactly — a phase comment,
a string-literal union per categorical field, then the interface with inline `// Cn` source-column comments:
```ts
// Phase 21: One Health Tools Directory
// Token unions verified by openpyxl distinct-value scan of the 50 Table 1 data rows.
export type OHScope =
  | 'Assessment' | 'Implementation' | 'Monitoring' | 'Action Plans' | 'Prioritisation';

export interface ToolItem {
  id: string;                                  // slug from name
  name: string;                                // C1 (whitespace-collapsed)
  year?: number;                               // C2 (optional)
  // ...
  url: string;                                 // C13 (cleaned; '' if none)
}
```
> Append (do NOT modify the existing block). Use `IcarsSector` union (5 normalized values) and
> `IcarsProject` interface from RESEARCH lines 349-365. Note `sector?: IcarsSector` and
> `fundingAmount?: string` are OPTIONAL per Pitfalls 5 & A2; `outcomes: string[]` per Pitfall 7.

---

### `app/components/awareness/IcarsProjectCard.tsx` (component, presentational SSR)

**Analog:** `app/components/tools/ToolCard.tsx`

**Type-only import + props interface + default export** (lines 1-8):
```tsx
import type { ToolItem } from '@/lib/types';

interface ToolCardProps {
  tool: ToolItem;
}

export default function ToolCard({ tool }: ToolCardProps) {
```
> No `'use client'` — this is a presentational Server Component. Path alias is `@/lib/types`,
> default export, named props interface.

**Card shell + uppercase meta row + serif title** (lines 9-31):
```tsx
<div className="group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
  <div className="flex items-center justify-between gap-2">
    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
      {tool.organization}
    </span>
  </div>
  <h3 className="font-serif font-semibold text-navy-950 text-sm leading-snug">
    {/* ... */}
  </h3>
```
> Map: `tool.organization` → `project.country` (uppercase meta row). `tool.name` → `project.title`.
> ICARS has NO url column (RESEARCH Security), so render title as plain `<span>`, dropping the
> `tool.url ? <a> : <span>` branch (lines 19-30).

**Conditional description with line-clamp** (lines 34-38) — copy, swap field:
```tsx
{tool.description && (
  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
    {tool.description}
  </p>
)}
```

**Footer pill row + teal badge** (lines 41-61) — the badge pattern for sector (Pitfall 5: guard undefined):
```tsx
<div className="mt-auto flex flex-wrap items-center gap-2">
  {tool.audienceTypes.map((audience) => (
    <span key={audience} className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium">
      {audience}
    </span>
  ))}
  {/* outline-style pill variant: */}
  <span className="text-xs px-2 py-0.5 rounded-full border border-slate-300 text-slate-500 font-medium">{level}</span>
</div>
```
> For the sector badge use the conditional-render guard idiom (mirrors `tool.year !== undefined`):
> `{project.sector && <span className={SECTOR_STYLES[project.sector]}>...}` so the empty-sector
> ZAMBIA row (Pitfall 5) renders no badge. `SECTOR_STYLES` color map per RESEARCH Pattern 3 (A1, discretion).
> Render `outcomes: string[]` as mapped `<li>` items (RESEARCH Pitfall 7 / Security — never `dangerouslySetInnerHTML`).

---

### `app/components/awareness/IcarsProjectsSection.tsx` (component, client, stateful)

**Analog:** `app/components/tools/ToolsGrid.tsx`

**'use client' + hooks import + props + state** (lines 1-19):
```tsx
'use client';

import { useState, useMemo } from 'react';
import type { ToolItem, OHOrganizationLevel, OHAudienceType, OHScope } from '@/lib/types';
import ToolCard from './ToolCard';
import ToolsFilters from './ToolsFilters';

interface ToolsGridProps {
  tools: ToolItem[];
}

const PAGE_SIZE = 12;

export default function ToolsGrid({ tools }: ToolsGridProps) {
  const [selectedScopes, setSelectedScopes] = useState<OHScope[]>([]);
  // ...
```
> Phase 22: ONE state array — `const [selectedSectors, setSelectedSectors] = useState<IcarsSector[]>([])`.
> Pagination is OPTIONAL (25 items < PAGE_SIZE → omit, per RESEARCH "Don't Hand-Roll" / A5).

**Derive available options from data set** (lines 22-33) — adapt to single dimension:
```tsx
const availableScopes = useMemo(
  () => [...new Set(tools.flatMap((t) => t.scopes))].sort() as OHScope[],
  [tools]
);
```
> Phase 22 sector is a single value, not an array — use `.map((p) => p.sector).filter(Boolean)`:
> `[...new Set(projects.map((p) => p.sector).filter(Boolean))].sort() as IcarsSector[]`.

**Filter memo (OR-within / AND-across)** (lines 36-55) — simplify to one dimension (RESEARCH Pattern 2):
```tsx
const filtered = useMemo(() => {
  return tools.filter((tool) => {
    const scopeMatch = selectedScopes.length === 0 || selectedScopes.some((x) => tool.scopes.includes(x));
    return scopeMatch && /* other dims */;
  });
}, [tools, selectedScopes, /* ... */]);
```
> Phase 22 (sector is a single string, not array): `selectedSectors.length === 0 || selectedSectors.includes(p.sector)`
> — use `.includes(p.sector)`, NOT `.some()` (RESEARCH Pattern 2, lines 155-163).

**Result count + responsive grid + empty state** (lines 124-140) — copy, swap noun:
```tsx
<p className="text-slate-500 text-sm mb-6">
  {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}
  {filtered.length !== tools.length && ` (filtered from ${tools.length})`}
</p>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {paginated.map((tool) => (<ToolCard key={tool.id} tool={tool} />))}
</div>
{paginated.length === 0 && (
  <p className="text-slate-500 text-sm py-8 text-center">No tools match the selected filters.</p>
)}
```
> Swap `tool`/`tools` → `project`/`projects`; render `IcarsProjectCard key={project.id}`.
> If pagination omitted, map `filtered` directly instead of `paginated`.

---

### `app/components/awareness/IcarsProjectFilters.tsx` (OPTIONAL — component, presentational)

**Analog:** `app/components/tools/ToolsFilters.tsx`

**Generic immutable toggle helper** (lines 21-25) — copy verbatim (RESEARCH "Don't Hand-Roll"):
```tsx
function toggleValue<T>(current: T[], value: T): T[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}
```

**Chip-row pattern with active/inactive styling** (lines 60-82) — copy one block per dimension:
```tsx
{organizationLevels.length > 0 && (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Organization Level</span>
    <div className="flex flex-wrap gap-2">
      {organizationLevels.map((level) => (
        <button
          key={level}
          onClick={() => onOrgLevelChange(toggleValue(selectedOrgLevels, level))}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            selectedOrgLevels.includes(level)
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  </div>
)}
```
> Phase 22: ONE chip row (sector). May inline directly into `IcarsProjectsSection` and skip this file.

---

### `app/awareness/page.tsx` — EDIT (route / RSC, build-time JSON load)

**Analog:** `app/tools-directory/page.tsx` (load pattern) + the existing awareness page itself (layout).

**Build-time JSON load with graceful try/catch** (`tools-directory/page.tsx` lines 1-24) — RESEARCH Pattern 1:
```tsx
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ToolItem } from '@/lib/types';

export default function ToolsDirectoryPage() {
  let tools: ToolItem[] = [];
  try {
    tools = JSON.parse(
      readFileSync(join(process.cwd(), 'content/oh-tools.json'), 'utf-8')
    ) as ToolItem[];
  } catch (err) {
    console.error('[ToolsDirectoryPage] Failed to load oh-tools.json:', err);
    // tools stays [] — grid renders "0 tools" rather than crashing
  }
```
> Add `readFileSync`/`join` imports + the `IcarsProject` type import + this try/catch (renamed
> `[AwarenessPage]`, `content/icars-projects.json`) inside the existing `AwarenessPage()` body
> (RESEARCH lines 371-384). The awareness page currently has NO `readFileSync` import — add it.

**Section wrapper convention** (existing `awareness/page.tsx` lines 250-262, the "AMR Explained" section):
```tsx
<section className="py-16 bg-white">
  <Container>
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-950 mb-2">
      AMR Interventions Funded by ICARS
    </h2>
    <p className="text-slate-600 text-sm mb-8">
      Real-world projects tackling antimicrobial resistance across the One Health spectrum.
    </p>
    <IcarsProjectsSection projects={icarsProjects} />
  </Container>
</section>
```
> `Container` is a NAMED import: `import { Container } from '@/components/layout/Container'` (already present).
> The new client component is a DEFAULT import. Append the section AFTER the "AMR Explained" `</section>`
> (after line 262), inside `<main>` (RESEARCH A4 — placement is layout discretion).

## Shared Patterns

### Type-only path-alias imports
**Source:** `ToolCard.tsx` line 1, `ToolsGrid.tsx` line 4
**Apply to:** All new `.tsx` files
```tsx
import type { ToolItem } from '@/lib/types';
```
> Alias is `@/` → `app/`. Use `import type` for type-only imports. Default-export components.

### Graceful build-time data load
**Source:** `app/tools-directory/page.tsx` lines 15-24
**Apply to:** `app/awareness/page.tsx` edit
```tsx
let data: T[] = [];
try { data = JSON.parse(readFileSync(join(process.cwd(), 'content/<file>.json'), 'utf-8')) as T[]; }
catch (err) { console.error('[Page] Failed to load <file>.json:', err); }
```
> Never let a missing JSON crash the build — empty array degrades to "0 results".

### Tailwind v4 token vocabulary (no new deps)
**Source:** `ToolCard.tsx` / `ToolsFilters.tsx` / `awareness/page.tsx`
**Apply to:** All components — match existing palette
- Cards: `bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5`
- Teal pill: `bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium`
- Active chip: `bg-teal-600 text-white`; inactive: `bg-slate-100 text-slate-600 hover:bg-slate-200`
- Headings: `font-serif ... font-bold text-navy-950`; meta: `text-slate-400 uppercase tracking-wide`

### XSS-safe text rendering
**Source:** project convention (React auto-escape) + RESEARCH Security
**Apply to:** `IcarsProjectCard` (description, outcomes, funder text)
> Render all xlsx-sourced text via `{value}` interpolation or mapped `<li>`. NEVER use
> `dangerouslySetInnerHTML`. For multi-line outcomes, prefer a `string[]` mapped to `<li>` or
> `whitespace-pre-line` CSS (RESEARCH Pitfall 7).

### Extraction-script idioms
**Source:** `resources/tools/extract_oh_tools.py`
**Apply to:** `extract_icars_projects.py`
> `clean()` (l.28-30), `slugify()` (l.33-37), `TOKEN_CANON`→`SECTOR_CANON` (l.79-91),
> md5-suffix slug dedup (l.138-145), `print(len(items))` count gate (l.167), UTF-8 `json.dump`
> with `ensure_ascii=False, indent=2` + trailing newline (l.169-171). Run with `python` on Windows.

## No Analog Found

None. Every Phase 22 file has an exact-role Phase 21 analog. Country header-row carry-down
(Pitfalls 1 & 3) is the only logic with no direct analog — it is novel extraction code, but the
surrounding script scaffolding (load/clean/slug/write) is transplanted verbatim from `extract_oh_tools.py`.

## Metadata

**Analog search scope:** `app/components/tools/`, `app/components/awareness/`, `resources/tools/`,
`app/tools-directory/`, `app/awareness/`, `app/lib/types.ts`, `content/`
**Files scanned:** 7 read in full (ToolCard, ToolsGrid, ToolsFilters, extract_oh_tools.py,
tools-directory/page.tsx, awareness/page.tsx, types.ts) + content/ JSON inventory
**Pattern extraction date:** 2026-05-27
