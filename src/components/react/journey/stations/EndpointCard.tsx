/**
 * EndpointCard.tsx — ENDPOINT contact card styled as an API response. The API
 * framing is decoration only — every value is a real, human-readable link
 * (mailto, socials, CV download). Journey terminus.
 */
import { t } from '../../../../lib/i18n-helpers';
import type { EndpointData, Lang } from '../../../../lib/pipeline/pipeline-data-types';

interface Props {
  lang: Lang;
  endpoint: EndpointData;
}

export default function EndpointCard({ lang, endpoint }: Props) {
  const rows: { key: string; value: string; href: string; aria: string; external?: boolean }[] = [
    { key: 'email', value: endpoint.email, href: `mailto:${endpoint.email}`, aria: `Email ${endpoint.email}` },
    { key: 'github', value: endpoint.github.replace(/^https?:\/\//, ''), href: endpoint.github, aria: 'GitHub profile', external: true },
    { key: 'linkedin', value: endpoint.linkedin.replace(/^https?:\/\//, ''), href: endpoint.linkedin, aria: 'LinkedIn profile', external: true },
  ];

  return (
    <div className="endpoint-card">
      <div className="endpoint-card__bar">
        <span className="endpoint-card__method">{t('journey_endpoint_method', lang)}</span>
        <span className="endpoint-card__status">{t('journey_endpoint_status', lang)}</span>
      </div>

      {/* Single source: the JSON-styled block IS the accessible contact list.
          Braces/quotes are decorative; the links are real + labelled. */}
      <pre className="endpoint-card__body">
        <span className="endpoint-card__brace" aria-hidden="true">{'{'}</span>
        {rows.map((r) => (
          <span key={r.key} className="endpoint-card__row">
            <span aria-hidden="true">{'  '}</span>
            <span className="endpoint-card__key" aria-hidden="true">&quot;{r.key}&quot;: </span>
            <a
              className="endpoint-card__link"
              href={r.href}
              aria-label={r.aria}
              {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              &quot;{r.value}&quot;
            </a>
            <span aria-hidden="true">,</span>
          </span>
        ))}
        <span className="endpoint-card__brace" aria-hidden="true">{'}'}</span>
      </pre>

      <a className="journey-cta journey-cta--primary journey-cta--block" href={endpoint.cvFile} download>
        {t('contact_download_cv', lang)}
      </a>
    </div>
  );
}
