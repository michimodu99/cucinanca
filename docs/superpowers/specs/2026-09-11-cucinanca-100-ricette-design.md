# Cucinança → 100 ricette, sito condiviso — design

Data: 2026-09-11. Approvato da Michele in sessione (report in chat, "Approvo tutto").

## Obiettivo

Trasformare Cucinança da ricettario personale a ricettario **condivisibile** con gli altri erasmus di Bragança:

1. Togliere le esclusioni personali dai dati e dal codice (i 5 ingredienti "vietati"; il piccante; il pomodoro crudo). Le frattaglie restano fuori come regola editoriale, senza codice.
2. Aggiungere il meccanismo delle **sostituzioni**: una ricetta compare anche se hai un sostituto curato di un ingrediente (porchetta al posto del guanciale → carbonara, con avviso).
3. Preparare il terreno per l'inglese (dizionario stringhe UI), lasciando l'interfaccia in italiano.
4. Passare da 61 a **100 ricette** con 39 nuove, scelte contro tre assi: ingredienti prima vietati, buchi di copertura, piatti portoghesi / erasmus-friendly.
5. Foto per le 39 nuove con la pipeline Gemini esistente.

Ordine di lavoro (vincolante, perché le ricette nuove devono nascere già con i sostituti): sblocco vietati → sostituzioni → i18n → ricette a lotti di ~10 → prompt e foto → documentazione.

## 1. Sblocco dei vietati

Il concetto "vietato" viene **rimosso del tutto**, non solo disattivato:

- `data/ingredienti.json`: via `"vietato": true` da piselli, fagiolini, carciofi, broccoli, cavolfiore.
- `scripts/build-data.mjs`: via il controllo che rifiuta gli id vietati.
- `js/match.js`: `risolvi()` non ritorna più `vietato`; `abbina()` non produce più `out.vietati`.
- `js/dispensa.js`: via il filtro `i.vietato` nell'indice per categoria, la classe `vietato` nei suggerimenti e il messaggio di rifiuto.
- `js/libro.js`: via il controllo `!x.vietato`.
- `css/dispensa.css`: via `.suggerimenti li.vietato`.
- `scripts/match.test.mjs`: via i test sui vietati (la fixture `pomodoro-fresco` resta, senza flag; il test "la passata non è vietata" diventa "la passata risolve al suo id, non a pomodoro-fresco").
- `scripts/generate_image.py`: via `ESCLUSIONI` e il suo uso in `build_prompt`; `prompts.md` rigenerato senza la frase.
- Docs: README, SPEC (§ sui vietati e sul validatore), PRODUCT (positioning: non "esclude quello che lui non mangia" ma "ricettario condiviso, dosato per 1, prezzi Bragança"), RICETTE-LISTA (regole in testa), HANDOFF.
- Ricette esistenti: ripassare `varianti`, `consigli`, `descrizione` e il flag `reinventata` dove parlano delle esclusioni ("senza pomodoro per natura", ecc.) e riscrivere.

Il campo `reinventata` resta nello schema (è documentazione della ricetta), ma nessuna ricetta lo usa più per aggirare un'esclusione.

## 2. Sostituzioni

### Dati

Ogni voce di `ingredienti[]` di una ricetta può avere `sostituti`, curati **per ricetta**:

```json
{ "id": "guanciale", "qta": 50, "unita": "g", "note": "a listarelle spesse 1 cm",
  "sostituti": [
    { "id": "pancetta" },
    { "id": "porchetta", "nota": "più grassa e speziata: tagliala a dadini piccoli e rosolala meno" },
    { "id": "speck", "nota": "affumicato: il piatto cambia carattere, ma funziona" }
  ] }
```

- Nessuna regola globale ("maiale vale maiale"): ogni sostituto è una scelta culinaria fatta per quella ricetta.
- Schema (`schema/recipe.schema.json`): `sostituti` opzionale, array di `{ id: string, nota?: string }`, `minItems: 1`.
- Validatore: ogni `sostituti[].id` deve esistere in tassonomia, essere diverso dall'ingrediente, non essere `base`, non ripetersi; un ingrediente `opzionale` non ha sostituti (non serve: non conta nel matching).
- Le 61 ricette esistenti ricevono i sostituti ovvi: formati di pasta (rigatoni ↔ pasta corta, spaghetti ↔ bucatini/linguine…), guanciale ↔ pancetta/porchetta/speck, pecorino ↔ parmigiano, provola ↔ mozzarella/formaggio da fondere, stracchino ↔ stracciatella, fettine di vitello ↔ tacchino, ecc. Solo dove il piatto regge davvero.

### Matcher (`js/match.js`, `abbina`)

- Un ingrediente richiesto conta come coperto se `posseduti` contiene il suo id **oppure** l'id di uno dei suoi `sostituti` (il primo trovato nell'ordine dell'array, che è l'ordine di preferenza).
- Ogni risultato guadagna `sostituzioni: [{ richiesto, usato, nota }]` (vuoto se nessuna).
- `mancanti` e `copertura` si calcolano dopo le sostituzioni (un ingrediente sostituito non è mancante).
- Ordinamento: mancanti asc → copertura desc → **numero di sostituzioni asc** → tempo asc → titolo.
- La regola "niente in comune con la dispensa" resta: un sostituto posseduto conta come "in comune".

### UI

- **Risultati** (`js/risultati.js`, riga): nello slot dove oggi compare `manca: …`, prima di quello, una riga `con porchetta al posto del guanciale` (più sostituzioni: elenco con "e"). Stile come `.manca`, testo in `--ink` per distinguerlo dal mancante.
- **Libro** (`js/libro.js`): se l'URL porta ingredienti e la ricetta ha sostituzioni attive, sopra la lista ingredienti un riquadro `Modifica` (stile: bordo `--rule-ink`, label maiuscola come le altre etichette) con una riga per sostituzione: "**Porchetta** al posto del guanciale — più grassa e speziata: …". Nella lista ingredienti l'ingrediente sostituito mostra il sostituto in grassetto e l'originale barrato accanto. Il procedimento resta scritto per l'originale.
- Nessun cambiamento alla dispensa: i sostituti non compaiono nell'indice come voci speciali.

### Test (`scripts/match.test.mjs`)

- Ingrediente coperto da un sostituto: non è mancante, `sostituzioni` lo riporta con `richiesto`/`usato`/`nota`.
- Se possiedi sia l'originale sia il sostituto, nessuna sostituzione.
- A parità di mancanti e copertura, la ricetta senza sostituzioni viene prima.
- Un sostituto non presente in tassonomia fa fallire il validatore (test in `build-data`, o verifica manuale con `npm run validate` su una fixture).

## 3. Terreno per l'inglese

- Nuovo `js/i18n.js`: `export const STRINGHE = { it: { … } }`, `export function t(chiave, vars)` con interpolazione `{n}`; lingua fissa `it` (una costante, non un selettore).
- Le stringhe UI in JS (`risultati.js`, `dispensa.js`, `libro.js`, `app.js`) passano per `t()`. Le etichette di dominio già in `ETICHETTE` (`data.js`) restano lì ma si spostano sotto la stessa lingua (`STRINGHE.it.etichette`), così un giorno la lingua è un solo oggetto da tradurre.
- Il testo statico di `index.html` (hero, label dei filtri, opzioni dei select, footer) riceve `data-i18n="chiave"` e viene riempito al boot da `i18n.js`; il markup tiene comunque il testo italiano come fallback, così la pagina è leggibile anche senza JS.
- `<html lang="it">` verificato/impostato.
- Fuori scope: traduzione dei contenuti (ricette), selettore lingua, routing per lingua.

## 4. Le 39 ricette

Legenda: V sbloccata da un vietato · P piccante · T pomodoro crudo · C copre un buco · PT portoghese · N "meno classica" / erasmus · W weekend.

Primi (18 → 30): Spaghetti al pomodoro e basilico (C) · Penne all'arrabbiata (P) · Spaghetti alla puttanesca (P C) · Pasta al pesto genovese (C N, frullatore, pinoli → mandorle) · Orecchiette con broccoli e acciughe (V) · Pasta con cavolfiore alla siciliana (V C: uvetta, mandorle, zafferano) · Risi e bisi (V) · Pasta con carciofi e pancetta (V; carciofi freschi nov–feb o in vasetto/surgelati) · Pasta e fagioli (C) · Tagliatelle al ragù bianco (C, W) · Lasagne alla bolognese (C, W) · Spaghetti tonno, olive e capperi (C).

Secondi (17 → 25): Frango piri-piri (P PT) · Pollo alla pizzaiola (C: petto di pollo, origano) · Scaloppine al marsala (C) · Salsiccia e broccoli in padella (V) · Salmone allo yogurt ed erba cipollina (C) · Insalata caprese (T) · Bacalhau com natas (PT, W) · Hamburger fatti in casa con cipolle caramellate (N T).

Piatti unici (13 → 23): Pizza margherita (C, W) · Minestrone (V C) · Zuppa di lenticchie (C) · Curry di ceci e spinaci (C N, vegana) · Shakshuka (P N) · Insalata di riso (V T C) · Vellutata di cavolfiore e porro (V C, frullatore) · Bitoque (PT N) · Alheira no forno com ovo e grelos (PT) · Feijoada à transmontana (PT, W, senza frattaglie).

Contorni (7 → 12): Carciofi alla romana (V) · Fagiolini al pomodoro con patate (V) · Cavolfiore gratinato (V) · Patatas bravas (P N) · Hummus con pane tostato (C N).

Dolci (6 → 10): Torta caprese (C, senza glutine) · Arroz doce (PT) · Mousse al cioccolato (N) · Torta allo yogurt (N).

Riserva oltre le 100: pasta ricotta e spinaci, risotto gorgonzola e noci, polpette di tonno, frittata di pasta, arroz de ervilhas, panzanella, riso saltato uova e piselli, pollo al limone, peperonata, broccoli ripassati, sopa de legumes, pastéis de bacalhau, bruschetta, gnocchi alla sorrentina.

Regole invariate per ogni ricetta nuova: dose per 1 persona; prezzi Bragança; niente frattaglie; `veloce` se ≤ 30′, `weekend` se > 45′ o con riposo; attrezzatura dallo stack (frullatore incluso); sostituti curati dove il piatto regge; `foto.prompt` in inglese nello stile comune; `fonte` indicata.

Tassonomia, voci nuove: alheira, porchetta, panini (per hamburger), tahina, fagioli borlotti (feijoada, pasta e fagioli in variante). Alias nuovi: "riso carolino" → riso-carnaroli (nota: per l'arroz doce va meglio il carolino, l'alias serve al matching), "bacon" → pancetta, "natas" → panna-fresca, "grelos" → cime-di-rapa (se manca).

Numeri attesi: sbloccate dai vietati 11, dal piccante 5, dal pomodoro crudo 3, buchi di copertura 14, portoghesi 6 (totale 12), erasmus 8. Ingredienti mai usati: da 21 a 4 (ricotta, gorgonzola, miele, piadine). Legumi: da 2 a 8 ricette. Vegetariane fra le nuove: 17, di cui 1 vegana.

## 5. Foto

- `generate_image.py`: via `ESCLUSIONI`; `build_prompt` = `stile, piatto. FORMATO`.
- Ogni ricetta nuova ha `foto.prompt`; `prompts.md` rigenerato (61 esistenti + 39 nuove) senza la frase di esclusione. Le 61 immagini esistenti non si rifanno.
- Generazione: `python scripts/generate_image.py --all` (solo le ricette senza png) se `GEMINI_API_KEY` è in `.env`; poi `npm run images:optimize`. Se la chiave non c'è, i prompt restano in `prompts.md` per la generazione manuale.

## 6. Documentazione

- `RICETTE-LISTA.md`: sezione v2 con le 39 (stessa tabella per categoria) e i conteggi aggiornati; via le regole sulle esclusioni in testa.
- `README.md`, `SPEC.md`, `PRODUCT.md`: posizionamento condiviso, via i vietati, aggiunta del meccanismo sostituzioni e dell'i18n.
- `HANDOFF.md`: stato a fine sessione.

## Fuori scope (decisi, non dimenticati)

- Preferenze personali per utente ("non mangio…") e dispensa base personalizzabile: stesso problema dei vietati, da fare quando l'app viene davvero condivisa.
- Persistenza della dispensa fra visite.
- Traduzione dei contenuti in inglese e selettore lingua.
- Riscrittura dinamica del procedimento in base alle sostituzioni.
