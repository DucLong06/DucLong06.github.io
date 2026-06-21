/**
 * scene-helpers.ts — Shared beauty helpers (verbatim port of prototype
 * world.module.js lines ~51–166). Texture/sprite factories + the per-frame
 * "things that move in harmony" primitives reused across every station.
 *
 * GLOW is lazy so importing this module never touches `document` at module load
 * (the composable is client-only, but lazy keeps SSR/HMR robust).
 */
import * as THREE from 'three';
import { C, PAL, TAU } from './palette';

/** An updatable Object3D — stations attach a per-frame `update(t)`. */
export interface Updatable {
  update?: (t: number) => void;
}

let _glow: THREE.Texture | null = null;
function glowTex(): THREE.Texture {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.7)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.18)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
/** Lazy shared radial-glow texture used by sprites/points. */
export function getGlow(): THREE.Texture {
  return (_glow ??= glowTex());
}

/**
 * Drop the shared glow texture so the next mount rebuilds it. MUST run in the
 * scene's dispose() — otherwise a remount/HMR reuses a GPU-freed texture
 * (blank glow + GL warnings), since dispose() frees it via scene traversal.
 */
export function resetGlow(): void {
  _glow = null;
}

const DISPLAY = 'Space Grotesk, sans-serif';
const MONO = '"JetBrains Mono Variable", "JetBrains Mono", monospace';

/** Bold display label sprite with optional mono sub-line (port of labelSprite). */
export function labelSprite(text: string, hex: number, sub?: string): THREE.Sprite {
  const pad = 24, fs = 64, sfs = 30;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  ctx.font = `700 ${fs}px ${DISPLAY}`;
  const w = Math.max(ctx.measureText(text).width, sub ? 300 : 0) + pad * 2;
  c.width = w;
  c.height = (sub ? fs + sfs + 28 : fs + 18) + pad;
  const x = c.getContext('2d')!;
  x.textAlign = 'center';
  x.textBaseline = 'top';
  x.shadowColor = '#' + new THREE.Color(hex).getHexString();
  x.shadowBlur = 22;
  x.font = `700 ${fs}px ${DISPLAY}`;
  x.fillStyle = '#eaf6ff';
  x.fillText(text, c.width / 2, pad / 2);
  if (sub) {
    x.shadowBlur = 0;
    x.font = `500 ${sfs}px ${MONO}`;
    x.fillStyle = '#' + new THREE.Color(hex).getHexString();
    x.fillText(sub, c.width / 2, pad / 2 + fs + 12);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false });
  const spr = new THREE.Sprite(mat);
  const scale = 0.018;
  spr.scale.set(c.width * scale, c.height * scale, 1);
  spr.renderOrder = 999;
  spr.userData.baseScale = spr.scale.clone();
  return spr;
}

interface EmiOpts {
  color?: number;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
}
/** Emissive standard material (port of emi). */
export function emi(hex: number, intensity = 1.0, opts: EmiOpts = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: opts.color !== undefined ? C(opts.color) : C(hex).multiplyScalar(0.25),
    emissive: C(hex), emissiveIntensity: intensity,
    metalness: opts.metalness ?? 0.4, roughness: opts.roughness ?? 0.45,
    transparent: opts.transparent || false, opacity: opts.opacity ?? 1,
  });
}

/** Additive line material (port of lineMat). */
export function lineMat(hex: number, op = 0.6): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({ color: C(hex), transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false });
}

/** Circle of points on the XZ plane (port of circlePts). */
export function circlePts(r: number, y = 0, seg = 128): THREE.Vector3[] {
  const p: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    p.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }
  return p;
}

/** Additive glow sprite (port of glowSprite). */
export function glowSprite(hex: number, size: number): THREE.Sprite {
  const m = new THREE.SpriteMaterial({ map: getGlow(), color: C(hex), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const s = new THREE.Sprite(m);
  s.scale.set(size, size, 1);
  return s;
}

/** Soft orbiting particle halo with per-frame update (port of particleHalo). */
export function particleHalo(n: number, rMin: number, rMax: number, hex: number, ySpread: number, sizeS = 0.5): THREE.Points {
  const pos = new Float32Array(n * 3);
  const seed: { a: number; r: number; y: number; sp: number; bob: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, r = rMin + Math.random() * (rMax - rMin), y = (Math.random() - 0.5) * ySpread;
    seed.push({ a, r, y, sp: 0.15 + Math.random() * 0.4, bob: Math.random() * TAU });
    pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: C(hex), size: sizeS, map: getGlow(), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
  (pts.userData as Updatable).update = (t: number) => {
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < n; i++) {
      const s = seed[i]; const a = s.a + t * s.sp * 0.3;
      arr[i * 3] = Math.cos(a) * s.r; arr[i * 3 + 1] = s.y + Math.sin(t * 0.8 + s.bob) * 0.25; arr[i * 3 + 2] = Math.sin(a) * s.r;
    }
    geo.attributes.position.needsUpdate = true;
  };
  return pts;
}

/** Flat rune ring with tick marks; `userData.spin(t)` (port of runeRing). */
export function runeRing(radius: number, hex: number, ticks = 36, y = 0.05): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circlePts(radius, y)), lineMat(hex, 0.7)));
  g.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circlePts(radius * 0.82, y)), lineMat(hex, 0.3)));
  const tp: THREE.Vector3[] = [];
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * TAU, ro = radius, ri = radius * 0.9;
    tp.push(new THREE.Vector3(Math.cos(a) * ri, y, Math.sin(a) * ri), new THREE.Vector3(Math.cos(a) * ro, y, Math.sin(a) * ro));
  }
  const ticksMesh = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tp), lineMat(hex, 0.4));
  g.add(ticksMesh);
  (g.userData as { spin: (t: number) => void }).spin = (t: number) => { ticksMesh.rotation.y = t * 0.08; };
  return g;
}

/** Vertical additive energy beam (port of energyBeam). */
export function energyBeam(height: number, hex: number, rad = 0.5): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(rad * 0.25, rad, height, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: C(hex), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  m.position.y = height / 2;
  return m;
}

/** Glowing nodes travelling a tilted ring; `userData.update` (port of orbitNodes). */
export function orbitNodes(count: number, radius: number, hex: number, tilt = 0, size = 0.7): THREE.Group {
  const g = new THREE.Group();
  g.rotation.x = tilt;
  const nodes: { s: THREE.Sprite; off: number }[] = [];
  for (let i = 0; i < count; i++) { const s = glowSprite(hex, size); nodes.push({ s, off: i / count }); g.add(s); }
  (g.userData as Updatable).update = (t: number) => {
    nodes.forEach((n) => { const a = (t * 0.4 + n.off) * TAU; n.s.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius); });
  };
  return g;
}

export { PAL };
