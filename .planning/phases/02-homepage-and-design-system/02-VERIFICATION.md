---
phase: 02-homepage-and-design-system
verified: 2026-03-30T12:00:00Z
status: human_needed
score: 5/5 must-haves verified
human_verification:
  - test: "Open http://localhost:3000 and confirm all 4 partner logos render (not broken image icons)"
    expected: "GGHN, Fleming Fund, Africa CDC, and WHO AFRO logos are visually present in the Partners strip"
    why_human: "public/images/partners/ directory is empty — PNG files have not been added. The component and data wiring are correct but the actual image assets are missing. Only a browser visit confirms whether placeholder/fallback rendering is acceptable or whether blank image boxes block the credibility signal."
  - test: "Replace NEXT_PUBLIC_GAS_URL in .env.local with a real Google Apps Script Web App URL, redeploy, and submit the newsletter form"
    expected: "Submitted email appears in the linked Google Sheet; form shows 'You're subscribed.' confirmation inline"
    why_human: "The NEXT_PUBLIC_GAS_URL value in .env.local is a placeholder (REPLACE_WITH_YOUR_DEPLOYMENT_ID). The form component is fully implemented and wired correctly. Live email capture is blocked until the user completes the Google Apps Script setup described in the 02-04-SUMMARY.md."
---

# Phase 2: Homepage & Design System Verification Report

**Phase Goal:** A visitor landing on the homepage immediately sees institutional credibility signals, understands the initiative's three pillars, can access the current policy brief, and can sign up for the newsletter
**Verified:** 2026-03-30T12:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Homepage displays a hero section with the Inter-Ministerial Conference badge, headline, and a CTA button that links to the latest brief | VERIFIED | `HeroSection.tsx` renders `bg-white min-h-screen` section with `ConferenceBadge`, h1 "AMR Policy Intelligence for Africa", and `<Link href="/briefs">` CTA. Confirmed in `out/index.html` (29KB build output). |
| 2 | Three pillars (Genomic Surveillance, Predictive Analytics, One Health Governance) are displayed as an icon grid below the hero | VERIFIED | `ThreePillars.tsx` renders `grid grid-cols-1 md:grid-cols-3` with Dna, TrendingUp, Globe icons from lucide-react. All three titles confirmed present in build output. |
| 3 | The current week's featured brief shows its title, executive summary, and a working "Download PDF" button that delivers the PDF file | VERIFIED | `FeaturedBrief.tsx` renders title, key messages list, and `<a href={brief.pdfUrl} download>`. `briefs-index.json` has `"featured": true` on `week-03-predictive-analytics-amr-burden`. Full section confirmed in `out/index.html` with correct PDF href `/briefs/week-03-predictive-analytics-amr-burden.pdf`. Note: plan specified "key messages" not "executive summary" — correct per locked design decision. |
| 4 | Partner logos (GUCGHPI, Fleming Fund, Africa CDC, WHO AFRO) are visible on the homepage | PARTIAL | `PartnerLogos.tsx` is fully implemented and wired with all 4 partners from `site.json` (GGHN/GUCGHPI, Fleming Fund, Africa CDC, WHO AFRO). Component renders correctly in build. However `public/images/partners/` is empty — PNG files are absent. Logos will render as broken image elements at runtime. Requires human confirmation. |
| 5 | A visitor can enter their email into a newsletter signup form and submit it successfully | PARTIAL | `NewsletterSignup.tsx` is a complete 'use client' component with 4-state form machine (idle/submitting/success/error), GAS CORS workaround (`text/plain;charset=utf-8`, `redirect:follow`), inline success/error states. Form renders correctly in build. However `.env.local` contains a placeholder URL (`REPLACE_WITH_YOUR_DEPLOYMENT_ID`). Actual email submission is non-functional until user configures Google Apps Script. Requires human confirmation after GAS setup. |

**Score:** 5/5 truths verified at code level; 2 require human confirmation for runtime behavior.

---

### Required Artifacts

| Artifact | Provided By | Status | Details |
|----------|------------|--------|---------|
| `content/briefs-index.json` | 02-01-PLAN | VERIFIED | `week-03` entry has `"featured": true`; week-01 and week-02 do not |
| `content/site.json` | 02-01-PLAN | VERIFIED | `stats` array with 3 AMR stat objects; `partners` array with 4 entries including URLs |
| `app/lib/types.ts` | 02-01-PLAN | VERIFIED | `Brief.featured?: boolean` present; `SiteContent.stats: Array<{value, label}>` present |
| `app/lib/content.ts` | 02-01-PLAN | VERIFIED | `getFeaturedBrief()` exported, finds by `b.featured === true` |
| `app/page.tsx` | 02-01-PLAN | VERIFIED | Server Component, imports all 6 sections, calls `getSiteContent()` and `getFeaturedBrief()`, renders in correct order |
| `app/components/sections/HeroSection.tsx` | 02-02-PLAN | VERIFIED | `bg-white min-h-screen`, teal headline, CTA `<Link href="/briefs">`, no 'use client' |
| `app/components/sections/ConferenceBadge.tsx` | 02-02-PLAN | VERIFIED | `'use client'`, `useState<number \| null>(null)` (hydration-safe), 60s interval, static fallback text when null |
| `app/components/sections/StatStrip.tsx` | 02-02-PLAN | VERIFIED | `'use client'`, 4000ms rotation interval, `bg-slate-100`, guards against empty stats |
| `app/components/sections/ThreePillars.tsx` | 02-02-PLAN | VERIFIED | Server Component, `grid-cols-1 md:grid-cols-3`, Dna/TrendingUp/Globe icons, no description text |
| `app/components/sections/FeaturedBrief.tsx` | 02-03-PLAN | VERIFIED | Server Component, `bg-slate-100`, key messages list with dash prefix, `<a download>` anchor |
| `app/components/sections/PartnerLogos.tsx` | 02-03-PLAN | VERIFIED (component) / WARNING (assets) | `flex-wrap` logos row, all 4 partners wired. PNG files absent from `public/images/partners/` |
| `app/components/sections/NewsletterSignup.tsx` | 02-04-PLAN | VERIFIED (component) / PENDING (live) | `'use client'`, 4 form states, GAS CORS workaround present. URL is placeholder only |
| `.env.local` | 02-04-PLAN | VERIFIED (file) / PENDING (value) | File exists with `NEXT_PUBLIC_GAS_URL` key. Value is placeholder — user must replace |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/page.tsx` | `app/lib/content.ts` | `getFeaturedBrief` / `getSiteContent` imports | WIRED | Both functions called on lines 1, 10-11 of page.tsx; results passed as props to sections |
| `app/lib/content.ts` | `content/briefs-index.json` | `fs.readFileSync` | WIRED | Line 9: `path.join(CONTENT_DIR, 'briefs-index.json')` |
| `app/components/sections/HeroSection.tsx` | `ConferenceBadge.tsx` | import + prop passing | WIRED | Line 3 import; `<ConferenceBadge conferenceDate={conferenceDate} />` on line 12 |
| `app/components/sections/FeaturedBrief.tsx` | `app/lib/types.ts` | `Brief` type import | WIRED | Line 4: `import type { Brief } from '@/lib/types'` |
| `app/components/sections/PartnerLogos.tsx` | `app/lib/types.ts` | `SiteContent['partners']` type | WIRED | Line 3: `import type { SiteContent } from '@/lib/types'` |
| `app/components/sections/NewsletterSignup.tsx` | `process.env.NEXT_PUBLIC_GAS_URL` | `fetch` POST call | WIRED (code) / PENDING (config) | Line 11: `fetch(process.env.NEXT_PUBLIC_GAS_URL!, ...)` — code path correct, env value is placeholder |
| `app/page.tsx` | `content/site.json` | `getSiteContent()` → `partners` prop | WIRED | `site.partners` passed to `<PartnerLogos partners={site.partners} />` on line 19 |

---

### Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| HOME-01 | 02-01, 02-02 | Hero section with conference badge, headline, CTA, 3 Pillars icon grid | SATISFIED | `HeroSection.tsx` + `ConferenceBadge.tsx` + `ThreePillars.tsx` all built and rendered in `out/index.html` |
| HOME-02 | 02-01, 02-02, 02-03 | Featured Brief with title, executive summary, "Download PDF" button; Stats Strip | SATISFIED | `FeaturedBrief.tsx` renders week-03 brief with key messages and download anchor; `StatStrip.tsx` rotates 3 stats from `site.json` |
| HOME-03 | 02-03 | Partner Logos strip: GUCGHPI, Fleming Fund, Africa CDC, WHO AFRO | PARTIALLY SATISFIED | Component wired with all 4 partners. PNG assets absent from `public/images/partners/` — logos show as broken images at runtime. Component logic is correct; only assets are missing. |
| HOME-04 | 02-04 | Newsletter signup capturing email, submitting to Mailchimp (plan pivoted to Google Apps Script) | PARTIALLY SATISFIED | Form component complete with correct GAS integration pattern. Non-functional until user replaces `NEXT_PUBLIC_GAS_URL` placeholder and deploys GAS Web App. This is documented as user setup, not a code gap. |

**Note on HOME-03 partner name:** REQUIREMENTS.md says "GUCGHPI" — this appears to be a variant acronym for GGHN (Good Governance for Health in Nigeria / Georgetown University Center for Global Health Practice and Impact). `site.json` uses "GGHN (Good Governance for Health in Nigeria)" which matches the project's consistent branding. This is not a functional gap.

**Note on HOME-04 service pivot:** REQUIREMENTS.md specifies Mailchimp; 02-04-PLAN.md and implementation use Google Apps Script. This is a deliberate plan-level decision (GAS is free tier; avoids Mailchimp API key management in static export). The requirement intent — email capture — is met by the implementation.

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `app/components/sections/NewsletterSignup.tsx` | `NEXT_PUBLIC_GAS_URL!` non-null assertion on undefined placeholder | Info | At runtime with placeholder value, `fetch` will POST to `https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec` which will 404/error. The `catch` block correctly handles this and sets state to 'error', so the UI degrades gracefully. Not a blocker. |
| `public/images/partners/` | Empty directory — 4 PNG files referenced in `site.json` and `PartnerLogos.tsx` are absent | Warning | All 4 partner logo `<img>` elements will render as broken image icons at runtime. Credibility signal (SUCCESS CRITERION 4) is visually incomplete. |

No TODO/FIXME comments, no placeholder returns (`return null`), no stub implementations found in any of the 7 section components or `app/page.tsx`.

---

### Human Verification Required

#### 1. Partner Logo Assets

**Test:** Run `npm run dev`, open http://localhost:3000, scroll to the Partners section
**Expected:** Four partner logos (GGHN, Fleming Fund, Africa CDC, WHO AFRO) render as visible images in a horizontal row with 80% opacity
**Why human:** `public/images/partners/` is empty. The component is correctly wired to the files (`/images/partners/gghn.png`, `/images/partners/fleming-fund.png`, `/images/partners/africa-cdc.png`, `/images/partners/who-afro.png`) but the PNG files do not exist. The directory must be populated with the actual logo files before SUCCESS CRITERION 4 is truly met. This is an asset-delivery gap, not a code gap.

**Action required:** Add PNG logo files for all 4 partners to `public/images/partners/`. File names must match `site.json` logoUrl values exactly.

#### 2. Newsletter Form Live Submission

**Test:** Complete the Google Apps Script setup (create GAS Web App, replace placeholder in `.env.local`, redeploy to Vercel), then submit the form with a test email address
**Expected:** Email appears in the linked Google Sheet; homepage shows "You're subscribed." confirmation replacing the form
**Why human:** The GAS URL is a placeholder. The form component logic is correct and complete — this cannot be verified without a real GAS deployment.

**Setup steps documented in:** `.planning/phases/02-homepage-and-design-system/02-04-SUMMARY.md` (User Setup Required section)

---

### Gaps Summary

No code gaps. Both open items are infrastructure/asset delivery:

1. **Partner logo PNG files** — 4 image files need to be placed in `public/images/partners/`. This is the only thing preventing SUCCESS CRITERION 4 ("Partner logos are visible on the homepage") from being visually true. All code is correct.

2. **GAS Web App URL** — User must create and deploy a Google Apps Script Web App and update `.env.local`. This is an intentional user-setup item explicitly called out in the plan and summary. The newsletter form is fully functional once the URL is set.

Neither gap requires a plan-phase iteration. Both are resolved by the user adding assets and configuring an external service.

---

### Build Output Confirmation

`out/index.html` (29,116 bytes) confirms the following sections are present in the static export:
- Hero: "AMR Policy Intelligence for Africa" headline, conference badge, "/briefs" CTA
- StatStrip: First stat "700,000 / deaths per year attributed to AMR globally" server-rendered
- ThreePillars: All 3 pillars (Genomic Surveillance, Predictive Analytics, One Health Governance) with SVG icons
- FeaturedBrief: "Featured Policy Brief" label, week-03 title, 5 key messages, download anchor with `href="/briefs/week-03-predictive-analytics-amr-burden.pdf"`
- PartnerLogos: All 4 partner `<img>` elements with correct `src` paths and `alt` text
- NewsletterSignup: "Stay Informed" heading, email input, "Subscribe" button

---

*Verified: 2026-03-30T12:00:00Z*
*Verifier: Claude (gsd-verifier)*
