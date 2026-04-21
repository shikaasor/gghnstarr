# gghnStarr

## What This Is

gghnStarr is the official web platform for the GGHN STARR Africa AMR Modeling Initiative — a 5-page static website that publishes a weekly policy brief series from March to June 2026, culminating at the 5th Inter-Ministerial Conference on Health & AMR (June 28, 2026). It delivers actionable, predictive-modeling-backed intelligence on Antimicrobial Resistance to Ministers of Health, Permanent Secretaries, Directors-General, and technical leads across African health systems.

## Core Value

A credible, authoritative platform where African health policymakers can find and download the latest AMR policy briefs — fast, on mobile, without friction.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage with hero section, 3-pillars grid, featured current brief, rotating stats strip, partner logos, and newsletter signup
- [ ] Policy Briefs Library — filterable grid of up to 15 brief cards (by month and theme), each with PDF and infographic download links
- [ ] Methodology & Engine page explaining the predictive modeling approach (SEIR, ML, Bayesian, NIPAD, GlobalPPS)
- [ ] Our Experts page with profiles for Dr. Olawale A., Dr. Samson A., and Piringar Mercy Niyang
- [ ] Contact & Engagement page with Formspree-powered contact form and newsletter signup
- [ ] Content structured so new briefs can be added weekly via a JSON/MDX data file (no code changes required)
- [ ] Mobile-first responsive design (target audience reads on tablets and phones while traveling)
- [ ] Navy + Teal design system (Deep Navy #0F172A, Medical Teal #0D9488, Serif headings, Sans-serif body)
- [ ] Deployed to Vercel via static Next.js export

### Out of Scope

- Community of Practice Forum — high complexity, deferred to future milestone
- Country Dashboards — live data/scoring deferred; may add as static snapshot pages later
- One Health Knowledge Hub — content not yet assembled
- Partner Portal — requires authentication and secure document exchange
- Monitoring & Accountability Dashboard — requires live data integration
- R/Shiny dashboard embeds — performance/security constraint per spec
- Authentication/login — fully public site

## Context

- The brief series runs March–June 2026 (15 briefs total, ~1 per week). Briefs are published progressively, so the site must support easy weekly content addition by a non-developer.
- Hard deadline: June 28, 2026 (5th Inter-Ministerial Conference on Health & AMR). The site must be live well before this date.
- Target audience is high-level government officials who may access the site on mobile in low-bandwidth conditions — performance and clarity are non-negotiable.
- Two competing visual specs existed in the repo. The Design Spec (5-page, Navy/Teal) was chosen over the broader branding guide (13-page, Blue/Green/Gold).
- Expert bios are sourced from `GGHN STARR Expertises_Feb 2026.docx`. Infographics come from `Policy brief infographics_FF Rwanda/` folder.
- The platform is associated with GUCGHPI (Georgetown University Center for Global Health Practice and Impact), Fleming Fund, Africa CDC, and WHO AFRO.

## Constraints

- **Architecture**: Static site (Next.js static export) — no server-side runtime, no database
- **Access**: Fully public — no authentication required on any page
- **Performance**: Mobile-first; must be usable in low-bandwidth African contexts
- **Visuals**: Static images and screenshots only — no live embedded R/Shiny dashboards
- **Deadline**: Site must be production-ready before June 28, 2026
- **Forms**: Formspree for contact form processing (no custom backend)
- **Hosting**: Vercel

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 5-page scope over 13-page vision | Focused scope achievable before June 28 deadline; complex features (Forum, Partner Portal) deferred | — Pending |
| Next.js static export + Tailwind | Good ecosystem, easy Vercel deployment, component model supports weekly content additions | — Pending |
| Navy + Teal color scheme | Cleaner, more modern than Blue/Green/Gold; better contrast for data-dense content | — Pending |
| JSON/MDX-based content for briefs | Non-developers can add weekly briefs without touching component code | — Pending |
| Formspree for contact form | No backend needed on a static site; free tier sufficient | — Pending |

---
*Last updated: 2026-03-23 after initialization*
