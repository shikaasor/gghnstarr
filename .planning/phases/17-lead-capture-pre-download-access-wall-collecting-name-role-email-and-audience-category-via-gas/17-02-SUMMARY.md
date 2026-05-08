---
phase: 17-lead-capture-pre-download-access-wall-collecting-name-role-email-and-audience-category-via-gas
plan: "02"
subsystem: lead-capture
tags: [lead-capture, gated-download, brief-card, download-button, client-component]
dependency_graph:
  requires: [17-01]
  provides: [gated-DownloadButton, gated-BriefCard]
  affects: [app/components/briefs/DownloadButton.tsx, app/components/briefs/BriefCard.tsx]
tech_stack:
  added: []
  patterns: [localStorage-gate, conditional-modal, SSR-safe-init-false]
key_files:
  modified:
    - app/components/briefs/DownloadButton.tsx
    - app/components/briefs/BriefCard.tsx
decisions:
  - "DownloadButton: <a> replaced with <button type=button> — programmatic window.open in onClick is synchronous so popup blockers do not interfere on bypass path"
  - "BriefCard: alreadySubmitted initialized false (not from localStorage directly) — avoids hydration mismatch on static export, mirrors ConferenceBar.tsx pattern"
  - "BriefCard: separate showPdfModal and showInfographicModal booleans — two independent download surfaces on each card"
metrics:
  duration: "~2 min"
  completed: "2026-05-08"
  tasks: 2
  files: 2
---

# Phase 17 Plan 02: Gated DownloadButton and BriefCard Summary

**One-liner:** Both brief download surfaces (detail page DownloadButton + grid BriefCard) now gate PDF access behind LeadCaptureModal on first visit, with localStorage bypass for returning submitters.

## What Was Built

### Task 1: DownloadButton gated (ccd159b)

Rewrote `DownloadButton.tsx` from a plain `<a>` tag to a `<button>` element with conditional modal display:

- `alreadySubmitted` state initialized as `false` (SSR-safe), set in `useEffect` via `hasCompletedLeadCapture()`
- `handleClick` fires `trackPdfDownload` on every click, then branches: bypass with `window.open` or show modal
- `LeadCaptureModal` rendered conditionally — `{showModal && <LeadCaptureModal href={href} onClose={...} />}`
- Props interface unchanged — all callers continue to work without modification

### Task 2: BriefCard PDF links gated (85c7515)

Converted `BriefCard.tsx` from Server Component to Client Component with two gated download buttons:

- Added `'use client'` directive at top of file
- Single `alreadySubmitted` state with `useEffect`/`hasCompletedLeadCapture()` pattern (shared across both buttons)
- `showPdfModal` and `showInfographicModal` booleans for independent modal state per download link
- Both `<a>` download tags replaced with `<button>` elements; navigation `Link` elements unchanged
- Infographic JPEG images on `/awareness` are completely unrelated to this file — unaffected

## Verification

- `npx tsc --noEmit` — zero errors on both tasks
- `npm run build` — static export succeeds, all pages generated
- DownloadButton renders `<button>` (not `<a>`)
- BriefCard has `'use client'` at top, two modal state booleans present

## Deviations from Plan

None — plan executed exactly as written.
