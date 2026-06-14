/**
 * panel-papers.tsx — PAPERS reading panel. Each paper with title/venue/award and
 * its full highlighted write-up.
 */
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import { getSection } from '../scene-config';
import { PanelShell } from './panel-shell';
import { RichHtml } from './rich-html';

export function PanelPapers({ data, t }: { data: SceneData; t: (k: string) => string }) {
  return (
    <PanelShell
      accent={getSection('papers').color}
      index="05"
      icon="🏅"
      eyebrow={t('panel_papers_eyebrow')}
      title={t('panel_papers_title')}
      punchline={<><span className="hi am">IEEE KSE 2023</span> · {t('panel_papers_punch')}</>}
    >
      <h4>{t('panel_papers_subhead')}</h4>
      {data.papers.map((p, i) => (
        <div key={p.title}>
          {i > 0 && <div className="hud-div" />}
          <div className="hud-role">{p.title}</div>
          <div className="hud-meta">
            {p.venue} · {p.year}
            {p.award && <> · <span className="hi am">{p.award}</span></>}
          </div>
          <RichHtml html={p.bodyHtml ?? ''} />
        </div>
      ))}
    </PanelShell>
  );
}
