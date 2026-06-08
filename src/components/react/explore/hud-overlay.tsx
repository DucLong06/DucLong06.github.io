/**
 * hud-overlay.tsx — Persistent DOM HUD over the canvas: CV download, Classic-view
 * link, and EN/VI language switch. Always visible (top corners). Real links →
 * keyboard reachable, no canvas dependency.
 */
import type { TFn, Lang } from './explore-i18n';

interface Props {
  t: TFn;
  locale: Lang;
  classicUrl: string;
  cvHref: string;
}

export default function HudOverlay({ t, locale, classicUrl, cvHref }: Props) {
  const otherLang: Lang = locale === 'vi' ? 'en' : 'vi';
  const otherExplore = otherLang === 'vi' ? '/vi/explore' : '/explore';

  return (
    <div className="hud-overlay">
      <a className="hud-logo" href={classicUrl} aria-label={t('nav_home_label')}>
        <span aria-hidden="true">HDL</span>
      </a>

      <div className="hud-controls">
        <a className="hud-btn" href={cvHref} download>
          <span aria-hidden="true">↓</span> {t('explore_cv')}
        </a>
        <a className="hud-btn" href={classicUrl}>
          <span aria-hidden="true">▤</span> {t('explore_to_classic')}
        </a>
        <a
          className="hud-btn hud-btn--lang"
          href={otherExplore}
          aria-label={`Switch to ${otherLang === 'en' ? 'English' : 'Tiếng Việt'}`}
        >
          {otherLang.toUpperCase()}
        </a>
      </div>
    </div>
  );
}
