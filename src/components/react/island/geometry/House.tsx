/**
 * House.tsx — About section prop. Cozy clay cottage: walls, pyramid roof,
 * door, window, little chimney.
 */
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';
import { Clay, ClayBox } from './clay-material';

export function House({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {/* Walls */}
      <ClayBox args={[2, 1.5, 1.7]} position={[0, 0.75, 0]} color={PALETTE.cream} />
      {/* Roof — 4-sided pyramid */}
      <mesh castShadow position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.7, 1.1, 4]} />
        <Clay color={PALETTE.roof} />
      </mesh>
      {/* Door */}
      <ClayBox args={[0.5, 0.9, 0.1]} position={[0, 0.45, 0.86]} color={PALETTE.woodDark} />
      {/* Window */}
      <ClayBox args={[0.45, 0.45, 0.1]} position={[0.62, 0.95, 0.86]} color={PALETTE.sky} />
      {/* Chimney */}
      <ClayBox args={[0.3, 0.7, 0.3]} position={[0.6, 2.2, -0.2]} color={PALETTE.woodDark} />
    </group>
  );
}
