# Phase 3: Policy Briefs Library & Detail Pages - Research

**Researched:** 2026-03-30
**Domain:** Next.js 16 static export — filterable grid library + dynamic route detail pages + Google Sheet content workflow
**Confidence:** HIGH (codebase fully read; Next.js claims verified against official docs v16.2.1; content strategy verified against existing data layer)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Brief Card Design**
- Grid layout (2-3 columns), not list
- Large infographic thumbnail occupying the top half of each card
- Text below thumbnail: week number + date, brief title, author name (no key takeaway on the card)
- Two equal-weight download buttons side by side: "Download PDF" and "Download Infographic"
- Cards are clickable to navigate to the detail page

**Filter & Browse UX**
- Filter controls in a top bar above the grid (not a sidebar)
- Two filters: Month and Theme (both dropdowns)
- Active filter shown inline in the dropdown control itself (e.g. "Month: March") — no separate chips/tags
- Theme values derived dynamically from brief data — not hardcoded
- Empty state when no briefs match: message + "Clear filters" button

**Brief Detail Page**
- Text-first hero: week number, date, title, author name in text; thumbnail is smaller, placed beside the text
- Download buttons (PDF + Infographic) in the hero area only — not repeated lower on page
- Content sections below hero: Executive summary, Key messages (bullet list), Author bio excerpt, Prev/Next brief navigation
- URL structure: `/briefs/03` (week number slug) — already aligned with existing `slug` field in JSON

**Content Update Workflow**
- Non-developer adds briefs via a Google Sheet to JSON export approach
- PDF and infographic files are hosted externally (Google Drive / Dropbox) — JSON contains external URLs, no files committed to repo
- Workflow documented in a `CONTENT-GUIDE.md` file at the project root
- Google Apps Script or a simple export step converts Sheet rows to JSON and triggers Vercel rebuild

### Claude's Discretion
- Exact card hover/focus states
- Loading skeleton or spinner while filters apply (client-side filtering is instant, but handle gracefully)
- Prev/next brief navigation placement and styling on detail page
- Exact Google Sheet to JSON export mechanism (could be GAS, could be manual export step — choose simplest)
- Card grid responsive breakpoints (2 cols on tablet, 3 on desktop, 1 on mobile)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BREF-01 | Briefs library page with grid of BriefCards; each card displays week/date tag, bold title, author name, key takeaway summary, and "Download Full Brief (PDF)" button | Server Component reads briefs+experts at build time; passes serialized array to `'use client'` BriefGrid; BriefCard renders all fields |
| BREF-02 | Each BriefCard includes a separate "Download Infographic" button linking to the 1-page infographic PDF | `brief.infographicPdfUrl` field already in locked interface; `<a href={brief.infographicPdfUrl} target="_blank" rel="noopener noreferrer">` pattern for external links |
| BREF-03 | Client-side filtering by publication month and policy theme; filters can be combined | `useState` in `'use client'` BriefGrid; month derived from `publicationDate` string; themes from `brief.themes[]`; no library needed |
| BREF-04 | Each BriefCard displays a visual thumbnail image (infographic preview or branded cover art) | `<img>` tag (not `next/image`) due to `unoptimized: true` in next.config; `thumbnailUrl` field already in locked interface |
| BDET-01 | Individual brief detail page at /briefs/[slug]; displays full brief metadata, key messages list, download buttons, author bio excerpt; all slugs enumerated at build time via generateStaticParams | `app/briefs/[slug]/page.tsx` with exported `generateStaticParams()`; uses existing `getAllBriefs()` + `getBriefBySlug()`; Server Component at page level |
</phase_requirements>

---

## Summary

Phase 3 builds a filterable policy briefs library and per-brief detail pages on top of a fully established data layer. The data layer (briefs-index.json, experts.json, `getAllBriefs()`, `getBriefBySlug()`, `getExperts()`) was built in Phase 1 and is ready to consume. No new npm packages are required — the entire feature set is achievable with React state, standard HTML, and the project's existing stack (Next.js 16, Tailwind v4, lucide-react, clsx).

The two core technical challenges are: (1) the server/client split for the briefs library page — data must be read at build time by a Server Component and passed as props to a `'use client'` BriefGrid that handles filter state, and (2) the detail page dynamic route — `app/briefs/[slug]/page.tsx` requires an exported `generateStaticParams()` function listing all slugs at build time (mandatory for `output:'export'`). Both patterns are straightforward given the project's static export constraint.

The content update workflow (Google Sheet to JSON) is in scope but is a documentation deliverable (`CONTENT-GUIDE.md`), not a code deliverable. The simplest reliable mechanism is: (a) editors maintain briefs in a Google Sheet, (b) a bound Google Apps Script exports rows to JSON on demand, (c) the JSON is committed to the repo, and (d) Vercel auto-deploys on the commit. A Vercel Deploy Hook triggered from Apps Script is an optional enhancement but not required.

**Primary recommendation:** Build the library page as a Server Component that passes `briefs` + `experts` arrays to a `'use client'` BriefGrid. Build the detail page as a pure Server Component with `generateStaticParams`. No new dependencies.

---

## Critical Clarification: Slug vs Week Number

The CONTEXT states URL structure `/briefs/03` and says it is "already aligned with existing slug field in JSON". **This is partially incorrect.** The actual `slug` field in `briefs-index.json` uses full strings like `"week-01-amr-governance-frameworks"`, not padded week numbers. The `weekNumber` field is an integer (e.g. `1`).

**Decision required at planning time:** Use the existing `slug` field (`week-01-amr-governance-frameworks`) as the route parameter. This means:
- Route: `app/briefs/[slug]/page.tsx`
- URLs: `/briefs/week-01-amr-governance-frameworks`, `/briefs/week-02-laboratory-systems-capacity`
- `getBriefBySlug(slug)` already works correctly against this field

**Do not use weekNumber as slug.** It would require adding a padded-number-to-brief lookup, inconsistently mapping to briefURLs, and changing the JSON data. The CONTEXT's `/briefs/03` example appears to be illustrative shorthand, not a literal instruction. The note "already aligned with existing slug field in JSON" confirms intent to reuse whatever slug value is in the JSON.

---

## Standard Stack

### Core (no new packages needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16.2.1 (installed) | Pages, routing, static generation | Already installed; `output:'export'` locks us to static build |
| React | 19.2.4 (installed) | UI, useState for filters | Already installed |
| Tailwind v4 | 4.2.2 (installed) | Styling, responsive grid | CSS-first config in globals.css; brand tokens defined |
| lucide-react | 1.6.0 (installed) | Download icon (reuse from FeaturedBrief) | Already used in FeaturedBrief.tsx |
| clsx | 2.1.1 (installed) | Conditional class composition | Already used in Container.tsx |

### No Additional Packages Required

All filtering, grid layout, navigation, and image display are achievable with the existing stack. Specifically:
- **Filtering:** Native React `useState` + `Array.filter()` — no filter library needed
- **Images:** Plain `<img>` tag — `next/image` has `unoptimized: true` but `<img>` is simpler and equally valid for static thumbnails pointing to external URLs
- **Prev/Next navigation:** Computed from sorted briefs array — no routing library needed
- **Month extraction:** `new Date(brief.publicationDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })` — no date library needed

### Alternatives Considered

| Instead of | Could Use | Why Not |
|------------|-----------|---------|
| Plain `<img>` | `next/image` with `unoptimized` | Both work; `<img>` is simpler, no API surface to worry about for thumbnails pointing to external CDN URLs |
| Native `Array.filter()` | Fuse.js or similar | No search required; two-field dropdown filter is trivial with native JS |
| Google Apps Script export | Separate JSON API service | GAS is free, runs in Google's infrastructure, non-developer-friendly; no server needed |

**Installation:** No new `npm install` required.

---

## Architecture Patterns

### Recommended File Structure for Phase 3

```
app/
├── briefs/
│   ├── page.tsx                  # Server Component — reads data, renders BriefGrid
│   └── [slug]/
│       └── page.tsx              # Server Component — generateStaticParams + detail view
│
app/components/
├── briefs/                       # New component folder for phase 3
│   ├── BriefCard.tsx             # Pure presentational — thumbnail, title, author, buttons
│   ├── BriefGrid.tsx             # 'use client' — manages filter state, renders grid
│   └── BriefFilterBar.tsx        # 'use client' — month + theme dropdowns (or inline in BriefGrid)
│
content/
└── briefs-index.json             # Existing data file — no changes to schema
```

### Pattern 1: Server/Client Split for Filterable Library

**What:** The `app/briefs/page.tsx` Server Component reads all briefs and experts at build time, then passes them as serializable props to the `BriefGrid` client component which owns filter state.

**When to use:** Any time you need build-time data + interactive client state. This is the standard Next.js App Router pattern for static sites.

**Why this split matters:** `getAllBriefs()` and `getExperts()` use `fs.readFileSync` — these are Node.js APIs unavailable in client components. The page.tsx Server Component runs at build time, reads the files, and passes plain JSON arrays to BriefGrid. BriefGrid never reads files.

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components
// app/briefs/page.tsx — Server Component (no 'use client')
import { getAllBriefs, getExperts } from '@/lib/content';
import BriefGrid from '@/components/briefs/BriefGrid';

export const metadata = { title: 'Policy Briefs' };

export default function BriefsPage() {
  const briefs = getAllBriefs();   // runs at build time only
  const experts = getExperts();   // runs at build time only
  return <BriefGrid briefs={briefs} experts={experts} />;
}
```

```typescript
// app/components/briefs/BriefGrid.tsx — Client Component
'use client';
import { useState, useMemo } from 'react';
import type { Brief, Expert } from '@/lib/types';
import BriefCard from './BriefCard';

interface BriefGridProps {
  briefs: Brief[];
  experts: Expert[];
}

export default function BriefGrid({ briefs, experts }: BriefGridProps) {
  const [monthFilter, setMonthFilter] = useState<string>('');
  const [themeFilter, setThemeFilter] = useState<string>('');

  // Derive months and themes from data — never hardcode
  const months = useMemo(() => {
    const seen = new Set<string>();
    return briefs
      .map(b => {
        const d = new Date(b.publicationDate);
        return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      })
      .filter(m => !seen.has(m) && seen.add(m));
  }, [briefs]);

  const themes = useMemo(() => {
    const all = briefs.flatMap(b => b.themes);
    return [...new Set(all)].sort();
  }, [briefs]);

  const filtered = useMemo(() => briefs.filter(b => {
    const monthMatch = !monthFilter || new Date(b.publicationDate)
      .toLocaleString('en-US', { month: 'long', year: 'numeric' }) === monthFilter;
    const themeMatch = !themeFilter || b.themes.includes(themeFilter);
    return monthMatch && themeMatch;
  }), [briefs, monthFilter, themeFilter]);

  return (
    <>
      {/* Filter bar */}
      <div className="flex gap-4 mb-8">
        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
          <option value="">Month</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={themeFilter} onChange={e => setThemeFilter(e.target.value)}>
          <option value="">Theme</option>
          {themes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div>
          <p>No briefs match your filters.</p>
          <button onClick={() => { setMonthFilter(''); setThemeFilter(''); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(b => (
            <BriefCard key={b.slug} brief={b}
              expert={experts.find(e => e.id === b.authorId)} />
          ))}
        </div>
      )}
    </>
  );
}
```

### Pattern 2: generateStaticParams for Static Export

**What:** `app/briefs/[slug]/page.tsx` must export `generateStaticParams()` returning all slug values. Required by `output:'export'` — build will error without it.

**Critical constraint from official docs (v16.2.1):** With `output:'export'`, Dynamic Routes without `generateStaticParams()` are not supported and will fail the build.

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
// app/briefs/[slug]/page.tsx — Server Component

import { getAllBriefs, getBriefBySlug, getExperts } from '@/lib/content';
import { notFound } from 'next/navigation';

// REQUIRED for output:'export' — must enumerate all slugs at build time
export function generateStaticParams() {
  const briefs = getAllBriefs();
  return briefs.map(b => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) return {};
  return { title: brief.title };
}

export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) notFound();

  const experts = getExperts();
  const author = experts.find(e => e.id === brief.authorId);

  return (
    // ... detail page JSX
  );
}
```

**Note on params type:** In Next.js 16 App Router, `params` is a `Promise<{ slug: string }>` — must be awaited. This changed in Next.js 15 (confirmed in official docs). Do not use synchronous params destructuring.

### Pattern 3: Prev/Next Brief Navigation

**What:** Compute adjacent briefs from the sorted `getAllBriefs()` array. Pass as props to detail page. No router library needed.

**Example:**
```typescript
// In BriefDetailPage (Server Component)
const allBriefs = getAllBriefs(); // sorted by weekNumber ascending
const currentIndex = allBriefs.findIndex(b => b.slug === slug);
const prevBrief = currentIndex > 0 ? allBriefs[currentIndex - 1] : null;
const nextBrief = currentIndex < allBriefs.length - 1 ? allBriefs[currentIndex + 1] : null;
```

### Pattern 4: External Link Downloads

**What:** PDF and infographic URLs are external (Google Drive / Dropbox). Always open in new tab.

**Example:**
```typescript
// Open external links in new tab with security attributes
<a
  href={brief.pdfUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  <Download size={18} />
  Download PDF
</a>
```

### Pattern 5: BriefCard Component

**What:** Presentational-only — receives `brief` + `expert` as props, renders card. Wrapped in Next.js `<Link>` for navigation.

```typescript
// app/components/briefs/BriefCard.tsx — no 'use client' needed (no interactivity)
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { Brief, Expert } from '@/lib/types';

interface BriefCardProps {
  brief: Brief;
  expert?: Expert;
}

export default function BriefCard({ brief, expert }: BriefCardProps) {
  const weekLabel = `Week ${brief.weekNumber}`;
  const dateLabel = new Date(brief.publicationDate)
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 flex flex-col">
      {/* Thumbnail — top half of card */}
      <Link href={`/briefs/${brief.slug}`} className="block">
        <img
          src={brief.thumbnailUrl}
          alt={brief.title}
          className="w-full aspect-video object-cover"
        />
      </Link>
      {/* Content — bottom half */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-teal-600 font-medium mb-1">
          {weekLabel} · {dateLabel}
        </p>
        <Link href={`/briefs/${brief.slug}`}>
          <h2 className="font-serif text-navy-950 font-bold text-base mb-1 hover:text-teal-600 transition-colors">
            {brief.title}
          </h2>
        </Link>
        {expert && (
          <p className="text-sm text-slate-600 mb-4">{expert.name}</p>
        )}
        {/* Download buttons — equal weight, side by side */}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <a
            href={brief.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 text-sm font-medium border border-teal-600 text-teal-600 hover:bg-teal-50 px-3 py-2 rounded transition-colors"
          >
            <Download size={14} />
            Download PDF
          </a>
          <a
            href={brief.infographicPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 text-sm font-medium border border-slate-400 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded transition-colors"
          >
            <Download size={14} />
            Infographic
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Making BriefGrid a Server Component:** It needs `useState` for filter state — must be `'use client'`. Server Components cannot have state.
- **Reading files inside BriefGrid:** `fs.readFileSync` is Node.js only. Pass data as props from the page Server Component.
- **Hardcoding theme values:** Themes must come from `brief.themes` arrays — the locked requirement says "Theme values derived dynamically from brief data."
- **Using `next/image` for external URLs without custom loader:** The project has `images: { unoptimized: true }` which makes `<img>` equally valid and simpler.
- **Forgetting `generateStaticParams` on the detail page:** The build will throw "Page is missing generateStaticParams() so it cannot be used with output: export config" and fail.
- **Synchronous params in Next.js 16:** `params` in App Router page components is a `Promise` — must be `await`ed. Using `{ params }: { params: { slug: string } }` (without Promise) will produce TypeScript errors.
- **Linking to detail page with weekNumber instead of slug:** `getBriefBySlug()` matches on the `slug` string field, not weekNumber. Use `brief.slug` for all `href` values.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dynamic unique values for filter dropdowns | Custom dedup logic inline | `useMemo` + `new Set()` | Already in the pattern; one-liner; memoized |
| Author lookup by ID | Custom join function | `experts.find(e => e.id === brief.authorId)` | One-liner; experts array is small (< 20) |
| Month label from ISO date | Custom date formatter | `new Date(str).toLocaleString('en-US', {...})` | Native JS; no dependency needed |
| Prev/next navigation | URL-based param tracking | Array index arithmetic on sorted `getAllBriefs()` | Simpler; data already sorted by weekNumber |
| Filter URL persistence | URLSearchParams + router | Plain React state | Out of scope; no search engine indexing of filtered states needed for static export |

**Key insight:** The entire filter system is client-side state over a build-time array. There are no async operations, no pagination, and < 52 briefs at most. Native React + JS is the right tool — no filter library will improve this.

---

## Common Pitfalls

### Pitfall 1: Missing generateStaticParams Breaks the Build

**What goes wrong:** Developer creates `app/briefs/[slug]/page.tsx` without exporting `generateStaticParams()`. Running `next build` fails with: "Page is missing generateStaticParams() so it cannot be used with output: export config."

**Why it happens:** `output:'export'` requires all routes to be enumerated at build time. There is no runtime server to handle unknown slugs.

**How to avoid:** Always export `generateStaticParams()` first, before building out page content. Test with `next build` early.

**Warning signs:** Build error mentioning "generateStaticParams" or "output: export".

### Pitfall 2: Reading Files in a Client Component

**What goes wrong:** Developer puts `getAllBriefs()` call inside BriefGrid (a `'use client'` component). Build fails with "fs is not defined" or similar Node.js module error.

**Why it happens:** `fs.readFileSync` is a Node.js API. Client components run in the browser where `fs` doesn't exist.

**How to avoid:** All `fs` reads must happen in Server Components (page.tsx) and be passed as props to client components.

**Warning signs:** `TypeError: fs is not defined` during build or hydration.

### Pitfall 3: params Not Awaited in Next.js 16

**What goes wrong:** Developer writes `export default function Page({ params }: { params: { slug: string } })` — without awaiting params. TypeScript compiles but Next.js 16 warns/errors at runtime.

**Why it happens:** Next.js 15+ changed `params` to be a `Promise<{ slug: string }>` for App Router pages. The type changed.

**How to avoid:** Always use `params: Promise<{ slug: string }>` and `const { slug } = await params` in async page functions.

**Warning signs:** TypeScript error about Promise type mismatch; deprecation warnings in Next.js output.

### Pitfall 4: Theme Filter Fails When Brief Has Multiple Themes

**What goes wrong:** Filter comparison uses `brief.themes === themeFilter` (equality) instead of `brief.themes.includes(themeFilter)`. Briefs with multiple themes (e.g. `["Stewardship", "One Health"]`) fail to match either theme.

**Why it happens:** `themes` is `string[]`, not `string`. Array equality against a string is always false.

**How to avoid:** Use `brief.themes.includes(themeFilter)` in the filter predicate.

**Warning signs:** Theme filter silently returns empty results for multi-themed briefs.

### Pitfall 5: External URLs Opened in Same Tab

**What goes wrong:** Download buttons use `<a href={brief.pdfUrl}>` without `target="_blank"`. Clicking download navigates away from the site in the same tab — policymakers lose their place.

**Why it happens:** Default `<a>` behavior is same-tab navigation.

**How to avoid:** All external URL links (pdfUrl, infographicPdfUrl) must have `target="_blank" rel="noopener noreferrer"`.

**Warning signs:** Clicking download navigates away from the page.

### Pitfall 6: notFound() Must Be Imported from next/navigation

**What goes wrong:** Developer imports `notFound` from wrong path or calls a custom 404 instead. The static export doesn't correctly generate a 404 page.

**Why it happens:** `notFound()` in App Router comes from `'next/navigation'`, not from React Router or a custom utility.

**How to avoid:** `import { notFound } from 'next/navigation'` in the detail page. Call it when `getBriefBySlug()` returns undefined.

---

## Code Examples

### Content Functions (already built — use as-is)

```typescript
// Source: app/lib/content.ts (existing)
// These functions already exist. Do not rewrite them.

import { getAllBriefs } from '@/lib/content';    // returns Brief[] sorted by weekNumber asc
import { getBriefBySlug } from '@/lib/content';  // returns Brief | undefined
import { getExperts } from '@/lib/content';      // returns Expert[]
```

### Derived Month Label

```typescript
// Native JS — no date library needed
const monthLabel = (dateStr: string) =>
  new Date(dateStr).toLocaleString('en-US', { month: 'long', year: 'numeric' });
// "2026-03-10" → "March 2026"
```

### Unique Themes from Briefs Array

```typescript
// Derive dynamically — never hardcode
const themes = useMemo(() => {
  const all = briefs.flatMap(b => b.themes);
  return [...new Set(all)].sort();
}, [briefs]);
```

### generateStaticParams (Full Pattern)

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-static-params (v16.2.1)
// Must be a named export (not default) from the page module
export function generateStaticParams() {
  const briefs = getAllBriefs();
  return briefs.map(b => ({ slug: b.slug }));
  // Returns: [{ slug: 'week-01-amr-governance-frameworks' }, ...]
}
```

### Google Apps Script: Sheet to JSON Export

```javascript
// Simplest GAS approach — runs manually or on time trigger
// Source: Apps Script pattern (LOW confidence — verify against GAS docs)
function exportBriefsToJSON() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const [header, ...rows] = sheet.getDataRange().getValues();
  const briefs = rows.map(row => {
    const obj = {};
    header.forEach((key, i) => { obj[key] = row[i]; });
    // themes is comma-separated in sheet → split to array
    obj.themes = obj.themes.split(',').map(t => t.trim());
    obj.keyMessages = obj.keyMessages.split('\n').filter(Boolean);
    return obj;
  });
  // Output as JSON — developer copies to content/briefs-index.json
  Logger.log(JSON.stringify(briefs, null, 2));
}
```

**Workflow (manual — simplest path):**
1. Editor adds row in Google Sheet
2. Editor runs `exportBriefsToJSON` function manually (or uses Tools > Script editor)
3. Editor copies JSON output, replaces `content/briefs-index.json`
4. Editor commits JSON to repo
5. Vercel auto-deploys on commit to main

**Optional enhancement:** Replace manual copy with `UrlFetchApp.fetch(VERCEL_DEPLOY_HOOK_URL, {method:'post'})` to trigger rebuild without committing (but this skips the JSON commit step — use only if JSON is not version-controlled separately).

---

## Content Guide Scope (CONTENT-GUIDE.md)

This is a documentation deliverable, not a code deliverable. Write it for a non-technical audience. Must cover:

1. **Sheet column layout** — exact column names matching JSON keys: `slug`, `title`, `weekNumber`, `publicationDate`, `authorId`, `keyTakeaway`, `executiveSummary`, `keyMessages` (newline-separated), `pdfUrl`, `infographicPdfUrl`, `thumbnailUrl`, `themes` (comma-separated)
2. **How to upload PDFs** to Google Drive / Dropbox and get a shareable link for the URL fields
3. **How to run the export script** (step-by-step with menu paths)
4. **How to update briefs-index.json** — paste output into the file in the repo
5. **How to commit** — GitHub Desktop walkthrough (no terminal)
6. **Vercel auto-deploy** — explain that pushing to main triggers a rebuild

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `getStaticPaths` (Pages Router) | `generateStaticParams` (App Router) | Changed in Next.js 13 App Router; `getStaticPaths` no longer exists in App Router |
| Synchronous `params` in page components | `params: Promise<{ slug: string }>` awaited | Changed in Next.js 15; must use async page with `await params` |
| `next export` CLI command | `output: 'export'` in next.config | Changed in Next.js 14; `next export` was removed |
| `darkMode: 'class'` in tailwind.config | `@custom-variant dark` in globals.css | Tailwind v4 CSS-first — config file approach doesn't work |

**Deprecated:**
- `next export` command: removed in Next.js 14, replaced by `output: 'export'` config
- Synchronous `params` in App Router: deprecated in Next.js 15, `params` is now a Promise

---

## Open Questions

1. **Slug vs Week Number URL**
   - What we know: CONTEXT says `/briefs/03`, JSON has `slug: "week-01-amr-governance-frameworks"`, `getBriefBySlug` uses the string slug
   - What's unclear: Whether to adopt shorter week-number slugs or keep full string slugs
   - Recommendation: **Use the existing `slug` field** (`week-01-amr-governance-frameworks`). The content layer is built around it, `getBriefBySlug` works against it, and changing it would require modifying JSON data and the content function. The CONTEXT's `/briefs/03` was illustrative shorthand.

2. **Thumbnail Images for Seed Data**
   - What we know: `thumbnailUrl` fields in seed data point to `/images/thumbnails/week-01-amr-governance-frameworks.jpg` — these are local paths. Phase 3 CONTEXT says external URLs for PDFs only, not thumbnails.
   - What's unclear: Whether thumbnails are also external or local public/ assets
   - Recommendation: Thumbnails stay local (`public/images/thumbnails/`). They are not PDFs. The CONTEXT specifically says "PDF and infographic files are hosted externally" — thumbnails are not mentioned. Plan should include placeholder thumbnail images in `public/images/thumbnails/`.

3. **Google Sheet Column Layout**
   - What we know: The JSON schema has 12 fields; `themes` is `string[]`, `keyMessages` is `string[]`
   - What's unclear: How arrays are represented in the sheet (comma-separated? newline-separated?)
   - Recommendation: Use comma-separated for `themes` (short values), newline-separated for `keyMessages` (longer values). Document this in CONTENT-GUIDE.md.

---

## Sources

### Primary (HIGH confidence)
- Official Next.js docs v16.2.1 — `generateStaticParams`: https://nextjs.org/docs/app/api-reference/functions/generate-static-params (fetched 2026-03-30, last updated 2026-03-31)
- Official Next.js docs v16.2.1 — Static Exports: https://nextjs.org/docs/app/guides/static-exports (fetched 2026-03-30, last updated 2026-03-31)
- Official Next.js docs — Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Project codebase: `app/lib/content.ts`, `app/lib/types.ts`, `content/briefs-index.json`, `content/experts.json`, `next.config.js`, `tsconfig.json`, `package.json` — all read directly

### Secondary (MEDIUM confidence)
- Next.js GitHub Discussions #64660 — `useParams()` and client components with `output: 'export'` (verifies constraints)

### Tertiary (LOW confidence — verify before implementing)
- Google Apps Script JSON export pattern (WebSearch only; verify GAS API against https://developers.google.com/apps-script before writing CONTENT-GUIDE.md)
- Vercel Deploy Hook pattern (WebSearch, multiple credible sources — Vercel KB confirms basic approach)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against installed package.json and official Next.js 16.2.1 docs
- Architecture (server/client split): HIGH — verified against official Next.js App Router docs and existing codebase patterns
- generateStaticParams: HIGH — verified against official docs; confirmed output:'export' requirement
- Client-side filtering: HIGH — native React useState pattern; no library risk
- Google Apps Script workflow: LOW — only WebSearch sources; GAS API should be verified against official docs before writing CONTENT-GUIDE.md
- Slug discrepancy: HIGH — directly read from JSON data and `getBriefBySlug` source

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (Next.js is stable; Tailwind v4 is stable; risk is LOW for 30-day window)
