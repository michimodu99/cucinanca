// Genera le foto di copertina con Replicate (FLUX Schnell di default) per le ricette senza foto.
// Uso:  REPLICATE_API_TOKEN=r8_... node scripts/gen-images.mjs [--slug a,b] [--model dev] [--force] [--dry]
// Output: img/raw/<slug>.png (poi `node scripts/optimize-images.mjs` → img/<slug>.webp)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const has = (k) => args.includes(k);

const TOKEN = process.env.REPLICATE_API_TOKEN;
const MODELLI = {
  schnell: 'black-forest-labs/flux-schnell', // ≈ 0,003 $/immagine
  dev: 'black-forest-labs/flux-dev',         // ≈ 0,025 $/immagine, più fotografico
};
const modello = MODELLI[opt('--model') || 'schnell'];
const soloSlug = opt('--slug')?.split(',');
const forza = has('--force');
const dry = has('--dry');

// Template condiviso: garantisce coerenza tra le 57 foto (SPEC §8).
export const TEMPLATE = (piatto) =>
  `editorial food photography, ${piatto}, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload`;

const ricette = JSON.parse(readFileSync(join(root, 'data/recipes.json'), 'utf8'));
const raw = join(root, 'img/raw');
mkdirSync(raw, { recursive: true });

const daFare = ricette.filter((r) => (!soloSlug || soloSlug.includes(r.slug)) && (forza || (!existsSync(join(raw, `${r.slug}.png`)) && !existsSync(join(root, r.foto.copertina)))));
console.log(`${daFare.length} immagini da generare con ${modello}${dry ? ' (dry run)' : ''}`);
if (!dry && !TOKEN) { console.error('Manca REPLICATE_API_TOKEN'); process.exit(1); }

for (const r of daFare) {
  const prompt = TEMPLATE(r.foto.prompt);
  if (dry) { console.log(`- ${r.slug}: ${prompt.slice(0, 90)}…`); continue; }
  process.stdout.write(`- ${r.slug} … `);
  try {
    const url = await genera(prompt);
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    writeFileSync(join(raw, `${r.slug}.png`), buf);
    // provenienza: prompt e modello accanto al file
    writeFileSync(join(raw, `${r.slug}.json`), JSON.stringify({ modello, prompt, data: new Date().toISOString() }, null, 2));
    console.log(`ok (${Math.round(buf.length / 1024)} KB)`);
  } catch (e) {
    console.log(`ERRORE: ${e.message}`);
  }
}

async function genera(prompt) {
  const res = await fetch(`https://api.replicate.com/v1/models/${modello}/predictions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Prefer: 'wait=60' },
    body: JSON.stringify({ input: { prompt, aspect_ratio: '4:5', output_format: 'png', output_quality: 90, num_outputs: 1, ...(modello.endsWith('flux-dev') ? { guidance: 3, num_inference_steps: 28 } : {}) } }),
  });
  let pred = await res.json();
  if (!res.ok) throw new Error(pred.detail || res.statusText);
  // se non è finita entro il "wait", fai polling
  while (pred.status !== 'succeeded' && pred.status !== 'failed' && pred.status !== 'canceled') {
    await new Promise((ok) => setTimeout(ok, 1500));
    pred = await (await fetch(pred.urls.get, { headers: { Authorization: `Bearer ${TOKEN}` } })).json();
  }
  if (pred.status !== 'succeeded') throw new Error(pred.error || pred.status);
  return Array.isArray(pred.output) ? pred.output[0] : pred.output;
}
