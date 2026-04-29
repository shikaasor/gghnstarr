---
phase: 07-content-and-analytics
plan: "03"
subsystem: ui
tags: [react, nextjs, lucide-react, tailwindcss, audience-segmentation]

# Dependency graph
requires:
  - phase: 07-01
    provides: font wiring and TypeScript schema fixes that this component builds on
provides:
  - AudienceCTAs section component — 3 audience cards (ministers, HCW, public) on homepage
  - Homepage section order: HeroSection → AudienceCTAs → StatStrip → ThreePillars → FeaturedBrief → PartnerLogos → NewsletterSignup
affects:
  - phase-08-awareness-hub
  - phase-10-take-action

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Disabled future-page links use href='#' with aria-disabled=true and text-slate-400 cursor-not-allowed styling"
    - "Server Component pattern — no 'use client' directive for static link sections"
    - "AudienceCard data array with primaryLive/secondaryLinks.live booleans to toggle rendered element type"

key-files:
  created:
    - app/components/sections/AudienceCTAs.tsx
    - scripts/convert-briefs-to-pdf.py
  modified:
    - app/page.tsx
    - app/lib/content.ts

key-decisions:
  - "Disabled future-page primary CTAs render as <span> (not <Link>) to prevent navigation — cleaner semantics than pointer-events-none on Link"
  - "Section uses bg-slate-100 to match NewsletterSignup — creating visual bookends on the homepage"
  - "getAllBriefs() filters by publicationDate <= build date — prevents future-dated briefs appearing before publication day"
  - "getFeaturedBrief() auto-selects most recently published brief by date — removes manual featured flag management"

patterns-established:
  - "AudienceCard interface: icon, headline, subtext, primaryLabel/Href/Live, secondaryLinks[] — reusable pattern for audience-segmented content"

requirements-completed:
  - HOME-01

# Metrics
duration: ~20min
completed: 2026-04-29
---

# Phase 7 Plan 03: Audience CTAs Summary

**Three audience-segmented CTA cards (Landmark/Stethoscope/Users icons) on homepage, with real PDF conversions, date-gated brief visibility, and auto-featured brief selection added during checkpoint review — Phase 7 visually verified and complete**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-04-29T03:09:13Z
- **Completed:** 2026-04-29 (checkpoint approved)
- **Tasks:** 2 of 2 complete (1 auto + 1 human-verify — approved)
- **Files modified:** 4

## Accomplishments
- AudienceCTAs component with 3 equal-column cards on bg-slate-100 background
- Ministers card "Browse Policy Briefs" button links live to /briefs
- Healthcare Worker and General Public primary CTAs render as disabled spans (bg-slate-300, cursor-not-allowed)
- Secondary future-page links use text-slate-400 cursor-not-allowed disabled styling
- Real PDF conversions via docx2pdf added (scripts/convert-briefs-to-pdf.py)
- getAllBriefs() date-gated: publicationDate <= build date — no early release of future-dated briefs
- getFeaturedBrief() auto-selects most recently published brief — removes manual featured flag per week
- Phase 7 visually verified: 3 audience cards, 15 brief cards, Rwanda infographic inline, Montserrat headings, build clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Create AudienceCTAs component and wire into homepage** - `ed99496` (feat)
2. **[Checkpoint review] Real PDF conversions + date-gated brief visibility** - `1cb9598` (feat)

**Plan metadata (pre-checkpoint):** `a0a3038` (docs: complete plan — awaiting checkpoint)

## Files Created/Modified
- `app/components/sections/AudienceCTAs.tsx` - Three audience-segmented CTA cards (new Server Component)
- `app/page.tsx` - AudienceCTAs imported and inserted after HeroSection
- `app/lib/content.ts` - getAllBriefs() date-gated filter + getFeaturedBrief() auto-select by most recent publicationDate
- `scripts/convert-briefs-to-pdf.py` - docx2pdf conversion script for real brief PDFs

## Decisions Made
- Disabled primary CTAs render as `<span>` elements rather than `<Link href="#" aria-disabled>` — prevents any navigation semantics, cleaner HTML
- bg-slate-100 section background matches NewsletterSignup, creating consistent visual rhythm as bookend sections on the homepage
- getAllBriefs() date-gated at build time — prevents future-dated briefs from leaking early; no runtime server needed (static export compatible)
- getFeaturedBrief() auto-selects by most recent publicationDate — eliminates weekly manual flag updates

## Deviations from Plan

None in Task 1 — plan executed exactly as written.

### Changes Made During Checkpoint Review (not in original plan)

**1. [Rule 1 - Bug] Date-gated brief visibility in getAllBriefs()**
- **Found during:** Checkpoint review period
- **Issue:** getAllBriefs() returned all briefs regardless of publicationDate — future-dated briefs would appear on live site before their publication day
- **Fix:** Added `publicationDate <= today` filter to getAllBriefs()
- **Files modified:** app/lib/content.ts
- **Committed in:** 1cb9598

**2. [Rule 1 - Bug] getFeaturedBrief() auto-selection**
- **Found during:** Checkpoint review period
- **Issue:** getFeaturedBrief() required manual `featured: true` flag update each week — operational overhead and easy to forget
- **Fix:** Changed to return most recently published brief (sorted by publicationDate descending, first result)
- **Files modified:** app/lib/content.ts
- **Committed in:** 1cb9598

**3. [Operational] Real PDF conversion script**
- **Found during:** Checkpoint review period
- **Context:** Phase 07-02 used placeholder PDFs (docx copied as .pdf) because LibreOffice/pandoc were unavailable. During checkpoint review, docx2pdf was used to produce real conversions.
- **Fix:** Added scripts/convert-briefs-to-pdf.py
- **Files modified:** scripts/convert-briefs-to-pdf.py
- **Committed in:** 1cb9598

---

**Total deviations:** 3 (2 auto-fixed bugs, 1 operational improvement — all during checkpoint review)
**Impact on plan:** All changes improve correctness and operability. No scope creep.

## Issues Encountered
None — Task 1 build passed cleanly. Checkpoint approved without issues.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Phase 7 fully complete: 15 real policy briefs live, GA4 integrated, Montserrat/Inter fonts, AudienceCTAs on homepage, real PDF downloads, date-gated brief publishing
- Phase 8 (Awareness Hub & Education Library) can begin — /awareness page will activate the "AMR Awareness Hub" disabled links in AudienceCTAs
- Phase 10 (Take Action) will activate the "Take Action" disabled links in AudienceCTAs
- Activating disabled links requires only changing `live: false` → `live: true` and updating `href` in AudienceCTAs.tsx

---
*Phase: 07-content-and-analytics*
*Completed: 2026-04-29*

## Self-Check: PASSED

Files verified: AudienceCTAs.tsx, app/page.tsx, app/lib/content.ts, scripts/convert-briefs-to-pdf.py, 07-03-SUMMARY.md
Commits verified: ed99496 (feat: AudienceCTAs), 1cb9598 (feat: real PDFs + date-gated briefs), a0a3038 (docs: plan metadata)
