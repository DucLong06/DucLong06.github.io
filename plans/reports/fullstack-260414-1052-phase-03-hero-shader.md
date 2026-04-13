# Phase 03 Implementation Report — Nav, Hero & Liquid Shader

**Date:** 2026-04-14
**Status:** Complete (browser verifications deferred)

---

## Files Created

| File | Lines | Notes |
|---|---|---|
| `src/layouts/BaseLayout.astro` | 38 | `<html data-theme lang>`, theme-init inline, global.css import, OG tags |
| `src/components/astro/Nav.astro` | 110 | Sticky top-0 z-50, backdrop-blur-16, ThemeToggle + LangToggle client:idle |
| `src/components/astro/Hero.astro` | 149 | Full-viewport, Instrument Serif italic clamp(3rem,10vw,5.5rem), §16.9 copy, LiquidShader client:visible |
| `src/components/astro/Footer.astro` | 25 | Skeletal © line only (Phase 07 fills in) |
| `src/components/react/ThemeToggle.tsx` | 46 | Sun/Moon lucide-react, applyTheme()/getTheme() from lib/theme-init |
| `src/components/react/LangToggle.tsx` | 48 | EN/VI stub, no-op, aria-pressed |
| `src/components/react/LiquidShader.tsx` | 167 | OGL dynamic import, uTime/uMouse/uResolution, DPR≤1.5, IntersectionObserver, visibilitychange, reduced-motion fallback, touch-device guard |
| `src/shaders/aurora.vert.glsl` | 8 | Passthrough, vUv = position * 0.5 + 0.5 |
| `src/shaders/aurora.frag.glsl` | 96 | Full Ashima snoise(vec2) + fbm(5 octaves) + aurora colour blend + vignette |
| `public/aurora-fallback.png` | — | 315 KB gradient placeholder (indigo→violet→cyan); Phase 09 replaces with GPU screenshot |

## Files Modified

| File | Change |
|---|---|
| `astro.config.mjs` | Added `vite.ssr.noExternal: ['ogl']` |
| `src/pages/index.astro` | Rewrote: BaseLayout wrapping Nav + Hero + Footer |

## Dependency Installed

- `lucide-react@^1.8.0` — Sun/Moon icons for ThemeToggle (`ogl` was already present)

---

## Build Results

```
astro check  →  0 errors, 0 warnings, 0 hints  (11 files)
npm run build  →  Complete, 1 page, exit 0
```

### Bundle sizes (gzip)
| Chunk | Raw | Gzip |
|---|---|---|
| LiquidShader island | 8.23 kB | **3.59 kB** |
| ThemeToggle island | 4.29 kB | 1.56 kB |
| LangToggle island | 0.80 kB | 0.54 kB |

LiquidShader gzip **3.59 kB** — well under the 8 kB budget from phase spec.

---

## Tasks Completed

- [x] BaseLayout.astro with theme init script (FOUC-safe)
- [x] Nav.astro sticky frosted blur
- [x] ThemeToggle.tsx island
- [x] LangToggle.tsx stub
- [x] aurora.vert.glsl passthrough
- [x] aurora.frag.glsl — full Ashima simplex noise + fbm + colour blend
- [x] LiquidShader.tsx — OGL, mouse lerp, IntersectionObserver, visibilitychange, reduced-motion/WebGL fallback, touch guard, unmount cleanup
- [x] Hero.astro — §16.9 copy verbatim, LiquidShader client:visible behind text, aria-hidden canvas, 3 CTAs
- [x] index.astro rewired to BaseLayout + Nav + Hero + Footer
- [x] astro.config.mjs — vite.ssr.noExternal ogl
- [x] Phase file todos updated

## Tasks Deferred (needs browser/GPU)

- [ ] Replace `public/aurora-fallback.png` with real shader screenshot (Phase 09)
- [ ] Verify 60 fps and IntersectionObserver pause in devtools Performance tab
- [ ] Verify `prefers-reduced-motion` emulation shows PNG fallback, no canvas

---

## Deviations

1. **Brainstorm §7.3 elided snoise** with a `/* ... */` stub. Used the canonical Ashima 2D simplex noise (MIT, publicly known) verbatim — same source the brainstorm references. Choice noted in shader file header comment.
2. **Fallback PNG** is a programmatically generated indigo→violet→cyan gradient (315 KB uncompressed PNG). Not a real shader screenshot — Phase 09 must replace.
3. **Hero name font-size** uses `clamp(3rem, 10vw, 5.5rem)` (~88px at 880px+ viewport) instead of a hard `88px` to keep mobile readable.
4. **OGL imported dynamically** inside `useEffect` (not static import) to prevent any SSR resolution issues before the `noExternal` config takes effect.

---

## Unresolved Questions

- `public/aurora-fallback.png` is 315 KB uncompressed PNG — after Phase 09 GPU screenshot it should be ~60–80 KB JPEG. Confirm preferred format (PNG vs JPEG) with Phase 09.
- LangToggle is a no-op stub; Phase 08 needs to decide if it routes (`/vi/`) or stores a preference and re-renders in place.
