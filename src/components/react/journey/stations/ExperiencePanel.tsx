/**
 * ExperiencePanel.tsx — Detail panel for one career epoch (TRAIN). Role, period,
 * stack, and each project with animated metric counters + award badges. Reuses
 * the shared JourneyPanel shell + MetricCounter (DRY) and .metric-card styling.
 */
import { t } from '../../../../lib/i18n-helpers';
import { MetricCounter } from '../../graph/panels/metric-counter';
import JourneyPanel from './JourneyPanel';
import type { ExperienceEpoch, Lang } from '../../../../lib/pipeline/pipeline-data-types';

interface Props {
  lang: Lang;
  accent: string;
  epoch: ExperienceEpoch;
  onClose: () => void;
}

export default function ExperiencePanel({ lang, accent, epoch, onClose }: Props) {
  return (
    <JourneyPanel
      title={epoch.company}
      accent={accent}
      closeLabel={t('graph_panel_close', lang)}
      onClose={onClose}
    >
      <p className="panel-subhead">
        {epoch.role} · {epoch.periodLabel}
      </p>

      <ul className="panel-pills" aria-label={t('graph_panel_tech', lang)}>
        {epoch.stack.map((s) => (
          <li key={s} className="panel-pill">
            {s}
          </li>
        ))}
      </ul>

      {epoch.projects.map((proj) => (
        <div key={proj.name} className="exp-project">
          <h4 className="exp-project__name">{proj.name}</h4>
          <p className="panel-summary">{proj.summary}</p>
          {proj.metrics.length > 0 && (
            <div className="metric-grid">
              {proj.metrics.map((m) =>
                m.kind === 'award' ? (
                  <div key={m.label} className="metric-card metric-card--award">
                    <span className="metric-card__award">🏅 {m.text}</span>
                    <span className="metric-card__label">{m.label}</span>
                  </div>
                ) : (
                  <div key={m.label} className="metric-card">
                    <span className="metric-card__count">
                      <MetricCounter value={m.value} suffix={m.suffix} lang={lang} />
                    </span>
                    <span className="metric-card__label">{m.label}</span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </JourneyPanel>
  );
}
