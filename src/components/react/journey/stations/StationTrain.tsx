/**
 * StationTrain.tsx — Station 3. TRAIN = 3 career epochs in CHRONOLOGICAL order
 * (FSI → CyberEye → FPT). Selecting an epoch opens its detail panel (single open
 * at a time). Epochs are focusable buttons; ESC closes the panel.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { t } from '../../../../lib/i18n-helpers';
import type { ExperienceEpoch, Lang } from '../../../../lib/pipeline/pipeline-data-types';
import ExperiencePanel from './ExperiencePanel';

interface Props {
  lang: Lang;
  accent: string;
  epochs: ExperienceEpoch[];
  active: boolean;
}

export default function StationTrain({ lang, accent, epochs, active }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!active) setOpenIdx(null);
  }, [active]);

  const open = openIdx !== null ? epochs[openIdx] : null;

  return (
    <div className="journey-card journey-card--wide">
      <p className="journey-token">TRAIN</p>
      <p className="journey-eyebrow">{t('experience_eyebrow', lang)}</p>
      <h2 className="journey-title">{t('experience_title', lang)}</h2>

      <ol className="epoch-track" aria-label={t('experience_eyebrow', lang)}>
        {epochs.map((e, i) => (
          <li key={e.company} className="epoch-track__item">
            <button
              className="epoch-node"
              data-open={openIdx === i}
              data-ongoing={e.ongoing}
              style={{ ['--station-accent' as string]: accent }}
              onClick={() => setOpenIdx((cur) => (cur === i ? null : i))}
            >
              <span className="epoch-node__index">{`epoch ${i + 1}`}</span>
              <span className="epoch-node__company">{e.company}</span>
              <span className="epoch-node__period">{e.periodLabel}</span>
            </button>
          </li>
        ))}
      </ol>

      <AnimatePresence>
        {open && (
          <ExperiencePanel
            key={open.company}
            lang={lang}
            accent={accent}
            epoch={open}
            onClose={() => setOpenIdx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
