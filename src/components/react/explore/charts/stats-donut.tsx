/**
 * stats-donut.tsx — Donut of top languages (by % of repo size). Wraps DonutSvg.
 */
import DonutSvg, { type DonutSegment } from './donut-svg';
import { chartColor } from './chart-colors';

interface Props {
  languages: { name: string; percentage: number }[];
}

export default function StatsDonut({ languages }: Props) {
  const segments: DonutSegment[] = languages.map((l, i) => ({
    label: l.name,
    value: l.percentage,
    color: chartColor(i),
  }));
  return <DonutSvg segments={segments} />;
}
