/**
 * CameraController.tsx — Smoothly lerps the OrbitControls pivot to the focused
 * node so a clicked node animates to center. Only the pivot (target) moves, so
 * it never fights the user's drag/zoom or the idle auto-rotate.
 */
import { useFrame, useThree } from '@react-three/fiber';
import type { Vector3 } from 'three';
import { FOCUS } from './graph-config';

interface Props {
  focus: [number, number, number] | null;
}

export default function CameraController({ focus }: Props) {
  const controls = useThree((s) => s.controls) as { target?: Vector3 } | null;

  useFrame(() => {
    const target = controls?.target;
    if (!target) return;
    const [tx, ty, tz] = focus ?? [0, 0, 0];
    target.x += (tx - target.x) * FOCUS.lerp;
    target.y += (ty - target.y) * FOCUS.lerp;
    target.z += (tz - target.z) * FOCUS.lerp;
  });

  return null;
}
