/**
 * CameraController.tsx — Smooth click-to-focus camera using drei CameraControls.
 *
 * When `focusedId` changes we tween (setLookAt with transition) to that section's
 * pose; when null we return to HOME_POSE. A gentle idle orbit plays at home when
 * the user isn't dragging, for a touch of life (skipped once focused).
 */
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import type { SectionId } from '../../../lib/scene/scene-data-types';
import { HOME_POSE, getSection } from './scene-config';

interface Props {
  focusedId: SectionId | null;
  /** Fired when the user grabs the camera (drag) — cancels an active tour. */
  onUserDragStart?: () => void;
}

export function CameraController({ focusedId, onUserDragStart }: Props) {
  const controls = useRef<CameraControls>(null);
  const dragging = useRef(false);

  // Keep latest callback in a ref so the mount-only listener effect stays stable.
  const onDragRef = useRef(onUserDragStart);
  onDragRef.current = onUserDragStart;

  // Apply orbit constraints once the controls instance exists.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.minDistance = 9;
    c.maxDistance = 24;
    c.minPolarAngle = 0.55;
    c.maxPolarAngle = Math.PI / 2.15;
    c.dollyToCursor = false;
    const onStart = () => {
      dragging.current = true;
      onDragRef.current?.();
    };
    const onEnd = () => (dragging.current = false);
    c.addEventListener('controlstart', onStart);
    c.addEventListener('controlend', onEnd);
    return () => {
      c.removeEventListener('controlstart', onStart);
      c.removeEventListener('controlend', onEnd);
    };
  }, []);

  // Tween to the focused section pose, or back home.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const pose = focusedId ? getSection(focusedId).focus : HOME_POSE;
    c.setLookAt(
      pose.position[0], pose.position[1], pose.position[2],
      pose.target[0], pose.target[1], pose.target[2],
      true,
    );
  }, [focusedId]);

  // Subtle idle auto-orbit at home.
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c || focusedId || dragging.current) return;
    c.azimuthAngle += dt * 0.05;
  });

  return <CameraControls ref={controls} makeDefault smoothTime={0.55} />;
}
