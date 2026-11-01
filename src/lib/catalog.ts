/**
 * Catalog logic shared by the landing, the project pages and the client-side
 * filter script. Pure: no Astro imports (tests run it with plain Node).
 */

import type { Product } from '../data/products';
import type { Lang } from '../data/ui-strings';
import { PLATFORM_ORDER, type PlatformId } from '../data/platforms.ts';

export type Filter = 'all' | PlatformId;

/** The product flagged `featured`, or the first one (array order = catalog order). */
export function getFeatured(products: readonly Product[]): Product {
  if (products.length === 0) throw new Error('No products');
  return products.find((p) => p.featured) ?? products[0];
}

/**
 * One filter per platform used by any product (featured included), with how many
 * products ship on it. Empty when there is nothing to filter (< 2 platforms).
 */
export function platformFilters(products: readonly Product[]): { id: PlatformId; count: number }[] {
  const filters = PLATFORM_ORDER.map((id) => ({
    id,
    count: products.filter((p) => p.platforms.includes(id)).length,
  })).filter((f) => f.count > 0);
  return filters.length < 2 ? [] : filters;
}

/**
 * Under "all" the featured card is hidden (it is shown above the grid); under a
 * platform filter every product on that platform is shown, featured included.
 */
export function isCardVisible(card: { platforms: readonly string[]; featured: boolean }, filter: Filter): boolean {
  if (filter === 'all') return !card.featured;
  return card.platforms.includes(filter);
}

/** Where a project lives: its docs index, or the generated /projects/<id>/ page. */
export function projectHref(product: { id: string; docsEntry?: string }, lang: Lang): string {
  const prefix = lang === 'es' ? '/es' : '';
  return product.docsEntry ? `${prefix}${product.docsEntry}` : `${prefix}/projects/${product.id}/`;
}
