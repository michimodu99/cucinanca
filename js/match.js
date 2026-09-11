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

/** Ipotesi di singolare per una parola italiana plurale (euristica, non un vero stemmer). */
function candidatiSingolari(parola) {
  if (parola.length < 4) return [];
  if (parola.endsWith('che')) return [parola.slice(0, -3) + 'ca'];
  if (parola.endsWith('ghe')) return [parola.slice(0, -3) + 'ga'];
  if (parola.endsWith('chi')) return [parola.slice(0, -3) + 'co'];
  if (parola.endsWith('ghi')) return [parola.slice(0, -3) + 'go'];
  if (parola.endsWith('ci')) return [parola.slice(0, -2) + 'co'];
  if (parola.endsWith('gi')) return [parola.slice(0, -2) + 'go'];
  if (parola.endsWith('i')) return [parola.slice(0, -1) + 'o', parola.slice(0, -1) + 'e'];
  if (parola.endsWith('e')) return [parola.slice(0, -1) + 'a'];
  return [];
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

/**
 * Abbina la dispensa alle ricette.
 * @returns array di { ricetta, mancanti: id[], copertura: 0..1, sostituzioni: {richiesto, usato, nota}[] } ordinato per rilevanza,
 *          con proprietà extra `nonRisolti` (testi non riconosciuti).
 */
export function abbina({ ricette, indice, ingredienti, maxMancanti = 2 }) {
  const posseduti = new Set(indice.base);
  const nonRisolti = [];
  for (const testo of ingredienti) {
    const r = risolvi(indice, testo);
    if (!r) nonRisolti.push(testo);
    else posseduti.add(r.id);
  }

  const out = [];
  for (const ricetta of ricette) {
    const richiesti = (ricetta.ingredienti || []).filter((i) => !i.opzionale && !indice.base.has(i.id));
    const mancanti = [];
    const sostituzioni = [];
    for (const i of richiesti) {
      if (posseduti.has(i.id)) continue;
      const s = (i.sostituti || []).find((x) => posseduti.has(x.id));
      if (s) sostituzioni.push({ richiesto: i.id, usato: s.id, nota: s.nota || null });
      else mancanti.push(i.id);
    }
    if (mancanti.length > maxMancanti) continue;
    // niente in comune con la dispensa (oltre alle basi): non è un suggerimento, è rumore
    if (richiesti.length && mancanti.length === richiesti.length) continue;
    const copertura = richiesti.length ? (richiesti.length - mancanti.length) / richiesti.length : 1;
    out.push({ ricetta, mancanti, copertura, sostituzioni });
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
      return Math.max(1, Math.round(v));
    case 'cucchiai':
    case 'cucchiaini':
      return Math.round(v * 2) / 2;
    default:
      return Math.round(v * 10) / 10;
  }
}
