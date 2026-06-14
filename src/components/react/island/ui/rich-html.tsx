/**
 * rich-html.tsx — Renders the build-time, pre-highlighted, pre-sanitized body
 * HTML produced by `render-body-html.ts`. Content is first-party and escaped at
 * build, so `dangerouslySetInnerHTML` here carries no untrusted markup.
 */
interface Props {
  html: string;
  className?: string;
}

export function RichHtml({ html, className = 'hud-rich' }: Props) {
  if (!html) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
