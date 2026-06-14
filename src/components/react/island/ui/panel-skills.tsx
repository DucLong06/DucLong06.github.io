/**
 * panel-skills.tsx — SKILLS reading panel. A short narrative, two production-grade
 * signal chips, and level bars for every skill (from the skills collection).
 */
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import { getSection } from '../scene-config';
import { PanelShell } from './panel-shell';

export function PanelSkills({ data, t }: { data: SceneData; t: (k: string) => string }) {
  const items = data.skills.flatMap((g) => g.items);
  return (
    <PanelShell
      accent={getSection('skills').color}
      index="03"
      icon="⚡"
      eyebrow={t('panel_skills_eyebrow')}
      title={t('panel_skills_title')}
      punchline={t('panel_skills_punch')}
    >
      <p className="hud-lede">{t('panel_skills_narrative')}</p>
      <div className="hud-statchips">
        <div className="hud-statchip"><span className="scval">94%</span><span className="sclab">{t('panel_skills_stat_accuracy')}</span></div>
        <div className="hud-statchip li"><span className="scval">99.9%</span><span className="sclab">{t('panel_skills_stat_uptime')}</span></div>
      </div>
      <h4>{t('panel_skills_levels')}</h4>
      <div className="hud-bars">
        {items.map((it) => (
          <div key={it.name} className="hud-bar">
            <div className="hud-bt"><b>{it.name}</b><span>{it.level}</span></div>
            <div className="hud-bb"><i style={{ width: `${(it.level / 5) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
