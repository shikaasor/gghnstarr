# Phase 21: Tools Directory — Research

**Researched:** 2026-05-25
**Domain:** Static Next.js content page — xlsx data extraction + filterable card grid (clone of Phase 16/20 education pattern)
**Confidence:** HIGH

## Summary

Phase 21 is a near-clone of work this codebase has already shipped twice (Phase 16 Education Redesign, Phase 20 Education Import). It adds a new `/tools-directory` page that reads a static JSON file (`content/oh-tools.json`) built by a one-shot Python extraction script from an existing local spreadsheet, then renders a filterable card grid using the exact same client-component pattern as `EducationTabs`/`EducationCard`/`EducationFilters`. No new runtime dependencies, no external APIs, no server — fully compatible with the `output: 'export'` static config.

The source spreadsheet is confirmed present: `resources/tools/Table 1_One Health Tools Inventory_13Feb2024_ohjpa_Annex2_v4-1.xlsx`. Sheet `Table 1 OHHLEP Tools Inventory` contains **exactly 50 tools in rows 3–52** (row 1 = title, row 2 = header, rows 54–64 = footnotes/citations that must be excluded). The columns map cleanly to the planned `oh-tools.json` schema (name, year, organization, scope, audience, description, url).

**Primary recommendation:** Copy the Phase 20 extraction-script pattern (`resources/tools/extract_education.py`) into a new `extract_oh_tools.py`, copy the Phase 16 three-component pattern (Tabs-less variant — this phase has no tabs, just one grid + filters), add a `ToolItem` type + `OHTool` filter token types to `app/lib/types.ts`, create `app/tools-directory/page.tsx` mirroring `app/education/page.tsx`, and add one nav link to `app/components/layout/Header.tsx`. Reuse, do not reinvent.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Parse 50 tools from xlsx → JSON | Build-time script (Python/openpyxl) | — | One-shot offline transform; never runs in browser or at request time |
| Serve tool data to page | Static / build (readFileSync in Server Component) | — | Matches `output: 'export'`; data baked into HTML at `next build` |
| Card grid render | Frontend Server (RSC page.tsx) | — | Reads JSON, passes array prop to client component |
| Search + filter interactivity | Browser (Client Component) | — | `useState`/`useMemo` filtering identical to EducationTabs |
| Nav link | Frontend Server (Header is `'use client'` but static) | — | Append to `navLinks` array |

No capability belongs to an API or database tier — this is a static content feature.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | App Router static export | Already the project framework `[VERIFIED: package.json]` |
| React | 19.2.4 | Client component filtering | Already present `[VERIFIED: package.json]` |
| TypeScript | ^5 | Types in `app/lib/types.ts` | Project standard `[VERIFIED: package.json]` |
| Tailwind CSS | ^4.2.2 | Card/filter styling via existing tokens | Project standard `[VERIFIED: package.json]` |
| openpyxl | 3.1.5 | Read .xlsx in extraction script | Already installed & used by Phase 20 `[VERIFIED: python import]` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^1.6.0 | Optional filter/search icons | Only if planner wants a search-box icon; Phase 16 filters use none |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Python/openpyxl script | Node.js `xlsx` (SheetJS) | Phase 20 already established openpyxl; adding SheetJS introduces a new dep + slopcheck. Stick with openpyxl. |
| Tabs (EducationTabs) | Single grid (no tabs) | Tools have no training/resources split — use a tabless `ToolsGrid` (simpler than EducationTabs) |

**Installation:** No new packages required. `openpyxl` already available in the local Python env (used by `resources/tools/extract_education.py`).

## Package Legitimacy Audit

> No external packages are installed in this phase. All dependencies (Next.js, React, Tailwind, openpyxl) are already present and verified in prior phases. **slopcheck not run — not applicable (zero new installs).**

| Package | Registry | Disposition |
|---------|----------|-------------|
| (none) | — | No new installs |

## Source Data Reference (HIGH confidence — read directly this session)

**File:** `resources/tools/Table 1_One Health Tools Inventory_13Feb2024_ohjpa_Annex2_v4-1.xlsx`
**Sheet:** `Table 1 OHHLEP Tools Inventory` (a second sheet `Table 2 One Health Resources` with 991 rows exists but is OUT OF SCOPE — phase says "50 major tools from Table 1").

**Layout:** `[VERIFIED: openpyxl read]`
- Row 1: title banner ("Table 1. Landscape analysis and comparison of 50 One Health tools…")
- Row 2: column headers
- **Rows 3–52: the 50 tools** (confirmed count = 50)
- Row 53: blank/`None`
- Rows 54–64: FOOTNOTES, inclusion criteria, citations, database credit — **MUST be excluded** (filter on: has name AND has year, or hard-stop at row 52)

**Column map (1-indexed):** `[VERIFIED: openpyxl read]`
| Col | Header | → oh-tools.json field | Notes |
|-----|--------|----------------------|-------|
| C1 | Name of One Health Tool | `name` | Contains embedded `\n` — collapse whitespace (e.g. R32 = "Resource \n Mapping for \n IHR…") |
| C2 | Year of First Release | `year` (number) | All 50 have a year (1999–2023) |
| C3 | Contributing Organization(s) | `organization` | e.g. "FAO", "WHO", "UNEP" |
| C4 | Organization Level | `organizationLevel` (filter) | Distinct: Quadripartite, National, International/Regional, NGO, Academic — often comma-combined |
| C5 | Scope | `scope` (filter) | Distinct: Assessment, Implementation, Action Plans, Monitoring, Prioritisation — often comma-combined |
| C6 | OH-JPA Action Track(s) | (optional) | Numeric codes; can store or skip |
| C7 | OH Theory of Change Pathway | (optional) | Numeric; skip |
| C8 | Audience Level | `audienceLevel` (filter: national/subnational/international/regional) | Distinct: National, "National, Subnational", International/Regional combos |
| C9 | Audience Type | `audienceType` (filter) | Distinct: Multisectoral (38), Policymakers (4), Animal health (3), Laboratory (2), Environment, Public health |
| C10 | Outcome of Tool Usage | (optional) | Long prose; skip or fold into description |
| C11 | One Health Tool Description | `description` | 197–2047 chars (median 531) — UI must `line-clamp` |
| C12 | Key Outputs | (optional) | Long prose; skip |
| C13 | Website/Publications/Resources | `url` | **Messy** — see pitfalls below |

### CRITICAL planning insight — filter vocabulary mismatch
The phase description says filter by "audience type (policymakers / multisectoral / national / global)". But those four labels are **split across two different columns** in the spreadsheet:
- "policymakers" / "multisectoral" → **C9 Audience Type**
- "national" / "subnational" / "international/regional" → **C8 Audience Level** (there is no literal "global" value; closest is "International/Regional")

The planner must decide whether to (a) keep them as **two separate filter dimensions** (Audience Type + Organization/Audience Level — matches the data cleanly and matches the phase goal's "audience type, organization level, and One Health domain" wording), or (b) flatten into one. Recommendation: **two dimensions** — `audienceType` (from C9) and `organizationLevel` (from C4) — plus optionally `scope` (C5). This matches both the spreadsheet structure and the Phase goal sentence ("filterable by audience type, organization level, and One Health domain"). `[ASSUMED — A1]` Treat "One Health domain" as either C9 audience-type sectors (Animal health/Environment/Laboratory/Public health) or derive from C5 scope; needs confirmation at plan/discuss time.

## Architecture Patterns

### System Architecture Diagram
```
resources/tools/Table 1...xlsx  (local, committed)
        │
        │  build-time, run once by developer
        ▼
resources/tools/extract_oh_tools.py  (openpyxl, rows 3-52 only)
        │  writes
        ▼
content/oh-tools.json  (committed; single source of truth)
        │
        │  next build  →  readFileSync in Server Component
        ▼
app/tools-directory/page.tsx  (RSC: reads JSON, passes array prop)
        │
        ▼
ToolsGrid  ('use client': useState filters + useMemo)
        │  maps over filtered[]
        ▼
ToolCard (presentational)        ToolsFilters (presentational, multi-select chips)
        │                                   │
        └──── external tool URL ◄───────────┘ (filter selections lift state up to ToolsGrid)
```

### Recommended Project Structure
```
resources/tools/extract_oh_tools.py   # NEW — extraction script (clone of extract_education.py)
content/oh-tools.json                 # NEW — 50 tool records
app/lib/types.ts                      # EDIT — add ToolItem + filter token types
app/components/tools/ToolsGrid.tsx     # NEW — stateful client component (clone of EducationTabs, tabless)
app/components/tools/ToolCard.tsx      # NEW — presentational (clone of EducationCard)
app/components/tools/ToolsFilters.tsx  # NEW — presentational chips (clone of EducationFilters)
app/tools-directory/page.tsx          # NEW — RSC page (clone of app/education/page.tsx)
app/components/layout/Header.tsx       # EDIT — add { href: '/tools-directory', label: 'Tools' }
```

### Pattern 1: Build-time JSON extraction (Phase 20 idiom)
**What:** A committed one-shot Python script reads the xlsx and writes a typed JSON array. Re-runnable and idempotent.
**When to use:** This phase (one-time import of static reference data).
**Example (skeleton derived from `resources/tools/extract_education.py`):**
```python
# Source: resources/tools/extract_education.py (verbatim pattern this session)
import json, re
from pathlib import Path
import openpyxl

XLSX = Path(__file__).parent / "Table 1_One Health Tools Inventory_13Feb2024_ohjpa_Annex2_v4-1.xlsx"
OUT  = Path(__file__).parent.parent.parent / "content" / "oh-tools.json"

def clean(v):  # collapse embedded newlines / runs of whitespace
    return re.sub(r"\s+", " ", str(v).strip()) if v is not None else ""

wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb["Table 1 OHHLEP Tools Inventory"]
tools = []
for r in range(3, 53):                      # rows 3-52 ONLY (exclude footnotes 54-64)
    name = clean(ws.cell(r, 1).value)
    if not name:
        continue
    tools.append({ ... })                   # map columns per table above
OUT.write_text(json.dumps(tools, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
```

### Pattern 2: RSC reads JSON, Client Component filters (Phase 16 idiom)
**What:** `page.tsx` is a pure Server Component using `readFileSync(join(process.cwd(), 'content/oh-tools.json'))`; passes the array as a prop to a `'use client'` grid that owns all filter state. Identical to `app/education/page.tsx` + `EducationTabs.tsx`.
**Filter logic:** OR-within-dimension, AND-across-dimensions (copy `filtered` useMemo from EducationTabs lines 78–96).

### Pattern 3: Search box (NEW vs Phase 16)
Phase goal says "**searchable** card grid". Phase 16/20 had filters but no free-text search. Add a controlled `<input>` whose value filters `name`/`organization`/`description` via `.toLowerCase().includes()` inside the same `useMemo`. This is the only net-new logic over the Phase 16 pattern. `[VERIFIED: phase goal text]`

### Anti-Patterns to Avoid
- **Including footnote rows (54–64) as tools:** they have no year and are prose/citations. Hard-stop at row 52.
- **Adding tabs:** Tools have no training/resources split. Use a single grid (drop the `EducationTab` machinery — simpler).
- **next/image for any tool logos:** project uses `unoptimized` images and plain text cards; tools have no images anyway.
- **Multi-line cell values leaking into UI:** always collapse `\s+` → space on extraction.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| xlsx parsing | Custom CSV/binary reader | openpyxl (already used Phase 20) | Handles merged cells, data_only, encoding |
| Multi-select filter UI | New design | Copy `EducationFilters.tsx` chip pattern | Proven, accessible, matches site visual language |
| Filter combination logic | New algorithm | Copy `EducationTabs` `filtered` useMemo | OR-within/AND-across already correct & tested |
| Pagination | New | Copy EducationTabs pagination block | 50 items may not need it, but pattern exists if desired |
| Page shell / hero | New layout | Copy `app/education/page.tsx` hero+Container | Brand-consistent |

**Key insight:** Everything except the free-text search box already exists in the repo. The phase is ~90% copy-adapt.

## Runtime State Inventory

> Greenfield-style content addition (new page + new JSON). Minimal migration surface, but a few items apply.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — `content/oh-tools.json` is new, no existing records to migrate | None |
| Live service config | None — no external service, no API, no GAS endpoint involved | None — verified by phase scope (static page) |
| OS-registered state | None | None |
| Secrets/env vars | None — no env vars needed (no GAS/Supabase/analytics keys for this page) | None |
| Build artifacts | `out/` static export regenerates on `next build`; no stale artifacts | Run `next build` after adding page (covered by Plan 21-03) |

**Nav link is the only existing file mutated** (`Header.tsx`). The Header `navLinks` array already has 10 entries; adding an 11th may warrant a visual check of desktop nav spacing (it uses `gap-6`, hidden below `md`). Flag for the 21-03 visual checkpoint.

## Common Pitfalls

### Pitfall 1: Footnote rows imported as fake tools
**What goes wrong:** Looping `min_row=2` to `max_row` (65) pulls in 10+ rows of citations/criteria that have names but no real tool data → grid shows garbage cards.
**Why it happens:** `max_row` is 65; named rows extend to 64.
**How to avoid:** Iterate `range(3, 53)` explicitly, or guard on `year is not None` (footnotes have no year). Confirmed this session: exactly 50 valid rows are 3–52.
**Warning signs:** JSON length ≠ 50; cards titled "FOOTNOTES" or "*Reference: Behravesh…".

### Pitfall 2: Messy URL cell (C13)
**What goes wrong:** C13 sometimes contains prose + URL, a bare `www.` host, a "Github.com/EIDSS" fragment, or is missing entirely.
**Examples (verified):** R6 = `"Github.com/EIDSS\n\nEIDSS is an application configured for use by…"` (URL buried in prose, no scheme); R47 = `"www.who.int/initiatives/…"` (no scheme); some rows have no http link.
**How to avoid:** In extraction, run a URL regex to pull the first `https?://…` or `www\.…`; prefix bare `www.`/host with `https://`; if no URL found, set `url: ""` and have `ToolCard` render the name as plain text (EducationCard already does this — `item.url ? <a> : <span>`). Reuse the `fix_url`/`derive_source` helpers from `extract_education.py`.
**Warning signs:** Cards link to invalid URLs or relative paths.

### Pitfall 3: Filter-label vs column mismatch (see CRITICAL insight above)
**What goes wrong:** Planner builds one "audience" filter expecting values policymakers/multisectoral/national/global, but those live in two different columns and "global" never appears literally.
**How to avoid:** Use two dimensions (C9 Audience Type + C4 Organization Level), confirm "One Health domain" semantics at plan time (Assumption A1).

### Pitfall 4: Embedded newlines in names/orgs
**What goes wrong:** Names like "Resource \n Mapping for \n IHR…" render with stray line breaks / break the slug.
**How to avoid:** `re.sub(r"\s+", " ", value.strip())` on every extracted text field. Slug from cleaned name.

### Pitfall 5: Long descriptions blow up card height
**What goes wrong:** Descriptions range 197–2047 chars; un-clamped they create wildly uneven cards.
**How to avoid:** `line-clamp-3` (or `-4`) on the description `<p>` — exactly as `EducationCard` does (`line-clamp-3`).

## Code Examples

### RSC page (clone of education page) `[VERIFIED: app/education/page.tsx]`
```tsx
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import ToolsGrid from '@/components/tools/ToolsGrid';
import type { ToolItem } from '@/lib/types';

export const metadata: Metadata = {
  title: 'One Health Tools Directory | GGHN STARR',
  description: 'A searchable catalog of 50 major One Health tools from the OHHLEP Tools Inventory.',
};

export default function ToolsDirectoryPage() {
  const tools: ToolItem[] = JSON.parse(
    readFileSync(join(process.cwd(), 'content/oh-tools.json'), 'utf-8')
  );
  return (
    <main>
      <section className="bg-teal-600 text-white py-14">
        <Container>{/* hero — copy education hero markup */}</Container>
      </section>
      <section className="py-14 bg-slate-50">
        <Container><ToolsGrid tools={tools} /></Container>
      </section>
    </main>
  );
}
```

### Proposed type (add to `app/lib/types.ts`)
```ts
// Phase 21: One Health Tools Directory
export type OHOrganizationLevel =
  | 'Quadripartite' | 'National' | 'International/Regional' | 'NGO' | 'Academic';
export type OHAudienceType =
  | 'Multisectoral' | 'Policymakers' | 'Animal health' | 'Laboratory'
  | 'Environment' | 'Public health';
export type OHScope =
  | 'Assessment' | 'Implementation' | 'Monitoring' | 'Action Plans' | 'Prioritisation';

export interface ToolItem {
  id: string;                         // slug from name
  name: string;
  year: number;
  organization: string;               // C3
  organizationLevels: OHOrganizationLevel[];  // C4 (comma-split + normalized)
  scopes: OHScope[];                  // C5 (comma-split)
  audienceLevels: string[];           // C8 (e.g. National, Subnational)
  audienceTypes: OHAudienceType[];    // C9 (comma-split)
  description: string;                // C11
  url: string;                        // C13 (cleaned; '' if none)
}
```
*(Comma-combined cells in C4/C5/C8/C9 should be split on `,` and normalized — e.g. `"International/\nRegional"` → `International/Regional`. Token unions above are `[VERIFIED: openpyxl distinct-value scan]` of the 50 data rows.)*

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Education had tabs + region filter | Tools needs neither tabs nor WHO region | This phase | Simpler component — strip tab machinery |
| Filters only (Phase 16) | Filters + free-text search | This phase | One new controlled input in the useMemo |

**Deprecated/outdated:** None relevant.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | "One Health domain" filter maps to C9 audience-type sectors (Animal health/Environment/Laboratory/Public health) or to C5 Scope — not a separate spreadsheet column | Source Data / Pitfall 3 | Wrong filter dimension built; needs discuss/plan confirmation. The spreadsheet has no column literally named "One Health domain." |
| A2 | Only Table 1 (50 tools) is in scope; Table 2 (991 resources) is excluded | Source Data Reference | Importing 991 rows would balloon the page and contradict phase goal "50 major tools from Table 1" |
| A3 | No pagination strictly required (50 items fit one page), but EducationTabs pagination can be reused if desired | Don't Hand-Roll | Minor UX choice only |

## Open Questions (RESOLVED)

1. **"One Health domain" filter — which column?**
   - What we know: phase goal lists three filter dimensions (audience type, organization level, One Health domain). Spreadsheet has Audience Type (C9), Organization Level (C4), Scope (C5), Audience Level (C8). No literal "domain" column.
   - What's unclear: whether "domain" = the sectoral audience types (Animal/Environment/Laboratory/Public health) or = Scope.
   - **RESOLVED: "One Health domain" maps to Scope (C5). Three filter dimensions implemented: Organization Level (C4), Audience Type (C9), and Scope (C5). Free-text search box added for name/organization/description.**

2. **Should the OH-JPA Action Track / Theory-of-Change numeric columns (C6/C7) be surfaced?**
   - Recommendation: skip — they are coded numbers requiring a legend (the legend is in the footnotes). Out of scope for a clean card grid.
   - **RESOLVED: C6/C7 columns skipped — not surfaced on cards.**

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python 3 + openpyxl | extract_oh_tools.py | ✓ | openpyxl 3.1.5 | — |
| Node/Next toolchain | build & dev | ✓ | next 16.2.1 | — |
| Source xlsx | extraction | ✓ | present at resources/tools/ | — (file committed) |

**Missing dependencies:** None. All extraction and build tooling verified present this session.

## Validation Architecture

> `.planning/config.json` did not surface a `workflow.nyquist_validation` value in the init context; this project ships no test framework (`package.json` scripts: dev/build/start/lint only — no `test`). Treating automated unit testing as **not part of this project's workflow**; validation is `next build` + lint + human visual checkpoint, consistent with all prior phases (every phase ends in a visual verification plan, e.g. 16-03, 20-02).

### Validation approach for this phase
| Gate | Command / Action |
|------|------------------|
| Data correctness | `python resources/tools/extract_oh_tools.py` prints record count — MUST equal 50 |
| Type/lint | `npx eslint` (project `lint` script) |
| Build | `next build` completes with no errors (static export) |
| Phase gate | Human visual verification of /tools-directory (Plan 21-03) — cards render, filters work, search works, nav link present, mobile layout OK |

### Wave 0 Gaps
- None — no test infrastructure exists or is expected. The 21-03 visual checkpoint is the established validation idiom for this repo.

## Security Domain

> Static content page, no user input persisted, no auth, no secrets. Most ASVS categories N/A.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Public site, no auth |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | All content public |
| V5 Input Validation | minimal | Free-text search input is client-only, never sent anywhere; no injection surface in a static export |
| V6 Cryptography | no | No secrets/crypto |

### Known Threat Patterns for static Next.js export
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| External tool links (untrusted destinations) | Tampering/redirect | `rel="noopener noreferrer"` on all `target="_blank"` anchors — already the EducationCard pattern; reuse verbatim |
| Stored XSS via spreadsheet description text | Tampering | Data is build-time, React escapes by default (no `dangerouslySetInnerHTML`); descriptions rendered as text |

## Sources

### Primary (HIGH confidence)
- `resources/tools/Table 1_One Health Tools Inventory_13Feb2024_ohjpa_Annex2_v4-1.xlsx` — read directly via openpyxl this session (50 tools confirmed rows 3–52; full column map verified)
- `resources/tools/extract_education.py` — Phase 20 extraction pattern (template)
- `app/education/page.tsx`, `app/components/education/{EducationTabs,EducationCard,EducationFilters}.tsx` — component patterns to clone
- `app/lib/types.ts` — type-definition conventions
- `app/components/layout/Header.tsx` — nav-link pattern
- `package.json`, `next.config.js` — verified stack & static-export config

### Secondary (MEDIUM confidence)
- `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md` — phase intent and prior decisions

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all deps verified present; zero new installs
- Architecture: HIGH — direct clone of two shipped phases (16, 20), patterns read verbatim
- Source data: HIGH — spreadsheet opened and every column/row range verified this session
- Filter-vocabulary semantics: MEDIUM — "One Health domain" mapping needs confirmation (A1)

**Research date:** 2026-05-25
**Valid until:** 2026-06-25 (stable — local data + existing patterns; deadline-bound work)
