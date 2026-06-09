/**
 * BufferLine.tsx — Top tab strip of open buffers + the EN/VI language toggle.
 * On mobile it also exposes the ≡ button that opens the neo-tree slide-over.
 */
import { Icon } from './icons';
import { useNvim } from './nvim-context';
import { resolveMeta } from './sections-config';

export function BufferLine() {
  const { openBuffers, current, projects, go, closeBuffer, toggleSidebar, switchLang, data } = useNvim();
  const otherLang = data.lang === 'en' ? 'VI' : 'EN';

  return (
    <div className="panel topbar" role="tablist" aria-label="Open buffers">
      <button
        type="button"
        className="nv-mobile-btn"
        aria-label="Toggle file tree"
        onClick={() => toggleSidebar()}
      >
        <Icon name="menu" />
      </button>
      <div className="lbl"><Icon name="cube" cls="ic-3d" /> NEOVIM</div>
      <div className="buffers">
        {openBuffers.map((id) => {
          const file = resolveMeta(id, projects).file;
          const active = id === current;
          return (
            <div key={id} className={`buf-cell${active ? ' active' : ''}`}>
              <button
                type="button"
                className="buf"
                role="tab"
                aria-selected={active}
                onClick={() => go(id)}
              >
                <span className="dot"><Icon name="dot" /></span>
                {file}
              </button>
              <button
                type="button"
                className="buf-x"
                aria-label={`Close ${file}`}
                onClick={() => closeBuffer(id)}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      <button type="button" className="lang-btn" onClick={switchLang} aria-label={`Switch language to ${otherLang}`}>
        <Icon name="globe" /> {otherLang}
      </button>
    </div>
  );
}
