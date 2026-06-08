/**
 * PopupCard.tsx — Side panel shown when a section is focused. DOM overlay (not
 * in-canvas) for full accessibility & scrolling. Escape / backdrop / close button
 * all dismiss; focus moves to the panel on open and restores on close.
 */
import { useEffect, useRef } from 'react';
import type { SceneData, SectionId } from '../../../../lib/scene/scene-data-types';
import { SectionContent } from './section-content';
import { getSection } from '../scene-config';

interface Props {
  id: SectionId;
  data: SceneData;
  label: string;
  onClose: () => void;
  /**
   * Steal focus into the panel + trap Tab (true = normal modal behaviour).
   * During an AUTO tour we pass false so the popup never yanks keyboard focus
   * and the first Tab keystroke escapes to cancel the tour. Default true.
   */
  autoFocus?: boolean;
}

export function PopupCard({ id, data, label, onClose, autoFocus = true }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const color = getSection(id).color;

  useEffect(() => {
    const prev = autoFocus ? (document.activeElement as HTMLElement | null) : null;
    if (autoFocus) panel.current?.focus();

    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // Escape closes; Tab is trapped within the panel (it acts as a modal dialog).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // During an auto tour, let Tab propagate so the tour cancels (no trap).
      if (e.key !== 'Tab' || !autoFocus) return;
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
  }, [id, onClose, autoFocus]);

  return (
    <div className="scene-popup-wrap" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        className="scene-popup"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        style={{ ['--accent' as string]: color }}
      >
        <header className="scene-popup__head">
          <span className="scene-popup__dot" aria-hidden="true" />
          <h2 className="scene-popup__title">{label}</h2>
          <button type="button" className="scene-popup__close" onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        </header>
        <div className="scene-popup__body">
          <SectionContent id={id} data={data} />
        </div>
      </div>
    </div>
  );
}
