/**
 * CoreChrome.tsx — Minimal top bar over the Core scene: the name (reset) and the
 * universal "Classic view" escape hatch (switch to the 2D site). Reuses the
 * shared `.scene-chrome` / `.scene-btn` styles. The "Skip intro" affordance is
 * added in Phase 07 alongside the scroll guardrails.
 */
interface Props {
  name: string;
  lang: string;
  onExitToClassic: () => void;
}

export function CoreChrome({ name, lang, onExitToClassic }: Props) {
  const classicLabel = lang === 'vi' ? 'Giao diện cổ điển' : 'Classic view';
  return (
    <div className="scene-chrome">
      <span className="scene-chrome__home">{name}</span>
      <div className="scene-chrome__actions">
        <button type="button" className="scene-btn scene-btn--ghost" onClick={onExitToClassic}>
          {classicLabel}
        </button>
      </div>
    </div>
  );
}
