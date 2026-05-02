# Phase 9: News Feed - Research

**Researched:** 2026-05-02
**Domain:** API scraping (arXiv + PubMed), GitHub Actions cron, Next.js static JSON data, filterable React UI
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Article card content**
- Show a truncated abstract on each card (first 2-3 sentences, ellipsis) — scannable without clicking through
- Author display: first author + "et al." for multi-author papers (standard academic convention)
- Show journal/venue: journal name for PubMed entries, arXiv category for preprints
- Source label: plain text ("arXiv" / "PubMed"), not a coloured badge

**Feed volume & freshness**
- Scraper pulls last 7 days rolling on each daily run — catches missed articles and handles API downtime gracefully
- Cap news.json at 200 most recent articles — predictable file size, avoids build slowdown
- Deduplicate by title/DOI: if the same paper appears in both arXiv and PubMed, keep the PubMed entry

**Search query design**
- Narrow scope: core AMR terms only — "antimicrobial resistance", "antibiotic resistance", "AMR"
- Global coverage: no geographic filter — full research pool including WHO/Lancet output
- Deduplication: title/DOI match removes cross-source duplicates, preferring PubMed entry

**Browsing & navigation**
- Pagination: "Load more" button — show 20 articles initially, append next 20 on each click
- Filters: source filter (arXiv / PubMed) as scoped, PLUS a date range filter (Last 7 days / Last 30 days / All time)
- Launch state: ship with a pre-seeded news.json (~20-30 real recent AMR articles) so the page is never empty on launch

### Claude's Discretion
- Exact arXiv API query syntax and PubMed E-utilities endpoint construction
- Deduplication algorithm implementation details (exact string matching vs normalised DOI lookup)
- Error handling when API calls fail (silent fallback to existing news.json is fine)
- Card hover/interaction styling beyond the described content

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NEWS-01 | A dedicated News page (/news) displays a feed of recent AMR research articles automatically fetched from arXiv and PubMed APIs | Next.js Server Component reads content/news.json at build time via fs.readFileSync (same pattern as content.ts); 'use client' NewsGrid component handles filtering and load-more |
| NEWS-02 | A GitHub Actions workflow runs on a daily schedule, calls arXiv and PubMed search APIs with AMR-related queries, writes results to a JSON file in the repo, and triggers a Vercel rebuild | GitHub Actions cron + Node.js script pattern; git commit/push with GITHUB_TOKEN (contents: write); Vercel auto-deploys on push to main — no separate deploy hook needed |
| NEWS-03 | Each news card shows article title, source (arXiv/PubMed), authors, publication date, and a link to the original article | NewsArticle TypeScript type defines all required fields; card renders title, source text, "FirstAuthor et al.", date, journal/category, truncated abstract, external link |
| NEWS-04 | News feed can be filtered by source (arXiv / PubMed) and is sorted by publication date (newest first) | Filtering pattern is established by EducationGrid ('use client' with useState); scraper writes articles sorted newest-first; date range filter implemented client-side using publishedDate field |
</phase_requirements>

---

## Summary

Phase 9 has two distinct deliverables that must both ship: a **scraper pipeline** (GitHub Actions cron job) and a **frontend page** (/news). The scraper is a Node.js script that calls arXiv and PubMed APIs, merges and deduplicates results, and writes `content/news.json`, then commits and pushes to `main`. Because Vercel auto-deploys on every push to `main`, no separate deploy hook is needed — the git push itself triggers a rebuild that reads the updated JSON at build time.

The frontend is a standard Next.js App Router page. A Server Component page reads `content/news.json` at build time using `fs.readFileSync` (the same pattern already used in `app/lib/content.ts`), then passes the full article array to a `'use client'` NewsGrid component that handles source filtering, date range filtering, and load-more pagination in React state. No library is needed for the filter/pagination logic — it is pure array manipulation, exactly as EducationGrid does for the education library.

The scraper script should be plain Node.js (no extra runtime dependencies beyond built-in `fetch` and xml parsing). arXiv returns Atom XML; the lightweight `fast-xml-parser` npm package handles this without a browser DOM. PubMed's EFetch endpoint can return JSON for article summaries via ESummary, which eliminates XML parsing on the PubMed side entirely. Rate limits are the primary operational concern: arXiv requests one call every 3 seconds; PubMed allows 3 req/s without an API key and 10 req/s with one.

**Primary recommendation:** Use the existing `content.ts` read-from-JSON pattern for the page, use the existing `EducationGrid` `'use client'` filter pattern for the UI, and write the scraper as a standalone Node.js script called by GitHub Actions — no new npm dependencies needed except `fast-xml-parser` for arXiv Atom parsing.

---

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Node.js (built-in fetch) | 18+ | HTTP calls to arXiv and PubMed in GitHub Actions | Available in `ubuntu-latest` runner, no install needed |
| fast-xml-parser | ^4.x | Parse arXiv Atom XML response into JS objects | Lightweight, no DOM dependency, works in Node.js scripts |
| GitHub Actions cron | N/A | Daily schedule trigger | Native platform feature, no third-party service |
| GITHUB_TOKEN | N/A | Authenticate git push from workflow | Built-in, no secret setup for the token itself |
| Next.js fs.readFileSync | 16.x (project) | Read news.json at build time in Server Component | Already used in app/lib/content.ts; works with output: 'export' |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| NCBI API key | Free | Raise PubMed rate limit from 3 to 10 req/s | Register at NCBI; store as GitHub Actions secret `NCBI_API_KEY` |
| Vercel auto-deploy | N/A | Rebuild site when news.json is pushed | Automatic — Vercel listens to pushes to `main` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| fast-xml-parser | DOMParser / xmldom | DOMParser not available in Node; xmldom is heavier and less maintained |
| fast-xml-parser | xml2js | xml2js works but fast-xml-parser is faster and has simpler API |
| PubMed ESummary JSON | PubMed EFetch XML | EFetch XML is richer but requires XML parsing; ESummary returns JSON with all needed fields |
| Plain git push triggering Vercel | Vercel Deploy Hook via curl | Deploy hook is redundant — Vercel already auto-deploys on push to main |

**Installation (scraper only):**
```bash
npm install fast-xml-parser
```

No new frontend dependencies needed.

---

## Architecture Patterns

### Recommended Project Structure

```
.github/
└── workflows/
    └── fetch-news.yml       # Cron workflow: runs scraper, commits, pushes

scripts/
└── fetch-news.mjs           # Node.js scraper: calls arXiv + PubMed, writes news.json

content/
└── news.json                # Written by scraper; read by page at build time

app/
└── news/
    └── page.tsx             # Server Component: reads news.json, renders NewsGrid

app/components/news/
├── NewsGrid.tsx             # 'use client': source filter + date filter + load-more
└── NewsCard.tsx             # Pure display: title, source, authors, date, abstract excerpt

app/lib/
└── types.ts                 # Add NewsArticle interface here (existing file)
```

### Pattern 1: Server Component reads JSON at build time

**What:** A Server Component (no `'use client'` directive) imports `fs` and reads `content/news.json` synchronously at `next build` time. No `getStaticProps` — the App Router Server Component runs on the server during build.

**When to use:** All data pages where content comes from a local JSON file. Already established by `app/lib/content.ts`.

```typescript
// app/news/page.tsx
// Source: app/lib/content.ts pattern (project existing code)
import fs from 'fs';
import path from 'path';
import type { NewsArticle } from '@/lib/types';
import NewsGrid from '@/components/news/NewsGrid';

function getAllArticles(): NewsArticle[] {
  const raw = fs.readFileSync(
    path.join(process.cwd(), 'content', 'news.json'),
    'utf-8'
  );
  return JSON.parse(raw) as NewsArticle[];
}

export default function NewsPage() {
  const articles = getAllArticles();
  return (
    <main>
      {/* hero section */}
      <NewsGrid articles={articles} />
    </main>
  );
}
```

### Pattern 2: Client Component filter + load-more (established by EducationGrid)

**What:** A `'use client'` component holds `activeSource`, `activeDateRange`, and `visibleCount` in `useState`. Filtering is pure array `.filter()`. Load-more increments `visibleCount` by 20.

**When to use:** Any filterable list passed from a Server Component parent.

```typescript
// app/components/news/NewsGrid.tsx
// Source: app/components/education/EducationGrid.tsx pattern (project existing code)
'use client';
import { useState } from 'react';
import type { NewsArticle } from '@/lib/types';
import NewsCard from './NewsCard';

type SourceFilter = 'All' | 'arXiv' | 'PubMed';
type DateFilter = 'Last 7 days' | 'Last 30 days' | 'All time';

const PAGE_SIZE = 20;

export default function NewsGrid({ articles }: { articles: NewsArticle[] }) {
  const [source, setSource] = useState<SourceFilter>('All');
  const [dateRange, setDateRange] = useState<DateFilter>('All time');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const cutoff = dateRange === 'Last 7 days'
    ? new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10)
    : dateRange === 'Last 30 days'
    ? new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10)
    : null;

  const filtered = articles
    .filter(a => source === 'All' || a.source === source)
    .filter(a => !cutoff || a.publishedDate >= cutoff);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      {/* source filter tabs */}
      {/* date range filter tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map(article => <NewsCard key={article.id} article={article} />)}
      </div>
      {visibleCount < filtered.length && (
        <button onClick={() => setVisibleCount(v => v + PAGE_SIZE)}>
          Load more
        </button>
      )}
    </div>
  );
}
```

### Pattern 3: GitHub Actions cron with git commit/push

**What:** Workflow triggers on `schedule` (daily), checks out the repo, runs the Node.js scraper script, then commits and pushes `content/news.json` back to `main`.

**When to use:** Any automated data refresh pipeline writing back to the repo.

```yaml
# .github/workflows/fetch-news.yml
name: Fetch AMR News

on:
  schedule:
    - cron: '0 6 * * *'   # 06:00 UTC daily
  workflow_dispatch:        # manual trigger for testing

permissions:
  contents: write           # required to push commits

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install scraper dependencies
        run: npm ci --prefix scripts   # if package.json lives in scripts/
        # OR: npm install fast-xml-parser  (if no lockfile yet)

      - name: Run scraper
        env:
          NCBI_API_KEY: ${{ secrets.NCBI_API_KEY }}
        run: node scripts/fetch-news.mjs

      - name: Commit and push news.json
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add content/news.json
          git diff --staged --quiet || git commit -m "chore(news): daily article refresh [skip ci]"
          git push
```

The `[skip ci]` suffix in the commit message prevents Vercel from deploying the `[skip ci]`-tagged commit — but standard Vercel-GitHub integration deploys on every push regardless of that tag. If deploy-on-push is enabled (it is by default), the push triggers a Vercel rebuild automatically. No deploy hook URL needed.

### Pattern 4: arXiv API query

**What:** HTTP GET to `https://export.arxiv.org/api/query` with Atom XML response.

```javascript
// scripts/fetch-news.mjs
// Source: https://info.arxiv.org/help/api/user-manual.html

const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000);
const dateStr = sevenDaysAgo.toISOString().slice(0, 10).replace(/-/g, '');
// arXiv submittedDate format: YYYYMMDDTTTT (time optional, pad with 0000)

const query = encodeURIComponent(
  '(ti:"antimicrobial resistance" OR ti:"antibiotic resistance" OR abs:"antimicrobial resistance" OR abs:"antibiotic resistance")'
);
const url = `https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=100`;

const res = await fetch(url);
const xml = await res.text();
// parse with fast-xml-parser
```

**arXiv field prefix notes:**
- `ti:` = title, `abs:` = abstract, `all:` = all fields
- Phrase search: `ti:"antimicrobial resistance"` (quotes required for multi-word)
- Boolean: `AND`, `OR`, `ANDNOT` (uppercase)
- `max_results` max per call: 2000; use `start` for pagination

### Pattern 5: PubMed ESummary (JSON, no XML parsing)

**What:** Two-step: ESearch gets PMIDs, ESummary fetches metadata as JSON.

```javascript
// scripts/fetch-news.mjs
// Source: https://www.ncbi.nlm.nih.gov/books/NBK25499/

const API_KEY = process.env.NCBI_API_KEY ?? '';
const apiParam = API_KEY ? `&api_key=${API_KEY}` : '';

// Step 1: ESearch — get PMIDs for last 7 days
const searchUrl =
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` +
  `?db=pubmed&term=antimicrobial+resistance[tiab]+OR+antibiotic+resistance[tiab]` +
  `&datetype=pdat&reldate=7&retmax=200&retmode=json&usehistory=y${apiParam}`;

const searchRes = await fetch(searchUrl);
const searchData = await searchRes.json();
const { WebEnv, query_key } = searchData.esearchresult;

// Step 2: ESummary — fetch metadata as JSON using history server
const summaryUrl =
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi` +
  `?db=pubmed&query_key=${query_key}&WebEnv=${WebEnv}&retmode=json${apiParam}`;

const summaryRes = await fetch(summaryUrl);
const summaryData = await summaryRes.json();
// summaryData.result is an object keyed by PMID
// Each entry has: .title, .authors[].name, .pubdate, .source (journal), .articleids[].value (DOI)
```

### Anti-Patterns to Avoid

- **Making API calls from the Next.js page at runtime:** With `output: 'export'`, there is no server runtime. All data must be in the JSON file before `next build`. Never use `fetch()` to arXiv/PubMed inside a page component.
- **Using EFetch XML for PubMed when ESummary JSON works:** EFetch with `rettype=abstract&retmode=xml` requires XML parsing and returns more data than needed. ESummary with `retmode=json` gives title, authors, journal, pubdate, and DOI in a simple JSON structure.
- **Storing the Vercel deploy hook URL unencrypted:** If used, it must go in GitHub Secrets. But it is not needed here — Vercel auto-deploys on push.
- **Skipping deduplication on the scraper:** Running scraper daily with 7-day rolling window means the same papers appear in consecutive runs. Always load existing `news.json`, merge new articles, deduplicate, then cap at 200.
- **Date range filter based on run date instead of article date:** The "Last 7 days" filter in the UI must filter by `article.publishedDate`, not by when the scraper ran. The scraper pulls 7 days to ensure completeness; the UI filter operates on the article's own date.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Parse arXiv Atom XML | Custom XML string splitting | `fast-xml-parser` | Namespace handling, attribute parsing, edge cases in XML are complex |
| Rate limiting between API calls | Custom sleep loop | Simple `await new Promise(r => setTimeout(r, 3100))` between arXiv requests | This IS the hand-rolled solution — it's simple enough; no library needed for a 1-call scraper |
| Search query encoding | Manual URL string building | `encodeURIComponent()` (built-in) + template literals | Correct encoding of quotes and spaces in query terms |
| Deduplication data structure | Complex comparison logic | Normalize DOI to lowercase + strip whitespace; fall back to normalized title comparison | DOIs from arXiv (`10.xxxx/arxiv.NNNN`) differ from PubMed registered DOI — normalize before compare |

**Key insight:** The scraper only runs once daily and fetches ~100-200 records from each source. There is no need for streaming, pagination queues, or retry libraries — a simple sequential script with `await fetch()` and a small delay is the correct solution.

---

## Common Pitfalls

### Pitfall 1: arXiv rate limit (3 second rule)

**What goes wrong:** arXiv's API returns HTTP 503 or silently throttles requests if you send more than one per 3 seconds. The scraper only makes 1-2 calls to arXiv per run, so this is only relevant if the query is paginated across multiple calls.

**Why it happens:** arXiv's terms of use mandate a 3-second delay between sequential requests.

**How to avoid:** Add `await new Promise(r => setTimeout(r, 3100))` between paginated arXiv calls. For a single query returning ≤100 results (which covers 7 days of AMR preprints), no delay is needed.

**Warning signs:** 503 response or empty Atom feed despite articles existing.

### Pitfall 2: GitHub Actions scheduled workflow silently disabled

**What goes wrong:** GitHub automatically disables scheduled workflows on public repos after 60 days of no repository activity (no pushes, PRs, etc.).

**Why it happens:** GitHub policy to reduce unnecessary CI load on abandoned repos.

**How to avoid:** The daily scraper commit itself counts as repository activity — since the workflow writes `news.json` daily, it resets the inactivity clock automatically. No extra action needed once the workflow is running. However: if the repo goes quiet for another reason and no articles are found (API returns empty), the workflow must still commit something or use `workflow_dispatch` periodically.

**Warning signs:** Workflow stops appearing in the Actions tab; news page shows stale dates.

### Pitfall 3: PubMed `[tiab]` field tag vs free text search

**What goes wrong:** Searching PubMed with `antimicrobial resistance` (no field tag) does a MeSH + all-fields search that may miss recent preprints not yet MeSH-indexed. Using `[tiab]` (title and abstract) returns more current results.

**Why it happens:** PubMed's default search includes MeSH term expansion which can lag for newly indexed articles.

**How to avoid:** Use `[tiab]` field tag: `antimicrobial resistance[tiab] OR antibiotic resistance[tiab]`

**Warning signs:** Very low article counts from PubMed compared to expected output.

### Pitfall 4: ESummary `pubdate` field format is inconsistent

**What goes wrong:** PubMed ESummary returns `pubdate` as a string in various formats: `"2026 May"`, `"2026 Apr 15"`, `"2026"`, etc. Sorting by this field directly fails.

**Why it happens:** PubMed stores publication dates at varying precision depending on the journal's metadata.

**How to avoid:** Parse `pubdate` into a sortable ISO string in the scraper. Map `"2026 May"` → `"2026-05-01"`, `"2026 Apr 15"` → `"2026-04-15"`. Store the normalized `publishedDate` as `YYYY-MM-DD` in `news.json`.

**Warning signs:** Articles sort incorrectly on the news page; date filter behaves unexpectedly.

### Pitfall 5: arXiv `<published>` vs `<updated>` date

**What goes wrong:** arXiv entries have both `<published>` (v1 submission date) and `<updated>` (latest version date). Using `<updated>` causes old papers that received new versions to appear as "recent".

**Why it happens:** arXiv's Atom feed includes version history metadata.

**How to avoid:** Always use `<published>` as the canonical `publishedDate` for arXiv articles.

**Warning signs:** Decade-old papers appearing at the top of the news feed after a version update.

### Pitfall 6: `news.json` not found at build time

**What goes wrong:** If the scraper has never run and `content/news.json` does not exist, `fs.readFileSync` throws and the build fails.

**Why it happens:** New repo or first deploy before the workflow has run.

**How to avoid:** Commit a pre-seeded `content/news.json` with 20-30 real articles as part of this phase (the CONTEXT.md explicitly requires this). The file must exist in the repo before the first Vercel deploy.

**Warning signs:** Vercel build error: `ENOENT: no such file or directory, open 'content/news.json'`.

### Pitfall 7: `[skip ci]` does not prevent Vercel deploy

**What goes wrong:** Adding `[skip ci]` to the scraper's commit message does not prevent Vercel from deploying. Vercel's GitHub integration deploys on all pushes to the production branch regardless of commit message.

**Why it happens:** `[skip ci]` is a GitHub Actions convention, not a Vercel convention.

**How to avoid:** This is actually the desired behavior — every push to `main` should trigger a Vercel rebuild. If rebuild costs are a concern, use Vercel's `vercel.json` `"github": { "silent": true }` or deploy hooks with explicit calls. For this project, auto-deploy is the intended mechanism.

**Warning signs:** None — this is expected behavior. Document it so it is not "fixed" accidentally.

---

## Code Examples

### NewsArticle TypeScript type

```typescript
// app/lib/types.ts — add to existing file
// Source: Designed from PubMed ESummary JSON + arXiv Atom fields

export type NewsSource = 'arXiv' | 'PubMed';

export interface NewsArticle {
  id: string;              // arXiv ID (e.g. "2504.12345") or PMID (e.g. "38123456")
  source: NewsSource;      // "arXiv" | "PubMed"
  title: string;           // Full article title
  authors: string;         // "FirstAuthor et al." or single author name
  publishedDate: string;   // ISO date YYYY-MM-DD (normalized from source)
  journal: string;         // Journal name (PubMed) or primary arXiv category (e.g. "q-bio.OT")
  abstract: string;        // Full abstract text (UI truncates to 2-3 sentences)
  url: string;             // Link to original: https://pubmed.ncbi.nlm.nih.gov/{pmid}/ or https://arxiv.org/abs/{id}
  doi?: string;            // DOI if available (used for deduplication)
}
```

### Scraper deduplication logic

```javascript
// scripts/fetch-news.mjs
// Source: Deduced from CONTEXT.md decisions (prefer PubMed entry on duplicate)

function normalizeTitle(title) {
  return title.toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeDoi(doi) {
  return doi ? doi.toLowerCase().trim() : null;
}

function deduplicateMerged(articles) {
  // articles = [...pubmedArticles, ...arxivArticles]
  // PubMed comes first — on duplicate, PubMed entry wins
  const seen = new Map(); // key: normalizedDoi or normalizedTitle → article
  for (const article of articles) {
    const doiKey = normalizeDoi(article.doi);
    const titleKey = normalizeTitle(article.title);
    const key = doiKey ?? titleKey;
    if (!seen.has(key)) {
      seen.set(key, article);
    }
    // else: duplicate found — keep existing (PubMed) entry, discard this one
  }
  return Array.from(seen.values());
}
```

### Scraper: merge with existing news.json

```javascript
// scripts/fetch-news.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEWS_JSON_PATH = path.join(__dirname, '../content/news.json');

function loadExisting() {
  try {
    return JSON.parse(fs.readFileSync(NEWS_JSON_PATH, 'utf-8'));
  } catch {
    return []; // file doesn't exist yet — start fresh
  }
}

function writeNews(articles) {
  // Sort newest-first, cap at 200
  const sorted = articles
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .slice(0, 200);
  fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`Wrote ${sorted.length} articles to news.json`);
}
```

### GitHub Actions workflow (complete)

```yaml
# .github/workflows/fetch-news.yml
name: Fetch AMR News

on:
  schedule:
    - cron: '0 6 * * *'   # 06:00 UTC daily
  workflow_dispatch:        # Allow manual trigger

permissions:
  contents: write

jobs:
  fetch-news:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install fast-xml-parser
        working-directory: scripts

      - name: Run news scraper
        env:
          NCBI_API_KEY: ${{ secrets.NCBI_API_KEY }}
        run: node scripts/fetch-news.mjs

      - name: Commit updated news.json
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add content/news.json
          git diff --staged --quiet && echo "No changes to commit" || \
            git commit -m "chore(news): daily article refresh $(date -u +%Y-%m-%d)"
          git push
```

Note: `git diff --staged --quiet && echo "No changes" || git commit ...` pattern ensures the workflow does not fail when no new articles are found (which would cause `git commit` to error on an empty commit).

### arXiv Atom XML parsing with fast-xml-parser

```javascript
// scripts/fetch-news.mjs
// Source: https://info.arxiv.org/help/api/user-manual.html + fast-xml-parser docs

import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

async function fetchArxiv() {
  const query = encodeURIComponent(
    'ti:"antimicrobial resistance" OR ti:"antibiotic resistance" OR abs:"antimicrobial resistance"'
  );
  const url = `https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=100`;

  const res = await fetch(url);
  const xml = await res.text();
  const parsed = parser.parse(xml);
  const entries = parsed?.feed?.entry ?? [];
  const entriesArr = Array.isArray(entries) ? entries : [entries];

  return entriesArr.map(entry => {
    const authors = Array.isArray(entry.author) ? entry.author : [entry.author];
    const firstAuthor = authors[0]?.name ?? 'Unknown';
    const authorStr = authors.length > 1 ? `${firstAuthor} et al.` : firstAuthor;

    // entry.id is the abstract URL e.g. http://arxiv.org/abs/2504.12345v1
    const arxivId = entry.id.split('/abs/')[1].replace(/v\d+$/, '');
    const category = entry['arxiv:primary_category']?.['@_term'] ?? '';

    return {
      id: arxivId,
      source: 'arXiv',
      title: entry.title.trim(),
      authors: authorStr,
      publishedDate: entry.published.slice(0, 10),  // use <published> not <updated>
      journal: category,
      abstract: entry.summary?.trim() ?? '',
      url: `https://arxiv.org/abs/${arxivId}`,
      doi: entry['arxiv:doi'] ?? undefined,
    };
  });
}
```

### PubMed ESummary JSON parsing

```javascript
// scripts/fetch-news.mjs
// Source: https://www.ncbi.nlm.nih.gov/books/NBK25499/

async function fetchPubmed() {
  const apiKey = process.env.NCBI_API_KEY ?? '';
  const apiParam = apiKey ? `&api_key=${apiKey}` : '';

  const searchUrl =
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` +
    `?db=pubmed&term=antimicrobial+resistance[tiab]+OR+antibiotic+resistance[tiab]` +
    `&datetype=pdat&reldate=7&retmax=200&retmode=json&usehistory=y${apiParam}`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  const { WebEnv, query_key, count } = searchData.esearchresult;
  if (parseInt(count) === 0) return [];

  const summaryUrl =
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi` +
    `?db=pubmed&query_key=${query_key}&WebEnv=${WebEnv}&retmode=json${apiParam}`;

  const summaryRes = await fetch(summaryUrl);
  const summaryData = await summaryRes.json();
  const results = summaryData.result;
  const uids = results.uids ?? [];

  return uids.map(uid => {
    const r = results[uid];
    const authors = r.authors ?? [];
    const firstAuthor = authors[0]?.name ?? 'Unknown';
    const authorStr = authors.length > 1 ? `${firstAuthor} et al.` : firstAuthor;

    // Normalize pubdate: "2026 May" | "2026 Apr 15" | "2026"
    const pubdate = r.pubdate ?? '';
    const publishedDate = normalizePubDate(pubdate);

    const doi = r.articleids?.find(id => id.idtype === 'doi')?.value ?? undefined;
    const pmid = r.uid;

    return {
      id: pmid,
      source: 'PubMed',
      title: r.title,
      authors: authorStr,
      publishedDate,
      journal: r.source ?? '',  // journal name
      abstract: '',             // ESummary does not include abstract; use EFetch if needed
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      doi,
    };
  });
}

function normalizePubDate(pubdate) {
  const months = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
  const parts = pubdate.trim().split(/\s+/);
  const year = parts[0] || new Date().getFullYear().toString();
  const month = String(months[parts[1]] ?? 1).padStart(2, '0');
  const day = String(parseInt(parts[2]) || 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

**Note on abstracts from PubMed:** ESummary does not include abstract text. To get abstracts, the scraper must make an additional EFetch call with `rettype=abstract&retmode=xml` (requires XML parsing) or `rettype=docsum`. Given that the project already uses `fast-xml-parser` for arXiv, a single EFetch XML call for all PMIDs using the History server WebEnv is feasible. Alternatively, abstracts can be omitted from PubMed entries (showing only title, authors, journal) and the abstract field left empty. This is a discretion area — the locked decision only requires showing "a truncated abstract". If fetching PubMed abstracts, use EFetch with WebEnv:

```javascript
const fetchUrl =
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi` +
  `?db=pubmed&query_key=${query_key}&WebEnv=${WebEnv}&retmode=xml&rettype=abstract${apiParam}`;
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getStaticProps` (Pages Router) | Server Component reads fs directly (App Router) | Next.js 13.4+ | No function export needed; just import fs at top of page file |
| `next export` CLI command | `output: 'export'` in next.config.js | Next.js 14 | `next export` removed; already configured correctly in this project |
| EFetch XML for all PubMed data | ESummary JSON for metadata + optional EFetch for abstracts | Available throughout E-utilities lifecycle | Simpler JSON parsing; fewer dependencies |
| Separate Vercel deploy hook step in workflow | Push to main triggers auto-deploy | Vercel-GitHub integration baseline | Eliminates need to store `VERCEL_DEPLOY_HOOK` secret |

**Deprecated/outdated:**
- `next export` CLI: Removed in Next.js 14; this project already uses `output: 'export'` correctly
- `getStaticProps`: Pages Router only; not used in this project's App Router

---

## Open Questions

1. **Should PubMed abstracts be fetched via EFetch or omitted?**
   - What we know: ESummary JSON does not include abstract text; EFetch XML does but requires a separate request and XML parsing
   - What's unclear: Whether the additional network call and parsing complexity is worth it given the abstract is truncated to 2-3 sentences anyway
   - Recommendation: Fetch PubMed abstracts via EFetch using the History server (single bulk request, same `WebEnv`). The `fast-xml-parser` is already installed for arXiv. The user decision says "show a truncated abstract" on each card — implement this fully for both sources.

2. **Should the scraper run as a `.mjs` file or as a separate npm workspace?**
   - What we know: The project has one `package.json` at root with no `scripts/package.json`; the existing `scripts/convert-briefs-to-pdf.py` is Python
   - What's unclear: Whether `fast-xml-parser` should be a devDependency in the root `package.json` or in a local `scripts/` package
   - Recommendation: Add `fast-xml-parser` as a devDependency to the root `package.json` to keep it simple. The GitHub Actions workflow runs `npm ci` at the repo root anyway.

3. **Does the `[skip ci]` commit message convention prevent Vercel deploys?**
   - What we know: Vercel auto-deploys on every push to main regardless of commit message; `[skip ci]` only affects GitHub Actions
   - What's unclear: Whether the user wants to limit Vercel deploys per day (Vercel Hobby tier has 100 deployments/month)
   - Recommendation: The daily scraper commit = 1 Vercel deploy per day = 30/month, well within Hobby limits. Document this in the workflow comments. No action needed.

---

## Sources

### Primary (HIGH confidence)
- `https://info.arxiv.org/help/api/user-manual.html` — arXiv API query syntax, field prefixes, date parameters, Atom XML response format, rate limit guidance (3s between requests)
- `https://www.ncbi.nlm.nih.gov/books/NBK25499/` — PubMed E-utilities ESearch/EFetch endpoint URLs and parameters, History server (WebEnv/query_key)
- `https://www.ncbi.nlm.nih.gov/books/NBK25497/` — NCBI rate limits: 3 req/s without API key, 10 req/s with; `api_key` parameter name
- `https://vercel.com/docs/deploy-hooks` — Deploy hook mechanism; confirmed that POST to hook URL triggers rebuild; no auth header needed
- `https://nextjs.org/docs/app/guides/static-exports` — Confirmed Server Components run at `next build` time; `fs.readFileSync` works in App Router Server Components; lists unsupported features
- `https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token` — `permissions: contents: write` YAML syntax
- `https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule` — Cron syntax, UTC timezone, 60-day inactivity disable on public repos

### Secondary (MEDIUM confidence)
- Multiple WebSearch results confirming Vercel auto-deploys on push to main (verified against Vercel docs at https://vercel.com/docs/git/vercel-for-github)
- WebSearch results confirming `git config user.name/email` + `git add` + `git commit` + `git push` pattern for workflow bot commits (consistent across multiple sources)
- https://www.codemzy.com/blog/scheduling-builds-github-actions — Pattern for `curl -X POST` deploy hook in GitHub Actions

### Tertiary (LOW confidence)
- arXiv `submittedDate` filter format `[YYYYMMDDTTTT+TO+YYYYMMDDTTTT]` — found in user manual but exact padding requirements not tested; use the simpler `sortBy=submittedDate&sortOrder=descending` + `reldate`-equivalent approach instead (fetch recent 100 and filter client-side by `<published>` date)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — arXiv and PubMed APIs are stable, official docs confirmed; Next.js static export behavior confirmed from official docs
- Architecture patterns: HIGH — directly modelled on existing project code (content.ts, EducationGrid.tsx); GitHub Actions patterns confirmed from official docs
- Pitfalls: HIGH for API rate limits and ESummary date format (from official docs); MEDIUM for 60-day workflow disable (from official GitHub docs, behavior may vary)
- Scraper code examples: MEDIUM — patterns are from official API docs but exact field names in ESummary JSON response should be verified against a live API call during implementation

**Research date:** 2026-05-02
**Valid until:** 2026-06-01 (arXiv/PubMed APIs are stable; GitHub Actions syntax rarely changes; Next.js 16.x is current)
