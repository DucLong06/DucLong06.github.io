/**
 * graph-config.ts — Client-side visual constants for the 3D knowledge graph.
 * Colors/sizes live in src/lib/graph/graph-palette.ts (shared with the build
 * assembler); this file holds render-only tuning (camera, bloom, motion).
 */
import type { GraphNodeType } from '../../../lib/graph/graph-data-types';

export const CAMERA = {
  position: [0, 4, 46] as [number, number, number],
  fov: 48,
  near: 0.1,
  far: 220,
  minDistance: 18,
  maxDistance: 84,
};

/** Gentle idle orbit (OrbitControls autoRotate). Disabled for reduced-motion. */
export const DRIFT = { autoRotateSpeed: 0.35 };

export const BLOOM = {
  intensity: 0.85,
  luminanceThreshold: 0.2,
  luminanceSmoothing: 0.5,
  radius: 0.72,
};

/** Per-state node animation targets. */
export const NODE = {
  baseEmissive: 0.5,
  hoverEmissive: 1.5,
  selectEmissive: 1.7,
  dimEmissive: 0.08,
  hoverScale: 1.55,
  selectScale: 1.8,
  dimScale: 0.85,
  lerp: 0.16,
  /** Sphere radius = node.size * RADIUS_SCALE. */
  radiusScale: 0.55,
};

export const EDGE = {
  color: '#33506f',
  opacity: 0.4,
};

/** Camera focus behavior on node select — lerp speed of the orbit pivot. */
export const FOCUS = {
  lerp: 0.08,
};

/** Node types whose label is always rendered (others show on hover/select). */
export const LABEL_ALWAYS: GraphNodeType[] = ['root', 'company', 'section', 'stat', 'language'];
