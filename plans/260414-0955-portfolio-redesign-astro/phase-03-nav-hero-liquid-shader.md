# Phase 03 — Nav, Hero & Liquid Shader

## Context Links
- Brainstorm §6.1 (Nav), §6.2 (Hero), §7 (Shader spec + GLSL), §16.9 (Hero copy)
- Brainstorm: [`plans/reports/brainstormer-260414-0955-portfolio-redesign.md`](../reports/brainstormer-260414-0955-portfolio-redesign.md)

## Overview
- **Priority:** P1
- **Status:** Complete (browser verifications deferred to Phase 09)
- **Brief:** Build `BaseLayout.astro`, sticky frosted-blur `Nav`, hero with giant Instrument Serif italic name, and the OGL liquid aurora shader as a React island. Includes PNG fallback for `prefers-reduced-motion`, mouse distortion, IntersectionObserver pause.

## Key Insights
- Shader is THE signature visual — must be flawless or we ship the fallback
- OGL chosen over Three.js: ~3 KB vs ~150 KB
- React island hydrated with `client:visible` so shader only loads when hero in viewport
- Pre-bake one frame as PNG at design time → serve that on `prefers-reduced-motion` (no GPU work)
- DPR clamped to 1.5 on mobile to keep 60 fps
- Hero copy locked in §16.9

## Requirements
**Functional**
- `BaseLayout.astro` provides `<html data-theme>`, `<head>` with theme init script + meta, `<slot />`
- `Nav.astro`: sticky top, `backdrop-filter: blur(16px)`, links (About, Work, Papers, Contact), theme toggle, lang toggle (lang toggle is stub until phase 08)
- `Hero.astro`: full-viewport section, name in Instrument Serif italic 88px, subline, 3 CTAs (View work, Download CV, Email)
- `LiquidShader.tsx`: OGL canvas, fragment shader from §7.3, uniforms `uTime`, `uMouse`, `uResolution`, mouse normalized [-1..1], IntersectionObserver pauses raf when out of view
- Fallback: if `window.matchMedia('(prefers-reduced-motion: reduce)').matches` OR WebGL unavailable → render `<img src="/aurora-fallback.png" />`

**Non-functional**
- Shader bundle ≤ 8 KB gzipped (OGL + glsl + island)
- 60 fps desktop, ≥ 45 fps mobile mid-range
- Nav LCP < 100 ms, Hero LCP < 1.8 s on 4G

## Architecture
```
BaseLayout.astro
 ├─ <head> theme-init inline + meta + global.css
 └─ <body>
      ├─ <Nav />                (Astro, static, has small ThemeToggle island)
      ├─ <slot />               (page content)
      └─ <Footer />             (later phase)

index.astro (EN home)
 └─ <Hero>
      ├─ <LiquidShader client:visible />   ← React island
      └─ Hero text content (Astro static)
```

Data flow:
- `getCollection('profile')` → name/tagline → Hero text
- `LiquidShader` is content-free, pure visual

## Related Code Files

**Create:**
- `src/layouts/BaseLayout.astro`
- `src/components/astro/Nav.astro`
- `src/components/astro/Hero.astro`
- `src/components/astro/Footer.astro` (skeletal — fill in phase 07)
- `src/components/react/ThemeToggle.tsx`
- `src/components/react/LangToggle.tsx` (stub: just renders EN | VI buttons, no-op)
- `src/components/react/LiquidShader.tsx` — OGL renderer
- `src/shaders/aurora.frag.glsl` — fragment from brainstorm §7.3
- `src/shaders/aurora.vert.glsl` — minimal passthrough vert
- `public/aurora-fallback.png` — pre-baked single frame (or generate one-off)

**Modify:**
- `src/pages/index.astro` — wire `BaseLayout` + `Hero`
- `astro.config.mjs` — `vite.ssr.noExternal: ['ogl']`

## Implementation Steps

1. **`BaseLayout.astro`** — define props `title`, `description`, `lang='en'`. Inline theme-init script in `<head>`. Import `global.css`. Add `<html lang={lang} data-theme="light">`.
2. **`Nav.astro`** — sticky `top-0 z-50`, backdrop blur via `bg-bg-base/60 backdrop-blur-xl`, border-b. Links right-aligned. Mount `<ThemeToggle client:idle />` and `<LangToggle client:idle />`.
3. **`ThemeToggle.tsx`** — reads `documentElement.dataset.theme`, toggles, writes `localStorage.theme`. Sun/moon icon from `lucide-react`.
4. **GLSL files** — paste `aurora.frag.glsl` from brainstorm §7.3 IN FULL (include the omitted snoise from a standard Ashima impl). `aurora.vert.glsl`:
   ```glsl
   attribute vec2 position;
   varying vec2 vUv;
   void main() {
     vUv = position * 0.5 + 0.5;
     gl_Position = vec4(position, 0.0, 1.0);
   }
   ```
5. **`LiquidShader.tsx`**:
   - Import via `?raw`: `import frag from '../../shaders/aurora.frag.glsl?raw'`
   - On mount: feature-detect WebGL + reduced-motion → if blocked, render `<img>`
   - Create OGL `Renderer`, `Program`, full-screen `Triangle` mesh
   - `dpr = Math.min(window.devicePixelRatio, 1.5)`
   - `requestAnimationFrame` loop updating `uTime`, `uMouse` (lerped toward target)
   - Mouse listener on `window` (normalized to [-1,1])
   - `IntersectionObserver` on canvas: pause raf when not intersecting
   - `document.visibilitychange` → also pause
   - Cleanup on unmount
6. **`Hero.astro`** — full-screen flex centered. `<LiquidShader client:visible />` absolutely positioned behind text. Text uses §16.9 copy. CTAs link to `/cv.pdf`, `#work`, `mailto:`.
7. **Fallback PNG** — generate one frame by running the shader locally and screenshot, save to `public/aurora-fallback.png` (~80 KB compressed).
8. **Wire `index.astro`** — `<BaseLayout><Hero /></BaseLayout>`.
9. **Verify**: dev tools → Performance tab shows 60 fps in hero, raf paused on scroll past hero.
10. **A11y check**: tab order = nav → hero CTAs; canvas has `aria-hidden="true"`.

## Todo List
- [x] Write `BaseLayout.astro` with theme init
- [x] Write `Nav.astro` sticky frosted blur
- [x] Write `ThemeToggle.tsx` island
- [x] Write `LangToggle.tsx` stub
- [x] Write `aurora.vert.glsl` + `aurora.frag.glsl` (full Ashima snoise)
- [x] Write `LiquidShader.tsx` (OGL + mouse + IO + reduced-motion fallback)
- [ ] Generate `public/aurora-fallback.png` — deferred: placeholder created (315 KB gradient PNG); Phase 09 must replace with real GPU shader screenshot
- [x] Write `Hero.astro` with §16.9 copy
- [x] Wire `index.astro` to `BaseLayout` + `Hero`
- [x] Update `astro.config.mjs` ssr noExternal ogl
- [ ] Verify 60 fps and IO pause — deferred: needs browser/GPU devtools
- [ ] Verify `prefers-reduced-motion` shows PNG — deferred: needs browser/GPU devtools
- [ ] Commit

## Success Criteria
**Definition of Done:**
- Loading `/` shows hero with shader animating
- Mouse moves create soft distortion in shader
- Scrolling past hero stops the raf loop (verify in Performance)
- Devtools rendering "emulate prefers-reduced-motion" → shader replaced with PNG, no canvas
- WebGL disabled (Chrome flag) → PNG fallback shown
- Tab key reaches all interactive nav + hero CTAs
- `npm run build` succeeds, shader file emitted to dist

**Validation:**
- Lighthouse perf on hero ≥ 90 (full ≥95 in phase 09)
- `gzip -c dist/assets/LiquidShader-*.js | wc -c` < 8000

## Risk Assessment
| Risk | Mitigation |
|---|---|
| Shader compile error in Safari | Test in Safari; use `precision highp float` guard with mediump fallback |
| OGL bundling broken in Astro SSR | `vite.ssr.noExternal: ['ogl']` |
| Reduced-motion not respected → a11y fail | Feature-detect on mount AND listen for `change` event |
| Mouse jitter on touch devices | Disable mouse listener on touchscreens (`'ontouchstart' in window`) |
| Hero LCP regression from canvas | Hero text is plain HTML (LCP element); canvas is BG only |

## Security Considerations
- Shader strings imported via `?raw` — no eval, safe
- No user input feeds into shader uniforms (only `mousemove` coords)
- Canvas is `aria-hidden`, not focusable

## Next Steps
- **Unblocks:** Phases 04, 05, 06, 07 (all need `BaseLayout`)
- **Follows into:** Phase 04 — About, Experience, Skills
