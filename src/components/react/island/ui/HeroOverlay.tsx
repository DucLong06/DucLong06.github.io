/**
 * HeroOverlay.tsx — Intro overlay shown on load over the island: name, tagline,
 * award chips, and CTAs. Dismisses to reveal/explore the scene. The same info is
 * in the SSR'd 2D site, so this is presentation only.
 */
import type { SceneData } from '../../../../lib/scene/scene-data-types';

interface Props {
  data: SceneData;
  t: (key: string) => string;
  onExplore: () => void;
  onViewWork: () => void;
}

export function HeroOverlay({ data, t, onExplore, onViewWork }: Props) {
  const p = data.profile;
  const awards = [t('hero_award_alqac'), t('hero_award_saokhe')].filter(Boolean);

  return (
    <div className="scene-hero" role="region" aria-label="Introduction">
      <div className="scene-hero__card">
        <p className="scene-hero__eyebrow">{p.location}</p>
        {/* Not an <h1> — the SSR'd 2D Hero owns the document heading; this overlay
            is a presentational duplicate, so use a styled non-heading element. */}
        <p className="scene-hero__name" aria-hidden="true">{p.name}</p>
        <p className="scene-hero__tagline">{p.tagline}</p>

        <ul className="scene-hero__chips" aria-label="Awards">
          {awards.map((a) => (
            <li key={a} className="scene-hero__chip">🏆 {a}</li>
          ))}
        </ul>

        <div className="scene-hero__cta">
          <button type="button" className="scene-btn scene-btn--primary" onClick={onExplore}>
            Explore the island
          </button>
          <button type="button" className="scene-btn" onClick={onViewWork}>
            {t('hero_cta_work')}
          </button>
          <a className="scene-btn" href={p.cvFile} target="_blank" rel="noopener noreferrer" download>
            {t('hero_cta_cv')}
          </a>
          <a className="scene-btn" href={`mailto:${p.email}`}>
            {t('hero_cta_email')}
          </a>
        </div>

        <p className="scene-hero__hint">Click a glowing pin to visit a section · drag to orbit</p>
      </div>
    </div>
  );
}
