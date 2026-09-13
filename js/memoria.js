// Memoria locale: dispensa e preferenze. Vive in `localStorage`, cioè in questo browser di questo
// dispositivo e basta: nessun account, nessun server. Il ponte verso un altro telefono è il link con `?i=`.
// Nessuna dipendenza dal DOM: `store` è iniettabile, così i test girano in node.

const PREFISSO = 'cucinanca:';
const VERSIONE = 1;
const GIORNO = 86400000;

/** Il solo accesso a `localStorage` può lanciare (Safari in privata, cookie bloccati): un errore di
 *  memoria non deve mai impedire di usare il sito, quindi ogni lettura fallita vale "niente in memoria". */
function leggi(chiave, store) {
  try {
    const raw = (store || globalThis.localStorage).getItem(PREFISSO + chiave);
    if (!raw) return null;
    const dato = JSON.parse(raw);
    return dato && dato.v === VERSIONE ? dato : null;
  } catch {
    return null;
  }
}

function scrivi(chiave, dato, store) {
  try {
    (store || globalThis.localStorage).setItem(PREFISSO + chiave, JSON.stringify({ v: VERSIONE, ...dato }));
    return true;
  } catch {
    return false; // quota piena o scrittura vietata: pazienza, il sito funziona lo stesso
  }
}

/** Solo stringhe non vuote: in memoria può esserci di tutto (mano dell'utente, versione vecchia, altro sito). */
function soloTesti(v) {
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()) : [];
}

/** @returns { i: string[], ts: number|null } — gli ingredienti come sono stati scritti e quando. */
export function leggiDispensa(store) {
  const dato = leggi('dispensa', store);
  if (!dato) return { i: [], ts: null };
  return { i: soloTesti(dato.i), ts: typeof dato.ts === 'number' ? dato.ts : null };
}

export function salvaDispensa(ingredienti, store, ora = Date.now()) {
  return scrivi('dispensa', { ts: ora, i: soloTesti(ingredienti) }, store);
}

/** Ingredienti che non si mangiano: id canonici della tassonomia. */
export function leggiEsclusi(store) {
  const dato = leggi('esclusi', store);
  return dato ? soloTesti(dato.ids) : [];
}

export function salvaEsclusi(ids, store) {
  return scrivi('esclusi', { ids: soloTesti(ids) }, store);
}

/** Quanti giorni di calendario fa è stato salvato `ts` (0 = oggi, 1 = ieri). null se non c'è data.
 *  Conta i giorni, non le 24 ore: salvato ieri alle 23 e riaperto stamattina alle 8 è "ieri", non "oggi". */
export function giorniFa(ts, ora = Date.now()) {
  if (typeof ts !== 'number' || !Number.isFinite(ts)) return null;
  const mezzanotte = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  return Math.round((mezzanotte(ora) - mezzanotte(ts)) / GIORNO);
}
