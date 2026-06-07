/**
 * MorphField.tsx — The "shatter" is a MORPH, not an explosion.
 *
 * One persistent THREE.Points (2–3k, tiered) whose vertices lerp in a shader
 * between (a) positions sampled on the icosahedron surface (built-in `position`,
 * via MeshSurfaceSampler) and (b) a grid lattice filling the background plane
 * (`bPos`). A single uniform `uMorph` (0→1) drives the whole transform on the
 * GPU — zero CPU per frame beyond writing `uMorph`/`uTime`.
 *
 * Both position buffers are sampled/generated ONCE (useMemo, static). The
 * material ref is forwarded up so the scroll timeline (Phase 05) sets `uMorph`.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  Color,
  IcosahedronGeometry,
  Mesh,
  Vector3,
  type ShaderMaterial,
} from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { CORE, PALETTE, PARTICLES } from '../core-config';
import { useTier } from '../use-quality-tier';
import { MORPH_VERT, MORPH_FRAG } from './morph-shader';

interface Props {
  matRef: React.RefObject<ShaderMaterial | null>;
  frozen: boolean;
}

export function MorphField({ matRef, frozen }: Props) {
  const count = PARTICLES.morphCount[useTier()];

  // (a) Surface positions sampled on the SAME icosahedron as GlassCore.
  const aPos = useMemo(() => {
    const geo = new IcosahedronGeometry(CORE.radius, CORE.detail);
    const sampler = new MeshSurfaceSampler(new Mesh(geo)).build();
    const arr = new Float32Array(count * 3);
    const v = new Vector3();
    for (let i = 0; i < count; i++) {
      sampler.sample(v);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    geo.dispose();
    return arr;
  }, [count]);

  // (b) Background grid lattice — a widescreen plane behind the camera-end pose.
  const bPos = useMemo(() => {
    const { spread, z } = PARTICLES.grid;
    const spreadX = spread;
    const spreadY = spread * 0.5625; // 16:9
    const cols = Math.max(2, Math.round(Math.sqrt((count * spreadX) / spreadY)));
    const rows = Math.max(2, Math.ceil(count / cols));
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      arr[i * 3] = (col / (cols - 1) - 0.5) * spreadX;
      arr[i * 3 + 1] = (row / Math.max(rows - 1, 1) - 0.5) * spreadY;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count]);

  // Stable uniforms (mutated in place — never reallocated).
  const uniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uSizeA: { value: 6.0 },
      uSizeB: { value: 13.0 },
      uColorA: { value: new Color(PALETTE.neon) },
      uColorB: { value: new Color(PALETTE.neon2) },
    }),
    [],
  );

  useFrame((state) => {
    if (frozen) return;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    // frustumCulled off: the geometry's bounding sphere is the icosa surface (r~1),
    // but the shader displaces vertices out to the grid lattice (z=-3, wide spread).
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[aPos, 3]} />
        <bufferAttribute attach="attributes-bPos" args={[bPos, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef as never}
        uniforms={uniforms}
        vertexShader={MORPH_VERT}
        fragmentShader={MORPH_FRAG}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
