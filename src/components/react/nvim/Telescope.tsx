/**
 * Telescope.tsx — Fuzzy finder overlay (opened with f / / / Ctrl-P). Filters the
 * section + project list, previews the highlighted entry (cover, summary, stack),
 * and opens it on Enter. Arrow keys move the selection; Esc closes.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './icons';
import { useNvim } from './nvim-context';
import { useFocusTrap } from './use-focus-trap';

export function Telescope() {
  const { telescopeOpen, closeTelescope, teleItems, go } = useNvim();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(telescopeOpen);

  const filtered = useMemo(
    () => teleItems.filter((t) => t.label.toLowerCase().includes(q.toLowerCase())),
    [q, teleItems],
  );

  useEffect(() => {
    if (telescopeOpen) { setQ(''); setSel(0); inputRef.current?.focus(); }
  }, [telescopeOpen]);

  if (!telescopeOpen) return null;

  const open = (i: number) => {
    const it = filtered[i];
    if (!it) return;
    closeTelescope();
    go(it.id);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => (filtered.length ? (s + 1) % filtered.length : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => (filtered.length ? (s - 1 + filtered.length) % filtered.length : 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); open(sel); }
    else if (e.key === 'Escape') { e.preventDefault(); closeTelescope(); }
  };

  const active = filtered[sel];
  const p = active?.project;

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) closeTelescope(); }}>
      <div className="tele" role="dialog" aria-modal="true" aria-label="Telescope find" ref={trapRef}>
        <div className="tele-prompt">
          <Icon name="search" cls="ic-search" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            placeholder="Find files / commands…"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="tele-body">
          <div className="tele-list" role="listbox">
            {filtered.map((it, i) => (
              <button
                type="button"
                key={it.id}
                className={`tele-row${i === sel ? ' sel' : ''}`}
                role="option"
                aria-selected={i === sel}
                onMouseEnter={() => setSel(i)}
                onClick={() => open(i)}
              >
                <Icon name="md" cls="ic-md" /> {it.label}
                {it.star ? <span className="star">★{it.star}</span> : null}
              </button>
            ))}
            {!filtered.length && <div className="tele-row">no matches</div>}
          </div>
          <div className="tele-prev">
            {p ? (
              <>
                <h4># {p.key}</h4>
                {p.cover && <img src={p.cover} alt={p.title} />}
                <p>{p.desc}</p>
                <p style={{ color: 'var(--nv-orange)' }}>★ {p.stars}</p>
                <div className="pill-row">{p.stack.slice(0, 6).map((s) => <span className="pill" key={s}>{s}</span>)}</div>
              </>
            ) : active ? (
              <>
                <h4>{active.label}</h4>
                <p style={{ color: 'var(--nv-comment)' }}>
                  Open buffer: <span style={{ color: 'var(--nv-blue)' }}>:{active.id}</span>
                </p>
              </>
            ) : null}
          </div>
        </div>
        <div className="tele-foot"><span>Telescope</span><span>&lt;CR&gt; open · &lt;Esc&gt; close</span></div>
      </div>
    </div>
  );
}
