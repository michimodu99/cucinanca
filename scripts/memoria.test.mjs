import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leggiDispensa, salvaDispensa, leggiEsclusi, salvaEsclusi, giorniFa } from '../js/memoria.js';

/** Un finto localStorage: la stessa interfaccia, senza browser. */
function finto(iniziale = {}) {
  const m = new Map(Object.entries(iniziale));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    chiavi: () => [...m.keys()],
  };
}

/** Safari in navigazione privata e i browser coi cookie bloccati lanciano al solo tocco. */
const rotto = {
  getItem() { throw new Error('SecurityError'); },
  setItem() { throw new Error('QuotaExceededError'); },
};

test('dispensa: salva e rilegge gli ingredienti e la data', () => {
  const s = finto();
  salvaDispensa(['zucca', 'salsiccia'], s, 1757000000000);
  assert.deepEqual(leggiDispensa(s), { i: ['zucca', 'salsiccia'], ts: 1757000000000 });
});

test('dispensa: le chiavi sono sotto il prefisso del progetto', () => {
  const s = finto();
  salvaDispensa(['zucca'], s);
  salvaEsclusi(['broccoli'], s);
  assert.deepEqual(s.chiavi().sort(), ['cucinanca:dispensa', 'cucinanca:esclusi']);
});

test('dispensa: memoria vuota → nessun ingrediente, nessuna data', () => {
  assert.deepEqual(leggiDispensa(finto()), { i: [], ts: null });
  assert.deepEqual(leggiEsclusi(finto()), []);
});

test('dispensa: salvare il vuoto è un\'operazione vera (il pulsante Svuota)', () => {
  const s = finto();
  salvaDispensa(['zucca'], s);
  salvaDispensa([], s);
  assert.deepEqual(leggiDispensa(s).i, []);
});

test('memoria illeggibile (JSON rotto, versione vecchia, roba altrui) → si riparte da zero', () => {
  assert.deepEqual(leggiDispensa(finto({ 'cucinanca:dispensa': '{nonJson' })).i, []);
  assert.deepEqual(leggiDispensa(finto({ 'cucinanca:dispensa': '{"v":0,"i":["zucca"]}' })).i, []);
  assert.deepEqual(leggiDispensa(finto({ 'cucinanca:dispensa': '"zucca"' })).i, []);
  assert.deepEqual(leggiDispensa(finto({ 'cucinanca:dispensa': '{"v":1,"i":"zucca"}' })).i, []);
});

test('memoria: scarta le voci che non sono testo, tiene le altre', () => {
  const s = finto({ 'cucinanca:dispensa': '{"v":1,"i":["zucca",null,3,"  ","riso"]}' });
  assert.deepEqual(leggiDispensa(s).i, ['zucca', 'riso']);
});

test('memoria: data non valida → nessuna data, non NaN', () => {
  const s = finto({ 'cucinanca:dispensa': '{"v":1,"ts":"ieri","i":["zucca"]}' });
  assert.equal(leggiDispensa(s).ts, null);
});

test('storage che lancia: nessuna eccezione, il sito semplicemente non ricorda', () => {
  assert.deepEqual(leggiDispensa(rotto), { i: [], ts: null });
  assert.deepEqual(leggiEsclusi(rotto), []);
  assert.equal(salvaDispensa(['zucca'], rotto), false);
  assert.equal(salvaEsclusi(['broccoli'], rotto), false);
});

test('esclusi: salva e rilegge la lista', () => {
  const s = finto();
  salvaEsclusi(['broccoli', 'piselli'], s);
  assert.deepEqual(leggiEsclusi(s), ['broccoli', 'piselli']);
});

test('giorniFa: conta i giorni di calendario, non le 24 ore', () => {
  const oggiPomeriggio = new Date(2026, 8, 13, 15, 0).getTime();
  const iersera = new Date(2026, 8, 12, 23, 30).getTime();
  const martedi = new Date(2026, 8, 8, 9, 0).getTime();
  assert.equal(giorniFa(new Date(2026, 8, 13, 8, 0).getTime(), oggiPomeriggio), 0);
  assert.equal(giorniFa(iersera, oggiPomeriggio), 1, 'salvata alle 23:30 e riaperta stamattina: è ieri');
  assert.equal(giorniFa(martedi, oggiPomeriggio), 5);
});

test('giorniFa: senza data → null', () => {
  assert.equal(giorniFa(null), null);
  assert.equal(giorniFa(undefined), null);
  assert.equal(giorniFa(NaN), null);
});
