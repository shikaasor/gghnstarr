---
created: 2026-04-23T07:10:17.781Z
title: Add analytics integration
area: general
files:
  - app/layout.tsx
---

## Problem

No analytics are wired in — no GA4, Plausible, or any event tracking. There is no visibility into how policymakers find or use the site, which briefs get downloaded, or how the newsletter converts. This is a blind spot from day one of launch.

## Solution

Add GA4 or Plausible to root layout.tsx. Instrument key events: PDF downloads, infographic downloads, CTA clicks, newsletter signups, contact form submissions. Set up a conversion funnel so the team can see brief → download → newsletter flow.
