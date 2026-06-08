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
