/**
 * use-webgl-capability.ts — Device capability tiering for the 3D explore route.
 *
 * Returns a render tier + a cached reduced-motion flag:
 *   - 'full'    : WebGL2 + enough memory → full scene (idle float, glow, charts).
 *   - 'lite'    : WebGL ok but low-end (mobile / low deviceMemory) → simplified scene.
 *   - 'classic' : no WebGL → render a DOM card linking to the classic portfolio.
 *
 * NOTE (deviation from plan phase-02): reduced-motion does NOT force the classic
 * card. The 3D scene fully supports reduced-motion (static donut, snap camera, no
 * particles) per phases 03/04/07, so reduced-motion users still get the interactive
 * DOM-backed UI — just without vestibular motion. Only genuine no-WebGL / very
 * low-end devices fall back to the classic card.
 *
 * Detection runs once on mount (capabilities don't change mid-session except the
 * reduced-motion media query, which the scene re-reads where it matters).
 */
import { useEffect, useState } from 'react';

export type CapabilityTier = 'full' | 'lite' | 'classic';

export interface Capability {
  tier: CapabilityTier;
  reducedMotion: boolean;
  /** false until detection has run on the client (SSR-safe default). */
  ready: boolean;
}

function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

function hasWebGL1(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function isLowEnd(): boolean {
  // deviceMemory is GB of RAM (Chrome/Edge only). Treat <4 as low-end.
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof mem === 'number' && mem < 4;
  const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return lowMemory || (isMobile && lowCores);
}

function detect(): Capability {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!hasWebGL2() && !hasWebGL1()) {
    return { tier: 'classic', reducedMotion, ready: true };
  }
  // No WebGL2 (only WebGL1) OR low-end hardware → lite tier (still interactive).
  if (!hasWebGL2() || isLowEnd()) {
    return { tier: 'lite', reducedMotion, ready: true };
  }
  return { tier: 'full', reducedMotion, ready: true };
}

export function useWebGLCapability(): Capability {
  const [cap, setCap] = useState<Capability>({ tier: 'full', reducedMotion: false, ready: false });

  useEffect(() => {
    setCap(detect());
  }, []);

  return cap;
}
