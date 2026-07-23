/**
 * One-shot migration: Documentation/<product>/**\/*.md
 *   -> src/content/docs/en/<product>/... with frontmatter + site-route links.
 *
 * - First `# H1` becomes frontmatter `title` and is removed from the body.
 * - Relative .md links become absolute site routes (/docs/<product>/.../).
 * - README.md becomes index.md (route /docs/<product>/).
 * - Image links move to /docs-images/<product>/<file>.
 *
 * Usage: node scripts/migrate-docs.mjs
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, posix, relative, sep } from 'node:path';

const SRC = 'Documentation';
const DEST = join('src', 'content', 'docs', 'en');
const PRODUCTS = ['beasty-visual-novel', 'beasty-save-system', 'beasty-console'];

/** Recursively list .md files under dir. */
function mdFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...mdFiles(p));
    else if (entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** 'Documentation/x/y.md' -> POSIX 'x/y.md' relative to SRC. */
function relPosix(file) {
  return relative(SRC, file).split(sep).join('/');
}

/** Resolve a relative link target against the containing file's dir. */
function resolveTarget(fileRel, target) {
  return posix.normalize(posix.join(posix.dirname(fileRel), target));
}

/** 'beasty-x/guides/y.md' -> '/docs/beasty-x/guides/y/' ; README -> product root. */
function routeFor(resolved) {
  let path = resolved.replace(/\.md$/i, '');
  if (posix.basename(path) === 'README') path = posix.dirname(path);
  return `/docs/${path}/`;
}

function migrateFile(file) {
  const fileRel = relPosix(file); // e.g. beasty-save-system/guides/settings.md
  const product = fileRel.split('/')[0];
  let body = readFileSync(file, 'utf8');

  // Title: first H1.
  const h1 = body.match(/^#\s+(.+?)\s*$/m);
  const title = h1 ? h1[1].trim() : posix.basename(fileRel, '.md');
  if (h1) body = body.replace(h1[0], '').replace(/^\s+/, '');

  // Description: first non-empty, non-markup paragraph line.
  const para = body
    .split(/\r?\n\r?\n/)
    .map((s) => s.trim())
    .find((s) => s && !s.startsWith('#') && !s.startsWith('|') && !s.startsWith('```') && !s.startsWith('>') && !s.startsWith('!['));
  const description = para
    ? para.replace(/\r?\n/g, ' ').replace(/[*_`\[\]]/g, '').replace(/\(([^)]*)\)/g, '').slice(0, 158).trim()
    : undefined;

  // Rewrite links, skipping fenced code blocks.
  const segments = body.split(/(```[\s\S]*?```)/);
  body = segments
    .map((seg, i) => {
      if (i % 2 === 1) return seg; // inside a code fence
      return seg.replace(/\]\(([^)\s]+?)(#[^)\s]*)?\)/g, (m, target, anchor = '') => {
        if (/^(https?:|mailto:|#)/.test(target)) return m;
        const resolved = resolveTarget(fileRel, target);
        if (/\.md$/i.test(target)) {
          return `](${routeFor(resolved)}${anchor})`;
        }
        if (/images\//.test(resolved)) {
          const name = posix.basename(resolved);
          return `](/docs-images/${product}/${name}${anchor})`;
        }
        return m;
      });
    })
    .join('');

  const outRel = fileRel.replace(/README\.md$/i, 'index.md');
  const outPath = join(DEST, ...outRel.split('/'));
  mkdirSync(dirname(outPath), { recursive: true });

  const fm = [`title: ${JSON.stringify(title)}`];
  if (description) fm.push(`description: ${JSON.stringify(description)}`);
  writeFileSync(outPath, `---\n${fm.join('\n')}\n---\n\n${body}`, 'utf8');
  return outRel;
}

let count = 0;
for (const product of PRODUCTS) {
  for (const file of mdFiles(join(SRC, product))) {
    const out = migrateFile(file);
    count++;
    console.log('migrated', out);
  }
  mkdirSync(join('public', 'docs-images', product), { recursive: true });
}
console.log(`\n${count} files migrated to ${DEST}`);
