/**
 * geometry.ts — turns a StoryLayout into the solid polylines each scene
 * draws (and that the particles fly onto). Ported from `build()` in the demo;
 * the only change is that coordinates come from the layout instead of
 * literals, so the same code serves the landscape and compact stages.
 */
import type { Pt, StoryLayout } from './layout-types';

export interface Poly {
  p: Pt[];
  y: boolean;      // yellow (true) or cyan (false)
  w: number;       // line width
  a: number;       // alpha
  fill: boolean;   // fill interior with the page colour (masks lines behind)
  c: number[];     // cumulative length per vertex
  len: number;     // total length
}

export interface SceneGeometry {
  polys: Poly[];
  total: number;   // sum of all lengths — used to spread particles evenly
}

class Sketch {
  polys: Poly[] = [];
  add(pts: Pt[], yellow = false, w = 1.6, a = 1, fill = false): void {
    this.polys.push({ p: pts, y: yellow, w, a, fill, c: [], len: 0 });
  }
  rect(x: number, y: number, w: number, h: number, yellow: boolean, lw: number, fill: boolean): void {
    this.add([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], yellow, lw, 1, fill);
  }
  circ(cx: number, cy: number, r: number, yellow: boolean, fill: boolean): void {
    const pts: Pt[] = [];
    for (let n = 0; n <= 24; n++) {
      const t = (n / 24) * 6.2832;
      pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
    }
    this.add(pts, yellow, 1.8, 1, fill);
  }
  corners(x: number, y: number, w: number, h: number, arm: number, yellow: boolean): void {
    this.add([[x, y + arm], [x, y], [x + arm, y]], yellow, 2.8);
    this.add([[x + w - arm, y], [x + w, y], [x + w, y + arm]], yellow, 2.8);
    this.add([[x + w, y + h - arm], [x + w, y + h], [x + w - arm, y + h]], yellow, 2.8);
    this.add([[x + arm, y + h], [x, y + h], [x, y + h - arm]], yellow, 2.8);
  }
  /** Measure every polyline once; particles use the cumulative lengths. */
  finish(): SceneGeometry {
    let total = 0;
    for (const q of this.polys) {
      const c = [0];
      for (let j = 1; j < q.p.length; j++) c.push(c[j - 1] + Math.hypot(q.p[j][0] - q.p[j - 1][0], q.p[j][1] - q.p[j - 1][1]));
      q.c = c;
      q.len = c[c.length - 1];
      total += q.len;
    }
    return { polys: this.polys, total };
  }
}

/** Scene 0 — request frame, rails, token boxes. */
function buildGuardrail(L: StoryLayout): SceneGeometry {
  const s = L.s0, k = new Sketch();
  k.corners(s.frame.x, s.frame.y, s.frame.w, s.frame.h, s.arm, true);
  for (const [a, b] of s.rails) {
    k.add([a, b], true, 1.2, 0.8);
    k.circ(a[0], a[1], 4, true, true);
  }
  for (const w of s.words) k.rect(w.x, w.y, w.w, w.h, false, 1.8, false);
  for (const [a, b] of s.connectors) k.add([a, b], false, 1.2, 0.7);
  return k.finish();
}

/** Scene 1 — three bracketed matrices, "·" and "=" marks. */
function buildMatrix(L: StoryLayout): SceneGeometry {
  const s = L.s1, k = new Sketch();
  for (const b of s.brackets) {
    k.add([[b.x0 + 14, b.y0], [b.x0, b.y0], [b.x0, b.y1], [b.x0 + 14, b.y1]], b.yellow, 2.2);
    k.add([[b.x1 - 14, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x1 - 14, b.y1]], b.yellow, 2.2);
    for (const ry of b.rows) k.add([[b.x0 + 12, ry], [b.x1 - 12, ry]], b.yellow, 0.8, 0.4);
  }
  for (const [a, b] of s.dividers) k.add([a, b], false, 0.8, 0.4);
  const m = s.markSize, [dx, dy] = s.dot, [ex, ey] = s.eq;
  k.add([[dx - m, dy - m], [dx + m, dy + m]], false, 2.2);
  k.add([[dx + m, dy - m], [dx - m, dy + m]], false, 2.2);
  const hw = m * 1.25, gap = m * 0.625;
  k.add([[ex - hw, ey - gap], [ex + hw, ey - gap]], true, 2.2);
  k.add([[ex - hw, ey + gap], [ex + hw, ey + gap]], true, 2.2);
  return k.finish();
}

/** Scene 2 — fully connected layers, yellow edges into ŷ. */
function buildNetwork(L: StoryLayout): SceneGeometry {
  const s = L.s2, k = new Sketch();
  for (const a of s.l0) for (const b of s.l1) k.add([a, b], false, 0.9, 0.5);
  for (const a of s.l1) for (const b of s.l2) k.add([a, b], false, 0.9, 0.5);
  for (const a of s.l2) k.add([a, s.out], true, 1.3, 0.8);
  for (const p of s.l0) k.circ(p[0], p[1], s.r, false, true);
  for (const p of s.l1) k.circ(p[0], p[1], s.r, false, true);
  for (const p of s.l2) k.circ(p[0], p[1], s.r, false, true);
  k.circ(s.out[0], s.out[1], s.rOut, true, true);
  return k.finish();
}

/** Scene 3 — traces first (modules fill over them), then pins, modules, chip. */
function buildChip(L: StoryLayout): SceneGeometry {
  const s = L.s3, k = new Sketch();
  for (const t of s.traces) {
    k.add(t.pts, t.yellow, 1.6);
    const a = t.pts[0], b = t.pts[t.pts.length - 1];
    k.circ(a[0], a[1], 4, t.yellow, true);
    k.circ(b[0], b[1], 4, t.yellow, true);
  }
  for (const p of s.pins) {
    k.add(p.line, false, 1.2, 0.7);
    k.circ(p.dot[0], p.dot[1], 4, false, true);
  }
  for (const b of s.left) k.rect(b.x, b.y, b.w, b.h, true, 1.8, true);
  for (const b of s.right) k.rect(b.x, b.y, b.w, b.h, false, 1.8, true);
  k.rect(s.chip.x, s.chip.y, s.chip.w, s.chip.h, false, 2.2, true);
  k.rect(s.inner.x, s.inner.y, s.inner.w, s.inner.h, false, 0.8, false);
  k.circ(s.dot[0], s.dot[1], 3, true, true);
  return k.finish();
}

const builders = [buildGuardrail, buildMatrix, buildNetwork, buildChip];

export function buildScene(k: number, L: StoryLayout): SceneGeometry {
  return builders[k](L);
}

/** Point at arc-length `d` along a polyline (wraps around). */
export function pointAt(q: Poly, d: number): Pt {
  d = ((d % q.len) + q.len) % q.len;
  for (let j = 1; j < q.c.length; j++) {
    if (d <= q.c[j]) {
      const f = (d - q.c[j - 1]) / (q.c[j] - q.c[j - 1] || 1);
      return [q.p[j - 1][0] + (q.p[j][0] - q.p[j - 1][0]) * f, q.p[j - 1][1] + (q.p[j][1] - q.p[j - 1][1]) * f];
    }
  }
  return q.p[q.p.length - 1];
}
