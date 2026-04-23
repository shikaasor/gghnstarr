---
created: 2026-04-23T07:10:17.781Z
title: Add audience-segmented CTAs to homepage
area: ui
files:
  - app/page.tsx
  - app/components/sections/HeroSection.tsx
---

## Problem

The homepage has a single generic hero CTA. The platform targets three distinct audiences (general public, healthcare workers, policymakers) who need different entry paths and messaging. A visitor landing on the homepage has no guidance toward content relevant to them.

## Solution

Rework the hero section to include 3 audience entry points — distinct CTA blocks or a tabbed/card selector. Tag all existing content (briefs, tools, resources) by target audience so each path leads to relevant filtered views.
