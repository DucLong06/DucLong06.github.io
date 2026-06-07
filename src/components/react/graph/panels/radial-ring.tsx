/**
 * radial-ring.tsx — Animated SVG arc for percentage metrics. The arc sweeps
 * from 0 to `percent` on mount; `children` (usually a MetricCounter) sit in the
 * center. Hand-rolled SVG — no chart library. Respects reduced-motion.
 */
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  percent: number; // 0..100 (values >100 clamp visually)
  color: string;
  children?: ReactNode;
  size?: number;
}

const STROKE = 7;

export function RadialRing({ percent, color, children, size = 92 }: Props) {
  const reduce = useReducedMotion();
  const r = (size - STROKE) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, percent)) / 100;
  const offset = c * (1 - pct);

  return (
    <div className="radial-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: reduce ? offset : c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduce ? 0 : 1.1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      </svg>
      <div className="radial-ring__center">{children}</div>
    </div>
  );
}
