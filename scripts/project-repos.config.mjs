/**
 * project-repos.config.mjs — Single source of truth mapping portfolio project
 * slug → GitHub owner/repo + visibility. Consumed by build scripts (.mjs) and,
 * indirectly via repoSlug frontmatter, by Astro components.
 *
 * `repo: null` = repo name not yet known (private, user to provide). Scripts MUST
 * skip rows with a null repo — keeps the build green until the name is supplied.
 *
 * `repoSlug` (the "owner/repo" string) is also mirrored into each project's md
 * frontmatter so components can look up live meta without importing this file.
 */

/** @typedef {{ slug: string, owner: string, repo: string | null, private: boolean }} ProjectRepo */

/** @type {ProjectRepo[]} */
export const PROJECT_REPOS = [
  { slug: 'alqac-2023',              owner: 'DucLong06', repo: 'ALQAC2023',                private: false },
  { slug: 'legal-prompts',           owner: 'DucLong06', repo: 'Legal-Prompts',           private: false },
  { slug: 'ocr-api',                 owner: 'DucLong06', repo: 'ocr-api',                  private: false },
  { slug: 'text2sql-vietnamese',     owner: 'DucLong06', repo: 'Text2SQL-Vietnamese',     private: false },
  { slug: 'face-detection-ml-system', owner: 'DucLong06', repo: 'face-detection-ml-system', private: false },
  // Private — repo names TBD (user to provide). Null repo → scripts skip the row.
  { slug: 'booking-duongcam-art',    owner: 'DucLong06', repo: null, private: true },
  { slug: 'techleague',              owner: 'DucLong06', repo: null, private: true },
];
