#!/usr/bin/env node
// Regenera docs/SCREENSHOTS.md: el guion de capturas de toda la documentación.
//
// Fuente de verdad doble:
//   - las páginas EN/ES dicen QUÉ imágenes existen y EN QUÉ SECCIÓN van;
//   - docs/screenshots.json dice, por imagen, su prioridad, desde qué vista se toma
//     y qué tiene que verse en ella.
// El estado (tomada / pendiente) se deduce de public/docs-images/.
//
// Uso: npm run doc:shots
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'src/content/docs');
const CATALOG = join(ROOT, 'docs/screenshots.json');
const OUT = join(ROOT, 'docs/SCREENSHOTS.md');

const PRODUCTS = [
  ['beasty-visual-novel', 'Beasty Visual Novel'],
  ['beasty-save-system', 'Beasty Save System'],
  ['beasty-console', 'Beasty Console'],
];
const PRIORITY_LABEL = {
  1: 'P1 · imprescindibles',
  2: 'P2 · recomendadas',
  3: 'P3 · complementarias',
};

const pageFile = (lang, page) => join(DOCS, lang, page + '.md');
const productOf = (page) => page.split('/')[0];
const titleOf = (file) => (readFileSync(file, 'utf8').match(/^title:\s*"(.+)"/m) || [, '?'])[1];

/** Índices de línea de los encabezados ## y ### (ignorando bloques de código). */
function headingLines(lines) {
  const idx = [];
  let inCode = false;
  lines.forEach((l, i) => {
    if (/^```/.test(l)) inCode = !inCode;
    if (!inCode && /^#{2,3} /.test(l)) idx.push(i);
  });
  return idx;
}

const { capturas } = JSON.parse(readFileSync(CATALOG, 'utf8'));
const cardOf = (page, file) => capturas.find((c) => c.page === page && c.file === file);

// ── Recorrer las páginas y emparejar cada imagen con su ficha ────────────────
const pages = [...new Set(capturas.map((c) => c.page))];
const shots = [];
const sinFicha = [];

for (const page of pages.sort()) {
  const en = readFileSync(pageFile('en', page), 'utf8').split(/\r?\n/);
  const es = readFileSync(pageFile('es', page), 'utf8').split(/\r?\n/);
  const enHeads = headingLines(en);
  const esHeads = headingLines(es);

  en.forEach((line, i) => {
    const m = line.match(/^!\[[^\]]*\]\((\/docs-images\/[^)]+)\)/);
    if (!m) return;
    const file = m[1].split('/').pop();
    const before = enHeads.filter((h) => h < i);
    const hIdx = before.length ? enHeads.indexOf(before[before.length - 1]) : -1;
    const card = cardOf(page, file);
    if (!card) sinFicha.push(`${page} → ${file}`);
    shots.push({
      page,
      file,
      product: productOf(page),
      sectionEn: hIdx >= 0 ? en[enHeads[hIdx]].replace(/^#+ /, '') : '(entradilla)',
      sectionEs:
        hIdx >= 0 && esHeads[hIdx] !== undefined ? es[esHeads[hIdx]].replace(/^#+ /, '') : '(entradilla)',
      prioridad: card?.prioridad ?? 3,
      vista: card?.vista ?? '',
      captura: card?.captura ?? '',
      tomada: existsSync(join(ROOT, 'public/docs-images', productOf(page), file)),
    });
  });
}

const huerfanas = capturas.filter(
  (c) => !shots.some((s) => s.page === c.page && s.file === c.file),
);

// ── Escribir el documento ────────────────────────────────────────────────────
const total = shots.length;
const tomadas = shots.filter((s) => s.tomada).length;
const conPrioridad = (n) => shots.filter((s) => s.prioridad === n);

const out = [];
out.push('# Capturas de pantalla');
out.push('');
out.push('Guion de capturas de toda la documentación. Cada ficha dice **dónde aparece** la imagen en el sitio,');
out.push('**desde qué vista** se toma y **qué tiene que verse** en ella.');
out.push('');
out.push('Las páginas ya enlazan todas estas rutas: basta con dejar el PNG con el nombre exacto en');
out.push('`public/docs-images/<producto>/`. Una captura que todavía no existe se oculta sola al renderizar, así');
out.push('que el sitio nunca muestra una imagen rota.');
out.push('');
out.push('> **Generado.** Este archivo lo produce `npm run doc:shots` a partir de las páginas y de');
out.push('> `docs/screenshots.json`. No lo edites a mano: edita la página (para mover o quitar una imagen) o el');
out.push('> catálogo (para cambiar la prioridad, la vista o el guion de una captura) y vuelve a generarlo.');
out.push('');
out.push('## Estado');
out.push('');
out.push('| | Total | Tomadas | Pendientes |');
out.push('|---|---:|---:|---:|');
for (const n of [1, 2, 3]) {
  const list = conPrioridad(n);
  const hechas = list.filter((s) => s.tomada).length;
  out.push(`| ${PRIORITY_LABEL[n]} | ${list.length} | ${hechas} | ${list.length - hechas} |`);
}
out.push(`| **Total** | **${total}** | **${tomadas}** | **${total - tomadas}** |`);
out.push('');
out.push('**Prioridades.** P1 es donde el texto solo no basta: la ventana principal y sus pestañas, los');
out.push('asistentes, las grillas y las pantallas que ve el jugador. P2 completa una página que ya se entiende.');
out.push('P3 es un extra: si no la tomas, no se nota.');
out.push('');
out.push('## Cómo tomarlas');
out.push('');
out.push('- **Recorta a la ventana o al panel**, nunca el editor entero.');
out.push('- **Un tema de editor para todas** (claro u oscuro, pero el mismo siempre).');
out.push('- **Con datos de verdad.** Una grilla vacía o un inspector sin rellenar no enseña nada; por eso casi');
out.push('  todas las fichas piden un estado concreto.');
out.push('- **Nombre de archivo exacto**, en minúsculas y con guiones, tal cual aparece aquí.');
out.push('- PNG, entre 900 y 1600 px de ancho. Si la ventana es enorme, encógela antes de capturar en lugar de');
out.push('  escalar la imagen después.');
out.push('- Si decides que una captura no merece la pena, borra su línea `![...](...)` de la página EN **y** de');
out.push('  la ES, quita su ficha del catálogo y regenera este archivo.');
out.push('');

for (const [product, name] of PRODUCTS) {
  const list = shots.filter((s) => s.product === product);
  if (!list.length) continue;
  const pend = list.filter((s) => !s.tomada).length;
  out.push(`## ${name}`);
  out.push('');
  out.push(`Carpeta destino: \`public/docs-images/${product}/\` · ${pend} pendientes de ${list.length}.`);
  out.push('');
  let currentPage = null;
  for (const s of list) {
    if (s.page !== currentPage) {
      currentPage = s.page;
      out.push(`### ${titleOf(pageFile('en', s.page))} · ${titleOf(pageFile('es', s.page))}`);
      out.push('');
      out.push(`\`/docs/${s.page}/\` — \`/es/docs/${s.page}/\``);
      out.push('');
    }
    out.push(`#### \`${s.file}\` — P${s.prioridad} ${s.tomada ? '· ✅ tomada' : '· ⬜ pendiente'}`);
    out.push('');
    out.push(`- **Sección:** ${s.sectionEn} · ${s.sectionEs}`);
    if (s.vista) out.push(`- **Vista:** ${s.vista}`);
    if (s.captura) out.push(`- **Qué tiene que verse:** ${s.captura}`);
    out.push('');
  }
}

writeFileSync(OUT, out.join('\n'), 'utf8');

console.log(`✓ docs/SCREENSHOTS.md: ${total} capturas (${tomadas} tomadas, ${total - tomadas} pendientes).`);
if (sinFicha.length) {
  console.log(`⚠ ${sinFicha.length} imagen(es) enlazadas sin ficha en docs/screenshots.json:`);
  for (const s of sinFicha) console.log('   ' + s);
}
if (huerfanas.length) {
  console.log(`⚠ ${huerfanas.length} ficha(s) del catálogo que ninguna página enlaza:`);
  for (const c of huerfanas) console.log(`   ${c.page} → ${c.file}`);
}
