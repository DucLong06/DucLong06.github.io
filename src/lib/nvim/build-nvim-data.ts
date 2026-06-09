/**
 * build-nvim-data.ts — Server-side assembler for the Neovim shell payload.
 * Reuses `buildSceneData` (profile / about / skills / papers / experience /
 * github + the full 3D scene) and augments it with projects, READMEs, recent
 * commits, and achievements. Runs in Astro frontmatter at build time.
 */
import { buildSceneData } from '../scene/build-scene-data';
import { STRINGS, type Lang } from '../../i18n/strings';
import { buildNvimProjects } from './nvim-projects';
import { getRecentCommits } from './recent-commits';
import type { NvimData } from './nvim-data-types';
import type { ScenePaper, SceneGitHub } from '../scene/scene-data-types';

/** Headline achievements for the terminal `./achievements --list` feed. */
function buildAchievements(papers: ScenePaper[], github: SceneGitHub): string[] {
  const out = papers
    .filter((p) => p.award)
    .map((p) => `✓ ${p.award!.replace(/^[^\w]+\s*/, '')} (${p.year})`);
  out.push(`✓ ${github.totalStars}+ GitHub stars across ${github.totalRepos} repos`);
  out.push('✓ 1st author IEEE KSE 2023 paper · 3 publications');
  return out;
}

export async function buildNvimData(lang: Lang): Promise<NvimData> {
  const scene = await buildSceneData(lang);
  const projects = await buildNvimProjects(lang);

  return {
    lang,
    profile: scene.profile,
    about: scene.about,
    experience: scene.experience,
    skills: scene.skills,
    papers: scene.papers,
    github: scene.github,
    projects,
    commits: getRecentCommits(4),
    achievements: buildAchievements(scene.papers, scene.github),
    altLangUrl: lang === 'en' ? '/vi/' : '/',
    strings: { ...STRINGS[lang] },
    scene,
  };
}
