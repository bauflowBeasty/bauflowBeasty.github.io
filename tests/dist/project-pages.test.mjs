// Página de proyecto generada para los productos SIN documentación (/projects/<id>/).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { page, DIST } from './helpers.mjs';
import { PRODUCTS } from '../../src/data/products.ts';

const withoutDocs = PRODUCTS.filter((p) => !p.docsEntry);
const withDocs = PRODUCTS.filter((p) => p.docsEntry);

for (const p of withoutDocs) {
  for (const prefix of ['', '/es']) {
    test(`${prefix}/projects/${p.id}/ is generated with its name and where to get it`, () => {
      const html = page(`${prefix}/projects/${p.id}/`);
      assert.ok(html.includes(p.name), 'falta el nombre');
      assert.match(html, /<section class="where-to-get"/);
    });
  }
}

test('products with docs get no generated project page', () => {
  for (const p of withDocs) {
    assert.ok(!existsSync(join(DIST, 'projects', p.id)), `sobra dist/projects/${p.id}`);
    assert.ok(!existsSync(join(DIST, 'es', 'projects', p.id)), `sobra dist/es/projects/${p.id}`);
  }
});
