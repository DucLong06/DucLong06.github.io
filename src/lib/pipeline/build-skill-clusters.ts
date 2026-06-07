/**
 * build-skill-clusters.ts — TRANSFORM station data.
 * Reads the skills collection (skills/main.yaml) → 6 clusters, each tagged with
 * a neon accent. Single source of truth: skills/main.yaml (no duplication).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { clusterColor } from './pipeline-palette';
import type { SkillCluster } from './pipeline-data-types';

type SkillGroup = CollectionEntry<'skills'>['data']['groups'][number];
type SkillItem = SkillGroup['items'][number];

export async function buildSkillClusters(): Promise<SkillCluster[]> {
  const entries = await getCollection('skills');
  const main = entries.find((e: CollectionEntry<'skills'>) => e.id.replace(/\.\w+$/, '') === 'main');
  if (!main) return [];
  return main.data.groups.map((g: SkillGroup) => ({
    category: g.category,
    color: clusterColor(g.category),
    items: g.items.map((it: SkillItem) => ({ name: it.name, level: it.level, years: it.years })),
  }));
}
