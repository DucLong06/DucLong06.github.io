/**
 * quantum-core.tsx — ABOUT structure. A floating emissive core inside two
 * counter-rotating icosahedron wireframe shells, ringed by three orbiting
 * particle rings and wrapped in an additive halo. Ported from the prototype.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  PointsMaterial,
} from 'three';
import { COL, getSection } from '../scene-config';
import { makeHalo } from './neon-halo';
import { useBuilt, type BuiltStructure } from './built-structure';

function buildCore(): BuiltStructure {
  const g = new Group();
  g.position.set(...getSection('about').prop); // [0, 3.2, 0]

  const core = new Mesh(
    new IcosahedronGeometry(1.0, 3),
    new MeshStandardMaterial({ color: 0xffffff, emissive: COL.cyan, emissiveIntensity: 1.6, roughness: 0.2, metalness: 0.1 }),
  );
  g.add(core);

  const ico = new Mesh(
    new IcosahedronGeometry(2.1, 1),
    new MeshBasicMaterial({ color: COL.violet, wireframe: true, transparent: true, opacity: 0.7 }),
  );
  g.add(ico);
  const ico2 = new Mesh(
    new IcosahedronGeometry(2.6, 0),
    new MeshBasicMaterial({ color: COL.cyan, wireframe: true, transparent: true, opacity: 0.35 }),
  );
  g.add(ico2);

  const halo = makeHalo(COL.violet, 8);
  halo.material.opacity = 0.5;
  g.add(halo);

  // 3 orbiting particle rings (Points)
  const rings: Points[] = [];
  const ringSpec: [number, number, number][] = [
    [2.9, COL.cyan, 0.0],
    [3.4, COL.pink, 1.0],
    [3.1, COL.lime, 2.0],
  ];
  ringSpec.forEach(([rad, color, tilt]) => {
    const N = 90;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * rad;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(a) * rad;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    const m = new PointsMaterial({ color, size: 0.18, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false });
    const pts = new Points(geo, m);
    pts.rotation.x = tilt;
    pts.rotation.z = tilt * 0.6;
    g.add(pts);
    rings.push(pts);
  });

  return {
    group: g,
    update: (t) => {
      g.position.y = 3.2 + Math.sin(t * 1.1) * 0.18;
      ico.rotation.y = t * 0.4;
      ico.rotation.x = t * 0.22;
      ico2.rotation.y = -t * 0.28;
      ico2.rotation.z = t * 0.16;
      core.scale.setScalar(1 + Math.sin(t * 2.4) * 0.08);
      rings[0].rotation.y = t * 0.7;
      rings[1].rotation.y = -t * 0.5;
      rings[2].rotation.x = t * 0.6;
      halo.material.opacity = 0.42 + Math.sin(t * 2.4) * 0.1;
    },
  };
}

export function QuantumCore() {
  return <primitive object={useBuilt(buildCore)} />;
}
