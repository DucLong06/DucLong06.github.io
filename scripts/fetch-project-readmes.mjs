/**
 * fetch-project-readmes.mjs — Prebuild: pull each project's README, extract the
 * portfolio marker section, rehost referenced images/GIFs locally, rewrite their
 * URLs, and write processed markdown into the `project-readmes` content collection
 * for Astro to render (Phase 04). Private repos read via PORTFOLIO_READ_PAT.
 *
 * Build-never-fails: every repo is wrapped in try/catch and the process exits 0
 * even on total failure — committed generated md + assets act as the fallback.
 *
 * Security: token only from env (never logged); downloads restricted to GitHub hosts.
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve, dirname, basename, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { PROJECT_REPOS } from './project-repos.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const README_OUT_DIR = resolve(ROOT, 'src/content/project-readmes');
const ASSETS_OUT_ROOT = resolve(ROOT, 'public/project-assets');

const API_BASE = 'https://api.github.com';
const START_MARKER = '<!-- portfolio:start -->';
const END_MARKER = '<!-- portfolio:end -->';
const ASSET_SIZE_WARN = 5 * 1024 * 1024; // 5MB (GIF guard)
const ALLOWED_IMAGE_HOSTS = new Set([
  'raw.githubusercontent.com',
  'github.com',
  'user-images.githubusercontent.com',
  'camo.githubusercontent.com',
]);

/** Token: fine-grained PAT (reads private) preferred, else default Actions token. */
function token() {
  return process.env.PORTFOLIO_READ_PAT || process.env.GITHUB_TOKEN || '';
}

/** Escape a string for safe use inside an HTML double-quoted attribute. */
function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function headers(accept = 'application/vnd.github+json') {
  const h = { Accept: accept, 'X-GitHub-Api-Version': '2022-11-28' };
  const t = token();
  if (t && t !== 'fake' && t !== 'invalid') h.Authorization = `Bearer ${t}`;
  return h;
}

/** GET /repos/{owner}/{repo} → { default_branch }. Null on failure. */
async function getDefaultBranch(owner, repo) {
  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}`, { headers: headers() });
  if (!res.ok) throw new Error(`repo meta ${res.status}`);
  const json = await res.json();
  return json.default_branch || 'main';
}

/** GET raw README markdown. Null when none. */
async function getReadme(owner, repo) {
  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}/readme`, {
    headers: headers('application/vnd.github.raw+json'),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`readme ${res.status}`);
  return await res.text();
}

/** Slice between portfolio markers; strip a leading H1 to avoid duplicate heading. */
function extractSection(md) {
  const start = md.indexOf(START_MARKER);
  const end = md.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end <= start) return null;
  let section = md.slice(start + START_MARKER.length, end).trim();
  section = section.replace(/^#\s+.*(?:\r?\n)+/, ''); // drop leading H1
  return section.trim() || null;
}

/** Resolve an image ref against the repo's raw base. Returns absolute URL or null (skip download). */
function resolveImageUrl(ref, owner, repo, branch) {
  if (ref.startsWith('data:')) return null; // inline data URI — leave untouched
  if (/^https?:\/\//i.test(ref)) {
    try {
      const host = new URL(ref).hostname;
      return ALLOWED_IMAGE_HOSTS.has(host) ? ref : null; // external (badges) — leave remote
    } catch {
      return null;
    }
  }
  // Relative path → raw.githubusercontent. Normalise leading ./ and / and ../
  const clean = posix.normalize(ref.replace(/^\.?\//, '')).replace(/^(\.\.\/)+/, '');
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${clean}`;
}

/** Download one image to public/project-assets/{slug}/. Returns local web path or null. */
async function downloadImage(url, slug, usedNames) {
  // Sanitise filename; ensure uniqueness across differing source paths.
  let name = basename(new URL(url).pathname) || 'image';
  name = name.split('?')[0].replace(/[^a-zA-Z0-9._-]/g, '_');
  if (/^\.+$/.test(name)) name = 'image'; // reject dot-only names (EISDIR / traversal)
  if (!name.includes('.')) name += '.img';
  if (usedNames.has(name)) {
    const h = createHash('sha1').update(url).digest('hex').slice(0, 6);
    name = `${h}-${name}`;
  }

  const auth = headers().Authorization;
  const isRaw = url.includes('raw.githubusercontent.com');
  const res = await fetch(url, { headers: isRaw && auth ? { Authorization: auth } : {} });
  if (!res.ok) throw new Error(`asset ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > ASSET_SIZE_WARN) {
    console.warn(`[readmes] large asset ${(buf.length / 1048576).toFixed(1)}MB: ${name}`);
  }

  const dir = resolve(ASSETS_OUT_ROOT, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, name), buf);
  usedNames.add(name);
  return `/project-assets/${slug}/${name}`;
}

/**
 * Find every image ref (markdown + <img>), download GitHub-hosted ones, and
 * replace each ref with a lazy-loaded <img> pointing at the local copy (or keep
 * the remote URL for allowed external images like badges).
 */
async function rehostImages(md, { owner, repo, branch, slug }) {
  const used = new Set();
  const refs = new Set();
  for (const m of md.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) refs.add(m[1]);
  for (const m of md.matchAll(/<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi)) refs.add(m[1]);

  const map = new Map(); // original ref -> local/remote replacement url
  for (const ref of refs) {
    try {
      const resolved = resolveImageUrl(ref, owner, repo, branch);
      if (!resolved) continue;
      if (resolved.includes('raw.githubusercontent.com') || resolved.includes('user-images')) {
        const local = await downloadImage(resolved, slug, used);
        if (local) map.set(ref, local);
      } else {
        map.set(ref, resolved); // allowed remote (e.g. user-content badge) kept as-is
      }
    } catch (err) {
      console.warn(`[readmes] image skip (${ref}):`, err.message);
    }
  }

  // Replace markdown image syntax with lazy <img>; rewrite <img src> in place.
  let out = md.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (full, alt, url) => {
    const repl = map.get(url) ?? url;
    return `<img src="${escapeAttr(repl)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async" class="readme-img" />`;
  });
  out = out.replace(/(<img[^>]*\ssrc=["'])([^"']+)(["'][^>]*>)/gi, (full, pre, url, post) => {
    const repl = map.get(url) ?? url;
    const tag = `${pre}${repl}${post}`;
    return /loading=/.test(tag) ? tag : tag.replace(/<img/i, '<img loading="lazy" decoding="async"');
  });
  return out;
}

/** Wipe a slug's previous output so removed images don't linger. */
function resetAssets(slug) {
  const dir = resolve(ASSETS_OUT_ROOT, slug);
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}

async function processRepo(row) {
  if (!row.repo) return { slug: row.slug, status: 'skip (no repo)' };
  const { owner, repo, slug } = row;

  const raw = await getReadme(owner, repo);
  if (!raw) return { slug, status: 'no readme' };

  const section = extractSection(raw);
  if (!section) return { slug, status: 'no markers' };

  const branch = await getDefaultBranch(owner, repo);
  resetAssets(slug);
  const body = await rehostImages(section, { owner, repo, branch, slug });

  const fm = [
    '---',
    `slug: "${slug}"`,
    `sourceRepo: "${owner}/${repo}"`,
    `fetchedAt: "${new Date().toISOString()}"`,
    '---',
    '',
    body,
    '',
  ].join('\n');

  mkdirSync(README_OUT_DIR, { recursive: true });
  writeFileSync(resolve(README_OUT_DIR, `${slug}.md`), fm);
  return { slug, status: 'written' };
}

async function main() {
  mkdirSync(README_OUT_DIR, { recursive: true }); // keep collection dir valid even if empty
  const results = [];
  for (const row of PROJECT_REPOS) {
    try {
      results.push(await processRepo(row));
    } catch (err) {
      console.warn(`[readmes] ${row.slug} failed (non-fatal):`, err.message);
      results.push({ slug: row.slug, status: `error: ${err.message}` });
    }
  }
  const written = results.filter((r) => r.status === 'written').length;
  console.log(`[readmes] ${written} README section(s) generated:`);
  for (const r of results) console.log(`  - ${r.slug}: ${r.status}`);
}

main().catch((err) => {
  console.warn('[readmes] generation failed (non-fatal):', err.message);
  process.exit(0);
});
