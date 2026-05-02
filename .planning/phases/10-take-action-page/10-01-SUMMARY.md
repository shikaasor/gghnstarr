---
phase: 10-take-action-page
plan: 01
subsystem: ui
tags: [next.js, react, google-apps-script, ga4, forms, lucide-react]

# Dependency graph
requires:
  - phase: 07-content-and-analytics
    provides: analytics.ts GA4 helpers, AudienceCTAs component
  - phase: 08-awareness-hub
    provides: AccordionSection expand/collapse pattern, teal-50 token
provides:
  - /take-action page with hero, two GAS-wired form cards, session locking, hash auto-expand
  - ActionCardGrid client component managing card state
  - PledgeForm and CommitmentForm with GAS fetch submission pattern
  - ActionToast fixed-position auto-dismiss notification
  - form-config.ts pledgeUrl/commitmentUrl env var module
  - trackPledgeSubmit (activated) and trackCommitmentSubmit (new) GA4 events
  - Header "Take Action" gold button nav link
  - AudienceCTAs deep links live at /take-action#pledge and /take-action#commitment
affects:
  - 10-02-toolkit (imports ToolkitSection from same take-action component dir)
  - 11-practical-tools (trackCommitmentSubmit pattern reference)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GAS form submission: fetch POST with redirect:follow + Content-Type text/plain;charset=utf-8 + JSON body"
    - "Card expand/collapse: max-h-0 to max-h-[2000px] with overflow-hidden transition-all duration-300"
    - "Session locking: Set<CardId> state — locked card ignores toggle, shows CheckCircle badge"
    - "Hash-based auto-expand: useEffect on mount reads window.location.hash"
    - "isButton flag on navLinks for differentiated Header rendering"

key-files:
  created:
    - app/take-action/page.tsx
    - app/components/take-action/ActionCardGrid.tsx
    - app/components/take-action/PledgeForm.tsx
    - app/components/take-action/CommitmentForm.tsx
    - app/components/take-action/ActionToast.tsx
    - app/components/take-action/ToolkitSection.tsx
    - app/lib/form-config.ts
  modified:
    - app/lib/analytics.ts
    - app/components/layout/Header.tsx
    - app/components/sections/AudienceCTAs.tsx

key-decisions:
  - "formConfig reads NEXT_PUBLIC_GAS_PLEDGE_URL and NEXT_PUBLIC_GAS_COMMITMENT_URL from env — placeholder URLs in .env.local, real URLs set in Vercel"
  - "Pledge card pre-expanded by default (expanded state init 'pledge'); hash overrides on mount"
  - "Session locking uses Set<CardId> — immutable per session, no re-open after successful submit"
  - "trackCommitmentSubmit added to analytics.ts alongside trackPledgeSubmit activation (both called on GAS success response)"
  - "isButton field on navLinks enables Header to render Take Action as AMR gold button without separate array"

patterns-established:
  - "GAS form pattern: submitToGAS(url, payload) with redirect:follow — same as NewsletterSignup.tsx"
  - "Card locking: handleSuccess collapses expanded, adds to locked Set, sets toast"

requirements-completed:
  - ACTN-01
  - ACTN-02
  - ACTN-03

# Metrics
duration: 3min
completed: 2026-05-02
---

# Phase 10 Plan 01: Take Action Page Core Summary

**Interactive /take-action page with two GAS-wired form cards (Pledge + Prescribing Commitment), session locking, hash auto-expand, AMR gold Header button, and AudienceCTAs deep link wiring**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-02T20:08:23Z
- **Completed:** 2026-05-02T20:11:48Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Built /take-action page with hero section, responsive two-column form card grid, and toolkit slot
- Implemented ActionCardGrid with expand/collapse, session locking, hash auto-expand (#pledge and #commitment), and toast notifications
- Created PledgeForm and CommitmentForm with the proven GAS fetch submission pattern (redirect:follow, text/plain, JSON body) matching NewsletterSignup.tsx
- Activated trackPledgeSubmit GA4 event and added trackCommitmentSubmit; both fire on successful GAS response
- Header nav now shows "Take Action" as an AMR gold filled button in desktop and mobile nav
- AudienceCTAs Policymaker and Healthcare Worker "Take Action" secondary links are live and deep-link to correct hash anchors

## Task Commits

Each task was committed atomically:

1. **Task 1: Page shell, ActionCardGrid, PledgeForm, CommitmentForm, ActionToast, form-config** - `043ea05` (feat)
2. **Task 2: Analytics activation, Header nav button, AudienceCTAs deep link wiring** - `45e0e11` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `app/take-action/page.tsx` — Server Component page shell with metadata, hero, forms, and toolkit sections
- `app/components/take-action/ActionCardGrid.tsx` — Client component: card state, session lock, hash auto-expand, toast
- `app/components/take-action/PledgeForm.tsx` — Pledge form with GAS submission (name, country, role, commitmentStatement)
- `app/components/take-action/CommitmentForm.tsx` — Prescribing commitment form with GAS submission (name, facility, specialty, specificCommitment)
- `app/components/take-action/ActionToast.tsx` — Fixed-position auto-dismiss success toast (5000ms)
- `app/components/take-action/ToolkitSection.tsx` — Stub placeholder returning null for Plan 02
- `app/lib/form-config.ts` — Exports formConfig with pledgeUrl and commitmentUrl from env vars; dev console warnings if unset
- `app/lib/analytics.ts` — Activated trackPledgeSubmit; added trackCommitmentSubmit GA4 event
- `app/components/layout/Header.tsx` — isButton field on navLinks, Take Action renders as AMR gold button
- `app/components/sections/AudienceCTAs.tsx` — Deep links to /take-action#pledge and /take-action#commitment (live: true)

## Decisions Made

- formConfig reads NEXT_PUBLIC_GAS_PLEDGE_URL and NEXT_PUBLIC_GAS_COMMITMENT_URL — placeholder URLs in .env.local, real URLs set in Vercel
- Pledge card pre-expanded by default; hash on mount overrides
- Session locking via Set<CardId> — no re-open after successful submit
- isButton flag on navLinks enables differentiated Header rendering without a separate array

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added trackCommitmentSubmit to analytics.ts before Task 2**
- **Found during:** Task 1 build verification
- **Issue:** CommitmentForm.tsx imported trackCommitmentSubmit which did not yet exist in analytics.ts — Turbopack static export check caused build error
- **Fix:** Added both trackPledgeSubmit activation and trackCommitmentSubmit to analytics.ts as part of Task 1 commit (plan had this as Task 2 but the import was needed immediately)
- **Files modified:** app/lib/analytics.ts
- **Verification:** Build passed with zero errors after fix
- **Committed in:** 043ea05 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary for build to pass — Task 2 analytics work was pulled into Task 1 commit. No scope change.

## Issues Encountered

None — build passed on second attempt after analytics fix.

## User Setup Required

None — no external service configuration required beyond .env.local placeholder URLs already appended.

## Next Phase Readiness

- /take-action page fully interactive and statically exported
- ToolkitSection stub in place for Plan 02 to implement without breaking build
- GAS URLs are placeholders — need real deployment IDs set in Vercel before production use
- Plan 02 ready to implement toolkit resources section

---
*Phase: 10-take-action-page*
*Completed: 2026-05-02*
