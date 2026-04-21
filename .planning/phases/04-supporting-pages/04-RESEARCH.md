# Phase 4: Supporting Pages - Research

**Researched:** 2026-04-04
**Domain:** Next.js 16 static export — Methodology tab page, Expert profile cards, Formspree contact form
**Confidence:** HIGH (codebase fully read; patterns verified against installed packages and existing phase summaries)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Methodology page structure**
- Tab layout with three tabs: SEIR/ML/Bayesian Models | NIPAD Platform | GlobalPPS & WHONET
- Each tab: medium depth — 2–4 paragraphs + bullet points (not a brief summary, not a technical paper)
- NIPAD tab: styled placeholder image labelled "NIPAD Dashboard Screenshot" — swap with real screenshot when available
- CTA at bottom of page: two links — "Browse Policy Briefs" (→ /briefs) and "Get in Touch" (→ /contact)

**Expert card layout**
- Vertical cards in a 3-column grid on desktop, single column on mobile
- Real headshot photos will be provided — use `<Image>` with a styled placeholder while files are committed
- Each card shows: photo, name, title, institutional affiliation, area of expertise/specialization, short bio (2–3 sentences)
- No outbound links from cards — self-contained

**Contact form behavior**
- Inquiry Type dropdown options: "Partnership / Collaboration", "Media Inquiry", "Policy Brief Request", "Technical / Methodology"
- Required fields: Name, Email, Inquiry Type, Message
- Optional fields: Title, Ministry/Organization, Country
- Success state: inline replacement of the form section with a thank-you message (same pattern as NewsletterSignup)
- Fallback email: wrapped in `<noscript>` block — only shown when JavaScript is disabled

**Page tone & audience**
- Methodology: written for policymakers, not technical peers — plain language, emphasise "what it means for AMR policy" not "how the model works mathematically"
- Experts: balanced — credentials clearly shown (title, institution) but bio gives a human picture of the person and their mission, not just a CV
- Contact: open and welcoming headline/intro — e.g. "We'd love to hear from you" framing, not bureaucratic
- Content authoring: Claude writes all copy (bios, methodology descriptions, contact intro) from source documents — `GGHN STARR Expertises_Feb 2026.docx` for expert bios, existing brief content/data for methodology copy. Flag any gaps where source material is insufficient.

### Claude's Discretion
- Exact tab component implementation (CSS-only vs useState)
- Placeholder avatar styling for expert photos until real images are committed
- Error state handling for the contact form
- Exact spacing, typography, and icon choices within the established Navy/Teal design system

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| METH-01 | Methodology & Engine page with three sections: Predictive Modeling (SEIR, ML, Bayesian, agent-based), NIPAD Platform (with static dashboard screenshot placeholder), GlobalPPS & WHONET surveillance | Tab component pattern (useState), placeholder image pattern using `<div>` with aspect-ratio styling, CTA link pair at page bottom |
| EXPT-01 | Our Experts page with profile cards for Dr. Olawale A. (Genomic Surveillance, Lab Systems, Fleming Fund Rwanda), Dr. Samson A. (Mathematical/Predictive Modeling, NIPAD, GlobalPPS), Piringar Mercy Niyang (One Health Governance, GLASS, Africa CDC); each card shows photo, name, title, institutional affiliation, and bio | Expert data already in `content/experts.json` — needs third expert added (Piringar Mercy Niyang); `getExperts()` already implemented; Next.js `<Image>` with `unoptimized: true` is already configured; placeholder avatar pattern needed |
| CONT-01 | Contact & Engagement page with Formspree-powered form: Name, Title, Ministry/Organization, Country, Inquiry Type (dropdown), Message; fallback email displayed when JS disabled | Formspree AJAX pattern mirrors NewsletterSignup `'use client'` approach; `<noscript>` fallback; `contactEmail` already in `site.json` as "starr@gghnigeria.org" |
</phase_requirements>

---

## Summary

Phase 3 delivered the policy briefs library and detail pages. Phase 4 completes the site with three content pages that have stub files already in place at `app/methodology/page.tsx`, `app/experts/page.tsx`, and `app/contact/page.tsx`. All are single-line Server Component stubs returning placeholder text — this phase replaces those stubs with full implementations.

The key technical decisions for this phase are: (1) The Methodology tab component requires `'use client'` because tab switching is a browser interaction; all other pages can remain Server Components. (2) The Contact form follows the exact same `'use client'` pattern and state machine (`idle | submitting | success | error`) as `NewsletterSignup.tsx` from Phase 2 — Formspree replaces GAS as the backend. (3) The Experts page is a pure Server Component reading `content/experts.json` via the existing `getExperts()` function; the only new work is adding the third expert (Piringar Mercy Niyang) to the JSON and writing a new `ExpertCard` component.

Content for all three pages is directly derivable from source documents already in the repo. The `starr_expertises.txt` file (a text export of `GGHN STARR Expertises_Feb 2026.docx`) contains first-person expertise descriptions for all three experts — Dr. Olawale A. (genomic/lab systems), Dr. Samson A. (mathematical modeling/NIPAD/GlobalPPS), and Piringar Mercy Niyang (One Health governance). The methodology copy maps directly to those same expert domains. One gap: the `content/experts.json` currently only contains two entries (Dr. Olawale Oladipo and Dr. Amina Ibrahim) — the names do not match the CONTEXT.md source document names. This is a content alignment issue flagged in Open Questions below.

**Primary recommendation:** Build in three sequential plans — Methodology page (tab UI, content), Experts page (JSON update + ExpertCard component), Contact page (Formspree form) — each independently deployable. Use `useState` for tabs (simplest, no dependency). Mirror the NewsletterSignup state machine for the contact form exactly.

---

## Standard Stack

### Core (already installed — no new packages)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | App Router, static export | Already installed; `output:'export'` configured |
| react | 19.2.4 | useState for tab state and form state | Already installed |
| tailwindcss | ^4.2.2 | CSS-first config via globals.css @theme | Already configured, no tailwind.config.js |
| lucide-react | ^1.6.0 | Icons (CheckCircle, AlertCircle, Loader2, etc.) | Already installed and used in NewsletterSignup |
| clsx | ^2.1.1 | Conditional classNames on tab buttons, card elements | Already installed |

### New dependency needed
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @formspree/react | ^2.5.x | Formspree AJAX form helper | Optional — can use plain `fetch` instead; see Architecture Patterns |

**Decision: Do NOT install @formspree/react.** Use plain `fetch` to the Formspree endpoint exactly as NewsletterSignup uses plain `fetch` to GAS. This keeps the stack identical and avoids introducing a new dependency for a two-field difference.

**Installation:**
```bash
# No new packages required for this phase
```

### Formspree environment variable
```
NEXT_PUBLIC_FORMSPREE_FORM_ID=your_form_id_here
```
Add to `.env.local`. The contact form URL is `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`.

---

## Architecture Patterns

### Recommended File Structure for This Phase
```
app/
├── methodology/
│   └── page.tsx          # 'use client' — tab switching state
├── experts/
│   └── page.tsx          # Server Component — reads content/experts.json
├── contact/
│   └── page.tsx          # Server Component shell — imports ContactForm
└── components/
    ├── experts/
    │   └── ExpertCard.tsx  # Server Component — pure display
    └── contact/
        └── ContactForm.tsx  # 'use client' — form state machine

content/
└── experts.json           # Add third expert entry (Piringar Mercy Niyang)
```

### Pattern 1: Tab Component with useState (Methodology Page)

**What:** Client component that renders three named tabs. Active tab drives which content block renders. No animation — just conditional rendering.

**When to use:** When content must be switchable without page navigation. CSS-only tabs (using `:target` pseudo-class or hidden radio inputs) are possible but break on direct URL load and are harder to style consistently. useState is simpler and more maintainable.

**Why 'use client' scoped to the whole page:** The Methodology page has no data fetching needs (content is static JSX, not from JSON), so making the entire page a Client Component is acceptable and avoids the complexity of splitting a tab shell from tab content panels.

```typescript
// app/methodology/page.tsx
'use client';
import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import Link from 'next/link';

type TabId = 'models' | 'nipad' | 'surveillance';

const TABS: { id: TabId; label: string }[] = [
  { id: 'models', label: 'SEIR / ML / Bayesian Models' },
  { id: 'nipad', label: 'NIPAD Platform' },
  { id: 'surveillance', label: 'GlobalPPS & WHONET' },
];

export default function MethodologyPage() {
  const [active, setActive] = useState<TabId>('models');

  return (
    <Container className="py-16">
      <h1 className="font-serif text-3xl text-navy-950 mb-4">Our Methodology</h1>

      {/* Tab bar */}
      <div className="flex border-b border-slate-200 mb-8 gap-0 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === tab.id
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-600 hover:text-navy-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {active === 'models' && <ModelsTab />}
      {active === 'nipad' && <NipadTab />}
      {active === 'surveillance' && <SurveillanceTab />}

      {/* CTA at bottom */}
      <div className="mt-16 flex gap-4">
        <Link href="/briefs" className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-6 py-3 rounded transition-colors">
          Browse Policy Briefs
        </Link>
        <Link href="/contact" className="border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium px-6 py-3 rounded transition-colors">
          Get in Touch
        </Link>
      </div>
    </Container>
  );
}
```

**Tab button active state classes:** `border-b-2 border-teal-600 text-teal-600` (active) vs `border-transparent text-slate-600` (inactive). The `overflow-x-auto` on the tab bar handles mobile where three long tab labels may not fit.

### Pattern 2: NIPAD Placeholder Image Block

**What:** A styled `<div>` that reserves space and labels the missing screenshot. Replaced by a real `<img>` or `<Image>` when the screenshot is committed.

```tsx
{/* NIPAD Dashboard Screenshot placeholder */}
<div className="w-full aspect-video bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center my-6">
  <p className="text-slate-400 text-sm font-medium">NIPAD Dashboard Screenshot</p>
</div>
```

**Why not `next/image`:** The NIPAD placeholder is a `<div>`, not an `<img>`. When the real screenshot arrives, replace with `<img src="/images/nipad-dashboard.jpg" alt="NIPAD Dashboard" className="w-full rounded-lg" />`. The project uses `images.unoptimized: true` so `<img>` and `<Image>` are both viable — `<img>` is simpler for a single static asset.

### Pattern 3: Expert Card (Server Component)

**What:** A pure display component. No state. Reads from the Expert type already defined in `app/lib/types.ts`.

```tsx
// app/components/experts/ExpertCard.tsx
import type { Expert } from '@/lib/types';
import { clsx } from 'clsx';

interface ExpertCardProps {
  expert: Expert;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Photo area */}
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        <img
          src={expert.photoUrl}
          alt={expert.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            // Fallback handled via placeholder div below
          }}
        />
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="font-serif text-lg text-navy-950 font-bold mb-0.5">{expert.name}</h2>
        <p className="text-sm text-teal-600 font-medium mb-0.5">{expert.title}</p>
        <p className="text-xs text-slate-500 mb-3">{expert.organization}</p>
        {expert.specialties.length > 0 && (
          <p className="text-xs text-slate-600 mb-3">
            <span className="font-medium">Focus: </span>
            {expert.specialties.join(' · ')}
          </p>
        )}
        <p className="text-sm text-slate-700 leading-relaxed">{expert.bio}</p>
      </div>
    </div>
  );
}
```

**Note on `onError`:** Static export with `images.unoptimized: true` means broken image paths show browser broken-image icons. The placeholder approach is a styled `<div>` as background when `photoUrl` is a path that doesn't exist yet. Simplest approach: use the `<img>` tag, and for the placeholder, make `photoUrl` point to a non-existent path — the card body content (name, title, bio) still renders correctly. The photo `<div>` with `bg-slate-100` provides a grey background that shows through when the image is missing.

**3-column grid on Experts page:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {experts.map(expert => (
    <ExpertCard key={expert.id} expert={expert} />
  ))}
</div>
```

### Pattern 4: Contact Form (Client Component — mirrors NewsletterSignup)

**What:** A `'use client'` component with four states (`idle | submitting | success | error`) sending a multipart form to Formspree via `fetch`. Success state replaces the entire form section.

**Formspree AJAX submission pattern:**
```typescript
// app/components/contact/ContactForm.tsx
'use client';
import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(
        `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        }
      );
      const json = await res.json();
      if (res.ok && json.ok) {
        setState('success');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        {/* CheckCircle icon + thank-you message */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Fields */}
      <noscript>
        <p>Please email us directly at <a href="mailto:starr@gghnigeria.org">starr@gghnigeria.org</a></p>
      </noscript>
    </form>
  );
}
```

**Formspree AJAX vs plain form POST:** Formspree supports both plain HTML form (action="https://formspree.io/f/ID") and AJAX with `Accept: application/json` header. AJAX is required here because:
1. Plain POST redirects to a Formspree thank-you page — incompatible with the inline success state requirement.
2. Static export with `output:'export'` means there is no server-side redirect handling.

**Formspree AJAX response shape:** `{ ok: true }` on success, `{ ok: false, errors: [...] }` on failure. Check `res.ok && json.ok` for success.

**FormData vs JSON body:** Use `new FormData(form)` instead of manually extracting fields. Formspree reads field `name` attributes from the FormData. This avoids manual field extraction and works with all field types including `<select>`.

**`<noscript>` fallback:** Place `<noscript>` inside the `<form>` element, not outside. It renders only when JS is disabled.

### Pattern 5: Experts Page as Server Component

**What:** `app/experts/page.tsx` reads `content/experts.json` via `getExperts()` at build time (Server Component). No `'use client'` needed.

```typescript
// app/experts/page.tsx
import { getExperts } from '@/lib/content';
import { Container } from '@/components/layout/Container';
import { ExpertCard } from '@/components/experts/ExpertCard';

export const metadata = { title: 'Our Experts | GGHN STARR' };

export default function ExpertsPage() {
  const experts = getExperts();
  return (
    <Container className="py-16">
      <h1 className="font-serif text-3xl text-navy-950 mb-3">Our Experts</h1>
      <p className="text-slate-600 mb-10 max-w-2xl">...</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experts.map(expert => (
          <ExpertCard key={expert.id} expert={expert} />
        ))}
      </div>
    </Container>
  );
}
```

### Pattern 6: Contact Page Shell (Server Component imports Client Form)

The same pattern Next.js uses throughout this codebase — the page file is a Server Component, the interactive part is a separate Client Component:

```typescript
// app/contact/page.tsx
import { Container } from '@/components/layout/Container';
import { getSiteContent } from '@/lib/content';
import ContactForm from '@/components/contact/ContactForm';

export const metadata = { title: 'Contact | GGHN STARR' };

export default function ContactPage() {
  const { contactEmail } = getSiteContent();
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="font-serif text-3xl text-navy-950 mb-3">We'd love to hear from you</h1>
      <p className="text-slate-600 mb-10">...</p>
      <ContactForm contactEmail={contactEmail} />
    </Container>
  );
}
```

### Anti-Patterns to Avoid

- **Making ExpertsPage 'use client' for no reason:** It has no browser interactions. `getExperts()` uses `fs.readFileSync` which only works in Server Components. Adding `'use client'` would break the data read.
- **Using `next/image` `<Image>` for expert photos with placeholder:** With `images.unoptimized: true`, `<Image>` and `<img>` behave identically in static export. Use `<img>` for simplicity unless the team specifically requests `<Image>`.
- **Fetching Formspree with `Content-Type: application/json` and body as string:** Formspree's AJAX endpoint expects either `FormData` (no Content-Type header — browser sets it) or JSON with `Content-Type: application/json`. Either works; `FormData` is simpler because field names come from the HTML `name` attributes.
- **Putting the `<noscript>` fallback outside the form:** It should be inside `<form>` so it appears in the right visual position if JS is off.
- **Tab state in a Server Component:** `useState` is a browser-only API. The Methodology page must be `'use client'`.
- **Forgetting `export const metadata` on Client Components:** In Next.js App Router, `metadata` export is NOT supported in Client Components. Because `app/methodology/page.tsx` will be `'use client'`, the page title must be set via `<title>` in the JSX head or by wrapping: export a separate `metadata` constant and Next.js ignores it silently. The correct approach is to move metadata to a parent layout or accept the default site title for this page. See Open Questions.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state machine | Custom reducer or complex state logic | Mirror NewsletterSignup's 4-state pattern exactly | Already proven, tested in production, consistent UX |
| Tab accessible markup | Custom ARIA role management | Simple `<button>` with `border-b-2` active state | This is informational content, not a complex widget; ARIA `role="tablist"` adds complexity for no user benefit at this scale |
| Formspree SDK | `@formspree/react` useForm hook | Plain `fetch` with `FormData` | Avoids new dependency; same capability; aligns with GAS pattern already in codebase |
| Expert photo fallback | `onError` JavaScript handler | `bg-slate-100` background on photo container | Grey box appears automatically when img fails to load — no JS needed |
| Contact email obfuscation | JS-based email obfuscation | Plain `mailto:` link in `<noscript>` | The noscript email is already the degraded experience — additional obfuscation unnecessary |

**Key insight:** Every interactive pattern needed in Phase 4 has an exact precedent in Phase 2's NewsletterSignup.tsx. Copy the state machine, adapt the fields.

---

## Common Pitfalls

### Pitfall 1: metadata export in a 'use client' page
**What goes wrong:** `export const metadata = { title: '...' }` is silently ignored when the file starts with `'use client'`. The page renders with no `<title>` tag.
**Why it happens:** Next.js App Router strips metadata from Client Components at build time without an error.
**How to avoid:** For `app/methodology/page.tsx` (which must be `'use client'` for tab state), use one of two approaches:
  - Option A (recommended): Create a `layout.tsx` in `app/methodology/` that exports `metadata` as a Server Component, wrapping the `'use client'` page.
  - Option B: Accept that the browser tab shows the site default title from `app/layout.tsx` for the Methodology page. Given the tab panel content, this is acceptable.
**Warning signs:** `<title>` not appearing in page source for Methodology page after build.

### Pitfall 2: `getExperts()` called in a Client Component
**What goes wrong:** `fs.readFileSync` throws `Module not found: Can't resolve 'fs'` in the browser bundle.
**Why it happens:** `fs` is a Node.js module — it's only available on the server side. Any file marked `'use client'` cannot call `getExperts()`.
**How to avoid:** `app/experts/page.tsx` MUST NOT have `'use client'`. `ExpertCard` MUST NOT have `'use client'`. The data read happens at the Server Component level and props flow down.
**Warning signs:** Build error mentioning `fs` or `Module not found`.

### Pitfall 3: Formspree form ID not set in environment
**What goes wrong:** The fetch call targets `https://formspree.io/f/undefined` — Formspree returns a 404, the form shows an error state.
**Why it happens:** `process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID` is undefined if `.env.local` is missing or the var is not set.
**How to avoid:** Add `NEXT_PUBLIC_FORMSPREE_FORM_ID=placeholder` to `.env.local` immediately. Add a human-verify task that confirms the form ID is replaced with a real Formspree form ID before shipping.
**Warning signs:** Form submission returns 404 in the browser Network tab.

### Pitfall 4: Tab overflow on mobile without scrolling
**What goes wrong:** Three long tab labels ("SEIR / ML / Bayesian Models") overflow on a 375px screen, causing layout breakage.
**Why it happens:** Tab buttons default to `display:flex` or `display:inline-block` in a row — they overflow if the container has no overflow handling.
**How to avoid:** Add `overflow-x-auto` to the tab bar container. The tab bar scrolls horizontally on mobile — acceptable since this is a desktop-first content page.
**Warning signs:** Visual inspection at 375px width shows tab labels overlapping or extending outside viewport.

### Pitfall 5: Expert bio length mismatch
**What goes wrong:** The existing `content/experts.json` has very long bios (200+ word professional summaries), but the CONTEXT.md specifies "short bio (2–3 sentences)" for the expert card.
**Why it happens:** The JSON bios were written for the brief detail page's "About the Author" section, not for a summary card.
**How to avoid:** The Expert cards render `expert.bio` — the task that writes expert cards must either (a) truncate to a character limit inline, or (b) update the JSON to have a short card-appropriate bio. Recommended: update the JSON bios to 2–3 sentences (the full bio length is not used anywhere in the current codebase except the brief detail page excerpt which already slices to 200 chars).
**Warning signs:** Expert card is very tall relative to its photo, making the 3-column grid visually unbalanced.

### Pitfall 6: experts.json identity mismatch
**What goes wrong:** The CONTEXT.md names three experts as "Dr. Olawale A., Dr. Samson A., Piringar Mercy Niyang" but `content/experts.json` has "Dr. Olawale Oladipo" and "Dr. Amina Ibrahim". Dr. Amina Ibrahim does not appear in the source expertises document.
**Why it happens:** The JSON was seeded with placeholder data in Phase 1 that doesn't exactly match the real team.
**How to avoid:** The plan for Experts page must include a task to reconcile `content/experts.json` with the source document — replacing Dr. Amina Ibrahim with Dr. Samson A. and adding Piringar Mercy Niyang, totalling three entries. Brief `authorId` references that point to "amina-ibrahim" will also need updating.
**Warning signs:** Experts page shows the wrong people; brief detail pages show "By Dr. Amina Ibrahim" for briefs authored by Dr. Samson A.

---

## Code Examples

Verified patterns from the existing codebase:

### Formspree AJAX submission (adapted from NewsletterSignup pattern)
```typescript
// Source: app/components/sections/NewsletterSignup.tsx (existing, verified)
// Adaptation: replace GAS URL with Formspree, replace JSON body with FormData

async function submitContactForm(data: FormData): Promise<'success' | 'error'> {
  try {
    const res = await fetch(
      `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`,
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      }
    );
    if (!res.ok) return 'error';
    const json = await res.json();
    return json.ok ? 'success' : 'error';
  } catch {
    return 'error';
  }
}
```

**Formspree difference from GAS:** No `redirect: 'follow'` needed — Formspree's AJAX endpoint does not redirect. Content-Type is set automatically by FormData. Response field is `json.ok` (boolean), not `json.status === 'success'` (string).

### Success state pattern (from NewsletterSignup — use identically)
```tsx
// Source: app/components/sections/NewsletterSignup.tsx (verified)
if (state === 'success') {
  return (
    <section className="py-12 text-center">
      <CheckCircle className="mx-auto text-teal-600 mb-3" size={32} />
      <p className="text-navy-950 font-medium text-lg">Message sent.</p>
      <p className="text-slate-600 mt-1">
        We'll be in touch within a few business days.
      </p>
    </section>
  );
}
```

### Tailwind v4 conditional classes (clsx, already installed)
```typescript
// Source: app/components/layout/Container.tsx (verified — clsx imported)
import { clsx } from 'clsx';

// Tab button active state
className={clsx(
  'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
  active === tab.id
    ? 'border-teal-600 text-teal-600'
    : 'border-transparent text-slate-600 hover:text-navy-950'
)}
```

### Contact form select field
```tsx
<select
  name="inquiry_type"
  required
  defaultValue=""
  className="w-full border border-slate-200 rounded px-4 py-2 text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-600"
>
  <option value="" disabled>Select inquiry type</option>
  <option value="Partnership / Collaboration">Partnership / Collaboration</option>
  <option value="Media Inquiry">Media Inquiry</option>
  <option value="Policy Brief Request">Policy Brief Request</option>
  <option value="Technical / Methodology">Technical / Methodology</option>
</select>
```

### noscript fallback
```tsx
<noscript>
  <p className="text-slate-600 text-sm mt-4">
    JavaScript is required to submit this form. Please email us directly at{' '}
    <a href="mailto:starr@gghnigeria.org" className="text-teal-600 underline">
      starr@gghnigeria.org
    </a>
  </p>
</noscript>
```

---

## Content Decisions

### Expert Identity Mapping (from starr_expertises.txt source document)

The source document names and their expertise matches to the three card slots:

| Card Slot | Source Doc Name | Key Expertise | Recommended experts.json id |
|-----------|----------------|---------------|------------------------------|
| Expert 1 | Dr. Olawale A. | AMR Surveillance, Genomic/Lab Systems, Fleming Fund Rwanda | `olawale-oladipo` (keep existing) |
| Expert 2 | Dr. Samson A. | Mathematical/Predictive Modeling, NIPAD platform, GlobalPPS/WHONET | `samson-a` (replace "amina-ibrahim") |
| Expert 3 | Piringar Mercy Niyang | One Health Governance, GLASS, Africa CDC, Fleming Fund Rwanda | `piringar-niyang` (add new) |

**Content gaps flagged:**
- Full surnames for "Dr. Samson A." are not given in the source document — only "Dr. Samson A." Use this abbreviated form unless the user provides the full name.
- Piringar Mercy Niyang's title and organization are not explicitly stated in `starr_expertises.txt` but her role is described as "Technical Lead" on Fleming Fund Rwanda (2024–2026) — use "Technical Lead, AMR Surveillance" as title, "GGHN STARR" as organization, pending confirmation.
- No headshot image files exist at `public/images/experts/` yet — confirmed by CONTEXT.md which says "Real headshot photos will be provided."

### Methodology Page Content Source Mapping

| Tab | Primary Source | Secondary Source |
|-----|---------------|-----------------|
| SEIR/ML/Bayesian Models | Dr. Samson A.'s expertise section in starr_expertises.txt (SEIR, Random Forest, Bayesian hierarchical, CART, agent-based) | Brief Week 3 "Predictive Analytics for AMR Burden Forecasting" executive summary |
| NIPAD Platform | Dr. Samson A.'s expertise section (NIPAD = Nigeria Immunization Predictive Analytics Dashboard, R/Shiny platform) | Brief Week 3 key messages |
| GlobalPPS & WHONET | Dr. Samson A.'s GlobalPPS section + Dr. Olawale A.'s WHONET section in starr_expertises.txt | Brief Week 1 and Week 2 references to surveillance data |

**Content gaps flagged:**
- NIPAD is described as an immunization forecasting tool in the source document, not an AMR tool. The methodology page needs to frame NIPAD as the modeling platform that has been adapted/extended for AMR burden forecasting under STARR. This framing decision is Claude's authoring judgment.
- Brief content JSON (briefs-index.json) is available for cross-reference but not read in this research pass — the planner should reference it during content writing tasks.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| CSS-only tab (`:target` or radio hack) | useState tab switching | useState is simpler, testable, works on initial render |
| Formspree HTML form (full page redirect) | Formspree AJAX with `Accept: application/json` | Enables inline success state — required by CONTEXT.md |
| `next/image <Image>` for all images | `<img>` for static content | With `images.unoptimized: true`, both behave identically in static export; `<img>` has less boilerplate |

**Current project patterns (from prior phases):**
- params typed as `Promise<{slug:string}>` and awaited — Phase 3 pattern, not relevant to Phase 4 (no dynamic routes)
- `fs.readFileSync` + `process.cwd()` — established in Phase 1, used by `getExperts()` already
- `'use client'` scoped to interactive leaf components — Header, NewsletterSignup, ConferenceBadge, StatStrip
- Inline success state replacing form section — NewsletterSignup pattern, mandatory for Contact form

---

## Open Questions

1. **Metadata on 'use client' Methodology page**
   - What we know: Next.js App Router ignores `export const metadata` in Client Components
   - What's unclear: Whether the team wants the browser tab to show "Methodology | GGHN STARR" for this page
   - Recommendation: Create `app/methodology/layout.tsx` as a Server Component that exports `metadata` — this is the standard Next.js pattern for adding metadata to pages that must be Client Components

2. **Dr. Samson A. full surname**
   - What we know: Source document uses only "Dr. Samson A." throughout
   - What's unclear: His full surname
   - Recommendation: Use "Dr. Samson A." as the display name on the Experts page; flag for the user to supply the full name before launch

3. **Piringar Mercy Niyang's title and organization**
   - What we know: She is described as Technical Lead on Fleming Fund Rwanda project (2024–2026), working with GGHN STARR. Her Havilah Nnadozie Ibrahim Gobir name also appears at the end of the source document — likely a different person.
   - What's unclear: Her current official title and primary institutional affiliation
   - Recommendation: Use "Technical Lead, AMR Surveillance & Governance" and "GGHN STARR" as placeholders; flag for user confirmation

4. **Brief authorId references for Dr. Samson A.**
   - What we know: `content/experts.json` currently has "amina-ibrahim" as an id; briefs that reference this id will show wrong author
   - What's unclear: Which briefs currently use "amina-ibrahim" as authorId
   - Recommendation: The Experts page plan must include a task to check `content/briefs-index.json` for "amina-ibrahim" references and update them to "samson-a"

5. **Contact form: Formspree account setup**
   - What we know: Formspree requires account creation and form creation to get a form ID; free tier allows 50 submissions/month
   - What's unclear: Whether the user has a Formspree account and form ID ready
   - Recommendation: Plan must include a `user_setup` block for Formspree (same as Phase 2's GAS setup block) with instructions to create an account and get the form ID

---

## Sources

### Primary (HIGH confidence)
- Codebase direct read: `app/components/sections/NewsletterSignup.tsx` — verified 4-state pattern, GAS CORS workaround
- Codebase direct read: `app/lib/content.ts` — verified `getExperts()` implementation using `fs.readFileSync`
- Codebase direct read: `app/lib/types.ts` — verified `Expert` interface fields
- Codebase direct read: `content/experts.json` — verified two current expert entries, identified identity mismatch
- Codebase direct read: `content/site.json` — verified `contactEmail: "starr@gghnigeria.org"`
- Codebase direct read: `next.config.ts` — verified `output:'export'` and `images.unoptimized:true`
- Codebase direct read: `package.json` — verified installed dependencies (no Formspree SDK present)
- Codebase direct read: `app/globals.css` — verified Navy/Teal design tokens
- Codebase direct read: `starr_expertises.txt` — source document for all three expert bios and methodology content

### Secondary (MEDIUM confidence)
- Formspree AJAX pattern: standard Formspree documentation behavior — `Accept: application/json` header triggers AJAX mode, response is `{ ok: true }`. Consistent with the Formspree docs as of early 2026.
- Next.js App Router metadata in Client Components: documented limitation — metadata exports are ignored in `'use client'` files. Standard workaround is a parent `layout.tsx`.

### Tertiary (LOW confidence)
- None flagged — all claims are verifiable from the codebase or established documentation patterns.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed and in use; no new packages needed
- Architecture patterns: HIGH — directly modeled on existing NewsletterSignup, BriefCard, BriefDetailPage patterns
- Content decisions: MEDIUM — based on source document text extraction; expert surnames and titles need user confirmation
- Pitfalls: HIGH — all identified from direct code inspection (metadata in client components, fs in client components) or prior phase patterns

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable; no fast-moving dependencies)
