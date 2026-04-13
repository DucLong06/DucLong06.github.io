# Project Changelog

**Last Updated**: 2026-04-14

## v1.0.0 — 2026-04-14

### Major Redesign: jQuery → Astro 5 SSG + React Islands

**Status**: Released

#### Architecture Migration
- **From**: Static jQuery portfolio (HTML/CSS/jQuery)
- **To**: Astro 5 SSG + React islands + Tailwind v3

#### Tech Stack Changes
- Astro 5 framework (static output, zero hydration by default)
- React 18 islands (lazy hydration for interactive components)
- Tailwind CSS v3 (utility-first, with design tokens)
- OGL WebGL (liquid gradient shader hero)
- framer-motion (entrance/timeline animations)
- @fontsource fonts (self-hosted, no CDN)
- Native Astro i18n (EN + VI routes)
- Zod content validation (build-time safety)
- GitHub Actions native Pages deploy

#### Content System
- Markdown + YAML frontmatter for all content
- Zod schemas validate content at build time
- Collections: projects, experience, papers, skills, about, profile
- Bilingual content: English default, Vietnamese at `/vi/*`
- 15 featured projects, all with detail pages

#### Design System
- **Soft Aurora Palette**: Warm neutrals + aurora gradients
- **tokens.css**: Single source of truth for colors, spacing, typography
- Instrument Serif display font + system fonts for body
- Full accessibility (WCAG AA, 4.5:1 contrast, reduced-motion support)

#### Features
- WebGL liquid-shader hero with parallax scroll
- Dark/light theme toggle (localStorage persistence)
- Language toggle (EN/VI with path preservation)
- Magnetic tilt effect on project cards
- Staggered timeline animations
- Build-time GitHub stats fetch (via GITHUB_TOKEN)
- Dynamic OG image generation (satori)
- Automatic sitemap & robots.txt
- Contact page (Formspree CTA)

#### Performance Targets
- Lighthouse ≥ 95 (mobile)
- LCP < 1.2s
- TTI < 1.5s
- CLS < 0.05
- ~100 KB total per page (gzip)

#### Deployment
- GitHub Pages native (no `gh-pages` branch)
- GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Node 20.19.0 pinned (`.nvmrc`)
- Auto-deploy: `git push master` → live in 3–5 min

#### Pages Built (15 Total)
- `/` (EN home)
- `/vi/` (VI home)
- `/projects/face-detection-ml-system/` (+ 5 more detail pages)
- `/papers/` (publications list)
- `/experience/` (work history timeline)
- `/about/` (bilingual bio)
- `/contact/` (contact CTA)
- `/cv.pdf` (downloadable)
- `/sitemap-index.xml` (auto-generated)
- `/robots.txt` (auto-generated)
- `/404` (custom error page)

#### Documentation Updated
- Codebase Summary: SSG architecture, content-first design
- System Architecture: Astro SSG + islands + i18n routing
- Code Standards: TypeScript strict, Tailwind-first, Zod schemas
- Design Guidelines: Soft Aurora, tokens.css, typography
- Deployment Guide: GitHub Actions native Pages flow
- Project Changelog: This file (new)

#### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions minimum
- No IE11 support

#### Known Limitations (v1.0)
- No blog system (planned for future)
- No analytics integration (planned for future)
- No custom domain (optional for future)
- GitHub stats API fallback if GITHUB_TOKEN rate-limited

#### Migration Notes
- Old jQuery portfolio archived to `legacy-portfolio` branch
- All subprojects (LoginForm, Mario_Game, Ruou, WebLAH) removed
- Clean slate for new Astro-based architecture

---

## Future Releases (Backlog)

### v1.1 (Planned)
- Add Plausible analytics (privacy-friendly)
- Blog collection + /blog/* routes
- More project detail pages with embedded demos
- Custom domain support
- Enhanced GitHub stats cache (scheduled workflow)

### v2.0 (Research Phase)
- Dark mode system detection (prefers-color-scheme)
- Advanced search functionality
- Feed/RSS integration
- Community features (comments, reactions)

---

## Document Version
**Version**: 1.0
**Last Review**: 2026-04-14
**Next Review**: 2026-07-14 (quarterly)
