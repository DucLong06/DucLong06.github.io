/**
 * build-impact-data.ts — IMPACT station data.
 * Assembles headline highlights (profile) + papers/awards (papers collection).
 * Papers sorted newest-first. All real links preserved for the DOM overlay.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImpactData, Lang } from './pipeline-data-types';

type ProfileHighlight = CollectionEntry<'profile'>['data']['highlights'][number];
type PaperEntry = CollectionEntry<'papers'>;

export async function buildImpactData(lang: Lang): Promise<ImpactData> {
  const profiles = await getCollection('profile');
  const main = profiles.find((e: CollectionEntry<'profile'>) => e.id.replace(/\.\w+$/, '') === 'main');
  const papers = await getCollection('papers');

  const highlights = (main?.data.highlights ?? []).map((h: ProfileHighlight) => ({
    value: h.value[lang] ?? h.value.en,
    label: h.label[lang] ?? h.label.en,
    accent: h.accent,
  }));

  const sortedPapers = papers
    .sort((a: PaperEntry, b: PaperEntry) => b.data.year - a.data.year)
    .map((p: PaperEntry) => ({
      title: p.data.title,
      venue: p.data.venue,
      year: p.data.year,
      link: p.data.pdf ?? p.data.doi,
      award: p.data.award,
    }));

  return { highlights, papers: sortedPapers };
}
