// Vista dispensa: input con suggerimenti, chip, indice per categoria, barra azione,
// memoria locale (la dispensa si ricorda) e preferenze ("non mangio").
import { normalizza, risolvi, abbina } from './match.js';
import { ETICHETTE, escapeHtml } from './data.js';
import { t } from './i18n.js';
import { vai, ingredientiDaParams } from './app.js';
import { leggiDispensa, salvaDispensa, leggiEsclusi, salvaEsclusi, giorniFa } from './memoria.js';

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
  scegli: document.getElementById('btn-scegli'),
  basi: document.getElementById('basi'),
  video: document.getElementById('hero-video'),
  memoria: document.getElementById('memoria'),
  quando: document.getElementById('memoria-quando'),
  svuota: document.getElementById('btn-svuota'),
  copia: document.getElementById('btn-copia'),
  prefConta: document.getElementById('pref-conta'),
  prefForm: document.getElementById('ingresso-escluso'),
  prefInput: document.getElementById('escluso'),
  prefSugg: document.getElementById('suggerimenti-esclusi'),
  prefMsg: document.getElementById('escluso-msg'),
  prefChips: document.getElementById('chips-esclusi'),
};

let dati;
let scelti = []; // testi come digitati (o id canonici dall'indice)
let esclusi = []; // id canonici che l'utente non mangia
let ts = null; // quando è stata salvata la dispensa in memoria
let daLink = false; // la lista arriva da un ?i= altrui: non sovrascrivo la memoria finché non tocchi niente
let montato = false;

export function montaDispensa(d, params) {
  dati = d;
  esclusi = leggiEsclusi().filter((id) => dati.indice.byId.has(id)); // la tassonomia cambia, la memoria resta
  daLink = params.has('i');
  if (daLink) {
    scelti = ingredientiDaParams(params);
    ts = null;
  } else {
    const memoria = leggiDispensa();
    scelti = memoria.i;
    ts = memoria.ts;
  }
  if (!montato) {
    montaUnaVolta();
    montato = true;
  }
  render();
}

/** Ferma o riprende la clip della hero: chiamata dal router quando la dispensa esce/entra in scena (un video nascosto continua a decodificare). */
export function videoDispensa(acceso) {
  if (!el.video) return; // HTML e JS possono arrivare da cache diverse subito dopo un deploy: mai bloccare le ricette per il video
  if (acceso) { if (el.video.hasAttribute('autoplay')) el.video.play().catch(() => {}); }
  else el.video.pause();
}

/** La dispensa mostrata diventa quella ricordata. Solo sulle modifiche vere: `render()` gira anche
 *  al montaggio, e salvare lì sovrascriverebbe la tua dispensa appena apri il link di un altro. */
function salva() {
  daLink = false;
  ts = Date.now();
  salvaDispensa(scelti, undefined, ts);
}

function montaUnaVolta() {
  // chi ha "riduci movimento" vede solo il poster (il CSS nasconde il video, qui evitiamo pure di scaricarlo)
  if (el.video && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.video.removeAttribute('autoplay');
    el.video.pause();
  }

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

  // dispensa: l'ingrediente scelto entra fra quelli posseduti
  creaCampoIngrediente({
    form: el.form,
    input: el.input,
    sugg: el.sugg,
    onScelta: aggiungi,
    onIgnoto: aggiungiTesto,
  });

  // preferenze: lo stesso campo, ma pesca anche fra i base (chi non mangia aglio non lo vuole "sempre presente")
  creaCampoIngrediente({
    form: el.prefForm,
    input: el.prefInput,
    sugg: el.prefSugg,
    conBase: true,
    onScelta: escludi,
    onIgnoto: (testo) => { el.prefMsg.textContent = t('dispensa.sconosciuto', { t: testo }); },
  });

  el.svuota.addEventListener('click', () => {
    scelti = [];
    salva(); // salvare il vuoto è un'operazione vera: domani non deve ripescare la dispensa di oggi
    render();
  });

  el.copia.addEventListener('click', async () => {
    const url = location.origin + location.pathname + '#/?i=' + encodeURIComponent(scelti.join(','));
    try {
      await navigator.clipboard.writeText(url);
      lampeggia(el.copia, t('dispensa.copiato'));
    } catch {
      lampeggia(el.copia, t('dispensa.copiaErrore'));
    }
  });

  el.btn.addEventListener('click', () => vai('risultati', { i: scelti }));
  el.scegli.addEventListener('click', () => vai('scegli', { i: scelti }));
}

/** Testo temporaneo su un bottone, poi torna quello di prima (come la copia della spesa nel libro). */
function lampeggia(bottone, testo, chiave = 'dispensa.copiaLink') {
  bottone.textContent = testo;
  setTimeout(() => { bottone.textContent = t(chiave); }, 1800);
}

/** L'input con i suggerimenti: frecce, Invio, corrispondenza esatta che batte i contenuti ("sale" è
 *  il sale, non i capperi sotto sale). Dispensa e "non mangio" lo usano entrambi, quindi sta qui una volta sola. */
function creaCampoIngrediente({ form, input, sugg, conBase = false, onScelta, onIgnoto }) {
  let cursore = -1;

  const chiudi = () => {
    sugg.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    cursore = -1;
  };

  const evidenzia = (items) => items.forEach((li, k) => li.setAttribute('aria-selected', String(k === cursore)));

  const suggerisci = (testo) => {
    const q = normalizza(testo);
    cursore = -1;
    if (q.length < 2) return chiudi();
    const hit = [];
    for (const i of dati.tassonomia) {
      if (i.base && !conBase) continue;
      const chiavi = [i.nome, ...(i.alias || [])];
      const m = chiavi.find((k) => normalizza(k).includes(q));
      if (m) hit.push({ i, alias: normalizza(m) !== normalizza(i.nome) ? m : null, prio: normalizza(i.nome).startsWith(q) ? 0 : 1 });
    }
    hit.sort((a, b) => a.prio - b.prio || (dati.uso.get(b.i.id) || 0) - (dati.uso.get(a.i.id) || 0));
    sugg.innerHTML = '';
    for (const { i, alias } of hit.slice(0, 8)) {
      const li = document.createElement('li');
      li.dataset.id = i.id;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.innerHTML = `<span>${i.nome}</span><small>${alias ? t('dispensa.anche', { alias }) : (ETICHETTE.categoriaIngrediente[i.categoria] || '')}</small>`;
      li.addEventListener('mousedown', (e) => { e.preventDefault(); scegli(i.id); });
      sugg.appendChild(li);
    }
    sugg.hidden = !hit.length;
    input.setAttribute('aria-expanded', String(!!hit.length));
  };

  const scegli = (id) => {
    input.value = '';
    chiudi();
    onScelta(id);
    input.focus();
  };

  input.addEventListener('input', () => suggerisci(input.value));
  input.addEventListener('keydown', (e) => {
    const items = [...sugg.querySelectorAll('li')];
    if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); cursore = (cursore + 1) % items.length; evidenzia(items); }
    else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); cursore = (cursore - 1 + items.length) % items.length; evidenzia(items); }
    else if (e.key === 'Escape') chiudi();
  });
  input.addEventListener('blur', () => setTimeout(chiudi, 150));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const items = [...sugg.querySelectorAll('li')];
    const esatto = risolvi(dati.indice, input.value);
    if (cursore >= 0 && items[cursore]) scegli(items[cursore].dataset.id);
    else if (esatto) scegli(esatto.id); // "sale" è sale, non l'unico suggerimento che lo contiene (capperi sotto sale)
    else if (items.length === 1) scegli(items[0].dataset.id);
    else {
      const testo = input.value.trim();
      input.value = '';
      chiudi();
      if (testo) onIgnoto(testo);
    }
  });
}

function aggiungiTesto(testo) {
  // non riconosciuto: lo teniamo come chip tratteggiato, il matching lo ignorerà
  if (!scelti.includes(testo)) scelti.push(testo);
  el.msg.textContent = t('dispensa.sconosciuto', { t: testo });
  el.msg.classList.remove('err');
  salva();
  render();
}

function aggiungi(id) {
  const ing = dati.indice.byId.get(id);
  if (esclusi.includes(id)) {
    el.msg.textContent = t('dispensa.giaEscluso', { nome: ing.nome });
    return;
  }
  if (ing.base) {
    el.msg.textContent = t('dispensa.giaBase', { nome: ing.nome });
    el.msg.classList.remove('err');
    return;
  }
  el.msg.textContent = '';
  if (!scelti.includes(id)) scelti.push(id);
  salva();
  render();
}

function toggle(id) {
  if (esclusi.includes(id)) {
    el.msg.textContent = t('dispensa.giaEscluso', { nome: dati.indice.byId.get(id).nome });
    return;
  }
  if (scelti.includes(id)) scelti = scelti.filter((s) => s !== id);
  else scelti.push(id);
  salva();
  render();
}

function rimuovi(s) {
  scelti = scelti.filter((x) => x !== s);
  salva();
  render();
}

/** Da qui in poi non lo mangio: esce anche dalla dispensa, altrimenti resterebbe una chip che non conta nulla. */
function escludi(id) {
  el.prefMsg.textContent = '';
  if (!esclusi.includes(id)) esclusi.push(id);
  salvaEsclusi(esclusi);
  const prima = scelti.length;
  scelti = scelti.filter((s) => risolvi(dati.indice, s)?.id !== id);
  if (scelti.length !== prima) salva();
  render();
}

function rimetti(id) {
  esclusi = esclusi.filter((x) => x !== id);
  salvaEsclusi(esclusi);
  render();
}

function chip({ testo, nome, classe, etichettaTogli, onTogli, titolo }) {
  const li = document.createElement('li');
  li.className = 'chip' + (classe ? ' ' + classe : '');
  if (titolo) li.title = titolo;
  li.innerHTML = `<span>${nome ? nome : escapeHtml(testo)}</span>`;
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('aria-label', etichettaTogli);
  b.textContent = '×';
  b.addEventListener('click', onTogli);
  li.appendChild(b);
  return li;
}

function render() {
  // chip della dispensa
  el.chips.innerHTML = '';
  for (const s of scelti) {
    const r = risolvi(dati.indice, s);
    const fuori = Boolean(r && esclusi.includes(r.id)); // arrivato da un link: lo mostro barrato, il matcher lo ignora
    el.chips.appendChild(chip({
      testo: s,
      nome: r ? r.nome : null,
      classe: (r ? '' : 'sconosciuto') + (fuori ? ' esclusa' : ''),
      titolo: fuori ? t('dispensa.esclusoTitolo') : null,
      etichettaTogli: t('dispensa.togli', { nome: r ? r.nome : s }),
      onTogli: () => rimuovi(s),
    }));
  }

  // chip di "non mangio"
  el.prefChips.innerHTML = '';
  for (const id of esclusi) {
    const nome = dati.indice.byId.get(id).nome;
    el.prefChips.appendChild(chip({
      nome,
      classe: 'esclusa',
      etichettaTogli: t('dispensa.togliEscluso', { nome }),
      onTogli: () => rimetti(id),
    }));
  }
  if (!esclusi.length) {
    const vuoto = document.createElement('li');
    vuoto.className = 'pref-vuoto';
    vuoto.textContent = t('dispensa.prefVuoto');
    el.prefChips.appendChild(vuoto);
  }
  el.prefConta.textContent = esclusi.length ? t('dispensa.prefConta', { n: esclusi.length }) : '';

  // indice: premuto quello che hai, barrato quello che non mangi
  const ids = new Set(scelti.map((s) => risolvi(dati.indice, s)?.id).filter(Boolean));
  for (const b of el.indice.querySelectorAll('button[data-id]')) {
    const fuori = esclusi.includes(b.dataset.id);
    b.setAttribute('aria-pressed', String(!fuori && ids.has(b.dataset.id)));
    b.classList.toggle('escluso', fuori);
    if (fuori) b.title = t('dispensa.esclusoTitolo');
    else b.removeAttribute('title');
  }

  // barra: conta solo quello che finirà davvero nel calcolo
  const n = [...ids].filter((id) => !esclusi.includes(id)).length;
  el.count.textContent = n === 0 ? t('dispensa.nessuno') : n === 1 ? t('dispensa.uno') : t('dispensa.molti', { n });
  el.btn.disabled = n === 0;
  // "Scegli tu" si accende solo se c'è davvero qualcosa da scegliere: senza una ricetta a zero mancanti
  // il bottone prometterebbe un piatto per stasera e poi ti manderebbe a fare la spesa
  el.scegli.disabled = !n || !abbina({ ricette: dati.ricette, indice: dati.indice, ingredienti: scelti, maxMancanti: 0, esclusi: new Set(esclusi) }).length;

  // riga della memoria: compare quando c'è qualcosa da ricordare o da passare a un altro dispositivo
  el.memoria.hidden = !scelti.length;
  el.quando.textContent = etichettaQuando();

  // URL senza navigare (così un refresh non perde la lista, e il link resta condivisibile)
  const hash = scelti.length ? `#/?i=${encodeURIComponent(scelti.join(','))}` : '#/';
  if (location.hash !== hash) history.replaceState(null, '', hash);
}

/** "Dispensa di ieri", "di martedì", "del 3 settembre": dire da quando è lì spiega perché è già piena. */
function etichettaQuando() {
  if (daLink) return t('dispensa.memoriaLink');
  const g = giorniFa(ts);
  if (g === null) return '';
  if (g <= 0) return t('dispensa.memoriaOggi');
  if (g === 1) return t('dispensa.memoriaIeri');
  if (g < 7) return t('dispensa.memoriaGiorno', { giorno: new Intl.DateTimeFormat('it-IT', { weekday: 'long' }).format(ts) });
  return t('dispensa.memoriaData', { data: new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' }).format(ts) });
}
