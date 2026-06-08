/**
 * stats-bars.tsx — Horizontal bars of top languages (by % of repo size).
 * Pure CSS/DOM (no SVG needed). aria-hidden; panel supplies the SR table.
 */
import { chartColor } from './chart-colors';

interface Props {
  languages: { name: string; percentage: number }[];
}

export default function StatsBars({ languages }: Props) {
  const max = Math.max(...languages.map((l) => l.percentage), 1);
  return (
    <ul className="stats-bars" aria-hidden="true">
      {languages.map((l, i) => (
        <li key={l.name} className="stats-bars__row">
          <span className="stats-bars__name">{l.name}</span>
          <span className="stats-bars__track">
            <span
              className="stats-bars__fill"
              style={{ width: `${(l.percentage / max) * 100}%`, background: chartColor(i) }}
            />
          </span>
          <span className="stats-bars__val">{l.percentage}%</span>
        </li>
      ))}
    </ul>
  );
}
