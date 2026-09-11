// Vista risultati: l'indice delle ricette ordinato per copertura, con filtri.
import { abbina, tempoTotale, risolvi } from './match.js';
import { ETICHETTE, STACK, euro, minuti } from './data.js';
import { vai, ingredientiDaParams, costruisciHash, leggiHash } from './app.js';

const el = {
  titolo: document.getElementById('risultati-titolo'),
  sotto: document.getElementById('risultati-sotto'),
  filtri: document.getElementById('filtri'),
  indice: document.getElementById('indice'),
  vuoto: document.getElementById('indice-vuoto'),
  toggle: document.getElementById('filtri-toggle'),
};

const CHIAVI_FILTRO = ['cat', 'diff', 't', 'costo', 'dieta', 'tag', 'attr', 'sort'];
let dati;
let montato = false;

export function montaRisultati(d, params) {
  dati = d;
  if (!montato) {
    el.filtri.addEventListener('change', () => {
      const f = leggiFiltri();
      vai('risultati', { i: ingredientiDaParams(leggiHash().params), ...f });
    });
    el.toggle.addEventListener('click', () => {
      const aperto = el.toggle.getAttribute('aria-expanded') !== 'true';
      el.toggle.setAttribute('aria-expanded', String(aperto));
      el.filtri.classList.toggle('aperti', aperto);
    });
    montato = true;
  }
  // filtri dall'URL → form
  for (const k of CHIAVI_FILTRO) {
    const campo = el.filtri.elements[k];
    if (!campo) continue;
    if (campo.type === 'checkbox') campo.checked = params.get(k) === '1';
    else campo.value = params.get(k) || '';
  }
  const f = leggiFiltri();
  const attivi = ['cat', 'diff', 't', 'costo', 'dieta', 'tag', 'attr'].filter((k) => f[k]).length;
  el.toggle.firstChild.textContent = attivi ? `Filtri (${attivi})` : 'Filtri';
  render(ingredientiDaParams(params), f);
}

function leggiFiltri() {
  const f = {};
  for (const k of CHIAVI_FILTRO) {
    const campo = el.filtri.elements[k];
    if (!campo) continue;
    f[k] = campo.type === 'checkbox' ? (campo.checked ? '1' : '') : campo.value;
  }
  return f;
}

function render(ingredienti, f) {
  const conDispensa = ingredienti.length > 0;
  let lista;
  if (conDispensa) {
    lista = abbina({ ricette: dati.ricette, indice: dati.indice, ingredienti, maxMancanti: 2 });
  } else {
    lista = dati.ricette.map((ricetta) => ({ ricetta, mancanti: [], copertura: null }));
  }

  // filtri
  lista = lista.filter(({ ricetta: r }) => {
    if (f.cat && r.categoria !== f.cat) return false;
    if (f.diff && r.difficolta !== f.diff) return false;
    if (f.t && tempoTotale(r) > Number(f.t)) return false;
    if (f.costo && r.costo.fascia !== f.costo) return false;
    if (f.dieta && !r.dieta.includes(f.dieta)) return false;
    if (f.tag && !r.tag.includes(f.tag)) return false;
    if (f.attr === '1' && r.attrezzatura.some((a) => !STACK.has(a))) return false;
    return true;
  });

  // ordinamento alternativo
  const ord = {
    tempo: (a, b) => tempoTotale(a.ricetta) - tempoTotale(b.ricetta),
    costo: (a, b) => a.ricetta.costo.stima_eur - b.ricetta.costo.stima_eur,
    diff: (a, b) => ETICHETTE.difficoltaOrdine[a.ricetta.difficolta] - ETICHETTE.difficoltaOrdine[b.ricetta.difficolta],
    az: (a, b) => a.ricetta.titolo.localeCompare(b.ricetta.titolo, 'it'),
  }[f.sort];
  if (ord) lista = [...lista].sort(ord);
  else if (!conDispensa) lista = [...lista].sort((a, b) => a.ricetta.titolo.localeCompare(b.ricetta.titolo, 'it'));

  // testa
  const nomi = ingredienti.map((s) => risolvi(dati.indice, s)?.nome.toLowerCase() || s);
  el.titolo.textContent = conDispensa ? `Con ${elenco(nomi)}` : 'Tutte le ricette';
  const complete = lista.filter((x) => x.mancanti.length === 0).length;
  const linkDispensa = costruisciHash('', { i: ingredienti });
  el.sotto.innerHTML = conDispensa
    ? `<strong>${lista.length}</strong> ricette · <strong>${complete}</strong> senza spesa · <a href="${linkDispensa}">cambia dispensa</a>`
    : `<strong>${lista.length}</strong> ricette · <a href="#/">scrivi cosa hai in dispensa</a>`;

  // righe
  el.indice.innerHTML = '';
  el.vuoto.hidden = true;
  if (!lista.length) {
    el.vuoto.hidden = false;
    el.vuoto.innerHTML = conDispensa
      ? `Con questi ingredienti (e al massimo due da comprare) non esce niente. Prova a <a href="${linkDispensa}">aggiungerne qualcuno</a> o togli un filtro.`
      : 'Nessuna ricetta con questi filtri.';
    return;
  }

  const frag = document.createDocumentFragment();
  let sezione = null;
  lista.forEach((x, k) => {
    // intestazioni di sezione solo nell'ordine per copertura
    if (conDispensa && !ord) {
      const s = x.mancanti.length === 0 ? 'Puoi farle adesso' : x.mancanti.length === 1 ? 'Manca un ingrediente' : 'Mancano due ingredienti';
      if (s !== sezione) {
        sezione = s;
        const h = document.createElement('li');
        h.className = 'indice-sezione';
        h.innerHTML = `<span class="label">${s}</span>`;
        frag.appendChild(h);
      }
    }
    frag.appendChild(riga(x, k, ingredienti));
  });
  el.indice.appendChild(frag);
}

function riga({ ricetta: r, mancanti, copertura }, k, ingredienti) {
  const li = document.createElement('li');
  li.className = 'riga' + (mancanti.length === 0 && copertura !== null ? ' completa' : '');
  li.style.setProperty('--i', Math.min(k, 12));
  const href = costruisciHash(`ricetta/${r.slug}`, { i: ingredienti });
  const richiesti = r.ingredienti.filter((i) => !i.opzionale && !dati.indice.base.has(i.id)).length;
  const attrManca = r.attrezzatura.filter((a) => !STACK.has(a));
  const rip = r.tempi.riposo ? ` <span>+ riposo</span>` : '';
  li.innerHTML = `
    <a href="${href}">
      <div class="foto" data-slug="${r.slug}"><span class="foto-ph">${r.titolo}</span></div>
      <div class="riga-corpo">
        <h2 class="riga-titolo">${r.titolo}</h2>
        <p class="riga-meta">
          <span class="cat">${ETICHETTE.categoria[r.categoria]}</span>
          <span>${ETICHETTE.difficolta[r.difficolta]}</span>
          <span>${minuti(tempoTotale(r))}${rip}</span>
          <span>${euro(r.costo.stima_eur)}</span>
          ${attrManca.map((a) => `<span class="attr-manca">serve ${ETICHETTE.attrezzatura[a].toLowerCase()}</span>`).join('')}
        </p>
      </div>
      <div class="riga-cop">
        ${copertura === null
          ? `<div class="frazione">${richiesti}<small> ingr.</small></div>`
          : `<div class="frazione">${richiesti - mancanti.length}<small>/${richiesti}</small></div>
             <div class="manca">${mancanti.length ? 'manca: <b>' + mancanti.map((id) => dati.indice.byId.get(id).nome.toLowerCase()).join(', ') + '</b>' : 'hai tutto'}</div>`}
      </div>
    </a>`;
  caricaFoto(li.querySelector('.foto'), r);
  return li;
}

/** Mostra la foto se il file esiste; altrimenti resta il segnaposto tipografico. */
export function caricaFoto(box, r) {
  const img = new Image();
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.onload = () => { box.appendChild(img); box.classList.add('has-img'); };
  img.src = r.foto.copertina;
}

function elenco(nomi) {
  if (nomi.length <= 1) return nomi.join('');
  return nomi.slice(0, -1).join(', ') + ' e ' + nomi.at(-1);
}
