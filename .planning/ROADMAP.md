# Roadmap: gghnStarr

## Milestones

- [x] **v1.0 Policy Intelligence Platform** — Phases 1-5 (shipped 2026-04-23)
- [ ] **v2.0 Campaign & Action Platform** — Phases 6-13 (deadline: 2026-06-28)

---

## Phases

<details>
<summary>v1.0 Policy Intelligence Platform (Phases 1-5) — SHIPPED 2026-04-23</summary>

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Infrastructure** - Next.js static export scaffold, content data layer, layout shell, and Vercel deployment pipeline
- [x] **Phase 2: Homepage & Design System** - Full homepage with hero, pillars, featured brief, stats, partner logos, newsletter signup, and all reusable UI primitives
- [x] **Phase 3: Policy Briefs Library & Detail Pages** - Filterable brief cards grid, PDF/infographic downloads, individual brief detail pages, and the weekly content update workflow
- [x] **Phase 4: Supporting Pages** - Methodology, Experts, and Contact pages completing all 5 site pages (completed 2026-04-21)
- [x] **Phase 5: SEO, Performance & Launch Readiness** - Meta tags, sitemap, Lighthouse audit, print styles, and production verification

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
- [x] 04-01-PLAN.md — Methodology page (tabbed client UI with SEIR/ML/Bayesian, NIPAD, GlobalPPS content + layout.tsx metadata)
- [x] 04-02-PLAN.md — Experts page (experts.json update + ExpertCard component + experts page grid)
- [x] 04-03-PLAN.md — Contact page (Formspree form + noscript fallback) + Phase 4 visual verification checkpoint

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
- [x] 05-01-PLAN.md — Remove Google Fonts violation, add metadataBase + OG/Twitter meta tags to brief detail pages
- [x] 05-02-PLAN.md — Create app/sitemap.ts + app/robots.ts + @media print CSS in globals.css
- [x] 05-03-PLAN.md — next build verification + Lighthouse/WhatsApp/print human checkpoint

</details>

---

## v2.0 Campaign & Action Platform

**Milestone Goal:** Transform the v1.0 policy intelligence platform into a full public-facing AMR campaign site — audience-segmented, data-rich, and action-driving — before the 5th Inter-Ministerial Conference on June 28, 2026.

**Deadline:** 2026-06-28 (~61 days from milestone start on 2026-04-28)

**Architecture constraint (applies to all phases):** Static Next.js export — no server-side runtime. All data is built at deploy time or written to JSON by GitHub Actions.

**Dependency constraint:** Phase 6 (brand rebrand) is a hard prerequisite for all subsequent phases. No new pages are built until the design system uses the AMR brand palette and logo.

- [x] **Phase 6: Brand Rebrand** - Align site palette and logo to AMR brand identity (green/gold/grey from AMR Logo_Feb2026.jpeg) across all existing components (completed 2026-04-28)
- [x] **Phase 7: Content & Analytics** - Publish all 15 policy briefs, add infographic assets, integrate GA4 tracking, and add audience-segmented CTAs to the homepage (completed 2026-04-29)
- [ ] **Phase 8: Awareness Hub & Education Library** - Two new content pages providing AMR infographics/explainers and audience-filtered learning materials
- [ ] **Phase 9: News Feed** - Automated daily AMR research feed via GitHub Actions scraper writing arXiv/PubMed results to JSON, displayed on a filterable /news page
- [ ] **Phase 10: Take Action Page** - Pledge form, prescribing commitment form, and advocacy toolkit downloads on a dedicated /take-action page
- [ ] **Phase 11: Interactive Tools** - Three web-based tools: stewardship checklist, self-assessment quiz, and facility reporting template
- [ ] **Phase 12: AMR Data Map** - Interactive choropleth map at /data-map showing WHO GLASS resistance data by country with pathogen/antibiotic filters
- [ ] **Phase 13: Social Sharing & Accessibility** - Social share buttons on brief and news pages, plus full WCAG AA accessibility audit and fixes

## Phase Details

### Phase 6: Brand Rebrand
**Goal**: Every page of the site reflects the official AMR brand identity — the AMR logo is visible in the header and footer, and all UI elements use the green/gold/grey palette derived from the logo
**Depends on**: Phase 5 (v1.0 complete)
**Requirements**: BRAND-01, BRAND-02, BRAND-03
**Success Criteria** (what must be TRUE):
  1. The AMR logo (Africa map silhouette + "AntiMicrobial Resistance" wordmark) is displayed in both the site header and footer on every page
  2. The site's primary color palette is visibly green and gold — Navy blue and teal are gone from all components
  3. All buttons, badges, section backgrounds, and link hovers use the new palette without any color contrast ratio dropping below WCAG AA 4.5:1 for normal text
  4. `next build` completes without errors after the token changes, and the deployed site on Vercel shows the updated brand on all 5 existing pages
**Plans**: TBD

Plans:
- [ ] 06-01-PLAN.md — Extract exact hex values from AMR logo, update Tailwind @theme tokens (green/gold/grey replacing navy/teal), verify contrast ratios
- [ ] 06-02-PLAN.md — Replace AMR logo asset in Header and Footer components; audit all existing components for token usage and fix hard-coded colors
- [ ] 06-03-PLAN.md — Visual verification across all 5 pages + next build confirmation

### Phase 7: Content & Analytics
**Goal**: All 15 policy briefs are live and discoverable, infographic images are accessible, GA4 tracks user behavior across the site, and the homepage routes each audience segment to their most relevant content
**Depends on**: Phase 6
**Requirements**: CONT-01, CONT-02, ANAL-01, ANAL-02, HOME-01
**Success Criteria** (what must be TRUE):
  1. The briefs library shows all 15 briefs (cards for briefs 4–15 added) and each links to a working detail page with a PDF download
  2. The three infographic JPEG images (IMG_9750–9752) are visible on the site — either on the awareness hub stub, brief detail pages, or both
  3. Google Analytics 4 is active on every page — opening the GA4 real-time dashboard while navigating the site shows page view events firing
  4. GA4 custom events fire for PDF download clicks, infographic download clicks, newsletter form submissions, and pledge form submissions
  5. The homepage displays three distinct CTA sections — one for ministers, one for healthcare workers, one for the general public — each linking to a relevant page or section
**Plans**: 3 plans

Plans:
- [x] 07-01-PLAN.md — Schema fix (types.ts), GA4 analytics helpers + GoogleAnalytics in layout.tsx, Montserrat/Inter font wiring, BriefCard conditional infographic
- [x] 07-02-PLAN.md — docx→PDF conversion, copy assets to public/, replace all 15 JSON entries with real content, DownloadButton + InfographicBlock client components, analytics wiring
- [x] 07-03-PLAN.md — AudienceCTAs section component on homepage (3 cards: minister / healthcare worker / public) + visual verification checkpoint

### Phase 8: Awareness Hub & Education Library
**Goal**: A visitor can navigate to two new content pages — an awareness hub with AMR infographics and explainers, and an education library with audience-filtered resources — and find materials relevant to their role
**Depends on**: Phase 6
**Requirements**: AWRE-01, AWRE-02, EDUC-01, EDUC-02
**Success Criteria** (what must be TRUE):
  1. Navigating to /awareness shows a page with the three Fleming Fund Rwanda infographic JPEGs displayed, organized with labels, plus placeholder explainer article sections
  2. Fact sheets are available as direct file downloads from the awareness hub page
  3. Navigating to /education shows a grid of resource cards filterable by audience type (Policymaker / Healthcare Worker / General Public)
  4. Each education resource card shows title, audience tag, format label (Article / Download / Video), and a working link or download button
**Plans**: 4 plans

Plans:
- [ ] 08-01-PLAN.md — Types, Header nav, and AudienceCTAs enablement
- [ ] 08-02-PLAN.md — /awareness page: infographic grid with lightbox and accordion explainers
- [ ] 08-03-PLAN.md — /education page: tab-filtered resource grid with 12 curated resources
- [ ] 08-04-PLAN.md — Final build verification and visual sign-off checkpoint

### Phase 9: News Feed
**Goal**: A daily-refreshed feed of recent AMR research articles from arXiv and PubMed is publicly accessible at /news, automatically populated by a GitHub Actions cron job without any manual intervention
**Depends on**: Phase 6
**Requirements**: NEWS-01, NEWS-02, NEWS-03, NEWS-04
**Success Criteria** (what must be TRUE):
  1. The GitHub Actions workflow runs on a daily schedule, calls arXiv and PubMed search APIs, writes results to a JSON file in the repo, and triggers a Vercel rebuild automatically
  2. Navigating to /news shows a feed of article cards each displaying title, source (arXiv or PubMed), authors, publication date, and a link to the original article
  3. The feed can be filtered by source (arXiv / PubMed) — selecting a filter shows only articles from that source
  4. Articles are sorted newest-first by default
**Plans**: TBD

Plans:
- [ ] 09-01-PLAN.md — GitHub Actions workflow: daily cron, arXiv + PubMed API calls, write to content/news.json, trigger Vercel deploy hook
- [ ] 09-02-PLAN.md — /news page: NewsCard component, client-side source filter, sort by date; seed news.json with initial data

### Phase 10: Take Action Page
**Goal**: A visitor motivated to act against AMR can submit a public pledge, a healthcare worker can record a prescribing commitment, and anyone can download advocacy toolkit assets — all from a single /take-action page
**Depends on**: Phase 6
**Requirements**: ACTN-01, ACTN-02, ACTN-03, ACTN-04
**Success Criteria** (what must be TRUE):
  1. /take-action displays three clearly separated sections: Pledge, Prescribing Commitment, and Advocacy Toolkit
  2. Submitting the pledge form (name, country, role, commitment statement) via Formspree shows a success confirmation message on the page
  3. Submitting the prescribing commitment form (name, facility, specialty, specific commitment) via Formspree shows a success confirmation message
  4. The advocacy toolkit section provides at least three downloadable assets (fact sheet, letter template, social media card) as direct file download links that resolve
**Plans**: TBD

Plans:
- [ ] 10-01-PLAN.md — /take-action page scaffold with three sections; PledgeForm and CommitmentForm components wired to Formspree endpoints
- [ ] 10-02-PLAN.md — Advocacy toolkit section: asset files in public/toolkit/, DownloadCard component, download link list

### Phase 11: Interactive Tools
**Goal**: A healthcare worker or facility manager can use three browser-based tools — a stewardship checklist, a self-assessment quiz, and a facility reporting template — without downloading any software
**Depends on**: Phase 6
**Requirements**: TOOL-01, TOOL-02, TOOL-03
**Success Criteria** (what must be TRUE):
  1. At /tools/stewardship-checklist a user can check off AMR stewardship practices, see a live completion score update as boxes are ticked, and trigger a browser print of the completed checklist
  2. At /tools/amr-quiz a user can answer multiple-choice questions, submit the quiz, and see a scored results summary with tailored recommendations based on their score band
  3. At /tools/facility-template a user can fill in key AMR reporting fields in a form and trigger a browser-print summary of their entries as a printable template
**Plans**: TBD

Plans:
- [ ] 11-01-PLAN.md — /tools/stewardship-checklist: checklist data JSON, ChecklistTool client component with score tracking and window.print()
- [ ] 11-02-PLAN.md — /tools/amr-quiz: quiz data JSON, QuizTool client component with scoring logic and results display
- [ ] 11-03-PLAN.md — /tools/facility-template: FacilityTemplateTool client component with form fields and print layout

### Phase 12: AMR Data Map
**Goal**: A policymaker can explore antibiotic resistance rates across African countries on an interactive choropleth map, filter by pathogen and antibiotic, and click a country to see its detailed resistance figures
**Depends on**: Phase 6
**Requirements**: MAPR-01, MAPR-02, MAPR-03, MAPR-04
**Success Criteria** (what must be TRUE):
  1. /data-map displays a choropleth map of Africa (and available non-African WHO GLASS countries) with countries shaded by resistance rate
  2. Selecting a pathogen and antibiotic from dropdown filters updates the map shading to reflect resistance rates for that combination
  3. Clicking a country on the map shows a tooltip or side panel with that country's resistance rate, year of data, and number of isolates tested
  4. Map data is served entirely from static JSON pre-processed from the WHO GLASS CSV files in resources/ — no external API is called at runtime
**Plans**: TBD

Plans:
- [ ] 12-01-PLAN.md — Pre-process WHO GLASS CSV files into a compact map-data.json; document pathogen/antibiotic combinations available
- [ ] 12-02-PLAN.md — /data-map page: choropleth map component (D3 or react-simple-maps), pathogen/antibiotic dropdowns, country click handler
- [ ] 12-03-PLAN.md — Tooltip/panel component with country detail; Lighthouse check that map bundle does not break mobile performance threshold

### Phase 13: Social Sharing & Accessibility
**Goal**: Users can share any brief or news article with one tap, and every page meets WCAG AA accessibility standards — ensuring the site is usable by screen reader users and keyboard-only navigators
**Depends on**: Phase 9 (news pages must exist before share buttons can be added to them), Phase 3 (brief detail pages exist from v1.0)
**Requirements**: SOCL-01, SOCL-02, A11Y-01, A11Y-02
**Success Criteria** (what must be TRUE):
  1. Brief detail pages display share buttons for WhatsApp, Twitter/X, and LinkedIn, plus a native Web Share API button — tapping any button opens the correct share dialog or copies the link
  2. News article cards display a share button that triggers the native Web Share API on mobile or falls back to copying the link on desktop
  3. An accessibility audit report identifies all WCAG AA violations across the full site (all pages including new v2.0 pages)
  4. All identified violations are fixed — verified by re-running the audit with zero AA failures on color contrast, keyboard navigation, alt text, and focus indicators
**Plans**: TBD

Plans:
- [ ] 13-01-PLAN.md — ShareButtons component (Web Share API + WhatsApp/Twitter/LinkedIn fallbacks); add to brief detail pages and news cards
- [ ] 13-02-PLAN.md — Accessibility audit (axe-core or Lighthouse a11y) across all pages; document all AA violations
- [ ] 13-03-PLAN.md — Fix all identified WCAG AA violations; re-audit to confirm zero failures

---

## Progress

**Execution Order:**
v1.0: 1 → 2 → 3 → 4 → 5 (complete)
v2.0: 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13
(Phase 6 must complete before any other v2.0 phase begins. Phases 7–13 are sequential unless otherwise noted.)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Infrastructure | v1.0 | 3/3 | Complete | 2026-03-27 |
| 2. Homepage & Design System | v1.0 | 4/4 | Complete | 2026-03-30 |
| 3. Policy Briefs Library & Detail Pages | v1.0 | 3/3 | Complete | 2026-04-01 |
| 4. Supporting Pages | v1.0 | 3/3 | Complete | 2026-04-21 |
| 5. SEO, Performance & Launch Readiness | v1.0 | 3/3 | Complete | 2026-04-23 |
| 6. Brand Rebrand | 3/3 | Complete    | 2026-04-28 | - |
| 7. Content & Analytics | 2/3 | Complete    | 2026-04-29 | - |
| 8. Awareness Hub & Education Library | v2.0 | 0/4 | Not started | - |
| 9. News Feed | v2.0 | 0/2 | Not started | - |
| 10. Take Action Page | v2.0 | 0/2 | Not started | - |
| 11. Interactive Tools | v2.0 | 0/3 | Not started | - |
| 12. AMR Data Map | v2.0 | 0/3 | Not started | - |
| 13. Social Sharing & Accessibility | v2.0 | 0/3 | Not started | - |
