# Technology Stack

**Project:** gghnStarr - GGHN STARR Africa AMR Modeling Initiative Website
**Researched:** 2026-03-23
**Version confidence:** LOW -- versions based on training data (cutoff May 2025). Run `npm view <pkg> version` to verify before installing.

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | ^15.1 | Framework, static export | App Router with `output: 'export'` produces a fully static site. Vercel-native. The project requirement specifies Next.js. | MEDIUM |
| React | ^19.0 | UI library | Ships with Next.js 15. Required peer dependency. | MEDIUM |
| TypeScript | ^5.6 | Type safety | Catches content schema errors at build time. Essential for typed JSON/MDX frontmatter. | MEDIUM |

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^4.0 | Utility-first CSS | Project requirement. v4 uses CSS-first configuration (no tailwind.config.js). Purges unused CSS at build for tiny bundles. | MEDIUM |
| @tailwindcss/postcss | ^4.0 | PostCSS plugin | Required integration path for Tailwind v4 with Next.js. | MEDIUM |
| tailwind-merge | ^2.6 | Class merging | Safely merge conditional Tailwind classes without conflicts. Small utility, big DX win. | MEDIUM |
| clsx | ^2.1 | Conditional classes | Lightweight conditional className builder. Pairs with tailwind-merge. | HIGH |

### Content (MDX + JSON)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @next/mdx | ^15.1 | MDX support | Official Next.js MDX integration. Works with App Router and static export. Simpler than next-mdx-remote for file-based content. | MEDIUM |
| @mdx-js/mdx | ^3.1 | MDX compiler | Peer dependency for @next/mdx. Compiles MDX to React components. | MEDIUM |
| @mdx-js/react | ^3.1 | MDX React provider | Provides custom component mapping for MDX content. | MEDIUM |
| gray-matter | ^4.0 | Frontmatter parsing | Extracts YAML frontmatter from MDX files. Mature, zero-issue library. Used for brief metadata. | HIGH |
| remark-gfm | ^4.0 | GitHub Flavored Markdown | Tables, strikethrough, task lists in policy brief content. | HIGH |

### Forms

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Formspree (service) | N/A | Form backend | Project requirement. No server needed -- static-compatible. Free tier handles low volume. | HIGH |
| @formspree/react | ^2.5 | React integration | Official Formspree React hooks. Handles validation, submission state, errors. | MEDIUM |

### PDF Downloads

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Static PDF files | N/A | Policy brief PDFs | Store pre-generated PDFs in `/public/briefs/`. No runtime PDF generation needed. Simple `<a href>` download links. | HIGH |

### SEO & Meta

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js Metadata API | built-in | SEO meta tags | App Router's `metadata` export and `generateMetadata` handle og:tags, title, description. No extra library needed. | HIGH |
| next-sitemap | ^4.2 | Sitemap generation | Auto-generates sitemap.xml and robots.txt at build time. Important for policy brief discoverability. | MEDIUM |

### Icons & UI Primitives

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| lucide-react | ^0.460 | Icons | Tree-shakeable, consistent icon set. Lighter than heroicons with better React integration. | MEDIUM |

### Development & Quality

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| ESLint | ^9.0 | Linting | Flat config format (eslint.config.mjs). Next.js ships eslint-config-next. | MEDIUM |
| Prettier | ^3.4 | Formatting | Consistent code style. Use prettier-plugin-tailwindcss for class sorting. | MEDIUM |
| prettier-plugin-tailwindcss | ^0.6 | Tailwind class sorting | Auto-sorts Tailwind classes in canonical order. Eliminates class ordering debates. | MEDIUM |

## What NOT to Use

| Technology | Why Not | Use Instead |
|------------|---------|-------------|
| next-mdx-remote | Adds complexity for remote/dynamic MDX loading. Overkill for local files with known paths at build time. | @next/mdx with file-based MDX imports |
| Contentlayer | Project abandoned/unmaintained since mid-2023. Do not depend on dead projects. | gray-matter + custom content loader (10 lines of code) |
| Headless CMS (Sanity, Strapi, etc.) | Over-engineering for 15 briefs managed by a technical team. Adds deployment complexity, API dependency, and cost. | JSON data files + MDX content files |
| styled-components / CSS Modules | Tailwind is the project requirement. Mixing paradigms creates maintenance burden. | Tailwind CSS exclusively |
| Chakra UI / shadcn/ui | 5-page static site does not need a component library. Hand-built Tailwind components are simpler and smaller. | Custom Tailwind components |
| next/font Google Fonts over-loading | Pick 1-2 fonts max. African health ministers on mobile may have bandwidth constraints. | next/font with 1 variable font (e.g., Inter) |
| react-pdf / @react-pdf/renderer | Runtime PDF generation is unnecessary. Briefs are pre-authored PDFs. Adds 500KB+ to bundle. | Static PDF files in /public/ |
| Framer Motion | Unnecessary animation weight for a policy-focused government audience. Animations distract from content credibility. | CSS transitions via Tailwind for subtle hover states |
| next-intl / i18n libraries | Site is English-only per project scope. Adding i18n adds routing complexity for zero benefit. | Hardcoded English content |

## Content File Structure

This is the most important architectural decision for weekly content updates.

### Recommended Structure

```
content/
  briefs/
    briefs-index.json          # Master index: metadata for all 15 briefs
    001-amr-surveillance.mdx   # Full brief content (body text)
    002-antibiotic-stewardship.mdx
    ...
public/
  briefs/
    001-amr-surveillance.pdf   # Downloadable PDF
    002-antibiotic-stewardship.pdf
    ...
```

### briefs-index.json Schema

```json
[
  {
    "id": "001",
    "slug": "amr-surveillance",
    "title": "AMR Surveillance Frameworks for Sub-Saharan Africa",
    "subtitle": "Policy Brief #1",
    "publishDate": "2026-03-23",
    "weekNumber": 1,
    "authors": ["Dr. Example Author"],
    "tags": ["surveillance", "sub-saharan-africa"],
    "pdfFilename": "001-amr-surveillance.pdf",
    "mdxFilename": "001-amr-surveillance.mdx",
    "summary": "A 2-3 sentence summary for card display and meta description.",
    "status": "published"
  }
]
```

### Why This Structure

1. **JSON index is the single source of truth** for brief metadata. The Policy Briefs Library page reads this one file to render all cards, apply filters, and sort by date. No filesystem scanning needed at build time.

2. **MDX files hold body content only.** Frontmatter is redundant when the JSON index already has all metadata. Keep MDX clean -- just prose and optional custom components (callout boxes, data tables).

3. **Adding a new brief is a 3-step process:**
   - Add entry to `briefs-index.json`
   - Create `content/briefs/NNN-slug.mdx`
   - Drop PDF into `public/briefs/NNN-slug.pdf`
   - Push to main -- Vercel auto-deploys

4. **`status` field** allows preparing briefs ahead of schedule. Set `"status": "draft"` and filter them out of the build. Flip to `"published"` when ready.

### MDX File Template

```mdx
# AMR Surveillance Frameworks for Sub-Saharan Africa

## Key Recommendations

1. Establish national AMR surveillance networks...
2. Integrate veterinary and human health data...

## Background

<Callout type="key-finding">
  Antimicrobial resistance causes an estimated 1.27 million deaths annually...
</Callout>

Detailed policy analysis content here...

## References

1. WHO Global Action Plan on AMR, 2015
2. ...
```

### Content Loading Pattern

```typescript
// lib/briefs.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Brief {
  id: string;
  slug: string;
  title: string;
  publishDate: string;
  weekNumber: number;
  tags: string[];
  pdfFilename: string;
  summary: string;
  status: 'published' | 'draft';
}

export function getAllBriefs(): Brief[] {
  const filePath = path.join(process.cwd(), 'content/briefs/briefs-index.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const briefs: Brief[] = JSON.parse(raw);

  return briefs
    .filter(b => b.status === 'published')
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export function getBriefBySlug(slug: string): Brief | undefined {
  return getAllBriefs().find(b => b.slug === slug);
}
```

## next.config.mjs for Static Export

```javascript
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

export default withMDX(nextConfig);
```

## Tailwind v4 Setup

Tailwind v4 uses CSS-first configuration. No `tailwind.config.js` needed.

```css
/* app/globals.css */
@import "tailwindcss";

/* Custom theme tokens */
@theme {
  --color-starr-blue: #1e3a5f;
  --color-starr-gold: #c8a951;
  --color-starr-green: #2d6a4f;
  --font-family-sans: "Inter", system-ui, sans-serif;
}
```

**Note:** Tailwind v4 was released in January 2025. If the team is more familiar with v3 (tailwind.config.js approach), v3 (^3.4) is also perfectly fine for this project. The choice does not materially affect the output. Use whichever the team is comfortable with.

## Installation

```bash
# Core
npx create-next-app@latest starr --typescript --tailwind --app --eslint

# MDX support
npm install @next/mdx @mdx-js/mdx @mdx-js/react

# Content utilities
npm install gray-matter remark-gfm

# Forms
npm install @formspree/react

# SEO
npm install next-sitemap

# UI utilities
npm install lucide-react clsx tailwind-merge

# Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| MDX Integration | @next/mdx | next-mdx-remote v5 | next-mdx-remote is for CMS/dynamic content. Local files with known paths at build time are simpler with @next/mdx. |
| Content Store | JSON index + MDX files | Contentlayer | Abandoned project. Not maintained since 2023. |
| Content Store | JSON index + MDX files | Velite | Newer alternative to Contentlayer. Adds build step complexity for marginal benefit on a 15-item dataset. |
| Styling | Tailwind v4 | Tailwind v3 | v4 is current. v3 is acceptable fallback if team prefers config-file approach. |
| Icons | lucide-react | @heroicons/react | Both fine. Lucide has slightly better tree-shaking and more icons. |
| Forms | @formspree/react | Native fetch to Formspree | React library handles loading/error/success states. Worth the 5KB. |
| Sitemap | next-sitemap | Manual sitemap.xml | 15 pages is manageable manually, but next-sitemap auto-updates when briefs are added. Worth it. |

## Performance Budget

For a mobile-first African audience, performance is a hard requirement:

| Metric | Target | How |
|--------|--------|-----|
| First bundle (JS) | < 80KB gzip | Static export + tree shaking. No heavy libraries. |
| LCP | < 2.5s on 3G | Minimal JS, optimized images, system fonts or single variable font. |
| Total page weight | < 500KB | No animations library, no component library, optimized images. |
| PDF downloads | Separate from page weight | Served as static files, downloaded on demand. |

## Sources

- Next.js App Router documentation (nextjs.org/docs) -- static export with `output: 'export'`
- Tailwind CSS v4 release blog (tailwindcss.com/blog/tailwindcss-v4) -- CSS-first configuration
- @next/mdx documentation (nextjs.org/docs/app/building-your-application/configuring/mdx)
- Formspree React documentation (formspree.io/docs/react)
- npm registry for version numbers (confidence: LOW -- verify before installing)
