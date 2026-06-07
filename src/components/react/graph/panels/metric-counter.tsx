/**
 * metric-counter.tsx — Count-up from 0 to the metric value on mount.
 * Locale-formatted (thousands separators), with the verbatim suffix appended so
 * the EXACT CV figure shows (e.g. "6,000/mo", "90%+"). Respects reduced-motion.
 */
import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import type { Lang } from '../../../../lib/graph/graph-data-types';

interface Props {
  value: number;
  suffix: string;
  lang: Lang;
}

export function MetricCounter({ value, suffix, lang }: Props) {
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();
  const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
  const isInt = Number.isInteger(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, reduce]);

  const rounded = isInt ? Math.round(display) : Math.round(display * 10) / 10;
  return (
    <span className="metric-counter">
      {rounded.toLocaleString(locale)}
      <span className="metric-counter__suffix">{suffix}</span>
    </span>
  );
}
