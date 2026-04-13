# Phase 10 — Deploy & Polish

## Context Links
- Brainstorm §9 (GH Pages constraints), §9 Astro config, §9 deploy YAML
- Phase 09 (perf/a11y green)

## Overview
- **Priority:** P1
- **Status:** Complete* (live GH push & smoke test deferred pending repo settings + manual push)
- **Brief:** Final deployment via GitHub Pages native workflow. Configure `astro.config.mjs` for production, add `.nojekyll`, write `.github/workflows/deploy.yml`, optional `CNAME`, rewrite `README.md`, run final QA checklist.

## Key Insights
- User site (`DucLong06.github.io`) → no `base` config, deploys at `/`
- Use GH Pages NATIVE deployment (`actions/deploy-pages@v4`), not `gh-pages` branch package
- `.nojekyll` empty file required at output root to disable Jekyll processing
- `concurrency` group in workflow prevents racing deploys
- `GITHUB_TOKEN` provided automatically — passes to build for phase 06 stats fetch

## Requirements
**Functional**
- Push to `master` triggers GH Action → builds Astro → deploys to Pages
- Live site at `https://duclong06.github.io`
- All routes load (EN + VI), 404 works, sitemap accessible
- README explains stack, dev commands, content update flow

**Non-functional**
- Build duration ≤ 3 min in CI
- Deploy total time (push → live) ≤ 5 min
- No flaky steps; concurrency cancel-in-progress prevents queue buildup

## Architecture
```
git push master
       │
       ▼
.github/workflows/deploy.yml
       │
       ├─ build job
       │     ├─ checkout
       │     ├─ setup-node 20 + cache
       │     ├─ npm ci
       │     ├─ npm run build   (GITHUB_TOKEN injected → github-stats fetch)
       │     └─ upload-pages-artifact (./dist)
       │
       └─ deploy job (needs build)
             └─ deploy-pages@v4 → https://duclong06.github.io
```

## Related Code Files

**Create:**
- `.github/workflows/deploy.yml`
- `public/.nojekyll` (empty file)
- `public/CNAME` (only if custom domain decided — see unresolved Q)
- `README.md` (rewrite)

**Modify:**
- `astro.config.mjs` — production hardening:
  ```js
  site: 'https://duclong06.github.io',
  output: 'static',
  build: { assets: 'assets', inlineStylesheets: 'auto' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  vite: { ssr: { noExternal: ['ogl'] } },
  ```

## Implementation Steps

1. **Production astro.config.mjs** — finalize from brainstorm §9 (already partially set in phase 00). Add `site`, `inlineStylesheets`, image service.
2. **`.nojekyll`** — `touch public/.nojekyll`. Astro copies `public/` to `dist/` root.
3. **`deploy.yml`** — paste from brainstorm §9 verbatim, with one addition: pass `GITHUB_TOKEN` env to the build step:
   ```yaml
   - name: Build
     run: npm run build
     env:
       GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```
4. **GitHub repo settings** (one-time manual): Settings → Pages → Source = "GitHub Actions" (NOT "Deploy from branch").
5. **First deploy test** — push to a feature branch first? No — workflow only triggers on master. Push to master, watch action.
6. **Smoke test live URL**:
   - `/` loads, hero shader animates
   - `/vi/` loads
   - `/projects/face-detection-ml-system/` loads
   - `/random-bad-url` → 404 page
   - `/cv.pdf` downloads
   - `/sitemap-index.xml` accessible
   - `/robots.txt` correct
7. **Final QA checklist** (run on production):
   - [ ] Lighthouse mobile (real URL) ≥ 95
   - [ ] Theme toggle persists across reload
   - [ ] Lang toggle preserves path
   - [ ] All 6 project detail pages load
   - [ ] Form submission delivers email
   - [ ] OG preview valid (test on LinkedIn share simulator)
   - [ ] No console errors / warnings
   - [ ] Reduced-motion mode static
   - [ ] Mobile Safari + iOS Chrome render shader
8. **README rewrite**:
   - Project description (1 paragraph)
   - Stack badges
   - Dev commands: `npm install`, `npm run dev`, `npm run build`
   - Content update flow: edit `src/content/*.md` → `git push master` → live in 5 min
   - Link to plan + brainstorm
   - License
9. **Tag release**: `git tag v1.0.0 && git push --tags`.

## Todo List
- [x] Finalize `astro.config.mjs` production settings
- [x] Create `public/.nojekyll`
- [x] Decide on `public/CNAME` (custom domain or skip) — skipped, no custom domain yet
- [x] Write `.github/workflows/deploy.yml`
- [x] Rewrite `README.md`
- [x] Create `.nvmrc` (20.19.0)
- [x] `npm run build` passes — 15 pages, exit 0, dist/.nojekyll present
- [ ] Switch GitHub Pages source to "GitHub Actions" — deferred — requires live GH push (manual repo setting)
- [ ] First master push, watch action succeed — deferred — requires live GH push
- [ ] Smoke test all live routes — deferred — requires live GH push
- [ ] Run Lighthouse on live URL — meets phase 09 targets — deferred — requires live GH push
- [ ] OG preview test (LinkedIn simulator) — deferred — requires live GH push
- [ ] Submit contact form, verify email arrives — N/A (email CTA only, no form)
- [ ] Tag `v1.0.0` — deferred — requires live GH push
- [ ] Commit

## Success Criteria
**Definition of Done:**
- `https://duclong06.github.io` is live and matches dev experience
- All Lighthouse targets from phase 09 hold on production URL
- All checklist items above ticked
- README documents update flow clearly
- v1.0.0 tag exists

**Validation:**
- `curl -sI https://duclong06.github.io` returns 200
- `gh run list --workflow=deploy.yml` shows green
- Manual smoke test of every route in checklist

## Risk Assessment
| Risk | Mitigation |
|---|---|
| First Pages deploy fails (settings not switched) | Pre-switch source in repo settings BEFORE first push |
| `GITHUB_TOKEN` insufficient for stats GraphQL | Cache fallback from phase 06 covers this |
| Custom domain DNS not propagated | Skip CNAME for v1.0; add later when DNS ready |
| Workflow drift between local + CI | Pin Node 20 in both `engines` and workflow |
| Cached `node_modules` corrupt | Cache key includes `package-lock.json` hash |

## Security Considerations
- `GITHUB_TOKEN` ephemeral, never committed
- No PAT in workflow
- Permissions block restricts to `contents: read, pages: write, id-token: write`
- HTTPS enforced by GH Pages by default

## Next Steps
- **Project complete.** Post-launch backlog (NOT in scope):
  - Add Plausible analytics (decide privacy-friendly tool)
  - Add blog collection if narrative posts needed
  - Custom domain `duclong.dev` / similar
  - More project detail pages with embedded demos
  - Refresh GitHub stats cache via scheduled workflow
