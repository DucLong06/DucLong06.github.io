/**
 * SkillTower.tsx — Skills section prop. A stacked clay tower topped with a
 * slowly spinning mint crystal (the "expertise beacon").
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';
import { Clay } from './clay-material';

export function SkillTower({ position }: { position: Vec3 }) {
  const crystal = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (crystal.current) crystal.current.rotation.y += dt * 0.6;
  });

  return (
    <group position={position}>
      {/* Stacked stone segments, tapering up */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.85, 1.0, 1.2, 6]} />
        <Clay color={PALETTE.stone} />
      </mesh>
      <mesh castShadow position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.65, 0.8, 1.0, 6]} />
        <Clay color={PALETTE.violet} />
      </mesh>
      <mesh castShadow position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.5, 0.62, 0.7, 6]} />
        <Clay color={PALETTE.violetDark} />
      </mesh>
      {/* Floating crystal beacon */}
      <mesh ref={crystal} castShadow position={[0, 3.4, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <Clay color={PALETTE.mint} emissive={PALETTE.mint} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}
