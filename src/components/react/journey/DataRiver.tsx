/**
 * DataRiver.tsx — GPU particle stream flowing along the pipeline curve.
 * Positions + tangents are baked once on the CPU (sampling the shared curve);
 * the shader animates a short forward drift + glow pulse each frame. Capped at
 * RIVER.count (≤8k) and additively blended so the bloom pass lights it up.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Vector3,
  type CatmullRomCurve3,
  type ShaderMaterial,
} from 'three';
import { RIVER } from './journey-config';
import { NEON } from '../../../lib/pipeline/pipeline-palette';
import { RIVER_VERT, RIVER_FRAG } from './data-river-shader';

interface Props {
  curve: CatmullRomCurve3;
}

const SEG = 0.6; // forward drift distance (curve units) before wrap

export default function DataRiver({ curve }: Props) {
  const matRef = useRef<ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const { count, spread } = RIVER;
    const pos = new Float32Array(count * 3);
    const tan = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const mix = new Float32Array(count);
    const p = new Vector3();
    const t = new Vector3();
    // Deterministic pseudo-random (no Math.random — stable across reloads/SSR).
    const rand = (i: number, s: number) => {
      const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    for (let i = 0; i < count; i++) {
      const u = rand(i, 1);
      curve.getPointAt(u, p);
      curve.getTangentAt(u, t);
      // radial jitter perpendicular-ish to flow (cheap: use random offsets)
      const ox = (rand(i, 2) - 0.5) * spread;
      const oy = (rand(i, 3) - 0.5) * spread;
      const oz = (rand(i, 4) - 0.5) * spread * 0.4;
      pos[i * 3] = p.x + ox;
      pos[i * 3 + 1] = p.y + oy;
      pos[i * 3 + 2] = p.z + oz;
      tan[i * 3] = t.x;
      tan[i * 3 + 1] = t.y;
      tan[i * 3 + 2] = t.z;
      phase[i] = rand(i, 5) * SEG;
      mix[i] = u;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3));
    g.setAttribute('aTangent', new Float32BufferAttribute(tan, 3));
    g.setAttribute('aPhase', new Float32BufferAttribute(phase, 1));
    g.setAttribute('aMix', new Float32BufferAttribute(mix, 1));
    return g;
  }, [curve]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: RIVER.speed },
      uSeg: { value: SEG },
      uSize: { value: RIVER.size * 1000 },
      uColorA: { value: new Color(NEON.cyan) },
      uColorB: { value: new Color(NEON.violet) },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime.value as number) += delta;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={RIVER_VERT}
        fragmentShader={RIVER_FRAG}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
