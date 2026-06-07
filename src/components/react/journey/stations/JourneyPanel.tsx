/**
 * JourneyPanel.tsx — Shared slide-in detail panel (skill / experience / project).
 * Reuses the graph hero's .detail-panel CSS for DRY styling. Handles focus-on-
 * open, ESC-to-close, and a labelled close button. Content is real DOM.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  accent: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}

export default function JourneyPanel({ title, accent, closeLabel, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remember the trigger so keyboard focus returns there on close.
    const trigger = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      trigger?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      className="detail-panel journey-panel"
      role="dialog"
      aria-modal="false"
      aria-label={title}
      tabIndex={-1}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 28 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="detail-panel__head">
        <span className="detail-panel__dot" style={{ color: accent, background: accent }} />
        <h3 className="detail-panel__title">{title}</h3>
        <button className="detail-panel__close" onClick={onClose} aria-label={closeLabel}>
          ✕
        </button>
      </div>
      <div className="panel-body">{children}</div>
    </motion.div>
  );
}
