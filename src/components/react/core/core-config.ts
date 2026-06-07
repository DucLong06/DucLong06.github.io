/**
 * core-config.ts — Single source of truth for the "Glass Core" hero + cinematic
 * scroll transition. Ported from the retired `scene/cyber-config.ts`; the
 * data-block/orbit/strand/sparkle sections are dropped and replaced with the
 * camera end-pose + morph/flash/card scroll ranges that drive the new timeline.
 *
 * Every core module (glass, particles, timeline, overlay, postprocessing) reads
 * from here so the look + the beat map stay tweakable in one place.
 */
export type Vec3 = [number, number, number];

/** Dark/cyber palette — neon cyan primary, amber/gold accent on near-black. */
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

/** Hero camera pose — frames the glass Core (before the dolly-through). */
export const HOME_POSE = {
  position: [0, 0.4, 7.2] as Vec3,
  target: [0, 0, 0] as Vec3,
  fov: 42,
} as const;

/** End camera pose — pushed *inside* the Core just before the flash/swap. */
export const CAMERA_END = {
  position: [0, 0, 0.15] as Vec3,
  target: [0, 0, -1] as Vec3,
} as const;

/** Central glass icosahedron sizing + idle animation. */
export const CORE = {
  radius: 1.05, // icosahedron radius
  detail: 1, // subdivisions (low = facets)
  innerScale: 0.46, // emissive inner-core scale vs shell
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

/** Damped pointer interaction (group tilt + camera parallax). */
export const INTERACTION = {
  maxAngle: 0.25, // max group tilt toward cursor (rad)
  rotDamp: 0.28, // rotation damping time
  parallax: 0.5, // camera offset amount
  parallaxDamp: 0.35, // camera damping time
  proximityDamp: 0.2, // inner-core intensity damping vs pointer distance
} as const;

/** Bloom postprocessing tuning per quality tier. */
export const BLOOM = {
  high: { intensity: 1.15, luminanceThreshold: 0.55, resolution: 256, mipmapBlur: true },
  med: { intensity: 0.9, luminanceThreshold: 0.62, resolution: 128, mipmapBlur: true },
  low: { intensity: 0, luminanceThreshold: 1.0, resolution: 64, mipmapBlur: false }, // disabled
} as const;

/**
 * Particle counts per quality tier.
 *   orbitCount — ambient orbiters around the Core (Phase 03).
 *   morphCount — icosa-surface ↔ grid morph field (Phase 04).
 */
export const PARTICLES = {
  orbitCount: { high: 200, med: 120, low: 70 },
  morphCount: { high: 3000, med: 2000, low: 1000 },
  /** Background grid lattice dimensions (columns × rows) the morph reforms into. */
  grid: { cols: 56, rows: 56, spread: 16, z: -3 },
} as const;

/**
 * Scroll beat map — all values are `scroll.offset` (0→1 across ScrollControls
 * `pages`). One damped useFrame (`useCoreScroll`) reads `scroll.range(start,len)`
 * for each beat. Tweak the cinematic here, nowhere else.
 *
 * Timeline:
 *   0.00–0.35  hero idle (camera HOME, glass solid, morph 0)
 *   0.35–0.55  camera dollies through the glass; transmission/opacity → 0
 *   ~0.50      flash spike masks the geometry swap
 *   0.45–0.75  uMorph 0→1 (icosa surface → grid); orbit particles fade out
 *   0.70–1.00  grid settled; cards fade up
 */
export const PAGES = 2.5;

export const MORPH = {
  dollyStart: 0.35, // camera begins pushing through the glass
  dollyLen: 0.2, // …reaches CAMERA_END at 0.55
  glassFadeStart: 0.35, // transmission/opacity ramp to 0 over the dolly
  glassFadeLen: 0.2,
  shatterStart: 0.45, // uMorph 0→1 begins
  shatterLen: 0.3, // …completes at 0.75
  flashAt: 0.5, // additive white spike center
  flashLen: 0.1, // spike total width (rise+fall)
  orbitFadeStart: 0.45, // ambient orbiters fade out as the grid takes over
  orbitFadeLen: 0.2,
  gridFadeStart: 0.7, // background grid wireframe settles in
  gridFadeLen: 0.25,
} as const;

/**
 * Workplace cards fade-up window + per-card stagger (offset units). Budget so the
 * LAST card still completes before offset reaches 1.0 (ScrollControls eases the
 * offset in asymptotically): fadeStart + (nCards-1)*stagger + fadeLen ≤ ~0.95.
 * Sized for the current 3 experience entries with margin.
 */
export const CARDS = {
  fadeStart: 0.74,
  fadeLen: 0.13,
  stagger: 0.03,
} as const;
