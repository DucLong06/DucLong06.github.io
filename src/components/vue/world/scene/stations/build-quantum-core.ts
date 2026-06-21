/**
 * build-quantum-core.ts — QUANTUM centerpiece (port of buildQuantumCore).
 * Driven by the shared `ctx.coreIgnite` ramp (0→1, set by the ignite intro).
 */
import * as THREE from 'three';
import { PAL } from '../palette';
import { emi, lineMat, glowSprite, type Updatable } from '../scene-helpers';

/** Shared mutable ignite level (Phase 08 intro ramps it 0→1). */
export interface SceneCtx { coreIgnite: number }

export function buildQuantumCore(ctx: SceneCtx, hex: number, hex2: number): THREE.Group {
  const g = new THREE.Group();
  const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x0c1626), emissive: new THREE.Color(hex), emissiveIntensity: 0, metalness: 0.3, roughness: 0.2,
  }));
  g.add(coreMesh);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.5, 1)), lineMat(hex, 0.0));
  g.add(wire);
  const halo = glowSprite(hex, 0); g.add(halo);
  // three precessing rings
  const rings: THREE.Mesh[] = [];
  const cols = [hex, hex2, PAL.a4];
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(3.4 + i * 0.9, 0.05, 12, 120), emi(cols[i], 1.3));
    rings.push(r); g.add(r);
  }
  // orbiting electrons
  const elec: THREE.Sprite[] = [];
  for (let i = 0; i < 5; i++) {
    const e = glowSprite(cols[i % 3], 1.1);
    e.userData = { r: 4 + Math.random() * 2.5, a: Math.random() * 6.28, sp: 0.4 + Math.random() * 0.6, tilt: Math.random() * 6.28, h: (Math.random() - 0.5) * 4 };
    elec.push(e); g.add(e);
  }
  (g.userData as Updatable).update = (t: number) => {
    const ig = ctx.coreIgnite;
    const coreMat = coreMesh.material as THREE.MeshStandardMaterial;
    coreMat.emissiveIntensity = ig * (1.4 + 0.5 * Math.sin(t * 2.5));
    coreMesh.rotation.x = t * 0.25; coreMesh.rotation.y = t * 0.32;
    coreMesh.scale.setScalar(1 + Math.sin(t * 2.5) * 0.04 * ig);
    (wire.material as THREE.LineBasicMaterial).opacity = ig * 0.9; wire.rotation.x = -t * 0.2; wire.rotation.y = t * 0.18;
    (halo.material as THREE.SpriteMaterial).opacity = ig; halo.scale.setScalar(10 * ig + Math.sin(t * 2) * 0.6 * ig);
    rings.forEach((r, i) => {
      (r.material as THREE.MeshStandardMaterial).emissiveIntensity = ig * 1.3;
      r.rotation.x = (Math.PI / 2) * (i === 0 ? 1 : 0) + t * (0.3 + i * 0.12) + i;
      r.rotation.y = t * (0.2 + i * 0.1);
    });
    elec.forEach((e) => {
      e.userData.a = (e.userData.a as number) + 0.016 * (e.userData.sp as number);
      const a = e.userData.a as number, r = e.userData.r as number;
      e.position.set(Math.cos(a) * r, Math.sin(a * 0.7 + (e.userData.tilt as number)) * 0.5 + (e.userData.h as number) * 0.2, Math.sin(a) * r);
      (e.material as THREE.SpriteMaterial).opacity = ig;
    });
  };
  return g;
}
