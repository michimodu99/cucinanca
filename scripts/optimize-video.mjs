// video/raw/<clip…> → video/hero.mp4: le clip montate in sequenza in un unico file (H.264 1280×720, 24 fps, muto, ≤ 5 MB)
// che il sito manda in loop. Un file solo, niente cambio di sorgente a runtime: da telefono la staffetta fra due
// <video> mostrava fotogrammi spuri. Con --poster anche img/hero-poster.webp (fotogramma fisso della hero).
// Uso: node scripts/optimize-video.mjs --file frigo.mp4,pancetta.mp4[,…] [--durata 15] [--crf 28] [--poster [nome.mp4]]
//   --file    clip in video/raw/, nell'ordine di riproduzione (default: tutte quelle in video/raw/, in ordine alfabetico)
//   --durata  secondi massimi per clip (default 15; le clip più corte finiscono dove finiscono)
//   --crf     qualità H.264, più alto = più leggero (default 28; 30–32 se il file resta sopra i 5 MB)
//   --poster  rigenera img/hero-poster.webp dall'ultimo secondo della clip indicata (default: l'ultima della lista)
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
const MAX_KB = 5 * 1024;
const W = 1280, H = 720, FPS = 24;

const argv = process.argv.slice(2);
const arg = (nome, def) => {
  const i = argv.indexOf(`--${nome}`);
  return i > -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def;
};
const durata = Number(arg('durata', 15));
const crf = Number(arg('crf', 28));
const vuolePoster = argv.includes('--poster');

mkdirSync(raw, { recursive: true });
const eClip = (f) => /\.(mp4|mov|webm|mkv|m4v)$/i.test(f) && !f.startsWith('_');
const clip = (arg('file', '') || readdirSync(raw).filter(eClip).sort().join(',')).split(',').map((s) => s.trim()).filter(Boolean);
const mancanti = clip.filter((c) => !existsSync(join(raw, c)));
if (!clip.length || mancanti.length) {
  console.error(mancanti.length ? `Non trovo in video/raw/: ${mancanti.join(', ')}` : 'Nessuna clip in video/raw/: scarica un video (Pexels, Pixabay, Coverr, Mixkit) e mettilo lì.');
  process.exit(1);
}

const run = (args) => {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`✗ ffmpeg è uscito con ${r.status}`); process.exit(1); }
};

// 1. ogni clip: al massimo `durata` secondi, riempie 1280×720 (ritaglio centrale, così anche una verticale passa),
//    24 fps; poi concatenazione a tagli netti; niente audio; faststart per partire prima che sia tutto scaricato
const ingressi = clip.flatMap((c) => ['-t', String(durata), '-i', join(raw, c)]);
const catena = clip.map((_, i) => `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},setsar=1[v${i}]`).join(';');
const concat = clip.map((_, i) => `[v${i}]`).join('') + `concat=n=${clip.length}:v=1:a=0[out]`;
run([
  ...ingressi, '-filter_complex', `${catena};${concat}`, '-map', '[out]',
  '-an', '-c:v', 'libx264', '-crf', String(crf), '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dest,
]);
const kb = Math.round(statSync(dest).size / 1024);
console.log(`✓ video/hero.mp4 ${kb} KB — ${clip.length} clip: ${clip.join(' → ')} (max ${durata}″ l'una, crf ${crf})`);
if (kb > MAX_KB) console.warn(`avviso: sopra i ${MAX_KB / 1024} MB — riprova con --durata più corta o --crf ${crf + 3}`);

// 2. poster: dall'ultimo secondo di una clip (esiste anche se è corta), in WebP come le foto delle ricette
if (vuolePoster || !existsSync(poster)) {
  const daClip = arg('poster', clip.at(-1));
  if (!existsSync(join(raw, daClip))) { console.error(`Non trovo in video/raw/: ${daClip}`); process.exit(1); }
  const tmp = join(raw, '_poster.png');
  run(['-sseof', '-1', '-i', join(raw, daClip), '-frames:v', '1', '-vf', `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`, tmp]);
  await sharp(tmp).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(poster);
  unlinkSync(tmp);
  console.log(`✓ img/hero-poster.webp ${Math.round(statSync(poster).size / 1024)} KB (da ${daClip})`);
}
