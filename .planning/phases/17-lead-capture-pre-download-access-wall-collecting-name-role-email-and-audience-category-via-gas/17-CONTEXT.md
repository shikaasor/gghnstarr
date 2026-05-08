# Phase 17: Lead Capture - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

An access wall that intercepts PDF downloads before the file is delivered. The user clicks a download button, a modal form appears requesting identity info, data is submitted to GAS, and then the download proceeds automatically. Returning visitors (recognised via localStorage) bypass the wall. Infographic JPEGs and image assets are not gated.

</domain>

<decisions>
## Implementation Decisions

### Trigger scope
- All PDF downloads site-wide trigger the wall (policy briefs, toolkit assets)
- Infographic JPEGs on /awareness remain free — no intercept
- Advocacy toolkit downloads on /take-action are gated
- Frequency: once ever per browser (localStorage), not per session — returning submitters bypass entirely

### Wall UX
- Modal overlay (centered dialog over the page)
- Not skippable — form is required to get the download; no bypass button
- On dismiss without submitting: modal closes and a brief inline message appears explaining the user needs to fill the form to download
- Modal includes a short explanation of why info is collected (e.g. "Help us understand who accesses AMR resources")

### Form fields
- Required: Email, Audience Category
- Optional: Name, Role
- Role: dropdown — Minister / Policy Advisor / Healthcare Worker / Researcher / Student / Other
- Audience Category: 5 options — Policymaker / Healthcare Worker / Researcher / Student / General Public
- No Country field (keep it lean)

### Post-submit flow
- On success: modal closes, browser download triggers automatically — seamless, no extra click
- GAS failure: silent fail — download proceeds regardless; don't penalise user for backend errors
- localStorage stores the user's email address — flags that this browser has completed lead capture; can pre-fill if needed in future
- Uses existing NEXT_PUBLIC_GAS_URL endpoint with formType: 'lead-capture' — no new env var or GAS deployment

### Claude's Discretion
- Modal visual design (styling, animation, backdrop)
- Exact error message copy when modal is dismissed without submitting
- How email is validated (format check)
- localStorage key naming convention

</decisions>

<specifics>
## Specific Ideas

- "Once ever" via localStorage — the email stored is the recognition token, not just a boolean flag
- The wall must be non-skippable but also not punishing on dismiss — a gentle nudge message is the right tone
- GAS routing pattern is already established: formType field in existing endpoint (see Phase 10-02 decision)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 17-lead-capture-pre-download-access-wall-collecting-name-role-email-and-audience-category-via-gas*
*Context gathered: 2026-05-08*
