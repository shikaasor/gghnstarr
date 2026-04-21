# Phase 2: Homepage & Design System - Research

**Researched:** 2026-03-28
**Domain:** Next.js 16 static export homepage — hero, sections, Google Apps Script form integration
**Confidence:** HIGH (codebase fully read; technical claims verified against installed packages and official sources)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero section**
- White background with brand teal for headline text, badge, and CTA button
- Full viewport height (100vh) — dramatic, full-screen opening
- Text-only layout, centered — badge above headline, sub-headline below, CTA button last
- Conference badge is a dynamic countdown timer showing days until June 28, 2026 — needs `'use client'` component for live count
- Badge format: calendar icon + "X days to June 28, 2026" with the Inter-Ministerial Conference name

**Page section order (top to bottom)**
1. Hero (100vh)
2. Stats Strip (auto-rotating AMR stat)
3. Three Pillars icon grid
4. Featured Brief
5. Partner Logos
6. Newsletter Signup
7. Footer

**Section backgrounds**
- Alternating white / light-grey backgrounds for visual separation — no borders between sections

**Three Pillars**
- 3-column layout: icon + bold title only — no description text
- Icons should be simple, symbolic (e.g. DNA/microscope for Genomic Surveillance, chart for Predictive Analytics, globe for One Health Governance)
- On mobile: stacks to single column

**Stats Strip**
- Stats data comes from `site.json` (editable by non-developers without code changes)
- Display: auto-rotating single stat — one stat at a time, cycling on a timer
- Each stat: large number + label line (e.g. "700,000 deaths/year — attributed to AMR globally")
- Needs `'use client'` for rotation

**Featured Brief**
- Determined by `featured: true` flag on the brief entry in `briefs-index.json` — team manually flags which brief to feature each week
- Displays: title + key messages list (bullet points from `key_messages` field) + prominent "Download PDF" button
- Does NOT show full executive summary — key messages only for scannability

**Partner Logos**
- Full colour logos (not grayscale)
- Single horizontal row on desktop
- Logos: GUCGHPI, Fleming Fund, Africa CDC, WHO AFRO

**Newsletter Signup**
- Backend: Google Apps Script Web App — accepts POST request, appends row to Google Sheet, sends email notification via Gmail
- Placement: dedicated section near bottom of page, before footer
- Fields: email address only (keep friction low)
- Success state: inline confirmation message replaces the form (no toast, no redirect)
- Error state: Claude's Discretion

### Claude's Discretion
- Exact icon choices for the Three Pillars
- Newsletter error state handling
- Spacing, padding, and typography scale across sections
- Mobile breakpoint behaviour for partner logos row (can wrap or scroll)
- Exact animation/transition duration for stats rotation and countdown display
- CTA button text in hero (requirement says "Read the Latest Policy Brief" — use that unless there's a strong reason not to)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Hero section with conference badge, headline, sub-headline, CTA; Three Pillars icon grid | Countdown timer pattern, lucide-react icon selection, Tailwind v4 100vh, brand tokens |
| HOME-02 | Featured Brief (title, key messages, Download PDF); Stats Strip (rotating AMR stats) | `featured` field schema addition, `keyMessages` already present, useEffect rotation pattern |
| HOME-03 | Partner Logos strip — GUCGHPI, Fleming Fund, Africa CDC, WHO AFRO | `public/images/partners/` placeholder exists, `<img>` tag pattern for static export |
| HOME-04 | Newsletter signup — email capture, submit to Google Apps Script (overrides Mailchimp in requirement text) | `text/plain` CORS workaround, inline success/error state pattern |
</phase_requirements>

---

## Summary

Phase 1 delivered a working skeleton: layout shell (Header, Footer, Container), JSON seed data in `content/`, type definitions in `app/lib/types.ts`, and five stub pages. The homepage (`app/page.tsx`) is a single-sentence placeholder. Everything this phase builds goes into `app/page.tsx` plus new section components under `app/components/sections/`.

Two schema gaps must be fixed before the homepage can be fully functional: `briefs-index.json` lacks a `featured` field (used by Featured Brief section), and `site.json` lacks a `stats` array (used by Stats Strip). Both are additive changes to existing JSON — no type breakage.

The most nuanced technical decision in this phase is the Google Apps Script newsletter integration. Browser CORS restrictions prevent sending `application/json` to a GAS Web App because the preflight OPTIONS request is never answered. The verified workaround is to send the body as a string with `Content-Type: text/plain;charset=utf-8` — this is classified as a "simple request" by the CORS spec and skips the preflight entirely. The GAS script receives the body as `e.postData.contents` and parses it with `JSON.parse`.

**Primary recommendation:** Build all homepage sections as individual Server Components (plain functions) except the two that require browser APIs — `ConferenceBadge` (countdown timer) and `StatStrip` (auto-rotation) — which must be `'use client'`. Keep `app/page.tsx` as a Server Component that imports both types, since Next.js allows Server Components to import Client Components.

---

## Existing Codebase Inventory

### What Phase 1 Built (DO NOT REBUILD)

| File | What It Is |
|------|-----------|
| `app/components/layout/Header.tsx` | `'use client'` — sticky navy header, hamburger menu, lucide Menu/X icons |
| `app/components/layout/Footer.tsx` | Server Component — navy footer, partner text list, contact links |
| `app/components/layout/Container.tsx` | Server Component — `max-w-5xl mx-auto px-4 sm:px-6` wrapper using `clsx` |
| `app/lib/types.ts` | Locked interfaces: `Brief`, `Expert`, `SiteContent` |
| `app/lib/content.ts` | `getAllBriefs()`, `getBriefBySlug()`, `getExperts()`, `getSiteContent()` — all use `fs.readFileSync` |
| `app/globals.css` | Tailwind v4 `@theme` block with all brand color tokens and font stacks |
| `content/briefs-index.json` | 3 briefs (week 1-3) — NO `featured` field yet |
| `content/site.json` | Partners array, conference metadata — NO `stats` array yet |

### Brand Tokens Already Available (from `globals.css @theme`)

```
--color-navy-950   #0F172A   Deep navy — header/footer background
--color-navy-900   #1E293B   Card/secondary dark
--color-navy-800   #2D3F55   Borders/dividers
--color-teal-600   #0D9488   Primary CTA/accent
--color-teal-500   #14B8A6   Hover states
--color-teal-400   #2DD4BF   Highlights/dark mode
--color-slate-50   #F8FAFC   Primary light background
--color-slate-100  #F1F5F9   Alternate section background (light grey)
--color-slate-200  #E2E8F0   Borders
--color-slate-600  #475569   Body text
--color-slate-900  #0F172A   (same as navy-950)
--font-sans        ui-sans-serif, system-ui, -apple-system, ... (system stack)
--font-serif       Georgia, Cambria, "Times New Roman", ...
```

### Path Alias

`@/*` maps to `./app/*` (verified in `tsconfig.json`). So:
- `@/components/layout/Container` → `app/components/layout/Container.tsx`
- `@/lib/content` → `app/lib/content.ts`

---

## Standard Stack

### Core (already installed — no new dependencies needed)

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `next` | 16.2.1 | Framework | `output: 'export'`, `images: { unoptimized: true }` |
| `react` | 19.2.4 | UI runtime | React 19 concurrent features available |
| `tailwindcss` | ^4.2.2 | Styling | CSS-first config via `@theme` in `globals.css` |
| `lucide-react` | ^1.6.0 | Icons | 5813 icons confirmed available |
| `clsx` | ^2.1.1 | Class merging | Used in Container already |
| `tailwind-merge` | ^3.5.0 | Class deduplication | Available but not yet used — use for variant-heavy components |

**No new packages required for this phase.** All functionality (countdown, rotation, form submission) is achievable with React hooks and the browser fetch API.

### Confirmed Available lucide-react Icons

For Three Pillars (Claude's Discretion — these are recommended):

| Pillar | Recommended Icon | Rationale |
|--------|-----------------|-----------|
| Genomic Surveillance | `Dna` | Direct symbol for genomics; instantly recognizable |
| Predictive Analytics | `TrendingUp` | Universally understood as "forecasting/analytics" |
| One Health Governance | `Globe` | Earth/global scope; clean and simple |

Alternative icons also confirmed available: `Microscope`, `BarChart2`, `Activity`, `Brain`, `LineChart`, `Network`, `Earth`.

For supporting UI:
- Badge: `CalendarDays` (calendar with days grid)
- Download button: `Download`
- Newsletter success: `CheckCircle`
- Newsletter error: `AlertCircle`
- Newsletter loading: `Loader2`
- CTA arrow: `ArrowRight`

---

## Schema Gaps (Must Fix Before Building)

### Gap 1: `briefs-index.json` — Missing `featured` field

**Current state:** No `featured` field on any brief entry.

**Required addition:** Add `"featured": true` to exactly one brief. The week-03 brief (most recent) is the logical default for initial deployment.

**Type update needed in `app/lib/types.ts`:**
```typescript
export interface Brief {
  // ... existing fields ...
  featured?: boolean;   // ADD: true on whichever brief the team wants featured this week
}
```

**Content function needed in `app/lib/content.ts`:**
```typescript
export function getFeaturedBrief(): Brief | undefined {
  return getAllBriefs().find((b) => b.featured === true);
}
```

### Gap 2: `site.json` — Missing `stats` array

**Current state:** `site.json` has `siteTitle`, `tagline`, `conferenceDate`, `conferenceLocation`, `partners`, `contactEmail`, `linkedinUrl`, `footerTagline`. No `stats`.

**Required addition:** Add a `stats` array. This is data the non-developer team edits directly.

**Proposed JSON structure:**
```json
"stats": [
  { "value": "700,000", "label": "deaths/year attributed to AMR globally" },
  { "value": "4.95M", "label": "deaths associated with AMR in 2019" },
  { "value": "10M", "label": "projected AMR deaths annually by 2050" }
]
```

**Type update needed in `app/lib/types.ts`:**
```typescript
export interface SiteContent {
  // ... existing fields ...
  stats: Array<{
    value: string;   // "700,000" — pre-formatted, not a raw number
    label: string;   // "deaths/year attributed to AMR globally"
  }>;
}
```

**Content function already exists:** `getSiteContent()` will automatically include the `stats` field once it's in the JSON and the type is updated.

---

## Architecture Patterns

### Recommended Component Structure

```
app/
├── page.tsx                              # Server Component — homepage orchestrator
├── components/
│   ├── layout/
│   │   ├── Container.tsx                 # EXISTS — max-w-5xl wrapper
│   │   ├── Header.tsx                    # EXISTS
│   │   └── Footer.tsx                    # EXISTS
│   └── sections/                         # NEW — all homepage sections
│       ├── HeroSection.tsx               # Server Component (static content)
│       ├── ConferenceBadge.tsx           # 'use client' — countdown timer
│       ├── StatStrip.tsx                 # 'use client' — auto-rotating stat
│       ├── ThreePillars.tsx              # Server Component
│       ├── FeaturedBrief.tsx             # Server Component
│       ├── PartnerLogos.tsx              # Server Component
│       └── NewsletterSignup.tsx          # 'use client' — form state management
```

### Pattern 1: Server Component Homepage Orchestrator

`app/page.tsx` reads data at build time (static export) and passes it as props to sections. It imports both Server and Client Components — this is valid in Next.js.

```typescript
// app/page.tsx — Server Component (no 'use client' directive)
import { getAllBriefs, getSiteContent, getFeaturedBrief } from '@/lib/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatStrip } from '@/components/sections/StatStrip';
import { ThreePillars } from '@/components/sections/ThreePillars';
import { FeaturedBrief } from '@/components/sections/FeaturedBrief';
import { PartnerLogos } from '@/components/sections/PartnerLogos';
import { NewsletterSignup } from '@/components/sections/NewsletterSignup';

export default function HomePage() {
  const site = getSiteContent();
  const featured = getFeaturedBrief();

  return (
    <>
      <HeroSection conferenceDate={site.conferenceDate} />
      <StatStrip stats={site.stats} />
      <ThreePillars />
      {featured && <FeaturedBrief brief={featured} />}
      <PartnerLogos partners={site.partners} />
      <NewsletterSignup />
    </>
  );
}
```

### Pattern 2: Alternating Section Backgrounds

Hero is white (default body bg). Alternate subsequent sections using `bg-slate-100` (light grey token already defined) vs. no background class (inherits `bg-slate-50` from body).

Section order and backgrounds:
1. Hero — `bg-white` (explicit, since body is `bg-slate-50`)
2. Stats Strip — `bg-slate-100`
3. Three Pillars — `bg-white`
4. Featured Brief — `bg-slate-100`
5. Partner Logos — `bg-white`
6. Newsletter Signup — `bg-slate-100`

Each section component owns its own background class at the outermost `<section>` element, so it's self-contained:

```tsx
<section className="bg-slate-100 py-16">
  <Container>
    {/* content */}
  </Container>
</section>
```

### Pattern 3: 100vh Hero

Use `min-h-screen` (Tailwind v4, maps to `min-height: 100vh`) combined with flexbox centering. `min-h-screen` is preferred over `h-screen` because it doesn't clip content on small viewports.

```tsx
// HeroSection.tsx — Server Component
import { ConferenceBadge } from './ConferenceBadge';
import Link from 'next/link';

export function HeroSection({ conferenceDate }: { conferenceDate: string }) {
  return (
    <section className="bg-white min-h-screen flex flex-col items-center justify-center text-center px-4">
      <ConferenceBadge conferenceDate={conferenceDate} />
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-teal-600 mt-6 max-w-3xl">
        AMR Policy Intelligence for Africa
      </h1>
      <p className="text-slate-600 text-lg md:text-xl mt-4 max-w-2xl">
        Evidence-backed policy briefs for the road to the 5th Inter-Ministerial Conference
      </p>
      <Link
        href="/briefs"
        className="mt-8 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-6 py-3 rounded transition-colors"
      >
        Read the Latest Policy Brief
      </Link>
    </section>
  );
}
```

### Pattern 4: Countdown Timer (Client Component)

The countdown timer must be a `'use client'` component. The critical pattern for avoiding hydration mismatch: initialize state to `null`, compute days only inside `useEffect`, render a placeholder until mounted.

```tsx
// ConferenceBadge.tsx
'use client';
import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';

export function ConferenceBadge({ conferenceDate }: { conferenceDate: string }) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date('2026-06-28T00:00:00');
    const compute = () => {
      const now = new Date();
      const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diff));
    };
    compute();
    const id = setInterval(compute, 60_000); // update every minute
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-teal-600/10 border border-teal-600/20 text-teal-600 px-4 py-2 rounded-full text-sm font-medium">
      <CalendarDays size={16} />
      <span>
        {daysLeft === null
          ? 'Road to the 5th Inter-Ministerial Conference'
          : `${daysLeft} days to June 28, 2026 — 5th Inter-Ministerial Conference`}
      </span>
    </div>
  );
}
```

**Why `null` initial state:** Server renders `null` → renders the text fallback. Client mounts → `useEffect` fires → computes days → re-renders with number. Both sides agree on the initial render (fallback text), eliminating the hydration mismatch.

### Pattern 5: Auto-Rotating Stats (Client Component)

```tsx
// StatStrip.tsx
'use client';
import { useState, useEffect } from 'react';

interface Stat { value: string; label: string; }

export function StatStrip({ stats }: { stats: Stat[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (stats.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % stats.length);
    }, 4000);
    return () => clearInterval(id);
  }, [stats.length]);

  const stat = stats[index];
  if (!stat) return null;

  return (
    <section className="bg-slate-100 py-12 text-center">
      <p className="text-4xl md:text-5xl font-serif font-bold text-teal-600">{stat.value}</p>
      <p className="text-slate-600 mt-2 text-base md:text-lg">{stat.label}</p>
    </section>
  );
}
```

**CSS-only rotation is not viable** for this pattern because the data is dynamic (comes from JSON) and the count is variable. JavaScript (useEffect + setInterval) is required.

### Pattern 6: Three Pillars Grid (Server Component)

No data dependency — static content. Pure Server Component.

```tsx
// ThreePillars.tsx — Server Component
import { Dna, TrendingUp, Globe } from 'lucide-react';

const pillars = [
  { icon: Dna, title: 'Genomic Surveillance' },
  { icon: TrendingUp, title: 'Predictive Analytics' },
  { icon: Globe, title: 'One Health Governance' },
];

export function ThreePillars() {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {pillars.map(({ icon: Icon, title }) => (
            <div key={title} className="flex flex-col items-center gap-4">
              <Icon size={48} className="text-teal-600" strokeWidth={1.5} />
              <h3 className="font-serif font-bold text-xl text-navy-950">{title}</h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

### Pattern 7: Featured Brief (Server Component)

```tsx
// FeaturedBrief.tsx — Server Component
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { Brief } from '@/lib/types';

export function FeaturedBrief({ brief }: { brief: Brief }) {
  return (
    <section className="bg-slate-100 py-16">
      <Container>
        <p className="text-xs uppercase tracking-wider text-teal-600 font-medium mb-2">
          Featured Policy Brief
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-navy-950 mb-4">{brief.title}</h2>
        <ul className="space-y-2 mb-6">
          {brief.keyMessages.map((msg, i) => (
            <li key={i} className="flex gap-2 text-slate-600">
              <span className="text-teal-600 mt-1 flex-shrink-0">—</span>
              <span>{msg}</span>
            </li>
          ))}
        </ul>
        <a
          href={brief.pdfUrl}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-6 py-3 rounded transition-colors"
          download
        >
          <Download size={18} />
          Download PDF
        </a>
      </Container>
    </section>
  );
}
```

### Pattern 8: Partner Logos (Server Component)

**Key finding:** `public/images/partners/.gitkeep` already exists — the directory is ready. Use standard `<img>` tags (not `next/image`) for partner logos in a static export. `next/image` with `unoptimized: true` also works, but plain `<img>` is simpler and avoids the Next.js image wrapper overhead for logos.

Partner logos are PNGs per `site.json` (`/images/partners/gghn.png` etc.). This is fine — PNG supports transparency and colour fidelity.

Note: `site.json` uses `"name": "GGHN (Good Governance for Health in Nigeria)"` as the first partner. The requirement says "GUCGHPI" — these refer to the same organisation. Use the `name` field from `site.json` as the `alt` text.

```tsx
// PartnerLogos.tsx — Server Component
import type { SiteContent } from '@/lib/types';

export function PartnerLogos({ partners }: { partners: SiteContent['partners'] }) {
  return (
    <section className="bg-white py-12">
      <Container>
        <p className="text-xs uppercase tracking-wider text-slate-400 font-medium text-center mb-8">
          Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <img
                src={p.logoUrl}
                alt={p.name}
                className="h-10 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

**Mobile behaviour (Claude's Discretion):** `flex-wrap` is recommended — logos wrap naturally on narrow viewports. Horizontal scroll is an alternative but requires `overflow-x-auto` and prevents users from seeing all logos without scrolling.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class merging with conditionals | Custom string concat | `clsx` (already installed) | Handles undefined/false/array values correctly |
| Countdown arithmetic | Custom date math library | Native `Date` + `Math.ceil` | Simple enough; no library needed |
| Form validation | Custom regex | Native `<input type="email" required>` | Browser validates email format; keeps bundle small |
| Stat rotation timing | CSS keyframes on dynamic data | `useEffect + setInterval` | Data count is variable; CSS can't iterate JSON array |
| Icon SVGs | Custom SVG files | `lucide-react` (already installed, 5813 icons) | Consistent stroke weight, size prop, accessible |
| CORS proxy server | Express/CF Worker | `text/plain` header trick on fetch | Eliminates need for any server infrastructure |

---

## Google Apps Script Integration

### The CORS Problem and the Verified Solution

Google Apps Script Web Apps only expose `doPost` and `doGet`. They cannot respond to CORS preflight OPTIONS requests. Sending `Content-Type: application/json` triggers a preflight — which silently fails.

**Verified solution (MEDIUM confidence — multiple community sources, matches CORS spec):** Send the body with `Content-Type: text/plain;charset=utf-8`. Per the CORS "simple request" rules, text/plain does not trigger a preflight. The body is still JSON-stringified — the Apps Script receives it as `e.postData.contents` and calls `JSON.parse`.

**Client-side fetch pattern:**
```typescript
async function submitNewsletter(email: string): Promise<'success' | 'error'> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL!, {
      method: 'POST',
      redirect: 'follow',         // GAS /exec returns a 302 redirect
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ email, source: 'homepage', timestamp: new Date().toISOString() }),
    });
    if (!res.ok) return 'error';
    const json = await res.json();
    return json.status === 'success' ? 'success' : 'error';
  } catch {
    return 'error';
  }
}
```

**Important:** `redirect: 'follow'` is required. GAS `/exec` endpoints issue a 302 redirect that can change POST to GET. The `redirect: 'follow'` option ensures the fetch follows through without throwing.

**Environment variable:** The GAS Web App URL should be in `.env.local` as `NEXT_PUBLIC_GAS_URL`. Since this is a static export, `NEXT_PUBLIC_` prefix bakes the value into the bundle at build time — this is acceptable for a public Web App URL.

**Apps Script side (reference for documentation, not implemented by this phase):**
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), data.email, data.source]);
  GmailApp.sendEmail('starr@gghn.org.ng', 'New Subscriber', data.email);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Newsletter Component Pattern

```tsx
// NewsletterSignup.tsx
'use client';
import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('submitting');
    const result = await submitNewsletter(email);
    setState(result);
  }

  if (state === 'success') {
    return (
      <section className="bg-slate-100 py-16 text-center">
        <Container>
          <CheckCircle className="mx-auto text-teal-600 mb-3" size={32} />
          <p className="text-navy-950 font-medium">You're subscribed. We'll send each brief directly to your inbox.</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-slate-100 py-16">
      <Container className="max-w-lg text-center">
        <h2 className="font-serif text-2xl text-navy-950 mb-2">Stay Informed</h2>
        <p className="text-slate-600 mb-6">Receive each policy brief as it's published.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border border-slate-200 rounded px-4 py-2 text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="submit"
            disabled={state === 'submitting'}
            className="bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-medium px-6 py-2 rounded transition-colors inline-flex items-center gap-2"
          >
            {state === 'submitting' && <Loader2 size={16} className="animate-spin" />}
            Subscribe
          </button>
        </form>
        {state === 'error' && (
          <p className="mt-3 text-sm text-red-600 flex items-center justify-center gap-1">
            <AlertCircle size={14} />
            Something went wrong. Please try again or email us directly.
          </p>
        )}
      </Container>
    </section>
  );
}
```

**Error state (Claude's Discretion):** Inline error message below the form (shown above) is recommended. It keeps the user in place to retry, displays the direct email as a fallback, and requires no additional UI library.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch from Countdown Timer

**What goes wrong:** Rendering `daysLeft` directly on first render causes server HTML to say "0 days" while client computes the real value, causing React to throw a hydration error.

**Why it happens:** Next.js static export still pre-renders pages to HTML. Any value that depends on `Date.now()` at render time will differ between build and client.

**How to avoid:** Initialize `daysLeft` state to `null`. Render a static placeholder string when `null`. Only set the real value inside `useEffect` (client-only).

**Warning signs:** "Hydration failed because initial UI does not match" error in console.

### Pitfall 2: GAS POST Silently Fails (No Error Shown)

**What goes wrong:** The form appears to submit but the sheet never receives data. No error is thrown because the preflight failure doesn't propagate as a caught exception in all browsers.

**Why it happens:** `Content-Type: application/json` triggers a CORS preflight. GAS has no `doOptions` handler, so the preflight gets a CORS error. The actual POST is never sent.

**How to avoid:** Always use `Content-Type: text/plain;charset=utf-8` in the fetch headers. Never switch to `application/json` regardless of what feels more "correct."

**Warning signs:** Network tab shows OPTIONS request with 405 or CORS error; no corresponding POST follows it.

### Pitfall 3: GAS URL Not Following Redirect

**What goes wrong:** The fetch call receives a 302 and treats it as an error (or switches to GET), so the data is lost.

**Why it happens:** GAS `/exec` endpoints redirect the client to the actual execution URL.

**How to avoid:** Always set `redirect: 'follow'` in the fetch options.

### Pitfall 4: `getFeaturedBrief()` Returns `undefined` in Production

**What goes wrong:** If no brief has `"featured": true`, the Featured Brief section silently disappears. No error is thrown.

**Why it happens:** `Array.find()` returns `undefined` when no match exists.

**How to avoid:** Gate the section in `page.tsx` with `{featured && <FeaturedBrief brief={featured} />}`. Additionally, establish a convention that exactly one brief must always have `featured: true` — document this in the `briefs-index.json` comments or README.

### Pitfall 5: `stats` Array Missing from `site.json` Breaks Type

**What goes wrong:** `getSiteContent()` returns a `SiteContent` object that TypeScript expects to have `stats`, but the JSON doesn't have it. Build succeeds (TypeScript doesn't validate JSON at runtime) but `StatStrip` receives `undefined` and crashes.

**Why it happens:** JSON schema and TypeScript type are out of sync until the addition is made.

**How to avoid:** Update both `site.json` AND `types.ts` in the same task. Verify with `stats?.length` guard in `StatStrip` until confirmed.

### Pitfall 6: Tailwind v4 `bg-white` vs `bg-slate-50`

**What goes wrong:** Hero sections appear slightly off-white against the body (`bg-slate-50`) when using `bg-white`.

**Why it happens:** Body is `bg-slate-50` (#F8FAFC). White sections use `bg-white` (#FFFFFF). The difference is subtle but visible.

**How to avoid:** Use `bg-white` intentionally for "white" sections and `bg-slate-50` only for the body. The contrast between `bg-white` and `bg-slate-100` is clearer for alternating sections. Hero uses `bg-white` per the locked decision.

### Pitfall 7: `next/image` vs `<img>` for Partner Logos

**What goes wrong:** Using `next/image` without explicit `width` and `height` props causes a build error in static export mode.

**Why it happens:** `next/image` requires known dimensions to calculate layout. With `unoptimized: true`, it still enforces the prop requirement.

**How to avoid:** Either provide explicit `width` and `height` props on `<Image>`, or use a plain `<img>` tag with `className="h-10 w-auto"` which avoids the constraint entirely. Plain `<img>` is recommended for partner logos.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Mailchimp embed form | Google Apps Script Web App POST | User decision overrides HOME-04 requirement text |
| `tailwind.config.js` with `theme.extend` | `@theme {}` block in `globals.css` | Tailwind v4 CSS-first — no config file |
| `darkMode: 'class'` in config | `@custom-variant dark` in CSS | Already set in `globals.css` |
| `import Image from 'next/image'` with remote URLs | `<img>` from `public/` with `images: { unoptimized: true }` | Static export constraint |
| `getStaticProps` (Pages Router) | Direct `fs.readFileSync` in Server Components | App Router — no data fetching API needed |

---

## Open Questions

1. **Partner logo files don't exist yet**
   - What we know: `public/images/partners/.gitkeep` placeholder exists; `site.json` references `.png` paths
   - What's unclear: Whether the actual logo files will be provided before Phase 2 is built
   - Recommendation: Build the `PartnerLogos` component against the schema; use alt-text-only fallback rendering if `<img>` fails to load (CSS `img:not([src])` or `object-fit: contain` with a background). The task plan should include a note that logo files must be placed in `public/images/partners/` before the section is visually complete.

2. **GAS Web App URL availability**
   - What we know: The Apps Script Web App must be deployed and its `/exec` URL added to `.env.local` as `NEXT_PUBLIC_GAS_URL`
   - What's unclear: Whether the GAS deployment exists yet
   - Recommendation: Build `NewsletterSignup` with a graceful fallback — if `NEXT_PUBLIC_GAS_URL` is undefined, disable the form button and show "Coming soon." This allows the component to ship before the backend is wired up.

3. **Exact headline text**
   - What we know: The locked decision says "brand teal for headline text" but doesn't specify the headline copy
   - What's unclear: Whether the headline is "AMR Policy Intelligence for Africa" (current placeholder in `page.tsx`) or something different
   - Recommendation: Use "AMR Policy Intelligence for Africa" from the existing placeholder unless stakeholder input says otherwise. The sub-headline can mirror the `site.json` `tagline`: "Evidence. Advocacy. Action."

---

## Sources

### Primary (HIGH confidence)
- Codebase read directly: `app/lib/types.ts`, `app/lib/content.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/components/layout/Header.tsx`, `app/components/layout/Footer.tsx`, `app/components/layout/Container.tsx`, `content/briefs-index.json`, `content/site.json`, `next.config.js`, `tsconfig.json`, `package.json`
- lucide-react icon availability: verified via `node -e` against installed `node_modules`
- Tailwind v4 utility classes (`min-h-screen`, `bg-slate-100`, etc.): documented behaviour unchanged from v3 for these utilities

### Secondary (MEDIUM confidence)
- Google Apps Script CORS workaround (`text/plain` + `redirect: 'follow'`): [GreenFlux blog](https://blog.greenflux.us/so-you-want-to-send-json-to-a-google-apps-script-web-app/) + [Lambda IITH](https://iith.dev/blog/app-script-cors/) — consistent with CORS spec "simple request" definition
- Next.js hydration mismatch with countdown timers: [Next.js official docs](https://nextjs.org/docs/messages/react-hydration-error) + multiple community sources agree on `useEffect + null initial state` pattern

### Tertiary (LOW confidence — flag for validation)
- The claim that GAS `/exec` returns a 302 that can switch POST to GET: multiple community reports, not in official GAS documentation. Mitigation: `redirect: 'follow'` is benign to add regardless.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against `package.json` and `node_modules`
- Schema gaps: HIGH — read directly from `briefs-index.json` and `site.json`
- Architecture patterns: HIGH — follows patterns already established in Phase 1 codebase
- Google Apps Script integration: MEDIUM — community-verified workaround, not in official Google docs
- Pitfalls: HIGH for codebase-derived; MEDIUM for GAS-specific

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable libraries; GAS behaviour unlikely to change)
