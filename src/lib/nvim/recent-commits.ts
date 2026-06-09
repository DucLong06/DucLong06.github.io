/**
 * recent-commits.ts — Build-time `git log` reader for the dashboard commit feed.
 * CI checkouts are often shallow (fetch-depth 1), so we fall back to a committed
 * snapshot whenever git history is unavailable or too short.
 */
import { execSync } from 'node:child_process';
import type { NvimCommit } from './nvim-data-types';

const FALLBACK: NvimCommit[] = [
  { type: 'fix', hash: '69084d8', msg: 'restore overview on island home return' },
  { type: 'feat', hash: '5328d9f', msg: 'add guided auto-tour + low-poly clouds' },
  { type: 'feat', hash: '9082700', msg: 'auto-enrich projects with GitHub data' },
  { type: 'feat', hash: '674eb9c', msg: 'add 3D low-poly floating island' },
];

const CONVENTIONAL = /^(feat|fix|docs|refactor|test|chore|style|perf|ci|build)(?:\([^)]*\))?:\s*/;

/** Parse tab-separated "hash<TAB>subject" lines into typed conventional commits. */
function parse(raw: string): NvimCommit[] {
  return raw
    .split('\n')
    .map((line) => {
      const [hash, subject = ''] = line.split('\t');
      if (!hash) return null;
      const m = subject.match(CONVENTIONAL);
      const type = m ? m[1] : 'chore';
      const msg = subject.replace(CONVENTIONAL, '').trim() || subject.trim();
      return { type, hash: hash.slice(0, 7), msg };
    })
    .filter((c): c is NvimCommit => c !== null);
}

export function getRecentCommits(limit = 4): NvimCommit[] {
  try {
    const raw = execSync(`git log -${limit} --pretty=format:%h%x09%s`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const commits = parse(raw);
    return commits.length >= 2 ? commits.slice(0, limit) : FALLBACK.slice(0, limit);
  } catch {
    return FALLBACK.slice(0, limit);
  }
}
