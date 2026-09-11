// Vista dispensa: input con suggerimenti, chip, indice per categoria, barra azione.
import { normalizza, risolvi } from './match.js';
import { ETICHETTE } from './data.js';
import { t } from './i18n.js';
import { vai, ingredientiDaParams } from './app.js';

const ORDINE_CATEGORIE = ['verdura', 'carne', 'pesce', 'salume', 'latticino', 'uova', 'pasta', 'cereale', 'legume', 'frutta', 'condimento', 'erba', 'spezia', 'dolce', 'altro'];

const el = {
  form: document.getElementById('ingresso'),
  input: document.getElementById('ingrediente'),
  sugg: document.getElementById('suggerimenti'),
  msg: document.getElementById('ingresso-msg'),
  chips: document.getElementById('chips'),
  indice: document.getElementById('indice-ingredienti'),
  count: document.getElementById('azione-count'),
  btn: document.getElementById('btn-cucina'),
  basi: document.getElementById('basi'),
};

let dati;
let scelti = []; // testi come digitati (o id canonici dall'indice)
let montato = false;
let cursore = -1;

export function montaDispensa(d, params) {
  dati = d;
  scelti = ingredientiDaParams(params);
  if (!montato) {
    montaUnaVolta();
    montato = true;
  }
  render();
}

function montaUnaVolta() {
  // dispensa base
  const base = dati.tassonomia.filter((i) => i.base).map((i) => i.nome.toLowerCase());
  el.basi.textContent = t('dispensa.basi', { elenco: base.join(', ') });

  // indice per categoria (esclusi i base), ordinato per quante ricette lo usano
  const perCat = new Map();
  for (const i of dati.tassonomia) {
    if (i.base) continue;
    if (!perCat.has(i.categoria)) perCat.set(i.categoria, []);
    perCat.get(i.categoria).push(i);
  }
  const frag = document.createDocumentFragment();
  for (const cat of ORDINE_CATEGORIE) {
    const voci = perCat.get(cat);
    if (!voci) continue;
    voci.sort((a, b) => (dati.uso.get(b.id) || 0) - (dati.uso.get(a.id) || 0) || a.nome.localeCompare(b.nome, 'it'));
    const riga = document.createElement('div');
    riga.className = 'indice-riga';
    const lab = document.createElement('span');
    lab.className = 'label';
    lab.textContent = ETICHETTE.categoriaIngrediente[cat] || cat;
    const lista = document.createElement('div');
    lista.className = 'indice-voci';
    voci.forEach((v, k) => {
      if (k) {
        const sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = '/';
        lista.appendChild(sep);
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.id = v.id;
      b.textContent = v.nome;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => toggle(v.id));
      lista.appendChild(b);
    });
    riga.append(lab, lista);
    frag.appendChild(riga);
  }
  el.indice.appendChild(frag);

  // input + suggerimenti
  el.input.addEventListener('input', () => suggerisci(el.input.value));
  el.input.addEventListener('keydown', (e) => {
    const items = [...el.sugg.querySelectorAll('li')];
    if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); cursore = (cursore + 1) % items.length; evidenzia(items); }
    else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); cursore = (cursore - 1 + items.length) % items.length; evidenzia(items); }
    else if (e.key === 'Escape') chiudiSugg();
  });
  el.input.addEventListener('blur', () => setTimeout(chiudiSugg, 150));
  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const items = [...el.sugg.querySelectorAll('li')];
    if (cursore >= 0 && items[cursore]) aggiungi(items[cursore].dataset.id);
    else if (items.length === 1) aggiungi(items[0].dataset.id);
    else aggiungiTesto(el.input.value);
  });
  el.btn.addEventListener('click', () => vai('risultati', { i: scelti }));
}

function suggerisci(testo) {
  const q = normalizza(testo);
  cursore = -1;
  if (q.length < 2) return chiudiSugg();
  const hit = [];
  for (const i of dati.tassonomia) {
    if (i.base) continue;
    const chiavi = [i.nome, ...(i.alias || [])];
    const m = chiavi.find((k) => normalizza(k).includes(q));
    if (m) hit.push({ i, alias: normalizza(m) !== normalizza(i.nome) ? m : null, prio: normalizza(i.nome).startsWith(q) ? 0 : 1 });
  }
  hit.sort((a, b) => a.prio - b.prio || (dati.uso.get(b.i.id) || 0) - (dati.uso.get(a.i.id) || 0));
  el.sugg.innerHTML = '';
  for (const { i, alias } of hit.slice(0, 8)) {
    const li = document.createElement('li');
    li.dataset.id = i.id;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', 'false');
    li.innerHTML = `<span>${i.nome}</span><small>${alias ? t('dispensa.anche', { alias }) : (ETICHETTE.categoriaIngrediente[i.categoria] || '')}</small>`;
    li.addEventListener('mousedown', (e) => { e.preventDefault(); aggiungi(i.id); });
    el.sugg.appendChild(li);
  }
  el.sugg.hidden = !hit.length;
  el.input.setAttribute('aria-expanded', String(!!hit.length));
}

function evidenzia(items) {
  items.forEach((li, k) => li.setAttribute('aria-selected', String(k === cursore)));
}

function chiudiSugg() {
  el.sugg.hidden = true;
  el.input.setAttribute('aria-expanded', 'false');
  cursore = -1;
}

function aggiungiTesto(testo) {
  const t0 = testo.trim();
  if (!t0) return;
  const r = risolvi(dati.indice, t0);
  if (r) return aggiungi(r.id);
  // non riconosciuto: lo teniamo come chip tratteggiato, il matching lo ignorerà
  if (!scelti.includes(t0)) scelti.push(t0);
  el.msg.textContent = t('dispensa.sconosciuto', { t: t0 });
  el.msg.classList.remove('err');
  el.input.value = '';
  chiudiSugg();
  render();
}

function aggiungi(id) {
  const ing = dati.indice.byId.get(id);
  el.input.value = '';
  chiudiSugg();
  if (ing.base) {
    el.msg.textContent = t('dispensa.giaBase', { nome: ing.nome });
    el.msg.classList.remove('err');
    return;
  }
  el.msg.textContent = '';
  if (!scelti.includes(id)) scelti.push(id);
  render();
  el.input.focus();
}

function toggle(id) {
  if (scelti.includes(id)) scelti = scelti.filter((s) => s !== id);
  else scelti.push(id);
  render();
}

function rimuovi(s) {
  scelti = scelti.filter((x) => x !== s);
  render();
}

function render() {
  // chips
  el.chips.innerHTML = '';
  for (const s of scelti) {
    const r = risolvi(dati.indice, s);
    const li = document.createElement('li');
    li.className = 'chip' + (r ? '' : ' sconosciuto');
    li.innerHTML = `<span>${r ? r.nome : s}</span>`;
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', t('dispensa.togli', { nome: r ? r.nome : s }));
    b.textContent = '×';
    b.addEventListener('click', () => rimuovi(s));
    li.appendChild(b);
    el.chips.appendChild(li);
  }
  // indice
  const ids = new Set(scelti.map((s) => risolvi(dati.indice, s)?.id).filter(Boolean));
  for (const b of el.indice.querySelectorAll('button[data-id]')) b.setAttribute('aria-pressed', String(ids.has(b.dataset.id)));
  // barra
  const n = ids.size;
  el.count.textContent = n === 0 ? t('dispensa.nessuno') : n === 1 ? t('dispensa.uno') : t('dispensa.molti', { n });
  el.btn.disabled = n === 0;
  // URL senza navigare (così un refresh non perde la lista)
  const hash = scelti.length ? `#/?i=${encodeURIComponent(scelti.join(','))}` : '#/';
  if (location.hash !== hash) history.replaceState(null, '', hash);
}
