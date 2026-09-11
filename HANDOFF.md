# HANDOFF — stato al 11/09/2026, fine sessione

Contesto per la prossima sessione. Leggi anche `SPEC.md` (stato/roadmap) e `MEMORY.md` (assistant memory, fuori da questo repo) per il perché delle decisioni.

## Stato attuale

- **61 ricette**, tutte con foto ottimizzata (`img/*.webp`).
- Sito live: **https://michimodu99.github.io/cucinanca/** (repo rinominato da `cucina` a `cucinanca` in questa sessione; il vecchio URL non fa redirect, torna 404).
- Nome progetto: **Cucinança** (cucina + Bragança) ovunque — wordmark, title, meta OG, docs.
- Hero dispensa: "Cosa c'è in frigo?" / "Dimmi cosa ti avanza e ti consiglio una pietanza. Piccola guida culinaria per erasmus avventurieri."
- Footer: "By Michi" + link Instagram `@michelemodu`. **Niente link al repo** (Michele non vuole invitare a curiosare nel codice pubblico).
- `MAX_MANCANTI` (soglia ingredienti mancanti per comparire nei risultati) alzata da 2 a 3 in `js/risultati.js` — quasi raddoppia le ricette raggiungibili da dispensa vuota.
- Termini non riconosciuti in dispensa ora mostrati esplicitamente ("non riconosciuto: xyz") invece di sparire silenziosamente.
- Badge rosso/verde "PT" (stile bandiera portoghese) sulle 6 ricette taggate `portoghese` — unico accento cromatico del sito.
- Pomodoro fresco/pomodorini **non più vietati** in tassonomia (ammessi se cotti in ricetta, non a crudo/guarnizione). Restano vietati: piselli, fagiolini, carciofi, broccoli, cavolfiore.
- Plugin **humanizer** installato (`claude plugin install humanizer@humanizer`, scope user) — rimuove pattern di scrittura da IA (contrasti "non X ma Y", trattini universali, linguaggio gonfiato, ecc.). Si carica automaticamente dalla prossima sessione, invocabile con lo Skill tool.

## Fatto in questa sessione: toggle crescente/decrescente su "Ordina"

Implementata l'alternativa consigliata (pulsante di direzione separato, non 9 voci nel dropdown):
- `index.html`: nel `<label class="filtro filtro-sort">`, il `<select name="sort">` è ora affiancato da un `<input type="hidden" name="dir">` e da `<button id="ordina-dir" class="btn-dir">` (↑/↓), dentro un wrapper `<span class="ordina-riga">`.
- `js/risultati.js`: `CHIAVI_FILTRO` include ora `dir`. Click su `#ordina-dir` inverte `dir` fra `''` e `'desc'` e rinaviga (helper `naviga()`, condiviso col listener `change` del form). Cambiare il `select[name=sort]` resetta `dir` a `''`. Il comparatore in `render()` viene negato quando `f.dir === 'desc'`. Il bottone è `disabled` (e mostra ↑) quando `sort` è vuoto ("Per copertura", che non ha una direzione naturale).
- `css/risultati.css`: stile `.btn-dir` (28px, coerente con `.libro-btn`), `.ordina-riga` per il layout select+bottone.
- Verificato in browser (desktop): toggle funziona, persiste in URL (`&dir=desc`), si disabilita su "Per copertura". Non verificato manualmente il layout mobile (resize del tool non ha funzionato in sessione) — dare un'occhiata al primo giro su telefono/DevTools.

## Chiuso: "problema del footer" nelle acquisizioni complete

Michele aveva segnalato due screenshot a pagina intera in cui la barra fissa "COSA CUCINO" appariva in due posizioni diverse (a metà lista in uno, in fondo nell'altro). Riprodotto dal vivo in sessione (scroll reale, non screenshot): non è un bug di rendering, sono semplicemente due posizioni di scroll diverse. La barra è `position: fixed; bottom: 0`, quindi resta sempre incollata al fondo della finestra e copre qualunque riga di ingredienti si trovi lì in quel momento — comportamento normale per una barra CTA fissa (stesso pattern del carrello in un e-commerce). Il vero `<footer>` ("By Michi") a fine pagina è invece pulito: misurato dal vivo, il testo si ferma a 0,4px dalla barra, il fix della sessione precedente (`padding-bottom` calcolato su `.footer`) funziona correttamente. Michele ha confermato di voler lasciare il comportamento com'è, nessuna modifica.

## Cose aperte non urgenti (dalla ricerca di coverage di questa sessione)

- Buco strutturale sui legumi (solo 2 ricette li usano). Proteine "intrappolate" in una sola ricetta: salmone, orata, baccalà, petto di pollo.
- Vale la pena un giro di ~10-12 nuove ricette mirate su questo, quando si riprende l'espansione del ventaglio ricette (tema di fondo: l'app serve a ridurre gli sprechi, non solo a imparare a cucinare — e a servire anche chi è alle prime armi).
