# Phase 1: Foundation & Infrastructure - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the Next.js static export project, build the content data layer with TypeScript interfaces and JSON seed data, construct the shared Header/Footer/Container layout shell used by all 5 pages, and configure the Vercel deployment pipeline with Git LFS. Pages are functional skeletons — no page-level content built here.

</domain>

<decisions>
## Implementation Decisions

### Design Foundation
- Configure real Tailwind brand tokens (colors, spacing, typography) in Phase 1 — not deferred to Phase 2
- Derive brand colors from GGHN/STARR organizational materials (researcher should investigate GGHN visual identity)
- System fonts only — no Google Fonts or external font loading. Use system-ui / Georgia stack for optimal performance on constrained bandwidth (target audience: African policymakers on mobile)
- Dark mode supported from Phase 1 — configure Tailwind `dark:` variants and design tokens now so all subsequent phases can use them

### Content Data Schema
- Brief TypeScript interface fields: `slug`, `title`, `weekNumber`, `publicationDate`, `authorId` (reference to experts.json), `keyTakeaway`, `executiveSummary`, `keyMessages: string[]`, `pdfUrl`, `infographicPdfUrl`, `thumbnailUrl`, `themes: string[]`
- `themes` is a string array — briefs can belong to multiple policy themes (Governance, Laboratory Systems, Predictive Analytics, One Health, Stewardship)
- Author stored by reference: `authorId` links to a record in `experts.json` (single source of truth for bio/photo/affiliation)
- Seed `briefs-index.json` with 3 sample brief entries — enough to verify data layer and test grid layout in Phase 2+

### Layout Shell & Nav
- Header navigation: all 5 pages — Home, Briefs, Methodology, Experts, Contact
- Mobile header: hamburger menu with slide-out nav panel
- Container max-width: 1024px (`max-w-5xl`) — comfortable reading width for policy text
- Footer content: GGHN STARR branding + initiative tagline, partner acknowledgment line (Fleming Fund / Africa CDC / WHO AFRO), contact email + social/LinkedIn links
- Footer does NOT repeat the main navigation links

### Vercel & Deployment
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

</decisions>

<specifics>
## Specific Ideas

- System fonts prioritized explicitly for bandwidth-constrained mobile users in Africa — this is a hard requirement, not a preference
- Brand tokens must be set up in Phase 1 so Phase 2 (design system) builds on a real color/spacing foundation, not Tailwind defaults
- `authorId` reference pattern means experts.json is the canonical source — brief detail pages in Phase 3 will join across both files

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-and-infrastructure*
*Context gathered: 2026-03-25*
