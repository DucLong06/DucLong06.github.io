/**
 * layout-compact.ts — portrait 400×700 stage for phones and narrow tablets.
 * Same scenes, re-flowed vertically: tokens stack, the matrix keeps its three
 * columns with the stack cells stacked inside W, the network becomes rows of
 * nodes with zig-zag labels, and the chip feeds a central bus with modules on
 * both sides. Font sizes for this layout live in GuardrailStory.astro
 * (`.gs--compact` rules); positions live here.
 */
import { box, makePin, routeTrace, type Box, type StoryLayout, type Trace, type Pin, type Pt } from './layout-types';

const W = 400;
const H = 700;

function guardrail() {
  const words: Box[] = [];
  const hex: Box[] = [];
  const token: Box[] = [];
  for (let i = 0; i < 3; i++) {
    const y = 128 + 124 * i;
    words.push(box(50, y, 300, 80));
    hex.push(box(50, y + 86, 300, 16));
    token.push(box(50, y + 102, 300, 16));
  }
  return {
    frame: box(30, 112, 340, 396),
    arm: 22,
    rails: [
      [[8, 310], [30, 310]],
      [[392, 310], [370, 310]],
    ] as [Pt, Pt][],
    words,
    connectors: [] as [Pt, Pt][],
    wordFont: 56,
    scanMs: 1200,
    role: box(16, 40, 368, 34),
    request: box(30, 88, 340, 16),
    hex,
    token,
    checks: box(12, 522, 376, 70),
    tagline: box(24, 600, 352, 80),
  };
}

function matrix() {
  // Three narrow columns: x (systems) · W (stack, 3 cells stacked) · ŷ (results)
  const colX = [12, 146, 268];
  const colW = [120, 108, 120];
  const sys: Box[] = [];
  const cells: Box[][] = [];
  const res: Box[] = [];
  const rows: number[] = [];
  for (let i = 0; i < 5; i++) {
    const y = 124 + 86 * i;
    sys.push(box(colX[0], y, colW[0], 86));
    cells.push([0, 1, 2].map((j) => box(colX[1], y + 14 + 19 * j, colW[1], 18)));
    res.push(box(colX[2], y, colW[2], 86));
    if (i > 0) rows.push(y);
  }
  const bracket = (c: number, yellow: boolean) => ({ x0: colX[c], x1: colX[c] + colW[c], y0: 116, y1: 560, yellow, rows });
  return {
    title: box(12, 40, 376, 32),
    heads: [box(colX[0], 94, colW[0], 18), box(colX[1], 94, colW[1], 18), box(colX[2], 94, colW[2], 18)],
    sys,
    cells,
    res,
    brackets: [bracket(0, false), bracket(1, false), bracket(2, true)],
    dividers: [] as [Pt, Pt][],
    dot: [139, 338] as Pt,
    eq: [261, 338] as Pt,
    markSize: 4,
  };
}

function network() {
  const l0x = [70, 157, 243, 330];
  const l1x = [48, 124, 200, 276, 352];
  const clampX = (cx: number, w: number) => Math.max(4, Math.min(W - 4 - w, cx - w / 2));
  const zig = (xs: number[], y: number, w: number) =>
    xs.map((x, i) => box(clampX(x, w), i % 2 === 0 ? y - 34 : y + 16, w, 18));
  return {
    title: box(12, 40, 376, 32),
    heads: [box(12, 96, 200, 18), box(12, 218, 200, 18), box(12, 348, 200, 18), box(12, 498, 200, 18)],
    l0: l0x.map((x) => [x, 160] as Pt),
    l1: l1x.map((x) => [x, 290] as Pt),
    l2: l1x.map((x) => [x, 420] as Pt),
    out: [200, 560] as Pt,
    r: 10,
    rOut: 16,
    langLabels: l0x.map((x) => box(clampX(x, 92), 128, 92, 18)),
    buildLabels: zig(l1x, 290, 124),
    shipLabels: zig(l1x, 420, 124),
    outLabel: box(90, 586, 220, 18),
  };
}

function chip() {
  // Chip sits under the title; its bottom pins merge into a bus bar and one
  // bus runs down the centre gutter with a short stub into every module.
  const left: Box[] = [];
  const right: Box[] = [];
  const traces: Trace[] = [];
  const busX = 200;
  const chipY = 124;
  const chipBottom = chipY + 120;
  const barY = chipBottom + 24;
  for (let i = 0; i < 3; i++) {
    const y = barY + 32 + 124 * i;
    left.push(box(12, y, 172, 84));
    right.push(box(216, y, 172, 84));
    traces.push(routeTrace(busX, y + 42, 184, y + 42, busX, true));
    traces.push(routeTrace(busX, y + 42, 216, y + 42, busX, false));
  }
  const tx = [152, 184, 216, 248];
  traces.push({ pts: [[tx[0], chipBottom], [tx[0], barY], [tx[3], barY], [tx[3], chipBottom]], yellow: false });
  traces.push({ pts: [[tx[1], chipBottom], [tx[1], barY]], yellow: false });
  traces.push({ pts: [[tx[2], chipBottom], [tx[2], barY]], yellow: false });
  traces.push({ pts: [[busX, barY], [busX, barY + 32 + 124 * 2 + 42]], yellow: false });
  const pins: Pin[] = tx.map((x, i) => makePin(x, chipY, -1, i < 2 ? -14 : 14, 16, 12));
  return {
    title: box(12, 40, 376, 32),
    chip: box(120, chipY, 160, 120),
    inner: box(132, chipY + 12, 136, 96),
    dot: [142, chipY + 22] as Pt,
    left,
    right,
    core: box(120, chipY, 160, 120),
    traces,
    pins,
  };
}

export function compactLayout(): StoryLayout {
  return { W, H, compact: true, s0: guardrail(), s1: matrix(), s2: network(), s3: chip() };
}
