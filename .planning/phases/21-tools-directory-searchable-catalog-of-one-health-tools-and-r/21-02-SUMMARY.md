---
phase: 21-tools-directory-searchable-catalog-of-one-health-tools-and-r
plan: 02
subsystem: tools-directory-ui
tags: [react, client-component, search, filters, nav]
requires:
  - content/oh-tools.json (50 ToolItem records from Plan 21-01)
  - ToolItem / OHOrganizationLevel / OHAudienceType / OHScope types in app/lib/types.ts
provides:
  - /tools-directory route — searchable, three-dimension-filterable catalog of 50 One Health tools
  - app/components/tools/ToolCard.tsx (presentational tool card)
  - app/components/tools/ToolsFilters.tsx (search + chip filter rows)
  - app/components/tools/ToolsGrid.tsx (stateful client grid)
  - Tools nav link in Header (desktop + mobile)
affects:
  - app/components/layout/Header.tsx
tech-stack:
  added: []
  patterns:
    - Phase 16 Education pattern clone (RSC page reads JSON → Client grid owns state) minus tabs/region
    - Net-new free-text search over name/organization/description with .toLowerCase().includes
    - OR-within-dimension / AND-across-dimension chip filtering
key-files:
  created:
    - app/components/tools/ToolCard.tsx
    - app/components/tools/ToolsFilters.tsx
    - app/components/tools/ToolsGrid.tsx
    - app/tools-directory/page.tsx
  modified:
    - app/components/layout/Header.tsx
decisions:
  - "ToolsGrid derives available filter options over the full tools array (no tab filtering) — tab machinery from EducationTabs dropped entirely"
  - "Free-text search joins name/organization/description and lowercases both sides; empty query matches all"
metrics:
  duration: ~5 min
  completed: 2026-05-25
---

# Phase 21 Plan 02: Tools Directory UI Summary

Built the user-facing searchable, filterable catalog of 50 One Health tools — a ToolCard presentational component, a ToolsFilters search+chip component, a stateful ToolsGrid client component, the /tools-directory RSC page reading content/oh-tools.json, and an 11th "Tools" nav link in the Header.

## What Was Built

- **`app/components/tools/ToolCard.tsx`** — Presentational card (no 'use client'). Organization in the uppercase slate label slot, title as a guarded link (`<a target="_blank" rel="noopener noreferrer">` when `tool.url`, `<span>` fallback otherwise — threat T-21-04), `line-clamp-3` description, footer with teal audience-type pills, bordered slate org-level pills, and right-aligned year.
- **`app/components/tools/ToolsFilters.tsx`** — Presentational filters with the verbatim generic `toggleValue<T>` helper, a controlled search `<input>` bound to `searchQuery`/`onSearchChange`, and three labeled chip rows (Organization Level, Audience Type, Scope). `hasActiveFilters` true when any array is non-empty OR searchQuery !== ''; Clear-filters button wired to `onClearAll`.
- **`app/components/tools/ToolsGrid.tsx`** — `'use client'` stateful grid. Owns selected org-levels/audience-types/scopes, searchQuery, and currentPage (PAGE_SIZE=12). `filtered` useMemo applies OR-within/AND-across chip logic plus a net-new `searchMatch` over name/organization/description. Retains the EducationTabs pagination clamp, windowed page numbers, and goToPage verbatim. All setters reset page to 1; tab machinery removed.
- **`app/tools-directory/page.tsx`** — Pure RSC reading `content/oh-tools.json` via `readFileSync(join(process.cwd(), ...))`, teal-600 hero + bg-slate-50 section rendering `<ToolsGrid tools={tools} />`, with searchable-catalog metadata.
- **`app/components/layout/Header.tsx`** — Added `{ href: '/tools-directory', label: 'Tools' }` between Education and News; single navLinks array drives both desktop and mobile renderers.

## Verification

- `npx tsc --noEmit -p tsconfig.json` exits 0
- `npm run build` completes with no errors and emits the `/tools-directory` static route
- ToolCard external anchors carry `rel="noopener noreferrer"` and `target="_blank"`; `<span>` fallback when no URL
- No `dangerouslySetInnerHTML` in any tools component (text auto-escaped by React)
- Header navLinks includes the `/tools-directory` Tools entry between Education and News

## Deviations from Plan

None — plan executed exactly as written.

## Threat Surface

No new surface beyond the plan's threat model. T-21-04 mitigated (every `target="_blank"` anchor carries `rel="noopener noreferrer"`; only cleaned https URLs reach the card from Plan 21-01). T-21-05 mitigated (all text rendered as React children, no dangerouslySetInnerHTML). T-21-SC: no package installs.

## Known Stubs

None. The grid renders all 50 tools from the build-time JSON.

## Commits

- 685cc24: feat(21-02): add ToolCard and ToolsFilters presentational components
- aa3f5f6: feat(21-02): add ToolsGrid client component and /tools-directory page
- 69aee30: feat(21-02): add Tools nav link to Header

## Self-Check: PASSED
