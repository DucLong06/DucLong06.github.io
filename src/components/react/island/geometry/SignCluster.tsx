/**
 * SignCluster.tsx — Experience section prop. A wooden post with three
 * directional sign boards (FPT · Cyber Eye · FSI) pointing different ways.
 */
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';
import { Clay, ClayBox } from './clay-material';

const BOARDS: { y: number; rotY: number; color: string }[] = [
  { y: 1.45, rotY: 0.2, color: PALETTE.sky },
  { y: 1.0, rotY: -0.9, color: PALETTE.mint },
  { y: 0.55, rotY: 2.0, color: PALETTE.yellow },
];

export function SignCluster({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {/* Post */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 1.8, 6]} />
        <Clay color={PALETTE.woodDark} />
      </mesh>
      {/* Boards */}
      {BOARDS.map((b, i) => (
        <group key={i} position={[0, b.y, 0]} rotation={[0, b.rotY, 0]}>
          <ClayBox args={[1.1, 0.32, 0.08]} position={[0.55, 0, 0]} color={b.color} />
          {/* pointed tip */}
          <mesh position={[1.12, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.16, 0.26, 3]} />
            <Clay color={b.color} />
          </mesh>
        </group>
      ))}
      {/* small stone base */}
      <mesh position={[0, 0.1, 0]}>
        <dodecahedronGeometry args={[0.32, 0]} />
        <Clay color={PALETTE.stone} />
      </mesh>
    </group>
  );
}
