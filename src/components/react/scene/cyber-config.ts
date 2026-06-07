/**
 * cyber-config.ts — Single source of truth for the "Floating Data Block" scene.
 *
 * Holds the dark/cyber palette, camera home pose, data-block geometry sizing,
 * code-strand parameters, interaction damping, orbit-timeline layout, and bloom
 * tuning. Every scene module (data-block, orbit, ui, postprocessing) reads from
 * here so the look stays internally consistent and tweakable in one place.
 */
import type { SectionId } from '../../../lib/scene/scene-data-types';

export type Vec3 = [number, number, number];

/** Dark/cyber palette — neon blue primary, amber/gold accent on near-black. */
export const PALETTE = {
  bgDeep: '#05070d', // canvas background (deepest)
  bg2: '#0a0e1a', // fog far color
  neon: '#2de2ff', // primary neon cyan-blue
  neon2: '#00e5ff', // brighter neon (emissive cores)
  amber: '#ffb020', // warm accent
  gold: '#ffd166', // bright gold highlight
  fg: '#e7f0ff', // foreground text on dark
  rim: '#3a6cff', // cool rim light
} as const;

/** Default camera pose framing the whole data block + orbit. */
export const HOME_POSE = {
  position: [0, 0.6, 7.2] as Vec3,
  target: [0, 0, 0] as Vec3,
  fov: 42,
};

/** Central "Floating Data Block" sizing + animation. */
export const BLOCK = {
  coreRadius: 1.05, // transmission gem radius
  coreDetail: 1, // icosahedron subdivisions (low = facets)
  shellScale: 1.32, // outer breathing shell vs core
  shellDistort: 0.28, // vertex-noise displacement amount
  shellSpeed: 0.55, // breathing distort speed
  breatheAmp: 0.02, // group scale pulse amplitude
  breatheSpeed: 0.7, // group scale pulse speed
  rotSpeed: 0.08, // idle slow rotation (rad/s)
  transmission: { ior: 1.4, thickness: 1.1, chromaticAberration: 0.04 },
} as const;

/** Transmission sampling per quality tier (heaviest pass — scale with FPS). */
export const TRANSMISSION_TIER = {
  high: { samples: 6, resolution: 256 },
  med: { samples: 4, resolution: 128 },
  low: { samples: 2, resolution: 64 },
} as const;

/** Glowing "code strand" tubes orbiting the core. */
export const STRANDS = {
  count: 5,
  tubularSegments: 120,
  radius: 0.018, // tube thickness
  scrollSpeed: 0.35, // UV scroll → "flowing code"
  spread: 2.1, // how far strands swing from core
} as const;

/** Ambient data-mote sparkles. */
export const SPARKLES = { count: 60, scale: 6, size: 2.4, speed: 0.3 } as const;

/** Damped pointer interaction (Phase 03). */
export const INTERACTION = {
  maxAngle: 0.25, // max group tilt toward cursor (rad)
  rotDamp: 0.28, // rotation damping time
  parallax: 0.5, // camera offset amount
  parallaxDamp: 0.35, // camera damping time
  rippleGain: 6, // pointer-velocity → shell ripple
} as const;

/** Orbit-timeline layout (Phase 04). Year range tuned at build from data. */
export const ORBIT = {
  radius: 3.0, // base project-node orbit radius
  radiusJitter: 0.35, // per-node radius variance (by category)
  arcStart: -Math.PI * 0.92, // earliest year angle (near-full ring, gap at far side)
  arcEnd: Math.PI * 0.92, // latest year angle
  tilt: -0.18, // orbit plane tilt (rad)
  nodeSize: 0.12, // project-node octahedron radius
  featuredScale: 1.6, // featured nodes render larger
  experienceRadius: 4.2, // experience waypoint ring
} as const;

/** Bloom postprocessing tuning per quality tier (Phase 06). */
export const BLOOM = {
  high: { intensity: 1.15, luminanceThreshold: 0.55, resolution: 256, mipmapBlur: true },
  med: { intensity: 0.9, luminanceThreshold: 0.62, resolution: 128, mipmapBlur: true },
  low: { intensity: 0, luminanceThreshold: 1.0, resolution: 64, mipmapBlur: false }, // disabled
} as const;

/** Category → accent color for project nodes. */
export const CATEGORY_COLOR: Record<string, string> = {
  'ai-ml': PALETTE.neon2,
  backend: PALETTE.neon,
  devops: PALETTE.gold,
  web: PALETTE.amber,
  research: PALETTE.rim,
};

export type SceneFocus = { kind: 'project' | 'experience'; id: string } | null;
export type { SectionId };
