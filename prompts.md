# Prompt per le foto delle ricette

100 prompt in inglese, uno per ricetta, nello stile editoriale del progetto (SPEC §8). Generati da `scripts/prompts-md.mjs` (`npm run prompts`) dal campo `foto.prompt` di ogni ricetta, con lo stesso template di `scripts/generate_image.py`.
Il formato **4:5 verticale** è dichiarato in ogni prompt; se l'interfaccia ha un selettore di aspect ratio, imposta comunque 4:5 (o 3:4 se 4:5 non c'è, poi il crop lo fa `optimize-images`). Salva l'output come `img/raw/<slug>.png` (o .jpg), poi `npm run images:optimize`.

Due parti: **99 ricette con la foto già fatta** (`img/<slug>.webp` esiste) e, in fondo, **1 ricette da generare**. Rilanciando `npm run prompts` dopo aver ottimizzato le foto, la lista in fondo si svuota da sola.

**Stile comune:** editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload

**Formato:** Vertical 4:5 portrait format.

---

# Foto già fatte (99)

## Contorno

### Carciofi alla romana
`carciofi-alla-romana`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, two braised Roman-style artichokes standing upside down with stems up, glossy with olive oil, mint and parsley, on a white ceramic plate. Vertical 4:5 portrait format.
```

### Cavolfiore gratinato
`cavolfiore-gratinato`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, cauliflower gratin with golden bubbling cheese and breadcrumb crust, creamy bechamel visible, served in a small white ceramic baking dish. Vertical 4:5 portrait format.
```

### Fagiolini al pomodoro con patate
`fagiolini-al-pomodoro-con-patate`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, green beans and potato wedges stewed in a thick tomato sauce with basil leaves, glossy, served in a white ceramic bowl. Vertical 4:5 portrait format.
```

### Funghi trifolati
`funghi-trifolati`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, golden sauteed mushroom slices with garlic and parsley, glossy olive oil, white ceramic bowl. Vertical 4:5 portrait format.
```

### Hummus con pane tostato
`hummus-con-pane-tostato`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, smooth creamy hummus swirled in a white ceramic bowl with a pool of olive oil and a sprinkle of paprika, toasted bread wedges on the side. Vertical 4:5 portrait format.
```

### Insalata di finocchi, arance e olive
`insalata-di-finocchi-arance-e-olive`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, shaved fennel and orange salad with black olives and fennel fronds, olive oil, bright and fresh, white ceramic plate. Vertical 4:5 portrait format.
```

### Insalata di patate al coriandolo
`insalata-di-patate-al-coriandolo`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, warm potato salad with fresh chopped coriander, garlic and olive oil, rustic, white ceramic bowl. Vertical 4:5 portrait format.
```

### Patatas bravas
`patatas-bravas`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, crispy golden roasted potato cubes topped with spoonfuls of smoky red brava sauce, served on a white ceramic plate. Vertical 4:5 portrait format.
```

### Patate al forno alla paprika
`patate-al-forno-alla-paprika`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, crispy roasted potato wedges dusted with sweet paprika, whole garlic cloves, white ceramic plate, overhead. Vertical 4:5 portrait format.
```

### Patate al forno croccanti
`patate-al-forno-croccanti`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, crispy golden roasted potato chunks with rosemary and flaky salt, white ceramic plate, overhead. Vertical 4:5 portrait format.
```

### Verze stufate con pancetta
`verze-stufate-con-pancetta`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, braised savoy cabbage ribbons with pancetta cubes and bay leaf, glossy, white ceramic bowl. Vertical 4:5 portrait format.
```

### Zucca al forno con rosmarino e aceto balsamico
`zucca-al-forno-con-rosmarino-e-balsamico`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, roasted pumpkin slices with caramelized edges, rosemary and balsamic glaze, walnuts, white ceramic plate. Vertical 4:5 portrait format.
```

## Dolce

### Arroz doce
`arroz-doce`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, creamy Portuguese rice pudding in a shallow white ceramic bowl, decorated on top with a lattice pattern of ground cinnamon. Vertical 4:5 portrait format.
```

### Crostata alla crema pasticcera
`crostata-alla-crema-pasticcera`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, small lattice-topped custard crostata, golden shortcrust, one slice cut showing yellow pastry cream, light grey background. Vertical 4:5 portrait format.
```

### Mousse al cioccolato
`mousse-al-cioccolato`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, airy dark chocolate mousse in a small white ceramic cup with a spoon-scooped surface showing its light texture, on a white plate. Vertical 4:5 portrait format.
```

### Panna cotta ai frutti di bosco
`panna-cotta-ai-frutti-di-bosco`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, wobbly white panna cotta unmolded on a white plate with dark berry sauce, minimal light grey background. Vertical 4:5 portrait format.
```

### Pastéis de nata
`pasteis-de-nata`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, three Portuguese pasteis de nata custard tarts with blistered caramelized tops and flaky spiral pastry, cinnamon dust, light grey background. Vertical 4:5 portrait format.
```

### Salame di cioccolato
`salame-di-cioccolato`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, chocolate salami log dusted with powdered sugar, three slices cut showing biscuit pieces, light grey background, minimal. Vertical 4:5 portrait format.
```

### Tiramisù
`tiramisu`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, single-serving tiramisu in a glass, visible layers of mascarpone cream and coffee-soaked ladyfingers, cocoa dusting, minimal light grey background. Vertical 4:5 portrait format.
```

### Torta allo yogurt
`torta-allo-yogurt`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, simple golden yogurt cake with a domed cracked top, one soft slice cut showing the fluffy crumb, on a white ceramic plate. Vertical 4:5 portrait format.
```

### Torta caprese
`torta-caprese`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, dark chocolate almond torta caprese with a cracked crust dusted with powdered sugar, one moist slice cut, on a white ceramic plate. Vertical 4:5 portrait format.
```

### Torta di mele della nonna
`torta-di-mele`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, rustic apple cake with fanned apple slices on top, cinnamon sugar crust, one slice cut, light grey background, minimal. Vertical 4:5 portrait format.
```

## Piatto unico

### Alheira no forno com ovo e grelos
`alheira-no-forno-com-ovo-e-grelos`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, roasted golden alheira sausage split open, served with a fried egg and sautéed garlicky turnip greens, on a white ceramic plate. Vertical 4:5 portrait format.
```

### Arroz de pato
`arroz-de-pato`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, Portuguese arroz de pato, baked duck rice with crispy chourico slices on top, golden crust, white ceramic baking dish. Vertical 4:5 portrait format.
```

### Bitoque
`bitoque`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, Portuguese bitoque: thin seared beef steak topped with a fried egg, white rice, golden fries and a garlic butter pan sauce, on a white ceramic plate. Vertical 4:5 portrait format.
```

### Caldo verde
`caldo-verde`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, Portuguese caldo verde soup, pale potato base with thin shredded green kale and chourico slices, olive oil, white ceramic bowl. Vertical 4:5 portrait format.
```

### Caril de galinha
`caril-de-galinha`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, Portuguese-Goan chicken curry with coconut sauce, tomato and fresh coriander, white rice on the side, white ceramic bowl. Vertical 4:5 portrait format.
```

### Crêpes salate prosciutto e formaggio
`crepes-salate-prosciutto-e-formaggio`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, two folded savory crepes with melted cheese and ham, golden lace edges, white ceramic plate, minimal. Vertical 4:5 portrait format.
```

### Curry di ceci e spinaci
`curry-di-ceci-e-spinaci`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, chickpea and spinach curry in a creamy golden coconut tomato sauce, fresh coriander leaves, served with white rice in a white ceramic bowl. Vertical 4:5 portrait format.
```

### Feijoada à transmontana
`feijoada-a-transmontana`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, Portuguese feijoada à transmontana: red beans stewed with chourico slices, pork cubes and shredded cabbage in a rich paprika sauce, white rice on the side, white ceramic plate. Vertical 4:5 portrait format.
```

### Focaccia genovese
`focaccia-genovese`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, golden Genovese focaccia with deep dimples filled with olive oil and flaky salt, cut square, light wooden board. Vertical 4:5 portrait format.
```

### Insalata di riso
`insalata-di-riso`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, Italian rice salad with tuna flakes, green peas, sliced olives, diced tomato and hard-boiled egg wedges, glossy with olive oil, in a white ceramic bowl. Vertical 4:5 portrait format.
```

### Minestrone
`minestrone`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, hearty Italian minestrone soup with diced carrots, potatoes, zucchini, green beans and white beans in a light tomato broth, basil leaf on top, white ceramic bowl. Vertical 4:5 portrait format.
```

### Parmigiana di melanzane
`parmigiana-di-melanzane`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, single portion of eggplant parmigiana with visible layers, tomato sauce, melted mozzarella, basil leaf, white ceramic plate. Vertical 4:5 portrait format.
```

### Pasta al forno bianca con salsiccia e scamorza
`pasta-al-forno-bianca-con-salsiccia-e-scamorza`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, baked rigatoni with sausage and smoked scamorza, golden gratin crust, single portion in a white ceramic dish. Vertical 4:5 portrait format.
```

### Piadina con squacquerone e rucola
`piadina-con-squacquerone-e-rucola`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, folded piadina flatbread filled with creamy cheese, prosciutto and rocket, golden spots, light wooden board. Vertical 4:5 portrait format.
```

### Pizza bianca a lunga lievitazione
`pizza-bianca-a-lunga-lievitazione`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, rectangular pan pizza bianca with thin potato slices and rosemary, airy golden crumb visible on a cut edge, light wooden board. Vertical 4:5 portrait format.
```

### Pizza margherita
`pizza-margherita`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, Neapolitan-style pizza margherita with a puffy leopard-spotted crust, bright tomato sauce, melted mozzarella pools and fresh basil leaves, on a white ceramic plate. Vertical 4:5 portrait format.
```

### Polenta con funghi e salsiccia
`polenta-con-funghi-e-salsiccia`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, soft yellow polenta topped with sausage and mushroom ragout, rosemary, white ceramic bowl, warm light. Vertical 4:5 portrait format.
```

### Ribollita
`ribollita`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, thick Tuscan ribollita with dark kale, white beans and bread, olive oil drizzle, rustic white ceramic bowl. Vertical 4:5 portrait format.
```

### Shakshuka
`shakshuka`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, shakshuka with two eggs poached in a rich red tomato and pepper sauce, runny yolks, chopped parsley, served in a white ceramic bowl. Vertical 4:5 portrait format.
```

### Spaghetti con polpette e pomodorini
`spaghetti-con-polpette-e-pomodorini`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, spaghetti tangled with small meatballs in a blistered cherry tomato sauce, fresh basil, white ceramic plate. Vertical 4:5 portrait format.
```

### Vellutata di cavolfiore e porro
`vellutata-di-cavolfiore-e-porro`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, smooth pale cauliflower and leek velouté soup with a swirl of olive oil, cracked black pepper and golden croutons, in a white ceramic bowl. Vertical 4:5 portrait format.
```

### Vellutata di zucca con crostini
`vellutata-di-zucca-con-crostini`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, smooth orange pumpkin veloute with golden croutons and olive oil swirl, white ceramic bowl, minimal. Vertical 4:5 portrait format.
```

### Zuppa di lenticchie
`zuppa-di-lenticchie`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, rustic lentil soup with small brown lentils, diced carrot and celery in a thick tomato-tinged broth, olive oil drizzle, white ceramic bowl. Vertical 4:5 portrait format.
```

## Primo

### Bucatini all'amatriciana
`bucatini-all-amatriciana`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, bucatini all'amatriciana with red tomato sauce, crispy guanciale and grated pecorino, white ceramic bowl. Vertical 4:5 portrait format.
```

### Cacio e pepe
`cacio-e-pepe`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, cacio e pepe spaghetti with glossy pecorino cream and cracked black pepper, nest of pasta in a white ceramic bowl. Vertical 4:5 portrait format.
```

### Gnocchi di patate burro e salvia
`gnocchi-di-patate-burro-e-salvia`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, handmade potato gnocchi with brown butter and crispy sage leaves, parmesan shavings, white ceramic plate. Vertical 4:5 portrait format.
```

### Lasagne alla bolognese
`lasagne-alla-bolognese`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, a square portion of lasagne alla bolognese with visible layers of pasta, meat ragù and béchamel, golden browned top, on a white ceramic plate. Vertical 4:5 portrait format.
```

### Lasagne bianche funghi e prosciutto cotto
`lasagne-bianche-funghi-e-prosciutto`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, single portion of white lasagna with mushrooms, ham and golden bechamel crust, layers visible, white plate. Vertical 4:5 portrait format.
```

### Minestra di farro, zucca e cavolo nero
`minestra-di-farro-zucca-e-cavolo-nero`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, hearty Tuscan farro soup with orange pumpkin cubes and dark kale, olive oil drizzle, white ceramic bowl. Vertical 4:5 portrait format.
```

### Orecchiette con broccoli e acciughe
`orecchiette-con-broccoli-e-acciughe`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, orecchiette pasta tossed with soft green broccoli florets in anchovy and garlic oil, toasted breadcrumbs on top, in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Orecchiette salsiccia e cime di rapa
`orecchiette-salsiccia-e-cime-di-rapa`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, orecchiette pasta with crumbled sausage and dark green turnip tops, glossy olive oil, white ceramic plate. Vertical 4:5 portrait format.
```

### Pasta al limone e mascarpone
`pasta-al-limone-e-mascarpone`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, creamy lemon mascarpone spaghetti with lemon zest and basil leaf, bright and fresh, white ceramic bowl. Vertical 4:5 portrait format.
```

### Pasta al pesto genovese
`pasta-al-pesto-genovese`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, trofie pasta coated in bright green basil pesto with a few whole basil leaves and grated parmesan on top, in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Pasta alla gricia
`pasta-alla-gricia`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, rigatoni alla gricia with golden crispy guanciale, pecorino cream and black pepper, white ceramic plate. Vertical 4:5 portrait format.
```

### Pasta alla norma
`pasta-alla-norma`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, rigatoni alla norma with fried eggplant cubes, tomato sauce, grated salted ricotta and basil, white ceramic plate. Vertical 4:5 portrait format.
```

### Pasta con carciofi e pancetta
`pasta-con-carciofi-e-pancetta`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, short pasta with tender sautéed artichoke wedges, crispy pancetta cubes and grated pecorino, a few mint leaves, in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Pasta con cavolfiore alla siciliana
`pasta-con-cavolfiore-alla-siciliana`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, bucatini in a creamy saffron-yellow cauliflower sauce with raisins, toasted almonds and golden breadcrumbs on top, in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Pasta con crema di zucchine, speck e zafferano
`pasta-con-crema-di-zucchine-speck-e-zafferano`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, penne pasta in pale green zucchini cream tinted with saffron, crispy speck strips on top, white ceramic bowl. Vertical 4:5 portrait format.
```

### Pasta e ceci alla romana
`pasta-e-ceci-alla-romana`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, rustic pasta e ceci soup with ditalini, chickpeas, rosemary sprig and olive oil, dense and creamy, white ceramic bowl. Vertical 4:5 portrait format.
```

### Pasta e fagioli
`pasta-e-fagioli`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, thick pasta e fagioli with ditalini and cannellini beans in a creamy rosemary broth, olive oil drizzle, in a deep white ceramic bowl. Vertical 4:5 portrait format.
```

### Pasta e patate con provola
`pasta-e-patate-con-provola`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, creamy Neapolitan pasta e patate with melted smoked provola strings and rosemary, rustic white bowl. Vertical 4:5 portrait format.
```

### Penne all'arrabbiata
`penne-all-arrabbiata`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, penne rigate in a fiery red tomato and chili sauce with chopped parsley, glossy and clinging to the pasta, in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Risi e bisi
`risi-e-bisi`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, risi e bisi, loose Venetian rice and green pea soup with parmesan and parsley, spoonable and creamy, in a deep white ceramic bowl. Vertical 4:5 portrait format.
```

### Risotto ai funghi porcini
`risotto-ai-funghi-porcini`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, porcini mushroom risotto with parsley and shaved parmesan, creamy texture, white ceramic bowl. Vertical 4:5 portrait format.
```

### Risotto alla milanese
`risotto-alla-milanese`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, saffron risotto alla milanese, bright golden yellow, creamy, in a shallow white ceramic bowl, minimal styling. Vertical 4:5 portrait format.
```

### Risotto zucca e salsiccia
`risotto-zucca-e-salsiccia`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, creamy orange pumpkin risotto with crumbled sausage and rosemary, shallow white bowl, top light. Vertical 4:5 portrait format.
```

### Spaghetti aglio, olio e pangrattato tostato
`spaghetti-aglio-olio-e-pangrattato`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, spaghetti aglio e olio with golden garlic slices, toasted breadcrumbs and parsley, glossy, white ceramic bowl. Vertical 4:5 portrait format.
```

### Spaghetti alla carbonara
`spaghetti-alla-carbonara`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, spaghetti carbonara with crispy guanciale cubes, creamy egg and pecorino sauce, coarse black pepper, twirled in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Spaghetti alla puttanesca
`spaghetti-alla-puttanesca`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, spaghetti alla puttanesca with black olives, capers and anchovy tomato sauce, sprinkled with parsley, twirled in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Spaghetti tonno, olive e capperi
`spaghetti-tonno-olive-e-capperi`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, spaghetti with flaked tuna, black olives, capers, parsley and grated lemon zest, glossy with olive oil, twirled in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Tagliatelle al ragù bianco
`tagliatelle-al-ragu-bianco`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, fresh tagliatelle coated in a creamy white meat ragù without tomato, finely diced vegetables and grated parmesan, in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```

### Tagliatelle fresche all'uovo
`tagliatelle-fresche-all-uovo`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, nests of fresh handmade egg tagliatelle dusted with semolina on a light wooden board, one nest with butter and sage, minimal. Vertical 4:5 portrait format.
```

## Secondo

### Arrosto di maiale al latte
`arrosto-di-maiale-al-latte`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, sliced pork loin braised in milk with golden curdled milk sauce and sage leaves, white ceramic plate. Vertical 4:5 portrait format.
```

### Bacalhau à Brás
`bacalhau-a-bras`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, bacalhau a bras, shredded cod with matchstick potatoes and soft scrambled eggs, black olives and parsley, white ceramic plate. Vertical 4:5 portrait format.
```

### Bacalhau com natas
`bacalhau-com-natas`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, bacalhau com natas, creamy baked salt cod gratin with potato cubes and onion under a golden browned crust, served in a white ceramic dish. Vertical 4:5 portrait format.
```

### Bistecca con burro alle erbe e patate saltate
`bistecca-con-burro-alle-erbe-e-patate`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, sliced seared steak with melting herb butter and golden sauteed potato cubes, thyme, white ceramic plate. Vertical 4:5 portrait format.
```

### Brasato al vino rosso
`brasato-al-vino-rosso`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, thick slices of red wine braised beef with dark glossy sauce and soft polenta, white ceramic plate. Vertical 4:5 portrait format.
```

### Cotoletta alla milanese
`cotoletta-alla-milanese`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, bone-in veal cotoletta alla milanese with golden breadcrumb crust and a lemon wedge, white ceramic plate. Vertical 4:5 portrait format.
```

### Filetto di maiale in crosta di pancetta
`filetto-di-maiale-in-crosta-di-pancetta`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, sliced pork tenderloin wrapped in crispy pancetta, pink center, rosemary, light pan jus, white ceramic plate. Vertical 4:5 portrait format.
```

### Frango piri-piri
`frango-piri-piri`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, roasted piri-piri chicken thighs with crispy dark red spiced skin, glossy butter and lemon sauce spooned over, white ceramic plate. Vertical 4:5 portrait format.
```

### Frittata di patate e cipolle al forno
`frittata-di-patate-e-cipolle-al-forno`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, thick golden baked potato and onion frittata slice on a white ceramic plate, rosemary, minimal styling. Vertical 4:5 portrait format.
```

### Hamburger fatti in casa con cipolle caramellate
`hamburger-fatti-in-casa`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, homemade cheeseburger on a toasted bun with melted cheese dripping over a thick juicy patty, caramelized onions and arugula, white ceramic plate. Vertical 4:5 portrait format.
```

### Insalata caprese
`insalata-caprese`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, caprese salad with alternating slices of ripe red tomato and fresh white mozzarella, torn basil leaves, olive oil drizzle, white ceramic plate. Vertical 4:5 portrait format.
```

### Involtini di tacchino con speck e scamorza
`involtini-di-tacchino-con-speck-e-scamorza`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, turkey roulades wrapped with speck, melted smoked cheese oozing, sage, light pan sauce, white ceramic plate. Vertical 4:5 portrait format.
```

### Orata al forno con patate e olive
`orata-al-forno-con-patate-e-olive`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, whole roasted sea bream on sliced potatoes with black olives, lemon and rosemary, white ceramic baking dish, overhead light. Vertical 4:5 portrait format.
```

### Peperoni ripieni di carne e riso
`peperoni-ripieni-di-carne-e-riso`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, one roasted red bell pepper stuffed with meat and rice, slightly charred, tomato sauce underneath, white ceramic plate. Vertical 4:5 portrait format.
```

### Pollo alla cacciatora
`pollo-alla-cacciatora`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, chicken thighs braised in tomato sauce with black olives and rosemary, glossy, rustic white ceramic plate. Vertical 4:5 portrait format.
```

### Pollo alla pizzaiola
`pollo-alla-pizzaiola`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, chicken breast cutlet in thick tomato sauce with oregano and melted mozzarella, glossy red sauce, white ceramic plate. Vertical 4:5 portrait format.
```

### Pollo arrosto con patate al forno
`pollo-arrosto-con-patate`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, roast chicken leg with crispy golden skin over roasted potato wedges, rosemary and lemon, white ceramic plate. Vertical 4:5 portrait format.
```

### Polpette al forno con salsa allo yogurt
`polpette-al-forno-con-salsa-allo-yogurt`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, golden baked meatballs with a bowl of white yogurt mint sauce, parsley, white ceramic plate, minimal. Vertical 4:5 portrait format.
```

### Salmone al forno in crosta di erbe e pistacchi
`salmone-in-crosta-di-erbe-e-pistacchi`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, baked salmon fillet with green pistachio herb crust and a lemon wedge, white ceramic plate, minimal. Vertical 4:5 portrait format.
```

### Salmone allo yogurt ed erba cipollina
`salmone-allo-yogurt-ed-erba-cipollina`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, pan-seared salmon fillet with crispy golden skin next to a dollop of white yogurt sauce flecked with chives and lemon zest, white ceramic plate. Vertical 4:5 portrait format.
```

### Salsiccia e broccoli in padella
`salsiccia-e-broccoli-in-padella`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, browned Italian sausage chunks with tender green broccoli florets and garlic, glossy pan juices, white ceramic plate. Vertical 4:5 portrait format.
```

### Saltimbocca alla romana
`saltimbocca-alla-romana`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, saltimbocca alla romana, veal with prosciutto and sage leaf pinned with toothpick, buttery wine sauce, white plate. Vertical 4:5 portrait format.
```

### Scaloppine al limone
`scaloppine-al-limone`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, veal scaloppine in glossy lemon butter sauce with parsley and lemon zest, white ceramic plate. Vertical 4:5 portrait format.
```

### Scaloppine al marsala
`scaloppine-al-marsala`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, thin veal scaloppine coated in glossy dark amber marsala sauce, sprinkled with chopped parsley, white ceramic plate. Vertical 4:5 portrait format.
```

### Spezzatino di manzo con patate in bianco
`spezzatino-di-manzo-con-patate`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, beef stew with potatoes and carrots in a light rosemary gravy, rustic, white ceramic bowl. Vertical 4:5 portrait format.
```

---

# Da generare (1)

## Primo

### Spaghetti al pomodoro e basilico
`spaghetti-al-pomodoro-e-basilico`

```
editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload, spaghetti in a bright, glossy tomato sauce with fresh basil leaves, twirled in a shallow white ceramic bowl. Vertical 4:5 portrait format.
```
