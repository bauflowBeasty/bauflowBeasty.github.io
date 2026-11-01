/**
 * Store widgets with permission (spec §6.4): a facade until the visitor clicks
 * «Show … widget». With «Remember my choice» checked, the permission is stored
 * (lib/consent) and every widget loads, now and on later visits; «Stop loading…»
 * revokes it. Loaded iframes follow the site theme (light/dark variant).
 */
import { hasConsent, rememberConsent, revokeConsent } from '../lib/consent';
import { itchWidget, unityWidget, type Theme } from '../lib/widgets';

const storage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
})();

const theme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

function frameFor(widget: HTMLElement) {
  const id = widget.dataset.widgetId;
  if (!id) return null;
  if (widget.dataset.kind === 'unity') return unityWidget(id, theme(), widget.clientWidth >= 600 ? 'wide' : 'narrow');
  if (widget.dataset.kind === 'itch') return itchWidget(id, theme());
  return null;
}

function applyFrame(iframe: HTMLIFrameElement, f: { src: string; width: number; height: number }, kind?: string) {
  if (iframe.src !== f.src) iframe.src = f.src;
  iframe.height = String(f.height);
  if (kind === 'itch') {
    iframe.removeAttribute('width');
    iframe.style.width = '100%';
    iframe.style.maxWidth = `${f.width}px`;
  } else {
    iframe.width = String(f.width);
  }
}

function load(widget: HTMLElement) {
  if (widget.classList.contains('is-loaded')) return;
  const f = frameFor(widget);
  const box = widget.querySelector<HTMLElement>('.store-widget__frame');
  if (!f || !box) return;
  const iframe = document.createElement('iframe');
  iframe.loading = 'lazy';
  iframe.title = widget.dataset.storeLabel ?? '';
  applyFrame(iframe, f, widget.dataset.kind);
  box.replaceChildren(iframe);
  widget.classList.add('is-loaded');
}

function unload(widget: HTMLElement) {
  widget.querySelector('.store-widget__frame')?.replaceChildren();
  widget.classList.remove('is-loaded');
}

export function initStoreWidgets(doc: Document): void {
  doc.querySelectorAll<HTMLElement>('[data-where-to-get]').forEach((section) => {
    const widgets = Array.from(section.querySelectorAll<HTMLElement>('.store-widget'));
    if (widgets.length === 0) return;
    const consent = section.querySelector<HTMLElement>('.where-to-get__consent');
    const remember = section.querySelector<HTMLInputElement>('[data-widget-remember]');
    const revoke = section.querySelector<HTMLButtonElement>('[data-widget-revoke]');
    const rememberLabel = remember?.closest<HTMLElement>('label') ?? null;

    section.querySelectorAll<HTMLElement>('.store-widget__actions').forEach((a) => (a.hidden = false));
    if (consent) consent.hidden = false;

    const showRevoke = (granted: boolean) => {
      if (revoke) revoke.hidden = !granted;
      if (rememberLabel) rememberLabel.hidden = granted;
    };

    if (hasConsent(storage)) {
      widgets.forEach(load);
      showRevoke(true);
    }

    widgets.forEach((widget) =>
      widget.querySelector('[data-widget-load]')?.addEventListener('click', () => {
        load(widget);
        if (remember?.checked) {
          rememberConsent(storage);
          widgets.forEach(load);
          showRevoke(true);
        }
      })
    );

    revoke?.addEventListener('click', () => {
      revokeConsent(storage);
      widgets.forEach(unload);
      showRevoke(false);
    });
  });

  // Theme switch: loaded widgets move to their light/dark variant.
  new MutationObserver(() => {
    doc.querySelectorAll<HTMLElement>('.store-widget.is-loaded').forEach((widget) => {
      const f = frameFor(widget);
      const iframe = widget.querySelector('iframe');
      if (f && iframe) applyFrame(iframe, f, widget.dataset.kind);
    });
  }).observe(doc.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
