/**
 * FlashPlane.tsx — Fullscreen additive white flash that masks the geometry swap
 * at the camera pass-through (the classic match-cut trick).
 *
 * A clip-space quad (vertex shader ignores projection → always fills the screen),
 * additive, depth-test off, drawn last. The scroll timeline (useCoreScroll) spikes
 * `uAlpha` 0→1→0 across MORPH.flashLen around MORPH.flashAt. Bloom amplifies the
 * spike for an extra punch. The material ref is forwarded up so the hook drives it.
 */
import { useMemo } from 'react';
import { AdditiveBlending, type ShaderMaterial } from 'three';

const FLASH_VERT = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FLASH_FRAG = /* glsl */ `
  uniform float uAlpha;
  void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, uAlpha); }
`;

interface Props {
  matRef: React.RefObject<ShaderMaterial | null>;
}

export function FlashPlane({ matRef }: Props) {
  const uniforms = useMemo(() => ({ uAlpha: { value: 0 } }), []);
  return (
    <mesh renderOrder={999} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef as never}
        uniforms={uniforms}
        vertexShader={FLASH_VERT}
        fragmentShader={FLASH_FRAG}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
