/**
 * render.ts — paints one frame: backdrop, hex rain, the scene's solid lines
 * (drawn progressively while particles arrive), the guardrail scan beam and
 * the particles themselves. Pure drawing; state lives in the controller.
 */
import type { SceneGeometry } from './geometry';
import type { Particle } from './particles';
import type { Box } from './layout-types';
import { COLOR } from './background';

/** Stroke every polyline up to fraction `r` of its length. */
export function strokeAll(ctx: CanvasRenderingContext2D, geo: SceneGeometry, r: number, alpha: number): void {
  for (const q of geo.polys) {
    const pts = q.p, lim = q.len * r;
    if (lim <= 0) continue;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let j = 1; j < pts.length; j++) {
      if (q.c[j] <= lim) ctx.lineTo(pts[j][0], pts[j][1]);
      else {
        const f = (lim - q.c[j - 1]) / (q.c[j] - q.c[j - 1] || 1);
        if (f > 0) ctx.lineTo(pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * f, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * f);
        break;
      }
    }
    if (q.fill) { ctx.globalAlpha = alpha * r; ctx.fillStyle = COLOR.bg; ctx.fill(); }
    ctx.globalAlpha = alpha * q.a;
    ctx.lineWidth = q.w;
    ctx.strokeStyle = q.y ? COLOR.yellow : COLOR.cyan;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

/** Guardrail scan: a beam sweeps the request frame; the name decodes behind it. */
export function drawScanBeam(ctx: CanvasRenderingContext2D, frame: Box, progress: number): void {
  const bx = frame.x + frame.w * Math.min(1, progress);
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = COLOR.cyan;
  ctx.fillRect(bx - 60, frame.y, 60, frame.h);
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = COLOR.cyanSoft;
  ctx.fillRect(bx - 1, frame.y - 8, 2, frame.h + 16);
  ctx.globalAlpha = 1;
}

export interface ParticleDrawState {
  hold: boolean;       // scene formed, lines complete
  sinceHold: number;   // ms since the scene formed
  r: number;           // line draw progress 0..1
}

/**
 * Two passes (cyan then yellow) so yellow dots sit on top. Glyph dots fade out
 * once the scene holds; signal dots stay bright; the rest fade as lines draw.
 */
export function drawParticles(ctx: CanvasRenderingContext2D, P: Particle[], s: ParticleDrawState): void {
  for (let pass = 0; pass < 2; pass++) {
    for (const p of P) {
      if ((p.yl ? 1 : 0) !== pass) continue;
      if (p.pi < 0) {
        const ga = s.hold ? Math.max(0, 1 - s.sinceHold / 700) : 0.95;
        if (ga > 0) { ctx.globalAlpha = ga; ctx.fillStyle = COLOR.white; ctx.fillRect(p.x - 1, p.y - 1, 2, 2); }
      } else if (p.sig) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = pass ? COLOR.yellowSoft : COLOR.cyanSoft;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      } else if (s.r < 1) {
        ctx.globalAlpha = 0.95 * (1 - s.r);
        ctx.fillStyle = pass ? COLOR.yellow : COLOR.cyan;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
    }
  }
  ctx.globalAlpha = 1;
}

/** Size the canvas backing store for the current CSS scale and DPR. */
export function fitCanvas(cv: HTMLCanvasElement, W: number, H: number, scale: number): CanvasRenderingContext2D {
  const q = Math.min(2.5, Math.max(1, (window.devicePixelRatio || 1) * scale));
  const bw = Math.round(W * q), bh = Math.round(H * q);
  if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
  const ctx = cv.getContext('2d')!;
  ctx.setTransform(bw / W, 0, 0, bh / H, 0, 0);
  return ctx;
}
