/**
 * code-view.tsx — Renders an array of CodeLine as a vim "buffer": a
 * relativenumber gutter (current line absolute + highlighted, others show
 * distance) and syntax-colored content. Heading lines carry data-ol so the
 * Outline can index + scroll to them.
 */
import type { ReactNode } from 'react';

export interface CodeLine {
  /** syntax class: h1 h2 str kw num fn cm badge lnk … */
  cls?: string;
  text?: string;
  /** render a pill row instead of text. */
  pills?: string[];
  /** outline heading level (1-3) — adds data-ol/data-txt. */
  ol?: 1 | 2 | 3;
  /** outline label (defaults to text). */
  txt?: string;
}

export function CodeView({ lines }: { lines: CodeLine[] }) {
  return (
    <div className="code">
      {lines.map((ln, i) => {
        const cur = i === 0;
        const gutter = cur ? '1' : String(i);
        const olProps = ln.ol ? { 'data-ol': ln.ol, 'data-txt': ln.txt ?? ln.text ?? '' } : {};
        let body: ReactNode;
        if (ln.pills) {
          body = <div className="pill-row">{ln.pills.map((p, j) => <span className="pill" key={j}>{p}</span>)}</div>;
        } else {
          body = <span className={ln.cls ?? ''}>{ln.text}</span>;
        }
        return (
          <div className={`ln${cur ? ' curline' : ''}`} key={i}>
            <div className="g">{gutter}</div>
            <div className="c" {...olProps}>{body}</div>
          </div>
        );
      })}
    </div>
  );
}
