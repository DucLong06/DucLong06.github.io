/**
 * Terminal.tsx — Bottom split terminal (`:term` / t). Shows a neofetch-style
 * system card (ASCII + info from profile / GitHub) and types out the
 * achievements feed line by line. Reduced-motion users get the full list at once.
 */
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { useNvim } from './nvim-context';

const ART = ' ⢀⣴⣶⣦⡀\n ⣾⣿⠿⣿⣷\n ⢿⣿⣷⣿⡿\n ⠈⠻⠟⠁';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Terminal() {
  const { data } = useNvim();
  const g = data.github;
  const lines = ['$ ./achievements --list', ...data.achievements, '$ █'];
  const [count, setCount] = useState(prefersReducedMotion() ? lines.length : 0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= lines.length) window.clearInterval(id);
    }, 160);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const neo: [string, string][] = [
    ['user', `${g.handle.toLowerCase()}@portfolio`],
    ['os', 'NeoWeb · Arch Linux'],
    ['editor', 'Neovim 0.10 · LazyVim'],
    ['theme', 'TokyoNight Night'],
    ['where', data.profile.location],
    ['repos', `${g.totalRepos} · ${g.totalStars}★`],
  ];

  return (
    <div className="term" role="region" aria-label="Terminal">
      <div className="term-head">
        <span><Icon name="term" cls="ic-term" /> TERMINAL — zsh</span>
        <span>achievements · neofetch</span>
      </div>
      <div className="term-body">
        <div className="term-art">{ART}</div>
        <div className="term-info">
          {neo.map(([k, v]) => (
            <div key={k}><span className="k">{k.padEnd(8)}</span><span className="v">{v}</span></div>
          ))}
        </div>
      </div>
      <div className="term-out" ref={bodyRef}>
        {lines.slice(0, count).map((ln, i) => (
          <div key={i}>
            {ln.startsWith('$') ? (
              <span className="pr">{ln}</span>
            ) : (
              <span className="ok">{ln}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
