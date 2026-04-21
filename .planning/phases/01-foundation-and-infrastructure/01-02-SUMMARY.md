---
phase: 01-foundation-and-infrastructure
plan: 02
subsystem: data-layer
tags: [typescript, json, content-layer, static-data, interfaces]

# Dependency graph
requires:
  - 01-01 (Next.js project scaffold, tsconfig, build system)
provides:
  - Brief, Expert, SiteContent TypeScript interfaces (all fields locked)
  - getAllBriefs(), getBriefBySlug(), getExperts(), getSiteContent() build-time functions
  - 3 seeded policy briefs in content/briefs-index.json
  - 2 expert records in content/experts.json
  - Site config in content/site.json
  - Static asset placeholder directories in public/
affects:
  - 02-01 (homepage consumes getSiteContent, getAllBriefs)
  - 02-02 (briefs listing page consumes getAllBriefs)
  - 03-01 (brief detail page consumes getBriefBySlug)
  - 04-01 (experts page consumes getExperts)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Build-time JSON reads via fs.readFileSync + process.cwd() — safe for Next.js static export"
    - "Content directory at project root (content/), separate from app/ and public/"
    - "authorId cross-reference pattern: Brief.authorId references Expert.id"
    - "TypeScript cast pattern: JSON.parse(raw) as Type[] for content functions"

key-files:
  created:
    - app/lib/types.ts
    - app/lib/content.ts
    - content/briefs-index.json
    - content/experts.json
    - content/site.json
    - public/briefs/.gitkeep
    - public/infographics/.gitkeep
    - public/images/experts/.gitkeep
    - public/images/partners/.gitkeep
    - public/images/thumbnails/.gitkeep
  modified: []

key-decisions:
  - "fs.readFileSync with process.cwd() for JSON reads — correct for Next.js static export build server; dynamic import() has different resolution behavior"
  - "content/ directory at project root (not inside app/) — keeps data files separate from framework files and makes cross-referencing simpler"
  - "Brief interface fields locked — all 12 fields mandated by user decision in CONTEXT.md; no additions or renames"

requirements-completed: [FOUN-02]

# Metrics
duration: 4min
completed: 2026-03-25
---

# Phase 1 Plan 02: Content Data Layer Summary

**TypeScript interfaces for Brief (12 locked fields), Expert, and SiteContent with build-time fs.readFileSync content functions and three JSON seed files covering AMR governance, lab systems, and predictive analytics briefs**

## Performance

- **Duration:** 4 minutes
- **Started:** 2026-03-25T20:48:37Z
- **Completed:** 2026-03-25T20:52:39Z
- **Tasks:** 2 auto tasks
- **Files created:** 10

## Accomplishments

- `app/lib/types.ts`: Brief interface with all 12 user-locked fields, Expert interface (id, name, title, organization, bio, photoUrl, specialties, optional linkedinUrl), SiteContent interface (siteTitle, tagline, conferenceDate, conferenceLocation, partners array, contactEmail, optional linkedinUrl, footerTagline)
- `app/lib/content.ts`: four exported functions — getAllBriefs() (sorted ascending by weekNumber), getBriefBySlug(slug), getExperts(), getSiteContent() — all reading from content/ via fs.readFileSync at build time
- `content/briefs-index.json`: 3 seeded briefs (weeks 1-3) covering Governance/Stewardship, Laboratory Systems/One Health, and Predictive Analytics themes
- `content/experts.json`: 2 expert records with IDs matching all authorId references in briefs
- `content/site.json`: site config with tagline "Evidence. Advocacy. Action.", 4 partners (GGHN, Fleming Fund, Africa CDC, WHO AFRO), conference details, contact email
- `public/` subdirectory structure: placeholder .gitkeep files in briefs/, infographics/, images/experts/, images/partners/, images/thumbnails/

## Task Commits

Each task was committed atomically:

1. **Task 1: TypeScript interfaces and content functions** - `828d452` (feat)
2. **Task 2: JSON seed data and placeholder directories** - `6d8b64c` (feat)

**Plan metadata:** (committed after SUMMARY creation)

## Files Created/Modified

- `app/lib/types.ts` - Brief (12 locked fields), Expert, SiteContent TypeScript interfaces
- `app/lib/content.ts` - getAllBriefs, getBriefBySlug, getExperts, getSiteContent functions
- `content/briefs-index.json` - 3 policy brief records (weeks 1-3, all 12 required fields each)
- `content/experts.json` - 2 expert records (olawale-oladipo, amina-ibrahim)
- `content/site.json` - site-wide content (tagline, partners, conferenceDate, contactEmail)
- `public/briefs/.gitkeep` - placeholder for PDF brief files
- `public/infographics/.gitkeep` - placeholder for infographic PDF files
- `public/images/experts/.gitkeep` - placeholder for expert photos
- `public/images/partners/.gitkeep` - placeholder for partner logos
- `public/images/thumbnails/.gitkeep` - placeholder for brief thumbnail images

## Decisions Made

- **fs.readFileSync with process.cwd():** Chosen over `import()` or `require()` because dynamic imports have different module resolution behavior in Next.js static export. process.cwd() returns the project root during `next build`, making the content/ path reliable.
- **Content directory at project root:** Placing content/ alongside app/ (not inside it) keeps data files out of the Next.js framework directory and makes the data architecture clear.
- **Brief fields locked exactly as specified:** All 12 fields in the Brief interface match the CONTEXT.md user decision exactly — no additions, removals, or renames made.

## Deviations from Plan

None - plan executed exactly as written. Both TypeScript compilation and npm run build passed on first attempt.

## Self-Check: PASSED

- FOUND: app/lib/types.ts
- FOUND: app/lib/content.ts
- FOUND: content/briefs-index.json
- FOUND: content/experts.json
- FOUND: content/site.json
- FOUND: public/briefs/.gitkeep
- FOUND: public/infographics/.gitkeep
- FOUND: public/images/experts/.gitkeep
- FOUND: public/images/partners/.gitkeep
- FOUND: public/images/thumbnails/.gitkeep
- FOUND commit: 828d452 (Task 1 - TypeScript interfaces and content functions)
- FOUND commit: 6d8b64c (Task 2 - JSON seed data and placeholder directories)
- TypeScript: no errors (npx tsc --noEmit passed)
- npm run build: passed, 4 static pages generated
- Brief count: 3 (verified via node -e)
- All 12 locked fields: present in all 3 briefs
- authorId cross-references: all match expert IDs

---
*Phase: 01-foundation-and-infrastructure*
*Completed: 2026-03-25*
