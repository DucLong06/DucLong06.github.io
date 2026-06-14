/**
 * panel-shell.tsx — Shared frame for every HUD reading panel: eyebrow + index,
 * a large headline + punchline ("text is the hero"), and a scrollable body. The
 * accent color and bitcount-title flag are per-section.
 */
import type { ReactNode } from 'react';

interface Props {
  accent: string;
  index: string;
  eyebrow: string;
  icon: string;
  title: ReactNode;
  punchline: ReactNode;
  /** Use the Bitcount LED face for the headline (Projects). */
  titleMono?: boolean;
  children: ReactNode;
}

export function PanelShell({ accent, index, eyebrow, icon, title, punchline, titleMono, children }: Props) {
  return (
    <article className="hud-panel" style={{ ['--accent' as string]: accent }} tabIndex={-1}>
      <h3 className="hud-eyebrow">
        <span className="hud-ic" aria-hidden="true">{icon}</span>
        {eyebrow}
        <span className="hud-idx">{index}</span>
      </h3>
      <header className="hud-headline">
        <div className={`hud-title${titleMono ? ' font-bitcount-grid' : ''}`} aria-live="polite">{title}</div>
        <div className="hud-punch">{punchline}</div>
      </header>
      <div className="hud-body">{children}</div>
    </article>
  );
}
