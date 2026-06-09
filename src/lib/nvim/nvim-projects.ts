/**
 * nvim-projects.ts — Assemble the ordered NvimProject[] for the shell.
 * Single source of truth = `src/content/projects/*`. README body prefers the
 * build-time generated `projectReadmes` collection, else the project's own
 * markdown body. Stars + git status come from the cached repo meta.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { FEATURED_ORDER } from '../featured-projects-order';
import { getProjectReadme } from '../project-readme';
import repoMeta from '../../data/repo-meta-cache.json';
import type { Lang } from '../../i18n/strings';
import type { NvimProject, GitStatus, DemoMedia } from './nvim-data-types';

type RepoMeta = Record<string, { stars?: number; pushedAt?: string } | undefined>;
const META = repoMeta as RepoMeta;

function entrySlug(id: string): string {
  return id.replace(/\.(md|mdx)$/, '');
}

/** "https://techleague.net/" → "techleague.net" */
function prettyHost(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** Cosmetic git column — recency / popularity drives the colored marker. */
function gitStatusFor(slug: string, stars: number): GitStatus | undefined {
  const pushed = META[slug]?.pushedAt ?? '';
  if (pushed.startsWith('2026')) return 'm';
  if (stars === 0) return 'u';
  return 'a';
}

/** Live-demo media: public live URL → screenshot+open↗; deployed private svc → preview+lock. */
function demoFor(
  data: CollectionEntry<'projects'>['data'],
  slug: string,
  cover?: string,
): DemoMedia | undefined {
  if (!cover) return undefined;
  if (data.demo) {
    return { src: cover, url: prettyHost(data.demo), href: data.demo, private: false };
  }
  if (data.featured && (data.category === 'ai-ml' || data.category === 'devops')) {
    return { src: cover, url: `${slug}/predict`, private: true };
  }
  return undefined;
}

export async function buildNvimProjects(lang: Lang): Promise<NvimProject[]> {
  const entries = await getCollection('projects');
  const bySlug = new Map(
    entries.map((e: CollectionEntry<'projects'>) => [entrySlug(e.id), e]),
  );
  const ordered = FEATURED_ORDER.map((s) => bySlug.get(s)).filter(
    (e): e is CollectionEntry<'projects'> => e !== undefined,
  );
  const prefix = lang === 'vi' ? '/vi' : '';

  return Promise.all(
    ordered.map(async (e) => {
      const slug = entrySlug(e.id);
      const generated = await getProjectReadme(slug);
      const readme = generated?.body ?? e.body ?? '';
      const stars = e.data.stars ?? META[slug]?.stars ?? 0;
      return {
        key: slug,
        title: e.data.title,
        desc: e.data.summary[lang] ?? e.data.summary.en,
        stack: e.data.stack,
        stars,
        featured: e.data.featured,
        cover: e.data.cover,
        href: `${prefix}/projects/${slug}/`,
        repo: e.data.repo,
        readme,
        demo: demoFor(e.data, slug, e.data.cover),
        gitStatus: gitStatusFor(slug, stars),
      } satisfies NvimProject;
    }),
  );
}
