/**
 * graph-layout.ts — Deterministic 3D force layout, run ONCE at build time.
 *
 * A tiny dependency-free force simulation (repulsion + link springs + gentle
 * centering) positions every node. Output is serialized into GraphData so the
 * client renders static, organic positions with zero physics code shipped.
 *
 * Determinism: initial positions come from a hashed phyllotaxis placement
 * (no Math.random), so the same content always yields the same layout.
 */
import type { GraphNode, GraphLink } from './graph-data-types';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Stable per-id hash → [0,1). Lets us seed positions deterministically. */
function hash01(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** Spherical-ish seed via golden-angle phyllotaxis, radius by node type tier. */
function seedPosition(node: GraphNode, index: number, total: number): Vec3 {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const tierRadius =
    node.type === 'root'
      ? 0
      : node.type === 'company' || node.type === 'section'
        ? 9
        : node.type === 'project' || node.type === 'stat' || node.type === 'language'
          ? 16
          : 22; // tech outer shell
  const y = total > 1 ? 1 - (index / (total - 1)) * 2 : 0; // -1..1
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * index + hash01(node.id) * 0.6;
  return {
    x: Math.cos(theta) * r * tierRadius,
    y: y * tierRadius * 0.7,
    z: Math.sin(theta) * r * tierRadius,
  };
}

const ITERATIONS = 240;
const REPULSION = 36;
const SPRING = 0.012;
const CENTER_PULL = 0.006;
const MAX_STEP = 1.4;

/**
 * Mutates each node's x/y/z in place with computed layout positions.
 * O(iterations · nodes²) — trivial for the ~60-node portfolio graph.
 */
export function computeLayout(nodes: GraphNode[], links: GraphLink[]): void {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  nodes.forEach((n, i) => {
    const p = seedPosition(n, i, nodes.length);
    n.x = p.x;
    n.y = p.y;
    n.z = p.z;
  });

  // Ideal spring length per link type.
  const restLength = (type: GraphLink['type']) =>
    type === 'belongs' ? 7 : type === 'nav' ? 8 : 11;

  for (let it = 0; it < ITERATIONS; it++) {
    const disp = new Map<string, Vec3>(nodes.map((n) => [n.id, { x: 0, y: 0, z: 0 }]));

    // Pairwise repulsion (Coulomb-ish, softened).
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const na = nodes[a];
        const nb = nodes[b];
        let dx = na.x - nb.x;
        let dy = na.y - nb.y;
        let dz = na.z - nb.z;
        let d2 = dx * dx + dy * dy + dz * dz + 0.01;
        const force = REPULSION / d2;
        const d = Math.sqrt(d2);
        dx /= d;
        dy /= d;
        dz /= d;
        const da = disp.get(na.id)!;
        const db = disp.get(nb.id)!;
        da.x += dx * force;
        da.y += dy * force;
        da.z += dz * force;
        db.x -= dx * force;
        db.y -= dy * force;
        db.z -= dz * force;
      }
    }

    // Link springs (Hooke toward rest length).
    for (const link of links) {
      const s = byId.get(link.source);
      const t = byId.get(link.target);
      if (!s || !t) continue;
      let dx = t.x - s.x;
      let dy = t.y - s.y;
      let dz = t.z - s.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
      const f = (d - restLength(link.type)) * SPRING;
      dx = (dx / d) * f;
      dy = (dy / d) * f;
      dz = (dz / d) * f;
      const ds = disp.get(s.id)!;
      const dt = disp.get(t.id)!;
      ds.x += dx;
      ds.y += dy;
      ds.z += dz;
      dt.x -= dx;
      dt.y -= dy;
      dt.z -= dz;
    }

    // Integrate with step clamp; pull gently toward center; pin root at origin.
    for (const n of nodes) {
      if (n.type === 'root') {
        n.x = n.y = n.z = 0;
        continue;
      }
      const dp = disp.get(n.id)!;
      dp.x -= n.x * CENTER_PULL;
      dp.y -= n.y * CENTER_PULL;
      dp.z -= n.z * CENTER_PULL;
      const mag = Math.sqrt(dp.x * dp.x + dp.y * dp.y + dp.z * dp.z) || 1;
      const scale = Math.min(1, MAX_STEP / mag);
      n.x += dp.x * scale;
      n.y += dp.y * scale;
      n.z += dp.z * scale;
    }
  }

  // Round to 3 decimals to shrink serialized payload.
  for (const n of nodes) {
    n.x = Math.round(n.x * 1000) / 1000;
    n.y = Math.round(n.y * 1000) / 1000;
    n.z = Math.round(n.z * 1000) / 1000;
  }
}
