/**
 * spotlight-cone.ts — Soft additive "gallery downlight" cone + bright cap halo
 * (ported from the prototype `makeSpotCone`). Purely visual; no real light cost.
 */
import {
  AdditiveBlending,
  ConeGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  type ColorRepresentation,
} from 'three';
import { makeHalo } from './neon-halo';

/** Open faint cone with a glowing cap, pointing up by default. */
export function makeSpotCone(
  color: ColorRepresentation,
  radius = 0.9,
  height = 2.2,
  opacity = 0.16,
): Group {
  const grp = new Group();
  const cone = new Mesh(
    new ConeGeometry(radius, height, 28, 1, true),
    new MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: AdditiveBlending,
      depthWrite: false,
      side: DoubleSide,
    }),
  );
  cone.position.y = height / 2;
  grp.add(cone);
  const cap = makeHalo(color, radius * 1.3);
  cap.position.y = height;
  cap.material.opacity = opacity * 1.6;
  grp.add(cap);
  return grp;
}
