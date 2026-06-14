/**
 * built-structure.ts — Shared bridge between an imperative Three.js builder and
 * the r3f render loop. Each structure builds its group once (useMemo) and exposes
 * an `update(t)` ticked every frame. This keeps the faithful prototype port while
 * living inside the r3f tree as a single `<primitive>`.
 */
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

export interface BuiltStructure {
  group: Group;
  /** Per-frame animation, driven by elapsed clock time (seconds). */
  update: (t: number) => void;
}

/** Build the structure once and tick its `update` each frame; returns the group. */
export function useBuilt(build: () => BuiltStructure): Group {
  const built = useMemo(build, []);
  useFrame((state) => built.update(state.clock.elapsedTime));
  return built.group;
}
