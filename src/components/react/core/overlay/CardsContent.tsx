/**
 * CardsContent.tsx — Pure DOM (no R3F) for the post-transition workplace cards.
 *
 * Shared by both render paths: the cinematic motion path mounts it inside drei
 * `<Scroll html>` (scroll-driven fade-up); the reduced-motion path renders it as
 * a plain static overlay. All copy comes from the already-localized `SceneData`
 * (EN/VI parity is automatic). Links are real <a> elements → focusable + indexable.
 */
import type { SceneData } from '../../../../lib/scene/scene-data-types';

/** Show the year span; collapse to one year when start/end share it. */
function periodLabel(start: string, end: string | null, lang: string): string {
  const present = lang === 'vi' ? 'Hiện tại' : 'Present';
  const s = start.slice(0, 4);
  const e = end ? end.slice(0, 4) : present;
  return s === e ? s : `${s} – ${e}`;
}

interface Props {
  data: SceneData;
  /** Ref callback per card, used by the motion path to drive a staggered fade-up. */
  registerCard?: (el: HTMLElement | null, index: number) => void;
  /** Extra class on the root (e.g. a static/visible modifier). */
  rootClass?: string;
}

export function CardsContent({ data, registerCard, rootClass = '' }: Props) {
  const s = data.strings;
  const p = data.profile;
  const links = [
    p.github && { label: 'GitHub', href: p.github },
    p.linkedin && { label: 'LinkedIn', href: p.linkedin },
    p.cvFile && { label: s.hero_cta_cv ?? 'Download CV', href: p.cvFile },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className={`core-cards ${rootClass}`.trim()}>
      <header className="core-cards__head">
        <p className="core-cards__eyebrow">{s.experience_eyebrow ?? 'Work history'}</p>
        <h2 className="core-cards__title">{s.experience_title ?? 'Where I’ve shipped things.'}</h2>
      </header>

      <div className="core-cards__grid">
        {data.experience.map((e, i) => (
          <article
            key={`${e.company}-${i}`}
            className="core-card"
            ref={registerCard ? (el) => registerCard(el, i) : undefined}
          >
            <h3 className="core-card__company">{e.company}</h3>
            <p className="core-card__role">{e.role}</p>
            <p className="core-card__period">{periodLabel(e.start, e.end, data.lang)}</p>
            {e.stack.length > 0 && (
              <ul className="core-card__stack">
                {e.stack.slice(0, 5).map((tech) => (
                  <li key={tech} className="core-card__chip">
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      {links.length > 0 && (
        <nav className="core-cards__links" aria-label={p.name}>
          {links.map((l) => (
            <a key={l.label} className="core-cards__link" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
