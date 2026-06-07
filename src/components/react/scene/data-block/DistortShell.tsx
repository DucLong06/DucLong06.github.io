/**
 * DistortShell.tsx — Translucent outer shell that "breathes".
 *
 * A slightly larger icosahedron using drei's MeshDistortMaterial for vertex-noise
 * displacement (the amorphous breathing). The material ref is forwarded up so the
 * pointer controller (Phase 03) can push `distort` from cursor velocity → ripple.
 * `depthWrite={false}` keeps the glass core visible through it.
 */
import { forwardRef } from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import { DoubleSide } from 'three';
import { BLOCK, PALETTE } from '../cyber-config';

interface Props {
  /** Reduced-motion → speed 0 (frozen distortion). */
  frozen?: boolean;
}

/** Ref type exposed: the distort material instance (has .distort/.speed/.time). */
export type DistortMaterialRef = {
  distort: number;
  speed: number;
} | null;

export const DistortShell = forwardRef<DistortMaterialRef, Props>(function DistortShell(
  { frozen = false },
  ref,
) {
  return (
    <mesh scale={BLOCK.shellScale}>
      {/* detail 4 ≈ 20k tris — enough for smooth noise distortion without the
          81k-tri cost of detail 6. */}
      <icosahedronGeometry args={[BLOCK.coreRadius, 4]} />
      <MeshDistortMaterial
        ref={ref as never}
        distort={BLOCK.shellDistort}
        speed={frozen ? 0 : BLOCK.shellSpeed}
        color={PALETTE.rim}
        emissive={PALETTE.neon}
        emissiveIntensity={0.35}
        roughness={0.35}
        metalness={0.1}
        transparent
        opacity={0.16}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
});
