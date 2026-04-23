# Roadmap: gghnStarr

## Overview

gghnStarr delivers a 5-page static policy brief publishing platform for the GGHN STARR Africa AMR Modeling Initiative. The build progresses from infrastructure through content delivery to launch readiness, with the briefs library as the critical path. Each phase delivers a complete, verifiable capability that builds on the previous one, culminating in a production-ready site well before the June 28, 2026 Inter-Ministerial Conference deadline.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Infrastructure** - Next.js static export scaffold, content data layer, layout shell, and Vercel deployment pipeline
- [x] **Phase 2: Homepage & Design System** - Full homepage with hero, pillars, featured brief, stats, partner logos, newsletter signup, and all reusable UI primitives
- [x] **Phase 3: Policy Briefs Library & Detail Pages** - Filterable brief cards grid, PDF/infographic downloads, individual brief detail pages, and the weekly content update workflow
- [x] **Phase 4: Supporting Pages** - Methodology, Experts, and Contact pages completing all 5 site pages (completed 2026-04-21)
- [ ] **Phase 5: SEO, Performance & Launch Readiness** - Meta tags, sitemap, Lighthouse audit, print styles, and production verification

## Phase Details

### Phase 1: Foundation & Infrastructure
**Goal**: A working skeleton site is deployed on Vercel with correct static export configuration, the content data layer is functional, and all 5 pages render within a shared layout shell
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04
**Success Criteria** (what must be TRUE):
  1. Running `next build` produces a fully static export with no errors and no server-side runtime dependencies
  2. Pushing a commit to `main` triggers a Vercel deployment that serves the site over HTTPS within minutes
  3. All 5 page routes (/, /briefs, /methodology, /experts, /contact) render within a shared Header/Footer layout shell
  4. Sample brief data can be loaded from JSON files via typed content functions (`getAllBriefs`, `getBriefBySlug`, `getExperts`, `getSiteContent`)
  5. PDF files are tracked by Git LFS (committing a PDF does not bloat repository history)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Git LFS config + Next.js scaffold with Tailwind v4 brand tokens and Vercel deployment
- [x] 01-02-PLAN.md — Content data layer: TypeScript interfaces, content functions, JSON seed data
- [x] 01-03-PLAN.md — Shared layout shell (Header, Footer, Container) and 5 page skeletons

### Phase 2: Homepage & Design System
**Goal**: A visitor landing on the homepage immediately sees institutional credibility signals, understands the initiative's three pillars, can access the current policy brief, and can sign up for the newsletter
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04
**Success Criteria** (what must be TRUE):
  1. Homepage displays a hero section with the Inter-Ministerial Conference badge, headline, and a CTA button that links to the latest brief
  2. Three pillars (Genomic Surveillance, Predictive Analytics, One Health Governance) are displayed as an icon grid below the hero
  3. The current week's featured brief shows its title, executive summary, and a working "Download PDF" button that delivers the PDF file
  4. Partner logos (GUCGHPI, Fleming Fund, Africa CDC, WHO AFRO) are visible on the homepage
  5. A visitor can enter their email into a newsletter signup form and submit it successfully
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md — Schema patches (featured flag, stats array), getFeaturedBrief(), and page.tsx orchestrator
- [x] 02-02-PLAN.md — HeroSection, ConferenceBadge (countdown timer), StatStrip, ThreePillars
- [x] 02-03-PLAN.md — FeaturedBrief section and PartnerLogos strip
- [x] 02-04-PLAN.md — NewsletterSignup with Google Apps Script integration and homepage visual verification

### Phase 3: Policy Briefs Library & Detail Pages
**Goal**: A policymaker can browse, filter, and download any published policy brief and its infographic, and can view a dedicated detail page for each brief with full metadata
**Depends on**: Phase 2
**Requirements**: BREF-01, BREF-02, BREF-03, BREF-04, BDET-01
**Success Criteria** (what must be TRUE):
  1. The briefs library page displays a grid of brief cards, each showing week/date, title, author, key takeaway, thumbnail image, and a "Download Full Brief (PDF)" button that delivers the correct PDF
  2. Each brief card has a separate "Download Infographic" button that delivers the 1-page infographic PDF
  3. A visitor can filter briefs by publication month and by policy theme, and filters can be combined to narrow results
  4. Clicking a brief navigates to an individual detail page at `/briefs/[slug]` showing full metadata, key messages, download buttons, and author bio excerpt
  5. A non-developer can add a new brief by editing JSON data files and committing PDFs, triggering a Vercel rebuild with the new brief appearing on the site
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — BriefCard + BriefGrid (filterable library) + briefs page.tsx
- [x] 03-02-PLAN.md — Brief detail page at /briefs/[slug] with generateStaticParams
- [x] 03-03-PLAN.md — CONTENT-GUIDE.md + Phase 3 visual verification checkpoint

### Phase 4: Supporting Pages
**Goal**: The remaining three content pages are complete -- a visitor can understand the modeling methodology, evaluate expert credentials, and contact the initiative
**Depends on**: Phase 2
**Requirements**: METH-01, EXPT-01, CONT-01
**Success Criteria** (what must be TRUE):
  1. The Methodology page explains the predictive modeling approach with sections for SEIR/ML/Bayesian models, the NIPAD platform (with static dashboard screenshot), and GlobalPPS/WHONET surveillance data
  2. The Experts page displays profile cards for all three experts with photo, name, title, institutional affiliation, and bio
  3. The Contact page has a working Formspree-powered form (Name, Title, Ministry/Organization, Country, Inquiry Type, Message) that successfully submits and shows confirmation
  4. A fallback email address is displayed on the Contact page for visitors with JavaScript disabled
**Plans**: 3 plans

Plans:
- [ ] 04-01-PLAN.md — Methodology page (tabbed client UI with SEIR/ML/Bayesian, NIPAD, GlobalPPS content + layout.tsx metadata)
- [ ] 04-02-PLAN.md — Experts page (experts.json update + ExpertCard component + experts page grid)
- [ ] 04-03-PLAN.md — Contact page (Formspree form + noscript fallback) + Phase 4 visual verification checkpoint

### Phase 5: SEO, Performance & Launch Readiness
**Goal**: The site is discoverable, shareable, performant on mobile/3G, and ready for production use by African health policymakers
**Depends on**: Phase 3, Phase 4
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. Sharing a brief detail page URL on WhatsApp shows a rich preview with the brief's title, description, and infographic thumbnail (Open Graph and Twitter Card meta tags working)
  2. A `sitemap.xml` and `robots.txt` are generated and include all brief detail page URLs
  3. Lighthouse mobile performance audit scores 85+ with LCP under 2.5s on simulated 3G and total page weight under 500KB
  4. Printing a brief detail page from the browser produces a clean, readable output without navigation chrome or broken layouts
**Plans**: 3 plans

Plans:
- [ ] 05-01-PLAN.md — Remove Google Fonts violation, add metadataBase + OG/Twitter meta tags to brief detail pages
- [ ] 05-02-PLAN.md — Create app/sitemap.ts + app/robots.ts + @media print CSS in globals.css
- [ ] 05-03-PLAN.md — next build verification + Lighthouse/WhatsApp/print human checkpoint

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5
(Phases 3 and 4 depend on Phase 2 but not on each other; Phase 5 depends on both 3 and 4.)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Infrastructure | 3/3 | Complete | 2026-03-27 |
| 2. Homepage & Design System | 4/4 | Complete | 2026-03-30 |
| 3. Policy Briefs Library & Detail Pages | 3/3 | Complete | 2026-04-01 |
| 4. Supporting Pages | 3/3 | Complete   | 2026-04-21 |
| 5. SEO, Performance & Launch Readiness | 2/3 | In Progress|  |
