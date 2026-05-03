---
phase: 10-take-action-page
plan: "02"
subsystem: ui
tags: [next.js, react, tailwind, lucide-react, google-apps-script, static-export]

# Dependency graph
requires:
  - phase: 10-01
    provides: ToolkitSection stub, /take-action page shell, PledgeForm, CommitmentForm, form-config module

provides:
  - DownloadCard component with same-origin download anchor and format badge
  - ToolkitSection with 3-column responsive grid (AMR Fact Sheet, Advocacy Letter Template, Social Media Card)
  - public/toolkit/ directory tracked in git (ready for real asset drops)
  - GAS form handler script (resources/gas-form-handler.js) routing all three forms via single endpoint

affects: [phase-11, phase-12, phase-13]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - DownloadCard: same-origin /toolkit/ href with HTML download attribute for browser-native file save (no JS required)
    - GAS formType routing: single NEXT_PUBLIC_GAS_URL endpoint; form payload includes formType field; GAS script routes to named sheet tab
    - Toolkit asset array: typed constant in Server Component — no JSON file needed for small static datasets

key-files:
  created:
    - app/components/take-action/DownloadCard.tsx
    - app/components/take-action/ToolkitSection.tsx (full implementation replacing stub)
    - public/toolkit/.gitkeep
    - resources/gas-form-handler.js
  modified:
    - app/components/take-action/PledgeForm.tsx
    - app/components/take-action/CommitmentForm.tsx
    - app/components/sections/NewsletterSignup.tsx
    - app/lib/form-config.ts

key-decisions:
  - "Single GAS endpoint (NEXT_PUBLIC_GAS_URL) with formType routing replaces two separate env vars — simplifies Vercel config and GAS deployment"
  - "DownloadCard uses same-origin /toolkit/ hrefs — browser download attribute only works for same-origin URLs; public/ serves files from same origin"
  - "public/toolkit/.gitkeep commits the directory so Vercel includes it; real asset files (PDF, DOCX, PNG) are dropped without code changes"

patterns-established:
  - "Download pattern: <a href='/toolkit/file.ext' download='file.ext'> — no JS, works in static export, triggers browser save dialog"
  - "GAS multi-form routing: formType field in payload + switch/if block in GAS script + named sheet tabs — extend by adding a new formType value"

requirements-completed: [ACTN-04]

# Metrics
duration: ~30min (including post-checkpoint refactor)
completed: 2026-05-03
---

# Phase 10 Plan 02: Take Action Page Summary

**Advocacy Toolkit section with 3-column DownloadCard grid completing /take-action, plus a GAS form-handler consolidating all three forms (newsletter, pledge, commitment) onto a single endpoint with sheet-tab routing**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-05-02T20:15:00Z
- **Completed:** 2026-05-03T06:57:00Z
- **Tasks:** 2 (Task 1: auto; Task 2: human-verify checkpoint — approved)
- **Files modified:** 8

## Accomplishments

- DownloadCard component renders title, format badge ([PDF]/[DOCX]/[PNG]), description, and a same-origin download anchor — no JS required, works in static export
- ToolkitSection replaces the Plan 01 stub with a full implementation: heading, blurb, and 3-column responsive grid (lg:grid-cols-3, stacks to 1 on mobile)
- public/toolkit/ directory committed via .gitkeep — ready to receive real AMR Fact Sheet, Advocacy Letter Template, and Social Media Card files without any code changes
- GAS form handler script created in resources/ routing all three forms to named Google Sheets tabs via a single endpoint (formType field in payload)
- /take-action page passed full human visual verification — hero, form cards, accordion behavior, toolkit section, header button, and homepage AudienceCTAs deep links all confirmed

## Task Commits

1. **Task 1: DownloadCard component, ToolkitSection, public/toolkit/ directory** - `c9c702e` (feat)
2. **Task 2: Phase 10 visual verification** - User approved (checkpoint passed — no commit)
3. **Post-checkpoint: Form consolidation refactor** - `7f55a94` (refactor)

## Files Created/Modified

- `app/components/take-action/DownloadCard.tsx` — Reusable card: title, format badge, description, same-origin download anchor with lucide Download icon
- `app/components/take-action/ToolkitSection.tsx` — Server Component: heading, blurb, typed toolkitAssets array, 3-column DownloadCard grid
- `public/toolkit/.gitkeep` — Empty file committing the toolkit asset directory
- `resources/gas-form-handler.js` — GAS script: single doPost() handler with formType routing to named sheet tabs (newsletter, pledge, commitment)
- `app/lib/form-config.ts` — Updated: single NEXT_PUBLIC_GAS_URL replaces two separate URL env vars
- `app/components/take-action/PledgeForm.tsx` — Updated: formType: 'pledge' added to POST payload
- `app/components/take-action/CommitmentForm.tsx` — Updated: formType: 'commitment' added to POST payload
- `app/components/sections/NewsletterSignup.tsx` — Updated: uses NEXT_PUBLIC_GAS_URL with formType: 'newsletter'

## Decisions Made

- **Single GAS endpoint:** NEXT_PUBLIC_GAS_PLEDGE_URL and NEXT_PUBLIC_GAS_COMMITMENT_URL removed in favour of a single NEXT_PUBLIC_GAS_URL. Each form POST includes a formType field ('newsletter' | 'pledge' | 'commitment'). GAS script routes to named sheet tabs. Rationale: one script deployment, one Vercel env var, easier to extend with new form types.
- **Same-origin /toolkit/ download paths:** Browser `download` attribute is spec-limited to same-origin URLs. Since public/toolkit/ is served from the same origin as the app, relative paths (/toolkit/file.ext) are used — not absolute external URLs. This ensures the browser triggers a file save dialog rather than navigation.
- **public/toolkit/.gitkeep:** Empty sentinel file ensures the directory is committed and present in the Vercel build output. Real assets are dropped by the user without any code changes required.

## Deviations from Plan

### Post-Checkpoint Refactor (Out-of-Plan Addition)

**[Refactor] Consolidated all forms onto single GAS endpoint with formType routing**
- **Found during:** Post-approval (after Task 2 checkpoint)
- **Context:** User performed the refactor (commit 7f55a94) between the checkpoint and this continuation. The original plan specified NEXT_PUBLIC_GAS_PLEDGE_URL and NEXT_PUBLIC_GAS_COMMITMENT_URL as separate env vars; the refactor collapses these into a single NEXT_PUBLIC_GAS_URL used by all three forms.
- **Fix:** form-config.ts updated to single URL; PledgeForm, CommitmentForm, and NewsletterSignup each pass a formType discriminator; resources/gas-form-handler.js created as the GAS-side implementation
- **Files modified:** app/lib/form-config.ts, app/components/take-action/PledgeForm.tsx, app/components/take-action/CommitmentForm.tsx, app/components/sections/NewsletterSignup.tsx, resources/gas-form-handler.js
- **Committed in:** 7f55a94

---

**Total deviations:** 1 post-checkpoint refactor (user-initiated, documented for continuity)
**Impact on plan:** Reduces Vercel env var count from 2 to 1 and centralizes GAS routing logic. No component-level behavioral change visible to users.

## Issues Encountered

None during planned Task 1 execution. Build passed with zero TypeScript errors. All download anchors use /toolkit/ same-origin paths as specified.

## User Setup Required

**External GAS endpoint requires manual configuration before forms are live.**

To wire up the Google Sheets backend:

1. Open Google Sheets → create a new spreadsheet with three tabs named: `newsletter`, `pledge`, `commitment`
2. Open Apps Script (Extensions > Apps Script), paste the contents of `resources/gas-form-handler.js`, deploy as a Web App (execute as: Me; access: Anyone)
3. Copy the deployed Web App URL
4. Add to Vercel environment variables: `NEXT_PUBLIC_GAS_URL=<your-web-app-url>`
5. Add the same to `.env.local` for local testing
6. Redeploy on Vercel to pick up the new env var

## Next Phase Readiness

- Phase 10 complete — /take-action page is fully built and visually verified
- public/toolkit/ directory is committed; drop real asset files (amr-fact-sheet.pdf, amr-letter-template.docx, amr-social-card.png) when ready
- NEXT_PUBLIC_GAS_URL must be configured in Vercel before form submissions go live
- Phase 11 (Interactive Tools) can begin immediately — no blocking dependencies from Phase 10

---
*Phase: 10-take-action-page*
*Completed: 2026-05-03*
