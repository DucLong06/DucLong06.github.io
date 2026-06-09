# Hoàng Đức Long — Portfolio

Personal portfolio for Hoàng Đức Long (Full-Stack Developer & Computer Science student at EPU). Built with **Astro 5 + React islands** featuring a **Neovim/LazyVim-inspired shell UI** (dark TokyoNight) as the primary interactive layer. The classic 2D portfolio site remains in the DOM as an SEO/no-JS baseline, and the 3D island is accessible via the `:island` command inside the shell. Fully static, ships near-zero client JS by default, supports EN/VI i18n, and auto-deploys to GitHub Pages on every push to `master`.

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (static output) |
| UI islands | React 18 |
| Styling | Tailwind CSS v3 |
| 3D shader | OGL (WebGL liquid gradient mesh) |
| Animation | framer-motion |
| Fonts | @fontsource (self-hosted, no Google CDN) |
| OG images | satori (edge-rendered at build time) |
| i18n | Astro native i18n (EN default, `/vi/` prefix) |
| Deployment | GitHub Actions → GitHub Pages native |

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
    │   └── react/
    │       ├── nvim/              ← NvimShell + buffers + editor (new)
    │       └── ...                ← legacy islands (LangToggle, MagneticTilt, etc.)
    ├── lib/
    │   ├── nvim/                  ← buildNvimData + types + nvim-projects (new)
    │   └── ...
    ├── styles/
    │   ├── nvim-theme.css         ← TokyoNight dark shell styles (new)
    │   ├── nvim-content.css       ← buffer & editor content styles (new)
    │   └── ...
    ├── layouts/
    ├── pages/
    └── i18n/strings.ts            ← nvim_cmd_hint translations added
```

## Deploy Setup (one-time manual step)

1. Go to repository **Settings → Pages → Source** → select **"GitHub Actions"**
2. Push to `master` — the workflow at `.github/workflows/deploy.yml` handles the rest
3. Site is live at `https://duclong06.github.io`

## Post-deploy Checklist

- [ ] Smoke test: `/`, `/vi/`, `/projects/*`, `/cv.pdf`, `/sitemap-index.xml`, `/robots.txt`
- [ ] 404 page renders for unknown routes
- [ ] Theme toggle persists across reload
- [ ] Lang toggle preserves current path
- [ ] OG preview valid (LinkedIn Post Inspector)
- [ ] Lighthouse ≥ 95 on live URL
- [ ] `git tag v1.0.0 && git push --tags`

## References

- Plan: `plans/260414-0955-portfolio-redesign-astro/`
- Brainstorm: `plans/reports/brainstormer-260414-0955-portfolio-redesign.md`

## License

MIT — Hoàng Đức Long, 2026
