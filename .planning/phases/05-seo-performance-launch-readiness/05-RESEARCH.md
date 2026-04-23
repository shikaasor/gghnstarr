# Phase 5: SEO, Performance & Launch Readiness - Research

**Researched:** 2026-04-21
**Domain:** Next.js App Router metadata, sitemap generation, Lighthouse performance, print CSS
**Confidence:** HIGH (official Next.js docs verified; next-sitemap vs built-in approach clarified)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEO-01 | Per-page OG and Twitter Card meta tags via `generateMetadata`; each brief detail page has its own OG image (thumbnail) for WhatsApp sharing | `generateMetadata` with static image URLs confirmed working for static export; `metadataBase` required for relative URLs; thumbnails at 641×360 WebP (~23KB) need to meet 300px+ threshold for large WhatsApp preview |
| SEO-02 | `sitemap.xml` and `robots.txt` auto-generated including all brief detail URLs | Built-in `app/sitemap.ts` + `app/robots.ts` is the correct approach for `output:'export'`; next-sitemap postbuild alternative also viable but adds a dependency |
| SEO-03 | Lighthouse mobile score ≥85, LCP <2.5s on simulated 3G, total page weight <500KB | Current JS bundle is 666KB uncompressed (needs gzip analysis); Google Fonts are currently loaded despite system-font decision — this is the primary LCP risk; image sizes are fine (~23KB WebP) |
| SEO-04 | Print-friendly CSS (`@media print`) on brief detail pages | Standard `@media print` block in `app/globals.css`; `@page` for margins; hide nav/footer/buttons; `break-inside: avoid` for key content sections |
</phase_requirements>

---

## Summary

Phase 5 covers four SEO and launch-readiness tasks on a Next.js 16.2.1 static export site. The largest risk is performance: the current `app/layout.tsx` loads Google Fonts (Playfair Display + Inter via `next/font/google`) despite the Phase 1 locked decision to use system fonts only. This introduces network-dependent font loading that will suppress the Lighthouse mobile score and increase LCP on 3G. Removing Google Fonts and switching to system font CSS variables is the highest-priority performance action.

For sitemap and robots.txt generation, the built-in Next.js 16 App Router file conventions (`app/sitemap.ts` and `app/robots.ts`) are the correct approach for `output:'export'` — they generate static files at build time without external dependencies. The next-sitemap package works via postbuild but requires an `output: 'export'` config key and is an unnecessary external dependency given the built-in capability is sufficient for this small site.

For OG metadata, `generateMetadata` works at build time in static export mode. The existing thumbnails (641×360 WebP, ~23KB) are already a good source for OG images — they exceed the 300px WhatsApp threshold for large preview display. The OG image URL must be an absolute URL, which requires `metadataBase` to be set in the root layout metadata.

**Primary recommendation:** Remove Google Fonts from `layout.tsx` first (highest performance impact), then add `metadataBase` + `generateMetadata` OG fields to the brief detail page, add `app/sitemap.ts` + `app/robots.ts`, and add `@media print` CSS to `globals.css`.

---

## Standard Stack

### Core (No New Libraries Needed)

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| Next.js built-in `app/sitemap.ts` | 16.2.1 | Generates `sitemap.xml` at build time | Official file convention; works with `output:'export'` |
| Next.js built-in `app/robots.ts` | 16.2.1 | Generates `robots.txt` at build time | Official file convention; no extra package needed |
| Next.js `generateMetadata` | 16.2.1 | Per-page OG + Twitter Card meta tags | Already partially implemented in `app/briefs/[slug]/page.tsx` |
| CSS `@media print` | N/A | Print-friendly layout | Native CSS; write in `app/globals.css` |

### Optional (next-sitemap as Alternative for SEO-02)

| Library | Version | Purpose | Tradeoff vs Built-in |
|---------|---------|---------|---------------------|
| next-sitemap | ^4.2.3 | Sitemap + robots.txt via postbuild | Adds external dependency; needs `output: 'export'` key in config; built-in is sufficient here |

**Installation (only if next-sitemap is chosen over built-in):**
```bash
npm install next-sitemap
```

**Recommendation: Use the built-in approach.** For 15 briefs + 5 static pages, `app/sitemap.ts` is simpler, has zero dependencies, and works natively with `output:'export'`.

---

## Architecture Patterns

### File Locations for New Files

```
app/
├── sitemap.ts              # NEW — generates sitemap.xml
├── robots.ts               # NEW — generates robots.txt
├── globals.css             # MODIFY — add @media print block at end
├── layout.tsx              # MODIFY — add metadataBase; remove Google Fonts
└── briefs/
    └── [slug]/
        └── page.tsx        # MODIFY — expand generateMetadata with OG/Twitter fields
```

### Pattern 1: Built-in sitemap.ts for Static Export

**What:** Export a function from `app/sitemap.ts` that reads `briefs-index.json` and returns all URLs. Next.js generates `sitemap.xml` at build time.

**Critical:** The function uses `fs.readFileSync` (same as `lib/content.ts` does), which works at build time. No `force-static` export is needed because the function has no dynamic data access — it runs synchronously at build time.

**Example:**
```typescript
// app/sitemap.ts
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from 'next';
import { getAllBriefs } from '@/lib/content';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const briefs = getAllBriefs();

  const briefUrls: MetadataRoute.Sitemap = briefs.map((brief) => ({
    url: `${BASE_URL}/briefs/${brief.slug}`,
    lastModified: new Date(brief.publicationDate),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/briefs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/methodology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/experts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    ...briefUrls,
  ];
}
```

### Pattern 2: Built-in robots.ts

**What:** Export a function from `app/robots.ts` that returns the robots rules. Generates `robots.txt` at build time.

```typescript
// app/robots.ts
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### Pattern 3: generateMetadata with OG Image (Static Export)

**What:** Extend the existing `generateMetadata` in `app/briefs/[slug]/page.tsx` to include `openGraph` and `twitter` fields. Since this is a static export, OG images MUST be existing static files (not generated via `next/og` ImageResponse, which requires a server runtime).

**The OG image source:** Existing thumbnail files at `/images/thumbnails/{slug}.jpg` (641×360 WebP, ~23KB). These are already referenced by brief data via `brief.thumbnailUrl`. Use them directly as the OG image.

**Critical:** OG image URLs in metadata must be absolute URLs. Set `metadataBase` in the root layout so relative paths are resolved.

```typescript
// app/layout.tsx — ADD metadataBase to existing metadata export
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app'),
  title: {
    default: 'GGHN STARR | AMR Policy Intelligence for Africa',
    template: '%s | GGHN STARR',
  },
  description: 'Evidence-backed AMR policy briefs for African health decision-makers.',
  openGraph: {
    siteName: 'GGHN STARR',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

```typescript
// app/briefs/[slug]/page.tsx — EXPAND existing generateMetadata
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) return {};

  return {
    title: brief.title,
    description: brief.keyTakeaway,
    openGraph: {
      title: brief.title,
      description: brief.keyTakeaway,
      type: 'article',
      publishedTime: brief.publicationDate,
      // thumbnailUrl is e.g. '/images/thumbnails/week-01-amr-governance-frameworks.jpg'
      // metadataBase in layout.tsx resolves this to an absolute URL
      images: [
        {
          url: brief.thumbnailUrl,
          width: 641,
          height: 360,
          alt: brief.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: brief.title,
      description: brief.keyTakeaway,
      images: [brief.thumbnailUrl],
    },
    alternates: {
      canonical: `/briefs/${brief.slug}`,
    },
  };
}
```

### Pattern 4: @media print CSS for Brief Detail Pages

**What:** Add a print media query block at the end of `app/globals.css`. Target the brief detail page elements specifically.

**Key elements to hide:** `<Header>`, `<Footer>`, nav, download buttons, prev/next navigation, dark mode toggle.
**Key elements to preserve:** Brief title, author, executive summary, key messages, author bio.

```css
/* app/globals.css — ADD at end of file */
/* Source: https://www.sitepoint.com/css-printer-friendly-pages/ */

@media print {
  /* Page setup */
  @page {
    margin: 2cm;
    size: A4;
  }

  /* Reset background for print */
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt;
    line-height: 1.6;
  }

  /* Hide non-content elements */
  header,
  footer,
  nav,
  .no-print {
    display: none !important;
  }

  /* Hide download buttons and navigation */
  a[href$=".pdf"],
  a[href*="infographic"],
  nav[aria-label],
  [class*="border-t"] nav {
    display: none !important;
  }

  /* Preserve link text but remove styling */
  a {
    color: inherit;
    text-decoration: underline;
  }

  /* Prevent page breaks inside key sections */
  section,
  li,
  blockquote {
    break-inside: avoid;
  }

  /* Keep headings with their content */
  h1, h2, h3 {
    break-after: avoid;
  }

  /* Thumbnail image — constrain for print */
  img {
    max-width: 200px !important;
    height: auto !important;
  }
}
```

**Note on Tailwind v4 CSS-first config:** Because this project uses Tailwind v4 with CSS-first configuration (no `tailwind.config.js`), the `@media print` block goes directly in `app/globals.css` after the `@import "tailwindcss"` and `@theme` blocks. Tailwind utility classes continue to work outside the print query.

### Pattern 5: Remove Google Fonts (Performance Fix)

**Critical finding:** `app/layout.tsx` currently imports `Playfair_Display` and `Inter` from `next/font/google`. The Phase 1 CONTEXT.md explicitly locks "System fonts only — no Google Fonts." The codebase has `--font-sans` and `--font-serif` CSS variables defined in `globals.css` with system font fallbacks. The `next/font/google` imports are inconsistent with this decision and will harm performance.

**Action:** Remove the `next/font/google` imports from `layout.tsx`. Remove the className injection on `<html>`. The `--font-sans` and `--font-serif` CSS custom properties in `@theme` already provide the system font fallback stacks used throughout.

```typescript
// app/layout.tsx — AFTER removing Google Fonts
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app'),
  title: {
    default: 'GGHN STARR | AMR Policy Intelligence for Africa',
    template: '%s | GGHN STARR',
  },
  description: 'Evidence-backed AMR policy briefs for African health decision-makers.',
  openGraph: {
    siteName: 'GGHN STARR',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-navy-950 font-sans antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### Pattern 6: NEXT_PUBLIC_SITE_URL Environment Variable

`metadataBase`, `sitemap.ts`, and `robots.ts` all need the production URL. The variable `NEXT_PUBLIC_SITE_URL` is referenced in Phase 1 CONTEXT.md as a planned Vercel environment variable. It is not currently in `.env.local`.

**Action:** Add to `.env.local` for local testing and configure in Vercel dashboard for production:
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://gghnstarr.vercel.app
```

### Anti-Patterns to Avoid

- **Using `next/og` ImageResponse for OG images:** Requires Edge or Node.js server runtime — not available in `output:'export'`. Use static thumbnail URLs instead.
- **Using `next-sitemap` postbuild with dynamic config:** The built-in `app/sitemap.ts` is simpler and has zero extra configuration for this use case.
- **Omitting `metadataBase`:** Without it, relative URLs in OG image fields cause build errors in Next.js 16.
- **Keeping Google Fonts imports:** Even with `display: 'swap'`, `next/font/google` downloads fonts at build time and self-hosts them, but adds ~60-80KB of font files per font family. Removing is the single highest-impact performance change.
- **Adding `display: none` to print CSS using Tailwind classes only:** The `@media print` block is global CSS — it targets HTML elements and semantic selectors, not Tailwind class names which are unpredictable in the build output. Use element selectors and the `no-print` class convention.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap XML generation | Custom XML string builder | `app/sitemap.ts` built-in | Handles encoding, format, all sitemap protocol fields correctly |
| robots.txt generation | Handwritten static `public/robots.txt` | `app/robots.ts` built-in | Programmatic; auto-updates when site URL env var changes |
| OG image generation | Canvas-based server rendering | Static thumbnail files already in `/public/images/thumbnails/` | Static export has no server runtime; existing WebP thumbnails are sufficient |
| Font subsetting | Manually subset font files | System fonts (no files needed) | Zero bytes, zero requests, instant availability |

**Key insight:** For a 15-item static policy site, the built-in Next.js metadata conventions cover all SEO needs without external packages.

---

## Common Pitfalls

### Pitfall 1: OG Image URL is Relative Without metadataBase

**What goes wrong:** Next.js build fails or generates incorrect `<meta property="og:image">` tags with relative paths that social crawlers can't resolve.

**Why it happens:** `openGraph.images` expects absolute URLs. Without `metadataBase` in the root layout, relative paths like `/images/thumbnails/week-01.jpg` are not resolved.

**How to avoid:** Set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app')` in the root `app/layout.tsx` metadata export. Then child pages can use relative paths.

**Warning signs:** Build warning about metadata image URL not being absolute; OG debugger shows no image.

### Pitfall 2: WhatsApp Doesn't Show Large Preview (Thumbnail Too Small)

**What goes wrong:** WhatsApp shows a tiny thumbnail instead of a large preview card.

**Why it happens:** WhatsApp requires the OG image to be at least 300px wide for large preview display. Current thumbnails are 641×360 — this is fine. But if image dimensions metadata is wrong or the URL is inaccessible, WhatsApp falls back to small preview or no preview.

**How to avoid:** Declare correct `width: 641, height: 360` in the OG image metadata object. Ensure the deployed URL is publicly accessible (not behind auth). Test with WhatsApp's link preview tester or the [Open Graph debugger](https://developers.facebook.com/tools/debug/).

**Warning signs:** WhatsApp preview shows small thumbnail or no image; OG debugger cannot fetch image.

### Pitfall 3: Google Fonts Still Loaded in Build

**What goes wrong:** Removing `next/font/google` imports from `layout.tsx` but leaving `--font-serif` and `--font-sans` class names in JSX that reference the font variable class names (`${playfair.variable} ${inter.variable}`). This causes TypeScript errors and broken font variable refs.

**Why it happens:** The font variable CSS custom properties (e.g., `--font-serif`) are already defined in `@theme` in `globals.css`. The `className` injected by `next/font` would override them with the downloaded font. After removal, the `@theme` variables take effect as intended.

**How to avoid:** Remove both the import lines AND the `${playfair.variable} ${inter.variable}` from the `<html>` className. Verify `--font-sans` and `--font-serif` are properly defined in `@theme` in `globals.css` (they already are).

**Warning signs:** `playfair is not defined` TypeScript error after removal; fonts visually identical to before (system fonts now serving).

### Pitfall 4: sitemap.ts Uses fs.readFileSync Incorrectly

**What goes wrong:** `app/sitemap.ts` fails at build time when trying to read `briefs-index.json` because the path is wrong.

**Why it happens:** `process.cwd()` in `app/sitemap.ts` should be the project root, same as `lib/content.ts`. But path resolution can differ in edge cases.

**How to avoid:** Reuse the existing `getAllBriefs()` function from `@/lib/content` — it already handles the `path.join(process.cwd(), 'content', 'briefs-index.json')` correctly. Don't duplicate the file-reading logic.

**Warning signs:** Build error "ENOENT: no such file or directory" during `next build`.

### Pitfall 5: @media print CSS Hidden by Specificity

**What goes wrong:** Print styles don't override Tailwind utility classes — elements remain visible in print.

**Why it happens:** Tailwind utilities may have higher specificity than plain element selectors. In Tailwind v4, the specificity model changed — `@layer utilities` is where utility classes live.

**How to avoid:** Use `!important` on critical display:none declarations in print CSS (`display: none !important`). Add a `.no-print` utility class for reusable hiding.

**Warning signs:** Print preview in browser still shows nav/footer/buttons.

### Pitfall 6: JS Bundle Weight Exceeds 500KB Threshold

**What goes wrong:** Lighthouse page weight check fails because 666KB of JS is in the chunks directory.

**Why it happens:** Current JS chunks total ~666KB uncompressed. However, Lighthouse measures transferred bytes (gzip/brotli compressed). Vercel serves brotli-compressed static assets — 666KB JS typically compresses to ~200-220KB transferred. The 500KB threshold is likely for total page weight transferred, not uncompressed file sizes.

**How to avoid:** 
1. Verify by running Lighthouse in Chrome DevTools against the Vercel deployment — it measures transferred bytes.
2. If the score is still low after font removal, audit which chunk is 227KB (`0h4bq73pogmtb.js`) — it may be the React runtime (expected) or a large dependency (investigate).
3. Do NOT implement code splitting or dynamic imports unless Lighthouse score is below 85 after font removal — premature optimization.

**Warning signs:** Lighthouse "Avoid enormous network payloads" warning; page weight >500KB in Network tab with "Transferred" column.

---

## Code Examples

Verified patterns from official sources:

### Complete generateMetadata for Brief Detail Page
```typescript
// app/briefs/[slug]/page.tsx
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata (verified 2026-04-21)
import type { Metadata } from 'next';
import { getAllBriefs, getBriefBySlug } from '@/lib/content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) return {};

  return {
    title: brief.title,
    description: brief.keyTakeaway,
    alternates: { canonical: `/briefs/${brief.slug}` },
    openGraph: {
      title: brief.title,
      description: brief.keyTakeaway,
      type: 'article',
      publishedTime: brief.publicationDate,
      images: [{
        url: brief.thumbnailUrl,   // e.g. '/images/thumbnails/week-01-amr-governance-frameworks.jpg'
        width: 641,
        height: 360,
        alt: brief.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: brief.title,
      description: brief.keyTakeaway,
      images: [brief.thumbnailUrl],
    },
  };
}
```

### Sitemap with Dynamic Brief URLs
```typescript
// app/sitemap.ts
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap (verified 2026-04-21)
import type { MetadataRoute } from 'next';
import { getAllBriefs } from '@/lib/content';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const briefs = getAllBriefs();
  const briefEntries: MetadataRoute.Sitemap = briefs.map((b) => ({
    url: `${BASE_URL}/briefs/${b.slug}`,
    lastModified: new Date(b.publicationDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/briefs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/methodology`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/experts`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    ...briefEntries,
  ];
}
```

### robots.ts
```typescript
// app/robots.ts
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots (verified 2026-04-21)
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### Complete @media print CSS
```css
/* app/globals.css — add after existing @theme block */
/* Source: https://www.sitepoint.com/css-printer-friendly-pages/ + MDN CSS @page */

@media print {
  @page {
    margin: 2cm;
    size: A4 portrait;
  }

  /* Reset to print defaults */
  *,
  *::before,
  *::after {
    background: transparent !important;
    color: #000 !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  body {
    font-size: 12pt;
    line-height: 1.6;
    font-family: Georgia, serif;
  }

  /* Hide navigation, footer, interactive controls */
  header,
  footer,
  nav,
  .no-print {
    display: none !important;
  }

  /* Hide download/action buttons */
  a[href$=".pdf"],
  a[href*="infographic"],
  a[href*="download"],
  button {
    display: none !important;
  }

  /* Prev/Next navigation (border-t section at bottom of brief page) */
  nav[aria-label="Pagination"],
  [class*="border-t"] a {
    display: none !important;
  }

  /* Preserve heading-content relationship across page breaks */
  h1, h2, h3, h4 {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* Keep list items and sections together */
  section,
  li,
  p,
  blockquote {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Constrain images for print */
  img {
    max-width: 180px !important;
    height: auto !important;
    page-break-inside: avoid;
  }

  /* Show link URLs inline for printed text */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 10pt;
    color: #666 !important;
  }

  /* But not for internal links or buttons */
  a[href^="/"]::after,
  a[href^="#"]::after {
    content: "";
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-sitemap` postbuild package | Built-in `app/sitemap.ts` + `app/robots.ts` file conventions | Next.js 13.3+ | Zero dependencies, works natively with `output:'export'` |
| `next/og` ImageResponse for dynamic OG images | Static pre-existing image files via `openGraph.images` URLs | Always valid for static export | `next/og` requires server runtime — not available in static export |
| `<head>` metadata via `next/head` (Pages Router) | `generateMetadata` export (App Router) | Next.js 13 | Type-safe, co-located, build-time for static export |
| Streaming metadata (Next.js 15.2+) | Build-time metadata for static export | N/A | Static export always generates metadata at build time regardless of streaming feature |

**Deprecated/outdated:**
- `next/head` component: Pages Router only; not used in App Router.
- `themeColor` in metadata object: deprecated since Next.js 14; use `generateViewport` instead.
- `viewport` in metadata object: deprecated since Next.js 14; use `generateViewport` instead.
- `page-break-before/after/inside` CSS: deprecated in favor of `break-before/after/inside`; use both for browser compatibility.

---

## Critical Discrepancy Found

**Google Fonts are currently imported in `app/layout.tsx`** despite the Phase 1 CONTEXT.md locking "System fonts only — no Google Fonts." The imports `Playfair_Display` and `Inter` from `next/font/google` are present. `next/font/google` self-hosts the fonts, adding font files to the build output. This violates the locked decision and negatively impacts performance.

**Current state:** `layout.tsx` imports Google Fonts and injects CSS variable classnames on `<html>`.
**Correct state per Phase 1 decision:** `globals.css @theme` already defines `--font-sans: ui-sans-serif, system-ui, sans-serif` and `--font-serif: Georgia, serif` as system font stacks.

**This is the #1 performance action for Phase 5:** Removing Google Fonts is expected to reduce page weight significantly and improve Lighthouse score. One study cited showed removing fonts improved performance score from 64 to 79.

---

## Open Questions

1. **What is the actual Vercel production URL?**
   - What we know: `.env.local` does not have `NEXT_PUBLIC_SITE_URL`. Phase 1 CONTEXT.md says to set it in Vercel.
   - What's unclear: The actual subdomain assigned (could be `gghn-starr.vercel.app`, `gghnstarr.vercel.app`, or custom).
   - Recommendation: The planner should add a task to set `NEXT_PUBLIC_SITE_URL` in both `.env.local` and Vercel environment variables before sitemap/OG tags are correct.

2. **Are thumbnail images the right OG image size for WhatsApp?**
   - What we know: Thumbnails are 641×360 (WebP, ~23KB). WhatsApp shows large preview for images 300px+.
   - What's unclear: Whether WhatsApp will display a 641×360 image well (it's not the standard 1200×630 recommendation). The ratio is approximately 16:9 vs the recommended 1.91:1.
   - Recommendation: Thumbnails at 641px wide meet the "large preview" threshold. WhatsApp accepts varying aspect ratios. Use thumbnails as-is for v1 — good enough for professional preview. Flag for v2 if 1200×630 OG images are needed.

3. **Will print CSS selectors correctly target the prev/next nav?**
   - What we know: The prev/next nav is a `<nav>` element with `className="mt-16 pt-8 border-t border-slate-200 flex justify-between gap-4"`.
   - What's unclear: Tailwind v4 CSS-first may generate different class names. Using `nav:not([aria-label])` or `[class*="border-t"] nav` may not be reliable.
   - Recommendation: Add a `data-no-print` attribute or `.no-print` class to the prev/next nav in the page component, then target `.no-print { display: none }` in print CSS. This is the most reliable approach.

---

## Sources

### Primary (HIGH confidence)
- `https://nextjs.org/docs/app/api-reference/functions/generate-metadata` — generateMetadata API, openGraph fields, metadataBase — fetched 2026-04-21, version 16.2.4
- `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap` — sitemap.ts file convention — fetched 2026-04-21, version 16.2.4
- `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots` — robots.ts file convention — fetched 2026-04-21, version 16.2.4
- `app/briefs/[slug]/page.tsx` (codebase) — existing `generateMetadata` implementation examined directly
- `app/layout.tsx` (codebase) — Google Fonts imports confirmed present
- `app/globals.css` (codebase) — Tailwind v4 @theme system font fallbacks confirmed

### Secondary (MEDIUM confidence)
- GitHub Discussion #59019: `force-static` workaround for sitemap with `output:'export'` — superseded by built-in sitemap.ts working natively
- `https://www.ogrilla.com/blog/whatsapp-link-preview-guide` — WhatsApp OG image requirements: 300px+ for large preview, 600KB max, JPG/PNG/WebP formats — 2026 source, multiple sources agree
- `https://www.wisp.blog/blog/mastering-mobile-performance-a-complete-guide-to-improving-nextjs-lighthouse-scores` — font removal performance impact (64→79 score improvement)
- `https://github.com/iamvishnusankar/next-sitemap` — next-sitemap v4.2.3, static export output key, postbuild setup

### Tertiary (LOW confidence)
- JS bundle compression estimate (~200-220KB compressed from 666KB) — estimate based on typical Brotli ratios; should be verified with actual Lighthouse run against Vercel deployment

---

## Metadata

**Confidence breakdown:**
- Standard stack (sitemap/robots/metadata): HIGH — verified against official Next.js 16.2.4 docs on 2026-04-21
- Architecture patterns (generateMetadata, sitemap.ts): HIGH — official API docs, codebase examined
- Performance (font removal impact, LCP): MEDIUM — confirmed by multiple web performance studies; exact score improvement varies
- Print CSS: MEDIUM — standard CSS spec, MDN-backed; selector reliability for Tailwind classes is LOW (see Open Question 3)
- WhatsApp OG image specs: MEDIUM — multiple 2026 sources agree on 300px/600KB thresholds

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (Next.js docs stable; sitemap/robots conventions unlikely to change)
