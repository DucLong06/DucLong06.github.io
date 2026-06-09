/**
 * build-section-lines.ts — Convert real NvimData content collections into
 * CodeLine[] for the code-buffer view (about / skills / papers / work /
 * contact / git). Keeps the Editor free of content shaping (DRY).
 */
import type { CodeLine } from './code-view';
import type { NvimData } from '../../../lib/nvim/nvim-data-types';

const blank: CodeLine = { text: '' };

function aboutLines(d: NvimData): CodeLine[] {
  const lines: CodeLine[] = [{ cls: 'h1', text: '# About Me', ol: 1, txt: 'About Me' }, blank];
  d.about.paragraphs.forEach((p) => lines.push({ text: p }, blank));
  lines.push(
    { cls: 'h2', text: '## At a glance', ol: 2, txt: 'At a glance' },
    { cls: 'cm', text: `  ${d.github.totalRepos} repos · ${d.github.totalStars}★ · ${d.papers.length} papers` },
    { text: `  ${d.profile.location}` },
  );
  return lines;
}

function skillsLines(d: NvimData): CodeLine[] {
  const lines: CodeLine[] = [{ cls: 'h1', text: '# Skills', ol: 1, txt: 'Skills' }, blank];
  d.skills.forEach((g) => {
    lines.push({ cls: 'h2', text: `## ${g.category}`, ol: 2, txt: g.category });
    lines.push({ pills: g.items.map((i) => i.name) });
  });
  return lines;
}

function papersLines(d: NvimData): CodeLine[] {
  const lines: CodeLine[] = [{ cls: 'h1', text: '# Research & Papers', ol: 1, txt: 'Research & Papers' }, blank];
  d.papers.forEach((p) => {
    lines.push({ text: `▸ ${p.title}` });
    lines.push({ cls: 'cm', text: `  ${p.venue} · ${p.year}` });
    if (p.award) lines.push({ cls: 'badge', text: `  ${p.award}` });
    lines.push(blank);
  });
  return lines;
}

function workLines(d: NvimData): CodeLine[] {
  const lines: CodeLine[] = [{ cls: 'h1', text: '# Experience', ol: 1, txt: 'Experience' }, blank];
  d.experience.forEach((e) => {
    lines.push({ cls: 'h2', text: `## ${e.role} · ${e.company}`, ol: 2, txt: `${e.company}` });
    lines.push({ cls: 'cm', text: `  ${e.start} – ${e.end ?? 'present'}` });
    lines.push({ pills: e.stack });
    lines.push(blank);
  });
  return lines;
}

function contactLines(d: NvimData): CodeLine[] {
  const p = d.profile;
  return [
    { cls: 'h1', text: '# Contact', ol: 1, txt: 'Contact' },
    blank,
    { cls: 'lnk', text: `  email    ${p.email}` },
    { cls: 'lnk', text: `  github   ${p.github.replace(/^https?:\/\//, '')}` },
    { cls: 'lnk', text: `  linkedin ${p.linkedin.replace(/^https?:\/\//, '')}` },
    { cls: 'lnk', text: `  cv       download ${p.cvFile} ↗` },
    blank,
    { cls: 'badge', text: '  ● Open to opportunities' },
  ];
}

function gitLines(d: NvimData): CodeLine[] {
  const g = d.github;
  const lines: CodeLine[] = [
    { cls: 'h1', text: '# GitHub Stats', ol: 1, txt: 'GitHub Stats' },
    blank,
    { text: `  ${g.totalRepos} repositories · ${g.totalStars}★ · @${g.handle}` },
    blank,
    { cls: 'h2', text: '## Top languages', ol: 2, txt: 'Top languages' },
  ];
  g.topLanguages.forEach((l) => {
    const filled = Math.round((l.percentage / 100) * 16);
    const bar = '█'.repeat(filled) + '░'.repeat(Math.max(0, 16 - filled));
    lines.push({ text: `  ${l.name.padEnd(14)} ${bar} ${l.percentage}%` });
  });
  return lines;
}

const BUILDERS: Record<string, (d: NvimData) => CodeLine[]> = {
  about: aboutLines,
  skills: skillsLines,
  papers: papersLines,
  work: workLines,
  contact: contactLines,
  git: gitLines,
};

export function buildSectionLines(id: string, data: NvimData): CodeLine[] | null {
  const fn = BUILDERS[id];
  return fn ? fn(data) : null;
}
