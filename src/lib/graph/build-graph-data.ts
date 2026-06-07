/**
 * build-graph-data.ts — Server-side assembler for the knowledge-graph payload.
 *
 * Runs in Astro frontmatter at build (SSR). Reads the SAME content collections
 * as the 2D site, derives a typed node/link graph (YOU → company → project +
 * cross-linking tech, plus section/stat/language nodes), precomputes a 3D force
 * layout, and returns JSON-serializable GraphData for the graph island.
 *
 * Single source of truth: editing src/content/** updates BOTH the 2D site and
 * the graph — no graph code changes needed to update content.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getGitHubStats } from '../github-stats';
import { STRINGS, type Lang } from '../../i18n/strings';
import { NODE_COLORS, NODE_SIZES, languageColor } from './graph-palette';
import { computeLayout } from './graph-layout';
import type { GraphData, GraphNode, GraphLink, GraphMetric } from './graph-data-types';

/** Section nav targets — ids must exist in the SSR'd 2D markup (content-first). */
const SECTIONS: { id: string; key: keyof typeof STRINGS.en; target: string }[] = [
  { id: 'about', key: 'graph_section_about', target: '#about' },
  { id: 'experience', key: 'graph_section_experience', target: '#experience' },
  { id: 'skills', key: 'graph_section_skills', target: '#skills' },
  { id: 'projects', key: 'graph_section_projects', target: '#work' },
  { id: 'papers', key: 'graph_section_papers', target: '#research' },
  { id: 'contact', key: 'graph_section_contact', target: '#contact' },
];

type Pick2<T> = { en: T; vi: T };
const loc = <T>(field: Pick2<T> | undefined, lang: Lang): T | undefined =>
  field ? (field[lang] ?? field.en) : undefined;

function newNode(partial: Omit<GraphNode, 'x' | 'y' | 'z' | 'color' | 'size'> &
  Partial<Pick<GraphNode, 'color' | 'size'>>): GraphNode {
  return {
    color: NODE_COLORS[partial.type],
    size: NODE_SIZES[partial.type],
    x: 0,
    y: 0,
    z: 0,
    ...partial,
  };
}

/** Assemble the full graph payload for a language. */
export async function buildGraphData(lang: Lang): Promise<GraphData> {
  const s = STRINGS[lang];
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // ── Root (YOU) ───────────────────────────────────────────────────────────
  const profile = (await getCollection('profile')).find(
    (e: CollectionEntry<'profile'>) => e.id.replace(/\.\w+$/, '') === 'main',
  )!.data;
  nodes.push(
    newNode({
      id: 'root',
      type: 'root',
      label: profile.name[lang] ?? profile.name.en,
      sublabel: s.graph_root_sublabel,
    }),
  );

  // ── Section nav nodes ────────────────────────────────────────────────────
  for (const sec of SECTIONS) {
    nodes.push(
      newNode({
        id: `section:${sec.id}`,
        type: 'section',
        label: s[sec.key],
        nav: { kind: 'scroll', target: sec.target },
      }),
    );
    links.push({ source: 'root', target: `section:${sec.id}`, type: 'nav' });
  }

  // ── Companies → projects → tech ──────────────────────────────────────────
  const techIds = new Set<string>();
  const experience = (await getCollection('experience')).sort(
    (a: CollectionEntry<'experience'>, b: CollectionEntry<'experience'>) =>
      a.data.order - b.data.order,
  );

  for (const exp of experience) {
    const companyId = `company:${exp.data.company}`;
    nodes.push(
      newNode({
        id: companyId,
        type: 'company',
        label: exp.data.company,
        sublabel: exp.data.role[lang] ?? exp.data.role.en,
        tech: exp.data.stack,
      }),
    );
    links.push({ source: 'root', target: companyId, type: 'belongs' });

    for (const proj of exp.data.projects) {
      const projId = `project:${proj.name}`;
      type ExpProject = CollectionEntry<'experience'>['data']['projects'][number];
      const metrics: GraphMetric[] = proj.metrics.map((m: ExpProject['metrics'][number]) => ({
        label: m.label[lang] ?? m.label.en,
        value: m.value,
        suffix: m.suffix,
        kind: m.kind,
        text: loc(m.text, lang),
      }));
      nodes.push(
        newNode({
          id: projId,
          type: 'project',
          label: proj.name,
          summary: proj.summary[lang] ?? proj.summary.en,
          metrics,
          tech: proj.tech,
          repo: proj.repo,
          demo: proj.demo,
        }),
      );
      links.push({ source: companyId, target: projId, type: 'belongs' });

      for (const tech of proj.tech) {
        const techId = `tech:${tech}`;
        if (!techIds.has(techId)) {
          techIds.add(techId);
          nodes.push(newNode({ id: techId, type: 'tech', label: tech }));
        }
        links.push({ source: projId, target: techId, type: 'uses' });
      }
    }
  }

  // ── GitHub languages + headline stats ────────────────────────────────────
  const gh = await getGitHubStats();
  const maxPct = Math.max(...gh.topLanguages.map((l) => l.percentage), 1);
  for (const langStat of gh.topLanguages) {
    const id = `language:${langStat.name}`;
    nodes.push(
      newNode({
        id,
        type: 'language',
        label: langStat.name,
        percentage: langStat.percentage,
        value: `${langStat.percentage}%`,
        color: languageColor(langStat.name),
        size: NODE_SIZES.language * (0.7 + (langStat.percentage / maxPct) * 0.8),
      }),
    );
    links.push({ source: 'section:skills', target: id, type: 'belongs' });
  }

  const stats: { id: string; value: number; label: string }[] = [
    { id: 'repos', value: gh.totalRepos, label: s.graph_stat_repos },
    { id: 'stars', value: gh.totalStars, label: s.graph_stat_stars },
  ];
  for (const stat of stats) {
    const id = `stat:${stat.id}`;
    nodes.push(
      newNode({
        id,
        type: 'stat',
        label: stat.label,
        value: String(stat.value),
      }),
    );
    links.push({ source: 'root', target: id, type: 'belongs' });
  }

  computeLayout(nodes, links);
  return { lang, nodes, links };
}
