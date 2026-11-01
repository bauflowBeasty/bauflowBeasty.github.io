// Línea base del CONTENIDO del sitio: textos de interfaz (ui-strings), textos de
// producto (products.ts) y una huella de todas las páginas de docs.
//
// El rework visual no puede cambiar ningún texto existente; tests/unit/content-guard
// compara el estado actual contra tests/fixtures/content-baseline.json.
//
// Si un cambio de contenido es intencionado (p. ej. /sync-docs), regenerar con:
//   npm run content:baseline

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = join(ROOT, 'src', 'content', 'docs');
export const BASELINE_FILE = join(ROOT, 'tests', 'fixtures', 'content-baseline.json');

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(join(dir, e.name)) : [join(dir, e.name)]
  );
}

/** sha256 de (ruta relativa con '/' + "\0" + bytes) de cada archivo de docs, en orden de ruta. */
export function docsHash(dir = DOCS_DIR) {
  const files = listFiles(dir)
    .map((abs) => ({ abs, rel: relative(dir, abs).split(sep).join('/') }))
    .sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  const hash = createHash('sha256');
  for (const f of files) {
    hash.update(f.rel);
    hash.update('\0');
    hash.update(readFileSync(f.abs));
  }
  return hash.digest('hex');
}

export async function computeBaseline() {
  const { UI } = await import(pathToFileURL(join(ROOT, 'src', 'data', 'ui-strings.ts')).href);
  const { PRODUCTS } = await import(pathToFileURL(join(ROOT, 'src', 'data', 'products.ts')).href);
  const products = {};
  for (const p of PRODUCTS) {
    products[p.id] = {
      name: p.name,
      tagline: p.tagline,
      blurb: p.blurb,
      labels: p.storeLinks.map((l) => l.label),
    };
  }
  return { ui: UI, products, docsHash: docsHash() };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const base = await computeBaseline();
  mkdirSync(dirname(BASELINE_FILE), { recursive: true });
  writeFileSync(BASELINE_FILE, JSON.stringify(base, null, 2) + '\n');
  console.log(
    `content-baseline: ${Object.keys(base.ui).length} idiomas, ${Object.keys(base.products).length} productos, docsHash ${base.docsHash}`
  );
}
