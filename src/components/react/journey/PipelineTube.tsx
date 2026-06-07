/**
 * PipelineTube.tsx — Faint translucent pipe traced along the curve, giving the
 * data river a vessel to flow through. Emissive so bloom catches the edges.
 */
import { useMemo } from 'react';
import { TubeGeometry, type CatmullRomCurve3 } from 'three';
import { NEON } from '../../../lib/pipeline/pipeline-palette';

interface Props {
  curve: CatmullRomCurve3;
}

export default function PipelineTube({ curve }: Props) {
  const geometry = useMemo(
    () => new TubeGeometry(curve, 220, 1.15, 12, false),
    [curve],
  );

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={NEON.bgNavy}
        emissive={NEON.cyan}
        emissiveIntensity={0.18}
        transparent
        opacity={0.16}
        roughness={0.4}
        metalness={0.2}
        wireframe
      />
    </mesh>
  );
}
