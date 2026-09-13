# HANDOFF — stato al 13/09/2026, fine sessione (quarta)

Contesto per la prossima sessione. Leggi anche `SPEC.md` (stato/roadmap), `PRODUCT.md`, e la spec di design `docs/superpowers/specs/2026-09-11-cucinanca-100-ricette-design.md` (il perché delle decisioni di questa sessione), con i due piani in `docs/superpowers/plans/`.

## Prossima sessione: da dove ripartire

Michele ha letto le spiegazioni sulle funzioni (memoria della dispensa senza account, lista della spesa che si accumula, "scegli tu stasera", PWA, preferenze) e vuole decidere da quale partire. Ordine proposto da Claude, non ancora confermato: **1) memoria della dispensa + preferenze personali** (stessa tecnica: `localStorage` con prefisso `cucinanca:`, un pannello; con `?i=` nell'URL vince il link; bottone "Svuota" e riga "Dispensa di martedì"), **2) "scegli tu stasera"** (funzione pura in `match.js`, pesca fra le ricette a 0 mancanti, pesi: stagione, giorno, non fatta di recente, caso; bottoni "Un'altra" e "Apri il libro"), **3) PWA** (manifest + service worker minimo: icona in Home, offline, e Safari smette di cancellare la memoria dopo 7 giorni), **4) lista della spesa** (vista `#/spesa`, raggruppata per reparto, quantità sommate, spunta = comprato = in dispensa, condivisione via Web Share). Le spiegazioni complete sono nella conversazione del 13/09 e, in sintesi, in `docs/2026-09-13-ricerca-ricette-e-app.md` §2. Da non inseguire: foto del frigo, migliaia di ricette, account. Limite da dire chiaro: `localStorage` vive in quel browser di quel dispositivo, quattro coinquilini = quattro dispense; il ponte è il link con `?i=`.

Cose pratiche da chiedere a Michele all'inizio: (a) le 26 foto sono pronte? (b) da quale funzione partire; (c) se vuole nascondere l'email dai commit (vedi "Repo GitHub" sotto).

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

- **126 ricette** (36 primi, 33 secondi, 28 piatti unici, 14 contorni, 15 dolci; 16 portoghesi). Le prime 100 hanno la foto; **le 26 del 13/09 no**: prompt in fondo a `prompts.md`, sezione "Da generare (26)", stesso flusso a mano (Gemini → `img/raw/<slug>.jpg` → `npm run images:optimize` → `npm run prompts`).
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

## Da fare subito: le 26 foto nuove

Le foto le fa Michele **a mano**: prompt incollato in Gemini (Nano Banana 2), immagine salvata in `img/raw/<slug>.jpg`, poi `npm run images:optimize` → `npm run prompts` (la sezione "Da generare" di `prompts.md` si aggiorna da sola) → commit e push. Lo script `generate_image.py --all` con la chiave in `.env` non funziona (429: progetto senza fatturazione) e non è la strada usata. Il 12/09 sono arrivate tutte le 100; il 13/09 si sono aggiunte 26 ricette senza foto. Occhio al nome del file: deve essere lo slug esatto (tre erano arrivate con nomi accorciati o con l'accento e le ho rinominate).

Controllo finale: `node scripts/build-data.mjs 2>&1 | grep -c "avviso: manca"` deve stampare 0.

## Lotto del 13/09/2026: 26 ricette dal report

Scelte da Michele fra le 41 del report (le "25 più attese", che contando le doppie sono 26). Metodo: brief comune (`scratchpad/brief-ricette.md`, ricostruibile da `docs/superpowers/plans/2026-09-11-ricette-100.md` + regola dei principali) → 4 subagent in parallelo su file `_lotto-*.json` → rilettura una a una → fusione nei file di categoria. Tassonomia: +12 voci (merluzzo, salmone-affumicato, gnocchi, cous-cous, broa, fagioli-rossi, mais, castagne, formaggio-spalmabile, salsa-di-soia, cumino, crema-di-nocciole). Restano fuori dal report, per un altro giro: 4 formaggi, panna e prosciutto, pasta e piselli, vongole, pollo al limone, zucchine trifolate, spinaci al burro, peperonata, frollini, noodles, wrap, arroz de tomate, sopa de legumes, peixinhos da horta, bolo de bolacha.

## Report ricerca (13/09/2026)

`docs/2026-09-13-ricerca-ricette-e-app.md`: piatti più attesi dai siti italiani che mancano (ragù rosso, cotoletta di pollo, polpette al sugo, purè, omelette, riso saltato, crêpes dolci/pancakes, torta al cioccolato, posta mirandesa, bacalhau com broa, sopa de castanhas…), confronto con SuperCook/Svuotafrigo/Cucinalo e proposte (memoria dispensa, lista spesa, "scegli tu", stagione/mercato). Da decidere con Michele.

## Cose aperte non urgenti

- **Preferenze personali**, **memoria della dispensa**, **"scegli tu"**, **PWA**, **lista della spesa**: vedi "Prossima sessione" in testa. Con 126 ricette entrano piatti con piselli, fagiolini, pomodori, broccoli, cavolfiore: il filtro "non mangio" serve a Michele. La dispensa base (curry, coriandolo, basilico, paprika "sempre presenti") è di Michele: personalizzabile nello stesso pannello.
- **Ritmo di crescita**: dopo il lotto del 13/09 conviene fissare "N ricette al mese" e una lista d'attesa (le 15 rimaste del report + `RICETTE-LISTA.md`) invece di rincorrere le mancanze.
- `cous cous + ceci` non propone il cous cous di verdure (mancano 4 ingredienti: 3 verdure e cumino, soglia 3): non è un bug, ma le ricette con molti ingredienti richiesti escono facilmente dal matching; da tenere d'occhio con "scegli tu".
- **Inglese dei contenuti** (126 ricette × procedimento) e selettore lingua.
- Dosi frazionarie: "½ Uova" (spaghetti con polpette) è corretto ma brutto; valutare "1 uovo piccolo" nel dato.
- La barra fissa "Cosa cucino" copre l'ultima riga di ingredienti mentre scorri: è il comportamento normale di una barra fissa, Michele ha deciso di lasciarlo così (verificato dal vivo, non è un bug del footer).
