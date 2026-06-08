/**
 * wedge-nav.tsx — Persistent DOM nav shown in focused mode.
 * Lets the user jump wedge → wedge directly (no return to center) + back to hub.
 * Config-driven (wedges-config), aria-current marks the active wedge, Esc → hub.
 * Real <button>s → full keyboard/SR parity.
 */
import { useEffect } from 'react';
import { WEDGES, type WedgeId } from './wedges-config';
import type { TFn } from './explore-i18n';

interface Props {
  focusedId: WedgeId | null;
  t: TFn;
  onFocus: (id: WedgeId) => void;
  onHub: () => void;
}

export default function WedgeNav({ focusedId, t, onFocus, onHub }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onHub();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onHub]);

  return (
    <nav className="wedge-nav" aria-label={t('graph_nav_label')}>
      <button type="button" className="wedge-nav__hub" onClick={onHub}>
        <span aria-hidden="true">◉</span> {t('explore_back_hub')}
      </button>
      <ul className="wedge-nav__list" role="list">
        {WEDGES.map((w) => (
          <li key={w.id}>
            <button
              type="button"
              className="wedge-nav__item"
              data-active={focusedId === w.id}
              aria-current={focusedId === w.id ? 'true' : undefined}
              style={{ ['--wedge-color' as string]: w.color }}
              onClick={() => onFocus(w.id)}
            >
              <span aria-hidden="true">{w.icon}</span>
              <span className="wedge-nav__label">{t(w.labelKey)}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
