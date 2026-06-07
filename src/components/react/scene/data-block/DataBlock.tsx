/**
 * DataBlock.tsx — Composes the central "Floating Data Block": transmission core
 * + breathing distort shell + flowing code strands + ambient sparkles. Owns the
 * breathing useFrame (group scale pulse + slow idle rotation). Pointer Lerp
 * interaction (Phase 03) extends this via the forwarded group + distort refs.
 *
 * Reduced-motion (forced-3d edge case) freezes all animation.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { Group } from 'three';
import { BLOCK, SPARKLES, PALETTE } from '../cyber-config';
import { useReducedMotion } from '../use-reduced-motion';
import { TransmissionCore } from './TransmissionCore';
import { DistortShell, type DistortMaterialRef } from './DistortShell';
import { CodeStrands } from './CodeStrands';
import { PointerLerpController } from './PointerLerpController';

export function DataBlock() {
  const groupRef = useRef<Group>(null);
  const distortRef = useRef<DistortMaterialRef>(null);
  const reduced = useReducedMotion();

  // Breathing: gentle scale pulse. Idle rotation is handled by the pointer
  // controller (so cursor tilt and idle spin compose without fighting).
  useFrame((state) => {
    const g = groupRef.current;
    if (!g || reduced) return;
    const t = state.clock.elapsedTime;
    g.scale.setScalar(1 + Math.sin(t * BLOCK.breatheSpeed) * BLOCK.breatheAmp);
  });

  return (
    <group ref={groupRef}>
      <TransmissionCore />
      <DistortShell ref={distortRef} frozen={reduced} />
      <CodeStrands frozen={reduced} />
      <Sparkles
        count={SPARKLES.count}
        scale={SPARKLES.scale}
        size={SPARKLES.size}
        speed={reduced ? 0 : SPARKLES.speed}
        color={PALETTE.neon}
      />
      {!reduced && <PointerLerpController groupRef={groupRef} distortRef={distortRef} />}
    </group>
  );
}
