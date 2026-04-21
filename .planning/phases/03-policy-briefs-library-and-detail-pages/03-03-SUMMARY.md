---
phase: 03-policy-briefs-library-and-detail-pages
plan: "03"
subsystem: ui
tags: [next.js, content-workflow, google-apps-script, github-desktop, vercel]

# Dependency graph
requires:
  - phase: 03-01
    provides: BriefCard and BriefGrid components, briefs library page
  - phase: 03-02
    provides: Brief detail pages at /briefs/[slug]
provides:
  - CONTENT-GUIDE.md at project root for non-technical content editors
  - End-to-end human verification of briefs library and detail pages
  - Phase 3 fully complete and verified
affects:
  - 04-supporting-pages
  - 05-seo-and-launch-readiness

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Non-technical content workflow: Google Sheet → Apps Script JSON export → briefs-index.json → GitHub Desktop commit → Vercel rebuild"
    - "Step-by-step guide written for non-developer audience with no terminal required"

key-files:
  created:
    - CONTENT-GUIDE.md
  modified: []

key-decisions:
  - "CONTENT-GUIDE.md placed at project root (same level as package.json) for maximum discoverability"
  - "Guide covers full 12-field Brief interface using Google Sheet column table format"
  - "Direct download link workaround documented: replace /view?usp=sharing with /uc?export=download"
  - "GitHub Desktop commit workflow documented without any terminal commands"

patterns-established:
  - "Content workflow guide pattern: table of all schema fields, step-per-section structure, troubleshooting appendix"

requirements-completed: [BREF-01, BREF-02, BREF-03, BREF-04, BDET-01]

# Metrics
duration: continuation — Task 1 approx 5 min, human verify async
completed: 2026-04-01
---

# Phase 3 Plan 03: CONTENT-GUIDE.md and Phase 3 Visual Verification Summary

**Non-technical content update guide (Google Sheet → Apps Script → JSON → GitHub Desktop → Vercel) and end-to-end human verification of the complete briefs library and detail page flows**

## Performance

- **Duration:** Task 1 approx 5 min; human verification completed asynchronously
- **Started:** 2026-04-01
- **Completed:** 2026-04-01
- **Tasks:** 2 (1 auto, 1 human-verify checkpoint)
- **Files modified:** 1

## Accomplishments
- CONTENT-GUIDE.md created at project root covering all 12 Brief interface fields, Google Drive upload steps, Apps Script export process, briefs-index.json paste workflow, and GitHub Desktop commit/push steps
- Human verifier confirmed all 22 end-to-end checks passed: briefs library grid, month/theme filtering, brief detail pages, prev/next navigation, 404 handling, and clean production build
- Phase 3 requirements BREF-01 through BREF-04 and BDET-01 fully satisfied and verified

## Task Commits

1. **Task 1: Write CONTENT-GUIDE.md** - `588f4c4` (feat)
2. **Task 2: End-to-end visual verification** - Human approved (no commit — checkpoint approval)

**Plan metadata:** _(docs commit below)_

## Files Created/Modified
- `CONTENT-GUIDE.md` — Non-technical step-by-step workflow for adding new weekly policy briefs to the site

## Decisions Made
- CONTENT-GUIDE.md placed at project root (same level as package.json) for maximum discoverability by non-technical team members
- Guide documents Google Drive direct-download link workaround (`/uc?export=download`) in the Troubleshooting section
- Author IDs and theme values in the guide match exactly the values in `content/experts.json` and `app/lib/types.ts`

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Phase 3 is complete. All five Phase 3 success criteria are met and verified:
1. Briefs library grid with BriefCard components renders correctly
2. Infographic download buttons present on each card
3. Month and theme filters work independently and in combination
4. Brief detail pages at /briefs/[slug] render full metadata, key messages, author bio, and prev/next navigation
5. Non-technical content workflow documented in CONTENT-GUIDE.md

Phase 4 (Supporting Pages — Methodology, Experts, Contact) and Phase 5 (SEO & Launch Readiness) can now proceed. Phase 4 depends on Phase 2 only and is unblocked.

---
*Phase: 03-policy-briefs-library-and-detail-pages*
*Completed: 2026-04-01*

## Self-Check: PASSED

- FOUND: CONTENT-GUIDE.md (project root)
- FOUND: 03-03-SUMMARY.md (.planning/phases/03-policy-briefs-library-and-detail-pages/)
- FOUND: commit 588f4c4 (feat(03-03): add CONTENT-GUIDE.md)
