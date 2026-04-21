---
phase: 01-foundation-and-infrastructure
plan: 01
subsystem: infra
tags: [next.js, tailwind-v4, git-lfs, vercel, typescript, static-export, postcss]

# Dependency graph
requires: []
provides:
  - Git LFS tracking for binary assets (pdf, jpg, png) via .gitattributes
  - Next.js 16.2.1 project with TypeScript, App Router, static export
  - Tailwind v4 CSS-first config with Navy/Teal brand tokens and system fonts
  - Dark mode via @custom-variant (class-based toggle)
  - Static HTML output in out/ directory via next build
affects:
  - 01-02 (component library, navigation, footer)
  - 01-03 (page templates use brand tokens)
  - All subsequent phases (inherit brand config, build system)

# Tech tracking
tech-stack:
  added:
    - next@16.2.1
    - react@19.2.4
    - react-dom@19.2.4
    - tailwindcss@4.2.2
    - "@tailwindcss/postcss@4.2.2"
    - clsx@2.1.1
    - tailwind-merge@3.5.0
    - lucide-react@1.6.0
    - typescript@5
    - eslint@9
    - eslint-config-next@16.2.1
    - git-lfs@3.5.1 (system)
  patterns:
    - "CSS-first Tailwind config: all theme tokens in globals.css @theme block, no tailwind.config.js"
    - "Static export: output='export' in next.config.js, images.unoptimized=true"
    - "Dark mode: @custom-variant dark variant, .dark class toggled on <html> client-side"
    - "suppressHydrationWarning on <html> to prevent React mismatch from dark mode class toggle"
    - "Git LFS: binary assets tracked via .gitattributes before any binaries committed"

key-files:
  created:
    - .gitattributes
    - next.config.js
    - postcss.config.mjs
    - package.json
    - tsconfig.json
    - eslint.config.mjs
    - app/globals.css
    - app/layout.tsx
    - app/page.tsx
    - app/favicon.ico
    - public/
  modified: []

key-decisions:
  - "Use Tailwind v4 CSS-first config exclusively: @theme in globals.css, no tailwind.config.js - avoids v3/v4 hybrid anti-pattern"
  - "Static export (output: 'export') with images.unoptimized: true - required for Vercel static hosting without server"
  - "Dark mode via @custom-variant dark instead of tailwind.config darkMode: 'class' - v4 requires new approach"
  - "System font stacks only (no Google Fonts) - hard requirement for bandwidth-constrained African users"
  - "turbopack.root: __dirname in next.config.js - fixes workspace root detection when multiple lockfiles exist"
  - "Scaffold in temp directory and copy files - create-next-app refuses in-place scaffold with existing files"

patterns-established:
  - "PostCSS v4 pattern: postcss.config.mjs uses @tailwindcss/postcss (NOT tailwindcss which is v3-only)"
  - "Brand tokens defined as CSS custom properties in @theme block at globals.css top level"
  - "Root layout imports globals.css, sets suppressHydrationWarning, applies base body classes"

requirements-completed: [FOUN-04, FOUN-01]

# Metrics
duration: 11min
completed: 2026-03-25
---

# Phase 1 Plan 01: Foundation & Infrastructure Summary

**Next.js 16 static export with Tailwind v4 CSS-first brand tokens (Navy/Teal palette, system fonts, dark mode), Git LFS binary tracking, and Vercel deployment (pending user setup)**

## Performance

- **Duration:** 11 minutes
- **Started:** 2026-03-25T20:32:14Z
- **Completed:** 2026-03-25T20:43:00Z
- **Tasks:** 2 auto tasks (Vercel connection requires user action - see User Setup Required)
- **Files modified:** 18

## Accomplishments

- Git LFS initialized and configured with .gitattributes tracking *.pdf, *.jpg, *.png before any binary files committed
- Next.js 16.2.1 scaffolded with TypeScript, App Router, ESLint - npm run build produces out/ directory with no errors
- Tailwind v4.2.2 configured CSS-first: brand tokens (Navy/Teal palette), system fonts, dark mode @custom-variant all in globals.css - no tailwind.config.js

## Task Commits

Each task was committed atomically:

1. **Task 1: Configure Git LFS for binary assets** - `b3e9510` (chore)
2. **Task 2: Scaffold Next.js 16 with Tailwind v4 static export** - `fb6ce30` (feat)

**Plan metadata:** (committed after SUMMARY creation)

## Files Created/Modified

- `.gitattributes` - Git LFS tracking rules for *.pdf, *.jpg, *.png
- `next.config.js` - Static export config with output:'export', images.unoptimized:true, turbopack.root
- `postcss.config.mjs` - Tailwind v4 PostCSS integration via @tailwindcss/postcss plugin
- `package.json` - Project dependencies (next, react, tailwindcss, clsx, tailwind-merge, lucide-react)
- `tsconfig.json` - TypeScript config with @/* import alias
- `eslint.config.mjs` - ESLint config for Next.js
- `app/globals.css` - Brand tokens (@theme), system fonts, dark mode @custom-variant
- `app/layout.tsx` - Root layout with metadata, suppressHydrationWarning, base body classes
- `app/page.tsx` - Minimal placeholder home page
- `app/favicon.ico` - Default Next.js favicon (to be replaced)
- `public/` - Static SVG assets from scaffold

## Decisions Made

- **Tailwind v4 CSS-first pattern:** All theme configuration in globals.css @theme block. No tailwind.config.js created. This is the v4-idiomatic approach and avoids the v3/v4 hybrid anti-pattern.
- **@tailwindcss/postcss plugin:** Tailwind v4 requires this plugin in postcss.config.mjs, not the legacy `tailwindcss` plugin name. Using wrong name causes silently broken styling.
- **turbopack.root:** Added to next.config.js to fix workspace root detection warning caused by multiple package-lock.json files on this system.
- **System fonts only:** --font-sans and --font-serif use OS font stacks. No external font loading (hard requirement for bandwidth-constrained users in Africa).
- **Dark mode @custom-variant:** Tailwind v4 requires `@custom-variant dark (&:where(.dark, .dark *))` in CSS; the v3 `darkMode: 'class'` config option has no effect in v4.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced scaffold page.tsx with minimal placeholder**
- **Found during:** Task 2 (build verification)
- **Issue:** Scaffolded page.tsx imported page.module.css which was not copied (file omitted from scaffold copy), causing build to fail with "Module not found"
- **Fix:** Replaced page.tsx with a minimal functional placeholder using Tailwind classes
- **Files modified:** app/page.tsx
- **Verification:** npm run build completed successfully, out/ directory created
- **Committed in:** fb6ce30 (Task 2 commit)

**2. [Rule 2 - Missing Critical] Added turbopack.root to next.config.js**
- **Found during:** Task 2 (build verification)
- **Issue:** Build emitted workspace root detection warning due to multiple lockfiles on the system. Next.js 16 Turbopack requires explicit root configuration in this scenario.
- **Fix:** Added `turbopack: { root: __dirname }` to next.config.js
- **Files modified:** next.config.js
- **Verification:** Subsequent build ran without workspace warning
- **Committed in:** fb6ce30 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical config)
**Impact on plan:** Both fixes required for correct operation. No scope creep - page.tsx placeholder aligns with plan intent (content added in later plans).

## Issues Encountered

- `create-next-app` refused in-place scaffold because existing files (.planning/, docs) conflict. Resolved by scaffolding to /tmp/starr-scaffold then copying files to project root. This is standard behavior; the scaffold still produces identical output.

## User Setup Required

**Vercel deployment requires manual browser configuration.** To complete the Vercel connection (Task 2, Step H):

1. Push to GitHub main branch:
   ```bash
   git push origin main
   ```
   (Note: current branch is `master` - you may need to push to `main` or rename the branch)

2. Go to https://vercel.com/new and import the GitHub repository

3. Leave all defaults - Vercel auto-detects Next.js

4. After first deploy completes, go to Project Settings > Git > "Ignored Build Step" and add:
   ```
   if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then exit 1 ; else exit 0 ; fi
   ```

5. Go to Project Settings > Environment Variables and add:
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://your-project.vercel.app` (use actual subdomain Vercel assigned)
   - Environment: Production

6. Trigger a redeploy to apply the env var.

7. Record the Vercel URL in `.planning/STATE.md` under a "Deployment" section.

## Next Phase Readiness

- Build system is ready: `npm run build` produces clean static output
- Brand tokens established in globals.css - all subsequent UI work uses these CSS variables
- Git LFS in place - binary assets (PDFs, images) can now be committed safely
- Vercel deployment pending user setup (above)
- Plan 02 (component library) can start immediately - does not depend on Vercel being live

## Self-Check: PASSED

- FOUND: .gitattributes
- FOUND: next.config.js
- FOUND: postcss.config.mjs
- FOUND: app/globals.css
- FOUND: app/layout.tsx
- FOUND: out/ directory
- FOUND: out/index.html
- FOUND: 01-01-SUMMARY.md
- FOUND commit: b3e9510 (Task 1 - Git LFS)
- FOUND commit: fb6ce30 (Task 2 - Next.js scaffold)

---
*Phase: 01-foundation-and-infrastructure*
*Completed: 2026-03-25*
