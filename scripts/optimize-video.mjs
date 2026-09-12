// video/raw/<nome>.mp4 → video/hero-<nome>.mp4 (H.264, lato corto 720 px, 24 fps, muto, ≤ 4 MB); con --poster anche
// img/hero-poster.webp (fotogramma fisso della hero). La playlist delle clip sta in js/dispensa.js (CLIP).
// Uso: node scripts/optimize-video.mjs [--file nome.mp4] [--start 0] [--durata 15] [--crf 28] [--poster]
//   --file    clip in video/raw/ (default: la prima trovata)
//   --start   secondo da cui partire (default 0)
//   --durata  secondi da tenere (default 15; se la clip è più corta finisce lì): tieni un tratto senza stacchi
//   --crf     qualità H.264, più alto = più leggero (default 28; 30–32 se il file resta sopra i 4 MB)
//   --poster  rigenera img/hero-poster.webp da questa clip (senza flag: solo se il poster manca)
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import { readdirSync, existsSync, statSync, mkdirSync, unlinkSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = join(root, 'video/raw');
const poster = join(root, 'img/hero-poster.webp');
const MAX_KB = 4 * 1024;

const arg = (nome, def) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const vuolePoster = process.argv.includes('--poster');
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
const nome = basename(clip, extname(clip));
const dest = join(root, `video/hero-${nome}.mp4`);

const run = (args) => {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`✗ ffmpeg è uscito con ${r.status}`); process.exit(1); }
};

// 1. video: taglio, lato corto a 720 px (vale per clip verticali e orizzontali, dimensioni pari), 24 fps, niente audio,
//    faststart per partire prima che sia tutto scaricato
run([
  '-ss', String(start), '-t', String(durata), '-i', src,
  '-an', '-vf', "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)',fps=24", '-c:v', 'libx264', '-crf', String(crf), '-preset', 'slow',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dest,
]);

const kb = Math.round(statSync(dest).size / 1024);
console.log(`✓ video/hero-${nome}.mp4 ${kb} KB (fino a ${durata}″ da ${start}″ di ${clip}, crf ${crf})`);

// 2. poster: un fotogramma a un terzo della clip, in WebP come le foto delle ricette
if (vuolePoster || !existsSync(poster)) {
  const tmp = join(root, 'video/raw/_poster.png');
  run(['-sseof', '-1', '-i', dest, '-frames:v', '1', tmp]); // dall'ultimo secondo: esiste anche se la clip è corta
  await sharp(tmp).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(poster);
  unlinkSync(tmp);
  console.log(`✓ img/hero-poster.webp ${Math.round(statSync(poster).size / 1024)} KB`);
}
if (kb > MAX_KB) console.warn(`avviso: sopra i ${MAX_KB / 1024} MB — riprova con --durata più corta o --crf ${crf + 3}`);
