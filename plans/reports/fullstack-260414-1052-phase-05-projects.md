---
type: implementation
phase: 05
date: 2026-04-14
author: fullstack-developer
status: complete
---

# Phase 05 — Projects Bento Grid: Implementation Report

## Status: Complete

`npx astro check` → 0 errors. `npm run build` → 7 pages, 6 project slug dirs.

## Files Created

| File | Lines | Notes |
|---|---|---|
| `src/lib/featured-projects-order.ts` | 13 | Explicit slug order array |
| `src/components/react/MagneticTilt.tsx` | 84 | RAF-throttled 3D tilt, touch+motion guard |
| `src/components/astro/ProjectCard.astro` | 185 | Stretch-link overlay pattern (no nested `<a>`) |
| `src/components/astro/ProjectsGrid.astro` | 110 | Bento 3×2 grid, md:col-span-2 hero |
| `src/pages/projects/[slug].astro` | 210 | All 6 detail routes, MDX body, sticky back link |

## Files Modified

| File | Change |
|---|---|
| `src/pages/index.astro` | Added `<ProjectsGrid id="work" />` after `<Skills />` |
| `src/content/projects/booking-duongcam-art.md` | `featured: true` |
| `src/content/projects/alqac-2023.md` | `featured: true` |
| `src/content/projects/legal-prompts.md` | `featured: true` |
| `src/content/projects/ocr-api.md` | `featured: true` |
| `src/content/projects/text2sql-vietnamese.md` | `featured: true` |

## Key Decisions

- **Nested `<a>` avoided** via stretch-link pattern: outer card is `<div>`, invisible `position:absolute` `<a>` covers card at z-index 0, repo/demo links at z-index 1.
- **Astro 5 `entry.id` includes `.md`** — stripped via `.replace(/\.(md|mdx)$/, '')` in both `getStaticPaths` and slug lookup. `getStaticPaths` strips inline (not via helper fn — functions declared in frontmatter aren't hoisted into the build context).
- **5 projects had `featured: false`** — all set to `true` to satisfy the grid.
- `SectionTitle` has no `id` prop — used `aria-label` on the `<section>` instead of `aria-labelledby`.
- `MagneticTilt` uses `display: contents` so it doesn't break card layout.

## Build Verification

```
dist/projects/
  alqac-2023/index.html
  booking-duongcam-art/index.html
  face-detection-ml-system/index.html
  legal-prompts/index.html
  ocr-api/index.html
  text2sql-vietnamese/index.html
```

Hero card order: face-detection-ml-system (span-2), booking-duongcam-art, legal-prompts, alqac-2023, text2sql-vietnamese, ocr-api.

## Deferred

- Browser QA (tilt feel, card hover aurora glow, mobile layout) — Phase 09
- Real cover images — Phase 09
- Commit — not requested

## Unresolved Questions

None.
