/**
 * panel-about.tsx — ABOUT reading panel. Name as the headline, tagline as the
 * punchline, full localized bio (highlighted) as the reading body.
 */
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import { getSection } from '../scene-config';
import { PanelShell } from './panel-shell';
import { RichHtml } from './rich-html';

export function PanelAbout({ data, t }: { data: SceneData; t: (k: string) => string }) {
  const p = data.profile;
  return (
    <PanelShell
      accent={getSection('about').color}
      index="01"
      icon="◈"
      eyebrow={t('panel_about_eyebrow')}
      title={p.name}
      punchline={p.tagline}
    >
      <p className="hud-sub">📍 {p.location} · <span className="hu">github.com/{data.github.handle}</span></p>
      <RichHtml html={data.about.bioHtml} />
    </PanelShell>
  );
}
