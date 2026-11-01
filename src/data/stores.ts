/**
 * Stores a product can be sold on. `widget` says which embeddable store widget
 * exists for it (null → only a button with the store logo).
 */

export type StoreId = 'unity' | 'itch' | 'google-play' | 'app-store' | 'steam';
export type WidgetKind = 'unity' | 'itch';

export const STORES: Record<StoreId, { label: string; widget: WidgetKind | null }> = {
  unity: { label: 'Unity Asset Store', widget: 'unity' },
  itch: { label: 'itch.io', widget: 'itch' },
  'google-play': { label: 'Google Play', widget: null },
  'app-store': { label: 'App Store', widget: null },
  steam: { label: 'Steam', widget: null },
};
