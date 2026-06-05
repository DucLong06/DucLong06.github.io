/**
 * Library.tsx — Papers section prop. A small scholarly hut with a shelf of
 * colored book spines and a golden award trophy on top.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';
import { Clay, ClayBox } from './clay-material';

const SPINES = [PALETTE.violet, PALETTE.pink, PALETTE.sky, PALETTE.mint, PALETTE.yellow];

export function Library({ position }: { position: Vec3 }) {
  const trophy = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (trophy.current) trophy.current.rotation.y += dt * 0.5;
  });

  return (
    <group position={position}>
      {/* hut body */}
      <ClayBox args={[1.9, 1.4, 1.3]} position={[0, 0.7, 0]} color={PALETTE.cream} />
      {/* flat-ish roof */}
      <ClayBox args={[2.1, 0.22, 1.5]} position={[0, 1.5, 0]} color={PALETTE.woodDark} />
      {/* book spines on the front shelf */}
      {SPINES.map((c, i) => (
        <ClayBox
          key={i}
          args={[0.18, 0.7, 0.1]}
          position={[-0.7 + i * 0.34, 0.62, 0.7]}
          rotation={[0, 0, (i % 2 ? 1 : -1) * 0.06]}
          color={c}
        />
      ))}
      {/* award trophy */}
      <group position={[0, 1.95, 0]}>
        <mesh ref={trophy} castShadow>
          <cylinderGeometry args={[0.16, 0.05, 0.4, 8]} />
          <Clay color={PALETTE.yellow} emissive={PALETTE.yellow} emissiveIntensity={0.25} />
        </mesh>
        <ClayBox args={[0.24, 0.1, 0.24]} position={[0, -0.26, 0]} color={PALETTE.woodDark} />
      </group>
    </group>
  );
}
