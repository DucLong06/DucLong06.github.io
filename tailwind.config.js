/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // Dark mode via data-theme attribute on <html>
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // ── Font families ────────────────────────────────────────────────────────
      fontFamily: {
        display: 'var(--font-display)',
        body:    'var(--font-body)',
        mono:    'var(--font-mono)',
      },

      // ── Colors — all reference CSS vars (tokens.css is source of truth) ─────
      colors: {
        bg: {
          base:     'var(--bg-base)',
          elevated: 'var(--bg-elevated)',
          subtle:   'var(--bg-subtle)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
        },
        aurora: {
          1: 'var(--aurora-1)',
          2: 'var(--aurora-2)',
          3: 'var(--aurora-3)',
          4: 'var(--aurora-4)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
      },

      // ── Border radius ────────────────────────────────────────────────────────
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },

      // ── Box shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        sm:     'var(--shadow-sm)',
        md:     'var(--shadow-md)',
        aurora: 'var(--shadow-aurora)',
      },

      // ── Transition timing ────────────────────────────────────────────────────
      transitionTimingFunction: {
        soft: 'var(--ease-soft)',
      },

      // ── Transition durations ─────────────────────────────────────────────────
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
};
