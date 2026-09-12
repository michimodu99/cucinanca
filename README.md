# Cucinança

Ricettario condiviso per erasmus a Bragança: scrivi cosa hai in dispensa, sfoglia le ricette che puoi cucinare stasera (anche con un sostituto al posto di quello che manca), leggile dal telefono come un libro. Dosi per 1 persona, prezzi di Bragança.

Sito statico (HTML/CSS/JS, nessun build) su GitHub Pages. Specifica in `SPEC.md`, prodotto in `PRODUCT.md`, sistema di design in `DESIGN.md`.

## Uso in locale

```
npm install          # solo per gli script (ajv, sharp)
npm run serve        # http://localhost:8080
npm test             # test del matching (js/match.js)
npm run validate     # controlla le ricette senza riscrivere recipes.json
npm run prompts      # rigenera prompts.md dai foto.prompt di recipes.json
npm run video:optimize -- --file nome.mp4   # video/raw/nome.mp4 → video/hero-nome.mp4 (+ poster con --poster)
```

Il sito legge `data/recipes.json`: aprire `index.html` dal disco non funziona (i moduli e i JSON vanno serviti via HTTP).

## Aggiungere o cambiare una ricetta

1. Scrivi la scheda nel file di categoria in `data/ricette/` (`primi.json`, `secondi.json`, `piatti-unici.json`, `contorni.json`, `dolci.json`). Schema in `schema/recipe.schema.json`, esempio in `SPEC.md` §5. Dosi **per 1 persona**.
2. Se serve un ingrediente nuovo, aggiungilo a `data/ingredienti.json` (id, nome, alias, categoria, eventuale nota `pt` per Bragança).
3. `npm run build:data` → valida tutto e rigenera `data/recipes.json`. Gli errori dicono file e ricetta.
4. Foto: `python scripts/generate_image.py --slug nuova-ricetta` (chiave `GEMINI_API_KEY` in `.env`) poi `npm run images:optimize`.
5. `git add -A && git commit -m "…" && git push` → online in un minuto.

Regole imposte dal validatore: `q.b.` senza quantità; tag `veloce` se ≤ 30′, `weekend` se > 45′; foto in `img/<slug>.webp`; 1 o 2 ingredienti `principale: true` per ricetta (mai della dispensa base, mai facoltativi); un ingrediente può avere `sostituti` (id esistenti in tassonomia, non della dispensa base, non duplicati, mai su ingredienti facoltativi). Regola editoriale, non di codice: niente frattaglie; peperoncino sempre dosabile.

Un sostituto è una scelta culinaria per quella ricetta (porchetta al posto del guanciale nella carbonara), non una regola generale: se hai il sostituto, la ricetta compare con l'avviso "con X al posto di Y" e il libro mostra un riquadro *Modifica* con la nota.

L'ingrediente `principale` è quello senza cui il piatto sarebbe un altro piatto (il baccalà del bacalhau, guanciale e uova della carbonara): se manca e non hai un suo sostituto, la ricetta non viene proposta, anche se mancherebbe solo quello. Il supporto (pasta, riso, farina) non è principale, salvo quando il piatto *è* il supporto (cacio e pepe, risotto alla milanese).

## Foto

- `scripts/generate_image.py`: Gemini `gemini-3.1-flash-image` (Nano Banana 2; richiede fatturazione attiva su AI Studio, i modelli immagine non sono nel free tier). `pip install -r scripts/requirements.txt`. Uso: `"Nome piatto" [--style ...]`, `--slug a,b` o `--all` dai `foto.prompt` di `recipes.json`, `--dry`, `--force`. Prompt = stile editoriale/Swiss + piatto + formato 4:5. Salva in `img/raw/` con un `.json` di provenienza (prompt, modello, data).
- `scripts/gen-images.mjs` (alternativa, non usata): FLUX Schnell su Replicate (≈ 0,003 $/foto), prompt = template comune + `foto.prompt` della ricetta, 4:5. `--model dev` per la qualità alta (≈ 0,025 $). Salva in `img/raw/` con un `.json` di provenienza (prompt, modello, data).
- `scripts/optimize-images.mjs`: ritaglio 4:5 a 960×1200, WebP sotto 150 KB, prompt scritto nei metadati EXIF.
- Finché la foto non esiste, il sito mostra un segnaposto tipografico.

## Video di sfondo (dispensa)

La fascia scura in testa alla dispensa manda in sequenza le clip elencate in `CLIP` (`js/dispensa.js`), mute, con `img/hero-poster.webp` come fotogramma fisso (primo paint, `prefers-reduced-motion`, o se le clip mancano). Due `<video>` alternati: mentre uno suona l'altro ha già caricato la clip successiva, così il cambio è senza frame nero. Per aggiungere o cambiare una clip:

1. Scarica una clip di cucina gratuita (Pexels Videos, Pixabay, Coverr, Mixkit — anche per uso commerciale, senza attribuzione): 10–20 s senza stacchi di camera, soggetto al centro (il pannello è quasi quadrato su desktop e verticale su mobile: `object-fit: cover` taglia i bordi), toni scuri o caldi perché il testo sopra è bianco, niente scritte, meglio senza volti. 1080p basta.
2. Mettila in `video/raw/` (ignorata da git).
3. `npm run video:optimize -- --file nome.mp4` (opzioni `--start`, `--durata` default 15, `--crf` default 28, `--poster` per rigenerare il poster da questa clip) → `video/hero-nome.mp4`: H.264 con il lato corto a 720 px, 24 fps, senza audio, ≤ 4 MB, `+faststart`. Usa `ffmpeg-static` da `node_modules`, niente da installare.
4. Aggiungi `'video/hero-nome.mp4'` a `CLIP` in `js/dispensa.js` (l'ordine è l'ordine di riproduzione; con una sola clip va in loop).
5. Commit e push di `video/hero-*.mp4` e, se rigenerato, `img/hero-poster.webp`.

In repo oggi: `chop` (taglio di un ortaggio, 13″) → `frigo` (apertura di un frigo, 2″: da sola scatterebbe ogni 2 secondi, in sequenza è un cambio di scena).

## Struttura

```
index.html            tre viste: dispensa, risultati, libro (router hash in js/app.js)
css/                  tokens (palette, tipografia) · base · dispensa · risultati · libro
js/match.js           logica pura: alias → id, copertura, mancanti, scala porzioni (testata)
js/libro.js           doppia pagina desktop con impaginazione automatica; pagine a swipe su mobile; Wake Lock
js/i18n.js            tutte le stringhe dell'interfaccia (solo `it` per ora): t(), applicaTesti(), etichette di dominio
video/                hero-<nome>.mp4 (clip della fascia in testa alla dispensa); raw/ le sorgenti, ignorate da git
data/ricette/*.json   sorgente delle ricette per categoria → data/recipes.json (generato)
data/ingredienti.json tassonomia: alias, dispensa base, reperibilità a Bragança
scripts/              build-data (validazione), match.test, generate_image (+test), gen-images, optimize-images, optimize-video, prompts-md, serve
fonts/                Archivo variabile (self-hosted)
reference/            le immagini di riferimento per il design
```
