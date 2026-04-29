# Requirements: gghnStarr

**Defined:** 2026-03-23
**Core Value:** A credible, authoritative platform where African health policymakers can find and download the latest AMR policy briefs — fast, on mobile, without friction.

---

## v1.0 Requirements (Milestone: Policy Intelligence Platform — COMPLETE)

All v1.0 requirements delivered across Phases 1–5 (completed 2026-04-23).

- ✓ **FOUN-01–04**: Next.js scaffold, static export, Vercel deployment, Git LFS — Phase 1
- ✓ **HOME-01–04**: Homepage hero, pillars, featured brief, newsletter signup — Phase 2
- ✓ **BREF-01–04, BDET-01**: Briefs library, detail pages, filters, downloads — Phase 3
- ✓ **METH-01, EXPT-01, CONT-01**: Methodology, Experts, Contact pages — Phase 4
- ✓ **SEO-01–04**: OG meta tags, sitemap, robots.txt, print CSS — Phase 5

---

## v2.0 Requirements (Milestone: Campaign & Action Platform)

### Brand & Identity

- [x] **BRAND-01**: Site header and footer display the official AMR logo (AMR Logo_Feb2026.jpeg — Africa map silhouette + "AntiMicrobial Resistance" wordmark)
- [x] **BRAND-02**: Site color palette is updated from Navy/Teal to AMR brand colors (Emerald Green, Gold, Slate Grey — derived from logo; exact values confirmed at plan phase)
- [x] **BRAND-03**: All existing components (buttons, badges, section backgrounds, link hovers) reflect the updated brand palette without breaking contrast ratios

### Content

- [x] **CONT-01**: All 15 policy briefs are published and accessible in the briefs library (briefs 4–15 added as JSON data entries with PDF links)
- [x] **CONT-02**: Infographic images (IMG_9750, IMG_9751, IMG_9752 from resources/) are accessible on the site and linked from relevant brief detail pages or the awareness hub

### Analytics

- [x] **ANAL-01**: Google Analytics 4 is integrated across all pages and tracks page views, brief downloads, and CTA clicks
- [x] **ANAL-02**: GA4 events fire correctly for key user actions: PDF download, infographic download, newsletter signup, pledge form submission, quiz completion

### Homepage

- [ ] **HOME-01**: Homepage displays three audience-segmented CTA sections routing ministers, healthcare workers, and general public to their most relevant content

### Awareness Hub

- [ ] **AWRE-01**: A dedicated Awareness Hub page (/awareness) displays infographics, explainer articles, and downloadable fact sheets about AMR for a general audience
- [ ] **AWRE-02**: Awareness hub content is organized and visually distinct (the 3 infographic JPEGs from resources/ are displayed; placeholder text for explainer articles)

### Education Library

- [ ] **EDUC-01**: A dedicated Education Library page (/education) displays audience-specific learning materials filterable by audience type (Policymaker, Healthcare Worker, General Public)
- [ ] **EDUC-02**: Each education resource card shows title, audience tag, format (article/download/video), and a download or read link

### News Section

- [ ] **NEWS-01**: A dedicated News page (/news) displays a feed of recent AMR research articles automatically fetched from arXiv and PubMed APIs
- [ ] **NEWS-02**: A GitHub Actions workflow runs on a daily schedule, calls arXiv and PubMed search APIs with AMR-related queries, writes results to a JSON file in the repo, and triggers a Vercel rebuild
- [ ] **NEWS-03**: Each news card shows article title, source (arXiv/PubMed), authors, publication date, and a link to the original article
- [ ] **NEWS-04**: News feed can be filtered by source (arXiv / PubMed) and is sorted by publication date (newest first)

### Take Action

- [ ] **ACTN-01**: A dedicated Take Action page (/take-action) exists with three distinct sections: pledge, prescribing commitment, and advocacy toolkit
- [ ] **ACTN-02**: A visitor can submit a public pledge form (name, country, role, commitment statement) via Formspree and receive a confirmation message
- [ ] **ACTN-03**: A healthcare worker can submit a prescribing commitment form (name, facility, specialty, specific commitment) via Formspree
- [ ] **ACTN-04**: Advocacy toolkit section provides downloadable assets (fact sheets, letter templates, social media cards) as direct file downloads

### Interactive Tools

- [ ] **TOOL-01**: A Stewardship Checklist tool (/tools/stewardship-checklist) allows a user to check off AMR stewardship practices, see a completion score, and print or download the completed checklist
- [ ] **TOOL-02**: A Self-Assessment Quiz (/tools/amr-quiz) presents multiple-choice questions, scores the user's responses, and displays a results summary with tailored recommendations
- [ ] **TOOL-03**: A Facility Reporting Template tool (/tools/facility-template) provides a form-fill interface for key AMR reporting fields and generates a printable summary

### AMR Data Map

- [ ] **MAPR-01**: A dedicated AMR Data Map page (/data-map) displays an interactive choropleth map showing antibiotic resistance rates by country
- [ ] **MAPR-02**: Map data is sourced from the WHO GLASS CSV files already in resources/ (time series resistance data 2018–2023 by country/pathogen/antibiotic)
- [ ] **MAPR-03**: A visitor can select a pathogen and antibiotic from dropdown filters and see resistance rates update on the map
- [ ] **MAPR-04**: Clicking a country on the map shows a tooltip or panel with that country's resistance rate, year, and number of isolates tested

### Social Sharing

- [ ] **SOCL-01**: Brief detail pages display social share buttons (WhatsApp, Twitter/X, LinkedIn, native Web Share API) below the brief content
- [ ] **SOCL-02**: News article cards display a share button that triggers the native Web Share API or falls back to copy-link

### Accessibility

- [ ] **A11Y-01**: A full accessibility audit is completed across all pages identifying WCAG AA violations
- [ ] **A11Y-02**: All identified WCAG AA violations are fixed — minimum: color contrast, keyboard navigation, alt text, focus indicators

---

## v3.0 Requirements (Deferred)

### Country Dashboards
- **CTRY-01**: Dropdown of African countries with AMR governance scorecard, financing landscape, lab capacity, downloadable country profile

### Community of Practice
- **COMM-01**: Discussion boards and country working groups (requires authentication)
- **COMM-02**: Ask-an-expert sessions and shared tools repository

### Partner Portal
- **PRTN-01**: Secure document exchange and partner project mapping (requires authentication)

### Monitoring & Accountability
- **MNTR-01**: RAG scoring dashboard tracking NAP implementation across countries (requires live data)

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Google Scholar news scraping | No official API; SerpAPI cost not approved |
| R/Shiny dashboard embeds | Performance and security constraint |
| Authentication / login | Fully public site |
| Google Fonts | Removed Phase 5 for bandwidth performance |
| Video hosting | Infrastructure cost; embed links instead if needed |
| Real-time pledge counter | Requires backend; Formspree + email confirmation sufficient |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BRAND-01 | Phase 6 | Complete |
| BRAND-02 | Phase 6 | Complete |
| BRAND-03 | Phase 6 | Complete |
| CONT-01 | Phase 7 | Complete |
| CONT-02 | Phase 7 | Complete |
| ANAL-01 | Phase 7 | Complete |
| ANAL-02 | Phase 7 | Complete |
| HOME-01 | Phase 7 | Pending |
| AWRE-01 | Phase 8 | Pending |
| AWRE-02 | Phase 8 | Pending |
| EDUC-01 | Phase 8 | Pending |
| EDUC-02 | Phase 8 | Pending |
| NEWS-01 | Phase 9 | Pending |
| NEWS-02 | Phase 9 | Pending |
| NEWS-03 | Phase 9 | Pending |
| NEWS-04 | Phase 9 | Pending |
| ACTN-01 | Phase 10 | Pending |
| ACTN-02 | Phase 10 | Pending |
| ACTN-03 | Phase 10 | Pending |
| ACTN-04 | Phase 10 | Pending |
| TOOL-01 | Phase 11 | Pending |
| TOOL-02 | Phase 11 | Pending |
| TOOL-03 | Phase 11 | Pending |
| MAPR-01 | Phase 12 | Pending |
| MAPR-02 | Phase 12 | Pending |
| MAPR-03 | Phase 12 | Pending |
| MAPR-04 | Phase 12 | Pending |
| SOCL-01 | Phase 13 | Pending |
| SOCL-02 | Phase 13 | Pending |
| A11Y-01 | Phase 13 | Pending |
| A11Y-02 | Phase 13 | Pending |

**Coverage:**
- v2.0 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-04-28 — v2.0 roadmap created; all 31 requirements mapped to phases 6-13*
