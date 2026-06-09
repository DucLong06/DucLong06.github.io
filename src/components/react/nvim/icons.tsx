/**
 * icons.tsx — Inline SVG icon set for the neovim shell (no nerd-font glyphs,
 * which render inconsistently in browsers). Stroke icons inherit currentColor;
 * a few (dot/star) are filled. Use <Icon name="md" cls="ic-md" />.
 */
import type { ReactNode } from 'react';

export type IconName =
  | 'md' | 'folder' | 'paper' | 'exp' | 'skill' | 'mail' | 'git' | 'cube'
  | 'search' | 'term' | 'rocket' | 'chev' | 'play' | 'dot' | 'star' | 'menu' | 'globe';

/** Names rendered with fill (solid) instead of stroke. */
const FILLED = new Set<IconName>(['dot', 'star']);

const PATHS: Record<IconName, ReactNode> = {
  md: <><path d="M4 1.8h5l2.8 2.8V14H4z" /><path d="M9 1.8v2.8h2.8" /><path d="M5.6 11.4V8.2l1.3 1.6 1.3-1.6v3.2" /></>,
  folder: <path d="M2 4.4h3.6l1.1 1.4H14v7.8H2z" />,
  paper: <><path d="M4 1.8h5l2.8 2.8V14H4z" /><path d="M9 1.8v2.8h2.8" /><path d="M6 7.6h4M6 9.6h4M6 11.6h2.6" /></>,
  exp: <><rect x="2.2" y="5" width="11.6" height="8" rx="1" /><path d="M5.5 5V3.6h5V5" /><path d="M2.2 8.6h11.6" /></>,
  skill: <path d="M8 2.4l1 3.4 3.4 1-3.4 1-1 3.4-1-3.4-3.4-1 3.4-1z" />,
  mail: <><rect x="2" y="3.6" width="12" height="8.8" rx="1" /><path d="M2.4 4.6 8 9l5.6-4.4" /></>,
  git: <><circle cx="4.5" cy="4" r="1.5" /><circle cx="4.5" cy="12" r="1.5" /><circle cx="11.3" cy="5.6" r="1.5" /><path d="M4.5 5.5v5M4.5 9.4c0-2.4 1.9-3 4.5-3.3" /></>,
  cube: <><path d="M8 2 14 5.2v5.6L8 14 2 10.8V5.2z" /><path d="M2 5.2 8 8.4l6-3.2M8 8.4V14" /></>,
  search: <><circle cx="7" cy="7" r="4.2" /><path d="M10.2 10.2 14 14" /></>,
  term: <><rect x="1.8" y="2.6" width="12.4" height="10.8" rx="1.6" /><path d="M4.6 6.2l2.2 1.9-2.2 1.9M8 10h3.4" /></>,
  rocket: <><path d="M8 1.6c2.6 1.4 3.6 4 3.6 6.4l-1.6 1.8H6L4.4 8C4.4 5.6 5.4 3 8 1.6z" /><circle cx="8" cy="6" r="1.1" /><path d="M6 10.5 4.5 13M10 10.5 11.5 13" /></>,
  chev: <path d="M6 4l3 4-3 4" />,
  play: <path d="M4 2.5 13 8 4 13.5z" />,
  menu: <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />,
  globe: <><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c1.8 1.6 2.8 3.8 2.8 6S9.8 14.4 8 14M8 2C6.2 3.6 5.2 5.8 5.2 8S6.2 14.4 8 14" /></>,
  dot: <circle cx="8" cy="8" r="3" />,
  star: <path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6 4.2 13.6l.7-4.3-3.1-3 4.3-.6z" />,
};

interface IconProps {
  name: IconName;
  cls?: string;
  size?: number;
}

export function Icon({ name, cls = '', size }: IconProps) {
  const filled = FILLED.has(name);
  const style = size ? { width: size, height: size } : undefined;
  const svgStyle = size ? { width: size, height: size } : undefined;
  return (
    <span className={`ic ${cls}`.trim()} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 16 16"
        style={svgStyle}
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {PATHS[name]}
      </svg>
    </span>
  );
}
