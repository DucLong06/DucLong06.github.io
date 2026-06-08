/**
 * skills-radar.tsx — Radar/spider chart of per-group average proficiency (1–5).
 * Pure SVG. Decorative for sighted users; the panel renders a visually-hidden
 * data table for screen readers (aria-hidden here).
 */
import type { SkillGroup } from '../explore-types';

interface Props {
  groups: SkillGroup[];
}

const SIZE = 220;
const C = SIZE / 2;
const R = 82;

function groupAvg(g: SkillGroup): number {
  if (!g.items.length) return 0;
  return g.items.reduce((s, i) => s + i.level, 0) / g.items.length;
}

function point(angle: number, radius: number): [number, number] {
  return [C + Math.cos(angle) * radius, C + Math.sin(angle) * radius];
}

export default function SkillsRadar({ groups }: Props) {
  const n = groups.length;
  const step = (Math.PI * 2) / n;
  const start = -Math.PI / 2;

  const dataPts = groups.map((g, i) => point(start + i * step, R * (groupAvg(g) / 5)));
  const polygon = dataPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="chart-svg chart-svg--radar" aria-hidden="true">
      {/* grid rings */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={groups
            .map((_, i) => point(start + i * step, R * f))
            .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
            .join(' ')}
          className="chart-radar__ring"
        />
      ))}
      {/* axes + labels */}
      {groups.map((g, i) => {
        const [ax, ay] = point(start + i * step, R);
        const [lx, ly] = point(start + i * step, R + 16);
        return (
          <g key={g.category}>
            <line x1={C} y1={C} x2={ax} y2={ay} className="chart-radar__axis" />
            <text x={lx} y={ly} className="chart-radar__label" textAnchor="middle" dominantBaseline="middle">
              {g.category}
            </text>
          </g>
        );
      })}
      {/* data polygon */}
      <polygon points={polygon} className="chart-radar__area" />
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5} className="chart-radar__dot" />
      ))}
    </svg>
  );
}
