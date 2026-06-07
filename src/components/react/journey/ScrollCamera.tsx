/**
 * ScrollCamera.tsx — Drives the default camera along the pipeline curve from the
 * scroll progress ref. Reads progressRef inside useFrame (no React re-render),
 * lerps the camera position toward the curve point, and looks slightly ahead for
 * a natural forward gaze. The whole flythrough is scroll-driven.
 */
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, type CatmullRomCurve3 } from 'three';
import { useMemo, type RefObject } from 'react';
import { CAMERA } from './journey-config';

interface Props {
  curve: CatmullRomCurve3;
  progressRef: RefObject<number>;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function ScrollCamera({ curve, progressRef }: Props) {
  const camera = useThree((s) => s.camera);
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const p = clamp01(progressRef.current ?? 0);
    curve.getPointAt(p, pos);
    pos.y += CAMERA.offsetY;
    camera.position.lerp(pos, CAMERA.lerp);

    curve.getPointAt(clamp01(p + CAMERA.lookahead), look);
    look.y += CAMERA.offsetY * 0.5;
    camera.lookAt(look);
  });

  return null;
}
