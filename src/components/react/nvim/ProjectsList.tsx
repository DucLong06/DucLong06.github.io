/**
 * ProjectsList.tsx — `:projects` buffer. Cards for every project (cover thumb,
 * title, ★, summary, stack pills); clicking opens that project's README buffer.
 */
import { Icon } from './icons';
import { useNvim } from './nvim-context';

export function ProjectsList() {
  const { data, go } = useNvim();
  return (
    <div>
      <div className="code">
        <div className="ln curline">
          <div className="g">1</div>
          <div className="c" data-ol={1} data-txt="Projects">
            <span className="h1"># Projects</span>{' '}
            <span className="cm">— {data.projects.length} featured · sorted by ★</span>
          </div>
        </div>
      </div>
      {data.projects.map((p) => (
        <button type="button" key={p.key} className="pcard" onClick={() => go(`readme:${p.key}`)}>
          {p.cover ? (
            <img className="pthumb" src={p.cover} alt={p.title} loading="lazy" />
          ) : (
            <span className="pthumb"><Icon name="cube" /></span>
          )}
          <div className="pinfo">
            <h3>
              <span>{p.title}{p.featured ? <span className="badge"> ★ featured</span> : null}</span>
              <span className="badge">★ {p.stars}</span>
            </h3>
            <p>{p.desc}</p>
            <div className="pill-row">{p.stack.slice(0, 6).map((s) => <span className="pill" key={s}>{s}</span>)}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
