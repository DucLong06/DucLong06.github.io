/**
 * ProjectCrates.tsx — Projects section prop. Three gently bobbing wooden crates
 * (the featured projects) with colored accent tops. Uses drei <Float>.
 */
import { Float } from '@react-three/drei';
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';
import { Clay, ClayBox } from './clay-material';

const CRATES: { offset: Vec3; size: number; top: string }[] = [
  { offset: [0, 0.5, 0], size: 0.95, top: PALETTE.yellow },
  { offset: [-1.0, 0.4, 0.5], size: 0.7, top: PALETTE.pink },
  { offset: [0.95, 0.42, 0.4], size: 0.72, top: PALETTE.mint },
];

function Crate({ offset, size, top }: { offset: Vec3; size: number; top: string }) {
  const h = size;
  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5} position={offset}>
      {/* crate body */}
      <ClayBox args={[size, h, size]} color={PALETTE.wood} />
      {/* cross planks */}
      <ClayBox args={[size * 1.02, h * 0.16, size * 1.02]} position={[0, 0, 0]} color={PALETTE.woodDark} />
      {/* accent lid */}
      <ClayBox args={[size * 0.9, h * 0.18, size * 0.9]} position={[0, h * 0.5 + 0.02, 0]} color={top} />
    </Float>
  );
}

export function ProjectCrates({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {CRATES.map((c, i) => (
        <Crate key={i} {...c} />
      ))}
      {/* small platform */}
      <mesh position={[0, -0.05, 0.2]}>
        <cylinderGeometry args={[1.9, 2.0, 0.2, 6]} />
        <Clay color={PALETTE.soilDark} />
      </mesh>
    </group>
  );
}
