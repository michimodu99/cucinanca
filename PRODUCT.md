# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
static HTML/CSS/JS, no build step, hosted on GitHub Pages (decided by the user in the plan; see SPEC.md §9).

## Users
Michele: an intermediate home cook living in Bragança (Portugal) from September 2026 to February 2027. He cooks dinner for himself on weekday evenings (30–45 minutes available), sometimes for the three flatmates who may join. He uses the site from his phone in the kitchen, often with dirty hands, after entering what he has in the pantry. Lunch is at the canteen; the app is a dinner tool.

## Product Purpose
Answer one question fast: "I have these ingredients — what do I cook tonight, and how?" The user enters pantry ingredients, gets recipes ranked by how many of them he already has, filters by difficulty / time / cost, and then follows a recipe step by step from the phone, screen kept awake. Success = a recipe chosen in under a minute and cooked without needing the laptop. Secondary purpose: continuous improvement — learning techniques beyond his current repertoire (ragù bianco, pasta tonno e olive).

## Positioning
A private, curated cookbook, not a recipe search engine: every recipe is dosed for one person, already excludes what he doesn't eat (peas, green beans, artichokes, raw tomato, broccoli, cauliflower), avoids spicy and offal, is priced in euros at Bragança supermarket prices, and names Portuguese substitutes for Italian ingredients. Updated on request by adding to a JSON file, not by an API.

## Operating Context
- Kitchen: induction hob, oven, microwave, 3 pans, tall pot, baking tray, knives, precision scale, boards; blender being bought. No cake tin, ramekins or rolling pin (recipes needing them are flagged).
- Evenings, autumn–winter, Trás-os-Montes produce (pumpkin, grelos, couve, mushrooms, bacalhau, chouriço).
- Pantry input is not persisted: every visit starts by entering ingredients again (explicit user choice). Links carry state so a recipe can be reopened on the phone.
- The reader is the book format: photo on the left, method on the right on desktop; swipeable pages on mobile, one step per page.

## Capabilities and Constraints
- Data: `data/recipes.json` (57 recipes, schema in `schema/recipe.schema.json`), `data/ingredienti.json` (taxonomy with aliases, pantry-base flags, forbidden flags, Portuguese availability notes). Validated by `scripts/build-data.mjs`.
- Matching: pure function in `js/match.js` (coverage-based ranking, pantry staples assumed, ≤2 missing ingredients shown, forbidden inputs rejected). 16 unit tests.
- Portions: always 1 in data; UI offers a ×1 / ×2 / ×4 multiplier with sensible rounding (`scalaQuantita`).
- Filters: category, difficulty, max time, cost band, diet, "only with my equipment", tags (quick, one-pan, leftovers, guests).
- Wake Lock API on the recipe screen; copy-missing-ingredients to clipboard.
- No login, no persistence, no external API, no timers (v1). Italian UI language.
- Terminology: dispensa (pantry), risultati (results), ricetta/libro (recipe/book), copertura (coverage), mancanti (missing), attrezzatura (equipment), porzioni (portions).

## Brand Commitments
- Binding visual constraint volunteered by the user: Swiss design aesthetic (grid, Helvetica-type sans, black/grey/white), with the food photography keeping its natural colors — photos are the only color. References in `reference/` (editorial cookbook spreads, "cook book like app", Swiss typographic poster with #2E2E2E / #E8E8E8).
- Name: "Cucina" (working title). Voice: direct, second person singular, practical, no fluff, occasional dry humour ("la prima crêpe viene sempre male: è la legge").

## Evidence on Hand
- 57 real recipes with full method, Portuguese substitutions and cost estimates (`data/recipes.json`).
- Recipe photos do not exist yet; they will be AI-generated via Replicate (FLUX) with a shared prompt template, 4:5 portrait, webp. Until then the UI must work with a typographic placeholder. Do not fabricate photo credits.
- No testimonials, ratings or user counts exist and must not be invented.

## Product Principles
1. Pantry first: the fastest path is ingredients → ranked list → cook. Nothing stands between them.
2. Readable with dirty hands: on mobile, one step per screen, large type, big tap targets, screen stays on.
3. Honest about gaps: show what's missing and the Portuguese substitute instead of hiding recipes.
4. One person, scaled on demand: every number is for one; the multiplier is explicit, never assumed.
5. The book is the reward: results are a tool, the recipe page is the object worth lingering on.

## Accessibility & Inclusion
No specific requirement established. Baseline: AA contrast, keyboard navigation in the book, `prefers-reduced-motion` respected, tap targets ≥ 44 px on mobile.
