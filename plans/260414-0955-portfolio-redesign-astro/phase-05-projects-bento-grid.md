# Phase 05 — Projects Bento Grid

## Context Links
- Brainstorm §6 (bento layout), §16.6 (featured 6 projects)
- Phase 02 (project content seeded)
- Phase 04 (`SectionTitle.astro` available)

## Overview
- **Priority:** P1
- **Status:** Complete
- **Brief:** Featured projects bento 3×2: `face-detection-ml-system` spans 2 cols (hero card), 5 others fill the rest. Card hover = subtle tilt + aurora glow. Add `/projects/[slug]` dynamic route for project detail pages.

## Key Insights
- Order locked: face-detection-ml-system (span 2), booking.duongcam.art, Legal-Prompts, ALQAC2023, Text2SQL-Vietnamese, ocr-api
- Tilt is CSS 3D transform via mousemove, NOT a library — KISS
- Project detail page renders MDX body from collection
- Cover images are placeholder gradients until phase 09

## Requirements
**Functional**
- `<ProjectsGrid />` queries `getCollection('projects', e => e.data.featured === true)`, orders by an explicit array (NOT date) so layout is deterministic
- Bento grid: CSS grid `grid-template-columns: repeat(3, 1fr)` with first card spanning 2 cols
- Each `ProjectCard.astro` shows cover, title, summary.en, stack pills, GitHub stars badge if present, repo + demo links
- Cards link to `/projects/[slug]`
- Dynamic page `[slug].astro` renders body markdown, full metadata, back link
- Card tilt via `MagneticTilt.tsx` (small island, `client:visible`)

**Non-functional**
- Tilt 60 fps, max ±8°
- Detail page LCP < 1.8 s
- Tilt disabled on touch devices and reduced-motion

## Architecture
```
index.astro
 └─ <ProjectsGrid />
      └─ <ProjectCard /> × 6
            └─ <MagneticTilt client:visible> (wraps card)

src/pages/projects/[slug].astro
 ├─ getStaticPaths() → 6 routes
 └─ <Content /> rendered MDX body
```

## Related Code Files

**Create:**
- `src/components/astro/ProjectsGrid.astro`
- `src/components/astro/ProjectCard.astro`
- `src/components/react/MagneticTilt.tsx`
- `src/pages/projects/[slug].astro` — dynamic project detail
- `src/lib/featured-projects-order.ts` — explicit slug order array

**Modify:**
- `src/pages/index.astro` — append `<ProjectsGrid />`
- `astro.config.mjs` — confirm `mdx()` integration enabled (from phase 00)

## Implementation Steps

1. **`src/lib/featured-projects-order.ts`**:
   ```ts
   export const FEATURED_ORDER = [
     'face-detection-ml-system',
     'booking-duongcam-art',
     'legal-prompts',
     'alqac-2023',
     'text2sql-vietnamese',
     'ocr-api',
   ] as const;
   ```
2. **`ProjectsGrid.astro`**:
   - `const all = await getCollection('projects', e => e.data.featured)`
   - Sort by `FEATURED_ORDER` index
   - Render grid `grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[20rem]`
   - First card gets `md:col-span-2 md:row-span-1` (hero card)
3. **`ProjectCard.astro`**:
   - Cover image (Astro `<Image>` lazy)
   - Stars badge (if `data.stars`)
   - Title (display font, large)
   - Summary (en for now; phase 08 swaps by lang)
   - Stack pills (max 6 visible, "+N more")
   - Bottom row: repo icon, demo icon
   - Wrap entire card in `<a href={`/projects/${slug}/`}>` and `<MagneticTilt client:visible>`
4. **`MagneticTilt.tsx`**:
   - useRef to wrapper, mousemove → calculate `(x - centerX)/width` and `(y - centerY)/height`
   - Apply `transform: perspective(800px) rotateX(...) rotateY(...)` capped at ±8°
   - On mouseleave → reset
   - Skip if `'ontouchstart' in window` or reduced-motion
5. **`src/pages/projects/[slug].astro`**:
   - `export async function getStaticPaths()` returns all projects (not just featured) so unlisted detail pages still build
   - Page renders cover, metadata, then `<Content />` from MDX body
   - Sticky "← Back to work" link
6. **Index wiring** — append `<ProjectsGrid />` after `<Skills />` with `id="work"` for hero CTA anchor.
7. **QA**: hover all 6 cards, click into each detail page, back link works.

## Todo List
- [x] Create `featured-projects-order.ts`
- [x] `ProjectsGrid.astro` with bento layout
- [x] `ProjectCard.astro` (cover, stars, stack pills, links)
- [x] `MagneticTilt.tsx` island
- [x] `pages/projects/[slug].astro` dynamic route
- [x] Wire `<ProjectsGrid id="work" />` into index
- [x] Verify all 6 cards render in correct order (confirmed via build log order)
- [x] Verify each `/projects/<slug>` builds (6 dirs in dist/projects/)
- [ ] Verify tilt disabled on touch + reduced-motion — deferred: browser QA in Phase 09
- [ ] Commit — deferred per task instructions

## Success Criteria
**Definition of Done:**
- 6 cards visible in correct order, hero card spans 2 cols on md+
- All 6 detail routes build (`dist/projects/<slug>/index.html` exist)
- Hover tilt smooth on desktop, off on mobile
- Repo + demo links open correctly
- Anchor `#work` from hero CTA scrolls here

**Validation:**
- `npm run build && ls dist/projects/` shows 6 dirs
- Lighthouse ≥ 90 with images placeholder

## Risk Assessment
| Risk | Mitigation |
|---|---|
| Layout collapse on mobile | Stack to single column < md breakpoint |
| Tilt jitter | RAF-throttled mousemove; transform on a child not the link |
| Missing covers break grid | Default placeholder gradient SVG |
| Detail page MDX fails to render | Test one MDX with fenced code block + image early |

## Security Considerations
- All external repo/demo links use `rel="noopener noreferrer" target="_blank"`
- MDX body sanitized by Astro defaults
- No iframes loaded from project content

## Next Steps
- **Unblocks:** Phase 06 papers + GH stats can also use card pattern
- **Follows into:** Phase 06 — Papers & GitHub Stats
