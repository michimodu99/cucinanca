// Fonde data/ricette/*.json in data/recipes.json e valida tutto.
// Uso:  node scripts/build-data.mjs          → valida + scrive recipes.json
//       node scripts/build-data.mjs --check  → solo valida (exit 1 se errori)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const errors = [];
const err = (m) => errors.push(m);

const schema = JSON.parse(readFileSync(join(root, 'schema/recipe.schema.json'), 'utf8'));
const tassonomia = JSON.parse(readFileSync(join(root, 'data/ingredienti.json'), 'utf8'));
const byId = new Map(tassonomia.map((i) => [i.id, i]));

// --- tassonomia: id unici, alias non ambigui
{
  const seen = new Map();
  for (const ing of tassonomia) {
    if (seen.has(ing.id)) err(`tassonomia: id duplicato "${ing.id}"`);
    seen.set(ing.id, ing.id);
    for (const a of [ing.nome.toLowerCase(), ...(ing.alias || [])]) {
      const key = a.toLowerCase();
      if (seen.has(key) && seen.get(key) !== ing.id) err(`tassonomia: alias "${a}" ambiguo tra "${seen.get(key)}" e "${ing.id}"`);
      seen.set(key, ing.id);
    }
  }
}

// --- ricette
const dir = join(root, 'data/ricette');
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
const ricette = [];
for (const f of files) {
  let arr;
  try {
    arr = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  } catch (e) {
    err(`${f}: JSON non valido — ${e.message}`);
    continue;
  }
  if (!Array.isArray(arr)) { err(`${f}: deve contenere un array`); continue; }
  for (const r of arr) ricette.push({ ...r, _file: f });
}

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const slugs = new Set();

for (const r of ricette) {
  const where = `${r._file} › ${r.slug ?? '(senza slug)'}`;
  const { _file, ...clean } = r;
  if (!validate(clean)) {
    for (const e of validate.errors) err(`${where}: ${e.instancePath || '/'} ${e.message}`);
  }
  if (slugs.has(r.slug)) err(`${where}: slug duplicato`);
  slugs.add(r.slug);

  for (const ing of r.ingredienti || []) {
    const t = byId.get(ing.id);
    if (!t) { err(`${where}: ingrediente sconosciuto "${ing.id}"`); continue; }
    if (ing.unita === 'qb' && ing.qta !== null) err(`${where}: "${ing.id}" con unità qb deve avere qta null`);
    if (ing.unita !== 'qb' && (ing.qta === null || ing.qta === undefined)) err(`${where}: "${ing.id}" senza quantità`);
    const sost = ing.sostituti || [];
    if (sost.length && ing.opzionale) err(`${where}: "${ing.id}" è opzionale, non ha senso dargli sostituti`);
    const vistiSost = new Set();
    for (const s of sost) {
      const ts = byId.get(s.id);
      if (!ts) err(`${where}: sostituto sconosciuto "${s.id}" per "${ing.id}"`);
      else if (ts.base) err(`${where}: "${s.id}" è nella dispensa base, non può essere un sostituto`);
      if (s.id === ing.id) err(`${where}: "${ing.id}" sostituto di sé stesso`);
      if (vistiSost.has(s.id)) err(`${where}: sostituto "${s.id}" ripetuto per "${ing.id}"`);
      vistiSost.add(s.id);
    }
  }
  (r.procedimento || []).forEach((s, i) => {
    if (s.n !== i + 1) err(`${where}: step ${i + 1} ha n=${s.n}`);
  });
  if (r.foto?.copertina) {
    const expected = `img/${r.slug}.webp`;
    if (r.foto.copertina !== expected) err(`${where}: foto.copertina deve essere "${expected}"`);
    if (!checkOnly && !existsSync(join(root, r.foto.copertina))) {
      // In fase 1 le foto non esistono ancora: solo avviso.
      console.warn(`avviso: manca ${r.foto.copertina}`);
    }
  }
  const tot = (r.tempi?.preparazione ?? 0) + (r.tempi?.cottura ?? 0);
  if (tot > 45 && !(r.tag || []).includes('weekend')) err(`${where}: ${tot}′ senza tag "weekend"`);
  if (tot <= 30 && !(r.tag || []).includes('veloce')) err(`${where}: ${tot}′ senza tag "veloce"`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} errori:`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

const out = ricette.map(({ _file, ...r }) => r).sort((a, b) => a.titolo.localeCompare(b.titolo, 'it'));
if (!checkOnly) {
  writeFileSync(join(root, 'data/recipes.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(`✓ ${out.length} ricette valide → data/recipes.json`);
} else {
  console.log(`✓ ${out.length} ricette valide`);
}
