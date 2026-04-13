/**
 * generate-cover-images.mjs — Creates gradient WebP covers for project cards
 * and a circular avatar placeholder, using sharp + raw SVG gradients.
 * Run: node scripts/generate-cover-images.mjs
 *
 * Outputs:
 *   public/covers/<slug>.webp  — 1200×750 aurora-tinted gradients
 *   public/avatar.webp         — 256×256 circular aurora gradient
 */

import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const COVERS_DIR = join(ROOT, 'public', 'covers');

if (!existsSync(COVERS_DIR)) mkdirSync(COVERS_DIR, { recursive: true });

// Project covers — aurora-tinted per brainstorm palette
const covers = [
  {
    slug: 'face-detection-ml-system',
    // indigo → violet → cyan
    stops: [['#6366f1', 0], ['#8b5cf6', 50], ['#06b6d4', 100]],
    angle: 135,
  },
  {
    slug: 'booking-duongcam-art',
    // pink → violet → indigo
    stops: [['#f472b6', 0], ['#8b5cf6', 60], ['#6366f1', 100]],
    angle: 135,
  },
  {
    slug: 'legal-prompts',
    // cyan → indigo
    stops: [['#06b6d4', 0], ['#6366f1', 100]],
    angle: 135,
  },
  {
    slug: 'alqac-2023',
    // emerald → cyan → indigo
    stops: [['#10b981', 0], ['#06b6d4', 70], ['#6366f1', 100]],
    angle: 135,
  },
  {
    slug: 'text2sql-vietnamese',
    // amber → pink → violet
    stops: [['#f59e0b', 0], ['#f472b6', 60], ['#8b5cf6', 100]],
    angle: 135,
  },
  {
    slug: 'ocr-api',
    // violet → emerald
    stops: [['#8b5cf6', 0], ['#10b981', 100]],
    angle: 135,
  },
];

/**
 * Build a minimal SVG with a linearGradient fill.
 * width/height in px; stops = [color, offsetPct] pairs; angle in deg.
 */
function buildGradientSvg(width, height, stops, angleDeg, circular = false) {
  // Convert CSS angle (from top) → SVG x1/y1/x2/y2
  const rad = (angleDeg - 90) * (Math.PI / 180);
  const x2 = ((Math.cos(rad) + 1) / 2 * 100).toFixed(1);
  const y2 = ((Math.sin(rad) + 1) / 2 * 100).toFixed(1);
  const x1 = (100 - parseFloat(x2)).toFixed(1);
  const y1 = (100 - parseFloat(y2)).toFixed(1);

  const stopMarkup = stops
    .map(([color, offset]) => `<stop offset="${offset}%" stop-color="${color}" />`)
    .join('\n      ');

  const shape = circular
    ? `<circle cx="${width / 2}" cy="${height / 2}" r="${width / 2}" fill="url(#g)" />`
    : `<rect width="${width}" height="${height}" fill="url(#g)" />`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      ${stopMarkup}
    </linearGradient>
  </defs>
  ${shape}
</svg>`;
}

async function generateCover({ slug, stops, angle }) {
  const svg = buildGradientSvg(1200, 750, stops, angle);
  const outPath = join(COVERS_DIR, `${slug}.webp`);
  await sharp(Buffer.from(svg))
    .resize(1200, 750)
    .webp({ quality: 85 })
    .toFile(outPath);
  console.log(`  created: public/covers/${slug}.webp`);
}

async function generateAvatar() {
  const stops = [['#6366f1', 0], ['#8b5cf6', 50], ['#06b6d4', 100]];
  const svg = buildGradientSvg(256, 256, stops, 135, true);
  const outPath = join(ROOT, 'public', 'avatar.webp');
  await sharp(Buffer.from(svg))
    .resize(256, 256)
    .webp({ quality: 90 })
    .toFile(outPath);
  console.log('  created: public/avatar.webp');
}

console.log('Generating gradient image assets...');
await Promise.all(covers.map(generateCover));
await generateAvatar();
console.log('Done.');
