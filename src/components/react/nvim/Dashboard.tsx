/**
 * Dashboard.tsx — Home buffer. Two columns: left = wordmark + launcher menu;
 * right = recent commits, top languages, and a featured-project card. All data
 * comes from NvimData (real commits / GitHub stats / projects).
 */
import { Icon, type IconName } from './icons';
import { useNvim } from './nvim-context';

const LANG_COLORS = ['var(--nv-blue)', 'var(--nv-cyan)', 'var(--nv-magenta)', 'var(--nv-green)', 'var(--nv-comment)'];

const MENU: { key: string; icon: IconName; label: string; cmd: string; target: string }[] = [
  { key: 'a', icon: 'md', label: 'About me', cmd: ':about', target: 'about' },
  { key: 'p', icon: 'folder', label: 'Projects', cmd: ':projects', target: 'projects' },
  { key: 'r', icon: 'paper', label: 'Research papers', cmd: ':papers', target: 'papers' },
  { key: 'w', icon: 'exp', label: 'Work experience', cmd: ':work', target: 'work' },
  { key: 's', icon: 'skill', label: 'Skills', cmd: ':skills', target: 'skills' },
  { key: 'g', icon: 'git', label: 'GitHub stats', cmd: ':git', target: 'git' },
  { key: 'c', icon: 'mail', label: 'Contact / CV', cmd: ':contact', target: 'contact' },
  { key: '3', icon: 'cube', label: 'Enter 3D island', cmd: ':island', target: 'island' },
  { key: 'f', icon: 'search', label: 'Find / fuzzy', cmd: '( )', target: '__find' },
];

export function Dashboard() {
  const { data, go, openTelescope } = useNvim();
  const featured = data.projects[0];

  return (
    <div className="dash">
      <div className="dash-left">
        <div className="logo">HĐL</div>
        <div className="logo-sub">~/hoang-duc-long · v2026</div>
        <div className="sub">{data.profile.name} · Full-Stack &amp; MLOps</div>
        <div className="sub2">── EPU · Computer Science ──</div>
        <div className="menu">
          {MENU.map((m) => (
            <button
              type="button"
              key={m.key}
              className="mrow"
              onClick={() => (m.target === '__find' ? openTelescope() : go(m.target))}
            >
              <span className="k">{m.key}</span>
              <Icon name={m.icon} />
              <span>{m.label}</span>
              <span className="cmd">{m.cmd}</span>
            </button>
          ))}
        </div>
        <div className="foot">⚡ Loaded {data.github.totalRepos} repos · {data.projects.length} projects</div>
      </div>

      <div className="dash-right">
        <div className="card">
          <h5><Icon name="git" cls="ic-git" /> RECENT COMMITS</h5>
          <div className="glog">
            {data.commits.map((c) => (
              <div key={c.hash}>
                <span className="gr">│ ●</span> <span className="hsh">{c.hash}</span>{' '}
                <span className={c.type === 'fix' ? 'fx' : 'ft'}>{c.type}:</span> <span className="ms">{c.msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h5><Icon name="skill" cls="ic-skill" /> TOP LANGUAGES</h5>
          {data.github.topLanguages.map((l, i) => (
            <div className="lang" key={l.name}>
              <span className="nm">{l.name}</span>
              <span className="bar"><span className="fill" style={{ width: `${l.percentage}%`, background: LANG_COLORS[i % LANG_COLORS.length] }} /></span>
              <span className="pc">{l.percentage}%</span>
            </div>
          ))}
        </div>

        {featured && (
          <button type="button" className="card feat" onClick={() => go(`readme:${featured.key}`)}>
            <h5><Icon name="rocket" cls="ic-star" /> FEATURED PROJECT</h5>
            {featured.cover && <img className="thumb" src={featured.cover} alt={featured.title} />}
            <div className="ft"><span># {featured.key}</span><span className="badge">★ {featured.stars}</span></div>
            <div className="fd">{featured.desc}</div>
          </button>
        )}
      </div>
    </div>
  );
}
