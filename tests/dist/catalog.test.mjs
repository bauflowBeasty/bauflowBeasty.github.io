// Catálogo de la portada: tarjetas de portada, destacado oculto en «Todo», filtros dinámicos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, count } from './helpers.mjs';

for (const route of ['/', '/es/']) {
  test(`${route} renders one project card per product`, () => {
    assert.equal(count(page(route), /class="project-card[ "]/), 3);
  });

  test(`${route} hides only the featured card (Visual Novel) under «All»`, () => {
    const cards = [...page(route).matchAll(/<a class="project-card[^>]*>/g)].map((m) => m[0]);
    const featured = cards.filter((c) => /\bdata-featured\b/.test(c));
    assert.equal(featured.length, 1);
    assert.match(featured[0], /\bhidden\b/);
    assert.match(featured[0], /beasty-visual-novel/);
    assert.equal(cards.filter((c) => /\bhidden\b/.test(c)).length, 1);
  });

  test(`${route} shows no filters while every project is on a single platform`, () => {
    assert.doesNotMatch(page(route), /class="catalog-filters/);
  });

  test(`${route} no longer uses the old product grid`, () => {
    assert.doesNotMatch(page(route), /product-grid/);
  });
}

test('Spanish cards link to the Spanish docs', () => {
  const hrefs = [...page('/es/').matchAll(/<a class="project-card[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(hrefs.length, 3);
  for (const h of hrefs) assert.ok(h.startsWith('/es/docs/'), h);
});
