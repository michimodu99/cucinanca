# Sito condiviso: sblocco vietati, sostituzioni, i18n — piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Togliere il concetto "vietato" da dati e codice, aggiungere il matching con sostituzioni curate per ricetta (con avviso in UI), e centralizzare le stringhe dell'interfaccia in un dizionario `it` pronto per l'inglese.

**Architecture:** Sito statico senza build step (HTML + CSS + ES modules). I dati vivono in `data/ricette/*.json` (5 file per categoria) fusi da `scripts/build-data.mjs` in `data/recipes.json`; la tassonomia in `data/ingredienti.json`. La logica di matching è pura in `js/match.js` (testata con `node --test`); le viste sono `js/dispensa.js`, `js/risultati.js`, `js/libro.js`; il router è `js/app.js`. Il nuovo `js/i18n.js` espone `t()` e il dizionario; `data.js` continua a esportare `ETICHETTE` leggendolo da lì.

**Tech Stack:** vanilla JS (ES2022, moduli), Node 24 per script e test (`node --test`), Ajv per lo schema, Python 3 + `google-genai` per le foto.

**Spec:** `docs/superpowers/specs/2026-09-11-cucinanca-100-ricette-design.md` (§1, §2, §3, §5 pipeline foto, §6 docs)

## Global Constraints

- Nessun build step, nessuna dipendenza nuova lato browser.
- Tutti i comandi si lanciano dalla root del repo: `npm run validate` (solo validazione), `npm run build:data` (valida + scrive `data/recipes.json`), `npm test` (unit test di `js/match.js`), `npm run serve` (server locale su :8080).
- Lingua del codice e dei commenti: italiano, come il resto del repo. Identificatori in italiano (`sostituti`, `sostituzioni`, `richiesto`, `usato`, `nota`).
- Niente commenti che spiegano il "cosa"; un commento solo se il "perché" non è ovvio.
- Ogni task finisce con `npm run validate && npm test` verdi e un commit. Messaggi di commit in italiano, prima riga ≤ 70 caratteri, chiusi da:
  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01HkivgxcYoM7FA2vbhjgV4m
  ```
- Le frattaglie restano fuori dalle ricette per regola editoriale: nessun codice le gestisce.
- `data/recipes.json` è generato: si modifica solo `data/ricette/*.json` e poi si lancia `npm run build:data`.

---

## File structure

| File | Responsabilità | Task |
|---|---|---|
| `data/ingredienti.json` | tassonomia; via i flag `vietato` | 1 |
| `scripts/build-data.mjs` | validatore; via il check vietati, aggiunge il check `sostituti` | 1, 2 |
| `schema/recipe.schema.json` | aggiunge `ingredienti[].sostituti` | 2 |
| `js/match.js` | `risolvi` senza `vietato`; `abbina` con sostituzioni | 1, 3 |
| `scripts/match.test.mjs` | test aggiornati (vietati) + nuovi (sostituzioni) | 1, 3 |
| `js/dispensa.js` | via rifiuto/nascondimento dei vietati | 1 |
| `js/libro.js` | via check vietato; riquadro Modifica; ingredienti sostituiti | 1, 5 |
| `js/risultati.js` | riga "con X al posto di Y" | 4 |
| `css/dispensa.css`, `css/risultati.css`, `css/libro.css` | stili | 1, 4, 5 |
| `scripts/generate_image.py`, `scripts/test_generate_image.py` | via `ESCLUSIONI` | 1 |
| `scripts/prompts-md.mjs` (nuovo) | genera `prompts.md` da `recipes.json` | 1 |
| `prompts.md` | rigenerato | 1 |
| `data/ricette/*.json` | sostituti nelle 61 ricette esistenti; testi che citano le esclusioni | 6 |
| `js/i18n.js` (nuovo) | `LINGUA`, `STRINGHE`, `t()`, `applicaTesti()` | 7 |
| `js/data.js` | `ETICHETTE` letto da `i18n.js` | 7 |
| `index.html` | `data-i18n` sul testo statico | 7 |
| `README.md`, `SPEC.md`, `PRODUCT.md` | posizionamento condiviso, sostituzioni, i18n | 8 |

---

### Task 1: Rimuovere il concetto "vietato"

**Files:**
- Modify: `data/ingredienti.json:18-22`
- Modify: `scripts/build-data.mjs:64`
- Modify: `js/match.js:71,80-118`
- Modify: `js/dispensa.js:40-43,116,153-157`
- Modify: `js/libro.js:32`
- Modify: `css/dispensa.css:77`
- Modify: `scripts/match.test.mjs:8,34-44,112-117`
- Modify: `scripts/generate_image.py:35-39,67-68`
- Modify: `scripts/test_generate_image.py` (solo se cita `ESCLUSIONI`: `grep -n ESCLUSIONI scripts/test_generate_image.py`)
- Create: `scripts/prompts-md.mjs`
- Modify: `package.json` (script `prompts`)
- Regenerate: `prompts.md`

**Interfaces:**
- Produces: `risolvi(indice, testo)` → `{ id, nome, base } | null` (senza `vietato`); `abbina(...)` ritorna l'array con la sola proprietà extra `nonRisolti`.

- [ ] **Step 1: Aggiorna i test dei vietati**

In `scripts/match.test.mjs`:
- riga 8: togli `, vietato: true` dalla fixture `pomodoro-fresco`.
- sostituisci i due test alle righe 34-44 con:

```js
test('risolvi: "pomodorini" risolve a pomodoro-fresco e non espone flag', () => {
  const r = risolvi(indice, 'pomodorini');
  assert.equal(r.id, 'pomodoro-fresco');
  assert.equal('vietato' in r, false);
});

test('risolvi: la passata risolve al suo id, non a pomodoro-fresco', () => {
  assert.equal(risolvi(indice, 'passata di pomodoro').id, 'passata');
});
```
- sostituisci il test alle righe 112-117 con:

```js
test('abbina: input sconosciuti vengono ignorati e riportati; niente proprietà vietati', () => {
  const out = abbina({ ricette, indice, ingredienti: ['zucca', 'unicorno', 'pomodorini'] });
  assert.ok(out.length > 0);
  assert.deepEqual(out.nonRisolti, ['unicorno']);
  assert.equal('vietati' in out, false);
});
```

- [ ] **Step 2: Lancia i test, devono fallire**

Run: `npm test`
Expected: FAIL sui due test nuovi (`'vietato' in r` è `true`; `'vietati' in out` è `true`).

- [ ] **Step 3: Togli il concetto dal codice**

`js/match.js` riga 71:
```js
  return { id, nome: ing.nome, base: Boolean(ing.base) };
```
`js/match.js` righe 80-94 (commento e ciclo di risoluzione):
```js
/**
 * Abbina la dispensa alle ricette.
 * @returns array di { ricetta, mancanti: id[], copertura: 0..1 } ordinato per rilevanza,
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
```
e in fondo alla funzione togli la riga `out.vietati = vietati;`.

`js/dispensa.js`:
- riga 40: commento → `// indice per categoria (esclusi i base), ordinato per quante ricette lo usano`
- riga 43: `if (i.base) continue;`
- riga 116: elimina `if (i.vietato) li.classList.add('vietato');`
- righe 153-157: elimina il blocco `if (ing.vietato) { … return; }`

`js/libro.js` riga 32: `if (x) posseduti.add(x.id);`

`css/dispensa.css` riga 77: elimina `.suggerimenti li.vietato { … }`.

`scripts/build-data.mjs` riga 64: elimina `if (t.vietato) err(...)`.

`data/ingredienti.json` righe 18-22: togli `, "vietato": true` dalle cinque voci (piselli, fagiolini, carciofi, broccoli, cavolfiore).

- [ ] **Step 4: Verifica**

Run: `npm test && npm run validate && grep -rn "vietat" js scripts data/ingredienti.json css`
Expected: 21 test PASS, `✓ 61 ricette valide`, grep senza risultati.

- [ ] **Step 5: Togli l'esclusione dai prompt foto**

`scripts/generate_image.py`: elimina le righe 35-36 (commento sugli ingredienti che Michele non mangia) e la riga 39 (`ESCLUSIONI = …`); `build_prompt` diventa:
```python
def build_prompt(piatto: str, style: str | None = None) -> str:
    return f"{style or STILE_DEFAULT}, {piatto}. {FORMATO}"
```
Se `scripts/test_generate_image.py` cita `ESCLUSIONI` o "Do not include", aggiorna l'asserzione al nuovo formato (`prompt.endswith(FORMATO)`).

Run: `python -m pytest scripts/test_generate_image.py -q` (se pytest non è installato: `python scripts/test_generate_image.py`)
Expected: PASS.

- [ ] **Step 6: Script che rigenera prompts.md**

Create `scripts/prompts-md.mjs`:
```js
// Rigenera prompts.md da data/recipes.json: un prompt per ricetta, raggruppato per categoria.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ricette = JSON.parse(readFileSync(join(root, 'data/recipes.json'), 'utf8'));

const STILE = 'editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload';
const FORMATO = 'Vertical 4:5 portrait format.';
const CATEGORIE = [['contorno', 'Contorno'], ['dolce', 'Dolce'], ['piatto-unico', 'Piatto unico'], ['primo', 'Primo'], ['secondo', 'Secondo']];

let md = `# Prompt per le foto delle ricette

${ricette.length} prompt in inglese, uno per ricetta, nello stile editoriale del progetto (SPEC §8). Generati da \`scripts/prompts-md.mjs\` dal campo \`foto.prompt\` di ogni ricetta, con lo stesso template di \`scripts/generate_image.py\`.
Il formato **4:5 verticale** è dichiarato in ogni prompt; se l'interfaccia ha un selettore di aspect ratio, imposta comunque 4:5 (o 3:4 se 4:5 non c'è, poi il crop lo fa \`optimize-images\`). Salva l'output come \`img/raw/<slug>.png\`, poi \`npm run images:optimize\`.

**Stile comune:** ${STILE}

**Formato:** ${FORMATO}
`;
for (const [id, nome] of CATEGORIE) {
  const lista = ricette.filter((r) => r.categoria === id).sort((a, b) => a.titolo.localeCompare(b.titolo, 'it'));
  if (!lista.length) continue;
  md += `\n## ${nome}\n`;
  for (const r of lista) md += `\n### ${r.titolo}\n\`${r.slug}\`\n\n\`\`\`\n${STILE}, ${r.foto.prompt}. ${FORMATO}\n\`\`\`\n`;
}
writeFileSync(join(root, 'prompts.md'), md);
console.log(`✓ prompts.md: ${ricette.length} prompt`);
```

In `package.json`, dentro `scripts`, aggiungi `"prompts": "node scripts/prompts-md.mjs"`.

Run: `npm run prompts && grep -c "Do not include" prompts.md; grep -c '^### ' prompts.md`
Expected: `✓ prompts.md: 61 prompt`, `0`, `61`.

- [ ] **Step 7: Commit**

```bash
git add data/ingredienti.json scripts/build-data.mjs js/match.js js/dispensa.js js/libro.js css/dispensa.css scripts/match.test.mjs scripts/generate_image.py scripts/test_generate_image.py scripts/prompts-md.mjs package.json prompts.md
git commit -m "Via il concetto di ingrediente vietato: il sito diventa condivisibile"
```

---

### Task 2: Schema e validatore per `sostituti`

**Files:**
- Modify: `schema/recipe.schema.json` (blocco `ingredienti.items.properties`)
- Modify: `scripts/build-data.mjs:61-67`
- Modify: `data/ricette/primi.json` (carbonara, come prima ricetta con sostituti)

**Interfaces:**
- Produces: forma dati `ingredienti[].sostituti: [{ id: string, nota?: string }]`, usata da Task 3, 5, 6 e dal piano contenuti.

- [ ] **Step 1: Aggiungi `sostituti` allo schema**

In `schema/recipe.schema.json`, dentro `properties.ingredienti.items.properties`, dopo `"opzionale"`:
```json
"sostituti": {
  "type": "array",
  "minItems": 1,
  "items": {
    "type": "object",
    "additionalProperties": false,
    "required": ["id"],
    "properties": {
      "id": { "type": "string" },
      "nota": { "type": "string", "minLength": 3 }
    }
  }
}
```

- [ ] **Step 2: Aggiungi i controlli al validatore**

In `scripts/build-data.mjs`, dentro il ciclo `for (const ing of r.ingredienti || [])`, dopo il controllo sulla quantità:
```js
    const sost = ing.sostituti || [];
    if (sost.length && ing.opzionale) err(`${where}: "${ing.id}" è opzionale, non ha senso dargli sostituti`);
    const vistiSost = new Set();
    for (const s of sost) {
      const ts = byId.get(s.id);
      if (!ts) err(`${where}: sostituto sconosciuto "${s.id}" per "${ing.id}"`);
      else if (ts.base) err(`${where}: "${s.id}" è nella dispensa base, non può essere un sostituto`);
      if (s.id === ing.id) err(`${where}: "${ing.id}" sostituto di sé stesso`);
      if (vistiSost.has(s.id)) err(`${where}: sostituto "${s.id}" ripetuto per "${ing.id}"`);
      vistiSost.add(s.id);
    }
```

- [ ] **Step 3: Verifica che il validatore rifiuti i casi sbagliati**

Aggiungi temporaneamente alla carbonara (`data/ricette/primi.json`, ingrediente `guanciale`) `"sostituti": [{ "id": "guanciale" }, { "id": "unicorno" }, { "id": "sale" }]`.

Run: `npm run validate`
Expected: 3 errori: sostituto di sé stesso, sconosciuto "unicorno", "sale" è nella dispensa base.

- [ ] **Step 4: Sostituti veri sulla carbonara**

Sull'ingrediente `guanciale` della carbonara:
```json
"sostituti": [
  { "id": "pancetta" },
  { "id": "speck", "nota": "affumicato: il piatto cambia carattere, ma regge" }
]
```
Solo il guanciale: `porchetta` arriva in tassonomia nel piano contenuti, e il pecorino non ha sostituti ammessi (parmigiano è `base`, il validatore lo rifiuta).

Run: `npm run build:data && npm test`
Expected: `✓ 61 ricette valide → data/recipes.json`, 21 test PASS.

- [ ] **Step 5: Commit**

```bash
git add schema/recipe.schema.json scripts/build-data.mjs data/ricette/primi.json data/recipes.json
git commit -m "Schema: sostituti per ingrediente, validati contro la tassonomia"
```

---

### Task 3: Matcher con sostituzioni

**Files:**
- Modify: `js/match.js:80-118` (`abbina`)
- Test: `scripts/match.test.mjs`

**Interfaces:**
- Consumes: `ingredienti[].sostituti` (Task 2).
- Produces: ogni elemento di `abbina()` è `{ ricetta, mancanti: string[], copertura: number, sostituzioni: { richiesto: string, usato: string, nota: string|null }[] }`; ordinamento: mancanti asc → copertura desc → sostituzioni asc → tempo asc → titolo.

- [ ] **Step 1: Scrivi i test**

In `scripts/match.test.mjs`, dopo la fixture `ricette`, aggiungi alla tassonomia in testa al file la voce `{ id: 'pancetta', nome: 'Pancetta', alias: ['bacon'], categoria: 'salume' }` e una ricetta:
```js
const ricetteSost = [
  ...ricette,
  R('gricia', ['pecorino', { id: 'salsiccia', sostituti: [{ id: 'pancetta', nota: 'meno grassa: aggiungi un filo d\'olio' }] }], { tempi: { preparazione: 5, cottura: 15, riposo: 0 } }),
];
```
poi i test:
```js
test('abbina: un sostituto posseduto copre l\'ingrediente e viene riportato', () => {
  const out = abbina({ ricette: ricetteSost, indice, ingredienti: ['pecorino', 'bacon'] });
  const r = out.find((x) => x.ricetta.slug === 'gricia');
  assert.deepEqual(r.mancanti, []);
  assert.equal(r.copertura, 1);
  assert.deepEqual(r.sostituzioni, [{ richiesto: 'salsiccia', usato: 'pancetta', nota: 'meno grassa: aggiungi un filo d\'olio' }]);
});

test('abbina: se hai l\'originale, nessuna sostituzione anche se hai il sostituto', () => {
  const out = abbina({ ricette: ricetteSost, indice, ingredienti: ['pecorino', 'salsiccia', 'pancetta'] });
  const r = out.find((x) => x.ricetta.slug === 'gricia');
  assert.deepEqual(r.sostituzioni, []);
});

test('abbina: senza sostituti la proprietà è un array vuoto', () => {
  const out = abbina({ ricette: ricetteSost, indice, ingredienti: ['pecorino', 'salsiccia'] });
  assert.deepEqual(out.find((x) => x.ricetta.slug === 'carbonara').sostituzioni, []);
});

// a-senza è lenta (60′) ma senza sostituzioni; b-con è veloce ma usa un sostituto: vince a-senza
test('abbina: a parità di mancanti e copertura, prima la ricetta senza sostituzioni', () => {
  const due = [
    R('a-senza', ['pecorino'], { tempi: { preparazione: 30, cottura: 30, riposo: 0 } }),
    R('b-con', [{ id: 'salsiccia', sostituti: [{ id: 'pancetta' }] }], { tempi: { preparazione: 1, cottura: 1, riposo: 0 } }),
  ];
  const out = abbina({ ricette: due, indice, ingredienti: ['pecorino', 'bacon'] });
  assert.deepEqual(out.map((x) => x.ricetta.slug), ['a-senza', 'b-con']);
});
```

- [ ] **Step 2: Lancia i test, devono fallire**

Run: `npm test`
Expected: i 4 test nuovi FAIL (`sostituzioni` undefined; gricia ha `mancanti: ['salsiccia']`).

- [ ] **Step 3: Implementa**

Sostituisci il corpo del ciclo sulle ricette e l'ordinamento in `abbina` (`js/match.js`):
```js
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
```
Aggiorna il commento JSDoc: `@returns array di { ricetta, mancanti: id[], copertura: 0..1, sostituzioni: {richiesto, usato, nota}[] } …`.

- [ ] **Step 4: Verifica**

Run: `npm test`
Expected: 25 test PASS.

- [ ] **Step 5: Commit**

```bash
git add js/match.js scripts/match.test.mjs
git commit -m "Matcher: un sostituto posseduto copre l'ingrediente, con avviso"
```

---

### Task 4: Risultati — "con X al posto di Y"

**Files:**
- Modify: `js/risultati.js:63,131-161`
- Modify: `css/risultati.css:80-82`

**Interfaces:**
- Consumes: `sostituzioni` da `abbina()` (Task 3).

- [ ] **Step 1: Propaga e mostra le sostituzioni**

`js/risultati.js` riga 63 (ramo senza dispensa):
```js
    lista = dati.ricette.map((ricetta) => ({ ricetta, mancanti: [], copertura: null, sostituzioni: [] }));
```
Funzione `riga`: firma `function riga({ ricetta: r, mancanti, copertura, sostituzioni }, k, ingredienti)`; prima di `li.innerHTML` aggiungi:
```js
  const nome = (id) => dati.indice.byId.get(id).nome.toLowerCase();
  const sost = sostituzioni.map((s) => `<b>${nome(s.usato)}</b> al posto di ${nome(s.richiesto)}`).join(', ');
```
e nel template, dentro `.riga-cop`, nel ramo `copertura !== null`, prima di `<div class="manca">`:
```js
             ${sost ? `<div class="sost">con ${sost}</div>` : ''}
```

- [ ] **Step 2: Stile**

`css/risultati.css`, dopo `.riga-cop .manca b { … }`:
```css
.riga-cop .sost { font-size: var(--t-sm); color: var(--ink); margin-top: 4px; }
.riga-cop .sost b { font-weight: 600; }
```

- [ ] **Step 3: Verifica nel browser**

Run: `npm run serve` e apri `http://localhost:8080/#/risultati?i=spaghetti,uova,pecorino,pancetta`.
Expected: la carbonara compare in "Puoi farle adesso" con la riga "con **pancetta** al posto del guanciale" e sotto "hai tutto". Con `i=spaghetti,uova,pecorino` (senza pancetta) compare invece in "Manca un ingrediente" con "manca: guanciale" e nessuna riga "con".

- [ ] **Step 4: Commit**

```bash
git add js/risultati.js css/risultati.css
git commit -m "Risultati: mostra le sostituzioni usate per la ricetta"
```

---

### Task 5: Libro — riquadro Modifica e ingredienti sostituiti

**Files:**
- Modify: `js/libro.js:16,24-33,199-248`
- Modify: `css/libro.css:90-111`

**Interfaces:**
- Consumes: `ingredienti[].sostituti` (Task 2), `posseduti` (già in `montaLibro`).

- [ ] **Step 1: Calcola le sostituzioni attive**

`js/libro.js` riga 16: `let dati, ricetta, posseduti, sostituzioni;`
In `montaLibro`, dopo il ciclo che riempie `posseduti`:
```js
  sostituzioni = new Map();
  for (const i of r.ingredienti) {
    if (i.opzionale || posseduti.has(i.id)) continue;
    const s = (i.sostituti || []).find((x) => posseduti.has(x.id));
    if (s) sostituzioni.set(i.id, s);
  }
```

- [ ] **Step 2: Riquadro Modifica e lista della spesa**

In `bloccoIngredienti`:
- `const mancanti = ricetta.ingredienti.filter((i) => !i.opzionale && !posseduti.has(i.id) && !sostituzioni.has(i.id));`
- prima di `const nome = …` non serve: usa `dati.indice.byId.get(id).nome`. Nel template, tra `</div>` di `.blocco-testa` e `<ul class="ingredienti">`:
```js
    ${sostituzioni.size ? `<div class="modifica"><span class="label">Modifica</span><ul>${[...sostituzioni].map(([id, s]) => `<li><b>${dati.indice.byId.get(s.id).nome}</b> al posto di ${dati.indice.byId.get(id).nome.toLowerCase()}${s.nota ? ` — ${s.nota}` : ''}</li>`).join('')}</ul></div>` : ''}
```

- [ ] **Step 3: Ingrediente sostituito nella lista**

In `renderIngredienti`, sostituisci le righe `const cls = …` e il `return`:
```js
    const s = sostituzioni.get(i.id);
    const cls = [i.opzionale ? 'opz' : '', s ? 'sost' : '', !i.opzionale && !s && !posseduti.has(i.id) ? 'manca' : ''].filter(Boolean).join(' ');
    const pt = (i.pt || t.pt) && (i.pt || t.pt).sostituto ? `<span class="pt">a Bragança: ${(i.pt || t.pt).sostituto}</span>` : '';
    const nomeHtml = s ? `<b>${dati.indice.byId.get(s.id).nome}</b> <s>${t.nome}</s>` : t.nome;
    return `<li class="${cls}"><span class="q${qb ? ' qb' : ''}">${qta}</span><span class="n">${nomeHtml}${i.opzionale ? ' <small>facoltativo</small>' : ''}${i.note ? `<small>${i.note}</small>` : ''}${pt}</span></li>`;
```

- [ ] **Step 4: Stile**

`css/libro.css`, dopo `.ingredienti .pt { … }`:
```css
.ingredienti li.sost .n s { color: var(--ink-2); text-decoration-thickness: 1px; }
.modifica { border: var(--rule-ink); padding: 10px 12px; margin-bottom: 16px; }
.modifica .label { display: block; margin-bottom: 4px; }
.modifica ul { margin: 0; padding: 0; list-style: none; }
.modifica li { font-size: var(--t-sm); line-height: 1.4; }
.modifica li + li { margin-top: 4px; }
```
Se `.label` non è definito globalmente in `base.css` (controlla con `grep -n "^\.label" css/base.css`), aggiungi a `.modifica .label` le stesse proprietà usate da `.blocco-testa .label`.

- [ ] **Step 5: Verifica nel browser**

Apri `http://localhost:8080/#/ricetta/spaghetti-alla-carbonara?i=spaghetti,uova,pecorino,pancetta` (desktop e con la finestra sotto 900px).
Expected: sopra la lista ingredienti il riquadro "MODIFICA — **Pancetta** al posto del guanciale"; nella lista, "**Pancetta** ~~Guanciale~~" senza badge "manca"; il bottone "Copia la lista della spesa" non compare (nessun mancante). Con `?i=spaghetti,uova,pecorino,speck` la nota "affumicato: …" compare nel riquadro.

- [ ] **Step 6: Commit**

```bash
git add js/libro.js css/libro.css
git commit -m "Libro: riquadro Modifica e ingrediente sostituito nella lista"
```

---

### Task 6: Sostituti nelle 61 ricette esistenti e testi sulle esclusioni

**Files:**
- Modify: `data/ricette/primi.json`, `secondi.json`, `piatti-unici.json`, `contorni.json`, `dolci.json`
- Regenerate: `data/recipes.json`, `prompts.md`

**Interfaces:**
- Consumes: forma `sostituti` (Task 2), validatore (Task 2).

- [ ] **Step 1: Aggiungi i sostituti ovvi**

Regola: un sostituto solo se il piatto regge davvero con quello; `nota` solo se cambia qualcosa nel procedimento o nel risultato. I sostituti devono essere id esistenti in `data/ingredienti.json` e non `base` (controlla con `node -e "console.log(require('./data/ingredienti.json').filter(i=>!i.base).map(i=>i.id).join(' '))"`). Tabella di riferimento (applicala dove l'ingrediente è presente e non opzionale):

| Ingrediente | Sostituti | Nota tipica |
|---|---|---|
| `spaghetti` | `bucatini`, `pasta-corta` | pasta corta: "il condimento si lega meno, scola un po' più al dente" |
| `rigatoni`, `pasta-corta`, `orecchiette`, `bucatini` | gli altri formati fra `rigatoni`, `pasta-corta`, `spaghetti`, `orecchiette`, `bucatini`, `tagliatelle` che reggono il condimento | — |
| `guanciale` | `pancetta`, `speck` (nota affumicato) | — |
| `pancetta` | `guanciale`, `speck` | — |
| `pecorino` | — (parmigiano è base: non ammesso) | — |
| `provola` | `mozzarella`, `formaggio-fuso` | mozzarella: "scolala bene, rilascia acqua" |
| `mozzarella` | `provola`, `formaggio-fuso` | — |
| `stracchino` | `stracciatella`, `ricotta` | — |
| `fettine-di-vitello` | `fettine-di-tacchino`, `petto-di-pollo` | pollo: "battilo sottile, cuoce in un minuto in più" |
| `fettine-di-tacchino` | `fettine-di-vitello`, `petto-di-pollo` | — |
| `salsiccia` | `macinato-misto` | "condiscilo con sale, pepe e un pizzico di finocchietto o paprika" |
| `macinato-misto` | `salsiccia` | "sbriciolata, senza altro sale" |
| `riso-carnaroli` | — (l'alias arborio è già nello stesso id) | — |
| `passata` | `pelati` | "schiacciali con la forchetta" |
| `pelati` | `passata` | — |
| `funghi-champignon` | `porcini-secchi` | "20 g ammollati, con la loro acqua filtrata" |
| `cavolo-nero` | `verza`, `cime-di-rapa` | — |
| `verza` | `cavolo-nero` | — |
| `zucca` | `patate` (solo nelle vellutate/minestre) | "meno dolce: un pizzico di zucchero" |
| `pane-raffermo` | `pangrattato` (solo per polpette) | "ne basta la metà" |
| `latte` | `panna-fresca` (solo in salse) | "più ricca: dimezza il burro" |
| `chourico` | `salsiccia` | "manca la paprika: aggiungine un cucchiaino" |
| `prosciutto-crudo` | `speck` | — |
| `prosciutto-cotto` | `mortadella` | — |

Senza sostituti (non ce n'è uno che regga): `pecorino` (parmigiano è base), `vino-bianco` (brodo è base), `yogurt-greco`, `mascarpone`, `uova`, `riso-carnaroli`. Procedi file per file. Non toccare gli ingredienti opzionali.

- [ ] **Step 2: Riscrivi i testi che parlano delle esclusioni**

Run: `grep -n "senza pomodoro\|niente pomodoro\|non mangi\|vietat\|non ammess\|reinventat" data/ricette/*.json | grep -v '"reinventata": null'`
Per ogni risultato: riscrivi la frase come scelta di gusto o di stagione, non come esclusione (es. pizza bianca: "la versione bianca, da abbinare alla margherita quando arriverà"). Se `reinventata` ha un testo che parla di esclusioni, portalo a `null`.

- [ ] **Step 3: Verifica**

Run: `npm run build:data && npm test && npm run prompts && node -e "const r=require('./data/recipes.json');const n=r.reduce((a,x)=>a+x.ingredienti.filter(i=>i.sostituti).length,0);console.log('ingredienti con sostituti:',n)"`
Expected: `✓ 61 ricette valide`, test PASS, `prompts.md` 61 prompt, contatore ≥ 60.

- [ ] **Step 4: Commit**

```bash
git add data/ricette data/recipes.json prompts.md
git commit -m "Ricette: sostituti curati sulle 61 esistenti, via i riferimenti alle esclusioni"
```

---

### Task 7: Dizionario stringhe UI (`js/i18n.js`)

**Files:**
- Create: `js/i18n.js`
- Modify: `js/data.js:22-32` (ETICHETTE), `js/app.js`, `js/dispensa.js`, `js/risultati.js`, `js/libro.js`
- Modify: `index.html` (testo statico)

**Interfaces:**
- Produces: `export const LINGUA = 'it'`; `export const STRINGHE`; `export function t(chiave, vars)`; `export function applicaTesti(root)`. `data.js` continua a esportare `ETICHETTE` (stesso oggetto di `STRINGHE.it.etichette`), quindi nessun import esistente cambia.

- [ ] **Step 1: Crea `js/i18n.js`**

```js
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
      anche: 'anche: {alias}',
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
      filtro: { portata: 'Portata', difficolta: 'Difficoltà', tempo: 'Tempo', costo: 'Costo', dieta: 'Dieta', tag: 'Tag', attrezzatura: 'Solo con la mia attrezzatura', ordina: 'Ordina', inverti: 'Inverti ordine' },
      opzioni: {
        tutte: 'Tutte', tutti: 'Tutti', qualsiasi: 'Qualsiasi',
        entro30: 'entro 30′', entro45: 'entro 45′', entro60: 'entro 60′', entro90: 'entro 90′', costoBasso: 'Basso (≤ 3 €)', costoMedio: 'Medio (3–6 €)', costoAlto: 'Alto (6–10 €)',
        perCopertura: 'Per copertura', perTempo: 'Per tempo', perCosto: 'Per costo', perDifficolta: 'Per difficoltà', az: 'A–Z',
      },
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

/** Riempie il testo statico marcato con data-i18n="chiave" e data-i18n-attr="attributo:chiave". */
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
```

- [ ] **Step 2: `ETICHETTE` da `i18n.js`**

In `js/data.js` sostituisci l'intero `export const ETICHETTE = { … }` con:
```js
import { STRINGHE, LINGUA } from './i18n.js';
export const ETICHETTE = STRINGHE[LINGUA].etichette;
```
(l'import va in testa al file, accanto a quello di `creaIndice`). In `js/libro.js` sostituisci la costante `SINGOLARE` con `ETICHETTE.unitaSingolare` nella funzione `unita`.

Run: `npm test && npm run serve` e apri la home.
Expected: test PASS; la pagina si carica identica a prima.

- [ ] **Step 3: Testo statico di `index.html`**

Marca ogni testo visibile con `data-i18n` (il testo italiano resta nel markup come fallback). Elenco completo:
- `<title>` → nessun attributo (lo imposta `app.js` con `document.title = t('titolo')` al boot).
- `.wordmark` → `data-i18n-attr="aria-label:topbar.wordmark"`; `.topbar-nav` → `data-i18n-attr="aria-label:topbar.sezioni"`; i due link → `data-i18n="topbar.dispensa"` / `"topbar.ricette"`; `#topbar-meta` → `data-i18n="topbar.meta"`.
- Hero `h1.display` → `data-i18n="dispensa.hero"`; `p.lede` → `"dispensa.lede"`; `label[for=ingrediente]` → `"dispensa.labelIngrediente"`; `#ingrediente` → `data-i18n-attr="placeholder:dispensa.placeholder"`; `.ingresso-add` → `data-i18n-attr="aria-label:dispensa.aggiungi"`; `#chips` → `data-i18n-attr="aria-label:dispensa.scelti"`; `#azione-count` → `"dispensa.nessuno"`; `#btn-cucina` → il testo "Cosa cucino " va in uno `<span data-i18n="dispensa.cucina">Cosa cucino</span>` prima della freccia.
- Risultati: `#risultati-titolo` → `"risultati.titoloDefault"`; `#filtri-toggle` → nessun attributo (lo gestisce `risultati.js`); ogni `.filtro .label` → `risultati.filtro.*`; ogni `<option>` → `risultati.opzioni.*` (le quattro opzioni tempo usano `entro30`, `entro45`, `entro60`, `entro90`: `applicaTesti` non interpola); `.filtro-check span` → `"risultati.filtro.attrezzatura"`; `#ordina-dir` → `data-i18n-attr="title:risultati.filtro.inverti;aria-label:risultati.filtro.inverti"`.
- Libro: `.libro-nav` → `aria-label:libro.pagine`; `#libro-prev`/`#libro-next` → `aria-label:libro.precedente` / `libro.successiva`.
- Errore: `h1` → `"errore.titolo"`; `a` → `"errore.torna"`.
- Footer: `<span>` → `"footer.by"`.

In `js/app.js`, in testa a `route()` (prima di `caricaDati`), una sola volta:
```js
import { t, applicaTesti } from './i18n.js';
let testiApplicati = false;
…
  if (!testiApplicati) { applicaTesti(); document.title = t('titolo'); testiApplicati = true; }
```
e il messaggio d'errore del `catch` diventa `` `<p style="padding:32px">${t('errore.caricamento', { msg: e.message })}</p>` ``. In `libro.js` `smontaLibro`: `el.meta.textContent = t('topbar.meta'); document.title = t('titolo');` e in `montaLibro`: `document.title = `${r.titolo} · Cucinança``, lascialo.

- [ ] **Step 4: Stringhe nei moduli JS**

Sostituisci ogni letterale italiano con `t(...)`, importando `t` da `./i18n.js` in ciascun file:
- `dispensa.js`: `el.basi.textContent = t('dispensa.basi', { elenco: base.join(', ') })`; `t('dispensa.anche', { alias })`; `t('dispensa.sconosciuto', { t: t0 })` (rinomina la variabile locale `t` in `t0` in `aggiungiTesto`); `t('dispensa.giaBase', { nome: ing.nome })`; `t('dispensa.togli', { nome: … })`; `n === 0 ? t('dispensa.nessuno') : n === 1 ? t('dispensa.uno') : t('dispensa.molti', { n })`.
- `risultati.js`: `t('risultati.filtriN', { n: attivi })` / `t('risultati.filtri')`; titolo: `t('risultati.con', { elenco: elenco(nomi) })`, `t('risultati.nessunRiconosciuto')`, `t('risultati.tutte')`; sotto: `t('risultati.sottoDispensa', { n, c, link })` / `t('risultati.sottoTutte', { n })`; avviso: `t(nonRisolti.length > 1 ? 'risultati.nonRiconosciuti' : 'risultati.nonRiconosciuto', { elenco })`; vuoto: `t('risultati.vuotoDispensa', { n: MAX_MANCANTI, link })` / `t('risultati.vuotoFiltri')`; sezioni: `t('risultati.sezioneAdesso')`, `t('risultati.sezioneUno')`, `t('risultati.sezioneN', { n })`; riga: `t('risultati.serve', { attrezzo })`, `t('risultati.ingr')`, `t('risultati.manca', { elenco })`, `t('risultati.haiTutto')`, `t('risultati.conSostituto', { elenco: sostituzioni.map((s) => t('risultati.alPostoDi', { usato: nome(s.usato), richiesto: nome(s.richiesto) })).join(', ') })`, `t('risultati.riposo')`, `t('risultati.badgePt')`; `elenco()`: `t('risultati.e')`.
- `libro.js`: etichette della cover (`libro.difficolta` …, `libro.aPersona`, `libro.serve`), `libro.ingredienti`, `libro.porzioni`, `libro.copia` (con `{ n }`), `libro.copiata`, `libro.copiaErrore`, `libro.facoltativo`, `libro.aBraganca` (con `{ testo }`), `libro.modifica`, `libro.alPostoDi` (con `{ usato, richiesto }`), `libro.consiglio`, `libro.conservazione`, `libro.varianti`, `libro.fonte`.

Run: `grep -nE "'[A-ZÀ-Ü][a-zà-ü]+ [a-z]" js/dispensa.js js/risultati.js js/libro.js js/app.js | grep -v "t('"`
Expected: nessun letterale italiano residuo con spazi (i risultati che restano vanno valutati uno a uno: sono ammessi solo i nomi delle classi CSS e gli `id`).

- [ ] **Step 5: Verifica nel browser**

Run: `npm test && npm run validate`; apri home, risultati con e senza dispensa, un libro (desktop e < 900px), la pagina errore (`#/xyz`).
Expected: testi identici a prima in ogni schermata; console senza errori.

- [ ] **Step 6: Commit**

```bash
git add js/i18n.js js/data.js js/app.js js/dispensa.js js/risultati.js js/libro.js index.html
git commit -m "i18n: tutte le stringhe dell'interfaccia in un dizionario, UI resta in italiano"
```

---

### Task 8: Documentazione

**Files:**
- Modify: `README.md:26,43`, `SPEC.md:71,135-158,177`, `PRODUCT.md:19,29,33`, `HANDOFF.md`

- [ ] **Step 1: README**

Riga 26: via "niente ingredienti vietati (…)"; aggiungi: "un ingrediente può avere `sostituti` (id esistenti, non base, non duplicati)". Riga 43: `data/ingredienti.json tassonomia: alias, dispensa base, reperibilità a Bragança`. Aggiungi `npm run prompts` alla lista dei comandi.

- [ ] **Step 2: SPEC**

Riga 71: sostituisci con "Un ingrediente posseduto che è sostituto curato di un ingrediente richiesto copre quell'ingrediente; la ricetta mostra l'avviso 'con X al posto di Y'." Righe 135-158: via i riferimenti a `vietato` (esempi di tassonomia e regola 2); aggiungi la forma di `sostituti` (copia il JSON dalla spec di design §2). Riga 177: "Test unitari coprono: alias → id, base ignorato, opzionale ignorato, sostituzioni, ordinamento, soglia."

- [ ] **Step 3: PRODUCT**

Riga 13 (Users): aggiungi "e, in prospettiva, gli altri erasmus di Bragança: il sito è pensato per essere condiviso." Riga 19 (Positioning): sostituisci "already excludes what he doesn't eat (peas, green beans, artichokes, raw tomato, broccoli, cauliflower), avoids spicy and offal" con "no offal; chilli is used where the dish calls for it and always dosable". Riga 29: "forbidden inputs rejected" → "curated per-recipe substitutes count as coverage (with a notice)". Riga 33: aggiungi "UI strings centralised in `js/i18n.js` (Italian only for now)".

- [ ] **Step 4: Commit**

```bash
git add README.md SPEC.md PRODUCT.md
git commit -m "Docs: sito condiviso, sostituzioni, i18n"
```

---

## Self-review

- Spec §1 (sblocco): Task 1 copre dati, validatore, matcher, dispensa, libro, css, test, `generate_image.py`, `prompts.md`; i testi delle ricette esistenti in Task 6 Step 2; docs in Task 8.
- Spec §2 (sostituzioni): schema/validatore Task 2, matcher Task 3, UI risultati Task 4, UI libro Task 5, dati esistenti Task 6, test Task 3 (il test del validatore è manuale in Task 2 Step 3, come previsto dalla spec).
- Spec §3 (i18n): Task 7, inclusi `data-i18n`, `lang`, `ETICHETTE` sotto la stessa lingua.
- Spec §5 (foto): via `ESCLUSIONI` e rigenerazione `prompts.md` in Task 1; la generazione delle immagini nuove è nel piano contenuti.
- Spec §6 (docs): Task 8; `RICETTE-LISTA.md` e `HANDOFF.md` nel piano contenuti.
- Nomi coerenti: `sostituti` (dati), `sostituzioni` (risultato del matcher e Map nel libro), `{ richiesto, usato, nota }`, `t()`, `applicaTesti()`, `STRINGHE`, `LINGUA`, `ETICHETTE.unitaSingolare`.
