// Guardia del rework visual: ningún texto de contenido existente puede cambiar.
// Las claves y productos NUEVOS están permitidos; los existentes deben ser idénticos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BASELINE_FILE, computeBaseline } from '../../scripts/content-baseline.mjs';

const base = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));
const now = await computeBaseline();
const HINT = 'Si el cambio de contenido es intencionado, ejecuta npm run content:baseline';

test('every baseline UI string is unchanged', () => {
  for (const lang of Object.keys(base.ui)) {
    for (const [key, value] of Object.entries(base.ui[lang])) {
      assert.equal(now.ui[lang]?.[key], value, `ui-strings ${lang}.${key} cambió. ${HINT}`);
    }
  }
});

test('product texts are unchanged', () => {
  for (const [id, texts] of Object.entries(base.products)) {
    assert.deepEqual(now.products[id], texts, `products.ts «${id}» cambió de texto. ${HINT}`);
  }
});

test('docs content is unchanged', () => {
  assert.equal(now.docsHash, base.docsHash, `src/content/docs cambió. ${HINT}`);
});
