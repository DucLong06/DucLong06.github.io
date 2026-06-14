/**
 * quantum-camera.tsx — Custom cinematic fly camera (replaces drei CameraControls).
 *
 * Each frame it lerps the camera position + a separate look target toward the
 * active stop's pose. At home (and on the central core) a slow automatic orbit
 * plays. Pointer drag orbits (yaw/pitch) and the wheel dollies, applied as a
 * spherical offset around the look target. Any manual input fires `onUserInteract`
 * so the auto-tour stops + re-arms. Ported from the prototype animate() loop.
 */
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { SectionId } from '../../../lib/scene/scene-data-types';
import { HOME_POSE, getSection } from './scene-config';

interface Props {
  focusedId: SectionId | null;
  /** Fired on any manual camera input (drag / wheel) — cancels + re-arms the tour. */
  onUserInteract?: () => void;
}

// Hoisted scratch vectors — no per-frame allocations.
const tmpPos = new Vector3();
const off = new Vector3();

function toVec(v: readonly [number, number, number]): Vector3 {
  return new Vector3(v[0], v[1], v[2]);
}

export function QuantumCamera({ focusedId, onUserInteract }: Props) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  const tgtPos = useRef(toVec(HOME_POSE.position));
  const tgtLook = useRef(toVec(HOME_POSE.target));
  const curLook = useRef(toVec(HOME_POSE.target));
  const homeOrbit = useRef(true);
  const orbitAngle = useRef(0);

  const userYaw = useRef(0);
  const userPitch = useRef(0);
  const userDolly = useRef(0);

  const interactRef = useRef(onUserInteract);
  interactRef.current = onUserInteract;

  // Select the target pose when the focused stop changes.
  useEffect(() => {
    const pose = focusedId ? getSection(focusedId).focus : HOME_POSE;
    tgtPos.current.set(...pose.position);
    tgtLook.current.set(...pose.target);
    // Only the central core / home keeps the slow establishing orbit.
    homeOrbit.current = focusedId === null || focusedId === 'about';
  }, [focusedId]);

  // Pointer drag-orbit + wheel-dolly (with clamps), matching the prototype.
  useEffect(() => {
    const canvas = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      interactRef.current?.();
    };
    const onUp = () => {
      dragging = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      userYaw.current -= (e.clientX - lastX) * 0.005;
      userPitch.current -= (e.clientY - lastY) * 0.004;
      userPitch.current = Math.max(-0.6, Math.min(0.9, userPitch.current));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      userDolly.current = Math.max(-8, Math.min(14, userDolly.current + e.deltaY * 0.01));
      interactRef.current?.();
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [gl]);

  useFrame(() => {
    const look = tgtLook.current;
    tmpPos.copy(tgtPos.current);

    // Slow automatic yaw around centre when on the home/core view.
    if (homeOrbit.current) {
      orbitAngle.current += 0.0016;
      const rad = Math.hypot(tgtPos.current.x, tgtPos.current.z);
      tmpPos.x = Math.sin(orbitAngle.current) * rad;
      tmpPos.z = Math.cos(orbitAngle.current) * rad;
    }

    // Apply user yaw/pitch/dolly as a spherical offset around the look target.
    if (userYaw.current || userPitch.current || userDolly.current) {
      off.copy(tmpPos).sub(look);
      // Floor the orbit radius so a strong inward dolly can't drive it negative
      // (which would flip the camera through the target).
      const r = Math.max(2.5, off.length() + userDolly.current);
      const theta = Math.atan2(off.x, off.z) + userYaw.current;
      let phi = Math.acos(Math.max(-1, Math.min(1, off.y / off.length()))) - userPitch.current;
      phi = Math.max(0.15, Math.min(1.45, phi));
      tmpPos.set(
        look.x + r * Math.sin(phi) * Math.sin(theta),
        look.y + r * Math.cos(phi),
        look.z + r * Math.sin(phi) * Math.cos(theta),
      );
    }

    camera.position.lerp(tmpPos, 0.05);
    curLook.current.lerp(look, 0.06);
    camera.lookAt(curLook.current);
  });

  return null;
}
