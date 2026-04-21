# Phase 1: Foundation & Infrastructure - Research

**Researched:** 2026-03-25
**Domain:** Next.js 16 static export, Tailwind CSS v4, Git LFS, Vercel deployment
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Design Foundation
- Configure real Tailwind brand tokens (colors, spacing, typography) in Phase 1 — not deferred to Phase 2
- Derive brand colors from GGHN/STARR organizational materials (researcher should investigate GGHN visual identity)
- System fonts only — no Google Fonts or external font loading. Use system-ui / Georgia stack for optimal performance on constrained bandwidth (target audience: African policymakers on mobile)
- Dark mode supported from Phase 1 — configure Tailwind `dark:` variants and design tokens now so all subsequent phases can use them

#### Content Data Schema
- Brief TypeScript interface fields: `slug`, `title`, `weekNumber`, `publicationDate`, `authorId` (reference to experts.json), `keyTakeaway`, `executiveSummary`, `keyMessages: string[]`, `pdfUrl`, `infographicPdfUrl`, `thumbnailUrl`, `themes: string[]`
- `themes` is a string array — briefs can belong to multiple policy themes (Governance, Laboratory Systems, Predictive Analytics, One Health, Stewardship)
- Author stored by reference: `authorId` links to a record in `experts.json` (single source of truth for bio/photo/affiliation)
- Seed `briefs-index.json` with 3 sample brief entries — enough to verify data layer and test grid layout in Phase 2+

#### Layout Shell & Nav
- Header navigation: all 5 pages — Home, Briefs, Methodology, Experts, Contact
- Mobile header: hamburger menu with slide-out nav panel
- Container max-width: 1024px (`max-w-5xl`) — comfortable reading width for policy text
- Footer content: GGHN STARR branding + initiative tagline, partner acknowledgment line (Fleming Fund / Africa CDC / WHO AFRO), contact email + social/LinkedIn links
- Footer does NOT repeat the main navigation links

#### Vercel & Deployment
- Use Vercel subdomain (`.vercel.app`) throughout development — custom domain configured in Phase 5 before launch
- Deploy on push to `main` only — no preview deployments for branches
- `NEXT_PUBLIC_SITE_URL` environment variable configured in Vercel from Phase 1 (used by OG tags and sitemap in later phases)
- Git LFS tracks `*.pdf` AND large images (`*.jpg`, `*.png`) — both file types in `.gitattributes`

### Claude's Discretion
- Exact Tailwind color palette values (derived from GGHN materials during research)
- Dark mode toggle UI (button placement, icon style)
- Hamburger menu animation style
- System font stack fallback ordering
- Exact Expert TypeScript interface fields beyond what Phase 4 requires
- SiteContent JSON structure (used by `getSiteContent()`)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUN-01 | Project scaffolded as Next.js static export with TypeScript, Tailwind CSS v4, correct `next.config.js` (`output: 'export'`, `images: { unoptimized: true }`), and Vercel auto-deploy configured on push to `main` | Standard Stack section: exact commands, config files, and Vercel branch control |
| FOUN-02 | Content data layer — TypeScript interfaces for `Brief`, `Expert`, `SiteContent`; `lib/content.ts` with `getAllBriefs`, `getBriefBySlug`, `getExperts`, `getSiteContent`; JSON data files with sample entries | Architecture Patterns section: complete TypeScript interfaces honoring locked schema, content functions, JSON layout |
| FOUN-03 | Shared layout shell — `Header` with navigation links, `Footer` with branding, `Container` max-width wrapper; all 5 pages render within this shell | Architecture Patterns section: layout structure, mobile hamburger menu pattern, page skeleton pattern |
| FOUN-04 | Git LFS configured for PDF files and large images; `.gitattributes` entry for `*.pdf`, `*.jpg`, `*.png` | Code Examples section: exact `.gitattributes` content and initialization commands |
</phase_requirements>

---

## Summary

Phase 1 establishes the technical skeleton that all subsequent phases build on. The project starts from scratch — no existing Next.js files yet — and must produce a deployed Vercel site with the correct static export configuration, a typed content data layer, a shared layout shell, and binary asset management via Git LFS.

The current ecosystem versions are: Next.js 16.2.1, Tailwind CSS 4.2.2, and `@tailwindcss/postcss` 4.2.2. Tailwind v4 no longer uses `tailwind.config.js` — all theme customization (brand colors, dark mode) lives in `globals.css` using the `@theme` and `@custom-variant` directives. This is a significant break from v3 patterns and the primary area where prior research needs updating.

The GGHN/STARR design materials define two color palettes. The 5-page Design Spec (which was chosen per PROJECT.md) uses **Deep Navy #0F172A** as the primary dark base and **Medical Teal #0D9488** as the accent. The 13-page branding guide (not used) specified Deep Blue #003B73 / Emerald Green #0F8A5F / Gold #F2A900. The planner should use the Navy/Teal palette. Dark mode is configured from Phase 1 using Tailwind v4's `@custom-variant dark` directive with class-based toggling.

**Primary recommendation:** Scaffold with `npx create-next-app@latest`, install `tailwindcss @tailwindcss/postcss`, configure `next.config.js` with `output: 'export'` and `images: { unoptimized: true }`, define brand tokens in `globals.css` using `@theme`, configure Git LFS for `*.pdf`, `*.jpg`, `*.png`, connect to Vercel with branch filtering via the `Ignored Build Step` setting, and write the typed content functions against the locked Brief/Expert/SiteContent schema.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | Framework, static export | `output: 'export'` produces fully static HTML; App Router; Vercel-native. Verified: npm registry 2026-03-25. |
| react | 19.x (bundled with Next.js 16) | UI library | Peer dependency of Next.js 16. |
| typescript | 5.x (bundled via `--typescript`) | Type safety | Catches content schema errors at build time; essential for typed JSON content. |
| tailwindcss | 4.2.2 | Utility-first CSS | Locked decision. v4 CSS-first config, no `tailwind.config.js`. Verified: npm registry 2026-03-25. |
| @tailwindcss/postcss | 4.2.2 | PostCSS integration | Required for Tailwind v4 in Next.js. Replaces `tailwindcss` PostCSS plugin from v3. Verified: npm registry + official docs. |
| postcss | (auto-installed with Next.js) | CSS processing pipeline | Next.js requires PostCSS; Tailwind v4 hooks into it. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional class names | Every component that has conditional className logic. |
| tailwind-merge | 3.5.0 | Merge Tailwind classes safely | When building reusable components that accept className props to override defaults. |
| lucide-react | 1.6.0 | Icons (hamburger, social links, etc.) | Used for hamburger menu icon, close icon, LinkedIn icon in footer. Tree-shakeable. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 (@theme directive) | Tailwind v3 (tailwind.config.js) | v3 config-file approach is more familiar but v4 is current. Requirement locked to v4. |
| `images: { unoptimized: true }` | Custom CDN image loader | CDN loader adds infrastructure; `unoptimized: true` is correct for this project's scale. |
| Git LFS for binary assets | External CDN (Cloudflare R2, Google Drive) | CDN is better long-term but adds complexity; LFS is sufficient for 15 PDFs + images. |

**Installation:**
```bash
# 1. Scaffold project
npx create-next-app@latest . --typescript --eslint --app --no-tailwind --no-src-dir

# 2. Install Tailwind v4
npm install tailwindcss @tailwindcss/postcss postcss

# 3. Install UI utilities
npm install clsx tailwind-merge lucide-react
```

Note: Omit `--tailwind` from `create-next-app` to avoid installing v3 by default; install v4 manually in step 2.

---

## Architecture Patterns

### Recommended Project Structure
```
starr/                           # project root
├── next.config.js               # output: 'export', images: { unoptimized: true }
├── postcss.config.mjs           # @tailwindcss/postcss plugin
├── .gitattributes               # Git LFS tracking rules
├── .gitignore
├── package.json
├── tsconfig.json
│
├── content/                     # DATA LAYER (JSON files read at build time)
│   ├── briefs-index.json        # Array of Brief records (seed with 3)
│   ├── experts.json             # Array of Expert records
│   └── site.json                # SiteContent (tagline, partners, etc.)
│
├── public/                      # STATIC ASSETS (copied as-is to /out)
│   ├── briefs/                  # PDF files — tracked by Git LFS
│   ├── infographics/            # Infographic PDF files — tracked by Git LFS
│   └── images/                  # Expert photos, partner logos — tracked by Git LFS
│       ├── experts/
│       └── partners/
│
└── app/                         # APP ROUTER (Next.js)
    ├── layout.tsx               # Root layout: Header + Footer wrapping all pages
    ├── globals.css              # @import "tailwindcss"; @theme { ... }; @custom-variant dark
    ├── page.tsx                 # Homepage skeleton (renders in shell, no content yet)
    ├── briefs/
    │   └── page.tsx             # Briefs page skeleton
    ├── methodology/
    │   └── page.tsx             # Methodology page skeleton
    ├── experts/
    │   └── page.tsx             # Experts page skeleton
    ├── contact/
    │   └── page.tsx             # Contact page skeleton
    │
    ├── components/
    │   └── layout/
    │       ├── Header.tsx       # Nav with hamburger mobile menu
    │       ├── Footer.tsx       # Branding + partners + contact
    │       └── Container.tsx    # max-w-5xl centered wrapper
    │
    └── lib/
        ├── content.ts           # getAllBriefs, getBriefBySlug, getExperts, getSiteContent
        └── types.ts             # Brief, Expert, SiteContent interfaces
```

### Pattern 1: next.config.js for Static Export

**What:** The configuration that converts Next.js from a server app to a static site generator.
**When to use:** From day one. This must be configured before writing any components.

```javascript
// Source: https://nextjs.org/docs/app/guides/static-exports (verified 2026-03-20, Next.js 16.2.1)
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // Required: default loader requires a server
  },
  // trailingSlash: false is the default; Vercel handles this correctly
};

module.exports = nextConfig;
```

### Pattern 2: Tailwind v4 CSS-First Configuration

**What:** Brand tokens defined as CSS custom properties in `globals.css` using `@theme`. No `tailwind.config.js` required.
**When to use:** All brand colors, typography, and dark mode variant go here in Phase 1.

```css
/* Source: https://tailwindcss.com/docs/adding-custom-styles + dark-mode (verified 2026-03-25) */
/* app/globals.css */
@import "tailwindcss";

/* Brand color tokens — derived from GGHN STARR Design Spec (Navy/Teal) */
@theme {
  /* Primary palette */
  --color-navy-950: #0F172A;      /* Deep Navy — primary dark background */
  --color-navy-900: #1E293B;      /* Navy — card backgrounds, secondary dark */
  --color-navy-800: #2D3F55;      /* Navy lighter — borders, dividers */
  --color-teal-600: #0D9488;      /* Medical Teal — CTAs, accent, links */
  --color-teal-500: #14B8A6;      /* Teal lighter — hover states */
  --color-teal-400: #2DD4BF;      /* Teal light — highlights, dark mode accent */

  /* Neutral palette */
  --color-slate-50: #F8FAFC;      /* Near-white — page background (light mode) */
  --color-slate-100: #F1F5F9;     /* Light gray — card backgrounds (light mode) */
  --color-slate-600: #475569;     /* Medium gray — body text secondary */
  --color-slate-900: #0F172A;     /* Same as navy-950 — body text (dark) */

  /* System font stacks — NO external fonts (hard requirement for bandwidth) */
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  /* Headings use serif for authoritative policy look; body uses sans */
}

/* Class-based dark mode — toggle .dark on <html> with JavaScript */
/* Source: https://tailwindcss.com/docs/dark-mode (verified 2026-03-25) */
@custom-variant dark (&:where(.dark, .dark *));
```

Key insight: In Tailwind v4, `--color-navy-950` becomes available as `bg-navy-950`, `text-navy-950`, etc. The naming convention `--color-{name}-{shade}` maps directly to utility classes.

### Pattern 3: Root Layout with Header/Footer Shell

**What:** `app/layout.tsx` wraps every page with the Header and Footer. Pages are Server Components by default.
**When to use:** This is the layout that all 5 pages render inside.

```typescript
// Source: Next.js App Router docs - layouts (HIGH confidence, standard pattern)
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'GGHN STARR | AMR Policy Intelligence for Africa',
    template: '%s | GGHN STARR',
  },
  description: 'Evidence-backed AMR policy briefs for African health decision-makers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-navy-950 font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

Note: `suppressHydrationWarning` is required on `<html>` when dark mode toggle modifies the `dark` class client-side to prevent React hydration mismatch warnings.

### Pattern 4: Content Data Layer with fs

**What:** `lib/content.ts` reads JSON files using Node.js `fs` at build time. This only runs on the build server; it is not accessible at runtime in a static export.
**When to use:** Any time a page component needs content from JSON files.

```typescript
// Source: Next.js static export + fs data loading (HIGH confidence, official pattern)
// lib/content.ts
import fs from 'fs';
import path from 'path';
import type { Brief, Expert, SiteContent } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getAllBriefs(): Brief[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'briefs-index.json'), 'utf-8');
  const briefs: Brief[] = JSON.parse(raw);
  return briefs.sort((a, b) => a.weekNumber - b.weekNumber);
}

export function getBriefBySlug(slug: string): Brief | undefined {
  return getAllBriefs().find((b) => b.slug === slug);
}

export function getExperts(): Expert[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'experts.json'), 'utf-8');
  return JSON.parse(raw) as Expert[];
}

export function getSiteContent(): SiteContent {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'site.json'), 'utf-8');
  return JSON.parse(raw) as SiteContent;
}
```

### Pattern 5: TypeScript Interfaces (Locked Schema)

**What:** The `Brief` interface fields are locked by the CONTEXT.md decisions. The `Expert` and `SiteContent` interfaces are partially defined here; Claude has discretion on non-locked fields.

```typescript
// lib/types.ts

// LOCKED — fields from CONTEXT.md decisions
export interface Brief {
  slug: string;
  title: string;
  weekNumber: number;
  publicationDate: string;          // ISO date string: "2026-03-24"
  authorId: string;                  // References Expert.id in experts.json
  keyTakeaway: string;               // One-sentence key insight
  executiveSummary: string;          // 100-150 word summary
  keyMessages: string[];             // 3-7 bullet points
  pdfUrl: string;                    // Path: "/briefs/week-01-amr-governance.pdf"
  infographicPdfUrl: string;         // Path: "/infographics/week-01-infographic.pdf"
  thumbnailUrl: string;              // Path: "/images/thumbnails/week-01.jpg"
  themes: string[];                  // Subset of: Governance, Laboratory Systems,
                                     // Predictive Analytics, One Health, Stewardship
}

// PARTIALLY LOCKED — id/name/bio required by Phase 4; other fields at discretion
export interface Expert {
  id: string;                        // Referenced by Brief.authorId
  name: string;
  title: string;
  organization: string;
  bio: string;                       // 200-word bio
  photoUrl: string;                  // Path: "/images/experts/olawale.jpg"
  specialties: string[];             // E.g. ["AMR Surveillance", "Genomics"]
  linkedinUrl?: string;              // Optional social link
}

// DISCRETION — structure serves getSiteContent(); planner defines based on Phase 2 needs
export interface SiteContent {
  siteTitle: string;
  tagline: string;                   // "Evidence. Advocacy. Action."
  conferenceDate: string;            // "June 28, 2026"
  partners: Array<{
    name: string;
    logoUrl: string;
    url?: string;
  }>;
  contactEmail: string;
  linkedinUrl?: string;
  footerTagline: string;             // Initiative tagline for footer
}
```

### Pattern 6: Mobile Hamburger Menu

**What:** The Header contains a hamburger icon (visible on mobile, hidden on desktop) that toggles a slide-out nav panel. This is a Client Component because it uses `useState`.
**When to use:** Phase 1 builds the mobile nav as part of the Header shell.

```typescript
// Source: Standard React/Next.js pattern for mobile nav (HIGH confidence)
// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/briefs', label: 'Briefs' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/experts', label: 'Experts' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-navy-950 text-white dark:bg-navy-950">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-serif font-bold text-lg text-teal-400">
          GGHN STARR
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-200 hover:text-teal-400 transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-200 hover:text-teal-400"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile slide-out panel */}
      {isOpen && (
        <nav className="md:hidden bg-navy-900 border-t border-navy-800 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-200 hover:text-teal-400 transition-colors text-base"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
```

### Pattern 7: Container Component

**What:** A simple wrapper that centers content at 1024px (`max-w-5xl`) with horizontal padding.

```typescript
// components/layout/Container.tsx
export function Container({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
```

### Pattern 8: Page Skeleton

**What:** Each of the 5 pages renders as a Server Component returning a placeholder inside the Container. No page content in Phase 1 — just valid routes that confirm the shell works.

```typescript
// app/briefs/page.tsx (example — same pattern for all 5 pages)
import { Container } from '@/components/layout/Container';

export default function BriefsPage() {
  return (
    <Container className="py-16">
      <h1 className="font-serif text-3xl text-navy-950 dark:text-slate-50">
        Policy Briefs
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mt-4">
        Content coming in Phase 3.
      </p>
    </Container>
  );
}
```

### Pattern 9: Git LFS Configuration

**What:** Track binary files (PDF, JPG, PNG) with Git LFS so they don't bloat repository history. Git stores a pointer; the actual binary is fetched from LFS storage.
**When to use:** Before adding any binary files to the repo.

```bash
# Initialize Git LFS (once per machine)
git lfs install

# Track file types (these commands update .gitattributes automatically)
git lfs track "*.pdf"
git lfs track "*.jpg"
git lfs track "*.png"

# Commit the .gitattributes file first
git add .gitattributes
git commit -m "chore: configure Git LFS for binary assets"
```

The resulting `.gitattributes` content:
```
*.pdf filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
```

### Anti-Patterns to Avoid

- **Tailwind v3 config**: Do not create `tailwind.config.js`. Tailwind v4 uses CSS-first `@theme` in `globals.css`. Mixing them will cause conflicts.
- **Dynamic Tailwind class names**: Never use template literals like `` `bg-${color}-500` ``. Tailwind's JIT compiler purges class names not present as complete strings. Use static mapping objects instead.
- **API Routes in static export**: `output: 'export'` does not support `app/api/` route handlers that read from `Request`. The build will fail. Use Formspree for forms (later phases).
- **Server Actions**: Explicitly unsupported in static export. Do not add them at any phase.
- **`cookies()` or `headers()`**: Both require a running server. Will fail at build time.
- **`export const dynamic = 'force-dynamic'`**: Breaks static export. If used, set it to `'error'` in the root layout to catch mistakes early.
- **Forgetting `suppressHydrationWarning`**: Required on `<html>` when the dark mode toggle modifies the `dark` class client-side, otherwise React reports a hydration mismatch.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conditional class merging | Custom classNames helper function | `clsx` + `tailwind-merge` | Handles edge cases (false values, undefined, arrays, Tailwind class conflicts) |
| Icon SVGs | Inline SVG or custom icon components | `lucide-react` | Tree-shakeable, consistent sizing API, accessible titles, 1500+ icons |
| Dark mode persistence | Custom localStorage + class toggle from scratch | Standard pattern (localStorage + `dark` class on `<html>`) | 4 lines of JS; session storage, OS preference fallback, no flash-of-unstyled-content |
| Git binary asset management | Manual file size monitoring | Git LFS | Git itself breaks with large binaries in history; LFS is the standard solution |

**Key insight:** Phase 1 is foundational infrastructure — the components are simple, but getting the configuration right (static export, Tailwind v4, Git LFS, Vercel branch rules) prevents expensive rewrites in every later phase.

---

## Common Pitfalls

### Pitfall 1: Image Optimization Build Failure
**What goes wrong:** Using `next/image` without `images: { unoptimized: true }` causes the build to fail with `output: 'export'`. The default image optimization loader requires a Node.js server.
**Why it happens:** Next.js image component works transparently in server mode but has a different requirement in static export.
**How to avoid:** Set `images: { unoptimized: true }` in `next.config.js` before writing any component. This is in the locked configuration.
**Warning signs:** Build error mentioning image optimization or loader. Catch this in Phase 1 during scaffold.
**Source:** https://nextjs.org/docs/app/guides/static-exports — verified 2026-03-20, Next.js 16.2.1

### Pitfall 2: Tailwind v4 Dark Mode Requires @custom-variant
**What goes wrong:** Using `darkMode: 'class'` in a `tailwind.config.js` (v3 pattern) does nothing in Tailwind v4 because the config file no longer controls dark mode strategy.
**Why it happens:** Tailwind v4 removed the JavaScript config-based `darkMode` setting.
**How to avoid:** Add `@custom-variant dark (&:where(.dark, .dark *));` to `globals.css` after the `@import "tailwindcss";` line. Then toggle the `.dark` class on `<html>` with JavaScript.
**Warning signs:** `dark:` utility classes have no effect in production or development when the `.dark` class is added to `<html>`.
**Source:** https://tailwindcss.com/docs/dark-mode — verified 2026-03-25, Tailwind v4.2.2

### Pitfall 3: Vercel Deploys All Branches by Default
**What goes wrong:** Every git push to any branch triggers a Vercel preview deployment. This contradicts the locked decision to deploy only on push to `main`.
**Why it happens:** Vercel's default behavior deploys all branches with separate preview URLs.
**How to avoid:** In Vercel Project Settings > Git > "Ignored Build Step", add a bash script that exits 1 only for `main`:
```bash
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then exit 1 ; else exit 0 ; fi
```
An exit code of 0 cancels the build; exit code 1 proceeds with it. This prevents preview deployments on feature branches.
**Warning signs:** After connecting GitHub repo, test by pushing to a branch and verifying no deployment is triggered in Vercel dashboard.
**Source:** Vercel community + GitHub discussions (MEDIUM confidence — verified with multiple sources, 2026-03-25)

### Pitfall 4: Missing `suppressHydrationWarning` on Root HTML Element
**What goes wrong:** If dark mode is implemented by toggling a class on `<html>` client-side (e.g., from a button or localStorage), React logs a hydration mismatch warning in development and may cause issues in production.
**Why it happens:** Server renders `<html>` without the `dark` class; client-side code adds it before React hydrates, creating a mismatch.
**How to avoid:** Add `suppressHydrationWarning` to the `<html>` element in `app/layout.tsx`. This is a standard pattern for class-based dark mode.
**Warning signs:** Console warnings about hydration mismatch involving the html element's className.

### Pitfall 5: Git LFS Not Installed Before Committing Binaries
**What goes wrong:** If a PDF or large image is committed before running `git lfs install` and configuring `.gitattributes`, it goes into regular git storage. The repo bloats, and there is no easy way to remove binary history without rewriting git history.
**Why it happens:** `.gitattributes` only tracks new commits. Past commits already contain the binary.
**How to avoid:** Configure Git LFS and commit `.gitattributes` as the very first task before any binary files are added. The initial sample briefs PDFs should not be added until LFS is confirmed working.
**Warning signs:** `git lfs status` shows no tracked files after setup, or clone size grows rapidly.

### Pitfall 6: PostCSS Config Missing for Tailwind v4
**What goes wrong:** Tailwind CSS v4 requires a `postcss.config.mjs` file specifying `@tailwindcss/postcss` as the plugin. Without it, Tailwind classes are not processed and the site renders with no styles.
**Why it happens:** Unlike v3 where `tailwindcss` was a PostCSS plugin by default in Next.js, v4 uses a separate `@tailwindcss/postcss` package.
**How to avoid:** Create `postcss.config.mjs` at project root:
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```
**Warning signs:** Site renders with no visual styles; no errors in the terminal.
**Source:** https://tailwindcss.com/docs/installation/framework-guides/nextjs — verified 2026-03-25

---

## Code Examples

Verified patterns from official sources:

### next.config.js (Complete)
```javascript
// Source: https://nextjs.org/docs/app/guides/static-exports — Next.js 16.2.1
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

### globals.css (Complete Phase 1 configuration)
```css
/* Source: https://tailwindcss.com/docs/adding-custom-styles + dark-mode — Tailwind v4.2.2 */
@import "tailwindcss";

/* GGHN STARR Brand Tokens — Navy/Teal Design Spec */
@theme {
  /* Brand colors */
  --color-navy-950: #0F172A;
  --color-navy-900: #1E293B;
  --color-navy-800: #2D3F55;
  --color-teal-600: #0D9488;
  --color-teal-500: #14B8A6;
  --color-teal-400: #2DD4BF;
  --color-slate-50: #F8FAFC;
  --color-slate-100: #F1F5F9;
  --color-slate-200: #E2E8F0;
  --color-slate-400: #94A3B8;
  --color-slate-600: #475569;

  /* System font stacks — NO external fonts */
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
}

/* Class-based dark mode toggle */
@custom-variant dark (&:where(.dark, .dark *));

/* Base styles */
html {
  scroll-behavior: smooth;
}

body {
  @apply font-sans text-slate-900 bg-slate-50;
  @apply dark:text-slate-50 dark:bg-navy-950;
}
```

### postcss.config.mjs
```javascript
// Source: https://tailwindcss.com/docs/installation/framework-guides/nextjs — verified 2026-03-25
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### Dark Mode Toggle (for Phase 1 Header discretion area)
```typescript
// Minimal dark mode toggle — placed in Header component
// Source: https://tailwindcss.com/docs/dark-mode — standard pattern
'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(saved === 'dark' || (!saved && prefersDark));
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="text-slate-200 hover:text-teal-400 transition-colors"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
```

### briefs-index.json (3 sample entries)
```json
[
  {
    "slug": "amr-governance-frameworks",
    "title": "AMR Governance Frameworks for African Health Systems",
    "weekNumber": 1,
    "publicationDate": "2026-03-24",
    "authorId": "olawale-a",
    "keyTakeaway": "Integrating AMR governance into national health strategies reduces resistance emergence by up to 40% within five years.",
    "executiveSummary": "This brief examines national AMR governance structures across 12 African countries, identifying common gaps in policy implementation and offering a framework for multi-sectoral coordination aligned with WHO GLASS reporting requirements.",
    "keyMessages": [
      "Only 7 of 54 African Union member states have fully funded NAP implementation budgets.",
      "Multi-sectoral coordination between human, animal, and environmental health sectors remains the primary governance gap.",
      "GLASS reporting alignment improves data quality for cross-border AMR intelligence."
    ],
    "pdfUrl": "/briefs/week-01-amr-governance.pdf",
    "infographicPdfUrl": "/infographics/week-01-infographic.pdf",
    "thumbnailUrl": "/images/thumbnails/week-01.jpg",
    "themes": ["Governance", "One Health"]
  },
  {
    "slug": "predictive-modeling-amr-hotspots",
    "title": "Predictive Modeling for AMR Hotspot Identification",
    "weekNumber": 2,
    "publicationDate": "2026-03-31",
    "authorId": "samson-a",
    "keyTakeaway": "SEIR-based AMR transmission models can identify high-risk districts 8-12 weeks before resistance patterns become clinically apparent.",
    "executiveSummary": "Drawing on NIPAD platform data and SEIR compartmental modeling, this brief presents a framework for early identification of AMR transmission hotspots at the district level, enabling proactive stewardship interventions.",
    "keyMessages": [
      "Machine learning models integrating lab, prescription, and environmental data outperform single-source surveillance.",
      "Agent-based simulations of stewardship interventions show 25-35% reduction in resistance spread.",
      "Real-time predictive alerts to district health teams require WHONET data integration."
    ],
    "pdfUrl": "/briefs/week-02-predictive-modeling.pdf",
    "infographicPdfUrl": "/infographics/week-02-infographic.pdf",
    "thumbnailUrl": "/images/thumbnails/week-02.jpg",
    "themes": ["Predictive Analytics", "Laboratory Systems"]
  },
  {
    "slug": "one-health-amr-surveillance",
    "title": "One Health AMR Surveillance: Linking Human, Animal, and Environmental Data",
    "weekNumber": 3,
    "publicationDate": "2026-04-07",
    "authorId": "piringar-m",
    "keyTakeaway": "Integrating veterinary and environmental AMR data with human surveillance triples the lead time for detecting emerging resistant strains.",
    "executiveSummary": "This brief synthesizes evidence from Rwanda, Nigeria, and Botswana One Health AMR programs, demonstrating that multi-sectoral surveillance infrastructure under GLASS and Africa CDC frameworks significantly improves stewardship response times.",
    "keyMessages": [
      "Veterinary AMR reporting lag of 6-18 months creates blind spots in national surveillance.",
      "Environmental sampling programs in food production zones identify resistance reservoirs missed by clinical surveillance.",
      "Fleming Fund-supported integrated surveillance systems show measurable improvement in AMR data completeness."
    ],
    "pdfUrl": "/briefs/week-03-one-health-surveillance.pdf",
    "infographicPdfUrl": "/infographics/week-03-infographic.pdf",
    "thumbnailUrl": "/images/thumbnails/week-03.jpg",
    "themes": ["One Health", "Laboratory Systems", "Governance"]
  }
]
```

### experts.json (3 expert entries matching authorIds above)
```json
[
  {
    "id": "olawale-a",
    "name": "Dr. Olawale A.",
    "title": "One Health Laboratory Advisor",
    "organization": "Georgetown University / Fleming Fund Rwanda",
    "bio": "Dr. Olawale A. holds a PhD in Molecular Genomics and Medical Virology and a Fellowship of the Medical Laboratory Science Council of Nigeria. His work in AMR spans clinical laboratory science, genomics, and public health systems, with findings published in peer-reviewed journals. He serves as One Health Laboratory Advisor for the Georgetown University Fleming Fund AMR Project in Rwanda.",
    "photoUrl": "/images/experts/olawale.jpg",
    "specialties": ["AMR Surveillance", "Genomic AMR", "Laboratory Systems", "One Health"],
    "linkedinUrl": null
  },
  {
    "id": "samson-a",
    "name": "Dr. Samson A.",
    "title": "Mathematical & Predictive Modeling Specialist",
    "organization": "GGHN STARR Initiative",
    "bio": "Dr. Samson A. specializes in mathematical and machine-learning modeling frameworks for AMR and infectious disease epidemiology. He developed the Nigeria Immunization Predictive Analytics Dashboard (NIPAD), an R/Shiny platform integrating SEIR, Bayesian, and agent-based models. His GlobalPPS expertise supports standardized AMR consumption surveillance across African countries.",
    "photoUrl": "/images/experts/samson.jpg",
    "specialties": ["Predictive Modeling", "SEIR Models", "NIPAD", "GlobalPPS", "Bayesian Statistics"],
    "linkedinUrl": null
  },
  {
    "id": "piringar-m",
    "name": "Piringar Mercy Niyang",
    "title": "One Health Governance & AMR Surveillance Lead",
    "organization": "GGHN STARR Initiative",
    "bio": "Piringar Mercy Niyang combines microbiology, public health, and project leadership with extensive field experience across African health systems. She provides technical leadership on AMR surveillance, laboratory strengthening, stewardship, and governance, working with national institutions and regional partners including Africa CDC. Her work spans Nigeria, Rwanda, Cameroon, Eswatini, and Kenya.",
    "photoUrl": "/images/experts/piringar.jpg",
    "specialties": ["One Health Governance", "AMR Surveillance", "GLASS", "Africa CDC Frameworks"],
    "linkedinUrl": null
  }
]
```

### site.json (SiteContent seed data)
```json
{
  "siteTitle": "GGHN STARR",
  "tagline": "Evidence. Advocacy. Action.",
  "conferenceDate": "June 28, 2026",
  "contactEmail": "starr@gghn.org",
  "linkedinUrl": null,
  "footerTagline": "GGHN STARR Africa AMR Modeling Initiative — Accelerating AMR Policy into Practice",
  "partners": [
    { "name": "Fleming Fund", "logoUrl": "/images/partners/fleming-fund.png", "url": "https://www.flemingfund.org" },
    { "name": "Africa CDC", "logoUrl": "/images/partners/africa-cdc.png", "url": "https://africacdc.org" },
    { "name": "WHO AFRO", "logoUrl": "/images/partners/who-afro.png", "url": "https://www.afro.who.int" },
    { "name": "GUCGHPI", "logoUrl": "/images/partners/gucghpi.png", "url": "https://ghss.georgetown.edu" }
  ]
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with `darkMode: 'class'` | `@custom-variant dark` in CSS | Tailwind v4 (Jan 2025) | No `tailwind.config.js` needed; theme tokens live in `globals.css` |
| `@tailwind base/components/utilities` directives | `@import "tailwindcss"` | Tailwind v4 (Jan 2025) | Single import replaces three directives |
| `tailwindcss` as PostCSS plugin | `@tailwindcss/postcss` as PostCSS plugin | Tailwind v4 (Jan 2025) | Separate package; must be installed explicitly |
| `next export` command | `output: 'export'` in next.config.js | Next.js v14.0.0 | `next export` no longer exists |
| `pages/` directory | `app/` App Router | Next.js v13.4 stable | Pages Router is maintenance-mode; App Router is current |

**Deprecated/outdated:**
- `next export` command: Removed in Next.js v14. Use `output: 'export'` in config.
- `@tailwind base`, `@tailwind components`, `@tailwind utilities`: Replaced by single `@import "tailwindcss"` in v4.
- `darkMode: 'class'` in `tailwind.config.js`: No effect in Tailwind v4.

---

## Brand Colors: Design Spec vs Branding Guide

This is a discretion area (exact color values) that needed investigation.

**Two palettes found in project materials:**

1. **13-page branding guide** (`web_wireframe.txt`): Deep Blue #003B73, Emerald Green #0F8A5F, Gold #F2A900 — this is the broader organizational identity guide.

2. **5-page Design Spec** (referenced in PROJECT.md as the chosen spec): Deep Navy #0F172A, Medical Teal #0D9488 — this is the site-specific design spec.

**Resolution:** PROJECT.md explicitly states: "The Design Spec (5-page, Navy/Teal) was chosen over the broader branding guide (13-page, Blue/Green/Gold)." Use the Navy/Teal palette:
- Primary: `#0F172A` (Deep Navy)
- Accent: `#0D9488` (Medical Teal)
- These are defined in the `@theme` block in `globals.css` as `--color-navy-950` and `--color-teal-600`.

**System font stack rationale (discretion area):** Georgia is the recommended serif for headings — it is universally available, renders well on both Windows and macOS, and conveys the authoritative policy aesthetic used by WHO and Brookings. `system-ui` / `ui-sans-serif` for body text eliminates all font network requests, which is the hard requirement for bandwidth-constrained mobile users in Africa.

---

## Open Questions

1. **GGHN STARR logo asset**
   - What we know: The site needs a logo in the header. The wireframe references GGHN STARR branding.
   - What's unclear: Whether a logo SVG or PNG exists in the project files, or whether a text-based logo is the fallback.
   - Recommendation: Use text "GGHN STARR" in the header for Phase 1. Task should note: "If a logo file is provided, replace text with `<img>`."

2. **Expert photo assets**
   - What we know: The three experts (Dr. Olawale A., Dr. Samson A., Piringar Mercy Niyang) have full bios in `starr_expertises.txt`. No photos were found in the repo.
   - What's unclear: Whether headshot photos will be provided.
   - Recommendation: Phase 1 seeds the data layer with `photoUrl` fields pointing to placeholder paths. Actual photos added in Phase 4 when the Experts page is built.

3. **Partner logo assets**
   - What we know: Four partners — Fleming Fund, Africa CDC, WHO AFRO, GUCGHPI.
   - What's unclear: Whether logo files exist in the project.
   - Recommendation: Phase 1 seeds `site.json` with partner logo paths. Use placeholder images in `public/images/partners/`. Actual logos added in Phase 2 or when files are provided.

4. **Git LFS availability on deployment machine**
   - What we know: The project uses git on Windows 11.
   - What's unclear: Whether `git lfs` is installed on the development machine.
   - Recommendation: First task in Phase 1 should verify `git lfs version`. If not installed, provide installation instructions (Windows: `winget install GitHub.GitLFS` or from https://git-lfs.github.com).

---

## Sources

### Primary (HIGH confidence)
- https://nextjs.org/docs/app/guides/static-exports — Static export configuration, unsupported features, version 16.2.1. Verified 2026-03-20 (page lastUpdated field).
- https://tailwindcss.com/docs/installation/framework-guides/nextjs — Tailwind v4 + Next.js install steps. Verified 2026-03-25.
- https://tailwindcss.com/docs/dark-mode — `@custom-variant dark` syntax. Verified 2026-03-25.
- https://tailwindcss.com/docs/adding-custom-styles — `@theme` directive and token naming convention. Verified 2026-03-25.
- npm registry — next@16.2.1, tailwindcss@4.2.2, @tailwindcss/postcss@4.2.2, lucide-react@1.6.0, clsx@2.1.1, tailwind-merge@3.5.0, next-sitemap@4.2.3. Verified 2026-03-25.
- https://docs.github.com/en/repositories/working-with-files/managing-large-files/configuring-git-large-file-storage — Git LFS `.gitattributes` configuration. Verified 2026-03-25.
- `.planning/PROJECT.md` — Navy/Teal design spec chosen, project constraints. Project documentation.
- `web_wireframe.txt` — Branding palette values (13-page spec, not chosen). Project source material.
- `starr_expertises.txt` — Expert names, titles, bios for `experts.json` seed data. Project source material.

### Secondary (MEDIUM confidence)
- Vercel community / GitHub discussions — Ignored Build Step script for branch filtering. Multiple sources agree on the exit code approach.
- `.planning/research/STACK.md`, `ARCHITECTURE.md`, `PITFALLS.md` — Prior project research (2026-03-23). Architecture patterns remain valid; version numbers updated from npm registry.

### Tertiary (LOW confidence)
- Contact email `starr@gghn.org` in `site.json` seed: Placeholder value. Real email not found in source materials. Must be confirmed before Phase 5 launch.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm registry verified all versions 2026-03-25
- Architecture patterns: HIGH — official Next.js and Tailwind docs verified; prior project research confirmed
- Tailwind v4 configuration: HIGH — official Tailwind docs verified 2026-03-25; this was a MEDIUM risk area due to v4's CSS-first approach being a significant break from v3
- Git LFS setup: HIGH — official GitHub docs verified
- Vercel branch filtering: MEDIUM — community sources, multiple agreeing, but not official Vercel docs primary reference
- Brand colors: HIGH — PROJECT.md explicitly resolves the two-palette conflict in favor of Navy/Teal
- Expert/seed data: HIGH — names and bios from `starr_expertises.txt`; photo assets flagged as open question
- Pitfalls: HIGH — static export pitfalls verified against Next.js 16.2.1 official docs; Tailwind v4 pitfalls verified against current docs

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (30 days; Next.js and Tailwind release frequently but configuration APIs are stable)
