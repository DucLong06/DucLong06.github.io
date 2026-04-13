# Phase 01 — Design Tokens & Theme

## Context Links
- Brainstorm §3 (Aesthetic), §3.2 (Colors), §3.3 (Typography), §3.4 (Spacing/Motion)
- Brainstorm: [`plans/reports/brainstormer-260414-0955-portfolio-redesign.md`](../reports/brainstormer-260414-0955-portfolio-redesign.md)
- Phase 00 (must be complete)

## Overview
- **Priority:** P1
- **Status:** Complete
- **Brief:** Establish "Soft Aurora" design system: CSS custom properties, Tailwind extension, Instrument Serif + Inter + JetBrains Mono, dark/light theme with `data-theme` attribute, reset, typography scale.

## Key Insights
- Single source of truth for colors lives in `tokens.css`; Tailwind reads from CSS vars (no duplicated palette)
- Theme persisted in `localStorage`, applied via inline script in `<head>` to avoid FOUC
- Light mode is the readability default; dark toggleable
- Fonts loaded via `@fontsource` packages (NOT Google Fonts CDN) for offline build + perf

## Requirements
**Functional**
- `tokens.css` exposes all colors, spacing, radius, shadows, motion easing
- Tailwind `theme.extend` references `var(--*)` so utility classes follow the theme
- `[data-theme="dark"]` swaps tokens
- Theme toggle works without flash on first paint
- Three font families load with `font-display: swap`

**Non-functional**
- Total font payload ≤ 80 KB (subset latin + latin-ext where possible)
- No `@import url(...)` from Google CDN (use `@fontsource`)
- Tokens documented in a comment block at top of file

## Architecture
```
tokens.css ──┐
             ├─→ global.css ──→ BaseLayout.astro <head>
typography.css ┘                          │
                                          ↓
tailwind.config.js ─→ (utility classes use var(--*))
                                          ↓
                              [data-theme="dark|light"] on <html>
                                          ↑
                                   inline init script (no FOUC)
                                          ↑
                              localStorage('theme')
```

## Related Code Files

**Create:**
- `src/styles/tokens.css` — CSS variables (colors, spacing, radius, motion, shadows)
- `src/styles/typography.css` — font-face declarations + display/body/mono scale
- `src/styles/global.css` — reset + imports tokens + typography
- `tailwind.config.js` — extend theme with var(--*) bindings
- `src/lib/theme-init.ts` — inline-injectable theme bootstrap script (string export)

**Modify:**
- `package.json` — add `@fontsource/instrument-serif`, `@fontsource/inter`, `@fontsource-variable/jetbrains-mono`
- `astro.config.mjs` — ensure tailwind integration loaded

## Implementation Steps

1. **Install fonts**:
   ```bash
   npm i @fontsource/instrument-serif @fontsource-variable/inter @fontsource-variable/jetbrains-mono
   ```
2. **Create `src/styles/tokens.css`** with the FULL palette from brainstorm §3.2 (light + dark blocks), spacing scale (§3.4), radii, motion easing `cubic-bezier(0.22, 1, 0.36, 1)`, multi-layer shadows with aurora tint.
3. **Create `src/styles/typography.css`** — import `@fontsource/...` files, define `--font-display`, `--font-body`, `--font-mono`, then a type scale (h1 = 88px Instrument Serif italic, h2/h3 sans, body 16/18 px).
4. **Create `src/styles/global.css`** — modern CSS reset, `:root` defaults, `@import './tokens.css'; @import './typography.css';`, base body styles using vars.
5. **Tailwind config** — extend `colors.bg.{base,elevated,subtle}`, `colors.text.{primary,secondary,tertiary}`, `colors.aurora.{1,2,3,4}`, `borderRadius.{sm,md,lg,xl}`, `transitionTimingFunction.soft`, `boxShadow.aurora`, `fontFamily.{display,body,mono}`. All values are `var(--*)` strings.
6. **Theme init script** — `src/lib/theme-init.ts` exports a string of JS that reads `localStorage.theme` (or `prefers-color-scheme`) and sets `document.documentElement.dataset.theme` BEFORE any paint. Must be inlined in `<head>` of `BaseLayout.astro` (next phase will use it).
7. **Wire global.css into Astro** — for now, import in placeholder `index.astro` to verify build.
8. **Smoke test**: open `localhost:4321`, check Network tab — fonts load from `@fontsource`, no Google CDN; toggle `data-theme` manually in devtools and verify all colors swap.

## Todo List
- [x] Install `@fontsource` packages
- [x] Write `src/styles/tokens.css` (light + dark)
- [x] Write `src/styles/typography.css` with font-face + scale
- [x] Write `src/styles/global.css` reset + imports
- [x] Extend `tailwind.config.js` with var(--*) bindings
- [x] Write `src/lib/theme-init.ts` (no-FOUC bootstrap)
- [x] Import `global.css` from placeholder page
- [ ] Verify dark/light swap in devtools  ← manual check (browser)
- [ ] Verify font payload ≤ 80 KB in Network tab  ← runtime only; latin ranges confirmed ≤ 80 KB
- [ ] Commit

## Success Criteria
**Definition of Done:**
- Manually setting `<html data-theme="dark">` in devtools swaps every color via CSS vars
- Tailwind class `bg-bg-base text-text-primary font-display` renders with Instrument Serif and the correct base color
- No Google Fonts requests in Network tab
- Build succeeds, no console warnings
- Theme init script measures < 1 KB

**Validation:**
- `npm run build && grep -r "fonts.googleapis" dist/ | wc -l` returns 0
- Inline script verified to set `data-theme` before first paint (test by hard-reload with throttled CPU)

## Risk Assessment
| Risk | Mitigation |
|---|---|
| FOUC on theme switch | Inline init script in `<head>` BEFORE styles |
| Tailwind var() not picked by JIT | Use `theme.extend.colors` not `theme.colors`; use string `'var(--bg-base)'` not function |
| Instrument Serif italic glyph subset missing | Use `@fontsource/instrument-serif/400-italic.css` explicitly |
| Font payload bloat | Subset to latin + latin-ext only; lazy-load mono until code block visible (defer to phase 09) |

## Security Considerations
- No remote font CDN → no privacy leak (recruiters in EU, GDPR-friendly)
- CSS vars contain no PII
- Inline script is hand-written, no `eval`

## Next Steps
- **Unblocks:** Phase 02 (content schemas can begin) and Phase 03 (visual layout)
- **Follows into:** Phase 02 — Content Schemas
