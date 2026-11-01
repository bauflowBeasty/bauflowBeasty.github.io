import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serveDist } from '../../scripts/lib/serve-dist.mjs';

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'serve-dist-'));
  writeFileSync(join(dir, 'index.html'), '<h1>home</h1>');
  mkdirSync(join(dir, 'docs', 'x'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'x', 'index.html'), '<h1>x</h1>');
  writeFileSync(join(dir, 'style.css'), 'body{}');
  writeFileSync(join(dir, 'data.pf_meta'), 'bin');
  return dir;
}

test('serves directory routes as index.html with the right types', async () => {
  const dir = fixture();
  const srv = await serveDist(dir);
  try {
    const home = await fetch(`${srv.url}/`);
    assert.equal(home.status, 200);
    assert.match(home.headers.get('content-type'), /text\/html/);
    assert.equal(await home.text(), '<h1>home</h1>');

    const page = await fetch(`${srv.url}/docs/x/`);
    assert.equal(await page.text(), '<h1>x</h1>');

    const css = await fetch(`${srv.url}/style.css`);
    assert.match(css.headers.get('content-type'), /text\/css/);

    const bin = await fetch(`${srv.url}/data.pf_meta`);
    assert.match(bin.headers.get('content-type'), /application\/octet-stream/);
  } finally {
    await srv.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('answers 404 for missing files and refuses to leave the root', async () => {
  const dir = fixture();
  const srv = await serveDist(dir);
  try {
    assert.equal((await fetch(`${srv.url}/nope/`)).status, 404);
    assert.equal((await fetch(`${srv.url}/..%2F..%2Fetc%2Fpasswd`)).status, 404);
  } finally {
    await srv.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
