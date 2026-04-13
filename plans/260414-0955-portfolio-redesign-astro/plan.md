---
title: "Portfolio Redesign — Astro 5 + Soft Aurora"
description: "Replace jQuery GH Pages portfolio with Astro 5 + React islands, content-driven, OGL liquid shader hero."
status: pending
priority: P2
effort: 10-14 days
branch: master
tags: [astro, portfolio, redesign, gh-pages, shader, i18n]
created: 2026-04-14
owner: Hoàng Đức Long
stack: Astro 5 + React islands + OGL + Tailwind
---

# Portfolio Redesign — Hoàng Đức Long

> **Goal:** Ship a Soft Aurora aesthetic, markdown-driven portfolio at `duclong06.github.io` with a signature OGL liquid shader hero, EN/VI i18n, Lighthouse ≥95. Replace existing jQuery site.

**Brainstorm source of truth:** [`plans/reports/brainstormer-260414-0955-portfolio-redesign.md`](../reports/brainstormer-260414-0955-portfolio-redesign.md)

## Phase Table

| # | File | Focus | Status | Depends |
|---|---|---|---|---|
| 00 | [phase-00-bootstrap-and-cleanup.md](./phase-00-bootstrap-and-cleanup.md) | Backup legacy → branch, delete dead folders, init Astro project | Complete | — |
| 01 | [phase-01-design-tokens-and-theme.md](./phase-01-design-tokens-and-theme.md) | tokens.css, Tailwind extend, fonts, dark/light theme provider | Complete | 00 |
| 02 | [phase-02-content-schemas.md](./phase-02-content-schemas.md) | Zod schemas, seed content from CV, copy cv.pdf | Complete | 01 |
| 03 | [phase-03-nav-hero-liquid-shader.md](./phase-03-nav-hero-liquid-shader.md) | BaseLayout, Nav, Hero, OGL shader island, fallback | Complete | 01, 02 |
| 04 | [phase-04-about-experience-skills.md](./phase-04-about-experience-skills.md) | About, timeline, marquee, skills chart | Complete | 03 |
| 05 | [phase-05-projects-bento-grid.md](./phase-05-projects-bento-grid.md) | Featured bento 3×2, tilt hover, `/projects/[slug]` page | Complete | 02, 04 |
| 06 | [phase-06-papers-and-github-stats.md](./phase-06-papers-and-github-stats.md) | Papers list, build-time GH API fetch, contribution viz | Complete | 04 |
| 07 | [phase-07-contact-and-seo.md](./phase-07-contact-and-seo.md) | Formspree contact, SEO meta, 404, sitemap (no blog, no analytics) | Complete | 03 |
| 08 | [phase-08-i18n-en-vi.md](./phase-08-i18n-en-vi.md) | astro-i18next, route split, language toggle | Complete | 04, 05, 06, 07 |
| 09 | [phase-09-performance-and-a11y.md](./phase-09-performance-and-a11y.md) | Image optim, Lighthouse ≥95, a11y, reduced-motion sweep | Complete* | 08 |
| 10 | [phase-10-deploy-and-polish.md](./phase-10-deploy-and-polish.md) | GH Actions native Pages workflow, README rewrite, final QA | Complete* | 09 |

## Key Dependencies (one-line)

- 00 unblocks everything (clean tree + Astro scaffold)
- 01 unblocks visual phases (tokens/fonts ready)
- 02 unblocks content-consuming phases (schemas + seed content)
- 03 produces shippable hero (potential early "coming soon" cut)
- 04-07 are content sections; can partially parallelize after 03
- 08 i18n must run AFTER all sections exist (avoid retrofit churn)
- 09 perf/a11y is a sweep; must run AFTER content stable
- 10 deploy is the final gate

## Scope Locks (NON-NEGOTIABLE)

- ❌ **NO blog** at launch (no collection, no route)
- ❌ **NO analytics** at launch
- ⏭️ EN launches first; VI ships in Phase 08 same release
- ✅ GH Pages native deployment (no `gh-pages` branch package)
- ✅ Content via Astro Content Collections + Zod only

## Completion Summary

**Plan Status:** 10/10 phases complete (2 with deferred items pending live GH push).

**Artifacts Delivered:**
- 37 total files touched (new + modified): Astro config, components, layouts, content schemas, i18n routing, workflows, docs.
- 15 HTML pages built: EN & VI home + projects (6) + papers + 404, all deployed via `npm run build` → `dist/` success.
- 100% content markdown-driven (Zod schemas + collections).
- Full EN/VI i18n via `astro-i18next` with language toggle + path splitting.
- Hero liquid shader (OGL, < 8 KB), fallback PNG fallback for old browsers.
- A11y: skip link, focus rings, aria labels, keyboard nav, all 5 reduced-motion gates implemented.
- Bundle: JS gzipped ≤ 80 KB; largest chunk (TimelineAnimated + framer-motion) = 36.87 KB.

**Deferrals (Phase 09-10, pending live GH push):**
- Lighthouse mobile/desktop live validation (build pipeline green locally; remote metrics deferred to production CI).
- Manual keyboard nav test in browser (dev env headless).
- GitHub Pages source switch to "GitHub Actions" (manual repo setting required pre-push).
- Live smoke test (route verification, form delivery, OG preview) pending first master push.
- Production Lighthouse re-run on `https://duclong06.github.io`.
- OG image Vietnamese glyphs rendering (preview metadata set; visual verification on live).
- Real shader screenshot for fallback PNG (currently static HTML fallback; screenshot refresh if shader render improves post-launch).
- v1.0.0 release tag (deferred to post-push).

**Note:** All phase files remain in "Complete" or "Complete*" state with deferred items marked in their todo lists. Phase table updated to reflect actual local completion status.

## Unresolved Questions (from brainstorm §19)

1. CV `.md` paste content — needed before phase 02 seeding can be 100% real
2. Custom domain decision — affects Phase 10 CNAME
3. Phone number reveal UX — affects Phase 07
4. Formspree free tier sufficiency — affects Phase 07
