import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creaIndice, risolvi } from '../js/match.js';

const tassonomia = [
  { id: 'olio-evo', nome: "Olio extravergine d'oliva", alias: ['olio', 'evo'], categoria: 'condimento', base: true },
  { id: 'cipolla', nome: 'Cipolla', alias: ['cipolle'], categoria: 'verdura', base: true },
  { id: 'pomodoro-fresco', nome: 'Pomodoro fresco', alias: ['pomodoro', 'pomodorini'], categoria: 'verdura', vietato: true },
  { id: 'passata', nome: 'Passata di pomodoro', alias: [], categoria: 'condimento' },
  { id: 'zucca', nome: 'Zucca', alias: [], categoria: 'verdura' },
  { id: 'salsiccia', nome: 'Salsiccia', alias: ['salsicce'], categoria: 'carne' },
  { id: 'riso-carnaroli', nome: 'Riso Carnaroli', alias: ['riso', 'arborio'], categoria: 'cereale' },
  { id: 'pecorino', nome: 'Pecorino romano', alias: ['pecorino'], categoria: 'latticino' },
  { id: 'uova', nome: 'Uova', alias: ['uovo', 'tuorli'], categoria: 'uova' },
];

const indice = creaIndice(tassonomia);

test('risolvi: alias → id canonico, ignorando maiuscole e accenti', () => {
  assert.equal(risolvi(indice, 'Salsicce').id, 'salsiccia');
  assert.equal(risolvi(indice, 'ARBORIO').id, 'riso-carnaroli');
  assert.equal(risolvi(indice, 'olio extravergine d’oliva').id, 'olio-evo');
});

test('risolvi: il nome completo funziona come alias', () => {
  assert.equal(risolvi(indice, 'Pecorino romano').id, 'pecorino');
});

test('risolvi: ingrediente sconosciuto → null', () => {
  assert.equal(risolvi(indice, 'unicorno'), null);
});

test('risolvi: ingrediente vietato è riconosciuto e marcato', () => {
  const r = risolvi(indice, 'pomodorini');
  assert.equal(r.id, 'pomodoro-fresco');
  assert.equal(r.vietato, true);
});

test('risolvi: la passata NON è vietata anche se contiene la parola pomodoro', () => {
  const r = risolvi(indice, 'passata di pomodoro');
  assert.equal(r.id, 'passata');
  assert.equal(r.vietato, false);
});

// ---------- abbina ----------
import { abbina } from '../js/match.js';

const R = (slug, ingredienti, extra = {}) => ({
  slug, titolo: slug, tempi: { preparazione: 10, cottura: 10, riposo: 0 },
  ingredienti: ingredienti.map((i) => (typeof i === 'string' ? { id: i } : i)), ...extra,
});
const ricette = [
  R('risotto-zucca', ['riso-carnaroli', 'zucca', 'salsiccia', 'cipolla', 'olio-evo']),
  R('carbonara', ['uova', 'pecorino', 'salsiccia'], { tempi: { preparazione: 5, cottura: 10, riposo: 0 } }),
  R('zucca-forno', ['zucca', 'olio-evo', { id: 'pecorino', opzionale: true }], { tempi: { preparazione: 5, cottura: 30, riposo: 0 } }),
  R('sugo', ['passata', 'cipolla', 'olio-evo']),
];

test('abbina: ricetta con tutti gli ingredienti ha copertura 1 e nessun mancante', () => {
  const out = abbina({ ricette, indice, ingredienti: ['zucca', 'salsicce', 'riso'] });
  const r = out.find((x) => x.ricetta.slug === 'risotto-zucca');
  assert.deepEqual(r.mancanti, []);
  assert.equal(r.copertura, 1);
});

test('abbina: gli ingredienti base (cipolla, olio) non contano come mancanti', () => {
  const out = abbina({ ricette, indice, ingredienti: ['passata'] });
  const r = out.find((x) => x.ricetta.slug === 'sugo');
  assert.deepEqual(r.mancanti, []);
});

test('abbina: gli ingredienti opzionali non contano come mancanti', () => {
  const out = abbina({ ricette, indice, ingredienti: ['zucca'] });
  const r = out.find((x) => x.ricetta.slug === 'zucca-forno');
  assert.deepEqual(r.mancanti, []);
});

test('abbina: elenca i mancanti e calcola la copertura sui soli richiesti', () => {
  const out = abbina({ ricette, indice, ingredienti: ['uova', 'salsiccia'] });
  const r = out.find((x) => x.ricetta.slug === 'carbonara');
  assert.deepEqual(r.mancanti, ['pecorino']);
  assert.equal(r.copertura, 2 / 3);
});

test('abbina: scarta le ricette con più di maxMancanti (default 2)', () => {
  const out = abbina({ ricette, indice, ingredienti: ['zucca'] });
  assert.ok(!out.some((x) => x.ricetta.slug === 'carbonara'), 'carbonara ha 3 mancanti');
  const out1 = abbina({ ricette, indice, ingredienti: ['uova', 'salsiccia'], maxMancanti: 0 });
  assert.ok(!out1.some((x) => x.ricetta.slug === 'carbonara'));
});

test('abbina: ordina per numero di mancanti, poi per tempo totale crescente', () => {
  const out = abbina({ ricette, indice, ingredienti: ['zucca', 'salsiccia', 'riso', 'uova', 'pecorino'] });
  // tutte a 0 mancanti: carbonara 15′ < risotto 20′ < zucca-forno 35′; sugo (0 posseduti) escluso
  assert.deepEqual(out.map((x) => x.ricetta.slug), ['carbonara', 'risotto-zucca', 'zucca-forno']);
});

test('abbina: input sconosciuti o vietati vengono ignorati e riportati', () => {
  const out = abbina({ ricette, indice, ingredienti: ['zucca', 'unicorno', 'pomodorini'] });
  assert.ok(out.length > 0);
  assert.deepEqual(out.nonRisolti, ['unicorno']);
  assert.deepEqual(out.vietati, ['pomodoro-fresco']);
});

// ---------- scalaQuantita ----------
import { scalaQuantita } from '../js/match.js';

test('scalaQuantita: moltiplica i grammi e arrotonda ai 5 g', () => {
  assert.equal(scalaQuantita({ qta: 80, unita: 'g' }, 1), 80);
  assert.equal(scalaQuantita({ qta: 80, unita: 'g' }, 2), 160);
  assert.equal(scalaQuantita({ qta: 33, unita: 'g' }, 4), 130);
});

test('scalaQuantita: i pezzi (uova, spicchi) restano interi', () => {
  assert.equal(scalaQuantita({ qta: 1, unita: 'pz' }, 2), 2);
  assert.equal(scalaQuantita({ qta: 0.5, unita: 'pz' }, 1), 1);
  assert.equal(scalaQuantita({ qta: 0.5, unita: 'spicchi' }, 4), 2);
});

test('scalaQuantita: q.b. resta null', () => {
  assert.equal(scalaQuantita({ qta: null, unita: 'qb' }, 4), null);
});

test('scalaQuantita: cucchiai e cucchiaini mantengono il mezzo', () => {
  assert.equal(scalaQuantita({ qta: 0.5, unita: 'cucchiai' }, 1), 0.5);
  assert.equal(scalaQuantita({ qta: 1.5, unita: 'cucchiaini' }, 2), 3);
});

test('abbina: una ricetta di cui non possiedi nessun ingrediente non compare', () => {
  const out = abbina({ ricette, indice, ingredienti: ['zucca'] });
  // "sugo" richiede solo passata (cipolla e olio sono base): 0 posseduti → fuori
  assert.ok(!out.some((x) => x.ricetta.slug === 'sugo'));
});

test('abbina: a parità di mancanti, prima la copertura più alta', () => {
  const r2 = [
    R('a-due', ['zucca', 'pecorino'], { tempi: { preparazione: 1, cottura: 1, riposo: 0 } }),          // 1/2
    R('b-quattro', ['zucca', 'salsiccia', 'riso-carnaroli', 'pecorino'], { tempi: { preparazione: 50, cottura: 50, riposo: 0 } }), // 3/4
  ];
  const out = abbina({ ricette: r2, indice, ingredienti: ['zucca', 'salsiccia', 'riso'] });
  assert.deepEqual(out.map((x) => x.ricetta.slug), ['b-quattro', 'a-due']);
});
