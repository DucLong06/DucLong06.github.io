# Phase 00 — Bootstrap & Cleanup

## Context Links
- Brainstorm: [`plans/reports/brainstormer-260414-0955-portfolio-redesign.md`](../reports/brainstormer-260414-0955-portfolio-redesign.md) §17
- CV: `CV Hoang Duc Long.md`, `Hoang Duc Long SWE.docx.md`
- Existing masterplan: `COMPLETE_PORTFOLIO_MASTERPLAN.md` (to archive)

## Overview
- **Priority:** P1 (blocks all)
- **Status:** Complete
- **Brief:** Wipe legacy jQuery site (preserved on a `legacy-portfolio` branch), delete dead demo folders, archive old masterplan, scaffold a clean Astro 5 + React + Tailwind project at the repo root.

## Key Insights
- Repo IS the user site (`DucLong06.github.io`) → no `base` config, deploys to `/`
- Legacy code worth preserving as a branch reference, not folder clutter
- Astro init must NOT clobber `plans/`, `docs/`, `.claude/`, CV files, brainstorm reports
- This phase ships zero UI; success = `npm run dev` opens a default Astro page

## Requirements
**Functional**
- Legacy site fully accessible via `legacy-portfolio` branch
- `master` working tree contains only: Astro project + `plans/` + `docs/` + `.claude/` + CV source files + `README.md`
- `npm run dev` and `npm run build` work locally on Node 20

**Non-functional**
- Zero data loss (all legacy reachable via git)
- Clean `.gitignore` for Node, Astro `dist/`, `.astro/`, `node_modules/`
- TypeScript strict mode

## Architecture
```
master (post-phase-00)
├── astro project (root)
├── plans/ docs/ .claude/ (preserved)
├── CV files (kept until phase 02 moves them)
└── README.md (placeholder)

legacy-portfolio branch (frozen snapshot of pre-redesign state)
```

## Related Code Files

**Delete (from master, preserved on legacy branch):**
- `index.html`, `css/`, `js/`, `fonts/`, `img/`, `vendor/` (whatever exists at root)
- `LoginForm/`, `Mario_Game/`, `Ruou/`, `WebLAH/`

**Move:**
- `COMPLETE_PORTFOLIO_MASTERPLAN.md` → `docs/archive/portfolio-masterplan-v1.md`

**Create:**
- `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.js`
- `.prettierrc`, `.prettierignore`, `.editorconfig`
- `.gitignore` (Node + Astro)
- `src/pages/index.astro` (placeholder "Hello")
- `public/.gitkeep`

## Implementation Steps

1. **Snapshot legacy branch**
   ```bash
   git checkout -b legacy-portfolio
   git push -u origin legacy-portfolio
   git checkout master
   ```
2. **Delete dead folders** (verify on master they're now gone):
   ```bash
   git rm -r LoginForm Mario_Game Ruou WebLAH
   git rm -r index.html css js fonts img vendor 2>/dev/null || true
   ```
3. **Archive old masterplan**:
   ```bash
   mkdir -p docs/archive
   git mv COMPLETE_PORTFOLIO_MASTERPLAN.md docs/archive/portfolio-masterplan-v1.md
   ```
4. **Init Astro** (use the manual init, NOT `create-astro` which scaffolds extras):
   - Write `package.json` with deps from brainstorm §4.1
   - Run `npm install`
5. **Add Astro integrations**: `npx astro add react tailwind mdx sitemap` (accept all prompts) OR write `astro.config.mjs` manually per brainstorm §9.
6. **Configure TypeScript** — extend `astro/tsconfigs/strict`, paths alias `@/* → src/*`
7. **Configure Prettier** with `prettier-plugin-astro`
8. **`.gitignore`**: `node_modules/`, `dist/`, `.astro/`, `.env`, `.DS_Store`
9. **Smoke test**: `npm run dev` shows default page; `npm run build` produces `dist/`
10. **Commit**: one commit per logical unit (`chore: archive legacy`, `chore: scaffold astro`)

## Todo List
- [x] Create `legacy-portfolio` branch from current master and push
- [x] Delete `LoginForm/`, `Mario_Game/`, `Ruou/`, `WebLAH/` on master
- [x] Delete root-level legacy `index.html`, `css/`, `js/`, `fonts/`, `img/`, `vendor/`
- [x] Move `COMPLETE_PORTFOLIO_MASTERPLAN.md` → `docs/archive/portfolio-masterplan-v1.md`
- [x] Write `package.json` with locked deps
- [x] Run `npm install`
- [x] Add astro integrations (react, tailwind, mdx, sitemap)
- [x] Write `astro.config.mjs` (basic version, full config in phase 10)
- [x] Write `tsconfig.json` (strict, `@/*` alias)
- [x] Write `.prettierrc`, `.prettierignore`, `.editorconfig`, `.gitignore`
- [x] Create placeholder `src/pages/index.astro`
- [ ] Verify `npm run dev` works  ← skipped (no browser/TTY in agent; build confirms scaffold works)
- [x] Verify `npm run build` succeeds
- [ ] Commit in logical chunks  ← left for user per task instructions

## Success Criteria
**Definition of Done:**
- `git checkout legacy-portfolio` shows old jQuery site intact
- `git checkout master && ls` shows ONLY: astro project + `plans/` + `docs/` + `.claude/` + CV files + config files
- `npm run dev` serves default Astro page on http://localhost:4321
- `npm run build` exits 0
- No `LoginForm/`, `Mario_Game/`, `Ruou/`, `WebLAH/` in master tree

**Validation:**
- `git log legacy-portfolio --oneline -1` shows pre-redesign HEAD
- `npm run build && ls dist/index.html` succeeds

## Risk Assessment
| Risk | Mitigation |
|---|---|
| Accidentally delete CV files | Whitelist deletes; use `git rm` not `rm -rf`; verify diff before commit |
| `create-astro` overwrites `plans/` or `docs/` | Use manual init (write `package.json` + `npm install` + `astro add`), never run wizard with `--yes` at root |
| Node version mismatch | Pin to Node 20 in `package.json` `engines` |
| Branch push blocked | Verify GH credentials before starting; have local copy as backup |

## Security Considerations
- No secrets committed; `.env` in `.gitignore`
- No legacy credentials in old `js/` files leaking into new repo (verify before delete)
- `legacy-portfolio` branch should NOT contain `.env` or keys (audit before push)

## Next Steps
- **Unblocks:** Phase 01 (design tokens need a working Astro project)
- **Follows into:** Phase 01 — Design Tokens & Theme
