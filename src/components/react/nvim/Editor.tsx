/**
 * Editor.tsx — Center buffer area: winbar breadcrumb + the scrollable content
 * surface + Outline. Picks a renderer by buffer id (dashboard / projects list /
 * code view / README markdown) and runs the fade-slide buffer-swap transition.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from './icons';
import { useNvim } from './nvim-context';
import { isReadme, readmeKey, resolveMeta } from './sections-config';
import { Dashboard } from './Dashboard';
import { ProjectsList } from './ProjectsList';
import { CodeView } from './code-view';
import { Outline } from './Outline';
import { DemoCard } from './DemoCard';
import { renderMarkdown } from './markdown-render';
import { buildSectionLines } from './build-section-lines';
import type { NvimData, NvimProject } from '../../../lib/nvim/nvim-data-types';

const OUT: CSSProperties = { opacity: 0, transform: 'translateX(-18px)', transition: 'none' };
const IN: CSSProperties = { opacity: 1, transform: 'none', transition: 'opacity .26s ease, transform .26s cubic-bezier(.22,1,.36,1)' };

/** Fallback README when a project ships no markdown body. */
function fallbackReadme(p: NvimProject): string {
  return `# ${p.title}\n\n${p.desc}\n\n## Stack\n${p.stack.map((s) => `- ${s}`).join('\n')}`;
}

function renderContent(id: string, data: NvimData, projects: NvimProject[]): ReactNode {
  if (id === 'dashboard') return <Dashboard />;
  if (id === 'projects') return <ProjectsList />;
  if (id === 'island') return null;
  if (isReadme(id)) {
    const p = projects.find((x) => x.key === readmeKey(id));
    if (!p) return <Dashboard />;
    return (
      <>
        {p.demo && <DemoCard demo={p.demo} />}
        {renderMarkdown(p.readme?.trim() ? p.readme : fallbackReadme(p))}
      </>
    );
  }
  const lines = buildSectionLines(id, data);
  return lines ? <CodeView lines={lines} /> : <Dashboard />;
}

export function Editor() {
  const { current, data, projects } = useNvim();
  const editorRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(current);
  const [anim, setAnim] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (current === shown) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(current);
      if (editorRef.current) editorRef.current.scrollTop = 0;
      return;
    }
    setAnim('out');
    const t = window.setTimeout(() => {
      setShown(current);
      setAnim('in');
      if (editorRef.current) editorRef.current.scrollTop = 0;
    }, 90);
    return () => window.clearTimeout(t);
  }, [current, shown]);

  const meta = resolveMeta(shown, projects);

  return (
    <>
      <div className="winbar">
        <Icon name="folder" cls="ic-folder" />
        <span className="crumb">portfolio</span> <span className="sep">›</span> <span className="cur">{meta.crumb}</span>
        <span className="diag">
          <span className="err">✖ 0</span>
          <span className="warn">▲ 0</span>
          <span className="ok">✔ {meta.type}</span>
        </span>
      </div>
      <div className="content-row">
        <div className="editor" ref={editorRef} style={anim === 'out' ? OUT : IN}>
          {renderContent(shown, data, projects)}
        </div>
        <Outline editorRef={editorRef} contentKey={shown} />
      </div>
    </>
  );
}
