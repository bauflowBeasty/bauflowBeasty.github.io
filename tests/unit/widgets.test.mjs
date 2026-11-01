import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unityWidget, itchWidget } from '../../src/lib/widgets.ts';

const UNITY = 'https://assetstore.unity.com/linkmaker/embed/package/393138';

test('unity wide widget, dark and light variants', () => {
  assert.deepEqual(unityWidget('393138', 'dark', 'wide'), { src: `${UNITY}/widget-wide`, width: 600, height: 130 });
  assert.deepEqual(unityWidget('393138', 'light', 'wide'), { src: `${UNITY}/widget-wide-light`, width: 600, height: 130 });
});

test('unity narrow widget, dark and light variants', () => {
  assert.deepEqual(unityWidget('393138', 'dark', 'narrow'), { src: `${UNITY}/widget`, width: 202, height: 260 });
  assert.deepEqual(unityWidget('393138', 'light', 'narrow'), { src: `${UNITY}/widget-light`, width: 202, height: 260 });
});

test('itch widget adds dark=true only in the dark theme', () => {
  assert.deepEqual(itchWidget('4897713', 'dark'), {
    src: 'https://itch.io/embed/4897713?linkback=true&dark=true',
    width: 552,
    height: 167,
  });
  assert.deepEqual(itchWidget('4897713', 'light'), {
    src: 'https://itch.io/embed/4897713?linkback=true',
    width: 552,
    height: 167,
  });
});
