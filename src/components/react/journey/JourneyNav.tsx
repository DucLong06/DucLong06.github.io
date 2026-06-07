/**
 * JourneyNav.tsx — Fixed vertical "jump to station" rail. Each dot is a labelled
 * button that smooth-scrolls to its station; the active station is highlighted.
 * Keyboard-operable and screen-reader-labelled (pipeline stage + section name).
 */
import { t } from '../../../lib/i18n-helpers';
import { STATION_META } from '../../../lib/pipeline/pipeline-stations';
import { STATIONS } from './journey-config';
import type { Lang } from '../../../lib/pipeline/pipeline-data-types';

interface Props {
  lang: Lang;
  station: number;
  onJump: (index: number) => void;
}

export default function JourneyNav({ lang, station, onJump }: Props) {
  return (
    <nav className="journey-nav" aria-label={t('journey_nav_label', lang)}>
      <ul role="list">
        {STATION_META.map((meta, i) => {
          const label = meta.title ? `${meta.token} — ${t(meta.title, lang)}` : meta.token;
          return (
            <li key={meta.id}>
              <button
                className="journey-nav__dot"
                data-active={station === i}
                aria-current={station === i ? 'true' : undefined}
                aria-label={label}
                style={{ ['--station-accent' as string]: STATIONS[i].accent }}
                onClick={() => onJump(i)}
              >
                <span className="journey-nav__token">{meta.token}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
