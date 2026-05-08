# Phase 17: Lead Capture - Research

**Researched:** 2026-05-08
**Domain:** Client-side modal form, localStorage persistence, GAS form submission, PDF download interception
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Trigger scope**
- All PDF downloads site-wide trigger the wall (policy briefs, toolkit assets)
- Infographic JPEGs on /awareness remain free — no intercept
- Advocacy toolkit downloads on /take-action are gated
- Frequency: once ever per browser (localStorage), not per session — returning submitters bypass entirely

**Wall UX**
- Modal overlay (centered dialog over the page)
- Not skippable — form is required to get the download; no bypass button
- On dismiss without submitting: modal closes and a brief inline message appears explaining the user needs to fill the form to download
- Modal includes a short explanation of why info is collected (e.g. "Help us understand who accesses AMR resources")

**Form fields**
- Required: Email, Audience Category
- Optional: Name, Role
- Role: dropdown — Minister / Policy Advisor / Healthcare Worker / Researcher / Student / Other
- Audience Category: 5 options — Policymaker / Healthcare Worker / Researcher / Student / General Public
- No Country field (keep it lean)

**Post-submit flow**
- On success: modal closes, browser download triggers automatically — seamless, no extra click
- GAS failure: silent fail — download proceeds regardless; don't penalise user for backend errors
- localStorage stores the user's email address — flags that this browser has completed lead capture; can pre-fill if needed in future
- Uses existing NEXT_PUBLIC_GAS_URL endpoint with formType: 'lead-capture' — no new env var or GAS deployment

### Claude's Discretion
- Modal visual design (styling, animation, backdrop)
- Exact error message copy when modal is dismissed without submitting
- How email is validated (format check)
- localStorage key naming convention

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

## Summary

This phase adds a lead-capture gate that intercepts PDF downloads before the file is delivered. No new libraries are needed — the project already has everything required: React state for the modal, the established `submitToGAS` pattern from `PledgeForm`/`CommitmentForm`, and browser `localStorage` (already used by the codebase in the conference bar's `sessionStorage` variant). The gate lives in a new `LeadCaptureModal` client component and a thin wrapper `GatedDownloadButton` that replaces the current `DownloadButton` and the `<a download>` elements in `DownloadCard`.

PDF download points are well-defined: `DownloadButton` (used in brief detail page and `FeaturedBrief` via `BriefCard`), and the `<a download>` anchor inside `DownloadCard` (used in `ToolkitSection`). The `BriefCard` grid also has direct `<a href={brief.pdfUrl}>` anchors that must be converted. The `/awareness` page links to an external WHO PDF via a plain `<a>` tag — this is outside the gating scope since it is a third-party URL and the context says infographic/awareness assets are not gated.

The critical architectural insight is that this is a static Next.js export (`output: 'export'`). There is no server runtime, no API routes, and no middleware — all logic is client-side. The download must be triggered programmatically via `window.location.href` or a dynamically-created `<a>` element after the GAS call completes, because the browser's native anchor `href` navigation cannot be deferred through an async form submission.

**Primary recommendation:** Build `LeadCaptureModal` as a standalone 'use client' component with local `useState` for form fields and modal visibility. Provide a `GatedDownloadButton` wrapper that checks localStorage on click, opens the modal if not bypassed, and triggers the download on modal success. The modal submits to GAS using the exact `submitToGAS` pattern from `PledgeForm`.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (useState, useEffect) | 19.2.4 (already installed) | Modal state, form fields, localStorage read on mount | Already in project; no new dependency |
| lucide-react | 1.6.0 (already installed) | X (close) icon, Download icon, Loader spinner | Already used across all forms |
| Tailwind CSS v4 | 4.2.2 (already installed) | Styling modal, backdrop, form inputs | Project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 (already installed) | Conditional class composition on form inputs | Already used in project |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled modal | Headless UI Dialog / Radix Dialog | Headless UI adds ~8KB; the project has no such dependency and a simple modal is achievable with a fixed overlay div + focus trap |
| localStorage email token | Boolean localStorage flag | Email token is richer — enables future pre-fill; same implementation cost |
| Programmatic anchor download | Opening new tab (`target="_blank"`) | `target="_blank"` is disorienting; programmatic anchor with `download` attribute respects filename and keeps the tab clean |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended Project Structure
```
app/
├── components/
│   └── briefs/
│       ├── DownloadButton.tsx          # CONVERT: add gating logic
│       └── LeadCaptureModal.tsx        # NEW: modal form component
│   └── take-action/
│       └── DownloadCard.tsx            # CONVERT: <a download> → GatedDownloadButton
│   └── sections/
│       └── FeaturedBrief.tsx           # CONVERT: plain <a download> → DownloadButton (already uses it in brief detail; replicate here)
├── lib/
│   └── lead-capture.ts                 # NEW: localStorage key constant + check/set helpers
```

### Pattern 1: LeadCaptureModal Component

**What:** A 'use client' modal that owns form state, GAS submission, and success callback. The parent passes an `onSuccess` callback that receives no arguments — the parent holds the `href` to download.

**When to use:** Rendered once per download interaction; the opener component conditionally renders it.

```typescript
// Source: established GAS pattern from app/components/take-action/PledgeForm.tsx
'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { formConfig } from '@/lib/form-config';

interface LeadCapturePayload {
  formType: 'lead-capture';
  email: string;
  audienceCategory: string;
  name?: string;
  role?: string;
  timestamp: string;
}

async function submitToGAS(url: string, payload: LeadCapturePayload): Promise<'success' | 'error'> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return 'error';
    const json = await res.json();
    return json.status === 'success' ? 'success' : 'error';
  } catch {
    return 'error';
  }
}

interface LeadCaptureModalProps {
  onSuccess: (email: string) => void;
  onDismiss: () => void;
}
```

### Pattern 2: localStorage Gate Helpers

**What:** A single `lib/lead-capture.ts` module with the localStorage key constant and two pure helpers — one to check if a browser has already submitted, one to record the email. Centralising the key prevents typo-divergence across components.

```typescript
// app/lib/lead-capture.ts
export const LEAD_CAPTURE_KEY = 'gghn_lead_email';

export function hasCompletedLeadCapture(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(LEAD_CAPTURE_KEY));
}

export function recordLeadCapture(email: string): void {
  localStorage.setItem(LEAD_CAPTURE_KEY, email);
}
```

**Why `typeof window === 'undefined'` guard:** Next.js static export pre-renders pages at build time — SSR context has no `window`. Without the guard the build fails for any component that calls this at module scope.

### Pattern 3: GatedDownloadButton — Intercept & Trigger

**What:** Replaces `DownloadButton`. On click: check localStorage — if present, trigger download immediately. If absent, open modal. On modal success: store email in localStorage, trigger download programmatically.

**Programmatic download approach** (verified pattern for static exports):

```typescript
// Triggers a file download programmatically — no server required
function triggerDownload(href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = href.split('/').pop() ?? 'download';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
```

**Why not just `window.location.href = href`:** For PDFs hosted in `/public`, the browser may render them in-tab instead of downloading them. The programmatic anchor with `download` attribute forces a file download where the server sends the correct headers (static hosting serves PDFs with Content-Disposition: attachment for `.pdf` paths, but this is not guaranteed). The `a.download` attribute is the safest cross-browser download trigger.

### Pattern 4: Modal Dismiss with Inline Nudge

**What:** When the user closes the modal without submitting, the modal unmounts and the parent renders a brief inline message. This is the `on dismiss without submitting` requirement.

```typescript
// In the parent download button component
const [showNudge, setShowNudge] = useState(false);

function handleDismiss() {
  setShowNudge(true);
  setModalOpen(false);
}

// JSX: render nudge inline below the button when showNudge === true
```

**Nudge copy (Claude's discretion):** "Fill in the short form above to download this resource." — short, non-punishing, action-oriented.

### Pattern 5: Backdrop and Focus Management

**What:** The modal backdrop uses a fixed full-viewport overlay (`position: fixed; inset: 0`). No external focus-trap library is needed for this simple single-modal use case — `autoFocus` on the first input and `onKeyDown` escape handler on the modal wrapper is sufficient.

```typescript
// Close on Escape key
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="lead-modal-title"
  onKeyDown={(e) => { if (e.key === 'Escape') onDismiss(); }}
>
```

**Note:** For accessibility, the modal should trap focus within the dialog. Since no focus-trap library is installed, the implementation should use `tabIndex` ordering and rely on the fact that the modal is the only interactive element when the backdrop blocks the page.

### Anti-Patterns to Avoid

- **Opening DownloadButton's `<a>` href directly:** The current `DownloadButton` is a plain `<a>` — the browser navigates before any async form can complete. Must change to `<button>` with `onClick` handler.
- **Using `target="_blank"` on the original anchor for gating:** The user clicks the download link, a new tab opens for the file while the modal appears in the original tab — confusing and broken UX.
- **Calling `localStorage.getItem` outside `useEffect` or a client-only guard:** Next.js static export runs component code at build time. Calling `localStorage` at module scope or during render without the `typeof window` guard will crash the build.
- **Storing a boolean flag instead of the email:** The context explicitly calls for the email as the recognition token, not a simple boolean. Store the email string.
- **Making GAS failure block the download:** The context locks "silent fail" — GAS error must not penalise the user. The download proceeds regardless of GAS response.
- **Gating the DOCX in the toolkit:** Context says "PDF downloads" are gated. The `ToolkitSection` also contains a DOCX (`amr-letter-template.docx`) and a PNG (`amr-social-card.png`). Research the context: "policy briefs and toolkit assets" are gated. The DOCX is a toolkit asset — it should be gated. The PNG social card is an image asset analogous to infographic JPEGs — treat as not gated (consistent with "image assets are not gated").

---

## PDF Download Points Inventory

All locations in the codebase where PDFs are currently linked — these are the exact components that need modification:

| Component | File | Current pattern | Action needed |
|-----------|------|-----------------|---------------|
| `DownloadButton` | `app/components/briefs/DownloadButton.tsx` | `<a href={href} target="_blank">` | Convert to `GatedDownloadButton` with modal logic |
| `BriefCard` (grid download link) | `app/components/briefs/BriefCard.tsx` | `<a href={brief.pdfUrl} target="_blank">` (main PDF) + `<a href={brief.infographicPdfUrl}>` | Gate the PDF `<a>`. The `infographicPdfUrl` is a PDF infographic — context says "PDF downloads site-wide" — this should also be gated |
| `FeaturedBrief` | `app/components/sections/FeaturedBrief.tsx` | `<a href={brief.pdfUrl} download>` | Convert to `GatedDownloadButton` |
| `DownloadCard` (toolkit) | `app/components/take-action/DownloadCard.tsx` | `<a href={href} download={filename}>` | Gate PDFs and DOCX; leave PNG image assets ungated |
| `/awareness` external WHO PDF | `app/awareness/page.tsx` | `<a href="https://www.who.int/...">` inline and in action cards | **Do NOT gate** — external URL, awareness page, user explicitly said infographic/awareness assets are free |

**Summary:** `DownloadButton` is used as the shared component for brief PDFs. The cleanest approach is to make `DownloadButton` itself gated (rename to `GatedDownloadButton` or add a `gated` prop). `DownloadCard` needs a separate gating wrapper because it has the `download` attribute and `filename` prop.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap in modal | Custom focus cycle with keydown listeners across all focusable elements | Acceptable: simple form modal with `autoFocus` on first input + Escape handler | Modal has only 4–5 form fields; a full focus-trap library (focus-trap-react) is overkill for this. The form's natural tab order suffices. |
| Email format validation | Custom regex | HTML5 `type="email"` on the input | Browser-native validation catches malformed addresses; `required` handles empty; no library needed |
| GAS submission | New fetch utility | Copy `submitToGAS` pattern exactly from `PledgeForm.tsx` | Pattern is proven, consistent, handles CORS redirect, parses GAS JSON response |
| localStorage access | Direct `localStorage.getItem` scattered across components | `app/lib/lead-capture.ts` helpers | Centralises the key name; prevents typo bugs; guards SSR build safely |

**Key insight:** This phase is a composition problem, not a capability problem. Every primitive needed already exists in the codebase — it's about wiring them together correctly.

---

## Common Pitfalls

### Pitfall 1: SSR Build Crash from localStorage Access
**What goes wrong:** `localStorage is not defined` error during `next build` when `hasCompletedLeadCapture()` is called outside a client-only context.
**Why it happens:** `output: 'export'` still pre-renders pages at build time in a Node.js environment where `window` and `localStorage` do not exist.
**How to avoid:** Always guard localStorage access: `if (typeof window === 'undefined') return false;`. Call from `useEffect` or event handlers (which run client-only). The `leadCapture.ts` helper already includes this guard.
**Warning signs:** Build-time error `ReferenceError: localStorage is not defined`.

### Pitfall 2: Modal State Shared Across Download Instances
**What goes wrong:** Multiple download buttons on the same page (e.g., the briefs grid with 10 cards) each render their own modal, or a single modal is opened for the wrong file.
**Why it happens:** If `LeadCaptureModal` is instantiated inside `GatedDownloadButton`, each button has its own modal — this is correct and desired. If a single modal is lifted to page level, the href/filename to download must be passed correctly through state.
**How to avoid:** Keep modal instantiation local to `GatedDownloadButton`. Each button opens its own modal with its own `href`. No shared state needed.
**Warning signs:** Wrong file downloads after form submission, or multiple overlapping modals.

### Pitfall 3: Download Doesn't Trigger After GAS Success
**What goes wrong:** `onSuccess` fires but the browser doesn't download the file, or the download is blocked by popup blocker.
**Why it happens:** Browsers block programmatic navigations (including anchor clicks) that don't originate directly from a user interaction event. The `submitToGAS` call is async — by the time it resolves, the browser has classified the subsequent `a.click()` as a popup, not a user gesture.
**How to avoid:** The async gap is unavoidable. To work around popup blockers: open the download link before the async call using `window.open(href, '_blank')` and later navigate it, OR accept that some browsers may block the programmatic download. **The pragmatic solution:** Use `window.location.href = href` for same-origin PDFs — this is navigation, not a popup, and is not blocked. For files with `download` attribute semantics, the anchor-click approach works in Chrome/Firefox; Safari may differ. Given the target audience (primarily desktop policy researchers), `window.open(href, '_blank')` is the safest fallback.
**Warning signs:** Download works in Chrome dev tools but fails in Safari or Firefox with popup-blocked notifications.

### Pitfall 4: Gating DownloadCard PNG/Images
**What goes wrong:** The `ToolkitSection` includes a PNG social card. If `DownloadCard` is gated universally, image assets get intercepted.
**Why it happens:** `DownloadCard` is a generic component — it doesn't know the file type.
**How to avoid:** Add a `gated?: boolean` prop to `DownloadCard` and check file extension in `ToolkitSection` when mapping assets. Pass `gated={asset.format === 'PDF' || asset.format === 'DOCX'}`. Gate PDFs and DOCXs; leave PNG/JPEG ungated.

### Pitfall 5: Modal Renders During SSR (Hydration Mismatch)
**What goes wrong:** Modal or gating state computed from localStorage causes a React hydration warning because server render and client render differ.
**Why it happens:** Server renders `isGated = false` (no localStorage), client immediately checks localStorage and may find the user has bypassed — creating a mismatch.
**How to avoid:** Initialise `hasSubmitted` state as `false` (the conservative default), then set it from localStorage in `useEffect`. This is the same pattern used in `ConferenceBar` (read `sessionStorage` inside `useEffect`, not during render). Ensures SSR and first client render agree — `false` — then hydration-safe update fires.

---

## Code Examples

### GAS Submission (exact codebase pattern)
```typescript
// Source: app/components/take-action/PledgeForm.tsx (verified codebase)
async function submitToGAS(url: string, payload: LeadCapturePayload): Promise<'success' | 'error'> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return 'error';
    const json = await res.json();
    return json.status === 'success' ? 'success' : 'error';
  } catch {
    return 'error';
  }
}
```

The `lead-capture` payload extends this with `formType: 'lead-capture'`:
```typescript
const payload: LeadCapturePayload = {
  formType: 'lead-capture',
  email,
  audienceCategory,
  name: name || undefined,
  role: role || undefined,
  timestamp: new Date().toISOString(),
};
```

### localStorage Pattern (safe for SSR)
```typescript
// Source: ConferenceBar.tsx pattern (sessionStorage variant, verified codebase)
// Lead capture uses localStorage (persist across sessions, not sessionStorage)
useEffect(() => {
  const stored = localStorage.getItem(LEAD_CAPTURE_KEY);
  if (stored) {
    setHasSubmitted(true);
    setStoredEmail(stored);
  }
}, []);
```

### Modal Backdrop Pattern (Tailwind v4, brand tokens)
```typescript
// Backdrop — fixed overlay
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
  onClick={onDismiss}   // click outside to dismiss
>
  {/* Modal panel — stop propagation so clicking inside doesn't dismiss */}
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="lead-modal-title"
    className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6"
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => { if (e.key === 'Escape') onDismiss(); }}
  >
    ...
  </div>
</div>
```

### Form Input Class (exact codebase convention)
```typescript
// Source: app/components/take-action/PledgeForm.tsx
const inputClass =
  'border border-slate-200 rounded px-4 py-2 text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-600 w-full';
```

### Dropdown Pattern (select element, brand styling)
```typescript
// Consistent with inputClass
<select
  id="lead-audience"
  required
  value={audienceCategory}
  onChange={(e) => setAudienceCategory(e.target.value)}
  className={inputClass}
>
  <option value="">Select your category</option>
  <option value="Policymaker">Policymaker</option>
  <option value="Healthcare Worker">Healthcare Worker</option>
  <option value="Researcher">Researcher</option>
  <option value="Student">Student</option>
  <option value="General Public">General Public</option>
</select>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate env vars per form endpoint | Single `NEXT_PUBLIC_GAS_URL` with `formType` routing | Phase 10-02 | No new env var for lead-capture — just add `formType: 'lead-capture'` to payload |
| Direct `<a href>` for downloads | `GatedDownloadButton` (new) wrapping programmatic download | Phase 17 (this phase) | All PDF/DOCX downloads gated; localStorage bypass for returning visitors |
| No modal components | `LeadCaptureModal` (new) | Phase 17 (this phase) | First modal in the project — no existing pattern to follow, but approach is standard React |

**No deprecated patterns apply here.** The codebase has no prior modal implementation to replace.

---

## Open Questions

1. **Does the `BriefCard` infographic PDF (`brief.infographicPdfUrl`) need gating?**
   - What we know: Context says "all PDF downloads site-wide" and "policy briefs and toolkit assets". `infographicPdfUrl` is a PDF (not a JPEG). The infographic JPEG (`infographicImageUrl`) on `/awareness` is explicitly free.
   - What's unclear: Is a PDF infographic in the briefs grid a "policy brief PDF" or an "infographic asset"?
   - Recommendation: Gate it. Context says "all PDF downloads site-wide" — the infographic PDF is a PDF. The free carve-out is explicitly for "infographic JPEGs" (`/awareness` page image assets), not PDF versions of infographics.

2. **Does the DOCX in `ToolkitSection` need gating?**
   - What we know: Context says PDF downloads trigger the wall; DOCXs are not PDFs. But the context also says "policy briefs and toolkit assets" are gated.
   - What's unclear: "Toolkit assets" could include non-PDF files like the advocacy letter template DOCX.
   - Recommendation: Gate DOCX alongside PDF. The advocacy letter template DOCX is clearly a substantive advocacy resource (not an image asset). Gate it with the same wall.

3. **Should `GatedDownloadButton` accept a `filename` prop for programmatic download?**
   - What we know: `DownloadCard` currently uses `<a download={filename}>` to set the save-as filename. The `DownloadButton` on brief pages uses `target="_blank"` without a filename (browser uses the URL filename).
   - What's unclear: Whether to harmonise this across the gated wrapper.
   - Recommendation: Accept optional `filename?: string` prop; pass to the programmatic anchor's `download` attribute when present.

---

## Sources

### Primary (HIGH confidence)
- Codebase: `app/components/take-action/PledgeForm.tsx` — GAS submission pattern (`submitToGAS`, payload shape, `formType` routing, error handling)
- Codebase: `app/components/take-action/CommitmentForm.tsx` — confirms GAS pattern consistency
- Codebase: `app/components/layout/ConferenceBar.tsx` — sessionStorage read in `useEffect` (SSR-safe browser storage pattern)
- Codebase: `app/lib/form-config.ts` — confirms `NEXT_PUBLIC_GAS_URL` is the single endpoint
- Codebase: `app/components/briefs/DownloadButton.tsx` — current download component (plain `<a>`, no gating)
- Codebase: `app/components/take-action/DownloadCard.tsx` — second download surface (`<a download>` anchor)
- Codebase: `app/components/briefs/BriefCard.tsx` — third download surface (direct `<a href={brief.pdfUrl}>` in card grid)
- Codebase: `app/components/sections/FeaturedBrief.tsx` — fourth download surface (`<a href={brief.pdfUrl} download>`)
- Codebase: `next.config.js` — confirms `output: 'export'` (static, no server runtime, no API routes)
- Codebase: `package.json` — confirms no modal/dialog library installed; no new dependencies needed

### Secondary (MEDIUM confidence)
- Browser specification: programmatic `<a>.click()` for file download — standard DOM pattern, widely documented; blocked by popup blockers in async context (known browser behaviour)
- React docs: `useEffect` for client-side side effects (localStorage, window) — core React pattern, version-stable

### Tertiary (LOW confidence)
- None — all findings are from direct codebase inspection or well-established browser/React patterns.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified from `package.json`; no new dependencies required
- Architecture: HIGH — patterns verified from actual codebase components; direct inspection
- Pitfalls: HIGH for SSR/localStorage (verified from ConferenceBar pattern); MEDIUM for popup-blocker download behaviour (browser behaviour, not codebase-verified)

**Research date:** 2026-05-08
**Valid until:** 2026-06-08 (stable domain — no moving parts; valid until Next.js major version bump)
