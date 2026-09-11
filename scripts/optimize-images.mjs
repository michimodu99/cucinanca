// img/raw/<slug>.png|jpg → img/<slug>.webp (4:5, lato lungo 1200 px, < 150 KB).
// Uso: node scripts/optimize-images.mjs [--force]
import sharp from 'sharp';
import { readdirSync, existsSync, statSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = join(root, 'img/raw');
const out = join(root, 'img');
const forza = process.argv.includes('--force');
mkdirSync(out, { recursive: true });

const file = readdirSync(raw).filter((f) => /\.(png|jpe?g)$/i.test(f));
let tot = 0;
for (const f of file) {
  const slug = basename(f, extname(f));
  const dest = join(out, `${slug}.webp`);
  if (existsSync(dest) && !forza) continue;
  const meta = existsSync(join(raw, `${slug}.json`)) ? JSON.parse(readFileSync(join(raw, `${slug}.json`), 'utf8')) : null;
  let q = 80;
  let buf;
  do {
    buf = await sharp(join(raw, f))
      .rotate()
      .resize({ width: 960, height: 1200, fit: 'cover', position: 'attention' })
      .webp({ quality: q, effort: 6 })
      .withMetadata(meta ? { exif: { IFD0: { ImageDescription: `prompt: ${meta.prompt} | model: ${meta.modello}` } } } : {})
      .toBuffer();
    q -= 8;
  } while (buf.length > 150 * 1024 && q >= 48);
  await sharp(buf).toFile(dest);
  tot++;
  console.log(`${slug}.webp ${Math.round(statSync(dest).size / 1024)} KB (q${q + 8})`);
}
console.log(`✓ ${tot} immagini ottimizzate`);
