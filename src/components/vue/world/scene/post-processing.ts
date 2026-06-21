/**
 * post-processing.ts — EffectComposer pipeline (port of world.module.js
 * ~608–612): RenderPass → UnrealBloomPass. Bloom tuning is the make-or-break
 * visual; constants are verbatim (strength 0.62 / radius 0.55 / threshold 0.5),
 * paired with exposure 0.92 + ACESFilmic in scene-setup.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export interface ComposerBundle {
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  resize: (w: number, h: number) => void;
}

/** Build the bloom composer. `strength` may be lowered on mobile (Phase 08). */
export function createComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  strength = 0.62,
): ComposerBundle {
  const w = window.innerWidth, h = window.innerHeight;
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), strength, 0.55, 0.5);
  composer.addPass(bloomPass);

  const resize = (nw: number, nh: number) => {
    composer.setSize(nw, nh);
    bloomPass.setSize(nw, nh);
  };

  return { composer, bloomPass, resize };
}
