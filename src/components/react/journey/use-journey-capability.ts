/**
 * use-journey-capability.ts — Decides whether the 3D pipeline journey may mount.
 * Same progressive-enhancement gate as use-graph-capability (the journey is a
 * layer over the real SSR 2D site):
 *   - WebGL available
 *   - viewport wide enough (phones get the 2D site)
 *   - fine pointer
 *   - prefers-reduced-motion NOT set
 * Otherwise → 'fallback' (the SSR PortfolioHome 2D site shows). 'pending' during
 * SSR / first client frame.
 */
import { useEffect, useState } from 'react';

export type JourneyCapability = 'pending' | 'enabled' | 'fallback';

const MIN_WIDTH = 768;

let webglCache: boolean | undefined;

/**
 * Feature-detect a usable WebGL context. Never throws. The probe context is
 * explicitly released (lose-context) and the result cached, so repeated calls
 * (e.g. debounced resize) never accumulate live WebGL contexts — which can
 * exhaust the browser's context cap and force-lose the real journey canvas.
 */
export function detectWebGL(): boolean {
  if (webglCache !== undefined) return webglCache;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (gl && 'getExtension' in gl) {
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    }
    webglCache = Boolean(gl);
  } catch {
    webglCache = false;
  }
  return webglCache;
}

function decide(): JourneyCapability {
  if (typeof window === 'undefined') return 'pending';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideEnough = window.innerWidth >= MIN_WIDTH;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduced || !wideEnough || !finePointer) return 'fallback';
  return detectWebGL() ? 'enabled' : 'fallback';
}

export function useJourneyCapability(): {
  capability: JourneyCapability;
  dpr: [number, number];
} {
  const [capability, setCapability] = useState<JourneyCapability>('pending');

  useEffect(() => {
    setCapability(decide());
    // Re-evaluate on resize, debounced + value-guarded so we never needlessly
    // tear down / rebuild the WebGL <Canvas> near the 768 breakpoint.
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

  // Clamp DPR for retina perf parity (≤1.5).
  return { capability, dpr: [1, 1.5] };
}
