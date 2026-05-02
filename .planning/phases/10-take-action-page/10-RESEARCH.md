# Phase 10: Take Action Page - Research

**Researched:** 2026-05-02
**Domain:** Next.js static export / React form UX / Google Apps Script webhook / file downloads
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Page layout
- Two form cards (Pledge + Prescribing Commitment) displayed side-by-side in a card grid — NOT tabs, NOT a vertical scroll
- Forms grouped as a visual block at the top; Advocacy Toolkit is a separate full-width section below
- Cards show a summary (title + description) by default; clicking opens/expands the form inline
- On mobile: cards stack vertically (full-width), toolkit remains full-width below
- Default state on page load (no deep link): Pledge card is pre-expanded

#### Form success states
- On successful submission: card collapses back to summary view + a brief toast/notification appears at the top of the page
- Success message tone: affirming and cause-focused — ties submission back to the AMR mission (e.g. "Your pledge contributes to the fight against AMR in Africa")
- After successful submission: card is locked — cannot be re-opened or re-submitted in the same session
- On submission error: inline error message below the submit button, form stays open

#### Form backend — IMPORTANT
- Formspree is NOT being used. All forms use a configurable backend:
  - Option A: Google Sheets integration (via Google Apps Script webhook — same pattern as newsletter signup)
  - Option B: Postgres DB (requires server-side endpoint — API route or separate service)
- A configuration YAML file determines which backend is active based on deployment environment
- This applies to ALL forms on the site (pledge form, prescribing commitment form)
- Architecture note: The static Next.js export constraint means Postgres requires a server-side API route or external service. Research must address how this works within the static export setup

#### Advocacy toolkit
- Assets displayed as a download card grid (3-column desktop, stacks on mobile)
- Each card shows: title + short description + format label (e.g. [PDF])
- Section has an introductory heading + 1-2 sentence blurb explaining what the toolkit is for, above the cards
- Real asset files will be provided by the user — plan should set up the infrastructure (public/toolkit/ directory, DownloadCard component, download link wiring) ready to receive the files
- Minimum 3 assets: fact sheet, letter template, social media card

#### Section targeting & CTAs
- Deep links from AudienceCTAs homepage section should scroll to AND auto-expand the correct card:
  - Minister CTA → `/take-action#pledge` → Pledge card auto-expands
  - Healthcare worker CTA → `/take-action#commitment` → Commitment card auto-expands
- Header nav: Add "Take Action" link rendered as a button (filled, AMR gold or green) — visually distinguished from plain nav links

### Claude's Discretion
- Exact card expand/collapse animation (accordion vs smooth height transition)
- Toast notification positioning and duration
- Session lock implementation (sessionStorage or in-component state)
- Exact spacing, typography, and icon choices within cards
- How to handle hash-based auto-expand on initial page load (URL hash detection)

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ACTN-01 | A dedicated Take Action page (/take-action) exists with three distinct sections: pledge, prescribing commitment, and advocacy toolkit | Page structure pattern from existing pages; `app/take-action/page.tsx` + section components |
| ACTN-02 | A visitor can submit a public pledge form (name, country, role, commitment statement) via configurable backend and receive a confirmation message | Google Apps Script webhook pattern proven in NewsletterSignup; NEXT_PUBLIC_GAS_PLEDGE_URL env var; toast + card-lock pattern |
| ACTN-03 | A healthcare worker can submit a prescribing commitment form (name, facility, specialty, specific commitment) via configurable backend | Same GAS webhook pattern as ACTN-02, different endpoint env var (NEXT_PUBLIC_GAS_COMMITMENT_URL); separate form component |
| ACTN-04 | Advocacy toolkit section provides downloadable assets (fact sheets, letter templates, social media cards) as direct file downloads | `public/toolkit/` directory + DownloadCard component modelled on existing DownloadButton; `<a href download>` pattern works in static export |
</phase_requirements>

---

## Summary

This phase builds a single `/take-action` page on a Next.js 16 static export project (`output: 'export'`). The codebase is already mature: there are proven patterns for 'use client' form components (NewsletterSignup, ContactForm), accordion expand/collapse (AccordionSection), file downloads (DownloadButton), and the Google Apps Script webhook form backend. The research confirms all required features are implementable within the static export constraint without needing any architecture changes.

The only backend complexity is the "configurable backend" requirement. The approach is: use `NEXT_PUBLIC_GAS_PLEDGE_URL` and `NEXT_PUBLIC_GAS_COMMITMENT_URL` environment variables (same pattern as `NEXT_PUBLIC_GAS_URL` used by NewsletterSignup). At build time, these are baked into the bundle. If a Postgres backend is needed later, it would require either a Vercel API route (breaking static export) or an external service URL — but for this phase, the GAS webhook path is the correct choice as it is proven, working, and compatible with `output: 'export'`.

The hash-based auto-expand (deep link to `#pledge` or `#commitment`) is the most nuanced technical problem. With `output: 'export'`, Next.js does not support `useSearchParams` in server components, but `window.location.hash` is accessible client-side in a `useEffect`. The existing codebase does not yet use this pattern, so it needs to be introduced cleanly in a `'use client'` component — a `useEffect` on mount reads `window.location.hash` and sets the initial expanded card.

**Primary recommendation:** Model all form components on the NewsletterSignup GAS webhook pattern. Use `max-h` CSS transition for expand/collapse (already proven in AccordionSection). Read `window.location.hash` in a `useEffect` to drive initial card state. Keep session lock in React state (no sessionStorage needed since React state is session-scoped already).

---

## Standard Stack

### Core (all already installed — NO new dependencies needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (useState, useEffect) | 19.2.4 | Form state, expand/collapse state, toast state, hash detection | Already in project; no additions needed |
| Next.js Link | 16.2.1 | Navigation, deep links from AudienceCTAs | Already used project-wide |
| Tailwind CSS v4 | ^4.2.2 | All styling — card grid, transitions, responsive layout | Already the project's CSS system |
| lucide-react | ^1.6.0 | Icons (Download, CheckCircle, AlertCircle, Loader2, ChevronDown, FileText, etc.) | Already used project-wide |
| clsx | ^2.1.1 | Conditional class merging | Already used (Container.tsx) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `process.env.NEXT_PUBLIC_GAS_PLEDGE_URL` | N/A (env var) | GAS webhook URL for pledge form | All environments using GAS backend |
| `process.env.NEXT_PUBLIC_GAS_COMMITMENT_URL` | N/A (env var) | GAS webhook URL for commitment form | All environments using GAS backend |
| `window.location.hash` (browser API) | N/A | Read URL fragment for deep link auto-expand | Client-side only, inside useEffect |

### No New Packages Required

**Installation:** None. All needed libraries are already in `package.json`.

---

## Architecture Patterns

### Recommended File Structure

```
app/
├── take-action/
│   └── page.tsx                       # Server component — page metadata + layout shell
app/components/
├── take-action/
│   ├── ActionCardGrid.tsx             # 'use client' — manages which card is expanded + session lock
│   ├── PledgeForm.tsx                 # 'use client' — pledge form fields + GAS submit
│   ├── CommitmentForm.tsx             # 'use client' — commitment form fields + GAS submit
│   ├── ActionToast.tsx                # 'use client' — success toast notification
│   └── DownloadCard.tsx              # Pure display — toolkit asset card
public/
└── toolkit/                          # Placeholder directory — real assets dropped here
    ├── .gitkeep                       # Ensures directory is tracked
    ├── amr-fact-sheet.pdf            # (provided by user)
    ├── amr-letter-template.docx      # (provided by user)
    └── amr-social-card.png          # (provided by user)
```

### Pattern 1: GAS Webhook Form Submit (proven in codebase)

**What:** Client-side POST to Google Apps Script URL, JSON body, `redirect: 'follow'`, check `json.status === 'success'`.
**When to use:** All forms — pledge and commitment. Matches the static export constraint perfectly.

```typescript
// Source: app/components/sections/NewsletterSignup.tsx (verified in codebase)
async function submitToGAS(url: string, payload: Record<string, string>): Promise<'success' | 'error'> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }),
    });
    if (!res.ok) return 'error';
    const json = await res.json();
    return json.status === 'success' ? 'success' : 'error';
  } catch {
    return 'error';
  }
}
```

**Env vars to add to `.env.local`:**
```bash
NEXT_PUBLIC_GAS_PLEDGE_URL=https://script.google.com/macros/s/REPLACE_PLEDGE/exec
NEXT_PUBLIC_GAS_COMMITMENT_URL=https://script.google.com/macros/s/REPLACE_COMMITMENT/exec
```

### Pattern 2: Expand/Collapse with max-h CSS Transition (proven in codebase)

**What:** `max-h-0` → `max-h-[2000px]` transition with `overflow-hidden`. No JS animation library needed.
**When to use:** Form card expand/collapse.

```typescript
// Source: app/components/awareness/AccordionSection.tsx (verified in codebase)
<div
  className={`overflow-hidden transition-all duration-300 ${
    isExpanded ? 'max-h-[2000px]' : 'max-h-0'
  }`}
>
  {/* form content */}
</div>
```

### Pattern 3: URL Hash Detection for Deep Link Auto-Expand

**What:** On mount, read `window.location.hash` to determine which card opens by default. Falls back to Pledge card if no hash.
**When to use:** Initial page render to support `/take-action#pledge` and `/take-action#commitment` deep links.

```typescript
// Pattern for ActionCardGrid.tsx — new code, based on browser API (no framework-specific API needed)
'use client';
import { useState, useEffect } from 'react';

type CardId = 'pledge' | 'commitment' | null;

export default function ActionCardGrid() {
  const [expanded, setExpanded] = useState<CardId>('pledge'); // default per locked decision
  const [locked, setLocked] = useState<Set<CardId>>(new Set());

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as CardId;
    if (hash === 'pledge' || hash === 'commitment') {
      setExpanded(hash);
    }
  }, []);

  function handleToggle(id: CardId) {
    if (locked.has(id)) return; // session-locked after successful submit
    setExpanded(expanded === id ? null : id);
  }

  function handleSuccess(id: CardId) {
    setExpanded(null);       // collapse card
    setLocked(prev => new Set(prev).add(id)); // lock it
    // trigger toast from parent or via callback
  }
  // ...
}
```

**Important:** `window` is only available in the browser. The `useEffect` with `[]` dependency array guarantees it only runs client-side — safe in a `'use client'` component.

### Pattern 4: Toast Notification (no library needed)

**What:** Fixed-position banner at top of viewport. Appears for 4-5 seconds then auto-dismisses via `setTimeout` inside `useEffect`.
**When to use:** After successful form submission.

```typescript
// Recommended implementation pattern
'use client';
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function ActionToast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      <CheckCircle size={18} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
```

**Recommended positioning:** `fixed top-4 left-1/2 -translate-x-1/2` — horizontally centered, 16px from top, above all content. Duration: 5 seconds.

### Pattern 5: Download Card (modelled on DownloadButton)

**What:** A card with title, description, format badge, and a download anchor (`<a href download>`). Static files in `public/toolkit/` are served directly in static export — no server needed.
**When to use:** Advocacy toolkit section.

```typescript
// Source: Modelled on app/components/briefs/DownloadButton.tsx (verified in codebase)
interface DownloadCardProps {
  title: string;
  description: string;
  format: string;       // e.g. 'PDF', 'DOCX', 'PNG'
  href: string;         // e.g. '/toolkit/amr-fact-sheet.pdf'
  filename: string;     // the download filename
}

export function DownloadCard({ title, description, format, href, filename }: DownloadCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-navy-950 font-semibold text-base leading-snug">{title}</h3>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono shrink-0">[{format}]</span>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed flex-grow">{description}</p>
      <a
        href={href}
        download={filename}
        className="inline-flex items-center gap-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium px-4 py-2 rounded transition-colors text-sm self-start"
      >
        <Download size={14} />
        Download
      </a>
    </div>
  );
}
```

### Pattern 6: AudienceCTAs Update

The existing `AudienceCTAs.tsx` has `live: false` placeholder links for "Take Action". After this phase, update those to:

```typescript
// In app/components/sections/AudienceCTAs.tsx
// Minister card:
{ label: 'Take Action', href: '/take-action#pledge', live: true }
// Healthcare worker card:
{ label: 'Take Action', href: '/take-action#commitment', live: true }
```

### Anti-Patterns to Avoid

- **Using `useSearchParams` for hash detection:** `useSearchParams` reads `?query=` params, not `#hash` fragments. For hashes, use `window.location.hash` in a `useEffect`.
- **Reading `window` outside useEffect:** SSR/static generation will throw "window is not defined". Always guard with `useEffect(() => { ... }, [])`.
- **Wrapping the whole page in `'use client'`:** The `page.tsx` should be a Server Component. Only the interactive grid and forms need `'use client'`.
- **Using `<Suspense>` around `useSearchParams` for hash:** Unnecessary here — `window.location.hash` doesn't need Suspense.
- **Session lock with sessionStorage:** In-component React state (`useState<Set>`) is sufficient. State persists for the session (single browser tab) without needing sessionStorage. Using sessionStorage would require SSR guards and adds complexity for no benefit.
- **Using `max-h-[auto]` for collapse target:** `max-h-auto` does not animate in CSS. Use `max-h-[2000px]` for expanded (as the existing AccordionSection does) and `max-h-0` for collapsed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form submission to external API | Custom fetch abstraction | Direct `fetch` matching NewsletterSignup pattern | Already proven pattern in codebase; one file to understand |
| Toast notification | Custom animation library | `fixed` Tailwind div + `setTimeout` in useEffect | No deps; 15 lines of code; fully sufficient |
| Expand/collapse animation | CSS animation with keyframes | `max-h` transition (proven in AccordionSection) | Already working in the project; consistent |
| Form validation | External validation library (Zod, react-hook-form) | HTML5 `required` attributes + `type` constraints | ContactForm.tsx uses this pattern; simple forms don't warrant overhead |
| Session lock persistence | sessionStorage reads/writes with SSR guards | React `useState<Set<CardId>>` | State scoped to component lifetime = session scope; no extra code needed |

**Key insight:** This project's forms are intentionally simple (5-6 fields, single submit). The existing pattern of bare HTML form elements + HTML5 validation + useState is correct. Do not introduce react-hook-form or Zod for this phase.

---

## Common Pitfalls

### Pitfall 1: `window is not defined` during static export build

**What goes wrong:** Accessing `window.location.hash` at the module level or in a Server Component causes a build-time crash: `ReferenceError: window is not defined`.
**Why it happens:** Next.js runs page components server-side during static generation. `window` only exists in the browser.
**How to avoid:** Always read `window.location.hash` inside `useEffect(() => { ... }, [])`. The `'use client'` directive alone does not protect against this — `useEffect` is the required guard.
**Warning signs:** Build error mentioning `window is not defined` in the take-action page build step.

### Pitfall 2: GAS webhook CORS — `redirect: 'follow'` is required

**What goes wrong:** Fetch to Google Apps Script URL fails with CORS error or gets a redirect response that fetch doesn't follow by default.
**Why it happens:** GAS deployed web apps return a 302 redirect before the actual JSON response. Without `redirect: 'follow'`, the response is opaque and `res.ok` is false.
**How to avoid:** Always include `redirect: 'follow'` in the fetch options. This is already the pattern in `NewsletterSignup.tsx` — copy it exactly.
**Warning signs:** Form submits but always shows the error state; browser dev tools show a 302 response.

### Pitfall 3: Hash navigation doesn't auto-expand on first render without useEffect

**What goes wrong:** Deep link `/take-action#pledge` scrolls to the section but the card does not auto-expand.
**Why it happens:** The component renders with the default state before the hash is read. If hash detection is placed in `useState` initializer (not useEffect), it may not detect the hash on initial client hydration.
**How to avoid:** Use `useEffect` with `[]` to read the hash after mount and call `setExpanded()`. The initial `useState` default can be `'pledge'` (per locked decision) but the useEffect overrides it if a different hash is present.
**Warning signs:** Direct navigation to `/take-action#commitment` shows the pledge card open instead of commitment card.

### Pitfall 4: `<a download>` doesn't work for cross-origin URLs

**What goes wrong:** If toolkit asset URLs are absolute external URLs, the `download` attribute is ignored by browsers. The file opens in a new tab instead of downloading.
**Why it happens:** Browser security — `download` attribute only works for same-origin URLs or data: URIs.
**How to avoid:** Store all toolkit assets in `public/toolkit/`. Use relative paths: `href="/toolkit/amr-fact-sheet.pdf"`. Since the site uses `output: 'export'`, files in `public/` are served as static assets — this works correctly.
**Warning signs:** Clicking Download opens the PDF in a new tab instead of triggering a file save.

### Pitfall 5: Card grid on mobile — side-by-side cards create horizontal scroll

**What goes wrong:** Two form cards side-by-side on mobile makes the page wider than the viewport, causing horizontal overflow.
**Why it happens:** `grid-cols-2` without a responsive breakpoint applies on all screen sizes.
**How to avoid:** Use `grid-cols-1 md:grid-cols-2` — stacks on mobile, side-by-side on desktop. This matches the locked decision.
**Warning signs:** Mobile viewport shows horizontal scrollbar on the take-action page.

### Pitfall 6: GAS webhook env var not set — silent failure

**What goes wrong:** If `NEXT_PUBLIC_GAS_PLEDGE_URL` is undefined at build time, the fetch URL is `undefined` and the request fails silently or throws.
**Why it happens:** `output: 'export'` bakes `NEXT_PUBLIC_*` vars into the bundle at build time. Missing vars become `undefined` string in the bundle.
**How to avoid:** Add a guard in the submit function: `if (!url) return 'error';`. Document required env vars clearly in `.env.local`. Log a console.warn in dev if URL is missing.
**Warning signs:** Form submit immediately returns error state; browser network tab shows a request to `undefined` or `[object Object]`.

---

## Code Examples

### Full Page Shell (Server Component)

```typescript
// app/take-action/page.tsx
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import ActionCardGrid from '@/components/take-action/ActionCardGrid';
import ToolkitSection from '@/components/take-action/ToolkitSection';

export const metadata: Metadata = {
  title: 'Take Action Against AMR | GGHN STARR',
  description: 'Sign a public pledge, record your prescribing commitment, and download advocacy toolkit assets to fight antimicrobial resistance in Africa.',
};

export default function TakeActionPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy-950 text-white py-16">
        <Container>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Take Action</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Every commitment matters. Sign a public pledge, record your prescribing commitment,
            or equip your community with advocacy tools.
          </p>
        </Container>
      </section>

      {/* Form Cards — 'use client' component handles state */}
      <section id="forms" className="py-16 bg-slate-50">
        <Container>
          <ActionCardGrid />
        </Container>
      </section>

      {/* Advocacy Toolkit */}
      <section id="toolkit" className="py-16 bg-white">
        <Container>
          <ToolkitSection />
        </Container>
      </section>
    </main>
  );
}
```

### Header Nav Update

```typescript
// In app/components/layout/Header.tsx — add Take Action as button-style link
// Source: verified structure in codebase

const navLinks = [
  // ... existing links
  { href: '/take-action', label: 'Take Action', isButton: true },
];

// In the nav render:
{link.isButton ? (
  <Link
    key={link.href}
    href={link.href}
    className="bg-amr-gold text-navy-950 hover:bg-yellow-400 font-semibold px-4 py-1.5 rounded transition-colors text-sm"
  >
    {link.label}
  </Link>
) : (
  <Link
    key={link.href}
    href={link.href}
    className="text-slate-200 hover:text-teal-400 transition-colors text-sm font-medium"
  >
    {link.label}
  </Link>
)}
```

### Analytics Stubs (already in codebase)

```typescript
// app/lib/analytics.ts already has a no-op placeholder:
export function trackPledgeSubmit() {
  // Phase 10: sendGAEvent('event', 'pledge_submit', {});
}
// Activate this in Phase 10:
export function trackPledgeSubmit() {
  sendGAEvent('event', 'pledge_submit', {});
}
// Add companion:
export function trackCommitmentSubmit() {
  sendGAEvent('event', 'commitment_submit', {});
}
```

---

## Backend Architecture Decision

### Static Export Constraint Analysis

The project uses `output: 'export'` in `next.config.js`. This means:
- **No server-side code runs at request time** — no API routes, no middleware
- **All JavaScript runs client-side** — fetch to external URLs is fine
- **NEXT_PUBLIC_* vars** are baked into the static bundle at build time

**Decision for this phase: Use Google Apps Script webhook (Option A)**

Rationale:
1. It is the proven pattern — `NewsletterSignup.tsx` uses it today with `NEXT_PUBLIC_GAS_URL`
2. Compatible with `output: 'export'` — no architecture change required
3. Can be set up per-form with separate env vars
4. The "configuration YAML" decision from CONTEXT.md is best interpreted as: the `.env.local` file acts as the configuration layer — different values for dev/staging/production environments

**Postgres (Option B) handling:** If the user later chooses Postgres, the required change is: set `NEXT_PUBLIC_*_URL` to point to an external API endpoint (e.g., a Vercel serverless function in a separate deployment, a Railway/Render endpoint). The client-side fetch code does not change. The `output: 'export'` constraint is not violated because the API is external.

**The "configuration YAML" file:** Create a `config/forms.ts` (TypeScript, not YAML — YAML has no first-class support in this stack) that exports the active URL logic:

```typescript
// app/lib/form-config.ts
export const formConfig = {
  pledgeUrl: process.env.NEXT_PUBLIC_GAS_PLEDGE_URL ?? '',
  commitmentUrl: process.env.NEXT_PUBLIC_GAS_COMMITMENT_URL ?? '',
} as const;
```

This is the "configurable backend" — swap env vars to change endpoints without touching component code.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Formspree for contact forms | Google Apps Script webhook | CONTEXT.md explicitly locks out Formspree; GAS pattern is proven in codebase |
| react-hook-form for form validation | HTML5 native validation + useState | Correct for simple forms; no dependency overhead |
| CSS keyframes for accordion | `max-h` CSS transition | Already used in AccordionSection — maintain consistency |
| External toast library (react-hot-toast) | Custom fixed-div + setTimeout | No new dependency; 15 lines; sufficient for 1-2 toasts per page |

---

## Open Questions

1. **Google Apps Script deployment IDs for pledge and commitment forms**
   - What we know: Pattern is established; two separate sheets are expected
   - What's unclear: Whether the user wants one GAS script handling both forms (via a `formType` field) or two separate deployments
   - Recommendation: Plan for two separate env vars (`NEXT_PUBLIC_GAS_PLEDGE_URL` and `NEXT_PUBLIC_GAS_COMMITMENT_URL`). If user wants one script, both vars can point to the same URL with a discriminating field in the payload.

2. **Toolkit asset files**
   - What we know: User will provide real files; plan sets up infrastructure
   - What's unclear: Exact filenames, formats, count beyond minimum 3
   - Recommendation: Create `public/toolkit/` with `.gitkeep` and a data array in the ToolkitSection component that's easy to extend. Plan a placeholder data set of 3 items that the user replaces.

3. **Mobile nav — "Take Action" button**
   - What we know: Header uses a slide-out mobile nav. Desktop shows button-style link.
   - What's unclear: Should mobile nav show a button or a styled text link (space is tighter in the mobile drawer)
   - Recommendation: Discretion — match the visual intent (gold accent) but as a full-width item in the mobile nav drawer using a different layout that fits the vertical list.

---

## Sources

### Primary (HIGH confidence — code verified in codebase)
- `app/components/sections/NewsletterSignup.tsx` — GAS webhook fetch pattern, FormState type, error/success handling
- `app/components/contact/ContactForm.tsx` — Multi-field form pattern, inputClass shared constant, HTML5 validation
- `app/components/awareness/AccordionSection.tsx` — max-h expand/collapse pattern, ChevronDown rotation, openIndex state
- `app/components/briefs/DownloadButton.tsx` — Download anchor pattern with analytics tracking
- `app/components/layout/Header.tsx` — navLinks array pattern, mobile nav, className patterns
- `app/components/sections/AudienceCTAs.tsx` — live/disabled link pattern, cards that need updating
- `app/lib/analytics.ts` — trackPledgeSubmit stub already present
- `next.config.js` — `output: 'export'` confirmed

### Secondary (MEDIUM confidence — verified against project conventions)
- `.env.local` — Confirms `NEXT_PUBLIC_GAS_URL` pattern in use; new vars follow same naming convention
- `package.json` — Confirms no new packages needed; all required libraries present

### Tertiary (LOW confidence — not independently verified)
- Browser behavior: `<a download>` attribute only works for same-origin — standard web platform spec behavior, well-documented but not re-verified against current browser versions in this research session

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in package.json; no new installs needed
- Architecture: HIGH — patterns extracted directly from existing source files; no guesswork
- Pitfalls: HIGH — 5 of 6 pitfalls derived from direct code reading; 1 (download same-origin) is standard web platform
- Backend: HIGH — GAS webhook pattern verified in NewsletterSignup.tsx; env var pattern verified in .env.local

**Research date:** 2026-05-02
**Valid until:** 2026-06-02 (stable stack — Next.js 16, React 19, Tailwind 4 are unlikely to have breaking changes in 30 days)
