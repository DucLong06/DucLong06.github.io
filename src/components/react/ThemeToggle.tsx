/**
 * ThemeToggle.tsx — Sun/moon icon button that switches light/dark theme.
 * Reads/writes documentElement.dataset.theme + localStorage.theme.
 * Hydrated client:idle in Nav.
 */
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { applyTheme, getTheme } from '../../lib/theme-init';
import type { Theme } from '../../lib/theme-init';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  // Sync with DOM on mount (theme-init.ts may have set dark already)
  useEffect(() => {
    setTheme(getTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="theme-toggle-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: 'var(--r-sm)',
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'color 150ms, background-color 150ms',
      }}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
