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
npm run video:optimize -- --file a.mp4,b.mp4   # monta le clip di video/raw/ in video/hero.mp4 (+ poster con --poster)
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

La fascia scura in testa alla dispensa manda in loop `video/hero.mp4`: le clip scelte, mute, già montate in sequenza in un unico file (da telefono una staffetta fra più `<video>` mostrava fotogrammi spuri). `img/hero-poster.webp` è il fotogramma fisso (primo paint, `prefers-reduced-motion`, o se il video manca). Per cambiare le clip:

1. Scarica una clip di cucina gratuita (Pexels Videos, Pixabay, Coverr, Mixkit — anche per uso commerciale, senza attribuzione): 10–20 s senza stacchi di camera, soggetto al centro (il pannello è quasi quadrato su desktop e verticale su mobile: `object-fit: cover` taglia i bordi), toni scuri o caldi perché il testo sopra è bianco, niente scritte, meglio senza volti. 1080p basta.
2. Mettila in `video/raw/` (ignorata da git).
3. `npm run video:optimize -- --file a.mp4,b.mp4,c.mp4 --poster c.mp4` (nell'ordine di riproduzione; `--durata` = secondi massimi per clip, default 15; `--crf` default 28; `--poster` rigenera il poster dall'ultimo secondo della clip indicata) → `video/hero.mp4`: ogni clip ritagliata a 1280×720, 24 fps, tagli netti, senza audio, ≤ 5 MB, `+faststart`. Usa `ffmpeg-static` da `node_modules`, niente da installare.
4. Commit e push di `video/hero.mp4` e, se rigenerato, `img/hero-poster.webp`.

In repo oggi quattro clip Mixkit, tutte 16:9: `frigorifero` (6,6″) → `pancetta` (8,3″) → `omelette` (10″) → `polpette` (13,5″), 38″ in tutto; poster dalle polpette. Le clip verticali non vanno bene: nella fascia 2:1 se ne vede solo una banda, sgranata.

## La dispensa ricordata e «non mangio»

La dispensa resta fra una visita e l'altra: vive in `localStorage` (chiavi `cucinanca:dispensa` e
`cucinanca:esclusi`), quindi **in quel browser di quel dispositivo e basta** — niente account, niente
server. Quattro coinquilini sono quattro dispense, e il telefono non sa nulla del PC: il ponte è il link
con `?i=`, che il bottone "Copia il link" mette negli appunti.

Regole, se qualcosa sembra strano:

- un link con `?i=` vince sulla memoria, ma **non la sovrascrive** finché non tocchi niente: guardi la
  dispensa di un altro, torni alla home e ritrovi la tua;
- "Svuota" salva il vuoto (domani non ripesca la dispensa di oggi);
- in navigazione privata o con i cookie bloccati il sito funziona, semplicemente non ricorda;
- "Non mangio" toglie l'ingrediente dalla dispensa, lo barra nell'indice e nasconde le ricette che lo
  richiedono davvero — se lì è facoltativo, o se un sostituto che hai lo rimpiazza, il piatto resta.
  Il sottotitolo dei risultati dice quante ne ha nascoste.

Tutto il codice che tocca `localStorage` sta in `js/memoria.js`: ha lo store iniettabile, così
`npm test` lo prova senza browser.

## Struttura

```
index.html            quattro viste: dispensa, risultati, scegli tu, libro (router hash in js/app.js)
css/                  tokens (palette, tipografia) · base · dispensa · risultati · libro
js/match.js           logica pura: alias → id, copertura, mancanti, esclusioni, scala porzioni (testata)
js/memoria.js         l'unico punto che tocca localStorage: dispensa ricordata e "non mangio" (testata)
js/scegli.js          «Scegli tu stasera»: pesca una ricetta fra quelle a zero mancanti
js/libro.js           doppia pagina desktop con impaginazione automatica; pagine a swipe su mobile; Wake Lock
js/i18n.js            tutte le stringhe dell'interfaccia (solo `it` per ora): t(), applicaTesti(), etichette di dominio
video/                hero.mp4 (le clip della fascia in testa alla dispensa, montate in un file); raw/ le sorgenti, ignorate da git
data/ricette/*.json   sorgente delle ricette per categoria → data/recipes.json (generato)
data/ingredienti.json tassonomia: alias, dispensa base, reperibilità a Bragança
scripts/              build-data (validazione), match.test, generate_image (+test), gen-images, optimize-images, optimize-video, prompts-md, serve
fonts/                Archivo variabile (self-hosted)
reference/            le immagini di riferimento per il design
```
