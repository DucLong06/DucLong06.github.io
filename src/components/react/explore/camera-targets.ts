/**
 * camera-targets.ts — Pure look-at math for the hub ⇄ slice cinematic dive.
 *
 * Deterministic (no three import) so reduced-motion snap and the animated arc use
 * the EXACT same destinations. Returns CameraControls.setLookAt args:
 * [posX, posY, posZ, targetX, targetY, targetZ].
 *
 * The disc lives in the XY plane (normal +Z). hubLookAt is an OBLIQUE vantage →
 * the disc reads as a tilted cake showing its thickness. stageLookAt is FACE-ON,
 * centered on a slice → the "top-down stage". diveWaypoint is a blended midpoint
 * pulled slightly inward so the two-leg move reads as a curved arc, not a straight
 * dolly. `spin` is the pie's frozen idle-spin offset at dive time so the math
 * tracks the slice's true world angle.
 */
import { wedgeAngle, getWedge, PIE_MID, type WedgeId } from './wedges-config';

export type LookAt = [number, number, number, number, number, number];

/** Oblique overview camera (below-front) → tilted-cake look with visible depth. */
const HUB_POS: readonly [number, number, number] = [0, -5.6, 5.4];
/** Face-on distance from the slice surface when parked on the stage. */
const STAGE_DIST = 4.4;

function sliceCentroid(id: WedgeId, spin: number): [number, number] {
  const a = wedgeAngle(getWedge(id).angleIndex) + spin;
  return [Math.cos(a) * PIE_MID, Math.sin(a) * PIE_MID];
}

/** Overview: straight at the disc center from the oblique vantage. */
export function hubLookAt(): LookAt {
  return [HUB_POS[0], HUB_POS[1], HUB_POS[2], 0, 0, 0];
}

/** Face-on, centered over the slice — the stage. */
export function stageLookAt(id: WedgeId, spin = 0): LookAt {
  const [cx, cy] = sliceCentroid(id, spin);
  return [cx, cy, STAGE_DIST, cx, cy, 0];
}

/**
 * Mid-flight waypoint: blend of hub + stage camera positions, dipped closer (−Z bias
 * on the average height) so chaining hub→waypoint→stage swings as an arc. Target
 * lerps halfway from center toward the slice centroid.
 */
export function diveWaypoint(id: WedgeId, spin = 0): LookAt {
  const [cx, cy] = sliceCentroid(id, spin);
  const px = (HUB_POS[0] + cx) / 2;
  const py = (HUB_POS[1] + cy) / 2;
  const pz = (HUB_POS[2] + STAGE_DIST) / 2 - 0.6;
  return [px, py, pz, cx * 0.5, cy * 0.5, 0];
}
