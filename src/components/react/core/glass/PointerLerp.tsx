/**
 * PointerLerp.tsx — Damped idle + pointer motion for the Glass Core.
 *
 * Every frame (mounted only when reduced-motion is OFF):
 *   - idle slow spin + capped tilt toward the cursor, all damped → "liquid" feel
 *   - gentle breathing scale pulse on the core group
 *   - brightens the inner emissive core as the pointer nears centre
 *   - offsets the camera for parallax around HOME_POSE, aimed at the target
 *
 * Renders nothing. During the scroll dolly-through (Phase 05) the camera is
 * driven by useCoreScroll instead; `suspendCameraRef` lets that hook take the
 * camera over so the two never fight.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, type Group, type MeshBasicMaterial } from 'three';
import { INTERACTION, CORE, HOME_POSE, PALETTE } from '../core-config';
import { damp } from '../damp-utils';

interface Props {
  groupRef: React.RefObject<Group | null>;
  innerMatRef: React.RefObject<MeshBasicMaterial | null>;
  /** When the ref's value is true, the scroll hook owns the camera — skip parallax. */
  suspendCameraRef?: React.MutableRefObject<boolean>;
}

export function PointerLerp({ groupRef, innerMatRef, suspendCameraRef }: Props) {
  const idleYaw = useRef(0);
  const intensity = useRef(1);
  const baseColor = useMemo(() => new Color(PALETTE.neon2), []);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    const t = state.clock.elapsedTime;

    // Idle spin accumulates; cursor adds a capped tilt on top — all damped.
    idleYaw.current += dt * CORE.rotSpeed;
    const targetY = idleYaw.current + px * INTERACTION.maxAngle;
    const targetX = -py * INTERACTION.maxAngle;
    g.rotation.y = damp(g.rotation.y, targetY, INTERACTION.rotDamp, dt);
    g.rotation.x = damp(g.rotation.x, targetX, INTERACTION.rotDamp, dt);

    // Gentle breathing scale pulse.
    g.scale.setScalar(1 + Math.sin(t * CORE.breatheSpeed) * CORE.breatheAmp);

    // Inner-core glow brightens as the pointer nears centre (NDC distance → 0).
    const dist = Math.min(Math.hypot(px, py), 1);
    intensity.current = damp(intensity.current, 1 + (1 - dist) * 0.8, INTERACTION.proximityDamp, dt);
    const mat = innerMatRef.current;
    if (mat) mat.color.copy(baseColor).multiplyScalar(intensity.current);

    // Camera parallax around the home pose (unless the scroll hook owns it).
    if (suspendCameraRef?.current) return;
    const cam = state.camera;
    cam.position.x = damp(cam.position.x, HOME_POSE.position[0] + px * INTERACTION.parallax, INTERACTION.parallaxDamp, dt);
    cam.position.y = damp(cam.position.y, HOME_POSE.position[1] + py * INTERACTION.parallax, INTERACTION.parallaxDamp, dt);
    cam.lookAt(HOME_POSE.target[0], HOME_POSE.target[1], HOME_POSE.target[2]);
  });

  return null;
}
