/**
 * pipeline-stations.ts — Station id → presentation meta (single source).
 * `token` is the fixed pipeline-stage label (jargon, identical EN/VI). `eyebrow`
 * / `title` reference the existing section i18n keys so the journey reuses the
 * 2D site's copy (no duplication). `anchor` is the in-page hash for nav parity.
 */
import type { StringKey } from '../../i18n/strings';

export type StationId =
  | 'source'
  | 'ingest'
  | 'transform'
  | 'train'
  | 'deploy'
  | 'impact'
  | 'endpoint';

export interface StationMeta {
  id: StationId;
  token: string; // mono pipeline-stage label
  eyebrow?: StringKey;
  title?: StringKey;
  anchor: string; // 2D-site hash target (nav parity)
}

export const STATION_META: StationMeta[] = [
  { id: 'source', token: 'SOURCE', anchor: '#main-content' },
  { id: 'ingest', token: 'INGEST', eyebrow: 'about_eyebrow', title: 'about_title', anchor: '#about' },
  { id: 'transform', token: 'TRANSFORM', eyebrow: 'skills_eyebrow', title: 'skills_title', anchor: '#skills' },
  { id: 'train', token: 'TRAIN', eyebrow: 'experience_eyebrow', title: 'experience_title', anchor: '#experience' },
  { id: 'deploy', token: 'DEPLOY', eyebrow: 'projects_eyebrow', title: 'projects_title', anchor: '#work' },
  { id: 'impact', token: 'IMPACT', eyebrow: 'papers_eyebrow', title: 'papers_title', anchor: '#research' },
  { id: 'endpoint', token: 'ENDPOINT', eyebrow: 'contact_eyebrow', title: 'contact_title', anchor: '#contact' },
];
