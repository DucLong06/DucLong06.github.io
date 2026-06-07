/**
 * graph-nav-handler.ts — Turns a graph node click into site navigation.
 *   section node (scroll) → smooth-scroll to the section anchor in the same page
 *   route node            → navigate to a (build-time localized) URL
 * Honors prefers-reduced-motion (instant jump instead of smooth scroll).
 */
import type { GraphNode } from '../../../lib/graph/graph-data-types';

export function handleGraphNav(node: GraphNode): void {
  if (!node.nav) return;

  if (node.nav.kind === 'route') {
    window.location.href = node.nav.target;
    return;
  }

  const el = document.querySelector(node.nav.target);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
