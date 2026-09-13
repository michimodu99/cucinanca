# HANDOFF — stato al 13/09/2026, fine sessione (sesta)

Contesto per la prossima sessione. Leggi anche `SPEC.md` (stato/roadmap), `PRODUCT.md`, e la spec di design `docs/superpowers/specs/2026-09-11-cucinanca-100-ricette-design.md` (il perché delle decisioni di questa sessione), con i due piani in `docs/superpowers/plans/`.

## Prossima sessione: da dove ripartire

Fatte: memoria della dispensa, «non mangio», «scegli tu stasera», e tutte e 126 le foto. Restano due cose, in quest'ordine:

1. **PWA**: manifest + service worker minimo, icona in Home, offline in cucina, e su iPhone Safari smette di cancellare `localStorage` dopo 7 giorni di inattività (oggi la memoria della dispensa è esposta a questo: **da verificare sul telefono vero prima di darlo per scontato**). Il grattacapo è la cache del service worker: rete-prima per ricette e dati, cache-prima per font e immagini, o gli aggiornamenti non arrivano più.
2. **Lista della spesa**: vista `#/spesa`, raggruppata per reparto, quantità sommate, spunta = comprato = in dispensa, condivisione via Web Share.

Da non inseguire: foto del frigo, migliaia di ricette, account.

## Fatto il 13/09/2026 (sesta sessione)

- **Le 26 foto mancanti**: 126 su 126. Sei file avevano il nome diverso dallo slug (`cannelloni-ricotta-e-spinacci`, `cotoletta-di-pollo-impanata`, `cous-cous`, `flietto-di-merluzzo-al-forno-con-patate`, `riso-saltato-con-uovo-e-verdure`, `tagliatelle-al-ragu`): succede a ogni lotto, il confronto fra `img/raw/*.jpg` e gli avvisi di `build-data.mjs` lo risolve in un comando.
- **Footer**: la riga «By Michi» era schiacciata sulla barra «Cosa cucino». Lo spazio riservato al footer era esatto quanto la barra, senza il suo padding: ora è barra + `u*4`.
- **«Scegli tu stasera»** (`js/scegli.js`, vista `#/scegli?i=…`, bottone secondario nella barra della dispensa). Pesca solo fra le ricette a **zero mancanti**; il bottone è spento se non ce n'è nessuna. La regola viene da un'obiezione di Michele: con solo «piselli» in dispensa i risultati sono vuoti, quindi cosa starebbe scegliendo? Pesi in `pesoScelta()`: stagione dal mese, e il giorno della settimana (di mercoledì il brasato vale un terzo, di sabato il doppio). Niente storico delle ricette fatte, per scelta sua; «Un'altra» non si ripete grazie a una lista di slug che vive solo nella scheda aperta.
- Dettaglio emerso provando: con una sola ricetta pronta «Un'altra» riproponeva quella sullo schermo. Ora è spenta e la nota dice «È l'unica che puoi fare senza comprare niente».
- **Test: 60** (erano 48). `scegliPerMe()` prende il caso dall'esterno, quindi le pescate sono ripetibili.
## Fatto il 13/09/2026 (quinta sessione)

- **La dispensa si ricorda** (`localStorage`, nessun account). Regole: il link con `?i=` vince sulla memoria ma **non la sovrascrive** finché non tocchi niente (guardi la dispensa di un coinquilino, torni alla home, ritrovi la tua); si salva solo sulle modifiche vere, mai dentro `render()`; «Svuota» salva il vuoto. Sotto le chip: da quando è lì («Dispensa di venerdì»), «Svuota» e «Copia il link».
- **Il limite è scritto nella pagina**, non solo nei documenti: «La ricordo solo in questo browser. Per ritrovarla sul telefono, copia il link e aprilo lì.» Quattro coinquilini = quattro dispense; il ponte è l'URL.
- **«Non mangio»**: pannello a scomparsa sotto le chip. Quello che escludi esce dalla dispensa, è barrato nell'indice, e le ricette che lo richiedono spariscono dai risultati e anche sfogliando tutte le ricette. Resta il piatto se lì l'ingrediente è facoltativo (pasta al forno al ragù coi piselli) o se un sostituto posseduto lo rimpiazza (orecchiette coi broccoli salvate dalle cime di rapa). Escludere un ingrediente **base** lo rimette in conto: chi non mangia aglio non lo considera «sempre presente».
- **Il numero delle nascoste si dice** («6 nascoste da «non mangio»»): far sparire ricette in silenzio sembra un bug. Conta solo quelle che avresti visto davvero: il controllo in `abbina()` sta in fondo al ciclo apposta, dopo la soglia dei mancanti.
- **`js/memoria.js`**: l'unico punto che tocca `localStorage` (prefisso `cucinanca:`, formato `{v:1,…}` versionato, ogni accesso in `try/catch`, perché in navigazione privata il solo tocco lancia). Store iniettabile: i test girano in node. Verificato dal vivo che col browser che blocca lo storage il sito funziona, semplicemente non ricorda.
- **Refactor**: l'autocomplete (frecce, Invio, corrispondenza esatta che batte i contenuti) è ora `creaCampoIngrediente()` in `dispensa.js`, usato due volte invece di duplicare 40 righe già collaudate. Il conteggio degli ingredienti richiesti viene da `ingredientiRichiesti()` in `match.js`: prima `risultati.js` lo ricalcolava per conto suo e sarebbe andato fuori sincrono con le esclusioni.
- **Test: 48** a fine quinta sessione (erano 30). 18 nuovi fra esclusioni e memoria. Verifica nel browser: memoria fra ricariche, link altrui che non sovrascrive, Svuota, copia negli appunti con un click vero (quella via script fallisce sempre: serve il gesto utente), 120 + 6 = 126, minestrone nascosto dai piselli.
## Fatto il 13/09/2026 (quarta sessione)

- **Foto 100/100** (arrivate 38 il 12/09 + spaghetti al pomodoro il 13/09; tre file rinominati allo slug esatto). Poi **+26 ricette** senza foto (vedi "Lotto del 13/09").
- **Passata humanizer** sui testi delle 100 ricette (899 frammenti, 20k parole): puliti; ritoccate 9 frasi ("il segreto è", "per eccellenza", una frase doppia sui carciofi). I trattini lunghi sono intervalli numerici e restano; le code "non X: motivo" sono istruzioni vere e restano. Le parole vietate sono nel brief delle ricette.
- **Test**: unit 30/30 (`npm test`); funzionali sui dati veri (ogni alias risolve, ogni ricetta raggiungibile con i suoi ingredienti, 87 ricette bloccate senza il principale, ordine deterministico, dosi mai 0/NaN) e nel browser (percorso completo, URL rotti, filtri non validi). **Quattro bug corretti**: (1) `scalaQuantita` arrotondava i pezzi a interi: mezza cipolla, ¼ di limone e il mezzo pollo del piri-piri comparivano come "1" in 67 dosi; ora a quarti, il libro scrive ½ ¼ ¾ e usa il singolare per q ≤ 1; (2) "sale" + Invio aggiungeva Capperi (unico suggerimento contenente "sale"): la corrispondenza esatta vince; (3) i singolari di nomi al plurale ("cece", "acciuga", "pistacchio") non risolvevano: euristica anche singolare → plurale; (4) testo utente in `innerHTML` (chip sconosciute, "non riconosciuto"): ora `escapeHtml` in `data.js`. Non bug ma scelta: "pomodor" + Invio con più suggerimenti aperti diventa chip sconosciuta (l'utente sceglie con frecce o click).
- **Repo GitHub**: `cucinanca` è pubblica (serve per Pages gratis), `quizzettino` è privata e invisibile. Nessun segreto in repo. L'**email `michelemodugno99@gmail.com` è in tutti i commit** (pubblica): se Michele vuole nasconderla, GitHub → Settings → Emails → "Keep my email addresses private" + `git config user.email <id>+michimodu99@users.noreply.github.com`; i commit vecchi resterebbero (riscriverli è possibile ma invasivo). Rendere privata la repo con Pages richiede GitHub Pro.
- **Report ricerca** (`docs/2026-09-13-ricerca-ricette-e-app.md`) e **lotto di 26 ricette** (sezioni sotto).

## Fatto il 12/09/2026 (terza sessione)

- **Ingrediente principale**: `ingredienti[].principale: true` su 1 o 2 ingredienti per ricetta (validato: mai base, mai opzionale). `abbina()` scarta la ricetta se un principale manca e nessun suo sostituto è posseduto: patate+uova+prezzemolo+olive non propongono più il bacalhau à brás. Il principale coperto da sostituto resta proposto con avviso (carbonara con porchetta). Criterio e tabella in `SPEC.md` §5.1 e nel piano `~/.claude/plans/punto-della-situazione-ordine-synthetic-platypus.md`; casi scelti da Claude e da rivedere con calma: carbonara (guanciale+uova, non pecorino), puttanesca (pelati+olive), minestrone (cannellini+patate), feijoada (borlotti+chouriço), risotto zucca e salsiccia (zucca+salsiccia, non riso).
- **Video nella hero della dispensa**: prima un pannello a sinistra (lasciava una colonna bianca lunga quanto l'indice), poi — seconda iterazione — una **fascia a tutta larghezza** ≈ 2:1 con titolo e lede in basso a sinistra, e sotto input, riga "Dispensa base" e indice a 12 colonne. Le quattro clip Mixkit 16:9 (`frigorifero` → `pancetta` → `omelette` → `polpette`, 38″; `chop` e `frigo` di Michele, verticali, scartate perché in 2:1 restava una banda sgranata) sono **montate in un unico `video/hero.mp4`** in loop: la prima versione le alternava fra due `<video>` e da telefono mostrava fotogrammi spuri al cambio (il browser mobile non precarica la clip nascosta). `npm run video:optimize -- --file a.mp4,b.mp4 --poster b.mp4` (ffmpeg-static, nessuna installazione). Poster fisso con `prefers-reduced-motion`; in pausa quando si cambia vista. Flusso nel README, "Video di sfondo". Sorgenti in `video/raw/` (non versionate).
- **Home senza `#/`**: il router toglie l'hash vuoto con `replaceState`; le altre viste e `#/?i=…` lo tengono (router hash: su GitHub Pages gli URL puliti costerebbero un redirect dalla 404).
- Verifica in locale limitata: nel browser pilotato da Claude la scheda è in background e Edge non decodifica i video nelle schede nascoste (`readyState 0`), quindi layout e logica sono verificati ma la riproduzione va vista a occhio da Michele (`npm run serve` → http://localhost:8080). Il server di sviluppo ora serve i `.mp4` con il MIME giusto e con Range (206), altrimenti Chrome resta in caricamento.

## Stato attuale

- **126 ricette** (36 primi, 33 secondi, 28 piatti unici, 14 contorni, 15 dolci; 16 portoghesi), **tutte con foto** (le ultime 26 il 13/09). Flusso, per le prossime: prompt da `prompts.md` incollato in Gemini a mano → `img/raw/<slug>.jpg` → `npm run images:optimize` → `npm run prompts`. Il nome del file deve essere lo slug esatto; finora ogni lotto ne ha avuti tre o sei da rinominare.
- Sito live: **https://michimodu99.github.io/cucinanca/** (branch `main` = deploy). Tutto pushato a fine sessione: 126 ricette online, le 26 nuove col segnaposto tipografico finché non arrivano le foto. GitHub Pages tiene i file in cache 10 minuti: subito dopo un push il telefono può avere HTML nuovo e JS vecchio (successo il 12/09; il codice del video ora tollera l'elemento mancante).
- **Il sito è condivisibile**: via il concetto di ingrediente "vietato" da dati, validatore, matcher, UI, test e prompt foto. Broccoli, cavolfiore, piselli, fagiolini, carciofi, piccante e pomodoro crudo sono ammessi. Restano fuori le frattaglie, per regola editoriale (nessun codice).
- **Sostituzioni**: `ingredienti[].sostituti` per ricetta, validati (`scripts/build-data.mjs`), usati dal matcher (`abbina()` ritorna `sostituzioni: [{richiesto, usato, nota}]`, ordina a parità prima chi non sostituisce). UI: riga "con X al posto di Y" nei risultati, riquadro *Modifica* + ingrediente barrato nel libro. ~200 ingredienti con sostituti su 126 ricette. Esempio di riferimento: `#/ricetta/spaghetti-alla-carbonara?i=spaghetti,uova,pecorino,porchetta`.
- **i18n pronto, UI in italiano**: `js/i18n.js` (`LINGUA`, `STRINGHE.it`, `t()`, `applicaTesti()`); `ETICHETTE` in `data.js` legge da lì; il testo statico di `index.html` ha `data-i18n`. Tradurre l'interfaccia = aggiungere `STRINGHE.en` e cambiare `LINGUA`. I contenuti (ricette) restano un progetto a parte.
- Toggle crescente/decrescente su "Ordina" (bottone ↑/↓, `dir=desc` in URL) fatto a inizio sessione.
- `npm run prompts` rigenera `prompts.md` da `recipes.json` (126 prompt; in fondo la sezione "Da generare" con quelli senza foto).
- Tassonomia: 159 voci (12 nuove il 13/09, vedi "Lotto del 13/09"). Mai usato direttamente: gorgonzola (piadina e porchetta compaiono solo come sostituti). `risolvi()` capisce plurali e singolari ("pomodori", "cece"); "pane" → pane-raffermo e "pollo" → petto-di-pollo per scelta.
- I file `data/ricette/*.json` sono ora tutti nello stile compatto (una riga per ingrediente/passo).
- Le ricette nuove (11/09 e 13/09) sono state scritte da 4 subagent in parallelo con un brief comune (lotti A–D), rilette una a una prima del commit: il metodo funziona, riusabile per il prossimo lotto.

## Ambiente Claude Code (da /doctor, 11/09/2026)

- `.claude/settings.local.json` (ignorato da git) disattiva le due skill di progetto `design-taste-frontend` e `minimalist-ui`: mai usate, il design è chiuso. Per riattivarle togli le righe da `skillOverrides`.
- Le connessioni MCP `canva` e `replicate` sono disattivate in questo progetto (`/mcp enable <nome>` per riattivarle).
- Il plugin `humanizer` è abilitato ma il suo agent non compariva nella lista di sessione: da controllare con `/plugin`.
- Gli screenshot del browser costano ~2k token l'uno: per verificare la UI preferire letture via `javascript_tool` e screenshot con `scale` basso.

## Lotto del 13/09/2026: 26 ricette dal report

Scelte da Michele fra le 41 del report (le "25 più attese", che contando le doppie sono 26). Metodo: brief comune (`scratchpad/brief-ricette.md`, ricostruibile da `docs/superpowers/plans/2026-09-11-ricette-100.md` + regola dei principali) → 4 subagent in parallelo su file `_lotto-*.json` → rilettura una a una → fusione nei file di categoria. Tassonomia: +12 voci (merluzzo, salmone-affumicato, gnocchi, cous-cous, broa, fagioli-rossi, mais, castagne, formaggio-spalmabile, salsa-di-soia, cumino, crema-di-nocciole). Restano fuori dal report, per un altro giro: 4 formaggi, panna e prosciutto, pasta e piselli, vongole, pollo al limone, zucchine trifolate, spinaci al burro, peperonata, frollini, noodles, wrap, arroz de tomate, sopa de legumes, peixinhos da horta, bolo de bolacha.

## Report ricerca (13/09/2026)

`docs/2026-09-13-ricerca-ricette-e-app.md`: piatti più attesi dai siti italiani che mancano (ragù rosso, cotoletta di pollo, polpette al sugo, purè, omelette, riso saltato, crêpes dolci/pancakes, torta al cioccolato, posta mirandesa, bacalhau com broa, sopa de castanhas…), confronto con SuperCook/Svuotafrigo/Cucinalo e proposte (memoria dispensa, lista spesa, "scegli tu", stagione/mercato). Da decidere con Michele.

## Cose aperte non urgenti

- **"Scegli tu"**, **PWA**, **lista della spesa**: vedi "Prossima sessione" in testa.
- **Dispensa base personalizzabile**: rimandata di proposito il 13/09 per non incastrare tre meccanismi in una sessione. Oggi curry, coriandolo, basilico e paprika sono "sempre presenti" per tutti, ma sono la dispensa di Michele, non quella dei coinquilini. Il pannello "Non mangio" è il posto naturale dove metterla; `abbina()` parte dai `base` della tassonomia e sa già gestirne l'assenza (le esclusioni rimettono in conto un base), quindi metà del lavoro è fatta.
- **Le preferenze non seguono il link**: `?i=` passa la dispensa, non le esclusioni. Chi apre il tuo link vede le ricette senza i tuoi "non mangio". Voluto (le preferenze sono personali), da rivedere se dà fastidio.
- **Ritmo di crescita**: dopo il lotto del 13/09 conviene fissare "N ricette al mese" e una lista d'attesa (le 15 rimaste del report + `RICETTE-LISTA.md`) invece di rincorrere le mancanze.
- `cous cous + ceci` non propone il cous cous di verdure (mancano 4 ingredienti: 3 verdure e cumino, soglia 3): non è un bug, ma le ricette con molti ingredienti richiesti escono facilmente dal matching; da tenere d'occhio con "scegli tu".
- **Inglese dei contenuti** (126 ricette × procedimento) e selettore lingua.
- Dosi frazionarie: "½ Uova" (spaghetti con polpette) è corretto ma brutto; valutare "1 uovo piccolo" nel dato.
- La riga "By Michi" era schiacciata contro la barra "Cosa cucino" (13/09, corretto: lo spazio riservato al footer era esatto quanto la barra, senza il suo padding).
- La barra fissa "Cosa cucino" copre l'ultima riga di ingredienti mentre scorri: è il comportamento normale di una barra fissa, Michele ha deciso di lasciarlo così (verificato dal vivo, non è un bug del footer).
