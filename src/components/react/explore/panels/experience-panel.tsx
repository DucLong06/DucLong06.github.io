/**
 * experience-panel.tsx — Detail panel for the Experience wedge.
 * Timeline of roles (company / role / period / stack) + per-role projects.
 */
import type { ExperienceItem } from '../explore-types';
import type { TFn } from '../explore-i18n';

interface Props {
  data: ExperienceItem[];
  t: TFn;
}

export default function ExperiencePanel({ data, t }: Props) {
  return (
    <div className="panel">
      <header className="panel__head">
        <p className="panel__eyebrow">{t('experience_eyebrow')}</p>
        <h2 className="panel__title" tabIndex={-1}>{t('graph_section_experience')}</h2>
      </header>

      <ol className="exp-timeline">
        {data.map((item) => (
          <li key={item.company} className="exp-item">
            <div className="exp-item__head">
              <h3 className="exp-item__role">{item.role}</h3>
              <span className="exp-item__period">{item.period}</span>
            </div>
            <p className="exp-item__company">{item.company}</p>

            <ul className="exp-item__stack" aria-label="Tech stack">
              {item.stack.map((s) => (
                <li key={s} className="tag">{s}</li>
              ))}
            </ul>

            {item.projects.length > 0 && (
              <ul className="exp-item__projects">
                {item.projects.map((p) => (
                  <li key={p.name} className="exp-proj">
                    <strong className="exp-proj__name">{p.name}</strong>
                    <p className="exp-proj__summary">{p.summary}</p>
                    <ul className="exp-proj__tech" aria-hidden="true">
                      {p.tech.map((tech) => (
                        <li key={tech} className="tag tag--sm">{tech}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
