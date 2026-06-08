/**
 * pie-sector-geometry.ts — Builds ONE thick pie slice: an annular sector extruded
 * along +Z with a bevelled rim (the machined-edge highlight). Centered on angle 0,
 * spanning THETA_LENGTH minus PIE_GAP on each side → visible seams between slices.
 * The extrude is re-centered on z=0 so PIE_FACE_Z marks the top face for the hub +
 * sprout bars. Pure (no React) — memoize the result per tier in the component.
 */
import { Shape, ExtrudeGeometry, type BufferGeometry } from 'three';
import { THETA_LENGTH, PIE_INNER, PIE_OUTER, PIE_DEPTH, PIE_GAP } from '../wedges-config';

export function makeSectorGeometry(curveSegments = 24): BufferGeometry {
  const a0 = PIE_GAP;
  const a1 = THETA_LENGTH - PIE_GAP;

  // Annular sector: outer arc CCW, then inner arc CW back → closed ring segment.
  const shape = new Shape();
  shape.absarc(0, 0, PIE_OUTER, a0, a1, false);
  shape.absarc(0, 0, PIE_INNER, a1, a0, true);
  shape.closePath();

  const geo = new ExtrudeGeometry(shape, {
    depth: PIE_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments,
  });
  // Extrude runs z: 0 → PIE_DEPTH. Center thickness on z=0 (keep XY for angle math).
  geo.translate(0, 0, -PIE_DEPTH / 2);
  geo.computeVertexNormals();
  return geo;
}
