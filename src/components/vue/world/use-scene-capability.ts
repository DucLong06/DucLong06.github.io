/**
 * use-scene-capability.ts — Decides whether the Quantum World island may mount.
 *
 * Vue port of the React island's capability gate. Reuses the SAME localStorage
 * key (`portfolio-scene-mode`) so the SSR "Classic view" link + Scene3DToggle
 * button keep working across the cutover.
 *
 * The 3D layer is a progressive enhancement: mount only when WebGL is available,
 * reduced-motion is NOT set, the viewport is wide enough, and the user hasn't
 * opted into the classic 2D site.
 */
import { ref, onMounted, type Ref } from 'vue';

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

  // Explicit '3d' override passes the width/pointer gate (still needs WebGL).
  if (forced === '3d') return detectWebGL() ? 'enabled' : 'fallback';

  if (reduced || !wideEnough || !finePointer) return 'fallback';
  return detectWebGL() ? 'enabled' : 'fallback';
}

/** Persist a mode choice and reload into the matching experience. */
export function setSceneMode(mode: '3d' | '2d'): void {
  try {
    window.localStorage.setItem(SCENE_MODE_KEY, mode);
  } catch {
    /* private mode / storage disabled — ignore */
  }
  window.location.reload();
}

export function useSceneCapability(): { capability: Ref<SceneCapability> } {
  const capability = ref<SceneCapability>('pending');
  onMounted(() => {
    capability.value = decide();
  });
  return { capability };
}
