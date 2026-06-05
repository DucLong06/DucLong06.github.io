/**
 * Mascot.tsx — Friendly clay blob character (the avatar). Bobs gently and its
 * head tracks the orbiting camera a little for a touch of life.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Quaternion } from 'three';
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';
import { Clay } from './clay-material';

export function Mascot({ position }: { position: Vec3 }) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  // Scratch quats reused each frame (no per-frame allocation).
  const prevQ = useRef(new Quaternion());
  const targetQ = useRef(new Quaternion());

  useFrame(({ clock, camera }, dt) => {
    const t = clock.elapsedTime;
    if (root.current) root.current.position.y = position[1] + Math.sin(t * 1.6) * 0.08;
    if (head.current) {
      // Compute the snap "look at camera" target, then slerp toward it so the
      // head turns naturally instead of snapping each frame. Frame-independent (dt).
      prevQ.current.copy(head.current.quaternion);
      head.current.lookAt(camera.position);
      head.current.rotation.x *= 0.3; // damp vertical tilt
      targetQ.current.copy(head.current.quaternion);
      const alpha = 1 - Math.exp(-7 * dt);
      head.current.quaternion.copy(prevQ.current).slerp(targetQ.current, alpha);
    }
  });

  return (
    <group ref={root} position={position}>
      {/* body */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.32, 0.36, 4, 10]} />
        <Clay color={PALETTE.violet} />
      </mesh>
      {/* head */}
      <group ref={head} position={[0, 1.0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 16, 12]} />
          <Clay color={PALETTE.white} />
        </mesh>
        {/* eyes */}
        <mesh position={[-0.12, 0.04, 0.3]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <Clay color={PALETTE.ink} />
        </mesh>
        <mesh position={[0.12, 0.04, 0.3]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <Clay color={PALETTE.ink} />
        </mesh>
        {/* cheeks */}
        <mesh position={[-0.2, -0.06, 0.26]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <Clay color={PALETTE.pink} />
        </mesh>
        <mesh position={[0.2, -0.06, 0.26]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <Clay color={PALETTE.pink} />
        </mesh>
      </group>
    </group>
  );
}
