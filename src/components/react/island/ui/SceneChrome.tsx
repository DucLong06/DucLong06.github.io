/**
 * SceneChrome.tsx — Top bar over the scene: name/home button and the
 * "Classic view" toggle (switch to the 2D site). Shows a "back to island"
 * affordance when a section is focused.
 */
import type { SectionId } from '../../../../lib/scene/scene-data-types';

interface Props {
  name: string;
  focusedId: SectionId | null;
  onHome: () => void;
  onExitToClassic: () => void;
}

export function SceneChrome({ name, focusedId, onHome, onExitToClassic }: Props) {
  return (
    <div className="scene-chrome">
      <button type="button" className="scene-chrome__home" onClick={onHome} aria-label={`${name} — reset view`}>
        {name}
      </button>

      <div className="scene-chrome__actions">
        {focusedId && (
          <button type="button" className="scene-btn scene-btn--ghost" onClick={onHome}>
            ← Back to island
          </button>
        )}
        <button type="button" className="scene-btn scene-btn--ghost" onClick={onExitToClassic}>
          Classic view
        </button>
      </div>
    </div>
  );
}
