/** build-blockchain.ts — LEDGER station (verbatim port of buildBlockchain). */
import * as THREE from 'three';
import { PAL } from '../palette';
import { emi, lineMat, glowSprite, runeRing, energyBeam, particleHalo, type Updatable } from '../scene-helpers';

export function buildBlockchain(_hex: number): THREE.Group {
  const g = new THREE.Group();
  const gold = PAL.a3;
  const rune = runeRing(3.2, gold, 36, 0.04); g.add(rune);
  // hex pedestal
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, 0.6, 6), emi(gold, 0.25, { color: 0x18130a, metalness: 0.75, roughness: 0.45 }));
  ped.position.y = 0.3; g.add(ped);
  ped.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(2.0, 2.4, 0.6, 6)), lineMat(gold, 0.55)));
  // three floating award medallions (hex coins) stacked
  const stack = new THREE.Group(); g.add(stack);
  const ys = [1.7, 3.4, 5.1];
  const coins: THREE.Mesh[] = [];
  ys.forEach((y, i) => {
    const R = 1.75 - i * 0.16, th = 0.34;
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(R, R, th, 6), emi(gold, 0.45, { color: 0x1c1608, metalness: 0.85, roughness: 0.22 }));
    coin.position.y = y;
    coin.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(R, R, th, 6)), lineMat(gold, 0.8)));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.06, 8, 6), emi(0xffd98a, 1.3));
    rim.rotation.x = Math.PI / 2; coin.add(rim);
    const ering = new THREE.Mesh(new THREE.TorusGeometry(R * 0.5, 0.05, 8, 40), emi(0xffe6b0, 1.0));
    ering.position.y = th / 2 + 0.02; coin.add(ering);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.34), emi(0xffffff, 1.3, { color: 0x201808 }));
    gem.position.y = th / 2 + 0.32; coin.add(gem);
    coin.userData = { phase: i, baseY: y, gem, dir: i % 2 ? 1 : -1 };
    coins.push(coin); stack.add(coin);
  });
  // vertical light link
  g.add(energyBeam(6.5, gold, 0.5));
  g.add(glowSprite(gold, 2.6).translateY(3.4));
  g.add(particleHalo(42, 1.8, 3.4, gold, 7, 0.42).translateY(3.2));
  (g.userData as Updatable).update = (t: number) => {
    (rune.userData as { spin: (t: number) => void }).spin(t);
    coins.forEach((c) => {
      c.rotation.y = t * (0.16 + (c.userData.phase as number) * 0.05) * (c.userData.dir as number);
      c.position.y = (c.userData.baseY as number) + Math.sin(t * 0.6 + (c.userData.phase as number)) * 0.13;
      const gem = c.userData.gem as THREE.Mesh;
      gem.rotation.y = t * 0.9;
      gem.position.y = 0.34 / 2 + 0.32 + Math.sin(t * 1.2 + (c.userData.phase as number)) * 0.05;
    });
  };
  return g;
}
