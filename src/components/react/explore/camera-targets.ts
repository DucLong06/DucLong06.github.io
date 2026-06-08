/**
 * camera-targets.ts — Pure look-at math for the hub ⇄ focused camera.
 * Deterministic (no three import) so reduced-motion snap and animated dolly use the
 * exact same destination. Returns CameraControls.setLookAt args:
 * [posX, posY, posZ, targetX, targetY, targetZ].
 */
import { wedgeAngle, HUB_RADIUS, type WedgeId, getWedge } from './wedges-config';

export type LookAt = [number, number, number, number, number, number];

const HUB_DISTANCE = 8;
const FOCUS_DISTANCE = 4.2;

/** Overview: straight-on, donut centered. */
export function hubLookAt(): LookAt {
  return [0, 0, HUB_DISTANCE, 0, 0, 0];
}

/**
 * Focused: dolly closer and shift the camera partway toward the wedge's side so it
 * tilts in without rolling. Target sits between center and the wedge so the wedge
 * reads as the subject while the ring stays in frame behind the DOM overlay.
 */
export function wedgeLookAt(id: WedgeId): LookAt {
  const a = wedgeAngle(getWedge(id).angleIndex);
  const wx = Math.cos(a) * HUB_RADIUS;
  const wy = Math.sin(a) * HUB_RADIUS;
  return [wx * 0.55, wy * 0.55, FOCUS_DISTANCE, wx * 0.85, wy * 0.85, 0];
}
