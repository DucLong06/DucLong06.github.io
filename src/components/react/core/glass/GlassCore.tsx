/**
 * GlassCore.tsx — The central frosted-glass icosahedron.
 *
 * One faceted icosahedron with drei's MeshTransmissionMaterial (real refraction).
 * Kept to ONE transmission mesh with tiered samples/resolution (transmission is
 * the heaviest material in the scene). The material ref is forwarded up so the
 * scroll timeline (Phase 05) can fade transmission + opacity to 0 as the camera
 * flies through the glass.
 */
import { forwardRef } from 'react';
import { MeshTransmissionMaterial } from '@react-three/drei';
import type { MeshPhysicalMaterial } from 'three';
import { CORE, PALETTE, TRANSMISSION_TIER } from '../core-config';
import { useTier } from '../use-quality-tier';

/** drei's MeshTransmissionMaterial extends MeshPhysicalMaterial at runtime. */
export type GlassMaterial = MeshPhysicalMaterial;

export const GlassCore = forwardRef<GlassMaterial>(function GlassCore(_props, matRef) {
  // Down-scale samples/resolution on weaker GPUs (heaviest pass).
  const t = TRANSMISSION_TIER[useTier()];
  return (
    <mesh>
      <icosahedronGeometry args={[CORE.radius, CORE.detail]} />
      <MeshTransmissionMaterial
        ref={matRef as never}
        transparent
        samples={t.samples}
        resolution={t.resolution}
        thickness={CORE.transmission.thickness}
        ior={CORE.transmission.ior}
        chromaticAberration={CORE.transmission.chromaticAberration}
        anisotropy={0.12}
        distortion={0.25}
        distortionScale={0.35}
        temporalDistortion={0.12}
        roughness={0.05}
        color={PALETTE.neon}
        attenuationColor={PALETTE.rim}
        attenuationDistance={2.4}
      />
    </mesh>
  );
});
