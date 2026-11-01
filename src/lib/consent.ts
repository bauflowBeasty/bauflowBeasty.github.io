/**
 * Visitor permission to load third-party store widgets, remembered in
 * localStorage. Every function tolerates a missing or blocked storage
 * (private mode, strict browsers): it never throws.
 */

export const CONSENT_KEY = 'beasty_widgets_consent';

type KV = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function hasConsent(storage: KV | null): boolean {
  try {
    return storage?.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
}

export function rememberConsent(storage: KV | null): void {
  try {
    storage?.setItem(CONSENT_KEY, 'granted');
  } catch {
    /* storage blocked: the widget still loads, it just is not remembered */
  }
}

export function revokeConsent(storage: KV | null): void {
  try {
    storage?.removeItem(CONSENT_KEY);
  } catch {
    /* storage blocked: nothing was remembered */
  }
}
