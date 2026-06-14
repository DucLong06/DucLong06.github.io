/**
 * hud-panels.tsx — One-panel-at-a-time HUD reveal. Exactly one section panel is
 * mounted at a time (keyed by `activeStop`) and fades in over the canvas, so the
 * scene is never blank — home maps to the About panel. The body scrolls; it
 * resets to the top whenever the active stop changes.
 */
import { useEffect, useRef } from 'react';
import type { SceneData, SectionId } from '../../../../lib/scene/scene-data-types';
import { PanelAbout } from './panel-about';
import { PanelExperience } from './panel-experience';
import { PanelSkills } from './panel-skills';
import { PanelProjects } from './panel-projects';
import { PanelPapers } from './panel-papers';
import { PanelContact } from './panel-contact';

interface Props {
  activeStop: SectionId;
  data: SceneData;
  t: (key: string) => string;
}

const PANELS: Record<SectionId, (props: { data: SceneData; t: (k: string) => string }) => JSX.Element> = {
  about: PanelAbout,
  experience: PanelExperience,
  skills: PanelSkills,
  projects: PanelProjects,
  papers: PanelPapers,
  contact: PanelContact,
};

export function HudPanels({ activeStop, data, t }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const Panel = PANELS[activeStop];

  // New panel always starts scrolled to the top.
  useEffect(() => {
    wrap.current?.querySelector('.hud-panel')?.scrollTo({ top: 0 });
  }, [activeStop]);

  return (
    <div className="hud-layer" ref={wrap}>
      {/* key forces a remount → the fade-in animation replays per stop. */}
      <div key={activeStop} className="hud-slot">
        <Panel data={data} t={t} />
      </div>
    </div>
  );
}
