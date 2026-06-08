/**
 * offclock-panel.tsx — Detail panel for the Off-clock wedge.
 * DOM title/blurb/facts per interest (football, badminton). On tier 'full' with
 * motion enabled it mounts a tasteful mini 3D accent (lazy); otherwise shows the
 * static emoji (reduced-motion / lite / classic-safe).
 */
import { lazy, Suspense } from 'react';
import type { OffclockInterest } from '../explore-types';
import type { TFn } from '../explore-i18n';

const OffclockVisuals = lazy(() => import('../three/offclock-visuals'));

interface Props {
  data: OffclockInterest[];
  t: TFn;
  reducedMotion: boolean;
  lite: boolean;
}

export default function OffclockPanel({ data, t, reducedMotion, lite }: Props) {
  const showVisual = !reducedMotion && !lite;

  return (
    <div className="panel">
      <header className="panel__head">
        <p className="panel__eyebrow">{t('explore_offclock_eyebrow')}</p>
        <h2 className="panel__title" tabIndex={-1}>{t('explore_offclock_title')}</h2>
      </header>

      {/* A single shared 3D accent for the whole panel (one WebGL context, not one
          per card). Static emoji row when motion is off / lite / classic. */}
      <div className="offclock-visual offclock-visual--shared" aria-hidden="true">
        {showVisual ? (
          <Suspense fallback={<span className="offclock-card__emoji">{data[0]?.icon ?? '🎮'}</span>}>
            <OffclockVisuals />
          </Suspense>
        ) : (
          <span className="offclock-emoji-row">
            {data.map((it) => (
              <span key={it.key} className="offclock-card__emoji">{it.icon}</span>
            ))}
          </span>
        )}
      </div>

      <div className="offclock-grid">
        {data.map((it) => (
          <article key={it.key} className="offclock-card">
            <h3 className="offclock-card__title">
              <span aria-hidden="true">{it.icon}</span> {it.title}
            </h3>
            <p className="offclock-card__blurb">{it.blurb}</p>
            {it.facts.length > 0 && (
              <ul className="offclock-card__facts">
                {it.facts.map((f) => (
                  <li key={f.label} className="offclock-fact">
                    <span className="offclock-fact__value">{f.value}</span>
                    <span className="offclock-fact__label">{f.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
