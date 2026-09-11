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

/** Risolve un testo digitato dall'utente in un ingrediente canonico. Ritorna null se sconosciuto. */
export function risolvi(indice, testo) {
  const id = indice.byKey.get(normalizza(testo));
  if (!id) return null;
  const ing = indice.byId.get(id);
  return { id, nome: ing.nome, vietato: Boolean(ing.vietato), base: Boolean(ing.base) };
}

/** Tempo totale attivo di una ricetta (preparazione + cottura), in minuti. */
export function tempoTotale(ricetta) {
  const t = ricetta.tempi || {};
  return (t.preparazione || 0) + (t.cottura || 0);
}

/**
 * Abbina la dispensa alle ricette.
 * @returns array di { ricetta, mancanti: id[], copertura: 0..1 } ordinato per rilevanza,
 *          con proprietà extra `nonRisolti` (testi non riconosciuti) e `vietati` (id vietati digitati).
 */
export function abbina({ ricette, indice, ingredienti, maxMancanti = 2 }) {
  const posseduti = new Set(indice.base);
  const nonRisolti = [];
  const vietati = [];
  for (const testo of ingredienti) {
    const r = risolvi(indice, testo);
    if (!r) nonRisolti.push(testo);
    else if (r.vietato) vietati.push(r.id);
    else posseduti.add(r.id);
  }

  const out = [];
  for (const ricetta of ricette) {
    const richiesti = (ricetta.ingredienti || [])
      .filter((i) => !i.opzionale && !indice.base.has(i.id))
      .map((i) => i.id);
    const mancanti = richiesti.filter((id) => !posseduti.has(id));
    if (mancanti.length > maxMancanti) continue;
    const copertura = richiesti.length ? (richiesti.length - mancanti.length) / richiesti.length : 1;
    out.push({ ricetta, mancanti, copertura });
  }

  out.sort(
    (a, b) =>
      a.mancanti.length - b.mancanti.length ||
      tempoTotale(a.ricetta) - tempoTotale(b.ricetta) ||
      a.ricetta.titolo.localeCompare(b.ricetta.titolo, 'it'),
  );
  out.nonRisolti = nonRisolti;
  out.vietati = vietati;
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
