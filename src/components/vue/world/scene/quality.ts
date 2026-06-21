/**
 * quality.ts — Device-aware quality tier. The capability gate already keeps
 * phones on the 2D site (width ≥ 768 + fine pointer required), so this only
 * trims settings for small/low-power laptops and honors reduced-motion.
 */
export interface QualityTier {
  /** devicePixelRatio cap. */
  dprCap: number;
  /** UnrealBloom strength (lower = cheaper). */
  bloomStrength: number;
  /** Skip the ignite cinematic + idle orbit; keep a static, readable world. */
  reducedMotion: boolean;
}

export function detectQuality(): QualityTier {
  if (typeof window === 'undefined') {
    return { dprCap: 2, bloomStrength: 0.62, reducedMotion: false };
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 1100;
  const lean = coarse || small;
  return {
    dprCap: lean ? 1.5 : 2,
    bloomStrength: lean ? 0.5 : 0.62,
    reducedMotion,
  };
}
