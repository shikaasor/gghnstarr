# Phase 14: Color Palette Refresh - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Refresh the site-wide green brand token from the Phase 6 value (#0A7050, darkened for WCAG AA compliance) to a brighter emerald green (#319974). This means updating the Tailwind @theme token definitions and verifying every page renders correctly with the new palette. Gold, navy, and grey tokens are unchanged. No new components or pages are built in this phase.

</domain>

<decisions>
## Implementation Decisions

### Target green value
- New primary green: **#319974** (specific hex, user-defined)
- teal-600 is pinned to #319974 exactly
- teal-700 (hover/focus state) is derived by darkening #319974 by ~15% (approximately #277860) — Claude calculates the exact value at plan time
- AMR gold (#F2A900) is locked — no change

### Full teal scale
- Rebuild the full teal scale (teal-50 through teal-900) using Tailwind's built-in emerald scale values as the reference
- teal-600 is the one exception: pinned to #319974 rather than the nearest emerald stop
- All other stops (50, 100, 200, 300, 400, 500, 700, 800, 900) use the corresponding Tailwind emerald values mapped to teal- names

### Contrast handling
- #319974 on white gives ~3.5:1 — below WCAG AA 4.5:1. **Visual priority wins — WCAG AA compliance is consciously waived for this phase.**
- White text on #319974 background (~4.1:1): also accepted
- Add a comment in the Tailwind config (@theme block) documenting that WCAG AA was deliberately waived in favor of brand vibrancy

### Surface coverage
- No component exclusions — full site token swap
- The token change propagates automatically to all components using teal- classes (buttons, badges, nav links, section backgrounds, borders, hover states)
- Researcher should audit component files for any hardcoded hex values that bypass the token system (#0A7050 or similar) and flag them for direct replacement

### Visual verification
- Full page audit (all routes) after token swap
- next build must complete without errors
- Every route confirms the new emerald green renders correctly — spot-checking 3-4 pages is not sufficient

### Claude's Discretion
- Exact teal-700 value (derived by darkening #319974 ~15%)
- Exact emerald scale values for teal-50 through teal-500 and teal-800/900
- Wording of the WCAG waiver comment in Tailwind config

</decisions>

<specifics>
## Specific Ideas

- The motivation is visual brand impact — the current #0A7050 reads as dark forest green, not the vibrant AMR green the brand needs at the conference deadline
- Phase 6 note: teal-600 was originally set to #0A7050 specifically because the logo's actual green failed WCAG AA — this phase reverses that trade-off deliberately

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 14-color-palette-refresh-brighter-emerald-green-across-all-brand-tokens*
*Context gathered: 2026-05-10*
