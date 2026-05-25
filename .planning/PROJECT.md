# gghnStarr

## What This Is

gghnStarr is the official web platform for the GGHN STARR Africa AMR Modeling Initiative — a public-facing AMR campaign and intelligence platform targeting general public, healthcare workers, and policymakers across Africa. It publishes a weekly policy brief series (March–June 2026), hosts interactive data tools and an AMR awareness hub, and drives action toward the 5th Inter-Ministerial Conference on Health & AMR (June 28, 2026).

## Core Value

A credible, authoritative platform where African health policymakers can find and download the latest AMR policy briefs — fast, on mobile, without friction.

## Current Milestone: v2.0 — Campaign & Action Platform

**Goal:** Transform the policy intelligence platform into a full public-facing AMR campaign site with audience-segmented engagement, interactive data tools, a news feed, an awareness hub, and a Take Action page — all aligned to the official AMR brand identity.

**Target features:**
- Brand rebrand: align site colors and logo to AMR brand (green/gold palette from AMR Logo_Feb2026.jpeg)
- Publish remaining 12 policy briefs (content exists in resources/)
- GA4 analytics integration
- Audience-segmented CTAs on homepage
- Awareness hub — infographics and explainers page
- Education library — audience-specific materials (minister, clinician, public)
- News section — automated daily feed from arXiv + PubMed via GitHub Actions
- Interactive AMR data map — choropleth using WHO GLASS CSV data already in repo
- Take Action page — pledge form (Formspree), prescribing commitments, advocacy toolkit downloads
- Interactive practical tools — stewardship checklists, self-assessment quizzes, facility reporting templates
- Social share buttons on briefs and news articles
- Accessibility audit + WCAG AA fixes

## Requirements

### Validated (v1.0 — shipped 2026-04-23)

- ✓ Homepage with hero, conference badge, 3 pillars, featured brief, stats strip, partner logos, newsletter signup — Phase 2
- ✓ Policy Briefs Library — filterable grid, PDF + infographic downloads — Phase 3
- ✓ Brief detail pages with OG/Twitter meta tags for WhatsApp sharing — Phases 3, 5
- ✓ Methodology page (SEIR/ML/Bayesian, NIPAD, GlobalPPS) — Phase 4
- ✓ Experts page (3 expert profiles) — Phase 4
- ✓ Contact page (Formspree form) — Phase 4
- ✓ SEO foundation — sitemap.xml, robots.txt, print CSS — Phase 5
- ✓ Newsletter signup (Google Apps Script) — Phase 2
- ✓ Mobile-first responsive design — Phase 1
- ✓ Vercel deployment via static Next.js export — Phase 1
- ✓ Non-developer content workflow (JSON + PDF commit) — Phase 3

### Active (v2.0 — building now)

- [ ] Site color palette and logo aligned to AMR brand identity (green/gold/grey from AMR Logo_Feb2026.jpeg)
- [ ] AMR logo displayed in Header and Footer
- [ ] All 15 policy briefs published in the briefs library (12 remaining as JSON + PDF entries)
- [ ] Google Analytics 4 integrated across all pages
- [ ] Homepage has audience-segmented CTAs routing ministers, clinicians, and public to relevant sections
- [ ] Awareness hub page with infographics, explainers, and downloadable fact sheets
- [ ] Education library page with materials filterable by audience type (minister, healthcare worker, public)
- [ ] News section with automated daily feed from arXiv and PubMed APIs via GitHub Actions
- [ ] Interactive AMR data map (choropleth) using WHO GLASS CSV data showing resistance rates by country
- [ ] Take Action page with pledge form, prescribing commitment form, and advocacy toolkit downloads
- [ ] Interactive stewardship checklist web tool with printable output
- [ ] Self-assessment quiz with scored results and downloadable recommendations
- [ ] Facility reporting template tool with form-fill and PDF export
- [ ] Social share buttons (native Web Share API + platform links) on brief detail and news pages
- [ ] Accessibility audit completed and WCAG AA issues fixed

### Out of Scope

- Community of Practice Forum — high complexity, requires authentication, deferred to v3.0
- Country Dashboards (live scoring) — requires live data integration, deferred to v3.0
- Partner Portal — requires authentication and secure document exchange, deferred to v3.0
- Monitoring & Accountability Dashboard (RAG scoring) — requires live data, deferred to v3.0
- R/Shiny dashboard embeds — performance/security constraint, excluded
- Authentication/login — fully public site
- Google Scholar scraping — no official API, SerpAPI cost not approved; arXiv + PubMed only
- Google Fonts — removed in Phase 5 for performance; system fonts remain

## Context

- v1.0 shipped April 23, 2026. All 5 phases complete and verified on Vercel.
- Original vision was a 13-page site (MASTER_Website_Implementation_Document.md). v1.0 built 5 pages. v2.0 adds 8+ new sections/pages from the original 13-page spec.
- AMR logo (AMR Logo_Feb2026.jpeg) exists in resources/ but was never integrated. Crisp, professional: Africa map silhouette + "AntiMicrobial Resistance" wordmark, green/gold/grey palette.
- Color conflict: v1.0 used Navy #0F172A + Teal #0D9488 (Design Spec). AMR logo and MASTER doc use Deep Blue #003B73 + Emerald Green #0F8A5F + Gold #F2A900. Decision: align to logo palette.
- WHO GLASS CSV data already in resources/: time series resistance data 2018–2023 by country/pathogen/antibiotic (ISO3 codes). Powers the choropleth map without external API or cost.
- research.ipynb shows GLASS enrollment data from Our World In Data — additional layer for map.
- 15 brief drafts exist in resources/Mercy_s Briefs/Drafts for review/. Only 3 published. 12 ready to add.
- 3 infographic JPEGs (IMG_9750-9752) from Fleming Fund Rwanda folder available for awareness hub.
- Sample website PDFs in Website sample 1/ show reference AMR campaign site: Be AMR Aware, Campaign, Stories, Webinars, Resources pages — design reference for v2.0 pages.
- Hard deadline: June 28, 2026 (5th Inter-Ministerial Conference). ~61 days from milestone start.
- Target audiences for v2.0: general public, healthcare workers (prescribers), policymakers (ministers, DGs).

## Constraints

- **Architecture**: Static site (Next.js static export) — no server-side runtime, no database
- **News scraper**: GitHub Actions cron job only — writes JSON to repo, triggers Vercel rebuild
- **Forms**: Formspree — contact, pledge, and commitment forms (no custom backend)
- **Hosting**: Vercel
- **Performance**: Mobile-first; usable in low-bandwidth African contexts
- **Access**: Fully public — no authentication required on any page
- **Fonts**: System fonts only (Google Fonts removed in Phase 5 for performance)
- **Deadline**: All v2.0 features live before June 28, 2026

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 5-page scope over 13-page vision (v1.0) | Focused scope achievable before June 28 deadline | ✓ Good — shipped on time |
| Next.js static export + Tailwind | Good ecosystem, easy Vercel deployment | ✓ Good |
| System fonts only | Bandwidth constraint for African users; Google Fonts removed Phase 5 | ✓ Good |
| JSON/MDX-based content for briefs | Non-developers can add weekly briefs without code changes | ✓ Good |
| Formspree for contact form | No backend needed on a static site | ✓ Good |
| Design Spec colors (Navy/Teal) over MASTER doc colors | Cleaner contrast for data-dense content | ⚠️ Revisit — overriding with AMR logo green/gold palette in v2.0 |
| Align to AMR logo green/gold palette (v2.0) | Logo asset exists, brand consistency required; logo colors differ from v1.0 | — Pending |
| News: GitHub Actions + arXiv/PubMed only | Google Scholar has no official API; SerpAPI cost not approved | — Pending |
| Data map: Interactive choropleth from GLASS CSV | Data already in repo — no external API, no cost | — Pending |
| Tools: Interactive web components | Higher engagement than static downloads for target audiences | — Pending |

---
*Last updated: 2026-05-25 — Phase 21 complete: Tools Directory live at /tools-directory — searchable, filterable catalog of 50 One Health tools with free-text search and three chip-filter dimensions*
