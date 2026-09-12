import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creaIndice, risolvi } from '../js/match.js';

const tassonomia = [
  { id: 'olio-evo', nome: "Olio extravergine d'oliva", alias: ['olio', 'evo'], categoria: 'condimento', base: true },
  { id: 'cipolla', nome: 'Cipolla', alias: ['cipolle'], categoria: 'verdura', base: true },
  { id: 'pomodoro-fresco', nome: 'Pomodoro fresco', alias: ['pomodoro', 'pomodorini'], categoria: 'verdura' },
  { id: 'passata', nome: 'Passata di pomodoro', alias: [], categoria: 'condimento' },
  { id: 'zucca', nome: 'Zucca', alias: [], categoria: 'verdura' },
  { id: 'salsiccia', nome: 'Salsiccia', alias: ['salsicce'], categoria: 'carne' },
  { id: 'riso-carnaroli', nome: 'Riso Carnaroli', alias: ['riso', 'arborio'], categoria: 'cereale' },
  { id: 'pecorino', nome: 'Pecorino romano', alias: ['pecorino'], categoria: 'latticino' },
  { id: 'uova', nome: 'Uova', alias: ['uovo', 'tuorli'], categoria: 'uova' },
  { id: 'pasta-corta', nome: 'Pasta corta', alias: ['pasta', 'penne', 'fusilli'], categoria: 'pasta' },
  { id: 'pancetta', nome: 'Pancetta', alias: ['bacon'], categoria: 'salume' },
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

test('risolvi: "pomodorini" risolve a pomodoro-fresco e non espone flag', () => {
  const r = risolvi(indice, 'pomodorini');
  assert.equal(r.id, 'pomodoro-fresco');
  assert.equal('vietato' in r, false);
});

test('risolvi: la passata risolve al suo id, non a pomodoro-fresco', () => {
  assert.equal(risolvi(indice, 'passata di pomodoro').id, 'passata');
});

test('risolvi: forme plurali non alias vengono singolarizzate ("pomodori" → pomodoro)', () => {
  assert.equal(risolvi(indice, 'pomodori').id, 'pomodoro-fresco');
  assert.equal(risolvi(indice, 'zucche').id, 'zucca');
});

test('risolvi: plurale con accordo aggettivale a più parole ("pomodori freschi")', () => {
  assert.equal(risolvi(indice, 'pomodori freschi').id, 'pomodoro-fresco');
});

test('risolvi: singolare di un nome al plurale in tassonomia ("cece" → ceci, "acciuga" → acciughe)', () => {
  assert.equal(risolvi(indice, 'pomodorino').id, 'pomodoro-fresco');
  assert.equal(risolvi(indice, 'salsiccia').id, 'salsiccia');
  assert.equal(risolvi(indice, 'tuorlo').id, 'uova');
  assert.equal(risolvi(indice, 'pomodorino').id, 'pomodoro-fresco');
  assert.equal(risolvi(indice, 'penna rigata'), null, 'non inventa: "penne rigate" non è un alias');
});

test('risolvi: "pasta" generico risolve alla pasta corta', () => {
  assert.equal(risolvi(indice, 'pasta').id, 'pasta-corta');
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

// ---------- sostituzioni ----------
const ricetteSost = [
  ...ricette,
  R('gricia', ['pecorino', { id: 'salsiccia', sostituti: [{ id: 'pancetta', nota: 'meno grassa: aggiungi un filo d\'olio' }] }], { tempi: { preparazione: 5, cottura: 15, riposo: 0 } }),
];

test('abbina: un sostituto posseduto copre l\'ingrediente e viene riportato', () => {
  const out = abbina({ ricette: ricetteSost, indice, ingredienti: ['pecorino', 'bacon'] });
  const r = out.find((x) => x.ricetta.slug === 'gricia');
  assert.deepEqual(r.mancanti, []);
  assert.equal(r.copertura, 1);
  assert.deepEqual(r.sostituzioni, [{ richiesto: 'salsiccia', usato: 'pancetta', nota: 'meno grassa: aggiungi un filo d\'olio' }]);
});

test('abbina: se hai l\'originale, nessuna sostituzione anche se hai il sostituto', () => {
  const out = abbina({ ricette: ricetteSost, indice, ingredienti: ['pecorino', 'salsiccia', 'pancetta'] });
  const r = out.find((x) => x.ricetta.slug === 'gricia');
  assert.deepEqual(r.sostituzioni, []);
});

test('abbina: senza sostituti la proprietà è un array vuoto', () => {
  const out = abbina({ ricette: ricetteSost, indice, ingredienti: ['pecorino', 'salsiccia'] });
  assert.deepEqual(out.find((x) => x.ricetta.slug === 'carbonara').sostituzioni, []);
});

// a-senza è lenta (60′) ma senza sostituzioni; b-con è veloce ma usa un sostituto: vince a-senza
test('abbina: a parità di mancanti e copertura, prima la ricetta senza sostituzioni', () => {
  const due = [
    R('a-senza', ['pecorino'], { tempi: { preparazione: 30, cottura: 30, riposo: 0 } }),
    R('b-con', [{ id: 'salsiccia', sostituti: [{ id: 'pancetta' }] }], { tempi: { preparazione: 1, cottura: 1, riposo: 0 } }),
  ];
  const out = abbina({ ricette: due, indice, ingredienti: ['pecorino', 'bacon'] });
  assert.deepEqual(out.map((x) => x.ricetta.slug), ['a-senza', 'b-con']);
});

test('abbina: input sconosciuti vengono ignorati e riportati; niente proprietà vietati', () => {
  const out = abbina({ ricette, indice, ingredienti: ['zucca', 'unicorno', 'pomodorini'] });
  assert.ok(out.length > 0);
  assert.deepEqual(out.nonRisolti, ['unicorno']);
  assert.equal('vietati' in out, false);
});

// ---------- ingrediente principale ----------
// baccalà è il principale del bacalhau: senza, il piatto non esiste; senza prezzemolo sì
const ricettePrinc = [
  R('bacalhau', [{ id: 'zucca', principale: true }, 'uova', 'pecorino', 'salsiccia'], { tempi: { preparazione: 5, cottura: 5, riposo: 0 } }),
  R('carbonara-p', [{ id: 'salsiccia', principale: true, sostituti: [{ id: 'pancetta' }] }, { id: 'uova', principale: true }, 'pecorino']),
  R('senza-principale', ['uova', 'pecorino', 'salsiccia']),
];

test('abbina: se manca il principale la ricetta non compare, anche entro maxMancanti', () => {
  const out = abbina({ ricette: ricettePrinc, indice, ingredienti: ['uova', 'pecorino', 'salsiccia'], maxMancanti: 3 });
  assert.ok(!out.some((x) => x.ricetta.slug === 'bacalhau'), 'manca solo zucca (principale): fuori');
  assert.ok(out.some((x) => x.ricetta.slug === 'senza-principale'), 'senza flag il comportamento non cambia');
});

test('abbina: principale presente e un non-principale mancante → proposta come oggi', () => {
  const out = abbina({ ricette: ricettePrinc, indice, ingredienti: ['zucca', 'uova', 'pecorino'] });
  const r = out.find((x) => x.ricetta.slug === 'bacalhau');
  assert.deepEqual(r.mancanti, ['salsiccia']);
});

test('abbina: principale coperto da un sostituto conta come presente', () => {
  const out = abbina({ ricette: ricettePrinc, indice, ingredienti: ['uova', 'pecorino', 'bacon'] });
  const r = out.find((x) => x.ricetta.slug === 'carbonara-p');
  assert.ok(r, 'carbonara con pancetta al posto della salsiccia');
  assert.deepEqual(r.mancanti, []);
  assert.deepEqual(r.sostituzioni, [{ richiesto: 'salsiccia', usato: 'pancetta', nota: null }]);
});

test('abbina: con due principali basta che ne manchi uno per escludere la ricetta', () => {
  const out = abbina({ ricette: ricettePrinc, indice, ingredienti: ['salsiccia', 'pecorino'] });
  assert.ok(!out.some((x) => x.ricetta.slug === 'carbonara-p'), 'mancano le uova (principale)');
});

// ---------- scalaQuantita ----------
import { scalaQuantita } from '../js/match.js';

test('scalaQuantita: moltiplica i grammi e arrotonda ai 5 g', () => {
  assert.equal(scalaQuantita({ qta: 80, unita: 'g' }, 1), 80);
  assert.equal(scalaQuantita({ qta: 80, unita: 'g' }, 2), 160);
  assert.equal(scalaQuantita({ qta: 33, unita: 'g' }, 4), 130);
});

test('scalaQuantita: i pezzi (uova, spicchi) vanno a quarti, mai sotto un quarto', () => {
  assert.equal(scalaQuantita({ qta: 1, unita: 'pz' }, 2), 2);
  assert.equal(scalaQuantita({ qta: 0.5, unita: 'spicchi' }, 4), 2);
  // mezza cipolla a ×1 resta mezza: arrotondare a 1 raddoppiava la dose (e a ×1 il mezzo pollo diventava intero)
  assert.equal(scalaQuantita({ qta: 0.5, unita: 'pz' }, 1), 0.5);
  assert.equal(scalaQuantita({ qta: 0.25, unita: 'pz' }, 1), 0.25);
  assert.equal(scalaQuantita({ qta: 0.25, unita: 'pz' }, 2), 0.5);
  assert.equal(scalaQuantita({ qta: 0.5, unita: 'bustina' }, 2), 1);
  assert.equal(scalaQuantita({ qta: 0.1, unita: 'pz' }, 1), 0.25);
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
