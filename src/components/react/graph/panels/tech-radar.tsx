/**
 * tech-radar.tsx — Hand-rolled SVG radar of a company's tech proficiency
 * (derived from how often each tech appears across that company's projects).
 * No chart library. Animated polygon reveal; respects reduced-motion.
 */
import { motion, useReducedMotion } from 'framer-motion';

export interface RadarAxis {
  label: string;
  value: number; // 0..1
}

interface Props {
  axes: RadarAxis[];
  color: string;
  size?: number;
}

export function TechRadar({ axes, color, size = 220 }: Props) {
  const reduce = useReducedMotion();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 34;
  const n = axes.length;
  if (n < 3) return null;

  const point = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * radius * v, cy + Math.sin(angle) * radius * v] as const;
  };

  const grid = [0.33, 0.66, 1].map((ring) =>
    axes.map((_, i) => point(i, ring).join(',')).join(' '),
  );
  const dataPoly = axes.map((a, i) => point(i, a.value).join(',')).join(' ');

  return (
    <svg
      className="tech-radar"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Technology proficiency radar"
    >
      {grid.map((g, i) => (
        <polygon key={i} points={g} fill="none" stroke="rgba(255,255,255,0.1)" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />;
      })}
      <motion.polygon
        points={dataPoly}
        fill={color}
        fillOpacity={0.22}
        stroke={color}
        strokeWidth={2}
        initial={{ scale: reduce ? 1 : 0.1, opacity: reduce ? 1 : 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.7, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {axes.map((a, i) => {
        const [x, y] = point(i, 1.16);
        return (
          <text
            key={a.label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="tech-radar__label"
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}
