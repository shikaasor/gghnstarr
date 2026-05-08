---
phase: 17-lead-capture-pre-download-access-wall-collecting-name-role-email-and-audience-category-via-gas
plan: "03"
subsystem: ui
tags: [react, next.js, lead-capture, modal, client-component, localstorage]

# Dependency graph
requires:
  - phase: 17-01
    provides: LeadCaptureModal component and hasCompletedLeadCapture/markLeadCaptureComplete helpers in lib/lead-capture.ts

provides:
  - FeaturedBrief.tsx converted to Client Component with gated PDF download (modal on first visit, window.open for returning)
  - DownloadCard.tsx with optional gated prop — PDF/DOCX shows modal, PNG renders original anchor
  - ToolkitSection.tsx wired with gated: true on PDF/DOCX entries; PNG entry ungated

affects:
  - homepage (FeaturedBrief is rendered in app/page.tsx)
  - take-action page (ToolkitSection/DownloadCard rendered in /take-action)
  - Phase 17 completion (all 4 PDF download surfaces now gated)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "gated prop pattern on DownloadCard: optional boolean (default false); PNG callers omit it, PDF/DOCX callers pass gated=true"
    - "Client Component wrapping for gated interactive sections — received brief as prop from Server Component page.tsx, no server-only ops"
    - "Fragment wrapper (<>) used in FeaturedBrief to mount modal outside <section> without extra DOM node"

key-files:
  created: []
  modified:
    - app/components/sections/FeaturedBrief.tsx
    - app/components/take-action/DownloadCard.tsx
    - app/components/take-action/ToolkitSection.tsx

key-decisions:
  - "FeaturedBrief uses React Fragment to wrap <section> + modal — avoids extra DOM wrapper while keeping modal at component root"
  - "DownloadCard renders original <a download> for ungated cards (gated=false) to preserve native browser download behavior for image assets"
  - "ToolkitSection uses array-spread ({...asset}) pattern so gated field flows automatically when added to toolkitAssets entries"

patterns-established:
  - "Gated prop pattern: optional boolean (default false) on download components — zero call-site changes for existing ungated cards"
  - "alreadySubmitted state initialized false + useEffect to read localStorage — prevents hydration mismatch on static export"

requirements-completed: [LEAD-01]

# Metrics
duration: 5min
completed: 2026-05-08
---

# Phase 17 Plan 03: FeaturedBrief and DownloadCard Gated Downloads Summary

**FeaturedBrief converted to Client Component with gated PDF button; DownloadCard given optional gated prop — PDF/DOCX toolkit assets gated, PNG asset ungated, completing all 4 download surfaces**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-08T20:10:37Z
- **Completed:** 2026-05-08T20:15:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- FeaturedBrief.tsx is now a Client Component — first-time visitors see the LeadCaptureModal, returning submitters get direct window.open on the featured brief PDF
- DownloadCard.tsx has an optional `gated` prop (default false) — PDF/DOCX toolkit assets show the modal, PNG social card renders the original direct anchor
- ToolkitSection.tsx updated to pass `gated: true` on AMR Fact Sheet (PDF) and Advocacy Letter Template (DOCX); Social Media Card (PNG) has no gated prop

## Task Commits

Each task was committed atomically:

1. **Task 1 + Task 2: Gate FeaturedBrief and DownloadCard** - `05337ba` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `app/components/sections/FeaturedBrief.tsx` - 'use client', useState/useEffect for modal gating, button replaces anchor, LeadCaptureModal mounted via Fragment
- `app/components/take-action/DownloadCard.tsx` - 'use client', optional gated prop, conditional button vs anchor render, modal mount
- `app/components/take-action/ToolkitSection.tsx` - gated: true added to PDF and DOCX toolkitAsset entries

## Decisions Made
- FeaturedBrief uses React Fragment (`<>`) to wrap `<section>` and modal — avoids introducing an extra div wrapper while keeping modal at component root outside the section
- DownloadCard renders original `<a download>` for ungated cards to preserve native browser download behavior for image assets (PNG)
- ToolkitSection array-spread pattern (`{...asset}`) means adding `gated` field to array entries flows automatically to DownloadCard props with no further changes

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — TypeScript check passed with zero errors; build compiled all 25 static pages cleanly.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- All 4 PDF download surfaces are now gated behind LeadCaptureModal: DownloadButton (Plan 02), BriefCard (Plan 02), FeaturedBrief (this plan), DownloadCard (this plan)
- Phase 17 complete — lead capture wall is live across all surfaces
- Phase 18 (Expert Registration) is the next phase

---
*Phase: 17-lead-capture-pre-download-access-wall-collecting-name-role-email-and-audience-category-via-gas*
*Completed: 2026-05-08*
