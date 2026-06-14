/**
 * panel-experience.tsx — EXPERIENCE reading panel. Each role rendered with a
 * role/meta header and its full highlighted achievement body.
 */
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import { getSection } from '../scene-config';
import { PanelShell } from './panel-shell';
import { RichHtml } from './rich-html';

const fmtPeriod = (start: string, end: string | null) => `${start} → ${end ?? 'now'}`;

export function PanelExperience({ data, t }: { data: SceneData; t: (k: string) => string }) {
  const current = data.experience[0];
  const punch = current ? (
    <>
      <span className="hi vi">{current.role} · {current.company}</span> · {fmtPeriod(current.start, current.end)}
    </>
  ) : (
    t('panel_exp_title')
  );

  return (
    <PanelShell
      accent={getSection('experience').color}
      index="02"
      icon="⏳"
      eyebrow={t('panel_exp_eyebrow')}
      title={t('panel_exp_title')}
      punchline={punch}
    >
      <h4>{t('panel_exp_subhead')}</h4>
      {data.experience.map((e, i) => (
        <div key={e.company}>
          {i > 0 && <div className="hud-div" />}
          <div className="hud-role">{e.role} · {e.company}</div>
          <div className="hud-meta">{fmtPeriod(e.start, e.end)}</div>
          <RichHtml html={e.bodyHtml ?? ''} />
        </div>
      ))}
    </PanelShell>
  );
}
