# Phase 06 — Papers & GitHub Stats: Implementation Report

## Status: Complete

## Files Created
| File | Lines | Notes |
|---|---|---|
| `src/components/astro/Papers.astro` | 55 | Reads `papers` collection, sorts by year desc, maps to PaperCard |
| `src/components/astro/PaperCard.astro` | 130 | Title italic serif, authors, venue/year, award badge pill, DOI link |
| `src/components/astro/GitHubStats.astro` | 90 | 4-up StatCards + LanguageBar, build-time only |
| `src/components/astro/LanguageBar.astro` | 110 | Flex segmented bar, color-mapped per lang, legend below |
| `src/lib/github-stats.ts` | 105 | Fetch REST API, weight langs by size, cache fallback on error |
| `src/data/github-stats-cache.json` | 14 | Seeded with real DucLong06 data (see below) |

## Files Modified
| File | Change |
|---|---|
| `src/pages/index.astro` | Added `<Papers />` + `<GitHubStats />` after `<ProjectsGrid />` |
| `plans/260414-0955-portfolio-redesign-astro/phase-06-papers-and-github-stats.md` | Todos marked `[x]`, status → Complete |

## Real GitHub Data (fetched via curl, unauthenticated)
- `totalRepos`: 72 (public_repos from /users/DucLong06)
- `totalStars`: 56 (owned repos only, excl. forks)
- Top 5 languages by repo size: C++ 29.5%, Python 28.9%, Smarty 19.1%, Jupyter Notebook 17.2%, JavaScript 4.3%
- `contributionsThisYear`: 0 (GraphQL requires auth scope; kept at 0, CI can populate later)
- Cache written to `src/data/github-stats-cache.json`

## Build Verification
- `npx astro check` — 0 errors, 0 warnings
- `npm run build` — exits 0 (23.7s); fetch fails in sandbox (no outbound network), cache used, warning logged
- `GITHUB_TOKEN=fake npm run build` — exits 0 (23.3s); fallback path confirmed

## Key Decisions
- `process.cwd()` used for cache path instead of `__dirname` — `dist/` bundle loses source-relative paths
- `contributionsThisYear` kept at 0 (optional field, GraphQL needs `read:user` scope)
- Smarty (template engine) and Jupyter Notebook appear large because legacy repos dominate; data is accurate
- Zero runtime JS: no `client:*` directives, no `<script>` blocks in new components

## Unresolved Questions
- `contributionsThisYear` is always 0 without a token with `read:user` scope; Phase 10 CI can set `GITHUB_TOKEN` to populate this field automatically on each deploy
- Smarty showing at 19.1% may surprise visitors — could filter it out in a future iteration if desired
