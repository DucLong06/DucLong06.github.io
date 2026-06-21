/**
 * palette.ts — Shared scene palette (port of prototype `PAL`).
 * Single source for accent colors used across helpers + station builders.
 */
import * as THREE from 'three';

export const PAL = {
  a1: 0x38e1ff, // cyan
  a2: 0xa06bff, // violet
  a3: 0xf5b449, // gold
  a4: 0x74f0a4, // mint
  a5: 0xec6ad0, // pink
  bg: 0x05070e,
} as const;

export const TAU = Math.PI * 2;

/** Hex → THREE.Color (port of prototype `C`). */
export const C = (h: number): THREE.Color => new THREE.Color(h);
