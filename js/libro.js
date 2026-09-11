// Vista ricetta: libro a doppia pagina su desktop, pagine a scorrimento su mobile.
import { risolvi, scalaQuantita, tempoTotale } from './match.js';
import { ETICHETTE, STACK, euro, minuti, riposo } from './data.js';
import { ingredientiDaParams } from './app.js';
import { caricaFoto } from './risultati.js';

const el = {
  libro: document.getElementById('libro'),
  prev: document.getElementById('libro-prev'),
  next: document.getElementById('libro-next'),
  pos: document.getElementById('libro-pos'),
  meta: document.getElementById('topbar-meta'),
};
const mqMobile = window.matchMedia('(max-width: 899px)');

let dati, ricetta, posseduti;
let moltiplicatore = 1;
let pagine = [];      // desktop: nodi pagina; mobile: nodi .pagina-m
let spread = 0;       // desktop: indice spread; mobile: indice pagina
let wakeLock = null;
let attivo = false;
let onKey, onResize, onScroll;

export function montaLibro(d, r, params) {
  dati = d;
  ricetta = r;
  moltiplicatore = 1;
  const scelti = ingredientiDaParams(params);
  posseduti = new Set(dati.indice.base);
  for (const s of scelti) {
    const x = risolvi(dati.indice, s);
    if (x && !x.vietato) posseduti.add(x.id);
  }
  attivo = true;
  document.title = `${r.titolo} · Cucina`;
  el.meta.textContent = ETICHETTE.categoria[r.categoria];

  costruisci();

  onKey = (e) => {
    if (e.key === 'ArrowRight') vaiA(spread + 1, 'avanti');
    if (e.key === 'ArrowLeft') vaiA(spread - 1, 'back');
  };
  onResize = debounce(costruisci, 150);
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);
  el.prev.onclick = () => vaiA(spread - 1, 'back');
  el.next.onclick = () => vaiA(spread + 1, 'avanti');
  chiediWakeLock();
  document.addEventListener('visibilitychange', riWakeLock);
}

export function smontaLibro() {
  if (!attivo) return;
  attivo = false;
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', riWakeLock);
  if (onScroll) el.libro.removeEventListener('scroll', onScroll);
  el.libro.innerHTML = '';
  el.meta.textContent = 'Bragança · 2026';
  document.title = 'Cucina · cosa cucino stasera';
  rilasciaWakeLock();
}

/* ---------- costruzione ---------- */

function costruisci() {
  const eraMobile = el.libro.dataset.mode === 'mobile';
  const mobile = mqMobile.matches;
  el.libro.dataset.mode = mobile ? 'mobile' : 'desktop';
  el.libro.innerHTML = '';
  if (onScroll) el.libro.removeEventListener('scroll', onScroll);
  const posPrec = eraMobile === mobile ? spread : 0;
  spread = 0;
  if (mobile) costruisciMobile();
  else costruisciDesktop();
  vaiA(posPrec, null, true);
}

function costruisciDesktop() {
  const cover = paginaCover();
  const blocchi = blocchiTesto();

  // misura ogni blocco nella larghezza reale di una pagina e distribuisci per altezza
  const misura = document.createElement('div');
  misura.className = 'pagina pagina-testo misura';
  misura.style.width = `${el.libro.clientWidth / 2}px`;
  el.libro.appendChild(misura);
  const altezzaPagina = el.libro.clientHeight - 48; // padding verticale della pagina
  const gap = 24;
  const gruppi = [[]];
  let usato = 0;
  for (const b of blocchi) {
    misura.appendChild(b);
    const h = b.getBoundingClientRect().height;
    misura.removeChild(b);
    const extra = gruppi.at(-1).length ? gap : 0;
    if (usato + extra + h > altezzaPagina && gruppi.at(-1).length) {
      gruppi.push([]);
      usato = 0;
    }
    gruppi.at(-1).push(b);
    usato += (gruppi.at(-1).length > 1 ? gap : 0) + h;
  }
  misura.remove();

  // un libro non finisce con la pagina destra bianca: se le pagine (copertina + testo) sono dispari,
  // spezza l'ultimo gruppo in due — note a destra, passi a sinistra — quando ha almeno due blocchi
  if ((1 + gruppi.length) % 2 === 1 && gruppi.at(-1).length >= 2) {
    const ultimo = gruppi.pop();
    let taglio = ultimo.findIndex((b) => b.classList.contains('nota'));
    if (taglio <= 0) taglio = Math.ceil(ultimo.length / 2);
    gruppi.push(ultimo.slice(0, taglio), ultimo.slice(taglio));
  }

  pagine = [cover, ...gruppi.map((g) => {
    const p = document.createElement('div');
    p.className = 'pagina pagina-testo';
    p.append(...g);
    return p;
  })];
}

function costruisciMobile() {
  const cover = document.createElement('div');
  cover.className = 'pagina-m cover';
  cover.append(...paginaCover().childNodes);

  const ingr = document.createElement('div');
  ingr.className = 'pagina-m';
  ingr.appendChild(bloccoIngredienti());

  const steps = ricetta.procedimento.map((s) => {
    const p = document.createElement('div');
    p.className = 'pagina-m step';
    p.innerHTML = `
      <div class="n">${s.n}<small>/${ricetta.procedimento.length}</small></div>
      <h3>${s.titolo}${s.minuti ? `<small>${s.minuti}′</small>` : ''}</h3>
      <p>${s.testo}</p>`;
    return p;
  });

  const note = document.createElement('div');
  note.className = 'pagina-m';
  note.append(...blocchiNote());

  pagine = [cover, ingr, ...steps, ...(note.childNodes.length ? [note] : [])];
  el.libro.append(...pagine);

  onScroll = debounce(() => {
    const i = Math.round(el.libro.scrollLeft / el.libro.clientWidth);
    if (i !== spread) { spread = i; aggiornaNav(); }
  }, 80);
  el.libro.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- pagine ---------- */

function paginaCover() {
  const r = ricetta;
  const p = document.createElement('div');
  p.className = 'pagina pagina-cover';
  const rip = riposo(r.tempi.riposo);
  const attr = r.attrezzatura.map((a) => `<span class="${STACK.has(a) ? '' : 'manca'}">${STACK.has(a) ? '' : 'serve '}${ETICHETTE.attrezzatura[a]}</span>`).join('');
  p.innerHTML = `
    <div class="cover-top">
      <div class="foto"><span class="foto-ph">${r.titolo}</span></div>
      <div class="cover-titolo">
        <h1 class="display">${r.titolo}</h1>
        <p class="desc">${r.descrizione}</p>
      </div>
    </div>
    <div class="cover-testo">
      <div class="meta">
        <div><span class="label">Difficoltà</span><span class="val">${ETICHETTE.difficolta[r.difficolta]}</span></div>
        <div><span class="label">Preparazione</span><span class="val">${minuti(r.tempi.preparazione)}</span></div>
        <div><span class="label">Cottura</span><span class="val">${r.tempi.cottura ? minuti(r.tempi.cottura) : '—'}</span></div>
        <div><span class="label">Riposo</span><span class="val">${rip || '—'}</span></div>
        <div><span class="label">Costo</span><span class="val">${euro(r.costo.stima_eur)} <small>a persona</small></span></div>
      </div>
      ${attr ? `<div class="attrezzatura">${attr}</div>` : ''}
      ${r.reinventata ? `<p class="reinventata">${r.reinventata}</p>` : ''}
    </div>`;
  caricaFoto(p.querySelector('.foto'), r);
  return p;
}

function blocchiTesto() {
  const passi = ricetta.procedimento.map((s) => {
    const d = document.createElement('div');
    d.className = 'passo';
    d.innerHTML = `<div class="n">${s.n}</div><div><h3>${s.titolo}${s.minuti ? `<small>${s.minuti}′</small>` : ''}</h3><p>${s.testo}</p></div>`;
    return d;
  });
  return [bloccoIngredienti(), ...passi, ...blocchiNote()];
}

function bloccoIngredienti() {
  const d = document.createElement('div');
  d.className = 'blocco-ingredienti';
  const mancanti = ricetta.ingredienti.filter((i) => !i.opzionale && !posseduti.has(i.id));
  d.innerHTML = `
    <div class="blocco-testa">
      <h2>Ingredienti</h2>
      <div class="porzioni"><span class="label">Porzioni</span>
        <div class="seg" role="group" aria-label="Porzioni">
          ${[1, 2, 4].map((m) => `<button type="button" data-m="${m}" aria-pressed="${m === moltiplicatore}">×${m}</button>`).join('')}
        </div>
      </div>
    </div>
    <ul class="ingredienti"></ul>
    ${mancanti.length ? `<button type="button" class="btn-ghost copia-mancanti">Copia la lista della spesa (${mancanti.length})</button>` : ''}`;
  renderIngredienti(d.querySelector('.ingredienti'));
  d.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
    moltiplicatore = Number(b.dataset.m);
    // aggiorna tutti i blocchi ingredienti presenti (desktop e mobile ne hanno uno)
    document.querySelectorAll('.seg button[data-m]').forEach((x) => x.setAttribute('aria-pressed', String(Number(x.dataset.m) === moltiplicatore)));
    document.querySelectorAll('.ingredienti').forEach(renderIngredienti);
  }));
  const copia = d.querySelector('.copia-mancanti');
  if (copia) copia.addEventListener('click', async () => {
    const testo = mancanti.map((i) => {
      const q = scalaQuantita(i, moltiplicatore);
      return `${dati.indice.byId.get(i.id).nome}${q !== null ? ` — ${q} ${ETICHETTE.unita[i.unita]}` : ''}`;
    }).join('\n');
    try {
      await navigator.clipboard.writeText(testo);
      copia.textContent = 'Copiata';
      setTimeout(() => { copia.textContent = `Copia la lista della spesa (${mancanti.length})`; }, 1800);
    } catch {
      copia.textContent = 'Non riesco a copiare';
    }
  });
  return d;
}

function renderIngredienti(ul) {
  ul.innerHTML = ricetta.ingredienti.map((i) => {
    const t = dati.indice.byId.get(i.id);
    const q = scalaQuantita(i, moltiplicatore);
    const qb = i.unita === 'qb';
    const qta = qb ? 'q.b.' : `${formatta(q)} ${unita(i.unita, q)}`.trim();
    const cls = [i.opzionale ? 'opz' : '', !i.opzionale && !posseduti.has(i.id) ? 'manca' : ''].filter(Boolean).join(' ');
    const pt = (i.pt || t.pt) && (i.pt || t.pt).sostituto ? `<span class="pt">a Bragança: ${(i.pt || t.pt).sostituto}</span>` : '';
    return `<li class="${cls}"><span class="q${qb ? ' qb' : ''}">${qta}</span><span class="n">${t.nome}${i.opzionale ? ' <small>facoltativo</small>' : ''}${i.note ? `<small>${i.note}</small>` : ''}${pt}</span></li>`;
  }).join('');
}

function blocchiNote() {
  const r = ricetta;
  const out = [];
  const nota = (titolo, html) => {
    const d = document.createElement('div');
    d.className = 'nota';
    d.innerHTML = `<h3>${titolo}</h3>${html}`;
    out.push(d);
  };
  if (r.consigli) nota('Consiglio', `<p>${r.consigli}</p>`);
  if (r.conservazione) nota('Conservazione', `<p>${r.conservazione}</p>`);
  if (r.varianti?.length) nota('Varianti', `<ul>${r.varianti.map((v) => `<li>${v}</li>`).join('')}</ul>`);
  if (r.fonte) nota('Fonte', `<p>${r.fonte}</p>`);
  return out;
}

/* ---------- navigazione ---------- */

function totale() {
  return mqMobile.matches ? pagine.length : Math.ceil(pagine.length / 2);
}

function vaiA(i, dir, immediato = false) {
  const n = totale();
  i = Math.max(0, Math.min(n - 1, i));
  spread = i;
  if (mqMobile.matches) {
    el.libro.scrollTo({ left: i * el.libro.clientWidth, behavior: immediato ? 'instant' : 'smooth' });
  } else {
    el.libro.innerHTML = '';
    const s = document.createElement('div');
    s.className = 'spread';
    if (dir) s.dataset.dir = dir;
    const sx = pagine[i * 2];
    const dx = pagine[i * 2 + 1];
    s.appendChild(sx);
    if (dx) s.appendChild(dx);
    else { const v = document.createElement('div'); v.className = 'pagina pagina-vuota'; s.appendChild(v); }
    el.libro.appendChild(s);
  }
  aggiornaNav();
}

function aggiornaNav() {
  const n = totale();
  el.pos.textContent = `${spread + 1} / ${n}`;
  el.prev.disabled = spread === 0;
  el.next.disabled = spread >= n - 1;
}

/* ---------- wake lock ---------- */

async function chiediWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    }
  } catch { /* non supportato o negato: pazienza */ }
}
function riWakeLock() {
  if (attivo && document.visibilityState === 'visible' && !wakeLock) chiediWakeLock();
}
function rilasciaWakeLock() {
  if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
}

/* ---------- util ---------- */

const SINGOLARE = { cucchiai: 'cucchiaio', cucchiaini: 'cucchiaino', spicchi: 'spicchio', foglie: 'foglia', rametti: 'rametto', fette: 'fetta' };
function unita(u, q) {
  return q === 1 && SINGOLARE[u] ? SINGOLARE[u] : ETICHETTE.unita[u];
}
function formatta(n) {
  if (n === null) return '';
  return Number.isInteger(n) ? String(n) : String(n).replace('.', ',');
}
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
