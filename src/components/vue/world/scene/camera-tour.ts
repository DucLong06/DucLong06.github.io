/**
 * camera-tour.ts — Camera tour engine (port of world.module.js flyTo/arrive
 * ~554–574 + loop branches ~705–725). Replaces the prototype's `window.WORLD`
 * + `world:*` CustomEvents with hook callbacks into the reactive store.
 *
 * Branch order (when NOT in intro): transitioning (ease-in-out cubic lerp) →
 * active (idle orbit ±0.12 yaw + bob, auto-advance at dwell) → free
 * (controls.update). Controls are enabled ONLY in free-explore.
 */
import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { StationObj } from './stations';
import type { WorldApi } from '../state/world-store';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export interface TourHooks {
  onDepart: (index: number, id: string) => void;
  onArrive: (index: number, id: string) => void;
  onTourState: (touring: boolean) => void;
}

export interface TourState {
  active: boolean;
  intro: boolean;
  transitioning: boolean;
  t: number;
  dur: number;
  current: number;
  timer: number;
  dwell: number;
  idle: number;
}

export interface CameraTour {
  tour: TourState;
  flyTo: (index: number, opts?: { dur?: number }) => void;
  /** Per-frame step for the non-intro branches. */
  update: (dt: number) => void;
  api: WorldApi;
}

export function createCameraTour(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  stationObjs: StationObj[],
  hooks: TourHooks,
): CameraTour {
  const tour: TourState = {
    active: false, intro: true, transitioning: false,
    t: 0, dur: 2.2, current: -1, timer: 0, dwell: 8.0, idle: 0,
  };
  const fromPos = new THREE.Vector3(), toPos = new THREE.Vector3();
  const fromTgt = new THREE.Vector3(), toTgt = new THREE.Vector3();

  function flyTo(index: number, opts: { dur?: number } = {}): void {
    const s = stationObjs[index];
    if (!s) return;
    fromPos.copy(camera.position);
    fromTgt.copy(controls.target);
    toPos.copy(s.view.pos);
    toTgt.copy(s.view.tgt);
    tour.t = 0; tour.dur = opts.dur || 2.2;
    tour.transitioning = true;
    tour.current = index;
    tour.timer = 0;
    controls.enabled = false;
    hooks.onDepart(index, s.id);
  }

  function arrive(): void {
    tour.transitioning = false;
    const s = stationObjs[tour.current];
    if (tour.active) {
      controls.enabled = false;
    } else {
      controls.enabled = true;
      controls.target.copy(toTgt);
    }
    hooks.onArrive(tour.current, s.id);
  }

  function startTour(): void {
    tour.active = true;
    controls.enabled = false;
    hooks.onTourState(true);
  }
  function stopTour(): void {
    tour.active = false;
    controls.enabled = !tour.transitioning;
    if (controls.enabled) controls.target.copy(toTgt);
    hooks.onTourState(false);
  }

  function update(dt: number): void {
    if (tour.transitioning) {
      tour.t += dt / tour.dur;
      const k = easeInOut(Math.min(1, tour.t));
      camera.position.lerpVectors(fromPos, toPos, k);
      controls.target.lerpVectors(fromTgt, toTgt, k);
      camera.lookAt(controls.target);
      if (tour.t >= 1) arrive();
    } else if (tour.active) {
      // parked: gentle idle orbit, then auto-advance after dwell
      tour.idle += dt;
      const s = stationObjs[tour.current];
      const base = s.view.pos.clone().sub(s.view.tgt);
      const ang = Math.sin(tour.idle * 0.25) * 0.12;
      const rot = base.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), ang);
      camera.position.copy(s.view.tgt).add(rot).add(new THREE.Vector3(0, Math.sin(tour.idle * 0.4) * 0.5, 0));
      camera.lookAt(s.view.tgt);
      tour.timer += dt;
      if (tour.timer >= tour.dwell) flyTo((tour.current + 1) % stationObjs.length);
    } else {
      controls.update();
    }
  }

  const api: WorldApi = {
    goTo(i, opts) { flyTo(i, opts); },
    goToId(id, opts) { const i = stationObjs.findIndex((s) => s.id === id); if (i >= 0) flyTo(i, opts); },
    next() { flyTo((tour.current + 1) % stationObjs.length); },
    prev() { flyTo((tour.current - 1 + stationObjs.length) % stationObjs.length); },
    startTour,
    stopTour,
    toggleTour() { tour.active ? stopTour() : startTour(); },
  };

  return { tour, flyTo, update, api };
}
