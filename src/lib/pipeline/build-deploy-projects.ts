/**
 * build-deploy-projects.ts — DEPLOY station data.
 * Loads the projects collection and orders the "deployed containers". The three
 * signature projects (OCR, Text2SQL, ALQAC) are pinned first per the journey's
 * locked narrative; the remaining slugs follow the shared FEATURED_ORDER. The 2D
 * bento grid keeps using FEATURED_ORDER untouched (no regression there).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { FEATURED_ORDER } from '../featured-projects-order';
import type { DeployProject, Lang } from './pipeline-data-types';

type ProjectEntry = CollectionEntry<'projects'>;

/** Signature projects shown first at DEPLOY (locked decision). */
const PINNED: string[] = ['ocr-api', 'text2sql-vietnamese', 'alqac-2023'];

function deployOrder(): string[] {
  const rest = FEATURED_ORDER.filter((s) => !PINNED.includes(s));
  return [...PINNED, ...rest];
}

export async function buildDeployProjects(lang: Lang): Promise<DeployProject[]> {
  const entries = await getCollection('projects');
  const bySlug = new Map<string, ProjectEntry>(
    entries.map((e: ProjectEntry) => [e.id.replace(/\.(md|mdx)$/, ''), e]),
  );
  const order = deployOrder();
  const base = lang === 'vi' ? '/vi/projects/' : '/projects/';

  return order
    .map((slug) => {
      const e = bySlug.get(slug);
      if (!e) return null;
      const d = e.data;
      const project: DeployProject = {
        slug,
        title: d.title,
        summary: d.summary[lang] ?? d.summary.en,
        stack: d.stack,
        category: d.category,
        featured: PINNED.includes(slug),
        repo: d.repo,
        demo: d.demo,
        href: `${base}${slug}/`,
      };
      return project;
    })
    .filter((p): p is DeployProject => p !== null);
}
