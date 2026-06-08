/**
 * detail-overlay.tsx — DOM overlay that renders the focused wedge's panel.
 * role="region" + labelled; close button → toHub. On open, focus moves to the
 * panel heading; Tab is trapped within the overlay. Esc handled by wedge-nav.
 * The scene returns focus to the triggering wedge button on close.
 */
import { useEffect, useRef } from 'react';
import AboutPanel from './panels/about-panel';
import ExperiencePanel from './panels/experience-panel';
import WorkPanel from './panels/work-panel';
import StatsPanel from './panels/stats-panel';
import SkillsPanel from './panels/skills-panel';
import OffclockPanel from './panels/offclock-panel';
import type { ExploreData } from './explore-types';
import type { TFn } from './explore-i18n';
import { getWedge, type WedgeId } from './wedges-config';

interface Props {
  wedgeId: WedgeId;
  data: ExploreData;
  t: TFn;
  reducedMotion: boolean;
  lite: boolean;
  onClose: () => void;
}

function renderPanel(props: Props) {
  const { wedgeId, data, t, reducedMotion, lite } = props;
  switch (wedgeId) {
    case 'about':
      return <AboutPanel data={data.about} t={t} />;
    case 'experience':
      return <ExperiencePanel data={data.experience} t={t} />;
    case 'work':
      return <WorkPanel data={data.work} t={t} />;
    case 'stats':
      return <StatsPanel data={data.stats} t={t} />;
    case 'skills':
      return <SkillsPanel data={data.skills} t={t} />;
    case 'offclock':
      return <OffclockPanel data={data.offclock} t={t} reducedMotion={reducedMotion} lite={lite} />;
    default:
      return null;
  }
}

export default function DetailOverlay(props: Props) {
  const { wedgeId, t, onClose } = props;
  const overlayRef = useRef<HTMLDivElement>(null);

  // Move focus to the panel heading on open / wedge change.
  useEffect(() => {
    const heading = overlayRef.current?.querySelector<HTMLElement>('.panel__title');
    heading?.focus();
  }, [wedgeId]);

  // Basic focus trap within the overlay.
  useEffect(() => {
    const node = overlayRef.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [wedgeId]);

  return (
    <div
      ref={overlayRef}
      className="detail-overlay"
      role="region"
      aria-label={t(getWedge(wedgeId).labelKey)}
    >
      {/* Click the exposed canvas area (scrim) to close — Esc + button also work. */}
      <button
        type="button"
        className="detail-overlay__scrim"
        aria-label={t('explore_close')}
        tabIndex={-1}
        onClick={onClose}
      />
      <div className="detail-overlay__card">
        <button type="button" className="detail-overlay__close" onClick={onClose} aria-label={t('explore_close')}>
          <span aria-hidden="true">✕</span>
        </button>
        <div className="detail-overlay__content">{renderPanel(props)}</div>
      </div>
    </div>
  );
}
