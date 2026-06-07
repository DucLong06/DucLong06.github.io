/**
 * StationEndpoint.tsx — Station 6 (terminus). ENDPOINT = contact rendered as an
 * API response card. Thin titled wrapper around EndpointCard.
 */
import { t } from '../../../../lib/i18n-helpers';
import type { EndpointData, Lang } from '../../../../lib/pipeline/pipeline-data-types';
import EndpointCard from './EndpointCard';

interface Props {
  lang: Lang;
  endpoint: EndpointData;
}

export default function StationEndpoint({ lang, endpoint }: Props) {
  return (
    <div className="journey-card">
      <p className="journey-token">ENDPOINT</p>
      <p className="journey-eyebrow">{t('contact_eyebrow', lang)}</p>
      <h2 className="journey-title">{t('contact_title', lang)}</h2>
      <EndpointCard lang={lang} endpoint={endpoint} />
    </div>
  );
}
