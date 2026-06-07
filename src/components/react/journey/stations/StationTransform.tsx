/**
 * StationTransform.tsx — Station 2. TRANSFORM = 6 skill clusters. Selecting a
 * cluster bursts its sub-skills (one cluster open at a time). Keyboard: cluster
 * buttons are focusable, Enter/Space toggles, ESC collapses.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { t } from '../../../../lib/i18n-helpers';
import type { Lang, SkillCluster } from '../../../../lib/pipeline/pipeline-data-types';
import SkillBurst from './SkillBurst';

interface Props {
  lang: Lang;
  clusters: SkillCluster[];
  active: boolean;
}

export default function StationTransform({ lang, clusters, active }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  // Collapse when the station scrolls out of focus.
  useEffect(() => {
    if (!active) setOpen(null);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const activeCluster = clusters.find((c) => c.category === open) ?? null;

  return (
    <div className="journey-card journey-card--wide">
      <p className="journey-token">TRANSFORM</p>
      <p className="journey-eyebrow">{t('skills_eyebrow', lang)}</p>
      <h2 className="journey-title">{t('skills_title', lang)}</h2>

      <div className="cluster-grid" role="list">
        {clusters.map((c) => (
          <button
            key={c.category}
            role="listitem"
            className="cluster-chip"
            data-open={open === c.category}
            aria-pressed={open === c.category}
            style={{ ['--cluster-color' as string]: c.color }}
            onClick={() => setOpen((cur) => (cur === c.category ? null : c.category))}
          >
            <span className="cluster-chip__dot" />
            <span className="cluster-chip__name">{c.category}</span>
            <span className="cluster-chip__count">{c.items.length}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeCluster ? (
          <SkillBurst key={activeCluster.category} cluster={activeCluster} />
        ) : (
          <p className="journey-hint" key="hint">
            {t('journey_cluster_hint', lang)}
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}
