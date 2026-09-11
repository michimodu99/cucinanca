# HANDOFF — stato al 11/09/2026, fine sessione (seconda)

Contesto per la prossima sessione. Leggi anche `SPEC.md` (stato/roadmap), `PRODUCT.md`, e la spec di design `docs/superpowers/specs/2026-09-11-cucinanca-100-ricette-design.md` (il perché delle decisioni di questa sessione), con i due piani in `docs/superpowers/plans/`.

## Stato attuale

- **100 ricette** (30 primi, 25 secondi, 23 piatti unici, 12 contorni, 10 dolci; 12 portoghesi). Le prime 61 hanno la foto; **le 39 nuove no** (vedi sotto).
- Sito live: **https://michimodu99.github.io/cucinanca/** (branch `main` = deploy). L'ultimo push di questa sessione è da fare/verificare: guarda `git status` e `git log origin/main..main`.
- **Il sito è condivisibile**: via il concetto di ingrediente "vietato" da dati, validatore, matcher, UI, test e prompt foto. Broccoli, cavolfiore, piselli, fagiolini, carciofi, piccante e pomodoro crudo sono ammessi. Restano fuori le frattaglie, per regola editoriale (nessun codice).
- **Sostituzioni**: `ingredienti[].sostituti` per ricetta, validati (`scripts/build-data.mjs`), usati dal matcher (`abbina()` ritorna `sostituzioni: [{richiesto, usato, nota}]`, ordina a parità prima chi non sostituisce). UI: riga "con X al posto di Y" nei risultati, riquadro *Modifica* + ingrediente barrato nel libro. 157 ingredienti con sostituti su 100 ricette. Esempio di riferimento: `#/ricetta/spaghetti-alla-carbonara?i=spaghetti,uova,pecorino,porchetta`.
- **i18n pronto, UI in italiano**: `js/i18n.js` (`LINGUA`, `STRINGHE.it`, `t()`, `applicaTesti()`); `ETICHETTE` in `data.js` legge da lì; il testo statico di `index.html` ha `data-i18n`. Tradurre l'interfaccia = aggiungere `STRINGHE.en` e cambiare `LINGUA`. I contenuti (ricette) restano un progetto a parte.
- Toggle crescente/decrescente su "Ordina" (bottone ↑/↓, `dir=desc` in URL) fatto a inizio sessione.
- `npm run prompts` rigenera `prompts.md` da `recipes.json` (100 prompt, senza più la frase di esclusione).
- Tassonomia: nuove voci `alheira`, `porchetta`, `panini`, `tahina`, `fagioli-borlotti`; alias `bacon`, `natas`, `grelos`, `riso carolino`, `piri-piri`. Mai usati direttamente: ricotta, gorgonzola, miele (piadina e porchetta compaiono solo come sostituti).
- I file `data/ricette/*.json` sono ora tutti nello stile compatto (una riga per ingrediente/passo).

## Da fare subito: le 39 foto

`python scripts/generate_image.py --all` fallisce con **429 "free tier, limit 0"**: la chiave `GEMINI_API_KEY` in `.env` è su un progetto Google senza fatturazione per i modelli immagine (le 61 foto precedenti erano state fatte con fatturazione attiva). Due strade:
1. Attivare la fatturazione su https://aistudio.google.com (Settings > Plan) o mettere in `.env` una chiave di un progetto con fatturazione, poi `python scripts/generate_image.py --all` (salta le ricette che hanno già png/jpg/webp) e `npm run images:optimize`.
2. Generare a mano da `prompts.md` (sezioni per categoria; le 39 nuove sono quelle senza `img/<slug>.webp`), salvare in `img/raw/<slug>.png`, poi `npm run images:optimize`.

Controllo finale: `node scripts/build-data.mjs 2>&1 | grep -c "avviso: manca"` deve stampare 0. Poi occhio a foto con testo, mani o piatto sbagliato: `--slug <slug> --force`.

## Cose aperte non urgenti

- **Preferenze personali per utente** ("non mangio…") e **dispensa base personalizzabile** (oggi curry, coriandolo, basilico, paprika sono "sempre presenti" perché sono di Michele): stesso problema dei vietati, da fare quando l'app viene davvero condivisa. Idea: preferenze salvate nel browser (localStorage), non nei dati.
- **Persistenza della dispensa** fra visite (oggi si riparte da zero, scelta esplicita di Michele: per gli altri è la prima frizione).
- **Inglese dei contenuti** (100 ricette × procedimento) e selettore lingua.
- Riserva di ricette oltre le 100 in `RICETTE-LISTA.md` (Conteggi v2).
- La barra fissa "Cosa cucino" copre l'ultima riga di ingredienti mentre scorri: è il comportamento normale di una barra fissa, Michele ha deciso di lasciarlo così (verificato dal vivo, non è un bug del footer).
