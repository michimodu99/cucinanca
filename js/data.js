// Carica i dati e costruisce gli indici. Un solo fetch per sessione.
import { creaIndice } from './match.js';
import { STRINGHE, LINGUA } from './i18n.js';

let cache = null;

export async function caricaDati() {
  if (cache) return cache;
  const [ricette, tassonomia] = await Promise.all([
    fetch('data/recipes.json').then((r) => r.json()),
    fetch('data/ingredienti.json').then((r) => r.json()),
  ]);
  const indice = creaIndice(tassonomia);
  const bySlug = new Map(ricette.map((r) => [r.slug, r]));

  // quante ricette usano ogni ingrediente: serve per ordinare l'indice della dispensa
  const uso = new Map();
  for (const r of ricette) for (const i of r.ingredienti) uso.set(i.id, (uso.get(i.id) || 0) + 1);

  cache = { ricette, tassonomia, indice, bySlug, uso };
  return cache;
}

export const ETICHETTE = STRINGHE[LINGUA].etichette;

/** Attrezzatura posseduta da Michele (SPEC §2). */
export const STACK = new Set(['padella', 'pentola', 'forno', 'microonde', 'teglia', 'frullatore', 'frusta', 'griglia']);

export function euro(n) {
  return n.toLocaleString('it-IT', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
}

export function minuti(n) {
  if (n >= 60 && n % 60 === 0) return `${n / 60} h`;
  if (n > 90) return `${Math.floor(n / 60)} h ${n % 60}′`;
  return `${n}′`;
}

export function riposo(n) {
  if (!n) return null;
  if (n >= 60) return n % 60 ? `${Math.floor(n / 60)} h ${n % 60}′` : `${n / 60} h`;
  return `${n}′`;
}
