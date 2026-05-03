# Phase 19: Brief Engagement — Giscus Commenting System on Brief Detail Pages - Research

**Researched:** 2026-05-03
**Domain:** Giscus (GitHub Discussions-powered commenting), Next.js App Router client components
**Confidence:** HIGH

## Summary

Giscus is a commenting system powered by GitHub Discussions. It works entirely client-side via an iframe, making it fully compatible with Next.js `output: 'export'` static sites. The `@giscus/react` package (v1.6.0, released Dec 31, 2024) provides a React component wrapper that avoids direct script-tag embedding and integrates naturally with the App Router's `'use client'` component model.

The integration pattern is straightforward: create a `GiscusComments` component file marked `'use client'`, import and render `<Giscus>` from `@giscus/react`, and insert it at the bottom of `/app/briefs/[slug]/page.tsx` after the current Prev/Next navigation. No dynamic import with `ssr: false` is strictly required because the page itself is a static export — there is no SSR runtime — but adding `'use client'` to the wrapper component is mandatory because the component accesses browser APIs at runtime.

The only prerequisite outside the codebase is a one-time GitHub repository setup: the gghnstarr GitHub repo must be public, have GitHub Discussions enabled, and have the giscus GitHub App installed. `repoId` and `categoryId` are obtained from the interactive configurator at https://giscus.app by entering the repo name. These IDs are static strings embedded in the component (or in `.env.local` for cleanliness). The site does not have dark mode toggling, so a fixed `theme="light"` is correct. There are no React 19 or Next.js 16 compatibility issues reported in the giscus-component issue tracker as of May 2026.

**Primary recommendation:** Install `@giscus/react`, create `/app/components/briefs/GiscusComments.tsx` with `'use client'`, configure it for the gghnstarr GitHub repo, and render it at the bottom of the brief detail page layout.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@giscus/react` | ^1.6.0 | React component wrapper for Giscus iframe | Official package; props update via postMessage without reload; no SSR issues |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| GitHub Discussions (hosted) | N/A | Stores all comments; no DB needed | Mandatory — comments live in GitHub |
| Giscus GitHub App | N/A | OAuth proxy letting visitors comment | Mandatory — must be installed on the target repo |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@giscus/react` | Raw `<script>` tag via `dangerouslySetInnerHTML` | Script tag approach works but requires manual prop sync and is harder to type-check |
| `@giscus/react` | `utterances` | utterances uses GitHub Issues not Discussions; giscus is the maintained successor |
| `@giscus/react` | Disqus / third-party | Disqus requires auth infrastructure and is ad-supported; incompatible with public-only constraint |

**Installation:**
```bash
npm install @giscus/react
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── components/
│   └── briefs/
│       ├── DownloadButton.tsx      # existing
│       ├── InfographicBlock.tsx    # existing
│       └── GiscusComments.tsx      # NEW — 'use client' Giscus wrapper
└── briefs/
    └── [slug]/
        └── page.tsx                # existing — import and render GiscusComments
```

### Pattern 1: Client Component Wrapper
**What:** A `'use client'` component that wraps `@giscus/react` and holds all Giscus configuration. The parent page (a Server Component or async page) simply renders `<GiscusComments />` without passing any per-page props, since Giscus uses `mapping="pathname"` to find the correct discussion automatically.
**When to use:** Always — Giscus relies on the browser's `window.location`, so it cannot run server-side.

**Example:**
```typescript
// Source: Official @giscus/react README + verified codebase pattern
// app/components/briefs/GiscusComments.tsx
'use client';

import Giscus from '@giscus/react';

export function GiscusComments() {
  return (
    <section className="mt-16 pt-8 border-t border-slate-200">
      <h2 className="font-serif text-xl text-navy-950 font-bold mb-6">Discussion</h2>
      <Giscus
        id="comments"
        repo="shikaasor/gghnstarr"          // replace with actual repo owner/name
        repoId="YOUR_REPO_ID"              // from giscus.app configurator
        category="General"
        categoryId="YOUR_CATEGORY_ID"     // from giscus.app configurator
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
```

```typescript
// app/briefs/[slug]/page.tsx — add at bottom of return, after Prev/Next nav
// No import change needed beyond:
import { GiscusComments } from '@/components/briefs/GiscusComments';

// Inside the return JSX, after </nav>:
<GiscusComments />
```

### Pattern 2: Mapping Strategy Selection
**What:** The `mapping` prop controls how Giscus finds/creates a GitHub Discussion for each page.
**Options:**
- `"pathname"` — uses the URL path (e.g., `/briefs/gghn-week-1`). Recommended: deterministic, does not break on domain changes.
- `"url"` — uses the full URL including domain. Breaks if domain changes.
- `"title"` — uses the HTML `<title>` tag. Breaks if titles change.
- `"specific"` — requires a hardcoded `term` prop per page. Not suitable for dynamic routes.

**When to use:** Use `"pathname"` for brief detail pages. It creates one Discussion per brief slug, which is semantically correct.

### Pattern 3: Obtaining repoId and categoryId
**What:** Static IDs that giscus uses internally to call the GitHub API. They do not change after initial setup.
**How to get them:**
1. Visit https://giscus.app
2. Enter the repository name in the "Repository" field
3. The configurator validates the repo, then shows all required IDs in the generated script snippet
4. Alternatively via GitHub CLI:
```bash
# Get repoId
gh api repos/OWNER/REPO --jq '.node_id'
# Get category IDs
gh api graphql -f query='query{repository(owner:"OWNER",name:"REPO"){discussionCategories(first:10){nodes{id name}}}}'
```

### Anti-Patterns to Avoid
- **Embedding the raw `<script>` tag:** The generated giscus `<script>` tag does not work cleanly in Next.js App Router JSX. Use `@giscus/react` instead.
- **Wrapping with `dynamic(..., { ssr: false })`:** Not needed for a static export site. Adding `'use client'` to `GiscusComments.tsx` is sufficient.
- **Placing Giscus inside the `max-w-3xl` content column:** Comments benefit from wider layout. Place it outside the `max-w-3xl div` at the same level as the Prev/Next nav.
- **Using `theme="preferred_color_scheme"`:** The site has no dark mode toggle; `preferred_color_scheme` respects user OS preference which may produce an unexpected dark UI. Use `theme="light"` for consistency with the AMR brand.
- **Hardcoding the `term` prop without `mapping="specific"`:** Using `mapping="pathname"` renders the `term` prop unused. Only set `term` when `mapping="specific"` is chosen.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Comment storage | Custom DB/API for comments | GitHub Discussions via Giscus | Requires backend, auth, spam moderation — all out of scope |
| Comment UI | Custom textarea + thread rendering | `@giscus/react` iframe | Handles OAuth, Markdown rendering, reactions, thread display, pagination |
| iframe theme messaging | Custom postMessage protocol | `@giscus/react` prop updates | The component handles postMessage internally when props change |
| repoId/categoryId lookup | Custom GitHub API call at runtime | Static values from giscus.app | IDs are stable; no runtime lookup needed |

**Key insight:** Giscus is entirely self-contained in an iframe. There is no client-side state to manage beyond passing static configuration props.

## Common Pitfalls

### Pitfall 1: GitHub Repository Not Configured
**What goes wrong:** Giscus iframe loads but shows "Discussion not found" or does not render at all.
**Why it happens:** The GitHub repo is missing one or more prerequisites: public visibility, Discussions feature enabled, or giscus GitHub App not installed.
**How to avoid:** Before writing code, verify all three prerequisites at https://giscus.app. The configurator shows a green checkmark next to each requirement.
**Warning signs:** The iframe renders a blank or error state in development.

### Pitfall 2: Wrong repoId or categoryId
**What goes wrong:** Giscus throws a GitHub API error and shows no comment box.
**Why it happens:** Typo in the Base64-encoded node IDs, or the IDs were copied from a different repository.
**How to avoid:** Copy IDs directly from the giscus.app configurator output (not from memory). Verify by pasting the generated script into a test HTML file first.
**Warning signs:** Browser DevTools network tab shows a failed GraphQL request to `api.github.com`.

### Pitfall 3: Comments Load on Every Brief Regardless of Discussion Existing
**What goes wrong:** A brief page shows Giscus, a reader comments, and their comment creates a Discussion in the GitHub repo — but the Discussion title contains the URL path, making moderation confusing.
**Why it happens:** `mapping="pathname"` auto-creates Discussions on first comment. This is expected behavior.
**How to avoid:** This is by design. Optionally rename auto-created Discussions in GitHub for clarity. The planner should document the expected Discussion naming convention.
**Warning signs:** N/A — this is expected, not a bug.

### Pitfall 4: Giscus Loads During Print
**What goes wrong:** When users print a brief (print styles exist in `globals.css`), the Giscus iframe prints too, adding unwanted blank space or GitHub UI.
**Why it happens:** The `GiscusComments` section has no `no-print` class.
**How to avoid:** Add `no-print` class to the wrapping `<section>` in `GiscusComments.tsx`. The project already has `@media print { .no-print { display: none !important; } }` in `globals.css`.
**Warning signs:** Check print preview — Giscus section appears.

### Pitfall 5: Loading Flash on Static Export
**What goes wrong:** On first page load, a brief shows the page content then Giscus pops in after a delay, causing layout shift.
**Why it happens:** Giscus loads lazily (`loading="lazy"`) and the iframe needs to fetch GitHub API data.
**How to avoid:** This is normal behavior for a third-party iframe. No fix needed, but reserve adequate spacing below the Prev/Next nav so the layout shift is minimal.

## Code Examples

Verified patterns from official sources:

### Complete GiscusComments Component
```typescript
// Source: @giscus/react README (https://github.com/giscus/giscus-component)
// app/components/briefs/GiscusComments.tsx
'use client';

import Giscus from '@giscus/react';

export function GiscusComments() {
  return (
    <section className="mt-16 pt-8 border-t border-slate-200 no-print">
      <h2 className="font-serif text-xl text-navy-950 font-bold mb-6">
        Discussion
      </h2>
      <Giscus
        id="comments"
        repo="GITHUB_OWNER/GITHUB_REPO"
        repoId="REPO_NODE_ID"
        category="General"
        categoryId="CATEGORY_NODE_ID"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
```

### Integration in Brief Detail Page
```typescript
// app/briefs/[slug]/page.tsx — diff (additions only)
import { GiscusComments } from '@/components/briefs/GiscusComments';

// ... existing return JSX ...
// After </nav> (Prev/Next navigation), before closing </Container>:
<GiscusComments />
```

### Obtaining IDs via CLI (one-time setup task)
```bash
# Source: giscus.app documentation + chocapikk.com/posts/2025/setting-up-giscus-comments/
# Run once from a machine with GitHub CLI authenticated

# Step 1: Get repo node ID
gh api repos/OWNER/REPO --jq '.node_id'

# Step 2: Get discussion category IDs
gh api graphql -f query='
query {
  repository(owner: "OWNER", name: "REPO") {
    discussionCategories(first: 10) {
      nodes { id name }
    }
  }
}'
```

### giscus.json Origin Restriction (optional hardening)
```json
// public/giscus.json — restricts which origins can load this repo's comments
// Source: giscus.app documentation
{
  "origins": [
    "https://gghnstarr.vercel.app",
    "https://www.gghnstarr.com"
  ]
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Disqus (third-party ad-supported comments) | Giscus (GitHub Discussions) | ~2021 | No ads, no tracking, Markdown support |
| `utterances` (GitHub Issues-based) | Giscus (GitHub Discussions-based) | ~2021 | Discussions have better threading and reactions |
| Raw `<script>` tag embed | `@giscus/react` component | 2022 | React/Next.js props system; no dangerouslySetInnerHTML |
| iframe-resizer host script (pre-v2) | Removed in v2+ | 2022-07-30 | Must use giscus-component v2+ (current: v1.6.0) |

**Deprecated/outdated:**
- iframe-resizer host script: Removed in giscus-component v2. Irrelevant since we install fresh at v1.6.0.
- `next export` standalone command: Replaced by `output: 'export'` in next.config.js. Already correctly configured in this project.

## Open Questions

1. **Which GitHub repository should host discussions?**
   - What we know: The site repo at `github.com/shikaasor/gghnstarr` (or similar) is the natural choice; alternatively a dedicated `gghnstarr-comments` repo could be created.
   - What's unclear: The exact GitHub username/repo name for the production site; whether the repo is already public.
   - Recommendation: Use the main site repo if it is (or will be) public; create a dedicated public `comments` repo if the main repo needs to stay private.

2. **Should the `repoId` and `categoryId` be in environment variables?**
   - What we know: These are non-secret values (they appear in the page HTML). Hardcoding them in the component is functionally equivalent to env vars.
   - What's unclear: Team preference for configuration management.
   - Recommendation: Hardcode directly in `GiscusComments.tsx` — the IDs are not secrets and adding env vars adds friction with no security benefit.

3. **Should Giscus appear on ALL briefs or only future ones?**
   - What we know: `mapping="pathname"` creates one Discussion per brief slug automatically on first comment.
   - What's unclear: Whether legacy briefs (already published) should retroactively gain comments.
   - Recommendation: Add Giscus to all brief detail pages uniformly. No migration needed — Discussions are created on-demand by visitors, not pre-created by the team.

## Sources

### Primary (HIGH confidence)
- https://github.com/giscus/giscus-component — Official @giscus/react README, props API, React usage example
- https://giscus.app — Official Giscus homepage, configuration options, mapping strategies, theme list
- https://github.com/giscus/giscus/blob/main/CHANGELOG.md — Giscus service changelog, current state

### Secondary (MEDIUM confidence)
- https://chocapikk.com/posts/2025/setting-up-giscus-comments/ — Step-by-step setup including GitHub CLI commands for obtaining IDs
- https://ecosystem.vuejs.press/plugins/blog/comment/giscus/config.html — Complete props table with types and defaults
- https://github.com/giscus/giscus-component/issues — Issue tracker confirming no React 19 / Next.js 16 open bugs as of May 2026

### Tertiary (LOW confidence)
- https://easonchang.com/en/posts/giscus-comment-system — Pages Router pattern; App Router equivalent inferred from existing codebase conventions
- WebSearch results for React 19 + giscus compatibility — No issues found; absence of bug reports treated as positive signal, not confirmed fact

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@giscus/react` v1.6.0 verified via official GitHub; no React 19 issues in tracker
- Architecture: HIGH — `'use client'` pattern matches existing codebase conventions (DownloadButton.tsx, InfographicBlock.tsx); `mapping="pathname"` is the documented standard
- Pitfalls: MEDIUM — GitHub setup pitfalls from official docs (HIGH); print/layout shift pitfalls inferred from codebase inspection (MEDIUM)
- Open questions: Require planner to note as assumptions or confirm with user before executing

**Research date:** 2026-05-03
**Valid until:** 2026-08-03 (90 days — giscus is stable; @giscus/react patch releases unlikely to be breaking)
