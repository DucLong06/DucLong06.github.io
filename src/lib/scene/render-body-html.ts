/**
 * render-body-html.ts — Build-time markdown → highlighted HTML for the 3D reading
 * panels. Runs SERVER-SIDE only (Astro build); the resulting HTML strings are put
 * in the scene payload so the React island ships NO markdown renderer.
 *
 * Highlighting ports the prototype `rich()` engine: **bold** → violet chip,
 * award names → amber chip, metrics/percentages → underline-glow. Output is safe:
 * all raw text is HTML-escaped first and every tag is generated from a known
 * grammar (no passthrough HTML), with rel="noopener" on external links.
 */

const AWARD_RE = /(Sao Khuê Award 20\d\d|ALQAC 20\d\d|IEEE KSE 20\d\d|JAIST|1st[- ]prize|3rd Prize|VINASA|Sao Khuê)/gi;
const METRIC_RE = /(\d[\d.,]*\s?(?:%|MRs?\/month|\+ users|\+ repositories|\+ repos|\+ executives|\+))/g;

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Apply a regex only to "plain" text — never inside an existing
 * <span>/<a>/<code> region or a bare tag — so we don't double-wrap a phrase
 * already turned into a chip/anchor.
 */
function outsidePlain(s: string, re: RegExp, fn: (m: string) => string): string {
  const parts = s.split(/(<span\b[^>]*>.*?<\/span>|<a\b[^>]*>.*?<\/a>|<code\b[^>]*>.*?<\/code>|<[^>]+>)/s);
  return parts.map((p) => (p && p[0] === '<' ? p : p.replace(re, fn))).join('');
}

/** Inline markdown → highlighted HTML for a single run of text. */
function rich(md: string): string {
  let s = esc(md);
  // inline `code`
  s = s.replace(/`([^`]+)`/g, (_m, t) => `<code>${t}</code>`);
  // links [text](url) — quote-escape the URL so it can't break out of href=""
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    (_m, t, u) => `<a href="${u.replace(/"/g, '%22')}" target="_blank" rel="noopener noreferrer">${t}</a>`,
  );
  // explicit **bold** → violet glow chip
  s = s.replace(/\*\*([^*]+)\*\*/g, (_m, t) => `<span class="hi vi">${t}</span>`);
  // award names (only in plain, un-chipped text)
  s = outsidePlain(s, AWARD_RE, (m) => `<span class="hi am">${m}</span>`);
  // percentages & key metrics (only in plain, un-chipped text)
  s = outsidePlain(s, METRIC_RE, (m) => `<span class="hu">${m}</span>`);
  return s;
}

/**
 * Block-level markdown → HTML. Handles headings (#..######), unordered lists,
 * and paragraphs; fenced code + images are stripped. Good enough for the
 * first-party bios/write-ups in src/content.
 */
export function renderBodyHtml(md: string): string {
  const cleaned = (md ?? '')
    .replace(/```[\s\S]*?```/g, '') // fenced code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .trim();
  if (!cleaned) return '';

  const blocks = cleaned.split(/\n{2,}/);
  const out: string[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const heading = lines[0].match(/^#{1,6}\s+(.*)$/);
    if (heading && lines.length === 1) {
      out.push(`<h4>${rich(heading[1])}</h4>`);
      continue;
    }

    const isList = lines.every((l) => /^[-*+]\s+/.test(l));
    if (isList) {
      const items = lines.map((l) => `<li>${rich(l.replace(/^[-*+]\s+/, ''))}</li>`).join('');
      out.push(`<ul>${items}</ul>`);
      continue;
    }

    // Mixed block: render a heading line then the rest as a paragraph.
    if (heading) {
      out.push(`<h4>${rich(heading[1])}</h4>`);
      const rest = lines.slice(1).join(' ');
      if (rest) out.push(`<p>${rich(rest)}</p>`);
      continue;
    }

    out.push(`<p>${rich(lines.join(' '))}</p>`);
  }

  return out.join('');
}
