/**
 * StationImpact.tsx — Station 5. IMPACT = the results dashboard: headline
 * highlights + papers/awards. Thin titled wrapper around ImpactPanel.
 */
import { t } from '../../../../lib/i18n-helpers';
import type { ImpactData, Lang } from '../../../../lib/pipeline/pipeline-data-types';
import ImpactPanel from './ImpactPanel';

interface Props {
  lang: Lang;
  active: boolean;
  impact: ImpactData;
}

export default function StationImpact({ lang, active, impact }: Props) {
  return (
    <div className="journey-card journey-card--wide">
      <p className="journey-token">IMPACT</p>
      <p className="journey-eyebrow">{t('papers_eyebrow', lang)}</p>
      <h2 className="journey-title">{t('papers_title', lang)}</h2>
      <ImpactPanel lang={lang} active={active} impact={impact} />
    </div>
  );
}
