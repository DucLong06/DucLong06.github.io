/**
 * build-experience-track.ts — TRAIN station data.
 * Loads the experience collection and sorts CHRONOLOGICALLY (period.start asc)
 * → [FSI 2019, CyberEye 2020, FPT 2023]. NOTE: the content `order` field is
 * reverse (FPT=1); the journey deliberately ignores it and sorts by date.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ExperienceEpoch, Lang, PipelineMetric } from './pipeline-data-types';

type ExpEntry = CollectionEntry<'experience'>;
type ExpProject = ExpEntry['data']['projects'][number];
type ExpMetric = ExpProject['metrics'][number];

/** "2023-01" → localized "Jan 2023"; ongoing → "Present". */
function periodLabel(start: string, end: string | null, lang: Lang): string {
  const fmt = (ym: string) => {
    const [y, m] = ym.split('-').map(Number);
    const d = new Date(y, (m ?? 1) - 1, 1);
    return d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  };
  const endLabel = end ? fmt(end) : lang === 'vi' ? 'Hiện tại' : 'Present';
  return `${fmt(start)} — ${endLabel}`;
}

export async function buildExperienceTrack(lang: Lang): Promise<ExperienceEpoch[]> {
  const entries = await getCollection('experience');
  const sorted = entries.sort((a: ExpEntry, b: ExpEntry) =>
    a.data.period.start.localeCompare(b.data.period.start),
  );

  return sorted.map((e: ExpEntry) => ({
    company: e.data.company,
    role: e.data.role[lang] ?? e.data.role.en,
    periodLabel: periodLabel(e.data.period.start, e.data.period.end, lang),
    ongoing: e.data.period.end === null,
    stack: e.data.stack,
    projects: e.data.projects.map((p: ExpProject) => ({
      name: p.name,
      summary: p.summary[lang] ?? p.summary.en,
      tech: p.tech,
      metrics: p.metrics.map(
        (m: ExpMetric): PipelineMetric => ({
          label: m.label[lang] ?? m.label.en,
          value: m.value,
          suffix: m.suffix,
          kind: m.kind,
          text: m.text ? (m.text[lang] ?? m.text.en) : undefined,
        }),
      ),
    })),
  }));
}
