import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getFeatured, platformFilters, isCardVisible, projectHref } from '../../src/lib/catalog.ts';

const base = { name: 'X', version: '1.0.0', tagline: { en: '', es: '' }, blurb: { en: '', es: '' }, storeLinks: [] };
const A = { ...base, id: 'a', platforms: ['unity'] };
const B = { ...base, id: 'b', platforms: ['android', 'ios'], featured: true };
const C = { ...base, id: 'c', platforms: ['pc', 'unity'] };

test('getFeatured returns the product flagged as featured', () => {
  assert.equal(getFeatured([A, B, C]).id, 'b');
});

test('getFeatured falls back to the first product when none is flagged', () => {
  assert.equal(getFeatured([A, C]).id, 'a');
});

test('getFeatured throws on an empty list', () => {
  assert.throws(() => getFeatured([]), /No products/);
});

test('platformFilters counts every product per platform in platform order', () => {
  assert.deepEqual(platformFilters([A, B, C]), [
    { id: 'unity', count: 2 },
    { id: 'android', count: 1 },
    { id: 'ios', count: 1 },
    { id: 'pc', count: 1 },
  ]);
});

test('platformFilters is empty when there is a single platform', () => {
  assert.deepEqual(platformFilters([A]), []);
});

test('isCardVisible hides the featured card under "all"', () => {
  assert.equal(isCardVisible({ platforms: ['unity'], featured: true }, 'all'), false);
});

test('isCardVisible shows the featured card under a matching platform', () => {
  assert.equal(isCardVisible({ platforms: ['unity'], featured: true }, 'unity'), true);
});

test('isCardVisible matches any of a multi-platform card', () => {
  assert.equal(isCardVisible({ platforms: ['android', 'ios'], featured: false }, 'ios'), true);
  assert.equal(isCardVisible({ platforms: ['android', 'ios'], featured: false }, 'pc'), false);
});

test('projectHref points to docs, prefixed by language', () => {
  assert.equal(projectHref({ id: 'x', docsEntry: '/docs/x/' }, 'es'), '/es/docs/x/');
});

test('projectHref points to the generated project page when there are no docs', () => {
  assert.equal(projectHref({ id: 'y' }, 'en'), '/projects/y/');
});
