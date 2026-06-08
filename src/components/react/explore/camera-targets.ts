/**
 * camera-targets.ts — Pure look-at math for the hub ⇄ slice cinematic dive.
 *
 * Deterministic (no three import) so reduced-motion snap and the animated arc use
 * the EXACT same destinations. Returns CameraControls.setLookAt args:
 * [posX, posY, posZ, targetX, targetY, targetZ].
 *
 * The disc lives in the XY plane (normal +Z); slices extrude along +Z and stage bars
 * sprout along +Z. So the focused view is an OBLIQUE 3/4 angle (NOT face-on top-down,
 * which would look straight down the bars and flatten them). hubLookAt is a steep,
 * close oblique → tilted-cake with visible thickness, filling the frame. stageLookAt
 * flies in closer onto one slice and biases it RIGHT so the left DOM panel never
 * covers the slice / its sprouting bars. `spin` is the pie's frozen idle-spin offset
 * at dive time so the math tracks the slice's true world angle.
 */
import { wedgeAngle, getWedge, PIE_MID, type WedgeId } from './wedges-config';

export type LookAt = [number, number, number, number, number, number];

/** Oblique overview (below-front, steep, close) → thick tilted cake, fills frame. */
const HUB_POS: readonly [number, number, number] = [0, -5.0, 3.7];
/** How far left of the slice to center the focused frame → slice sits on the right. */
const STAGE_SIDE = 1.25;

function centroid(id: WedgeId, spin: number): [number, number] {
  const a = wedgeAngle(getWedge(id).angleIndex) + spin;
  return [Math.cos(a) * PIE_MID, Math.sin(a) * PIE_MID];
}

/** Overview: straight at the disc center from the steep oblique vantage. */
export function hubLookAt(): LookAt {
  return [HUB_POS[0], HUB_POS[1], HUB_POS[2], 0, 0, 0];
}

/**
 * Focused stage: a close oblique 3/4 view onto the slice, framed left-of-slice so the
 * slice + standing bars read on the right while the DOM panel occupies the left.
 */
export function stageLookAt(id: WedgeId, spin = 0): LookAt {
  const [cx, cy] = centroid(id, spin);
  const fx = cx - STAGE_SIDE; // frame center sits left of the slice
  return [fx, cy - 3.2, 3.4, fx, cy + 0.2, 0.25];
}

/**
 * Mid-flight waypoint: blend of hub + stage camera positions, dipped closer so chaining
 * hub→waypoint→stage swings as an arc rather than a straight dolly.
 */
export function diveWaypoint(id: WedgeId, spin = 0): LookAt {
  const [cx, cy] = centroid(id, spin);
  const sx = cx - STAGE_SIDE;
  const px = (HUB_POS[0] + sx) / 2;
  const py = (HUB_POS[1] + (cy - 3.2)) / 2 - 0.4;
  const pz = (HUB_POS[2] + 3.4) / 2;
  return [px, py, pz, cx * 0.5 - 0.5, cy * 0.5, 0.15];
}
