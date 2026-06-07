/**
 * OrbitParticles.tsx — ~200 small glowing motes orbiting the Glass Core on slow
 * circular paths. Pure ambience; independent of the morph field.
 *
 * Perf contract: all per-particle params (radius, phase, speed, yTilt) + the
 * initial positions + per-particle colours are precomputed ONCE into static
 * typed arrays (useMemo). Each frame only rewrites the position array in place —
 * zero allocations, no GC churn. Count scales with the quality tier and freezes
 * under reduced-motion. The material ref is forwarded up so the scroll timeline
 * (Phase 05) can fade opacity/size to 0 as the grid takes over.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, type Points, type PointsMaterial } from 'three';
import { PALETTE, PARTICLES } from '../core-config';
import { useTier } from '../use-quality-tier';

interface Props {
  matRef: React.RefObject<PointsMaterial | null>;
  frozen: boolean;
}

export function OrbitParticles({ matRef, frozen }: Props) {
  const count = PARTICLES.orbitCount[useTier()];
  const pointsRef = useRef<Points>(null);

  // Static per-particle params + initial positions + colours (computed once).
  const { positions, colors, radius, phase, speed, yTilt } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const radius = new Float32Array(count);
    const phase = new Float32Array(count);
    const speed = new Float32Array(count);
    const yTilt = new Float32Array(count);
    const cNeon = new Color(PALETTE.neon2);
    const cGold = new Color(PALETTE.gold);
    const tmp = new Color();

    for (let i = 0; i < count; i++) {
      const r = 1.7 + Math.random() * 1.6; // 1.7 → 3.3
      const ph = Math.random() * Math.PI * 2;
      radius[i] = r;
      phase[i] = ph;
      speed[i] = (0.12 + Math.random() * 0.22) * (Math.random() < 0.5 ? -1 : 1);
      yTilt[i] = Math.random() * 2 - 1;

      // Initial position at t=0 (also the static frame under reduced-motion).
      positions[i * 3] = Math.cos(ph) * r;
      positions[i * 3 + 1] = Math.sin(ph) * yTilt[i] * r * 0.3;
      positions[i * 3 + 2] = Math.sin(ph) * r;

      tmp.copy(cNeon).lerp(cGold, Math.random() * 0.6);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    return { positions, colors, radius, phase, speed, yTilt };
  }, [count]);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts || frozen) return;
    const t = state.clock.elapsedTime;
    const attr = pts.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const angle = phase[i] + t * speed[i];
      const r = radius[i];
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle) * yTilt[i] * r * 0.3;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef as never}
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
