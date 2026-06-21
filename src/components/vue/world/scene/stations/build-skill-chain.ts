/** build-skill-chain.ts — ARSENAL/expertise station (port of buildSkillChain). */
import * as THREE from 'three';
import { PAL, TAU } from '../palette';
import { emi, lineMat, glowSprite, labelSprite, runeRing, particleHalo, type Updatable } from '../scene-helpers';

export function buildSkillChain(hex: number): THREE.Group {
  const g = new THREE.Group();
  const defs = [
    { l: 'LANG', c: PAL.a1 }, { l: 'AI/ML', c: PAL.a2 }, { l: 'BACK', c: PAL.a3 },
    { l: 'FRONT', c: PAL.a5 }, { l: 'DEVOPS', c: PAL.a4 }, { l: 'SEC', c: 0x9b8cff },
  ];
  const rune = runeRing(4.6, hex, 36, 0.04); g.add(rune);
  const ring = new THREE.Group(); ring.position.y = 3.2; g.add(ring);
  const R = 4.0, n = defs.length;
  const cubes: THREE.Mesh[] = [];
  defs.forEach((d, i) => {
    const a = (i / n) * TAU, s = 1.4;
    const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), emi(d.c, 0.5, { color: 0x0a0f1a, metalness: 0.5, roughness: 0.32 }));
    cube.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(s, s, s)), lineMat(d.c, 0.95)));
    cube.position.set(Math.cos(a) * R, 0, Math.sin(a) * R);
    const lab = labelSprite(d.l, d.c); lab.position.set(0, 1.5, 0); lab.scale.multiplyScalar(0.55); cube.add(lab);
    cube.userData = { a, phase: i };
    cubes.push(cube); ring.add(cube);
  });
  // central core + energy ring
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 0), emi(hex, 1.0, { color: 0x10182a }));
  core.position.y = 3.2; g.add(core);
  g.add(glowSprite(hex, 2.2).translateY(3.2));
  const eRing = new THREE.Mesh(new THREE.TorusGeometry(R, 0.03, 10, 120), emi(hex, 0.9));
  eRing.rotation.x = Math.PI / 2; eRing.position.y = 3.2; g.add(eRing);
  g.add(particleHalo(48, 1, R + 1, hex, 3, 0.45).translateY(3.2));
  (g.userData as Updatable).update = (t: number) => {
    (rune.userData as { spin: (t: number) => void }).spin(t);
    ring.rotation.y = t * 0.18;
    cubes.forEach((c) => {
      c.rotation.x = t * 0.5 + (c.userData.phase as number); c.rotation.y = t * 0.4;
      c.position.y = Math.sin(t * 0.9 + (c.userData.phase as number)) * 0.3;
    });
    core.rotation.y = -t * 0.3; core.rotation.x = t * 0.2;
    core.position.y = 3.2 + Math.sin(t * 0.8) * 0.15;
    eRing.rotation.z = t * 0.2;
  };
  return g;
}
