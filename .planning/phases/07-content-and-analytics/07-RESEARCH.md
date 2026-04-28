# Phase 7: Content & Analytics - Research

**Researched:** 2026-04-28
**Domain:** Next.js 16 static export — GA4 analytics, next/font/google + Tailwind v4, JSON content expansion, React component authoring
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Audience CTA section**
- Placement: directly below the hero section on the homepage
- Layout: 3 side-by-side cards (equal columns)
- Background: light grey / off-white section background
- Each card has: distinct audience-specific icon + headline + primary CTA button + 2 secondary text links to related pages
- Cross-linking rules:
  - Minister → primary: /briefs | secondary: /awareness (Phase 8), /take-action (Phase 10)
  - Healthcare Worker → primary: /awareness (Phase 8) | secondary: /briefs, /take-action (Phase 10)
  - General Public → primary: /take-action (Phase 10) | secondary: /briefs, /awareness (Phase 8)
  - NOTE: Phase 8 and Phase 10 pages don't exist yet — links should be visually present but rendered as href="#" or disabled until those phases ship
- Icons: distinct per audience (government/parliament icon for ministers, stethoscope for HCW, person/community for public)
- Copy tone: empathetic — "Find resources for your role", "Learn what you can do" register (not cold directive tone)

**Infographic placement (IMG_9750–9752)**
- These are Rwanda-specific Fleming Fund infographics — NOT generic AMR infographics
- Display location: brief detail pages for the Rwanda-related briefs only
- Display style: full-width image inline on the detail page
- Interaction: clicking the image opens it full-size (no separate download button)
- GA4 infographic click event should fire on the image click

**GA4 analytics**
- Measurement ID: read from environment variable (NEXT_PUBLIC_GA4_MEASUREMENT_ID)
- Event helper structure: shared app/lib/analytics.ts with named functions:
  - trackPdfDownload(briefSlug: string)
  - trackInfographicView(briefSlug: string)
  - trackNewsletterSignup()
  - trackPledgeSubmit() — no-op until Phase 10
  - trackQuizComplete() — no-op until Phase 11
- Wire existing PDF download buttons and newsletter form to fire their respective helpers

**Brief content — REPLACE briefs 1–3, ADD briefs 4–15**
- CRITICAL: Briefs 1–3 in content/briefs-index.json are synthetic placeholder content — replace with real content
- Real 15 brief titles (from Mercy's drafts):
  1. Multi Country PEA
  2. Why countries struggle with AMR
  3. The political economy of AMR in Africa
  4. Global impact of funding shifts
  5. A threat to health & national security
  6. Domestic Budgets, Donor Leverage & Sustainability
  7. Strengthening One Health Governance for AMR
  8. Achieving Intra and Integrated AMR/AMU Surveillance
  9. Optimising & maximising local laboratory systems
  10. Stewardship & IPC — Cost effective interventions
  11. Livestock, Food Safety, Food Security & Trade
  12. Environmental AMR — The Missing Pillar in National Plans
  13. Digital Transformation for AMR — AI, Interoperability & Real Time Data
  14. Post Shock Political-Economic Conditions (outline only)
  15. Key Messages for the 5th Global AMR Conference (outline only)
- Source: resources/GGHN STARR_5th Interministrial AMR Meeting. Mar - Jun 2026/Briefs/Mercy_s Briefs/Drafts for review/
- infographicPdfUrl: NOT present for any of the 15 briefs
- thumbnailUrl: shared AMR placeholder thumbnail for all 15 briefs
- PDFs: .docx files must be converted and committed under public/briefs/
- Briefs #14 and #15 are outlines — include with available content, mark clearly in JSON

**Typography — Montserrat + Inter**
- Headings: Montserrat (Bold) via next/font/google
- Body: Inter via next/font/google
- Implementation: add both fonts in app/layout.tsx using next/font/google, inject as CSS variables, update @theme tokens in globals.css
- The globals.css comment already anticipates this pattern

### Claude's Discretion
- Exact GoogleAnalytics component structure and script strategy (afterInteractive vs lazyOnload)
- Specific icon library or SVG approach for audience CTA icons
- Secondary link styling within CTA cards
- CSS/Tailwind specifics for the light grey section background
- Font weight and size scale decisions (Montserrat Bold for h1/h2, SemiBold for h3, etc.)

### Deferred Ideas (OUT OF SCOPE)
- "About the Platform" page — mission/vision, theory of change, expertise — needs a dedicated phase
- Seven unplanned master pages: Country Dashboards, One Health Knowledge Hub, Policy Action Toolkit, Research & Evidence Library, Events & Learning, Community of Practice Forum, Monitoring & Accountability Dashboard, Partner Portal — all out of scope for v2.0 deadline (June 28, 2026)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | All 15 policy briefs published and accessible in the briefs library (briefs 4–15 added as JSON data entries with PDF links) | Source .docx files confirmed at resources/…/Drafts for review/ (15 files). Existing JSON schema in content/briefs-index.json supports 15 entries. content.ts getAllBriefs() reads the same file — no code changes needed to load more entries. |
| CONT-02 | Infographic images (IMG_9750, IMG_9751, IMG_9752) accessible on the site and linked from relevant brief detail pages | JPEGs confirmed at resources/…/Policy brief infographics_FF Rwanda/. Need copy to public/infographics/. Brief detail page at app/briefs/[slug]/page.tsx must be extended to conditionally render an inline full-width image when a brief has an infographicImageUrl field. |
| ANAL-01 | GA4 integrated across all pages, tracks page views, brief downloads, CTA clicks | @next/third-parties/google GoogleAnalytics component inserted in app/layout.tsx gives automatic pageview tracking. sendGAEvent from same package enables custom events. Works with output: 'export'. |
| ANAL-02 | GA4 events fire for PDF download, infographic download, newsletter signup, pledge form submission, quiz completion | Named helper functions in app/lib/analytics.ts wrapping sendGAEvent. Wire into existing components: BriefCard.tsx (PDF link onClick), brief detail page (PDF button onClick), infographic image onClick, NewsletterSignup.tsx (form success). |
| HOME-01 | Homepage displays three audience-segmented CTA sections routing ministers, healthcare workers, and general public to their most relevant content | New AudienceCTAs section component inserted in app/page.tsx directly after HeroSection. Three equal-column cards with lucide-react icons (already installed), empathetic copy, primary button + two text links per card. Future-page links use href="#". |
</phase_requirements>

---

## Summary

Phase 7 is a content-and-wiring phase on top of an already-working Next.js 16 static-export site. The codebase is in good shape: `content/briefs-index.json` → `app/lib/content.ts` → components pipeline is working for 3 briefs and will scale to 15 with no architectural changes. The `Brief` type in `app/lib/types.ts` has one structural mismatch with the Phase 7 requirements: the current schema has `infographicPdfUrl: string` (required, not optional), but Phase 7 briefs have no infographic PDFs — only 3 Rwanda JPEG images displayed inline on specific detail pages. The field must be made optional and a new optional `infographicImageUrl?: string` field added for the inline image path.

GA4 integration is clean: `@next/third-parties/google` provides `GoogleAnalytics` (pageview tracking) and `sendGAEvent` (custom events). Both work with static export because they are client-side scripts loaded after hydration. The existing site has no GA4 at all — this is a greenfield integration. The pattern confirmed from official Next.js docs (version 16.2.4, updated 2026-04-10) is to add `<GoogleAnalytics gaId={...} />` inside `RootLayout` in `app/layout.tsx`, and call `sendGAEvent('event', 'event_name', { params })` from client components.

Typography wiring is a four-line change in `app/layout.tsx` plus two new @theme entries in `globals.css` — low effort, high visual impact since it replaces the current fallback system fonts.

**Primary recommendation:** Work in this order — (1) schema update + JSON content + PDF file placement, (2) types.ts fix, (3) brief detail page infographic conditional, (4) GA4 install + lib/analytics.ts, (5) wire analytics calls into existing components, (6) AudienceCTAs component, (7) typography wiring. This sequencing means the briefs library works first and analytics layers on top of working content.

---

## Standard Stack

### Core (already installed — confirm versions)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | App framework, static export | Already in use |
| react | 19.2.4 | UI | Already in use |
| lucide-react | ^1.6.0 | Icons for CTA cards | Already installed — use Landmark, Stethoscope, Users icons |
| tailwindcss | ^4.2.2 | Styling | Already in use |

### New This Phase

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @next/third-parties | latest | GoogleAnalytics component + sendGAEvent helper | GA4 integration — the official Next.js recommended approach (confirmed in docs v16.2.4) |

### What NOT to Install

| Do Not Install | Use Instead | Reason |
|----------------|-------------|--------|
| react-ga4, ga-4-react, or any third-party GA wrapper | @next/third-parties/google | Official Next.js package, optimized script loading, maintained by Vercel |
| A separate lightbox library for infographic full-size view | Native anchor tag wrapping img, `target="_blank"` | CONTEXT.md says "clicking the image opens it full-size" — this is a link, not a modal |
| mammoth, docx, or any docx parser | Manual extraction + pandoc CLI | The planner must extract text content manually or use system pandoc for docx-to-PDF conversion |

**Installation:**
```bash
npm install @next/third-parties@latest
```

---

## Architecture Patterns

### Existing Project Structure (confirmed from codebase inspection)

```
app/
├── layout.tsx               # RootLayout — add GoogleAnalytics + font vars here
├── page.tsx                 # Homepage — add AudienceCTAs after HeroSection
├── globals.css              # @theme tokens — add --font-sans/--font-serif overrides
├── briefs/
│   ├── page.tsx             # Briefs library — reads from content.ts, no changes needed
│   └── [slug]/
│       └── page.tsx         # Brief detail — add infographic inline + analytics onClick
├── lib/
│   ├── types.ts             # Brief type — make infographicPdfUrl optional, add infographicImageUrl
│   ├── content.ts           # Data access — no changes needed
│   └── analytics.ts         # NEW — named event helper functions
└── components/
    ├── sections/
    │   ├── HeroSection.tsx  # No changes
    │   ├── AudienceCTAs.tsx # NEW — three audience CTA cards
    │   └── NewsletterSignup.tsx  # Wire trackNewsletterSignup() call
    └── briefs/
        └── BriefCard.tsx    # Wire trackPdfDownload() on PDF link onClick

content/
└── briefs-index.json        # REPLACE entries 1–3, ADD entries 4–15

public/
├── briefs/                  # Add 15 PDFs (converted from .docx)
│   ├── brief-01-multi-country-pea.pdf
│   └── ... (15 total)
└── infographics/            # Add 3 Rwanda JPEGs
    ├── IMG_9750.jpeg
    ├── IMG_9751.jpeg
    └── IMG_9752.jpeg
```

### Pattern 1: GA4 Integration with @next/third-parties (CONFIRMED — official docs)

**What:** Insert GoogleAnalytics component in RootLayout, then call sendGAEvent from client components.

**When to use:** Always. This is the only GA4 approach needed for this project.

**layout.tsx integration:**
```tsx
// Source: https://nextjs.org/docs/app/guides/third-party-libraries (v16.2.4, 2026-04-10)
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="...">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID!} />
    </html>
  );
}
```

**lib/analytics.ts helper:**
```ts
// Client-safe wrapper — sendGAEvent only works in 'use client' components
// This file is imported by client components that call these helpers
import { sendGAEvent } from '@next/third-parties/google';

export function trackPdfDownload(briefSlug: string) {
  sendGAEvent('event', 'pdf_download', { brief_slug: briefSlug });
}

export function trackInfographicView(briefSlug: string) {
  sendGAEvent('event', 'infographic_view', { brief_slug: briefSlug });
}

export function trackNewsletterSignup() {
  sendGAEvent('event', 'newsletter_signup', {});
}

// No-ops until pages exist in Phase 10/11
export function trackPledgeSubmit() {
  // Phase 10: sendGAEvent('event', 'pledge_submit', {});
}

export function trackQuizComplete() {
  // Phase 11: sendGAEvent('event', 'quiz_complete', {});
}
```

**CRITICAL:** `sendGAEvent` must be called from `'use client'` components only. The existing `NewsletterSignup.tsx` is already `'use client'`. `BriefCard.tsx` and the brief detail page PDF button must also be client components (or the click handler must be extracted to a client wrapper).

### Pattern 2: Brief Detail Page — Conditional Infographic Section

**What:** The brief detail page renders an inline full-width infographic image only when `brief.infographicImageUrl` is present. Clicking the image opens it in a new tab (native link, no lightbox).

**When to use:** Only for the 3 Rwanda briefs that have associated JPEGs.

```tsx
// Source: Codebase analysis + CONTEXT.md decisions
// Add inside the max-w-3xl content sections, below Key Messages
{brief.infographicImageUrl && (
  <section>
    <h2 className="font-serif text-xl text-navy-950 font-bold mb-4">Infographic</h2>
    <a
      href={brief.infographicImageUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackInfographicView(brief.slug)}
    >
      <img
        src={brief.infographicImageUrl}
        alt={`Infographic for ${brief.title}`}
        className="w-full rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
      />
    </a>
  </section>
)}
```

**Note:** The brief detail page is currently a Server Component. To add an `onClick` handler on the anchor/image, either (a) extract the infographic block into a small `'use client'` wrapper component, or (b) convert the whole page to client. Option (a) is cleaner.

### Pattern 3: next/font/google + Tailwind v4 CSS Variables

**What:** Import Montserrat and Inter in layout.tsx using the `variable` option. Inject the CSS variable names onto the `<html>` element. Override `--font-sans` and `--font-serif` in the existing `@theme` block in globals.css.

**layout.tsx:**
```tsx
// Source: Official Next.js font docs + Tailwind v4 @theme pattern (MEDIUM confidence — cross-verified)
import { Montserrat, Inter } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

// Apply both variable classNames to <html>
<html lang="en" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
```

**globals.css — update the existing @theme block:**
```css
@theme {
  /* ... existing color tokens ... */

  /* Override fallback font definitions with real next/font variables */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-montserrat), Georgia, serif;
}
```

Existing components use `font-serif` (headings) and `font-sans` (body) Tailwind classes — these will automatically pick up the new fonts with no component changes.

**IMPORTANT:** The current `globals.css` PROGRESS.md notes "Google Fonts removed — system fonts only". The Tailwind v4 `next/font/google` approach re-adds fonts but via the next/font self-hosting mechanism (fonts downloaded at build time and served from your own domain, not from Google CDN). This resolves the original concern about external font requests and GDPR. Confirm this is acceptable before implementing.

### Pattern 4: AudienceCTAs Section Component

**What:** New section component inserted in `app/page.tsx` after `<HeroSection>`. Three equal-column cards, light grey background, empathetic copy, lucide-react icons, primary button + two secondary text links.

**Icon selection from lucide-react (already installed v1.6.0):**
- Ministers: `Landmark` (government/parliament building icon)
- Healthcare Workers: `Stethoscope`
- General Public: `Users`

**Structure pattern:**
```tsx
// app/components/sections/AudienceCTAs.tsx
import Link from 'next/link';
import { Landmark, Stethoscope, Users } from 'lucide-react';
import { Container } from '@/components/layout/Container';

const audiences = [
  {
    icon: Landmark,
    headline: 'For Policymakers & Ministers',
    subtext: 'Find evidence-backed briefs to inform national AMR strategy and budget decisions.',
    primaryLabel: 'Browse Policy Briefs',
    primaryHref: '/briefs',
    secondaryLinks: [
      { label: 'AMR Awareness Hub', href: '#' },   // Phase 8 — not yet live
      { label: 'Take Action', href: '#' },           // Phase 10 — not yet live
    ],
  },
  {
    icon: Stethoscope,
    headline: 'For Healthcare Workers',
    subtext: 'Access stewardship resources and clinical guidance for your role on the front line.',
    primaryLabel: 'Explore Resources',
    primaryHref: '#',   // /awareness — Phase 8
    secondaryLinks: [
      { label: 'Policy Briefs', href: '/briefs' },
      { label: 'Take Action', href: '#' },
    ],
  },
  {
    icon: Users,
    headline: 'For the General Public',
    subtext: 'Learn what antimicrobial resistance means for your community and what you can do.',
    primaryLabel: 'Learn What You Can Do',
    primaryHref: '#',   // /take-action — Phase 10
    secondaryLinks: [
      { label: 'Policy Briefs', href: '/briefs' },
      { label: 'AMR Awareness Hub', href: '#' },
    ],
  },
];
```

**Background token:** Use `bg-slate-100` (already in @theme as `--color-slate-100: #F1F5F9`). This is the same light grey the NewsletterSignup section uses — consistent look across the page.

**Disabled link pattern for future pages:** Use `href="#"` with `aria-disabled="true"` and visual muting (text-slate-400, cursor-not-allowed) so the links are visually present but clearly inactive.

### Anti-Patterns to Avoid

- **Converting brief detail page to fully 'use client':** The page uses `generateStaticParams` and `generateMetadata` which require a Server Component. Extract only the interactive bits (infographic click handler) into a small client wrapper.
- **Putting sendGAEvent in a Server Component:** GA events require browser context. Any component calling sendGAEvent must be marked 'use client'.
- **Adding `infographicPdfUrl` entries to all 15 briefs:** The CONTEXT.md decision explicitly states `infographicPdfUrl: not present for any of the 15 briefs`. Remove the existing infographic PDF buttons from BriefCard when `infographicPdfUrl` is absent (make it optional in the type).
- **Blocking the build on missing PDFs:** The static export will succeed even if PDF files are absent (links point to /briefs/*.pdf which is a 404 until files are copied). However, the build task should include copying PDFs as an explicit task — not a soft dependency.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GA4 script injection | Custom Script tag with gtag.js | @next/third-parties/google GoogleAnalytics | Official Next.js package handles script strategy, nonce, hydration timing correctly |
| Font loading | Manual @font-face or link tags | next/font/google | Self-hosts fonts at build time, eliminates Google CDN request, no layout shift (display:swap handled internally) |
| Lightbox/modal for infographic | react-lightbox, yet-another-react-lightbox | Native `<a target="_blank">` wrapping `<img>` | CONTEXT.md decision: "clicking opens full-size" — that's a link, not a modal |
| Docx to PDF conversion | Node.js docx parser | System pandoc or LibreOffice CLI | Battle-tested, handles complex .docx formatting, no npm dependencies |

---

## Common Pitfalls

### Pitfall 1: sendGAEvent Called from Server Component
**What goes wrong:** TypeScript compiles but runtime throws "sendGAEvent is not defined" or silently fails — GA events never appear in dashboard.
**Why it happens:** sendGAEvent calls `window.dataLayer` which doesn't exist server-side.
**How to avoid:** Any component with onClick handlers that call analytics helpers must be `'use client'`. The brief detail page PDF button is currently inline JSX inside a Server Component — extract to a `DownloadButton` client component.
**Warning signs:** No GA events appearing in realtime dashboard despite clicking PDF buttons.

### Pitfall 2: Brief Type Schema Mismatch After Adding 15 Entries
**What goes wrong:** TypeScript build fails because existing `Brief` type has `infographicPdfUrl: string` (required), but new entries omit it.
**Why it happens:** The type was written for Phase 5 when all briefs had infographic PDFs. Phase 7 changes the data contract.
**How to avoid:** Update `app/lib/types.ts` FIRST — make `infographicPdfUrl?: string` optional and add `infographicImageUrl?: string`. Do this before writing the JSON. Run `npm run build` to confirm no type errors.
**Warning signs:** `Type 'undefined' is not assignable to type 'string'` build errors.

### Pitfall 3: BriefCard Shows "Download Infographic" Button for Briefs Without One
**What goes wrong:** The Infographic download button in BriefCard.tsx renders for all 15 real briefs even though no infographic PDFs exist — clicking gives a 404.
**Why it happens:** BriefCard.tsx currently renders the infographic button unconditionally from `brief.infographicPdfUrl`.
**How to avoid:** After making `infographicPdfUrl` optional in the type, add a conditional in BriefCard: only render the infographic button when `brief.infographicPdfUrl` is truthy.
**Warning signs:** All 15 new brief cards show a broken "Infographic" button.

### Pitfall 4: NEXT_PUBLIC_GA4_MEASUREMENT_ID Undefined at Build Time
**What goes wrong:** GoogleAnalytics renders with `gaId={undefined}` in production. No tracking fires.
**Why it happens:** `NEXT_PUBLIC_*` env vars must be present at build time for static export — they are inlined at build, not runtime.
**How to avoid:** Add `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-PLACEHOLDER` to `.env.local` for local dev. For production (Vercel), set the variable in the Vercel dashboard before the next deploy. Guard: `process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID} />`.
**Warning signs:** GA4 realtime shows zero sessions even after deploying.

### Pitfall 5: Docx Content Extraction Creates Inaccurate Summaries
**What goes wrong:** Briefs #14 and #15 are outlines — they have section headers but minimal content. If executiveSummary or keyMessages are fabricated to fill the JSON schema, published content misrepresents the actual brief.
**Why it happens:** The JSON schema requires `executiveSummary` and `keyMessages`, but outline documents may only have headings.
**How to avoid:** For #14 and #15, use the outline structure literally. Mark `keyTakeaway` as "Outline — full brief forthcoming" or similar. Do NOT synthesize content not present in the source document. Keep `keyMessages` to only what the outline explicitly states.
**Warning signs:** Published brief #14 or #15 has bullet points not found in the source .docx.

### Pitfall 6: Font FOUT / Layout Shift on Initial Load
**What goes wrong:** Page flashes with system fonts before Montserrat loads, causing visible layout shift (high CLS score).
**Why it happens:** `display: 'swap'` allows content to show before the font downloads.
**How to avoid:** `next/font/google` self-hosts fonts and preloads them in the document head automatically — this largely eliminates FOUT for preloaded subsets. No extra work needed beyond using the `variable` option correctly. Avoid using `display: 'block'` which hides text until font loads.
**Warning signs:** Visible text jump on first load in Chrome DevTools Performance panel.

### Pitfall 7: Rwanda Infographic JPEG on Wrong Brief Pages
**What goes wrong:** The 3 Rwanda infographics (IMG_9750–9752) are placed on non-Rwanda briefs, or placed on all 15 pages.
**Why it happens:** The mapping between which JPEG belongs to which brief slug is not automatically obvious — it requires reading the images or surrounding documentation.
**How to avoid:** Determine the Rwanda-related brief(s) from the source documents. Only add `infographicImageUrl` to those specific JSON entries. The 3 JPEGs are "Fleming Fund Rwanda" infographics — they belong to briefs that discuss Rwanda-specific work. Inspect the image content to determine correct mapping before committing JSON.
**Warning signs:** Rwanda infographic appears on a brief about a different country.

---

## Code Examples

### GA4 Event in Existing Client Component (NewsletterSignup.tsx)
```tsx
// Source: Codebase inspection + @next/third-parties/google docs pattern
// NewsletterSignup.tsx is already 'use client' — just add the import and call
'use client';
import { trackNewsletterSignup } from '@/lib/analytics';
// ...
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setState('submitting');
  const result = await submitNewsletter(email);
  if (result === 'success') {
    trackNewsletterSignup();  // fires after confirmed success
  }
  setState(result);
}
```

### PDF Download Button Extraction to Client Component
```tsx
// app/components/briefs/DownloadButton.tsx — NEW client component
'use client';
import { Download } from 'lucide-react';
import { trackPdfDownload } from '@/lib/analytics';

interface DownloadButtonProps {
  href: string;
  briefSlug: string;
  label: string;
  variant?: 'primary' | 'outline';
}

export function DownloadButton({ href, briefSlug, label, variant = 'primary' }: DownloadButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackPdfDownload(briefSlug)}
      className={variant === 'primary'
        ? 'inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded transition-colors text-sm'
        : 'inline-flex items-center gap-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium px-5 py-2.5 rounded transition-colors text-sm'}
    >
      <Download size={16} />
      {label}
    </a>
  );
}
```

### Brief JSON Entry Structure — Real Briefs (without infographicPdfUrl)
```json
{
  "slug": "brief-07-one-health-governance",
  "title": "Strengthening One Health Governance for AMR",
  "weekNumber": 7,
  "publicationDate": "2026-04-14",
  "authorId": "mercy-n",
  "keyTakeaway": "[extracted from source document]",
  "executiveSummary": "[extracted from source document — 100-150 words]",
  "keyMessages": [
    "[from source document]",
    "[from source document]"
  ],
  "pdfUrl": "/briefs/brief-07-one-health-governance.pdf",
  "thumbnailUrl": "/images/thumbnails/amr-brief-placeholder.jpg",
  "themes": ["One Health", "Governance"]
}
```

Note: `infographicPdfUrl` is omitted (field will be optional in updated types.ts). `infographicImageUrl` added only for Rwanda-specific briefs.

### Tailwind v4 @theme Update Pattern
```css
/* globals.css — update existing @theme block */
@theme {
  /* ... existing color tokens unchanged ... */

  /* Replace fallback font definitions — next/font injects real CSS variables at runtime */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-montserrat), Georgia, serif;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline gtag script in `<head>` | @next/third-parties/google GoogleAnalytics component | Next.js 14+ | Better performance — script loaded afterInteractive, not blocking render |
| tailwind.config.js font extension | @theme CSS variables in globals.css | Tailwind v4 (this project) | CSS-native config — no JS config file needed |
| Google CDN font loading via link tag | next/font/google self-hosting | Next.js 13+ | Fonts served from same domain, no external request, no layout shift |

**Deprecated/outdated:**
- Inline `<script>` tag for gtag.js: Next.js now warns against this. Use @next/third-parties instead.
- `tailwind.config.js extend.fontFamily`: Not applicable in Tailwind v4 — use @theme in globals.css.

---

## Open Questions

1. **Which 3 Rwanda briefs do the infographic JPEGs belong to?**
   - What we know: IMG_9750, IMG_9751, IMG_9752 are "Fleming Fund Rwanda" infographics stored in resources/…/Policy brief infographics_FF Rwanda/
   - What's unclear: The exact mapping from JPEG filename to brief number/topic. The brief titles don't obviously name "Rwanda."
   - Recommendation: Planner must inspect the JPEG images visually and cross-reference with brief content to identify which 3 of the 15 briefs are Rwanda-specific. This is a content decision, not a technical one.

2. **Do briefs need an authorId pointing to a real expert, or can authorId be null/absent?**
   - What we know: The current `Brief` type has `authorId: string` (required). Current experts.json has 3 entries (olawale-a, samson-a, and implied third). Mercy's 15 briefs are authored by Mercy N — who may not be in experts.json.
   - What's unclear: Is there an experts.json entry for Mercy? If not, do we add one, or make authorId optional?
   - Recommendation: Planner should inspect content/experts.json and either add a Mercy expert entry or make `authorId` optional in types.ts. Making it optional is safer — not all briefs may have a matched expert.

3. **PROGRESS.md notes "Google Fonts removed" — was this a deliberate user preference or a build constraint?**
   - What we know: The globals.css comment says "next/font injects the real values" — suggesting the intention was always to add fonts via next/font, just deferred. The CONTEXT.md explicitly locks Montserrat + Inter for Phase 7.
   - What's unclear: Whether there is a concern about self-hosted font file size at build time for the Vercel deployment.
   - Recommendation: The next/font approach self-hosts fonts (downloaded once at build time, served from /_next/static/), which is distinct from linking Google CDN. This is safe to proceed. The CONTEXT.md decision is locked.

---

## Sources

### Primary (HIGH confidence)
- https://nextjs.org/docs/app/guides/third-party-libraries — GoogleAnalytics component API, sendGAEvent usage, placement in layout.tsx (verified version 16.2.4, last updated 2026-04-10)
- https://nextjs.org/docs/messages/next-script-for-ga — Confirms @next/third-parties as the official recommendation over inline scripts
- Codebase direct inspection — app/lib/types.ts, app/lib/content.ts, app/briefs/[slug]/page.tsx, app/layout.tsx, content/briefs-index.json, package.json, next.config.js, .env.local

### Secondary (MEDIUM confidence)
- WebSearch cross-verification: next/font/google variable property + Tailwind v4 @theme pattern confirmed across multiple sources (buildwithmatija.com, stackademic.com, github.com/tailwindlabs discussions) — consistent pattern across all sources
- CONTEXT.md Phase 7 decisions — user-locked decisions carry MEDIUM+ confidence for implementation shape

### Tertiary (LOW confidence — flag for validation)
- Static export compatibility with @next/third-parties: Not explicitly tested in docs for output:'export'. The component loads afterInteractive (client-side JS), which functions identically in a static export. LOW risk but worth a quick smoke test after first deploy.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — @next/third-parties confirmed in official docs v16.2.4; all other libraries already in the project
- GA4 architecture: HIGH — official Next.js docs pattern, confirmed sendGAEvent API
- Font wiring: MEDIUM — pattern cross-verified across multiple community sources consistent with Tailwind v4 @theme approach; cannot run the build to confirm
- Content/JSON schema: HIGH — types.ts and briefs-index.json directly inspected; schema change scope is clear
- Pitfalls: HIGH — derived from direct codebase inspection (saw the exact code that will break)
- Infographic JPEG mapping to briefs: LOW — requires human judgment/visual inspection of images

**Research date:** 2026-04-28
**Valid until:** 2026-05-28 (stable libraries; @next/third-parties API unlikely to change in 30 days)
