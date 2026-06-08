/**
 * about-panel.tsx — Detail panel for the About wedge.
 * Headline + rendered bio HTML + location. Pure DOM (SEO/SR friendly).
 */
import type { AboutData } from '../explore-types';
import type { TFn } from '../explore-i18n';

interface Props {
  data: AboutData;
  t: TFn;
}

export default function AboutPanel({ data, t }: Props) {
  return (
    <div className="panel panel--prose">
      <header className="panel__head">
        <p className="panel__eyebrow">{t('about_eyebrow')}</p>
        <h2 className="panel__title" tabIndex={-1}>{t('graph_section_about')}</h2>
      </header>
      <p className="panel__lead">{data.headline}</p>
      <div className="panel__bio" dangerouslySetInnerHTML={{ __html: data.bioHtml }} />
      <p className="panel__meta">
        <span aria-hidden="true">📍</span> {data.location}
      </p>
    </div>
  );
}
