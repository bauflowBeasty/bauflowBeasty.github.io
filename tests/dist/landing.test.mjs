// Portada: entrada con los textos de siempre, proyecto destacado, ecosistema visual,
// y portada o marcador según exista la imagen de cada proyecto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './helpers.mjs';
import { UI } from '../../src/data/ui-strings.ts';
import { PRODUCTS } from '../../src/data/products.ts';
import { getFeatured, projectHref } from '../../src/lib/catalog.ts';

const COVERS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'assets', 'covers');
const hasCover = (id) => ['png', 'jpg', 'jpeg', 'webp'].some((ext) => existsSync(join(COVERS, `${id}.${ext}`)));

// Astro escapa ' y " en el HTML; los textos se comparan con esas entidades resueltas.
const decode = (html) => html.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

for (const [route, lang] of [['/', 'en'], ['/es/', 'es']]) {
  const html = () => decode(page(route));

  test(`${route} keeps the welcome title`, () => {
    assert.ok(html().includes(UI[lang]['hero.title']));
  });

  test(`${route} shows the featured project with its version`, () => {
    const block = html().match(/<section[^>]*id="featured"[\s\S]*?<\/section>/);
    assert.ok(block, 'no hay #featured');
    assert.ok(block[0].includes('Beasty Visual Novel'));
    assert.ok(block[0].includes('v1.1.0'));
  });

  test(`${route} drops the fake code window`, () => {
    assert.ok(!html().includes('welcome.vnbeasty'));
  });

  test(`${route} keeps the three ecosystem texts`, () => {
    for (const key of ['ecosystem.note1', 'ecosystem.note2', 'ecosystem.requirements']) {
      assert.ok(html().includes(UI[lang][key]), key);
    }
  });

  test(`${route} replaces the ASCII ecosystem diagram`, () => {
    assert.ok(!html().includes('eco-diagram'));
  });

  test(`${route} shows a cover or a placeholder for every project`, () => {
    const all = html();
    const featured = getFeatured(PRODUCTS);
    for (const p of PRODUCTS) {
      let chunk;
      if (p.id === featured.id) {
        chunk = all.match(/<section[^>]*id="featured"[\s\S]*?<\/section>/)[0];
      } else {
        const href = projectHref(p, lang);
        chunk = all.split(/(?=<a class="project-card[ "])/).find((c) => c.startsWith('<a class="project-card') && c.includes(`href="${href}"`));
        assert.ok(chunk, `no encuentro la tarjeta de ${p.id}`);
        chunk = chunk.slice(0, chunk.indexOf('</a>'));
      }
      if (hasCover(p.id)) {
        assert.match(chunk, /<img/, `${p.id} debería mostrar su portada`);
      } else {
        assert.match(chunk, /cover--placeholder/, `${p.id} debería mostrar el marcador`);
        assert.doesNotMatch(chunk, /<img/, `${p.id} no debería tener <img>`);
      }
    }
  });
}
