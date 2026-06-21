/**
 * picking.ts — Pointer raycast picking + hover label pulse (port of
 * world.module.js onPointerMove/onClick/pickHover ~665–692). Hovered station
 * label lerps to 1.18× and the cursor becomes a pointer; click selects it.
 */
import * as THREE from 'three';
import type { StationObj } from './stations';

export interface Picking {
  /** Per-frame: raycast + cursor + label pulse. */
  pick: () => void;
  dispose: () => void;
}

export function createPicking(
  camera: THREE.PerspectiveCamera,
  canvas: HTMLCanvasElement,
  stationObjs: StationObj[],
  isIntro: () => boolean,
  onSelect: (index: number) => void,
): Picking {
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2(-2, -2);
  let hovered: number | null = null;

  const onMove = (e: PointerEvent) => {
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  const onClick = () => {
    if (hovered != null) onSelect(hovered);
  };

  const pick = () => {
    if (isIntro()) return;
    raycaster.setFromCamera(ndc, camera);
    let best: number | null = null, bestDist = Infinity;
    stationObjs.forEach((s, i) => {
      const hits = raycaster.intersectObject(s.group, true);
      if (hits.length && hits[0].distance < bestDist) { bestDist = hits[0].distance; best = i; }
    });
    if (best !== hovered) {
      hovered = best;
      document.body.style.cursor = best != null ? 'pointer' : '';
    }
    // pulse hovered label
    stationObjs.forEach((s, i) => {
      const want = i === hovered ? 1.18 : 1;
      const base = s.lab.userData.baseScale as THREE.Vector3;
      s.lab.scale.lerp(base.clone().multiplyScalar(want), 0.2);
    });
  };

  window.addEventListener('pointermove', onMove);
  canvas.addEventListener('click', onClick);

  const dispose = () => {
    window.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('click', onClick);
    document.body.style.cursor = '';
  };

  return { pick, dispose };
}
