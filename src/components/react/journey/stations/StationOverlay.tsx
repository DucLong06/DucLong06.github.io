/**
 * StationOverlay.tsx — Shared shell for a station's DOM overlay. Full-viewport
 * layer inside the sticky stage; fades + lifts in when its station is active and
 * is removed from the tab order / pointer flow otherwise. Content is real DOM
 * (crawlable, keyboard-navigable). Accent drives the station's neon CSS var.
 */
import type { ReactNode } from 'react';

interface Props {
  index: number;
  active: boolean;
  accent: string;
  /** Accessible label for the station region. */
  label: string;
  children: ReactNode;
  /** Layout variant — where content sits within the viewport. */
  align?: 'center' | 'bottom-left' | 'left';
}

export default function StationOverlay({
  active,
  accent,
  label,
  children,
  align = 'center',
}: Props) {
  return (
    <section
      className={`journey-overlay journey-overlay--${align}`}
      data-active={active}
      aria-label={label}
      aria-hidden={!active}
      style={{ ['--station-accent' as string]: accent }}
    >
      {/* Inactive overlays get visibility:hidden via CSS → removed from tab order. */}
      <div className="journey-overlay__inner">{children}</div>
    </section>
  );
}
