# Phase 8: Awareness Hub & Education Library - Research

**Researched:** 2026-04-29
**Domain:** Next.js static export — new content pages, lightbox, accordion, client-side tab filtering, curated external resource data
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Infographic Display (/awareness)
- 3-column responsive grid layout for the 3 Fleming Fund Rwanda JPEGs
- Clicking an infographic opens a lightbox/enlarged view
- Each image shows: title + short description underneath
- No download buttons on /awareness — images are view-only; downloads handled on /briefs detail pages

#### Explainer Article Sections (/awareness)
- Accordion (expandable/collapsible) sections — collapsed by default, users expand to read
- 3 topics: "What is AMR", "Why Africa", "What You Can Do"
- Real content — proper 2-3 paragraph text per topic (not placeholders)
- Relevant fact sheets are linked as downloadable resources inside each accordion section

#### Education Filter UX (/education)
- Tab bar filter: All | Policymaker | Healthcare Worker | General Public
- Default state: "All" tab active — all resources visible on arrival (no audience-selection prompt)
- Initial content: 12+ resource cards (4+ per audience)
- Content source: curated real external links (WHO, Africa CDC, PubMed, etc.) — not internal assets

#### Resource Card Design (/education)
- Each card shows: title, audience tag(s), format label (with icon), source/organization
- Format labels use icon + text: document icon for Article, download arrow for Download, play button for Video
- A card can be tagged with multiple audience types — it appears under all matching filter tabs
- Clicking a card opens the external resource in a new tab (all types: Article, Download, Video)

### Claude's Discretion
- Lightbox implementation (library vs custom — choose what fits the existing Next.js static export)
- Exact AMR content text for the 3 explainer topics
- Specific WHO/CDC/etc. URLs to curate for the 12+ education resources (research and select appropriate ones)
- Grid responsiveness breakpoints (2-col on tablet, 1-col on mobile)
- Accordion open/close animation

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AWRE-01 | A dedicated Awareness Hub page (/awareness) displays infographics, explainer articles, and downloadable fact sheets about AMR for a general audience | Static page pattern confirmed: Server Component, no `generateStaticParams` needed (no dynamic route), data inlined as constants |
| AWRE-02 | Awareness hub content is organized and visually distinct (the 3 infographic JPEGs from resources/ are displayed; placeholder text for explainer articles) | 3 JPEGs confirmed in `public/infographics/`: IMG_9750.jpeg, IMG_9751.jpeg, IMG_9752.jpeg — real content required, not placeholders |
| EDUC-01 | A dedicated Education Library page (/education) displays audience-specific learning materials filterable by audience type (Policymaker, Healthcare Worker, General Public) | Client-side tab filter pattern confirmed; BriefGrid.tsx is the reference — same `'use client'` + `useState` approach |
| EDUC-02 | Each education resource card shows title, audience tag, format (article/download/video), and a download or read link | EducationResource data type to be added to types.ts; lucide-react icons already installed for format badges |
</phase_requirements>

---

## Summary

Phase 8 adds two static Next.js pages — `/awareness` and `/education` — to a Next.js 16 / React 19 / Tailwind v4 static export project. Both pages follow patterns already established in the codebase and require no new backend infrastructure. All data (infographic metadata, accordion content, education resource list) lives in-file as typed constants rather than in `content/` JSON files, because the content is small, static, and not shared across pages.

The `/awareness` page has three concerns: (1) a 3-column infographic grid with a lightbox on click, (2) accordion explainer sections with real AMR text, and (3) inline fact sheet download links. The lightbox is the only new third-party dependency; `yet-another-react-lightbox` v3 is the clear standard choice — it supports React 19, works purely client-side (compatible with `output: 'export'`), and the Next.js team explicitly documents its usage pattern. The accordion requires no new dependency; a native `<details>`/`<summary>` element or a simple `useState`-toggled div both work with Tailwind v4 transitions.

The `/education` page mirrors the `/briefs` BriefGrid pattern: a `'use client'` component holds tab state, filters an array of `EducationResource` objects, and renders cards. All 12+ resources are curated real external URLs (WHO, Africa CDC, Fleming Fund, PubMed) embedded as constants. No JSON file or `fs.readFileSync` is needed. Both pages must add their routes to `Header.tsx` nav and enable the disabled CTAs in `AudienceCTAs.tsx`.

**Primary recommendation:** Implement both pages as Server Components that pass inlined data arrays down to `'use client'` child components for interactivity — same split used by `BriefsPage` → `BriefGrid`.

---

## Standard Stack

### Core (already installed — zero new dependencies required except lightbox)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | Static page routing | Already in project; `output: 'export'` confirmed |
| react | 19.2.4 | Component model | Already in project |
| tailwindcss | ^4.2.2 | Styling | All existing components use Tailwind v4 class syntax |
| lucide-react | ^1.6.0 | Format badge icons | Already installed; `FileText`, `Download`, `Play`, `ChevronDown` used elsewhere |

### New Dependency

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| yet-another-react-lightbox | ^3.x (latest ~3.31.0) | Infographic lightbox | Actively maintained (release 13 days ago as of research date); React 19 compatible; pure client-side, no server required; Next.js official example exists; zero external requests |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| yet-another-react-lightbox | Custom modal with `useState` + overlay div | Custom solution works but misses: keyboard navigation (Escape/Arrow keys), focus trap, body scroll lock, swipe gesture — all handled by yarl for free |
| yet-another-react-lightbox | react-photo-view | Less ecosystem presence; fewer recent commits |
| yet-another-react-lightbox | photoswipe | Requires more wiring; larger bundle |
| Native `<details>` for accordion | `useState` toggle | `<details>`/`<summary>` is simpler, zero JS, but CSS transition on height is not straightforward in Tailwind v4; `useState` + `max-h` transition is the established Tailwind pattern |

**Installation (only new package):**
```bash
npm install yet-another-react-lightbox
```

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── awareness/
│   └── page.tsx              # Server Component — passes data to client children
├── education/
│   └── page.tsx              # Server Component — passes data to client children
├── components/
│   ├── awareness/
│   │   ├── InfographicGrid.tsx   # 'use client' — lightbox state
│   │   └── AccordionSection.tsx  # 'use client' — open/close state
│   └── education/
│       └── EducationGrid.tsx     # 'use client' — tab filter state
└── lib/
    └── types.ts              # Add EducationResource type
```

Data lives as typed constants inside `page.tsx` files (not in `content/` JSON), since this content is page-local and not queried by other parts of the app.

### Pattern 1: Static Server Page Passing Data to Client Components

The existing `BriefsPage` → `BriefGrid` split is the canonical pattern. Follow it exactly.

```typescript
// app/awareness/page.tsx — Server Component (no 'use client')
import { Container } from '@/components/layout/Container';
import InfographicGrid from '@/components/awareness/InfographicGrid';
import AccordionSection from '@/components/awareness/AccordionSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AMR Awareness Hub | GGHN STARR',
  description: 'Learn about antimicrobial resistance in Africa through infographics and explainer articles.',
};

const infographics = [
  {
    src: '/infographics/IMG_9750.jpeg',
    title: 'AMR Surveillance in Rwanda',
    description: 'Fleming Fund Rwanda — surveillance findings from national laboratories.',
  },
  {
    src: '/infographics/IMG_9751.jpeg',
    title: 'Resistant Pathogens Detected',
    description: 'Key resistant organisms identified through Rwanda AMR surveillance, 2024.',
  },
  {
    src: '/infographics/IMG_9752.jpeg',
    title: 'One Health AMR Response',
    description: 'Human-animal-environment linkages in Rwanda national AMR action plan.',
  },
];

export default function AwarenessPage() {
  return (
    <Container className="py-12">
      <h1 ...>AMR Awareness Hub</h1>
      <InfographicGrid infographics={infographics} />
      <AccordionSection />
    </Container>
  );
}
```

### Pattern 2: Lightbox with yet-another-react-lightbox

The library requires `'use client'` because it uses `useState`. Import the CSS at the component level (not globally) to keep it scoped.

```typescript
// app/components/awareness/InfographicGrid.tsx
'use client';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Infographic {
  src: string;
  title: string;
  description: string;
}

export default function InfographicGrid({ infographics }: { infographics: Infographic[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = infographics.map(i => ({ src: i.src, alt: i.title }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {infographics.map((infographic, i) => (
          <button
            key={infographic.src}
            onClick={() => { setIndex(i); setOpen(true); }}
            className="group text-left bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200"
          >
            <img
              src={infographic.src}
              alt={infographic.title}
              className="w-full aspect-video object-cover group-hover:opacity-90 transition-opacity"
            />
            <div className="p-4">
              <h3 className="font-serif text-navy-950 font-bold text-sm mb-1">{infographic.title}</h3>
              <p className="text-xs text-slate-600">{infographic.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
      />
    </>
  );
}
```

**Key note:** `images: { unoptimized: true }` is already set in `next.config.js`. The lightbox uses plain `<img>` internally by default, which is correct for this project — do not use the Next.js Image render override, as it requires server-based optimization.

### Pattern 3: Accordion with useState (Tailwind max-height transition)

Native `<details>` cannot animate height smoothly in Tailwind v4. Use controlled state with `max-h` transition instead.

```typescript
// app/components/awareness/AccordionSection.tsx
'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;  // allows inline <a> links for fact sheet downloads
}

export default function AccordionSection({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.title} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left font-serif font-bold text-navy-950 hover:bg-slate-50 transition-colors"
            aria-expanded={openIndex === i}
          >
            <span>{item.title}</span>
            <ChevronDown
              size={18}
              className={`text-teal-600 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-[600px]' : 'max-h-0'}`}>
            <div className="px-6 pb-6 text-slate-700 leading-relaxed space-y-3">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Pattern 4: Education Tab Filter (mirrors BriefGrid pattern)

```typescript
// app/components/education/EducationGrid.tsx
'use client';
import { useState } from 'react';
import { FileText, Download, Play, ExternalLink } from 'lucide-react';
import type { EducationResource } from '@/lib/types';

type Audience = 'All' | 'Policymaker' | 'Healthcare Worker' | 'General Public';
const TABS: Audience[] = ['All', 'Policymaker', 'Healthcare Worker', 'General Public'];

const FORMAT_ICONS = {
  Article: FileText,
  Download: Download,
  Video: Play,
};

export default function EducationGrid({ resources }: { resources: EducationResource[] }) {
  const [activeTab, setActiveTab] = useState<Audience>('All');

  const filtered = activeTab === 'All'
    ? resources
    : resources.filter(r => r.audiences.includes(activeTab));

  return (
    <div>
      {/* Tab bar — pill style matching ExpertCard specialty tags aesthetic */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(resource => {
          const FormatIcon = FORMAT_ICONS[resource.format];
          return (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex flex-col hover:border-teal-300 transition-colors group"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                <FormatIcon size={13} />
                <span>{resource.format}</span>
                <span className="ml-auto text-slate-400">{resource.source}</span>
              </div>
              <h3 className="font-serif text-navy-950 font-bold text-sm mb-3 group-hover:text-teal-600 transition-colors leading-snug flex-grow">
                {resource.title}
              </h3>
              <div className="flex flex-wrap gap-1 mt-auto">
                {resource.audiences.map(audience => (
                  <span key={audience} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                    {audience}
                  </span>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
```

### Pattern 5: EducationResource Type (add to types.ts)

```typescript
// Add to app/lib/types.ts
export type AudienceType = 'Policymaker' | 'Healthcare Worker' | 'General Public';
export type ResourceFormat = 'Article' | 'Download' | 'Video';

export interface EducationResource {
  title: string;
  audiences: AudienceType[];   // multi-audience cards appear under all matching tabs
  format: ResourceFormat;
  source: string;              // e.g. "WHO", "Africa CDC", "PubMed"
  url: string;                 // external link, opens in new tab
}
```

### Anti-Patterns to Avoid

- **Server Component calling `fs.readFileSync` for page-local data:** For education resources and infographic metadata that only this page uses, inline the data as typed constants in the page file — no JSON file needed.
- **Using Next.js `<Image>` inside the lightbox:** `next.config.js` has `images: { unoptimized: true }`. The lightbox's default `<img>` rendering is correct. Adding a custom Next.js Image render override adds complexity with no benefit here.
- **Importing `yet-another-react-lightbox/styles.css` in `globals.css`:** Import it inside the client component that uses the lightbox to keep the style scoped and avoid polluting global CSS.
- **Hardcoding accordion content as JSX in the component:** Pass content as data (structured objects) from the server page into the accordion client component, maintaining the server/client split.
- **`'use client'` on the page file:** Keep `/awareness/page.tsx` and `/education/page.tsx` as Server Components. Push `'use client'` down to the interactive child components only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lightbox for images | Custom modal overlay + keyboard handler | `yet-another-react-lightbox` | Missing: keyboard navigation (Escape, arrow keys), focus trap, body scroll lock, swipe on mobile, ARIA roles — all built in |
| Tab filter state | Custom context or URL params | `useState` in client component | Simple enough; URL state is only needed if back-button filter retention is required (it is not — deferred) |
| Accordion animation | CSS `height: auto` transition | `max-h-[600px]` Tailwind transition trick | CSS cannot animate to `height: auto`; `max-h` with a generous cap is the standard Tailwind workaround |

**Key insight:** The lightbox is the only genuinely complex UI element here. Everything else (accordion toggle, tab filter) is a few lines of `useState`. The risk is in the lightbox — don't hand-roll it.

---

## Common Pitfalls

### Pitfall 1: Lightbox CSS not loading in static export

**What goes wrong:** The lightbox renders but is unstyled — backdrop is missing, images are not centered, controls are invisible.
**Why it happens:** `yet-another-react-lightbox/styles.css` must be explicitly imported. If the import is accidentally placed in a Server Component or forgotten, it fails silently.
**How to avoid:** Import `'yet-another-react-lightbox/styles.css'` at the top of `InfographicGrid.tsx` (the `'use client'` component that mounts the lightbox).
**Warning signs:** Lightbox opens but looks broken on first render.

### Pitfall 2: Multi-audience card duplication

**What goes wrong:** A resource tagged `['Policymaker', 'Healthcare Worker']` appears twice when "All" is selected.
**Why it happens:** Naive flatMap/filter logic that creates one entry per audience tag.
**How to avoid:** Filter by `resource.audiences.includes(activeTab)` for specific tabs; for "All", return the resource array unmodified (no deduplication needed since each resource is one object).

### Pitfall 3: AudienceCTAs disabled links not re-enabled

**What goes wrong:** `/awareness` and `/education` pages exist and work, but the homepage CTAs still render as disabled `<span>` elements.
**Why it happens:** `AudienceCTAs.tsx` hardcodes `live: false` for awareness and education links. Phase 8 must flip these to `live: true` with correct `href` values.
**How to avoid:** Update `AudienceCTAs.tsx` as part of Phase 8. Specifically:
  - "AMR Awareness Hub" links → `href: '/awareness'`, `live: true`
  - "Explore Resources" (Healthcare Worker primary) → `href: '/education'`, `live: true`
  - "Learn What You Can Do" (General Public primary) → `href: '/awareness'`, `live: true`
**Warning signs:** Homepage CTAs still greyed out after pages are deployed.

### Pitfall 4: Header nav not updated

**What goes wrong:** Pages are accessible by direct URL but not discoverable from navigation.
**Why it happens:** `Header.tsx` has a hardcoded `navLinks` array. New pages don't auto-appear.
**How to avoid:** Add `{ href: '/awareness', label: 'Awareness' }` and `{ href: '/education', label: 'Education' }` to `navLinks` in `Header.tsx`.

### Pitfall 5: External resource links missing `rel="noopener noreferrer"`

**What goes wrong:** Security vulnerability — opened tab can manipulate `window.opener`.
**Why it happens:** `target="_blank"` without `rel` attribute.
**How to avoid:** Every external resource card link must use both `target="_blank"` and `rel="noopener noreferrer"`.

### Pitfall 6: Accordion max-height too small for long content

**What goes wrong:** Accordion content is clipped at the bottom.
**Why it happens:** `max-h-[600px]` (or similar cap) is less than the actual expanded content height.
**How to avoid:** Use a generous cap like `max-h-[2000px]` for accordion panels — the Tailwind max-h trick only needs the cap to exceed actual height; the transition feels natural regardless of the exact cap value.

---

## Code Examples

### Infographic data shape (inline in awareness/page.tsx)

```typescript
// Source: codebase pattern (content.ts) adapted for page-local data
const infographics = [
  {
    src: '/infographics/IMG_9750.jpeg',
    title: 'AMR Surveillance in Rwanda',
    description: 'Fleming Fund Rwanda surveillance findings from national laboratories.',
  },
  {
    src: '/infographics/IMG_9751.jpeg',
    title: 'Resistant Pathogens Detected',
    description: 'Key resistant organisms identified through Rwanda AMR surveillance, 2024.',
  },
  {
    src: '/infographics/IMG_9752.jpeg',
    title: 'One Health AMR Response',
    description: 'Human-animal-environment linkages in Rwanda national AMR action plan.',
  },
];
```

### Curated education resources — 12 verified real external URLs

All URLs verified as active and publicly accessible as of research date (2026-04-29).

```typescript
// Source: WHO, Africa CDC, PubMed official websites — verified during research
const educationResources: EducationResource[] = [
  // --- Policymaker (4 resources) ---
  {
    title: 'African Union Framework for Antimicrobial Resistance Control 2020–2025',
    audiences: ['Policymaker'],
    format: 'Download',
    source: 'Africa CDC',
    url: 'https://africacdc.org/download/african-union-framework-for-antimicrobial-resistance-control-2020-2025/',
  },
  {
    title: 'African Union AMR Landmark Report: Voicing African Priorities on the Active Pandemic',
    audiences: ['Policymaker'],
    format: 'Download',
    source: 'Africa CDC',
    url: 'https://africacdc.org/download/african-union-amr-landmark-report-voicing-african-priorities-on-the-active-pandemic/',
  },
  {
    title: 'Global Antibiotic Resistance Surveillance Report 2025',
    audiences: ['Policymaker', 'Healthcare Worker'],
    format: 'Article',
    source: 'WHO',
    url: 'https://www.who.int/publications/i/item/9789240116337',
  },
  {
    title: 'Implementing the Global Action Plan on Antimicrobial Resistance',
    audiences: ['Policymaker'],
    format: 'Download',
    source: 'WOAH / WHO',
    url: 'https://www.woah.org/app/uploads/2024/01/implementing-the-global-action-plan-on-antimicrobial-resistance.pdf',
  },
  // --- Healthcare Worker (4 resources) ---
  {
    title: 'AMR Surveillance Guidance for the African Region',
    audiences: ['Healthcare Worker', 'Policymaker'],
    format: 'Download',
    source: 'Africa CDC',
    url: 'https://africacdc.org/download/antimicrobial-resistance-surveillance-guidance-for-the-african-region/',
  },
  {
    title: 'Knowledge, Attitudes and Practices on AMR Among Pharmacy Workers in 28 African Countries',
    audiences: ['Healthcare Worker'],
    format: 'Article',
    source: 'Africa Health Knowledge Hub',
    url: 'https://khub.africacdc.org/records/resource?id=152',
  },
  {
    title: 'Antimicrobial Stewardship in Africa: Policy Analysis Across Five Countries',
    audiences: ['Healthcare Worker', 'Policymaker'],
    format: 'Article',
    source: 'Cambridge / ASH&E',
    url: 'https://www.cambridge.org/core/journals/antimicrobial-stewardship-and-healthcare-epidemiology/article/antimicrobial-stewardship-in-africa-a-policy-analysis-of-national-action-plans-across-five-african-countries/EC7184C836CDF3B8F56DC6DA3A6ABC02',
  },
  {
    title: 'Combating AMR in Africa: Strategic Roadmap for Surveillance, Stewardship, and Research',
    audiences: ['Healthcare Worker', 'Policymaker'],
    format: 'Article',
    source: 'Frontiers',
    url: 'https://www.frontiersin.org/journals/cellular-and-infection-microbiology/articles/10.3389/fcimb.2025.1714021/full',
  },
  // --- General Public (4 resources) ---
  {
    title: 'Antimicrobial Resistance — WHO Fact Sheet',
    audiences: ['General Public', 'Healthcare Worker'],
    format: 'Article',
    source: 'WHO',
    url: 'https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance',
  },
  {
    title: 'World AMR Awareness Week 2024: Educate. Advocate. Act Now.',
    audiences: ['General Public'],
    format: 'Article',
    source: 'WHO',
    url: 'https://www.who.int/campaigns/world-amr-awareness-week/2024',
  },
  {
    title: 'Enhancing General Public Knowledge of AMR in Africa: A Video-Based Educational Review',
    audiences: ['General Public'],
    format: 'Article',
    source: 'PubMed / JAC-AMR',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11775625/',
  },
  {
    title: 'Global Call to Action to Address Antimicrobial Resistance (October 2025)',
    audiences: ['General Public', 'Policymaker'],
    format: 'Download',
    source: 'WHO',
    url: 'https://cdn.who.int/media/docs/default-source/antimicrobial-resistance/amr-gcp-asa/global-call-to-action-to-address-amr---oct-2025.pdf',
  },
];
```

### AMR accordion content (real text — "What is AMR")

```typescript
// Source: WHO AMR Fact Sheet (https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance)
// Paraphrased for general audience readability
const WHAT_IS_AMR_CONTENT = `
Antimicrobial resistance (AMR) occurs when bacteria, viruses, fungi and parasites evolve in response 
to the use of medicines, making standard treatments ineffective. When infections can no longer be treated 
by first-line medicines, the risk of disease spread, severe illness, and death increases.

AMR is not a future threat — it is happening now. The WHO estimates that bacterial AMR was directly 
responsible for 1.27 million deaths globally in 2019, and contributed to an additional 4.95 million deaths. 
Without action, AMR could cause up to 10 million deaths annually by 2050, surpassing cancer as a leading 
cause of preventable death.

The primary driver of AMR is the misuse and overuse of antimicrobials in humans, animals, and agriculture. 
Poor infection prevention, lack of clean water and sanitation, and inadequate surveillance systems all 
accelerate its spread. Fighting AMR requires a coordinated One Health approach that links human, animal, 
and environmental health systems.
`;
```

### AMR accordion content (real text — "Why Africa")

```typescript
// Source: Africa CDC AMR Landmark Report 2024, WHO AFRO reporting
const WHY_AFRICA_CONTENT = `
Africa carries a disproportionate burden of antimicrobial resistance. The continent accounts for a large 
share of global AMR-attributed deaths, driven by high infectious disease rates, limited diagnostic capacity, 
and incomplete National Action Plans. Sub-Saharan Africa has some of the highest rates of resistant 
organisms including carbapenem-resistant Enterobacterales and MRSA.

As of 2024, 45 of 47 WHO African Region countries have developed National Action Plans (NAPs) for AMR, 
but implementation gaps remain significant. Healthcare system fragility, underfunded laboratories, and 
weak surveillance infrastructure mean that resistant infections are often undetected and untreated 
appropriately — leading to worse patient outcomes and community spread.

The Fleming Fund, Africa CDC, and WHO AFRO have invested heavily in strengthening AMR surveillance across 
the continent. Rwanda's national laboratories — the source of the infographics on this page — represent 
a model for what sustained investment in data systems can achieve. Building on this foundation across 
African nations is the central goal of GGHN STARR's work.
`;
```

### AMR accordion content (real text — "What You Can Do")

```typescript
// Source: WHO WAAW 2024 "Educate. Advocate. Act Now." campaign guidance
const WHAT_YOU_CAN_DO_CONTENT = `
Everyone has a role in combating antimicrobial resistance — from individual behaviour to national policy.

For individuals: Only take antibiotics when prescribed by a certified health professional. Never share 
antibiotics or use leftover prescriptions. Complete the full course even if you feel better. Practice 
good hygiene — handwashing with soap and water reduces the transmission of resistant organisms that 
AMR treatments cannot easily clear.

For healthcare workers and policymakers: Champion antimicrobial stewardship programmes in your facility 
or ministry. Ensure your institution follows evidence-based prescribing guidelines. Support investment 
in diagnostic laboratories so that treatment decisions are driven by data, not guesswork. Advocate for 
AMR to be included in national health budgets as a core priority alongside communicable diseases.

For communities and advocates: Support public awareness campaigns during World AMR Awareness Week (18–24 
November each year). Share factual information about AMR risks with your networks. Engage with local 
health authorities on One Health initiatives that address AMR across human, animal, and environmental 
sectors together.
`;
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| BriefGrid uses `<select>` dropdowns for filtering | Education filter uses pill/tab buttons (confirmed in CONTEXT.md specifics) | Phase 8 decision | Pill tabs are more immediately visible than dropdowns for a small, fixed set of filter options |
| InfographicBlock opens image in new tab (`target="_blank"`) | /awareness opens image in lightbox | Phase 8 decision | Better UX — user stays on page; keyboard and swipe navigation included |
| Accordion typically built with `<details>/<summary>` | useState + max-h CSS transition | Phase 8 decision | Smooth animated open/close, consistent with Tailwind patterns |

**Note on existing filter pattern:** `BriefGrid.tsx` uses `<select>` dropdowns, not pill tabs. The pill/tab style for the education filter is a new pattern for this project. The pill shape does exist in `ExpertCard.tsx` specialty tags (`bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full`). The active tab style should use `bg-teal-600 text-white` (matching the brand CTA color) vs `bg-slate-100 text-slate-600` for inactive.

---

## Open Questions

1. **Infographic image titles/descriptions — confirm with project owner**
   - What we know: The 3 files are `IMG_9750.jpeg`, `IMG_9751.jpeg`, `IMG_9752.jpeg` — no metadata embedded in filenames
   - What's unclear: The exact subject matter of each JPEG (they were uploaded but not described in prior phases)
   - Recommendation: Planner should include a task step to view each JPEG and write accurate captions, OR use conservative placeholder titles that can be refined. The images are visible in the repo at `public/infographics/`.

2. **Fact sheet download files — where do they live?**
   - What we know: Accordion sections link to "relevant fact sheets as downloadable resources inside each accordion section" (CONTEXT.md)
   - What's unclear: Are these external WHO/CDC fact sheet PDFs (URLs) or internal `public/` files? No internal fact sheet PDFs exist in `public/` currently.
   - Recommendation: Use external WHO URLs (verified above) for fact sheet links — no new files to upload. Specifically: WHO AMR Fact Sheet PDF at `https://www.who.int/docs/default-source/antimicrobial-resistance/amr-factsheet.pdf` and the AMR Resource Pack 2025 at `https://cdn.who.int/media/docs/default-source/antimicrobial-resistance/amr-spc-npm/nap-support-tools/amr-resource-pack-2025.pdf`.

3. **`yet-another-react-lightbox` exact version pinning**
   - What we know: Latest is ~3.31.0, React 19 compatible, actively maintained
   - What's unclear: Minor API changes between patch versions are unlikely but possible
   - Recommendation: Install with `npm install yet-another-react-lightbox` (latest) and pin the resolved version in package-lock.json; do not manually specify a patch version.

---

## Sources

### Primary (HIGH confidence)
- Codebase direct inspection (`app/lib/types.ts`, `app/components/briefs/BriefGrid.tsx`, `app/components/layout/Header.tsx`, `app/components/sections/AudienceCTAs.tsx`, `next.config.js`, `app/globals.css`) — all patterns verified by reading actual source files
- `public/infographics/` directory listing — confirmed 3 JPEGs exist: IMG_9750.jpeg, IMG_9751.jpeg, IMG_9752.jpeg
- `package.json` — confirmed Next.js 16.2.1, React 19.2.4, Tailwind 4, lucide-react 1.6.0, no existing lightbox library

### Secondary (MEDIUM confidence)
- [yet-another-react-lightbox documentation](https://yet-another-react-lightbox.com/documentation) — confirmed client-side only, `open`/`close`/`slides` API, CSS import requirement; React 19 compatibility stated on npm page
- [yet-another-react-lightbox Next.js example](https://yet-another-react-lightbox.com/examples/nextjs) — `next/dynamic` recommendation and `NextJsImage` pattern documented; using plain `<img>` (not `next/image`) is the correct choice for this static export project
- [WHO AMR Fact Sheet](https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance) — content basis for accordion text
- [Africa CDC AMR resources](https://africacdc.org/resources/) — resource card URLs verified
- [WHO Global Antibiotic Resistance Surveillance Report 2025](https://www.who.int/publications/i/item/9789240116337) — resource card URL verified
- [WHO Global Call to Action PDF (Oct 2025)](https://cdn.who.int/media/docs/default-source/antimicrobial-resistance/amr-gcp-asa/global-call-to-action-to-address-amr---oct-2025.pdf) — resource card URL verified
- [Africa CDC AMR Landmark Report](https://africacdc.org/download/african-union-amr-landmark-report-voicing-african-priorities-on-the-active-pandemic/) — resource card URL verified
- [PubMed AMR public education review (2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11775625/) — resource card URL verified
- [WHO World AMR Awareness Week 2024](https://www.who.int/campaigns/world-amr-awareness-week/2024) — resource card URL and accordion content verified

### Tertiary (LOW confidence — not critical to implementation)
- WebSearch results on AMR stewardship reviews — used for sourcing accordion content tone; not load-bearing for implementation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all existing libraries inspected from package.json; yarl verified via official docs
- Architecture: HIGH — direct codebase pattern replication from BriefGrid/BriefsPage; no speculation
- Pitfalls: HIGH — derived from direct code inspection (AudienceCTAs disabled state, Header navLinks hardcoding, lightbox CSS requirement)
- Education resource URLs: MEDIUM — URLs verified as resolving to correct content during research; external URLs can change

**Research date:** 2026-04-29
**Valid until:** 2026-05-29 (stable stack; yarl releases frequently but API is stable)
