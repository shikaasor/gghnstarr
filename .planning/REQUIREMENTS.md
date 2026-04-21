# Requirements: gghnStarr

**Defined:** 2026-03-23
**Core Value:** A credible, authoritative platform where African health policymakers can find and download the latest AMR policy briefs — fast, on mobile, without friction.

## v1 Requirements

### Foundation

- [x] **FOUN-01**: Project scaffolded as Next.js static export with TypeScript, Tailwind CSS v4, correct `next.config.js` (`output: 'export'`, `images: { unoptimized: true }`), and Vercel auto-deploy configured on push to `main`
- [x] **FOUN-02**: Content data layer implemented — TypeScript interfaces for `Brief`, `Expert`, `SiteContent`; `lib/content.ts` with `getAllBriefs`, `getBriefBySlug`, `getExperts`, `getSiteContent`; JSON data files (`briefs-index.json`, `experts.json`, `site.json`) with sample entries
- [x] **FOUN-03**: Shared layout shell built — `Header` with navigation links, `Footer` with branding, `Container` max-width wrapper; all 5 pages render within this shell
- [x] **FOUN-04**: Git LFS configured for PDF files so brief PDFs do not bloat repository history; `.gitattributes` entry for `*.pdf`

### Homepage

- [x] **HOME-01**: Hero section with "Road to the 5th Inter-Ministerial Conference • June 28, 2026" badge, primary headline, sub-headline, and "Read the Latest Policy Brief" CTA button; 3 Pillars icon grid (Genomic Surveillance, Predictive Analytics, One Health Governance)
- [x] **HOME-02**: Featured Brief section showing the current week's brief with title, executive summary, and prominent "Download PDF" button; Stats Strip displaying rotating AMR impact statistics
- [ ] **HOME-03**: Partner Logos strip displaying GUCGHPI, Fleming Fund, Africa CDC, and WHO AFRO logos
- [ ] **HOME-04**: Newsletter signup component capturing email address and submitting to Mailchimp (free tier)

### Policy Briefs Library

- [x] **BREF-01**: Briefs library page with a grid of BriefCards; each card displays week/date tag, bold title, author name, key takeaway summary, and a "Download Full Brief (PDF)" button
- [x] **BREF-02**: Each BriefCard includes a separate "Download Infographic" button linking to the 1-page infographic PDF for that brief
- [x] **BREF-03**: Client-side filtering controls on the briefs library page — filter by publication month (March, April, May, June) and by policy theme (Governance, Laboratory Systems, Predictive Analytics, One Health, Stewardship); filters can be combined
- [x] **BREF-04**: Each BriefCard displays a visual thumbnail image (infographic preview or branded cover art)

### Brief Detail Pages

- [x] **BDET-01**: Individual brief detail page at `/briefs/[slug]` for each brief; displays full brief metadata, key messages list, "Download Full Brief" and "Download Infographic" buttons, and author bio excerpt; all slugs enumerated at build time via `generateStaticParams`

### Methodology Page

- [x] **METH-01**: Methodology & Engine page explaining the predictive modeling approach — sections for Predictive Modeling (SEIR, ML, Bayesian forecasting, agent-based simulations), The NIPAD Platform (with static dashboard screenshot), and GlobalPPS & WHONET surveillance data mechanisms

### Experts Page

- [x] **EXPT-01**: Our Experts page with profile cards for Dr. Olawale A. (Genomic Surveillance, Lab Systems, Fleming Fund Rwanda), Dr. Samson A. (Mathematical/Predictive Modeling, NIPAD, GlobalPPS), and Piringar Mercy Niyang (One Health Governance, GLASS, Africa CDC); each card shows photo, name, title, institutional affiliation, and bio

### Contact Page

- [x] **CONT-01**: Contact & Engagement page with Formspree-powered form including fields: Name, Title, Ministry/Organization, Country, Inquiry Type (Policy Support / Modeling Request / Lab Strengthening / Other), Message; fallback email address displayed if JavaScript is disabled

### SEO & Launch Readiness

- [ ] **SEO-01**: Per-page Open Graph and Twitter Card meta tags generated via Next.js `generateMetadata`; each brief detail page has its own OG image (infographic thumbnail) so links look professional when shared on WhatsApp
- [ ] **SEO-02**: `sitemap.xml` and `robots.txt` auto-generated via `next-sitemap`, including all brief detail page URLs
- [ ] **SEO-03**: Lighthouse mobile performance audit passes before launch — target: Performance score ≥ 85, LCP < 2.5s on simulated 3G, total page weight < 500KB
- [ ] **SEO-04**: Print-friendly CSS (`@media print`) on brief detail pages so officials can print briefs directly from the browser

## v2 Requirements

### Community & Dynamic Features

- **COMM-01**: Community of Practice Forum with discussion boards and ask-an-expert sessions
- **COMM-02**: Country Dashboards with governance scorecards and AMR indicator data per country
- **COMM-03**: One Health Knowledge Hub with SOPs, toolkits, and training modules
- **COMM-04**: Partner Portal with project mapping, funding opportunities, and secure document exchange
- **COMM-05**: Monitoring & Accountability Dashboard with RAG scoring and trend graphs

### Extended Content

- **EXT-01**: Events & Learning page (webinars, workshops, past recordings)
- **EXT-02**: Research & Evidence Library with searchable database and filters
- **EXT-03**: Advocacy & Communications Center (infographics, social media cards, press kits)
- **EXT-04**: French translation for Francophone African countries

## Out of Scope

| Feature | Reason |
|---------|--------|
| Live R/Shiny dashboard embeds | Performance and security constraints; static screenshots used instead |
| User authentication / login | Fully public site; contradicts open dissemination mission |
| Real-time data dashboards | Data pipeline maintenance burden; static screenshots for v1 |
| Blog / news section | Scope creep; policy briefs are the content stream |
| Full-text search | 15 briefs with tag filtering is sufficient; search is over-engineering for this scale |
| Framer Motion / animation library | Unnecessary weight for a policy audience on constrained bandwidth |
| Headless CMS | Over-engineering for 15 items with a fixed schedule; JSON files are sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1 | Complete |
| FOUN-02 | Phase 1 | Complete |
| FOUN-03 | Phase 1 | Complete |
| FOUN-04 | Phase 1 | Complete |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 2 | Pending |
| HOME-04 | Phase 2 | Pending |
| BREF-01 | Phase 3 | Complete |
| BREF-02 | Phase 3 | Complete |
| BREF-03 | Phase 3 | Complete |
| BREF-04 | Phase 3 | Complete |
| BDET-01 | Phase 3 | Complete |
| METH-01 | Phase 4 | Complete |
| EXPT-01 | Phase 4 | Complete |
| CONT-01 | Phase 4 | Complete |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| SEO-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-25 — FOUN-01, FOUN-04 marked complete (01-01-PLAN.md)*
