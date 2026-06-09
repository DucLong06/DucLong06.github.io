/**
 * sections-config.ts — Static registry mapping section ids → neo-tree / buffer /
 * statusline metadata, plus builders for the `:cmd` map and Telescope list.
 * Project entries are data-driven from NvimData (single source of truth).
 */
import type { IconName } from './icons';
import type { NvimData, NvimProject, GitStatus } from '../../../lib/nvim/nvim-data-types';

export interface SectionMeta {
  id: string;
  file: string;
  type: string;
  crumb: string;
  icon: IconName;
  iconCls: string;
  cmd: string;
  key?: string;
  treeLabel: string;
  gst?: GitStatus;
}

export const SECTIONS: Record<string, SectionMeta> = {
  dashboard: { id: 'dashboard', file: 'dashboard', type: 'home', crumb: 'dashboard', icon: 'cube', iconCls: 'ic-3d', cmd: ':home', treeLabel: '' },
  about: { id: 'about', file: 'about.md', type: 'markdown', crumb: 'about.md', icon: 'md', iconCls: 'ic-md', cmd: ':about', key: 'a', treeLabel: 'about.md', gst: 'm' },
  projects: { id: 'projects', file: 'projects/', type: 'markdown', crumb: 'projects/', icon: 'folder', iconCls: 'ic-folder', cmd: ':projects', key: 'p', treeLabel: 'projects/' },
  papers: { id: 'papers', file: 'papers.md', type: 'markdown', crumb: 'papers.md', icon: 'paper', iconCls: 'ic-paper', cmd: ':papers', key: 'r', treeLabel: 'papers.md' },
  work: { id: 'work', file: 'experience.md', type: 'markdown', crumb: 'experience.md', icon: 'exp', iconCls: 'ic-exp', cmd: ':work', treeLabel: 'experience.md' },
  skills: { id: 'skills', file: 'skills.md', type: 'markdown', crumb: 'skills.md', icon: 'skill', iconCls: 'ic-skill', cmd: ':skills', key: 's', treeLabel: 'skills.md' },
  contact: { id: 'contact', file: 'contact.md', type: 'markdown', crumb: 'contact.md', icon: 'mail', iconCls: 'ic-mail', cmd: ':contact', treeLabel: 'contact.md' },
  git: { id: 'git', file: 'github.md', type: 'markdown', crumb: 'github.md', icon: 'git', iconCls: 'ic-git', cmd: ':git', treeLabel: 'github.md' },
  island: { id: 'island', file: 'island.3d', type: 'webgl', crumb: 'island.3d', icon: 'cube', iconCls: 'ic-3d', cmd: ':island', key: '3', treeLabel: 'island.3d' },
};

/** Neo-tree top-level order (the projects/ folder is injected after about.md). */
export const TREE_TOP = ['papers', 'work', 'skills', 'contact', 'git', 'island'] as const;

export function isReadme(id: string): boolean {
  return id.startsWith('readme:');
}
export function readmeKey(id: string): string {
  return id.slice('readme:'.length);
}

/** Resolve buffer/statusline metadata for any id, incl. `readme:<key>`. */
export function resolveMeta(id: string, projects: NvimProject[]): SectionMeta {
  if (isReadme(id)) {
    const p = projects.find((x) => x.key === readmeKey(id));
    const title = p?.title ?? readmeKey(id);
    return { ...SECTIONS.dashboard, id, file: title, type: 'markdown', crumb: `projects › ${title}` };
  }
  return SECTIONS[id] ?? SECTIONS.dashboard;
}

/** Short alias for a project slug, e.g. "face-detection-ml-system" → "face". */
function alias(key: string): string {
  return key.split('-')[0];
}

/** Build the `:cmd` word → buffer-id map from sections + projects. */
export function buildCmdMap(projects: NvimProject[]): Record<string, string> {
  const map: Record<string, string> = {
    home: 'dashboard', dash: 'dashboard',
    about: 'about', projects: 'projects', proj: 'projects',
    papers: 'papers', research: 'papers', work: 'work', exp: 'work',
    skills: 'skills', contact: 'contact', cv: 'contact',
    git: 'git', github: 'git', island: 'island', '3d': 'island',
  };
  for (const p of projects) {
    map[p.key] = `readme:${p.key}`;
    map[alias(p.key)] = `readme:${p.key}`;
  }
  return map;
}

export interface TeleItem {
  label: string;
  id: string;
  project?: NvimProject;
  star?: number;
}

/** Build the Telescope fuzzy list: projects first, then sections. */
export function buildTeleItems(data: NvimData): TeleItem[] {
  const projectItems: TeleItem[] = data.projects.map((p) => ({
    label: `${p.key}.md`,
    id: `readme:${p.key}`,
    project: p,
    star: p.stars,
  }));
  const sectionItems: TeleItem[] = ['about', 'papers', 'work', 'skills', 'contact', 'git', 'island'].map(
    (id) => ({ label: SECTIONS[id].file, id }),
  );
  return [...projectItems, ...sectionItems];
}
