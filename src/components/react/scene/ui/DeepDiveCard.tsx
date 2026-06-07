/**
 * DeepDiveCard.tsx — Holographic detail panel shown when an orbit node is
 * focused. DOM overlay (outside the canvas) for full a11y + scrolling. Renders
 * the focused project (title, stack, summary, real repo/demo links) or experience
 * (role, company, period, stack). Escape / backdrop / close button dismiss; focus
 * moves into the panel on open and restores on close; Tab is trapped.
 *
 * Focus-trap logic mirrors island/ui/PopupCard.tsx (shared pattern).
 */
import { useEffect, useRef } from 'react';
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import type { SceneFocus } from '../cyber-config';
import { CATEGORY_COLOR, PALETTE } from '../cyber-config';

interface Props {
  focus: NonNullable<SceneFocus>;
  data: SceneData;
  onClose: () => void;
}

const fmtPeriod = (start: string, end: string | null) => `${start} — ${end ?? 'Present'}`;

export function DeepDiveCard({ focus, data, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        panel.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const act = document.activeElement;
      if (e.shiftKey && (act === first || act === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && act === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [focus.kind, focus.id, onClose]);

  const project =
    focus.kind === 'project' ? data.projects.all.find((p) => p.slug === focus.id) : undefined;
  const experience =
    focus.kind === 'experience' ? data.experience.find((e) => e.company === focus.id) : undefined;

  const accent = project ? CATEGORY_COLOR[project.category] ?? PALETTE.neon : PALETTE.amber;
  const title = project?.title ?? experience?.role ?? '';
  const meta = project ? `${project.category} · ${project.year}` : experience?.company ?? '';

  return (
    <div
      className="deepdive-wrap"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        className="deepdive"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        style={{ ['--accent' as string]: accent }}
      >
        <header className="deepdive__head">
          <span className="deepdive__dot" aria-hidden="true" />
          <div className="deepdive__heading">
            <h2 className="deepdive__title">{title}</h2>
            <span className="deepdive__meta">{meta}</span>
          </div>
          <button type="button" className="deepdive__close" onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        </header>

        <div className="deepdive__body">
          {project && (
            <>
              <p className="deepdive__summary">{project.summary}</p>
              <ul className="deepdive__chips">
                {project.stack.map((s) => (
                  <li key={s} className="deepdive__chip">{s}</li>
                ))}
              </ul>
              <div className="deepdive__links">
                <a className="deepdive__btn deepdive__btn--primary" href={project.href}>
                  View project →
                </a>
                {project.repo && (
                  <a className="deepdive__btn" href={project.repo} target="_blank" rel="noopener noreferrer">
                    Code
                  </a>
                )}
                {project.demo && (
                  <a className="deepdive__btn" href={project.demo} target="_blank" rel="noopener noreferrer">
                    Demo
                  </a>
                )}
              </div>
            </>
          )}

          {experience && (
            <>
              <p className="deepdive__summary">{fmtPeriod(experience.start, experience.end)}</p>
              <ul className="deepdive__chips">
                {experience.stack.map((s) => (
                  <li key={s} className="deepdive__chip">{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
