/**
 * StationIngest.tsx — Station 1. Raw data INGEST = the bio/origin. Renders the
 * same bio prose the 2D About section uses (bold preserved), as real DOM text.
 */
import { t } from '../../../../lib/i18n-helpers';
import type { Lang } from '../../../../lib/pipeline/pipeline-data-types';

interface Props {
  lang: Lang;
  bioParagraphs: string[];
}

export default function StationIngest({ lang, bioParagraphs }: Props) {
  return (
    <div className="journey-card journey-card--wide">
      <p className="journey-token">INGEST</p>
      <p className="journey-eyebrow">{t('about_eyebrow', lang)}</p>
      <h2 className="journey-title">{t('about_title', lang)}</h2>
      <div className="journey-prose">
        {bioParagraphs.slice(0, 3).map((html, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </div>
    </div>
  );
}
