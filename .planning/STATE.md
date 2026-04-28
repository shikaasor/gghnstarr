# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-28)

**Core value:** A credible, authoritative platform where African health policymakers can find and download the latest AMR policy briefs — fast, on mobile, without friction.
**Current focus:** v2.0 Phase 6 — Brand Rebrand (first phase, hard dependency for all subsequent v2.0 phases)

## Current Position

Phase: 6 of 13 (Brand Rebrand — first v2.0 phase)
Plan: 2 of 3 (06-01 complete — palette token swap done)
Status: In Progress — Phase 6 plan 1 complete
Last activity: 2026-04-28 — 06-01 executed: AMR brand palette tokens swapped in globals.css

Progress: [█░░░░░░░░░] 3% (v2.0, 1/31 plans complete) | v1.0 complete

## Performance Metrics

**Velocity (v1.0):**
- Total plans completed: 15
- Average duration: ~7 min
- Total execution time: ~1h 45min

**By Phase (v1.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 60 min | 20 min |
| 02-homepage | 4 | 22 min | 5.5 min |
| 03-briefs | 3 | ~8 min | ~3 min |
| 04-supporting | 3 | ~4 min | ~1.5 min |
| 05-seo-launch | 3 | ~5 min | ~1.5 min |

*v2.0 metrics will populate as plans complete*

## Accumulated Context

### Decisions

- v2.0 roadmap: 8 phases (6-13) from 31 requirements; standard depth; sequential (Phase 6 hard prerequisite)
- v2.0: Static Next.js export retained — all new pages are statically generated
- v2.0: News feed = GitHub Actions cron → content/news.json → Vercel rebuild (no runtime server)
- v2.0: Data map = pre-process WHO GLASS CSV to static map-data.json; D3 or react-simple-maps for choropleth
- v2.0: Forms = Formspree for pledge and prescribing commitment (no custom backend)
- v2.0: Brand color exact hex values to be extracted from AMR Logo_Feb2026.jpeg at Phase 6 plan time
- 06-01: Option B palette swap — keep class names, change hex values (zero component file changes required)
- 06-01: teal-600 set to #0A7050 (not logo green) to achieve WCAG AA 4.5:1 contrast on white (~6.1:1)
- 06-01: teal-50 added as new token for hover:bg-teal-50 class support; amr-gold #F2A900 as named accent token

### Pending Todos

8 todos resolved into roadmap phases:
- Audience-segmented CTAs → Phase 7 (CONT-01 group)
- Analytics integration → Phase 7
- News section → Phase 9
- Take Action page → Phase 10
- Awareness hub + education library → Phase 8
- Practical tools suite → Phase 11
- Interactive AMR data map → Phase 12
- Accessibility + social share → Phase 13

### Blockers/Concerns

- Phase 6: Exact brand hex values must be confirmed from AMR Logo_Feb2026.jpeg before token update (not blockin — just a plan-time task)
- Phase 12: Data map library choice (D3 vs react-simple-maps) affects bundle size — decide at plan time with Lighthouse budget in mind
- Deadline: June 28, 2026 — 8 phases in ~61 days; ~7-8 days per phase maximum

## Session Continuity

Last session: 2026-04-28
Stopped at: Phase 6 plan 01 complete — AMR brand palette tokens swapped in globals.css; 06-02 and 06-03 ready to execute
Resume file: None
