/**
 * use-quantum-world.ts — Scene orchestrator + render loop. Ports the prototype's
 * init()/animate() (~577–729) into a composable controller that wires setup,
 * dressing, stations, bloom, camera tour, picking and the ignite intro, and
 * bridges scene transitions into the reactive store. Provides a hardened
 * dispose() (the prototype never cleaned up) for clean island unmount + HMR.
 */
import * as THREE from 'three';
import type { WorldStore } from '../state/world-store';
import { createSceneCore, buildDressing } from './scene-setup';
import { resetGlow } from './scene-helpers';
import { buildStations, type SceneCtx } from './stations';
import { createComposer } from './post-processing';
import { createCameraTour } from './camera-tour';
import { createPicking } from './picking';
import { createIgniteIntro } from './ignite-intro';
import { detectQuality } from './quality';

export interface WorldController {
  start: () => void;
  dispose: () => void;
}

/** Build the whole world against `canvas`, bridged to `store`. */
export function useQuantumWorld(canvas: HTMLCanvasElement, store: WorldStore): WorldController {
  const quality = detectQuality();
  const startTouring = !quality.reducedMotion;

  const { renderer, scene, camera, controls } = createSceneCore(canvas);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.dprCap));

  const updaters: ((t: number) => void)[] = [];
  buildDressing(scene).updaters.forEach((u) => updaters.push(u));

  const ctx: SceneCtx = { coreIgnite: 0 };
  const stationObjs = buildStations(scene, updaters, ctx);

  const { composer, resize: resizeComposer } = createComposer(renderer, scene, camera, quality.bloomStrength);

  const tourEngine = createCameraTour(camera, controls, stationObjs, {
    onDepart: () => store._onDepart(),
    onArrive: (_i, id) => store._onArrive(id),
    onTourState: (t) => store._onTourState(t),
  });
  store.bindApi(tourEngine.api);

  const picking = createPicking(
    camera, canvas, stationObjs,
    () => tourEngine.tour.intro,
    (i) => { tourEngine.api.stopTour(); tourEngine.flyTo(i); },
  );

  const intro = createIgniteIntro(scene, camera, controls, ctx, tourEngine.tour, () => {
    tourEngine.flyTo(0, { dur: startTouring ? 2.4 : 0.4 });
    if (startTouring) tourEngine.api.startTour();
    else tourEngine.api.stopTour();
  });

  const clock = new THREE.Clock();
  let raf = 0;

  function animate(): void {
    raf = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    updaters.forEach((u) => u(t));
    intro.updateShocks(dt);

    if (tourEngine.tour.intro) intro.update(dt);
    else tourEngine.update(dt);

    picking.pick();
    composer.render();
  }

  function onResize(): void {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    resizeComposer(w, h);
  }

  function start(): void {
    window.addEventListener('resize', onResize);
    if (quality.reducedMotion) intro.skip();
    else intro.start();
    store.setReady(true);
    animate();
  }

  function dispose(): void {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    picking.dispose();
    intro.dispose();
    controls.dispose();

    // Traverse + free all GPU resources (geometries, materials, textures).
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = (mesh as unknown as { material?: THREE.Material | THREE.Material[] }).material;
      if (Array.isArray(mat)) mat.forEach(disposeMaterial);
      else if (mat) disposeMaterial(mat);
    });

    composer.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    // Shared glow texture was freed in the traversal above — drop the cached
    // ref so the next mount rebuilds it instead of reusing a freed texture.
    resetGlow();
  }

  return { start, dispose };
}

function disposeMaterial(mat: THREE.Material): void {
  const m = mat as unknown as Record<string, unknown>;
  for (const key of Object.keys(m)) {
    const val = m[key];
    if (val && typeof val === 'object' && 'isTexture' in (val as object) && (val as { isTexture?: boolean }).isTexture) {
      (val as THREE.Texture).dispose();
    }
  }
  mat.dispose();
}
