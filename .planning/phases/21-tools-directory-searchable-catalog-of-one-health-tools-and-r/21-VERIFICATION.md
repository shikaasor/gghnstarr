---
phase: 21-tools-directory-searchable-catalog-of-one-health-tools-and-r
verified: 2026-05-25T00:00:00Z
status: human_needed
score: 9/10 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Open http://localhost:3000/tools-directory in a browser after running npm run dev. Confirm the teal hero banner renders with the 'Tools Directory' badge and heading, and that a grid of tool cards appears below (initial count should read 50 tools, 12 visible with pagination)."
    expected: "Hero section visible; card grid present with 50-tool result count and pagination controls"
    why_human: "Visual rendering cannot be verified with grep or static analysis"
  - test: "Type a search term (e.g. 'surveillance' or 'WHO') into the search box and observe the grid."
    expected: "Grid narrows to matching tools; result count updates immediately"
    why_human: "Client-side state behavior requires browser interaction"
  - test: "Click chips in each filter row (Organization Level, Audience Type, Scope). Then combine chips across rows."
    expected: "Chips within a dimension OR together; chips across dimensions AND together. 'Clear filters' resets all three chip sets and the search box."
    why_human: "Filter combination logic requires interactive browser testing"
  - test: "Click a tool card title that has a link. Also identify a tool card whose name renders as plain text (no href)."
    expected: "Linked tool opens the external site in a new tab. Plain-text tool name is not a hyperlink."
    why_human: "New-tab behavior and fallback rendering require browser interaction"
  - test: "In the desktop header, confirm the 'Tools' link is visible and navigates to /tools-directory. Resize to mobile width and open the hamburger menu."
    expected: "'Tools' is present in both desktop navigation and the mobile hamburger menu"
    why_human: "Desktop nav spacing with 11 links and mobile hamburger rendering require visual inspection"
  - test: "Scroll through several tool cards and check description text overflow."
    expected: "Cards with long descriptions are clamped to approximately 3 lines — no runaway card height"
    why_human: "CSS line-clamp behavior requires visual inspection"
---

# Phase 21: Tools Directory Verification Report

**Phase Goal:** Searchable catalog of One Health tools and resources at /tools-directory
**Verified:** 2026-05-25
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | content/oh-tools.json contains exactly 50 tool records (no footnote rows) | VERIFIED | `python -c "import json; ... print(len(d))"` → `50 True` with all fields valid |
| 2 | Every record has a name, a numeric year, and arrays for organizationLevels/scopes/audienceLevels/audienceTypes | VERIFIED | Python validation: all 50 records pass field-type assertions |
| 3 | Embedded newlines in names/organizations are collapsed to single spaces | VERIFIED | Python check: zero records with `\n` in name or organization |
| 4 | Messy/scheme-less URLs normalized to https:// or set to empty string | VERIFIED | Python check: zero records with non-empty URL not starting with `http` |
| 5 | ToolItem type exported from app/lib/types.ts | VERIFIED | `export interface ToolItem` at line 142; three union types at lines 122/128/135 |
| 6 | A visitor can navigate to /tools-directory and see a grid of 50 tool cards | VERIFIED (code) / HUMAN NEEDED (render) | `app/tools-directory/page.tsx` reads oh-tools.json via readFileSync and passes all 50 tools to ToolsGrid; grid renders ToolCard per tool |
| 7 | A visitor can type in a search box and the grid narrows to matching tools | VERIFIED (code) / HUMAN NEEDED (behavior) | ToolsGrid filtered useMemo implements `searchMatch` over name/organization/description via `.toLowerCase().includes()`; ToolsFilters has a controlled `<input>` |
| 8 | Filters combine OR-within-dimension and AND-across-dimensions | VERIFIED (code) / HUMAN NEEDED (interaction) | ToolsGrid filtered useMemo: `orgMatch && audienceMatch && scopeMatch && searchMatch` with `.some()` per dimension |
| 9 | Each tool with a URL links out via a new tab with rel=noopener noreferrer; no-URL tools render as plain text | VERIFIED | ToolCard.tsx line 23: `rel="noopener noreferrer"` + `target="_blank"` guard; `<span>` fallback when `tool.url` is falsy |
| 10 | A 'Tools' link appears in both desktop and mobile site navigation | VERIFIED | Header.tsx line 14: `{ href: '/tools-directory', label: 'Tools' }` between Education and News in the single navLinks array driving both renderers |

**Score:** 9/10 truths verified (1 deferred to human — visual/behavioral rendering)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `resources/tools/extract_oh_tools.py` | One-shot openpyxl extraction of rows 3-52 | VERIFIED | Exists; contains `range(3, 53)`, `wb["Table 1 OHHLEP Tools Inventory"]`, `re.sub(r"\s+", " "` clean helper, idempotent slug dedup via md5 |
| `content/oh-tools.json` | 50 typed One Health tool records | VERIFIED | 1045 lines, 50 records, all fields valid, no embedded newlines, all URLs https-normalized |
| `app/lib/types.ts` | ToolItem interface + OH token unions | VERIFIED | `export interface ToolItem` at line 142; `OHOrganizationLevel`, `OHAudienceType`, `OHScope` at lines 122-140 |
| `app/tools-directory/page.tsx` | RSC that reads content/oh-tools.json and renders the grid | VERIFIED | Contains `readFileSync(join(process.cwd(), 'content/oh-tools.json'), 'utf-8')` and `<ToolsGrid tools={tools} />` |
| `app/components/tools/ToolsGrid.tsx` | Client component with search + 3 filter dimensions | VERIFIED | Contains `'use client'`, `filtered` useMemo with `searchMatch`, no tab machinery |
| `app/components/tools/ToolCard.tsx` | Presentational tool card | VERIFIED | Contains `rel="noopener noreferrer"`, `target="_blank"`, `<span>` fallback, `line-clamp-3` |
| `app/components/tools/ToolsFilters.tsx` | Search input + chip filter rows | VERIFIED | Contains `toggleValue<T>` generic helper, controlled search input, three labeled chip rows (Organization Level, Audience Type, Scope) |
| `app/components/layout/Header.tsx` | navLinks entry for /tools-directory | VERIFIED | `{ href: '/tools-directory', label: 'Tools' }` present at line 14 between Education and News |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `resources/tools/extract_oh_tools.py` | `content/oh-tools.json` | `json.dump` write | VERIFIED | Script contains `json.dump(items, f, ensure_ascii=False, indent=2)` writing to OUTPUT_PATH |
| `content/oh-tools.json` | `app/lib/types.ts ToolItem` | shape conformance (organizationLevels field) | VERIFIED | All 50 records contain `organizationLevels` array; JSON structure matches ToolItem field order |
| `app/tools-directory/page.tsx` | `content/oh-tools.json` | `readFileSync` at build time | VERIFIED | Line 16: `readFileSync(join(process.cwd(), 'content/oh-tools.json'), 'utf-8')` |
| `app/tools-directory/page.tsx` | `app/components/tools/ToolsGrid.tsx` | ToolsGrid tools prop | VERIFIED | Line 43: `<ToolsGrid tools={tools} />` |
| `app/components/layout/Header.tsx` | `/tools-directory` | navLinks entry | VERIFIED | Line 14: `{ href: '/tools-directory', label: 'Tools' }` |
| `app/components/tools/ToolsGrid.tsx` | `app/components/tools/ToolCard.tsx` | `<ToolCard key={tool.id} tool={tool} />` | VERIFIED | Line 130: grid maps paginated tools to ToolCard |
| `app/components/tools/ToolsGrid.tsx` | `app/components/tools/ToolsFilters.tsx` | `<ToolsFilters ... />` with all props | VERIFIED | Lines 88-119: ToolsFilters rendered with available options, selected arrays, setters, and onClearAll |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `app/tools-directory/page.tsx` | `tools: ToolItem[]` | `readFileSync` of `content/oh-tools.json` at build time | Yes — 50 records from JSON file | FLOWING |
| `app/components/tools/ToolsGrid.tsx` | `filtered` / `paginated` | `tools` prop from RSC page → useMemo filter over real array | Yes — derived from real 50-record prop | FLOWING |
| `app/components/tools/ToolCard.tsx` | `tool` prop | `paginated` slice from ToolsGrid | Yes — real ToolItem objects | FLOWING |

No static-return stubs or disconnected props found.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| oh-tools.json has exactly 50 valid records | `python -c "import json; d=json.load(open('content/oh-tools.json', encoding='utf-8')); print(len(d), all(isinstance(t['year'],int) and t['name'] and isinstance(t['organizationLevels'],list) for t in d))"` | `50 True` | PASS |
| No names with embedded newlines | `python -c "... print([t['name'] for t in d if '\n' in t['name']])"` | `[]` | PASS |
| All non-empty URLs start with https | `python -c "... print([t['url'] for t in d if t['url'] and not t['url'].startswith('http')])"` | `[]` | PASS |
| ToolItem exported from types.ts | `grep "export interface ToolItem" app/lib/types.ts` | line 142 | PASS |
| ToolsGrid has no tab machinery | `grep "activeTab\|tab" app/components/tools/ToolsGrid.tsx` | No matches | PASS |
| ToolCard has noopener noreferrer | `grep "noopener noreferrer" app/components/tools/ToolCard.tsx` | line 23 | PASS |
| No dangerouslySetInnerHTML in tools components | `grep "dangerouslySetInnerHTML" app/components/tools/*.tsx` | No matches | PASS |
| Header navLinks contains /tools-directory | `grep "tools-directory" app/components/layout/Header.tsx` | line 14 | PASS |

---

### Probe Execution

No probe scripts declared in plan files. Plan 21-03 Task 1 confirms `npm run build` completed with exit 0 and 28 routes including `/tools-directory`. This cannot be re-run in the verifier without starting a build process.

| Probe | Command | Result | Status |
|-------|---------|--------|--------|
| `npm run build` (declared in 21-02 and 21-03 plans) | Build output reported in 21-03-SUMMARY.md: "exits 0; /tools-directory route present in static export (28 total routes)" | Cannot re-run — claimed in SUMMARY | SKIP (human must confirm) |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| TOOLDIR-01 | 21-01, 21-02, 21-03 | Searchable catalog of One Health tools at /tools-directory | SATISFIED | All artifacts exist, data flows from JSON through RSC to client grid; search and filter logic implemented |

Note: TOOLDIR-01 does not appear in `.planning/REQUIREMENTS.md` — the requirement is tracked in phase plans only. The REQUIREMENTS.md traceability table does not reference Phase 21 or TOOLDIR-01. This is an administrative gap (requirements file not updated), not a code gap, and does not block phase goal delivery.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/components/tools/ToolsFilters.tsx` | 54 | `placeholder="Search tools..."` | Info | HTML input placeholder — not a stub indicator; correct use of placeholder attribute |

No `TBD`, `FIXME`, `XXX`, `TODO`, `HACK` markers found in any Phase 21 files. No `return null`, empty handlers, or hardcoded empty data arrays found in tools components. The `placeholder` match is an HTML attribute, not a stub.

---

### Human Verification Required

#### 1. Page Renders with 50 Tool Cards

**Test:** Run `npm run dev` and open http://localhost:3000/tools-directory. Confirm the teal hero banner renders with the "Tools Directory" badge and heading. Confirm a grid of tool cards appears below with result count showing 50 tools (12 visible with pagination).
**Expected:** Teal hero section visible; card grid present with 50-tool result count and pagination controls at the bottom.
**Why human:** Visual rendering and pagination controls cannot be verified without a running browser.

#### 2. Search Narrows the Grid

**Test:** Type a search term (e.g. "surveillance" or "WHO") into the search input above the filter chips.
**Expected:** The grid immediately narrows to matching tools; the result count updates. Clearing the input restores all 50 tools.
**Why human:** Client-side state behavior and real-time DOM update require browser interaction.

#### 3. Filter Chips Combine Correctly

**Test:** Click chips in each filter row. First test OR within a dimension (two chips in Organization Level show union). Then combine with a chip from Audience Type and confirm AND logic (smaller result set). Click "Clear filters" — confirm all three chip sets and the search box are reset.
**Expected:** OR within dimension, AND across dimensions. Clear filters resets everything.
**Why human:** Multi-step filter interaction cannot be verified statically.

#### 4. External Links Open in New Tab; No-URL Names Are Plain Text

**Test:** Click a tool card title that has a URL link. Also identify a card whose title is plain text (no underline/link styling).
**Expected:** Linked tool opens external site in a new tab. Plain-text tool name has no href or underline.
**Why human:** New-tab behavior and visual link styling require browser interaction.

#### 5. Navigation Link Present in Desktop and Mobile

**Test:** Confirm "Tools" is visible in the desktop header nav. Resize to mobile width and open the hamburger menu — confirm "Tools" appears there too. Click the link and confirm it navigates to /tools-directory.
**Expected:** "Tools" visible and functional in both nav contexts. Desktop nav spacing with 11 links is acceptable.
**Why human:** Responsive layout and mobile menu rendering require visual inspection.

#### 6. Description Text Clamped to ~3 Lines

**Test:** Scroll through several tool cards with longer descriptions.
**Expected:** Descriptions are clamped to approximately 3 lines — no cards are significantly taller than others due to text overflow.
**Why human:** CSS `line-clamp-3` rendering requires visual inspection.

---

### Gaps Summary

No code gaps found. All 10 automated truths are verified at the code level. The 6 human verification items above are standard UI acceptance checks that cannot be performed without a running browser — they are not blockers on the code quality but are required before the phase can be marked fully complete.

The only administrative note is that `TOOLDIR-01` is not registered in `.planning/REQUIREMENTS.md` traceability table. The plans declare it and the code delivers it; the requirements file should be updated to include it.

---

_Verified: 2026-05-25_
_Verifier: Claude (gsd-verifier)_
