/**
 * Project cover images: src/assets/covers/<product id>.(png|jpg|jpeg|webp).
 * Vite-only (import.meta.glob); unit tests never import this module.
 */

import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/covers/*.{png,jpg,jpeg,webp}', {
  eager: true,
});

const byId = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.[^.]+$/, ''), mod.default])
);

/** The cover of a project, or undefined when it has none yet (components show a placeholder). */
export function getCover(id: string): ImageMetadata | undefined {
  return byId.get(id);
}
