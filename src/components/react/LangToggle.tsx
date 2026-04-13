/**
 * LangToggle.tsx — EN / VI language switcher.
 * Reads window.location.pathname to determine current lang,
 * navigates to mirror URL on click using mirrorUrl logic.
 * Hydrated client:idle in Nav.
 */

type Lang = 'en' | 'vi';

/** Mirror URL client-side — matches server-side mirrorUrl() logic */
function mirrorUrlClient(path: string, targetLang: Lang): string {
  const isCurrentlyVi = path.startsWith('/vi/') || path === '/vi';
  if (targetLang === 'vi') {
    if (isCurrentlyVi) return path;
    return `/vi${path.startsWith('/') ? path : `/${path}`}`;
  }
  // targetLang === 'en'
  if (!isCurrentlyVi) return path;
  return path.replace(/^\/vi/, '') || '/';
}

export default function LangToggle() {
  // Determine active lang from current path (works after hydration)
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const activeLang: Lang = path.startsWith('/vi/') || path === '/vi' ? 'vi' : 'en';

  function handleSwitch(target: Lang) {
    if (target === activeLang) return;
    const dest = mirrorUrlClient(window.location.pathname, target);
    window.location.href = dest;
  }

  return (
    <div
      role="group"
      aria-label="Language selector"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--r-sm)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
    >
      {(['en', 'vi'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => handleSwitch(l)}
          aria-pressed={activeLang === l}
          aria-label={`Switch to ${l === 'en' ? 'English' : 'Tiếng Việt'}`}
          style={{
            padding: '0.25rem 0.625rem',
            background: activeLang === l ? 'var(--bg-subtle)' : 'transparent',
            color: activeLang === l ? 'var(--text-primary)' : 'var(--text-tertiary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms, color 150ms',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
