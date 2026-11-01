/**
 * Platforms a project can ship on. The catalog filters are generated from the
 * platforms the products actually use, in PLATFORM_ORDER.
 * Adding a platform: add it here (label is the same in EN and ES).
 */

export const PLATFORMS = {
  unity: { label: 'Unity' },
  android: { label: 'Android' },
  ios: { label: 'iOS' },
  pc: { label: 'PC' },
} as const;

export type PlatformId = keyof typeof PLATFORMS;

export const PLATFORM_ORDER: PlatformId[] = ['unity', 'android', 'ios', 'pc'];
