# Architecture Patterns

**Domain:** Static content/policy website (Next.js static export)
**Researched:** 2026-03-23
**Confidence:** HIGH (well-established patterns for static Next.js sites)

## Recommended Architecture

Use **Next.js 14 App Router with `output: 'export'`** (static HTML generation). No server required at runtime -- the entire site compiles to static files served from Vercel's CDN.

```
                         BUILD TIME                          RUNTIME (CDN)
  +-----------------+    +------------------+    +-------------------------+
  | /content/       |    | next build       |    | Static HTML/CSS/JS      |
  |   briefs/*.json |--->| (generates HTML) |--->| served from Vercel CDN  |
  |   experts.json  |    +------------------+    +-------------------------+
  |   site.json     |            |                         |
  +-----------------+            |                         v
                                 |               +------------------+
  +-----------------+            |               | Client-side JS   |
  | /public/        |            |               | - Brief filtering|
  |   pdfs/*.pdf    |------------+               | - Form submit    |
  |   images/*      |                            | - Animations     |
  +-----------------+                            +------------------+
                                                         |
                                                         v
                                                 +------------------+
                                                 | External APIs    |
                                                 | - Formspree      |
                                                 | - Newsletter     |
                                                 +------------------+
```

### Why App Router Over Pages Router

Use App Router because:
1. It is the current default and recommended approach in Next.js 14+
2. Server Components produce smaller client bundles (critical for African bandwidth)
3. Layout nesting maps naturally to shared header/footer
4. `output: 'export'` is fully supported
5. Pages Router is maintenance-mode -- new features go to App Router only

**Constraint with static export:** No API routes, no server-side runtime. All dynamic behavior (filtering, forms) must be client-side.

## Directory Structure

```
starr/
+-- next.config.js              # output: 'export', image config
+-- tailwind.config.js          # theme colors, fonts
+-- package.json
|
+-- content/                    # DATA LAYER (non-developers edit here)
|   +-- briefs/                 # One JSON file per policy brief
|   |   +-- 001-amr-governance.json
|   |   +-- 002-financing-models.json
|   |   +-- ...
|   |   +-- 015-digital-surveillance.json
|   +-- experts.json            # Array of 3 expert profiles
|   +-- site.json               # Global copy: hero text, stats, partner list
|   +-- methodology.json        # Methodology page content
|
+-- public/                     # STATIC ASSETS (copied as-is to output)
|   +-- pdfs/                   # Downloadable policy brief PDFs
|   |   +-- brief-001.pdf
|   |   +-- ...
|   +-- images/
|   |   +-- experts/            # Expert headshots
|   |   +-- partners/           # Partner logos
|   |   +-- methodology/        # Engine screenshots
|   |   +-- hero/               # Hero imagery
|   +-- fonts/                  # Self-hosted Merriweather, Inter
|
+-- src/
|   +-- app/                    # PAGES (App Router)
|   |   +-- layout.tsx          # Root layout: HTML head, fonts, Header, Footer
|   |   +-- page.tsx            # Homepage
|   |   +-- policy-briefs/
|   |   |   +-- page.tsx        # Briefs library (filterable grid)
|   |   +-- methodology/
|   |   |   +-- page.tsx        # Methodology & Engine
|   |   +-- experts/
|   |   |   +-- page.tsx        # Our Experts
|   |   +-- contact/
|   |       +-- page.tsx        # Contact form
|   |
|   +-- components/             # REUSABLE UI COMPONENTS
|   |   +-- layout/
|   |   |   +-- Header.tsx      # Nav bar with logo + 5 links
|   |   |   +-- Footer.tsx      # Footer with links, copyright, newsletter
|   |   |   +-- Container.tsx   # Max-width centered wrapper
|   |   +-- ui/
|   |   |   +-- Button.tsx      # Primary/secondary CTA buttons
|   |   |   +-- Card.tsx        # Generic card (used for briefs, experts)
|   |   |   +-- SectionHeading.tsx
|   |   |   +-- StatBlock.tsx   # Single stat with number + label
|   |   |   +-- Tag.tsx         # Filter tag / category pill
|   |   +-- home/
|   |   |   +-- Hero.tsx        # Hero banner with CTA buttons
|   |   |   +-- PillarCards.tsx  # Three pillars section
|   |   |   +-- FeaturedBrief.tsx # Featured weekly brief highlight
|   |   |   +-- StatsStrip.tsx  # Rotating/static stats bar
|   |   |   +-- PartnerLogos.tsx # Logo grid
|   |   +-- briefs/
|   |   |   +-- BriefCard.tsx   # Single brief card
|   |   |   +-- BriefGrid.tsx   # Grid layout of brief cards
|   |   |   +-- BriefFilter.tsx # Client-side filter controls ('use client')
|   |   +-- experts/
|   |   |   +-- ExpertCard.tsx  # Single expert profile card
|   |   +-- contact/
|   |       +-- ContactForm.tsx # Formspree form ('use client')
|   |       +-- NewsletterSignup.tsx # Email signup ('use client')
|   |
|   +-- lib/                    # DATA ACCESS & UTILITIES
|   |   +-- content.ts          # Functions to read JSON from /content/
|   |   +-- types.ts            # TypeScript interfaces for all content
|   |   +-- constants.ts        # Site-wide constants (colors, URLs)
|   |
|   +-- styles/
|       +-- globals.css         # Tailwind directives, custom CSS, font-face
```

## Component Boundaries

### Boundary Rules

1. **Pages import from `lib/content.ts`** to load data at build time. Pages are Server Components by default.
2. **Components receive data as props.** They never import from `lib/content.ts` directly.
3. **Only components needing interactivity use `'use client'`:** BriefFilter, ContactForm, NewsletterSignup. Everything else stays as Server Components.
4. **Layout components (Header, Footer) are shared** via `app/layout.tsx`. They do not re-render per page.

### Component Dependency Map

| Component | Depends On | Data Source | Client/Server |
|-----------|-----------|-------------|---------------|
| `app/layout.tsx` | Header, Footer | site.json (nav links) | Server |
| `app/page.tsx` (Home) | Hero, PillarCards, FeaturedBrief, StatsStrip, PartnerLogos | site.json, briefs/*.json (latest) | Server |
| `app/policy-briefs/page.tsx` | BriefGrid, BriefFilter | briefs/*.json (all) | Server (page), Client (filter) |
| `app/methodology/page.tsx` | SectionHeading, Container | methodology.json | Server |
| `app/experts/page.tsx` | ExpertCard | experts.json | Server |
| `app/contact/page.tsx` | ContactForm, NewsletterSignup | none (forms only) | Client components |
| BriefFilter | Tag, BriefCard | Props from parent | Client |
| ContactForm | Button | Formspree API | Client |
| NewsletterSignup | Button | External API | Client |

## Data Flow

### Build-Time Data Pipeline

```
1. `content/briefs/001-amr-governance.json`  -+
2. `content/briefs/002-financing-models.json`  |---> lib/content.ts
   ...                                         |     getAllBriefs()
15. `content/briefs/015-digital-surveillance.json` +  getBriefBySlug()
                                                      getFeaturedBrief()
                                                          |
                                                          v
                                               Page components call these
                                               functions at build time.
                                               Data is embedded in HTML.
```

### Key Data Access Functions (`lib/content.ts`)

```typescript
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Read all brief JSON files, sorted by number
export function getAllBriefs(): Brief[] {
  const briefDir = path.join(CONTENT_DIR, 'briefs');
  const files = fs.readdirSync(briefDir).filter(f => f.endsWith('.json'));
  return files
    .map(f => JSON.parse(fs.readFileSync(path.join(briefDir, f), 'utf-8')))
    .sort((a, b) => a.number - b.number);
}

// Read site-wide content
export function getSiteContent(): SiteContent {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, 'site.json'), 'utf-8')
  );
}

// Read expert profiles
export function getExperts(): Expert[] {
  return JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, 'experts.json'), 'utf-8')
  );
}
```

**Why `fs` instead of fetch:** Static export means these run only at build time on the Node.js build server. Using `fs` to read local JSON is simpler, faster, and has zero runtime dependencies. No API needed.

### Client-Side Data Flow (Filtering)

```
BriefGrid (Server)
  |-- renders all 15 brief cards into HTML at build
  |-- passes full briefs array as JSON prop to:
  |
  BriefFilter (Client, 'use client')
    |-- receives all briefs as prop
    |-- manages filter state (useState)
    |-- filters array client-side
    |-- renders visible BriefCard components
```

The full brief dataset (15 items, roughly 10-15KB JSON) is small enough to embed entirely in the page HTML. No pagination or lazy loading needed.

### Form Submission Flow

```
ContactForm ('use client')
  |-- User fills form
  |-- onSubmit: POST to https://formspree.io/f/{form_id}
  |-- Show success/error state
  |-- No server-side processing
```

## Content Schema (TypeScript Interfaces)

```typescript
// src/lib/types.ts

export interface Brief {
  number: number;               // 1-15
  slug: string;                 // "amr-governance"
  title: string;                // "AMR Governance Frameworks"
  summary: string;              // 150-word summary
  keyMessages: string[];        // 5-7 bullet points
  category: BriefCategory;      // For filtering
  pdfFilename: string;          // "brief-001.pdf" (in /public/pdfs/)
  howToApply: string;           // Practical steps paragraph
  publishedDate: string;        // ISO date string
  featured: boolean;            // true for the current featured brief
  coverImage?: string;          // Optional thumbnail
}

export type BriefCategory =
  | 'governance'
  | 'financing'
  | 'surveillance'
  | 'stewardship'
  | 'one-health'
  | 'digital';

export interface Expert {
  name: string;
  title: string;
  organization: string;
  bio: string;                  // 200-word bio
  photo: string;                // Path in /public/images/experts/
  specialties: string[];
}

export interface SiteContent {
  hero: {
    headline: string;
    subtext: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
  stats: Array<{ value: string; label: string }>;
  pillars: Array<{ title: string; description: string; icon: string }>;
  partners: Array<{ name: string; logo: string; url?: string }>;
  featuredBriefSlug: string;    // Points to which brief to feature
}

export interface MethodologyContent {
  title: string;
  sections: Array<{
    heading: string;
    body: string;
    screenshot?: string;        // Path in /public/images/methodology/
  }>;
}
```

## Content Update Workflow (Non-Developer)

This is the most architecturally important decision for this project. Content editors update JSON files and trigger a rebuild.

### Option A: Edit JSON in GitHub (Recommended)

```
Content editor                 GitHub                    Vercel
    |                            |                         |
    +-- Edit brief JSON -------->|                         |
    |   via github.com UI        |                         |
    |   (pencil icon on file)    +-- Push triggers ------->|
    |                            |   webhook               |
    |                            |                         +-- next build
    |                            |                         |   (2-3 min)
    |                            |                         |
    |<----- Live on site --------+---------<---------------+
```

**Why this works for weekly updates:**
- GitHub web editor handles JSON fine for small edits
- No local dev environment needed
- Every edit creates a commit (version history for free)
- Vercel auto-deploys on push to main
- Rollback = revert commit in GitHub

**Adding a new brief (weekly workflow):**
1. Navigate to `content/briefs/` in GitHub
2. Click "Add file" > "Create new file"
3. Name it `016-new-topic.json`
4. Paste from template, fill in content
5. Upload PDF to `public/pdfs/` via GitHub
6. Update `site.json` `featuredBriefSlug` if this is the new featured brief
7. Commit -- Vercel rebuilds automatically

### Option B: Headless CMS (Not recommended for this scale)

A CMS like Sanity or Contentful adds complexity that is not justified for:
- 3 content editors at most
- 15 briefs growing by 1/week
- 3 expert profiles rarely changing
- Simple flat data (no relations, no nested content)

If the team grows past 5 editors or content exceeds 100 items, revisit this decision.

## Patterns to Follow

### Pattern 1: Server Components by Default

**What:** Every component is a Server Component unless it needs `useState`, `useEffect`, `onClick`, or browser APIs.

**When:** Always. Only add `'use client'` when you must.

**Why:** Smaller JavaScript bundles. Critical for users on lower-bandwidth African networks.

**Result for this site:** Only 3 client components: BriefFilter, ContactForm, NewsletterSignup. Everything else ships zero JS.

### Pattern 2: Content Layer Separation

**What:** All content lives in `/content/` as plain JSON. No content hardcoded in components.

**When:** Any text, data, or copy that might change.

**Why:** Non-developers can update content without touching React code. Also enables future CMS migration if needed -- just change `lib/content.ts` to fetch from API instead of `fs`.

### Pattern 3: Colocation of Page-Specific Components

**What:** Components used by only one page live in a named subdirectory under `components/` matching the page name.

**When:** Component is only used on one page (e.g., `Hero` only on homepage).

**Why:** Makes it obvious which components belong to which page. Easier to delete or refactor a page.

### Pattern 4: Static Image Optimization

**What:** Since `next/image` with optimization is not available in static export mode, use standard `<img>` tags with pre-optimized images.

**When:** All images in the project.

**How:**
- Pre-optimize all images before committing (WebP format, appropriate dimensions)
- Use responsive `srcset` manually or via a build script
- Partner logos: SVG preferred, PNG fallback at 2x resolution
- Expert photos: 400x400px WebP
- Hero images: 1920px wide WebP with a 768px mobile variant

**Confidence note:** MEDIUM -- Next.js static export image handling has evolved. Verify whether `next/image` with `unoptimized: true` is sufficient or if manual optimization is needed. Check `next.config.js` `images` config for static export in the version used.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using API Routes

**What:** Creating `app/api/` routes for form handling or data fetching.

**Why bad:** `output: 'export'` does not support API routes. The build will fail silently or the routes will simply not exist in the output.

**Instead:** Use external services (Formspree for forms, client-side fetch to external APIs).

### Anti-Pattern 2: Dynamic Routes Without generateStaticParams

**What:** Using `[slug]` routes without exporting `generateStaticParams`.

**Why bad:** Static export requires all routes to be known at build time. Dynamic routes without `generateStaticParams` produce build errors.

**Instead:** If you add individual brief detail pages later (`/policy-briefs/[slug]`), you must export `generateStaticParams` that returns all slugs from the JSON files.

**Note:** For this 5-page site, individual brief pages are not in the initial scope. All brief content displays on the library page via cards. This avoids this issue entirely.

### Anti-Pattern 3: Hardcoding Content in JSX

**What:** Writing brief summaries, expert bios, or stats directly in component files.

**Why bad:** Forces a developer to make every content change. Defeats the weekly-update-by-non-developer goal.

**Instead:** Every piece of changeable content comes from `/content/*.json` files.

### Anti-Pattern 4: Heavy Client-Side State Management

**What:** Using Redux, Zustand, or Context for managing brief filter state.

**Why bad:** Massive overkill. There are 15 briefs with one filter dimension (category). A single `useState` in BriefFilter handles this.

**Instead:** Local component state with `useState`. If filter state needs to survive page navigation, use URL search params (`useSearchParams`).

## Build Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // Required for static export
  },
  // Trailing slashes produce cleaner static paths
  trailingSlash: true,
};

module.exports = nextConfig;
```

### Build Output

Running `next build` produces an `out/` directory:

```
out/
+-- index.html              # Homepage
+-- policy-briefs/
|   +-- index.html          # Briefs library
+-- methodology/
|   +-- index.html          # Methodology page
+-- experts/
|   +-- index.html          # Experts page
+-- contact/
|   +-- index.html          # Contact page
+-- _next/
|   +-- static/             # CSS, JS bundles, fonts
+-- pdfs/                   # Copied from public/
+-- images/                 # Copied from public/
```

This `out/` directory deploys directly to any static host. Vercel handles this automatically.

## Suggested Build Order

Dependencies flow top-down. Build in this order:

```
Phase 1: Foundation
  +-- Project scaffold (next.config, tailwind, fonts, globals.css)
  +-- TypeScript types (lib/types.ts)
  +-- Content layer (lib/content.ts + sample JSON files)
  +-- Layout shell (Header, Footer, Container, root layout.tsx)
      |
      | Foundation must exist before any page can render.
      v
Phase 2: Homepage
  +-- Hero component
  +-- PillarCards component
  +-- StatsStrip component
  +-- PartnerLogos component
  +-- FeaturedBrief component (depends on brief content schema)
  +-- Wire together in app/page.tsx
      |
      | Homepage proves the design system works.
      | Every UI primitive (Button, Card, SectionHeading) gets
      | created here and reused on later pages.
      v
Phase 3: Policy Briefs Library
  +-- BriefCard component (reuses Card, Tag from Phase 2)
  +-- BriefGrid component
  +-- BriefFilter component ('use client', filtering logic)
  +-- Populate all 15 brief JSON files
  +-- Upload all PDFs to public/pdfs/
      |
      | This is the most complex page and the primary content
      | update target. Must be solid before launch.
      v
Phase 4: Remaining Pages
  +-- Methodology page (static content, screenshots)
  +-- Experts page (ExpertCard, 3 profiles)
  +-- Contact page (ContactForm + Formspree, NewsletterSignup)
      |
      | These are straightforward pages reusing established
      | patterns. Can be built in parallel.
      v
Phase 5: Polish & Deploy
  +-- SEO metadata (per-page title, description, og:image)
  +-- Favicon and manifest
  +-- 404 page
  +-- Performance audit (Lighthouse)
  +-- Vercel deployment configuration
  +-- Content editor documentation (how to update briefs)
```

### Build Order Rationale

1. **Foundation first** because every page depends on layout, types, and content access.
2. **Homepage second** because it establishes the visual design system. Every reusable component (Button, Card, SectionHeading, StatBlock) gets built here and reused later. It is also the highest-traffic page.
3. **Briefs library third** because it is the most complex page (client-side filtering) and the core content update mechanism. Getting this right early means the weekly update workflow can be tested before launch.
4. **Remaining pages fourth** because they are simple static pages reusing existing components. They have no dependencies on each other and can be built in parallel.
5. **Polish last** because SEO, performance tuning, and deployment config should not block content development.

## Scalability Considerations

| Concern | At 15 briefs (launch) | At 50 briefs (year 1) | At 200+ briefs |
|---------|----------------------|----------------------|----------------|
| Build time | < 30 seconds | < 45 seconds | ~2 minutes |
| Filter performance | Instant (all client-side) | Fine (small dataset) | Add search, pagination |
| Content management | GitHub JSON editing | Still fine | Consider headless CMS |
| Page weight | ~50KB per page | Same (only library page grows) | Paginate brief list |
| Deployment | Vercel free tier | Vercel free tier | Still free tier |

This architecture handles 10x growth without changes. At 200+ briefs, add pagination to the library page and consider individual brief detail pages (`/policy-briefs/[slug]`).

## Sources

- Next.js App Router and static export documentation (next.js.org/docs) -- HIGH confidence
- Established patterns from Next.js static site community -- HIGH confidence
- Formspree integration patterns -- HIGH confidence
- Image optimization in static export: MEDIUM confidence (verify `images.unoptimized` behavior in the specific Next.js version used)
