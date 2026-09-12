# HANDOFF — stato al 12/09/2026, fine sessione (terza)

Contesto per la prossima sessione. Leggi anche `SPEC.md` (stato/roadmap), `PRODUCT.md`, e la spec di design `docs/superpowers/specs/2026-09-11-cucinanca-100-ricette-design.md` (il perché delle decisioni di questa sessione), con i due piani in `docs/superpowers/plans/`.

## Fatto il 12/09/2026 (terza sessione)

- **Ingrediente principale**: `ingredienti[].principale: true` su 1 o 2 ingredienti per ricetta (validato: mai base, mai opzionale). `abbina()` scarta la ricetta se un principale manca e nessun suo sostituto è posseduto: patate+uova+prezzemolo+olive non propongono più il bacalhau à brás. Il principale coperto da sostituto resta proposto con avviso (carbonara con porchetta). Criterio e tabella in `SPEC.md` §5.1 e nel piano `~/.claude/plans/punto-della-situazione-ordine-synthetic-platypus.md`; casi scelti da Claude e da rivedere con calma: carbonara (guanciale+uova, non pecorino), puttanesca (pelati+olive), minestrone (cannellini+patate), feijoada (borlotti+chouriço), risotto zucca e salsiccia (zucca+salsiccia, non riso).
- **Video nella hero della dispensa**: prima un pannello a sinistra (lasciava una colonna bianca lunga quanto l'indice), poi — seconda iterazione — una **fascia a tutta larghezza** ≈ 2:1 con titolo e lede in basso a sinistra, e sotto input, riga "Dispensa base" e indice a 12 colonne. Le clip vanno in sequenza (`CLIP` in `js/dispensa.js`: quattro Mixkit 16:9, `frigorifero` → `pancetta` → `omelette` → `polpette`, ~38″; `chop` e `frigo` di Michele, verticali, scartate perché in 2:1 restava una banda sgranata) su due `<video>` alternati; poster fisso con `prefers-reduced-motion`; in pausa quando si cambia vista. `npm run video:optimize -- --file nome.mp4` → `video/hero-nome.mp4` (ffmpeg-static, nessuna installazione; `--poster` per il fotogramma). Flusso nel README, "Video di sfondo". Sorgenti in `video/raw/` (non versionate).
- **Home senza `#/`**: il router toglie l'hash vuoto con `replaceState`; le altre viste e `#/?i=…` lo tengono (router hash: su GitHub Pages gli URL puliti costerebbero un redirect dalla 404).
- Verifica in locale limitata: nel browser pilotato da Claude la scheda è in background e Edge non decodifica i video nelle schede nascoste (`readyState 0`), quindi layout e logica sono verificati ma la riproduzione va vista a occhio da Michele (`npm run serve` → http://localhost:8080). Il server di sviluppo ora serve i `.mp4` con il MIME giusto e con Range (206), altrimenti Chrome resta in caricamento.

## Stato attuale

- **100 ricette** (30 primi, 25 secondi, 23 piatti unici, 12 contorni, 10 dolci; 12 portoghesi). **99 hanno la foto**; manca solo `spaghetti-al-pomodoro-e-basilico` (prompt in fondo a `prompts.md`, sezione "Da generare (1)").
- Sito live: **https://michimodu99.github.io/cucinanca/** (branch `main` = deploy). Tutto pushato a fine sessione: le 100 ricette sono online, le 39 nuove col segnaposto tipografico finché non arrivano le foto.
- **Il sito è condivisibile**: via il concetto di ingrediente "vietato" da dati, validatore, matcher, UI, test e prompt foto. Broccoli, cavolfiore, piselli, fagiolini, carciofi, piccante e pomodoro crudo sono ammessi. Restano fuori le frattaglie, per regola editoriale (nessun codice).
- **Sostituzioni**: `ingredienti[].sostituti` per ricetta, validati (`scripts/build-data.mjs`), usati dal matcher (`abbina()` ritorna `sostituzioni: [{richiesto, usato, nota}]`, ordina a parità prima chi non sostituisce). UI: riga "con X al posto di Y" nei risultati, riquadro *Modifica* + ingrediente barrato nel libro. 157 ingredienti con sostituti su 100 ricette. Esempio di riferimento: `#/ricetta/spaghetti-alla-carbonara?i=spaghetti,uova,pecorino,porchetta`.
- **i18n pronto, UI in italiano**: `js/i18n.js` (`LINGUA`, `STRINGHE.it`, `t()`, `applicaTesti()`); `ETICHETTE` in `data.js` legge da lì; il testo statico di `index.html` ha `data-i18n`. Tradurre l'interfaccia = aggiungere `STRINGHE.en` e cambiare `LINGUA`. I contenuti (ricette) restano un progetto a parte.
- Toggle crescente/decrescente su "Ordina" (bottone ↑/↓, `dir=desc` in URL) fatto a inizio sessione.
- `npm run prompts` rigenera `prompts.md` da `recipes.json` (100 prompt, senza più la frase di esclusione).
- Tassonomia: nuove voci `alheira`, `porchetta`, `panini`, `tahina`, `fagioli-borlotti`; alias `bacon`, `natas`, `grelos`, `riso carolino`, `piri-piri`. Mai usati direttamente: ricotta, gorgonzola, miele (piadina e porchetta compaiono solo come sostituti).
- I file `data/ricette/*.json` sono ora tutti nello stile compatto (una riga per ingrediente/passo).
- Le ricette nuove sono state scritte da 4 subagent in parallelo con il brief del piano contenuti (lotti A–D), rilette una a una prima del commit: il metodo ha funzionato bene, riusabile per la riserva.

## Ambiente Claude Code (da /doctor, 11/09/2026)

- `.claude/settings.local.json` (ignorato da git) disattiva le due skill di progetto `design-taste-frontend` e `minimalist-ui`: mai usate, il design è chiuso. Per riattivarle togli le righe da `skillOverrides`.
- Le connessioni MCP `canva` e `replicate` sono disattivate in questo progetto (`/mcp enable <nome>` per riattivarle).
- Il plugin `humanizer` è abilitato ma il suo agent non compariva nella lista di sessione: da controllare con `/plugin`.
- Gli screenshot del browser costano ~2k token l'uno: per verificare la UI preferire letture via `javascript_tool` e screenshot con `scale` basso.

## Da fare subito: l'ultima foto

Le foto le fa Michele **a mano**: prompt incollato in Gemini (Nano Banana 2), immagine salvata in `img/raw/<slug>.jpg`, poi `npm run images:optimize` → `npm run prompts` (la sezione "Da generare" di `prompts.md` si aggiorna da sola) → commit e push. Lo script `generate_image.py --all` con la chiave in `.env` non funziona (429: progetto senza fatturazione) e non è la strada usata. Il 12/09 sono arrivate 38 delle 39: manca **`spaghetti-al-pomodoro-e-basilico`**. Occhio al nome del file: deve essere lo slug esatto (tre erano arrivate con nomi accorciati o con l'accento e le ho rinominate).

Controllo finale: `node scripts/build-data.mjs 2>&1 | grep -c "avviso: manca"` deve stampare 0.

## Cose aperte non urgenti

- **Preferenze personali per utente** ("non mangio…") e **dispensa base personalizzabile** (oggi curry, coriandolo, basilico, paprika sono "sempre presenti" perché sono di Michele): stesso problema dei vietati, da fare quando l'app viene davvero condivisa. Idea: preferenze salvate nel browser (localStorage), non nei dati.
- **Persistenza della dispensa** fra visite (oggi si riparte da zero, scelta esplicita di Michele: per gli altri è la prima frizione).
- **Inglese dei contenuti** (100 ricette × procedimento) e selettore lingua.
- Riserva di ricette oltre le 100 in `RICETTE-LISTA.md` (Conteggi v2).
- La barra fissa "Cosa cucino" copre l'ultima riga di ingredienti mentre scorri: è il comportamento normale di una barra fissa, Michele ha deciso di lasciarlo così (verificato dal vivo, non è un bug del footer).
