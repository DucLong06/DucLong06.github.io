/**
 * project-readme.ts — Lookup helper for the auto-generated `projectReadmes`
 * collection (Phase 03/04). Guards on the generated directory first so that
 * `getCollection` is never called against an empty collection (which logs a
 * noisy "collection does not exist or is empty" warning on every page).
 *
 * Build-time only — uses node:fs during `astro build`.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const README_DIR = join(process.cwd(), 'src/content/project-readmes');

/** True when prebuild generated at least one README markdown file. */
function hasGeneratedReadmes(): boolean {
  try {
    return existsSync(README_DIR) && readdirSync(README_DIR).some((f) => f.endsWith('.md'));
  } catch {
    return false;
  }
}

/**
 * Return the generated README entry for a project slug, or null when none was
 * generated (no markers in the repo README, or fetch unavailable → fallback).
 */
export async function getProjectReadme(
  slug: string,
): Promise<CollectionEntry<'projectReadmes'> | null> {
  if (!hasGeneratedReadmes()) return null;
  const all = await getCollection('projectReadmes');
  return all.find((r: CollectionEntry<'projectReadmes'>) => r.data.slug === slug) ?? null;
}
