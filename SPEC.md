# SPEC — Cucinança · ricettario intelligente per Bragança

Versione 0.5 · 13 settembre 2026 · stato: **implementata** (Fasi 0-7 concluse; online su https://michimodu99.github.io/cucinanca/ · 126 ricette, 100 con foto)

## 1. Obiettivo

Una pagina web (sito statico) che, dati gli ingredienti presenti in dispensa, propone ricette
adatte, filtrabili per difficoltà, tempo, costo e altri parametri, e le presenta in un formato
"libro di ricette" (foto a sinistra, procedimento a destra su PC; pagine sfogliabili con swipe sul
telefono). Deve essere leggibile dal telefono in cucina, con lo schermo che non si spegne.

Non è un'app di meal-planning né un social: nessun login, nessun salvataggio della dispensa
(si reinserisce ogni volta), nessun commento.

## 2. Contesto e vincoli

| Aspetto | Valore |
|---|---|
| Luogo / periodo | Bragança (PT), settembre → febbraio (autunno-inverno) |
| Persone | Michele cucina **per sé** (dosi e costi per 1 persona); altre 3 persone in casa possono accodarsi → moltiplicatore porzioni nella UI. Nessuna intolleranza; cena in casa, pranzo in mensa |
| Esclusioni | nessuna in tassonomia (dal 11/09/2026 il sito è pensato per essere condiviso). Regola editoriale: niente frattaglie; peperoncino sempre dosabile |
| Sostituzioni | un ingrediente di ricetta può avere `sostituti` curati per quel piatto: se ne possiedi uno, la ricetta conta come coperta e mostra l'avviso |
| Ingrediente principale | ogni ricetta marca 1 o 2 ingredienti `principale` (il baccalà del bacalhau): se manca e non hai un suo sostituto, la ricetta non viene proposta, qualunque sia il numero di mancanti |
| Cavalli di battaglia già suoi | ragù bianco, pasta tonno e olive nere (non duplicati) |
| Tempo feriale | 30–45 min → maggioranza di ricette ≤ 45′; le lunghe sono marcate "weekend" |
| Budget | ≤ 10 € a persona a cena |
| Attrezzatura posseduta | piano a induzione, forno, microonde, 3 padelle, pentola alta, teglia, set coltelli, bilancia precisa, taglieri, frullatore/minipimer (in acquisto) |
| Attrezzatura NON posseduta | stampo da torta, stampini, mattarello (ricette che li richiedono sono incluse ma segnalate con badge) |
| Livello | oltre il principiante: ricette facili, medie e alcune difficili |
| Reperibilità | ingredienti disponibili nei supermercati di Bragança (Continente, Pingo Doce, Intermarché, Lidl); sostituzioni indicate quando un ingrediente italiano manca |
| Lingua | italiano (UI e ricette) |

## 3. Ricerca: come i canali italiani descrivono una ricetta

Fonti consultate l'11/09/2026 (pagine reali, non riassunti):
- GialloZafferano — `ricette.giallozafferano.it/Spaghetti-alla-Carbonara.html` (dati strutturati schema.org/Recipe + box "dati in evidenza")
- Cucchiaio d'Argento — `cucchiaio.it/ricetta/ricetta-risotto-alla-milanese/` e facet di `cucchiaio.it/ricette/`
- Fatto in casa da Benedetta / Cookist — sottoinsieme dei campi GZ (Difficoltà, Tempo, Porzioni), non riportati a parte

| Campo | GialloZafferano | Cucchiaio d'Argento | Adottato in questo progetto |
|---|---|---|---|
| Difficoltà | Molto facile · Facile · Media · Difficile · Molto difficile | Facile · Media · Difficile | 4 livelli: `molto-facile` `facile` `media` `difficile` |
| Tempo preparazione | ✓ (min) | ✓ | ✓ |
| Tempo cottura | ✓ (min) | ✓ | ✓ |
| Tempo riposo / ammollo | in nota | "Tempo ammollo" | ✓ (`riposo`, opzionale) |
| Dosi | "Dosi per: 4 persone" | "Porzioni" | ✓ **sempre per 1 persona**; moltiplicatore ×1 ×2 ×4 nella UI |
| Costo | Molto basso · Basso · Medio · Alto · Molto alto | — | 3 fasce + **stima in € per 1 persona a prezzi PT** |
| Portata / categoria | Primi piatti, Secondi… | Antipasti, Primi, Secondi, Contorni, Piatti unici, Pane e pizze, Dolci | `antipasto` `primo` `secondo` `piatto-unico` `contorno` `dolce` |
| Metodo di cottura | — | "Metodo di esecuzione": In pentola, In padella, Al forno, Microonde, Fritto, Al vapore, In umido… | ✓ come **attrezzatura richiesta** (`padella` `pentola` `forno` `microonde` `frullatore` …) |
| Tag dieta | Light, Senza lattosio, Vegetariano, Senza glutine | Vegetariane, Vegane, Senza glutine | ✓ `vegetariano` `vegano` `senza-glutine` `senza-lattosio` |
| Regione / origine | — | Cucina tipica italiana per regione; Cucina etnica | ✓ testo libero `origine` |
| Occasione | — | Cene tra amici, In famiglia, Cene per due, Facili, Veloci, Low cost | ✓ tag `veloce` (≤30′ totali), `low-cost`, `da-ospiti` |
| Stagione | — | (per collezioni) | ✓ tag `autunno` `inverno` |
| Nutrizione | kcal, carboidrati, proteine, grassi, fibre, sodio | — | solo `kcal` opzionale (v2) |
| Sezioni testuali | Presentazione · Procedimento · Conservazione · Consiglio | Introduzione · Procedimento | ✓ `descrizione` `procedimento` `conservazione` `consigli` `varianti` |
| Step | numerati, 3 foto per step | numerati | numerati, titolo breve + testo + minuti indicativi |
| Schermo acceso | — | "Mantieni lo schermo attivo" | ✓ Wake Lock API |
| Lista della spesa | — | "Salva nella lista della spesa" | ✓ minimale: ingredienti mancanti copiabili |

Campi **specifici di questo progetto**, assenti nei canali:
- `reinventata`: nota libera se la ricetta si discosta dalla classica (oggi nessuna la usa per aggirare esclusioni).
- `ingredienti[].pt`: reperibilità a Bragança + sostituto suggerito.
- tag `one-pan` (poche stoviglie) e `avanzi` (si presta a dose doppia per il giorno dopo).
- `attrezzatura` confrontata con lo stack posseduto → badge "serve: frullatore".

## 4. Funzionalità (v1)

### 4.1 Dispensa
- Campo di testo con autocomplete sulla tassonomia ingredienti; ogni scelta diventa un chip rimovibile.
- Chip rapide per categoria (Carne · Pesce · Latticini · Verdure · Cereali e pasta · Legumi · Uova · Salumi · Frutta).
- Gli ingredienti **base** (§5.2) sono considerati sempre presenti e mostrati come nota "consideriamo che tu abbia: olio, sale…".
- Un ingrediente posseduto che è sostituto curato di un ingrediente richiesto copre quell'ingrediente; la riga dei risultati mostra "con X al posto di Y" e il libro un riquadro *Modifica* con la nota culinaria.
- Pulsante "Cosa cucino?" → risultati. Lo stato vive nell'URL (`#/risultati?i=zucca,salsiccia,riso`), così si può ricaricare o passare il link al telefono.
- **La dispensa si ricorda** (`localStorage`, chiavi `cucinanca:dispensa` e `cucinanca:esclusi`, nessun account). Il link con `?i=` vince sulla memoria ma non la sovrascrive finché non si modifica nulla; "Svuota" salva il vuoto. Sotto le chip: da quando è lì, Svuota, e "Copia il link" — la memoria vive in un solo browser di un solo dispositivo, e l'URL è il ponte verso gli altri.
- **"Non mangio"**: lista personale di ingredienti (pannello a scomparsa, stesso autocomplete, pesca anche fra i base). Quello che escludi esce dalla dispensa ed è barrato nell'indice; le ricette che lo richiedono spariscono, sia dai risultati sia sfogliando tutte le ricette, e il sottotitolo dice quante ne ha nascoste.

### 4.1-bis «Scegli tu stasera»
- Un bottone secondario nella barra della dispensa porta a `#/scegli?i=…`: **una** ricetta sola, con «Un'altra» e «Apri il libro».
- Pesca **solo fra le ricette a zero mancanti**, e il bottone è spento se non ce n'è nessuna: se devi uscire a comprare qualcosa non è un consiglio per stasera, è un compito. La soglia è il `maxMancanti` passato ad `abbina()`.
- Pesi (`pesoScelta()`): stagione dal mese ×2 se il tag c'è (nei dati esistono solo `autunno` e `inverno`); giorno feriale ×1,6 sotto i 45′ e ×0,35 sopra o se `weekend`; sabato e domenica ×1,8 alle lunghe.
- Nessuno storico delle ricette fatte (scelta di Michele): «Un'altra» evita le ripetizioni tenendo gli slug mostrati in memoria di sessione, e riparte da capo quando le ha girate tutte. Con una sola ricetta pronta il bottone è spento e la nota lo dice.

### 4.2 Risultati
- Card: foto, titolo, categoria, difficoltà, tempo totale, costo, **copertura** ("hai tutto" / "manca: pecorino").
- Ordine: copertura 100 % → 1 mancante → 2 mancanti; a parità, tempo totale crescente. Oltre 2 mancanti non compare (soglia in `config`). Se manca un ingrediente `principale` (senza sostituto posseduto) la ricetta non compare mai: senza baccalà il bacalhau è un altro piatto, senza prezzemolo no.
- Filtri (barra sticky): categoria · difficoltà · tempo massimo (30/45/60/90+) · costo · dieta · "solo con la mia attrezzatura" · tag (veloce, one-pan, avanzi, da-ospiti). Su mobile la barra mostra solo [Filtri +] [Ordina]; il tocco apre gli altri in una griglia a due colonne.
- Ordinamento alternativo: tempo, costo, difficoltà.
- Se nessun risultato: mostra le 5 ricette più vicine con l'elenco dei mancanti.

### 4.3 Ricetta (libro)
**Desktop (≥ 900 px)** — spread a doppia pagina:
- Sinistra: foto a piena altezza, titolo, descrizione, riga meta (difficoltà · prep · cottura · riposo · costo), badge attrezzatura, nota `reinventata` se presente.
- Destra: **selettore porzioni ×1 ×2 ×4** (default 1; le quantità si ricalcolano, arrotondate in modo sensato: uova intere, "q.b." invariato), ingredienti (evidenziati i mancanti; nota PT dove serve) e procedimento numerato. Se il procedimento eccede l'altezza, continua nella spread successiva.
- Navigazione: frecce a margine, tasti ← →, indicatore "2 / 3".

**Mobile (< 900 px)** — pagine a scorrimento orizzontale (`scroll-snap`):
- Pagina 1 copertina (foto + titolo + meta) · Pagina 2 ingredienti · Pagine 3…n: **uno step per pagina**, numero grande, testo ≥ 20 px, minuti dello step.
- Indicatore "3 / 8", swipe; tap sui bordi per avanzare.
- Wake Lock attivato all'apertura della ricetta (con fallback silenzioso).
- Lista mancanti copiabile negli appunti.

### 4.4 Fuori scope v1
Timer, preferiti, note personali, valori nutrizionali completi, API esterne, PWA offline (valutabile in v2: è quasi gratis con un service worker). *(La persistenza della dispensa era qui: fatta il 13/09/2026, §4.1.)*

## 5. Dati

### 5.0 Dove si scrivono le ricette
Le schede si scrivono in `data/ricette/<categoria>.json` (primi, secondi, piatti-unici, contorni, dolci); `node scripts/build-data.mjs` le valida e le fonde in `data/recipes.json`, l'unico file letto dal sito. Vedi README.md per il workflow.

### 5.1 `data/recipes.json` — schema di una ricetta

```jsonc
{
  "slug": "risotto-zucca-salsiccia",
  "titolo": "Risotto zucca e salsiccia",
  "descrizione": "2–3 frasi: cos'è, perché piace, quando farlo.",
  "categoria": "primo",                  // antipasto | primo | secondo | piatto-unico | contorno | dolce
  "difficolta": "facile",                // molto-facile | facile | media | difficile
  "tempi": { "preparazione": 15, "cottura": 30, "riposo": 0 },   // minuti; totale = somma
  "porzioni": 1,                         // SEMPRE 1: le quantità sono per una persona
  "costo": { "fascia": "basso", "stima_eur": 2.5 },               // basso ≤ 3 € · medio 3–6 € · alto 6–10 € (per 1 persona, prezzi PT)
  "attrezzatura": ["pentola", "padella"],   // padella | pentola | forno | microonde | teglia | frullatore | mattarello | stampo | stampini | frusta
  "tag": ["autunno", "one-pan", "avanzi"],  // + veloce | weekend | low-cost | da-ospiti | inverno | classico | portoghese
  "dieta": ["senza-glutine"],               // vegetariano | vegano | senza-glutine | senza-lattosio
  "origine": "Italia · Lombardia",
  "reinventata": null,                      // oppure testo: "In bianco: niente pomodoro, il fondo è vino e olive."
  "ingredienti": [
    { "id": "riso-carnaroli", "qta": 80, "unita": "g", "note": "", "opzionale": false,
      "pt": { "reperibilita": "media", "sostituto": "riso arborio o 'arroz carolino' (Continente)" } }
  ],
  "procedimento": [
    { "n": 1, "titolo": "Il soffritto", "testo": "…", "minuti": 5 }
  ],
  "consigli": "…",
  "conservazione": "…",
  "varianti": ["…"],
  "kcal": null,
  "foto": { "copertina": "img/risotto-zucca-salsiccia.webp", "prompt": "prompt usato per generarla", "modello": "flux-schnell" },
  "fonte": "ispirata a GialloZafferano; adattata"
}
```

Regole:
- `ingredienti[].id` deve esistere in `ingredienti.json`.
- `ingredienti[].principale` (booleano): 1 o 2 per ricetta, obbligatorio. È ciò che dà identità al piatto, ciò senza cui *sarebbe un altro piatto* (di norma sta nel nome). Il supporto (pasta, riso, farina, pane) non è principale, tranne quando il piatto *è* il supporto (cacio e pepe, risotto alla milanese, arroz doce, tagliatelle fresche). Mai `base` (sarebbe sempre posseduto) né `opzionale`. Il matcher scarta la ricetta se un principale manca e nessun suo sostituto è posseduto; con il sostituto la ricetta compare con l'avviso (carbonara con porchetta).
- `ingredienti[].sostituti` (opzionale): `[{ "id", "nota"? }]`, curati per la ricetta. Ogni id esiste in tassonomia, non è `base`, non è l'ingrediente stesso, non si ripete; un ingrediente `opzionale` non ha sostituti. Il matcher usa il primo sostituto posseduto nell'ordine dell'array; a parità di mancanti e copertura, prima le ricette senza sostituzioni.

```jsonc
{ "id": "guanciale", "qta": 50, "unita": "g", "principale": true,
  "sostituti": [{ "id": "pancetta" }, { "id": "porchetta", "nota": "più grassa e speziata: dadini piccoli, rosolala meno" }] }
```
- `porzioni` è sempre 1; il moltiplicatore è solo in UI. Per gli ingredienti non divisibili (uova) si indica la quantità per 1 e, se serve, una `note` ("1 uovo; con ×2 usa 2").
- `unita` ∈ `g | ml | pz | cucchiai | cucchiaini | qb | bustina | spicchi | foglie | rametti`.
- `pt` è presente solo se la reperibilità non è `facile` o se c'è un sostituto utile.
- `procedimento[].minuti` è indicativo e serve solo alla lettura, non a un timer.

### 5.2 `data/ingredienti.json` — tassonomia

```jsonc
{ "id": "pomodoro-fresco", "nome": "Pomodoro fresco", "alias": ["pomodoro", "pomodori", "pomodorini", "ciliegini", "datterini"], "categoria": "verdura" }
{ "id": "passata", "nome": "Passata di pomodoro", "alias": ["passata", "polpa di pomodoro", "sugo di pomodoro"], "categoria": "condimento" }
{ "id": "olio-evo", "nome": "Olio extravergine", "alias": ["olio", "olio d'oliva", "evo"], "categoria": "condimento", "base": true }
{ "id": "guanciale", "nome": "Guanciale", "alias": [], "categoria": "salume",
  "pt": { "reperibilita": "difficile", "sostituto": "toucinho fumado o pancetta (Continente)" } }
```

- Categorie: `carne` `pesce` `salume` `latticino` `uova` `verdura` `frutta` `cereale` `pasta` `legume` `condimento` `spezia` `erba` `dolce` `altro`.
- **Dispensa base** (confermata): olio evo, sale, pepe, aglio, cipolla, burro, farina 00, zucchero, aceto, limone, dado/brodo, parmigiano grattugiato, alloro, rosmarino, basilico, coriandolo, paprika, curry. (Peperoncino non è in base: va scelto, e nelle ricette è sempre dosabile.)
- Gli alias risolvono anche il plurale/singolare più comune; la normalizzazione rimuove accenti e maiuscole.

### 5.3 Validazione (`scripts/validate.mjs`)
1. Ogni ricetta rispetta `schema/recipe.schema.json`.
2. I `sostituti` e i `principale` rispettano le regole di §5.1 (1 o 2 principali, mai base né opzionali).
3. Ogni `ingredienti[].id` esiste nella tassonomia.
4. Ogni `foto.copertina` esiste su disco.
5. Slug unici; `procedimento[].n` consecutivi da 1.

## 6. Matching (`js/match.js`, funzione pura)

```
input: ingredientiUtente: string[], ricette, tassonomia, config {maxMancanti: 3}
1. normalizza(s) = minuscole, senza accenti, trim → cerca in id | nome | alias → id canonico; se fallisce, fallback di singolarizzazione plurale (o null)
2. posseduti = (set(id risolti) ∪ set(base)) − esclusi   // "non mangio": non lo possiedi mai, nemmeno se te lo passa un link
3. per ogni ricetta:
     richiesti = ingredienti.filter(!opzionale).map(id) − (base − esclusi)   // se non mangi l'aglio, l'aglio torna a contare
     mancanti  = richiesti − posseduti
     copertura = 1 − |mancanti| / |richiesti|
4. scarta se un ingrediente `principale` è tra i mancanti (nessun suo sostituto posseduto); scarta se |mancanti| > maxMancanti, e scarta se non possiedi nessun ingrediente richiesto (copertura 0: rumore, non suggerimento)
4b. scarta se richiede un ingrediente escluso che nessun sostituto posseduto rimpiazza, e conta la ricetta in `esclusi` — il controllo viene per ultimo apposta, perché il numero mostrato deve contare le ricette che avresti visto davvero
5. ordina per |mancanti| asc, poi copertura desc, poi tempo totale asc, poi titolo
output: [{ ricetta, mancanti: id[], richiesti: n, copertura, sostituzioni }] + .nonRisolti + .esclusi
```
Test unitari coprono: alias → id, base ignorato, opzionale ignorato, sostituzioni (copertura, precedenza dell'originale, ordinamento), ordinamento, soglia, esclusioni (richiesto / opzionale / coperto da sostituto / passato dall'URL / base) e la memoria (`scripts/memoria.test.mjs`: formato, dati corrotti, storage che lancia, giorni di calendario). 48 in tutto.

## 7. Design

- **Riferimenti**: `reference/` — cookbook editoriale a doppia pagina (griglia, filo sottile fra colonne, foto grandi), "cook book like app" (foto scontornata, schede compatte), poster Swiss (Helvetica, nero `#2E2E2E`, grigio `#E8E8E8`, bianco).
- **Principi**: griglia a 12 colonne, un solo font sans (Inter con fallback Helvetica/Arial), scala tipografica rigorosa, allineamento a sinistra, nessun ornamento, nessuna ombra; **le foto sono l'unico colore** dell'interfaccia. Numeri di step grandi in stile poster. Etichette in maiuscoletto con tracking.
- **Tokens** (bozza, finalizzati con `impeccable`): `--ink #2E2E2E`, `--paper #FFFFFF`, `--ash #E8E8E8`, `--mist #F4F4F4`, `--rule 1px solid var(--ash)`; spaziatura in multipli di 8 px; radius 0.
- **Processo**: skill `impeccable` per direzione e review finale; skill `minimalist-ui` / `design-taste-frontend` (taste-skill) per tipografia e ritmo; `DESIGN.md` generato a fine build.
- **Accessibilità**: contrasto AA, focus visibile, navigazione da tastiera nel libro, `prefers-reduced-motion` rispettato.

## 8. Immagini

- Generazione via **Gemini API** (`scripts/generate_image.py`, libreria `google-genai`, chiave `GEMINI_API_KEY` in `.env`). Modello **gemini-3.1-flash-image** (Nano Banana 2); i modelli immagine non sono nel free tier, serve la fatturazione attiva su AI Studio. Alternativa precedente: Replicate/FLUX (`gen-images.mjs`).
- Modello: **FLUX Schnell** (≈ 0,003 $/immagine) per il primo passaggio; **FLUX Dev** (≈ 0,025 $) per rigenerare quelle non convincenti. Budget atteso < 1 $ per ~56 ricette.
- Prompt template (coerenza visiva): `editorial food photography, {descrizione piatto in inglese}, white ceramic plate on light grey linen, soft natural daylight, 45-degree angle, minimal Swiss composition, muted background, no text, no hands, no cutlery clutter`. Rapporto 4:5 (verticale, come la pagina sinistra). Il prompt e il modello sono salvati nel JSON.
- Post-produzione: `scripts/optimize-images.mjs` → WebP 1200 px lato lungo, qualità ~80, target < 150 KB.

## 9. Architettura tecnica

- Sito statico, **HTML/CSS/JS vanilla, senza build**. Hosting **GitHub Pages**, repo `michimodu99/cucinanca` pubblico (con GitHub Student/Pro si può rendere privato in qualsiasi momento senza perdere Pages).
- Single-page con router hash: `#/` dispensa · `#/risultati?i=…&f=…` · `#/scegli?i=…` · `#/ricetta/<slug>`.
- Struttura: `css/tokens.css base.css dispensa.css risultati.css libro.css`, `js/app.js data.js match.js memoria.js dispensa.js risultati.js scegli.js libro.js i18n.js`, `data/`, `schema/`, `scripts/`, `img/`, `video/`, `reference/`.
- Stato locale: `js/memoria.js` è **l'unico** punto che tocca `localStorage` (prefisso `cucinanca:`, formato versionato `{v:1,…}`, ogni accesso in `try/catch` perché in navigazione privata il solo tocco lancia). Lo store è iniettabile, così i test girano in node senza browser.
- Dipendenze runtime: nessuna. Dipendenze dev (solo per gli script): `sharp` (ottimizzazione immagini), `ajv` (validazione schema).
- Test: `node --test scripts/` (match), `node scripts/validate.mjs` (dati), screenshot Playwright a 1440×900 e 390×844.

## 10. Workflow di aggiornamento del database

"Aggiungi risotto ai funghi" →
1. Scrivo la scheda in `recipes.json` (e nuovi ingredienti in `ingredienti.json` se servono).
2. Genero la foto (`python scripts/generate_image.py --slug ...`) e la ottimizzo.
3. `node scripts/validate.mjs` verde.
4. `git commit` + `git push` → GitHub Pages aggiorna in ~1 minuto.

Modifiche a una ricetta esistente ("la carbonara con 5 tuorli invece di 6") seguono lo stesso percorso senza foto.

## 11. Piano di esecuzione

| Fase | Contenuto | Checkpoint |
|---|---|---|
| 0 | Setup: git, skills, MCP Replicate, ricerca, SPEC, DOMANDE, lista ricette | ✅ fatto |
| 1 | Tassonomia (142 ingredienti, oggi 159), schema, 61 schede per 1 persona (oggi 126), validatore, match.js con 21 test (oggi 30) | ✅ fatto |
| 2 | Generazione e ottimizzazione foto (`scripts/generate_image.py`, `scripts/optimize-images.mjs`) | ✅ fatto — 61/61 foto generate a mano su Gemini (Nano Banana 2, free tier non abilitato per l'API) e ottimizzate |
| 3 | UI (impeccable → build → review 'ship') + DESIGN.md | ✅ fatto |
| 4 | Repo pubblico `michimodu99/cucinanca`, GitHub Pages, smoke test sull'URL live | ✅ fatto — da provare in cucina |
| 5 | Aggiornamenti a richiesta | workflow in README.md |
| 6 | 11–13/09: sito condivisibile (via i "vietati"), sostituzioni, i18n pronto, 100 → 126 ricette, ingrediente principale, hero video, home senza `#/`, dosi a quarti, singolari, escape, test funzionali | ✅ fatto — vedi `HANDOFF.md` |
| 7 | Memoria della dispensa + preferenze "non mangio" (localStorage) | ✅ fatto il 13/09/2026 — §4.1 |
| 8 | "Scegli tu stasera" | ✅ fatto il 13/09/2026 — §4.1-bis |
| 9 | PWA (icona in Home + offline), poi lista della spesa | nell'ordine, da fare (analisi in `docs/2026-09-13-ricerca-ricette-e-app.md`) |

### Aperto
- Vino bianco e prezzemolo contano come "mancanti": se sono sempre in casa, vanno marcati `base: true` in `data/ingredienti.json`.
- Prova reale dal telefono in cucina: dimensioni del testo, swipe, cosa manca nella pagina step.
