---
phase: 04-supporting-pages
plan: "03"
subsystem: ui
tags: [react, nextjs, formspree, forms, contact]

# Dependency graph
requires:
  - phase: 04-01
    provides: methodology page and layout.tsx Server Component pattern
  - phase: 04-02
    provides: experts page and photo placeholder pattern

provides:
  - Formspree-powered contact form with 4-state machine (idle|submitting|success|error)
  - Contact page Server Component shell with welcoming intro copy
  - noscript fallback email for JS-disabled visitors
  - NEXT_PUBLIC_FORMSPREE_FORM_ID env var wired (placeholder value; requires manual Formspree ID)
  - Phase 4 all three supporting pages complete (/methodology, /experts, /contact)

affects:
  - phase 05 SEO and launch (all pages ready)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Formspree AJAX via native fetch POST with FormData (no SDK) — same 4-state machine as NewsletterSignup
    - Server Component page.tsx imports 'use client' ContactForm — metadata exported from server component
    - noscript block inside form for progressive enhancement

key-files:
  created:
    - app/components/contact/ContactForm.tsx
  modified:
    - app/contact/page.tsx
    - .env.local (gitignored — NEXT_PUBLIC_FORMSPREE_FORM_ID=placeholder added)

key-decisions:
  - "ContactForm uses direct Formspree AJAX via fetch POST with FormData — no @formspree/react SDK dependency"
  - "noscript fallback placed inside <form> element — visible only when JS disabled"
  - ".env.local is gitignored; NEXT_PUBLIC_FORMSPREE_FORM_ID=placeholder set as intentional placeholder awaiting real Formspree ID at checkpoint"

patterns-established:
  - "ContactForm state machine: 4 states (idle|submitting|success|error), success replaces form inline"
  - "Required fields marked with red asterisk in label span; optional fields labeled with '(optional)' text"
  - "2-col grid for paired fields (Name+Email, Title+Org); Country spans full row; Inquiry Type and Message full width"

requirements-completed:
  - CONT-01

# Metrics
duration: 1min
completed: 2026-04-21
---

# Phase 4 Plan 03: Contact & Engagement Page Summary

**Formspree-powered contact form with 4-state machine, 7 fields (4 required / 3 optional), noscript email fallback, and welcoming Server Component page shell**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-04-21T06:47:28Z
- **Completed:** 2026-04-21T06:48:42Z
- **Tasks:** 1 of 1 auto tasks complete (checkpoint pending user verification)
- **Files modified:** 3 (.env.local gitignored)

## Accomplishments

- Created ContactForm.tsx with direct Formspree AJAX using fetch POST + FormData — no SDK dependency
- 7-field form with correct required/optional labeling, 4-option Inquiry Type dropdown, and inline success state
- noscript fallback email block placed inside form for progressive enhancement
- Updated contact/page.tsx from placeholder to full welcoming Server Component with metadata
- Build and TypeScript both pass clean (11 static pages generated)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ContactForm component and update contact page** - `0b49a1c` (feat)

**Plan metadata:** (pending — final commit after checkpoint verification)

## Files Created/Modified

- `app/components/contact/ContactForm.tsx` — 'use client' Formspree form with 4-state machine
- `app/contact/page.tsx` — Server Component with metadata, welcoming copy, ContactForm render
- `.env.local` — NEXT_PUBLIC_FORMSPREE_FORM_ID=placeholder added (gitignored)

## Decisions Made

- Direct Formspree AJAX with native fetch + FormData (no SDK) — consistent with plan spec and avoids extra dependency
- noscript placed inside `<form>` tag — renders in JS-disabled contexts where the form itself is non-functional
- Placeholder Formspree ID intentional — real ID to be set at checkpoint (human-verify step)

## Deviations from Plan

None — plan executed exactly as written. (.env.local gitignore noted as expected behavior, not a deviation)

## Issues Encountered

- `.env.local` is gitignored (correct behavior for secrets). The env var was added to the file but not committed. User must verify the file exists locally with the correct entry. The plan anticipated this as "value placeholder is intentional."

## User Setup Required

To complete the contact form integration:

1. Sign in at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy the 8-character form ID from the `formspree.io/f/{ID}` URL
4. Open `.env.local` and replace `placeholder` in `NEXT_PUBLIC_FORMSPREE_FORM_ID=placeholder`
5. Restart the dev server (`npm run dev`)
6. Test by submitting the form at http://localhost:3000/contact

## Next Phase Readiness

All three Phase 4 supporting pages are built and passing build:
- `/methodology` — tabbed methodology page (SEIR/ML/Bayesian, NIPAD, GlobalPPS)
- `/experts` — three expert profile cards with real data
- `/contact` — Formspree contact form with noscript fallback

Phase 5 (SEO and launch work) can begin once the checkpoint visual verification passes.

---
*Phase: 04-supporting-pages*
*Completed: 2026-04-21*
