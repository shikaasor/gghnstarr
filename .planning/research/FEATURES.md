# Feature Landscape

**Domain:** Policy brief publishing website for high-level government officials (AMR/health)
**Researched:** 2026-03-23
**Confidence:** MEDIUM (based on established domain patterns from WHO, Brookings, Chatham House, CGD, Africa CDC, and similar policy publishing sites; no live web verification available this session)

## Table Stakes

Features the target audience (African Ministers of Health, Permanent Secretaries, Directors-General) expects. Missing any of these and the site feels unprofessional or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Institutional branding and logos** | Government officials assess credibility in seconds. Partner logos (WHO, universities, GGHN) signal legitimacy. | Low | Hero area + footer logo strip. Use high-res SVGs. |
| **PDF download for every brief** | Officials print, share in meetings, forward to staff. PDF is the lingua franca of policy communication. | Low | Pre-generated PDFs, simple download buttons with clear file sizes. |
| **Mobile-responsive layout** | Many African government officials access web primarily via mobile. Network conditions vary widely. | Medium | Mobile-first CSS. Optimize for 3G speeds. Target < 3s first paint. |
| **Clear navigation (5 pages max)** | Busy officials won't hunt. They need Home, Briefs, Team, Methodology, Contact -- done. | Low | Simple top nav. No mega-menus, no dropdowns. |
| **Professional typography and whitespace** | Policy audiences expect "serious" design: serif or clean sans-serif, generous whitespace, no clutter. Think WHO/World Bank aesthetic. | Low | System font stack or single web font (Inter or Source Sans Pro). Avoid decorative fonts. |
| **Brief metadata display** | Officials need to quickly assess: date, topic, author/team, brief number (e.g., "Week 7 of 15"). | Low | Card-level metadata. Consistent format across all briefs. |
| **Contact mechanism** | Officials or their staff need to reach the team. A form is minimum; email link is acceptable fallback. | Low | Formspree or similar. No backend needed. |
| **Fast page load** | Government networks in some African countries are slow. Heavy sites get abandoned. | Medium | Static site helps. Compress images aggressively. Lazy-load below-fold content. Target < 500KB total page weight. |
| **HTTPS / SSL** | Government IT departments may flag non-HTTPS sites. Browser warnings destroy credibility. | Low | Free via hosting provider (Netlify, Vercel, GitHub Pages). |
| **Accessible color contrast** | Officials may be older; many contexts involve projectors or low-quality screens. WCAG AA minimum. | Low | Test all text against backgrounds. Avoid light gray on white. |

## Differentiators

Features that elevate this site above a generic PDF repository. Not expected, but they signal sophistication and build trust with a policy audience.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Visual brief cards with infographic thumbnails** | Transforms a list of PDFs into an engaging browsable collection. Officials can visually scan topics. | Medium | Generate thumbnail images from each brief's key graphic. Display as card grid. |
| **Infographic download (separate from PDF)** | Officials share single graphics in WhatsApp groups, presentations, and ministerial briefings. A standalone infographic image is more shareable than a full PDF. | Low | Separate download button per brief for the key infographic (PNG/JPG). |
| **Filtering by month and theme** | With 15 briefs, even simple filtering helps officials find what's relevant to their country's AMR priorities. | Medium | Client-side JS filter. No backend needed. Tag each brief with month + theme metadata. |
| **"Key takeaway" summary on each card** | Officials rarely click through. A 1-2 sentence takeaway on the card itself delivers value without requiring a click. | Low | Add a `summary` field to brief metadata. Display on card front. |
| **Stats strip with impact numbers** | "X countries covered", "Y policy recommendations", "Z briefs published" -- quantified impact signals seriousness to government audiences accustomed to KPI-driven reporting. | Low | Static or lightly animated counter section. |
| **Expert credibility signals** | Photo, title, institutional affiliation, and 2-3 sentence bio for each expert. Government officials trust people with credentials they recognize. | Low | Profile cards with headshot, name, title, affiliation. Link to institutional page if available. |
| **Methodology transparency section** | Modeling-based policy work must show its methodology to be trusted by technical leads and DGs. Static dashboard screenshots with explanatory text suffice. | Medium | Dedicated page with clear section headings: Data Sources, Model Description, Limitations, Validation. |
| **Social sharing / citation-ready metadata** | When officials share the URL, it should render a clean Open Graph preview (title, description, image) in WhatsApp, email previews, and social media. | Low | OG meta tags + Twitter cards. Generate per-brief if possible, at minimum site-wide. |
| **Print-friendly brief pages** | Some officials will print directly from the browser rather than downloading PDF. | Low | CSS `@media print` stylesheet. Hide nav, expand content, ensure clean page breaks. |

## Anti-Features

Features to explicitly NOT build for v1. Each of these adds complexity without proportional value for this specific project scope.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **User authentication / login** | 15 briefs are public policy documents. Gating content behind login reduces reach and contradicts the dissemination mission. Government officials will not create accounts. | Keep everything public. No login wall. |
| **CMS / admin panel** | Only 15 briefs total, published weekly by the same team. A CMS adds massive complexity for minimal benefit. Content changes are infrequent and predictable. | Manage content as structured data files (JSON/YAML) in the repo. Deploy via git push. |
| **Search functionality** | With only 15 briefs and 5 pages, search is overkill. Filtering by month/theme covers the discovery need. | Use client-side filtering on the briefs page. |
| **Comments or discussion forums** | Government officials will not comment publicly on policy briefs on an external website. This invites moderation burden with zero engagement. | Provide contact form for private inquiries. |
| **Newsletter signup / email list** | Adds GDPR/data-protection complexity. The 15-brief series has a fixed timeline. Email lists need ongoing management the team likely cannot sustain. | Share briefs via existing GGHN distribution channels. Add a simple "follow us" link if social accounts exist. |
| **Multi-language support (v1)** | Adds 2-3x content management burden. Start in English (the working language of AU/ministerial policy). Consider French translation as a v2 feature if demand materializes. | English only for v1. Structure content files so translation is possible later. |
| **Interactive data dashboards** | The modeling team produces dashboards, but embedding live interactive dashboards requires ongoing data pipeline maintenance, hosting, and debugging. Screenshots convey the key findings without the maintenance burden. | Use static dashboard screenshots with captions on the Methodology page. Link to external dashboard if one exists. |
| **Blog or news section** | Scope creep. The site publishes briefs, not general news. A blog needs ongoing content that the team won't produce. | The briefs themselves are the content stream. |
| **Analytics dashboard (visible)** | Internal analytics (Google Analytics / Plausible) are fine, but don't build a public-facing "views" counter or engagement dashboard. | Add a lightweight analytics script (Plausible recommended for privacy). Keep data internal. |
| **Video or multimedia embeds** | Adds page weight, hosting complexity, and accessibility concerns. Government officials on slow connections will not watch videos. | If video content exists, link to YouTube/Vimeo externally. Don't embed. |

## Feature Dependencies

```
Institutional branding --> All pages (branding is foundational, do first)
Brief metadata structure --> Brief cards --> Filtering (metadata schema must exist before cards or filters)
Brief metadata structure --> PDF downloads (PDFs linked via metadata)
Brief metadata structure --> Infographic downloads (infographics linked via metadata)
Brief cards --> Visual thumbnails (thumbnails are an enhancement to cards)
Brief cards --> "Key takeaway" summaries (summaries display on cards)
Expert profiles --> Methodology page (methodology references the experts)
OG meta tags --> Social sharing (OG tags enable rich previews)
Mobile-first layout --> All pages (responsive design is architectural, not a bolt-on)
```

## MVP Recommendation

**Prioritize (Phase 1 -- launch-ready):**

1. **Institutional branding + partner logos** -- credibility is non-negotiable for this audience
2. **Brief cards with PDF download** -- this is the core value proposition
3. **Mobile-first responsive layout** -- audience access pattern demands it
4. **Fast static pages with HTTPS** -- trust and accessibility baseline
5. **Contact form** -- minimum viable communication channel
6. **Expert profile cards** -- credibility through named experts
7. **OG meta tags** -- costs almost nothing, huge impact when URLs are shared

**Add immediately after launch (Phase 1.5):**

8. **Infographic download buttons** -- high value, low effort if infographics exist
9. **Filtering by month/theme** -- becomes valuable once 5+ briefs are published
10. **Stats strip** -- quick win for credibility signaling
11. **Print stylesheet** -- low effort, appreciated by the audience

**Defer to v2 (if ever):**

- Multi-language support
- Interactive dashboards
- Newsletter/email integration
- Any form of user accounts

## Audience-Specific Considerations

### What makes government officials different from general web users

1. **They delegate browsing.** A Minister's technical advisor or personal assistant often scouts content first. The site must be immediately scannable -- the advisor needs to decide in 10 seconds whether to forward it.

2. **They trust institutional signals.** Logos, affiliations, formal language, and professional design matter more than trendy aesthetics. A site that looks like a startup landing page will be dismissed.

3. **They consume offline.** PDFs get printed, emailed, and discussed in physical meetings. The PDF must be the polished artifact; the website is the delivery mechanism.

4. **They share via WhatsApp and email.** Open Graph previews and clean URLs matter. A shared link that renders as a bare URL with no preview image loses impact.

5. **They access via mobile on variable networks.** Page weight and loading speed are not premature optimization -- they are accessibility requirements.

6. **They expect formality.** No emoji, no casual copy, no "Hey there!" tone. Clear, authoritative, concise language throughout.

## Competitive Reference Points

Sites that do this well (for pattern reference, not copying):

| Site | What They Do Well | Relevant Pattern |
|------|-------------------|------------------|
| **Africa CDC** (africacdc.org) | Clean institutional design, prominent partner logos, PDF-heavy content distribution | Branding + credibility signals |
| **WHO Policy Briefs** | Consistent brief formatting, clear metadata (date, series, topic), prominent PDF download | Brief card structure |
| **Brookings Institution** | Expert profiles tied to publications, clean typography, scannable layouts | Expert-publication linkage |
| **Center for Global Development** | Filterable publication libraries, clear categorization, summary-first card design | Filtering + card UX |
| **KEMRI-Wellcome Trust** | Africa-focused health research publishing, mobile-conscious design | Regional audience awareness |

## Sources

- Domain expertise from established policy publishing patterns (WHO, Brookings, CGD, Africa CDC, Chatham House)
- Note: Web search was unavailable during this research session. Competitive reference points are based on training data and should be spot-checked against current live sites.
- Confidence: MEDIUM -- patterns are well-established in this domain but specific current implementations were not verified live.
