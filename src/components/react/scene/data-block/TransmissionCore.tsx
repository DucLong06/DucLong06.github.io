/**
 * TransmissionCore.tsx — The central glass "data gem".
 *
 * A single faceted icosahedron with drei's MeshTransmissionMaterial (real
 * refraction) wrapping a small additive emissive core that glows through the
 * glass. Kept to ONE transmission mesh with low samples/resolution (see
 * BLOCK.transmission) — transmission is the heaviest material in the scene.
 */
import { MeshTransmissionMaterial } from '@react-three/drei';
import { BLOCK, PALETTE, TRANSMISSION_TIER } from '../cyber-config';
import { useTier } from '../use-quality-tier';

export function TransmissionCore() {
  // Down-scale samples/resolution on weaker GPUs (transmission is the heaviest pass).
  const t = TRANSMISSION_TIER[useTier()];
  return (
    <group>
      {/* Refractive glass shell */}
      <mesh>
        <icosahedronGeometry args={[BLOCK.coreRadius, BLOCK.coreDetail]} />
        <MeshTransmissionMaterial
          samples={t.samples}
          resolution={t.resolution}
          thickness={BLOCK.transmission.thickness}
          ior={BLOCK.transmission.ior}
          chromaticAberration={BLOCK.transmission.chromaticAberration}
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

      {/* Inner emissive core — glows through the glass, exceeds bloom threshold. */}
      <mesh scale={0.46}>
        <icosahedronGeometry args={[BLOCK.coreRadius, 0]} />
        <meshBasicMaterial color={PALETTE.neon2} toneMapped={false} />
      </mesh>
    </group>
  );
}
