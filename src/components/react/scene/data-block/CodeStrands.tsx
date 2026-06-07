/**
 * CodeStrands.tsx — Glowing "flowing code" tubes around the core.
 *
 * N deterministic CatmullRom tubes (seeded by index, no random) with an additive
 * emissive dashed texture whose UV scrolls each frame → looks like data streaming
 * along the strands. Additive + toneMapped=false so they exceed the bloom
 * threshold (Phase 06) and glow.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TubeGeometry, AdditiveBlending, type Texture } from 'three';
import { STRANDS, PALETTE } from '../cyber-config';
import { makeStrandCurve, makeDataStripeTexture } from './cyber-materials';

const STRAND_COLORS = [PALETTE.neon, PALETTE.amber, PALETTE.neon2, PALETTE.gold, PALETTE.rim];

interface Props {
  frozen?: boolean;
}

export function CodeStrands({ frozen = false }: Props) {
  // Tube geometries — deterministic, built once.
  const geometries = useMemo(
    () =>
      Array.from({ length: STRANDS.count }, (_, i) => {
        const curve = makeStrandCurve(i, STRANDS.count);
        return new TubeGeometry(curve, STRANDS.tubularSegments, STRANDS.radius, 6, true);
      }),
    [],
  );

  // One shared scrolling texture (cheap); repeat along length for dash tiling.
  const texture = useMemo<Texture>(() => {
    const tex = makeDataStripeTexture('#ffffff');
    tex.repeat.set(1, 14);
    return tex;
  }, []);
  const offsetRef = useRef(0);

  // R3F auto-disposes mesh geometry/material on unmount, but NOT the shared
  // CanvasTexture or the explicitly-constructed TubeGeometries — dispose both.
  useEffect(
    () => () => {
      texture.dispose();
      geometries.forEach((g) => g.dispose());
    },
    [texture, geometries],
  );

  useFrame((_, dt) => {
    if (frozen) return;
    offsetRef.current = (offsetRef.current + dt * STRANDS.scrollSpeed) % 1;
    texture.offset.y = offsetRef.current;
  });

  return (
    <group>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial
            map={texture}
            color={STRAND_COLORS[i % STRAND_COLORS.length]}
            transparent
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}
