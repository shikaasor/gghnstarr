---
created: 2026-04-23T07:10:17.781Z
title: Build interactive AMR data map
area: ui
files:
  - app/map/page.tsx
---

## Problem

The platform spec includes an interactive AMR data map for ongoing engagement. No mapping library or AMR dataset is integrated. Policymakers cannot see regional AMR burden data visually.

## Solution

Integrate Leaflet or Mapbox with country-level AMR burden data overlay. Support drill-down to sub-national data where available. Data sourced from WHO GLASS, Africa CDC, or Fleming Fund datasets. Must work within static export constraints (client-side only, no server).
