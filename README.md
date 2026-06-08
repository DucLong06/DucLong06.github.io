# Hoàng Đức Long — Portfolio

Personal portfolio for Hoàng Đức Long (Full-Stack Developer & Computer Science student at EPU). Built with **Astro 5 + React islands** with a **dark-techy** aesthetic — deep indigo-black surfaces, neon cyan/magenta accents, Space Grotesk display + JetBrains Mono. The classic content-first home is canonical at `/` (and `/vi/`); an optional interactive **3D hub-navigator** lives at `/explore` (and `/vi/explore`) as progressive enhancement. Fully static, ships near-zero client JS on the canonical routes, supports EN/VI i18n, and auto-deploys to GitHub Pages on every push to `master`.

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (static output) |
| UI islands | React 18 |
| Styling | Tailwind CSS v3 (dark-techy tokens) |
| 3D (explore only) | three + @react-three/fiber + @react-three/drei (CameraControls), lazy-loaded |
| Animation | framer-motion (classic) · drei CameraControls (explore) |
| Fonts | @fontsource (self-hosted, no Google CDN) — Space Grotesk + JetBrains Mono + Inter |
| OG images | satori (edge-rendered at build time) |
| i18n | Astro native i18n (EN default, `/vi/` prefix) |
| Deployment | GitHub Actions → GitHub Pages native |

## Routes

- **Classic (canonical):** `/`, `/vi/` — content-first, zero three.js, Lighthouse target ≥95.
- **Explore (3D):** `/explore`, `/vi/explore` — R3F **solid-pie hub** (6 slices: About · Experience · Work · Stats · Skills · Off-clock). Idle-spinning thick acrylic pie → hover soft-brakes + explodes a slice → click flies a Prezi-style camera **arc** to a face-on "stage" → quantitative slices (Skills/Stats) sprout 3D bars + floating glass cards; all slices open an accessible DOM panel. `client:only`, lazy three.js, `<link rel="canonical">` → classic. Frosted-matte material everywhere; acrylic transmission on the focused slice (full tier only). No-WebGL / very low-end → classic fallback card; reduced-motion → static pie + snap camera; lite tier → frosted-only + DOM/SVG payload.

## Dev Commands

```bash
# Use correct Node version
nvm use          # reads .nvmrc → 20.19.0

# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Production build → ./dist
npm run build

# Preview production build locally
npm run preview
```

## Content Update Flow

All content lives in `src/content/` as Markdown/YAML with Zod-validated frontmatter:

```
src/content/
├── profile/main.yaml       ← name, headline, social links
├── experience/*.md         ← work history
├── projects/*.md           ← project detail pages
├── papers/*.md             ← publications / research
├── skills/main.yaml        ← skill groups
└── about/
    ├── bio.en.md
    └── bio.vi.md
```

Edit any `.md` or `.yaml` file → `git push master` → GitHub Action builds and deploys in ~3–5 min → live at `https://duclong06.github.io`.

To update CV: export Google Docs → PDF → replace `public/cv.pdf`.

## Project Structure

```
DucLong06.github.io/
├── .github/workflows/deploy.yml   ← GH Actions deploy pipeline
├── .nvmrc                         ← Node 20.19.0
├── astro.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── public/
│   ├── .nojekyll                  ← disables GH Pages Jekyll processing
│   ├── cv.pdf
│   └── og-image.png
└── src/
    ├── content.config.ts          ← Zod schemas
    ├── content/                   ← all site content (markdown + yaml)
    ├── components/
    │   ├── astro/                 ← zero-JS Astro components
    │   └── react/                 ← interactive React islands
    ├── layouts/
    ├── pages/
    └── styles/
```

## Deploy Setup (one-time manual step)

1. Go to repository **Settings → Pages → Source** → select **"GitHub Actions"**
2. Push to `master` — the workflow at `.github/workflows/deploy.yml` handles the rest
3. Site is live at `https://duclong06.github.io`

## Post-deploy Checklist

- [ ] Smoke test: `/`, `/vi/`, `/projects/*`, `/cv.pdf`, `/sitemap-index.xml`, `/robots.txt`
- [ ] 404 page renders for unknown routes
- [ ] Lang toggle preserves current path
- [ ] OG preview valid (LinkedIn Post Inspector) — classic + `/explore`
- [ ] Lighthouse ≥ 95 on live `/` and `/vi/` (no three.js in classic chunk)
- [ ] `/explore` + `/vi/explore` render; canonical → classic; no-JS shows "view classic" link
- [ ] Explore: hover/click a slice → camera arc dive → stage (bars sprout for Skills/Stats) + DOM panel; Esc/Hub returns; jump slice→slice direct
- [ ] Explore a11y: keyboard-only traversal (slice labels → panels → chart toggles → nav); reduced-motion = static pie + snap
- [ ] Explore mobile: usable FPS or auto lite/classic; tab-hidden / offscreen pauses render loop
- [ ] VI parity on all `/explore` UI
- [ ] `git tag v1.0.0 && git push --tags`

## References

- Plan: `plans/260414-0955-portfolio-redesign-astro/`
- Brainstorm: `plans/reports/brainstormer-260414-0955-portfolio-redesign.md`

## License

MIT — Hoàng Đức Long, 2026
