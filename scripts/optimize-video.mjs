// video/raw/<clip> → video/hero.mp4 (H.264 720p 24 fps, muto, ≤ 4 MB) + img/hero-poster.webp (fotogramma fisso).
// Uso: node scripts/optimize-video.mjs [--file nome.mp4] [--start 0] [--durata 15] [--crf 28]
//   --file    clip in video/raw/ (default: la prima trovata)
//   --start   secondo da cui partire (default 0)
//   --durata  secondi da tenere (default 15): il video gira in loop, tieni un tratto senza stacchi
//   --crf     qualità H.264, più alto = più leggero (default 28; 30–32 se il file resta sopra i 4 MB)
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import { readdirSync, existsSync, statSync, mkdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = join(root, 'video/raw');
const dest = join(root, 'video/hero.mp4');
const poster = join(root, 'img/hero-poster.webp');
const MAX_KB = 4 * 1024;

const arg = (nome, def) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const start = Number(arg('start', 0));
const durata = Number(arg('durata', 15));
const crf = Number(arg('crf', 28));

mkdirSync(raw, { recursive: true });
const clip = arg('file', readdirSync(raw).find((f) => /\.(mp4|mov|webm|mkv|m4v)$/i.test(f)));
if (!clip || !existsSync(join(raw, clip))) {
  console.error('Nessuna clip in video/raw/: scarica un video (Pexels, Pixabay, Coverr, Mixkit) e mettilo lì.');
  process.exit(1);
}
const src = join(raw, clip);

const run = (args) => {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`✗ ffmpeg è uscito con ${r.status}`); process.exit(1); }
};

// 1. video: taglio, 720p (larghezza pari), 24 fps, niente audio, faststart per partire prima che sia tutto scaricato
run([
  '-ss', String(start), '-t', String(durata), '-i', src,
  '-an', '-vf', 'scale=-2:720,fps=24', '-c:v', 'libx264', '-crf', String(crf), '-preset', 'slow',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dest,
]);

// 2. poster: un fotogramma a metà clip, in WebP come le foto delle ricette
const tmp = join(root, 'video/raw/_poster.png');
run(['-ss', String(durata / 2), '-i', dest, '-frames:v', '1', tmp]);
await sharp(tmp).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(poster);
unlinkSync(tmp);

const kb = Math.round(statSync(dest).size / 1024);
console.log(`✓ video/hero.mp4 ${kb} KB (${durata}″ da ${start}″ di ${clip}, crf ${crf})`);
console.log(`✓ img/hero-poster.webp ${Math.round(statSync(poster).size / 1024)} KB`);
if (kb > MAX_KB) console.warn(`avviso: sopra i ${MAX_KB / 1024} MB — riprova con --durata più corta o --crf ${crf + 3}`);
