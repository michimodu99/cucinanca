---
name: Cucina
description: A private cookbook set as a Swiss typographic spread — twelve columns, hairline rules, one grotesque in two widths, black on white, the plate as the only colored object.
colors:
  paper: "#ffffff"
  ink: "#2e2e2e"
  ink-2: "#6b6b6b"
  ash: "#e8e8e8"
  mist: "#f4f4f4"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(56px, 9vw, 112px)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 68"
  display-md:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "64px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 68"
  numeral:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "56px"
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 62"
    fontFeature: "'tnum' 1"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 68"
  title:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.5
    fontVariation: "'wdth' 100"
  lede:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.4
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    fontVariation: "'wdth' 100"
    fontFeature: "'tnum' 1, 'ss01' 1"
  body-sm:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 100"
rounded:
  none: "0px"
spacing:
  u: "8px"
  u2: "16px"
  u3: "24px"
  u4: "32px"
  u6: "48px"
  gutter: "24px"
  margin: "32px"
  gutter-mobile: "16px"
  margin-mobile: "20px"
  topbar: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "#111111"
    textColor: "{colors.paper}"
  button-primary-disabled:
    backgroundColor: "{colors.ash}"
    textColor: "#585858"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 0 0 12px"
    height: "40px"
  input-ingresso:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "8px 0 12px"
  select-filtro:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "8px 20px 8px 0"
  seg-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "36px"
  seg-button-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  index-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
  index-row-hover:
    backgroundColor: "{colors.mist}"
  foto-frame:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ash}"
    rounded: "{rounded.none}"
  nav-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "6px 0"
  nav-link-current:
    textColor: "{colors.ink}"
---

# Design System: Cucinança

## Overview

**Creative North Star: "The Swiss Spread"**

Cucina is a cookbook that is a typographic grid before it is a gallery. Every screen is set like a spread from a Swiss cookbook or a Basel poster: a twelve-column grid on white paper, hairline rules doing the work of boxes, one grotesque (Archivo, self-hosted variable) drawn at two widths, and black ink at a single weight of contrast. The plate of food is meant to be the only colored object on the page; until the 4:5 photographs land, the frame holds a mist block with the recipe title set in ash, so even the interim state reads as a typographic object rather than a broken image.

Density is editorial, not app-like. Content sits in ruled rows and columns with generous margins (32px) and a strict 8px rhythm; hierarchy is carried by size, width and weight of a single typeface rather than by color, badges or containers. Numbers are the second voice of the system: coverage fractions ("3/4"), poster-size step numerals ("1 /4") and tabular metadata (40', 2,30 €) are always set in tabular figures and are often the largest thing on a page.

The build deliberately refuses the recipe-app default: no grid of rounded photo cards, no colored badges, no pill filter bar, no shadows, no radius anywhere. Interaction feedback is a swap of ink and paper (the hovered or pressed element inverts) or a mist wash on rows, never a glow or a lift. Motion is one exponential ease-out at 320ms, played once on entrance, and the signature interaction is the page turn: spreads slide horizontally on desktop, and mobile snaps one step per screen.

**Key Characteristics:**
- Two greys and black on white; no accent hue in the UI, the photograph is the only color.
- One typeface, two widths: condensed (68, and 62 for numerals and the wordmark) for display, normal (100) for text.
- Hairline rules (1px ash) structure everything; 1px ink rules mark section heads and control edges.
- Zero radius, zero shadows, zero gradients; state is an ink/paper inversion.
- Twelve-column grid at 24px gutter and 32px margin; mobile collapses to a single stacked column at 20px margin.
- Coverage and progress are fractions in tabular numerals, never bars.
- 4:5 photo frame as the fixed proportion for every plate.

## Colors

A monochrome paper-and-ink palette: one black, one grey for secondary text, and two near-whites for rules and fields; the palette contains no chromatic accent by design.

### Primary
- **Ink** (`{colors.ink}`): the single voice of the interface. Body and display text, the primary action bar, the pressed state of every control, the focus outline (2px, offset 2px), text selection background, `accent-color` for native checkboxes, and the 1px rules that mark section heads and control edges.

### Neutral
- **Paper** (`{colors.paper}`): page background, sticky topbar and filter bar background, the fill of the action bar, and the text color on any inked surface.
- **Ink 2** (`{colors.ink-2}`): secondary text at 5.7:1 on paper. Labels, metadata (difficulty, minutes, price), placeholder text, inactive nav links, the "/4" denominator of a fraction, the quantity of an ingredient marked "q.b.", and optional ingredients.
- **Ash** (`{colors.ash}`): the hairline. Row dividers, the topbar rule, meta-table rules, the equipment-tag border, the scrollbar thumb, and the color of the typographic placeholder title inside a photo frame. Also the disabled primary-button fill.
- **Mist** (`{colors.mist}`): fields and hover. The photo frame background (interim placeholder state), the hover/selected wash on index rows, suggestion rows and ingredient-index buttons, and the mobile cover band behind the plate.

### Named Rules
**The Inversion Rule.** Interactive state is expressed by swapping ink and paper. A hovered ghost button, a pressed segment, a selected ingredient, an expanded filter toggle all become ink-on-paper inverted to paper-on-ink. There is no third state color.

**The One Colored Object Rule.** The only chromatic element permitted on a screen is the recipe photograph. Chips, tags, badges, missing-ingredient markers and category labels are drawn in ink and rules, never in hue.

**The Two Rules Rule.** Only two rule weights exist: the 1px ash hairline for dividing content, and the 1px ink rule for section heads, control borders and the top edge of bars. No 2px rules except the current-nav underline and the hover underline on an index title.

## Typography

**Display Font:** Archivo variable, width axis at 68 (with Helvetica Neue, Helvetica, Arial fallback)
**Body Font:** Archivo variable, width axis at 100 (same fallback)
**Numeral/Wordmark Font:** Archivo variable, width axis at 62, weight 900

**Character:** One grotesque doing all the work. The condensed cut at 800 to 900 with tight negative tracking and sub-1 line-height gives poster headlines and numerals; the normal-width cut at 400 to 700 carries text. Tabular numerals (`tnum`) and stylistic set 1 are on globally, so every count, fraction, time and price aligns in columns.

### Hierarchy
- **Display** (800, `clamp(56px, 9vw, 112px)`, 0.92, -0.02em, width 68): the page question "Cosa cucino stasera?" on the dispensa. Text-wrap balanced.
- **Display MD** (800, 64px, 0.95, width 68): the results headline ("Con zucca, salsiccia e riso carnaroli"); drops to 40px on mobile. A 40px variant (`display-sm`) exists in the ramp; the recipe cover title is `clamp(28px, 2.6vw, 44px)` on desktop and 40px on mobile.
- **Numeral** (900, width 62, tabular): the poster step number: 56px at 0.85 on the desktop text page, 128px at 0.8 with -0.04em on the mobile step page. The coverage fraction in the index is 40px (28px mobile) at width 68 with the denominator at 0.55em in ink-2.
- **Headline** (800, 28px, 1.0, -0.015em, width 68): the recipe title in an index row (22px on mobile). The same 28px, at weight 500 and width 100, is the pantry input's type size (22px on mobile).
- **Title** (700, 16px, 1.5): step headings, meta values, the primary button label (uppercase, 0.02em). The wordmark is 22px at 900 / width 62, uppercase.
- **Lede** (400, 20px, 1.4, max 34ch): the one sentence under the display; also the mobile step heading size. Mobile step body text is 21px at 1.45.
- **Body** (400, 16px, 1.5): step text, suggestion rows, ingredient rows on mobile. Step paragraphs cap at 62ch.
- **Body SM** (400 to 600, 14px, 1.35 to 1.5): metadata, filters, chips, ingredient rows, nav position, secondary paragraphs.
- **Label** (600, 12px, 0.08em, uppercase, ink-2): form labels, category heads in the ingredient index, filter labels (11px inside the filter bar and meta table), nav links, ghost-button text, results section heads (in ink). Labels are functional: each names a field, a category or a section of the index.

### Named Rules
**The Two Widths Rule.** Display and numerals are condensed (68; 62 for the step numeral, wordmark and placeholder), text is normal width (100). Never set running text condensed, never set a headline at width 100.

**The Tabular Rule.** Every number is tabular. Fractions, times, prices, counts and page positions ("3 / 7") use `tnum` so they align and do not shift as they change.

**The Fraction Rule.** Coverage is a fraction ("3/4") set as a numeral with a small ink-2 denominator, never a progress bar, ring or percentage.

## Layout

A twelve-column grid (`repeat(12, 1fr)`, 24px gutter, 32px outer margin) at desktop, collapsing to a single stacked column with 16px gutter and 20px margin below 900px (the sole breakpoint, `max-width: 899px`). Vertical rhythm is an 8px unit: section paddings are 3u, 4u, 5u and 6u (24 to 48px); row paddings are 14 to 16px; control heights are 36 (segment), 40 (chip, ghost, filter toggle), 44 (page-turn, add button) and 56px (primary bar, topbar, book nav), 52px on mobile.

The dispensa opens (since 12/09/2026) with a full-width dark band, ≈2:1 (`min(clamp(400px, 46vw, 620px), 100dvh − topbar − 96px)`, 60dvh on mobile), carrying muted cooking clips cut together in one looping file (`video/hero.mp4`, poster `img/hero-poster.webp`) under a black veil (0.7 bottom → 0.2 top); display and lede sit bottom-left in paper, max 60ch. It is the one deliberate exception to black-on-white, chosen for the landing; `prefers-reduced-motion` swaps the clips for the poster. Below it the input, the small grey pantry-basics line, chips and the ingredient index run on the full 12 columns (label column 120px, then the ruled rows); the fixed bottom action bar sits on the same grid, count in columns 1 to 6, black button in 7 to 12. The results page puts the headline in columns 1 to 8 and the count in 9 to 12, then a sticky filter bar under the sticky 56px topbar, then full-bleed ruled rows (96px photo, body, coverage) whose hover wash extends to the viewport edge. The recipe reader fills the viewport below the topbar (`100dvh - topbar`): desktop is a two-page spread split by a hairline, with the cover page holding a 62%-wide 4:5 plate beside the title; mobile is a horizontal scroll-snap strip of full-width pages (cover, ingredients, one page per step) with a 56px nav bar respecting the safe-area inset.

Sticky and fixed chrome is always paper with a 1px rule on its content edge: topbar (ash rule below), filter bar (ink rule above, ash below), action bar and book nav (ink rule above).

## Elevation & Depth

The system is flat. There are no shadows, no blur, no gradients, no overlays. Depth is conveyed by rules and by stacking order alone: sticky surfaces are the same paper as the page and are separated by a 1px rule; the suggestion listbox drops beneath the input as a paper box with a 1px ink border and no shadow; hover is a mist wash on a row or an ink inversion on a control. The active state of the primary button is a 0.985 scale for 120ms; disabled page-turn buttons fade to 25% opacity.

### Named Rules
**The Paper Only Rule.** Every surface is paper (one exception: the dispensa hero band, dark with the cooking clips, see Layout). Layering is signaled by a rule, never by a shadow or a tint shift; the only non-paper fill is mist inside a field, a frame or a hover.

## Shapes

Zero radius everywhere: buttons, chips, inputs, selects, photo frames, focus outlines and the suggestion listbox are all hard rectangles (native `border-radius: 0` is forced on inputs and selects). Form language is the ruled rectangle: a 1px ink border defines chips, ghost buttons, segment controls, the mobile filter toggle and the "manca" marker; a 1px ink bottom rule alone defines the pantry input and every select. The primary action is a solid ink rectangle. The photo frame is a 4:5 portrait (`aspect-ratio: 4 / 5`), unfiltered, `object-fit: cover`; 96px wide in the index, 64px on mobile, 62% of the cover page on desktop, and 52vh tall on the mobile cover. Unknown chips use a dashed 1px border in ink-2. Icons are typographic characters (+, −, →, ←) set light (weight 300) in the same face; the only drawn icon is the 12x8 chevron on selects (1.5px stroke, ink).

## Components

### Buttons
- **Shape:** hard rectangle (0px)
- **Primary (`.btn-primary`):** ink fill, paper text, 56px tall (52px mobile), 0 24px padding, 16px / 700 / uppercase / 0.02em; inline-flex with 12px gap so the trailing arrow sits at the far end (`space-between` inside the action bar). Hover darkens to #111 over 320ms; active scales to 0.985 in 120ms; disabled is ash fill with #585858 text and `not-allowed`.
- **Ghost (`.btn-ghost`):** 1px ink border, transparent fill, 40px tall, 0 14px, label type (12px / 600 / uppercase / 0.08em). Hover inverts to ink fill and paper text. Used for "Copia la lista della spesa (n)".
- **Page-turn (`.libro-btn`):** 44px ruled rectangle with a 22px light arrow glyph; hover inverts; disabled at 25% opacity with no hover.
- **Add (`.ingresso-add`):** 44px unruled square holding a 28px light "+"; hover inverts.
- **Focus:** 2px ink outline, offset 2px, on `:focus-visible` (selects use 4px offset).

### Chips
- **Style (`.chip`):** 40px tall, 1px ink border, 12px left padding, 14px / 600 text; a 40px-wide remove button on the right separated by a 1px ash rule, inverting on hover. Enters once with a 6px rise and fade at 320ms.
- **State:** `.sconosciuto` (unknown ingredient) switches to a dashed ink-2 border and ink-2 text. There is no filled or colored chip.

### Ingredient index (`.indice-riga`, `.indice-voci`)
Ruled rows under a 1px ink top rule: a 120px label column and a wrapped list of ingredient buttons (14px, 4px 8px padding) separated by ash "·" separators. Hover washes mist; a chosen ingredient (`aria-pressed`) inverts to ink. Collapses to a single column with 6px gap on mobile.

### Inputs / Fields
- **Pantry input (`.ingresso-field`):** borderless text on a single 1px ink bottom rule, 28px / 500 / -0.01em (22px mobile), ink-2 placeholder, no focus ring of its own (the rule is the field). The suggestion listbox (`.suggerimenti`) hangs directly from the rule as a paper box with a 1px ink border on three sides, rows of 10px 12px with ash dividers, mist on hover/selected, category in label type, forbidden items struck through in ink-2.
- **Select (`.filtro select`):** native picker with a drawn chevron, 14px / 600, 1px ink bottom rule, 8px 20px 8px 0 padding, min-width 120px (full-width on mobile).
- **Checkbox:** native, 16px, `accent-color` ink.
- **Segment control (`.seg`):** ruled group of 36px buttons (min 48px, tabular), pressed segment inverts to ink.
- **Message (`.ingresso-msg`):** 14px ink-2, switching to ink for errors; no red.

### Navigation
- **Topbar:** sticky 56px (52px mobile), paper, ash rule below, three-column grid: 22px condensed uppercase wordmark left, label-type links center (ink-2, 2px transparent underline that becomes ink for `aria-current="page"`), 12px ink-2 meta right (hidden on mobile).
- **Filter bar (`.filtri-bar`):** sticky under the topbar, ink rule above and ash rule below, selects in a wrapped flex with 24px gaps and the sort select pushed right. On mobile it becomes a two-column grid with a ruled "Filtri +/−" toggle that inverts when expanded, and the sort select alongside; the remaining filters open beneath in two columns.
- **Action bar (`.azione-bar`):** fixed to the bottom, paper, ink rule above, 12px vertical padding, on the twelve-column grid; mobile hides the count, stretches the button and pads for the safe area.
- **Book nav (`.libro-nav`):** 56px bar with ink rule above; prev/next ruled buttons at the outer edges and a tabular "3 / 7" position (14px / 600 / 0.06em, ink-2) centered.

### Index row (`.riga`)
The results list is a ruled row, not a card: 96px 4:5 frame, headline title (28px condensed) with a 14px meta line (uppercase category in ink, difficulty, minutes with a prime, price in euros, all tabular), and on the right a 40px coverage fraction over a "manca: ..." line naming what is missing in bold. Rows enter once with an 8px rise, staggered 30ms per row up to 12. Hover washes the row mist to the viewport edges and underlines the title at 2px; focus-within draws the 2px ink outline inset. Rows are grouped under section heads (`.indice-sezione`, label in ink over a 1px ink rule) such as "Manca un ingrediente".

### Photo frame (`.foto`)
A mist rectangle at 4:5 with `container-type` sizing. Interim placeholder (`.foto-ph`): the recipe title set in ash, uppercase, 900 / width 62 / 0.9 / -0.02em, bottom-left at 6% padding, sized `clamp(28px, 6cqw, 96px)` (18px in the index row). When an image loads, `.has-img` hides the placeholder and the photo fills the frame unfiltered. The frame proportion is the rule; the placeholder is the interim state until the 4:5 WebP plates land in `img/`.

### The Spread (`.spread`, `.pagina`) and mobile pages (`.pagina-m`)
Desktop: two pages side by side split by an ash hairline, the whole spread entering with a 32px horizontal slide (direction-aware, `data-dir="back"` slides from the left) and fade at 320ms. Cover page: the plate frame with the title, description, a 5-column meta table (label over 16px / 700 tabular value) and equipment tags (12px uppercase ruled in ash; missing equipment ruled in ink and bold). Text pages: 24px padding, an ingredients block with an ink-ruled head and a ×1/×2/×4 segment, two-column ingredient list with 76px right-aligned bold quantities on ash rules, steps as a 72px numeral column beside a 16px heading and 62ch paragraph, and notes with a 6px ink dash bullet. Mobile: pages snap horizontally, the cover carries the plate at 52vh on a mist band, the ingredient list becomes one column at 16px, and each step page opens with the 128px numeral and a "/4" small denominator above an ink rule, a 20px heading with the minutes at right, and 21px text.

## Do's and Don'ts

### Do:
- **Do** set every screen on the twelve-column grid (24px gutter, 32px margin) and collapse to one stacked column at 899px with 16px / 20px.
- **Do** carry hierarchy with Archivo's width and weight axes: 68 / 800 for display, 62 / 900 for numerals, 100 / 400 to 700 for text.
- **Do** turn on tabular numerals for every count, fraction, time, price and position.
- **Do** express interactive state as an ink/paper inversion (hover, pressed, selected, expanded) or a mist wash on rows.
- **Do** divide with 1px ash hairlines and mark heads and control edges with 1px ink rules.
- **Do** keep photos at 4:5, unfiltered, in a mist frame; use the typographic placeholder only until the image lands.
- **Do** use the one motion: `cubic-bezier(0.16, 1, 0.3, 1)` at 320ms, played once on entrance (6 to 8px rise for rows and chips, 32px slide for spreads), with row stagger at 30ms and reduced-motion collapsing it all.
- **Do** show coverage and progress as fractions ("3/4", "3 / 7").

### Don't:
- **Don't** introduce a chromatic accent, a colored badge, a status color or a red error; errors switch ink-2 to ink.
- **Don't** round anything; no border-radius on buttons, chips, inputs, frames or outlines.
- **Don't** add shadows, blur, gradients or tinted overlays; separation is a rule.
- **Don't** put recipes in photo cards or a card grid; the index is ruled rows with the plate at 96px.
- **Don't** build pill filters or a pill chip; chips and toggles are 1px ruled rectangles 40px tall.
- **Don't** draw progress as a bar, ring or percentage.
- **Don't** use a second typeface, an icon font or glyph-set icons; the arrows, plus and minus are Archivo characters at weight 300, and the select chevron is the only drawn icon.
- **Don't** set running text condensed or headlines at normal width.
