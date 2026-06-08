/**
 * skills-donut.tsx — Donut of skill groups sized by combined proficiency
 * (sum of item levels per group). Wraps the shared DonutSvg.
 */
import DonutSvg, { type DonutSegment } from './donut-svg';
import { chartColor } from './chart-colors';
import type { SkillGroup } from '../explore-types';

interface Props {
  groups: SkillGroup[];
}

export default function SkillsDonut({ groups }: Props) {
  const segments: DonutSegment[] = groups.map((g, i) => ({
    label: g.category,
    value: g.items.reduce((s, it) => s + it.level, 0),
    color: chartColor(i),
  }));
  return <DonutSvg segments={segments} caption={`${groups.length}`} />;
}
