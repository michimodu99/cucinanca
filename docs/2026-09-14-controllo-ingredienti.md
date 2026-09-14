# Controllo della tassonomia: cosa manca rispetto ai siti di cucina

14 settembre 2026. Michele ha chiesto di verificare se i 159 ingredienti del sito coprono davvero
i principali, confrontando con i siti di cucina più usati, e di proporre ricette per i buchi.

## Metodo, e il suo limite

GialloZafferano e Cucchiaio d'Argento **bloccano la lettura automatica** (402 e 403), quindi i loro
indici per ingrediente non sono stati scaricati. Le fonti effettivamente lette:

- [Food From Portugal](https://www.foodfromportugal.com/pt-pt/receitas/) — le categorie di ricette
  portoghesi, che tengono *Marisco* come categoria a sé.
- [Tavolartegusto](https://www.tavolartegusto.it/ricette/) — la vetrina ingredienti.
- [Un menù settimanale vero](https://blog.giallozafferano.it/cucinandoepasticciando/2026/04/menu-settimanale-dal-20-al-26-aprile-ricette-facili-e-gustose.html)
  di un blog GialloZafferano, aprile 2026: sette primi, sette secondi, sei contorni, sei dolci.
- [Cosa avere sempre in dispensa](https://www.centrocormano.it/cosa-avere-in-dispensa/) — la
  dispensa base italiana.
- Wikipedia, [cucina italiana](https://it.wikipedia.org/wiki/Cucina_italiana) e
  [culinária de Portugal](https://pt.wikipedia.org/wiki/Culin%C3%A1ria_de_Portugal), per il quadro.

## I sette buchi

### 1. Il mare non esiste

**15 ricette su 126** hanno del pesce: baccalà ×3, salmone ×3, tonno ×2, acciughe ×3 (come
condimento), merluzzo ×1, orata ×1. Zero molluschi, zero crostacei, zero pesce azzurro fresco, in
un sito fatto in Portogallo. Food From Portugal ha *Marisco* come categoria a sé (camarão, polvo,
chocos, carapaus); il menù settimanale italiano ha pasta asparagi e vongole e fregula con gamberoni;
Tavolartegusto mette le vongole in vetrina.

Obiezione da tenere presente: Bragança è nell'interno, 200 km dal mare. Ma il surgelato c'è al
Continente e al Lidl, e le sardine in scatola costano un euro. **Questo però va verificato sul
posto**, ed è il rischio principale del lotto proposto sotto.

### 2. Nessuna foglia

26 verdure e nessuna insalata: niente lattuga, niente cetriolo. Quattro ricette con "insalata" nel
titolo (caprese, di riso, di patate, finocchi e arance) e nessuna con dell'insalata dentro. Sei dei
quattordici contorni sono a base di patate.

### 3. Il riso — **già corretto il 13/09**

14 ricette usavano tutte `riso-carnaroli`, una voce che teneva dentro come alias sia il riso comune
sia il carolino portoghese. Il libro scriveva "Riso Carnaroli 70 g" per il bitoque e per il riso
saltato, e chi aveva basmati o arroz agulha non veniva riconosciuto. Ora ci sono `riso-lungo` e
`riso-carnaroli`: nove ricette alla prima, cinque alla seconda (tre risotti, risi e bisi, arroz
doce), con il Carnaroli come sostituto e la nota del caso. Vedi il commit "Riso: due voci invece di
una che ne teneva tre".

Da correggere allo stesso modo il rapporto originale: **le note delle ricette dicevano già** la cosa
giusta ("carolino, se lo trovi", "parboiled o carolino"). Sbagliata era l'identità dell'ingrediente,
non il consiglio al cuoco.

### 4. Frutta quasi assente

9 voci, di cui 5 sono frutta secca. Mancano banane, pere, fragole. Quindici dolci e l'unica frutta
fresca sono le mele di una torta e i frutti di bosco di una panna cotta.

### 5. Latte condensato

In Portogallo è ovunque: pudim, brigadeiro, bolo de bolacha. Il bolo de bolacha era già nella lista
d'attesa del report del 13/09 e senza latte condensato non si fa.

### 6. La cena da dieci minuti non c'è

Niente pasta fresca ripiena, niente wurstel, niente salame. Gli gnocchi pronti però ci sono, quindi
il principio "prodotto pronto in tassonomia" è già stato accettato.

### 7. Dispensa e tagli di carne

Manca l'**olio di semi**, e la cotoletta di pollo oggi frigge nell'extravergine. Mancano curcuma,
zenzero, bicarbonato, maionese. Sulla carne mancano le **cosce e sovracosce di pollo**, il taglio
più economico e quello dell'arroz de frango. Manca il **tofu**: 51 ricette vegetariane e nessuna
proteina alternativa oltre legumi e uova.

*(Nota, non un errore: il pesto genovese usa mandorle invece di pinoli. Da confermare che sia una
scelta di prezzo.)*

## Il lotto approvato: 20 ricette, 17 ingredienti nuovi

Confermato da Michele il 14/09/2026.

| # | Ricetta | Gruppo |
|---|---|---|
| 1 | Spaghetti alle vongole | mare |
| 2 | Cozze alla marinara | mare |
| 3 | Gamberi in padella aglio e prezzemolo (*camarão à guilho*) | mare |
| 4 | *Polvo à lagareiro* (polpo al forno con patate) | mare |
| 5 | *Carapaus grelhados* con patate lesse | mare |
| 6 | *Arroz de marisco* | mare |
| 7 | Calamari e patate in umido | mare |
| 8 | Insalatona con uovo sodo e tonno | crude |
| 9 | Insalata greca | crude |
| 10 | Asparagi al forno con uovo | crude |
| 11 | Insalata di rucola, pere e noci | crude |
| 12 | Tortellini panna e prosciutto | veloce |
| 13 | Pasta würstel e panna | veloce |
| 14 | *Tosta mista* | veloce |
| 15 | *Bolo de bolacha* | dolci PT |
| 16 | *Pudim de leite condensado* | dolci PT |
| 17 | *Mousse de limão* | dolci PT |
| 18 | *Arroz de frango* con chouriço | pollo |
| 19 | Cosce di pollo al forno con patate e limone | pollo |
| 20 | *Canja de galinha* | pollo |

Nessuna si sovrappone alle 126 esistenti (controllato per titolo). La canja ha preso il posto di
"pollo al limone", troppo vicino alle scaloppine al limone già presenti.

**Ingredienti nuovi (17):** vongole, cozze, gamberi, polpo, calamari, carapau (sgombro) · lattuga,
cetrioli, asparagi · pere · feta, latte condensato · pasta fresca ripiena, pane in cassetta · cosce
di pollo, würstel · olio di semi.

La tassonomia passa da 160 a 177 voci. L'indice della dispensa si allunga del 10%: è un costo per
tutti, anche per chi quegli ingredienti non li comprerà mai.

**Lasciati fuori di proposito:** banane, fragole, salame, tofu, pomodori secchi, radicchio, curcuma,
zenzero, bicarbonato, maionese, quinoa, grano saraceno, seitan, bulgur, aceto di mele, sciroppo
d'acero, dragoncello.

## Come scrivere il lotto (metodo dei lotti precedenti)

1. **Brief comune** in `scratchpad/brief-ricette.md`, ricostruibile da
   `docs/superpowers/plans/2026-09-11-ricette-100.md` più la regola dell'ingrediente `principale`.
   Contiene: schema del JSON, dosi per 1 persona, prezzi di Bragança, attrezzatura posseduta e non,
   le parole vietate nei testi, la regola dei sostituti, il tono.
2. **Quattro subagent in parallelo**, uno per gruppo, ognuno su un file `_lotto-*.json` suo, così non
   si pestano i piedi: mare (7), crude + veloce (7), dolci PT (3), pollo (3).
3. **Rilettura una a una** prima del commit: dosi, tempi, prezzi, reperibilità a Bragança,
   `principale` giusto, sostituti sensati, testi senza le parole vietate.
4. **Fusione** nei file di categoria, `npm run build:data`, `npm test`.
5. **Foto dopo**: `npm run prompts` genera i 20 prompt nuovi, Michele li incolla in Gemini a mano,
   `img/raw/<slug>.jpg` → `npm run images:optimize`. Attenzione ai nomi: a ogni lotto qualche file
   arriva con un nome diverso dallo slug.
