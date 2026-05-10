# Phase 14: Color Palette Refresh — Research

**Researched:** 2026-05-10
**Domain:** Tailwind v4 CSS custom property token system / brand color update
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- New primary green: **#319974** (specific hex, user-defined)
- teal-600 is pinned to #319974 exactly
- teal-700 (hover/focus state) is derived by darkening #319974 by ~15% — Claude calculates the exact value at plan time
- AMR gold (#F2A900) is locked — no change
- Rebuild the full teal scale (teal-50 through teal-900) using Tailwind's built-in emerald scale values as the reference
- teal-600 is the one exception: pinned to #319974 rather than the nearest emerald stop
- All other stops (50, 100, 200, 300, 400, 500, 700, 800, 900) use the corresponding Tailwind emerald values mapped to teal- names
- #319974 on white gives ~3.5:1 — WCAG AA compliance is consciously waived for this phase
- White text on #319974 background (~4.1:1): also accepted
- Add a comment in the Tailwind config (@theme block) documenting that WCAG AA was deliberately waived in favor of brand vibrancy
- No component exclusions — full site token swap
- Full page audit (all routes) after token swap
- next build must complete without errors
- Every route confirms the new emerald green renders correctly — spot-checking 3-4 pages is not sufficient

### Claude's Discretion
- Exact teal-700 value (derived by darkening #319974 ~15%)
- Exact emerald scale values for teal-50 through teal-500 and teal-800/900
- Wording of the WCAG waiver comment in Tailwind config

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Phase 14 is a single-file token update. The only file that requires editing is `app/globals.css`. The `@theme` block currently defines a partial teal scale (teal-50, teal-400, teal-500, teal-600) plus navy and slate tokens. The new teal scale must be expanded to cover all stops (50–900) that are referenced in component files, with teal-600 pinned to #319974 and all other stops mapped from the standard Tailwind v4 emerald scale.

The token propagation is automatic — every component that uses `teal-*` Tailwind classes will pick up the new colors with zero component-level edits. The codebase audit confirms there are NO hardcoded hex values in any component or page file. All green references go through the token system. This makes the change surgical: one file edit, full site coverage.

The full site has 11 distinct routes that require visual verification after the token swap. Several teal stops that are currently undefined in the `@theme` block are used in components (teal-100, teal-200, teal-700, teal-900). These must be added to the new @theme block or Tailwind v4 will silently produce no color for those classes.

**Primary recommendation:** Edit `app/globals.css` `@theme` block — replace the partial teal scale with the complete emerald-mapped teal scale, pin teal-600 to #319974, run `next build`, then visually audit all 11 routes.

---

## Exact Color Values (Pre-Calculated)

### New Full Teal Scale

| Token | Hex | Source | Notes |
|-------|-----|--------|-------|
| teal-50 | #ecfdf5 | Tailwind emerald-50 | Pale hover backgrounds |
| teal-100 | #d1fae5 | Tailwind emerald-100 | Used in education/page.tsx (text-teal-100 on bg-teal-600) |
| teal-200 | #a7f3d0 | Tailwind emerald-200 | Used in CommentList border, CommentForm border |
| teal-300 | #6ee7b7 | Tailwind emerald-300 | Currently unused — include for scale completeness |
| teal-400 | #34d399 | Tailwind emerald-400 | Used in Header nav links, Footer links (hover) |
| teal-500 | #10b981 | Tailwind emerald-500 | Used in BriefGrid focus ring, Footer links, button hover states |
| teal-600 | #319974 | User-pinned | CTAs, badges, links, section backgrounds — primary brand green |
| teal-700 | #2A8263 | Derived: darken #319974 ~15% | Used in EducationCard, EducationFilters, EducationTabs, NewsCard, NewsGrid hover, CommentForm hover button |
| teal-800 | #065f46 | Tailwind emerald-800 | Currently unused — include for scale completeness |
| teal-900 | #064e3b | Tailwind emerald-900 | Used in NewsCard (hover:text-teal-900) |

### Contrast Ratios (verified by calculation)

| Combination | Ratio | WCAG AA (4.5:1) | Decision |
|-------------|-------|-----------------|----------|
| #319974 text on white | 3.54:1 | Fails | Waived — brand vibrancy wins |
| White text on #319974 bg | 3.54:1 | Fails | Waived — brand vibrancy wins |
| #2A8263 (teal-700) on white | 4.70:1 | Passes | Hover/focus states have AA compliance |
| #0A7050 (old teal-600) on white | 6.09:1 | Passes | Previous WCAG-safe value being replaced |

### Calculation Methodology for teal-700
Starting value: #319974 (R=49, G=153, B=116)
HSL equivalent: H=159°, S=51%, L=40%
Darken 15%: L = 40% × 0.85 = 34%
Result HSL: H=159°, S=51%, L=34% → **#2A8263** (R=42, G=130, B=99)

---

## Standard Stack

### The Token System (Tailwind v4)

Tailwind v4 uses CSS-native `@theme` blocks in the stylesheet directly (`app/globals.css`). There is no `tailwind.config.js` in this project — tokens are defined entirely via CSS custom properties in the `@theme` directive.

**How the token system works:**
- `--color-teal-600: #319974;` in `@theme` makes `bg-teal-600`, `text-teal-600`, `border-teal-600`, `ring-teal-600` etc. all available as Tailwind utility classes
- The change propagates automatically — no component files need touching
- Classes that reference undefined tokens (e.g., `teal-700` if not defined) silently produce no color output in Tailwind v4

**Confidence:** HIGH — verified by reading the actual `app/globals.css` and Tailwind v4 `theme.css` source.

---

## Exact File Changes Required

### File: `app/globals.css` (ONLY file to edit)

**Current @theme block (lines 5–28):**

```css
@theme {
  /* Primary palette — AMR Brand (Emerald Green / Gold / Dark Green) */
  --color-navy-950: #1A3A2A;
  --color-navy-900: #1F4A35;
  --color-navy-800: #2D5A42;
  --color-teal-600: #0A7050;      /* WCAG AA darkened value */
  --color-teal-500: #0F8A5F;
  --color-teal-400: #12A572;
  --color-teal-50:  #D4EFE4;
  --color-amr-gold: #F2A900;

  /* Neutral palette ... */
}
```

**Required changes:**
1. Replace ALL teal tokens with the full emerald-mapped scale (teal-50 through teal-900)
2. Pin teal-600 to #319974
3. Remove the old partial scale values (teal-400 #12A572, teal-500 #0F8A5F, teal-50 #D4EFE4)
4. Add WCAG waiver comment
5. Update the file header comment (line 4) to reference #319974 instead of #0A7050

**No other files require edits.**

---

## Component Audit: Teal Token Usage

All teal class references in the codebase — confirmed ALL go through the token system (zero hardcoded hex values).

### Tokens currently used by components (that MUST exist in new @theme):

| Token | Used in |
|-------|---------|
| teal-50 | ActionCardGrid, AudienceCTAs, AccordionSection, DownloadButton, BriefCard, DownloadCard, CommentForm (bg) |
| teal-100 | education/page.tsx (text on bg-teal-600 hero section) |
| teal-200 | CommentList (border-teal-200), CommentForm (border-teal-200) |
| teal-400 | Header (hover:text-teal-400), Footer (hover:text-teal-400), BriefCard |
| teal-500 | BriefGrid (focus:ring-teal-500), FeaturedBrief (hover:bg-teal-500), HeroSection, AudienceCTAs, NewsletterSignup, ContactForm, CommitmentForm, PledgeForm, ConferenceHero, LeadCaptureModal, DownloadButton, ActionToast |
| teal-600 | Everywhere — primary CTA color (buttons, badges, links, icons, borders, section backgrounds) |
| teal-700 | EducationCard (text, hover), EducationFilters (text), EducationTabs (text-teal-700), NewsCard (hover:text-teal-700), NewsGrid (hover:bg-teal-700), CommentForm (hover:bg-teal-700), EducationCard (bg-teal-50 text-teal-700 badge) |
| teal-900 | NewsCard (hover:text-teal-900) |

### Tokens NOT currently in @theme that components reference:
- **teal-100** — `education/page.tsx:31` uses `text-teal-100` (white-ish text on teal-600 hero bg)
- **teal-200** — `CommentList.tsx:47` and `CommentForm.tsx:33` use `border-teal-200`
- **teal-700** — multiple files use this for hover states and text variants
- **teal-900** — `NewsCard.tsx:58` uses `hover:text-teal-900`

These MUST be added to the @theme block. They currently fall back to Tailwind's built-in teal scale (if it exists) or produce no color.

---

## Hardcoded Hex Audit Results

**Finding: ZERO hardcoded hex values for green in component files.**

Grep result across all `app/**/*.tsx` files for `#0A7050`, `#0a7050`, `#0F8A5F`, `#12A572`, `#D4EFE4`, `#1A3A2A`, `#1F4A35`, `#2D5A42`: **No matches** (only `globals.css` and the file header comment matched).

One component uses a hardcoded red hex (`#DC2626` in `ConferenceBar.tsx`) — this is the conference alert bar, unrelated to the green brand token, no change needed.

---

## Routes Requiring Visual Verification

All 11 routes confirmed from codebase audit:

| Route | Key Green Elements |
|-------|-------------------|
| `/` (home) | HeroSection CTA button (bg-teal-600), StatStrip values (text-teal-600), ThreePillars icons (text-teal-600), FeaturedBrief, AudienceCTAs, NewsletterSignup |
| `/briefs` | BriefCard borders/links/hover, BriefGrid focus ring |
| `/briefs/[slug]` | Labels (text-teal-600), bullet dots (text-teal-600), related brief links, CommentForm, CommentList border |
| `/awareness` | Inline links (text-teal-600), stat number (text-teal-600), AccordionSection hover/icon |
| `/news` | NewsGrid filter buttons (bg-teal-600 active, hover:bg-teal-700), NewsCard hover/links |
| `/take-action` | ActionCardGrid icons/chevrons, DownloadCard borders, ActionToast (bg-teal-600), PledgeForm, CommitmentForm |
| `/experts` | ExpertCard title (text-teal-600) |
| `/conference` | ConferenceHero CTA (bg-teal-600, hover:bg-teal-500), ConferenceThemes icons |
| `/education` | Hero section (bg-teal-600 full width), teal-100 text on hero, EducationFilters active buttons, EducationTabs, EducationCard badges/hover |
| `/contact` | ContactForm focus ring, submit button (bg-teal-600), success CheckCircle icon |
| `/methodology` | Tab active state (border-teal-600 text-teal-600), CTA buttons |

---

## Architecture Patterns

### Tailwind v4 @theme Token Pattern

```css
/* Source: app/globals.css — the ONLY place to edit */
@theme {
  /* Teal scale — AMR Brand Green (Emerald-mapped) */
  /* NOTE: WCAG AA compliance waived for teal-600 through teal-200.
     #319974 on white = 3.54:1 (below 4.5:1 threshold).
     Brand vibrancy takes priority per Phase 14 decision.
     teal-700 (#2A8263) on white = 4.70:1 — hover states are AA-compliant. */
  --color-teal-50:  #ecfdf5;
  --color-teal-100: #d1fae5;
  --color-teal-200: #a7f3d0;
  --color-teal-300: #6ee7b7;
  --color-teal-400: #34d399;
  --color-teal-500: #10b981;
  --color-teal-600: #319974;      /* AMR Brand Green — pinned (not emerald-600 #059669) */
  --color-teal-700: #2A8263;      /* Derived: #319974 darkened 15% — hover/focus states */
  --color-teal-800: #065f46;
  --color-teal-900: #064e3b;
}
```

### Token Cascade Rule
In Tailwind v4, tokens defined in `@theme` override Tailwind's built-in scale for that color family. By defining `--color-teal-*` tokens, ALL teal utility classes (`bg-teal-*`, `text-teal-*`, `border-teal-*`, `ring-teal-*`, `hover:bg-teal-*`, etc.) resolve to these values automatically. No JIT rebuild or config change needed — the CSS file IS the config.

---

## Common Pitfalls

### Pitfall 1: Incomplete Teal Scale — Missing Tokens
**What goes wrong:** If teal-100, teal-200, teal-700, or teal-900 are omitted from the new @theme block, those Tailwind classes produce no visible color.
**Why it happens:** The current @theme only defines teal-50, teal-400, teal-500, teal-600. Missing stops fall back to nothing (Tailwind v4 custom colors fully override built-in scales).
**How to avoid:** Include ALL stops that components reference (50, 100, 200, 400, 500, 600, 700, 900). The plan adds 300 and 800 for completeness.
**Warning signs:** Visual verification shows transparent text or invisible borders on education, news, or comment sections.

### Pitfall 2: Leaving the Header Comment Stale
**What goes wrong:** Line 4 of globals.css reads "Colors derived from AMR Logo_Feb2026.jpeg: Green #0A7050, Gold #F2A900" — this becomes a lie after the change.
**How to avoid:** Update the file-level comment to reference #319974 as the new brand green.

### Pitfall 3: Verifying Only "Green" Pages
**What goes wrong:** Assuming only pages with prominent green elements (home, education) need checking. But teal tokens appear on EVERY page via the Header (nav hover states) and Footer (link colors).
**How to avoid:** Verify all 11 routes in the checklist. The Header and Footer render on every page — these carry teal-400 hover states.

### Pitfall 4: Assuming `next dev` Hot Reload is Sufficient for Final Verification
**What goes wrong:** CSS hot-reload in dev can miss cases that manifest in the production build.
**How to avoid:** Run `next build` as the final gate. The build must complete without errors before phase is closed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Color math for teal-700 | Custom darkening algorithm | Calculation done: use **#2A8263** directly |
| Generating the emerald scale | Color tool / manual derivation | Use Tailwind's published emerald hex values (verified from theme.css) |
| Contrast verification | Manual eyeball test | Calculated ratios documented in this research |

---

## Open Questions

None — the research resolves all questions needed for planning.

1. **teal-700 exact value** — Resolved: **#2A8263** (darken #319974 by 15% in HSL, L: 40%→34%)
2. **Which components use undefined teal stops** — Resolved: teal-100, teal-200, teal-700, teal-900 are used and must be added
3. **Any hardcoded hex bypasses** — Resolved: None found in component files

---

## Sources

### Primary (HIGH confidence)
- Direct file read: `app/globals.css` — exact current @theme block, lines 1–28
- Direct grep: all `app/**/*.tsx` files — complete inventory of teal class usage
- `node_modules/tailwindcss/theme.css` lines 82–92 — authoritative emerald scale in oklch; hex equivalents are the v3-compatible values that Tailwind v4 renders identically

### Secondary (MEDIUM confidence)
- HSL darkening calculation: standard color math applied to #319974, verified with Node.js computation

---

## Metadata

**Confidence breakdown:**
- Current token definitions: HIGH — read directly from globals.css
- Hardcoded hex audit: HIGH — grep across full app/ with zero false negatives possible (all hex patterns searched)
- Exact emerald hex values: HIGH — taken from Tailwind's own theme.css in node_modules
- teal-700 derivation (#2A8263): HIGH — verified by calculation
- Contrast ratios: HIGH — calculated via WCAG luminance formula
- Route inventory: HIGH — globbed all app/**/page.tsx files

**Research date:** 2026-05-10
**Valid until:** Stable indefinitely — this is codebase archaeology, not ecosystem research
