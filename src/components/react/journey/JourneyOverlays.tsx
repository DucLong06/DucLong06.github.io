/**
 * JourneyOverlays.tsx — The DOM content layer over the canvas. Maps each station
 * to its overlay (real, crawlable HTML). Only the active station's overlay is
 * visible + focusable; the rest are faded out and removed from the tab order.
 */
import { t } from '../../../lib/i18n-helpers';
import { STATION_META } from '../../../lib/pipeline/pipeline-stations';
import { STATIONS } from './journey-config';
import type { JourneyData } from '../../../lib/pipeline/pipeline-data-types';
import StationOverlay from './stations/StationOverlay';
import StationSource from './stations/StationSource';
import StationIngest from './stations/StationIngest';
import StationTransform from './stations/StationTransform';
import StationTrain from './stations/StationTrain';
import StationDeploy from './stations/StationDeploy';
import StationImpact from './stations/StationImpact';
import StationEndpoint from './stations/StationEndpoint';

interface Props {
  data: JourneyData;
  station: number;
  onJump: (index: number) => void;
}

export default function JourneyOverlays({ data, station, onJump }: Props) {
  const { lang } = data;
  const meta = (i: number) => {
    const m = STATION_META[i];
    return m.title ? `${m.token} — ${t(m.title, lang)}` : m.token;
  };
  const accent = (i: number) => STATIONS[i].accent;
  const isActive = (i: number) => station === i;

  return (
    <div className="journey-overlays">
      <StationOverlay index={0} active={isActive(0)} accent={accent(0)} label={meta(0)} align="bottom-left">
        <StationSource
          lang={lang}
          name={data.name}
          tagline={data.tagline}
          email={data.email}
          cvFile={data.cvFile}
          active={isActive(0)}
          onJumpToWork={() => onJump(4)}
        />
      </StationOverlay>

      <StationOverlay index={1} active={isActive(1)} accent={accent(1)} label={meta(1)} align="left">
        <StationIngest lang={lang} bioParagraphs={data.bioParagraphs} />
      </StationOverlay>

      <StationOverlay index={2} active={isActive(2)} accent={accent(2)} label={meta(2)} align="center">
        <StationTransform lang={lang} clusters={data.clusters} active={isActive(2)} />
      </StationOverlay>

      <StationOverlay index={3} active={isActive(3)} accent={accent(3)} label={meta(3)} align="center">
        <StationTrain lang={lang} accent={accent(3)} epochs={data.epochs} active={isActive(3)} />
      </StationOverlay>

      <StationOverlay index={4} active={isActive(4)} accent={accent(4)} label={meta(4)} align="center">
        <StationDeploy lang={lang} accent={accent(4)} projects={data.projects} active={isActive(4)} />
      </StationOverlay>

      <StationOverlay index={5} active={isActive(5)} accent={accent(5)} label={meta(5)} align="center">
        <StationImpact lang={lang} active={isActive(5)} impact={data.impact} />
      </StationOverlay>

      <StationOverlay index={6} active={isActive(6)} accent={accent(6)} label={meta(6)} align="center">
        <StationEndpoint lang={lang} endpoint={data.endpoint} />
      </StationOverlay>
    </div>
  );
}
