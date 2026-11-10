/**
 * background.ts — static backdrop (two faint glows + dot grid, rendered once)
 * and the moving hex rain (dim columns of bytes drifting down like traffic
 * through a gateway). Also samples the name glyphs for the particle targets.
 * Ported from makeBg / drawRain / glyphs in the demo, parameterised by stage.
 */
import type { Pt, StoryLayout } from './layout-types';

export const COLOR = {
  bg: '#0B0D18',
  cyan: '#58C4DD',
  cyanSoft: '#D6F4FB',
  yellow: '#FFD24A',
  yellowSoft: '#FFF1B8',
  white: '#F2F2F2',
};

export const MONO = "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace";
export const SERIF = "'STIX Two Text', Georgia, serif";

export interface RainColumn { x: number; y: number; v: number; s: number }

/** Two radial glows (cyan top-left, yellow bottom-right) and a 32px dot grid. */
export function makeBackdrop(W: number, H: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  let a = g.createRadialGradient(W * 0.2, H * 0.19, 0, W * 0.2, H * 0.19, W * 0.48);
  a.addColorStop(0, 'rgba(88,196,221,0.13)');
  a.addColorStop(1, 'rgba(88,196,221,0)');
  g.fillStyle = a;
  g.fillRect(0, 0, W, H);
  a = g.createRadialGradient(W * 0.83, H * 0.89, 0, W * 0.83, H * 0.89, W * 0.44);
  a.addColorStop(0, 'rgba(255,210,74,0.08)');
  a.addColorStop(1, 'rgba(255,210,74,0)');
  g.fillStyle = a;
  g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(159,163,181,0.22)';
  for (let y = 16; y < H; y += 32) for (let x = 16; x < W; x += 32) g.fillRect(x, y, 1, 1);
  return c;
}

export function makeRain(W: number, H: number): RainColumn[] {
  const cols = Math.max(6, Math.floor(W / 43));
  const rain: RainColumn[] = [];
  for (let x = 0; x < cols; x++) {
    rain.push({ x: 20 + x * 43 + Math.random() * 14, y: Math.random() * H, v: 18 + Math.random() * 34, s: Math.floor(Math.random() * 999) });
  }
  return rain;
}

export function drawRain(ctx: CanvasRenderingContext2D, rain: RainColumn[], H: number, now: number, dt: number): void {
  const hex = '0123456789ABCDEF';
  const tick = Math.floor(now / 420);
  ctx.font = `11px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR.cyan;
  for (const c of rain) {
    c.y += c.v * dt;
    if (c.y - 200 > H) { c.y = -20; c.s = Math.floor(Math.random() * 999); }
    for (let j = 0; j < 10; j++) {
      const n = (c.s * 31 + j * 17 + (j === 0 ? tick : 0) * 7) % 256;
      ctx.globalAlpha = 0.16 * (1 - j / 10);
      ctx.fillText(hex.charAt(n >> 4) + hex.charAt(n & 15), c.x, c.y - j * 18);
    }
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'start';
}

/**
 * Rasterise each name token centred in its box and return the opaque pixels
 * (2px step) — the particles assemble these before the lines take over.
 */
export function sampleGlyphs(words: string[], L: StoryLayout): Pt[] {
  const c = document.createElement('canvas');
  c.width = L.W;
  c.height = L.H;
  const g = c.getContext('2d')!;
  g.font = `600 ${L.s0.wordFont}px ${SERIF}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#fff';
  let y0 = L.H, y1 = 0;
  L.s0.words.forEach((b, i) => {
    g.fillText(words[i] ?? '', b.x + b.w / 2, b.y + b.h / 2 + 2);
    y0 = Math.min(y0, b.y);
    y1 = Math.max(y1, b.y + b.h);
  });
  const h = y1 - y0;
  const d = g.getImageData(0, y0, L.W, h).data;
  const out: Pt[] = [];
  for (let y = 0; y < h; y += 2) for (let x = 0; x < L.W; x += 2) if (d[(y * L.W + x) * 4 + 3] > 128) out.push([x, y + y0]);
  return out;
}
