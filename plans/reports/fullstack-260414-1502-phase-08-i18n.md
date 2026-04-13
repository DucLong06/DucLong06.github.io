# Phase 08 — i18n EN/VI Implementation Report
Date: 2026-04-14 | Agent: fullstack-developer

## Status: Complete

## Files Created
- `src/i18n/strings.ts` — 60 UI string keys × 2 langs (en + vi)
- `src/lib/i18n-helpers.ts` — `getLang()`, `t()`, `mirrorUrl()` + re-exports `Lang`
- `src/pages/vi/index.astro` — VI home page (`/vi/`)
- `src/pages/vi/projects/[slug].astro` — VI project detail (`/vi/projects/<slug>/`)

## Files Modified
- `astro.config.mjs` — added `i18n: { defaultLocale: 'en', locales: ['en','vi'], routing: { prefixDefaultLocale: false } }`
- `src/layouts/BaseLayout.astro` — added `mirrorUrl` import; emits `hreflang="en"`, `hreflang="vi"`, `hreflang="x-default"` link tags
- `src/pages/index.astro` — passes `lang='en'` to all components + Footer `currentPath`
- `src/pages/projects/[slug].astro` — `lang='en'`, `t()` for back/source/demo labels, hoisted `summaryText`
- `src/components/astro/Nav.astro` — `lang` prop, `t()` nav labels, locale-aware home href
- `src/components/astro/Hero.astro` — `lang` prop, `name[lang]`/`tagline[lang]`, all CTAs via `t()`
- `src/components/astro/About.astro` — `lang` prop, glob-selects `bio.en.md` vs `bio.vi.md`, stat labels via `t()`
- `src/components/astro/Experience.astro` — `lang` prop, `role[lang]`, passes `lang` to TimelineCard
- `src/components/astro/TimelineCard.astro` — `lang` prop, locale-aware date format, "Present"/"Hiện tại"
- `src/components/astro/Skills.astro` — `lang` prop, section strings via `t()`
- `src/components/astro/ProjectCard.astro` — `lang` prop, `summaryText` hoisted, locale-aware card link, translated source/demo labels
- `src/components/astro/ProjectsGrid.astro` — `lang` prop, passes to SectionTitle + ProjectCard
- `src/components/astro/Papers.astro` — `lang` prop, section strings via `t()`
- `src/components/astro/GitHubStats.astro` — `lang` prop, all stat labels + date locale via `t()`
- `src/components/astro/Contact.astro` — `lang` prop, badge/email/CV labels via `t()`
- `src/components/astro/Footer.astro` — `lang`+`currentPath` props, active lang indicator, mirror links via `mirrorUrl()`
- `src/components/react/LangToggle.tsx` — real mirror logic; reads `window.location.pathname`, navigates on click

## Build Results
- `astro check`: 0 errors, 0 warnings (1 pre-existing hint on JSON-LD `<script type>`)
- `npm run build`: 15 pages built, 0 warnings
  - `dist/index.html` ✓
  - `dist/vi/index.html` ✓
  - `dist/projects/<slug>/index.html` ✓ × 6
  - `dist/vi/projects/<slug>/index.html` ✓ × 6

## Validation
- `dist/index.html` contains: `hreflang="en"`, `hreflang="vi"`, `hreflang="x-default"` ✓
- `dist/vi/index.html` has `<html lang="vi"` ✓
- `dist/index.html` has `<html lang="en"` ✓

## Design Decisions
- `Lang` type re-exported from `i18n-helpers.ts` so consumers import from one module
- `summary[lang]` hoisted to `summaryText` variable to avoid Astro JSX parser type issues with generic `Record<>` in template expressions
- `LangToggle` client-side mirror duplicates server logic — kept simple, no shared module (avoids SSR/client bundle coupling)
- Footer accepts `currentPath` prop; pages pass `Astro.url.pathname` for accurate mirror URLs
