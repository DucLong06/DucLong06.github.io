/**
 * generate-og.mjs — Prebuild OG image generator
 * Uses satori (JSX/VNode → SVG) + @resvg/resvg-js (SVG → PNG) → public/og-image.png
 *
 * Font note: satori supports woff, otf, ttf but NOT woff2.
 * @fontsource/instrument-serif ships .woff files — used for both display and body text.
 * Wrapped in try/catch: failure exits 0 so build continues with existing image.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

async function main() {
  const satori = (await import('satori')).default;
  const { Resvg } = await import('@resvg/resvg-js');

  // Resolve font paths — instrument-serif ships .woff (supported by satori)
  const instrDir =
    dirname(require.resolve('@fontsource/instrument-serif')) + '/files';

  const instrNormalPath = resolve(instrDir, 'instrument-serif-latin-400-normal.woff');
  const instrItalicPath = resolve(instrDir, 'instrument-serif-latin-400-italic.woff');

  const fonts = [];

  if (existsSync(instrNormalPath)) {
    fonts.push({
      name: 'Instrument Serif',
      data: readFileSync(instrNormalPath),
      weight: 400,
      style: 'normal',
    });
  }
  if (existsSync(instrItalicPath)) {
    fonts.push({
      name: 'Instrument Serif',
      data: readFileSync(instrItalicPath),
      weight: 400,
      style: 'italic',
    });
  }

  if (fonts.length === 0) {
    throw new Error('No compatible font files found for satori');
  }

  // OG image VNode (satori accepts React-like element trees as plain objects)
  const template = {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '72px 96px',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0f172a 40%, #1a1040 70%, #0a0a0f 100%)',
        fontFamily: 'Instrument Serif, serif',
        position: 'relative',
      },
      children: [
        // Aurora radial glow overlay
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(120,80,255,0.28) 0%, transparent 65%), ' +
                'radial-gradient(ellipse 50% 40% at 85% 75%, rgba(56,189,248,0.18) 0%, transparent 55%)',
            },
          },
        },
        // Site URL label
        {
          type: 'div',
          props: {
            style: {
              fontSize: 22,
              color: 'rgba(148,163,184,0.85)',
              letterSpacing: '0.06em',
              marginBottom: 44,
              fontStyle: 'normal',
            },
            children: 'duclong06.github.io',
          },
        },
        // Name — Instrument Serif italic, large
        {
          type: 'div',
          props: {
            style: {
              fontSize: 84,
              fontFamily: 'Instrument Serif',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#f8fafc',
              lineHeight: 1.05,
              marginBottom: 28,
              letterSpacing: '-0.02em',
            },
            children: 'Hoang Duc Long',
          },
        },
        // Tagline
        {
          type: 'div',
          props: {
            style: {
              fontSize: 30,
              fontStyle: 'normal',
              color: 'rgba(203,213,225,0.9)',
              fontWeight: 400,
              lineHeight: 1.45,
              maxWidth: 760,
            },
            children: 'Full-stack AI Software Engineer',
          },
        },
        // Open-to-work pill badge
        {
          type: 'div',
          props: {
            style: {
              marginTop: 52,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 10,
                    height: 10,
                    borderRadius: 9999,
                    background: '#4ade80',
                    flexShrink: 0,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    padding: '10px 24px',
                    borderRadius: 9999,
                    background: 'rgba(139,92,246,0.18)',
                    border: '1px solid rgba(139,92,246,0.4)',
                    color: '#a78bfa',
                    fontSize: 18,
                    fontStyle: 'normal',
                  },
                  children: 'Open to opportunities',
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const png = resvg.render().asPng();

  const outPath = resolve(__dirname, '../public/og-image.png');
  writeFileSync(outPath, png);
  console.log(`[og] Generated public/og-image.png (${Math.round(png.length / 1024)} KB)`);
}

main().catch((err) => {
  console.warn('[og] OG image generation failed (non-fatal):', err.message);
  process.exit(0);
});
