/**
 * NeoTree.tsx — Left file-explorer sidebar. Renders about.md, a collapsible
 * projects/ folder (README buffers per project, with ★ + git-status column),
 * then the remaining section files and a keyboard-shortcut legend.
 */
import { useState } from 'react';
import { Icon } from './icons';
import { useNvim } from './nvim-context';
import { SECTIONS, TREE_TOP } from './sections-config';
import type { NvimProject, GitStatus } from '../../../lib/nvim/nvim-data-types';

const GST_CHAR: Record<GitStatus, string> = { m: '~', a: '✚', u: '●' };
const labelStyle = { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

function GitMark({ status }: { status?: GitStatus }) {
  if (!status) return null;
  return <span className={`gst gst-${status}`}>{GST_CHAR[status]}</span>;
}

function TreeItem({ id, icon, iconCls, label, project }: {
  id: string; icon: Parameters<typeof Icon>[0]['name']; iconCls: string; label: string; project?: NvimProject;
}) {
  const { current, go } = useNvim();
  const sel = current === id;
  const cls = project ? 'nt-item child' : 'nt-item';
  return (
    <button type="button" className={`${cls}${sel ? ' sel' : ''}`} aria-current={sel} onClick={() => go(id)}>
      <Icon name={icon} cls={iconCls} />
      <span style={labelStyle}>{label}</span>
      {project?.stars ? <span className="star">★{project.stars}</span> : null}
      <GitMark status={project ? project.gitStatus : SECTIONS[id]?.gst} />
    </button>
  );
}

export function NeoTree() {
  const { data, sidebarOpen, openTelescope, toggleTerminal, go } = useNvim();
  const [folderOpen, setFolderOpen] = useState(true);

  return (
    <nav className={`panel neotree${sidebarOpen ? ' open' : ''}`} aria-label="File explorer">
      <div className="nt-head"><Icon name="folder" cls="ic-folder" /> NEO-TREE</div>
      <div className="nt-root"><Icon name="cube" cls="ic-3d" /> hoang-duc-long</div>

      <TreeItem id="about" icon="md" iconCls="ic-md" label="about.md" />

      <button type="button" className={`nt-item folder${folderOpen ? ' open' : ''}`} onClick={() => setFolderOpen((o) => !o)} aria-expanded={folderOpen}>
        <span className="ic chev"><Icon name="chev" /></span>
        <Icon name="folder" cls="ic-folder" />
        <span style={labelStyle}>projects/</span>
        <span className="gst gst-u">{data.projects.length}</span>
      </button>
      {folderOpen &&
        data.projects.map((p) => (
          <TreeItem key={p.key} id={`readme:${p.key}`} icon="md" iconCls="ic-md" label={`${p.key}.md`} project={p} />
        ))}

      {TREE_TOP.map((id) => (
        <TreeItem key={id} id={id} icon={SECTIONS[id].icon} iconCls={SECTIONS[id].iconCls} label={SECTIONS[id].treeLabel} />
      ))}

      <div className="nt-sep">── SHORTCUTS ──</div>
      {[
        { label: 'about', key: 'a', icon: 'md' as const, run: () => go('about') },
        { label: 'projects', key: 'p', icon: 'folder' as const, run: () => go('projects') },
        { label: 'find', key: 'f', icon: 'search' as const, run: openTelescope },
        { label: 'term', key: 't', icon: 'term' as const, run: () => toggleTerminal() },
      ].map((s) => (
        <button type="button" key={s.label} className="nt-key" onClick={s.run}>
          <span className="lh"><Icon name={s.icon} /> {s.label}</span>
          <span className="kk">{s.key}</span>
        </button>
      ))}
    </nav>
  );
}
