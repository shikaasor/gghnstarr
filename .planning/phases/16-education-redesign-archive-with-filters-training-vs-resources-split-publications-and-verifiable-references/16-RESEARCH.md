# Phase 16: Education Redesign — Research

**Researched:** 2026-05-08
**Domain:** Next.js static export, client-side filtering, URL hash state, pagination, TypeScript data modelling
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Training vs Resources split
- Two tabs on one /education page — single URL, not separate pages
- Tab state stored in URL hash: `#training` and `#resources` — shareable and bookmarkable
- Default tab when no hash: Training
- **Training** = structured learning you complete: online courses (external links), webinars/recorded sessions, workshop materials/slides, certification programs
- **Resources** = everything else (articles, publications, downloads, reference materials)

#### Archive & filtering
- Four filter dimensions, applied to each tab independently:
  1. Audience type (Policymaker / Healthcare Worker / General Public)
  2. Format / content type (Course, Webinar, Article, Download, Video, Publication)
  3. Topic / theme (AMR surveillance, stewardship, governance, One Health, etc.)
  4. Date / recency (sort or filter by year)
- Filter combination logic: AND within a category (selecting two topics shows items matching either topic), AND across categories (must also match the audience filter) — most intuitive behavior
- Browsing pattern: **Pagination** — not load-more or infinite scroll
- Page size: Claude's discretion (12 items per page is reasonable)

#### Publications & articles
- Publications live **inside the Resources tab**, filtered by format type (no separate tab or subsection)
- Publication card metadata: title + authors, journal/publisher + year, DOI or external link
- No abstract excerpt needed
- Hosting: **mix** — external link when source is publicly accessible; hosted PDF in `public/` when not publicly available
- Each publication card should visually distinguish itself from other resource types (badge or format label)

#### Verifiable references
- Source citation appears **on each resource/publication card**
- Verified = source organization + year + working external link (e.g. "WHO, 2023" with a live URL)
- Items without a confirmed source/link are shown with a visible **"Source unverified"** flag — not excluded
- No full bibliographic reference section at the bottom of the page

### Claude's Discretion
- Exact filter UI pattern (pill chips, dropdowns, or sidebar)
- Card layout and visual design within the established site design system
- Pagination control design (prev/next, numbered pages)
- How the "Source unverified" flag is styled
- Topic/theme taxonomy (derive from existing content)

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EDUC-01 | A dedicated Education Library page (/education) displays audience-specific learning materials filterable by audience type (Policymaker, Healthcare Worker, General Public) | Extended to four filter dimensions; URL hash tab state; pagination replaces single-page scroll |
| EDUC-02 | Each education resource card shows title, audience tag, format (article/download/video), and a download or read link | Extended with: Training tab awareness, publication-specific metadata (authors/journal/DOI), verified source citation, and "Source unverified" flag |
</phase_requirements>

---

## Summary

Phase 16 replaces the Phase 8 /education page entirely. The Phase 8 page is a Server Component with 12 hardcoded resources and a single audience filter. Phase 16 introduces a fundamentally different architecture: a JSON data file replaces inline data, two independent tabs (Training vs Resources) with per-tab filter state, four filter dimensions with AND-across/OR-within logic, pagination, and verifiable source citations on every card.

The project stack is Next.js 16.2.1 with `output: 'export'` (fully static, no SSR). This is critical for the URL hash feature: `window.location.hash` is only available client-side, so the tab-reading component must be a Client Component using `useEffect` to read the initial hash and `popstate` to handle back/forward navigation. The existing codebase pattern (BriefGrid.tsx, EducationGrid.tsx) already demonstrates this exact Server Component → Client Component split: the page.tsx reads from the filesystem at build time and passes data as props to a `'use client'` component.

No new npm packages are needed. All filtering, pagination, and hash-based tab state can be implemented with React `useState`/`useEffect`/`useMemo`. The new TypeScript types extend (or replace) `EducationResource` in `app/lib/types.ts`, and a new `content/education.json` file follows the same pattern as `content/briefs-index.json`. The 12 existing resources migrate from the page.tsx inline array into this JSON file as the starting dataset.

**Primary recommendation:** Build one `EducationPage` (Server Component) + one `EducationTabs` (Client Component). The Server Component reads `content/education.json` at build time and passes the full array as a prop. The Client Component owns all tab state, filter state, pagination state, and hash synchronisation.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 (project) | Page routing, static export | Already in project; `output: 'export'` confirmed |
| React | 19.2.4 (project) | `useState`, `useEffect`, `useMemo` for all interactivity | Already in project |
| Tailwind CSS | v4.2.2 (project) | Utility-first styling; design tokens in globals.css | Already in project; all existing components use it |
| lucide-react | ^1.6.0 (project) | Icons for format badges (FileText, Download, Play, BookOpen, Video, GraduationCap) | Already in project and used in EducationGrid.tsx |
| clsx | ^2.1.1 (project) | Conditional class merging | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwind-merge | ^3.5.0 (project) | Safe Tailwind class deduplication | When computing card classes conditionally |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom pagination with useState | react-paginate or similar | Not needed: pagination is 6 lines of math; adding a library adds bundle size for zero benefit at this scale |
| Custom filter chips | Headless UI combobox | Overkill — the existing site uses plain buttons and selects; pill chips fit the established pattern |
| URL hash via window directly | Next.js `useSearchParams` | `useSearchParams` requires a Suspense boundary with static export and doesn't natively handle hashes; window.location.hash + popstate is simpler and has no caveats here |

**Installation:** No new packages needed.

---

## Architecture Patterns

### Recommended Project Structure
```
app/
├── education/
│   └── page.tsx                    # Server Component — reads content/education.json at build time
├── components/
│   └── education/
│       ├── EducationTabs.tsx       # Client Component — all interactivity (tabs, filters, pagination)
│       ├── EducationCard.tsx       # Presentational — renders one item (handles both Training & Resource variants)
│       └── EducationFilters.tsx    # Presentational — filter controls (pill chips); receives state + setters as props
content/
└── education.json                  # Single source of truth for all Training + Resource items
app/lib/
└── types.ts                        # Add new EducationItem, TrainingItem, ResourceItem types; keep old EducationResource for safety
```

### Pattern 1: Server Component reads file, passes to Client Component

This is the established pattern in the project (`BriefsPage` → `BriefGrid`, `EducationPage` → `EducationGrid`).

**What:** The `page.tsx` Server Component uses `fs.readFileSync` to load `content/education.json` at build time. Because Next.js `output: 'export'` generates static HTML, this runs once at `next build`, not per request. The entire array is serialised into the page's initial HTML as a prop to the Client Component.

**When to use:** All data access. Never import fs in a Client Component.

```typescript
// app/education/page.tsx  (Server Component — no 'use client')
// Source: established pattern in app/briefs/page.tsx
import fs from 'fs';
import path from 'path';
import type { EducationItem } from '@/lib/types';
import { Container } from '@/components/layout/Container';
import EducationTabs from '@/components/education/EducationTabs';

export default function EducationPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), 'content', 'education.json'),
    'utf-8'
  );
  const items: EducationItem[] = JSON.parse(raw);

  return (
    <main>
      {/* Hero section (static markup) */}
      <section className="bg-teal-600 text-white py-14">
        <Container>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Education Library
          </h1>
        </Container>
      </section>

      <section className="py-14 bg-slate-50">
        <Container>
          <EducationTabs items={items} />
        </Container>
      </section>
    </main>
  );
}
```

### Pattern 2: URL Hash-Based Tab State in Static Export

**What:** Next.js `output: 'export'` produces HTML files served from a CDN. There is no server to read query params. URL hashes are never sent to the server, so they work correctly in static sites. The client reads `window.location.hash` on mount and listens for `popstate` for back/forward.

**Critical constraint:** `window` does not exist during `next build` (SSR phase for static generation). The hash read must be inside `useEffect`. A safe default (`'training'`) must be set before the effect runs to avoid a flash of wrong content on hydration.

```typescript
// app/components/education/EducationTabs.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';

type TabId = 'training' | 'resources';

export default function EducationTabs({ items }: { items: EducationItem[] }) {
  // Default 'training' on SSR/initial render — avoids hydration mismatch
  const [activeTab, setActiveTab] = useState<TabId>('training');

  // Read hash on mount and on popstate (back/forward)
  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'resources') setActiveTab('resources');
      else setActiveTab('training');
    };
    readHash();
    window.addEventListener('popstate', readHash);
    return () => window.removeEventListener('popstate', readHash);
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    // Update hash without triggering a page reload
    history.pushState(null, '', `#${tab}`);
  };

  // ... filter + pagination state below
}
```

### Pattern 3: Multi-Dimensional Filtering with useMemo

**What:** Four independent filter states. Filtering runs in `useMemo` so it re-runs only when dependencies change.

**Filter logic rule (from CONTEXT.md):**
- OR within a dimension: item matches if it satisfies ANY selected value in that dimension
- AND across dimensions: item must satisfy ALL active dimensions
- Empty selection in a dimension = no constraint (show all)

```typescript
// Inside EducationTabs.tsx
const [audienceFilter, setAudienceFilter] = useState<string[]>([]);
const [formatFilter, setFormatFilter]     = useState<string[]>([]);
const [topicFilter, setTopicFilter]       = useState<string[]>([]);
const [yearFilter, setYearFilter]         = useState<string[]>([]);

const tabItems = useMemo(
  () => items.filter(i => i.tab === activeTab),
  [items, activeTab]
);

const filtered = useMemo(() => {
  return tabItems.filter(item => {
    const audienceMatch = audienceFilter.length === 0 ||
      item.audiences.some(a => audienceFilter.includes(a));
    const formatMatch = formatFilter.length === 0 ||
      formatFilter.includes(item.format);
    const topicMatch = topicFilter.length === 0 ||
      item.topics.some(t => topicFilter.includes(t));
    const year = String(new Date(item.year).getFullYear());
    const yearMatch = yearFilter.length === 0 || yearFilter.includes(year);
    return audienceMatch && formatMatch && topicMatch && yearMatch;
  });
}, [tabItems, audienceFilter, formatFilter, topicFilter, yearFilter]);
```

### Pattern 4: Simple Pagination with useState

**What:** Stateless math — no library needed. Page resets to 1 whenever filters or tab change.

```typescript
const PAGE_SIZE = 12;
const [currentPage, setCurrentPage] = useState(1);

// Reset page when filters change
useEffect(() => { setCurrentPage(1); }, [activeTab, audienceFilter, formatFilter, topicFilter, yearFilter]);

const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
```

### Pattern 5: New TypeScript Type for education.json

The existing `EducationResource` type in `app/lib/types.ts` is Phase 8 era and too narrow. Phase 16 needs a richer type. The old type can remain (it is only used in the old page code which will be replaced).

```typescript
// app/lib/types.ts — new types for Phase 16

export type EducationTab    = 'training' | 'resources';
export type AudienceType    = 'Policymaker' | 'Healthcare Worker' | 'General Public';
export type TrainingFormat  = 'Course' | 'Webinar' | 'Workshop' | 'Certification';
export type ResourceFormat  = 'Article' | 'Download' | 'Video' | 'Publication';
export type EducationFormat = TrainingFormat | ResourceFormat;

export interface EducationItem {
  id: string;                        // unique slug, e.g. "who-academy-amr-2023"
  tab: EducationTab;                 // 'training' | 'resources'
  title: string;
  audiences: AudienceType[];
  format: EducationFormat;
  topics: string[];                  // free-form, derived from content taxonomy
  year: number;                      // publication/release year (integer, not ISO string)
  source: string;                    // "WHO" | "Africa CDC" | "Frontiers" etc.
  sourceVerified: boolean;           // true = has confirmed working URL + source org + year
  url: string;                       // external URL or "/education/..." for hosted PDFs
  // Publication-specific (only when format === 'Publication')
  authors?: string;                  // "Smith J et al."
  journal?: string;                  // "Lancet Infectious Diseases"
  doi?: string;                      // "10.1016/..." or null
}
```

### Recommended Filter UI Pattern (Claude's Discretion)

Recommend **pill chips** (same pattern as the existing EducationGrid audience tabs) for all four filter dimensions. Rationale:
- Matches existing visual language exactly (rounded-full, teal active state, slate inactive)
- All options are enumerable and short-label — no search needed
- Works well on mobile without a sidebar
- Multi-select is natural with pills (multiple can be highlighted simultaneously)

For the year/date dimension: derive unique years from the dataset and render as pills, sorted descending. This avoids a date-range input (unnecessary complexity) while still serving the recency filtering need.

Group pills under labelled rows:
```
Audience:  [All]  [Policymaker]  [Healthcare Worker]  [General Public]
Format:    [All]  [Course]  [Webinar]  [Article]  [Download]  [Publication]  [Video]
Topic:     [All]  [Surveillance]  [Stewardship]  [Governance]  [One Health]  ...
Year:      [All]  [2025]  [2024]  [2023]  ...
```

"All" in a dimension deselects all active filters for that dimension (equivalent to empty array).

### Recommended Pagination Control (Claude's Discretion)

Recommend prev/next + numbered pages pattern. Show at most 7 page numbers; use ellipsis for large sets.

```
← Prev   1  2  [3]  4  5  ...  12   Next →
```

### Recommended "Source Unverified" Flag Styling (Claude's Discretion)

Use an amber/gold badge inline on the card, distinct from the teal verified-source display. The project already uses `--color-amr-gold: #F2A900` which maps semantically to "caution/attention" in AMR branding context.

```tsx
{!item.sourceVerified && (
  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
    <AlertTriangle size={10} />
    Source unverified
  </span>
)}
```

### Recommended Topic/Theme Taxonomy (Claude's Discretion)

Derive from existing content (Phase 8 resources + briefs themes). Proposed initial set:

| Topic slug | Display label |
|------------|---------------|
| `surveillance` | AMR Surveillance |
| `stewardship` | Stewardship |
| `governance` | Governance & Policy |
| `one-health` | One Health |
| `laboratory` | Laboratory Systems |
| `financing` | Financing & Investment |
| `general-awareness` | General Awareness |
| `research-methods` | Research & Methods |

### Anti-Patterns to Avoid

- **Filtering in the Server Component:** The page renders once at build time. Filtering must happen client-side in the Client Component, as done in BriefGrid and EducationGrid.
- **Reading window.location.hash outside useEffect:** `window` is undefined during static generation. Always guard inside `useEffect`.
- **Resetting to page 1 only on filter change, not on tab change:** Switching tabs must also reset pagination to page 1.
- **Storing filter state globally:** Keep filter state local to `EducationTabs`. Each tab having independent filter state is the requirement; this is achieved naturally by resetting filters when the tab changes.
- **Using Next.js `<Link>` with hash:** Using `<Link href="#resources">` would trigger a navigation and cause the whole page to re-render. Use `history.pushState` directly for hash changes within the same page.
- **Mutating the old `ResourceFormat` type:** The old type (`'Article' | 'Download' | 'Video'`) is used by the Phase 8 `EducationResource`. Add new types with new names; don't widen the old union in place or existing code may break unexpectedly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conditional CSS classes | String concatenation with ternaries | `clsx` (already in project) | Prevents class deduplication bugs with Tailwind |
| Icon for each format type | Custom SVG components | `lucide-react` icons (already in project) | FileText, Download, Play, BookOpen, Video, GraduationCap already available |
| Type narrowing for Publication-specific fields | Manual duck-typing | TypeScript optional fields on `EducationItem` with a type guard `item.format === 'Publication'` | Clear, maintainable, no extra abstraction |

**Key insight:** This phase is a UI-architecture problem, not a library-selection problem. All the hard tooling (React, Tailwind, TypeScript, lucide-react) is already installed. The implementation effort is entirely in component design and data modelling.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch on Hash Read
**What goes wrong:** The server renders the default tab ('training'). If the client reads the hash and switches to 'resources' synchronously (outside useEffect), React's hydration will see a mismatch between server HTML and client HTML, causing a console error and potential UI flicker.
**Why it happens:** `window` doesn't exist server-side. Any code that touches `window.location` runs only client-side.
**How to avoid:** Always read the hash inside `useEffect(() => { ... }, [])`. Set the default state to `'training'` (the correct default per CONTEXT.md) so the initial render matches the server output.
**Warning signs:** React hydration error in browser console: "Expected server HTML to contain a matching..."

### Pitfall 2: Tab Filter State Bleed
**What goes wrong:** User filters by "Policymaker" on Training tab, switches to Resources tab, and Resources tab also shows as filtered by "Policymaker" — confusing UX.
**Why it happens:** Shared filter state across tabs.
**How to avoid:** Two options: (a) store filters in per-tab objects `{ training: {...}, resources: {...} }`; or (b) reset all filter states when `activeTab` changes. Option (b) is simpler and matches the requirement that filters are "applied to each tab independently."
**Warning signs:** Filter pills showing active state after tab switch.

### Pitfall 3: Pagination Not Resetting After Filter Change
**What goes wrong:** User is on page 3, applies a filter that reduces results to 1 page, page 3 shows empty grid.
**Why it happens:** `currentPage` not reset when filter changes.
**How to avoid:** Use `useEffect` with all filter states as dependencies to call `setCurrentPage(1)`. Or derive page reset in the `useMemo` for paginated items.
**Warning signs:** Empty grid even though `filtered.length > 0`.

### Pitfall 4: JSON Data File Needs a `getEducationItems()` Helper
**What goes wrong:** `fs.readFileSync` in page.tsx directly — works but is not consistent with the project's `content.ts` utility pattern. If two pages or scripts need education data, they each re-implement the fs read.
**Why it happens:** Temptation to write the minimal code directly in page.tsx.
**How to avoid:** Add `getEducationItems()` to `app/lib/content.ts`, following the `getAllBriefs()` pattern. Page.tsx calls `getEducationItems()` just like it calls `getAllBriefs()`.
**Warning signs:** Raw `fs.readFileSync` in a page.tsx file.

### Pitfall 5: Static Export and Dynamic Params
**What goes wrong:** Attempting to use `useSearchParams()` for filter state (e.g., `?tab=resources&audience=Policymaker`) fails in static export without a Suspense boundary — and even then is fragile.
**Why it happens:** `useSearchParams` requires a server to parse the initial request.
**How to avoid:** Use URL hash for tab state (as decided) and `useState` for filter state. Filter state does NOT need to be in the URL per CONTEXT.md.
**Warning signs:** Build error: "useSearchParams() should be wrapped in a suspense boundary at the page level"

### Pitfall 6: Publication Card Metadata Rendering Without Guards
**What goes wrong:** Rendering `item.authors` or `item.doi` on non-Publication format cards causes undefined text leaking into the DOM.
**Why it happens:** TypeScript optional fields are undefined at runtime when not set.
**How to avoid:** Always guard with `item.format === 'Publication' && item.authors && (...)`.
**Warning signs:** "undefined" text appearing on Article or Download cards.

---

## Code Examples

### education.json Schema (starting structure)
```json
[
  {
    "id": "who-academy-amr-essentials",
    "tab": "training",
    "title": "AMR Essentials: WHO Academy Online Course",
    "audiences": ["Healthcare Worker", "Policymaker"],
    "format": "Course",
    "topics": ["stewardship", "general-awareness"],
    "year": 2024,
    "source": "WHO Academy",
    "sourceVerified": true,
    "url": "https://www.who.int/about/who-academy"
  },
  {
    "id": "au-amr-framework-2020",
    "tab": "resources",
    "title": "African Union Framework for Antimicrobial Resistance Control 2020–2025",
    "audiences": ["Policymaker"],
    "format": "Download",
    "topics": ["governance", "financing"],
    "year": 2020,
    "source": "Africa CDC",
    "sourceVerified": true,
    "url": "https://africacdc.org/download/african-union-framework-for-antimicrobial-resistance-control-2020-2025/"
  },
  {
    "id": "amr-stewardship-policy-analysis",
    "tab": "resources",
    "title": "Antimicrobial Stewardship in Africa: Policy Analysis Across Five Countries",
    "audiences": ["Healthcare Worker", "Policymaker"],
    "format": "Publication",
    "topics": ["stewardship", "governance"],
    "year": 2023,
    "source": "Cambridge / ASH&E",
    "sourceVerified": true,
    "url": "https://www.cambridge.org/core/journals/antimicrobial-stewardship-and-healthcare-epidemiology/article/...",
    "authors": "Osei Kuffour E et al.",
    "journal": "Antimicrobial Stewardship & Healthcare Epidemiology",
    "doi": "10.1017/ash.2023.xxx"
  }
]
```

### getEducationItems() in content.ts
```typescript
// Source: established pattern of getAllBriefs() in app/lib/content.ts
export function getEducationItems(): EducationItem[] {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, 'education.json'),
    'utf-8'
  );
  return JSON.parse(raw) as EducationItem[];
}
```

### Publication card visual distinction
```tsx
// EducationCard.tsx — publication-specific metadata block
// Source: codebase pattern from BriefCard.tsx + CONTEXT.md requirements
{item.format === 'Publication' && (
  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
    {item.authors && <p>{item.authors}</p>}
    {item.journal && (
      <p>
        <span className="italic">{item.journal}</span>
        {item.year && `, ${item.year}`}
      </p>
    )}
    {item.doi && (
      <p className="font-mono text-[11px] text-slate-400 truncate">
        DOI: {item.doi}
      </p>
    )}
  </div>
)}
```

### Source citation display (verified and unverified)
```tsx
// Bottom of every card
<div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100">
  {item.sourceVerified ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-slate-500 hover:text-teal-600 transition-colors"
    >
      {item.source}{item.year ? `, ${item.year}` : ''} ↗
    </a>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      Source unverified
    </span>
  )}
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline array in page.tsx (Phase 8) | content/education.json data file | Phase 16 | Content grows without code changes |
| Single audience filter (4 tabs) | Four independent filter dimensions | Phase 16 | Precision browsing for the target audience |
| No tabs | Training / Resources tabs with URL hash | Phase 16 | Shareable URLs; clear content taxonomy |
| No source citations | Verified source on every card + "unverified" flag | Phase 16 | Credibility requirement for policymaker audience |
| ResourceFormat = Article/Download/Video only | Extended to include Course/Webinar/Workshop/Certification/Publication | Phase 16 | Supports training content and peer-reviewed publications |

**Deprecated/outdated:**
- Inline `educationResources: EducationResource[]` array in `app/education/page.tsx`: replaced by `content/education.json` + `getEducationItems()`
- Single-dimension audience tab bar in `EducationGrid.tsx`: replaced by four-dimension pill filter system in `EducationTabs.tsx`
- `EducationGrid.tsx` component itself: replaced by `EducationTabs.tsx` + `EducationCard.tsx` + `EducationFilters.tsx`

---

## Open Questions

1. **Migrating 12 existing resources to education.json — tab assignment for current items**
   - What we know: Current items are: 4× Policymaker (Downloads), 4× Healthcare Worker/Policymaker mix (Articles/Downloads), 4× General Public (Articles). None appear to be structured training courses.
   - What's unclear: Should all 12 go into "resources" tab, or should any be reclassified as Training? The CONTEXT.md definition of Training is "structured learning you complete" — none of the 12 seem to be courses.
   - Recommendation: Place all 12 existing items in `tab: "resources"`. Seed the training tab with at least 2-3 WHO Academy / Coursera / ECHO course entries so it renders non-empty from day 1.

2. **Topics for existing items — no existing taxonomy**
   - What we know: The briefs use themes: "Governance", "Laboratory Systems", "Predictive Analytics", "One Health", "Stewardship", "Financing", "Political Economy". Education items have no topic metadata yet.
   - What's unclear: Whether to align education topics exactly with brief themes, or use a broader set.
   - Recommendation: Use a slightly broader education-specific taxonomy (8 topics proposed in Architecture Patterns). This allows education topics to cover "General Awareness" and "Research & Methods" that don't map to brief themes.

3. **Filter state persistence across tab switches**
   - What we know: CONTEXT.md says filters are "applied to each tab independently."
   - What's unclear: If user sets audience=Policymaker on Training, switches to Resources, and switches back — should the Policymaker filter still be active on Training?
   - Recommendation: Reset all filters on tab switch (simpler implementation, clearer UX — user can re-apply if wanted). Per-tab filter memory would require more state management for marginal UX benefit.

---

## Sources

### Primary (HIGH confidence)
- Codebase inspection — `app/education/page.tsx`, `app/components/education/EducationGrid.tsx`, `app/lib/types.ts`, `app/lib/content.ts`, `next.config.js`, `package.json`, `app/globals.css` — direct source inspection confirms all library versions, patterns, and constraints
- `app/components/briefs/BriefGrid.tsx` — authoritative reference for client-side filter pattern with useMemo in this codebase
- `next.config.js` — confirms `output: 'export'` (fully static, no SSR), no `useSearchParams` without Suspense

### Secondary (MEDIUM confidence)
- Next.js documentation pattern for static export + client-side interactivity — consistent with Next.js 14/15 static export limitations; `output: 'export'` behavior well-documented
- URL hash + popstate as the canonical client-side hash navigation approach — standard Web API, not library-specific

### Tertiary (LOW confidence)
- None — all findings based on direct codebase inspection and stable Web/React APIs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries inspected directly in package.json; no new packages needed
- Architecture: HIGH — pattern directly mirrors existing BriefGrid/EducationGrid in codebase; URL hash approach is standard Web API
- Pitfalls: HIGH — hydration mismatch and filter state bleed are well-known React/Next.js static export patterns; verified against codebase constraints
- Data model: HIGH — existing types.ts and briefs-index.json directly inform the new schema design

**Research date:** 2026-05-08
**Valid until:** 2026-06-08 (Next.js 16.x is stable; React 19 is stable; Tailwind v4 is stable)
