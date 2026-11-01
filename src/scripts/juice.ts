/**
 * «Modo juego» pointer effects: 3D tilt that follows the cursor and a spotlight.
 * They only write CSS custom properties; the look lives in each component's CSS.
 * No-ops with prefers-reduced-motion or on touch (coarse) pointers.
 */

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function coarsePointer(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
}

/** px, py: pointer position inside the element, 0..1. Returns degrees for rotateX/rotateY. */
export function tiltAngles(px: number, py: number, maxDeg: number): { rx: number; ry: number } {
  return { rx: (0.5 - py) * 2 * maxDeg, ry: (px - 0.5) * 2 * maxDeg };
}

/** Writes --rx/--ry (deg) and --sx/--sy (% for the shine) while the pointer moves over `el`. */
export function attachTilt(el: HTMLElement, maxDeg = 7): void {
  if (prefersReducedMotion() || coarsePointer()) return;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const { rx, ry } = tiltAngles(px, py, maxDeg);
    el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    el.style.setProperty('--sx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--sy', `${(py * 100).toFixed(1)}%`);
  });
  el.addEventListener('pointerleave', () => {
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  });
}

/** Writes --mx/--my (px) so a radial highlight can follow the cursor over `el`. */
export function attachSpotlight(el: HTMLElement): void {
  if (prefersReducedMotion() || coarsePointer()) return;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
    el.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
  });
}
