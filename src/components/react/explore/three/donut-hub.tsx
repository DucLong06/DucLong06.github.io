/**
 * donut-hub.tsx — The 6-wedge donut ring.
 *
 * Renders <DonutWedge> ×6 from WEDGES config + a focusable DOM <button> label per
 * wedge (drei <Html>) — the labels are the keyboard/SR path (real buttons), the
 * meshes are the pointer path. Idle float on the group while in hub mode (paused
 * when focused or reduced-motion). useFrame calls invalidate() so frameloop=demand
 * keeps animating during idle.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group } from 'three';
import DonutWedge from './donut-wedge';
import { WEDGES, wedgeAngle, HUB_RADIUS, type WedgeId } from '../wedges-config';
import type { TFn } from '../explore-i18n';

interface Props {
  hoveredId: WedgeId | null;
  focusedId: WedgeId | null;
  idle: boolean;
  reducedMotion: boolean;
  lite: boolean;
  t: TFn;
  onHover: (id: WedgeId | null) => void;
  onSelect: (id: WedgeId) => void;
}

const RADIUS = HUB_RADIUS;
const TUBE = 0.5;

export default function DonutHub({
  hoveredId,
  focusedId,
  idle,
  reducedMotion,
  lite,
  t,
  onHover,
  onSelect,
}: Props) {
  const groupRef = useRef<Group>(null);
  const tubular = lite ? 16 : 28;
  const labelR = RADIUS + TUBE + 0.55;

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    if (idle && !reducedMotion) {
      // Gentle vertical bob only — NO z-spin, so wedge angles stay fixed for the
      // camera look-at math (a focused wedge must stay centered).
      g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
      state.invalidate();
    }
  });

  return (
    <group ref={groupRef}>
      {WEDGES.map((w) => {
        const a = wedgeAngle(w.angleIndex);
        const label = t(w.labelKey);
        return (
          <group key={w.id}>
            <DonutWedge
              id={w.id}
              angleIndex={w.angleIndex}
              color={w.color}
              radius={RADIUS}
              tube={TUBE}
              tubularSegments={tubular}
              hovered={hoveredId === w.id}
              focused={focusedId === w.id}
              reducedMotion={reducedMotion}
              onHover={onHover}
              onSelect={onSelect}
            />
            <Html
              position={[Math.cos(a) * labelR, Math.sin(a) * labelR, 0]}
              center
              distanceFactor={9}
              zIndexRange={[20, 0]}
              className="wedge-label-wrap"
            >
              <button
                type="button"
                className="wedge-label"
                data-wedge={w.id}
                data-active={hoveredId === w.id || focusedId === w.id}
                aria-label={label}
                aria-current={focusedId === w.id ? 'true' : undefined}
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
