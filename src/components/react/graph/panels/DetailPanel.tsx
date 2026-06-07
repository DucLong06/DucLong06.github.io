/**
 * DetailPanel.tsx — Glassmorphism overlay card for a selected node. Dispatches
 * to a type-specific body (project / company / tech / language / stat). Slides
 * in via framer-motion; Esc or the close button dismisses it. Non-modal: the
 * graph stays interactive behind it.
 */
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { GraphData, GraphNode } from '../../../../lib/graph/graph-data-types';
import { STRINGS } from '../../../../i18n/strings';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { CompanyDetailPanel } from './CompanyDetailPanel';
import { RadialRing } from './radial-ring';
import { MetricCounter } from './metric-counter';

interface Props {
  node: GraphNode;
  data: GraphData;
  onClose: () => void;
  onSelectNode: (node: GraphNode) => void;
}

export default function DetailPanel({ node, data, onClose, onSelectNode }: Props) {
  const lang = data.lang;
  const str = STRINGS[lang];
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Capture the element that opened the panel; restore focus to it on close
  // (keyboard users land back where they were, not on <body>).
  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    return () => openerRef.current?.focus?.();
  }, []);

  // Focus the close button + wire Esc each time the shown node changes.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [node, onClose]);

  // Tech node → reverse-lookup the projects that use it.
  const techProjects =
    node.type === 'tech'
      ? data.nodes.filter(
          (n) =>
            n.type === 'project' &&
            data.links.some((l) => l.type === 'uses' && l.source === n.id && l.target === node.id),
        )
      : [];

  return (
    <motion.aside
      className="detail-panel"
      role="region"
      aria-label={node.label}
      initial={{ opacity: 0, x: reduce ? 0 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reduce ? 0 : 24 }}
      transition={{ duration: reduce ? 0 : 0.3, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <header className="detail-panel__head">
        <span className="detail-panel__dot" style={{ background: node.color }} />
        <h3 className="detail-panel__title">{node.label}</h3>
        <button
          ref={closeRef}
          type="button"
          className="detail-panel__close"
          aria-label={str.graph_panel_close}
          onClick={onClose}
        >
          ✕
        </button>
      </header>

      {node.type === 'project' && <ProjectDetailPanel node={node} lang={lang} />}
      {node.type === 'company' && (
        <CompanyDetailPanel node={node} data={data} lang={lang} onSelectNode={onSelectNode} />
      )}

      {node.type === 'language' && (
        <div className="panel-body panel-body--center">
          <RadialRing percent={node.percentage ?? 0} color={node.color}>
            <span className="metric-card__count">{node.value}</span>
          </RadialRing>
          <p className="panel-summary">{node.label}</p>
        </div>
      )}

      {node.type === 'stat' && (
        <div className="panel-body panel-body--center">
          <span className="stat-big">
            <MetricCounter value={Number(node.value) || 0} suffix="" lang={lang} />
          </span>
          <p className="panel-summary">{node.label}</p>
        </div>
      )}

      {node.type === 'tech' && (
        <div className="panel-body">
          <h4 className="panel-subhead">{str.graph_panel_used_in}</h4>
          <ul className="panel-project-list" role="list">
            {techProjects.map((p) => (
              <li key={p.id}>
                <button type="button" className="panel-project-btn" onClick={() => onSelectNode(p)}>
                  <span className="panel-project-btn__dot" style={{ background: p.color }} />
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.aside>
  );
}
