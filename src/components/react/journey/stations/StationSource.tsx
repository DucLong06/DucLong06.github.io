/**
 * StationSource.tsx — Station 0 (hero). The data SOURCE: name, tagline, primary
 * CTAs and an animated scroll cue. Mirrors the 2D hero copy (content-first).
 */
import { t } from '../../../../lib/i18n-helpers';
import type { Lang } from '../../../../lib/pipeline/pipeline-data-types';

interface Props {
  lang: Lang;
  name: string;
  tagline: string;
  email: string;
  cvFile: string;
  active: boolean;
  onJumpToWork: () => void;
}

export default function StationSource({
  lang,
  name,
  tagline,
  email,
  cvFile,
  active,
  onJumpToWork,
}: Props) {
  return (
    <div className="station-source">
      <p className="journey-token">SOURCE</p>
      <h1 className="journey-name">{name}</h1>
      <p className="journey-lead">
        {tagline}
        <br />
        {t('hero_tech_stack', lang)}
      </p>
      <p className="journey-meta">
        {t('hero_meta', lang)}
        <br />
        🏆 {t('hero_award_alqac', lang)} · 🏅 {t('hero_award_saokhe', lang)}
      </p>

      <div className="journey-ctas" role="list">
        <button className="journey-cta journey-cta--primary" role="listitem" onClick={onJumpToWork}>
          {t('hero_cta_work', lang)} <span aria-hidden="true">→</span>
        </button>
        <a className="journey-cta journey-cta--ghost" role="listitem" href={cvFile} download>
          {t('hero_cta_cv', lang)}
        </a>
        <a className="journey-cta journey-cta--ghost" role="listitem" href={`mailto:${email}`}>
          {t('hero_cta_email', lang)}
        </a>
      </div>

      <p className="journey-scroll-cue" aria-hidden={!active}>
        <span className="journey-scroll-cue__dot" />
        {t('journey_scroll_cue', lang)}
      </p>
    </div>
  );
}
