/**
 * github-repo-meta.ts — Build-time per-repo GitHub metadata (stars, last push,
 * topics, primary language) with per-repo cache fallback. Reuses `buildHeaders`
 * from github-stats.ts (token/PAT + versioning). Never throws — each repo falls
 * back to its committed cache entry on failure, so the build is never broken.
 *
 * Zero runtime JS: invoked only from Astro components during `astro build`.
 * Powers the live stats badge on project cards (Phase 05).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildHeaders } from './github-stats';

const CACHE_PATH = join(process.cwd(), 'src/data/repo-meta-cache.json');
const API_BASE = 'https://api.github.com';

/** A row from scripts/project-repos.config.mjs (typed here so the .ts layer stays self-contained). */
export interface ManifestRow {
  slug: string;
  owner: string;
  repo: string | null;
  private: boolean;
}

export interface RepoMeta {
  slug: string;
  stars: number;
  /** ISO timestamp of the last push (repo `pushed_at`). */
  pushedAt: string;
  topics: string[];
  primaryLanguage: string | null;
  fetchedAt: string;
}

/** Cache shape: keyed by project slug. */
type RepoMetaCache = Record<string, RepoMeta>;

interface GHRepoResponse {
  stargazers_count: number;
  pushed_at: string;
  language: string | null;
  topics?: string[];
}

interface GHTopicsResponse {
  names: string[];
}

/** Read the committed cache; returns empty object when missing/corrupt. */
function readCache(): RepoMetaCache {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as RepoMetaCache;
  } catch {
    return {};
  }
}

/** Fetch fresh meta for one repo. Returns null on any failure (caller uses cache). */
async function fetchOne(row: ManifestRow): Promise<RepoMeta | null> {
  if (!row.repo) return null;
  const headers = buildHeaders();
  try {
    const repoRes = await fetch(`${API_BASE}/repos/${row.owner}/${row.repo}`, { headers });
    if (!repoRes.ok) throw new Error(`repo ${repoRes.status}`);
    const repo = (await repoRes.json()) as GHRepoResponse;

    // Topics: modern API returns them inline on the repo object; fall back to the
    // dedicated endpoint when absent. mercy-preview header is no longer required.
    let topics = repo.topics ?? [];
    if (topics.length === 0) {
      try {
        const topicsRes = await fetch(`${API_BASE}/repos/${row.owner}/${row.repo}/topics`, { headers });
        if (topicsRes.ok) topics = ((await topicsRes.json()) as GHTopicsResponse).names ?? [];
      } catch {
        /* topics are optional — ignore */
      }
    }

    return {
      slug: row.slug,
      stars: repo.stargazers_count ?? 0,
      pushedAt: repo.pushed_at,
      topics,
      primaryLanguage: repo.language ?? null,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[repo-meta] ${row.owner}/${row.repo} fetch failed — using cache:`, (err as Error).message);
    return null;
  }
}

async function runAll(manifest: ManifestRow[]): Promise<RepoMetaCache> {
  const cache = readCache();
  const result: RepoMetaCache = { ...cache };

  for (const row of manifest) {
    if (!row.repo) continue;
    const fresh = await fetchOne(row);
    if (fresh) {
      result[row.slug] = fresh;
    } else if (cache[row.slug]) {
      result[row.slug] = cache[row.slug];
    }
  }

  try {
    writeFileSync(CACHE_PATH, JSON.stringify(result, null, 2));
  } catch (writeErr) {
    console.warn('[repo-meta] cache write failed (read-only FS?):', writeErr);
  }

  return result;
}

// Memoise across the whole build: both the EN and VI page renders call this, so
// without a single shared promise we'd fetch twice AND race the cache write.
let cachedRun: Promise<RepoMetaCache> | null = null;

/**
 * Fetch meta for every fetchable manifest row. Live data when reachable, cached
 * per-repo otherwise. Runs at most once per build (memoised). Returns a map by slug.
 */
export function getAllRepoMeta(manifest: ManifestRow[]): Promise<RepoMetaCache> {
  if (!cachedRun) cachedRun = runAll(manifest);
  return cachedRun;
}
