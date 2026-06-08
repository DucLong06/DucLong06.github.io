/**
 * Decor.tsx — Ambient low-poly dressing: low-poly trees, bushes, and slow
 * drifting clouds. Fills gaps between the section props. Decorative only.
 */
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';
import { Clay } from './clay-material';
import { Clouds } from './clouds';

function Tree({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.8, 5]} />
        <Clay color={PALETTE.woodDark} />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <coneGeometry args={[0.55, 1.1, 6]} />
        <Clay color={PALETTE.grassMid} />
      </mesh>
      <mesh castShadow position={[0, 1.6, 0]}>
        <coneGeometry args={[0.4, 0.8, 6]} />
        <Clay color={PALETTE.grassTop} />
      </mesh>
    </group>
  );
}

function Bush({ position }: { position: Vec3 }) {
  return (
    <mesh castShadow position={position}>
      <dodecahedronGeometry args={[0.35, 0]} />
      <Clay color={PALETTE.grassMid} />
    </mesh>
  );
}

const TREES: { p: Vec3; s: number }[] = [
  { p: [-1.4, 0, -1.2], s: 1.1 },
  { p: [1.8, 0, -2.0], s: 0.8 },
  { p: [-4.6, 0, 1.8], s: 0.9 },
  { p: [4.4, 0, 2.2], s: 0.7 },
];
const BUSHES: Vec3[] = [
  [2.2, 0.1, 3.2],
  [-2.4, 0.1, -2.6],
  [4.8, 0.1, 0.6],
  [-3.6, 0.1, -0.2],
];

export function Decor() {
  return (
    <group>
      {TREES.map((t, i) => (
        <Tree key={i} position={t.p} scale={t.s} />
      ))}
      {BUSHES.map((b, i) => (
        <Bush key={i} position={b} />
      ))}
      <Clouds />
    </group>
  );
}
