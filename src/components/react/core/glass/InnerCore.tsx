/**
 * InnerCore.tsx — Small additive emissive icosahedron glowing inside the glass.
 *
 * Uses meshBasicMaterial with toneMapped={false} so it exceeds the bloom
 * luminance threshold (selective glow). The material ref is forwarded up so
 * PointerLerp can brighten it as the pointer nears the Core centre, and so the
 * scroll timeline can fade it during the dolly-through.
 */
import { forwardRef } from 'react';
import type { MeshBasicMaterial } from 'three';
import { CORE, PALETTE } from '../core-config';

export const InnerCore = forwardRef<MeshBasicMaterial>(function InnerCore(_props, matRef) {
  return (
    <mesh scale={CORE.innerScale}>
      <icosahedronGeometry args={[CORE.radius, 0]} />
      <meshBasicMaterial ref={matRef} color={PALETTE.neon2} transparent toneMapped={false} />
    </mesh>
  );
});
