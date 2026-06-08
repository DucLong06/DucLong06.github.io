/**
 * stats-panel.tsx — Detail panel for the Stats wedge.
 * Highlight number cards (profile.highlights) + GitHub repos/stars, then a
 * switchable chart (bars/donut/radial) over top languages. A visually-hidden
 * table carries the same values for screen readers.
 */
import { useState } from 'react';
import ChartSwitcher from '../charts/chart-switcher';
import StatsBars from '../charts/stats-bars';
import StatsDonut from '../charts/stats-donut';
import StatsRadial from '../charts/stats-radial';
import type { StatsData } from '../explore-types';
import type { TFn } from '../explore-i18n';

interface Props {
  data: StatsData;
  t: TFn;
}

type Chart = 'bars' | 'donut' | 'radial';

export default function StatsPanel({ data, t }: Props) {
  const [chart, setChart] = useState<Chart>('bars');
  const langs = data.github.topLanguages;

  return (
    <div className="panel">
      <header className="panel__head">
        <p className="panel__eyebrow">{t('github_eyebrow')}</p>
        <h2 className="panel__title" tabIndex={-1}>{t('explore_wedge_stats')}</h2>
      </header>

      <div className="stats-cards" role="list">
        {data.highlights.map((h) => (
          <div key={h.label} className="stat-card" data-accent={h.accent} role="listitem">
            <span className="stat-card__value">{h.value}</span>
            <span className="stat-card__label">{h.label}</span>
          </div>
        ))}
        <div className="stat-card" data-accent="neon" role="listitem">
          <span className="stat-card__value">{data.github.repos}</span>
          <span className="stat-card__label">{t('github_stat_repos')}</span>
        </div>
        <div className="stat-card" data-accent="amber" role="listitem">
          <span className="stat-card__value">{data.github.stars}</span>
          <span className="stat-card__label">{t('github_stat_stars')}</span>
        </div>
      </div>

      <div className="panel__chart">
        <div className="panel__chart-head">
          <h3 className="panel__chart-title">{t('github_stat_languages')}</h3>
          <ChartSwitcher<Chart>
            label={t('explore_chart_label')}
            value={chart}
            onChange={setChart}
            options={[
              { value: 'bars', label: t('explore_chart_bars') },
              { value: 'donut', label: t('explore_chart_donut') },
              { value: 'radial', label: t('explore_chart_radial') },
            ]}
          />
        </div>

        {chart === 'bars' && <StatsBars languages={langs} />}
        {chart === 'donut' && <StatsDonut languages={langs} />}
        {chart === 'radial' && <StatsRadial languages={langs} />}

        {/* SR-readable equivalent */}
        <table className="sr-only">
          <caption>{t('explore_stats_summary')}</caption>
          <thead>
            <tr><th scope="col">{t('github_stat_languages')}</th><th scope="col">%</th></tr>
          </thead>
          <tbody>
            {langs.map((l) => (
              <tr key={l.name}><th scope="row">{l.name}</th><td>{l.percentage}%</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
