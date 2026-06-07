/**
 * section-content.tsx — Per-section popup bodies. Pure DOM (accessible, scrollable),
 * rendered from the serialized SceneData (same source as the 2D site).
 */
import type { SceneData, SectionId } from '../../../../lib/scene/scene-data-types';

const fmtPeriod = (start: string, end: string | null) => `${start} — ${end ?? 'Present'}`;

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="pc-chips">
      {items.map((s) => (
        <li key={s} className="pc-chip">{s}</li>
      ))}
    </ul>
  );
}

function About({ data }: { data: SceneData }) {
  return (
    <div className="pc-stack">
      <h3 className="pc-h">{data.about.title}</h3>
      {data.about.paragraphs.map((p, i) => (
        <p key={i} className="pc-p">{p}</p>
      ))}
      <p className="pc-meta">{data.profile.location}</p>
    </div>
  );
}

function Experience({ data }: { data: SceneData }) {
  return (
    <div className="pc-stack">
      {data.experience.map((e) => (
        <div key={e.company} className="pc-row">
          <div className="pc-row__head">
            <strong>{e.role}</strong>
            <span className="pc-meta">{fmtPeriod(e.start, e.end)}</span>
          </div>
          <span className="pc-sub">{e.company}</span>
          <Chips items={e.stack.slice(0, 6)} />
        </div>
      ))}
    </div>
  );
}

function Skills({ data }: { data: SceneData }) {
  return (
    <div className="pc-stack">
      {data.skills.map((g) => (
        <div key={g.category} className="pc-row">
          <span className="pc-sub">{g.category}</span>
          <div className="pc-skills">
            {g.items.map((it) => (
              <div key={it.name} className="pc-skill">
                <span>{it.name}</span>
                <span className="pc-bar" aria-hidden="true">
                  <span className="pc-bar__fill" style={{ width: `${(it.level / 5) * 100}%` }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectItem({ p, full }: { p: SceneData['projects']['all'][number]; full?: boolean }) {
  return (
    <div className="pc-row">
      <div className="pc-row__head">
        <a className="pc-link" href={p.href}>{p.title}</a>
        <span className="pc-links">
          {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer">code</a>}
          {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer">demo</a>}
        </span>
      </div>
      <p className="pc-p">{p.summary}</p>
      {full && <Chips items={p.stack.slice(0, 5)} />}
    </div>
  );
}

function Projects({ data }: { data: SceneData }) {
  return (
    <div className="pc-stack">
      {data.projects.featured.map((p) => (
        <ProjectItem key={p.slug} p={p} full />
      ))}
      {data.projects.all.length > data.projects.featured.length && (
        <details className="pc-details">
          <summary>See all {data.projects.total} projects</summary>
          <div className="pc-stack">
            {data.projects.all.slice(data.projects.featured.length).map((p) => (
              <ProjectItem key={p.slug} p={p} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function Papers({ data }: { data: SceneData }) {
  return (
    <div className="pc-stack">
      {data.papers.map((p) => (
        <div key={p.title} className="pc-row">
          <strong>{p.title}</strong>
          <span className="pc-meta">{p.venue} · {p.year}</span>
          {p.award && <span className="pc-award">🏆 {p.award}</span>}
        </div>
      ))}
      <div className="pc-row pc-github">
        <span className="pc-sub">GitHub · @{data.github.handle}</span>
        <div className="pc-gh-stats">
          <span><b>{data.github.totalRepos}</b> repos</span>
          <span><b>{data.github.totalStars}</b> stars</span>
        </div>
        <Chips items={data.github.topLanguages.map((l) => `${l.name} ${l.percentage}%`)} />
      </div>
    </div>
  );
}

function Contact({ data }: { data: SceneData }) {
  const p = data.profile;
  return (
    <div className="pc-stack">
      <a className="pc-email" href={`mailto:${p.email}`}>{p.email}</a>
      <div className="pc-links pc-links--row">
        <a href={p.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={p.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={p.cvFile} target="_blank" rel="noopener noreferrer" download>Download CV</a>
      </div>
      <p className="pc-meta">{p.location}</p>
    </div>
  );
}

const BODIES: Record<SectionId, (props: { data: SceneData }) => JSX.Element> = {
  about: About,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  papers: Papers,
  contact: Contact,
};

export function SectionContent({ id, data }: { id: SectionId; data: SceneData }) {
  const Body = BODIES[id];
  return <Body data={data} />;
}
