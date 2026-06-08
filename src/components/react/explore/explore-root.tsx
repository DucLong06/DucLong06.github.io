/**
 * explore-root.tsx — Entry island for the /explore route (client:only).
 *
 * Responsibilities:
 *  - Run device capability detection (use-webgl-capability).
 *  - tier === 'classic' (no WebGL / very low-end) → render a DOM card linking to
 *    the classic portfolio (the a11y / fallback safety net).
 *  - otherwise → lazy-load the pie-hub scene (keeps three.js out of the / chunk)
 *    inside Suspense with a lightweight skeleton.
 *
 * All content arrives pre-resolved as the `data` prop (assembled server-side).
 */
import { lazy, Suspense } from 'react';
import { useWebGLCapability } from './use-webgl-capability';
import { makeT } from './explore-i18n';
import type { ExploreData, Lang } from './explore-types';

const PieHubScene = lazy(() => import('./pie-hub-scene'));

interface Props {
  locale: Lang;
  classicUrl: string;
  cvHref: string;
  data: ExploreData;
}

function LoadingSkeleton({ label, hint, classicUrl }: { label: string; hint: string; classicUrl: string }) {
  return (
    <div className="explore-state" role="status" aria-live="polite">
      <div className="explore-spinner" aria-hidden="true" />
      <p className="explore-state__title">{label}</p>
      <a className="explore-state__link" href={classicUrl}>
        {hint}
      </a>
    </div>
  );
}

function ClassicFallbackCard({
  title,
  body,
  cta,
  cvLabel,
  classicUrl,
  cvHref,
}: {
  title: string;
  body: string;
  cta: string;
  cvLabel: string;
  classicUrl: string;
  cvHref: string;
}) {
  return (
    <div className="explore-state explore-state--card" role="region" aria-label={title}>
      <h1 className="explore-state__title">{title}</h1>
      <p className="explore-state__body">{body}</p>
      <div className="explore-state__actions">
        <a className="explore-btn explore-btn--primary" href={classicUrl}>
          {cta} <span aria-hidden="true">→</span>
        </a>
        <a className="explore-btn explore-btn--ghost" href={cvHref} download>
          {cvLabel}
        </a>
      </div>
    </div>
  );
}

export default function ExploreRoot({ locale, classicUrl, cvHref, data }: Props) {
  const cap = useWebGLCapability();
  const t = makeT(locale);

  if (!cap.ready) {
    return (
      <LoadingSkeleton
        label={t('explore_loading')}
        hint={t('explore_loading_hint')}
        classicUrl={classicUrl}
      />
    );
  }

  if (cap.tier === 'classic') {
    return (
      <ClassicFallbackCard
        title={t('explore_fallback_title')}
        body={t('explore_fallback_body')}
        cta={t('explore_view_classic')}
        cvLabel={t('explore_cv')}
        classicUrl={classicUrl}
        cvHref={cvHref}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <LoadingSkeleton
          label={t('explore_loading')}
          hint={t('explore_loading_hint')}
          classicUrl={classicUrl}
        />
      }
    >
      <PieHubScene
        locale={locale}
        tier={cap.tier}
        reducedMotion={cap.reducedMotion}
        classicUrl={classicUrl}
        cvHref={cvHref}
        data={data}
      />
    </Suspense>
  );
}
