---
phase: 21
slug: tools-directory-searchable-catalog-of-one-health-tools-and-r
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-25
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | next build (static export) + browser visual check |
| **Config file** | next.config.ts |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 21-01-01 | 01 | 1 | Data extraction | — | No external APIs called at runtime | build | `npm run build` | ❌ W0 | ⬜ pending |
| 21-02-01 | 02 | 2 | ToolCard component | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |
| 21-02-02 | 02 | 2 | ToolsGrid filters | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |
| 21-02-03 | 02 | 2 | /tools-directory page | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |
| 21-03-01 | 03 | 3 | Visual checkpoint | — | N/A | manual | Browser visual inspection | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (Next.js + Tailwind already configured)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cards display correctly with real data | UI correctness | Visual rendering requires browser | Open /tools-directory, verify card layout, filters, and search work as expected |
| Filters correctly narrow results | Filter behavior | Stateful client component | Apply each filter combination, verify results update correctly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
