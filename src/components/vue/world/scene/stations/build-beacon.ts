/** build-beacon.ts — SIGNAL station (verbatim port of buildBeacon). */
import * as THREE from 'three';
import { TAU } from '../palette';
import { emi, lineMat, glowSprite, circlePts, runeRing, particleHalo, type Updatable } from '../scene-helpers';

export function buildBeacon(hex: number, hex2: number): THREE.Group {
  const g = new THREE.Group();
  g.add(runeRing(3.4, hex, 36, 0.04));
  const towerH = 5;
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.5, towerH, 12), emi(hex, 0.35, { color: 0x0a1420, metalness: 0.65, roughness: 0.4 }));
  tower.position.y = towerH / 2; g.add(tower);
  // panning head (dish + feed pan together)
  const head = new THREE.Group(); head.position.y = towerH + 0.6; g.add(head);
  const dish = new THREE.Mesh(new THREE.SphereGeometry(2.3, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2.3),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(0x0d2230), emissive: new THREE.Color(hex), emissiveIntensity: 0.45, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.32 }));
  dish.rotation.x = Math.PI * 0.82; head.add(dish);
  dish.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circlePts(2.3, 0, 64)), lineMat(hex, 0.4)));
  const feed = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), emi(0xffffff, 1.5));
  feed.position.set(0, 1.5, 0.5); head.add(feed);
  head.add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.5), emi(hex, 1)).translateY(0.8).translateZ(0.28));
  head.add(glowSprite(hex2, 2.2).copy(feed));
  // pulsing signal rings
  const sig: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const rl = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.035, 8, 48), emi(hex2, 1.3, { transparent: true }));
    rl.position.copy(feed.position); rl.rotation.x = Math.PI / 2 - 0.4;
    rl.userData = { off: i / 4 }; sig.push(rl); head.add(rl);
  }
  // upward signal stream
  const stream: THREE.Sprite[] = [];
  for (let i = 0; i < 10; i++) { const s = glowSprite(hex2, 0.45); s.userData = { off: Math.random() }; stream.push(s); g.add(s); }
  // orbiting satellites
  const sats: { m: THREE.Mesh; a: number; r: number; h: number; sp: number }[] = [];
  for (let i = 0; i < 3; i++) {
    const sat = new THREE.Mesh(new THREE.OctahedronGeometry(0.28), emi(hex, 1.2, { color: 0x16203a }));
    sats.push({ m: sat, a: (i / 3) * TAU, r: 4.5 + i * 0.6, h: towerH + 1 + i * 0.8, sp: 0.3 + i * 0.1 }); g.add(sat);
  }
  g.add(particleHalo(36, 2, 4.5, hex, 6, 0.4).translateY(3));
  (g.userData as Updatable).update = (t: number) => {
    head.rotation.y = Math.sin(t * 0.25) * 0.7;
    sig.forEach((r) => {
      const p = (t * 0.5 + (r.userData.off as number)) % 1;
      r.scale.setScalar(0.3 + p * 5.5); (r.material as THREE.MeshStandardMaterial).opacity = (1 - p) * 0.85; r.position.copy(feed.position);
    });
    stream.forEach((s) => {
      const p = (t * 0.3 + (s.userData.off as number)) % 1;
      s.position.set(Math.sin(p * 8 + (s.userData.off as number) * 6) * 0.4, towerH + 1.6 + p * 5, Math.cos(p * 8) * 0.4);
      (s.material as THREE.SpriteMaterial).opacity = (1 - p) * 0.8;
    });
    sats.forEach((s) => {
      const a = s.a + t * s.sp; s.m.position.set(Math.cos(a) * s.r, s.h + Math.sin(t * 0.6 + s.a) * 0.4, Math.sin(a) * s.r);
      s.m.rotation.y = t; s.m.rotation.x = t * 0.7;
    });
  };
  return g;
}
