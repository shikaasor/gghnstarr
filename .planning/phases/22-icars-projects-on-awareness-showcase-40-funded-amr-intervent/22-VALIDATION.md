---
phase: 22
slug: icars-projects-on-awareness-showcase-40-funded-amr-intervent
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-27
---

# Phase 22 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — project uses next build + visual verification (no test framework installed) |
| **Config file** | none |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds (lint), ~60 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full build must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 22-01-01 | 01 | 1 | data extraction | — | N/A | script | `python scripts/extract-icars.py && python -c "import json; d=json.load(open('content/icars-projects.json')); assert len(d)==25"` | ❌ W0 | ⬜ pending |
| 22-01-02 | 01 | 1 | JSON type validity | — | N/A | lint | `npm run lint` | ✅ | ⬜ pending |
| 22-02-01 | 02 | 2 | IcarsProjectCard renders | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 22-02-02 | 02 | 2 | IcarsProjectsSection filter | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 22-02-03 | 02 | 2 | /awareness page visual | — | N/A | manual | Browser: navigate to /awareness, verify AMR Interventions section renders with cards and sector filter | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/extract-icars.py` — data extraction script (created in Wave 1 plan 22-01)
- [ ] `content/icars-projects.json` — output of extraction (created in Wave 1 plan 22-01)

*Existing build/lint infrastructure covers Wave 2 requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| AMR Interventions section visible on /awareness | Phase 22 goal | No E2E test framework | 1. Run `npm run dev`, 2. Navigate to /awareness, 3. Scroll to AMR Interventions section, 4. Confirm 25 project cards render, 5. Use sector filter and confirm filtering works |
| Sector badges render correctly | Phase 22 goal | Visual verification only | Verify Humans/Animals/Environment/One Health/Food and Feed badges are color-coded and readable |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
