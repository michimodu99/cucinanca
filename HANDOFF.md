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

## Da fare: toggle crescente/decrescente su "Ordina"

Richiesta di Michele, non ancora implementata. Il select `ORDINA` in `index.html` (risultati) ha oggi 5 opzioni:
```
Per copertura (default, nessun value) · Per tempo · Per costo · Per difficoltà · A–Z
```
Logica in `js/risultati.js`, oggetto `ord` (righe ~80-87).

**Analisi fatta in sessione, per chi implementa:**
- "Per copertura" non ha una direzione naturale (è un ordinamento a più chiavi: mancanti asc → copertura desc → tempo asc → titolo — non un singolo valore invertibile). Non ha senso dargli crescente/decrescente.
- Tempo, costo, difficoltà, A–Z hanno tutti una direzione naturale invertibile.
- **Se si raddoppia ogni voce direzionale nel dropdown**: 1 (copertura) + 2 (tempo) + 2 (costo) + 2 (difficoltà) + 2 (A–Z/Z–A) = **9 voci totali**. Rischia di appesantire un dropdown pensato per stare su una riga sola, specialmente su mobile (dove i filtri sono già compressi in "Filtri +").
- **Alternativa consigliata**: tenere il dropdown a 5 voci com'è, e aggiungere un pulsante/icona di direzione (↑/↓) accanto a "Ordina" che inverte l'ordinamento corrente — disabilitato o ignorato quando è selezionato "Per copertura". Più pulito, non serve raddoppiare le opzioni, coerente con lo stile a icone minime già usato altrove (frecce ← → nel libro).
- Se invece si preferisce restare su un dropdown singolo (più semplice da implementare, meno stato da gestire), 9 voci è il numero corretto.

Decisione su quale delle due strade finale: da prendere insieme a Michele a inizio prossima sessione, non ancora scelta.

## Cose aperte non urgenti (dalla ricerca di coverage di questa sessione)

- Buco strutturale sui legumi (solo 2 ricette li usano). Proteine "intrappolate" in una sola ricetta: salmone, orata, baccalà, petto di pollo.
- Vale la pena un giro di ~10-12 nuove ricette mirate su questo, quando si riprende l'espansione del ventaglio ricette (tema di fondo: l'app serve a ridurre gli sprechi, non solo a imparare a cucinare — e a servire anche chi è alle prime armi).
