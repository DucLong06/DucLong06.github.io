/**
 * ProjectDetailPanel.tsx — Body for a clicked project node. Surfaces EVERY
 * metric (no truncation): percentages as radial rings, counts as count-ups,
 * awards as badges — plus summary, tech pills and repo/demo links.
 */
import type { GraphNode, Lang } from '../../../../lib/graph/graph-data-types';
import { STRINGS } from '../../../../i18n/strings';
import { MetricCounter } from './metric-counter';
import { RadialRing } from './radial-ring';

interface Props {
  node: GraphNode;
  lang: Lang;
}

export function ProjectDetailPanel({ node, lang }: Props) {
  const str = STRINGS[lang];
  const metrics = node.metrics ?? [];

  return (
    <div className="panel-body">
      {node.summary && <p className="panel-summary">{node.summary}</p>}

      {metrics.length > 0 && (
        <>
          <h4 className="panel-subhead">{str.graph_panel_metrics}</h4>
          <div className="metric-grid">
            {metrics.map((m, i) => {
              if (m.kind === 'award') {
                return (
                  <div key={i} className="metric-card metric-card--award">
                    <span className="metric-card__award">🏆 {m.text}</span>
                    <span className="metric-card__label">{m.label}</span>
                  </div>
                );
              }
              if (m.kind === 'percent') {
                return (
                  <div key={i} className="metric-card">
                    <RadialRing percent={m.value} color={node.color}>
                      <MetricCounter value={m.value} suffix={m.suffix} lang={lang} />
                    </RadialRing>
                    <span className="metric-card__label">{m.label}</span>
                  </div>
                );
              }
              return (
                <div key={i} className="metric-card">
                  <span className="metric-card__count">
                    <MetricCounter value={m.value} suffix={m.suffix} lang={lang} />
                  </span>
                  <span className="metric-card__label">{m.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {node.tech && node.tech.length > 0 && (
        <>
          <h4 className="panel-subhead">{str.graph_panel_tech}</h4>
          <ul className="panel-pills" role="list">
            {node.tech.map((t) => (
              <li key={t} className="panel-pill">
                {t}
              </li>
            ))}
          </ul>
        </>
      )}

      {(node.repo || node.demo) && (
        <div className="panel-links">
          {node.repo && (
            <a href={node.repo} target="_blank" rel="noopener noreferrer">
              {str.graph_panel_source} ↗
            </a>
          )}
          {node.demo && (
            <a href={node.demo} target="_blank" rel="noopener noreferrer">
              {str.graph_panel_demo} ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
