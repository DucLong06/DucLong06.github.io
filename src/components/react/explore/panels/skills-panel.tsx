/**
 * skills-panel.tsx — Detail panel for the Skills wedge.
 * Radar ⇄ donut switch (NO power-bars). A visually-hidden table lists every skill
 * and level for screen readers. Default = radar.
 */
import { useState } from 'react';
import ChartSwitcher from '../charts/chart-switcher';
import SkillsRadar from '../charts/skills-radar';
import SkillsDonut from '../charts/skills-donut';
import type { SkillGroup } from '../explore-types';
import type { TFn } from '../explore-i18n';

interface Props {
  data: SkillGroup[];
  t: TFn;
}

type Chart = 'radar' | 'donut';

export default function SkillsPanel({ data, t }: Props) {
  const [chart, setChart] = useState<Chart>('radar');

  return (
    <div className="panel">
      <header className="panel__head panel__head--row">
        <div>
          <p className="panel__eyebrow">{t('skills_eyebrow')}</p>
          <h2 className="panel__title" tabIndex={-1}>{t('graph_section_skills')}</h2>
        </div>
        <ChartSwitcher<Chart>
          label={t('explore_chart_label')}
          value={chart}
          onChange={setChart}
          options={[
            { value: 'radar', label: t('explore_chart_radar') },
            { value: 'donut', label: t('explore_chart_donut') },
          ]}
        />
      </header>

      <div className="panel__chart panel__chart--center">
        {chart === 'radar' ? <SkillsRadar groups={data} /> : <SkillsDonut groups={data} />}
      </div>

      {/* Skill chips per group — visible DOM truth alongside the chart */}
      <div className="skills-groups">
        {data.map((g) => (
          <div key={g.category} className="skills-group">
            <h3 className="skills-group__title">{g.category}</h3>
            <ul className="skills-group__chips" role="list">
              {g.items.map((it) => (
                <li key={it.name} className="tag" title={`${it.name} · ${it.level}/5`}>
                  {it.name}
                  <span className="tag__level" aria-hidden="true">{'●'.repeat(it.level)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* SR-readable equivalent */}
      <table className="sr-only">
        <caption>{t('explore_skills_summary')}</caption>
        <thead>
          <tr><th scope="col">Skill</th><th scope="col">Group</th><th scope="col">Level (1–5)</th></tr>
        </thead>
        <tbody>
          {data.flatMap((g) =>
            g.items.map((it) => (
              <tr key={`${g.category}-${it.name}`}>
                <th scope="row">{it.name}</th>
                <td>{g.category}</td>
                <td>{it.level}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
