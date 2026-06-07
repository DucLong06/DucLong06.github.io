/**
 * journey-scroll.ts — Scroll → journey progress + active station.
 *
 * Two outputs, deliberately split for performance:
 *   - progressRef: a mutable ref (0→1) updated every scroll frame via rAF.
 *     Read inside useFrame by the camera/river — NO React re-render per frame.
 *   - station: the active station index as React state. Changes rarely (once
 *     per station crossing), so it cheaply drives overlay visibility + nav.
 *
 * Uses native scroll (not lenis): robust with the sticky canvas, trivially
 * reduced-motion-safe (the journey only mounts when motion is allowed), and
 * SEO-safe (no scroll hijack of the SSR content).
 */
import { useEffect, useRef, useState, type RefObject } from 'react';
import { STATION_COUNT } from './journey-config';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function useJourneyScroll(containerRef: RefObject<HTMLElement>) {
  const progressRef = useRef(0);
  const [station, setStation] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let lastStation = 0;

    const measure = () => {
      raf = 0;
      // rect-based absolute top → robust to any positioned ancestor.
      const top = el.getBoundingClientRect().top + window.scrollY;
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp01((window.scrollY - top) / total) : 0;
      progressRef.current = p;
      const next = Math.min(STATION_COUNT - 1, Math.max(0, Math.round(p * (STATION_COUNT - 1))));
      if (next !== lastStation) {
        lastStation = next;
        setStation(next);
      }
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [containerRef]);

  return { progressRef, station };
}

/** Smoothly scroll to a given station index (used by nav jump-to-station). */
export function scrollToStation(containerRef: RefObject<HTMLElement>, index: number) {
  const el = containerRef.current;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const total = el.offsetHeight - window.innerHeight;
  const target = top + (total * index) / (STATION_COUNT - 1);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
}
