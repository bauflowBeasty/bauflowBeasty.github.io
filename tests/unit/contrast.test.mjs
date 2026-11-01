// Contraste AA (≥ 4.5:1) de los pares de texto del sistema visual, en ambos temas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'styles', 'tokens.css'),
  'utf8'
);

/** Hex tokens declared inside the first block whose selector matches `selectorRe`. */
function tokens(selectorRe) {
  const m = css.match(new RegExp(selectorRe.source + String.raw`\s*\{([^}]*)\}`));
  assert.ok(m, `no encuentro el bloque ${selectorRe}`);
  const out = {};
  for (const [, name, hex] of m[1].matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\b/g)) out[name] = hex;
  return out;
}

function luminance(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const THEMES = {
  dark: tokens(/:root,\s*html\[data-theme='dark'\]/),
  light: tokens(/html\[data-theme='light'\]/),
};

const PAIRS = [
  ...['text', 'text-muted', 'text-faint', 'accent-text', 'note', 'warn'].flatMap((fg) => [
    [fg, 'bg'],
    [fg, 'surface'],
  ]),
  ['accent-on', 'accent'],
  ['brand-on', 'brand-surface'],
  ['code-inline', 'bg'],
];

for (const [theme, t] of Object.entries(THEMES)) {
  for (const [fg, bg] of PAIRS) {
    test(`${theme}: --${fg} on --${bg} meets AA`, () => {
      assert.ok(t[fg] && t[bg], `faltan --${fg} o --${bg} en el tema ${theme}`);
      const r = ratio(t[fg], t[bg]);
      assert.ok(r >= 4.5, `${t[fg]} sobre ${t[bg]} = ${r.toFixed(2)}:1 (< 4.5)`);
    });
  }
}
