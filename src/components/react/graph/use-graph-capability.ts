/**
 * use-graph-capability.ts — Decides whether the 3D graph may mount.
 *
 * The 3D graph is a progressive enhancement layered over real HTML content.
 * Mount it only when the device can render it well AND the user hasn't opted
 * out of motion:
 *   - WebGL available
 *   - viewport wide enough (phones get the 2D SVG graph)
 *   - fine pointer (drag-to-orbit makes sense)
 *   - prefers-reduced-motion NOT set
 *
 * Otherwise → 'fallback' (Phase 07 GraphSvg2D). 'pending' during SSR/first frame.
 */
import { useEffect, useState } from 'react';

export type GraphCapability = 'pending' | 'enabled' | 'fallback';

const MIN_WIDTH = 768;

/** Feature-detect a usable WebGL context. Never throws. */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
}

function decide(): GraphCapability {
  if (typeof window === 'undefined') return 'pending';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideEnough = window.innerWidth >= MIN_WIDTH;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduced || !wideEnough || !finePointer) return 'fallback';
  return detectWebGL() ? 'enabled' : 'fallback';
}

export function useGraphCapability(): { capability: GraphCapability; dpr: [number, number] } {
  const [capability, setCapability] = useState<GraphCapability>('pending');

  useEffect(() => {
    setCapability(decide());
    // Re-evaluate on resize (e.g. rotate tablet across the 768 breakpoint),
    // debounced + value-guarded so we don't needlessly tear down/rebuild the
    // WebGL <Canvas> on every resize tick near the breakpoint.
    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const next = decide();
        setCapability((prev) => (prev === next ? prev : next));
      }, 200);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Clamp DPR for mobile/retina perf parity with the old LiquidShader (≤1.5).
  return { capability, dpr: [1, 1.5] };
}
