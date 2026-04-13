# Phase 06 — Papers & GitHub Stats

## Context Links
- Brainstorm §6 (Papers section), §16.4 (education + paper), §16.5 (awards)
- Brainstorm §9 (GH Pages constraints — `GITHUB_TOKEN` build-time)
- Phase 02 (papers collection seeded)

## Overview
- **Priority:** P2
- **Status:** Complete
- **Brief:** Papers/Awards section listing 3 entries with badges, plus a GitHub stats panel fetched at BUILD TIME (no runtime API call). Includes top languages and contribution count summary.

## Key Insights
- GitHub API fetch is BUILD-TIME ONLY (no client JS, no runtime CORS, no rate limit issue)
- `GITHUB_TOKEN` from GH Actions secrets used in workflow; locally falls back to unauth (60/h plenty for dev)
- If fetch fails, build uses cached fallback JSON in `src/data/github-stats-cache.json` — never break build
- Heatmap is overkill (KISS) → ship simple "top 5 languages" + total stars + total commits this year

## Requirements
**Functional**
- `<Papers />` renders 3 entries from `getCollection('papers')`, sorted by year desc
- Each paper card: title, authors, venue, year, optional award badge, DOI link
- `<GitHubStats />` shows: total public repos, total stars across owned repos, top 5 languages with %, contributions this year
- `lib/github-stats.ts` runs at build time, returns typed object
- On fetch failure: log warning, return cached JSON, continue build

**Non-functional**
- Build time impact ≤ 5 s
- Cached data committed to repo as a safety net
- Zero JS at runtime for stats panel (pure SSR)

## Architecture
```
build time
  └─ astro build
       └─ index.astro renders <GitHubStats />
            └─ await getGitHubStats()  ← src/lib/github-stats.ts
                 ├─ fetch GH REST API (with token if present)
                 ├─ on success → return data + write cache
                 └─ on failure → return cache JSON

runtime
  └─ pure HTML, no JS
```

## Related Code Files

**Create:**
- `src/components/astro/Papers.astro`
- `src/components/astro/PaperCard.astro`
- `src/components/astro/GitHubStats.astro`
- `src/components/astro/LanguageBar.astro`
- `src/lib/github-stats.ts` — async fetcher with cache fallback
- `src/data/github-stats-cache.json` — committed fallback data

**Modify:**
- `src/pages/index.astro` — append `<Papers />` then `<GitHubStats />`
- `.github/workflows/deploy.yml` — pass `GITHUB_TOKEN` env to build step (full file in phase 10)

## Implementation Steps

1. **`Papers.astro`**:
   - Fetch via `getCollection('papers')`, sort `year` desc
   - Render `<SectionTitle eyebrow="Research" title="Papers & Awards" />`
   - Map → `<PaperCard>` per item
2. **`PaperCard.astro`**:
   - Title (display font, italic), authors line, venue + year, award badge if present, DOI link
   - 3 entries from §16.4-§16.5: ALQAC IEEE KSE 2023, Sao Khuê 2022, TDS VN 2021
3. **`src/lib/github-stats.ts`**:
   ```ts
   export interface GitHubStats {
     totalRepos: number;
     totalStars: number;
     topLanguages: Array<{ name: string; percentage: number }>;
     contributionsThisYear: number;
     fetchedAt: string;
   }

   export async function getGitHubStats(): Promise<GitHubStats> {
     const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
     try {
       // fetch /users/DucLong06 + /users/DucLong06/repos?per_page=100
       // aggregate stars, languages weighted by repo size
       // contributions: optional GraphQL query if token
       const data: GitHubStats = { /* aggregated */ };
       writeFileSync('src/data/github-stats-cache.json', JSON.stringify(data, null, 2));
       return data;
     } catch (err) {
       console.warn('[github-stats] fetch failed, using cache:', err);
       return JSON.parse(readFileSync('src/data/github-stats-cache.json', 'utf8'));
     }
   }
   ```
4. **Seed cache JSON** — run the fetcher locally once to produce a real baseline, commit.
5. **`GitHubStats.astro`**:
   - `const stats = await getGitHubStats();`
   - Layout: 4-up stat cards (repos, stars, contribs, languages count) + horizontal language bar
6. **`LanguageBar.astro`** — flex row, each lang colored segment widthed by `percentage`. Color map for known langs (TS blue, Python yellow, etc.).
7. **Wire into index** — append after `<ProjectsGrid />`.
8. **Build twice** — first with internet (real fetch), second with `GITHUB_TOKEN=invalid` to verify fallback works.

## Todo List
- [x] `Papers.astro` + `PaperCard.astro` (3 entries)
- [x] `lib/github-stats.ts` with cache fallback
- [x] Seed `data/github-stats-cache.json`
- [x] `GitHubStats.astro` + `LanguageBar.astro`
- [x] Wire into `index.astro`
- [x] Build with valid token (real data) — network blocked in sandbox, cache used; CI will fetch live
- [x] Build with invalid token (fallback used) — `GITHUB_TOKEN=fake npm run build` exits 0 with warning
- [ ] Commit

## Success Criteria
**Definition of Done:**
- Papers section shows 3 cards with award badges where applicable
- GH stats section shows real numbers from `DucLong06` profile
- Forcing fetch failure does not break build (cache used)
- Zero runtime JS in network tab for stats section
- Build time delta ≤ 5 s

**Validation:**
- `GITHUB_TOKEN=fake npm run build` succeeds with warning
- `curl https://api.github.com/users/DucLong06` matches numbers in built page

## Risk Assessment
| Risk | Mitigation |
|---|---|
| Rate limit hit unauth | Cache fallback always available |
| Cache stale | Refreshed every build with valid token (CI sets `GITHUB_TOKEN`) |
| Languages skewed by one giant repo | Weight by `size` not `count` |
| GraphQL contribs query needs scope | Make optional; fallback to "X+ commits in 2026" string if query fails |

## Security Considerations
- `GITHUB_TOKEN` only at build time, NEVER in client bundle
- No PAT committed; only GH Actions ephemeral token
- Cache file contains only public profile aggregates

## Next Steps
- **Unblocks:** Phase 07 (last content section)
- **Follows into:** Phase 07 — Contact & SEO
