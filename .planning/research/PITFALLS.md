# Domain Pitfalls

**Domain:** Next.js static export policy brief website for non-technical content authors
**Researched:** 2026-03-23
**Overall confidence:** HIGH (verified against Next.js 16.x official docs)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken deployments, or workflow abandonment.

### Pitfall 1: Default Image Loader Breaks Static Export

**What goes wrong:** Using `next/image` without configuring a custom loader causes the build to fail with `output: 'export'`. The default loader requires a Node.js server for on-the-fly image optimization, which does not exist in a static export.

**Why it happens:** Developers add `<Image>` components expecting them to "just work" as they do in standard Next.js deployments on Vercel. The static export mode explicitly lists Image Optimization with the default loader as an unsupported feature.

**Consequences:** Build fails entirely. No deployment possible until every `<Image>` usage is fixed.

**Prevention:**
- Set `images: { unoptimized: true }` in `next.config.js` for simplest path. This outputs standard `<img>` tags with no server-side optimization.
- Alternatively, configure `images: { loader: 'custom', loaderFile: './image-loader.ts' }` if using a CDN like Cloudinary or imgix.
- For this project, `unoptimized: true` is the right call -- the image count is small (expert photos, infographics, logos) and manual optimization before commit is sufficient.
- Pre-optimize images at commit time: compress PNGs/JPEGs with a build script, serve WebP where possible.

**Detection:** Build failure with error mentioning image optimization. Catch this in Phase 1 by configuring `next.config.js` before writing any components.

**Source:** [Next.js Static Exports docs](https://nextjs.org/docs/app/guides/static-exports) -- "Image Optimization with the default loader" listed under Unsupported Features. Verified 2026-03-23.

---

### Pitfall 2: Dynamic Routes Without `generateStaticParams` Silently Fail

**What goes wrong:** Creating a dynamic route like `app/briefs/[slug]/page.tsx` without exporting `generateStaticParams()` causes the static export build to error. Next.js cannot know which pages to pre-render without an explicit list of params.

**Why it happens:** In standard Next.js (server mode), dynamic routes work at request time. Developers forget that static export requires every possible route to be enumerated at build time.

**Consequences:** Build fails. If `dynamicParams: true` is set (even accidentally as default), the build also fails because static export cannot handle fallback rendering.

**Prevention:**
- Every dynamic route MUST export `generateStaticParams()` that returns all valid params.
- Explicitly set `export const dynamicParams = false` in the dynamic route layout or page to signal no fallback.
- For this project: `generateStaticParams` should read the briefs JSON data file and return all slugs. When a new brief is added to the data file, it automatically gets a generated page on next build.

**Detection:** Build failure with clear error. But the subtle trap is forgetting to add `dynamicParams = false`, which causes confusing errors about dynamic rendering.

**Source:** [Next.js Static Exports docs](https://nextjs.org/docs/app/guides/static-exports) -- "Dynamic Routes without generateStaticParams()" and "Dynamic Routes with dynamicParams: true" both listed as unsupported.

---

### Pitfall 3: Non-Developer Content Workflow Becomes a Bottleneck

**What goes wrong:** The content addition process is designed for developers (edit JSON, commit, push, wait for build) but the actual users are policy researchers who do not use Git or code editors. Within 2-3 weeks, content updates stall because the non-technical team cannot add briefs independently.

**Why it happens:** The developer builds the system, adds the first 2-3 briefs themselves, and assumes the workflow is "simple enough." But for a non-developer, even editing a JSON file in GitHub's web UI involves: navigating a repo structure, finding the right file, editing valid JSON syntax (one missing comma breaks the build), committing with a message, and waiting for deployment. Each step is a failure point.

**Consequences:** The developer becomes the bottleneck for all content updates. With weekly briefs from March-June 2026 and a hard deadline, this creates schedule risk. If the developer is unavailable for even one week, a brief is missed.

**Prevention:**
- Design the content format to be maximally forgiving. Use a single `briefs.json` array where each entry is a flat object (no nesting). Include a clearly commented template entry at the top.
- Create a step-by-step visual guide (screenshots) for adding a brief via GitHub web UI. Test it with an actual non-developer team member before launch.
- Consider a simple Google Form or Airtable that feeds into the repo via GitHub Actions -- the non-developer fills in metadata fields and uploads a PDF, and automation creates the commit. This adds complexity but eliminates JSON-editing errors.
- Validate `briefs.json` in the build pipeline so malformed JSON produces a clear, human-readable error message (not a cryptic stack trace).
- Keep PDF files in `/public/briefs/` with a strict naming convention (e.g., `brief-01-amr-governance.pdf`) documented in the content guide.

**Detection:** Ask a team member to add a test brief without developer help within the first week. If they cannot do it in under 10 minutes, the workflow needs simplification.

---

### Pitfall 4: PDF Files Bloat the Git Repository

**What goes wrong:** Each policy brief PDF is 1-5 MB. With 15 briefs plus infographic images, the repository grows to 50-100 MB. Git clones become slow, Vercel build times increase, and the repo becomes unwieldy.

**Why it happens:** Putting PDFs in `/public/` is the obvious path for static sites. Git tracks every version of every binary file, so even replacing a PDF doubles its storage cost in the repo history.

**Consequences:** Slow CI/CD builds (Vercel clones the repo on every deploy). Slow developer setup. Eventually hits Vercel's deployment size limits or GitHub's soft limits on repo size.

**Prevention:**
- For 15 briefs (March-June 2026), this is manageable -- total binary payload will be 30-75 MB, which is within Vercel's limits but not comfortable.
- Add PDFs to `.gitattributes` with Git LFS tracking: `*.pdf filter=lfs diff=lfs merge=lfs -text`. This keeps the repo lean while still versioning PDFs.
- Alternative: host PDFs on a separate CDN (Google Drive public links, Cloudflare R2, or even a dedicated Vercel Blob store) and link to them. This completely decouples binary assets from the code repo.
- For this project's scope (15 PDFs over 3 months), committing directly to `/public/briefs/` is acceptable if Git LFS is set up. The simpler path is worth the slight repo bloat given the tight deadline.

**Detection:** Monitor repo size after the 5th brief. If clone time exceeds 30 seconds, migrate to LFS or external hosting.

---

### Pitfall 5: Forgetting to Rebuild and Redeploy After Content Changes

**What goes wrong:** A non-developer adds a new brief's JSON entry and PDF file but does not understand that the site must be rebuilt and redeployed. They expect changes to appear immediately (like updating a Google Doc). The new brief never appears on the live site.

**Why it happens:** Static sites require a build step. There is no server watching for content changes. This is fundamentally different from CMS-based sites that non-technical users may be familiar with.

**Consequences:** Content appears stale. Team loses confidence in the platform. Briefs are published late.

**Prevention:**
- Set up Vercel's GitHub integration so that any push to `main` triggers an automatic rebuild and deploy. This is the single most important infrastructure decision for this project.
- If using GitHub web UI for edits, commits to `main` automatically trigger Vercel. No manual deploy step needed -- but the team must understand that changes take 1-3 minutes to appear (build time).
- Add a "Last updated" timestamp to the site footer that is generated at build time, so the team can verify their changes went live.
- Document the expected timeline: "After you save your changes on GitHub, the website will update within 3 minutes."

**Detection:** If the Vercel GitHub integration is not configured in Phase 1, this pitfall is guaranteed to occur.

---

## Moderate Pitfalls

### Pitfall 6: Formspree Contact Form Fails Silently on Static Sites

**What goes wrong:** The contact form appears to work but submissions are lost. Common causes: incorrect Formspree endpoint URL, CORS issues in development vs production, spam filter blocking legitimate submissions, or exceeding the free tier limit (50 submissions/month).

**Prevention:**
- Test the form on the deployed Vercel URL, not just localhost. Formspree endpoints may behave differently with different `Origin` headers.
- Set up Formspree email notifications to the team so they know submissions are arriving.
- Add a visible success/error state to the form UI so users know their submission went through.
- The free tier (50 submissions/month) should be sufficient for a niche policy audience, but monitor usage. If the site gets promoted at the Inter-Ministerial Conference, traffic could spike.
- Add a fallback: display a direct email address alongside the form so users have an alternative contact method.

**Detection:** Submit a test message on the production URL within 24 hours of deployment. Set a calendar reminder to test again monthly.

---

### Pitfall 7: Mobile Performance Degrades with Unoptimized Assets

**What goes wrong:** The site loads slowly on mobile devices in low-bandwidth African regions (2G/3G connections common among the target audience of traveling government officials). Large hero images, uncompressed infographics, and heavy JavaScript bundles make the site unusable.

**Prevention:**
- Set a performance budget: initial page load under 500 KB, largest contentful paint under 3 seconds on 3G.
- Compress all images before committing. Use WebP format with JPEG fallback. Target hero images at 80-120 KB max.
- Minimize client-side JavaScript. A static content site should ship almost zero JS beyond Next.js hydration. Avoid heavy UI libraries (no Framer Motion, no complex carousels).
- Use `loading="lazy"` on below-fold images (the brief cards grid, partner logos).
- PDF downloads are inherently large -- do not try to inline or preview them. A simple download link is better than an embedded PDF viewer.
- Test with Chrome DevTools throttled to "Slow 3G" before every deployment.

**Detection:** Run Lighthouse on the deployed URL. If Performance score drops below 85 on mobile, investigate immediately.

---

### Pitfall 8: Tailwind CSS Purge Misses Dynamic Class Names

**What goes wrong:** Tailwind's JIT compiler tree-shakes unused classes. If class names are constructed dynamically (e.g., `` `bg-${color}-500` ``), they get purged and styles break in production while working fine in development.

**Prevention:**
- Never construct Tailwind class names dynamically. Use complete class names: `bg-teal-500`, not `` `bg-${theme}-500` ``.
- If the brief cards need theme-based colors, use a mapping object: `const colorMap = { governance: 'bg-teal-600', health: 'bg-navy-800' }`.
- Ensure `tailwind.config.js` content paths include all files that use Tailwind classes: `content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx}']`.
- If using MDX for content, ensure MDX files are included in the content paths.

**Detection:** Visual regression on production that does not appear in `next dev`. Always check the deployed preview before merging.

---

### Pitfall 9: Using Unsupported Next.js Features Without Realizing It

**What goes wrong:** Developers use middleware, server actions, cookies, rewrites, redirects, headers config, or intercepting routes -- all of which are explicitly unsupported in static export mode. The build fails with opaque errors.

**Prevention:**
- Post a checklist of unsupported features in the project docs. Reference it before implementing any new feature.
- Unsupported features in static export (per official docs, verified 2026-03-23):
  - `dynamicParams: true`
  - Dynamic Routes without `generateStaticParams()`
  - Route Handlers that read from Request
  - `cookies()`
  - Rewrites in `next.config.js`
  - Redirects in `next.config.js`
  - Headers in `next.config.js`
  - Middleware / Proxy
  - Incremental Static Regeneration (ISR)
  - Image Optimization (default loader)
  - Draft Mode
  - Server Actions
  - Intercepting Routes
- For this project, none of these are needed. The risk is a developer reflexively reaching for them out of habit.

**Detection:** Set `export const dynamic = 'error'` in the root layout to make unsupported feature usage fail fast during development, not just at build time.

---

### Pitfall 10: Newsletter Signup Has No Backend

**What goes wrong:** The PROJECT.md mentions newsletter signup on the homepage, but a static site cannot process email subscriptions. Without planning the integration upfront, the signup form either does nothing or gets deferred indefinitely.

**Prevention:**
- Use a third-party newsletter service: Mailchimp embedded form, Buttondown, or a second Formspree form that forwards to a mailing list.
- Decide the newsletter provider in Phase 1. Mailchimp's free tier (500 contacts) is likely sufficient for this audience size.
- Alternatively, route newsletter signups through the same Formspree contact form with a hidden field marking them as "newsletter" -- simplest approach but requires manual list management.

**Detection:** If newsletter provider is not chosen by end of Phase 1, it will be cut from scope.

---

## Minor Pitfalls

### Pitfall 11: Trailing Slash Inconsistency Causes 404s

**What goes wrong:** Next.js static export generates either `/briefs/slug.html` or `/briefs/slug/index.html` depending on the `trailingSlash` config. If this does not match the hosting platform's expectations, internal links return 404.

**Prevention:**
- Vercel handles this automatically. But set `trailingSlash: false` explicitly in `next.config.js` to be deliberate rather than relying on defaults.
- If ever migrating off Vercel, the nginx/Apache config must match this setting.

**Detection:** Click every internal link on the deployed site after first deployment.

---

### Pitfall 12: JSON Content File Validation Errors Are Cryptic

**What goes wrong:** A non-developer adds a brief to `briefs.json` with a typo (missing comma, unclosed quote, wrong field name). The Vercel build fails with a JSON parse error that is meaningless to a non-technical user.

**Prevention:**
- Add a JSON schema validation step in the build pipeline (e.g., a pre-build script using `ajv` or a simple Node script).
- Produce human-readable error messages: "Brief #8 is missing a 'title' field" rather than "SyntaxError: Unexpected token at position 847."
- Consider using a TypeScript type for the brief data and validating with Zod at build time.
- Provide a JSON linter link in the content guide (jsonlint.com) and tell non-developers to paste their JSON there before committing.

**Detection:** Intentionally break the JSON file and verify the error message is understandable.

---

### Pitfall 13: Infographic Images Referenced but Not Committed

**What goes wrong:** A content author adds a brief entry referencing `infographic-08.jpg` in the JSON but forgets to upload the actual image file to the `/public/` directory. The site builds successfully but displays a broken image.

**Prevention:**
- Add a build-time validation script that checks every image path referenced in `briefs.json` exists in `/public/`.
- Use a fallback/placeholder image component so broken references show a branded placeholder instead of the browser's broken image icon.
- Document the file upload step prominently in the content guide: "You must upload BOTH the PDF and the infographic image."

**Detection:** Visual check after every content deployment. Automated link/image checking in CI.

---

### Pitfall 14: SEO and Social Sharing Metadata Missing

**What goes wrong:** Policy briefs are shared by government officials on WhatsApp, Twitter, and email. Without proper Open Graph and Twitter Card metadata, shared links show a generic title and no preview image -- reducing credibility and click-through.

**Prevention:**
- Generate per-page `<meta>` tags using Next.js `generateMetadata()` in each page/layout.
- Each brief page should have its own OG title, description, and image (the infographic makes an excellent OG image).
- Test with social media debuggers (Facebook Sharing Debugger, Twitter Card Validator) before the conference push.

**Detection:** Share a brief URL on WhatsApp and check the preview. Do this in Phase 2 when brief pages are built.

---

### Pitfall 15: Build Time Grows as Briefs Accumulate

**What goes wrong:** With 15 briefs and associated pages, build time grows. While unlikely to be a real problem at this scale, unnecessary computation in `generateStaticParams` or heavy data processing at build time can make deploys sluggish.

**Prevention:**
- Keep build logic simple. Read JSON, return params. No external API calls at build time.
- At 15 pages, build should complete in under 30 seconds. If it exceeds 60 seconds, investigate.

**Detection:** Monitor Vercel build logs. Set an alert if build exceeds 2 minutes.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Priority |
|-------------|---------------|------------|----------|
| Project setup / scaffolding | Image loader not configured (#1), unsupported features used (#9) | Configure `next.config.js` correctly from day 1: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: false` | CRITICAL |
| Content architecture | JSON editing too hard for non-devs (#3), cryptic validation errors (#12) | Design flat JSON schema, add build-time validation with human-readable errors, test with non-dev user | CRITICAL |
| Brief pages (dynamic routes) | Missing `generateStaticParams` (#2) | Implement `generateStaticParams` reading from `briefs.json`, set `dynamicParams = false` | CRITICAL |
| PDF management | Repo bloat (#4), missing files (#13) | Set up Git LFS or accept bloat for 15 files; add build-time file existence checks | MODERATE |
| Contact form | Formspree silent failures (#6), newsletter backend missing (#10) | Test on production URL, choose newsletter provider, add fallback email display | MODERATE |
| Performance optimization | Mobile degradation (#7), Tailwind purge (#8) | Set performance budget, compress images pre-commit, test on throttled 3G | MODERATE |
| Deployment & CI/CD | Forgot to redeploy (#5), trailing slash 404s (#11) | Vercel GitHub auto-deploy on push to main, explicit `trailingSlash` config | CRITICAL |
| Content go-live | SEO missing (#14), build time (#15) | Add `generateMetadata` per page, test social sharing previews | LOW |

---

## Sources

- [Next.js Static Exports official documentation](https://nextjs.org/docs/app/guides/static-exports) -- verified 2026-03-23, Next.js 16.2.1
- [Next.js Image Component API reference](https://nextjs.org/docs/app/api-reference/components/image) -- verified 2026-03-23
- Project context from `.planning/PROJECT.md` and repo file structure analysis
- Confidence: HIGH for Next.js-specific pitfalls (verified against current official docs). MEDIUM for workflow pitfalls (based on established patterns for non-developer content workflows on static sites, not verified against a specific source).
