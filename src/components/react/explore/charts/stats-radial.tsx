/**
 * stats-radial.tsx — Concentric radial progress rings, one per top language.
 * Each ring arc length = language % of 100. Pure SVG; aria-hidden (SR table in panel).
 */
import { chartColor } from './chart-colors';

interface Props {
  languages: { name: string; percentage: number }[];
}

const SIZE = 210;
const C = SIZE / 2;
const GAP = 17;
const STROKE = 11;
const OUTER = 92;

export default function StatsRadial({ languages }: Props) {
  return (
    <div className="chart-donut">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="chart-svg chart-svg--radial" aria-hidden="true">
        {languages.map((l, i) => {
          const r = OUTER - i * GAP;
          if (r <= 0) return null;
          const circ = 2 * Math.PI * r;
          const len = (l.percentage / 100) * circ;
          return (
            <g key={l.name}>
              <circle cx={C} cy={C} r={r} className="chart-radial__track" strokeWidth={STROKE} fill="none" />
              <circle
                cx={C}
                cy={C}
                r={r}
                fill="none"
                stroke={chartColor(i)}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${len} ${circ - len}`}
                transform={`rotate(-90 ${C} ${C})`}
              />
            </g>
          );
        })}
      </svg>
      <ul className="chart-legend" aria-hidden="true">
        {languages.map((l, i) => (
          <li key={l.name} className="chart-legend__item">
            <span className="chart-legend__swatch" style={{ background: chartColor(i) }} />
            <span className="chart-legend__label">{l.name}</span>
            <span className="chart-legend__value">{l.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
