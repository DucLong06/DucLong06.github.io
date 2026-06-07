/**
 * Pins.tsx — Floating clickable hotspots above each section prop (in-canvas via
 * drei <Html>). Clicking a pin focuses that section. Pins gently bob and the
 * active one is highlighted; the rest dim while a popup is open.
 */
import { Html } from '@react-three/drei';
import { Float } from '@react-three/drei';
import type { SectionId } from '../../../lib/scene/scene-data-types';
import { SECTIONS } from './scene-config';

interface Props {
  activeId: SectionId | null;
  labelFor: (key: string) => string;
  onSelect: (id: SectionId) => void;
}

export function Pins({ activeId, labelFor, onSelect }: Props) {
  return (
    <>
      {SECTIONS.map((s) => {
        const isActive = activeId === s.id;
        const dimmed = activeId !== null && !isActive;
        return (
          <Float key={s.id} speed={3} floatIntensity={0.6} rotationIntensity={0} position={s.pin}>
            <Html center distanceFactor={11} zIndexRange={[20, 0]} className="pin-html">
              <button
                type="button"
                className={`scene-pin${isActive ? ' is-active' : ''}${dimmed ? ' is-dim' : ''}`}
                style={{ ['--pin' as string]: s.color }}
                onClick={() => onSelect(s.id)}
                aria-label={labelFor(s.labelKey)}
                aria-pressed={isActive}
              >
                <span className="scene-pin__dot" aria-hidden="true" />
                <span className="scene-pin__label">{labelFor(s.labelKey)}</span>
              </button>
            </Html>
          </Float>
        );
      })}
    </>
  );
}
