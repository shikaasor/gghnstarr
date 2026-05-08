# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-28)

**Core value:** A credible, authoritative platform where African health policymakers can find and download the latest AMR policy briefs — fast, on mobile, without friction.
**Current focus:** v2.0 Phase 11 — Interactive Tools (next)

## Current Position

Phase: 17-lead-capture-pre-download-access-wall-collecting-name-role-email-and-audience-category-via-gas
Plan: 17-01 (complete)
Status: Phase 17 in progress — Plan 01 delivered (localStorage helpers + LeadCaptureModal foundation)
Last activity: 2026-05-08 — Phase 17 Plan 01: SSR-safe localStorage utility and LeadCaptureModal with silent-fail GAS submit and download-always guarantee; ~8 min, 2 tasks, 2 files

Progress: [████░░░░░░] 61% (v2.0, 20/31 plans complete) | v1.0 complete

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
| Phase 06-brand-rebrand P03 | 2 | 3 tasks | 1 files |
| Phase 07-content-and-analytics P01 | 3 | 2 tasks | 7 files |
| Phase 07-content-and-analytics P02 | 7 | 3 tasks | 25 files |
| Phase 07-content-and-analytics P03 | ~20min | 2 tasks | 4 files |
| Phase 08-awareness-hub P01 | 92s | 3 tasks | 3 files |
| Phase 08-awareness-hub P02 | 10min | 2 tasks | 5 files |
| Phase 08-awareness-hub-education-library P03 | 5 min | 2 tasks | 2 files |
| Phase 09 P01 | 5min | 3 tasks | 6 files |
| Phase 09 P02 | 15min | 3 tasks | 4 files |
| Phase 10-take-action-page P01 | 3min | 2 tasks | 10 files |
| Phase 10-take-action-page P02 | 30min | 2 tasks | 8 files |
| Phase 15 P01 | 8min | 2 tasks | 4 files |
| Phase 19 P01 | 1 | 2 tasks | 3 files |
| Phase 19 P02 | 1min | 2 tasks | 2 files |
| Phase 16 P01 | 8 | 2 tasks | 2 files |
| Phase 16 P02 | 8 | 2 tasks | 3 files |
| Phase 16 P03 | ~10 | 2 tasks | 2 files |
| Phase 17 P01 | 8 | 2 tasks | 2 files |

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
- 06-02: mixBlendMode multiply used for JPEG logo on dark backgrounds — eliminates white box artifact without preprocessing
- 06-02: Header logo 160x64 with priority (LCP); Footer logo 140x56 (below fold, no priority)
- Phase 6: Option B token strategy confirmed — keep teal/navy class names, update hex to AMR green/gold; zero component changes required
- Phase 6: teal-600 darkened to #0A7050 for WCAG AA compliance on white (6.1:1 ratio)
- Phase 6: Logo uses mix-blend-mode: multiply to handle white JPEG background on dark header
- Phase 6: AMR gold token added as --color-amr-gold: #F2A900 for future accent uses
- [Phase 06-03]: Phase 6: Option B token strategy confirmed — keep teal/navy class names, update hex to AMR green/gold; zero component changes required
- [Phase 06-03]: Phase 6: teal-600 #0A7050 confirmed for WCAG AA compliance on white (6.1:1 ratio)
- [Phase 07-01]: infographicPdfUrl made optional: Phase 7 real briefs have no infographic PDFs — required for TypeScript build
- [Phase 07-01]: trackPledgeSubmit and trackQuizComplete are intentional no-ops in analytics.ts pending Phase 10 and Phase 11
- [Phase 07-01]: GoogleAnalytics guarded by env var check; NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-PLACEHOLDER in .env.local, real ID in Vercel
- [Phase 07-02]: placeholder-pdfs: LibreOffice/pandoc unavailable on Windows — .docx files copied as .pdf placeholders; real conversion deferred
- [Phase 07-02]: infographic-mapping: IMG_9750=brief-09 (lab systems), IMG_9751=brief-06 (domestic financing), IMG_9752=brief-07 (One Health governance NAP 2.0)
- [Phase 07-03]: AudienceCTAs disabled primary CTAs render as <span> elements (not <Link>) — prevents navigation semantics for future-page placeholders
- [Phase 07-03]: bg-slate-100 used for AudienceCTAs to match NewsletterSignup — visual bookend sections on homepage
- [Phase 07-03]: getAllBriefs() filters by publicationDate <= build date — prevents future-dated briefs appearing before publication day
- [Phase 07-03]: getFeaturedBrief() auto-selects most recently published brief by date — removes need for manual featured flag updates each week
- [Phase 08-02]: Used plain <img> tags in InfographicGrid instead of next/image — aligns with existing unoptimized images config
- [Phase 08-02]: Imported yet-another-react-lightbox/styles.css inside InfographicGrid component, not globals.css or layout.tsx
- [Phase 08-02]: AccordionSection uses max-h transition (0 → 2000px) for smooth expand/collapse instead of hidden/visible
- [Phase 08-03]: 12 education resources embedded as typed EducationResource[] constants in Server Component — no JSON file needed; multi-audience cards filter via r.audiences.includes()
- [Phase 09]: PubMed idlist approach: ESearch idlist passed directly as id= to ESummary/EFetch — WebEnv history returns undefined query_key causing 500 errors
- [Phase 09]: fast-xml-parser in devDependencies only — used by Node.js scraper script, not in Next.js bundle
- [Phase 09]: GitHub Actions workflow uses npm ci so fast-xml-parser devDependency is available in CI; NCBI_API_KEY is optional secret
- [Phase 09-02]: NewsCard source displayed as plain uppercase text (no badge/chip)
- [Phase 09-02]: visibleCount resets to PAGE_SIZE on filter change to prevent pagination confusion
- [Phase 10-01]: formConfig reads NEXT_PUBLIC_GAS_PLEDGE_URL and NEXT_PUBLIC_GAS_COMMITMENT_URL from env; placeholder URLs in .env.local, real in Vercel (superseded in 10-02 by single NEXT_PUBLIC_GAS_URL)
- [Phase 10-01]: Pledge card pre-expanded by default (init expanded='pledge'); hash on mount overrides
- [Phase 10-01]: Session locking via Set<CardId> — locked card ignores toggle; no re-open after successful submit
- [Phase 10-01]: isButton flag on navLinks renders Take Action as AMR gold button in Header without separate array
- [Phase 10-02]: Single GAS endpoint (NEXT_PUBLIC_GAS_URL) with formType routing replaces two separate env vars — simplifies Vercel config and GAS deployment
- [Phase 10-02]: DownloadCard uses same-origin /toolkit/ hrefs — browser download attribute only works for same-origin URLs; public/ serves files from same origin
- [Phase 10-02]: public/toolkit/.gitkeep commits the directory so Vercel includes it; real asset files are dropped without code changes
- [Phase 15-01]: ConferenceBar z-[60] sticky top-0 rendered before Header in DOM — correct stacking without Header CSS changes
- [Phase 15-01]: daysLeft initialized as null prevents hydration mismatch on static export
- [Phase 15-01]: sessionStorage used (not localStorage) — bar returns each new browser session for maximum conference awareness
- [Phase 15-02]: Register Now CTA URL corrected to /registration (internal route) after visual verification — keeps users on GGHN platform
- [Phase 19]: replaced Giscus with GAS anonymous commenting — Giscus requires GitHub login, target audience are normies without GitHub accounts
- [Phase 19-01]: CommentList uses relative path import '../../../content/comments.json' — @/* alias maps to app/, not project root; content/ lives at root
- [Phase 19-01]: formType: 'comment' routes to comment handler in existing GAS endpoint — no new endpoint or env var needed
- [Phase 19-02]: GAS_COMMENTS_URL stored as GitHub Actions secret (not NEXT_PUBLIC_) — only cron job reads it; browser clients use existing NEXT_PUBLIC_GAS_URL
- [Phase 19-02]: fetch-comments.yml gracefully skips if secret not configured — safe to deploy before GAS is set up
- [Phase 19]: replaced GAS+GitHub Actions comment display with Supabase client-side fetch — live approval without rebuild cycle
- [Phase Phase 16-01]: EducationResource kept with @deprecated JSDoc — EducationGrid.tsx still uses it; both types coexist until Plan 03 replaces that component
- [Phase Phase 16-01]: Three Article items reclassified as Publication format (Cambridge/ASH&E, Frontiers, PubMed/JAC-AMR) with authors, journal, doi for visual distinction
- [Phase Phase 16-01]: content/education.json as single source of truth — adding a resource never requires a code change
- [Phase 16-02]: EducationTabs owns all state (tab, filters, pagination); EducationCard and EducationFilters are pure presentational with no hooks
- [Phase 16-02]: Hash sync uses useEffect + popstate listener — useSearchParams is incompatible with static Next.js export
- [Phase 16-02]: OR-within-dimension AND-across-dimension filter logic — within a dimension any selected value matches; across dimensions all must match
- [Phase 16-03]: page.tsx is a pure Server Component — reads content/education.json at build time via readFileSync, passes items array as prop to EducationTabs Client Component
- [Phase 16-03]: EducationGrid retired to export {} stub with comment pointing to EducationTabs — preserves git history, avoids accidental re-creation
- [Phase 17-01]: LeadCaptureModal silent-fail on GAS error — download always proceeds after submit to avoid blocking user access
- [Phase 17-01]: Dismiss path (backdrop click or X) calls onClose() only — no download, no localStorage write; parent shows inline message after dismiss
- [Phase 17-01]: Lead capture key stores user email string (not boolean) — enables email-based deduplication in GAS if needed later

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

### Roadmap Evolution

- Phase 14 added: Color Palette Refresh — brighter emerald green
- Phase 15 added: Conference Hub — dedicated /conference page + site-wide countdown widget
- Phase 16 added: Education Redesign — archive/filter, training vs resources split, publications and verifiable references
- Phase 17 added: Lead Capture — pre-download access wall (name, role, email, audience) via GAS
- Phase 18 added: Expert Registration — portfolio submission form + visibility on experts page
- Phase 19 added: Brief Engagement — Giscus commenting on brief detail pages

### Blockers/Concerns

- Phase 12: Data map library choice (D3 vs react-simple-maps) affects bundle size — decide at plan time with Lighthouse budget in mind
- Deadline: June 28, 2026 — 8 phases in ~61 days; ~7-8 days per phase maximum

## Session Continuity

Last session: 2026-05-08
Stopped at: Phase 17 Plan 01 complete — lead-capture.ts + LeadCaptureModal created, build passes, ready for 17-02
Resume file: None
