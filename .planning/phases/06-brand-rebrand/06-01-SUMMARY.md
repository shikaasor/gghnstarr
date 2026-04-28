---
phase: 06-brand-rebrand
plan: "01"
subsystem: ui
tags: [tailwind, css, brand, color-tokens, globals.css]

# Dependency graph
requires: []
provides:
  - AMR brand palette token block in @theme (globals.css)
  - --color-navy-950/900/800 mapped to AMR dark green family
  - --color-teal-600/500/400 mapped to AMR emerald green family
  - --color-teal-50 pale green hover token
  - --color-amr-gold gold accent token
affects:
  - 06-02
  - 06-03
  - all subsequent v2.0 phases using teal-* or navy-* Tailwind classes

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Option B palette swap: keep Tailwind class names, change only underlying hex values in @theme"
    - "WCAG AA contrast verified at plan time using luminance formula (teal-600 = 6.1:1 on white)"

key-files:
  created: []
  modified:
    - app/globals.css

key-decisions:
  - "Option B chosen: rename hex values, keep class names — zero component file changes required"
  - "teal-600 darkened to #0A7050 (not logo green #12A572) to achieve WCAG AA 4.5:1 on white background"
  - "teal-50 added as new token for hover:bg-teal-50 class support"
  - "amr-gold added as named token #F2A900 for future accent uses"

patterns-established:
  - "Single-file palette swap: all brand color changes live in @theme block in globals.css only"
  - "Tailwind v4 CSS variable pattern: --color-{name}: {hex} inside @theme resolves to bg-{name}, text-{name} classes"

requirements-completed:
  - BRAND-02

# Metrics
duration: 2min
completed: 2026-04-28
---

# Phase 6 Plan 01: Brand Rebrand — AMR Palette Token Swap Summary

**Single-file palette swap replacing all 6 Navy/Teal @theme tokens with AMR emerald green family (#1A3A2A–#12A572) plus gold accent (#F2A900) and hover token (#D4EFE4), transforming every teal/navy pixel site-wide without touching any component file.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-28T20:03:34Z
- **Completed:** 2026-04-28T20:05:00Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- Replaced 6 old Navy/Teal hex values in @theme with AMR dark green family values
- Added --color-teal-50 (#D4EFE4) needed for hover:bg-teal-50 class support
- Added --color-amr-gold (#F2A900) as named accent token
- Updated @theme comment block to reference AMR brand and source file
- Build passes cleanly — all 14 color tokens resolve correctly via Tailwind v4

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace @theme color tokens with AMR brand palette** - `35ecf27` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `app/globals.css` - @theme primary palette block replaced with AMR brand tokens; comment headers updated

## Decisions Made

- **Option B palette swap:** Keep all existing Tailwind class names (navy-950, teal-600, etc.) unchanged in every component file. Only the hex values in globals.css @theme are swapped. This minimizes change surface and allows a single-file rebrand.
- **teal-600 target hex:** Set to #0A7050 (darker than logo green) to achieve WCAG AA 4.5:1 contrast ratio on white. Calculated contrast: ~6.1:1. Logo green #12A572 would be ~3.1:1 (fails AA for normal text).
- **teal-50 added as new token:** The existing component set uses hover:bg-teal-50 — this class requires a --color-teal-50 token in @theme. Adding it here keeps hover backgrounds in the AMR green family.
- **amr-gold as named token:** Rather than hardcoding #F2A900 inline, a named token enables consistent gold usage across future phases.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. The single-file CSS swap was clean. The `--color-slate-900: #0F172A` (neutral palette) retained its original value — this is correct since it's a neutral grey-black, not a primary navy token, and does not need rebranding.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- AMR brand palette is live in globals.css — all teal-* and navy-* classes now resolve to AMR green family values
- 06-02 and 06-03 can proceed immediately; they will pick up the new palette automatically via Tailwind v4 CSS variable resolution
- No component files need modification for the color swap — the rebrand is already visible site-wide

---
*Phase: 06-brand-rebrand*
*Completed: 2026-04-28*
