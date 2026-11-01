// Classifies the docs' callouts at build time WITHOUT touching the content:
// a blockquote that opens with **Warning** / **Advertencia** / **Important** /
// **Importante** becomes `callout callout--warn`; any other blockquote is a note
// (`callout callout--note`). Styles live in src/styles/doc.css.
// Plain JS (no Astro, no dependencies) so tests/unit can import it with Node.

const WARN = new Set(['warning', 'advertencia', 'important', 'importante']);

/** 'warn' for warning-like labels (EN/ES, any case, trailing punctuation ignored); else 'note'. */
export function classifyCallout(label) {
  const key = String(label ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s:.!;,]+$/, '');
  return WARN.has(key) ? 'warn' : 'note';
}

const isBlankText = (n) => n.type === 'text' && !n.value.trim();

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

/** The text of the <strong> that opens the blockquote's first paragraph, or ''. */
function openingLabel(blockquote) {
  const p = (blockquote.children ?? []).find((c) => c.type === 'element' && c.tagName === 'p');
  if (!p) return '';
  const first = (p.children ?? []).find((c) => !isBlankText(c));
  return first && first.type === 'element' && first.tagName === 'strong' ? textOf(first) : '';
}

function walk(node) {
  if (node.type === 'element' && node.tagName === 'blockquote') {
    node.properties ??= {};
    const prev = node.properties.className;
    const kept = (Array.isArray(prev) ? prev : prev ? [prev] : []).filter((c) => !String(c).startsWith('callout'));
    node.properties.className = [...kept, 'callout', `callout--${classifyCallout(openingLabel(node))}`];
  }
  for (const child of node.children ?? []) walk(child);
}

export default function rehypeCallouts() {
  return (tree) => {
    walk(tree);
  };
}
