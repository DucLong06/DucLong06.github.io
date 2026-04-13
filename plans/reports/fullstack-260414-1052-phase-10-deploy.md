---
type: phase-report
phase: 10-deploy-and-polish
date: 2026-04-14
author: fullstack-developer
status: locally-complete / pending-live-deploy
---

# Phase 10 — Deploy & Polish: Report

## Status

All locally-executable tasks complete. Build passes. Remaining items require live GitHub push and cannot be executed locally.

## Files Modified / Created

| File | Action | Notes |
|---|---|---|
| `astro.config.mjs` | Modified | Added `build.assets`, `build.inlineStylesheets`, `image.service` |
| `public/.nojekyll` | Created | Empty — disables GH Pages Jekyll processing |
| `.github/workflows/deploy.yml` | Created | Push-to-master + workflow_dispatch, native Pages deploy |
| `.nvmrc` | Created | Pins Node 20.19.0 for CI + local consistency |
| `README.md` | Rewritten | Stack table, dev commands, content update flow, post-deploy checklist, MIT license |
| `plans/260414-0955-portfolio-redesign-astro/phase-10-deploy-and-polish.md` | Updated | Todos marked [x] / deferred |

## Build Result

```
npm run build → exit 0
15 page(s) built in 33.15s
```

Pages generated: `/`, `/vi/`, `/404`, 6× `/projects/*`, 6× `/vi/projects/*`, `/sitemap-index.xml`

Note: `[github-stats] fetch failed — using committed cache` is expected locally (no GITHUB_TOKEN). CI will have the token injected via `secrets.GITHUB_TOKEN`.

## Key Config Changes (astro.config.mjs)

```js
build: { assets: 'assets', inlineStylesheets: 'auto' },
image: { service: { entrypoint: 'astro/assets/services/sharp' } },
```

`site`, `output: 'static'`, `i18n`, `vite.ssr.noExternal: ['ogl']` — already set, retained unchanged.

## Deferred (requires live GH push)

1. **Repo setting** (one-time): Settings → Pages → Source → "GitHub Actions"
2. Push to `master` → verify Action succeeds (`gh run list --workflow=deploy.yml`)
3. Smoke test: `/`, `/vi/`, `/projects/face-detection-ml-system/`, `/random-bad-url` (404), `/cv.pdf`, `/sitemap-index.xml`, `/robots.txt`
4. Lighthouse on `https://duclong06.github.io` — target ≥ 95
5. OG preview — LinkedIn Post Inspector: `https://www.linkedin.com/post-inspector/`
6. `git tag v1.0.0 && git push --tags`

## Manual Post-Deploy Checklist

```
[ ] 1. GitHub: Settings → Pages → Source = "GitHub Actions"
[ ] 2. git push master → watch https://github.com/DucLong06/DucLong06.github.io/actions
[ ] 3. curl -sI https://duclong06.github.io | head -1   # expect HTTP/2 200
[ ] 4. Verify /vi/ loads, lang toggle works, path preserved
[ ] 5. Verify /projects/* (6 pages) + 404 + /cv.pdf download
[ ] 6. Lighthouse mobile ≥ 95 (Performance, A11y, Best Practices, SEO)
[ ] 7. OG image preview — LinkedIn Post Inspector
[ ] 8. Theme toggle persists across reload
[ ] 9. Reduced-motion: shader is static
[ ] 10. git tag v1.0.0 && git push --tags
```

## Notes

- `public/CNAME` skipped — no custom domain decided yet. Add later when DNS is ready.
- `cancel-in-progress: false` in workflow concurrency — allows queued deploys to complete (safe default; phase file brainstorm had `true`, task spec overrides to `false`).
- Contact form N/A — site uses email CTA only (no Formspree/EmailJS wired up).
