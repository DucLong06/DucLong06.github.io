/**
 * orbit-layout.ts — Pure year→position math for the orbit timeline.
 *
 * No React, no THREE side effects (returns plain tuples) → unit-testable and
 * deterministic. Projects map by `year`, experience by start-year. Same-year
 * projects get a small angular fan-out so nodes never overlap.
 */
import { ORBIT, type Vec3 } from '../cyber-config';
import type { SceneProject, SceneExperience } from '../../../../lib/scene/scene-data-types';

/** Parse a leading 4-digit year out of a "YYYY-MM" / "YYYY" string. */
export function parseYear(s: string): number {
  const n = parseInt(s.slice(0, 4), 10);
  return Number.isFinite(n) ? n : new Date().getFullYear();
}

/** Linear map of a year onto the orbit arc angle. */
export function yearToAngle(year: number, minYear: number, maxYear: number): number {
  const span = Math.max(maxYear - minYear, 1);
  const t = (year - minYear) / span;
  return ORBIT.arcStart + t * (ORBIT.arcEnd - ORBIT.arcStart);
}

/** Position on a tilted upright ring (faces the camera, slight depth). */
export function positionForAngle(angle: number, radius: number): Vec3 {
  const ct = Math.cos(ORBIT.tilt);
  const st = Math.sin(ORBIT.tilt);
  const x = Math.cos(angle) * radius;
  const yz = Math.sin(angle) * radius;
  return [x, yz * ct, yz * st];
}

export interface ProjectPlacement {
  project: SceneProject;
  position: Vec3;
  angle: number;
}

/** Min/max year across projects (used to scale the arc). */
export function yearRange(projects: SceneProject[]): { min: number; max: number } {
  if (projects.length === 0) {
    const y = new Date().getFullYear();
    return { min: y, max: y };
  }
  const years = projects.map((p) => p.year);
  return { min: Math.min(...years), max: Math.max(...years) };
}

/**
 * Place every project on the orbit by year. Projects sharing a year are fanned
 * out by a small angular delta + radius step so they don't stack.
 */
export function layoutProjects(projects: SceneProject[]): ProjectPlacement[] {
  const { min, max } = yearRange(projects);

  // Group indices by year to compute per-year fan-out.
  const byYear = new Map<number, SceneProject[]>();
  for (const p of projects) {
    const g = byYear.get(p.year) ?? [];
    g.push(p);
    byYear.set(p.year, g);
  }

  const placements: ProjectPlacement[] = [];
  for (const [year, group] of byYear) {
    const baseAngle = yearToAngle(year, min, max);
    group.forEach((project, i) => {
      // Fan same-year nodes symmetrically around the base angle.
      const fan = (i - (group.length - 1) / 2) * 0.16;
      const angle = baseAngle + fan;
      const radius = ORBIT.radius + (i % 2 === 0 ? 0 : ORBIT.radiusJitter);
      placements.push({ project, position: positionForAngle(angle, radius), angle });
    });
  }
  return placements;
}

export interface ExperiencePlacement {
  experience: SceneExperience;
  position: Vec3;
  year: number;
}

/** Place experience waypoints on a larger ring by start-year, chronological. */
export function layoutExperience(
  experiences: SceneExperience[],
  projects: SceneProject[],
): ExperiencePlacement[] {
  // Share the project year range so the career arc aligns with project nodes.
  const projRange = yearRange(projects);
  const expYears = experiences.map((e) => parseYear(e.start));
  const min = Math.min(projRange.min, ...(expYears.length ? expYears : [projRange.min]));
  const max = Math.max(projRange.max, ...(expYears.length ? expYears : [projRange.max]));

  return experiences
    .map((experience) => ({ experience, year: parseYear(experience.start) }))
    .sort((a, b) => a.year - b.year)
    .map(({ experience, year }) => ({
      experience,
      year,
      position: positionForAngle(yearToAngle(year, min, max), ORBIT.experienceRadius),
    }));
}
