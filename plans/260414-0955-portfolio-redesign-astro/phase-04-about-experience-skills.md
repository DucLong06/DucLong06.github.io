# Phase 04 — About, Experience, Skills

## Context Links
- Brainstorm §6 (layout), §16.2 (stats strip), §16.3 (experience), §16.4 (education), §16.7 (skills)
- Phase 02 (content collections must be seeded)
- Phase 03 (BaseLayout in place)

## Overview
- **Priority:** P1
- **Status:** Complete
- **Brief:** Three content sections under the hero: About (bio + stats), Experience (vertical timeline with stagger reveal), Tech Marquee (CSS infinite scroll), Skills (grouped chart). All driven by content collections from phase 02.

## Key Insights
- About stats strip uses real numbers from §16.2 (6,000+ MRs, 5,000+ users, 90% accuracy, 75.5% RAG, 200+ repos, 98% OCR, 1st ALQAC, Sao Khuê)
- Timeline reveal uses framer-motion `whileInView` with stagger 0.1
- Marquee is CSS-only (no JS lib) — keyframes `translateX(-50%)` infinite linear
- Skills chart = simple bar (level/5) per item, NOT a chart library — KISS

## Requirements
**Functional**
- `<About />` reads bio EN markdown + profile yaml + renders stats grid
- `<Experience />` queries `getCollection('experience')`, sorts by `order`, renders timeline cards
- `<Marquee />` static list of tech logo names (or text) cycling infinitely
- `<Skills />` renders 6 groups from `skills/main.yaml`, each with bar chart
- Stagger reveal hooks into framer-motion island ONLY for sections that need motion

**Non-functional**
- Marquee CSS-only, no JS hydration
- Skills section bundle ≤ 5 KB JS (or zero if no animation)
- Timeline reveals smoothly at 60 fps

## Architecture
```
index.astro
 ├─ <Hero />           (phase 03)
 ├─ <About />          ← bio.en.md + profile.yaml + stats
 ├─ <Marquee />        (Astro static, CSS keyframes)
 ├─ <Experience />     ← collection('experience') + TimelineAnimated island
 └─ <Skills />         ← skills/main.yaml + bar bars

TimelineAnimated.tsx (React island, client:visible)
  └─ framer-motion stagger reveal
```

## Related Code Files

**Create:**
- `src/components/astro/About.astro`
- `src/components/astro/Marquee.astro`
- `src/components/astro/Experience.astro`
- `src/components/astro/Skills.astro`
- `src/components/astro/SectionTitle.astro` — reusable headline
- `src/components/astro/StatCard.astro`
- `src/components/astro/TimelineCard.astro`
- `src/components/astro/SkillBar.astro`
- `src/components/react/TimelineAnimated.tsx` — wraps children in motion stagger
- `src/styles/marquee.css` — `@keyframes` infinite scroll

**Modify:**
- `src/pages/index.astro` — append `<About />`, `<Marquee />`, `<Experience />`, `<Skills />`

## Implementation Steps

1. **`SectionTitle.astro`** — props `eyebrow`, `title`, `lang`. Use `font-display` italic for title.
2. **`About.astro`**:
   - Read `bio.en.md` via direct import / `Astro.glob('../content/about/bio.en.md')`
   - Two-column grid (md+): left = rendered bio markdown, right = avatar + 8 stat cards
   - Stats from §16.2: 6000+ MRs, 5000+ users, 90% sec acc, 75.5% RAG, 200+ repos, 98% OCR, 1st ALQAC, Sao Khuê
3. **`StatCard.astro`** — number (display font), label (mono small), border, soft hover lift.
4. **`Marquee.astro`** + `marquee.css`:
   - List of tech names: Python, C++, .NET, TypeScript, Django, FastAPI, Vue3, React, Docker, K8s, GCP, Vertex AI, Langchain, YOLOv11, OpenCV, PostgreSQL
   - Duplicate inline list 2× for seamless wrap
   - `@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`
   - `animation: scroll 40s linear infinite; @media (prefers-reduced-motion) { animation: none; }`
5. **`Experience.astro`**:
   - `const items = (await getCollection('experience')).sort((a,b) => a.data.order - b.data.order)`
   - Render `<TimelineAnimated client:visible>` containing `<TimelineCard>` per item
   - Each card: company logo, role, period, stack pills, rendered MD body (sub-projects bullets)
6. **`TimelineAnimated.tsx`**:
   ```tsx
   import { motion } from 'framer-motion';
   // children wrapped in motion.div with whileInView, stagger 0.1
   ```
7. **`Skills.astro`**:
   - Read `getEntry('skills', 'main')` → 6 groups
   - Grid 2 cols on md+, each group = title + list of `<SkillBar>` items
8. **`SkillBar.astro`** — name + 5 dots / bar fill `width: ${level/5*100}%` using aurora gradient.
9. **Wire into `index.astro`** — append sections in order.
10. **Visual QA**: scroll smoothly, no layout shift, all stats visible, marquee runs.

## Todo List
- [x] `SectionTitle.astro`
- [x] `About.astro` + `StatCard.astro` (8 real stats)
- [x] `Marquee.astro` + `marquee.css`
- [x] `Experience.astro` + `TimelineCard.astro`
- [x] `TimelineAnimated.tsx` framer-motion island
- [x] `Skills.astro` + `SkillBar.astro`
- [x] Wire all into `index.astro`
- [x] Verify content from collections renders (build exits 0, all 3 experience entries + 6 skill groups resolved)
- [ ] Verify `prefers-reduced-motion` disables marquee + reveal — deferred (browser-only)
- [ ] Commit

## Success Criteria
**Definition of Done:**
- All 8 stats from §16.2 visible
- Experience shows 3 entries in correct order with sub-project bullets
- Marquee scrolls infinitely, pauses with reduced-motion
- Skills shows 6 groups with bars filled per level
- No CLS issues; sections snap into place on reveal
- Build succeeds

**Validation:**
- Visual diff against brainstorm §6 ASCII layout
- Lighthouse perf still ≥ 90
- `prefers-reduced-motion` toggles motion off cleanly

## Risk Assessment
| Risk | Mitigation |
|---|---|
| framer-motion bundle bloat | Single shared island, only `whileInView` + `motion` imports |
| Marquee CLS on small screens | Fixed height, overflow hidden |
| Skills bar overflow | Cap label width, truncate with ellipsis |
| Timeline order mistakes | Schema requires `order: number`, sort explicitly |

## Security Considerations
- Markdown body rendered via Astro built-in sanitizer (safe by default)
- No external iframes
- No user input

## Next Steps
- **Unblocks:** Phase 05 (projects bento next), Phase 06 (papers reuse SectionTitle)
- **Follows into:** Phase 05 — Projects Bento Grid
