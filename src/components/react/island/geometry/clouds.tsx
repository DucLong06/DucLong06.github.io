/**
 * clouds.tsx — Enhanced low-poly clay clouds drifting around the island.
 *
 * Config-driven (CLOUDS array) so the look is tunable in one place. Each cloud
 * is 4–6 overlapping flat-shaded spheres of varied radii, slightly squashed for
 * a flat-bottom read, with a faint violet underside tint that reads as volume
 * under the hemisphere light. Each cloud drifts + bobs independently (own
 * useFrame) instead of the old single lockstep group. No shadows; stays within
 * fog range (22–46). Near-zero GPU cost: ≤6 clouds × ≤6 low-seg spheres.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';

interface CloudConfig {
  pos: Vec3; // anchor (y ~5–7, within fog)
  scale: number; // 0.7–1.3 size variety
  speed: number; // horizontal drift speed
  phase: number; // desync offset so clouds don't move in lockstep
  bob: number; // vertical bob amplitude
}

/** A puff: [x, y, z, radius, underside?] — underside puffs get the violet tint. */
type Puff = [number, number, number, number, boolean?];

/** Faint violet underside tint → subtle volume; kept ≤15% read, not dirty. */
const UNDERSIDE = '#cdb8ff';

const CLOUDS: CloudConfig[] = [
  { pos: [-6, 5.6, -3], scale: 1.15, speed: 0.05, phase: 0.0, bob: 0.18 },
  { pos: [6.5, 6.2, 1], scale: 1.0, speed: 0.04, phase: 1.7, bob: 0.22 },
  { pos: [2, 6.9, -5], scale: 0.85, speed: 0.06, phase: 3.1, bob: 0.15 },
  { pos: [-4.5, 6.6, 4], scale: 0.95, speed: 0.045, phase: 4.4, bob: 0.2 },
  { pos: [5, 5.4, -3.5], scale: 0.75, speed: 0.055, phase: 2.2, bob: 0.16 },
  { pos: [0.5, 7.2, 3.5], scale: 1.05, speed: 0.038, phase: 5.5, bob: 0.24 },
];

/** Overlapping spheres forming one cloud silhouette (varied radii, flat base). */
const PUFFS: Puff[] = [
  [0, 0, 0, 0.72],
  [0.78, -0.06, 0.05, 0.5],
  [-0.74, -0.04, -0.08, 0.55],
  [0.28, 0.34, -0.1, 0.42],
  [-0.3, -0.18, 0.12, 0.4, true],
  [0.42, -0.2, -0.05, 0.38, true],
];

function Cloud({ cfg }: { cfg: CloudConfig }) {
  const ref = useRef<Group>(null);
  const [bx, by, bz] = cfg.pos;

  useFrame(({ clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.position.x = bx + Math.sin(t * cfg.speed + cfg.phase) * 1.4;
    g.position.y = by + Math.sin(t * cfg.speed * 0.6 + cfg.phase) * cfg.bob;
    g.rotation.y += dt * 0.02; // very slow turn
  });

  return (
    <group ref={ref} position={[bx, by, bz]}>
      {/* scale-y squash gives a flatter cloud base read */}
      <group scale={[cfg.scale, cfg.scale * 0.8, cfg.scale]}>
        {PUFFS.map(([x, y, z, r, under], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 8, 8]} />
            <meshStandardMaterial
              color={under ? UNDERSIDE : PALETTE.white}
              flatShading
              roughness={1}
              metalness={0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Clouds() {
  return (
    <>
      {CLOUDS.map((c, i) => (
        <Cloud key={i} cfg={c} />
      ))}
    </>
  );
}
