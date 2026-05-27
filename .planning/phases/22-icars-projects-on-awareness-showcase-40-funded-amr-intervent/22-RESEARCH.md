# Phase 22: ICARS Projects on Awareness - Research

**Researched:** 2026-05-27
**Domain:** Static Next.js content data layer + filterable card grid (xlsx → JSON → React)
**Confidence:** HIGH (near-clone of Phase 21; xlsx structure inspected directly with openpyxl)

## Summary

Phase 22 adds an "AMR Interventions" section to the existing `/awareness` page, showing ICARS-funded
projects as sector-filterable cards. This is architecturally a **near-clone of Phase 21 (Tools Directory)**:
extract an xlsx into a typed `content/*.json`, define a `*Item` interface + token unions in `app/lib/types.ts`,
and build a presentational card + a stateful client filter grid following the exact patterns already shipped in
`app/components/tools/`. The Phase 21 `21-PATTERNS.md` file is the single best blueprint — every component has a
1:1 analog.

The **one material divergence from the ROADMAP** is the source data. I inspected
`resources/tools/International Center for Antimicrobial Resistance Solutions.xlsx` directly. The ROADMAP says
"40 projects" — this is the **raw data-row count (40 rows = rows 2-41)**, NOT the project count. The sheet
interleaves **country header rows** (a country name in an otherwise-empty row) with **project rows** beneath
them. After carrying the country down to its projects, the file contains **25 projects across 15 countries**,
one of which has an empty sector. The sector vocabulary is also richer than the ROADMAP's "Humans / Animals /
Environment" — the actual values are `Humans`, `One Health`, `Terrestrial and Aquatic Animals`, `Food and Feed`,
and `Enviroment` (sic — a typo in the source that must be normalized). These facts change the data model
(country is derived, not a flat column) and the filter UI (5 normalized sectors, not 3).

**Primary recommendation:** Clone the Phase 21 stack verbatim (extraction script idiom, `ToolItem`-style
interface, `ToolCard`/`ToolsGrid`/`ToolsFilters` trio) but adapt the extraction to **carry the country header
down to subsequent project rows** and normalize the 5 sectors. Render the result as a new `IcarsProjectsSection`
appended to the bottom of `app/awareness/page.tsx` (which is a Server Component) — read the JSON at build time
and pass it as a prop to the client filter component.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| xlsx → JSON extraction | Build-time script (Python/openpyxl) | — | One-shot, re-runnable, committed for provenance — matches Phase 20/21 |
| Data load | Frontend Server (RSC) | — | `app/awareness/page.tsx` reads `content/icars-projects.json` via `readFileSync` at build (static export) |
| Sector filtering | Browser / Client | — | Interactive `useState` filter — must be a `'use client'` component |
| Card rendering | Frontend Server (SSR) | Browser | Presentational; rendered server-side, hydrated for interactivity |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| openpyxl | 3.1.5 | Read xlsx in extraction script | [VERIFIED: `python -c import openpyxl` → 3.1.5 installed]; already used by `extract_oh_tools.py` and `extract_education.py` |
| next | 16.2.1 | Static export, RSC, routing | [VERIFIED: package.json] existing framework |
| react / react-dom | 19.2.4 | Client filter component | [VERIFIED: package.json] |
| typescript | ^5 | Typed `IcarsProject` interface | [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^1.6.0 | Optional icons (sector badge / search) | [VERIFIED: package.json] — only if planner wants iconography; Phase 21 filters shipped without icons |
| tailwindcss | ^4.2.2 | All styling | [VERIFIED: package.json] |

**No new dependencies required.** This phase installs nothing — both Python (openpyxl) and all npm
packages are already present.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| openpyxl | pandas | pandas not installed; openpyxl is the established repo idiom — do not introduce pandas |
| New standalone `/icars` route | Section on existing `/awareness` | ROADMAP + phase goal explicitly say "section on /awareness page below existing sections" — do NOT create a new route |

**Installation:** None. Verify the toolchain only:
```bash
python -c "import openpyxl; print(openpyxl.__version__)"   # → 3.1.5
node --version                                              # → v24.14.0
```

## Package Legitimacy Audit

> Not applicable — this phase installs **zero** new packages. All tooling (openpyxl 3.1.5,
> next 16.2.1, react 19.2.4, lucide-react 1.6.0) is already present and was used by the
> immediately-prior Phase 21. slopcheck gate is moot: no install step exists.

| Package | Registry | Disposition |
|---------|----------|-------------|
| (none — no new installs) | — | N/A |

## Architecture Patterns

### System Architecture Diagram

```
resources/tools/International Center for Antimicrobial Resistance Solutions.xlsx
        │  (build-time, one-shot, manually run + committed)
        ▼
resources/tools/extract_icars_projects.py   ── openpyxl ──┐
        │  carry-down country header → project rows        │
        │  normalize 5 sectors, clean whitespace,          │
        │  collapse multi-line OUTCOMES, split funders      │
        ▼                                                   │
content/icars-projects.json   (25 typed IcarsProject records)
        │
        │  (build time — readFileSync in RSC)
        ▼
app/awareness/page.tsx  (Server Component)
        │  import IcarsProjectsSection, read JSON, pass as prop
        ▼
<IcarsProjectsSection projects={...} />   ('use client')
        │  useState: selectedSectors[]
        ├──► IcarsProjectFilters  (sector chip toggles)  ──► onChange
        └──► filtered.map ──► IcarsProjectCard  (country, sector badge,
                                                  title, description excerpt,
                                                  outcomes, funding partners)
```

### Recommended Project Structure
```
resources/tools/
  └── extract_icars_projects.py        # NEW — adapt extract_oh_tools.py
content/
  └── icars-projects.json              # NEW — 25 records, script output
app/lib/types.ts                       # EDIT — append IcarsSector union + IcarsProject interface
app/components/awareness/
  ├── IcarsProjectCard.tsx             # NEW — analog of ToolCard.tsx
  ├── IcarsProjectsSection.tsx         # NEW — analog of ToolsGrid.tsx (client, stateful)
  └── IcarsProjectFilters.tsx          # NEW — analog of ToolsFilters.tsx (optional: can inline into Section)
app/awareness/page.tsx                 # EDIT — read JSON, append section below "AMR Explained"
```
> Note: Phase 21 split filters into a separate `ToolsFilters.tsx`. For a single-dimension sector filter,
> the planner may inline the chip row directly into `IcarsProjectsSection` to reduce file count. Either is
> consistent with the codebase. The `21-PATTERNS.md` filter block is copy-pasteable either way.

### Pattern 1: Build-time JSON load in a Server Component
**What:** The awareness page is already a Server Component (no `'use client'`). It reads JSON synchronously at build.
**When to use:** Always — static export requires build-time data, never runtime fetch.
**Example:**
```tsx
// Source: app/tools-directory/page.tsx lines 14-24 (VERIFIED in repo)
import { readFileSync } from 'fs';
import { join } from 'path';
import type { IcarsProject } from '@/lib/types';

let projects: IcarsProject[] = [];
try {
  projects = JSON.parse(
    readFileSync(join(process.cwd(), 'content/icars-projects.json'), 'utf-8')
  ) as IcarsProject[];
} catch (err) {
  console.error('[AwarenessPage] Failed to load icars-projects.json:', err);
  // projects stays [] — section renders "0 projects" rather than crashing
}
```
> Wrap the existing awareness page's content in the same try/catch graceful-degrade idiom Phase 21 used.

### Pattern 2: OR-within / AND-across filter (single dimension here)
**What:** Sector filter is one dimension; OR-within means selecting multiple sectors widens results.
**When to use:** The sector chip row.
**Example:**
```tsx
// Source: app/components/tools/ToolsGrid.tsx lines 36-55 (VERIFIED in repo)
const filtered = useMemo(() => {
  return projects.filter((p) => {
    return selectedSectors.length === 0 || selectedSectors.includes(p.sector);
  });
}, [projects, selectedSectors]);
```
> ICARS has only ONE filter dimension (sector). This is simpler than Phase 21's three dimensions —
> no need for `.some()`/array membership unless a project can have multiple sectors (it cannot; sector is
> a single string per row). `selectedSectors.includes(p.sector)` is correct.

### Pattern 3: Sector badge with color coding
**What:** Each card shows a sector badge. Phase 21 used `bg-teal-50 text-teal-700` pills uniformly.
**When to use:** Card footer / header. Consider per-sector colors for visual scanability.
**Example:**
```tsx
// Adapt from ToolCard.tsx lines 42-49 (VERIFIED in repo)
const SECTOR_STYLES: Record<IcarsSector, string> = {
  'Humans': 'bg-teal-50 text-teal-700',
  'One Health': 'bg-amber-100 text-amber-800',
  'Terrestrial and Aquatic Animals': 'bg-slate-100 text-slate-700',
  'Food and Feed': 'bg-emerald-50 text-emerald-700',
  'Environment': 'bg-sky-50 text-sky-700',
};
<span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SECTOR_STYLES[project.sector]}`}>
  {project.sector}
</span>
```
> [ASSUMED] color mapping — exact colors are Claude's discretion. The token set (teal/amber/emerald/slate/sky)
> all exist in the Tailwind v4 theme already in use.

### Anti-Patterns to Avoid
- **Creating a new `/icars` route:** The phase goal mandates a section on the EXISTING `/awareness` page. Do not add a route.
- **Treating C1 as country on every row:** C1 is the SECTOR on project rows and the COUNTRY on header rows. Misreading this produces garbage data (see Pitfall 1).
- **Trusting the "40 projects" figure:** It is 40 data rows = 15 country headers + 25 projects. Hard-coding `length === 40` in any validation will fail (see Pitfall 2).
- **`dangerouslySetInnerHTML` for outcomes:** Outcomes contain newlines and numbered lists. Render with `whitespace-pre-line` CSS or split on `\n`, never raw HTML injection.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| xlsx parsing | Custom CSV/zip reader | openpyxl (already installed) | Handles shared strings, merged cells, encodings |
| Slug/ID generation | Ad-hoc IDs | Copy `slugify()` + md5-suffix dedup from `extract_oh_tools.py` lines 33-37, 138-145 | Stable IDs across re-runs |
| Whitespace cleanup | `.strip()` only | Copy `clean()` helper `re.sub(r"\s+", " ", str(v).strip())` from `extract_oh_tools.py` line 28-30 | Cells contain embedded `\n` (multi-line outcomes) |
| Filter chip toggle | Manual array splice | Copy `toggleValue<T>` from `ToolsFilters.tsx` lines 21-25 | Immutable, generic, already proven |
| Pagination | Custom | Copy from `ToolsGrid.tsx` lines 57-85 — OR omit (25 items fits one page) | Optional; 25 < PAGE_SIZE means no pagination needed |

**Key insight:** Phase 21 already solved every sub-problem this phase faces. The `21-PATTERNS.md`
file (`.planning/phases/21-.../21-PATTERNS.md`) is a line-by-line transplant guide — the planner
should reference it directly rather than re-deriving patterns.

## Runtime State Inventory

> This is a greenfield content/component addition, not a rename/refactor. Most categories are N/A.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no datastore; JSON is a build artifact committed to git | None |
| Live service config | None | None |
| OS-registered state | None | None |
| Secrets/env vars | None — no env vars consumed by this feature | None |
| Build artifacts | `content/icars-projects.json` is itself the only build artifact; regenerated by re-running the script | Commit the JSON; re-run script if xlsx changes |

**Nothing found in any runtime category** — verified: feature is static JSON + React components, no
external services, no env vars, no OS registration.

## Common Pitfalls

### Pitfall 1: C1 holds two different meanings (country vs sector)
**What goes wrong:** Naively reading column 1 as "country" yields rows like `Humans`, `One Health` as countries.
**Why it happens:** The sheet uses **interleaved grouping headers** — a row with only C1 set (e.g. `ZIMBABWE`) introduces the country, and the project rows beneath it carry C1 = SECTOR.
**How to avoid:** Detect country-header rows (C1 or C2 is an ALL-CAPS token that is NOT a known sector, AND C3/C5 are empty), store as `current_country`, then assign that country to every subsequent project row until the next header. [VERIFIED: openpyxl row scan, rows 2-41]
**Warning signs:** A "country" filter showing "Humans" or "One Health"; project count ≠ 25.

### Pitfall 2: "40 projects" is the row count, not the project count
**What goes wrong:** Validation gates or copy ("all 40 projects") that assume 40 records.
**Why it happens:** 40 data rows (2-41) = 15 country-header rows + 25 project rows.
**How to avoid:** The extraction script's print-count gate should assert **25**, not 40. Update any UI copy. [VERIFIED: robust classification → 25 projects across 15 countries]
**Warning signs:** Off-by-15 record counts; empty/garbage cards.

### Pitfall 3: TUNISIA country header is in the WRONG column (C2, not C1)
**What goes wrong:** Row 40 has `TUNISIA` in C2 (the title column) with C1=None, and is followed by project row 41 (ENVIRE). A country-header detector that only checks C1 will miss TUNISIA and mis-assign row 41's country.
**Why it happens:** Source-data inconsistency.
**How to avoid:** Country-header detection must check BOTH C1 and C2 for an all-caps non-sector token with empty C3/C5. [VERIFIED: row 40 inspection]
**Warning signs:** ENVIRE project (row 41) shows the wrong country or "CROSS-COUNTRY".

### Pitfall 4: Sector typos and inconsistent vocabulary
**What goes wrong:** `Enviroment` (sic), and the ROADMAP's assumed "Animals" doesn't exist (actual: "Terrestrial and Aquatic Animals").
**Why it happens:** Free-text source data.
**How to avoid:** Normalize via a `SECTOR_CANON` dict (lowercased keys) exactly like `extract_oh_tools.py`'s `TOKEN_CANON` (lines 81-91): `{'enviroment': 'Environment', 'humans': 'Humans', 'one health': 'One Health', 'food and feed': 'Food and Feed', 'terrestrial and aquatic animals': 'Terrestrial and Aquatic Animals'}`. Define the `IcarsSector` union from the **normalized** values. [VERIFIED: distinct-value scan]
**Warning signs:** A "Enviroment" filter chip; TypeScript union mismatch.

### Pitfall 5: One project row (18/ZAMBIA) has an empty sector
**What goes wrong:** A non-null sector assumption crashes or produces a card with no badge.
**Why it happens:** Source omission on one row.
**How to avoid:** Make `IcarsProject.sector` either optional (`sector?: IcarsSector`) and conditionally render the badge, OR assign a fallback like `'One Health'` / leave it filterable under an "Unspecified" bucket. Recommend: optional + conditional badge render (mirrors `ToolCard`'s `{tool.url ? ... }` guards). [VERIFIED: row 18 has C1=None]
**Warning signs:** Runtime undefined error on `SECTOR_STYLES[undefined]`.

### Pitfall 6: Mojibake / bad encoding in source cells
**What goes wrong:** `Universit�t Berlin` (replacement char) in funding-partner text (rows 39, 41).
**Why it happens:** The source xlsx has mis-encoded characters (likely Latin-1 saved as something else).
**How to avoid:** Either leave as-is (it's a funder name, low visibility) or add a small replacement map for known bad sequences. Flag for the visual-verification checkpoint. The extraction script should NOT crash on these — openpyxl returns them as-is in the string.
**Warning signs:** `�` visible on cards.

### Pitfall 7: Multi-line OUTCOMES and DESCRIPTION cells
**What goes wrong:** Outcomes are numbered lists with embedded `\n` (e.g. `"1. Evaluate...\n2. Assess..."`). Collapsing all whitespace destroys the list structure; leaving raw `\n` renders as one run-on line in HTML.
**Why it happens:** Source formatting.
**How to avoid:** For `description` use `clean()` (collapse to single line, then `line-clamp-3` in the card). For `outcomes`, **preserve the line breaks** — store as a `string[]` (split on `\n`, strip each, drop empties) or store the raw string and render with Tailwind `whitespace-pre-line`. Recommend `string[]` for cleaner card rendering. [VERIFIED: row 3, 41 outcomes cells]
**Warning signs:** Outcomes as one wall of text, or numbered list items merged.

## Code Examples

### Extraction script skeleton (adapt extract_oh_tools.py)
```python
# Source: adapt resources/tools/extract_oh_tools.py (VERIFIED in repo)
import hashlib, json, re
from pathlib import Path
import openpyxl

XLSX_PATH = Path(__file__).parent / "International Center for Antimicrobial Resistance Solutions.xlsx"
OUTPUT_PATH = Path(__file__).parent.parent.parent / "content" / "icars-projects.json"

SECTOR_CANON = {
    "humans": "Humans",
    "one health": "One Health",
    "terrestrial and aquatic animals": "Terrestrial and Aquatic Animals",
    "food and feed": "Food and Feed",
    "enviroment": "Environment",       # source typo
    "environment": "Environment",
}
KNOWN_SECTORS = set(SECTOR_CANON.keys())

def clean(v) -> str:
    return re.sub(r"\s+", " ", str(v).strip()) if v is not None else ""

def split_outcomes(v) -> list[str]:
    if v is None: return []
    return [re.sub(r"\s+", " ", ln).strip() for ln in str(v).split("\n") if ln.strip()]

def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower().strip()).strip("-")

def is_country_header(c1, c2, c3, c5) -> bool:
    token = str(c1 or c2 or "").strip()
    if not token or c3 or c5:
        return False
    return token.upper() == token and token.lower() not in KNOWN_SECTORS

def build_items() -> list[dict]:
    wb = openpyxl.load_workbook(XLSX_PATH, data_only=True)
    ws = wb["Sheet1"]
    items, seen = [], set()
    current_country = None
    for r in range(2, ws.max_row + 1):
        c1, c2 = ws.cell(r, 1).value, ws.cell(r, 2).value
        c3, c5 = ws.cell(r, 3).value, ws.cell(r, 5).value
        if is_country_header(c1, c2, c3, c5):
            current_country = str(c1 or c2).strip()
            continue
        title = clean(c2)
        if not title:
            continue
        raw_sector = clean(c1).lower()
        sector = SECTOR_CANON.get(raw_sector)   # None if blank → optional field
        base = slugify(title)[:60]
        slug = base if base not in seen else f"{base}-{hashlib.md5(title.encode()).hexdigest()[:6]}"
        seen.add(slug)
        items.append({
            "id": slug,
            "country": current_country,
            "sector": sector,                    # may be None (row 18)
            "title": title,
            "description": clean(c3),
            "outcomes": split_outcomes(c4 := ws.cell(r, 4).value),
            "fundingPartners": clean(c5),
            "fundingAmount": clean(ws.cell(r, 6).value),  # C6 holds amounts despite header
        })
    return items

if __name__ == "__main__":
    items = build_items()
    print(len(items))   # MUST print 25
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        f.write("\n")
```
> Note C6: the header says "IMPLEMENTING PARTNERS" but the cells contain funding amounts
> ("596,872.50 USD", "270,320 EURO", "Not Available"). The ROADMAP's planned `fundingPartners`
> field maps to **C5**; C6 is best stored as `fundingAmount` (string — amounts are messy/mixed-currency).
> Decide with the planner whether to surface `fundingAmount` on the card.

### IcarsProject type (append to app/lib/types.ts)
```ts
// Phase 22: ICARS-funded AMR interventions (from ICARS xlsx)
// Sectors normalized from source values via SECTOR_CANON in extract script.
export type IcarsSector =
  | 'Humans'
  | 'One Health'
  | 'Terrestrial and Aquatic Animals'
  | 'Food and Feed'
  | 'Environment';

export interface IcarsProject {
  id: string;                  // slug from title
  country: string;             // carried down from country-header row
  sector?: IcarsSector;        // optional — one row (ZAMBIA) has no sector
  title: string;               // C2
  description: string;         // C3 (whitespace-collapsed)
  outcomes: string[];          // C4 (split on newline)
  fundingPartners: string;     // C5
  fundingAmount?: string;      // C6 (messy mixed-currency string; header mislabeled)
}
```

### Wiring into the existing awareness page
```tsx
// app/awareness/page.tsx — add imports at top, read JSON in the component, render section last
import { readFileSync } from 'fs';
import { join } from 'path';
import IcarsProjectsSection from '@/components/awareness/IcarsProjectsSection';
import type { IcarsProject } from '@/lib/types';

// inside AwarenessPage(), before return:
let icarsProjects: IcarsProject[] = [];
try {
  icarsProjects = JSON.parse(
    readFileSync(join(process.cwd(), 'content/icars-projects.json'), 'utf-8')
  ) as IcarsProject[];
} catch (err) {
  console.error('[AwarenessPage] Failed to load icars-projects.json:', err);
}

// then append BELOW the "AMR Explained" accordion section (after line 262):
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
> The awareness page currently has zero `'use client'` / no `readFileSync` import — both must be added.
> The page is otherwise an unchanged Server Component.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hard-coded data arrays in page.tsx (Phase 8 awareness) | xlsx → `content/*.json` → readFileSync (Phase 16/20/21) | Phase 16+ | This phase uses the JSON approach; awareness page mixes both (its stat/infographic data stay inline) |
| Multi-dimension filter (Phase 16/20/21) | Single-dimension sector filter | Phase 22 | Simpler — can omit the separate Filters component |

**Deprecated/outdated:** None relevant. The Phase 21 stack is the current best practice and was shipped 2 days ago.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Sector badge colors (teal/amber/emerald/slate/sky mapping) | Pattern 3 | Cosmetic only — visual checkpoint catches it |
| A2 | `fundingAmount` (C6) worth surfacing on cards | Code Examples | Low — can store but hide; planner/user decides |
| A3 | Empty-sector row should use optional field + conditional badge (vs fallback bucket) | Pitfall 5 | Low — both render correctly; affects whether row 18 is filterable |
| A4 | Section placed below "AMR Explained" accordion | Wiring | Low — exact placement is layout discretion; phase goal only says "below existing sections" |
| A5 | No pagination needed (25 items) | Don't Hand-Roll | Low — fits one screen; can copy Phase 21 pagination if desired |

## Open Questions

1. **Should `fundingAmount` (C6) appear on the card?**
   - What we know: C6 contains messy mixed-currency amounts; header mislabels it "IMPLEMENTING PARTNERS".
   - What's unclear: Whether the user wants funding figures shown publicly.
   - Recommendation: Extract it into the JSON (cheap), let the planner/user decide on display. Default to NOT showing on the card; show `fundingPartners` (C5) instead.

2. **Should empty-sector project (ZAMBIA row 18) be filterable?**
   - What we know: One project has no sector.
   - Recommendation: Make `sector` optional; render no badge; it appears in unfiltered view and disappears when any sector is selected. Acceptable.

3. **Encoding fix for mojibake funder names?**
   - What we know: `Universit�t` appears in 2 rows.
   - Recommendation: Low priority; flag at visual checkpoint. Optionally add a tiny replacement map.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python | Extraction script | ✓ | 3.14.3 (`python`, NOT `python3`) | — |
| openpyxl | Reading xlsx | ✓ | 3.1.5 | — |
| Node.js | next build | ✓ | 24.14.0 | — |
| ICARS xlsx | Data source | ✓ | `resources/tools/International Center for Antimicrobial Resistance Solutions.xlsx` (A1:I41) | — |

**Missing dependencies with no fallback:** None.
**Note:** On this Windows machine, invoke the script with `python` — `python3` resolves to the Microsoft
Store stub and fails. [VERIFIED: `python --version` → 3.14.3; `python3 --version` → Store stub error]

## Validation Architecture

> `workflow.nyquist_validation` is **absent** from `.planning/config.json` (treated as enabled by the
> spec). However, **no test framework exists in this repo** — `package.json` has only a `lint` script
> (`eslint`), no `test`. The project has shipped 21 phases via `next build` + visual verification, not
> automated tests. This phase follows that established convention.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (no test runner installed) |
| Config file | none |
| Quick run command | `python resources/tools/extract_icars_projects.py` (asserts count = 25 via printed length) |
| Full suite command | `npm run build` (static export must succeed) + `npm run lint` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| (no formal REQ-ID — ROADMAP phase) | Extraction yields 25 typed records | script-assert | `python resources/tools/extract_icars_projects.py` → prints `25` | ❌ Wave 0 (script is the deliverable) |
| — | Page builds with section | build | `npm run build` | ✅ (existing) |
| — | No lint/type errors | lint | `npm run lint` | ✅ (existing) |
| — | Sector filter works; cards render | manual | visual verification checkpoint (22-02) | manual-only |

### Sampling Rate
- **Per task commit:** `npm run lint` (fast) + re-run extraction script if data task
- **Per wave merge:** `npm run build`
- **Phase gate:** `npm run build` green + visual sign-off (matches Phase 21 `21-03` checkpoint pattern)

### Wave 0 Gaps
- [ ] No automated test infrastructure exists or is expected — visual verification is the project's gate convention.
- The extraction script's `print(len(items))` (must equal 25) IS the data-layer regression check, mirroring Phase 21's `print(len(items))` → 50 gate.

*This phase introduces no test framework — consistent with all 21 prior phases.*

## Security Domain

> `security_enforcement` not present in config; this is a static, public, no-auth content site
> (Requirements: "Authentication / login — Fully public site"). Threat surface is minimal.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Public site, no auth |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | All content public |
| V5 Input Validation | partial | No user input on this page; filter state is client-only enum |
| V6 Cryptography | no | No secrets |

### Known Threat Patterns for static React + extracted data
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via rendered project text (description/outcomes from xlsx) | Tampering | React auto-escapes all `{text}` interpolation — **never** use `dangerouslySetInnerHTML`. Render outcomes via mapped `<li>` or `whitespace-pre-line`, not raw HTML |
| Tab-nabbing on any external funder/project links | — | If any card links externally, use `target="_blank" rel="noopener noreferrer"` (Phase 21 convention, `ToolCard.tsx` line 23). Note: ICARS data has NO url column, so likely no external links — confirm with planner |

## Sources

### Primary (HIGH confidence)
- Direct openpyxl inspection of `resources/tools/International Center for Antimicrobial Resistance Solutions.xlsx` — sheet `Sheet1`, A1:I41, all 40 rows classified
- `app/components/tools/ToolCard.tsx`, `ToolsGrid.tsx`, `ToolsFilters.tsx` — read in full (the exact analogs)
- `app/tools-directory/page.tsx` — RSC data-load pattern
- `resources/tools/extract_oh_tools.py` — extraction idiom
- `app/lib/types.ts` — type-definition convention
- `app/awareness/page.tsx` — integration target (read in full)
- `.planning/phases/21-.../21-PATTERNS.md` — line-by-line transplant guide
- `package.json`, `.planning/config.json` — toolchain + workflow config

### Secondary (MEDIUM confidence)
- None needed — all findings verified directly in-repo.

### Tertiary (LOW confidence)
- Sector badge color choices (A1) — design discretion, unverified.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new deps; all tooling verified present
- Architecture: HIGH — exact 1:1 analog (Phase 21) read in full
- Data model: HIGH — xlsx inspected cell-by-cell; project count (25) and sectors (5) confirmed by scan
- Pitfalls: HIGH — every pitfall observed directly in the data (country headers, TUNISIA-in-C2, typo, empty sector, mojibake, multi-line cells)

**Research date:** 2026-05-27
**Valid until:** 2026-06-26 (stable — repo conventions and source xlsx are fixed)
