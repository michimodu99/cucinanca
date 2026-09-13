// Vista "Scegli tu": una ricetta sola, pescata fra quelle che puoi fare adesso.
// Zero mancanti è la regola, non un'impostazione: se devi uscire a comprare qualcosa non è
// un consiglio per stasera, è un compito — e il bottone che porta qui resta spento.
import { abbina, scegliPerMe, tempoTotale } from './match.js';
import { ETICHETTE, STACK, euro, minuti } from './data.js';
import { t } from './i18n.js';
import { ingredientiDaParams, costruisciHash } from './app.js';
import { leggiEsclusi } from './memoria.js';
import { caricaFoto, badgePortoghese } from './risultati.js';

const el = { box: document.getElementById('scelta') };

let dati;
// slug già mostrati: vive solo finché la scheda è aperta. Michele ha scelto di non salvare
// lo storico delle ricette fatte, ma "Un'altra" deve comunque dare un'altra.
let gia = [];

export function montaScegli(d, params) {
  dati = d;
  const ingredienti = ingredientiDaParams(params);
  const esclusi = new Set(leggiEsclusi().filter((id) => dati.indice.byId.has(id)));
  const pronte = abbina({ ricette: dati.ricette, indice: dati.indice, ingredienti, maxMancanti: 0, esclusi });
  pesca(pronte, ingredienti);
}

function pesca(pronte, ingredienti) {
  const scelta = scegliPerMe({ abbinate: pronte, gia });
  if (!scelta) return vuoto(ingredienti);
  // girate tutte, si ricomincia: tengo solo l'ultima, così "Un'altra" non ripete quella sullo schermo
  gia = gia.length + 1 >= pronte.length ? [scelta.ricetta.slug] : [...gia, scelta.ricetta.slug];
  render(scelta, pronte, ingredienti);
}

function vuoto(ingredienti) {
  el.box.className = 'scelta scelta-vuota';
  el.box.innerHTML = `<p>${t('scegli.vuoto', { link: costruisciHash('', { i: ingredienti }) })}</p>`;
}

function render({ ricetta: r, sostituzioni }, pronte, ingredienti) {
  const nome = (id) => dati.indice.byId.get(id).nome.toLowerCase();
  const sost = sostituzioni.map((s) => t('scegli.alPostoDi', { usato: nome(s.usato), richiesto: nome(s.richiesto) })).join(', ');
  const attrManca = r.attrezzatura.filter((a) => !STACK.has(a));
  // con una sola ricetta pronta, "Un'altra" riproporrebbe questa: spenta è un'informazione, ripetersi sembra un guasto
  const sola = pronte.length < 2;

  el.box.className = 'scelta';
  el.box.innerHTML = `
    <div class="foto scelta-foto" data-slug="${r.slug}">${badgePortoghese(r)}<span class="foto-ph">${r.titolo}</span></div>
    <div class="scelta-corpo">
      <p class="label">${t('scegli.occhiello')}</p>
      <h1 class="display display-md scelta-titolo">${r.titolo}</h1>
      <p class="scelta-meta">
        <span class="cat">${ETICHETTE.categoria[r.categoria]}</span>
        <span>${ETICHETTE.difficolta[r.difficolta]}</span>
        <span>${minuti(tempoTotale(r))}</span>
        <span>${euro(r.costo.stima_eur)}</span>
        ${attrManca.map((a) => `<span class="attr-manca">${t('scegli.serve', { attrezzo: ETICHETTE.attrezzatura[a].toLowerCase() })}</span>`).join('')}
      </p>
      ${sost ? `<p class="scelta-sost">${t('scegli.conSostituto', { elenco: sost })}</p>` : ''}
      <p class="scelta-desc">${r.descrizione}</p>
      <div class="scelta-azioni">
        <button type="button" class="btn-ghost" id="btn-altra"${sola ? ` disabled title="${t('scegli.unicaAiuto')}"` : ''}>${t('scegli.altra')}</button>
        <a class="btn-primary" href="${costruisciHash(`ricetta/${r.slug}`, { i: ingredienti })}">${t('scegli.apri')} <span aria-hidden="true">→</span></a>
      </div>
      <p class="scelta-nota">${t(sola ? 'scegli.unica' : 'scegli.soloPronte')} ${t('scegli.torna', { link: costruisciHash('', { i: ingredienti }) })}</p>
    </div>`;

  caricaFoto(el.box.querySelector('.scelta-foto'), r);
  if (!sola) el.box.querySelector('#btn-altra').addEventListener('click', () => pesca(pronte, ingredienti));
}
