import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stagione, pesoScelta, scegliPerMe } from '../js/match.js';

const R = (slug, { min = 20, tag = [] } = {}) => ({
  ricetta: { slug, titolo: slug, tag, tempi: { preparazione: 0, cottura: min, riposo: 0 } },
  mancanti: [],
});

const mercoledi = new Date(2026, 8, 16, 19, 0); // settembre = autunno
const sabato = new Date(2026, 8, 19, 19, 0);
const gennaio = new Date(2027, 0, 13, 19, 0);

test('stagione: dal mese, senza librerie', () => {
  assert.equal(stagione(new Date(2026, 8, 13)), 'autunno');
  assert.equal(stagione(gennaio), 'inverno');
  assert.equal(stagione(new Date(2026, 6, 1)), 'estate');
});

test('peso: di sera in settimana le ricette corte battono le lunghe', () => {
  const corta = pesoScelta(R('corta', { min: 30 }).ricetta, mercoledi);
  const lunga = pesoScelta(R('lunga', { min: 120 }).ricetta, mercoledi);
  assert.ok(corta > lunga * 4, `corta ${corta} deve staccare lunga ${lunga}`);
});

test('peso: nel weekend la lunga si riprende', () => {
  const feriale = pesoScelta(R('brasato', { min: 180 }).ricetta, mercoledi);
  const festivo = pesoScelta(R('brasato', { min: 180 }).ricetta, sabato);
  assert.ok(festivo > feriale, 'il sabato il brasato ha senso');
});

test('peso: il tag `weekend` conta quanto essere lunga, anche se la ricetta è corta', () => {
  assert.equal(
    pesoScelta(R('x', { min: 20, tag: ['weekend'] }).ricetta, mercoledi),
    pesoScelta(R('y', { min: 120 }).ricetta, mercoledi),
  );
});

test('peso: la stagione nei tag raddoppia', () => {
  const con = pesoScelta(R('zucca', { tag: ['autunno'] }).ricetta, mercoledi);
  const senza = pesoScelta(R('altro').ricetta, mercoledi);
  assert.equal(con, senza * 2);
});

test('peso: fuori stagione il tag non penalizza, semplicemente non aiuta', () => {
  assert.equal(
    pesoScelta(R('zucca', { tag: ['autunno'] }).ricetta, gennaio),
    pesoScelta(R('altro').ricetta, gennaio),
  );
});

test('scegli: pesca solo fra le ricette a zero mancanti', () => {
  const abbinate = [
    { ...R('da-comprare'), mancanti: ['pecorino'] },
    R('pronta'),
  ];
  const x = scegliPerMe({ abbinate, ora: mercoledi, caso: () => 0.99 });
  assert.equal(x.ricetta.slug, 'pronta');
});

test('scegli: niente di pronto → null (il bottone che porta qui resta spento)', () => {
  const abbinate = [{ ...R('a'), mancanti: ['x'] }, { ...R('b'), mancanti: ['y', 'z'] }];
  assert.equal(scegliPerMe({ abbinate, ora: mercoledi }), null);
  assert.equal(scegliPerMe({ abbinate: [], ora: mercoledi }), null);
});

test('scegli: con il caso fissato la pesca è ripetibile e segue i pesi', () => {
  const abbinate = [R('prima'), R('seconda'), R('terza')]; // pesi uguali: 1/3 a testa
  assert.equal(scegliPerMe({ abbinate, ora: mercoledi, caso: () => 0 }).ricetta.slug, 'prima');
  assert.equal(scegliPerMe({ abbinate, ora: mercoledi, caso: () => 0.5 }).ricetta.slug, 'seconda');
  assert.equal(scegliPerMe({ abbinate, ora: mercoledi, caso: () => 0.99 }).ricetta.slug, 'terza');
  assert.equal(scegliPerMe({ abbinate, ora: mercoledi, caso: () => 1 }).ricetta.slug, 'terza', 'caso() = 1 non deve tornare null');
});

test('scegli: "Un\'altra" non ripete quelle già viste', () => {
  const abbinate = [R('prima'), R('seconda')];
  const x = scegliPerMe({ abbinate, ora: mercoledi, caso: () => 0, gia: ['prima'] });
  assert.equal(x.ricetta.slug, 'seconda');
});

test('scegli: viste tutte, riparte da capo invece di non dare niente', () => {
  const abbinate = [R('prima'), R('seconda')];
  const x = scegliPerMe({ abbinate, ora: mercoledi, caso: () => 0, gia: ['prima', 'seconda'] });
  assert.ok(x, 'meglio ripetersi che lasciare la pagina vuota');
});

test('scegli: su molte pescate la corta esce più spesso della lunga, di sera in settimana', () => {
  const abbinate = [R('corta', { min: 25 }), R('brasato', { min: 180 })];
  let corte = 0;
  for (let i = 0; i < 1000; i++) {
    const x = scegliPerMe({ abbinate, ora: mercoledi, caso: () => i / 1000 });
    if (x.ricetta.slug === 'corta') corte++;
  }
  assert.ok(corte > 780 && corte < 860, `attese ~820 su 1000, ottenute ${corte}`);
});
