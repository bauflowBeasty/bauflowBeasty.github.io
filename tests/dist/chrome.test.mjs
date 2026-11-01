// Cabecera común: menú «Proyectos» (details, funciona sin JS) y búsqueda global diferida.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, count } from './helpers.mjs';

for (const route of ['/', '/es/', '/contact/']) {
  test(`${route} has the projects menu and the search dialog`, () => {
    const html = page(route);
    assert.match(html, /<details class="projects-menu/);
    assert.match(html, /data-search-dialog/);
  });
}

test('the Spanish projects menu links to the Spanish docs', () => {
  const html = page('/es/');
  const menu = html.match(/<details class="projects-menu[\s\S]*?<\/details>/)[0];
  const hrefs = [...menu.matchAll(/<a[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(hrefs.length, 3);
  for (const h of hrefs) assert.ok(h.startsWith('/es/docs/'), h);
});

test('Pagefind is loaded lazily, not on page load', () => {
  assert.equal(count(page('/'), /<script[^>]*src="[^"]*pagefind-ui\.js/), 0);
});

test('the docs sidebar no longer hosts the search box', () => {
  assert.doesNotMatch(page('/docs/beasty-save-system/getting-started/save-with-code/'), /class="doc-search"/);
});
