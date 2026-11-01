import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tiltAngles } from '../../src/scripts/juice.ts';

test('tiltAngles is flat at the centre', () => {
  const { rx, ry } = tiltAngles(0.5, 0.5, 7);
  assert.equal(rx + 0, 0);
  assert.equal(ry + 0, 0);
});

test('tiltAngles leans toward the top-right corner', () => {
  assert.deepEqual(tiltAngles(1, 0, 7), { rx: 7, ry: 7 });
});

test('tiltAngles leans toward the bottom-left corner', () => {
  assert.deepEqual(tiltAngles(0, 1, 7), { rx: -7, ry: -7 });
});
