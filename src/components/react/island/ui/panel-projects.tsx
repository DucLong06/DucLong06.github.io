/**
 * panel-projects.tsx — PROJECTS reading panel. Bitcount LED titles + meta links
 * and the full highlighted write-up for each project.
 */
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import { getSection } from '../scene-config';
import { PanelShell } from './panel-shell';
import { RichHtml } from './rich-html';

export function PanelProjects({ data, t }: { data: SceneData; t: (k: string) => string }) {
  const projects = data.projects.all;
  return (
    <PanelShell
      accent={getSection('projects').color}
      index="04"
      icon="◆"
      eyebrow={t('panel_proj_eyebrow')}
      title="PROJECTS"
      titleMono
      punchline={
        <>
          <span className="hi am">🏆 1st Prize ALQAC 2023</span> · {projects.length} {t('panel_proj_shipped')}
        </>
      }
    >
      <h4>{t('panel_proj_subhead')}</h4>
      {projects.map((p, i) => (
        <div key={p.slug}>
          {i > 0 && <div className="hud-div" />}
          <a className="hud-ptitle font-bitcount" href={p.href}>{p.title}</a>
          <div className="hud-pmeta">
            {p.stack.slice(0, 4).join(' · ')}
            {p.repo && <> · <a href={p.repo} target="_blank" rel="noopener noreferrer">code</a></>}
            {p.demo && <> · <a href={p.demo} target="_blank" rel="noopener noreferrer">demo</a></>}
          </div>
          <RichHtml html={p.bodyHtml ?? ''} />
        </div>
      ))}
    </PanelShell>
  );
}
