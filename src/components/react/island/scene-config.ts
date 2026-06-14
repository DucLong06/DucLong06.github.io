/**
 * scene-config.ts — Single source of truth for the Quantum Data World layout & look.
 *
 * Defines the neon-glass palette, where each section structure sits on the compass
 * ring (R=7.5, About at the core), and the camera "fly" pose used when a stop is
 * focused. Geometry (Phase 02), camera (Phase 03), and the auto-tour (Phase 04)
 * all read from here so the scene stays internally consistent.
 *
 * Positions + poses are computed with the SAME formula the approved prototype uses
 * (concept-d-quantum-data-world-3d.html) so structures and the fly-to camera agree.
 */
import type { SectionId } from '../../../lib/scene/scene-data-types';

export type Vec3 = [number, number, number];

/** Neon-glass palette (matches the Quantum Data World prototype tokens). */
export const PALETTE = {
  violet: '#7c5cff',
  cyan: '#38e1ff',
  lime: '#8df0a0',
  pink: '#ff5ea8',
  amber: '#ffd166',
  gold: '#ffd166',
  bg0: '#05030f',
  bg1: '#0c0824',
  fog: '#0a0622',
} as const;

/** Numeric color tokens for Three.js material/light constructors. */
export const COL = {
  violet: 0x7c5cff,
  cyan: 0x38e1ff,
  lime: 0x8df0a0,
  pink: 0xff5ea8,
  amber: 0xffd166,
  bg0: 0x05030f,
  bg1: 0x0c0824,
  fog: 0x0a0622,
} as const;

/** Default wide establishing pose — whole world in frame, gentle home orbit. */
export const HOME_POSE = {
  position: [0, 15, 27] as Vec3,
  target: [0, 2.4, 0] as Vec3,
};

export interface SectionConfig {
  id: SectionId;
  /** UI string key for the nav/dock label. */
  labelKey: string;
  /** In-world label shown on the structure / dock (e.g. "Quantum Core"). */
  worldLabel: string;
  /** Ground position of the structure on the compass ring (About = core). */
  prop: Vec3;
  /** World-space anchor above the structure (kept for a11y/legacy pin math). */
  pin: Vec3;
  /** Camera fly pose when this section is focused. */
  focus: { position: Vec3; target: Vec3 };
  /** Accent color for the dock + panel header. */
  color: string;
}

/* ── Compass ring layout (prototype formula) ──────────────────────────────────
 * RING radius 7.5. Five structures at 72° spacing starting at angle 0 (=-Z),
 * About at the centre (rendered as the floating Quantum Core at y≈3.2).
 *   pos(angle) = [ R·sin(angle), 0, -R·cos(angle) ]
 */
const RING = 7.5;
const TAU = Math.PI * 2;
const ringPos = (angle: number): Vec3 => [RING * Math.sin(angle), 0, -RING * Math.cos(angle)];

/**
 * Fly-to pose for a stop — replicates the prototype `poseFor()`:
 *   - About: a fixed close establishing pose on the core.
 *   - Ring stops: dolly out from origin past the structure (+dir·6) and up (+5.2),
 *     looking at the structure at y=1.8.
 */
function poseFor(id: SectionId, prop: Vec3): { position: Vec3; target: Vec3 } {
  if (id === 'about') {
    return { position: [0, 7, 13], target: [0, 3.0, 0] };
  }
  const [x, , z] = prop;
  const len = Math.hypot(x, z) || 1;
  const dx = x / len;
  const dz = z / len;
  return {
    position: [x + dx * 6, 5.2, z + dz * 6],
    target: [x, 1.8, z],
  };
}

interface SectionSeed {
  id: SectionId;
  labelKey: string;
  worldLabel: string;
  angle: number | null; // null = core (About)
  color: string;
}

/** Seeds in tour order; positions + poses derived below. */
const SEEDS: SectionSeed[] = [
  { id: 'about', labelKey: 'nav_about', worldLabel: 'Quantum Core', angle: null, color: PALETTE.violet },
  { id: 'experience', labelKey: 'experience_eyebrow', worldLabel: 'GPU Cluster', angle: 0, color: PALETTE.cyan },
  { id: 'skills', labelKey: 'skills_eyebrow', worldLabel: 'Blockchain Ledger', angle: (1 * TAU) / 5, color: PALETTE.amber },
  { id: 'projects', labelKey: 'projects_eyebrow', worldLabel: 'LED Matrix', angle: (2 * TAU) / 5, color: PALETTE.lime },
  { id: 'papers', labelKey: 'papers_eyebrow', worldLabel: 'Award Pedestals', angle: (3 * TAU) / 5, color: PALETTE.pink },
  { id: 'contact', labelKey: 'contact_eyebrow', worldLabel: 'Ground Station', angle: (4 * TAU) / 5, color: PALETTE.cyan },
];

export const SECTIONS: SectionConfig[] = SEEDS.map((s) => {
  // About is the core: rendered floating at y≈3.2; ring stops sit on the ground.
  const prop: Vec3 = s.angle === null ? [0, 3.2, 0] : ringPos(s.angle);
  const focusProp: Vec3 = s.angle === null ? [0, 0, 0] : prop;
  const pin: Vec3 = [prop[0], prop[1] + 2.4, prop[2]];
  return {
    id: s.id,
    labelKey: s.labelKey,
    worldLabel: s.worldLabel,
    prop,
    pin,
    focus: poseFor(s.id, focusProp),
    color: s.color,
  };
});

export function getSection(id: SectionId): SectionConfig {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown section: ${id}`);
  return s;
}

/* ── Guided auto-tour timing (single source of truth) ─────────────────────── */

/** Auto-tour: order of stops, then return home (About). Derived from SECTIONS. */
export const TOUR_ORDER: SectionId[] = SECTIONS.map((s) => s.id); // about→…→contact
/** Dwell at each stop (ms) — time the reading panel is shown. */
export const TOUR_DWELL_MS = 4_500;
/** Delay after mount before the first auto-start (ms). */
export const TOUR_BOOT_MS = 2_500;
/** Idle wait at home before re-arming the loop after an interruption (ms). */
export const TOUR_REARM_MS = 6_000;
/** Back-compat alias used by the tour hook for the idle/re-arm countdown. */
export const TOUR_IDLE_MS = TOUR_REARM_MS;
