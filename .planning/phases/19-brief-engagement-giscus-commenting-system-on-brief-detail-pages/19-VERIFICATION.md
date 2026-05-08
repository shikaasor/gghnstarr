---
phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages
verified: 2026-05-08T00:00:00Z
status: human_needed
score: 8/8 must-haves verified
re_verification: false
---

# Phase 19: Brief Engagement — Commenting System Verification Report

**Phase Goal:** Every brief detail page surfaces a Discussion section (powered by anonymous GAS/Supabase commenting) below the Prev/Next navigation, giving policymakers a lightweight way to comment on and react to AMR briefs without requiring authentication.
**Verified:** 2026-05-08
**Status:** gaps_found — 3 gaps block full delivery
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | CommentForm client component exists for anonymous submission | VERIFIED | `app/components/briefs/CommentForm.tsx` — 96 lines, 'use client', posts to Supabase via `supabase.from('comments').insert()` |
| 2  | CommentList component exists for rendering approved comments | VERIFIED | `app/components/briefs/CommentList.tsx` — 59 lines, 'use client', queries Supabase for `status='approved'` rows by slug |
| 3  | trackEvent generic helper exists in analytics.ts | VERIFIED | `app/lib/analytics.ts` line 32 — `export function trackEvent(eventName: string, params: Record<string, string> = {})` |
| 4  | Discussion section appears below Prev/Next nav on every brief detail page | VERIFIED | `app/briefs/[slug]/page.tsx` lines 194–201 — `<section className="no-print mt-16 ...">` after `</nav>` (line 192); imports both CommentForm and CommentList |
| 5  | Discussion section is hidden when printed | VERIFIED | `no-print` class on the `<section>` element (line 195) |
| 6  | CommentForm and CommentList are wired into page.tsx | VERIFIED | Lines 7–8: `import { CommentForm }` and `import { CommentList }`; both rendered at lines 198 and 200 with `slug` prop |
| 7  | content/comments.json seed file exists | FAILED | File absent — `content/` contains only briefs/, briefs-index.json, experts.json, news.json, site.json |
| 8  | GitHub Actions cron workflow fetches approved comments daily | FAILED | `.github/workflows/` contains only `fetch-news.yml` — `fetch-comments.yml` was never created |

**Score:** 5/8 truths verified (plus 1 administrative gap: requirement IDs not in REQUIREMENTS.md)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/components/briefs/CommentForm.tsx` | Client form, Supabase POST | VERIFIED | 96 lines, substantive — name/email/comment fields, handleSubmit inserts to Supabase, trackEvent call, success/error states |
| `app/components/briefs/CommentList.tsx` | Renders approved comments by slug | VERIFIED | 59 lines, substantive — useEffect queries Supabase, maps comments to JSX, loading + empty states |
| `app/briefs/[slug]/page.tsx` | Discussion section below Prev/Next | VERIFIED | Section at lines 194–201, positioned after `</nav>` at line 192 |
| `app/lib/supabase.ts` | Supabase client | VERIFIED | Creates client from NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY; both keys present in .env.local |
| `app/lib/analytics.ts` | trackEvent helper | VERIFIED | Exported at line 32, wraps sendGAEvent |
| `content/comments.json` | Seed empty object `{}` | MISSING | File does not exist |
| `.github/workflows/fetch-comments.yml` | Daily cron, curl GAS_COMMENTS_URL | MISSING | File does not exist; only fetch-news.yml is present |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/briefs/[slug]/page.tsx` | `CommentForm.tsx` | `import { CommentForm } from '@/components/briefs/CommentForm'` | WIRED | Line 7 import; rendered line 200 with `slug={slug}` |
| `app/briefs/[slug]/page.tsx` | `CommentList.tsx` | `import { CommentList } from '@/components/briefs/CommentList'` | WIRED | Line 8 import; rendered line 198 with `slug={slug}` |
| `CommentForm.tsx` | Supabase | `supabase.from('comments').insert(...)` | WIRED | Line 22 in CommentForm; client from `@/lib/supabase` |
| `CommentList.tsx` | Supabase | `supabase.from('comments').select(...).eq('status','approved')` | WIRED | Lines 23–27 in CommentList |
| `.github/workflows/fetch-comments.yml` | GAS_COMMENTS_URL | curl + commit | NOT WIRED | Workflow file does not exist |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| BENG-01 | 19-01-PLAN.md, 19-02-PLAN.md | CommentForm + CommentList components; anonymous commenting | SATISFIED (implementation) | Both components exist and are substantive; pivoted from GAS to Supabase which is a valid improvement |
| BENG-02 | 19-02-PLAN.md | Discussion section below Prev/Next on every brief detail page | SATISFIED (implementation) | Section verified at correct position in page.tsx |

**ORPHANED REQUIREMENT IDs — CRITICAL:** BENG-01 and BENG-02 do not appear anywhere in `.planning/REQUIREMENTS.md`. They are defined only in plan frontmatter. The traceability table's last entry is Phase 15 (CONF-01/02/03). These IDs must be registered to maintain project traceability integrity.

---

### Pivot Assessment

The implementation pivoted from GAS-backed static JSON (PLAN describes: CommentForm POSTs to NEXT_PUBLIC_GAS_URL; CommentList imports content/comments.json) to Supabase client-side commenting. The pivot is architecturally sound and better for the stated goal. However:

- The pivot was **incomplete** — plan 19-01 still references `content/comments.json` as a required artifact (for GitHub Actions hydration), and plan 19-02 requires `fetch-comments.yml`. These were never created.
- `CommentList` is now `'use client'` (Supabase query), not a server component importing static JSON. The plan's must_have calling for a "server component" is not met, but this is an acceptable improvement.
- `CommentForm` uses Supabase insert, not `NEXT_PUBLIC_GAS_URL`. The GAS URL exists in `.env.local` but is unused by the commenting components.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/components/briefs/CommentList.tsx` | 1 | `'use client'` on a component the plan declares as server component | Info | Not a bug — Supabase client-side query requires client component; plan must_have is outdated |
| `app/briefs/[slug]/page.tsx` | 194 | Comment says "GAS-backed anonymous commenting" | Info | Comment is stale — implementation is Supabase-backed, not GAS |

No blocking anti-patterns (TODO/FIXME, empty return, placeholder content).

---

### Human Verification Required

#### 1. Supabase `comments` table exists and is configured

**Test:** Open Supabase dashboard for project `rzrmviukeactnbolraob`. Verify a `comments` table exists with columns: `id`, `slug`, `name`, `email`, `comment`, `status`, `created_at`.
**Expected:** Table exists; anon key has INSERT permission; approved comments can be queried publicly.
**Why human:** Cannot query Supabase schema from codebase inspection alone.

#### 2. Comment submission end-to-end

**Test:** Navigate to any brief detail page (e.g., `/briefs/week-1-amr-overview`). Enter a name and comment, submit.
**Expected:** Success state "Thanks — your comment is awaiting moderation." appears. Row appears in Supabase dashboard with `status='pending'`.
**Why human:** Requires live Supabase credentials and browser interaction.

#### 3. Approved comment display

**Test:** In Supabase dashboard, set a comment row's `status` to `approved`. Reload the brief detail page.
**Expected:** Comment appears in the Discussion section above the form, with name and date.
**Why human:** Requires database manipulation and live browser check.

---

### Gaps Summary

Two concrete deliverables from Plan 19-02 were never created:

1. **`.github/workflows/fetch-comments.yml` is missing.** This workflow was the mechanism for keeping `content/comments.json` up to date with approved comments. Since the implementation pivoted to live Supabase queries, this workflow may be architecturally unnecessary — but it was a committed plan artifact and its absence means the PLAN's must_have is unmet. If the Supabase approach is the final architecture, this workflow should be explicitly retired (remove from plan) or created as a no-op note. If GAS moderation is still intended, the workflow must be built.

2. **`content/comments.json` is missing.** Same reasoning — if comments are served live from Supabase, this file is no longer needed. But it was declared as a required artifact in Plan 19-01. Needs explicit resolution.

3. **BENG-01 and BENG-02 are not in REQUIREMENTS.md.** These requirement IDs were invented in plan frontmatter but never registered in the canonical requirements document. The traceability table stops at Phase 15. This is an administrative gap that breaks project traceability.

The core user-facing goal — Discussion section on every brief detail page — IS achieved. The gaps are around the async comment-hydration pipeline (fetch-comments.yml + comments.json) and administrative bookkeeping (REQUIREMENTS.md).

---

_Verified: 2026-05-08_
_Verifier: Claude (gsd-verifier)_
