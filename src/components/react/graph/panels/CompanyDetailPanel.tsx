/**
 * CompanyDetailPanel.tsx — Body for a clicked company node. Aggregates the
 * company's projects into a tech-proficiency radar (frequency across projects),
 * lists the projects (click to drill into a project panel), and shows the stack.
 */
import { useMemo } from 'react';
import type { GraphData, GraphNode, Lang } from '../../../../lib/graph/graph-data-types';
import { STRINGS } from '../../../../i18n/strings';
import { TechRadar, type RadarAxis } from './tech-radar';

interface Props {
  node: GraphNode;
  data: GraphData;
  lang: Lang;
  onSelectNode: (node: GraphNode) => void;
}

export function CompanyDetailPanel({ node, data, lang, onSelectNode }: Props) {
  const str = STRINGS[lang];

  const projects = useMemo(() => {
    const ids = data.links
      .filter((l) => l.source === node.id && l.type === 'belongs')
      .map((l) => l.target);
    const set = new Set(ids);
    return data.nodes.filter((n) => set.has(n.id) && n.type === 'project');
  }, [data, node]);

  const radarAxes = useMemo<RadarAxis[]>(() => {
    const freq = new Map<string, number>();
    for (const p of projects) for (const t of p.tech ?? []) freq.set(t, (freq.get(t) ?? 0) + 1);
    const max = Math.max(1, ...freq.values());
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, count]) => ({ label, value: count / max }));
  }, [projects]);

  return (
    <div className="panel-body">
      {node.sublabel && <p className="panel-summary">{node.sublabel}</p>}

      {radarAxes.length >= 3 && (
        <div className="panel-radar">
          <TechRadar axes={radarAxes} color={node.color} />
        </div>
      )}

      {projects.length > 0 && (
        <>
          <h4 className="panel-subhead">{str.graph_panel_projects_at}</h4>
          <ul className="panel-project-list" role="list">
            {projects.map((p) => (
              <li key={p.id}>
                <button type="button" className="panel-project-btn" onClick={() => onSelectNode(p)}>
                  <span className="panel-project-btn__dot" style={{ background: p.color }} />
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
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
    </div>
  );
}
