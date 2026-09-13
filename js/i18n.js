// Tutte le stringhe dell'interfaccia. Una lingua sola per ora: aggiungere `en` qui è l'unico passo per tradurre la UI.
export const LINGUA = 'it';

export const STRINGHE = {
  it: {
    titolo: "Cucinança · cosa c'è in frigo?",
    topbar: { dispensa: 'Dispensa', ricette: 'Ricette', meta: 'Bragança · 2026', wordmark: 'Cucinança, torna alla dispensa', sezioni: 'Sezioni' },
    dispensa: {
      hero: "Cosa c'è in frigo?",
      lede: 'Dimmi cosa ti avanza e ti consiglio una pietanza. Piccola guida culinaria per erasmus avventurieri.',
      basi: 'Dispensa base, sempre presente: {elenco}.',
      labelIngrediente: 'Ingrediente',
      placeholder: 'zucca, salsiccia, riso…',
      aggiungi: 'Aggiungi ingrediente',
      scelti: 'Ingredienti scelti',
      sconosciuto: '«{t}» non lo conosco ancora: lo ignoro nel calcolo.',
      giaBase: '{nome} è nella dispensa base: lo considero già presente.',
      togli: 'Togli {nome}',
      nessuno: 'Nessun ingrediente scelto',
      uno: '1 ingrediente',
      molti: '{n} ingredienti',
      cucina: 'Cosa cucino',
      scegli: 'Scegli tu',
      scegliAiuto: 'Scegli tu per me una ricetta che posso fare adesso',
      anche: 'anche: {alias}',
      memoriaOggi: 'Dispensa di oggi',
      memoriaIeri: 'Dispensa di ieri',
      memoriaGiorno: 'Dispensa di {giorno}',
      memoriaData: 'Dispensa del {data}',
      memoriaLink: 'Dispensa da un link',
      svuota: 'Svuota',
      copiaLink: 'Copia il link',
      copiato: 'Copiato',
      copiaErrore: 'Non riesco a copiare',
      soloQui: "La ricordo solo in questo browser. Per ritrovarla sul telefono, copia il link e aprilo lì.",
      preferenze: 'Non mangio',
      prefConta: '{n}',
      prefAiuto: "Le ricette che lo richiedono non te le propongo più. Dove è facoltativo, o dove hai un sostituto, il piatto resta.",
      prefVuoto: 'Per ora niente.',
      prefPlaceholder: 'broccoli, piselli…',
      prefAggiungi: 'Aggiungi fra quelli che non mangi',
      togliEscluso: 'Rimetti {nome} fra quelli che mangi',
      giaEscluso: "{nome} è fra quelli che non mangi: rimettilo in gioco da «Non mangio».",
      esclusoTitolo: 'Non lo mangi',
    },
    risultati: {
      titoloDefault: 'Ricette',
      filtri: 'Filtri',
      filtriN: 'Filtri ({n})',
      con: 'Con {elenco}',
      nessunRiconosciuto: 'Nessun ingrediente riconosciuto',
      tutte: 'Tutte le ricette',
      sottoDispensa: '<strong>{n}</strong> ricette · <strong>{c}</strong> senza spesa · <a href="{link}">cambia dispensa</a>',
      sottoTutte: '<strong>{n}</strong> ricette · <a href="#/">scrivi cosa hai in dispensa</a>',
      nonRiconosciuto: ' · non riconosciuto: <b>{elenco}</b>',
      nonRiconosciuti: ' · non riconosciuti: <b>{elenco}</b>',
      vuotoDispensa: 'Con questi ingredienti (e al massimo {n} da comprare) non esce niente. Prova a <a href="{link}">aggiungerne qualcuno</a> o togli un filtro.',
      vuotoFiltri: 'Nessuna ricetta con questi filtri.',
      sezioneAdesso: 'Puoi farle adesso',
      sezioneUno: 'Manca un ingrediente',
      sezioneN: 'Mancano {n} ingredienti',
      serve: 'serve {attrezzo}',
      ingr: ' ingr.',
      manca: 'manca: <b>{elenco}</b>',
      haiTutto: 'hai tutto',
      conSostituto: 'con {elenco}',
      alPostoDi: '<b>{usato}</b> al posto di {richiesto}',
      riposo: '+ riposo',
      badgePt: 'Piatto tipico di Bragança / Portogallo',
      e: ' e ',
      nascoste: ' · {n} nascoste da «non mangio»',
      nascosta: ' · 1 nascosta da «non mangio»',
      filtro: { portata: 'Portata', difficolta: 'Difficoltà', tempo: 'Tempo', costo: 'Costo', dieta: 'Dieta', tag: 'Tag', attrezzatura: 'Solo con la mia attrezzatura', ordina: 'Ordina', inverti: 'Inverti ordine' },
      opzioni: {
        tutte: 'Tutte', tutti: 'Tutti', qualsiasi: 'Qualsiasi',
        entro30: 'entro 30′', entro45: 'entro 45′', entro60: 'entro 60′', entro90: 'entro 90′',
        costoBasso: 'Basso (≤ 3 €)', costoMedio: 'Medio (3–6 €)', costoAlto: 'Alto (6–10 €)',
        perCopertura: 'Per copertura', perTempo: 'Per tempo', perCosto: 'Per costo', perDifficolta: 'Per difficoltà', az: 'A–Z',
      },
    },
    scegli: {
      occhiello: 'Stasera',
      altra: "Un'altra",
      apri: 'Apri il libro',
      conSostituto: 'con {elenco}',
      alPostoDi: '<b>{usato}</b> al posto di {richiesto}',
      serve: 'serve {attrezzo}',
      torna: '<a href="{link}">cambia dispensa</a>',
      vuoto: 'Con questa dispensa non è pronto niente: tutto quello che potresti fare chiede qualcosa che non hai. <a href="{link}">Aggiungi un ingrediente</a> e riprova.',
      soloPronte: 'Fra quelle che puoi fare senza comprare niente.',
      unica: "È l'unica che puoi fare senza comprare niente.",
      unicaAiuto: 'Non ce ne sono altre pronte con questa dispensa',
    },
    libro: {
      difficolta: 'Difficoltà', preparazione: 'Preparazione', cottura: 'Cottura', riposo: 'Riposo', costo: 'Costo', aPersona: 'a persona',
      serve: 'serve ', ingredienti: 'Ingredienti', porzioni: 'Porzioni', facoltativo: 'facoltativo', aBraganca: 'a Bragança: {testo}',
      copia: 'Copia la lista della spesa ({n})', copiata: 'Copiata', copiaErrore: 'Non riesco a copiare',
      modifica: 'Modifica', alPostoDi: '<b>{usato}</b> al posto di {richiesto}',
      consiglio: 'Consiglio', conservazione: 'Conservazione', varianti: 'Varianti', fonte: 'Fonte',
      pagine: 'Pagine', precedente: 'Pagina precedente', successiva: 'Pagina successiva',
    },
    errore: { titolo: 'Pagina non trovata', torna: 'Torna alla dispensa', caricamento: 'Non riesco a caricare le ricette ({msg}). Se hai aperto il file dal disco, servilo con <code>npm run serve</code>.' },
    footer: { by: 'By Michi' },
    etichette: {
      categoria: { antipasto: 'Antipasto', primo: 'Primo', secondo: 'Secondo', 'piatto-unico': 'Piatto unico', contorno: 'Contorno', dolce: 'Dolce' },
      categoriaPlurale: { antipasto: 'Antipasti', primo: 'Primi', secondo: 'Secondi', 'piatto-unico': 'Piatti unici', contorno: 'Contorni', dolce: 'Dolci' },
      difficolta: { 'molto-facile': 'Molto facile', facile: 'Facile', media: 'Media', difficile: 'Difficile' },
      difficoltaOrdine: { 'molto-facile': 0, facile: 1, media: 2, difficile: 3 },
      costo: { basso: 'Basso', medio: 'Medio', alto: 'Alto' },
      costoOrdine: { basso: 0, medio: 1, alto: 2 },
      attrezzatura: { padella: 'Padella', pentola: 'Pentola', forno: 'Forno', microonde: 'Microonde', teglia: 'Teglia', frullatore: 'Frullatore', mattarello: 'Mattarello', stampo: 'Stampo', stampini: 'Stampini', frusta: 'Frusta', griglia: 'Griglia' },
      tag: { veloce: 'Veloce', weekend: 'Weekend', 'one-pan': 'Una padella', avanzi: 'Avanzi', 'low-cost': 'Low cost', 'da-ospiti': 'Da ospiti', autunno: 'Autunno', inverno: 'Inverno', classico: 'Classico', portoghese: 'Portoghese' },
      dieta: { vegetariano: 'Vegetariana', vegano: 'Vegana', 'senza-glutine': 'Senza glutine', 'senza-lattosio': 'Senza lattosio' },
      categoriaIngrediente: { carne: 'Carne', pesce: 'Pesce', salume: 'Salumi', latticino: 'Latticini', uova: 'Uova', verdura: 'Verdure', frutta: 'Frutta e frutta secca', cereale: 'Cereali e pane', pasta: 'Pasta', legume: 'Legumi', condimento: 'Condimenti e vino', spezia: 'Spezie', erba: 'Erbe', dolce: 'Per i dolci', altro: 'Altro' },
      unita: { g: 'g', ml: 'ml', pz: '', cucchiai: 'cucchiai', cucchiaini: 'cucchiaini', qb: 'q.b.', bustina: 'bustina', spicchi: 'spicchi', foglie: 'foglie', rametti: 'rametti', fette: 'fette', pizzico: 'pizzico' },
      unitaSingolare: { cucchiai: 'cucchiaio', cucchiaini: 'cucchiaino', spicchi: 'spicchio', foglie: 'foglia', rametti: 'rametto', fette: 'fetta' },
    },
  },
};

/** Stringa per chiave a punti ("risultati.filtriN"), con interpolazione {nome}. Chiave assente → la chiave stessa. */
export function t(chiave, vars = {}) {
  const s = chiave.split('.').reduce((o, k) => (o == null ? undefined : o[k]), STRINGHE[LINGUA]);
  if (s === undefined) return chiave;
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** Riempie il testo statico marcato con data-i18n="chiave" e data-i18n-attr="attributo:chiave;attributo:chiave". */
export function applicaTesti(root = document) {
  for (const el of root.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of root.querySelectorAll('[data-i18n-attr]')) {
    for (const coppia of el.dataset.i18nAttr.split(';')) {
      const [attr, chiave] = coppia.split(':');
      el.setAttribute(attr.trim(), t(chiave.trim()));
    }
  }
  document.documentElement.lang = LINGUA;
}
