/**
 * PointerLerpController.tsx — Damped pointer interaction for the data block.
 *
 * Reads the R3F pointer (-1..1 NDC) and, every frame:
 *   - tilts the block group toward the cursor (capped to BLOCK rotation) over a
 *     continuous slow idle spin, all damped → "liquid" feel;
 *   - turns pointer velocity into a transient shell distortion ripple;
 *   - offsets the camera slightly for parallax, keeping it aimed at center.
 *
 * Renders nothing. Mounted only when reduced-motion is OFF (see DataBlock).
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { INTERACTION, BLOCK, HOME_POSE } from '../cyber-config';
import { damp } from '../damp-utils';
import type { DistortMaterialRef } from './DistortShell';

interface Props {
  groupRef: React.RefObject<Group | null>;
  distortRef: React.RefObject<DistortMaterialRef>;
}

export function PointerLerpController({ groupRef, distortRef }: Props) {
  const idleYaw = useRef(0);
  const prevPointer = useRef({ x: 0, y: 0 });
  const ripple = useRef(0);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Idle spin accumulates; cursor adds a capped tilt on top.
    idleYaw.current += dt * BLOCK.rotSpeed;
    const targetY = idleYaw.current + px * INTERACTION.maxAngle;
    const targetX = -py * INTERACTION.maxAngle;
    g.rotation.y = damp(g.rotation.y, targetY, INTERACTION.rotDamp, dt);
    g.rotation.x = damp(g.rotation.x, targetX, INTERACTION.rotDamp, dt);

    // Pointer velocity → transient ripple in the shell distortion.
    const vel = Math.hypot(px - prevPointer.current.x, py - prevPointer.current.y);
    prevPointer.current = { x: px, y: py };
    ripple.current = damp(ripple.current, Math.min(vel * INTERACTION.rippleGain, 0.5), 0.12, dt);
    const mat = distortRef.current;
    if (mat) mat.distort = BLOCK.shellDistort + ripple.current;

    // Camera parallax around the home pose; always look at center.
    const cam = state.camera;
    cam.position.x = damp(cam.position.x, HOME_POSE.position[0] + px * INTERACTION.parallax, INTERACTION.parallaxDamp, dt);
    cam.position.y = damp(cam.position.y, HOME_POSE.position[1] + py * INTERACTION.parallax, INTERACTION.parallaxDamp, dt);
    cam.lookAt(HOME_POSE.target[0], HOME_POSE.target[1], HOME_POSE.target[2]);
  });

  return null;
}
