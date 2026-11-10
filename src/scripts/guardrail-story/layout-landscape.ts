/**
 * layout-landscape.ts — the original 1280×720 stage, numbers verbatim from
 * guardrail-story/index.html. Used whenever the viewport is wide enough.
 */
import { box, makePin, routeTrace, type Box, type StoryLayout, type Trace, type Pin } from './layout-types';

const W = 1280;
const H = 720;

function guardrail() {
  const words: Box[] = [];
  const hex: Box[] = [];
  const token: Box[] = [];
  for (let i = 0; i < 3; i++) {
    words.push(box(170 + 320 * i, 250, 300, 140));
    hex.push(box(170 + 320 * i, 420, 300, 18));
    token.push(box(170 + 320 * i, 446, 300, 18));
  }
  return {
    frame: box(150, 232, 980, 176),
    arm: 30,
    rails: [
      [[40, 320], [150, 320]],
      [[1240, 320], [1130, 320]],
    ] as [[number, number], [number, number]][],
    words,
    connectors: [
      [[470, 320], [490, 320]],
      [[790, 320], [810, 320]],
    ] as [[number, number], [number, number]][],
    wordFont: 84,
    scanMs: 1200,
    role: box(0, 186, W, 18),
    request: box(150, 208, 420, 18),
    hex,
    token,
    checks: box(0, 490, W, 34),
    tagline: box(240, 556, 800, 64),
  };
}

function matrix() {
  const sys: Box[] = [];
  const cells: Box[][] = [];
  const res: Box[] = [];
  for (let i = 0; i < 5; i++) {
    const y = 200 + 80 * i;
    sys.push(box(120, y, 280, 80));
    cells.push([0, 1, 2].map((j) => box(470 + 120 * j, y, 120, 80)));
    res.push(box(900, y, 260, 80));
  }
  const rows = [280, 360, 440, 520];
  return {
    title: box(120, 60, 1000, 44),
    heads: [box(120, 150, 280, 26), box(470, 150, 360, 26), box(900, 150, 260, 26)],
    sys,
    cells,
    res,
    brackets: [
      { x0: 120, x1: 400, y0: 190, y1: 610, yellow: false, rows },
      { x0: 470, x1: 830, y0: 190, y1: 610, yellow: false, rows },
      { x0: 900, x1: 1160, y0: 190, y1: 610, yellow: true, rows },
    ],
    dividers: [
      [[590, 204], [590, 596]],
      [[710, 204], [710, 596]],
    ] as [[number, number], [number, number]][],
    dot: [435, 400] as [number, number],
    eq: [865, 400] as [number, number],
    markSize: 8,
  };
}

function network() {
  const L0 = [285, 375, 465, 555];
  const L1 = [240, 330, 420, 510, 600];
  return {
    title: box(120, 60, 1000, 44),
    heads: [box(180, 150, 160, 26), box(460, 150, 160, 26), box(740, 150, 160, 26), box(1000, 150, 160, 26)],
    l0: L0.map((y) => [260, y] as [number, number]),
    l1: L1.map((y) => [540, y] as [number, number]),
    l2: L1.map((y) => [820, y] as [number, number]),
    out: [1080, 420] as [number, number],
    r: 12,
    rOut: 20,
    langLabels: L0.map((y) => box(90, y - 10, 144, 20)),
    buildLabels: L1.map((y) => box(440, y - 43, 200, 22)),
    shipLabels: L1.map((y) => box(720, y - 43, 200, 22)),
    outLabel: box(970, 452, 220, 22),
  };
}

function chip() {
  const left: Box[] = [];
  const right: Box[] = [];
  for (let i = 0; i < 3; i++) {
    left.push(box(120, 180 + 152 * i, 280, 96));
    right.push(box(880, 180 + 152 * i, 280, 96));
  }
  // Two traces per module (offset ±8) into pins at y 340/380/420 — demo routing.
  const my = [228, 380, 532];
  const py = [340, 380, 420];
  const off = [-8, 8];
  const traces: Trace[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const o = off[j];
      const s2 = py[i] > my[i] ? 1 : py[i] < my[i] ? -1 : 0;
      const po = s2 === 0 ? o : o * 0.6;
      traces.push(routeTrace(400, my[i] + o, 540, py[i] + po, 470 - s2 * o, true));
      traces.push(routeTrace(880, my[i] + o, 740, py[i] + po, 810 + s2 * o, false));
    }
  }
  const pins: Pin[] = [];
  [580, 620, 660, 700].forEach((tx, i) => {
    const dx = i < 2 ? -18 : 18;
    pins.push(makePin(tx, 290, -1, dx));
    pins.push(makePin(tx, 470, 1, dx));
  });
  return {
    title: box(120, 60, 1000, 44),
    chip: box(540, 290, 200, 180),
    inner: box(554, 304, 172, 152),
    dot: [566, 316] as [number, number],
    left,
    right,
    core: box(540, 290, 200, 180),
    traces,
    pins,
  };
}

export function landscapeLayout(): StoryLayout {
  return { W, H, compact: false, s0: guardrail(), s1: matrix(), s2: network(), s3: chip() };
}
