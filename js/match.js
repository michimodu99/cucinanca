// Logica pura di matching dispensa → ricette. Nessuna dipendenza dal DOM.

/** Normalizza una stringa per il confronto: minuscole, senza accenti, apostrofi uniformi, spazi compressi. */
export function normalizza(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’`´]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Costruisce l'indice di ricerca a partire dalla tassonomia (data/ingredienti.json). */
export function creaIndice(tassonomia) {
  const byKey = new Map();
  const byId = new Map();
  const base = new Set();
  for (const ing of tassonomia) {
    byId.set(ing.id, ing);
    if (ing.base) base.add(ing.id);
    for (const k of [ing.id, ing.nome, ...(ing.alias || [])]) byKey.set(normalizza(k), ing.id);
  }
  return { byKey, byId, base };
}

/** Ipotesi di singolare e di plurale per una parola italiana (euristica, non un vero stemmer): l'utente scrive
 *  "pomodori" ma l'alias è "pomodoro", oppure "cece" quando la voce è "ceci". */
function candidatiSingolari(parola) {
  if (parola.length < 4) return [];
  const out = [];
  // plurale → singolare
  if (parola.endsWith('che')) out.push(parola.slice(0, -3) + 'ca');
  else if (parola.endsWith('ghe')) out.push(parola.slice(0, -3) + 'ga');
  else if (parola.endsWith('chi')) out.push(parola.slice(0, -3) + 'co');
  else if (parola.endsWith('ghi')) out.push(parola.slice(0, -3) + 'go');
  else if (parola.endsWith('ci')) out.push(parola.slice(0, -2) + 'co');
  else if (parola.endsWith('gi')) out.push(parola.slice(0, -2) + 'go');
  else if (parola.endsWith('i')) out.push(parola.slice(0, -1) + 'o', parola.slice(0, -1) + 'e');
  else if (parola.endsWith('e')) out.push(parola.slice(0, -1) + 'a');
  // singolare → plurale
  if (parola.endsWith('ca')) out.push(parola.slice(0, -2) + 'che');
  else if (parola.endsWith('ga')) out.push(parola.slice(0, -2) + 'ghe');
  else if (parola.endsWith('io')) out.push(parola.slice(0, -2) + 'i'); // pistacchio, spinacio
  else if (parola.endsWith('co')) out.push(parola.slice(0, -2) + 'chi', parola.slice(0, -2) + 'ci');
  else if (parola.endsWith('go')) out.push(parola.slice(0, -2) + 'ghi');
  else if (parola.endsWith('a')) out.push(parola.slice(0, -1) + 'e');
  else if (parola.endsWith('o') || parola.endsWith('e')) out.push(parola.slice(0, -1) + 'i');
  return out;
}

/** Varianti singolari dell'intera frase normalizzata, parola per parola (accordo aggettivo-sostantivo). */
function candidatiFraseSingolare(frase) {
  const parole = frase.split(' ');
  const opzioni = parole.map((p) => [p, ...candidatiSingolari(p)]);
  const risultati = [];
  const visti = new Set([frase]);
  (function combina(i, acc) {
    if (i === opzioni.length) {
      const f = acc.join(' ');
      if (!visti.has(f)) { visti.add(f); risultati.push(f); }
      return;
    }
    for (const opt of opzioni[i]) combina(i + 1, [...acc, opt]);
  })(0, []);
  return risultati;
}

/** Risolve un testo digitato dall'utente in un ingrediente canonico. Ritorna null se sconosciuto. */
export function risolvi(indice, testo) {
  const norm = normalizza(testo);
  let id = indice.byKey.get(norm);
  // fallback: l'utente ha digitato al plurale ("pomodori freschi") e non c'è un alias esplicito
  if (!id) {
    for (const candidato of candidatiFraseSingolare(norm)) {
      id = indice.byKey.get(candidato);
      if (id) break;
    }
  }
  if (!id) return null;
  const ing = indice.byId.get(id);
  return { id, nome: ing.nome, base: Boolean(ing.base) };
}

/** Tempo totale attivo di una ricetta (preparazione + cottura), in minuti. */
export function tempoTotale(ricetta) {
  const t = ricetta.tempi || {};
  return (t.preparazione || 0) + (t.cottura || 0);
}

const NESSUNO = new Set();

/** Gli ingredienti che la ricetta chiede davvero: niente opzionali, niente dispensa base — tranne quelli
 *  esclusi dall'utente, che tornano a contare (chi non mangia aglio non lo considera "sempre presente"). */
export function ingredientiRichiesti(ricetta, indice, esclusi = NESSUNO) {
  return (ricetta.ingredienti || []).filter((i) => !i.opzionale && (!indice.base.has(i.id) || esclusi.has(i.id)));
}

/** La ricetta chiede qualcosa che non mangi, e niente di quello che hai lo rimpiazza davvero nel piatto.
 *  Senza dispensa `posseduti` sono i soli ingredienti base. */
export function ricettaEsclusa(ricetta, indice, esclusi, posseduti = indice.base) {
  if (!esclusi || !esclusi.size) return false;
  return ingredientiRichiesti(ricetta, indice, esclusi).some(
    (i) => esclusi.has(i.id) && !(i.sostituti || []).some((s) => posseduti.has(s.id) && !esclusi.has(s.id)),
  );
}

/**
 * Abbina la dispensa alle ricette. Una ricetta esce dai risultati se manca un ingrediente `principale`
 * senza sostituto posseduto, se ne richiede uno che l'utente non mangia (idem, senza sostituto),
 * oppure se mancano più di `maxMancanti` ingredienti.
 * @param esclusi Set (o array) di id che l'utente non mangia: non li possiede mai, nemmeno se glieli passa un link.
 * @returns array di { ricetta, mancanti: id[], richiesti: n, copertura: 0..1, sostituzioni: {richiesto, usato, nota}[] }
 *          ordinato per rilevanza, con proprietà extra `nonRisolti` (testi non riconosciuti) e `esclusi` (quante nascoste).
 */
export function abbina({ ricette, indice, ingredienti, maxMancanti = 2, esclusi }) {
  const vietati = esclusi instanceof Set ? esclusi : new Set(esclusi || []);
  const posseduti = new Set([...indice.base].filter((id) => !vietati.has(id)));
  const nonRisolti = [];
  for (const testo of ingredienti) {
    const r = risolvi(indice, testo);
    if (!r) nonRisolti.push(testo);
    else if (!vietati.has(r.id)) posseduti.add(r.id);
  }

  const out = [];
  let nascoste = 0;
  for (const ricetta of ricette) {
    // l'escluso è come un ingrediente che non potrai mai avere: se un sostituto posseduto lo rimpiazza
    // il piatto resta in tavola (broccoli → cavolo nero), altrimenti non ha senso proporlo
    const vietata = ricettaEsclusa(ricetta, indice, vietati, posseduti);
    const richiesti = ingredientiRichiesti(ricetta, indice, vietati);
    const mancanti = [];
    const sostituzioni = [];
    for (const i of richiesti) {
      if (posseduti.has(i.id)) continue;
      const s = (i.sostituti || []).find((x) => posseduti.has(x.id));
      if (s) sostituzioni.push({ richiesto: i.id, usato: s.id, nota: s.nota || null });
      else mancanti.push(i.id);
    }
    // manca l'ingrediente che dà identità al piatto (e nessun suo sostituto): non è cucinabile né
    // reinterpretabile (un bacalhau senza baccalà è un altro piatto), quindi non lo proponiamo
    if (richiesti.some((i) => i.principale && mancanti.includes(i.id))) continue;
    if (mancanti.length > maxMancanti) continue;
    // niente in comune con la dispensa (oltre alle basi): non è un suggerimento, è rumore
    if (richiesti.length && mancanti.length === richiesti.length) continue;
    // il controllo va in fondo apposta: "nascoste" deve contare le ricette che avresti visto davvero,
    // non quelle che sarebbero comunque cadute per troppi mancanti
    if (vietata) { nascoste++; continue; }
    const copertura = richiesti.length ? (richiesti.length - mancanti.length) / richiesti.length : 1;
    out.push({ ricetta, mancanti, richiesti: richiesti.length, copertura, sostituzioni });
  }

  out.sort(
    (a, b) =>
      a.mancanti.length - b.mancanti.length ||
      b.copertura - a.copertura ||
      a.sostituzioni.length - b.sostituzioni.length ||
      tempoTotale(a.ricetta) - tempoTotale(b.ricetta) ||
      a.ricetta.titolo.localeCompare(b.ricetta.titolo, 'it'),
  );
  out.nonRisolti = nonRisolti;
  out.esclusi = nascoste;
  return out;
}

/** Scala la quantità di un ingrediente (dosato per 1) per `moltiplicatore` porzioni, con arrotondamenti sensati. */
export function scalaQuantita(ing, moltiplicatore) {
  if (ing.qta === null || ing.qta === undefined) return null;
  const v = ing.qta * moltiplicatore;
  switch (ing.unita) {
    case 'g':
    case 'ml':
      return v < 20 ? Math.round(v) : Math.round(v / 5) * 5;
    case 'pz':
    case 'spicchi':
    case 'fette':
    case 'bustina':
      // a quarti: mezza cipolla e un quarto di limone sono dosi vere, arrotondarle a 1 le raddoppia
      return Math.max(0.25, Math.round(v * 4) / 4);
    case 'cucchiai':
    case 'cucchiaini':
      return Math.round(v * 2) / 2;
    default:
      return Math.round(v * 10) / 10;
  }
}

// ---------- "Scegli tu stasera" ----------

const STAGIONE = ['inverno', 'inverno', 'primavera', 'primavera', 'primavera', 'estate', 'estate', 'estate', 'autunno', 'autunno', 'autunno', 'inverno'];

export function stagione(ora = new Date()) {
  return STAGIONE[ora.getMonth()];
}

/** Una ricetta è "lunga" se supera i 45 minuti o se è marcata weekend: di mercoledì sera non la vuoi. */
function lunga(ricetta) {
  return tempoTotale(ricetta) > 45 || (ricetta.tag || []).includes('weekend');
}

/** Quanto una ricetta c'entra con stasera. Non un punteggio di qualità: un peso per la pesca.
 *  I tag di stagione nei dati sono solo `autunno` e `inverno`, quindi in primavera ed estate pesa solo il giorno. */
export function pesoScelta(ricetta, ora = new Date()) {
  let peso = 1;
  if ((ricetta.tag || []).includes(stagione(ora))) peso *= 2;
  const giorno = ora.getDay(); // 0 domenica … 6 sabato
  const feriale = giorno >= 1 && giorno <= 5;
  if (feriale) peso *= lunga(ricetta) ? 0.35 : 1.6;
  else if (lunga(ricetta)) peso *= 1.8;
  return peso;
}

/**
 * Pesca una ricetta fra quelle che puoi fare **adesso** (zero mancanti): se devi uscire a comprare
 * qualcosa non è un consiglio per stasera, è un compito. Con zero candidate torna null, e il bottone
 * che porta qui resta spento.
 * @param abbinate uscita di `abbina()`
 * @param gia slug già mostrati in questa sessione: "Un'altra" non ripete finché non le ha girate tutte
 * @param caso iniettabile, così i test sono ripetibili
 */
export function scegliPerMe({ abbinate, ora = new Date(), caso = Math.random, gia = [] }) {
  const pronte = abbinate.filter((x) => x.mancanti.length === 0);
  if (!pronte.length) return null;
  const mai = pronte.filter((x) => !gia.includes(x.ricetta.slug));
  const candidate = mai.length ? mai : pronte;
  const pesi = candidate.map((x) => pesoScelta(x.ricetta, ora));
  const totale = pesi.reduce((a, b) => a + b, 0);
  let soglia = caso() * totale;
  for (let i = 0; i < candidate.length; i++) {
    soglia -= pesi[i];
    if (soglia < 0) return candidate[i];
  }
  return candidate[candidate.length - 1]; // caso() che torna 1, o arrotondamenti
}
