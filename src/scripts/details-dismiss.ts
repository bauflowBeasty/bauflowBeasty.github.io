/**
 * Dropdowns built on <details data-dismiss>: they work without JS; this adds
 * Esc to close (focus back on the summary), click-outside to close, and
 * closes the others when one opens. Safe to call more than once.
 */

let ready = false;

export function initDetailsDismiss(): void {
  if (ready) return;
  ready = true;

  const all = () => Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-dismiss]'));

  document.addEventListener('click', (e) => {
    const target = e.target as Node;
    for (const d of all()) if (d.open && !d.contains(target)) d.open = false;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    for (const d of all()) {
      if (!d.open) continue;
      d.open = false;
      d.querySelector<HTMLElement>('summary')?.focus();
    }
  });

  for (const d of all()) {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      for (const other of all()) if (other !== d && other.open) other.open = false;
    });
  }
}
