/**
 * neon-material.ts — Shared emissive + glass material factories for the
 * Quantum Data World structures (ported from the prototype `emat`).
 */
import {
  AdditiveBlending,
  DoubleSide,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type ColorRepresentation,
} from 'three';

/** Emissive standard material (color also drives emissive). */
export function emat(color: ColorRepresentation, emi = 0.6): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: emi,
    metalness: 0.5,
    roughness: 0.4,
  });
}

/** Tinted additive glass sheen pane (front panels, sheens). */
export function glassMat(color: ColorRepresentation, opacity = 0.14): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: AdditiveBlending,
    depthWrite: false,
    side: DoubleSide,
  });
}
