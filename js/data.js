// Carica i dati e costruisce gli indici. Un solo fetch per sessione.
import { creaIndice } from './match.js';

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

export const ETICHETTE = {
  categoria: { antipasto: 'Antipasto', primo: 'Primo', secondo: 'Secondo', 'piatto-unico': 'Piatto unico', contorno: 'Contorno', dolce: 'Dolce' },
  categoriaPlurale: { antipasto: 'Antipasti', primo: 'Primi', secondo: 'Secondi', 'piatto-unico': 'Piatti unici', contorno: 'Contorni', dolce: 'Dolci' },
  difficolta: { 'molto-facile': 'Molto facile', facile: 'Facile', media: 'Media', difficile: 'Difficile' },
  difficoltaOrdine: { 'molto-facile': 0, facile: 1, media: 2, difficile: 3 },
  costo: { basso: 'Basso', medio: 'Medio', alto: 'Alto' },
  costoOrdine: { basso: 0, medio: 1, alto: 2 },
  attrezzatura: { padella: 'Padella', pentola: 'Pentola', forno: 'Forno', microonde: 'Microonde', teglia: 'Teglia', frullatore: 'Frullatore', mattarello: 'Mattarello', stampo: 'Stampo', stampini: 'Stampini', frusta: 'Frusta', griglia: 'Griglia' },
  tag: { veloce: 'Veloce', weekend: 'Weekend', 'one-pan': 'Una padella', avanzi: 'Avanzi', 'low-cost': 'Low cost', 'da-ospiti': 'Da ospiti', autunno: 'Autunno', inverno: 'Inverno', classico: 'Classico', portoghese: 'Portoghese' },
  dieta: { vegetariano: 'Vegetariana', vegano: 'Vegana', 'senza-glutine': 'Senza glutine', 'senza-lattosio': 'Senza lattosio' },
  categoriaIngrediente: { carne: 'Carne', pesce: 'Pesce', salume: 'Salumi', latticino: 'Latticini', uova: 'Uova', verdura: 'Verdure', frutta: 'Frutta e frutta secca', cereale: 'Cereali e pane', pasta: 'Pasta', legume: 'Legumi', condimento: 'Condimenti e vino', spezia: 'Spezie', erba: 'Erbe', dolce: 'Per i dolci', altro: 'Altro' },
  unita: { g: 'g', ml: 'ml', pz: '', cucchiai: 'cucchiai', cucchiaini: 'cucchiaini', qb: 'q.b.', bustina: 'bustina', spicchi: 'spicchi', foglie: 'foglie', rametti: 'rametti', fette: 'fette', pizzico: 'pizzico' },
};

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
