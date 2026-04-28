# gghnStarr — Project Progress

**Project:** GGHN STARR Africa AMR Modeling Initiative  
**Client ask:** Public-facing AMR campaign website — national awareness and action platform targeting general public, healthcare workers, and policymakers  
**Hard deadline:** June 28, 2026 (5th Inter-Ministerial Conference on Health & AMR)  
**Last updated:** 2026-04-28 — v2.0 roadmap approved, 8 phases planned

---

## What Has Been Built (v1.0 — Policy Intelligence Platform)

Phases 1–5 complete. Site is live on Vercel.

### Pages
| Page | Status | Notes |
|------|--------|-------|
| Homepage | ✓ Complete | Hero, conference badge, 3 pillars, featured brief, stats strip, partner logos, newsletter signup |
| Policy Briefs Library (`/briefs`) | ✓ Complete | Filterable grid by month and theme, PDF + infographic downloads |
| Brief detail pages (`/briefs/[slug]`) | ✓ Complete | Full metadata, OG/Twitter meta tags, print-friendly |
| Methodology page (`/methodology`) | ✓ Complete | SEIR/ML/Bayesian, NIPAD, GlobalPPS — tabbed UI |
| Experts page (`/experts`) | ✓ Complete | 3 expert profile cards |
| Contact page (`/contact`) | ✓ Complete | Formspree form, noscript fallback |

### Infrastructure
| Feature | Status | Notes |
|---------|--------|-------|
| Vercel deployment | ✓ Complete | Static export, auto-deploys on push to main |
| SEO — OG/Twitter meta tags | ✓ Complete | Brief detail pages have full openGraph + twitter card |
| SEO — sitemap.xml + robots.txt | ✓ Complete | 8+ URLs, auto-generated at build time |
| Print CSS | ✓ Complete | Brief detail pages print cleanly without chrome |
| Google Fonts removed | ✓ Complete | System fonts only — performance + bandwidth constraint |
| Newsletter signup | ✓ Complete | Google Apps Script backend |
| Mobile-first responsive | ✓ Complete | Tested on mobile |
| Git LFS for PDFs | ✓ Complete | Large files tracked via LFS |
| Content update workflow | ✓ Complete | Non-developer can add briefs via JSON + PDF commit |

---

## What Needs to Be Built (v2.0 — Campaign & Action Platform)

The client brief expands the site from a policy intelligence layer to a full public-facing campaign platform. Three target audiences: general public, healthcare workers, policymakers.

### New Pages

| Feature | Priority | Status | Blocker |
|---------|----------|--------|---------|
| Take Action page — pledges, prescribing commitments, advocacy toolkit | HIGH | ○ Not started | Need clarity on pledge mechanism (static form vs tracked commitments) |
| Awareness hub — infographics and explainers | MEDIUM | ○ Not started | Content must be provided or sourced |
| Education library — audience-specific materials | MEDIUM | ○ Not started | Content must be provided or sourced |
| News section — aggregated AMR research feed | HIGH | ○ Not started | Architecture decision pending (see Blockers) |
| Interactive AMR data map | MEDIUM | ○ Not started | Data source not confirmed (see Blockers) |

### Homepage Enhancements

| Feature | Priority | Status | Blocker |
|---------|----------|--------|---------|
| Audience-segmented CTAs | HIGH | ○ Not started | Need CTA copy per audience type |

### Practical Tools

| Feature | Priority | Status | Blocker |
|---------|----------|--------|---------|
| Stewardship checklists | MEDIUM | ○ Not started | Format TBD: interactive web component vs downloadable PDF/Word |
| Self-assessment quizzes | MEDIUM | ○ Not started | Format TBD: same as above |
| Facility reporting templates | MEDIUM | ○ Not started | Format TBD: likely downloadable |

### Platform Capabilities

| Feature | Priority | Status | Blocker |
|---------|----------|--------|-------|
| Google Analytics 4 | HIGH | ○ Not started | None — straightforward to implement |
| Social share buttons | HIGH | ○ Not started | None — can use native share API + links |
| Accessibility audit + WCAG fixes | MEDIUM | ○ Not started | None — audit first, then fix |

---

## Decisions Resolved (2026-04-28)

| Decision | Resolution |
|----------|-----------|
| News section architecture | GitHub Actions cron → arXiv + PubMed APIs → news.json → Vercel rebuild |
| AMR data map source | Interactive choropleth from WHO GLASS CSV files already in resources/ |
| Tools format | Interactive web components (checklist, quiz, facility template) |
| Pledge mechanism | Formspree forms (same pattern as Contact page) |
| Brand palette | Align to AMR logo green/gold/grey (exact hex at Phase 6 plan time) |
| Google Scholar | Out of scope — no official API, SerpAPI cost not approved |

## v2.0 Roadmap (approved 2026-04-28)

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 6 | Brand Rebrand | BRAND-01–03 | ○ Not started |
| 7 | Content & Analytics | CONT-01–02, ANAL-01–02, HOME-01 | ○ Not started |
| 8 | Awareness Hub & Education Library | AWRE-01–02, EDUC-01–02 | ○ Not started |
| 9 | News Feed | NEWS-01–04 | ○ Not started |
| 10 | Take Action Page | ACTN-01–04 | ○ Not started |
| 11 | Interactive Tools | TOOL-01–03 | ○ Not started |
| 12 | AMR Data Map | MAPR-01–04 | ○ Not started |
| 13 | Social Sharing & Accessibility | SOCL-01–02, A11Y-01–02 | ○ Not started |

---

## Progress Snapshot

```
v1.0 Policy Intelligence Platform  ██████████ 100% complete
v2.0 Campaign & Action Platform    ░░░░░░░░░░   0% started
```

**v1.0 phases:** 5/5 complete  
**v2.0 phases:** 0/8 — roadmap approved 2026-04-28

---
*Updated: 2026-04-28 — v2.0 roadmap approved, all blockers resolved*

