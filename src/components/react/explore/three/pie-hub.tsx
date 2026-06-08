/**
 * pie-hub.tsx — The solid-pie hub: 6 thick slices + focusable DOM labels.
 *
 * Slices share one memoized sector geometry (tier-scaled curve segments). The group
 * z-spins slowly while idle; on hover it SOFT-BRAKES (angular velocity eased to 0)
 * so a slice can be aimed at. The live spin angle is mirrored into `spinRef` so the
 * camera-rig can compute the slice's true world angle at dive time (no unwind snap).
 * Labels are real <button>s in a drei <Html> (the keyboard/SR path); meshes are the
 * pointer path — same dual-path contract as the old donut hub.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group } from 'three';
import PieSlice from './pie-slice';
import { makeSectorGeometry } from './pie-sector-geometry';
import { WEDGES, wedgeAngle, PIE_OUTER, PIE_FACE_Z, type WedgeId } from '../wedges-config';
import type { TFn } from '../explore-i18n';

interface Props {
  hoveredId: WedgeId | null;
  focusedId: WedgeId | null; // the slice under the dive (diving|stage|retracting)
  idle: boolean;
  reducedMotion: boolean;
  lite: boolean;
  full: boolean;
  t: TFn;
  spinRef: React.MutableRefObject<number>;
  onHover: (id: WedgeId | null) => void;
  onSelect: (id: WedgeId) => void;
}

const SPIN_SPEED = 0.16; // rad/s idle
const LABEL_R = PIE_OUTER + 0.5;

export default function PieHub({
  hoveredId,
  focusedId,
  idle,
  reducedMotion,
  lite,
  full,
  t,
  spinRef,
  onHover,
  onSelect,
}: Props) {
  const groupRef = useRef<Group>(null);
  const velRef = useRef(0);
  const geometry = useMemo(() => makeSectorGeometry(lite ? 12 : 24), [lite]);

  // Manually-created geometry is ours to free (R3F only auto-disposes JSX-created
  // geometry). Runs on unmount AND when `lite` flips the memo to a new geometry.
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (reducedMotion) return;

    // Idle spin unless a slice is hovered (soft-brake) or we've left hub.
    const targetVel = idle && !hoveredId ? SPIN_SPEED : 0;
    velRef.current += (targetVel - velRef.current) * (1 - Math.pow(0.01, delta));
    if (Math.abs(velRef.current) > 0.0005) {
      g.rotation.z += velRef.current * delta;
      state.invalidate();
    }
    // Mirror the live angle EVERY tick (even as the brake settles below the velocity
    // threshold) so the camera-rig + sprout-bars read the true parked angle at dive.
    spinRef.current = g.rotation.z;
  });

  return (
    <group ref={groupRef}>
      {WEDGES.map((w) => {
        const a = wedgeAngle(w.angleIndex);
        const label = t(w.labelKey);
        const focused = focusedId === w.id;
        const dimmed = (hoveredId !== null && hoveredId !== w.id) || (focusedId !== null && !focused);
        return (
          <group key={w.id}>
            <PieSlice
              id={w.id}
              angleIndex={w.angleIndex}
              color={w.color}
              geometry={geometry}
              hovered={hoveredId === w.id}
              focused={focused}
              dimmed={dimmed}
              acrylic={focused && full && !reducedMotion}
              reducedMotion={reducedMotion}
              onHover={onHover}
              onSelect={onSelect}
            />
            <Html
              position={[Math.cos(a) * LABEL_R, Math.sin(a) * LABEL_R, PIE_FACE_Z]}
              center
              distanceFactor={9}
              zIndexRange={[20, 0]}
              className="wedge-label-wrap"
            >
              <button
                type="button"
                className="wedge-label"
                data-wedge={w.id}
                data-active={hoveredId === w.id || focused}
                aria-label={label}
                aria-current={focused ? 'true' : undefined}
                style={{ ['--wedge-color' as string]: w.color }}
                onPointerEnter={() => onHover(w.id)}
                onPointerLeave={() => onHover(null)}
                onFocus={() => onHover(w.id)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(w.id)}
              >
                <span className="wedge-label__icon" aria-hidden="true">{w.icon}</span>
                <span className="wedge-label__text">{label}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
