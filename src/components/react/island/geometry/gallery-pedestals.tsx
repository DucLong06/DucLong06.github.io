/**
 * gallery-pedestals.tsx — PAPERS structure. Three obsidian/marble pedestals with
 * gold inlay, each topped by a distinct award (engraved medallion, glass
 * certificate tablet, golden laurel wreath), lit by soft additive downlight
 * cones for a museum-gallery feel. Ported from the prototype.
 */
import {
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  PointLight,
  TorusGeometry,
} from 'three';
import { COL, getSection } from '../scene-config';
import { makeHalo } from './neon-halo';
import { makeSpotCone } from './spotlight-cone';
import { useBuilt, type BuiltStructure } from './built-structure';

const GOLD = 0xd9b65a;
const CREAM = 0xf2e8cf;

function buildPedestals(): BuiltStructure {
  const g = new Group();
  g.position.set(...getSection('papers').prop);

  const heights = [1.7, 2.2, 1.3];
  const xs = [-1.9, 0, 1.9];
  const podMat = new MeshStandardMaterial({ color: 0x0c0a18, emissive: 0x141225, emissiveIntensity: 0.25, metalness: 0.65, roughness: 0.18 });
  const goldMat = () => new MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.7, metalness: 0.95, roughness: 0.2 });
  const creamMat = () => new MeshStandardMaterial({ color: CREAM, emissive: CREAM, emissiveIntensity: 0.35, metalness: 0.2, roughness: 0.5 });
  const items: { top: Group }[] = [];

  const galKey = new PointLight(0xffe6b0, 1.0, 18);
  galKey.position.set(0, 5.2, 2.5);
  g.add(galKey);

  for (let i = 0; i < 3; i++) {
    const h = heights[i];
    const x = xs[i];
    const pod = new Mesh(new CylinderGeometry(0.5, 0.6, h, 24), podMat);
    pod.position.set(x, h / 2, 0);
    g.add(pod);
    const cap = new Mesh(new CylinderGeometry(0.58, 0.5, 0.1, 24), goldMat());
    cap.position.set(x, h + 0.05, 0);
    g.add(cap);
    const baseTrim = new Mesh(new CylinderGeometry(0.64, 0.66, 0.08, 24), goldMat());
    baseTrim.position.set(x, 0.04, 0);
    g.add(baseTrim);
    [h * 0.34, h * 0.62].forEach((iy) => {
      const inlay = new Mesh(new TorusGeometry(0.53, 0.008, 6, 40), goldMat());
      inlay.rotation.x = Math.PI / 2;
      inlay.position.set(x, iy, 0);
      g.add(inlay);
    });
    const vIn = new Mesh(new BoxGeometry(0.02, h * 0.7, 0.02), goldMat());
    vIn.position.set(x, h * 0.5, 0.5);
    g.add(vIn);

    const spot = makeSpotCone(0xffe6b0, 0.62, h + 0.8, 0.13);
    spot.rotation.x = Math.PI; // point downward
    spot.position.set(x, h + 0.9, 0);
    g.add(spot);
    const pool = makeHalo(0xffe6b0, 1.3);
    pool.position.set(x, h + 0.08, 0);
    pool.material.opacity = 0.3;
    g.add(pool);

    const top = new Group();
    top.position.set(x, h + 0.6, 0);
    g.add(top);

    if (i === 0) {
      // engraved medallion
      const disc = new Mesh(new CylinderGeometry(0.34, 0.34, 0.06, 40), goldMat());
      disc.rotation.x = Math.PI / 2;
      top.add(disc);
      [0.27, 0.2, 0.13].forEach((r, k) => {
        const ring = new Mesh(new TorusGeometry(r, 0.012, 8, 40), k % 2 ? creamMat() : goldMat());
        ring.position.z = 0.035;
        top.add(ring);
      });
      const star = new Mesh(new OctahedronGeometry(0.1, 0), new MeshStandardMaterial({ color: 0xfff4d8, emissive: GOLD, emissiveIntensity: 1.1, metalness: 0.6, roughness: 0.25 }));
      star.position.z = 0.06;
      top.add(star);
      const ribbon = new Mesh(new BoxGeometry(0.16, 0.42, 0.02), new MeshStandardMaterial({ color: 0x7a2b3a, emissive: 0x7a2b3a, emissiveIntensity: 0.35, roughness: 0.6 }));
      ribbon.position.set(0, 0.44, -0.03);
      top.add(ribbon);
    } else if (i === 1) {
      // glass certificate tablet + gold seal
      const doc = new Mesh(new PlaneGeometry(0.62, 0.82), new MeshStandardMaterial({ color: CREAM, emissive: 0x9fe0ff, emissiveIntensity: 0.22, transparent: true, opacity: 0.82, metalness: 0.1, roughness: 0.35, side: DoubleSide }));
      top.add(doc);
      const sheen = makeHalo(COL.cyan, 1.4);
      sheen.material.opacity = 0.18;
      sheen.position.z = -0.05;
      top.add(sheen);
      const frame = new LineSegments(new EdgesGeometry(new PlaneGeometry(0.62, 0.82)), new LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 }));
      top.add(frame);
      for (let l = 0; l < 5; l++) {
        const ln = new Mesh(new PlaneGeometry(0.42, 0.01), goldMat());
        ln.position.set(0, 0.24 - l * 0.1, 0.006);
        top.add(ln);
      }
      const seal = new Mesh(new CylinderGeometry(0.1, 0.1, 0.03, 24), goldMat());
      seal.rotation.x = Math.PI / 2;
      seal.position.set(0, -0.28, 0.04);
      top.add(seal);
      const sealStar = new Mesh(new OctahedronGeometry(0.05, 0), creamMat());
      sealStar.position.set(0, -0.28, 0.07);
      top.add(sealStar);
    } else {
      // golden laurel wreath
      const laurel = new Mesh(new TorusGeometry(0.3, 0.03, 12, 48), goldMat());
      top.add(laurel);
      for (let n = 0; n < 16; n++) {
        const a = (n / 16) * Math.PI * 2;
        const leaf = new Mesh(new OctahedronGeometry(0.055, 0), goldMat());
        leaf.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0);
        leaf.scale.set(1, 1.8, 0.5);
        leaf.rotation.z = a;
        top.add(leaf);
      }
      const lg = makeHalo(0xffe6b0, 1.1);
      lg.material.opacity = 0.22;
      top.add(lg);
    }

    const halo = makeHalo(GOLD, 2.2);
    halo.position.set(x, h + 0.6, 0);
    halo.material.opacity = 0.26;
    g.add(halo);
    items.push({ top });
  }

  return {
    group: g,
    update: (t) => {
      items.forEach((it, i) => {
        it.top.rotation.y = t * 0.32 + i * 1.2;
      });
      g.position.y = Math.sin(t * 0.6 + 3) * 0.03;
    },
  };
}

export function GalleryPedestals() {
  return <primitive object={useBuilt(buildPedestals)} />;
}
