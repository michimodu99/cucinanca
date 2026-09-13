// Router hash + stato condiviso. Le viste sono in dispensa.js, risultati.js, libro.js.
import { caricaDati } from './data.js';
import { montaDispensa, videoDispensa } from './dispensa.js';
import { montaRisultati } from './risultati.js';
import { montaScegli } from './scegli.js';
import { montaLibro, smontaLibro } from './libro.js';
import { t, applicaTesti } from './i18n.js';

const viste = {
  dispensa: document.getElementById('view-dispensa'),
  risultati: document.getElementById('view-risultati'),
  scegli: document.getElementById('view-scegli'),
  libro: document.getElementById('view-libro'),
  errore: document.getElementById('view-errore'),
};

/** `#/risultati?i=a,b&cat=primo` → { path: ['risultati'], params: URLSearchParams } */
export function leggiHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathStr, query = ''] = raw.split('?');
  const path = pathStr.split('/').filter(Boolean);
  return { path, params: new URLSearchParams(query) };
}

export function costruisciHash(path, params = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) continue;
    p.set(k, Array.isArray(v) ? v.join(',') : String(v));
  }
  const q = p.toString();
  return `#/${path}${q ? '?' + q : ''}`;
}

export function vai(path, params) {
  location.hash = costruisciHash(path, params);
}

/** Ingredienti scelti, letti dall'URL. */
export function ingredientiDaParams(params) {
  const raw = params.get('i');
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
}

function mostra(nome) {
  for (const [k, el] of Object.entries(viste)) el.hidden = k !== nome;
  videoDispensa(nome === 'dispensa');
  for (const a of document.querySelectorAll('[data-nav]')) {
    const attivo = a.dataset.nav === nome || (nome === 'libro' && a.dataset.nav === 'risultati') || (nome === 'scegli' && a.dataset.nav === 'dispensa');
    if (attivo) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

let dati;
let testiApplicati = false;
async function route() {
  if (!testiApplicati) { applicaTesti(); document.title = t('titolo'); testiApplicati = true; }
  dati = dati || (await caricaDati());
  const { path, params } = leggiHash();
  smontaLibro();
  const vista = path[0] || 'dispensa';
  if (vista === 'dispensa') {
    mostra('dispensa');
    montaDispensa(dati, params);
    // la home resta pulita (senza "#/"); con ingredienti nell'URL l'hash serve, è un link condivisibile
    if (/^#\/?$/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
  } else if (vista === 'risultati') {
    mostra('risultati');
    montaRisultati(dati, params);
  } else if (vista === 'scegli') {
    mostra('scegli');
    montaScegli(dati, params);
  } else if (vista === 'ricetta' && dati.bySlug.has(path[1])) {
    mostra('libro');
    montaLibro(dati, dati.bySlug.get(path[1]), params);
  } else {
    mostra('errore');
  }
}

window.addEventListener('hashchange', route);
route().catch((e) => {
  console.error(e);
  document.getElementById('app').innerHTML = `<p style="padding:32px">${t('errore.caricamento', { msg: e.message })}</p>`;
});

// il link "Ricette" nella barra tiene gli ingredienti scelti
document.querySelector('[data-nav="risultati"]').addEventListener('click', (e) => {
  const { params } = leggiHash();
  const i = params.get('i');
  if (i) {
    e.preventDefault();
    vai('risultati', { i });
  }
});
