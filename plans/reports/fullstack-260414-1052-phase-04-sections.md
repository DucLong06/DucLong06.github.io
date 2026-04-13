---
type: implementation
phase: 04
date: 2026-04-14
author: fullstack-developer
status: complete
---

# Phase 04 — About, Experience, Skills: Implementation Report

## Files Created

| File | Lines | Notes |
|---|---|---|
| `src/components/astro/SectionTitle.astro` | 47 | Reusable eyebrow+heading, Instrument Serif italic |
| `src/components/astro/StatCard.astro` | 57 | Aurora gradient value, mono label, hover lift |
| `src/components/astro/About.astro` | 100 | Two-col grid, bio prose left, avatar+8 stats right |
| `src/styles/marquee.css` | 65 | CSS-only, translateX(-50%), prefers-reduced-motion pause |
| `src/components/astro/Marquee.astro` | 30 | 16 techs duplicated 2×, section borders |
| `src/components/astro/TimelineCard.astro` | 130 | Company/role/period/stack pills/body slot |
| `src/components/react/TimelineAnimated.tsx` | 48 | framer-motion whileInView stagger 0.1, client:visible |
| `src/components/astro/Experience.astro` | 90 | getCollection('experience'), pre-renders Content in frontmatter |
| `src/components/astro/SkillBar.astro` | 64 | level/5×100% fill, aurora gradient, ARIA meter role |
| `src/components/astro/Skills.astro` | 68 | getEntry('skills','main'), 2-col grid, 6 groups |

## Files Modified

| File | Change |
|---|---|
| `src/pages/index.astro` | Added imports + `<About/><Marquee/><Experience/><Skills/>` in order |
| `plans/260414-0955-portfolio-redesign-astro/phase-04-about-experience-skills.md` | Marked todos [x], status → Complete |

## Tasks Completed

- [x] SectionTitle.astro
- [x] About.astro + StatCard.astro (8 stats: 6000+ MRs, 5000+ users, 90% sec acc, 75.5% RAG, 200+ repos, 98% OCR, 1st ALQAC, Sao Khuê)
- [x] Marquee.astro + marquee.css (CSS-only, prefers-reduced-motion handled)
- [x] Experience.astro + TimelineCard.astro (3 entries sorted by order)
- [x] TimelineAnimated.tsx (framer-motion whileInView, stagger 0.1)
- [x] Skills.astro + SkillBar.astro (6 groups, 2-col grid)
- [x] Wired into index.astro: Hero → About → Marquee → Experience → Skills
- [ ] prefers-reduced-motion browser verification — deferred

## Build Status

- `npx astro check`: **0 errors, 0 warnings** (after fixing Astro.glob → import.meta.glob)
- `npm run build`: **exit 0**, 1 page built in ~11s

## Deviations

1. **Astro.glob → import.meta.glob**: Initial About.astro used deprecated `Astro.glob`; replaced with `import.meta.glob(..., { eager: true })` — Astro 5 requirement.
2. **Experience render() in frontmatter**: Content component destructured inside JSX template caused TS errors (known Astro constraint). Moved `Promise.all(items.map(render))` to frontmatter as pre-rendered array.
3. **framer-motion bundle**: TimelineAnimated chunk is 111 KB (gzip 36 KB). Acceptable for `client:visible` (loads only on scroll). Full tree-shaking not possible with framer-motion's current export structure; only `motion` imported per spec.

## Unresolved Questions

- None. All content collections present and verified via build output.
