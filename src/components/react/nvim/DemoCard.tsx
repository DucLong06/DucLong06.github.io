/**
 * DemoCard.tsx — Live-demo media banner prepended to a project README.
 * Public demo → screenshot + "open ↗" to the live site. Private/deployed
 * service → preview image + "🔒 private — preview" badge (no outbound link).
 */
import { Icon } from './icons';
import type { DemoMedia } from '../../../lib/nvim/nvim-data-types';

export function DemoCard({ demo }: { demo: DemoMedia }) {
  return (
    <div className="demo-card">
      <div className="demo-h">
        <Icon name="rocket" cls="ic-star" /> LIVE DEMO
        {demo.url && <span className="url">{demo.url}</span>}
        {demo.private ? (
          <span className="lock">🔒 private — preview</span>
        ) : demo.href ? (
          <button type="button" className="open" onClick={() => window.open(demo.href, '_blank', 'noopener,noreferrer')}>
            open ↗
          </button>
        ) : null}
      </div>
      <img src={demo.src} alt="demo preview" loading="lazy" />
    </div>
  );
}
