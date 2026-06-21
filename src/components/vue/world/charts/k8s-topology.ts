/**
 * k8s-topology.ts — GKE cluster topology diagram (port of `k8sTopo` from
 * prototype world-ui.js). Control-plane → 3 nodes × 3 pods with pulse dots.
 */
const NS = 'http://www.w3.org/2000/svg';
const MONO = 'JetBrains Mono Variable, JetBrains Mono, monospace';

type Attrs = Record<string, string | number>;
const el = (n: string, a: Attrs = {}): SVGElement => {
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, String(a[k]));
  return e;
};

export function k8sTopo(host: HTMLElement): void {
  host.innerHTML = '';
  const W = 360, H = 200;
  const a1 = '#38e1ff', a2 = '#a06bff', a4 = '#74f0a4';
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart k8s' });
  const ctrl = { x: W / 2, y: 26 };
  const nodes = [{ x: 64, y: 110, n: 'node-1' }, { x: W / 2, y: 132, n: 'node-2' }, { x: W - 64, y: 110, n: 'node-3' }];
  // links control-plane → nodes
  nodes.forEach((nd) => {
    svg.appendChild(el('line', { x1: ctrl.x, y1: ctrl.y + 14, x2: nd.x, y2: nd.y - 16, stroke: 'rgba(120,160,210,.4)', 'stroke-width': 1.2, 'stroke-dasharray': '3 4', class: 'k8s-link' }));
  });
  // control plane
  const cp = el('g');
  cp.appendChild(el('rect', { x: ctrl.x - 56, y: ctrl.y - 14, width: 112, height: 28, rx: 7, fill: 'rgba(56,225,255,.08)', stroke: a1, 'stroke-width': 1.4 }));
  const cpt = el('text', { x: ctrl.x, y: ctrl.y + 4, fill: a1, 'font-size': 11, 'text-anchor': 'middle', 'font-family': MONO, 'font-weight': 600 }); cpt.textContent = 'control-plane'; cp.appendChild(cpt);
  svg.appendChild(cp);
  // nodes with pods
  nodes.forEach((nd, ni) => {
    svg.appendChild(el('rect', { x: nd.x - 44, y: nd.y - 16, width: 88, height: 56, rx: 8, fill: 'rgba(160,107,255,.06)', stroke: 'rgba(160,107,255,.55)', 'stroke-width': 1.2 }));
    const nt = el('text', { x: nd.x, y: nd.y - 4, fill: a2, 'font-size': 9, 'text-anchor': 'middle', 'font-family': MONO }); nt.textContent = nd.n; svg.appendChild(nt);
    for (let p = 0; p < 3; p++) {
      const px = nd.x - 28 + p * 28, py = nd.y + 18;
      svg.appendChild(el('rect', { x: px - 9, y: py - 9, width: 18, height: 18, rx: 4, fill: 'rgba(116,240,164,.14)', stroke: a4, 'stroke-width': 1.2, class: 'k8s-pod', style: `--d:${(ni * 3 + p) * 120}ms` }));
      svg.appendChild(el('circle', { cx: px, cy: py, r: 2.4, fill: a4, class: 'k8s-pulse', style: `--d:${(ni * 3 + p) * 200}ms` }));
    }
  });
  host.appendChild(svg);
}
