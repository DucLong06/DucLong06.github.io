/**
 * particles.ts — the 1,400 dots that fly in and settle on the scene's lines.
 *
 * Each particle keeps a "from" position (where it was when the scene changed),
 * a random control point (so the flight is a curve, not a beeline) and a target
 * on one of the polylines — or on a sampled glyph pixel for the name scene.
 * One in six particles is a "signal" that keeps running along its line once
 * the scene has formed. Ported from `begin()` / `frame()` in the demo.
 */
import { pointAt, type SceneGeometry } from './geometry';
import type { Pt } from './layout-types';

export interface Particle {
  x: number; y: number;   // current
  fx: number; fy: number; // flight origin
  cx: number; cy: number; // bezier control point
  tx: number; ty: number; // target
  d: number;              // per-particle random delay / speed
  yl: boolean;            // currently drawn yellow?
  nyl: boolean;           // target colour
  pi: number;             // polyline index, -1 = glyph pixel
  off: number;            // arc-length offset along the polyline
  sig: boolean;           // signal dot (keeps moving on hold)
}

export const PARTICLE_COUNT = 1400;

export function createParticles(W: number, H: number, n = PARTICLE_COUNT): Particle[] {
  const P: Particle[] = [];
  for (let i = 0; i < n; i++) {
    P.push({
      x: Math.random() * W, y: Math.random() * H,
      fx: 0, fy: 0, cx: 0, cy: 0, tx: 0, ty: 0,
      d: 0, yl: false, nyl: false, pi: 0, off: 0, sig: i % 6 === 0,
    });
  }
  return P;
}

/**
 * Give every particle a new destination on `geo`. When `glyphs` is supplied
 * (name scene) 80% of the dots assemble the letters instead of the lines.
 */
export function retarget(P: Particle[], geo: SceneGeometry, glyphs: Pt[] | null, W: number, H: number): void {
  const Q = geo.polys;
  for (let i = 0; i < P.length; i++) {
    const p = P[i];
    p.fx = p.x;
    p.fy = p.y;
    if (glyphs && glyphs.length && i % 10 < 8) {
      const gp = glyphs[Math.floor(Math.random() * glyphs.length)];
      p.tx = gp[0]; p.ty = gp[1]; p.nyl = false; p.pi = -1; p.off = 0;
    } else {
      let r = Math.random() * geo.total, pi = 0;
      while (pi < Q.length - 1 && r > Q[pi].len) { r -= Q[pi].len; pi++; }
      const pt = pointAt(Q[pi], r);
      p.tx = pt[0]; p.ty = pt[1]; p.nyl = Q[pi].y; p.pi = pi; p.off = r;
    }
    p.cx = W / 2 + (Math.random() - 0.5) * W * 1.17;
    p.cy = H / 2 + (Math.random() - 0.5) * H * 1.25;
    p.d = Math.random();
  }
}

/** Move particles along their flight curves for morph progress g ∈ [0,1]. */
export function flyParticles(P: Particle[], g: number): void {
  for (const p of P) {
    const u = Math.max(0, Math.min(1, g * 1.9 - p.d * 0.45));
    const s = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const m = 1 - s;
    p.x = m * m * p.fx + 2 * m * s * p.cx + s * s * p.tx;
    p.y = m * m * p.fy + 2 * m * s * p.cy + s * s * p.ty;
    if (u > 0.5) p.yl = p.nyl;
  }
}

/** On hold: signal dots keep running along their polyline. */
export function advanceSignals(P: Particle[], geo: SceneGeometry, dt: number): void {
  for (const p of P) {
    if (!p.sig || p.pi < 0) continue;
    p.off += dt * 45 * (0.5 + p.d);
    const pt = pointAt(geo.polys[p.pi], p.off);
    p.x = pt[0];
    p.y = pt[1];
  }
}
