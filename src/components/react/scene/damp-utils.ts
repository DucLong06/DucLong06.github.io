/**
 * damp-utils.ts — Frame-rate-independent damping (exponential smoothing).
 *
 * `damp(current, target, smoothTime, dt)` eases `current` toward `target` such
 * that the result is independent of frame rate (works the same at 60Hz / 144Hz).
 * `smoothTime` ≈ time (s) to cover most of the remaining distance. Equivalent in
 * spirit to drei/maath `easing.damp`, kept local to avoid an extra import path.
 */
export function damp(current: number, target: number, smoothTime: number, dt: number): number {
  const lambda = 1 / Math.max(smoothTime, 1e-4);
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
