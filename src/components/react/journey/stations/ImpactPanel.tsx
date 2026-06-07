/**
 * ImpactPanel.tsx — IMPACT content: headline highlights (with accent treatment)
 * + paper/award cards. All values + links are real DOM. Fades in when active.
 */
import { motion } from 'framer-motion';
import { t } from '../../../../lib/i18n-helpers';
import type { ImpactData, Lang } from '../../../../lib/pipeline/pipeline-data-types';

interface Props {
  lang: Lang;
  active: boolean;
  impact: ImpactData;
}

export default function ImpactPanel({ lang, active, impact }: Props) {
  return (
    <div className="impact-wrap">
      <div className="impact-highlights" role="list" aria-label={t('graph_panel_metrics', lang)}>
        {impact.highlights.map((h, i) => (
          <motion.div
            key={h.label}
            role="listitem"
            className="impact-stat"
            data-accent={h.accent}
            initial={{ opacity: 0, y: 14 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.4, delay: active ? i * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="impact-stat__value">{h.value}</span>
            <span className="impact-stat__label">{h.label}</span>
          </motion.div>
        ))}
      </div>

      <ul className="paper-list" role="list">
        {impact.papers.map((p) => (
          <li key={p.title} className="paper-card">
            <div className="paper-card__head">
              <span className="paper-card__year">{p.year}</span>
              {p.award && <span className="paper-card__award">{p.award}</span>}
            </div>
            <h3 className="paper-card__title">
              {p.link ? (
                <a href={p.link} target="_blank" rel="noopener noreferrer">
                  {p.title}
                </a>
              ) : (
                p.title
              )}
            </h3>
            <p className="paper-card__venue">{p.venue}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
