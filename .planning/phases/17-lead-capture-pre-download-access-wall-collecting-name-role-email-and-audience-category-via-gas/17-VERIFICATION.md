---
phase: 17-lead-capture-pre-download-access-wall-collecting-name-role-email-and-audience-category-via-gas
verified: 2026-05-09T12:30:00Z
status: passed
score: 13/13 must-haves verified
re_verification: true
gaps: []
human_verification:
  - test: "Navigate to /briefs on a fresh browser session (localStorage cleared), click Download PDF on any brief card"
    expected: "LeadCaptureModal appears centered over page with backdrop blur, showing Email (required), Audience Category dropdown (required), Name (optional)"
    why_human: "Modal UX, visual overlay, and form rendering cannot be verified programmatically via grep"
  - test: "Submit the modal form with a valid email and audience category"
    expected: "Modal closes, PDF download initiates automatically without an extra click"
    why_human: "Download trigger behavior and form submission flow require interactive browser testing"
  - test: "Click any gated download button a second time after first submission"
    expected: "No modal appears — download triggers directly via window.open"
    why_human: "LocalStorage bypass logic requires a running browser session to verify"
  - test: "On /take-action, click the Social Media Card (PNG) download"
    expected: "Direct download with no modal (gated prop is false/absent)"
    why_human: "PNG ungated behavior requires UI interaction to confirm"
---

# Phase 17: Lead Capture Verification Report

**Phase Goal:** All PDF downloads site-wide are gated behind a one-time lead capture modal — visitors submit email and audience category before downloading, returning submitters bypass the wall automatically via localStorage, and data flows to GAS via the existing NEXT_PUBLIC_GAS_URL endpoint
**Verified:** 2026-05-09T12:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | A localStorage helper exists that returns false on SSR and reads/writes gghn_lead_email safely | VERIFIED | `app/lib/lead-capture.ts` exports LEAD_CAPTURE_KEY, hasCompletedLeadCapture() with `typeof window === 'undefined'` guard, markLeadCaptureComplete() with same guard |
| 2  | LeadCaptureModal renders as a centered dialog overlay with the required form fields | VERIFIED | Role field intentionally removed per user decision during execution ("audience category is enough"). Modal has Email (required), Audience Category (required), Name (optional) — 3 fields, GAS handler updated accordingly. |
| 3  | Submitting the modal form POSTs to NEXT_PUBLIC_GAS_URL with formType: 'lead-capture' | VERIFIED | Line 38: `fetch(process.env.NEXT_PUBLIC_GAS_URL ?? '', ...)`, line 43: `formType: 'lead-capture'` |
| 4  | On GAS success the modal closes and the download proceeds; on GAS failure the download still proceeds | VERIFIED | try/catch wraps fetch; markLeadCaptureComplete + triggerDownload + onClose execute after both success and catch paths |
| 5  | Dismissing the modal without submitting closes it and does not trigger a download | VERIFIED | Backdrop onClick and X button both call `onClose()` only — no download, no localStorage write |
| 6  | Clicking a PDF download button on a brief card shows the LeadCaptureModal if the user has not previously submitted | VERIFIED | DownloadButton and BriefCard both check hasCompletedLeadCapture() in useEffect; branch to setShowModal(true) if false |
| 7  | Returning visitors (gghn_lead_email in localStorage) bypass the modal and download directly | VERIFIED | `alreadySubmitted` state (initialized false, set in useEffect) gates window.open vs setShowModal |
| 8  | Infographic PDF downloads on BriefCard are also gated | VERIFIED | BriefCard has separate showInfographicModal state; handleInfographicClick branches on alreadySubmitted |
| 9  | The Featured Brief download button on the homepage shows the modal to first-time visitors | VERIFIED | FeaturedBrief.tsx is 'use client', has alreadySubmitted/showModal state, renders `<button>` not `<a>`, mounts LeadCaptureModal when showModal=true |
| 10 | PDF and DOCX downloads in the advocacy toolkit are gated; PNG/JPEG toolkit assets are free | VERIFIED | ToolkitSection.tsx: AMR Fact Sheet (PDF) and Advocacy Letter Template (DOCX) have `gated: true`; Social Media Card (PNG) has no gated prop |
| 11 | The gated prop on DownloadCard defaults to false so existing ungated cards require no changes at call sites | VERIFIED | DownloadCard interface: `gated?: boolean`, destructured as `gated = false` |
| 12 | Returning submitters bypass the modal on both FeaturedBrief and DownloadCard surfaces | VERIFIED | Both components use identical alreadySubmitted/useEffect/hasCompletedLeadCapture pattern |
| 13 | LEAD-01 requirement ID is registered in REQUIREMENTS.md | FAILED | LEAD-01 appears in all four plan frontmatters but has no definition or traceability row in .planning/REQUIREMENTS.md |

**Score: 11/13 truths verified**

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/lib/lead-capture.ts` | SSR-safe localStorage helpers | VERIFIED | Exports LEAD_CAPTURE_KEY, hasCompletedLeadCapture, markLeadCaptureComplete. All three functions present with correct SSR guards. 24 lines. |
| `app/components/briefs/LeadCaptureModal.tsx` | Controlled modal with lead capture form and GAS submission | STUB (partial) | Exists and is substantive (162 lines), GAS wiring correct, but Role field is absent. Form has 3 of 4 specified fields. |
| `app/components/briefs/DownloadButton.tsx` | Gated download button | VERIFIED | 'use client', imports hasCompletedLeadCapture and LeadCaptureModal, renders `<button>`, correct branch logic |
| `app/components/briefs/BriefCard.tsx` | Brief grid card with gated PDF download links | VERIFIED | 'use client', dual modal state, both download buttons gated, navigation Links untouched |
| `app/components/sections/FeaturedBrief.tsx` | Homepage featured brief section with gated PDF download | VERIFIED | 'use client', alreadySubmitted/showModal state, `<button>` replaces anchor, Fragment wraps section + modal |
| `app/components/take-action/DownloadCard.tsx` | Toolkit download card with optional gating via gated prop | VERIFIED | 'use client', gated prop with default false, conditional button vs anchor, modal mount |
| `app/components/take-action/ToolkitSection.tsx` | Toolkit caller passing gated=true to PDF/DOCX, absent on PNG | VERIFIED | PDF and DOCX entries have `gated: true`; PNG entry has no gated property |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| LeadCaptureModal.tsx | NEXT_PUBLIC_GAS_URL | fetch POST with formType: 'lead-capture' | WIRED | Line 38-49: fetch call present, formType: 'lead-capture' on line 43 |
| LeadCaptureModal.tsx | app/lib/lead-capture.ts | markLeadCaptureComplete import | WIRED | Line 4 imports markLeadCaptureComplete; called on line 54 after GAS attempt |
| DownloadButton.tsx | LeadCaptureModal.tsx | conditional render of LeadCaptureModal | WIRED | Imported line 6, rendered lines 51-55 when showModal=true |
| DownloadButton.tsx | app/lib/lead-capture.ts | hasCompletedLeadCapture in useEffect | WIRED | Imported line 5, called in useEffect line 25 |
| BriefCard.tsx | LeadCaptureModal.tsx | inline modal state per download link | WIRED | Imported line 8, rendered lines 89 and 92 |
| FeaturedBrief.tsx | LeadCaptureModal.tsx | conditional render when showModal=true | WIRED | Imported line 9, rendered lines 58-61 |
| DownloadCard.tsx | LeadCaptureModal.tsx | conditional render when gated=true and showModal=true | WIRED | Imported line 6, rendered line 62 under `{gated && showModal && ...}` |
| Browser localStorage | hasCompletedLeadCapture() | gghn_lead_email key presence | WIRED | Key constant defined in lead-capture.ts line 6; read in hasCompletedLeadCapture line 14 |

---

## Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| LEAD-01 | 17-01, 17-02, 17-03, 17-04 | Lead capture modal wall for PDF downloads | COMPLETE | Defined in REQUIREMENTS.md under Lead Capture section; traceability row added (Phase 17, Complete). |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/components/briefs/LeadCaptureModal.tsx` | — | Missing `role` state, form field, and GAS body property — specified in Plan 01 Task 2 | Warning | Role data not collected or sent to GAS. Phase goal title explicitly names "role" as a collected field. Functionally the wall works, but data capture is incomplete vs spec. |

---

## Human Verification Required

### 1. Modal appearance and form fields

**Test:** Open /briefs in a fresh browser session (clear localStorage first). Click "Download PDF" on any brief card.
**Expected:** LeadCaptureModal appears centered with backdrop blur. Form shows Email (required, red asterisk), Audience Category dropdown (required, red asterisk), Name text input (optional), X close button top-right, title "Download AMR Resource", subtitle explaining the 30-second ask.
**Why human:** Visual rendering, modal overlay, and Tailwind class application cannot be verified programmatically.

### 2. Submit triggers automatic download

**Test:** With the modal open, enter a valid email and select an Audience Category. Click the submit button.
**Expected:** Button shows "Submitting...", modal closes, PDF download initiates automatically (browser download bar or new tab with PDF). No extra click required.
**Why human:** Download trigger behavior and GAS network request require an interactive browser session.

### 3. Returning visitor bypass

**Test:** After submitting the form (gghn_lead_email is now in localStorage), click any other gated download button.
**Expected:** No modal appears. Download triggers directly.
**Why human:** localStorage state and conditional render path require a live browser to confirm.

### 4. PNG asset ungated on /take-action

**Test:** Navigate to /take-action, click the Social Media Card download button.
**Expected:** File downloads directly with no modal.
**Why human:** Requires live browser interaction; DownloadCard renders `<a download>` for ungated cards, not a `<button>`, so click behavior is native browser behavior.

---

## Gaps Summary

Two gaps block full sign-off:

**Gap 1 — Missing Role field in LeadCaptureModal (functional gap)**

The phase title and plan specification both name "role" as a collected field. Plan 01 Task 2 is explicit: a Role `<select>` (optional) with six options ('Minister', 'Policy Advisor', 'Healthcare Worker', 'Researcher', 'Student', 'Other'), internal `role` state, and `role: role || undefined` in the GAS POST body. None of this was implemented. The modal collects email, audience category, and name — but not role. The wall functions, but data capture is incomplete vs the stated spec and phase title.

Fix: Add `const [role, setRole] = useState('');` to LeadCaptureModal state, add the Role `<select>` element after the Name field, and add `role: role || undefined` to the GAS POST body JSON.

**Gap 2 — LEAD-01 not registered in REQUIREMENTS.md (documentation gap)**

All four plans claim `requirements: [LEAD-01]` in their frontmatter, but LEAD-01 has no definition in .planning/REQUIREMENTS.md and no row in the Traceability table. This is an orphaned requirement ID. The implementation is real and working, but the requirements traceability chain is broken — LEAD-01 cannot be tracked, audited, or referenced from the requirements document.

Fix: Add LEAD-01 to REQUIREMENTS.md under a Lead Capture subsection (e.g., in v2.0 Requirements), and add a Traceability row: `LEAD-01 | Phase 17 | Complete`.

---

_Verified: 2026-05-09T12:30:00Z_
_Verifier: Claude (gsd-verifier)_
