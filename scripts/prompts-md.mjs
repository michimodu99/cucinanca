// Rigenera prompts.md da data/recipes.json: un prompt per ricetta, raggruppato per categoria.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ricette = JSON.parse(readFileSync(join(root, 'data/recipes.json'), 'utf8'));

const STILE = 'editorial food photography, white ceramic plate on light grey linen, soft natural daylight from the left, 45-degree angle, minimal Swiss composition, neutral muted background, shallow depth of field, no text, no hands, no cutlery clutter, no garnish overload';
const FORMATO = 'Vertical 4:5 portrait format.';
const CATEGORIE = [['contorno', 'Contorno'], ['dolce', 'Dolce'], ['piatto-unico', 'Piatto unico'], ['primo', 'Primo'], ['secondo', 'Secondo']];

let md = `# Prompt per le foto delle ricette

${ricette.length} prompt in inglese, uno per ricetta, nello stile editoriale del progetto (SPEC §8). Generati da \`scripts/prompts-md.mjs\` dal campo \`foto.prompt\` di ogni ricetta, con lo stesso template di \`scripts/generate_image.py\`.
Il formato **4:5 verticale** è dichiarato in ogni prompt; se l'interfaccia ha un selettore di aspect ratio, imposta comunque 4:5 (o 3:4 se 4:5 non c'è, poi il crop lo fa \`optimize-images\`). Salva l'output come \`img/raw/<slug>.png\`, poi \`npm run images:optimize\`.

**Stile comune:** ${STILE}

**Formato:** ${FORMATO}
`;
for (const [id, nome] of CATEGORIE) {
  const lista = ricette.filter((r) => r.categoria === id).sort((a, b) => a.titolo.localeCompare(b.titolo, 'it'));
  if (!lista.length) continue;
  md += `\n## ${nome}\n`;
  for (const r of lista) md += `\n### ${r.titolo}\n\`${r.slug}\`\n\n\`\`\`\n${STILE}, ${r.foto.prompt}. ${FORMATO}\n\`\`\`\n`;
}
writeFileSync(join(root, 'prompts.md'), md);
console.log(`✓ prompts.md: ${ricette.length} prompt`);
