/**
 * FloatDetail.tsx — Floating quick-look window for a project (title, ★, stack,
 * links). Opened via openFloat(key); closed with q / Esc / backdrop / ×.
 */
import { useNvim } from './nvim-context';
import { useFocusTrap } from './use-focus-trap';

export function FloatDetail() {
  const { floatKey, closeFloat, projects, go } = useNvim();
  const trapRef = useFocusTrap<HTMLDivElement>(!!floatKey);
  if (!floatKey) return null;
  const p = projects.find((x) => x.key === floatKey);
  if (!p) return null;

  return (
    <div className="floatwin" onClick={(e) => { if (e.target === e.currentTarget) closeFloat(); }}>
      <div className="fw" role="dialog" aria-modal="true" aria-label={p.title} ref={trapRef}>
        <div className="ttl">
          <span># {p.title}</span>
          <span>
            <span className="badge">★ {p.stars}</span>{' '}
            <button type="button" className="fw-x" aria-label="Close" onClick={closeFloat}>×</button>
          </span>
        </div>
        <hr />
        {p.cover && <img src={p.cover} alt={p.title} loading="lazy" />}
        <p>{p.desc}</p>
        <div className="pill-row" style={{ margin: '11px 0' }}>
          {p.stack.map((s) => <span className="pill" key={s}>{s}</span>)}
        </div>
        <p>
          <button type="button" className="lnk" onClick={() => { closeFloat(); go(`readme:${p.key}`); }}>▸ readme.md</button>
          {p.repo && <> &nbsp; <a className="lnk" href={p.repo} target="_blank" rel="noreferrer">▸ source ↗</a></>}
          {p.demo?.href && <> &nbsp; <a className="lnk" href={p.demo.href} target="_blank" rel="noreferrer">▸ demo ↗</a></>}
        </p>
        <div className="keys">q close · readme open buffer</div>
      </div>
    </div>
  );
}
