# Cucinança

Ricettario personale per Bragança: scrivi cosa hai in dispensa, sfoglia le ricette che puoi cucinare stasera, leggile dal telefono come un libro.

Sito statico (HTML/CSS/JS, nessun build) su GitHub Pages. Specifica in `SPEC.md`, prodotto in `PRODUCT.md`, sistema di design in `DESIGN.md`.

## Uso in locale

```
npm install          # solo per gli script (ajv, sharp)
npm run serve        # http://localhost:8080
npm test             # test del matching (js/match.js)
npm run validate     # controlla le ricette senza riscrivere recipes.json
```

Il sito legge `data/recipes.json`: aprire `index.html` dal disco non funziona (i moduli e i JSON vanno serviti via HTTP).

## Aggiungere o cambiare una ricetta

1. Scrivi la scheda nel file di categoria in `data/ricette/` (`primi.json`, `secondi.json`, `piatti-unici.json`, `contorni.json`, `dolci.json`). Schema in `schema/recipe.schema.json`, esempio in `SPEC.md` §5. Dosi **per 1 persona**.
2. Se serve un ingrediente nuovo, aggiungilo a `data/ingredienti.json` (id, nome, alias, categoria, eventuale nota `pt` per Bragança).
3. `npm run build:data` → valida tutto e rigenera `data/recipes.json`. Gli errori dicono file e ricetta.
4. Foto: `python scripts/generate_image.py --slug nuova-ricetta` (chiave `GEMINI_API_KEY` in `.env`) poi `npm run images:optimize`.
5. `git add -A && git commit -m "…" && git push` → online in un minuto.

Regole imposte dal validatore: niente ingredienti vietati (piselli, fagiolini, carciofi, pomodoro fresco, broccoli, cavolfiore); `q.b.` senza quantità; tag `veloce` se ≤ 30′, `weekend` se > 45′; foto in `img/<slug>.webp`.

## Foto

- `scripts/generate_image.py`: Gemini `gemini-3.1-flash-image` (Nano Banana 2; richiede fatturazione attiva su AI Studio, i modelli immagine non sono nel free tier). `pip install -r scripts/requirements.txt`. Uso: `"Nome piatto" [--style ...]`, `--slug a,b` o `--all` dai `foto.prompt` di `recipes.json`, `--dry`, `--force`. Prompt = stile editoriale/Swiss + piatto + esclusione esplicita di pomodori, piselli, fagiolini, carciofi, broccoli, cavolfiore. Salva in `img/raw/` con un `.json` di provenienza (prompt, modello, data).
- `scripts/gen-images.mjs` (alternativa, non usata): FLUX Schnell su Replicate (≈ 0,003 $/foto), prompt = template comune + `foto.prompt` della ricetta, 4:5. `--model dev` per la qualità alta (≈ 0,025 $). Salva in `img/raw/` con un `.json` di provenienza (prompt, modello, data).
- `scripts/optimize-images.mjs`: ritaglio 4:5 a 960×1200, WebP sotto 150 KB, prompt scritto nei metadati EXIF.
- Finché la foto non esiste, il sito mostra un segnaposto tipografico.

## Struttura

```
index.html            tre viste: dispensa, risultati, libro (router hash in js/app.js)
css/                  tokens (palette, tipografia) · base · dispensa · risultati · libro
js/match.js           logica pura: alias → id, copertura, mancanti, scala porzioni (testata)
js/libro.js           doppia pagina desktop con impaginazione automatica; pagine a swipe su mobile; Wake Lock
data/ricette/*.json   sorgente delle ricette per categoria → data/recipes.json (generato)
data/ingredienti.json tassonomia: alias, dispensa base, vietati, reperibilità a Bragança
scripts/              build-data (validazione), match.test, generate_image (+test), gen-images, optimize-images, serve
fonts/                Archivo variabile (self-hosted)
reference/            le immagini di riferimento per il design
```
