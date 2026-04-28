# gghnStarr — Project Progress

**Project:** GGHN STARR Africa AMR Modeling Initiative  
**Client ask:** Public-facing AMR campaign website — national awareness and action platform targeting general public, healthcare workers, and policymakers  
**Hard deadline:** June 28, 2026 (5th Inter-Ministerial Conference on Health & AMR)  
**Last updated:** 2026-04-28

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

## Blockers

### BLOCKER 1 — News section architecture
**Issue:** The site is a Next.js static export (`output: 'export'`). Static sites cannot scrape at request time.  
**Options:**
- A: GitHub Action (cron) → arXiv API + PubMed API (both free) → writes JSON to repo → triggers Vercel rebuild. Zero new infrastructure. Google Scholar has no official API — needs SerpAPI (~$50/month) or skip it.
- B: Vercel serverless function called client-side. Adds hosting complexity.
- C: RSS feeds from journals aggregated via a third-party service.  
**Decision needed from:** Client/team — preferred data sources and budget for SerpAPI

### BLOCKER 2 — Interactive AMR data map data source
**Issue:** Map scope determines implementation complexity (hours vs weeks).  
**Options:**
- GLASS/WHO data — publicly available country-level AMR data, downloadable as CSV
- GGHN STARR model outputs — predicted burden per country from initiative's own modeling
- Both as toggleable layers
- Static pre-rendered snapshot image — zero complexity, updated manually  
**Decision needed from:** Client/technical team — which data, who owns it

### BLOCKER 3 — Tools format (checklists, quizzes, templates)
**Issue:** "Interactive" vs "downloadable" is a large difference in build effort.  
**Options:**
- Static downloads (PDF/Word) — fast to build, no maintenance
- Interactive web components (fill form → see result) — 3-5x more effort  
**Decision needed from:** Client — what format do end users expect?

### BLOCKER 4 — Take Action pledge mechanism
**Issue:** "Pledges and commitments" could mean anything from a download to a database.  
**Options:**
- Static pledge form → email notification (Formspree, like Contact page) — no backend
- Live pledge counter showing number of signatories — requires a backend or third-party (e.g. Google Sheets via GAS)
- Download-only (printable pledge card) — zero complexity  
**Decision needed from:** Client — does anyone need to see/count pledges publicly?

### BLOCKER 5 — Awareness hub + education library content
**Issue:** These sections have no content yet.  
**Decision needed from:** Client/team — who is writing the explainers and educational materials, and when will they be ready?

---

## What's Clear Enough to Build Now (no blockers)

These can proceed immediately regardless of the unresolved blockers:

1. **GA4 analytics** — standard Next.js integration, decided: Google Analytics 4
2. **Social share buttons** — native share API + platform links
3. **Audience-segmented CTAs on homepage** — needs CTA copy, but technically simple
4. **Accessibility audit** — can run now, fixes follow

---

## Progress Snapshot

```
v1.0 Policy Intelligence Platform  ██████████ 100% complete
v2.0 Campaign & Action Platform    ░░░░░░░░░░   0% started
```

**v1.0 phases:** 5/5 complete  
**v2.0 phases:** 0/? — roadmap not yet defined (blocked on decisions above)

---
*Updated: 2026-04-28 — gap analysis session, client brief reviewed*
