/**
 * donut-svg.tsx — Reusable SVG donut chart (shared by skills + stats donuts).
 * Segments sized by value; legend rendered alongside. Decorative (aria-hidden);
 * callers provide an SR-readable summary/table.
 */
export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: DonutSegment[];
  /** Optional center caption (e.g. total). */
  caption?: string;
}

const SIZE = 200;
const C = SIZE / 2;
const R = 72;
const STROKE = 26;
const CIRC = 2 * Math.PI * R;

export default function DonutSvg({ segments, caption }: Props) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;

  return (
    <div className="chart-donut">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="chart-svg chart-svg--donut" aria-hidden="true">
        <circle cx={C} cy={C} r={R} className="chart-donut__track" strokeWidth={STROKE} fill="none" />
        {segments.map((seg) => {
          const frac = seg.value / total;
          const len = frac * CIRC;
          const el = (
            <circle
              key={seg.label}
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${len} ${CIRC - len}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${C} ${C})`}
            />
          );
          offset += len;
          return el;
        })}
        {caption && (
          <text x={C} y={C} className="chart-donut__caption" textAnchor="middle" dominantBaseline="middle">
            {caption}
          </text>
        )}
      </svg>
      <ul className="chart-legend" aria-hidden="true">
        {segments.map((seg) => (
          <li key={seg.label} className="chart-legend__item">
            <span className="chart-legend__swatch" style={{ background: seg.color }} />
            <span className="chart-legend__label">{seg.label}</span>
            <span className="chart-legend__value">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
