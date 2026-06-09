/**
 * Outline.tsx — Right-hand TOC. Scans the rendered editor for [data-ol]
 * heading markers and lets the user click to smooth-scroll to a section.
 * Auto-hides on the dashboard or when fewer than 2 headings are present.
 */
import { useEffect, useState, type RefObject } from 'react';
import { Icon } from './icons';

interface OutlineEntry { lvl: number; txt: string; el: Element; }

export function Outline({ editorRef, contentKey }: { editorRef: RefObject<HTMLDivElement>; contentKey: string }) {
  const [items, setItems] = useState<OutlineEntry[]>([]);

  useEffect(() => {
    let raf = 0;
    const scan = () => {
      const root = editorRef.current;
      if (!root) return;
      const found: OutlineEntry[] = [];
      root.querySelectorAll('[data-ol]').forEach((el) => {
        found.push({
          lvl: Number(el.getAttribute('data-ol')) || 1,
          txt: el.getAttribute('data-txt') || el.textContent || '',
          el,
        });
      });
      setItems(found);
    };
    // Wait for the buffer swap transition to paint the new content.
    const t = window.setTimeout(() => { raf = requestAnimationFrame(scan); }, 140);
    return () => { window.clearTimeout(t); cancelAnimationFrame(raf); };
  }, [editorRef, contentKey]);

  if (contentKey === 'dashboard' || items.length < 2) return null;

  return (
    <aside className="outline" aria-label="Outline">
      <div className="oh"><Icon name="skill" cls="ic-skill" /> OUTLINE</div>
      {items.map((it, i) => (
        <button
          type="button"
          key={i}
          className={`ol-item h${it.lvl}`}
          onClick={() => it.el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <span className="od" />
          {it.txt}
        </button>
      ))}
    </aside>
  );
}
