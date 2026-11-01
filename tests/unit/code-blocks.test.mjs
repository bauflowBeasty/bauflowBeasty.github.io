import { test } from 'node:test';
import assert from 'node:assert/strict';
import { languageLabel } from '../../src/scripts/code-blocks.ts';

test('known languages get a friendly label', () => {
  assert.equal(languageLabel('csharp'), 'C#');
  assert.equal(languageLabel('cs'), 'C#');
  assert.equal(languageLabel('json'), 'JSON');
  assert.equal(languageLabel('bash'), 'Shell');
  assert.equal(languageLabel('powershell'), 'PowerShell');
});

test('plain text and missing languages get no label', () => {
  assert.equal(languageLabel('text'), '');
  assert.equal(languageLabel('plaintext'), '');
  assert.equal(languageLabel(undefined), '');
});

test('unknown languages are shown in capitals', () => {
  assert.equal(languageLabel('gdscript'), 'GDSCRIPT');
});
