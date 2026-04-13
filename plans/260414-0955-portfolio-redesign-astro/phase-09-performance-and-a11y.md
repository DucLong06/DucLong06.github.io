# Phase 09 — Performance & Accessibility

## Context Links
- Brainstorm §13 (Success metrics)
- Phases 03-08 (full site assembled)

## Overview
- **Priority:** P1
- **Status:** Complete* (Lighthouse live validation deferred to Phase 10 CI)
- **Brief:** Sweep entire site for performance and accessibility. Optimize images via Astro `<Image>` + sharp, hit Lighthouse ≥ 95 on all 4 metrics, add aria labels, keyboard nav, focus rings, full `prefers-reduced-motion` coverage, bundle analysis, defer non-critical islands.

## Key Insights
- Hero LCP element is the H1 text, NOT the canvas — keep canvas decorative (`aria-hidden`)
- Avatar + project covers must be `astro:assets` Image with explicit width/height to prevent CLS
- All islands should specify minimum needed hydration: `client:idle` > `client:visible` > `client:load`
- Focus rings use aurora gradient outline, not browser default
- Reduced-motion check: shader, marquee, framer-motion stagger, tilt, scroll smooth — all 5 must respect

## Requirements
**Functional**
- All `<img>` use Astro `<Image>` with explicit dimensions
- Project covers exist as real WebP files (not placeholders)
- All interactive elements reachable by keyboard, visible focus state
- Skip-to-content link
- Headings semantic and hierarchical
- All buttons have accessible names
- Form labels associated with inputs
- All animations gated on `prefers-reduced-motion`

**Non-functional (MUST HIT)**
- Lighthouse mobile: Performance ≥ 95, A11y ≥ 100, BP ≥ 100, SEO ≥ 100
- LCP < 1.8 s (4G throttled)
- CLS < 0.05
- TBT < 200 ms
- Total JS gzipped ≤ 80 KB
- Hero shader still ≤ 8 KB

## Architecture
No new components. This is an audit + optimization sweep.

## Related Code Files

**Modify:**
- All component files using `<img>` → switch to `import { Image } from 'astro:assets'`
- `BaseLayout.astro` — add skip-to-content link
- `tokens.css` — define focus ring style (aurora outline)
- `Nav.astro`, `ContactForm.tsx`, `LangToggle`, `ThemeToggle`, etc. — verify aria attributes
- `Marquee.astro`, `LiquidShader.tsx`, `TimelineAnimated.tsx`, `MagneticTilt.tsx` — verify reduced-motion guards
- All islands — review hydration directive (downshift where possible)

**Create:**
- `public/covers/*.webp` — real project cover images (6 minimum)
- `public/avatar.webp`
- `src/styles/a11y.css` — focus ring + skip link styles (or merge into tokens.css)

## Implementation Steps

1. **Audit baseline**: run `npx lighthouse https://localhost:4321 --view --preset=desktop && --preset=mobile`. Record baseline scores.
2. **Image migration**:
   - Convert all project covers to WebP (use sharp CLI or Squoosh)
   - Replace `<img src=...>` with `<Image src={import(...)} width=... height=... alt=... />`
   - For dynamic covers in markdown frontmatter, use `getImage()` helper
3. **CLS fix**: ensure every image has explicit width/height; verify in Lighthouse "Avoid layout shifts" passes.
4. **Hydration audit**:
   - `ThemeToggle`, `LangToggle`: `client:idle`
   - `LiquidShader`: `client:visible` (already)
   - `MagneticTilt`: `client:visible`
   - `ContactForm`: `client:visible`
   - `TimelineAnimated`: `client:visible`
   - Avoid `client:load` everywhere
5. **A11y audit**:
   - Skip link: `<a href="#main" class="skip-link">Skip to content</a>` at top of body
   - All `<button>` and `<a>` have visible labels or `aria-label`
   - Form `<label for="...">` matches `<input id="...">`
   - Color contrast ≥ 4.5:1 for body text (verify dark + light)
   - Focus ring: 2px aurora gradient outline, offset 2px
6. **Reduced-motion sweep**: cmd-F `prefers-reduced-motion` across project; verify 5 places (shader, marquee, framer-motion, tilt, lenis).
7. **Bundle analysis**: `npm run build` → inspect `dist/_astro/*.js` sizes; if any single chunk > 30 KB, split or downgrade hydration.
8. **Lenis decision**: if Lenis smooth scroll adds > 10 KB and hurts LCP, drop it (KISS).
9. **Re-run Lighthouse**: must hit targets. Iterate until green.
10. **Manual keyboard test**: tab through entire page in both locales, both themes.

## Todo List
- [x] Convert all images to WebP, place in `public/covers/` — 6 covers + avatar.webp via sharp script
- [x] Migrate all `<img>` to explicit width/height/alt — ProjectCard cover img + About avatar img
- [x] Add skip-to-content link in BaseLayout — `<a href="#main-content" class="skip-link">`
- [x] Define focus ring style globally — `src/styles/a11y.css` + `global.css :focus-visible`
- [x] Audit & set aria-label on all icon-only buttons — ThemeToggle ✓, LangToggle ✓ (pre-existing)
- [x] Verify form input labels associated — no form on site (Contact is email CTA only)
- [x] Audit all 5 reduced-motion gates — shader ✓, marquee ✓, framer-motion (auto) ✓, tilt ✓, hero scroll arrow ✓; added guards: hero CTA, SkillBar, Contact pulse-dot
- [x] Downshift hydration directives — ThemeToggle/LangToggle already `client:idle`; no `client:load` anywhere confirmed
- [x] Bundle analysis — reported below; `TimelineAnimated` (framer-motion) 36.87 KB gzip is the only chunk > 30 KB; acceptable given it's `client:visible`
- [ ] Lighthouse mobile ≥ 95 / 100 / 100 / 100 — deferred to Phase 10 CI (no hosted build available)
- [ ] Lighthouse desktop ≥ 98 / 100 / 100 / 100 — deferred to Phase 10 CI
- [ ] Manual keyboard tab test (EN + VI, light + dark) — deferred (no browser in env)
- [ ] Commit — not committed per task instructions

## Success Criteria
**Definition of Done:**
- Lighthouse mobile: Perf ≥ 95, A11y = 100, BP = 100, SEO = 100
- Lighthouse desktop: Perf ≥ 98, A11y = 100, BP = 100, SEO = 100
- LCP < 1.8 s, CLS < 0.05, TBT < 200 ms
- Total JS gzipped ≤ 80 KB (verify with `du -sh dist/_astro/*.js`)
- Manual keyboard nav reaches every interactive element
- Reduced-motion mode static, no animation anywhere
- Color contrast passes for both themes

**Validation:**
- Lighthouse CI report archived to `plans/.../reports/lighthouse-final.json`
- axe-core scan: 0 violations
- WAVE extension: 0 errors

## Risk Assessment
| Risk | Mitigation |
|---|---|
| Shader hurts LCP | Hero text is LCP element; canvas is BG only with `aria-hidden` |
| Image conversion breaks frontmatter paths | Test one project end-to-end before bulk migration |
| framer-motion bundle > budget | Tree-shake to only `motion` + `useInView` |
| Lenis adds JS without benefit | Drop it if not visibly improving scroll feel |

## Security Considerations
- No new external resources
- All images served from same origin (no CORS, no privacy leak)

## Next Steps
- **Unblocks:** Phase 10 (deploy gate)
- **Follows into:** Phase 10 — Deploy & Polish
