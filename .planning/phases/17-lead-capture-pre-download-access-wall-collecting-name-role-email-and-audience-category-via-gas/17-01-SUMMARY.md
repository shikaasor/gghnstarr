---
phase: 17-lead-capture-pre-download-access-wall-collecting-name-role-email-and-audience-category-via-gas
plan: "01"
subsystem: ui
tags: [localStorage, modal, GAS, form, lead-capture]

# Dependency graph
requires:
  - phase: 10-take-action-page
    provides: NEXT_PUBLIC_GAS_URL single-endpoint pattern + formType routing + PledgeForm fetch pattern

provides:
  - app/lib/lead-capture.ts — SSR-safe localStorage helpers (LEAD_CAPTURE_KEY, hasCompletedLeadCapture, markLeadCaptureComplete)
  - app/components/briefs/LeadCaptureModal.tsx — controlled modal with lead capture form and GAS submission

affects:
  - 17-02-PLAN (wire modal into BriefCard download buttons)
  - 17-03-PLAN (wire modal into DownloadButton on brief detail pages)
  - 17-04-PLAN (wire modal into toolkit download buttons on take-action page)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Silent-fail GAS submit: try/catch fetch; proceed with download regardless of outcome"
    - "SSR guard pattern: typeof window === 'undefined' check before localStorage access"
    - "formType routing: single NEXT_PUBLIC_GAS_URL endpoint differentiated by formType field"
    - "Download trigger pattern: createElement('a'), target='_blank', append/click/remove"

key-files:
  created:
    - app/lib/lead-capture.ts
    - app/components/briefs/LeadCaptureModal.tsx
  modified: []

key-decisions:
  - "LeadCaptureModal silent-fail on GAS error: download always proceeds after submit to avoid blocking access"
  - "Dismiss path (backdrop click or X) calls onClose() only — no download, no localStorage write"
  - "Inline SVG X icon used instead of lucide-react X to avoid import dependency on a library not yet confirmed as available in this component"

patterns-established:
  - "Lead capture gating: hasCompletedLeadCapture() checked by parent; if false, render modal instead of direct download"
  - "Modal dismiss vs submit: onClose called on both paths; parent decides what to show after dismiss"

requirements-completed:
  - LEAD-01

# Metrics
duration: ~8min
completed: 2026-05-08
---

# Phase 17 Plan 01: Lead Capture Foundation Summary

**SSR-safe localStorage helpers and LeadCaptureModal with silent-fail GAS submission, download-always guarantee, and dismiss-without-download behavior**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-08T00:00:00Z
- **Completed:** 2026-05-08T00:08:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created `app/lib/lead-capture.ts` with three SSR-guarded exports: key constant, read helper, write helper
- Created `app/components/briefs/LeadCaptureModal.tsx` with all required form fields, GAS submission with silent-fail, and download-always post-submit logic
- TypeScript type-check and `npm run build` both pass cleanly with the new files

## Task Commits

Each task was committed atomically:

1. **Task 1: Create lead-capture.ts localStorage utility** - `86829e9` (feat)
2. **Task 2: Create LeadCaptureModal component** - `38e2ffc` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `app/lib/lead-capture.ts` - LEAD_CAPTURE_KEY constant, hasCompletedLeadCapture() and markLeadCaptureComplete() with SSR guards
- `app/components/briefs/LeadCaptureModal.tsx` - Controlled modal accepting href + onClose; form with email (required), audienceCategory select (required), name (optional), role select (optional); GAS POST with formType: 'lead-capture'; download triggered on both GAS success and failure

## Decisions Made
- Silent-fail on GAS error: download always proceeds after form submit — user-facing access is never blocked by a backend issue
- Dismiss path (backdrop click or X) calls onClose() only with no download or localStorage write — parent is responsible for showing inline message after dismiss
- Inline SVG X icon instead of lucide-react import — keeps component self-contained without adding a dependency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required. NEXT_PUBLIC_GAS_URL is already set in Vercel from Phase 10.

## Next Phase Readiness
- Both artifacts are ready for import by Wave 2 plans (17-02, 17-03, 17-04)
- Wave 2 plans are pure wiring: check hasCompletedLeadCapture(), if false render LeadCaptureModal with the PDF href and an onClose handler
- No business logic left to figure out — modal handles GAS, download, and localStorage internally

---
*Phase: 17-lead-capture-pre-download-access-wall-collecting-name-role-email-and-audience-category-via-gas*
*Completed: 2026-05-08*
