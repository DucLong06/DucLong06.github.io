/**
 * renderers.ts — SVG/DOM data-viz renderers (port of prototype charts.js).
 * Framework-agnostic: each draws imperatively into a host element. Live widgets
 * (bloch) return a cancel function so <ChartMount> can stop their rAF on unmount.
 *
 * Accents are read from CSS custom properties on :root (defined in world.css).
 */
const NS = 'http://www.w3.org/2000/svg';
const SANS = 'Space Grotesk';
const MONO = 'JetBrains Mono Variable, JetBrains Mono, monospace';

type Attrs = Record<string, string | number>;
const el = (n: string, a: Attrs = {}): SVGElement => {
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, String(a[k]));
  return e;
};
const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--a1').trim() || '#38e1ff';
const accent2 = () => getComputedStyle(document.documentElement).getPropertyValue('--a2').trim() || '#a06bff';

/** Disposer returned by live renderers (no-op for static ones). */
export type ChartCleanup = (() => void) | void;

interface RadarAxis { label: string; val: number }
function radar(host: HTMLElement, data: { axes: RadarAxis[]; max: number }): ChartCleanup {
  host.innerHTML = '';
  const axes = data.axes, max = data.max ?? 8;
  const W = 260, c = W / 2, R = 96;
  const svg = el('svg', { viewBox: `0 0 ${W} ${W}`, class: 'chart radar' });
  for (let g = 1; g <= 4; g++) {
    const pts = axes.map((a, i) => {
      const ang = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
      const r = (R * g) / 4;
      return `${c + Math.cos(ang) * r},${c + Math.sin(ang) * r}`;
    }).join(' ');
    svg.appendChild(el('polygon', { points: pts, fill: 'none', stroke: 'rgba(120,150,200,0.14)', 'stroke-width': 1 }));
  }
  axes.forEach((a, i) => {
    const ang = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    svg.appendChild(el('line', { x1: c, y1: c, x2: c + Math.cos(ang) * R, y2: c + Math.sin(ang) * R, stroke: 'rgba(120,150,200,0.12)' }));
    const lx = c + Math.cos(ang) * (R + 16), ly = c + Math.sin(ang) * (R + 16);
    const tx = el('text', { x: lx, y: ly, fill: 'var(--muted)', 'font-size': 9, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': MONO });
    tx.textContent = a.label; svg.appendChild(tx);
  });
  const dpts = axes.map((a, i) => {
    const ang = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    const r = R * Math.min(1, a.val / max);
    return `${c + Math.cos(ang) * r},${c + Math.sin(ang) * r}`;
  }).join(' ');
  svg.appendChild(el('polygon', { points: dpts, fill: accent() + '3a', stroke: accent(), 'stroke-width': 2.5, class: 'radar-shape' }));
  axes.forEach((a, i) => {
    const ang = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    const r = R * Math.min(1, a.val / max);
    svg.appendChild(el('circle', { cx: c + Math.cos(ang) * r, cy: c + Math.sin(ang) * r, r: 2.6, fill: '#fff' }));
  });
  host.appendChild(svg);
}

function line(host: HTMLElement, vals: number[]): ChartCleanup {
  host.innerHTML = '';
  const W = 360, H = 150, pad = 8;
  const max = Math.max(...vals) * 1.1, min = 0;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart line', preserveAspectRatio: 'none' });
  for (let i = 0; i <= 3; i++) {
    const y = pad + (H - pad * 2) * (i / 3);
    svg.appendChild(el('line', { x1: 0, y1: y, x2: W, y2: y, stroke: 'rgba(120,150,200,0.10)' }));
  }
  const X = (i: number) => (i / (vals.length - 1)) * W;
  const Y = (v: number) => pad + (H - pad * 2) * (1 - (v - min) / (max - min));
  const d = vals.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  svg.appendChild(el('path', { d: `${d} L${W},${H} L0,${H} Z`, fill: accent() + '20' }));
  const path = el('path', { d, fill: 'none', stroke: accent(), 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'line-path' });
  svg.appendChild(path);
  vals.forEach((v, i) => { if (i === vals.length - 1) svg.appendChild(el('circle', { cx: X(i), cy: Y(v), r: 3.5, fill: '#fff', class: 'line-dot' })); });
  host.appendChild(svg);
  requestAnimationFrame(() => {
    const len = (path as unknown as SVGPathElement).getTotalLength();
    (path as SVGElement & { style: CSSStyleDeclaration }).style.strokeDasharray = String(len);
    (path as SVGElement & { style: CSSStyleDeclaration }).style.strokeDashoffset = String(len);
    (path as SVGElement & { style: CSSStyleDeclaration }).style.transition = 'stroke-dashoffset 1.3s cubic-bezier(.4,0,.2,1)';
    requestAnimationFrame(() => { (path as SVGElement & { style: CSSStyleDeclaration }).style.strokeDashoffset = '0'; });
  });
}

interface Bar { label: string; val: number }
function bars(host: HTMLElement, data: Bar[]): ChartCleanup {
  host.innerHTML = '';
  const W = 360, H = 150, n = data.length, gap = 10, bw = (W - gap * (n - 1)) / n;
  const max = Math.max(...data.map((d) => d.val)) * 1.15;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H + 20}`, class: 'chart bars' });
  data.forEach((d, i) => {
    const h = (H - 4) * (d.val / max);
    const x = i * (bw + gap);
    svg.appendChild(el('rect', { x, y: H - h, width: bw, height: h, rx: 3, fill: i % 2 ? accent2() : accent(), class: 'bar', style: 'transform-box:fill-box;transform-origin:bottom;' }));
    const tx = el('text', { x: x + bw / 2, y: H + 14, fill: 'var(--muted)', 'font-size': 9, 'text-anchor': 'middle', 'font-family': MONO });
    tx.textContent = d.label; svg.appendChild(tx);
  });
  host.appendChild(svg);
}

interface DonutSeg { label: string; val: number; color: string }
function donut(host: HTMLElement, segs: DonutSeg[]): ChartCleanup {
  host.innerHTML = '';
  const W = 180, c = W / 2, r = 64, circ = 2 * Math.PI * r;
  const svg = el('svg', { viewBox: `0 0 ${W} ${W}`, class: 'chart donut' });
  svg.appendChild(el('circle', { cx: c, cy: c, r, fill: 'none', stroke: 'rgba(120,150,200,0.1)', 'stroke-width': 16 }));
  let off = 0;
  const total = segs.reduce((s, x) => s + x.val, 0);
  segs.forEach((s) => {
    const frac = s.val / total;
    svg.appendChild(el('circle', { cx: c, cy: c, r, fill: 'none', stroke: s.color, 'stroke-width': 16, 'stroke-dasharray': `${circ * frac} ${circ}`, 'stroke-dashoffset': -off * circ, transform: `rotate(-90 ${c} ${c})`, class: 'donut-arc' }));
    off += frac;
  });
  const t1 = el('text', { x: c, y: c - 2, fill: 'var(--ink)', 'font-size': 22, 'text-anchor': 'middle', 'font-weight': 700, 'font-family': SANS });
  t1.textContent = String(segs.length); svg.appendChild(t1);
  const t2 = el('text', { x: c, y: c + 16, fill: 'var(--muted)', 'font-size': 9, 'text-anchor': 'middle', 'font-family': MONO });
  t2.textContent = 'LANGS'; svg.appendChild(t2);
  host.appendChild(svg);
}

function gauge(host: HTMLElement, data: { value: number; label: string }): ChartCleanup {
  host.innerHTML = '';
  const value = data.value, label = data.label;
  const W = 180, H = 110, c = W / 2, cy = 95, r = 72;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart gauge' });
  const d = `M${c - r},${cy} A${r},${r} 0 0 1 ${c + r},${cy}`;
  svg.appendChild(el('path', { d, fill: 'none', stroke: 'rgba(120,150,200,0.12)', 'stroke-width': 12, 'stroke-linecap': 'round' }));
  svg.appendChild(el('path', { d, fill: 'none', stroke: accent(), 'stroke-width': 12, 'stroke-linecap': 'round', pathLength: 100, 'stroke-dasharray': `${value} 100`, class: 'gauge-arc' }));
  const t1 = el('text', { x: c, y: cy - 14, fill: 'var(--ink)', 'font-size': 26, 'text-anchor': 'middle', 'font-weight': 700, 'font-family': SANS });
  t1.textContent = value + '%'; svg.appendChild(t1);
  const t2 = el('text', { x: c, y: cy + 4, fill: 'var(--muted)', 'font-size': 8.5, 'text-anchor': 'middle', 'font-family': MONO });
  t2.textContent = label; svg.appendChild(t2);
  host.appendChild(svg);
}

function heatmap(host: HTMLElement, weeks = 26): ChartCleanup {
  host.innerHTML = '';
  const cell = 11, gap = 3, rows = 7;
  const W = weeks * (cell + gap), H = rows * (cell + gap);
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart heatmap' });
  for (let w = 0; w < weeks; w++) for (let d = 0; d < rows; d++) {
    const lvl = Math.random();
    const a = lvl < 0.45 ? 0.06 : lvl < 0.7 ? 0.3 : lvl < 0.88 ? 0.6 : 1;
    svg.appendChild(el('rect', { x: w * (cell + gap), y: d * (cell + gap), width: cell, height: cell, rx: 2, fill: accent(), 'fill-opacity': a, class: 'hm-cell', style: `--d:${(w * rows + d) * 6}ms` }));
  }
  host.appendChild(svg);
}

/** Live Bloch sphere — returns a cancel fn so <ChartMount> stops the rAF. */
function bloch(host: HTMLElement): ChartCleanup {
  host.innerHTML = '';
  const W = 200, c = W / 2, R = 72;
  const svg = el('svg', { viewBox: `0 0 ${W} ${W}`, class: 'chart bloch' });
  svg.appendChild(el('circle', { cx: c, cy: c, r: R, fill: 'none', stroke: 'rgba(120,150,200,0.2)', 'stroke-width': 1 }));
  svg.appendChild(el('ellipse', { cx: c, cy: c, rx: R, ry: R * 0.32, fill: 'none', stroke: accent2() + '66', 'stroke-width': 1 }));
  svg.appendChild(el('line', { x1: c, y1: c - R, x2: c, y2: c + R, stroke: 'rgba(120,150,200,0.18)' }));
  svg.appendChild(el('line', { x1: c - R, y1: c, x2: c + R, y2: c, stroke: 'rgba(120,150,200,0.12)' }));
  const t0 = el('text', { x: c + 6, y: c - R - 4, fill: 'var(--a1)', 'font-size': 11, 'font-family': MONO }); t0.textContent = '|0⟩';
  const t1 = el('text', { x: c + 6, y: c + R + 12, fill: 'var(--a2)', 'font-size': 11, 'font-family': MONO }); t1.textContent = '|1⟩';
  svg.appendChild(t0); svg.appendChild(t1);
  const vec = el('line', { x1: c, y1: c, x2: c, y2: c - R, stroke: accent(), 'stroke-width': 2.5, 'stroke-linecap': 'round' });
  const dot = el('circle', { cx: c, cy: c - R, r: 4, fill: '#fff' });
  svg.appendChild(vec); svg.appendChild(dot);
  host.appendChild(svg);
  let t = Math.random() * 6;
  let raf = 0;
  let cancelled = false;
  function loop() {
    if (cancelled || !host.isConnected) return;
    t += 0.016;
    const theta = Math.PI * (0.32 + 0.22 * Math.sin(t * 0.6));
    const phi = t * 1.1;
    const x = Math.sin(theta) * Math.cos(phi), z = Math.sin(theta) * Math.sin(phi), y = Math.cos(theta);
    const px = c + x * R, py = c - y * R + z * R * 0.32;
    vec.setAttribute('x2', String(px)); vec.setAttribute('y2', String(py));
    dot.setAttribute('cx', String(px)); dot.setAttribute('cy', String(py));
    raf = requestAnimationFrame(loop);
  }
  loop();
  return () => { cancelled = true; cancelAnimationFrame(raf); };
}

function circuit(host: HTMLElement): ChartCleanup {
  host.innerHTML = '';
  const W = 360, rows = 3, rh = 34, H = rows * rh + 10, x0 = 26;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart circuit' });
  for (let i = 0; i < rows; i++) {
    const y = 18 + i * rh;
    svg.appendChild(el('line', { x1: x0, y1: y, x2: W - 6, y2: y, stroke: 'rgba(120,150,200,0.3)' }));
    const lab = el('text', { x: 4, y: y + 4, fill: 'var(--muted)', 'font-size': 10, 'font-family': MONO }); lab.textContent = 'q' + i;
    svg.appendChild(lab);
  }
  const gate = (gx: number, gy: number, t: string, col: string) => {
    svg.appendChild(el('rect', { x: gx - 12, y: gy - 12, width: 24, height: 24, rx: 4, fill: 'rgba(8,14,26,0.9)', stroke: col, 'stroke-width': 1.5 }));
    const tx = el('text', { x: gx, y: gy + 4, fill: col, 'font-size': 12, 'text-anchor': 'middle', 'font-family': MONO, 'font-weight': 600 }); tx.textContent = t; svg.appendChild(tx);
  };
  gate(70, 18, 'H', accent());
  gate(70, 52, 'X', accent2());
  gate(150, 86, 'H', accent());
  svg.appendChild(el('line', { x1: 230, y1: 18, x2: 230, y2: 52, stroke: accent(), 'stroke-width': 1.5 }));
  svg.appendChild(el('circle', { cx: 230, cy: 18, r: 4, fill: accent() }));
  svg.appendChild(el('circle', { cx: 230, cy: 52, r: 9, fill: 'none', stroke: accent(), 'stroke-width': 1.5 }));
  svg.appendChild(el('line', { x1: 221, y1: 52, x2: 239, y2: 52, stroke: accent(), 'stroke-width': 1.5 }));
  svg.appendChild(el('line', { x1: 230, y1: 43, x2: 230, y2: 61, stroke: accent(), 'stroke-width': 1.5 }));
  gate(300, 18, 'M', '#cdd8ea'); gate(300, 52, 'M', '#cdd8ea'); gate(300, 86, 'M', '#cdd8ea');
  host.appendChild(svg);
}

interface LedgerBlock { h: number; title: string; hash: string; meta: string }
function ledger(host: HTMLElement, blocks: LedgerBlock[]): ChartCleanup {
  host.innerHTML = '';
  const wrap = document.createElement('div'); wrap.className = 'ledger';
  blocks.forEach((b, i) => {
    const block = document.createElement('div'); block.className = 'lblock';
    block.innerHTML = `<div class="lh">#${String(b.h).padStart(4, '0')}</div>
      <div class="lt">${b.title}</div>
      <div class="lhash">0x${b.hash}</div>
      <div class="lmeta">${b.meta}</div>`;
    wrap.appendChild(block);
    if (i < blocks.length - 1) { const link = document.createElement('div'); link.className = 'llink'; link.textContent = '⛓'; wrap.appendChild(link); }
  });
  host.appendChild(wrap);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const RENDERERS: Record<string, (host: HTMLElement, data?: any) => ChartCleanup> = {
  radar, line, bars, donut, gauge, heatmap, bloch, circuit, ledger,
};
