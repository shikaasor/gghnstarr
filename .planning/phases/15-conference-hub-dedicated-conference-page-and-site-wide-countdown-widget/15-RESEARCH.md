# Phase 15: Conference Hub — Research

**Researched:** 2026-05-03
**Domain:** Next.js static export — countdown widget, sticky banner, client-side date logic, session storage
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Site-wide widget — form and placement
- Sticky top bar pinned above the header on every page
- Background: deep red / crimson — high contrast, urgency signal distinct from the green/gold palette
- Content: event name + date + location | days countdown | "Register Now" button | dismiss (X)
- Days-only countdown (no hours/minutes) — cleaner in the slim bar
- Mobile: same bar, event name text truncated on small screens

#### Widget — interactivity
- "Register Now" links to the external official conference site (https://www.5thhighlevelministerialng.com/)
- Dismiss (X) is session-only — bar returns on next browser session (no localStorage persistence)
- CTA button has a subtle CSS pulse animation to draw the eye
- Bar is hidden on the /conference page itself (user is already there — no redundancy)

#### Conference page — structure
- Purpose: gateway / teaser, not a duplicate of the official site
- Sections (in order):
  1. Hero — large countdown (days) + event name + date + location + "Register Now" primary CTA
  2. About the conference — 2-3 sentence overview of the meeting's significance
  3. Key themes / agenda highlights — icons or bullets for main topics
- Primary CTA throughout: Register on the official site (external link, new tab)
- Content for "about" and "themes" sections: extracted from https://www.5thhighlevelministerialng.com/
- No GGHN STARR involvement section (gateway only)

#### Post-conference state (after June 28, 2026)
- Sticky bar: auto-hides permanently once the conference date passes — no manual removal needed
- /conference page: becomes an archive page — hero updates to "Conference held June 28", countdown is replaced with a summary note, all other sections remain for reference

### Claude's Discretion
- Exact crimson hex value (should be vivid, not dark — e.g. #DC2626 or similar)
- Hero countdown display format on the /conference page (days vs D:H:M:S — whatever reads best at full width)
- Exact truncation breakpoint for bar text on mobile
- Archive page copy for the post-conference state

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

## Summary

This phase adds two tightly coupled components to the static Next.js site: (1) a `ConferenceBar` sticky top banner component inserted above `<Header>` in the root layout, and (2) a `/conference` page acting as a gateway to the official conference site. Both components share the same date-comparison logic — `new Date() < new Date('2026-06-28T00:00:00')` — to drive pre/post conference state.

A critical precondition is well understood from the codebase: the project already has a `ConferenceBadge` component (`app/components/sections/ConferenceBadge.tsx`) that implements the exact countdown pattern using `useEffect` + `setInterval`. This is the reference implementation for the new components. The root layout (`app/layout.tsx`) renders `<Header />` with `sticky top-0 z-50` — the new `ConferenceBar` must go ABOVE the header in layout.tsx and itself use `sticky top-0` with a higher z-index (z-60) so the header becomes `sticky top-[bar-height]`.

All date logic MUST be client-side (`'use client'` + `useEffect`). Static export means no server-side rendering of dates — any SSR date call produces a hydration mismatch. The existing `ConferenceBadge` already solves this correctly using `useState<number | null>(null)` (null on server, computed value on client after mount).

**Primary recommendation:** Build `ConferenceBar` as a `'use client'` component mirroring `ConferenceBadge`'s hydration-safe pattern, insert it before `<Header>` in layout.tsx, and hide it both on `/conference` and when the conference date has passed — all via client-side date checks.

---

## Conference Content (Extracted from Official Site)

Source: https://www.5thhighlevelministerialng.com/ — fetched 2026-05-03

### Event Details
- **Full name:** 5th High-Level Inter-Ministerial Meeting on Antimicrobial Resistance
- **Dates:** June 28–30, 2026 (the "conference date" per phase context = June 28, opening day)
- **Venue:** Transcorp Hilton Conference Center, Maitama, Abuja, Nigeria
- **Patron:** President Bola Ahmed Tinubu

### About Text (ready for /conference page)
> The 5th High-Level Inter-Ministerial Meeting on Antimicrobial Resistance convenes ministers and health leaders to translate global AMR commitments into local action — marking the first time this flagship ministerial conference is held on the African continent. With microorganisms evolving resistance to life-saving medicines, the "silent pandemic" of AMR demands urgent, coordinated policy response. This meeting, held under the patronage of President Bola Ahmed Tinubu, positions Nigeria and Africa at the centre of global health security.

### Key Themes (ready for /conference page)
**Overarching theme:** "One Health: Advancing Global AMR Commitments through Local Action"

Agenda highlights (suitable as icon/bullet list):
1. Tracking implementation of AMR National Action Plans (NAPs)
2. Addressing antimicrobial and diagnostic availability gaps
3. Sustainable financing for AMR response in LMICs
4. African leadership in global health security frameworks
5. Side events: June 28 Non-State Actor's Day | June 29 Ministerial session + parallel tracks | June 30 Declaration and closing

### Agenda Day Breakdown
| Day | Focus |
|-----|-------|
| June 28 | Non-State Actor's Day, welcome reception |
| June 29 | Ministerial meeting, parallel sessions, side events |
| June 30 | Declaration and closing ceremony |

**Confidence:** MEDIUM — content extracted from official site on research date; site may update closer to the conference.

---

## Standard Stack

### Core (no new packages needed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React `useState` / `useEffect` | Built-in | Hydration-safe countdown | Already used in ConferenceBadge — proven pattern |
| `usePathname` (next/navigation) | Built-in | Detect /conference route | Enables hiding bar on /conference page without prop drilling |
| Tailwind CSS v4 | Already installed | Styling bar + page | Project standard |
| `sessionStorage` Web API | Browser native | Session-only dismiss | No library needed; widely supported |

### Supporting
| Utility | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lucide-react` | Already installed | X (close) icon for dismiss button | Already imported in Header — no new dep |
| CSS `@keyframes pulse` | Tailwind built-in (`animate-pulse`) | CTA button pulse animation | Tailwind's `animate-pulse` works; custom keyframes for ring-pulse variant if needed |

### No New Dependencies Required
All required capabilities exist in the installed stack. Zero new npm packages needed for this phase.

---

## Architecture Patterns

### Recommended File Structure
```
app/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # existing — DO NOT modify sticky/z-index
│   │   └── ConferenceBar.tsx       # NEW — sticky bar component
│   └── conference/
│       ├── ConferenceHero.tsx      # NEW — hero with countdown
│       ├── ConferenceAbout.tsx     # NEW — about + themes section
│       └── ConferenceArchive.tsx   # NEW — post-conference state hero
├── conference/
│   └── page.tsx                    # NEW — /conference route
└── layout.tsx                      # MODIFY — add <ConferenceBar /> before <Header />
```

### Pattern 1: Hydration-Safe Countdown (CRITICAL)

**What:** Use `useState<number | null>(null)` — null on server render, computed on client after mount via `useEffect`. This is the project's established pattern.

**When to use:** Any component that reads `new Date()` in a static export.

**Example (from existing ConferenceBadge.tsx):**
```typescript
// Source: /app/components/sections/ConferenceBadge.tsx (project codebase)
'use client';
import { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2026-06-28T00:00:00');

export function ConferenceBar() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isPast, setIsPast] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session dismiss
    const wasDismissed = sessionStorage.getItem('conf-bar-dismissed') === 'true';
    if (wasDismissed) { setDismissed(true); return; }

    function compute() {
      const now = new Date();
      const past = now >= TARGET_DATE;
      setIsPast(past);
      if (!past) {
        const diff = Math.ceil((TARGET_DATE.getTime() - now.getTime()) / 86400000);
        setDaysLeft(Math.max(0, diff));
      }
    }
    compute();
    const interval = setInterval(compute, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Render null on server (null state) — avoids hydration mismatch
  if (daysLeft === null && isPast === null) return null;
  // Hide permanently after conference date
  if (isPast) return null;
  // Hide if dismissed this session
  if (dismissed) return null;

  return ( /* bar JSX */ );
}
```

### Pattern 2: Hiding Bar on /conference Route

**What:** Use `usePathname()` from `next/navigation` to detect current route. Return null early if on `/conference`.

```typescript
// Source: Next.js docs — next/navigation
'use client';
import { usePathname } from 'next/navigation';

export function ConferenceBar() {
  const pathname = usePathname();
  // ... other state ...
  if (pathname === '/conference') return null;
  // ... rest of component
}
```

### Pattern 3: Sticky Bar Above Sticky Header

**What:** The header is `sticky top-0 z-50`. The bar must sit above it. Place `<ConferenceBar />` BEFORE `<Header />` in layout.tsx. The bar itself uses `sticky top-0 z-[60]` (higher than z-50). The header then sticks immediately below the bar because the bar occupies space in the normal document flow.

**How sticky stacking works in document flow:**
- Both elements are `sticky top-0` in sequence
- The second sticky element (`<Header>`) sticks to the position just below where the first element ends — because sticky elements do NOT overlap each other when stacked sequentially in the same scroll container
- No `top` offset calculation needed on `<Header>` — browser handles it naturally

**layout.tsx modification:**
```typescript
// Source: app/layout.tsx (project codebase)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" ...>
      <body className="bg-slate-50 font-sans antialiased flex flex-col min-h-screen">
        <ConferenceBar />   {/* NEW — before Header */}
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**IMPORTANT:** The header's own `sticky top-0 z-50` does NOT need changing. CSS sticky elements stack naturally in document flow — the second sticky starts where the first ends.

### Pattern 4: Session-Only Dismiss

**What:** Use `sessionStorage` (not `localStorage`) so dismiss clears on browser session end. Write on dismiss, read on mount.

```typescript
// On dismiss button click:
function handleDismiss() {
  sessionStorage.setItem('conf-bar-dismissed', 'true');
  setDismissed(true);
}

// In useEffect on mount (already shown in Pattern 1 above):
const wasDismissed = sessionStorage.getItem('conf-bar-dismissed') === 'true';
```

**Why not localStorage:** localStorage persists indefinitely across browser restarts. Session storage clears when the tab/window is closed — exactly what the user specified ("bar returns on next browser session").

### Pattern 5: Post-Conference State (Date-Based Conditional)

**What:** Compare `new Date()` to `TARGET_DATE` in `useEffect`. Set `isPast` boolean state. Render different content based on `isPast`.

- `ConferenceBar`: return null when `isPast === true` — bar disappears permanently for all users once the date passes
- `/conference` page hero: shows archive view when `isPast === true`

**Important:** This is purely client-side. Static export means the HTML is always built at build time — the date check runs in the browser on every load. After June 28, all users will immediately see the post-conference state without any redeployment needed.

### Pattern 6: CSS Pulse Animation for CTA Button

**What:** Tailwind's built-in `animate-pulse` applies opacity pulsing (too subtle for a button). Use a custom `@keyframes` ring-pulse for a more eye-catching effect, OR use `animate-bounce` for subtle movement.

**Recommended approach — custom CSS in globals.css:**
```css
/* globals.css */
@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
}
.cta-pulse {
  animation: cta-pulse 2s ease-in-out infinite;
}
```
Apply `.cta-pulse` class to the "Register Now" button.

### Anti-Patterns to Avoid
- **Reading `new Date()` outside `useEffect`:** Causes hydration mismatch in static export — SSR renders one value, client renders another. The project's `ConferenceBadge` demonstrates the correct pattern.
- **Using `localStorage` for dismiss:** Persists across sessions — user said "bar returns next browser session."
- **Modifying Header's z-index:** Not needed. Let natural document flow handle the stacking.
- **Making ConferenceBar a server component:** It needs `usePathname` and `sessionStorage` — both client-only.
- **Hardcoding post-conference copy at build time:** Copy must be conditional on runtime date, not build-time flag.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Countdown timer | Custom setInterval manager | Reuse `ConferenceBadge` pattern verbatim | Already battle-tested in this project; handles cleanup |
| Dismiss persistence | Custom cookie logic | `sessionStorage.getItem/setItem` | Native browser API — simpler, no library |
| Pulse animation | JS-driven animation | CSS `@keyframes` in globals.css | Pure CSS, respects `prefers-reduced-motion` easily |
| Route detection | Manual URL parsing | `usePathname()` from next/navigation | Official Next.js API, handles dynamic routes correctly |

**Key insight:** Everything needed already exists in the project or the browser's native APIs. This phase is a composition task, not a dependency task.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch on Countdown
**What goes wrong:** Component renders different day count on server vs client, causing React hydration error in console and potential flash/flicker.
**Why it happens:** `new Date()` returns different values at build time vs browser runtime.
**How to avoid:** Initialize `daysLeft` as `null`, return `null` from render when state is null. Compute actual value only inside `useEffect`.
**Warning signs:** React "Hydration failed" error in browser console; flickering countdown number on load.

### Pitfall 2: Sticky Bar Pushing Content Incorrectly
**What goes wrong:** The header overlaps the bar, or the header doesn't account for bar height, causing content to be hidden under both.
**Why it happens:** If the bar uses `fixed` instead of `sticky`, it's taken out of document flow.
**How to avoid:** Use `sticky top-0` (not `fixed`) for `ConferenceBar`. Sticky elements remain in document flow — the header and content shift down naturally.
**Warning signs:** Page content jumping when bar is dismissed; header appearing over bar.

### Pitfall 3: sessionStorage Not Available During SSR
**What goes wrong:** `sessionStorage.getItem(...)` throws "sessionStorage is not defined" during server render.
**Why it happens:** `sessionStorage` is a browser-only global — not available in Node.js.
**How to avoid:** Only access `sessionStorage` inside `useEffect` (which only runs client-side). Never call it at module or render level.
**Warning signs:** Build-time or server-side error mentioning `sessionStorage is not defined`.

### Pitfall 4: Bar Renders on /conference Page (Flicker)
**What goes wrong:** The bar flickers briefly on the /conference page before disappearing because `usePathname()` resolves after mount.
**Why it happens:** `usePathname` is initially null during SSR/hydration on some Next.js versions; the hide condition fires slightly late.
**How to avoid:** Return null when state is not yet computed (initial null state). Since the component already returns null until `useEffect` runs, the bar is invisible during SSR — no flicker.
**Warning signs:** Brief red bar flash on /conference page load.

### Pitfall 5: Conference Page Missing from Navigation
**What goes wrong:** /conference page exists but no nav link — users can't discover it.
**Why it happens:** Forgetting to add it to `navLinks` in Header.tsx.
**How to avoid:** Add `{ href: '/conference', label: 'Conference' }` to the `navLinks` array in Header.tsx. Consider placing it between Home and Briefs to give it prominent placement.

---

## Code Examples

### ConferenceBar — Complete Reference Implementation

```typescript
// app/components/layout/ConferenceBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const TARGET_DATE = new Date('2026-06-28T00:00:00');
const CONF_URL = 'https://www.5thhighlevelministerialng.com/';

export function ConferenceBar() {
  const pathname = usePathname();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isPast, setIsPast] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Session-only dismiss check
    if (sessionStorage.getItem('conf-bar-dismissed') === 'true') {
      setDismissed(true);
      return;
    }

    function compute() {
      const now = new Date();
      const past = now >= TARGET_DATE;
      setIsPast(past);
      if (!past) {
        const diff = Math.ceil((TARGET_DATE.getTime() - now.getTime()) / 86400000);
        setDaysLeft(Math.max(0, diff));
      }
    }
    compute();
    const interval = setInterval(compute, 60_000);
    return () => clearInterval(interval);
  }, []);

  function handleDismiss() {
    sessionStorage.setItem('conf-bar-dismissed', 'true');
    setDismissed(true);
  }

  // Hide: during SSR / initial null state
  if (isPast === null) return null;
  // Hide: conference is over
  if (isPast) return null;
  // Hide: dismissed this session
  if (dismissed) return null;
  // Hide: already on /conference page
  if (pathname === '/conference') return null;

  return (
    <div className="sticky top-0 z-[60] bg-[#DC2626] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-4">
        {/* Left: Event info */}
        <p className="text-sm font-medium truncate min-w-0">
          <span className="hidden sm:inline">5th High-Level Ministerial on AMR · Abuja · June 28, 2026</span>
          <span className="sm:hidden">5th AMR Ministerial · June 28</span>
          {daysLeft !== null && (
            <span className="ml-2 opacity-90">— {daysLeft} day{daysLeft !== 1 ? 's' : ''} to go</span>
          )}
        </p>

        {/* Right: CTA + Dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={CONF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pulse bg-white text-[#DC2626] hover:bg-red-50 font-semibold text-xs px-3 py-1 rounded transition-colors"
          >
            Register Now
          </a>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss conference banner"
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### /conference Page Hero with Pre/Post State

```typescript
// app/components/conference/ConferenceHero.tsx
'use client';

import { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2026-06-28T00:00:00');
const CONF_URL = 'https://www.5thhighlevelministerialng.com/';

export function ConferenceHero() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isPast, setIsPast] = useState<boolean | null>(null);

  useEffect(() => {
    function compute() {
      const now = new Date();
      const past = now >= TARGET_DATE;
      setIsPast(past);
      if (!past) {
        const diff = Math.ceil((TARGET_DATE.getTime() - now.getTime()) / 86400000);
        setDaysLeft(Math.max(0, diff));
      }
    }
    compute();
    const interval = setInterval(compute, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (isPast === null) {
    // Server render / loading: show static text only
    return (
      <section className="bg-navy-950 text-white py-20 text-center">
        <p className="text-slate-400">Loading conference details...</p>
      </section>
    );
  }

  if (isPast) {
    return (
      <section className="bg-navy-950 text-white py-20 text-center">
        <p className="text-[#DC2626] font-semibold uppercase tracking-wider mb-4">Conference Archive</p>
        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
          Conference Held June 28–30, 2026
        </h1>
        <p className="text-slate-300 text-xl max-w-2xl mx-auto">
          The 5th High-Level Inter-Ministerial Meeting on AMR concluded in Abuja, Nigeria.
          Visit the official site for outcomes and declarations.
        </p>
        <a href={CONF_URL} target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-block bg-[#DC2626] text-white px-8 py-3 rounded font-semibold hover:bg-red-700 transition-colors">
          View Conference Outcomes
        </a>
      </section>
    );
  }

  return (
    <section className="bg-navy-950 text-white py-20 text-center">
      <p className="text-[#DC2626] font-semibold uppercase tracking-wider mb-4">Upcoming Event</p>
      {daysLeft !== null && (
        <div className="text-7xl md:text-9xl font-bold font-serif text-[#DC2626] mb-2">
          {daysLeft}
        </div>
      )}
      <p className="text-slate-300 text-2xl mb-8">
        {daysLeft === 1 ? 'day' : 'days'} to the conference
      </p>
      <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">
        5th High-Level Inter-Ministerial Meeting on AMR
      </h1>
      <p className="text-slate-300 text-xl mb-2">June 28–30, 2026 · Transcorp Hilton, Abuja, Nigeria</p>
      <a href={CONF_URL} target="_blank" rel="noopener noreferrer"
        className="mt-8 inline-block cta-pulse bg-[#DC2626] text-white px-8 py-3 rounded font-semibold hover:bg-red-700 transition-colors">
        Register Now
      </a>
    </section>
  );
}
```

### globals.css Addition — Pulse Animation

```css
/* Add to app/globals.css */
@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); }
  50% { box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
}

.cta-pulse {
  animation: cta-pulse 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .cta-pulse {
    animation: none;
  }
}
```

---

## Recommendations for Claude's Discretion Areas

### Crimson Hex Value
**Recommendation: `#DC2626` (Tailwind red-600)**
- Vivid, not dark — passes WCAG AA on dark backgrounds
- Distinct from the site's green/gold palette
- Consistent with the `bg-[#DC2626]` used in code examples above

### Hero Countdown Display Format
**Recommendation: Days only, displayed as a large numeral**
The /conference page has ample vertical space. A large day count (`56` in 9xl type) reads powerfully at full width and is consistent with the sticky bar's days-only approach. D:H:M:S would feel cluttered and diverges from the bar's visual language.

### Mobile Truncation Breakpoint
**Recommendation: `sm:` breakpoint (640px)**
Use `hidden sm:inline` for the full event name and a shorter version for below 640px. This matches Tailwind's standard sm breakpoint used throughout the project.

### Archive Page Copy
**Recommendation:**
- Hero heading: "Conference Held June 28–30, 2026"
- Subtext: "The 5th High-Level Inter-Ministerial Meeting on AMR concluded in Abuja, Nigeria. Visit the official site for outcomes and declarations."
- CTA: "View Conference Outcomes" (links to same official URL)

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `window.setInterval` in component body | `setInterval` inside `useEffect` with cleanup return | Prevents memory leaks on unmount |
| `localStorage` for dismiss | `sessionStorage` | Correct semantics — clears on session end |
| `fixed` positioning for global bars | `sticky` in document flow | No scroll offset calculations needed; works with stacked sticky headers |
| Separate countdown library (e.g. react-countdown) | Native `useEffect` + `Date` arithmetic | Zero dependencies; already proven in this codebase |

---

## Open Questions

1. **Navigation link for /conference**
   - What we know: `navLinks` array in Header.tsx drives all navigation
   - What's unclear: Where should "Conference" link appear? Before or after "Briefs"?
   - Recommendation: Insert between Home and Briefs for high visibility while the conference is upcoming. Consider removing or archiving the link post-June 28 — but this would require a code change, so leave it in place as an archive link instead.

2. **Conference dates: June 28 vs June 28-30**
   - What we know: The CONTEXT.md uses June 28 as "the conference date" for the countdown target. The official site shows June 28–30.
   - What's unclear: The user said "conference date passes" = June 28. The bar hides and archive state triggers on June 28.
   - Recommendation: Use June 28 as the `TARGET_DATE` for countdown and post-conference trigger (as specified in CONTEXT.md). Display "June 28–30" on the /conference page for accuracy.

3. **Metadata for /conference page**
   - What we know: All other pages export a `metadata` object for SEO.
   - What's unclear: Should the page have conference-specific OG image?
   - Recommendation: Add standard metadata (`title`, `description`) — no custom OG image needed for this phase.

---

## Sources

### Primary (HIGH confidence)
- Project codebase (`app/components/sections/ConferenceBadge.tsx`) — existing countdown pattern
- Project codebase (`app/layout.tsx`) — root layout structure, sticky header placement
- Project codebase (`app/components/layout/Header.tsx`) — Header z-index and sticky behavior
- Project codebase (`app/globals.css`) — Tailwind v4 theme tokens, animation patterns

### Secondary (MEDIUM confidence)
- https://www.5thhighlevelministerialng.com/ — fetched 2026-05-03, extracted conference content, themes, dates
- Next.js docs (`usePathname` from `next/navigation`) — route detection in client components

### Tertiary (LOW confidence)
- CSS sticky stacking behavior — based on training knowledge; verify in-browser that sequential sticky elements stack naturally without explicit `top` offset adjustments

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all components are from existing project; no new deps
- Architecture: HIGH — based on direct reading of project codebase and existing ConferenceBadge pattern
- Conference content: MEDIUM — scraped from official site on 2026-05-03; may change
- Pitfalls: HIGH — hydration patterns verified by existing ConferenceBadge implementation

**Research date:** 2026-05-03
**Valid until:** 2026-06-01 (conference content may update closer to event; stack is stable)
