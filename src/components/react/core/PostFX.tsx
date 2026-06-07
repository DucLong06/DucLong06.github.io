/**
 * PostFX.tsx — Selective neon bloom for the Core scene, gated by quality tier.
 *
 * Lives inside <Canvas>. Maps the FPS-sampled tier to a bloom config
 * (core-config BLOOM). On the 'low' tier (or when disabled for reduced-motion)
 * it renders nothing → R3F falls back to a plain render (no composer cost).
 * Only emissive/additive materials exceed the luminance threshold, so base
 * geometry stays un-bloomed (selective glow on the inner core + particles).
 */
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BLOOM } from './core-config';
import { useTier } from './use-quality-tier';

interface Props {
  /** false under reduced-motion → no composer at all. */
  enabled: boolean;
}

export function PostFX({ enabled }: Props) {
  const tier = useTier();
  if (!enabled) return null;

  const cfg = BLOOM[tier];
  if (cfg.intensity <= 0) return null; // 'low' tier → bloom disabled

  return (
    <EffectComposer>
      <Bloom
        intensity={cfg.intensity}
        luminanceThreshold={cfg.luminanceThreshold}
        luminanceSmoothing={0.18}
        mipmapBlur={cfg.mipmapBlur}
      />
    </EffectComposer>
  );
}
