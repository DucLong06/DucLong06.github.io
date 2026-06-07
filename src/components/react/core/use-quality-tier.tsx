/**
 * use-quality-tier.tsx — Single rolling-FPS quality classifier shared across the
 * scene via context, so BOTH bloom (PostFX) and the transmission core scale down
 * together on weak GPUs (transmission is the heaviest pass — scaling only bloom
 * wasn't enough).
 *
 * Hysteresis: minimum dwell between switches + separate up/down FPS bands prevent
 * flapping. The state updater is pure — next tier is computed first and setState
 * fires only on an actual change (StrictMode-safe). Must live inside <Canvas>.
 */
import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';

export type QualityTier = 'high' | 'med' | 'low';

const BUFFER = 90; // ~1.5s of frames at 60fps
const WARMUP = 60; // ignore first frames (mount jank)
const MIN_DWELL = 1.2; // seconds between tier changes

const TierContext = createContext<QualityTier>('high');

/** Read the current quality tier (high | med | low). */
export const useTier = (): QualityTier => useContext(TierContext);

function useTierSampler(enabled: boolean): QualityTier {
  const [tier, setTier] = useState<QualityTier>('high');
  const tierRef = useRef<QualityTier>('high');
  const frames = useRef<number[]>([]);
  const dwell = useRef(0);

  useFrame((_, dt) => {
    if (!enabled) return;
    const buf = frames.current;
    buf.push(1 / Math.max(dt, 1e-4));
    if (buf.length > BUFFER) buf.shift();
    dwell.current += dt;
    if (buf.length < WARMUP || dwell.current < MIN_DWELL) return;

    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i];
    const avg = sum / buf.length;
    const cur = tierRef.current;
    let next = cur;
    // Down-shift fast (protect FPS); up-shift only with comfortable margin.
    if (avg < 38 && cur !== 'low') next = 'low';
    else if (avg < 50 && cur === 'high') next = 'med';
    else if (avg > 58 && cur === 'low') next = 'med';
    else if (avg > 62 && cur === 'med') next = 'high';

    if (next !== cur) {
      tierRef.current = next;
      dwell.current = 0;
      setTier(next);
    }
  });

  return tier;
}

/**
 * Runs the FPS sampler once and provides the tier to descendants. When disabled
 * (reduced-motion) it pins 'high' and never samples (the scene is static anyway,
 * and bloom is bypassed separately).
 */
export function QualityTierProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const sampled = useTierSampler(enabled);
  return <TierContext.Provider value={enabled ? sampled : 'high'}>{children}</TierContext.Provider>;
}
