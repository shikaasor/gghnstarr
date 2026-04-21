---
phase: 02-homepage-and-design-system
plan: "04"
subsystem: ui
tags: [react, nextjs, google-apps-script, newsletter, form, cors]

# Dependency graph
requires:
  - phase: 02-03
    provides: PartnerLogos and FeaturedBrief sections, NewsletterSignup stub component
provides:
  - NewsletterSignup client component with 4-state form UX and GAS CORS workaround
  - .env.local placeholder for NEXT_PUBLIC_GAS_URL
  - Human-verified complete homepage (all 6 sections confirmed at desktop and mobile)
affects: [03-policy-briefs-library, 04-supporting-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GAS CORS workaround: Content-Type text/plain;charset=utf-8 + redirect:follow avoids OPTIONS preflight"
    - "Inline form state machine: idle -> submitting -> success | error (no toasts, no redirects)"
    - "NEXT_PUBLIC_ prefix for client-side env vars in static export"

key-files:
  created:
    - app/components/sections/NewsletterSignup.tsx
    - .env.local
  modified: []

key-decisions:
  - "GAS CORS workaround: text/plain Content-Type avoids preflight; redirect:follow handles GAS /exec 302 redirect"
  - "Success state replaces entire form section inline — no toast library dependency"
  - "NEXT_PUBLIC_GAS_URL stored in .env.local with placeholder value — user must replace before live email capture works"

patterns-established:
  - "Client-side form: useState for email + FormState type (idle/submitting/success/error)"
  - "lucide-react icons for form state feedback (CheckCircle, AlertCircle, Loader2)"

requirements-completed: [HOME-04]

# Metrics
duration: 15min
completed: 2026-03-30
---

# Phase 2 Plan 04: NewsletterSignup and Homepage Visual Verification Summary

**NewsletterSignup client component with GAS CORS workaround (text/plain + redirect:follow), 4-state form UX, and human-confirmed complete homepage rendering all 6 sections**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-30T00:00:00Z
- **Completed:** 2026-03-30T00:15:00Z
- **Tasks:** 2 (1 auto + 1 human-verify)
- **Files modified:** 2

## Accomplishments
- NewsletterSignup.tsx built as 'use client' component with idle/submitting/success/error state machine
- GAS CORS workaround correctly implemented: Content-Type text/plain;charset=utf-8 prevents OPTIONS preflight; redirect:follow handles the GAS /exec 302 redirect chain
- .env.local created with NEXT_PUBLIC_GAS_URL placeholder for user to replace with real deployment ID
- Human verified all 9 checklist items: 6 homepage sections correct at desktop and mobile widths, no hydration errors, stats rotation visible, background alternation correct

## Task Commits

Each task was committed atomically:

1. **Task 1: Build NewsletterSignup with GAS integration** - `bdc7046` (feat)
2. **Task 2: Visual verification of complete homepage** - human-verified (approved)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `app/components/sections/NewsletterSignup.tsx` - Client-side newsletter form with 4 form states and GAS fetch integration
- `.env.local` - NEXT_PUBLIC_GAS_URL environment variable with placeholder GAS Web App URL

## Decisions Made
- GAS CORS workaround: `Content-Type: text/plain;charset=utf-8` is a "simple" request type that does not trigger CORS preflight; combined with `redirect: 'follow'` to handle GAS /exec's 302 redirect, this is the reliable pattern for client-side GAS integration.
- Success confirmation replaces the entire form section inline rather than using a toast — keeps the component self-contained with no additional library dependency.
- `NEXT_PUBLIC_GAS_URL` placeholder in .env.local documents where users must insert their deployment ID before live email capture is functional.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**External services require manual configuration before newsletter signup is live:**

1. Create a Google Apps Script Web App:
   - Go to script.google.com
   - Create a new project bound to a Google Sheet
   - Paste the doPost handler that reads `JSON.parse(e.postData.contents)` and appends email to sheet
   - Deploy: Execute as Me, Who has access: Anyone
   - Copy the Web App URL (format: `https://script.google.com/macros/s/AKf.../exec`)

2. Update `.env.local`:
   - Replace the placeholder value for `NEXT_PUBLIC_GAS_URL` with your real deployment URL
   - Redeploy to Vercel (push to main) for the change to take effect

3. Verify: Submit the newsletter form on the live site and confirm the email appears in the linked Google Sheet.

## Next Phase Readiness
- Homepage is complete and human-verified — all 6 sections render correctly at desktop and mobile
- Phase 2 (Homepage & Design System) is fully complete — all 4 plans done
- Phase 3 (Policy Briefs Library & Detail Pages) can begin immediately — depends on Phase 2 only
- Phase 4 (Supporting Pages) can also begin in parallel with Phase 3 — also depends on Phase 2 only
- Newsletter signup will be non-functional until user completes GAS setup (does not block Phase 3/4)

---
*Phase: 02-homepage-and-design-system*
*Completed: 2026-03-30*
