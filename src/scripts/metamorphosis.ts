/**
 * metamorphosis.ts — the Metamorphosis canvas engine.
 *
 * Ported 1:1 from metamorphosis/index.html (see metamorphosis/HANDOFF.md) into a
 * framework-free module. All geometry/layout/draw logic is unchanged; only the
 * data now arrives via the `d` object, DOM nodes are looked up inside `root`,
 * scroll progress is measured against the track (so the classic sections that
 * follow the track stay readable), and HUD/controls fade out once the reader
 * scrolls past the story.
 */

export interface MMData {
  name: string;
  names: string[];
  caps: Array<[string, string] | null>;
  netLabels: string[];
  hero: { role: string; tagline: string };
  outLine: string;
  githubLine: string;
  matNote: { w: string; mid: string; out: string };
  hud: { auto: string; manual: string };
  NET: {
    layers: string[][];
    edges: [number, number, number][];
  };
  MAT: {
    rows: string[];
    years: string[];
    cols: string[];
    icons: string[];
    cells: string[][];
    out: string[];
  };
  DOM: { k: string; t: string; s: string }[];
  AWARDS: { t: string; s: string; k: string }[];
  PROJ: { t: string; s: string; l: string; c: string; st: number | null }[];
  CHIPS: string[];
}

export function initMM(root: HTMLElement, d: MMData): void {
  (function () {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cv = root.querySelector('#stage') as HTMLCanvasElement,
      g = cv.getContext('2d')!,
      W: number, H: number, DPR: number, U: number, FX: number, FY: number, mobile: boolean;
    var q = function (s: string) {
      return root.querySelector(s) as HTMLElement;
    };
    var hl = q('#hl'), hz = q('#hz'), bar = q('#bar'), hint = q('#hint'), contact = q('#contact'), track = q('#track');
    var SCENES = 6, names = d.names, caps = d.caps;
    function clamp(v: number, a: number, b: number) { return v < a ? a : v > b ? b : v; }
    function sm(t: number) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function rnd(s: number) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
    var COL: Record<string, number[]> = {
      white: [242, 242, 242], blue: [88, 196, 221], yellow: [255, 210, 74], green: [131, 193, 103],
      red: [252, 98, 85], grey: [159, 163, 181], dim: [60, 66, 100], ink: [11, 13, 24],
    };
    function rgba(c: number[], a: number) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + clamp(a, 0, 1) + ')'; }
    function serif(px: number, w: number, it?: boolean) { g.font = (it ? 'italic ' : '') + (w || 400) + ' ' + Math.round(Math.max(9, px)) + 'px "STIX Two Text", Georgia, serif'; }
    function mono(px: number, w: number) { g.font = (w || 400) + ' ' + Math.round(Math.max(9, px)) + 'px "JetBrains Mono", monospace'; }
    function rr(x: number, y: number, w: number, h: number, r: number) {
      g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
    }
    function fitMono(txt: string, maxW: number, px: number, w?: number, min?: number) {
      min = min || 8; px = Math.max(min, px); mono(px, w);
      while (g.measureText(txt).width > maxW && px > min) { px -= .5; mono(px, w); } return px;
    }
    function fitSerif(txt: string, maxW: number, px: number, w?: number, min?: number) {
      min = min || 10; px = Math.max(min, px); serif(px, w);
      while (g.measureText(txt).width > maxW && px > min) { px -= .5; serif(px, w); } return px;
    }

    /* ===================== PARTICLES ===================== */
    var N = 3000, shapes: any[] = [], meta: any = {}, off = new Float32Array(N * 2);
    (function () { var R = rnd(3); for (var i = 0; i < N * 2; i++) off[i] = (R() - .5); })();
    function fromList(list: number[][], color: number[]) {
      var p = new Float32Array(N * 2), c = new Float32Array(N * 3), R = rnd(17);
      for (var i = 0; i < N; i++) {
        var q = list[i < list.length ? i : Math.floor(R() * list.length)];
        p[i * 2] = q[0]; p[i * 2 + 1] = q[1];
        var col: number[] = q[2] || color;
        c[i * 3] = col[0]; c[i * 3 + 1] = col[1]; c[i * 3 + 2] = col[2];
      } return { p: p, c: c };
    }
    function shuffle(list: number[][], seed: number) {
      var R = rnd(seed);
      for (var k = list.length - 1; k > 0; k--) { var q = Math.floor(R() * (k + 1)); var t = list[k]; list[k] = list[q]; list[q] = t; }
      return list;
    }
    function textPts(txt: string, widthPx: number, color: number[], yoff: number) {
      var oc = document.createElement('canvas'), o = oc.getContext('2d')!, w = 1400, h = 320;
      oc.width = w; oc.height = h; o.fillStyle = '#fff';
      o.font = '600 150px "STIX Two Text", Georgia, serif'; o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillText(txt, w / 2, h / 2);
      var dd = o.getImageData(0, 0, w, h).data, list: number[][] = [], sc = widthPx / o.measureText(txt).width;
      for (var y = 0; y < h; y += 3) for (var x = 0; x < w; x += 3)
        if (dd[(y * w + x) * 4 + 3] > 128) list.push([(x - w / 2) * sc, (y - h / 2) * sc + (yoff || 0), color]);
      return list;
    }
    function rectPts(cx: number, cy: number, w: number, h: number, color: number[], count: number, R: () => number, fillFrac?: number) {
      var l: number[][] = [];
      for (var k = 0; k < count; k++) {
        if (k >= count * (fillFrac || .3)) {
          var s = Math.floor(R() * 4), t = R();
          l.push([s === 0 ? cx - w / 2 + w * t : s === 1 ? cx + w / 2 : s === 2 ? cx + w / 2 - w * t : cx - w / 2,
            s === 0 ? cy - h / 2 : s === 1 ? cy - h / 2 + h * t : s === 2 ? cy + h / 2 : cy + h / 2 - h * t, color]);
        } else l.push([cx + (R() - .5) * w, cy + (R() - .5) * h, color]);
      } return l;
    }
    function circPts(cx: number, cy: number, r: number, color: number[], count: number, R: () => number, ringFrac?: number) {
      var l: number[][] = [];
      for (var k = 0; k < count; k++) {
        var th = R() * 6.283, rad = k < count * (ringFrac || .6) ? r : r * Math.sqrt(R());
        l.push([cx + Math.cos(th) * rad, cy + Math.sin(th) * rad, color]);
      } return l;
    }
    function nameWidth() { return Math.min(W * .86, U * 1.25); }

    /* ---- layouts (shared by particle sampler and crisp drawing) ---- */
    function layoutNet() {
      var lx = [-.5, -.17, .17, .5], nodes: any[] = [];
      d.NET.layers.forEach(function (col, l) {
        var n = col.length, sp = Math.min(.12, .88 / (n - 1));
        col.forEach(function (nm, i) { nodes.push({ l: l, i: i, name: nm, x: lx[l] * U * 1.05, y: (i - (n - 1) / 2) * sp * U }); });
      });
      function nd(l: number, i: number) { return nodes.filter(function (n) { return n.l === l && n.i === i; })[0]; }
      var real = d.NET.edges.map(function (e) { return { a: nd(e[0], e[1]), b: nd(e[0] + 1, e[2]) }; });
      var all: any[] = [];
      nodes.forEach(function (a) { nodes.forEach(function (b) { if (b.l === a.l + 1) all.push({ a: a, b: b }); }); });
      meta.net = { nodes: nodes, real: real, all: all, lx: lx, r: .022 * U };
    }
    function layoutMat() {
      var AW = Math.min(W * .92, U * 1.9), rowW = AW * .19, outW = AW * .2, gap = 6, cols = 6,
        cellW = (AW - rowW - outW - gap * (cols + 1) - 24) / cols, cellH = Math.min(U * .11, cellW * .62),
        x0 = -AW / 2 + rowW + gap, y0 = -cellH * 2 - gap * 1.5 - U * .03, cells: any[] = [];
      for (var r = 0; r < 4; r++) for (var c = 0; c < cols; c++)
        cells.push({ r: r, c: c, x: x0 + c * (cellW + gap) + cellW / 2, y: y0 + r * (cellH + gap) + cellH / 2, t: d.MAT.cells[r][c] });
      meta.mat = { AW: AW, rowW: rowW, outW: outW, gap: gap, cellW: cellW, cellH: cellH, x0: x0, y0: y0, cells: cells, outX: x0 + cols * (cellW + gap) + 24 + outW / 2, left: -AW / 2 };
    }
    function layoutDom() {
      var cols = mobile ? 3 : 5, rows = Math.ceil(10 / cols), tw = Math.min(U * .21, (W * .92) / cols - 12), gap = 14, tiles: any[] = [];
      d.DOM.forEach(function (dd, i) {
        var c = i % cols, r = Math.floor(i / cols);
        tiles.push({ x: (c - (cols - 1) / 2) * (tw + gap), y: (r - (rows - 1) / 2) * (tw + gap) + (mobile ? 0 : -.01 * U), w: tw, d: dd });
      });
      meta.dom = { tiles: tiles, tw: tw };
    }
    function layoutAch() {
      var aw: any[] = [], pr: any[] = [], awS = Math.min(U * .21, W * .9 / 4), cw = Math.min(U * .36, W * .9 / 3 - 10), ch = cw * .5;
      d.AWARDS.forEach(function (a, i) { aw.push({ x: (i - 1.5) * awS, y: -U * .31, a: a }); });
      d.PROJ.forEach(function (p, i) { pr.push({ x: ((i % 3) - 1) * (cw + 12), y: (i < 3 ? .08 : .08 + ch / U + .03) * U + (i < 3 ? 0 : 0), p: p }); });
      meta.ach = { aw: aw, pr: pr, cw: cw, ch: ch };
    }

    function shapeName() { return fromList(shuffle(textPts(d.name, nameWidth(), COL.white, 0), 29), COL.white); }
    function shapeNet() {
      layoutNet(); var m = meta.net, R = rnd(41), list: number[][] = [], per = Math.floor(N * .55 / m.real.length);
      m.real.forEach(function (e: any) {
        for (var k = 0; k < per; k++) { var t = .06 + R() * .88; list.push([e.a.x + (e.b.x - e.a.x) * t, e.a.y + (e.b.y - e.a.y) * t, COL.blue]); }
      });
      var pn = Math.floor((N - list.length) / m.nodes.length);
      m.nodes.forEach(function (n: any) { list = list.concat(circPts(n.x, n.y, m.r, n.l === 3 ? COL.yellow : COL.white, pn, R)); });
      return fromList(list, COL.white);
    }
    function shapeMat() {
      layoutMat(); var m = meta.mat, R = rnd(53), list: number[][] = [], per = Math.floor(N * .8 / 24);
      m.cells.forEach(function (c: any) { list = list.concat(rectPts(c.x, c.y, m.cellW, m.cellH, c.t ? COL.blue : COL.dim, per, R, c.t ? .45 : .1)); });
      for (var r = 0; r < 4; r++) list = list.concat(rectPts(m.outX, m.y0 + r * (m.cellH + m.gap) + m.cellH / 2, m.outW, m.cellH, COL.yellow, Math.floor(N * .05), R, .4));
      return fromList(list, COL.blue);
    }
    function shapeDom() {
      layoutDom(); var R = rnd(67), list: number[][] = [], per = Math.floor(N / 10);
      meta.dom.tiles.forEach(function (t: any) { list = list.concat(rectPts(t.x, t.y, t.w, t.w, t.d.k === 'security' ? COL.green : COL.blue, per, R, .25)); });
      return fromList(list, COL.blue);
    }
    function shapeAch() {
      layoutAch(); var m = meta.ach, R = rnd(71), list: number[][] = [], per = Math.floor(N / 10);
      m.aw.forEach(function (a: any) { list = list.concat(circPts(a.x, a.y, U * .07, COL.yellow, per, R, .5)); });
      m.pr.forEach(function (qq: any) { list = list.concat(rectPts(qq.x, qq.y, m.cw, m.ch, COL.blue, per, R, .2)); });
      return fromList(list, COL.blue);
    }
    function shapeOut() { return fromList(shuffle(textPts(d.name, nameWidth() * .7, COL.yellow, -.04 * U), 31), COL.yellow); }
    function build() { shapes = [shapeName(), shapeNet(), shapeMat(), shapeDom(), shapeAch(), shapeOut()]; }
    function size() {
      DPR = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; mobile = W <= 700;
      cv.width = W * DPR; cv.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0);
      FX = W / 2; FY = H * .5; U = mobile ? Math.min(W * .95, H * .6) : Math.min(W * .62, H * .8);
      build();
    }
    size(); addEventListener('resize', size);
    /* re-sample text particles once the real fonts are in (HANDOFF.md) */
    if ((document as any).fonts && (document as any).fonts.ready) (document as any).fonts.ready.then(function () { size(); });

    /* ===================== ICONS (original vector glyphs) ===================== */
    function icon(k: string, x: number, y: number, s: number, col: number[], a: number) {
      g.save(); g.translate(x, y); g.strokeStyle = rgba(col, a); g.fillStyle = rgba(col, a);
      g.lineWidth = Math.max(1.4, s * .1); g.lineCap = 'round'; g.lineJoin = 'round';
      if (k === 'cv') {
        g.beginPath(); g.moveTo(-s, 0); g.quadraticCurveTo(0, -s * .95, s, 0); g.quadraticCurveTo(0, s * .95, -s, 0); g.stroke();
        g.beginPath(); g.arc(0, 0, s * .34, 0, 6.283); g.stroke();
        g.beginPath(); g.arc(s * .08, -s * .08, s * .1, 0, 6.283); g.fill();
      } else if (k === 'llm') {
        rr(-s, -s * .8, s * 2, s * 1.35, s * .3); g.stroke();
        g.beginPath(); g.moveTo(-s * .45, s * .55); g.lineTo(-s * .6, s * 1.05); g.lineTo(0, s * .55); g.stroke();
        g.beginPath(); g.moveTo(0, -s * .5); g.lineTo(s * .12, -s * .18); g.lineTo(s * .45, -s * .1); g.lineTo(s * .12, 0); g.lineTo(0, s * .3); g.lineTo(-s * .12, 0); g.lineTo(-s * .45, -s * .1); g.lineTo(-s * .12, -s * .18); g.closePath(); g.fill();
      } else if (k === 'edge') {
        rr(-s * .6, -s * .6, s * 1.2, s * 1.2, s * .12); g.stroke(); rr(-s * .28, -s * .28, s * .56, s * .56, s * .06); g.fill();
        for (var i = -1; i <= 1; i++) {
          g.beginPath(); g.moveTo(i * s * .3, -s * .6); g.lineTo(i * s * .3, -s); g.moveTo(i * s * .3, s * .6); g.lineTo(i * s * .3, s);
          g.moveTo(-s * .6, i * s * .3); g.lineTo(-s, i * s * .3); g.moveTo(s * .6, i * s * .3); g.lineTo(s, i * s * .3); g.stroke();
        }
      } else if (k === 'backend') {
        [-.62, 0, .62].forEach(function (dd) {
          rr(-s, dd * s - s * .25, s * 2, s * .5, s * .1); g.stroke();
          g.beginPath(); g.arc(s * .68, dd * s, s * .08, 0, 6.283); g.fill();
          g.beginPath(); g.moveTo(-s * .7, dd * s); g.lineTo(s * .1, dd * s); g.stroke();
        });
      } else if (k === 'frontend') {
        rr(-s, -s * .78, s * 2, s * 1.56, s * .14); g.stroke();
        g.beginPath(); g.moveTo(-s, -s * .36); g.lineTo(s, -s * .36); g.stroke();
        [-.76, -.52, -.28].forEach(function (dd) { g.beginPath(); g.arc(dd * s, -s * .57, s * .06, 0, 6.283); g.fill(); });
        rr(-s * .72, -s * .1, s * .6, s * .6, s * .06); g.stroke();
        g.beginPath(); g.moveTo(s * .05, .02 * s); g.lineTo(s * .72, .02 * s); g.moveTo(s * .05, .28 * s); g.lineTo(s * .55, .28 * s); g.stroke();
      } else if (k === 'mlops') {
        /* monitoring gauge: 270° dial, tick marks, needle at ~70% */
        var cy = s * .18, r = s * .82;
        g.beginPath(); g.arc(0, cy, r, Math.PI * .78, Math.PI * 2.22); g.stroke();
        for (var ti = 0; ti <= 8; ti++) {
          var ta = Math.PI * .78 + ti / 8 * Math.PI * 1.44,
            tr1 = ti % 2 ? r * .82 : r * .72;
          g.beginPath(); g.moveTo(Math.cos(ta) * tr1, cy + Math.sin(ta) * tr1); g.lineTo(Math.cos(ta) * r, cy + Math.sin(ta) * r); g.stroke();
        }
        var na = Math.PI * .78 + .68 * Math.PI * 1.44;
        g.lineWidth = s * .14; g.beginPath(); g.moveTo(0, cy); g.lineTo(Math.cos(na) * r * .58, cy + Math.sin(na) * r * .58); g.stroke();
        g.beginPath(); g.arc(0, cy, s * .12, 0, 6.283); g.fill();
        g.lineWidth = s * .1;
      } else if (k === 'cicd') {
        /* continuous cycle: two opposed arcs with arrowheads */
        var r2 = s * .8;
        g.beginPath(); g.arc(0, 0, r2, .42, Math.PI - .42); g.stroke();
        g.beginPath(); g.arc(0, 0, r2, .42 + Math.PI, 2 * Math.PI - .42); g.stroke();
        var a1 = Math.PI - .42, x1 = Math.cos(a1) * r2, y1 = Math.sin(a1) * r2;
        g.lineWidth = s * .13;
        g.beginPath(); g.moveTo(x1 - s * .5 * Math.cos(a1 - 1.1), y1 - s * .5 * Math.sin(a1 - 1.1));
        g.lineTo(x1, y1); g.lineTo(x1 - s * .5 * Math.cos(a1 + 1.1), y1 - s * .5 * Math.sin(a1 + 1.1)); g.stroke();
        var a2 = 2 * Math.PI - .42, x2 = Math.cos(a2) * r2, y2 = Math.sin(a2) * r2;
        g.beginPath(); g.moveTo(x2 - s * .5 * Math.cos(a2 - 1.1), y2 - s * .5 * Math.sin(a2 - 1.1));
        g.lineTo(x2, y2); g.lineTo(x2 - s * .5 * Math.cos(a2 + 1.1), y2 - s * .5 * Math.sin(a2 + 1.1)); g.stroke();
        g.lineWidth = s * .1;
      } else if (k === 'security') {
        /* shield: symmetric, rounded bottom; single-stroke check */
        g.beginPath(); g.moveTo(-s * .68, -s * .5); g.lineTo(0, -s * .92); g.lineTo(s * .68, -s * .5);
        g.lineTo(s * .58, s * .12); g.quadraticCurveTo(s * .44, s * .74, 0, s * .96);
        g.quadraticCurveTo(-s * .44, s * .74, -s * .58, s * .12); g.closePath(); g.stroke();
        g.lineWidth = s * .17;
        g.beginPath(); g.moveTo(-s * .28, s * .02); g.lineTo(-s * .07, s * .26); g.lineTo(s * .36, -s * .3); g.stroke();
        g.lineWidth = s * .1;
      } else if (k === 'cloud') {
        g.beginPath(); g.arc(-s * .45, s * .2, s * .42, 1.6, 4.7); g.arc(s * .05, -s * .15, s * .5, 3.4, 6.0); g.arc(s * .55, s * .25, s * .38, 4.7, 1.6); g.closePath(); g.stroke();
      } else if (k === 'data') {
        g.beginPath(); g.moveTo(-s, -s * .9); g.lineTo(s, -s * .9); g.lineTo(s * .2, -s * .1); g.lineTo(s * .2, s * .5); g.lineTo(-s * .2, s * .7); g.lineTo(-s * .2, -s * .1); g.closePath(); g.stroke();
        g.beginPath(); g.ellipse(s * .65, s * .6, s * .32, s * .12, 0, 0, 6.283); g.stroke();
        g.beginPath(); g.moveTo(s * .33, s * .6); g.lineTo(s * .33, s * .95); g.moveTo(s * .97, s * .6); g.lineTo(s * .97, s * .95); g.stroke();
        g.beginPath(); g.ellipse(s * .65, s * .95, s * .32, s * .12, 0, 0, 3.14); g.stroke();
      } else if (k === 'trophy') {
        /* cup with handles, stem, base, star in the bowl */
        g.beginPath(); g.moveTo(-s * .58, -s * .88);
        g.quadraticCurveTo(-s * .58, s * .18, 0, s * .22); g.quadraticCurveTo(s * .58, s * .18, s * .58, -s * .88);
        g.lineTo(-s * .58, -s * .88); g.stroke();
        g.beginPath(); g.moveTo(-s * .58, -s * .78); g.quadraticCurveTo(-s * 1.08, -s * .7, -s * .5, -s * .18); g.stroke();
        g.beginPath(); g.moveTo(s * .58, -s * .78); g.quadraticCurveTo(s * 1.08, -s * .7, s * .5, -s * .18); g.stroke();
        g.fillRect(-s * .12, s * .22, s * .24, s * .24);
        rr(-s * .42, s * .5, s * .84, s * .18, s * .05); g.fill();
        /* five-point star, drawn as one closed path */
        g.beginPath();
        for (var pj = 0; pj < 10; pj++) {
          var pa = -Math.PI / 2 + pj * Math.PI / 5, pr = pj % 2 ? s * .17 : s * .36;
          var px = Math.cos(pa) * pr, py = -s * .32 + Math.sin(pa) * pr;
          pj ? g.lineTo(px, py) : g.moveTo(px, py);
        }
        g.closePath(); g.fill();
      } else if (k === 'medal') {
        /* ribbon V + outlined disc + star */
        g.fillStyle = rgba(COL.red, a);
        g.beginPath(); g.moveTo(-s * .5, -s * 1.05); g.lineTo(-s * .08, -s * 1.05); g.lineTo(-s * .3, -s * .2); g.lineTo(-s * .72, -s * .2); g.closePath(); g.fill();
        g.fillStyle = rgba(COL.blue, a);
        g.beginPath(); g.moveTo(s * .5, -s * 1.05); g.lineTo(s * .08, -s * 1.05); g.lineTo(s * .3, -s * .2); g.lineTo(s * .72, -s * .2); g.closePath(); g.fill();
        g.fillStyle = rgba(col, a);
        g.beginPath(); g.arc(0, s * .32, s * .62, 0, 6.283); g.fill();
        g.strokeStyle = rgba(COL.ink, a * .55); g.lineWidth = s * .07;
        g.beginPath(); g.arc(0, s * .32, s * .48, 0, 6.283); g.stroke();
        g.fillStyle = rgba(COL.ink, a * .9);
        g.beginPath();
        for (var mj = 0; mj < 10; mj++) {
          var ma = -Math.PI / 2 + mj * Math.PI / 5, mr = mj % 2 ? s * .12 : s * .26;
          g.lineTo(Math.cos(ma) * mr, s * .32 + Math.sin(ma) * mr);
        }
        g.closePath(); g.fill();
        g.lineWidth = s * .1;
      } else if (k === 'cert') {
        /* document + lines + scalloped seal with ribbon tails */
        rr(-s * .9, -s * .8, s * 1.5, s * 1.7, s * .08); g.stroke();
        [-.42, -.18, .06].forEach(function (dd) { g.beginPath(); g.moveTo(-s * .7, dd * s); g.lineTo(-s * .1, dd * s); g.stroke(); });
        var sx = s * .5, sy = s * .42, sr = s * .3;
        g.beginPath();
        for (var sj = 0; sj < 9; sj++) {
          var sa2 = sj / 9 * 6.283, sm = sa2 + Math.PI / 9;
          g.moveTo(sx + Math.cos(sa2) * sr, sy + Math.sin(sa2) * sr);
          g.arc(sx + Math.cos(sm) * sr * .82, sy + Math.sin(sm) * sr * .82, sr * .42, sm - 1.7, sm + 1.7);
        }
        g.stroke();
        g.beginPath(); g.moveTo(sx - s * .16, sy + sr); g.lineTo(sx - s * .28, sy + sr + s * .5); g.lineTo(sx, sy + sr + s * .34); g.lineTo(sx + s * .28, sy + sr + s * .5); g.lineTo(sx + s * .16, sy + sr); g.closePath(); g.stroke();
        g.beginPath(); g.arc(sx, sy, sr * .18, 0, 6.283); g.fill();
      } else if (k === 'repo') {
        g.beginPath(); g.moveTo(-s * .6, s * .9); g.lineTo(-s * .6, -s * .7); g.quadraticCurveTo(-s * .6, -s, -s * .3, -s); g.lineTo(s * .6, -s); g.lineTo(s * .6, s * .6);
        g.lineTo(-s * .3, s * .6); g.quadraticCurveTo(-s * .6, s * .6, -s * .6, s * .9); g.lineTo(s * .6, s * .9); g.stroke();
        g.beginPath(); g.moveTo(-s * .25, s * .6); g.lineTo(-s * .25, s); g.stroke();
      }
      g.restore();
    }

    /* ===================== CRISP DRAWINGS ===================== */
    var dustSeed = rnd(23), dust: any[] = [];
    for (var di = 0; di < 140; di++) dust.push({ x: dustSeed(), y: dustSeed(), r: .6 + dustSeed() * 1.6, v: .004 + dustSeed() * .01, ph: dustSeed() * 6.283, c: dustSeed() < .8 ? COL.blue : COL.yellow });
    function background(time: number) {
      g.fillStyle = '#0B0D18'; g.fillRect(0, 0, W, H);
      var g1x = W * (.25 + .08 * Math.sin(time * .13)) + mx * 40, g1y = H * (.3 + .08 * Math.cos(time * .11));
      var gr = g.createRadialGradient(g1x, g1y, 0, g1x, g1y, Math.max(W, H) * .6);
      gr.addColorStop(0, 'rgba(88,196,221,.13)'); gr.addColorStop(1, 'rgba(88,196,221,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      var g2x = W * (.8 - .07 * Math.sin(time * .09)) - mx * 40, g2y = H * (.85 - .06 * Math.cos(time * .15));
      var gr2 = g.createRadialGradient(g2x, g2y, 0, g2x, g2y, Math.max(W, H) * .55);
      gr2.addColorStop(0, 'rgba(255,210,74,.09)'); gr2.addColorStop(1, 'rgba(255,210,74,0)'); g.fillStyle = gr2; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(159,163,181,.09)';
      var st = 44, ox = ((time * 6 + mx * 12) % st + st) % st, oy = ((time * 4 + my * 12) % st + st) % st;
      for (var x = ox - st; x < W; x += st) for (var y = oy - st; y < H; y += st) { g.fillRect(x, y, 1.2, 1.2); }
      dust.forEach(function (dd) {
        var y = ((dd.y - time * dd.v) % 1 + 1) % 1, x = (dd.x + Math.sin(time * .3 + dd.ph) * .01 + mx * .02 * dd.r) % 1;
        var tw = .35 + .65 * Math.abs(Math.sin(time * 1.2 + dd.ph));
        g.fillStyle = rgba(dd.c, .12 + .3 * tw); g.beginPath(); g.arc(x * W, y * H, dd.r, 0, 6.283); g.fill();
      });
      var vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75);
      vg.addColorStop(0, 'rgba(11,13,24,0)'); vg.addColorStop(1, 'rgba(11,13,24,.75)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    }
    function drawName(a: number, frac: number, color: number[], yoff: number) {
      g.save(); g.translate(FX, FY + (yoff || 0));
      g.font = '600 150px "STIX Two Text", Georgia, serif';
      var sc = frac / g.measureText(d.name).width; g.scale(sc, sc);
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(color, a); g.fillText(d.name, 0, 0); g.restore();
    }
    var chipSeed = rnd(9), chips = d.CHIPS.map(function (t) {
      return { t: t, x: chipSeed(), y: chipSeed(), z: .3 + chipSeed() * .7, vx: (chipSeed() - .5) * .012, vy: (chipSeed() - .5) * .012, ph: chipSeed() * 6.283 };
    });
    function drawChips(a: number, time: number) {
      chips.forEach(function (c) {
        var x = ((c.x + c.vx * time) % 1 + 1) % 1, y = ((c.y + c.vy * time) % 1 + 1) % 1,
          px = x * W + mx * 60 * c.z, py = y * H + my * 40 * c.z + Math.sin(time * .8 + c.ph) * 8;
        mono(11 + c.z * 4, 500);
        var tw = g.measureText(c.t).width + 26, th = 24 + c.z * 6, al = a * (.18 + .3 * c.z);
        g.fillStyle = rgba(COL.ink, al * 2); rr(px - tw / 2, py - th / 2, tw, th, th / 2); g.fill();
        g.strokeStyle = rgba(COL.blue, al); g.lineWidth = 1; rr(px - tw / 2, py - th / 2, tw, th, th / 2); g.stroke();
        g.fillStyle = rgba(COL.blue, al * 1.3); g.beginPath(); g.arc(px - tw / 2 + 12, py, 3, 0, 6.283); g.fill();
        g.fillStyle = rgba(COL.white, al * 1.6); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(c.t, px - tw / 2 + 20, py);
      });
    }
    function drawHero(a: number, time: number) {
      drawChips(a, time);
      var nw = nameWidth();
      g.fillStyle = rgba(COL.ink, a * .55); rr(FX - nw * .6, FY - nw * .17, nw * 1.2, nw * .34, 20); g.fill();
      drawName(a, nw, COL.white, 0);
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = rgba(COL.blue, a); mono(Math.max(11, nw * .013), 500); g.fillText(d.hero.role, FX, FY - nw * .11);
      g.fillStyle = rgba(COL.grey, a); serif(Math.max(14, nw * .021)); g.fillText(d.hero.tagline, FX, FY + nw * .1);
    }
    function drawCaption(a: number, c: [string, string] | null) {
      if (!c) return;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = rgba(COL.white, a); serif(Math.max(16, U * .036), 600); g.fillText(c[0], FX, H - (mobile ? 110 : 64));
      g.fillStyle = rgba(COL.grey, a); mono(Math.max(10, U * .017)); g.fillText(c[1], FX, H - (mobile ? 88 : 40));
    }
    function drawNet(a: number, time: number) {
      var m = meta.net; g.lineCap = 'round';
      m.all.forEach(function (e: any) { g.strokeStyle = rgba(COL.grey, a * .07); g.lineWidth = .6; g.beginPath(); g.moveTo(FX + e.a.x, FY + e.a.y); g.lineTo(FX + e.b.x, FY + e.b.y); g.stroke(); });
      m.real.forEach(function (e: any) { g.strokeStyle = rgba(COL.blue, a * .55); g.lineWidth = 1.3; g.beginPath(); g.moveTo(FX + e.a.x, FY + e.a.y); g.lineTo(FX + e.b.x, FY + e.b.y); g.stroke(); });
      m.real.forEach(function (e: any, i: number) {
        var t = (time * .25 + i * .113) % 1;
        g.fillStyle = rgba(COL.yellow, a * .9); g.beginPath();
        g.arc(FX + e.a.x + (e.b.x - e.a.x) * t, FY + e.a.y + (e.b.y - e.a.y) * t, 2.2, 0, 6.283); g.fill();
      });
      m.nodes.forEach(function (n: any) {
        var res = n.l === 3, pulse = .9 + .1 * Math.sin(time * 2 + n.i + n.l);
        g.fillStyle = res ? rgba(COL.yellow, a * pulse) : rgba(COL.white, a * pulse);
        g.beginPath(); g.arc(FX + n.x, FY + n.y, m.r, 0, 6.283); g.fill();
        g.strokeStyle = rgba(COL.ink, a); g.lineWidth = 2; g.stroke();
        var sideW = Math.max(60, (W - U * 1.05) / 2 - m.r - 16);
        fitMono(n.name, sideW, Math.max(10, U * .018), res ? 500 : 400, 8); g.textBaseline = 'middle';
        if (n.l === 0) { g.textAlign = 'right'; g.fillStyle = rgba(COL.white, a); g.fillText(n.name, FX + n.x - m.r - 8, FY + n.y); }
        else if (res) { g.textAlign = 'left'; g.fillStyle = rgba(COL.yellow, a); g.fillText(n.name, FX + n.x + m.r + 8, FY + n.y); }
        else {
          g.textAlign = 'center'; var tw = g.measureText(n.name).width + 10, ly = FY + n.y + m.r + 11;
          g.fillStyle = rgba(COL.ink, a * .9); rr(FX + n.x - tw / 2, ly - 8, tw, 16, 4); g.fill();
          g.fillStyle = rgba(COL.grey, a); g.fillText(n.name, FX + n.x, ly);
        }
      });
      d.netLabels.forEach(function (s, l) {
        g.fillStyle = rgba(COL.grey, a); serif(U * .036, 400, true); g.textAlign = 'center';
        g.fillText(s, FX + m.lx[l] * U * 1.05, FY - .5 * U);
      });
    }
    function drawMat(a: number, time: number) {
      var m = meta.mat, row = Math.floor(time * .7) % 4, L = FX + m.left;
      m.cells.forEach(function (c: any) {
        var x = FX + c.x - m.cellW / 2, y = FY + c.y - m.cellH / 2;
        g.fillStyle = c.t ? rgba(COL.blue, a * (c.r === row ? .32 : .16)) : rgba(COL.white, a * .025);
        rr(x, y, m.cellW, m.cellH, 5); g.fill();
        g.strokeStyle = rgba(c.t ? COL.blue : COL.grey, a * (c.t ? .6 : .15)); g.lineWidth = 1; rr(x, y, m.cellW, m.cellH, 5); g.stroke();
        if (c.t) { g.fillStyle = rgba(COL.white, a); fitMono(c.t, m.cellW - 10, Math.min(m.cellH * .3, m.cellW * .11), 500, 8); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(c.t, FX + c.x, FY + c.y); }
        else { g.fillStyle = rgba(COL.grey, a * .35); mono(m.cellH * .26); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('·', FX + c.x, FY + c.y); }
      });
      d.MAT.rows.forEach(function (r, i) {
        var y = FY + m.y0 + i * (m.cellH + m.gap) + m.cellH / 2;
        g.textAlign = 'right'; g.textBaseline = 'middle';
        g.fillStyle = rgba(i === row ? COL.yellow : COL.white, a);
        fitMono(r, m.rowW - 16, Math.min(m.cellH * .28, m.rowW * .1), i === row ? 700 : 500, 8);
        g.fillText(r, L + m.rowW - 8, y - m.cellH * .16);
        g.fillStyle = rgba(COL.grey, a);
        fitMono(d.MAT.years[i], m.rowW - 16, Math.min(m.cellH * .24, m.rowW * .085), 400, 8);
        g.fillText(d.MAT.years[i], L + m.rowW - 8, y + m.cellH * .2);
      });
      d.MAT.cols.forEach(function (c, i) {
        var x = FX + m.x0 + i * (m.cellW + m.gap) + m.cellW / 2, top = FY + m.y0, bob = Math.sin(time * 1.8 + i) * m.cellH * .04;
        icon(d.MAT.icons[i], x, top - m.cellH * .62 + bob, Math.min(m.cellH * .22, m.cellW * .1), COL.white, a);
        g.fillStyle = rgba(COL.grey, a);
        fitMono(c, m.cellW + m.gap - 6, Math.min(m.cellH * .24, m.cellW * .095), 400, 8);
        g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(c, x, top - m.cellH * 1.05);
      });
      for (var i = 0; i < 4; i++) {
        var y = FY + m.y0 + i * (m.cellH + m.gap), hot = i === row;
        g.fillStyle = rgba(COL.yellow, a * (hot ? .3 : .12)); rr(FX + m.outX - m.outW / 2, y, m.outW, m.cellH, 5); g.fill();
        g.strokeStyle = rgba(COL.yellow, a * .7); rr(FX + m.outX - m.outW / 2, y, m.outW, m.cellH, 5); g.stroke();
        g.fillStyle = rgba(hot ? COL.white : COL.yellow, a);
        fitMono(d.MAT.out[i], m.outW - 10, Math.min(m.cellH * .27, m.outW * .085), 500, 8);
        g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(d.MAT.out[i], FX + m.outX, y + m.cellH / 2);
      }
      var ry = FY + m.y0 + row * (m.cellH + m.gap);
      g.strokeStyle = rgba(COL.yellow, a * .9); g.lineWidth = 1.5;
      rr(FX + m.x0 - 4, ry - 4, 6 * (m.cellW + m.gap) - m.gap + 8, m.cellH + 8, 7); g.stroke();
      var arrowX = FX + m.outX - m.outW / 2 - 14, k = (time * .7) % 1;
      g.fillStyle = rgba(COL.yellow, a); g.beginPath();
      g.arc(FX + m.x0 + (6 * (m.cellW + m.gap) - m.gap) * k, ry + m.cellH / 2, 3.5, 0, 6.283); g.fill();
      g.strokeStyle = rgba(COL.yellow, a); g.beginPath();
      g.moveTo(arrowX - 8, ry + m.cellH / 2); g.lineTo(arrowX - 1, ry + m.cellH / 2);
      g.moveTo(arrowX - 5, ry + m.cellH / 2 - 4); g.lineTo(arrowX - 1, ry + m.cellH / 2); g.lineTo(arrowX - 5, ry + m.cellH / 2 + 4); g.stroke();
      g.fillStyle = rgba(COL.yellow, a); serif(U * .05, 400, true); g.textAlign = 'left'; g.textBaseline = 'middle';
      g.fillText(d.matNote.w, L + 8, FY + m.y0 - m.cellH * .85);
      g.fillStyle = rgba(COL.grey, a); serif(U * .03, 400, true);
      g.fillText(d.matNote.mid, L + 8 + U * .04, FY + m.y0 - m.cellH * .85);
      g.fillStyle = rgba(COL.yellow, a); serif(U * .03, 400, true); g.textAlign = 'center';
      g.fillText(d.matNote.out, FX + m.outX, FY + m.y0 - m.cellH * .85);
    }
    function drawDom(a: number, time: number) {
      var sweep = (time * .18) % 1;
      meta.dom.tiles.forEach(function (t: any, i: number) {
        var col = t.d.k === 'security' ? COL.green : COL.blue, bob = Math.sin(time * 1.6 + i * .9) * t.w * .02,
          x = FX + t.x - t.w / 2, y = FY + t.y - t.w / 2 + bob;
        var lit = 1 - Math.min(1, Math.abs((i % 5) / 5 - sweep) * 4);
        g.fillStyle = rgba(col, a * (.07 + .08 * lit)); rr(x, y, t.w, t.w, 10); g.fill();
        g.strokeStyle = rgba(col, a * (.6 + .4 * lit)); g.lineWidth = 1.2; rr(x, y, t.w, t.w, 10); g.stroke();
        var ring = g.createRadialGradient(FX + t.x, y + t.w * .36, 0, FX + t.x, y + t.w * .36, t.w * .3);
        ring.addColorStop(0, rgba(col, a * (.12 + .1 * Math.sin(time * 2 + i)))); ring.addColorStop(1, rgba(col, 0));
        g.fillStyle = ring; g.fillRect(x, y, t.w, t.w * .7);
        icon(t.d.k, FX + t.x, y + t.w * .36, t.w * .17 * (1 + .04 * Math.sin(time * 2.2 + i)), col, a);
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillStyle = rgba(COL.white, a); fitSerif(t.d.t, t.w - 14, t.w * .12, 600, 10); g.fillText(t.d.t, FX + t.x, y + t.w * .7);
        g.fillStyle = rgba(COL.grey, a); fitMono(t.d.s, t.w - 14, t.w * .068, 400, 8); g.fillText(t.d.s, FX + t.x, y + t.w * .84);
      });
    }
    function drawAch(a: number, time: number) {
      var m = meta.ach; g.textAlign = 'center'; g.textBaseline = 'middle';
      m.aw.forEach(function (w: any, i: number) {
        var pulse = 1 + .04 * Math.sin(time * 2 + i), bob = Math.sin(time * 1.4 + i * 1.1) * U * .008;
        g.save(); g.translate(FX + w.x, FY + w.y + bob); g.rotate(Math.sin(time * .9 + i) * .06);
        var halo = g.createRadialGradient(0, 0, 0, 0, 0, U * .11);
        halo.addColorStop(0, rgba(COL.yellow, a * (.14 + .08 * Math.sin(time * 2 + i)))); halo.addColorStop(1, rgba(COL.yellow, 0));
        g.fillStyle = halo; g.fillRect(-U * .11, -U * .11, U * .22, U * .22);
        icon(w.a.k, 0, 0, U * .055 * pulse, COL.yellow, a); g.restore();
        g.fillStyle = rgba(COL.white, a); fitSerif(w.a.t, U * .2, Math.max(13, U * .028), 600, 10); g.fillText(w.a.t, FX + w.x, FY + w.y + U * .1);
        g.fillStyle = rgba(COL.grey, a); fitMono(w.a.s, U * .2, Math.max(9, U * .015), 400, 8); g.fillText(w.a.s, FX + w.x, FY + w.y + U * .128);
      });
      m.pr.forEach(function (qq: any) {
        var x = FX + qq.x - m.cw / 2, y = FY + qq.y - m.ch / 2, pad = m.cw * .05;
        g.fillStyle = rgba([13, 17, 23], a * .9); rr(x, y, m.cw, m.ch, 8); g.fill();
        g.strokeStyle = rgba([48, 54, 61], a); g.lineWidth = 1; rr(x, y, m.cw, m.ch, 8); g.stroke();
        icon('repo', x + pad + 6, y + pad + 8, 6, COL.grey, a);
        g.textAlign = 'left'; g.fillStyle = rgba(COL.blue, a);
        fitMono(qq.p.t, m.cw - pad * 2 - 80, Math.max(10, m.cw * .05), 700, 8); g.fillText(qq.p.t, x + pad + 18, y + pad + 8);
        var nw = g.measureText(qq.p.t).width;
        g.strokeStyle = rgba([48, 54, 61], a); mono(Math.max(8, m.cw * .034));
        var pw = g.measureText('Public').width + 12; rr(x + pad + 24 + nw, y + pad, pw, 16, 8); g.stroke();
        g.fillStyle = rgba(COL.grey, a); g.fillText('Public', x + pad + 30 + nw, y + pad + 8);
        g.fillStyle = rgba(COL.grey, a); mono(Math.max(9, m.cw * .04)); g.fillText(qq.p.s, x + pad, y + m.ch * .5, m.cw - pad * 2);
        g.fillStyle = qq.p.c; g.beginPath(); g.arc(x + pad + 5, y + m.ch - pad - 6, 5, 0, 6.283); g.fill();
        g.fillStyle = rgba(COL.grey, a); g.fillText(qq.p.l, x + pad + 16, y + m.ch - pad - 6);
        if (qq.p.st) { var lw = g.measureText(qq.p.l).width; g.fillStyle = rgba(COL.yellow, a); g.fillText('★ ' + qq.p.st, x + pad + 30 + lw, y + m.ch - pad - 6); }
        g.textAlign = 'center';
      });
      g.fillStyle = rgba(COL.grey, a); mono(Math.max(10, U * .017));
      g.fillText(d.githubLine, FX, FY + m.pr[3].y + m.ch / 2 + U * .05);
    }
    function drawOut(a: number) {
      drawName(a, nameWidth() * .7, COL.yellow, -.04 * U);
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = rgba(COL.grey, a); serif(U * .045, 400, true); g.fillText('ŷ  =', FX - nameWidth() * .47, FY - .04 * U);
      mono(Math.max(11, U * .02)); g.fillText(d.outLine, FX, FY + .09 * U);
    }
    var draws = [drawHero, drawNet, drawMat, drawDom, drawAch, drawOut];

    /* ===================== SCROLL + AUTOPLAY ===================== */
    var p = 0, pT = 0, mx = 0, my = 0, auto = !reduce, autoP = 0, lastT: number | null = null, HOLD = 6, MORPH = 2.8;
    var doc = document.documentElement;
    /* Progress is measured against the TRACK, not the whole document — the
       classic sections below the story must not advance it. */
    function trackEnd() {
      var top = track.getBoundingClientRect().top + doc.scrollTop;
      return Math.max(1, top + track.offsetHeight - innerHeight);
    }
    function pastStory() { return doc.scrollTop > trackEnd() + 4; }
    addEventListener('scroll', function () { if (!scrollingByCode) { pT = clamp(doc.scrollTop / trackEnd(), 0, 1); } }, { passive: true });
    var scrollingByCode = false;
    function setP(v: number) {
      pT = clamp(v, 0, 1); autoP = pT; scrollingByCode = true;
      doc.scrollTop = pT * trackEnd();
      requestAnimationFrame(function () { scrollingByCode = false; });
    }
    function pause() {
      auto = false; play.textContent = '▶'; play.setAttribute('aria-label', 'Play');
      play.setAttribute('aria-pressed', 'false'); hz.textContent = d.hud.manual;
    }
    function resume() {
      auto = true; autoP = pT; play.textContent = '❚❚'; play.setAttribute('aria-label', 'Pause');
      play.setAttribute('aria-pressed', 'true'); hz.textContent = d.hud.auto;
    }
    addEventListener('wheel', function () { if (auto) pause(); }, { passive: true });
    addEventListener('touchmove', function () { if (auto) pause(); }, { passive: true });
    addEventListener('keydown', function (e) { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].indexOf(e.key) >= 0 && auto) pause(); });
    addEventListener('pointermove', function (e) { mx = e.clientX / W - .5; my = e.clientY / H - .5; }, { passive: true });
    var play = q('#play'), dots = q('#dots'), dotBtns: HTMLElement[] = [];
    for (var dsc = 0; dsc < SCENES; dsc++) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Go to ' + names[dsc]); b.innerHTML = '<i></i>'; b.dataset.i = String(dsc);
      b.addEventListener('click', function (this: HTMLElement) { pause(); setP(+this.dataset.i / (SCENES - 1)); });
      dots.appendChild(b); dotBtns.push(b);
    }
    play.addEventListener('click', function () { auto ? pause() : resume(); });
    q('#prev').addEventListener('click', function () { pause(); var i = Math.round(pT * (SCENES - 1)); setP(Math.max(0, i - 1) / (SCENES - 1)); });
    q('#next').addEventListener('click', function () { pause(); var i = Math.round(pT * (SCENES - 1)); setP(Math.min(SCENES - 1, i + 1) / (SCENES - 1)); });
    function stepAuto(dt: number) {
      var seg = 1 / (SCENES - 1), s = autoP * (SCENES - 1), i = Math.floor(s + 1e-6), tt = s - i;
      if (i >= SCENES - 1) { holdT += dt; if (holdT > HOLD) { holdT = 0; p = 0; pT = 0; setP(0); } return; }
      if (tt < .3) { holdT += dt; if (holdT >= HOLD) { holdT = 0; autoP = (i + .3001) * seg; } }
      else { autoP += dt / MORPH * .7 * seg; if (autoP >= (i + 1) * seg) { autoP = (i + 1) * seg; } }
      setP(autoP);
    }
    var holdT = 0;
    hz.textContent = auto ? d.hud.auto : d.hud.manual;
    dispatchEvent(new Event('scroll'));

    /* ===================== FRAME ===================== */
    var t0 = performance.now();
    function frame(t: number) {
      requestAnimationFrame(frame);
      var time = (t - t0) / 1000, dt = lastT ? Math.min(.1, (t - lastT) / 1000) : 0; lastT = t;
      if (auto) stepAuto(dt);
      p += (pT - p) * (reduce ? 1 : .09);
      var s = p * (SCENES - 1), i = clamp(Math.floor(s), 0, SCENES - 2), tt = s - i;
      if (p >= .999) { i = SCENES - 2; tt = 1; }
      var k = sm((tt - .42) / .5), A = shapes[i], B = shapes[i + 1],
        hold = 1 - sm((tt - .3) / .22), nextHold = sm((tt - .88) / .12);
      /* Past the story: the classic sections own the screen — stop painting and
         fade the HUD/controls so nothing floats over the sections. */
      var past = pastStory();
      root.classList.toggle('mm-past', past);
      if (!past) {
        background(time);
        if (i > 0 || tt > .3) drawChips(.3, time);
        var pa = 1 - Math.max(hold, nextHold);
        if (pa > .01) {
          var par = mx * 12, pary = my * 8, dotR = 1.5 + Math.sin(Math.PI * k) * .7;
          for (var n = 0; n < N; n++) {
            var kk = sm(k * 1.3 - (n / N) * .3), o = n * 2, c = n * 3, arc = Math.sin(Math.PI * kk) * .16 * U;
            var x = A.p[o] + (B.p[o] - A.p[o]) * kk + off[o] * arc,
              y = A.p[o + 1] + (B.p[o + 1] - A.p[o + 1]) * kk + off[o + 1] * arc,
              depth = off[o] * .5 + .5;
            g.fillStyle = 'rgba(' + ((A.c[c] + (B.c[c] - A.c[c]) * kk) | 0) + ',' + ((A.c[c + 1] + (B.c[c + 1] - A.c[c + 1]) * kk) | 0) + ',' + ((A.c[c + 2] + (B.c[c + 2] - A.c[c + 2]) * kk) | 0) + ',' + (pa * (.55 + .45 * depth)) + ')';
            g.beginPath(); g.arc(FX + x + par * (depth - .5), FY + y + pary * (depth - .5), dotR * (.7 + depth * .6), 0, 6.283); g.fill();
          }
        }
        if (hold > .01) { draws[i](hold, time); drawCaption(hold, caps[i]); }
        if (nextHold > .01) { draws[i + 1](nextHold, time); drawCaption(nextHold, caps[i + 1]); }
      }
      var sc = tt > .7 ? i + 1 : i;
      hl.textContent = names[sc];
      dotBtns.forEach(function (bt, j) { bt.classList.toggle('on', j === sc); });
      contact.classList.toggle('on', sc === SCENES - 1 && nextHold + hold > .5 && !past);
      bar.style.width = (p * 100) + '%';
      hint.style.opacity = (p > .02 || auto || past) ? '0' : '1';
    }
    requestAnimationFrame(frame);
    var copyBtn = q('#copy');
    copyBtn.addEventListener('click', function (this: HTMLElement) {
      var b = this, t2 = q('#email').textContent;
      function done() { b.textContent = 'copied'; setTimeout(function () { b.textContent = 'copy'; }, 1500); }
      if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(t2).then(done, function () {
          var sel = getSelection()!, r = document.createRange();
          r.selectNodeContents(q('#email')); sel.removeAllRanges(); sel.addRange(r);
        });
    });
  })();
}
