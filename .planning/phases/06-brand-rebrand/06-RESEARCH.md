# Phase 6: Brand Rebrand - Research

**Researched:** 2026-04-28
**Domain:** Tailwind v4 CSS-first theming, Next.js Image component, WCAG AA contrast, brand color extraction
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BRAND-01 | Site header and footer display the official AMR logo (AMR Logo_Feb2026.jpeg — Africa map silhouette + "AntiMicrobial Resistance" wordmark) | Logo JPEG inspected visually; public/ directory confirmed; next.config.js has `images: { unoptimized: true }` enabling Next.js `<Image>` use in static export |
| BRAND-02 | Site color palette updated from Navy/Teal to AMR brand colors (Emerald Green, Gold, Slate Grey — derived from logo; exact values confirmed at plan phase) | Logo JPEG colors visually identified and hex values estimated; @theme block in globals.css fully mapped; Tailwind v4 token replacement pattern documented |
| BRAND-03 | All existing components (buttons, badges, section backgrounds, link hovers) reflect the updated brand palette without breaking contrast ratios | Complete audit of all navy/teal class usages performed across every TSX file; WCAG AA 4.5:1 requirement documented; contrast pairs identified |
</phase_requirements>

---

## Summary

Phase 6 replaces the v1.0 Navy/Teal palette with the official AMR brand identity across every page of the site. The work breaks into three distinct sub-problems: (1) copy the logo JPEG to `public/` and add it to Header and Footer via `next/image`; (2) replace the six color tokens in the `@theme` block in `app/globals.css`; (3) update every `teal-*` and `navy-*` Tailwind class in 12 component/page files to use the new token names.

The logo JPEG was inspected directly. The AMR logo contains four colors: a dark forest green (top of Africa silhouette and "AntiMicrobial" wordmark + underline rule), a gold/amber-orange ("amr" wordmark text and southern Africa accent marks), a medium-dark slate grey (main Africa continent body silhouette), and near-black charcoal for "Resistance" wordmark text. These confirm the MASTER document values are directionally correct, though exact hex must be sampled precisely at plan time. Recommended working values: Emerald Green `#1A6B3C` (forest green, darker than #0F8A5F in MASTER), Gold `#E8A020` (warm amber, slightly deeper than #F2A900), Slate Grey `#5A6472` (mid-tone grey for the continent).

The codebase uses Tailwind v4 CSS-first configuration: all tokens live in the `@theme` block in `app/globals.css` with no `tailwind.config.js`. Updating the six token declarations in `@theme` propagates automatically to every utility class derived from those tokens — no per-component changes needed for token-based classes. However, a significant number of classes use literal teal/navy token names (`bg-teal-600`, `text-navy-950`, etc.) rather than semantic names. All of these must be renamed to match the new token names.

**Primary recommendation:** Update `@theme` first (single file, one change propagates everywhere), then rename classes file-by-file. The rename is mechanical but must be done carefully to preserve hover states, focus rings, and dark-mode variants.

---

## Logo Visual Analysis

**File inspected:** `resources/GGHN STARR_5th Interministrial AMR Meeting. Mar - Jun 2026/Logo & Brand/Logo drafts/AMR Logo_Feb2026.jpeg`

The logo has a white background and contains:

| Element | Color | Estimated Hex | MASTER Doc Hex | Confidence |
|---------|-------|---------------|----------------|------------|
| Africa silhouette top shading + wordmark "AntiMicrobial" | Dark forest green | `#1A6B3C` | `#0F8A5F` | MEDIUM — visual estimate only |
| "amr" letterform + southern Africa accent comma shapes | Gold / amber-orange | `#E8A020` | `#F2A900` | MEDIUM — visual estimate only |
| Africa continent body | Slate grey | `#5A6472` | (not specified) | MEDIUM — visual estimate only |
| "Resistance" wordmark text | Dark charcoal | `#2D2D2D` | (not specified) | MEDIUM — visual estimate only |
| Underline rule (bottom of wordmark) | Same forest green | `#1A6B3C` | `#0F8A5F` | MEDIUM |
| Background | White | `#FFFFFF` | — | HIGH |

**IMPORTANT:** These are visual estimates from JPEG rendering. The planner MUST either:
- Use a color-picker tool on the JPEG to extract exact hex values before finalizing token definitions, OR
- Accept the MASTER document values (`#0F8A5F` green, `#F2A900` gold) as the authoritative source and use those directly.

**Recommendation:** Use MASTER doc values (`#0F8A5F`, `#F2A900`) as the canonical brand hex — they were likely specified by the designer. Add a slate grey derived by sampling the logo silhouette (approximately `#5A6472` or use Tailwind's built-in `slate-500` = `#64748B` as a pragmatic fallback).

---

## Current Codebase: Complete Color Audit

### Current @theme Tokens (app/globals.css)

```css
@theme {
  /* To be REPLACED in Phase 6: */
  --color-navy-950: #0F172A;   /* deep dark background */
  --color-navy-900: #1E293B;   /* card/secondary dark bg */
  --color-navy-800: #2D3F55;   /* borders/dividers */
  --color-teal-600: #0D9488;   /* primary CTAs, accent, links */
  --color-teal-500: #14B8A6;   /* hover states */
  --color-teal-400: #2DD4BF;   /* footer link color */

  /* To be KEPT (neutral palette): */
  --color-slate-50: #F8FAFC;
  --color-slate-100: #F1F5F9;
  --color-slate-200: #E2E8F0;
  --color-slate-400: #94A3B8;
  --color-slate-600: #475569;
  --color-slate-900: #0F172A;
}
```

### Navy/Teal Class Inventory by File

Every instance of `teal-*` and `navy-*` in the codebase:

**`app/components/layout/Header.tsx`**
- `bg-navy-950` — header background
- `text-teal-400` — site wordmark "GGHN STARR" color
- `hover:text-teal-300` — site wordmark hover
- `hover:text-teal-400` — desktop nav link hover
- `hover:text-teal-400` — mobile hamburger hover
- `bg-navy-900` — mobile slide-out nav panel bg
- `border-navy-800` — mobile panel top border
- `hover:bg-navy-800` — mobile nav link hover bg

**`app/components/layout/Footer.tsx`**
- `bg-navy-950` — footer background
- `border-navy-800` — footer top border + inner divider
- `text-teal-400` — "GGHN STARR" footer wordmark
- `text-teal-500` — email/LinkedIn links
- `hover:text-teal-400` — email/LinkedIn hover

**`app/layout.tsx`**
- `dark:bg-navy-950` — dark mode body background

**`app/components/sections/HeroSection.tsx`**
- `bg-navy-950` — hero section background
- `bg-navy-950/70` — hero overlay
- `bg-teal-600` — CTA button bg
- `hover:bg-teal-500` — CTA button hover

**`app/components/sections/ThreePillars.tsx`**
- `text-teal-600` — icon color
- `text-navy-950` — pillar heading text

**`app/components/sections/StatStrip.tsx`**
- `text-teal-600` — large statistic number

**`app/components/sections/FeaturedBrief.tsx`**
- `text-teal-600` — "Featured Policy Brief" label
- `text-navy-950` — brief heading
- `text-teal-600` — bullet accent
- `bg-teal-600 hover:bg-teal-500` — Download PDF button

**`app/components/sections/NewsletterSignup.tsx`**
- `text-teal-600` — CheckCircle icon (success state)
- `text-navy-950` — "You're subscribed" text
- `text-navy-950` — "Stay Informed" heading
- `focus:ring-teal-600` — email input focus ring
- `bg-teal-600 hover:bg-teal-500` — Subscribe button

**`app/components/contact/ContactForm.tsx`**
- `focus:ring-2 focus:ring-teal-600` — all input focus rings (reused via `inputClass` const)
- `text-teal-600` — CheckCircle icon (success state)
- `text-navy-950` — "Thank you" heading + all form labels
- `bg-teal-600 hover:bg-teal-500` — Send Message button

**`app/components/briefs/BriefCard.tsx`**
- `text-teal-600` — week/date label
- `text-navy-950` — brief title
- `hover:text-teal-600` — brief title hover
- `border-teal-600 text-teal-600 hover:bg-teal-50` — Download PDF outlined button

**`app/components/briefs/BriefGrid.tsx`**
- `focus:ring-2 focus:ring-teal-500` — filter dropdowns focus ring
- `text-teal-600 hover:text-teal-500` — "Clear filters" link

**`app/components/experts/ExpertCard.tsx`**
- `text-navy-950` — expert name
- `text-teal-600` — expert title/role

**`app/briefs/[slug]/page.tsx`**
- `text-teal-600` — week/date label
- `text-navy-950` — brief h1 + section headings + author name
- `bg-teal-600 hover:bg-teal-500` — Download PDF button
- `border-teal-600 text-teal-600 hover:bg-teal-50` — Download Infographic outlined button
- `text-teal-600 flex-shrink-0` — bullet accent in key messages
- `text-teal-600 group-hover:text-teal-500` — prev/next nav links (×2)

**`app/briefs/page.tsx`**
- `text-navy-950` — "Policy Briefs" heading

**`app/experts/page.tsx`**
- `text-navy-950` — "Our Experts" heading

**`app/contact/page.tsx`**
- `text-navy-950` — "We'd love to hear from you" heading

**`app/methodology/page.tsx`**
- `text-navy-950` — all section headings (×8 instances)
- `border-teal-600 text-teal-600 font-semibold` — active tab indicator
- `hover:text-navy-950` — inactive tab hover
- `bg-teal-600 hover:bg-teal-500` — "Browse Policy Briefs" CTA button
- `border-teal-600 text-teal-600 hover:bg-teal-50` — "Get in Touch" outlined button

---

## Standard Stack

### Core (no new dependencies needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | ^4.2.2 | CSS-first design tokens + utility classes | Already installed; @theme block is the single source of truth |
| next/image | bundled with Next.js 16.2.1 | Optimized image rendering | Built-in; handles lazy loading, sizes, alt text |
| globals.css @theme | — | All brand color tokens | Single file, changes propagate to all derived utilities automatically |

### No Additional Packages Required

This phase is pure styling + one `<Image>` component addition. No new `npm install` needed.

The project already has:
- `next.config.js` with `images: { unoptimized: true }` — required for static export, already set
- All Tailwind utilities derived from `@theme` tokens
- `next/image` available via Next.js

---

## Architecture Patterns

### Pattern 1: Tailwind v4 @theme Token Replacement

**What:** Replace the six navy/teal `@theme` tokens with AMR brand equivalents. Tailwind v4 CSS-first config means no `tailwind.config.js` to touch — `app/globals.css` is the only file.

**When to use:** When renaming the entire palette (not extending).

**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme */
/* app/globals.css — replace the current navy/teal block with: */

@theme {
  /* AMR Brand Palette — replacing Navy/Teal */
  --color-amr-dark: #1A3A2A;        /* very dark green for backgrounds (replaces navy-950) */
  --color-amr-dark-mid: #1F4A35;    /* slightly lighter dark (replaces navy-900) */
  --color-amr-dark-border: #2D5A42; /* dark green border (replaces navy-800) */
  --color-amr-green: #0F8A5F;       /* Emerald Green — primary action (replaces teal-600) */
  --color-amr-green-light: #12A572; /* lighter hover green (replaces teal-500) */
  --color-amr-green-pale: #D4EFE4;  /* very light green tint (replaces teal-50 / teal-400) */
  --color-amr-gold: #F2A900;        /* AMR Gold — accent */
  --color-amr-gold-light: #FAC740;  /* lighter gold for hover states */
  --color-amr-grey: #5A6472;        /* Slate Grey — derived from logo silhouette */

  /* Neutral palette — UNCHANGED */
  --color-slate-50: #F8FAFC;
  /* ... rest unchanged */
}
```

**IMPORTANT naming note:** The new token names (`amr-green`, `amr-gold`, `amr-grey`, `amr-dark`, etc.) must be chosen at plan time and consistently applied. All `teal-*` class references become `amr-green-*` references; all `navy-*` references become `amr-dark-*` references. This is a find-and-replace exercise across 12 files.

**Alternatively (simpler):** Reuse the existing `teal-*` and `navy-*` token names but change their hex values. This means ZERO class renames across 12 files — only the 6 hex values in `@theme` change. The tradeoff is that token names are semantically misleading ("teal" for green). This is a valid engineering decision the planner should surface.

### Pattern 2: Next.js Image Component for Logo JPEG

**What:** Copy logo JPEG to `public/` and render with `<Image>` in Header and Footer.

**When to use:** Static asset in static export project.

**Example:**
```tsx
// Source: https://nextjs.org/docs/app/api-reference/components/image
import Image from 'next/image';

// In Header — logo beside nav
<Link href="/">
  <Image
    src="/amr-logo.jpeg"
    alt="AntiMicrobial Resistance — AMR Logo"
    width={120}     // intrinsic width in px — adjust to fit header h-24
    height={48}     // intrinsic height in px
    priority        // above-the-fold: preload this image
    className="object-contain"
  />
</Link>

// In Footer — smaller instance
<Image
  src="/amr-logo.jpeg"
  alt="AntiMicrobial Resistance — AMR Logo"
  width={80}
  height={32}
  className="object-contain opacity-90"
/>
```

**Static export note:** `next.config.js` already sets `images: { unoptimized: true }`. This is required for `output: 'export'` and is already correctly configured. No changes to `next.config.js` needed.

**Logo file path:** The source JPEG is at `resources/GGHN STARR_5th Interministrial AMR Meeting. Mar - Jun 2026/Logo & Brand/Logo drafts/AMR Logo_Feb2026.jpeg`. It must be **copied** to `public/amr-logo.jpeg` (flat path, no spaces, lowercase). The original in `resources/` is not served by Next.js — only files in `public/` are accessible at runtime.

**Logo dimensions:** The JPEG is a portrait-aspect document (approximately 900×1200px intrinsic size based on visual inspection). The logo mark itself occupies the lower-left quadrant. For web use, the logo needs to be sized carefully — `width={120} height={50}` is a reasonable starting point for the header at h-24 (96px tall).

### Pattern 3: Hover State Color Token Mapping

**What:** Each teal hover token maps to a lighter AMR green; each navy hover token maps to a slightly lighter AMR dark.

**Mapping table:**

| Current class | Role | New class (if renamed) |
|---------------|------|----------------------|
| `bg-navy-950` | Dark bg | `bg-amr-dark` |
| `bg-navy-900` | Secondary dark bg | `bg-amr-dark-mid` |
| `border-navy-800` | Dark borders | `border-amr-dark-border` |
| `text-navy-950` | Dark heading/body text | `text-amr-dark` (or keep as is — dark text on white bg) |
| `bg-teal-600` | Primary button bg | `bg-amr-green` |
| `hover:bg-teal-500` | Primary button hover | `hover:bg-amr-green-light` |
| `text-teal-600` | Accent/link text | `text-amr-green` |
| `hover:text-teal-500` | Accent/link hover | `hover:text-amr-green-light` |
| `text-teal-400` | Footer link color | `text-amr-green-light` |
| `hover:text-teal-400` | Footer link hover | `hover:text-amr-green` |
| `border-teal-600` | Outlined button border | `border-amr-green` |
| `hover:bg-teal-50` | Outlined button hover bg | `hover:bg-amr-green-pale` |
| `focus:ring-teal-600` | Form input focus ring | `focus:ring-amr-green` |
| `focus:ring-teal-500` | Filter dropdown focus ring | `focus:ring-amr-green` |

### Anti-Patterns to Avoid

- **Changing hex values without renaming:** If you keep `teal-*` names with green hex values, there is no class rename needed, but the semantic mismatch will confuse future contributors. Either rename consistently or add a comment in `@theme` explaining the deliberate aliasing.
- **Adding the logo as a background-image CSS property:** Use `<Image>` component, not `background-image` — avoids missing alt text and enables future optimization.
- **Hardcoding hex values directly in className:** Do not use `bg-[#0F8A5F]` arbitrary values — always route through a token so the palette stays in one place.
- **Partial token update:** If you update tokens in `@theme` but don't rename the classes that reference the old names, the old token names still exist and the old classes still work. Only classes referencing REMOVED tokens will break. Plan accordingly: if you remove `--color-teal-600`, then every `bg-teal-600` will break at build time. If you rename-in-place (change hex but keep name), zero classes break.
- **Forgetting the `teal-50` light tint token:** `hover:bg-teal-50` appears in BriefCard and methodology page outlined buttons. If `--color-teal-50` is removed from `@theme`, this class breaks. Either add it to the new token set or replace with `hover:bg-amr-green-pale`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color contrast checking | Manual calculation | WebAIM Contrast Checker (webaim.org/resources/contrastchecker/) | Luminance math is error-prone; tools are instant and authoritative |
| Image optimization for static export | Custom webpack loader | `next/image` with `unoptimized: true` (already configured) | Already working in the project; changing would break the build |
| Design token propagation | Per-component CSS overrides | Tailwind `@theme` block (single source) | Changing `@theme` auto-propagates to all derived utilities |

---

## Common Pitfalls

### Pitfall 1: Logo JPEG has a white background — it will not blend into dark headers

**What goes wrong:** The logo JPEG has a solid white background. On the dark `amr-dark` header background, the white rectangle will look like a white box containing the logo — visually broken.

**Why it happens:** JPEG format does not support transparency. The original file is white-background.

**How to avoid:** Two options:
1. Use CSS `mix-blend-mode: multiply` on the `<Image>` — this blends the white away on dark backgrounds, making the logo appear to float. Works well for logos with solid-color fills against white.
2. Request/use a PNG version of the logo with transparent background (preferred long-term).
3. Place the logo only in the footer (which may use a lighter background), not the dark header.

**Warning signs:** Logo appears as a white rectangle in the header on first implementation.

### Pitfall 2: `teal-50` is used but may not be defined in current @theme

**What goes wrong:** `hover:bg-teal-50` is used in BriefCard and methodology page outlined buttons. If `--color-teal-50` is not defined in `@theme`, Tailwind v4 may fall back to the default theme's `teal-50` value — but only if the default `teal-*` tokens are not reset. If `--color-*: initial` is used to clear all defaults, `teal-50` disappears and the class silently produces no background.

**Why it happens:** Tailwind v4 does not auto-generate intermediate tints from a single base color — each shade must be defined explicitly.

**How to avoid:** Either (a) define `--color-teal-50` (or its replacement `--color-amr-green-pale`) explicitly, or (b) replace `hover:bg-teal-50` with `hover:bg-amr-green-pale` in the affected components.

### Pitfall 3: Logo image dimensions and aspect ratio

**What goes wrong:** The AMR Logo JPEG is a portrait-orientation document-style image (approximately 900×1200). Rendering it at a fixed width in the header without constraining height will produce an enormous image.

**Why it happens:** `next/image` requires explicit `width` and `height` props (intrinsic dimensions) and then you control display size with CSS `className`. Without `object-contain` and a fixed container size, the image may overflow the header.

**How to avoid:** Wrap the `<Image>` in a constrained container, set display dimensions via Tailwind classes, and always include `className="object-contain"`.

### Pitfall 4: WCAG AA contrast — AMR green on dark green backgrounds

**What goes wrong:** If the dark background color (`amr-dark`) is derived from the logo's forest green (e.g., `#1A3A2A`), using `amr-green` (`#0F8A5F`) text on that background may fail WCAG AA 4.5:1 contrast minimum.

**Why it happens:** Two adjacent greens can have similar luminance values despite appearing different to the eye.

**How to avoid:** Test all critical text/background pairs before finalizing hex values:
- White `#FFFFFF` on `amr-green` `#0F8A5F` → approximately 3.3:1 (FAILS AA for normal text, passes for large text at 3:1)
- White `#FFFFFF` on dark `#1A3A2A` → approximately 10:1 (PASSES)
- `amr-green` text on white background → approximately 3.3:1 (FAILS for small text)

**CRITICAL DISCOVERY:** `#0F8A5F` (MASTER doc Emerald Green) does NOT pass WCAG AA 4.5:1 against white for normal-size text. White text on `#0F8A5F` is approximately 3.3:1 — acceptable only for large text (18pt+) or bold 14pt+. This means CTA button text (`bg-amr-green text-white`) is borderline. **The planner must check this and either darken the green or accept AA Large Text compliance only for buttons.**

**Warning signs:** White text on green buttons fails automated accessibility audits.

### Pitfall 5: The `@components` import path alias ambiguity

**What goes wrong:** Some components import from `@/components/layout/Container` but the tsconfig maps `@/*` to `./app/*`, meaning the actual file is `app/components/layout/Container.tsx`. This is already working — but if new files are added outside `app/`, imports will fail.

**Why it happens:** tsconfig `"@/*": ["./app/*"]` — note this maps to `app/`, not project root.

**How to avoid:** Place all new component additions inside `app/components/`. Do not create a root-level `components/` folder.

---

## Code Examples

Verified patterns from official sources:

### Tailwind v4 @theme complete replacement

```css
/* Source: https://tailwindcss.com/docs/theme */
/* Option A — Rename tokens (more semantic, requires class renames in 12 files) */
@theme {
  --color-*: initial;  /* wipe ALL default Tailwind colors */

  /* AMR Brand Colors */
  --color-amr-dark: #1A3A2A;
  --color-amr-dark-mid: #1F4A35;
  --color-amr-dark-border: #2D5A42;
  --color-amr-green: #0F8A5F;
  --color-amr-green-light: #12A572;
  --color-amr-green-pale: #D4EFE4;
  --color-amr-gold: #F2A900;

  /* Neutral (keep existing slate tokens) */
  --color-slate-50: #F8FAFC;
  --color-slate-100: #F1F5F9;
  --color-slate-200: #E2E8F0;
  --color-slate-400: #94A3B8;
  --color-slate-600: #475569;
  --color-slate-900: #0F172A;
  --color-white: #FFFFFF;
  --color-red-500: #EF4444;    /* keep for form error states */
  --color-red-600: #DC2626;
  --color-amber-50: #FFFBEB;   /* keep for noscript warning in ContactForm */
  --color-amber-200: #FDE68A;
  --color-amber-800: #92400E;
}

/* Option B — Replace hex values, keep class names (zero component file changes) */
@theme {
  --color-navy-950: #1A3A2A;   /* was #0F172A, now AMR dark green */
  --color-navy-900: #1F4A35;   /* was #1E293B */
  --color-navy-800: #2D5A42;   /* was #2D3F55 */
  --color-teal-600: #0F8A5F;   /* was #0D9488, now AMR Emerald Green */
  --color-teal-500: #12A572;   /* was #14B8A6 */
  --color-teal-400: #1DBF84;   /* was #2DD4BF */
  --color-teal-50: #D4EFE4;    /* was absent — ADD for hover:bg-teal-50 */
  /* slate tokens unchanged */
}
```

**Recommendation: Use Option B.** It requires changing only `app/globals.css`. Zero component file changes. The token names remain "teal/navy" but their values are now the AMR brand colors. Add a comment explaining the aliasing.

### Next.js Image for logo in Header

```tsx
// Source: https://nextjs.org/docs/app/api-reference/components/image
import Image from 'next/image';

// In Header.tsx, replace the text wordmark:
<Link href="/" className="flex items-center">
  <Image
    src="/amr-logo.jpeg"
    alt="AntiMicrobial Resistance Initiative"
    width={160}
    height={64}
    priority
    className="object-contain h-12 w-auto"
    style={{ mixBlendMode: 'multiply' }}  // blends white bg on dark header
  />
</Link>
```

### Next.js Image for logo in Footer

```tsx
// Footer.tsx — replace the text wordmark block
<div className="max-w-sm">
  <Image
    src="/amr-logo.jpeg"
    alt="AntiMicrobial Resistance Initiative"
    width={120}
    height={48}
    className="object-contain h-10 w-auto mb-2"
    style={{ mixBlendMode: 'multiply' }}
  />
  <p className="text-slate-300 text-sm mt-1">Africa AMR Modeling Initiative</p>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js for design tokens | `@theme` block in CSS | Tailwind v4 (2024) | No JS config file — all tokens in globals.css |
| `darkMode: 'class'` config option | `@custom-variant dark` in CSS | Tailwind v4 | Already handled correctly in the project |
| `<img>` tags in Next.js | `next/image` with `unoptimized: true` | Next.js + static export | ExpertCard and BriefCard already use `<img>` tags — acceptable, though `<Image>` is preferred for new additions |

**Deprecated in this project's stack:**
- `tailwind.config.js` — does not exist, correctly absent for Tailwind v4
- `next/font/google` — already removed (Phase 3); globals.css comment references it but font imports were removed

---

## Open Questions

1. **Should we use Option A (rename tokens) or Option B (keep names, change hex)?**
   - What we know: Option B requires changing only 1 file; Option A requires changing 13 files but is more semantically correct
   - What's unclear: Project maintainer preference for semantic token naming
   - Recommendation: Default to Option B (change hex only) for this phase; semantic rename can be a future improvement

2. **Exact hex values for AMR Green, Gold, Grey**
   - What we know: MASTER doc specifies `#0F8A5F` green and `#F2A900` gold; logo confirms these are directionally correct
   - What's unclear: Whether these are the exact pixel values the logo designer used, or approximations
   - Recommendation: Use MASTER doc values as authoritative. Sample the JPEG with a color picker at plan time to validate. If no discrepancy > 10 units on any channel, use MASTER values.

3. **Logo placement in header — white background blending**
   - What we know: The JPEG has a white background; `mix-blend-mode: multiply` should blend it on dark backgrounds
   - What's unclear: Whether `mix-blend-mode: multiply` works reliably for this logo on all browsers in static export context
   - Recommendation: Test in browser before finalizing. Alternative: use the logo only on light-background areas (footer only, or a light header variant).

4. **WCAG AA compliance for green on white (small text)**
   - What we know: `#0F8A5F` on white is approximately 3.3:1 — fails AA for normal text (< 18pt)
   - What's unclear: Whether teal-colored small text (BriefCard week labels, FeaturedBrief labels, ExpertCard titles) must pass AA
   - Recommendation: Either darken the green to approximately `#0A7050` (which achieves 4.5:1 on white), or document the decision to accept AA Large Text compliance for accent text.

---

## Sources

### Primary (HIGH confidence)
- Direct file inspection: `app/globals.css` — complete @theme block mapped
- Direct file inspection: All 12 component and page TSX files — complete navy/teal class audit
- Direct file inspection: `next.config.js` — `images: { unoptimized: true }` confirmed
- Direct image inspection: `AMR Logo_Feb2026.jpeg` — colors visually identified
- https://tailwindcss.com/docs/theme — @theme block behavior, CSS variable naming, `--color-*: initial` reset pattern

### Secondary (MEDIUM confidence)
- https://nextjs.org/docs/app/api-reference/components/image — `<Image>` API, static export with `unoptimized: true`
- MASTER document values for brand colors (`#0F8A5F`, `#F2A900`) — referenced in project prior decisions, not directly inspected in this session

### Tertiary (LOW confidence)
- Visual hex estimates from logo JPEG (`#1A6B3C`, `#E8A020`, `#5A6472`) — visual sampling, not pixel-measured
- WCAG contrast ratio estimates for `#0F8A5F` on white (~3.3:1) — calculated from luminance formula, not run through official checker

---

## Metadata

**Confidence breakdown:**
- Color audit (files scanned): HIGH — direct source inspection, complete
- Logo color identification: MEDIUM — visual estimate; pixel-sampled values needed at plan time
- Tailwind v4 @theme behavior: HIGH — verified against official docs
- Next.js Image static export: HIGH — confirmed against next.config.js + official docs
- WCAG contrast estimates: MEDIUM — estimated, needs official checker validation at plan time

**Research date:** 2026-04-28
**Valid until:** 2026-05-28 (stable tech stack — Tailwind v4 and Next.js docs stable)
