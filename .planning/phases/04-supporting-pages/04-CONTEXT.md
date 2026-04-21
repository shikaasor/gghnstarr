# Phase 4: Supporting Pages - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the three remaining content pages — Methodology, Experts, and Contact — completing all 5 pages of the site. Scope is limited to these three pages. No new capabilities (live dashboards, expert detail pages, additional forms) are in scope.

</domain>

<decisions>
## Implementation Decisions

### Methodology page structure
- Tab layout with three tabs: SEIR/ML/Bayesian Models | NIPAD Platform | GlobalPPS & WHONET
- Each tab: medium depth — 2–4 paragraphs + bullet points (not a brief summary, not a technical paper)
- NIPAD tab: styled placeholder image labelled "NIPAD Dashboard Screenshot" — swap with real screenshot when available
- CTA at bottom of page: two links — "Browse Policy Briefs" (→ /briefs) and "Get in Touch" (→ /contact)

### Expert card layout
- Vertical cards in a 3-column grid on desktop, single column on mobile
- Real headshot photos will be provided — use `<Image>` with a styled placeholder while files are committed
- Each card shows: photo, name, title, institutional affiliation, area of expertise/specialization, short bio (2–3 sentences)
- No outbound links from cards — self-contained

### Contact form behavior
- Inquiry Type dropdown options: "Partnership / Collaboration", "Media Inquiry", "Policy Brief Request", "Technical / Methodology"
- Required fields: Name, Email, Inquiry Type, Message
- Optional fields: Title, Ministry/Organization, Country
- Success state: inline replacement of the form section with a thank-you message (same pattern as NewsletterSignup)
- Fallback email: wrapped in `<noscript>` block — only shown when JavaScript is disabled

### Page tone & audience
- Methodology: written for policymakers, not technical peers — plain language, emphasise "what it means for AMR policy" not "how the model works mathematically"
- Experts: balanced — credentials clearly shown (title, institution) but bio gives a human picture of the person and their mission, not just a CV
- Contact: open and welcoming headline/intro — e.g. "We'd love to hear from you" framing, not bureaucratic
- Content authoring: Claude writes all copy (bios, methodology descriptions, contact intro) from source documents — `GGHN STARR Expertises_Feb 2026.docx` for expert bios, existing brief content/data for methodology copy. Flag any gaps where source material is insufficient.

### Claude's Discretion
- Exact tab component implementation (CSS-only vs useState)
- Placeholder avatar styling for expert photos until real images are committed
- Error state handling for the contact form
- Exact spacing, typography, and icon choices within the established Navy/Teal design system

</decisions>

<specifics>
## Specific Ideas

- Methodology page audience = Ministers, Directors-General, Permanent Secretaries — assume they read on mobile, in transit, without technical background. Analogies and outcomes over equations.
- Expert bios sourced from `GGHN STARR Expertises_Feb 2026.docx` (in repo root). Three experts: Dr. Olawale A., Dr. Samson A., Piringar Mercy Niyang.
- Contact form follows the same Formspree pattern already decided in Phase 2 (no custom backend). Inquiry Type is a `<select>` dropdown.
- Inline success state on Contact form mirrors the NewsletterSignup component pattern from Phase 2.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-supporting-pages*
*Context gathered: 2026-04-05*
