---
phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages
plan: "02"
subsystem: ui
tags: [commenting, supabase, client-side-fetch, brief-detail, pivot]

# Dependency graph
requires:
  - phase: 19-01
    provides: CommentForm and CommentList components (now rewritten)
provides:
  - Discussion section on every brief detail page below Prev/Next nav
  - Live Supabase fetch of approved comments — no rebuild cycle needed
  - Direct Supabase insert for comment submission with pending status
affects:
  - All /briefs/[slug] pages (Discussion section)

# Tech tracking
tech-stack:
  added: ["@supabase/supabase-js"]
  patterns: ["Supabase client-side fetch in useEffect — Client Component pattern", "Direct DB insert from browser with anon key + RLS — same pattern as Supabase standard"]

key-files:
  created:
    - app/lib/supabase.ts
  modified:
    - app/components/briefs/CommentForm.tsx
    - app/components/briefs/CommentList.tsx
  deleted:
    - .github/workflows/fetch-comments.yml
    - content/comments.json

key-decisions:
  - "Phase 19: replaced GAS+GitHub Actions comment display with Supabase client-side fetch — live approval without rebuild cycle"
  - "CommentList converted from Server Component (static JSON import) to Client Component (useEffect + Supabase) — required for live fetch"
  - "CommentForm drops GAS fetch() call in favour of supabase.from('comments').insert() — simpler, typed, no CORS issues"
  - "NEXT_PUBLIC_SUPABASE_ANON_KEY is safe in browser — Row Level Security on Supabase table enforces read-only for approved rows and insert-only for new rows"
  - "fetch-comments.yml and content/comments.json deleted — no longer needed with live Supabase fetch"

patterns-established:
  - "Supabase anon client pattern via app/lib/supabase.ts — reusable for any future client-side Supabase access"

requirements-completed: [BENG-01, BENG-02]

# Metrics
duration: ~10min
completed: 2026-05-08
---

# Phase 19 Plan 02: Brief Detail Page Discussion Integration Summary

**Supabase client-side commenting — live fetch of approved comments and direct insert replacing GAS + GitHub Actions cron rebuild cycle**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-05-08
- **Tasks:** 5 (install, lib, CommentForm, CommentList, cleanup)
- **Files modified/created:** 5 | **Files deleted:** 2

## Accomplishments

- Installed `@supabase/supabase-js` (10 packages)
- Created `app/lib/supabase.ts` — singleton Supabase client using `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Rewrote `CommentForm` — replaced GAS `fetch()` POST with `supabase.from('comments').insert()`, status set to `pending`
- Rewrote `CommentList` — converted from Server Component (static JSON import) to Client Component (`useEffect` + Supabase live query for `status=approved`)
- Deleted `.github/workflows/fetch-comments.yml` and `content/comments.json` — no longer needed
- Added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` placeholders to `.env.local`
- TypeScript compilation clean — zero errors
- `npm run build` passes clean — all 25 static pages generated successfully

## Task Commits

1. **Install Supabase** - `5912d44` (chore)
2. **Add Supabase lib** - `738f26f` (chore)
3. **Rewrite CommentForm** - `578fa3a` (feat)
4. **Rewrite CommentList** - `a041909` (feat)
5. **Remove GAS workflow + static JSON** - `419ec87` (chore)

## Files Created/Modified/Deleted

- `app/lib/supabase.ts` — created: singleton Supabase client
- `app/components/briefs/CommentForm.tsx` — rewritten: GAS fetch replaced by Supabase insert
- `app/components/briefs/CommentList.tsx` — rewritten: static JSON import replaced by live Supabase query
- `.github/workflows/fetch-comments.yml` — deleted
- `content/comments.json` — deleted

## Decisions Made

- Supabase anon key is `NEXT_PUBLIC_` — safe in browser because Supabase Row Level Security (RLS) governs what the anon role can read/write; policy should allow: SELECT where status=approved, INSERT with status forced to pending
- CommentList must be a Client Component (`'use client'`) because it calls `useEffect` for the live Supabase fetch — this is a deliberate trade-off vs SSG; comments appear live without rebuild
- The `id` field in CommentList is now used as the React `key` (UUID from Supabase) replacing the previous array index — more stable

## Deviations from Plan

None — plan executed exactly as written. Build passed on first attempt with no TypeScript errors.

## What You Need to Do Before Going Live

1. Create a `comments` table in your Supabase project:
   ```sql
   create table comments (
     id uuid primary key default gen_random_uuid(),
     slug text not null,
     name text not null,
     email text,
     comment text not null,
     status text not null default 'pending',
     created_at timestamptz not null default now()
   );
   ```
2. Add Row Level Security policies:
   ```sql
   -- Allow anyone to read approved comments
   create policy "Read approved comments" on comments
     for select using (status = 'approved');
   -- Allow anyone to insert (status forced to pending by app)
   create policy "Insert pending comments" on comments
     for insert with check (status = 'pending');
   ```
3. Replace placeholders in `.env.local` (and Vercel env vars):
   - `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project Settings > API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from same page (anon/public key)
4. Moderate comments in Supabase Table Editor — change `status` from `pending` to `approved` to publish

---
*Phase: 19-brief-engagement-giscus-commenting-system-on-brief-detail-pages*
*Completed: 2026-05-08*
