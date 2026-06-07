/**
 * pipeline-palette.ts — Single source of truth for the Data Pipeline Journey
 * neon palette. Pure constants (no DOM/fs) so both the Astro build side and the
 * client R3F island can import it. Emissive hues feed bloom; tokens mirror the
 * dark Aurora theme so 3D and DOM overlays stay in harmony.
 */

/** Core neon emissive hues (hex strings, three-friendly). */
export const NEON = {
  cyan: '#22d3ee', // SOURCE / ENDPOINT — data origin + terminus
  violet: '#a78bfa', // INGEST — raw intake
  pink: '#f472b6', // TRANSFORM — reshaping
  amber: '#ffd9a0', // TRAIN / IMPACT — learning + results
  mint: '#c4f5e8', // DEPLOY — shipped containers
  bgNavy: '#0d1b2a', // backdrop (matches --bg-base)
} as const;

export type NeonKey = keyof typeof NEON;

/** Skill-cluster category → accent color (TRANSFORM station). */
export const CLUSTER_COLORS: Record<string, string> = {
  Languages: NEON.cyan,
  'AI / ML': NEON.pink,
  Backend: NEON.violet,
  Frontend: NEON.mint,
  'DevOps / Cloud': NEON.amber,
  Security: '#ff7d7d',
};

export function clusterColor(category: string): string {
  return CLUSTER_COLORS[category] ?? NEON.cyan;
}
