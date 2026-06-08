/**
 * stage-payload-registry.ts — Maps a slice to its 3D stage payload (pure).
 *
 * The pie is a navigation shell, not a data chart, so each slice carries a payload
 * keyed to its section type. Quantitative slices (Skills, Stats) return sprout-bar
 * data; every other slice returns null → the slice relies on its DOM panel only
 * (the panel is always the accessible source of truth, regardless of payload kind).
 */
import { chartColor } from './charts/chart-colors';
import type { ExploreData } from './explore-types';
import type { WedgeId } from './wedges-config';

export interface PieBar {
  label: string;
  /** Normalized 0–1 → bar height. */
  value: number;
  /** Human-readable measure shown on the floating card. */
  display: string;
  color: string;
}

function avgLevel(levels: number[]): number {
  if (!levels.length) return 0;
  return levels.reduce((s, n) => s + n, 0) / levels.length;
}

/** Bars for the stage, or null when the slice has no quantitative payload. */
export function stageBars(wedgeId: WedgeId | null, data: ExploreData): PieBar[] | null {
  switch (wedgeId) {
    case 'skills':
      return data.skills.map((g, i) => {
        const avg = avgLevel(g.items.map((it) => it.level));
        return { label: g.category, value: avg / 5, display: `${avg.toFixed(1)}/5`, color: chartColor(i) };
      });
    case 'stats':
      return data.stats.github.topLanguages
        .slice(0, 7)
        .map((l, i) => ({ label: l.name, value: l.percentage / 100, display: `${l.percentage}%`, color: chartColor(i) }));
    default:
      return null;
  }
}
