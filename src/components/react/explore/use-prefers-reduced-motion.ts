/**
 * use-prefers-reduced-motion.ts — Shared reduced-motion hook for the explore island.
 * Cached at first read; subscribes to changes so the scene can re-snap if the user
 * flips the OS preference mid-session. Single source for all animated paths
 * (idle float, camera, charts, off-clock visuals).
 */
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function read(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(read);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
