# System Architecture

**Last Updated**: 2026-04-14
**Project**: DucLong06.github.io
**Pattern**: Astro 5 SSG + React Islands + Astro i18n

## Architecture Overview

```
Git push master
     │
     ▼
GitHub Actions Workflow (.github/workflows/deploy.yml)
     │
     ├─→ Node 20 + npm ci (cache package-lock.json)
     ├─→ npm run build (GITHUB_TOKEN → fetch stats)
     │     │
     │     ├─→ Astro SSG builds all 15 pages
     │     │     ├─ index.html (EN) + ./vi/index.html (VI)
     │     │     ├─ /projects/[slug]/ (6 pages × 2 langs)
     │     │     ├─ /papers/, /experience/, /about/
     │     │     ├─ /contact/, /404, /sitemap-index.xml
     │     │     └─ OG images satori-generated at build time
     │     │
     │     └─→ ./dist/ (output directory)
     │
     ├─→ GitHub Pages native deployment (actions/deploy-pages@v4)
     │
     ▼
Live at https://duclong06.github.io (HTTPS auto-enforced)
```

## Component Architecture

### 1. Astro SSG Layer
**Role**: Static site generation at build time  
**Output**: HTML + CSS + minimal JS (islands only)

- Compiles `.astro` components to static HTML
- Renders content collections (projects, experience, papers)
- Generates bilingual routes: `/en/*` and `/vi/*`
- Inlines critical CSS; defers non-critical
- No server-side rendering; all output is pre-built

### 2. React Islands Layer
**Role**: Interactivity where needed  
**Load**: Only when component visible (lazy hydration)

Components:
- **LiquidShader**: WebGL hero with framer-motion parallax
- **ThemeToggle**: Dark/light theme switcher (localStorage persistence)
- **LangToggle**: Language switcher (redirect to `/vi/*` or `/*`)
- **MagneticTilt**: Hover tilt effect on project cards
- **TimelineAnimated**: Framer-motion staggered timeline

Each island is independently bundled and hydrated on-demand.

### 3. Content Collection Layer
**Role**: Source of truth for all dynamic content  
**Schema**: Zod-validated, compile-time

Collections (in `src/content/`):
- **profile**: Single entry with name, headline, socials, bio intro
- **experience**: Work history (dates, role, description, tech tags)
- **projects**: 15 featured projects with slug, description, tech, hero image
- **papers**: Publications with DOI, abstract, PDF link
- **skills**: Skill groups with proficiency levels
- **about**: Bilingual bio (en + vi)

Zod ensures type safety; missing or invalid fields fail at build time.

### 4. i18n Routing
**Strategy**: Explicit route splitting (no runtime detection)

```
GET /                  → EN homepage
GET /projects/face-detection-ml-system/   → EN project detail
GET /vi/               → VI homepage
GET /vi/projects/face-detection-ml-system/ → VI project detail
```

No language cookie/query param; routes are the source of truth.

### 5. Build-Time Features

**GitHub Stats Fetch**:
- `src/lib/github-stats.ts` called at build time
- Uses `GITHUB_TOKEN` (injected via GH Actions env)
- Queries GitHub API for contribution graph, repo metrics
- Result cached; displayed as StatCard component
- Fallback if API rate-limited or token invalid

**OG Image Generation**:
- satori generates dynamic OG images per project
- Template: project title + description + Soft Aurora gradient
- Cached as image artifact in dist/og-*
- Served as meta og:image per page

**Sitemap & Robots**:
- `sitemap.xml.ts` generates full URL list (EN + VI routes)
- `robots.txt` auto-configured; allows all

## Data Flow

### Build-Time Flow
```
src/content/*.md files (+frontmatter YAML)
         │
         ▼
Zod schema validation (content.config.ts)
         │
         ├─→ On invalid → BUILD ERROR (stop)
         └─→ On valid → continue
         │
         ▼
Astro renders pages & layouts
         ├─ index.astro → /index.html (EN)
         ├─ projects/[slug].astro → /projects/*/index.html (EN × 6)
         ├─ vi/* → /vi/*/index.html (VI copy, different strings)
         │
         ├─→ React islands marked client:idle
         ├─→ CSS inlined or deferred
         └─→ OG images satori-rendered
         │
         ▼
         ./dist/ (static output)
         │
         └─→ GitHub Actions
             └─→ actions/deploy-pages@v4
                 └─→ Live at https://duclong06.github.io
```

### Runtime Flow (User Visit)
```
User visits https://duclong06.github.io/
         │
         ▼
CDN serves ./dist/index.html (no server processing)
         │
         ├─→ HTML parsed
         ├─→ Tailwind CSS loaded (inlined for LCP)
         ├─→ @fontsource fonts preloaded (WOFF2)
         │
         ▼
Astro hydration points detected (client:idle, client:visible)
         │
         ├─→ LiquidShader.tsx hydrates (WebGL canvas)
         ├─→ ThemeToggle hydrates (if user scrolls near it)
         ├─→ LangToggle hydrates (visible in nav)
         │
         ▼
framer-motion animations start
         │
         ├─→ Hero parallax on scroll
         ├─→ Timeline stagger on view
         └─→ Project card tilt on hover
         │
         ▼
Page interactive (~1.5s TTI target)
```

### Theme Persistence
```
User clicks ThemeToggle
         │
         ▼
React component updates theme state
         │
         ├─→ localStorage['theme'] = 'dark'
         ├─→ document.documentElement.setAttribute('data-theme', 'dark')
         │
         ▼
Tailwind respects data-theme selector
         │
         └─→ CSS classes automatically update (no remount needed)
         │
         ▼
Reload page
         │
         └─→ theme-init.ts reads localStorage
             └─→ Sets data-theme attribute before rendering
                 (prevents flash of wrong theme)
```

## Performance Optimization

**Critical Path**:
1. HTML (~3 KB gzip)
2. Tailwind CSS (~12 KB gzip, inlined for LCP)
3. @fontsource fonts (preload WOFF2, ~40 KB total)

**Deferred**:
- React islands (lazy-hydrated only on interaction)
- framer-motion (~25 KB, tree-shaken)
- OGL library (~50 KB, used only by LiquidShader)

**Metrics** (targets):
- FCP: < 0.8s
- LCP: < 1.2s
- TTI: < 1.5s
- CLS: < 0.05

## Security

**Static-only**: No server-side processing, no database, no user input stored.

**Astro**: 
- No XSS vectors (all content Zod-validated at build time)
- No SQL injection (no database)
- CSP headers auto-applied by GitHub Pages

**React islands**:
- framer-motion: no user input
- LiquidShader: WebGL only; no network requests
- Toggles: localStorage only

**GitHub Actions**:
- `GITHUB_TOKEN` is ephemeral (not stored in secrets)
- Only granted `read:public_repo` + minimal scopes
- No PAT or long-lived tokens used

## Scalability

**Current Limits**:
- 15 projects (can easily scale to 100+)
- Build time ~2 min (acceptable for portfolio)
- GH Pages 1 GB quota (plenty of room for images)

**Future Growth Paths**:
- Add blog collection (markdown-driven)
- Add scheduled GitHub Actions (refresh stats daily)
- Add Vercel for edge rendering (if needed)
- Add database + API (move away from static if needed)

## Related Documentation

- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
- [Design Guidelines](./design-guidelines.md)
- [Deployment Guide](./deployment-guide.md)
