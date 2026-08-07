/**
 * Sidebar structure per product: reading order taken from each product's
 * README. Items are slugs relative to the product root; page titles come
 * from each page's frontmatter at render time.
 */

import type { Lang } from './ui-strings';
import type { Product } from './products';

export type SidebarGroup = {
  label: Record<Lang, string>;
  items: string[];
};

const L = {
  gettingStarted: { en: 'Getting started', es: 'Primeros pasos' },
  authoring: { en: 'Authoring', es: 'Escritura' },
  world: { en: 'World', es: 'Mundo' },
  scripting: { en: 'Scripting', es: 'Scripting' },
  production: { en: 'Production', es: 'Producción' },
  guides: { en: 'Guides', es: 'Guías' },
  reference: { en: 'Reference', es: 'Referencia' },
  advanced: { en: 'Advanced', es: 'Avanzado' },
  help: { en: 'Help', es: 'Ayuda' },
};

export const SIDEBARS: Record<Product['id'], SidebarGroup[]> = {
  'beasty-visual-novel': [
    {
      label: L.gettingStarted,
      items: [
        'getting-started/installation',
        'getting-started/house-demo',
        'getting-started/your-first-scene',
        'getting-started/core-concepts',
        'getting-started/editor-tour',
      ],
    },
    {
      label: L.authoring,
      items: [
        'authoring/story-graph',
        'authoring/blocks-reference',
        'authoring/dialogue-and-stage',
        'authoring/choices-and-decisions',
        'authoring/text-script',
        'authoring/vnbeasty-syntax',
        'authoring/transitions',
        'authoring/subgraphs',
        'authoring/dialogue-preview',
      ],
    },
    {
      label: L.world,
      items: [
        'world/free-roam-rooms',
        'world/interactables-and-doors',
        'world/game-time',
        'world/character-routines',
        'world/characters',
        'world/character-screens',
        'world/quests',
        'world/talk-menu',
        'world/screens-and-hud',
        'world/items-and-inventory',
        'world/variables-and-conditions',
        'world/dictionary',
      ],
    },
    {
      label: L.production,
      items: [
        'production/localization',
        'production/saving-and-loading',
        'production/audio-and-music',
        'production/input-and-controls',
        'production/ui-prefabs',
        'production/vn-settings',
        'production/streaming',
        'production/large-projects',
        'production/building-and-platforms',
        'production/validation-and-ids',
        'production/logging',
      ],
    },
    {
      label: L.scripting,
      items: [
        'scripting/overview',
        'scripting/vn-api',
        'scripting/controllers',
        'scripting/gameplay-apis',
        'scripting/custom-mode',
        'scripting/generated-accessors',
      ],
    },
    {
      label: L.reference,
      items: [
        'reference/assets',
        'reference/prefabs',
        'reference/menu-items',
        'reference/variable-keys',
      ],
    },
    {
      label: L.help,
      items: ['troubleshooting', 'faq', 'changelog'],
    },
  ],

  'beasty-save-system': [
    {
      label: L.gettingStarted,
      items: [
        'getting-started/installation',
        'getting-started/save-without-code',
        'getting-started/save-with-code',
      ],
    },
    {
      label: L.guides,
      items: [
        'guides/what-gets-saved',
        'guides/settings',
        'guides/scene-state',
        'guides/slots-and-metadata',
        'guides/backups-and-corruption',
        'guides/encryption',
        'guides/strict-vs-tolerant',
        'guides/versioning-and-migrations',
        'guides/async-saving',
        'guides/storage-backends',
        'guides/firebase',
        'guides/save-manager-window',
        'guides/logging',
      ],
    },
    {
      label: L.reference,
      items: [
        'reference/api-beastysave',
        'reference/results-and-errors',
        'reference/components',
        'reference/converter-modules',
        'reference/save-file-format',
        'reference/json-engine',
      ],
    },
    {
      label: L.advanced,
      items: ['advanced/custom-converters', 'advanced/custom-backends', 'advanced/platforms-and-limits'],
    },
    {
      label: L.help,
      items: ['troubleshooting', 'faq', 'changelog'],
    },
  ],

  'beasty-console': [
    {
      label: L.gettingStarted,
      items: ['getting-started'],
    },
    {
      label: L.guides,
      items: [
        'guides/logging',
        'guides/console-window',
        'guides/release-builds',
        'guides/beasty-integration',
      ],
    },
    {
      label: L.reference,
      items: ['reference/api'],
    },
    {
      label: L.help,
      items: ['faq', 'changelog'],
    },
  ],
};
