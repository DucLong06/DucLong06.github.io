/**
 * markdown-render.tsx — Minimal, safe Markdown → React renderer for the README
 * buffer view. Supports headings (with ids + data-ol for the Outline), lists,
 * tables, fenced code, blockquotes, images, and inline bold/code/links.
 * React escapes text by default, so no manual HTML escaping is needed.
 */
import type { ReactNode } from 'react';

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/;

/** Only render images we can actually resolve (absolute or site-local). */
function safeImg(src: string): string | null {
  if (/^https?:\/\//.test(src) || src.startsWith('/')) return src;
  return null;
}

/**
 * Allowlist link schemes. READMEs are fetched from remote GitHub at build time,
 * so block `javascript:` / `data:` (React 18 does not) — only http(s)/mailto/
 * site-relative/anchor links pass; anything else renders as inert text.
 */
function safeHref(href: string): string | null {
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(href.trim())) return href;
  return null;
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest) {
    const m = rest.match(INLINE);
    if (!m || m.index === undefined) { nodes.push(rest); break; }
    if (m.index > 0) nodes.push(rest.slice(0, m.index));
    const tok = m[0];
    if (tok.startsWith('`')) nodes.push(<code key={key++}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith('**')) nodes.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else {
      const mm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      const href = safeHref(mm[2]);
      nodes.push(
        href
          ? <a key={key++} className="lnk" href={href} target="_blank" rel="noopener noreferrer">{mm[1]}</a>
          : <span key={key++}>{mm[1]}</span>,
      );
    }
    rest = rest.slice(m.index + tok.length);
  }
  return nodes;
}

export function renderMarkdown(md: string): ReactNode {
  const lines = md.split('\n');
  const out: ReactNode[] = [];
  let list: ReactNode[] | null = null;
  let table: ReactNode[][] | null = null;
  let code: string[] | null = null;
  let hid = 0;
  let key = 0;

  const flushList = () => { if (list) { out.push(<ul key={key++}>{list}</ul>); list = null; } };
  const flushTable = () => {
    if (table) {
      out.push(
        <table key={key++}><tbody>
          {table.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
        </tbody></table>,
      );
      table = null;
    }
  };

  for (const raw of lines) {
    const l = raw.trim();
    if (l.startsWith('```')) {
      if (code) { out.push(<pre key={key++}><code>{code.join('\n')}</code></pre>); code = null; }
      else { flushList(); flushTable(); code = []; }
      continue;
    }
    if (code) { code.push(raw); continue; }
    if (l.startsWith('<!--')) continue;
    if (l.startsWith('![')) {
      flushList(); flushTable();
      const m = l.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      const src = m && safeImg(m[2]);
      if (src) out.push(<img key={key++} src={src} alt={m![1] || ''} loading="lazy" />);
      continue;
    }
    if (/^\|.*\|$/.test(l)) {
      flushList();
      if (/^\|[-:\s|]+\|$/.test(l)) continue; // separator row
      const cells = l.split('|').slice(1, -1).map((c) => inline(c.trim()));
      (table ??= []).push(cells);
      continue;
    }
    flushTable();
    if (l.startsWith('### ') || l.startsWith('## ') || l.startsWith('# ')) {
      flushList();
      const lvl = l.startsWith('### ') ? 3 : l.startsWith('## ') ? 2 : 1;
      const txt = l.replace(/^#{1,3}\s+/, '');
      const id = `nv-h${hid++}`;
      const props = { key: key++, id, 'data-ol': lvl, 'data-txt': txt } as const;
      out.push(lvl === 1 ? <h1 {...props}>{inline(txt)}</h1> : lvl === 2 ? <h2 {...props}>{inline(txt)}</h2> : <h3 {...props}>{inline(txt)}</h3>);
    } else if (l.startsWith('> ')) {
      flushList();
      out.push(<blockquote key={key++}>{inline(l.slice(2))}</blockquote>);
    } else if (/^[-*+] /.test(l)) {
      (list ??= []).push(<li key={list.length}>{inline(l.slice(2))}</li>);
    } else if (/^\d+\.\s/.test(l)) {
      (list ??= []).push(<li key={list.length}>{inline(l.replace(/^\d+\.\s/, ''))}</li>);
    } else if (l === '') {
      flushList();
    } else {
      flushList();
      out.push(<p key={key++}>{inline(l)}</p>);
    }
  }
  flushList();
  flushTable();
  if (code) out.push(<pre key={key++}><code>{code.join('\n')}</code></pre>);

  return <div className="mdview">{out}</div>;
}
