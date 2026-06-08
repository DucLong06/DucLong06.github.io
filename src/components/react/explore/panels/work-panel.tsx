/**
 * work-panel.tsx — Detail panel for the Work wedge.
 * Projects + papers (papers tagged "Research"). Switch grid ⇄ timeline (orbit 3D
 * deferred per plan). Cards link to the existing /projects/[slug] pages (or paper
 * source for research). Default view = grid.
 */
import { useState } from 'react';
import ChartSwitcher from '../charts/chart-switcher';
import type { WorkCard } from '../explore-types';
import type { TFn } from '../explore-i18n';

interface Props {
  data: WorkCard[];
  t: TFn;
}

type View = 'grid' | 'timeline';

function Card({ card, t, compact }: { card: WorkCard; t: TFn; compact: boolean }) {
  const external = card.isResearch || card.href.startsWith('http');
  return (
    <a
      className="work-card"
      data-research={card.isResearch}
      data-compact={compact}
      href={card.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {card.cover && !compact && (
        <span className="work-card__cover" style={{ backgroundImage: `url(${card.cover})` }} aria-hidden="true" />
      )}
      <span className="work-card__body">
        {card.isResearch && <span className="work-card__tag">{t('explore_research_tag')}</span>}
        <span className="work-card__title">{card.title}</span>
        {card.venue && <span className="work-card__venue">{card.venue}</span>}
        {card.summary && <span className="work-card__summary">{card.summary}</span>}
        {card.stack.length > 0 && (
          <span className="work-card__stack">
            {card.stack.slice(0, 4).map((s) => (
              <span key={s} className="tag tag--sm">{s}</span>
            ))}
          </span>
        )}
        <span className="work-card__cta">{t('explore_open_project')} <span aria-hidden="true">→</span></span>
      </span>
    </a>
  );
}

export default function WorkPanel({ data, t }: Props) {
  const [view, setView] = useState<View>('grid');

  return (
    <div className="panel">
      <header className="panel__head panel__head--row">
        <div>
          <p className="panel__eyebrow">{t('projects_eyebrow')}</p>
          <h2 className="panel__title" tabIndex={-1}>{t('explore_wedge_work')}</h2>
        </div>
        <ChartSwitcher<View>
          label={t('explore_chart_label')}
          value={view}
          onChange={setView}
          options={[
            { value: 'grid', label: t('explore_chart_grid') },
            { value: 'timeline', label: t('explore_chart_timeline') },
          ]}
        />
      </header>

      <div className={view === 'grid' ? 'work-grid' : 'work-timeline'}>
        {data.map((card) => (
          <Card key={card.slug} card={card} t={t} compact={view === 'timeline'} />
        ))}
      </div>
    </div>
  );
}
