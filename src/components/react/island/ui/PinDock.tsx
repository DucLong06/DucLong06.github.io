/**
 * PinDock.tsx — Bottom dock listing the 6 sections as an explicit, keyboard-
 * friendly nav (mirrors the floating 3D pins). Highlights the active section.
 */
import type { SectionId } from '../../../../lib/scene/scene-data-types';
import { SECTIONS } from '../scene-config';

interface Props {
  activeId: SectionId | null;
  t: (key: string) => string;
  onSelect: (id: SectionId) => void;
}

export function PinDock({ activeId, t, onSelect }: Props) {
  return (
    <nav className="scene-dock" aria-label="Sections">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`scene-dock__btn${activeId === s.id ? ' is-active' : ''}`}
          style={{ ['--accent' as string]: s.color }}
          onClick={() => onSelect(s.id)}
          aria-pressed={activeId === s.id}
        >
          <span className="scene-dock__dot" aria-hidden="true" />
          {t(s.labelKey)}
        </button>
      ))}
    </nav>
  );
}
