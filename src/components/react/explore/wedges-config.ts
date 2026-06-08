/**
 * wedges-config.ts — Single source of truth for the 6 donut-hub wedges.
 * Read by the 3D scene (geometry/colors), the wedge-nav (DOM buttons) and the
 * detail-overlay router (id → panel). Keep framework-agnostic (no three import).
 *
 * Angle layout: 6 even segments, each thetaLength = 2π/6. angleIndex drives both
 * the torus segment position and the camera look-at math (camera-targets.ts).
 * Colors spread cyan → magenta around the ring (matches the neon token palette).
 */
import type { StringKey } from '../../../i18n/strings';

export type WedgeId = 'about' | 'experience' | 'work' | 'stats' | 'skills' | 'offclock';

export interface WedgeConfig {
  id: WedgeId;
  /** i18n key resolved at render time (EN/VI). */
  labelKey: StringKey;
  /** Neon hex for the 3D material + nav accent. */
  color: string;
  /** 0-based position around the ring. */
  angleIndex: number;
  /** Emoji used in the DOM nav + hub center. */
  icon: string;
}

export const WEDGE_COUNT = 6;
export const THETA_LENGTH = (Math.PI * 2) / WEDGE_COUNT;
/** Ring radius (donut center → tube center). Shared by geometry + camera math. */
export const HUB_RADIUS = 2.2;

/**
 * Solid-pie geometry constants (the thick "cake" hub). The disc stays in the XY
 * plane (normal +Z) — the tilted-cake look comes from an OBLIQUE camera, not a
 * group tilt, so slice-angle math (wedgeAngle) stays pure and the camera dive is a
 * simple oblique → face-on move. Slices are annular sectors (inner hole clears the
 * center core). Depth extrudes along +Z. Shared by geometry + camera + payload.
 */
export const PIE_INNER = 1.05;
export const PIE_OUTER = 2.95;
/** Thicker slab → the "cake" depth actually reads at an oblique angle. */
export const PIE_DEPTH = 0.9;
/** Mid radius — slice centroid distance, used by camera + payload placement. */
export const PIE_MID = (PIE_INNER + PIE_OUTER) / 2;
/** Angular gap (radians) trimmed from each side of a slice → visible seams. */
export const PIE_GAP = 0.045;
/** Top face Z (after centering the extrude on z=0) — where bars sprout from. */
export const PIE_FACE_Z = PIE_DEPTH / 2;

export const WEDGES: readonly WedgeConfig[] = [
  { id: 'about',      labelKey: 'graph_section_about',      color: '#34e2ff', angleIndex: 0, icon: '👤' },
  { id: 'experience', labelKey: 'graph_section_experience', color: '#49b6ff', angleIndex: 1, icon: '💼' },
  { id: 'work',       labelKey: 'explore_wedge_work',       color: '#7d8cff', angleIndex: 2, icon: '🚀' },
  { id: 'stats',      labelKey: 'explore_wedge_stats',      color: '#b06af0', angleIndex: 3, icon: '📊' },
  { id: 'skills',     labelKey: 'graph_section_skills',     color: '#e155c2', angleIndex: 4, icon: '🛠️' },
  { id: 'offclock',   labelKey: 'explore_wedge_offclock',  color: '#ff4d9d', angleIndex: 5, icon: '⚽' },
] as const;

/** Center angle (radians) of a wedge's segment, measured from +X, CCW. */
export function wedgeAngle(angleIndex: number): number {
  return angleIndex * THETA_LENGTH + THETA_LENGTH / 2;
}

export function getWedge(id: WedgeId): WedgeConfig {
  return WEDGES.find((w) => w.id === id) ?? WEDGES[0];
}
