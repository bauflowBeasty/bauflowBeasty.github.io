// «Dónde conseguirlo»: solo en la página de proyecto (índice de docs), widgets como
// fachadas (sin iframes en el HTML), dentro del artículo pero fuera de la búsqueda.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, count } from './helpers.mjs';
import { getProduct } from '../../src/data/products.ts';

const vn = getProduct('beasty-visual-novel');
const section = (html) => {
  const m = html.match(/<section class="where-to-get"[\s\S]*?<\/section>/);
  assert.ok(m, 'no hay sección where-to-get');
  return m[0];
};

for (const route of ['/docs/beasty-visual-novel/', '/es/docs/beasty-visual-novel/']) {
  test(`${route} has one where-to-get section with a widget per store`, () => {
    const html = page(route);
    assert.equal(count(html, /<section class="where-to-get"/), 1);
    assert.equal(count(section(html), /class="store-widget"/), 2);
  });

  test(`${route} ships no iframe in the static HTML`, () => {
    assert.equal(count(page(route), /<iframe/), 0);
  });

  test(`${route} facades link to each store without JavaScript`, () => {
    const s = section(page(route));
    for (const link of vn.storeLinks.filter((l) => l.url)) {
      assert.ok(s.includes(`href="${link.url}"`), `falta el enlace a ${link.store}`);
    }
  });

  test(`${route} keeps the section inside the article and out of the search index`, () => {
    const html = page(route);
    const article = html.match(/<article class="doc-content"[\s\S]*?<\/article>/)[0];
    assert.match(article, /<section class="where-to-get"[^>]*data-pagefind-ignore/);
  });
}

test('regular docs pages have no where-to-get section', () => {
  assert.doesNotMatch(page('/docs/beasty-save-system/getting-started/save-with-code/'), /where-to-get/);
});
