/** build-identity.ts — IDENTITY station (verbatim port of buildIdentity). */
import * as THREE from 'three';
import { PAL } from '../palette';
import {
  emi, lineMat, glowSprite, runeRing, orbitNodes, energyBeam, particleHalo, type Updatable,
} from '../scene-helpers';

export function buildIdentity(hex: number): THREE.Group {
  const g = new THREE.Group();
  const rune = runeRing(3.4, hex, 48, 0.05); g.add(rune);
  // sleek hex pedestal
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.5, 0.7, 6), emi(hex, 0.3, { color: 0x0a1018, metalness: 0.75, roughness: 0.45 }));
  ped.position.y = 0.35; g.add(ped);
  ped.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(2.0, 2.5, 0.7, 6)), lineMat(hex, 0.6)));
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.9, 0.18, 6), emi(hex, 0.7, { color: 0x0e1830, metalness: 0.6, roughness: 0.3 }));
  cap.position.y = 0.78; g.add(cap);
  // floating faceted gem with luminous core
  const gemGeo = new THREE.OctahedronGeometry(1.7, 0);
  const gem = new THREE.Mesh(gemGeo, new THREE.MeshStandardMaterial({ color: new THREE.Color(0x0e1d33), emissive: new THREE.Color(hex), emissiveIntensity: 0.6, metalness: 0.35, roughness: 0.16, flatShading: true }));
  gem.scale.set(1.05, 1.55, 1.05); const gemY = 4.0; gem.position.y = gemY; g.add(gem);
  const gemWire = new THREE.LineSegments(new THREE.EdgesGeometry(gemGeo), lineMat(hex, 0.95));
  gemWire.scale.copy(gem.scale); gemWire.position.copy(gem.position); g.add(gemWire);
  const core = glowSprite(0xffffff, 1.7); core.position.y = gemY; g.add(core);
  g.add(glowSprite(hex, 3.0).translateY(gemY));
  // halo ring + travelling nodes
  const halo = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.045, 12, 140), emi(hex, 1.0));
  halo.position.y = gemY; g.add(halo);
  const nodes = orbitNodes(3, 2.7, PAL.a2, Math.PI / 2, 0.55); nodes.position.y = gemY; g.add(nodes);
  // soft beam + particle halo
  g.add(energyBeam(8.5, hex, 0.55));
  const ph = particleHalo(50, 2.2, 4.2, hex, 5, 0.45); ph.position.y = gemY; g.add(ph);

  (g.userData as Updatable).update = (t: number) => {
    (rune.userData as { spin: (t: number) => void }).spin(t);
    gem.rotation.y = gemWire.rotation.y = t * 0.24;
    const y = gemY + Math.sin(t * 0.7) * 0.16;
    gem.position.y = gemWire.position.y = core.position.y = halo.position.y = nodes.position.y = y;
    halo.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.4; halo.rotation.z = t * 0.22;
    (core.material as THREE.SpriteMaterial).opacity = 0.75 + 0.25 * Math.sin(t * 2.2);
    (nodes.userData as Updatable).update?.(t);
    (ph.userData as Updatable).update?.(t);
  };
  return g;
}
