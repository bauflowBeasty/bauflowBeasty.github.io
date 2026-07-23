/**
 * Genera docs/DOC-INDEX.md: el índice de contenido de la documentación.
 *
 * Responde en una sola lectura a «cambió el símbolo X, ¿qué páginas lo documentan?», sin
 * abrir las 83 páginas. Se construye a partir de las páginas EN (canónicas); cada página ES
 * es el espejo de la misma ruta con el prefijo /es.
 *
 * Uso: npm run doc:index
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const EN = join('src', 'content', 'docs', 'en');
const OUT = join('docs', 'DOC-INDEX.md');

/** Prefijo corto por producto: mantiene legible el índice inverso. */
const SIGLA = {
  'beasty-visual-novel': 'VN',
  'beasty-save-system': 'SS',
  'beasty-console': 'BC',
};

/** Símbolos demasiado genéricos para servir de pista: aparecen en casi cualquier página. */
const RUIDO = new Set([
  'True', 'False', 'Null', 'Windows', 'Unity', 'Mono', 'IL2CPP', 'WebGL', 'Android', 'iOS',
  'macOS', 'Linux', 'JSON', 'AES', 'SHA', 'UTF', 'GUID', 'UI', 'API', 'OK', 'ID', 'CPU', 'GPU',
]);

function mdFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...mdFiles(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** 'beasty-x/guides/y.md' -> '/docs/beasty-x/guides/y/' ; index -> raíz del producto. */
function routeFor(rel) {
  let path = rel.replace(/\.md$/i, '');
  if (path.endsWith('/index')) path = path.slice(0, -'/index'.length);
  return `/docs/${path}/`;
}

/**
 * Identificadores de código de la página: solo los de los spans `así`, no los bloques
 * cercados (un bloque de ejemplo mete ruido de C# que no identifica a la página).
 */
function simbolos(body) {
  const sinBloques = body.replace(/```[\s\S]*?```/g, '');
  const encontrados = new Set();
  for (const [, span] of sinBloques.matchAll(/`([^`\n]+)`/g)) {
    const limpio = span.trim().replace(/\(\)$/, '').replace(/[.,;:]$/, '');
    // PascalCase, opcionalmente con puntos: BeastySave, LoadResult.MigratedFrom, BeastySaveLog.Level
    if (!/^[A-Z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)*$/.test(limpio)) continue;
    if (limpio.length < 3 || RUIDO.has(limpio)) continue;
    encontrados.add(limpio);
  }
  return [...encontrados].sort();
}

const paginas = [];
for (const file of mdFiles(EN)) {
  const rel = relative(EN, file).split(sep).join('/');
  const raw = readFileSync(file, 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = fm ? raw.slice(fm[0].length) : raw;
  const title = (fm?.[1].match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] ?? rel).trim();
  const secciones = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1].trim());
  const producto = rel.split('/')[0];
  paginas.push({
    producto,
    rel,
    // Identificador corto: SS/guides/logging. Es la clave que usa el índice inverso.
    id: `${SIGLA[producto] ?? producto}/${rel.slice(producto.length + 1).replace(/\.md$/, '')}`,
    ruta: routeFor(rel),
    title,
    secciones,
    simbolos: simbolos(body),
  });
}

// Índice inverso: símbolo -> páginas que lo mencionan.
const porSimbolo = new Map();
for (const p of paginas) {
  for (const s of p.simbolos) {
    if (!porSimbolo.has(s)) porSimbolo.set(s, []);
    porSimbolo.get(s).push(p.id);
  }
}

const productos = [...new Set(paginas.map((p) => p.producto))].sort();
const L = [];
L.push('# DOC-INDEX — índice de contenido de la documentación');
L.push('');
L.push(`> Generado por \`scripts/doc-index.mjs\` — **no editar a mano**. Regenerar: \`npm run doc:index\`.`);
L.push('>');
L.push('> **Cómo se usa:** ante un cambio de código, buscar el símbolo en el «Índice inverso» de abajo;');
L.push('> ahí están los identificadores de las páginas que lo documentan.');
L.push('');
L.push('**Identificadores.** `SS/guides/logging` es `src/content/docs/en/beasty-save-system/guides/logging.md`,');
L.push('y su espejo español es el mismo archivo bajo `es/`. Siglas: ' +
  productos.map((p) => `\`${SIGLA[p] ?? p}\` = ${p}`).join(' · ') + '.');
L.push('');
L.push(`Cobertura: **${paginas.length} páginas** EN (y sus ${paginas.length} espejos ES), ` +
  `**${porSimbolo.size} símbolos** indexados.`);
L.push('');

L.push('## Páginas');
L.push('');
for (const prod of productos) {
  const delProducto = paginas.filter((p) => p.producto === prod);
  L.push(`### ${prod} — \`${SIGLA[prod] ?? prod}\` (${delProducto.length} páginas)`);
  L.push('');
  L.push('| Página | Título | Secciones |');
  L.push('|---|---|---|');
  for (const p of delProducto.sort((a, b) => a.id.localeCompare(b.id))) {
    const secs = p.secciones.length ? p.secciones.join(' · ') : '—';
    L.push(`| \`${p.id}\` | ${p.title} | ${secs} |`);
  }
  L.push('');
}

L.push('## Índice inverso: símbolo → páginas que lo documentan');
L.push('');
L.push('| Símbolo | Páginas |');
L.push('|---|---|');
for (const [simbolo, refs] of [...porSimbolo.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  L.push(`| \`${simbolo}\` | ${refs.sort().join(' ')} |`);
}
L.push('');

writeFileSync(OUT, L.join('\n'), 'utf8');
console.log(`✓ ${OUT}: ${paginas.length} páginas, ${porSimbolo.size} símbolos indexados.`);
