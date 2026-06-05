/**
 * use-scene-capability.ts — Decides whether the 3D island may mount.
 *
 * The 3D layer is a progressive enhancement. We only mount it when the device
 * can realistically render it well AND the user hasn't opted out:
 *   - WebGL must be available
 *   - prefers-reduced-motion must NOT be set (respect a11y)
 *   - viewport must be wide enough (phones get the 2D site — brainstorm decision)
 *   - user must not have chosen "classic site" (persisted in localStorage)
 *
 * Returns one of: 'pending' (still deciding, SSR/first frame),
 *                 'enabled' (mount 3D),
 *                 'fallback' (show the 2D site).
 */
import { useEffect, useState } from 'react';

export type SceneCapability = 'pending' | 'enabled' | 'fallback';

export const SCENE_MODE_KEY = 'portfolio-scene-mode'; // '3d' | '2d'
const MIN_WIDTH = 768;

/** Feature-detect a usable WebGL context. Never throws. */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function decide(): SceneCapability {
  if (typeof window === 'undefined') return 'pending';

  let forced: string | null = null;
  try {
    forced = window.localStorage.getItem(SCENE_MODE_KEY);
  } catch {
    /* storage blocked (private mode) — fall through to capability detection */
  }
  if (forced === '2d') return 'fallback';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideEnough = window.innerWidth >= MIN_WIDTH;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // Allow an explicit '3d' override past the width/pointer gate (still needs WebGL).
  if (forced === '3d') return detectWebGL() ? 'enabled' : 'fallback';

  if (reduced || !wideEnough || !finePointer) return 'fallback';
  return detectWebGL() ? 'enabled' : 'fallback';
}

export function useSceneCapability(): {
  capability: SceneCapability;
  setMode: (mode: '3d' | '2d') => void;
} {
  const [capability, setCapability] = useState<SceneCapability>('pending');

  useEffect(() => {
    setCapability(decide());
  }, []);

  const setMode = (mode: '3d' | '2d') => {
    try {
      window.localStorage.setItem(SCENE_MODE_KEY, mode);
    } catch {
      /* private mode / storage disabled — ignore */
    }
    setCapability(mode === '3d' ? (detectWebGL() ? 'enabled' : 'fallback') : 'fallback');
  };

  return { capability, setMode };
}
