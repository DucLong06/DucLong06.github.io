/**
 * cyber-materials.ts — Shared geometry/material helpers for the data block.
 *
 * Pure factories (no React) so they can be memoized inside components. Runs only
 * client-side (the scene is lazy + client:only), so `document` / canvas APIs are
 * safe here. Deterministic — NO Math.random at module scope.
 */
import {
  CatmullRomCurve3,
  Vector3,
  CanvasTexture,
  RepeatWrapping,
  type Texture,
} from 'three';
import { STRANDS } from '../cyber-config';

/**
 * Build a thin repeating "data stripe" texture (neon dashes on transparent) for
 * code-strand tubes. Scrolling its UV offset makes the strands look like flowing
 * code/data. Cheap: 8×64 px, generated once.
 */
export function makeDataStripeTexture(color = '#2de2ff'): Texture {
  const w = 8;
  const h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color;
  // Dash pattern down the V axis — varied lengths read as "code lines".
  const segments = [
    [2, 10],
    [16, 6],
    [26, 14],
    [44, 4],
    [52, 9],
  ];
  for (const [y, len] of segments) ctx.fillRect(0, y, w, len);
  const tex = new CanvasTexture(canvas);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(1, 1);
  return tex;
}

/**
 * Deterministic CatmullRom curve for strand `i` of `count`, looping around the
 * core. Seeded purely by index → identical every build (no random at load).
 */
export function makeStrandCurve(i: number, count: number): CatmullRomCurve3 {
  const points: Vector3[] = [];
  const turns = 1 + (i % 3) * 0.5; // 1.0 / 1.5 / 2.0 winding
  const phase = (i / count) * Math.PI * 2;
  const tilt = ((i % 5) - 2) * 0.22; // spread strands across tilts
  const steps = 10;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const a = phase + t * Math.PI * 2 * turns;
    const r = STRANDS.spread * (0.55 + 0.45 * Math.sin(t * Math.PI)); // bulge mid
    const y = (t - 0.5) * STRANDS.spread * 1.1;
    points.push(
      new Vector3(
        Math.cos(a) * r,
        y * Math.cos(tilt) + Math.sin(a) * r * Math.sin(tilt) * 0.3,
        Math.sin(a) * r,
      ),
    );
  }
  const curve = new CatmullRomCurve3(points, true, 'catmullrom', 0.5);
  return curve;
}
