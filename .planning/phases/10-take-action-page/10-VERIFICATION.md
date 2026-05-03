---
phase: 10-take-action-page
verified: 2026-05-02T00:00:00Z
status: human_needed
score: 10/10 must-haves verified
re_verification: false
human_verification:
  - test: "Submit the Pledge form with valid test data (use the real GAS endpoint in .env.local)"
    expected: "Card collapses, locks with green CheckCircle badge, and success toast appears at top of page; GAS script routes row to the 'pledge' sheet tab"
    why_human: "GAS endpoint is a live external service — cannot verify end-to-end form submission or sheet routing programmatically"
  - test: "Submit the Commitment form with valid test data"
    expected: "Card collapses, locks with green CheckCircle badge, and success toast appears; GAS script routes row to the 'commitment' sheet tab"
    why_human: "Same reason as above — live GAS call and sheet verification"
  - test: "Navigate to /take-action#commitment directly in browser"
    expected: "Commitment card is expanded on load; Pledge card is collapsed"
    why_human: "Hash-based auto-expand via useEffect on mount — requires live browser to verify timing and state"
  - test: "Confirm NEXT_PUBLIC_GAS_URL is wired to the correct deployed GAS script and sheet has 'pledge' and 'commitment' tabs"
    expected: "A test submission lands in the right sheet tab; the GAS doPost() handler is live at the URL in .env.local"
    why_human: "External service configuration cannot be verified from codebase alone"
---

# Phase 10: Take Action Page Verification Report

**Phase Goal:** A visitor motivated to act against AMR can submit a public pledge, a healthcare worker can record a prescribing commitment, and anyone can download advocacy toolkit assets — all from a single /take-action page

**Verified:** 2026-05-02
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #   | Truth | Status | Evidence |
| --- | ----- | ------ | -------- |
| 1   | /take-action page exists with hero, two form cards, and toolkit section | VERIFIED | `app/take-action/page.tsx` — server component with three sections: hero (`bg-navy-950`), forms (`<ActionCardGrid />`), toolkit (`<ToolkitSection />`) |
| 2   | Pledge card is pre-expanded on load with no hash | VERIFIED | `ActionCardGrid.tsx` line 12: `useState<CardId \| null>('pledge')` — default state is `'pledge'` |
| 3   | Navigating to /take-action#commitment auto-expands Commitment card | VERIFIED | `ActionCardGrid.tsx` lines 16-21: `useEffect` on mount reads `window.location.hash`, strips `#`, sets `expanded` if value is `'pledge'` or `'commitment'` |
| 4   | Submitting a valid form collapses the card, locks it, and shows a toast | VERIFIED | `handleSuccess()` in `ActionCardGrid.tsx` line 28-32: `setExpanded(null)`, `setLocked(prev => new Set(prev).add(id))`, `setToast({message})`. PledgeForm calls `onSuccess()` on GAS success (line 65-67). |
| 5   | A locked card cannot be re-opened | VERIFIED | `handleToggle()` line 23-25: `if (locked.has(id)) return` — locked cards are also `disabled={isLocked}` on the button. |
| 6   | Submission error shows inline error; form stays open | VERIFIED | Both forms: `setState(result)` after GAS attempt — on `'error'`, renders `<p>Submission failed. Please try again.</p>` with AlertCircle icon. `onSuccess()` is only called on `'success'` path. |
| 7   | Header nav shows "Take Action" as a gold-filled button | VERIFIED | `Header.tsx` line 18: `{ href: '/take-action', label: 'Take Action', isButton: true }`. Desktop renders `bg-amr-gold text-navy-950` Link; mobile renders `text-navy-950 bg-amr-gold` Link. |
| 8   | AudienceCTAs Policymaker card links to /take-action#pledge (live); Healthcare Worker card links to /take-action#commitment (live) | VERIFIED | `AudienceCTAs.tsx` line 32: `{ label: 'Take Action', href: '/take-action#pledge', live: true }`. Line 44: `{ label: 'Take Action', href: '/take-action#commitment', live: true }`. Both render as live `<Link>` elements. |
| 9   | GA4 events fire on pledge and commitment submit | VERIFIED | `analytics.ts` lines 18-23: `trackPledgeSubmit()` calls `sendGAEvent('event', 'pledge_submit', {})`. `trackCommitmentSubmit()` calls `sendGAEvent('event', 'commitment_submit', {})`. Both imported and called in success paths of their respective forms. |
| 10  | Advocacy Toolkit shows 3 download cards with same-origin /toolkit/ hrefs and download attribute | VERIFIED | `ToolkitSection.tsx` maps 3 assets to `<DownloadCard>`. `DownloadCard.tsx` renders `<a href={href} download={filename}>` with `/toolkit/*.pdf/docx/png` same-origin paths. `public/toolkit/.gitkeep` committed (git ls-files confirmed). |

**Score:** 10/10 truths verified

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact | Status | Details |
| -------- | ------ | ------- |
| `app/take-action/page.tsx` | VERIFIED | Server component, 42 lines, renders hero + ActionCardGrid + ToolkitSection with metadata |
| `app/components/take-action/ActionCardGrid.tsx` | VERIFIED | 143 lines, 'use client', manages `expanded`/`locked`/`toast` state, hash useEffect, grid render |
| `app/components/take-action/PledgeForm.tsx` | VERIFIED | 151 lines, 4 required fields (name, country, role, commitmentStatement), GAS fetch, trackPledgeSubmit on success |
| `app/components/take-action/CommitmentForm.tsx` | VERIFIED | 151 lines, 4 required fields (name, facility, specialty, specificCommitment), GAS fetch, trackCommitmentSubmit on success |
| `app/components/take-action/ActionToast.tsx` | VERIFIED | 27 lines, fixed-position, auto-dismiss 5000ms via useEffect, role="status" aria-live="polite" |
| `app/lib/form-config.ts` | VERIFIED | Exports `formConfig.formUrl` from `NEXT_PUBLIC_GAS_URL` env var (post-refactor from Plan 02); dev console.warn if unset |
| `app/lib/analytics.ts` | VERIFIED | `trackPledgeSubmit()` active (sendGAEvent). `trackCommitmentSubmit()` added and active. Neither is a no-op. |

### Plan 02 Artifacts

| Artifact | Status | Details |
| -------- | ------ | ------- |
| `app/components/take-action/ToolkitSection.tsx` | VERIFIED | Full implementation (not stub), 47 lines, imports DownloadCard, renders heading + blurb + 3-column grid |
| `app/components/take-action/DownloadCard.tsx` | VERIFIED | 31 lines, accepts title/description/format/href/filename, renders format badge + same-origin download anchor |
| `public/toolkit/.gitkeep` | VERIFIED | File exists on disk and is tracked in git (`git ls-files` confirmed `public/toolkit/.gitkeep`) |

---

## Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `ActionCardGrid.tsx` | `window.location.hash` | `useEffect` on mount | WIRED | Line 17: `window.location.hash.replace('#', '')` read in mount effect; sets `expanded` for `'pledge'` or `'commitment'` |
| `PledgeForm.tsx` | `formConfig.formUrl` | `fetch` with `redirect: 'follow'` | WIRED | Line 23: `redirect: 'follow'`; line 56: `submitToGAS(formConfig.formUrl, {...})`; guard on line 51 returns `'error'` if URL empty |
| `CommitmentForm.tsx` | `formConfig.formUrl` | `fetch` with `redirect: 'follow'` | WIRED | Identical pattern to PledgeForm; `formType: 'commitment'` discriminator in payload |
| `AudienceCTAs.tsx` | `/take-action#pledge` and `/take-action#commitment` | `live: true` secondaryLink | WIRED | Lines 32, 44: both hrefs set, both `live: true`, rendered as `<Link>` not disabled `<span>` |
| `ToolkitSection.tsx` | `DownloadCard.tsx` | `array.map()` | WIRED | Line 1: import, line 42: `<DownloadCard key={asset.filename} {...asset} />` in map |
| `DownloadCard.tsx` | `/toolkit/*.pdf/docx/png` | `<a href download>` | WIRED | Line 23-24: `href={href} download={filename}` — same-origin paths, browser triggers file save |

**Note on Plan 01 key_link mismatch:** Plan 01 specified `pledgeUrl` and `commitmentUrl` as the config properties. The Plan 02 post-checkpoint refactor replaced these with a single `formUrl` (backed by `NEXT_PUBLIC_GAS_URL`). The wiring is correct in the actual code — both forms reference `formConfig.formUrl`. No stale references to `pledgeUrl` or `commitmentUrl` exist in the codebase.

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| ACTN-01 | Plan 01 | Dedicated /take-action page with three distinct sections: pledge, prescribing commitment, advocacy toolkit | SATISFIED | `app/take-action/page.tsx` has three sections: hero+forms (pledge + commitment cards in ActionCardGrid), toolkit section (ToolkitSection) |
| ACTN-02 | Plan 01 | Visitor can submit a public pledge form (name, country, role, commitment statement) via [backend] and receive a confirmation message | SATISFIED with deviation | All 4 fields implemented with required validation. Confirmation = ActionToast (cause-focused message). Backend is GAS, not Formspree as stated in REQUIREMENTS.md — deliberate architectural choice. GAS URL is a real deployed endpoint in `.env.local` (not a placeholder). |
| ACTN-03 | Plan 01 | Healthcare worker can submit prescribing commitment form (name, facility, specialty, specific commitment) via [backend] | SATISFIED with deviation | All 4 fields implemented. Same GAS backend deviation as ACTN-02. `formType: 'commitment'` routes to correct sheet tab. |
| ACTN-04 | Plan 02 | Advocacy toolkit section provides downloadable assets as direct file downloads | SATISFIED | Three cards (AMR Fact Sheet PDF, Advocacy Letter Template DOCX, Social Media Card PNG) with `<a download>` anchors pointing to `/toolkit/` same-origin paths |

**Orphaned requirements check:** REQUIREMENTS.md maps ACTN-01 through ACTN-04 to Phase 10 — all four are claimed in plans. No orphaned requirements.

**Backend deviation note:** REQUIREMENTS.md says "via Formspree" for ACTN-02 and ACTN-03. The implementation uses Google Apps Script. The functional behavior (form submission, server-side persistence, confirmation feedback) is equivalent or better. The REQUIREMENTS.md status markers `[x]` on both items indicate these were accepted as complete. This is a requirements-text mismatch, not a functional gap.

---

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
| ---- | ------- | -------- | ------ |
| None | — | — | No TODO/FIXME/placeholder stubs, no `return null` implementations, no empty handlers found in any take-action component |

**Form state after success:** Both forms call `setState(result)` after the success path — meaning state becomes `'success'`. This is correct; the card collapses via `onSuccess()` calling `handleSuccess()`, so the form is no longer visible. No issue.

---

## Human Verification Required

### 1. End-to-End Pledge Form Submission

**Test:** Fill out the Pledge form with valid data (name, country, role, commitmentStatement of 20+ chars) and click "Sign the Pledge"
**Expected:** Card collapses, locked with green CheckCircle + "Submitted" label, ActionToast appears at top with cause-focused message. In Google Sheets, a new row appears in the "pledge" tab.
**Why human:** GAS is a live external service — codebase shows correct fetch call and URL configuration, but actual sheet routing and GAS script behavior cannot be verified programmatically.

### 2. End-to-End Commitment Form Submission

**Test:** Fill out the Commitment form with valid data (name, facility, specialty, specificCommitment of 20+ chars) and click "Record My Commitment"
**Expected:** Same card lock + toast behavior. New row in the "commitment" sheet tab.
**Why human:** Same reason as above.

### 3. Hash-Based Auto-Expand in Browser

**Test:** Open `http://localhost:3000/take-action#commitment` directly
**Expected:** Page loads with Commitment card expanded, Pledge card collapsed
**Why human:** `useEffect` timing and `window.location.hash` behavior requires a live browser render; cannot be verified from static code analysis alone.

### 4. GAS Script and Sheet Configuration

**Test:** Verify the GAS script at `NEXT_PUBLIC_GAS_URL` (in `.env.local`) is deployed and the Google Sheet has tabs named `newsletter`, `pledge`, and `commitment`
**Expected:** `resources/gas-form-handler.js` is deployed as the active Web App; the sheet has the three named tabs
**Why human:** External Google Workspace resource — no codebase artifact can confirm deployment state.

---

## Summary

Phase 10 goal is structurally achieved. All ten observable truths are supported by substantive, wired code. Every artifact specified in both plans exists at the correct path, contains a full implementation (no stubs), and is connected to its consumers. All four requirement IDs (ACTN-01 through ACTN-04) are covered.

Two points of note:

1. **Backend deviation:** REQUIREMENTS.md specified Formspree; the implementation uses Google Apps Script with a single unified endpoint (`NEXT_PUBLIC_GAS_URL`). The GAS URL in `.env.local` is a real deployed script URL (not a placeholder). The functional contract of both ACTN-02 and ACTN-03 is met. REQUIREMENTS.md marks both `[x]` complete.

2. **Plan 01 vs actual form-config shape:** Plan 01 key_links referenced `pledgeUrl`/`commitmentUrl` properties. These were replaced by a single `formUrl` in the Plan 02 post-checkpoint refactor. The code is internally consistent — no stale references exist.

The four human verification items are needed to confirm the live GAS integration and browser-side hash navigation behavior. All automated checks pass.

---

_Verified: 2026-05-02_
_Verifier: Claude (gsd-verifier)_
