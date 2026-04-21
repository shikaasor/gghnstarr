# Project Research Summary

**Project:** gghnStarr — GGHN STARR Africa AMR Modeling Initiative Website
**Domain:** Policy brief publishing website (static site, government/health sector audience)
**Researched:** 2026-03-23
**Confidence:** MEDIUM (stack version confidence LOW; architecture and pitfalls HIGH)

## Executive Summary

The GGHN STARR AMR website is a 5-page static policy publishing site targeting African Ministers of Health, Permanent Secretaries, and Directors-General. The appropriate expert approach is a Next.js 15 App Router project configured with `output: 'export'` (fully static HTML generation, no runtime server), deployed on Vercel with automatic redeploy on git push. Content is managed as structured JSON files and pre-authored PDFs committed directly to the repository, with GitHub's web UI as the intended interface for non-technical content editors who must add one policy brief per week. The audience is high-formality, mobile-first, bandwidth-constrained, and PDF-dependent — design decisions must optimize for credibility signals, fast load times on 3G networks, and frictionless PDF delivery.

The recommended approach prioritizes simplicity over sophistication at every layer. The stack is intentionally minimal: Next.js + TypeScript + Tailwind CSS v4 for the site itself, gray-matter for content loading, @formspree/react for the contact form, and static PDF files in `/public/`. No CMS, no component library, no animation library, no i18n. The content architecture — a central `briefs-index.json` as the single source of truth, with individual MDX files for body content and matching PDFs in `/public/` — supports the weekly update workflow without requiring developer intervention once the system is built. The entire brief library is loaded at build time and embedded in HTML; client-side filtering using a single `useState` handles discovery.

The dominant risk is not technical but operational: if the non-developer content workflow is difficult, content updates stall within weeks and the developer becomes a permanent bottleneck. This must be treated as a first-class design constraint, not an afterthought. Secondary risks are static-export-specific: Next.js `next/image` fails without `unoptimized: true`, dynamic routes require `generateStaticParams`, and any use of API routes, server actions, middleware, or ISR will break the build. Both categories of risk are fully preventable if the configuration is correct from day one and the content workflow is tested with a non-technical user before launch.

## Key Findings

### Recommended Stack

The project uses Next.js 15 App Router with static export as the core framework. TypeScript provides type safety for the content schema at build time, which is essential when non-developers are editing JSON files. Tailwind CSS v4 (CSS-first configuration, no `tailwind.config.js`) handles all styling; no UI component library is needed or warranted for a 5-page site. Content lives in JSON files read by `fs` at build time — no database, no CMS, no API. Forms are handled entirely by Formspree. The approach eliminates runtime infrastructure dependencies entirely.

**Core technologies:**
- **Next.js 15 (App Router, `output: 'export'`)**: Framework and static site generation — eliminates server costs, enables Vercel CDN delivery, App Router produces smaller client bundles
- **TypeScript 5.6**: Type safety for content schemas — catches JSON shape errors at build time before non-developer edits can cause runtime breakage
- **Tailwind CSS 4.0**: Styling — project requirement, CSS-first config, purges unused classes for small bundles
- **@next/mdx + gray-matter**: MDX body content + frontmatter parsing — simpler than next-mdx-remote for local file-based content; Contentlayer is abandoned and must not be used
- **@formspree/react**: Contact form — static-compatible, handles submission state; no server required
- **Static PDFs in `/public/briefs/`**: PDF delivery — pre-authored PDFs served as plain downloads, no runtime PDF generation needed
- **next-sitemap**: Sitemap generation — auto-updates as briefs are added, improves brief discoverability
- **lucide-react + clsx + tailwind-merge**: UI utilities — tree-shakeable icons, conditional class helpers

**What NOT to use:** Contentlayer (abandoned), next-mdx-remote (overkill for local files), any headless CMS (over-engineering for 15 items), Framer Motion (animation weight for a policy audience), Chakra UI / shadcn/ui (unnecessary for a 5-page site), react-pdf (PDFs are pre-authored, not generated).

### Expected Features

The target audience (African government officials and their technical advisors) evaluates credibility within seconds and accesses content primarily on mobile devices over variable bandwidth. The site must project institutional seriousness, deliver PDFs frictionlessly, and load fast.

**Must have (table stakes):**
- Institutional branding and partner logos — credibility is assessed in seconds; logos from GGHN, WHO, partner universities are non-negotiable
- PDF download for every brief — officials print, email, and share in physical meetings; PDF is the policy communication standard
- Mobile-first responsive layout targeting < 500KB total page weight and < 3s first paint on 3G
- Brief metadata display: brief number, date, authors, topic, "Key takeaway" summary on the card
- Contact mechanism via Formspree form — minimum viable communication channel
- Expert credibility signals: photo, name, title, institutional affiliation for each expert
- HTTPS, accessible color contrast (WCAG AA minimum)
- Open Graph meta tags per page — officials share URLs on WhatsApp; bare links without preview images lose impact

**Should have (differentiators):**
- Visual brief cards with infographic thumbnails — transforms a list of PDFs into a scannable collection
- Separate infographic download per brief — standalone graphics are more shareable in WhatsApp groups and ministerial presentations than full PDFs
- Client-side filtering by month and category — becomes valuable once 5+ briefs exist
- Stats strip ("X countries covered, Y briefs published") — quantified impact signals seriousness
- Methodology transparency page — modeling-based policy work must show data sources, model description, limitations, validation to be trusted by technical leads
- Print-friendly CSS (`@media print`) — some officials print directly from the browser

**Defer (v2+):**
- Multi-language support (2-3x content management burden; English is the AU policy working language)
- Interactive data dashboards (data pipeline maintenance burden; use static screenshots for v1)
- Newsletter email list integration (GDPR complexity, ongoing management burden)
- User authentication (contradicts public dissemination mission; government officials will not create accounts)
- Blog/news section (scope creep; the briefs are the content stream)
- Search functionality (15 briefs with tag filtering is sufficient; search is overkill)

### Architecture Approach

The site is a pure static Next.js App Router build. Pages are Server Components that call `lib/content.ts` functions at build time to read JSON from `content/`. Data is embedded in generated HTML. Only three components require `'use client'`: `BriefFilter` (category filtering), `ContactForm`, and `NewsletterSignup`. Everything else ships zero JavaScript. The content layer is fully separated: all changeable text lives in JSON files, never hardcoded in components. This enables non-developer edits via GitHub web UI without touching React code.

**Major components:**
1. **`lib/content.ts`**: Data access layer — reads `briefs-index.json`, `experts.json`, `site.json`, `methodology.json` using `fs` at build time; exports typed functions (`getAllBriefs`, `getExperts`, `getSiteContent`)
2. **`lib/types.ts`**: TypeScript interfaces for `Brief`, `Expert`, `SiteContent`, `MethodologyContent` — the content schema contract that catches malformed JSON at build time
3. **Layout shell (`app/layout.tsx`, `Header`, `Footer`, `Container`)**: Shared across all 5 pages; establishes navigation, branding, and max-width constraints
4. **Briefs library (`BriefCard`, `BriefGrid`, `BriefFilter`)**: Core content delivery — `BriefFilter` is the only client component on this page, receiving all briefs as a prop and filtering in memory
5. **Static asset pipeline (`public/briefs/*.pdf`, `public/images/`)**: Pre-optimized WebP images committed to repo; `unoptimized: true` in `next.config.js`; PDFs served as plain file downloads

**Content update workflow:** Non-developers edit JSON in GitHub's web UI, commit to `main`, and Vercel auto-deploys in 1-3 minutes. No local dev environment needed. Every commit is version-controlled. Rollback = revert commit.

### Critical Pitfalls

1. **Image loader not configured for static export** — Set `images: { unoptimized: true }` in `next.config.js` from day one. Without this, the build fails on every `<Image>` component. Do not discover this in Phase 2.

2. **Non-developer content workflow becomes a bottleneck** — The developer-built system will fail within 2-3 weeks if the JSON editing workflow is too difficult for non-technical content authors. Design a flat, maximally forgiving JSON schema. Test the workflow with an actual non-developer before launch. Consider a build-time JSON validator with human-readable error messages. This is the single highest-risk item for this project.

3. **Dynamic routes missing `generateStaticParams`** — Static export requires all routes enumerated at build time. Any `[slug]` route without `generateStaticParams` causes a build failure. Set `export const dynamicParams = false` in dynamic routes. Note: initial scope has no dynamic brief detail pages; this only applies if individual brief pages are added later.

4. **Vercel auto-deploy not configured** — Without Vercel's GitHub integration, content editors will commit changes that never appear on the live site. This must be configured in Phase 1, not treated as a post-launch concern.

5. **Tailwind class names constructed dynamically get purged** — Never use template literals to construct class names (e.g., `` `bg-${category}-500` ``). Use a static mapping object instead. Dynamic class names are purged by Tailwind's JIT compiler and will be missing in production while appearing fine in development.

## Implications for Roadmap

Based on the combined research, the architecture's own build order suggestion aligns well with feature dependencies and pitfall prevention. The recommended phase structure is:

### Phase 1: Foundation and Infrastructure

**Rationale:** Every subsequent phase depends on correct `next.config.js` configuration, the TypeScript content schema, the content loading functions, and the shared layout. Building these first prevents the most critical pitfalls from appearing in later phases. Vercel deployment must be configured here, not after content is built.

**Delivers:** Working skeleton site deployed on Vercel with correct static export configuration, Tailwind v4 setup with brand tokens, layout shell (Header, Footer, Container), TypeScript type definitions for all content, `lib/content.ts` functions, and sample JSON content files. Vercel auto-deploy on push to `main` confirmed working.

**Addresses:** Institutional branding, navigation structure, HTTPS (via Vercel)

**Avoids:** Image loader build failures (#1), unsupported Next.js features (#9), forgotten auto-deploy (#5), trailing slash 404s (#11)

**Research flag:** Standard patterns — well-documented Next.js static export setup, skip phase research.

### Phase 2: Homepage and Design System

**Rationale:** The homepage is the highest-traffic page and establishes every reusable UI primitive (Button, Card, SectionHeading, StatBlock, Tag). Building it second means all subsequent pages reuse proven components rather than building them ad hoc.

**Delivers:** Full homepage with Hero, PillarCards, StatsStrip, PartnerLogos, FeaturedBrief components. All reusable UI primitives established. Design system (typography, color tokens, spacing) locked in.

**Addresses:** Institutional branding, partner logos, stats strip, mobile-first responsive layout

**Avoids:** Hardcoded content in JSX (#3 anti-pattern) — all copy comes from `site.json`

**Research flag:** Standard patterns — skip phase research.

### Phase 3: Policy Briefs Library (Core Content Delivery)

**Rationale:** The briefs library is the site's primary value. It is the most complex page (client-side filtering), the weekly update target, and the critical path for the weekly brief cadence. Getting it right — including the non-developer update workflow — before launch is essential.

**Delivers:** BriefCard, BriefGrid, BriefFilter components. Full `briefs-index.json` schema with all required fields. Client-side category filtering via `useState`. PDF download buttons. Infographic download buttons. All 15 brief JSON entries populated (or as many as exist at launch). Non-developer content guide written and tested.

**Addresses:** PDF downloads, brief metadata display, key takeaway summaries on cards, filtering, visual thumbnails, infographic downloads

**Avoids:** Non-developer bottleneck (#3) — workflow tested with actual content author before this phase closes; JSON validation errors (#12) — build-time schema validation with human-readable errors; missing image files (#13) — build-time existence check for referenced image paths; PDF repo bloat (#4) — Git LFS configured or external hosting decision made

**Research flag:** Needs attention on content workflow design — no single "right" answer; test with actual non-developer user.

### Phase 4: Supporting Pages

**Rationale:** Methodology, Experts, and Contact pages are straightforward static pages reusing components built in Phases 2-3. They can be built in parallel and have no dependencies on each other.

**Delivers:** Methodology page (data sources, model description, limitations, validation, dashboard screenshots). Experts page (ExpertCard with photo, name, title, affiliation, bio). Contact page (Formspree form, fallback email display). Newsletter signup integration (provider chosen in Phase 1).

**Addresses:** Expert credibility signals, methodology transparency, contact mechanism, newsletter (if scoped)

**Avoids:** Formspree silent failures (#6) — test on production URL, not localhost; newsletter backend missing (#10) — provider must be chosen before Phase 4 begins

**Research flag:** Standard patterns — skip phase research.

### Phase 5: Polish, SEO, and Launch Readiness

**Rationale:** SEO, performance auditing, and deployment configuration should not block content development. They are final-pass work once all content is in place.

**Delivers:** Per-page `generateMetadata` with OG tags, Twitter Cards, and per-brief OG images (infographic serves as OG image). `next-sitemap` generating `sitemap.xml` and `robots.txt`. Favicon and web manifest. Custom 404 page. Lighthouse performance audit (target: mobile score > 85, LCP < 2.5s on 3G, total weight < 500KB). Social sharing tested via WhatsApp and Facebook debugger.

**Addresses:** OG meta tags, print stylesheet, SEO discoverability

**Avoids:** SEO metadata missing (#14) — per-brief OG images and descriptions required; mobile performance degradation (#7) — performance budget enforced before launch

**Research flag:** Standard patterns — skip phase research.

### Phase Ordering Rationale

- **Foundation before everything**: `next.config.js` with static export settings, TypeScript types, and the content layer are dependencies of every other phase. Configuring them correctly eliminates the most severe build-breaking pitfalls.
- **Homepage before briefs library**: Establishes reusable components and design system; avoids rebuilding primitives per page.
- **Briefs library is the critical path**: It is the primary value proposition, the most complex page, and the weekly update target. It must be built and workflow-tested before any brief publication deadline.
- **Supporting pages are parallel work**: They share no dependencies beyond the design system; they can be built concurrently with Phase 3 if team capacity allows.
- **Polish is last**: Premature SEO/performance work on a partially-built site is wasted effort. Do it once, do it right, do it last.

### Research Flags

Phases needing deeper research during planning:
- **Phase 3 (content workflow)**: The non-developer content update workflow has no single documented "right answer." The specific risk is that the workflow looks simple to a developer but is opaque to a non-technical user. Before finalizing the Phase 3 plan, prototype the workflow with an actual non-developer content author and observe where they get stuck.

Phases with standard patterns (skip `/gsd:research-phase`):
- **Phase 1 (Foundation)**: Next.js static export configuration is thoroughly documented in official docs.
- **Phase 2 (Homepage/Design System)**: Standard Next.js App Router component patterns.
- **Phase 4 (Supporting Pages)**: Formspree integration and simple static page patterns are well-documented.
- **Phase 5 (Polish/SEO)**: Next.js `generateMetadata` and `next-sitemap` have clear official documentation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Architecture and library choices are well-reasoned; specific version numbers should be verified with `npm view <pkg> version` before installing — research was done against training data. Tailwind v4 is newer (Jan 2025); v3 is an acceptable fallback if team is unfamiliar. |
| Features | MEDIUM | Patterns drawn from established policy publishing sites (WHO, Brookings, CGD, Africa CDC). Live site verification was not performed. Core feature set is well-established for this domain. |
| Architecture | HIGH | Next.js App Router static export is well-documented. Server Component boundaries, content layer separation, and build-time data access patterns are established community patterns with official documentation backing. |
| Pitfalls | HIGH | Next.js static export pitfalls verified against official Next.js 16.2.1 docs as of 2026-03-23. Workflow pitfalls (non-developer bottleneck) are based on established patterns rather than a single cited source. |

**Overall confidence:** MEDIUM-HIGH. The technical approach is sound and well-documented. The primary uncertainty is the non-developer content workflow, which requires validation with actual users rather than documentation research.

### Gaps to Address

- **Package versions**: All versions in STACK.md were from training data. Run `npm view next version`, `npm view tailwindcss version`, etc. before installing. The architecture is not version-sensitive but specific API surfaces may differ slightly.
- **Tailwind v4 vs v3 decision**: If the development team is unfamiliar with Tailwind v4's CSS-first configuration, switching to v3 (config-file approach) is a valid lower-risk choice. Make this decision explicitly before scaffolding.
- **Non-developer workflow validation**: The content update workflow (GitHub web UI JSON editing, PDF upload, commit triggers redeploy) needs to be tested with an actual non-technical team member in Phase 3 before the weekly brief publishing cadence begins. No documentation research can substitute for this test.
- **PDF hosting strategy**: For 15 PDFs (estimated 30-75 MB total), committing to `/public/briefs/` with Git LFS is acceptable for the March-June 2026 scope. If briefs continue beyond 15, external CDN hosting (Cloudflare R2 or similar) should be evaluated.
- **`next/image` static export behavior**: Research noted MEDIUM confidence on whether `images: { unoptimized: true }` is sufficient or if a custom loader is needed. Verify against the exact Next.js version used at scaffold time.
- **Newsletter provider**: Must be decided in Phase 1. Mailchimp free tier (500 contacts) or routing through Formspree with a hidden field are the two viable options for this scale. Deferring this decision blocks Phase 4.

## Sources

### Primary (HIGH confidence)
- Next.js App Router and Static Export official documentation (nextjs.org/docs) — static export configuration, unsupported features list, `generateStaticParams`, App Router patterns; verified 2026-03-23 against Next.js 16.2.1
- Next.js Image Component API reference (nextjs.org/docs/app/api-reference/components/image) — static export image handling; verified 2026-03-23
- Tailwind CSS v4 release blog (tailwindcss.com/blog/tailwindcss-v4) — CSS-first configuration, `@theme` directive
- Formspree React documentation (formspree.io/docs/react) — static site form handling

### Secondary (MEDIUM confidence)
- Established patterns from Next.js static site community — Server Component boundaries, content layer separation, `fs`-based build-time data access
- Domain expertise from policy publishing patterns (WHO, Brookings, CGD, Africa CDC, Chatham House, KEMRI-Wellcome Trust) — feature expectations, audience behavior, design conventions
- @next/mdx documentation (nextjs.org/docs/app/building-your-application/configuring/mdx) — MDX with App Router and static export

### Tertiary (LOW confidence)
- npm registry version numbers — all package versions should be verified with `npm view <pkg> version` before installation; research was done against training data with cutoff May 2025

---
*Research completed: 2026-03-23*
*Ready for roadmap: yes*
