/**
 * scene-config.ts — Single source of truth for the island's layout & look.
 *
 * Defines the clay palette, where each section prop sits on the island, and the
 * camera "focus" pose used when a pin is clicked (Phase 03). Geometry (Phase 02),
 * pins/camera (Phase 03), and the dock UI (Phase 04) all read from here so the
 * scene stays internally consistent.
 */
import type { SectionId } from '../../../lib/scene/scene-data-types';

export type Vec3 = [number, number, number];

/** Playful low-poly clay palette (matches wireframe style-c). */
export const PALETTE = {
  grassTop: '#7bd88f',
  grassMid: '#5cc47a',
  soil: '#b98a5e',
  soilDark: '#9c6f48',
  water: '#62d6e8',
  violet: '#7c5cff',
  violetDark: '#6b46ff',
  pink: '#ff5ea8',
  yellow: '#ffd06b',
  mint: '#62f0c8',
  sky: '#37c2ff',
  cream: '#fff4e6',
  wood: '#c98a52',
  woodDark: '#9a6736',
  stone: '#aeb4cf',
  roof: '#ff6f91',
  white: '#fffaf3',
  ink: '#3a3450',
} as const;

/** Default orbit/home camera pose (whole island in frame). */
export const HOME_POSE = {
  position: [11, 8, 13] as Vec3,
  target: [0, 1.2, 0] as Vec3,
};

export interface SectionConfig {
  id: SectionId;
  /** UI string key for the pin/dock label. */
  labelKey: string;
  /** Ground position of the prop on the island top. */
  prop: Vec3;
  /** World-space anchor where the pin floats (above the prop). */
  pin: Vec3;
  /** Camera pose when this section is focused. */
  focus: { position: Vec3; target: Vec3 };
  /** Accent color for the pin + popup header. */
  color: string;
}

/**
 * Section props arranged around the island top (y≈0). Camera focus poses are
 * hand-tuned to frame each prop with the popup card to its side.
 */
export const SECTIONS: SectionConfig[] = [
  {
    id: 'about',
    labelKey: 'nav_about',
    prop: [-3.2, 0, 2.4],
    pin: [-3.2, 2.6, 2.4],
    focus: { position: [-1.0, 3.6, 7.2], target: [-3.2, 1.4, 2.4] },
    color: PALETTE.violet,
  },
  {
    id: 'experience',
    labelKey: 'experience_eyebrow',
    prop: [-4.4, 0, -1.4],
    pin: [-4.4, 2.4, -1.4],
    focus: { position: [-7.4, 3.4, 3.0], target: [-4.4, 1.2, -1.4] },
    color: PALETTE.sky,
  },
  {
    id: 'skills',
    labelKey: 'skills_eyebrow',
    prop: [0, 0, -3.8],
    pin: [0, 3.6, -3.8],
    focus: { position: [3.0, 4.2, 1.6], target: [0, 1.8, -3.8] },
    color: PALETTE.mint,
  },
  {
    id: 'projects',
    labelKey: 'projects_eyebrow',
    prop: [3.2, 0, 1.8],
    pin: [3.2, 2.4, 1.8],
    focus: { position: [6.4, 3.4, 6.0], target: [3.2, 1.1, 1.8] },
    color: PALETTE.yellow,
  },
  {
    id: 'papers',
    labelKey: 'papers_eyebrow',
    prop: [4.2, 0, -1.6],
    pin: [4.2, 2.6, -1.6],
    focus: { position: [7.6, 3.6, 2.6], target: [4.2, 1.3, -1.6] },
    color: PALETTE.pink,
  },
  {
    id: 'contact',
    labelKey: 'contact_eyebrow',
    prop: [0.2, 0, 4.4],
    pin: [0.2, 2.2, 4.4],
    focus: { position: [2.2, 3.0, 8.2], target: [0.2, 1.0, 4.4] },
    color: PALETTE.violetDark,
  },
];

export function getSection(id: SectionId): SectionConfig {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown section: ${id}`);
  return s;
}

/* ── Guided auto-tour timing (single source of truth) ─────────────────────── */

/** Auto-tour: order of stops, then return home (null). Derived from SECTIONS. */
export const TOUR_ORDER: SectionId[] = SECTIONS.map((s) => s.id); // about→…→contact
/** Dwell at each stop (ms) — time the popup card is readable. */
export const TOUR_DWELL_MS = 10_000;
/** Idle wait at home before auto-starting / re-looping (ms). */
export const TOUR_IDLE_MS = 15_000;
/** Flight tween allowance (ms) — matches CameraControls smoothTime 0.55. */
export const TOUR_FLIGHT_MS = 700;
