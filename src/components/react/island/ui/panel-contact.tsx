/**
 * panel-contact.tsx — CONTACT reading panel. Email headline, direct links, and a
 * download-CV call to action.
 */
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import { getSection } from '../scene-config';
import { PanelShell } from './panel-shell';

export function PanelContact({ data, t }: { data: SceneData; t: (k: string) => string }) {
  const p = data.profile;
  return (
    <PanelShell
      accent={getSection('contact').color}
      index="06"
      icon="✉"
      eyebrow={t('panel_contact_eyebrow')}
      title={t('panel_contact_title')}
      punchline={<span className="hi">{p.email}</span>}
    >
      <div className="hud-links">
        <a href={`mailto:${p.email}`}>✉ {p.email}</a>
        <a href={p.github} target="_blank" rel="noopener noreferrer">⌥ {p.github.replace(/^https?:\/\//, '')}</a>
        <a href={p.linkedin} target="_blank" rel="noopener noreferrer">in {p.linkedin.replace(/^https?:\/\//, '')}</a>
      </div>
      <a className="hud-cv" href={p.cvFile} target="_blank" rel="noopener noreferrer" download>⬇ {t('panel_contact_cv')}</a>
    </PanelShell>
  );
}
