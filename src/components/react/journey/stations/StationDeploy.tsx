/**
 * StationDeploy.tsx — Station 4. DEPLOY = projects as deployed containers
 * (signature 3 pinned first + emphasized). Selecting one opens a detail panel:
 * summary, stack, repo/demo, and "Open project →" to the full /projects/[slug]
 * page (i18n-correct base). Single panel at a time; ESC closes.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { t } from '../../../../lib/i18n-helpers';
import type { DeployProject, Lang } from '../../../../lib/pipeline/pipeline-data-types';
import ProjectContainer from './ProjectContainer';
import JourneyPanel from './JourneyPanel';

interface Props {
  lang: Lang;
  accent: string;
  projects: DeployProject[];
  active: boolean;
}

export default function StationDeploy({ lang, accent, projects, active }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!active) setOpenSlug(null);
  }, [active]);

  const open = projects.find((p) => p.slug === openSlug) ?? null;

  return (
    <div className="journey-card journey-card--wide">
      <p className="journey-token">DEPLOY</p>
      <p className="journey-eyebrow">{t('projects_eyebrow', lang)}</p>
      <h2 className="journey-title">{t('projects_title', lang)}</h2>

      <div className="deploy-grid" role="list">
        {projects.map((p) => (
          <div role="listitem" key={p.slug}>
            <ProjectContainer
              project={p}
              accent={accent}
              open={openSlug === p.slug}
              onSelect={() => setOpenSlug((cur) => (cur === p.slug ? null : p.slug))}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <JourneyPanel
            key={open.slug}
            title={open.title}
            accent={accent}
            closeLabel={t('graph_panel_close', lang)}
            onClose={() => setOpenSlug(null)}
          >
            <p className="panel-summary">{open.summary}</p>
            <ul className="panel-pills" aria-label={t('graph_panel_tech', lang)}>
              {open.stack.map((s) => (
                <li key={s} className="panel-pill">
                  {s}
                </li>
              ))}
            </ul>
            <div className="panel-links">
              {open.repo && (
                <a href={open.repo} target="_blank" rel="noopener noreferrer">
                  {t('graph_panel_source', lang)}
                </a>
              )}
              {open.demo && (
                <a href={open.demo} target="_blank" rel="noopener noreferrer">
                  {t('graph_panel_demo', lang)}
                </a>
              )}
            </div>
            <a className="journey-cta journey-cta--primary journey-cta--block" href={open.href}>
              {t('journey_open_project', lang)} <span aria-hidden="true">→</span>
            </a>
          </JourneyPanel>
        )}
      </AnimatePresence>
    </div>
  );
}
