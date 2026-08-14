/**
 * Product catalog — the single place to edit product info and store links.
 * When a store URL exists, replace `url: null` with the real link.
 */

export type Lang = 'en' | 'es';

export type StoreLink = {
  store: 'unity' | 'itch' | string;
  label: string;
  url: string | null; // null → rendered as "Coming soon", disabled
};

export type Product = {
  id: 'beasty-visual-novel' | 'beasty-save-system' | 'beasty-console';
  name: string;
  version: string;
  tagline: Record<Lang, string>;
  blurb: Record<Lang, string>;
  storeLinks: StoreLink[];
  /** Route of the product's documentation index. */
  docsEntry: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'beasty-visual-novel',
    name: 'Beasty Visual Novel',
    version: '1.0.1',
    tagline: {
      en: 'You write the story. It plays it.',
      es: 'Tú escribes la historia. Él la reproduce.',
    },
    blurb: {
      en: 'A complete visual novel engine for Unity: a story graph and a Ren’Py-like text script kept in sync, free-roam rooms, quests, game time, character routines, localization and saves — no code required at any point.',
      es: 'Un motor completo de novela visual para Unity: grafo de historia y script de texto estilo Ren’Py siempre sincronizados, salas explorables, misiones, tiempo de juego, rutinas de personajes, localización y guardado — sin escribir código en ningún momento.',
    },
    storeLinks: [
      {
        store: 'unity',
        label: 'Unity Asset Store',
        url: 'https://assetstore.unity.com/packages/slug/393138',
      },
      { store: 'itch', label: 'itch.io', url: null },
    ],
    docsEntry: '/docs/beasty-visual-novel/',
  },
  {
    id: 'beasty-save-system',
    name: 'Beasty Save System',
    version: '1.1.0',
    tagline: {
      en: 'Saves that cannot half-write.',
      es: 'Guardados que no pueden quedar a medias.',
    },
    blurb: {
      en: 'Slot-based save and load with its own JSON engine and zero dependencies. Atomic writes, per-slot backups, SHA-256 checksums, optional AES-256 encryption, and scene state from a component you tick.',
      es: 'Guardado y carga por slots con motor JSON propio y cero dependencias. Escrituras atómicas, copias de seguridad por slot, checksums SHA-256, cifrado AES-256 opcional y estado de escena desde un componente que marcas.',
    },
    storeLinks: [
      {
        store: 'unity',
        label: 'Unity Asset Store',
        url: 'https://assetstore.unity.com/packages/slug/301626',
      },
      {
        store: 'itch',
        label: 'itch.io',
        url: 'https://beastycomponents.itch.io/beasty-save-system',
      },
    ],
    docsEntry: '/docs/beasty-save-system/',
  },
  {
    id: 'beasty-console',
    name: 'Beasty Console',
    version: '1.0.0',
    tagline: {
      en: 'Find the error inside the wall of logs.',
      es: 'Encuentra el error dentro del muro de logs.',
    },
    blurb: {
      en: 'A static logging API with eleven semantic levels, plus the Beasty Console: an editor window that classifies, filters and searches everything your project logs, with one-click IDE navigation.',
      es: 'Una API de logging estática con once niveles semánticos, más la Beasty Console: una ventana de editor que clasifica, filtra y busca todo lo que registra tu proyecto, con salto al IDE en un clic.',
    },
    storeLinks: [
      {
        store: 'unity',
        label: 'Unity Asset Store',
        url: 'https://assetstore.unity.com/packages/slug/386438',
      },
      {
        store: 'itch',
        label: 'itch.io',
        url: 'https://beastycomponents.itch.io/beasty-console',
      },
    ],
    docsEntry: '/docs/beasty-console/',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
