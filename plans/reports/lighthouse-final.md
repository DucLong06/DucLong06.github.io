# Lighthouse Final Report

**Status:** Deferred

Real Lighthouse requires a hosted build with network access and a headless Chromium instance.
Neither is available in this CI-less local environment.

CI in Phase 10 will gate on Lighthouse scores via `lighthouse-ci` (LHCI) action.
Local static analysis (`npx astro check` + `npm run build`) is clean — 0 errors, 0 warnings.

## What was validated locally

| Check | Result |
|---|---|
| `npx astro check` | 0 errors, 0 warnings |
| `npm run build` | exit 0, 15 pages built |
| No `client:load` islands | confirmed |
| All `target="_blank"` have `rel="noopener noreferrer"` | confirmed |
| Skip-to-content link present | confirmed |
| `aria-label` on all icon-only buttons | confirmed |
| `prefers-reduced-motion` guards | 5 locations covered |
| `role="meter"` with aria-value* on SkillBar | confirmed |
| Focus ring visible on `:focus-visible` | confirmed (no `outline:none` suppressions remain) |

## Deferred to Phase 10 CI

- Lighthouse mobile: Performance ≥ 95, A11y ≥ 100, BP ≥ 100, SEO ≥ 100
- Lighthouse desktop: Perf ≥ 98, A11y = 100, BP = 100, SEO = 100
- LCP < 1.8 s, CLS < 0.05, TBT < 200 ms
- axe-core automated scan (0 violations)
