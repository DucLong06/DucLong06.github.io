/**
 * journey-config.ts — Render-only constants for the Data Pipeline Journey.
 * Geometry (curve points), camera tuning, bloom, and the ordered station list.
 * Colors live in src/lib/pipeline/pipeline-palette.ts (shared with the Astro
 * build side). This file is client-only tuning.
 */
import { NEON } from '../../../lib/pipeline/pipeline-palette';

export type StationId =
  | 'source'
  | 'ingest'
  | 'transform'
  | 'train'
  | 'deploy'
  | 'impact'
  | 'endpoint';

/** Ordered stations (index = position along the pipeline 0..N-1). */
export const STATIONS: { id: StationId; accent: string }[] = [
  { id: 'source', accent: NEON.cyan },
  { id: 'ingest', accent: NEON.violet },
  { id: 'transform', accent: NEON.pink },
  { id: 'train', accent: NEON.amber },
  { id: 'deploy', accent: NEON.mint },
  { id: 'impact', accent: NEON.amber },
  { id: 'endpoint', accent: NEON.cyan },
];

export const STATION_COUNT = STATIONS.length;

/**
 * CURVE_POINTS — control points for the THREE.CatmullRomCurve3 the camera flies.
 * Travels along -Z with a gentle left/right S-sway and mild vertical drift so
 * the flythrough feels organic. One point per station (index-aligned).
 */
export const CURVE_POINTS: [number, number, number][] = [
  [0, 0, 0], // source
  [-6, 1.5, -22], // ingest
  [6, -1, -44], // transform
  [-7, 2, -66], // train
  [7, -1.5, -88], // deploy
  [-5, 1.5, -110], // impact
  [0, 0, -132], // endpoint
];

/** Camera offset above/behind the curve point; looks LOOKAHEAD further along. */
export const CAMERA = {
  fov: 52,
  near: 0.1,
  far: 320,
  offsetY: 2.2, // sit slightly above the path
  lookahead: 0.04, // sample point this much further along for forward gaze
  lerp: 0.09, // position smoothing toward scroll target
};

/** Lateral offset of each station's 3D marker group from its curve point. */
export const STATION_MARKER_OFFSET: [number, number, number][] = [
  [3.5, 1, -6],
  [4, 0.5, -6],
  [-4.5, -0.5, -6],
  [4.5, 1.5, -6],
  [-5, -1, -6],
  [4, 1, -6],
  [0, 0.5, -6],
];

/** Bloom — copied from the graph hero (already tuned for neon emissives). */
export const BLOOM = {
  intensity: 0.9,
  luminanceThreshold: 0.18,
  luminanceSmoothing: 0.5,
  radius: 0.74,
};

/** Particle "data river" budget (≤8k for ≥50fps on mid-range desktop). */
export const RIVER = {
  count: 6500,
  size: 0.09,
  speed: 0.06, // curve-units per second of phase travel
  spread: 1.1, // radial jitter around the curve
};

/** Total scroll-proxy height in viewport units (drives journey length). */
export const SCROLL_VH = STATION_COUNT * 100; // 7 × 100vh
