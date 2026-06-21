/** build-servers.ts — TELEMETRY station (verbatim port of buildServers). */
import * as THREE from 'three';
import { emi, lineMat, glowSprite, runeRing, particleHalo, type Updatable } from '../scene-helpers';

export function buildServers(hex: number, hex2: number): THREE.Group {
  const g = new THREE.Group();
  const rune = runeRing(4.2, hex2, 40, 0.04); g.add(rune);
  const blinkers: THREE.Mesh[] = [];
  const cluster = new THREE.Group(); g.add(cluster);
  const positions = [[-2.3, 0], [0, 0.5], [2.3, 0], [0, -2.0]];
  positions.forEach((p, i) => {
    const rack = new THREE.Group();
    const w = 2.0, d = 1.5, h = 4.4 + (i % 2) * 0.6;
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), emi(hex, 0.16, { color: 0x070c14, metalness: 0.75, roughness: 0.38 }));
    body.position.y = h / 2; rack.add(body);
    rack.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), lineMat(hex, 0.55)).translateY(h / 2));
    const units = Math.floor(h / 0.55);
    for (let u = 0; u < units; u++) {
      const led = new THREE.Mesh(new THREE.BoxGeometry(w * 0.66, 0.1, 0.02), emi(u % 4 === 0 ? hex2 : hex, 1.4));
      led.position.set(0, 0.5 + u * 0.5, d / 2 + 0.01);
      led.userData = { wave: u * 0.4 + i * 1.1 }; blinkers.push(led); rack.add(led);
    }
    rack.position.set(p[0], 0, p[1]);
    cluster.add(rack);
  });
  // rising data packets
  const packets: THREE.Sprite[] = [];
  for (let i = 0; i < 14; i++) {
    const pk = glowSprite(i % 2 ? hex2 : hex, 0.55);
    pk.userData = { x: (Math.random() - 0.5) * 5, z: (Math.random() - 0.5) * 4 - 0.5, off: Math.random(), sp: 0.25 + Math.random() * 0.3 };
    packets.push(pk); cluster.add(pk);
  }
  g.add(particleHalo(40, 3, 5, hex, 4, 0.4).translateY(2.2));
  (g.userData as Updatable).update = (t: number) => {
    (rune.userData as { spin: (t: number) => void }).spin(t);
    cluster.rotation.y = Math.sin(t * 0.12) * 0.25;
    blinkers.forEach((l) => { (l.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + 1.3 * (0.5 + 0.5 * Math.sin(t * 2.2 - (l.userData.wave as number))); });
    packets.forEach((pk) => {
      const p = (t * (pk.userData.sp as number) + (pk.userData.off as number)) % 1;
      pk.position.set(pk.userData.x as number, p * 6.5, pk.userData.z as number);
      (pk.material as THREE.SpriteMaterial).opacity = Math.sin(p * Math.PI) * 0.9;
    });
  };
  return g;
}
