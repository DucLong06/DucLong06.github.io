/**
 * HudStats.tsx — 4-corner holographic stat panels (DOM overlay, not in-3D text
 * → crisp + accessible). Shows authored achievement highlights, topped up with
 * GitHub-derived stats (repos/stars) if fewer than four are configured.
 * Responsive: corners on desktop, a stacked row on small viewports.
 */
import type { SceneData, SceneHighlight } from '../../../../lib/scene/scene-data-types';

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

interface Props {
  data: SceneData;
}

export function HudStats({ data }: Props) {
  const items: SceneHighlight[] = [...data.highlights];

  // Fill remaining corners with GitHub-derived stats (build-time data).
  if (items.length < 4) {
    items.push({ value: `${data.github.totalRepos}`, label: 'Public repos', accent: 'neon' });
  }
  if (items.length < 4) {
    items.push({ value: `${data.github.totalStars}`, label: 'GitHub stars', accent: 'amber' });
  }

  const shown = items.slice(0, 4);
  if (shown.length === 0) return null;

  return (
    <div className="hud-stats">
      {shown.map((h, i) => (
        <div key={`${h.label}-${i}`} className={`hud-panel hud-panel--${CORNERS[i]} hud-panel--${h.accent}`}>
          <span className="hud-panel__value">{h.value}</span>
          <span className="hud-panel__label">{h.label}</span>
        </div>
      ))}
    </div>
  );
}
