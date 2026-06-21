/** build-dockyard.ts — DOCKYARD station (verbatim port of buildDockyard). */
import * as THREE from 'three';
import { emi, runeRing, particleHalo, type Updatable } from '../scene-helpers';

export function buildDockyard(hex: number): THREE.Group {
  const g = new THREE.Group();
  // contribution heatmap as a field of extruded bars
  const cols = 20, rows = 7, cell = 0.62, gap = 0.12;
  const bars: THREE.Mesh[] = [];
  const w = cols * (cell + gap), d = rows * (cell + gap);
  g.add(runeRing(Math.max(w, d) * 0.62, hex, 44, 0.04));
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    const lvl = Math.pow(Math.random(), 1.6);
    const h = 0.15 + lvl * 2.6;
    const m = new THREE.Mesh(new THREE.BoxGeometry(cell, h, cell), emi(hex, 0.4 + lvl * 1.1, { color: 0x081420 }));
    m.position.set(c * (cell + gap) - w / 2, h / 2, r * (cell + gap) - d / 2);
    m.userData = { base: h, lvl, wave: c * 0.45 + r * 0.25 };
    bars.push(m); g.add(m);
  }
  g.add(particleHalo(46, 2, w * 0.5, hex, 4, 0.4).translateY(2.2));
  (g.userData as Updatable).update = (t: number) => {
    bars.forEach((b) => {
      const k = 0.5 + 0.5 * Math.sin(t * 1.1 - (b.userData.wave as number));
      b.scale.y = 0.6 + (b.userData.lvl as number) * 0.8 + k * 0.28;
      b.position.y = ((b.userData.base as number) * b.scale.y) / 2;
      (b.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.35 + (b.userData.lvl as number) * 1.0 + k * 0.45;
    });
  };
  return g;
}
