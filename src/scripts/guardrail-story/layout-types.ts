/**
 * layout-types.ts — shared geometry vocabulary for the Guardrail Story.
 *
 * Every scene is described ONCE as a `StoryLayout` (boxes + points in stage
 * units). Both the canvas geometry (`geometry-*.ts`) and the DOM text layer
 * (`dom-layer.ts`) read from the same object, so lines and words can never
 * drift apart. Two layouts exist: landscape 1280×720 (the original demo) and
 * compact 400×700 for phones — see layout-landscape.ts / layout-compact.ts.
 */

export type Pt = [number, number];

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const box = (x: number, y: number, w: number, h: number): Box => ({ x, y, w, h });
export const midX = (b: Box): number => b.x + b.w / 2;
export const midY = (b: Box): number => b.y + b.h / 2;

/** A routed PCB-style trace between two points, with a dot at each end. */
export interface Trace {
  pts: Pt[];
  yellow: boolean;
}

/** A chip pin: short bent line from the chip edge to a dot. */
export interface Pin {
  line: Pt[];
  dot: Pt;
}

/** Scene 0 — the name as an inspected request. */
export interface GuardrailSceneLayout {
  frame: Box;            // yellow corner-bracket frame around the request
  arm: number;           // corner arm length
  rails: [Pt, Pt][];     // yellow rails; the first point carries a dot
  words: Box[];          // one blue rectangle per name token
  connectors: [Pt, Pt][];// short links between token boxes
  wordFont: number;      // px used for glyph sampling + DOM
  scanMs: number;        // beam sweep duration
  role: Box;
  request: Box;
  hex: Box[];
  token: Box[];
  checks: Box;
  tagline: Box;
}

/** Scene 1 — work history as x · W = ŷ. */
export interface MatrixBracket {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  yellow: boolean;
  rows: number[];        // y of thin row separators inside the bracket
}

export interface MatrixSceneLayout {
  title: Box;
  heads: Box[];          // x · W · ŷ column heads
  sys: Box[];            // system name + company, one per row
  cells: Box[][];        // [row][3] stack cells
  res: Box[];            // result per row
  brackets: MatrixBracket[];
  dividers: [Pt, Pt][];  // thin column dividers inside W
  dot: Pt;               // "·" (×) mark centre
  eq: Pt;                // "=" mark centre
  markSize: number;      // half-size of the marks (8 in landscape)
}

/** Scene 2 — expertise as a neural network. */
export interface NetworkSceneLayout {
  title: Box;
  heads: Box[];          // languages · build · ship · ŷ
  l0: Pt[];              // language nodes
  l1: Pt[];              // build nodes
  l2: Pt[];              // ship nodes
  out: Pt;               // ŷ node
  r: number;             // node radius
  rOut: number;          // output node radius
  langLabels: Box[];
  buildLabels: Box[];
  shipLabels: Box[];
  outLabel: Box;
}

/** Scene 3 — open-source repos as modules around a chip. */
export interface ChipSceneLayout {
  title: Box;
  chip: Box;
  inner: Box;
  dot: Pt;               // pin-1 marker
  left: Box[];           // yellow modules
  right: Box[];          // blue modules
  core: Box;             // DOM block inside the chip
  traces: Trace[];
  pins: Pin[];
}

export interface StoryLayout {
  W: number;
  H: number;
  compact: boolean;
  s0: GuardrailSceneLayout;
  s1: MatrixSceneLayout;
  s2: NetworkSceneLayout;
  s3: ChipSceneLayout;
}

/**
 * Route a trace from (x0,y0) to (x1,y1) with a 45° jog at x = bx — the same
 * routing the demo used for the chip. Horizontal runs stay straight.
 */
export function routeTrace(x0: number, y0: number, x1: number, y1: number, bx: number, yellow: boolean): Trace {
  const dir = x1 > x0 ? 1 : -1;
  const c = 14;
  if (y0 === y1) return { pts: [[x0, y0], [x1, y1]], yellow };
  const s = y1 > y0 ? 1 : -1;
  return {
    pts: [[x0, y0], [bx - dir * c, y0], [bx, y0 + s * c], [bx, y1 - s * c], [bx + dir * c, y1], [x1, y1]],
    yellow,
  };
}

/** Pin from a chip edge: straight out, then a 45° kink to the dot. */
export function makePin(x: number, yEdge: number, dirY: number, dx: number, run = 28, kink = 18): Pin {
  const y1 = yEdge + dirY * run;
  const y2 = y1 + dirY * kink;
  return { line: [[x, yEdge], [x, y1], [x + dx, y2]], dot: [x + dx, y2 + dirY * 4] };
}
