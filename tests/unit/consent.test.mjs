import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_KEY, hasConsent, rememberConsent, revokeConsent } from '../../src/lib/consent.ts';

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
}

const throwing = {
  getItem() { throw new Error('blocked'); },
  setItem() { throw new Error('blocked'); },
  removeItem() { throw new Error('blocked'); },
};

test('consent round trip: absent, remembered, revoked', () => {
  const s = memoryStorage();
  assert.equal(hasConsent(s), false);
  rememberConsent(s);
  assert.equal(hasConsent(s), true);
  assert.equal(s.getItem(CONSENT_KEY), 'granted');
  revokeConsent(s);
  assert.equal(hasConsent(s), false);
});

test('blocked storage never throws and reports no consent', () => {
  assert.doesNotThrow(() => rememberConsent(throwing));
  assert.doesNotThrow(() => revokeConsent(throwing));
  assert.equal(hasConsent(throwing), false);
});

test('missing storage never throws and reports no consent', () => {
  assert.doesNotThrow(() => rememberConsent(null));
  assert.doesNotThrow(() => revokeConsent(null));
  assert.equal(hasConsent(null), false);
});
