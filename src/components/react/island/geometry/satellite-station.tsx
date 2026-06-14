/**
 * satellite-station.tsx — CONTACT structure. A satellite ground station: pedestal
 * + azimuth/elevation mount, a true parabolic dish (LatheGeometry), feed horn on
 * struts, an emissive signal beam with traveling pulse rings, and an orbiting
 * satellite sprite. Ported from the prototype.
 */
import {
  AdditiveBlending,
  CanvasTexture,
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';
import { COL, getSection } from '../scene-config';
import { emat } from './neon-material';
import { makeHalo } from './neon-halo';
import { useBuilt, type BuiltStructure } from './built-structure';

function satelliteTexture(): CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const cx = cv.getContext('2d')!;
  cx.translate(32, 32);
  cx.fillStyle = '#cdf6ff';
  cx.shadowColor = '#38e1ff';
  cx.shadowBlur = 8;
  cx.fillRect(-5, -5, 10, 10); // body
  cx.fillStyle = '#7c5cff';
  cx.fillRect(-18, -3, 10, 6);
  cx.fillRect(8, -3, 10, 6); // panels
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function buildStation(): BuiltStructure {
  const g = new Group();
  g.position.set(...getSection('contact').prop);

  const base = new Mesh(
    new CylinderGeometry(0.9, 1.1, 0.4, 24),
    new MeshStandardMaterial({ color: 0x0d0a22, emissive: COL.violet, emissiveIntensity: 0.1, metalness: 0.6, roughness: 0.6 }),
  );
  base.position.y = 0.2;
  g.add(base);
  const baseRing = new Mesh(new TorusGeometry(0.92, 0.04, 8, 32), new MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.5 }));
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.42;
  g.add(baseRing);

  const yawGrp = new Group();
  yawGrp.position.y = 0.4;
  g.add(yawGrp);
  const mast = new Mesh(
    new CylinderGeometry(0.16, 0.2, 1.4, 12),
    new MeshStandardMaterial({ color: 0x140d33, emissive: COL.violet, emissiveIntensity: 0.18, metalness: 0.7, roughness: 0.4 }),
  );
  mast.position.y = 0.7;
  yawGrp.add(mast);

  const pitchGrp = new Group();
  pitchGrp.position.y = 1.5;
  yawGrp.add(pitchGrp);

  // True parabolic dish via LatheGeometry (paraboloid profile y = r²/R²·depth).
  const dishR = 1.5;
  const depth = 0.55;
  const segs = 14;
  const profile: Vector2[] = [];
  for (let i = 0; i <= segs; i++) {
    const r = (i / segs) * dishR;
    profile.push(new Vector2(r, (r * r) / (dishR * dishR) * depth));
  }
  const dish = new Mesh(
    new LatheGeometry(profile, 40),
    new MeshStandardMaterial({ color: 0x0a1a2a, emissive: COL.cyan, emissiveIntensity: 0.32, metalness: 0.85, roughness: 0.25, side: DoubleSide }),
  );
  pitchGrp.add(dish);
  const rim = new Mesh(new TorusGeometry(dishR, 0.04, 8, 48), new MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.6 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = depth;
  pitchGrp.add(rim);

  // Feed horn on tripod struts at the focal point.
  const focal = depth + 0.9;
  const strutMat = new MeshStandardMaterial({ color: 0x222233, emissive: COL.cyan, emissiveIntensity: 0.2, metalness: 0.7, roughness: 0.4 });
  for (let s = 0; s < 3; s++) {
    const a = (s / 3) * Math.PI * 2;
    const sx = Math.cos(a) * dishR * 0.8;
    const sz = Math.sin(a) * dishR * 0.8;
    const strut = new Mesh(new CylinderGeometry(0.02, 0.02, 1, 6), strutMat);
    strut.position.set(sx / 2, (0.1 + focal) / 2, sz / 2);
    strut.scale.y = Math.hypot(sx, focal - 0.1, sz);
    strut.lookAt(new Vector3(0, focal, 0));
    strut.rotateX(Math.PI / 2);
    pitchGrp.add(strut);
  }
  const feed = new Mesh(new CylinderGeometry(0.12, 0.16, 0.32, 16), emat(COL.lime, 1.4));
  feed.position.y = focal;
  pitchGrp.add(feed);

  // Emissive signal beam + traveling pulse rings up the dish axis.
  const beam = new Mesh(
    new CylinderGeometry(0.05, 0.3, 10, 16, 1, true),
    new MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }),
  );
  beam.position.y = focal + 5;
  pitchGrp.add(beam);

  const pulses: Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const ring = new Mesh(
      new TorusGeometry(0.3, 0.035, 8, 32),
      new MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false }),
    );
    ring.rotation.x = Math.PI / 2;
    pitchGrp.add(ring);
    pulses.push(ring);
  }

  const sat = new Sprite(new SpriteMaterial({ map: satelliteTexture(), transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.95 }));
  sat.scale.set(0.8, 0.8, 1);
  g.add(sat);

  const halo = makeHalo(COL.cyan, 4);
  halo.position.set(0, 2.2, 0);
  g.add(halo);

  return {
    group: g,
    update: (t) => {
      yawGrp.rotation.y = Math.sin(t * 0.35) * 0.55;
      pitchGrp.rotation.x = -0.45 + Math.sin(t * 0.5) * 0.18;
      (beam.material as MeshBasicMaterial).opacity = 0.24 + Math.abs(Math.sin(t * 2)) * 0.2;
      pulses.forEach((r, i) => {
        const ph = (t * 0.45 + i / 4) % 1;
        r.position.y = focal + ph * 9;
        r.scale.setScalar(0.8 + ph * 1.4);
        (r.material as MeshBasicMaterial).opacity = 0.7 * (1 - ph);
      });
      sat.position.set(Math.cos(t * 0.5) * 5.5, 6 + Math.sin(t * 0.5) * 0.6, Math.sin(t * 0.5) * 5.5);
    },
  };
}

export function SatelliteStation() {
  return <primitive object={useBuilt(buildStation)} />;
}
