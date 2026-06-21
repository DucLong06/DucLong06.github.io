/**
 * build-world-stations.ts — Server-side assembler for the Quantum World payload.
 *
 * Runs in Astro frontmatter (SSR) during build. Reuses `buildSceneData` (the
 * single source for content collections + the GitHub stats cache) for BOTH
 * languages, then overlays genuinely-dynamic values onto the curated bilingual
 * baselines in `world-station-content.ts`:
 *   - dockyard: GitHub repos / stars / language donut (real, from data cache)
 *   - ledger:   achievement chain derived from papers w/ awards
 *   - signal:   contact channels from profile
 *
 * Everything returned is JSON-serializable (see WorldData).
 */
import { buildSceneData } from './build-scene-data';
import type { Lang } from '../../i18n/strings';
import {
  STATION_ORDER, STATION_COLOR, CHROME, PANELS, ASIDES, REPRESENTATIVE,
} from './world-station-content';
import type {
  WorldData, WorldStation, ChartSpec, WorldStationId, Aside, AsideBlock,
} from './world-data-types';

/** Scene palette accents, cycled for donut segments lacking an explicit color. */
const DONUT_COLORS = ['#38e1ff', '#a06bff', '#74f0a4', '#f5b449', '#ec6ad0', '#9b8cff'];

/** Deterministic 8-hex "block hash" from a string (ledger flavor, not crypto). */
function pseudoHash(seed: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 8);
}

/** Build the per-station chart specs, overlaying dynamic data where owned. */
function chartsFor(
  id: WorldStationId,
  L: Lang,
  langDonut: { label: string; val: number; color: string }[],
  ledgerBlocks: { h: number; title: string; hash: string; meta: string }[],
): ChartSpec[] {
  const T = (en: string, vi: string) => (L === 'vi' ? vi : en);
  switch (id) {
    case 'identity':
      return [{ type: 'radar', title: T('Capability vector', 'Vector năng lực'), live: 'LIVE',
        data: { axes: REPRESENTATIVE.skillsRadar, max: REPRESENTATIVE.radarMax } }];
    case 'telemetry':
      return [
        { type: 'line', title: T('Merge requests reviewed / month', 'MR đã review / tháng'), live: 'STREAM',
          data: REPRESENTATIVE.mrsLine },
        { type: 'bars', title: T('Throughput by system', 'Thông lượng theo hệ thống'),
          data: REPRESENTATIVE.throughputBars },
      ];
    case 'expertise':
      return [{ type: 'k8s', title: T('Production cluster · GKE topology', 'Cụm production · GKE'), live: 'HEALTHY' }];
    case 'quantum':
      return [
        { type: 'bloch', title: T('State vector · Bloch', 'Vector trạng thái · Bloch'), live: 'COHERENT' },
        { type: 'circuit', title: T('Circuit · H · X · CNOT', 'Mạch · H · X · CNOT') },
      ];
    case 'ledger':
      return [{ type: 'ledger', title: T('Achievement chain', 'Chuỗi thành tựu'), live: 'VALID', gold: true,
        wide: true, data: ledgerBlocks }];
    case 'dockyard':
      return [
        { type: 'heatmap', title: T('Contribution heatmap · 26 weeks', 'Bản đồ nhiệt · 26 tuần'), live: 'ACTIVE',
          data: REPRESENTATIVE.ghHeatWeeks },
        { type: 'donut', title: T('Language distribution', 'Phân bố ngôn ngữ'), data: langDonut },
      ];
    case 'signal':
    default:
      return [];
  }
}

/** Replace a `rows`/`list` aside block's items wholesale (used for dockyard stats). */
function overrideRows(aside: Aside, title: string, items: { k: string; v: string }[]): Aside {
  return {
    ...aside,
    blocks: aside.blocks.map((b): AsideBlock =>
      b.kind === 'rows' && b.title === title ? { ...b, items } : b),
  };
}

/** Assemble the full Quantum World payload (both languages embedded). */
export async function buildWorldStations(): Promise<WorldData> {
  // buildSceneData owns content collections + GitHub cache. The dynamic values
  // we overlay (GitHub stats, paper venues, contact channels) are language-
  // neutral, so a single EN assembly is sufficient; curated copy is already
  // bilingual in world-station-content.ts.
  const en = await buildSceneData('en');
  const gh = en.github;

  // ── Real: language donut from the GitHub stats cache ──────────────────────
  const langDonut = gh.topLanguages.slice(0, 5).map((l, i) => ({
    label: l.name, val: l.percentage, color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  // ── Real-ish: ledger chain derived from papers (awards first), hashed ─────
  const awardedPapers = [...en.papers].sort((a, b) =>
    Number(Boolean(b.award)) - Number(Boolean(a.award)) || b.year - a.year);
  const ledgerBlocks = awardedPapers.slice(0, 3).map((p) => ({
    h: p.year,
    title: p.award ? `${p.award} · ${p.venue}` : p.title,
    hash: pseudoHash(`${p.title}-${p.year}`),
    meta: `${p.venue}`,
  }));

  const stations: WorldStation[] = STATION_ORDER.map((id): WorldStation => {
    const panel = { en: PANELS[id].en, vi: PANELS[id].vi };
    let aside = { en: ASIDES[id].en, vi: ASIDES[id].vi };

    // dockyard: overlay live GitHub repo / star counts onto the curated rows.
    if (id === 'dockyard') {
      const top = gh.topLanguages.slice(0, 2).map((l) => l.name).join(' · ') || 'C++ · Python';
      aside = {
        en: overrideRows(aside.en, 'GitHub @DucLong06', [
          { k: 'Repos', v: String(gh.totalRepos) }, { k: 'Stars', v: String(gh.totalStars) },
          { k: 'Top langs', v: top },
        ]),
        vi: overrideRows(aside.vi, 'GitHub @DucLong06', [
          { k: 'Repo', v: String(gh.totalRepos) }, { k: 'Sao', v: String(gh.totalStars) },
          { k: 'Top ngôn ngữ', v: top },
        ]),
      };
    }

    return {
      id,
      color: STATION_COLOR[id],
      panel,
      aside,
      charts: {
        en: chartsFor(id, 'en', langDonut, ledgerBlocks),
        vi: chartsFor(id, 'vi', langDonut, ledgerBlocks),
      },
    };
  });

  return {
    stations,
    chrome: { en: CHROME.en, vi: CHROME.vi },
    contact: {
      email: en.profile.email,
      github: en.profile.github,
      linkedin: en.profile.linkedin,
      handle: gh.handle,
    },
  };
}
