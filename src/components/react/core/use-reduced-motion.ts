/**
 * use-reduced-motion.ts — Reactive `prefers-reduced-motion` flag for the scene.
 *
 * The capability gate already routes reduced-motion users to the 2D site, but a
 * forced `3d` localStorage override can bypass that gate. Scene animation code
 * reads this hook to freeze breathing / interaction / bloom as a safety net.
 */
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
