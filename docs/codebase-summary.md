# Codebase Summary

**Last Updated**: 2026-04-14
**Repository**: https://github.com/DucLong06/DucLong06.github.io
**Type**: Static SSG Portfolio (Astro 5 + React)

## Overview

DucLong06.github.io is a modern, performance-first portfolio site built with Astro 5 SSG + React islands. It features a bespoke WebGL liquid-shader hero, bilingual i18n (EN/VI), content-driven architecture via Zod schemas, and near-zero client JavaScript by default. All 15 pages ship production-ready and deploy automatically to GitHub Pages on each commit.

## Directory Structure

```
DucLong06.github.io/
├── .github/workflows/deploy.yml      # GitHub Actions deploy pipeline
├── .nvmrc                            # Node 20.19.0
├── astro.config.mjs                  # Astro SSG config
├── tailwind.config.js                # Tailwind v3 tokens
├── tsconfig.json
├── public/
│   ├── .nojekyll                     # Disable Jekyll
│   ├── cv.pdf
│   └── fonts/                        # @fontsource self-hosted
├── src/
│   ├── content.config.ts             # Zod schemas
│   ├── content/                      # Markdown + YAML content
│   │   ├── profile/main.yaml
│   │   ├── experience/*.md
│   │   ├── projects/*.md
│   │   ├── papers/*.md
│   │   ├── skills/main.yaml
│   │   └── about/*.md
│   ├── components/
│   │   ├── astro/                    # Zero-JS Astro components
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Projects*.astro
│   │   │   ├── Experience.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Papers.astro
│   │   │   ├── Contact.astro
│   │   │   ├── Nav.astro
│   │   │   ├── Footer.astro
│   │   │   └── *.astro
│   │   └── react/                    # Interactive islands
│   │       ├── LiquidShader.tsx      # WebGL hero
│   │       ├── ThemeToggle.tsx
│   │       ├── LangToggle.tsx
│   │       ├── MagneticTilt.tsx
│   │       └── TimelineAnimated.tsx
│   ├── i18n/
│   │   ├── strings.ts                # i18n translations
│   │   └── helpers.ts
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro               # Home (EN)
│   │   ├── projects/[slug].astro
│   │   ├── 404.astro
│   │   ├── sitemap.xml.ts
│   │   └── vi/                       # VI routes auto-generated
│   ├── lib/
│   │   ├── github-stats.ts           # Build-time GH API
│   │   ├── i18n-helpers.ts
│   │   ├── theme-init.ts
│   │   └── featured-projects-order.ts
│   └── styles/
│       ├── tokens.css                # Design tokens (source of truth)
│       └── globals.css
└── docs/
```

## Technology Stack

| Layer | Tech | Notes |
|---|---|---|
| **Framework** | Astro 5 | Static output, zero hydration by default |
| **UI Islands** | React 18 | Only interactive components (hero, toggles) |
| **Styling** | Tailwind v3 | Uses CSS var() tokens from `tokens.css` |
| **3D Graphics** | OGL | WebGL liquid-gradient mesh hero |
| **Animation** | framer-motion | Hero + timeline interactions |
| **Fonts** | @fontsource | Self-hosted: Instrument Serif (display), custom body |
| **Content** | Markdown + YAML | With Zod validation |
| **i18n** | Astro native | `/` (EN) + `/vi/` (VI) |
| **OG Generation** | satori | Dynamic image generation |
| **Deploy** | GH Actions → Pages | Native Pages, GITHUB_TOKEN for stats API |

## Key Directories by Purpose

### Content (`src/content/`)
- **Schema**: `content.config.ts` defines Zod types for each collection
- **Profile**: Global identity, social links, headline
- **Experience**: Work history timeline
- **Projects**: 15 featured projects, sorted by `featured-projects-order.ts`
- **Papers**: Publications/research
- **About**: Bilingual bio sections
- **Skills**: Skill groups with taxonomy

### Components (`src/components/`)
- **Astro**: Static, zero-JS at build time. Examples: `ProjectsGrid`, `Experience` timeline, `Papers` cards, `Skills` bars
- **React**: Islands loaded only when interactive. Examples: `LiquidShader` (WebGL hero), `ThemeToggle`, `LangToggle`, `MagneticTilt`

### Styling (`src/styles/`)
- **tokens.css**: Single source of truth for colors, spacing, typography. Tailwind reads via `extend.colors.var()`
- **globals.css**: Reset, base typography, transitions, reduced-motion sweep

## Design System

**Soft Aurora Palette** (defined in `tokens.css`):
- Warm neutrals (cream, ivory)
- Aurora gradient accents (blues, teals, purples)
- Instrument Serif for headings
- System fonts for body text

**Tailwind Config**: Extends with `var()` CSS tokens; no hardcoded hex values. Respects `prefers-reduced-motion`.

## Content-First Architecture

1. Edit `src/content/*.md` or `*.yaml`
2. Zod validates against schema in `content.config.ts`
3. Astro builds at compile time → no runtime overhead
4. Each collection entry generates routes (e.g., `projects/[slug]`)
5. Bilingual routes auto-split: `/{page}` (EN) & `/vi/{page}` (VI)

## Build-Time Features

- **GitHub Stats**: `src/lib/github-stats.ts` fetches stats at build time via `GITHUB_TOKEN`
- **OG Images**: satori generates dynamic OG images per project
- **Sitemap**: Auto-generated via `sitemap.xml.ts`
- **i18n**: No runtime language detection; routes are explicit

## Performance Targets

- Lighthouse ≥ 95 (mobile)
- TTI < 1.5s
- LCP < 1.2s
- CLS < 0.05
- No runtime JS bloat (islands load only when interactive)

## Naming Conventions

- **Files**: kebab-case (e.g., `liquid-shader.tsx`)
- **Components**: PascalCase (React, Astro)
- **CSS classes**: Tailwind utility first; if custom, kebab-case
- **Routes**: lowercase with hyphens (e.g., `/face-detection-ml-system/`)

## Related Documentation

- [System Architecture](./system-architecture.md) — SSG + islands + i18n routing
- [Code Standards](./code-standards.md) — TS strict, Tailwind patterns, component splits
- [Design Guidelines](./design-guidelines.md) — Soft Aurora, tokens.css as source
- [Deployment Guide](./deployment-guide.md) — GH Actions native Pages flow
