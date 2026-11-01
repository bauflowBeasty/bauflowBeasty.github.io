// Utilidades para los tests que leen la salida del build (dist/).
// Ejecutar SIEMPRE después de `npm run build`.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist');

/** HTML de `dist${route}index.html`; `route` empieza y acaba en '/'. */
export function page(route) {
  if (!existsSync(DIST)) throw new Error('No existe dist/: ejecuta `npm run build` antes de `npm run test:dist`.');
  if (!route.startsWith('/') || !route.endsWith('/')) throw new Error(`Ruta inválida «${route}»: debe empezar y acabar en «/».`);
  const file = join(DIST, ...route.split('/').filter(Boolean), 'index.html');
  if (!existsSync(file)) throw new Error(`No existe ${file} (¿ruta mal escrita o build desactualizado?).`);
  return readFileSync(file, 'utf8');
}

/** Número de coincidencias de `re` en `html` (se fuerza la bandera global). */
export function count(html, re) {
  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
  return [...html.matchAll(new RegExp(re.source, flags))].length;
}
