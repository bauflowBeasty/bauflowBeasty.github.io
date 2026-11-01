// Páginas de documentación, variante «Limpia».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, count } from './helpers.mjs';

const SAVE_ES = '/es/docs/beasty-save-system/getting-started/save-with-code/';

test('the breadcrumb is human readable', () => {
  assert.match(page(SAVE_ES), /<p class="[^"]*\bdoc-crumb\b[^"]*"[^>]*>\s*Save System › Primeros pasos\s*</);
});

test('the overview page breadcrumb names the overview', () => {
  assert.match(page('/docs/beasty-visual-novel/'), /<p class="[^"]*\bdoc-crumb\b[^"]*"[^>]*>\s*Visual Novel › Overview\s*</);
});

test('the sidebar uses the project switcher, not the old product list', () => {
  const html = page(SAVE_ES);
  assert.match(html, /<details class="project-switcher/);
  assert.doesNotMatch(html, /class="product-switch"/);
  assert.doesNotMatch(html, /class="doc-search"/);
});

test('warnings are tagged as warn callouts', () => {
  // ES «Advertencia» on the Console logging guide.
  assert.match(page('/es/docs/beasty-console/guides/logging/'), /<blockquote class="callout callout--warn"/);
});

test('notes are tagged as note callouts', () => {
  // EN «Note» on the Console logging guide; no blockquote is left untagged.
  assert.match(page('/docs/beasty-console/guides/logging/'), /<blockquote class="callout callout--note"/);
  assert.equal(count(page('/docs/beasty-console/guides/logging/'), /<blockquote>/), 0);
});

test('code blocks use a single dark theme', () => {
  const html = page(SAVE_ES);
  assert.match(html, /<pre class="astro-code/);
  assert.doesNotMatch(html, /--shiki-dark/);
});

test('the overview page lists the other projects', () => {
  const html = page('/docs/beasty-visual-novel/');
  const block = html.match(/<section class="catalog"[\s\S]*?<\/section>/);
  assert.ok(block, 'no hay catálogo de otros proyectos');
  assert.ok(block[0].includes('Other projects'));
  assert.equal(count(block[0], /class="project-card[ "]/), 2);
});

test('the copy button labels travel with the article', () => {
  assert.match(page(SAVE_ES), /<article class="doc-content"[^>]*data-copy="Copiar"[^>]*data-copied="¡Copiado!"/);
});
