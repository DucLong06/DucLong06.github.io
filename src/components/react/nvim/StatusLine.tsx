/**
 * StatusLine.tsx — Lualine-style powerline footer. Mode pill changes color with
 * the vim mode (and recolors the slant separator); shows branch, diagnostics,
 * filetype, and a live clock. CSS triangles draw the powerline separators.
 */
import { useEffect, useState } from 'react';
import { Icon } from './icons';
import { useNvim } from './nvim-context';
import { resolveMeta } from './sections-config';

const MODE_VAR: Record<string, string> = {
  NORMAL: 'var(--nv-blue)',
  COMMAND: 'var(--nv-yellow)',
  INSERT: 'var(--nv-green)',
  VISUAL: 'var(--nv-magenta)',
};
const MODE_CLASS: Record<string, string> = {
  NORMAL: '', COMMAND: 'cmd', INSERT: 'insert', VISUAL: 'visual',
};

function useClock(): string {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function StatusLine() {
  const { mode, current, projects } = useNvim();
  const meta = resolveMeta(current, projects);
  const clock = useClock();
  const accent = MODE_VAR[mode] ?? 'var(--nv-blue)';

  return (
    <div className="status" role="status" aria-live="polite">
      <div className="sl-left">
        <div className={`mode ${MODE_CLASS[mode]}`.trim()}>{mode}</div>
        <div className="sl-sep" style={{ borderLeftColor: accent }} />
        <div className="st git"><Icon name="git" cls="ic-git" /> main</div>
        <div className="sl-sep git-sep" />
        <div className="st">
          <span style={{ color: 'var(--nv-red)' }}>✖ 0</span>{' '}
          <span style={{ color: 'var(--nv-yellow)' }}>▲ 0</span>
        </div>
      </div>
      <div className="sl-right">
        <div className="st">{meta.file}</div>
        <div className="st">{meta.type}</div>
        <div className="st">Ln 1, Col 1</div>
        <div className="st">Top</div>
        <div className="sl-sep rev" />
        <div className="clock">{clock}</div>
      </div>
    </div>
  );
}
