// Coherencia de los datos reales de src/data/products.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../../src/data/products.ts';
import { PLATFORMS } from '../../src/data/platforms.ts';
import { STORES } from '../../src/data/stores.ts';

test('product ids are unique', () => {
  const ids = PRODUCTS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every product has at least one known platform', () => {
  for (const p of PRODUCTS) {
    assert.ok(Array.isArray(p.platforms) && p.platforms.length > 0, `${p.id} sin plataformas`);
    for (const pl of p.platforms) assert.ok(pl in PLATFORMS, `${p.id}: plataforma desconocida «${pl}»`);
  }
});

test('every store link uses a known store', () => {
  for (const p of PRODUCTS) {
    for (const l of p.storeLinks) assert.ok(l.store in STORES, `${p.id}: tienda desconocida «${l.store}»`);
  }
});

test('every published link to a store with a widget has a widgetId', () => {
  for (const p of PRODUCTS) {
    for (const l of p.storeLinks) {
      if (l.url && STORES[l.store].widget) assert.ok(l.widgetId, `${p.id}/${l.store} sin widgetId`);
    }
  }
});

test('at most one product is featured', () => {
  assert.ok(PRODUCTS.filter((p) => p.featured).length <= 1);
});
