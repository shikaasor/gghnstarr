---
created: 2026-04-23T07:10:17.781Z
title: Accessibility and social share audit
area: ui
files:
  - app/layout.tsx
  - app/components/layout/Header.tsx
  - app/briefs/[slug]/page.tsx
---

## Problem

No ARIA landmark audit, skip-links, or screen reader testing has been done. LinkedIn is linked only in the footer — there are no share buttons on brief or news pages. The site targets high-level officials who may use assistive technology or share content via social media regularly.

## Solution

Full ARIA landmark audit and skip-link addition. Screen reader and colour-contrast testing (WCAG AA minimum). Add share buttons (LinkedIn, Twitter/X, WhatsApp) to all brief detail pages and future news articles.
