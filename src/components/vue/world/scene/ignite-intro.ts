/**
 * ignite-intro.ts — Boot ignite sequence (port of world.module.js
 * startIntro/updateIntro ~639–658 + spawnShock/updateShocks ~537–551).
 *
 * Sequence: hold wide ~0.6s → 3 shockwaves (staggered 0/180/360ms) + coreIgnite
 * ramp 0→1 (×1.3/s) → camera ease (0,42,70)→(13,12,30) over ~2s → handoff
 * flyTo(0,{dur:2.4}) + startTour().
 */
import * as THREE from 'three';
import { PAL, C } from './palette';
import type { SceneCtx } from './stations';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { TourState } from './camera-tour';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const WIDE = new THREE.Vector3(0, 42, 70);
const CLOSE = new THREE.Vector3(13, 12, 30);
const TGT = new THREE.Vector3(0, 2, 0);

export interface IgniteIntro {
  start: () => void;
  /** Called each frame while `tour.intro` is true. */
  update: (dt: number) => void;
  /** Called every frame to advance + retire active shockwaves. */
  updateShocks: (dt: number) => void;
  /** Skip the cinematic (reduced-motion): ignite instantly + hand off. */
  skip: () => void;
  dispose: () => void;
}

export function createIgniteIntro(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  ctx: SceneCtx,
  tour: TourState,
  onHandoff: () => void,
): IgniteIntro {
  let introT = 0, introPhase = 0;
  const shockwaves: THREE.Mesh[] = [];
  const timers: ReturnType<typeof setTimeout>[] = [];

  function spawnShock(): void {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(1, 1.18, 96),
      new THREE.MeshBasicMaterial({ color: C(PAL.a1), transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    m.rotation.x = -Math.PI / 2; m.position.y = 0.05; m.userData.t = 0;
    scene.add(m); shockwaves.push(m);
  }

  function updateShocks(dt: number): void {
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const m = shockwaves[i];
      m.userData.t = (m.userData.t as number) + dt;
      const p = (m.userData.t as number) / 2.4;
      m.scale.setScalar(1 + p * 70);
      (m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 * (1 - p));
      if (p >= 1) {
        scene.remove(m);
        (m.geometry as THREE.BufferGeometry).dispose();
        (m.material as THREE.Material).dispose();
        shockwaves.splice(i, 1);
      }
    }
  }

  function start(): void {
    tour.intro = true; introT = 0; introPhase = 0;
    ctx.coreIgnite = 0;
    controls.enabled = false;
  }

  function update(dt: number): void {
    introT += dt;
    if (introPhase === 0 && introT > 0.6) {
      introPhase = 1;
      spawnShock();
      timers.push(setTimeout(spawnShock, 180));
      timers.push(setTimeout(spawnShock, 360));
    }
    if (introPhase >= 1) ctx.coreIgnite = Math.min(1, ctx.coreIgnite + dt * 1.3);
    if (introPhase === 1) {
      const k = easeOut(Math.min(1, (introT - 0.6) / 2.0));
      camera.position.lerpVectors(WIDE, CLOSE, k);
      controls.target.copy(TGT);
      camera.lookAt(controls.target);
      if (introT > 2.6) {
        introPhase = 2;
        tour.intro = false;
        onHandoff();
      }
    }
  }

  function skip(): void {
    ctx.coreIgnite = 1;
    introPhase = 2;
    tour.intro = false;
    controls.target.copy(TGT);
    onHandoff();
  }

  function dispose(): void {
    timers.forEach(clearTimeout);
    timers.length = 0;
    shockwaves.forEach((m) => {
      scene.remove(m);
      (m.geometry as THREE.BufferGeometry).dispose();
      (m.material as THREE.Material).dispose();
    });
    shockwaves.length = 0;
  }

  return { start, update, updateShocks, skip, dispose };
}
