/**
 * github-stats.ts — Build-time GitHub stats fetcher with cache fallback.
 * Fetches public REST API endpoints for DucLong06, aggregates stars and
 * language percentages weighted by repo size. Never throws — falls back to
 * src/data/github-stats-cache.json on any failure.
 *
 * Zero runtime JS: called only from Astro SSR components during `astro build`.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// process.cwd() is the project root both in dev and during `astro build`
const CACHE_PATH = join(process.cwd(), 'src/data/github-stats-cache.json');

const GITHUB_USER = 'DucLong06';
const API_BASE = 'https://api.github.com';

export interface LanguageStat {
  name: string;
  percentage: number;
}

export interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  /** Top 5 languages sorted by weighted repo size, percentages sum ≤ 100 */
  topLanguages: LanguageStat[];
  contributionsThisYear: number;
  fetchedAt: string;
}

interface GHRepo {
  stargazers_count: number;
  size: number;
  language: string | null;
  fork: boolean;
}

/** Build request headers — attaches token when available for higher rate limit. */
function buildHeaders(): Record<string, string> {
  const token =
    (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.GITHUB_TOKEN) ??
    process.env['GITHUB_TOKEN'];
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token && token !== 'fake' && token !== 'invalid') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/** Aggregate repos into GitHubStats — excludes forks. */
function aggregateRepos(repos: GHRepo[]): Pick<GitHubStats, 'totalStars' | 'topLanguages'> {
  const owned = repos.filter((r) => !r.fork);
  const totalStars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);

  // Weight languages by repo size (KB)
  const langSizes: Record<string, number> = {};
  for (const r of owned) {
    if (r.language && r.size > 0) {
      langSizes[r.language] = (langSizes[r.language] ?? 0) + r.size;
    }
  }
  const totalSize = Object.values(langSizes).reduce((a, b) => a + b, 0);

  const topLanguages: LanguageStat[] = Object.entries(langSizes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, size]) => ({
      name,
      percentage: totalSize > 0 ? Math.round((size / totalSize) * 1000) / 10 : 0,
    }));

  return { totalStars, topLanguages };
}

/** Read and parse the committed cache file. */
function readCache(): GitHubStats {
  const raw = readFileSync(CACHE_PATH, 'utf8');
  return JSON.parse(raw) as GitHubStats;
}

/**
 * Fetch live GitHub stats for DucLong06. On any error, returns cached data
 * and logs a warning — build is never broken.
 */
export async function getGitHubStats(): Promise<GitHubStats> {
  const headers = buildHeaders();

  try {
    // Fetch user profile for public_repos count
    const userRes = await fetch(`${API_BASE}/users/${GITHUB_USER}`, { headers });
    if (!userRes.ok) throw new Error(`User fetch ${userRes.status}: ${userRes.statusText}`);
    const user = (await userRes.json()) as { public_repos: number };

    // Fetch up to 100 repos (REST API max per page)
    const reposRes = await fetch(
      `${API_BASE}/users/${GITHUB_USER}/repos?per_page=100&type=owner`,
      { headers },
    );
    if (!reposRes.ok) throw new Error(`Repos fetch ${reposRes.status}: ${reposRes.statusText}`);
    const repos = (await reposRes.json()) as GHRepo[];

    const { totalStars, topLanguages } = aggregateRepos(repos);

    const stats: GitHubStats = {
      totalRepos: user.public_repos,
      totalStars,
      topLanguages,
      contributionsThisYear: 0, // GraphQL needs scope; kept at 0 for unauthenticated
      fetchedAt: new Date().toISOString(),
    };

    // Update cache with fresh data
    try {
      writeFileSync(CACHE_PATH, JSON.stringify(stats, null, 2));
    } catch (writeErr) {
      console.warn('[github-stats] cache write failed (read-only FS?):', writeErr);
    }

    return stats;
  } catch (err) {
    console.warn('[github-stats] fetch failed — using committed cache:', (err as Error).message);
    return readCache();
  }
}
