import { test } from 'node:test';
import assert from 'node:assert/strict';
import rehypeCallouts, { classifyCallout } from '../../src/plugins/rehype-callouts.mjs';

test('warnings and important notes are classified as warn (EN and ES)', () => {
  for (const label of ['Warning', 'Advertencia', 'Important', 'Importante', 'WARNING:', 'advertencia.']) {
    assert.equal(classifyCallout(label), 'warn', label);
  }
});

test('anything else is a note', () => {
  for (const label of ['Note', 'Nota', 'WebGL is not supported.', 'Sin spoilers.', '']) {
    assert.equal(classifyCallout(label), 'note', label);
  }
});

const el = (tagName, children = [], properties = {}) => ({ type: 'element', tagName, properties, children });
const txt = (value) => ({ type: 'text', value });

test('rehypeCallouts tags a blockquote by the bold word that opens it', () => {
  const quote = el('blockquote', [el('p', [el('strong', [txt('Advertencia')]), txt(' no lo importes dos veces.')])]);
  const tree = { type: 'root', children: [quote] };
  rehypeCallouts()(tree);
  assert.deepEqual(quote.properties.className, ['callout', 'callout--warn']);
});

test('rehypeCallouts treats a blockquote without a bold opener as a note', () => {
  const quote = el('blockquote', [txt('\n'), el('p', [txt('Just a quote.')])]);
  const tree = { type: 'root', children: [el('div', [quote])] };
  rehypeCallouts()(tree);
  assert.deepEqual(quote.properties.className, ['callout', 'callout--note']);
});
