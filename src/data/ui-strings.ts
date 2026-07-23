/** Every user-facing interface string, in both languages. */

export type Lang = 'en' | 'es';

export const UI: Record<Lang, Record<string, string>> = {
  en: {
    skipToContent: 'Skip to content',
    'nav.docs': 'Documentation',
    'nav.home': 'Home',
    'logo.alt': 'Beasty Components — home',
    'theme.toggle': 'Switch color theme',
    'lang.switch': 'Language',
    'footer.contact': 'Contact',
    'footer.tagline': 'Beasty Components — Unity tools by bauflow.',
    'footer.rights': 'All product names and code are © bauflow.',
    'hero.eyebrow': 'Beasty Components',
    'hero.title': 'Tools that ship with their manuals.',
    'hero.sub':
      'Unity tools — a visual novel engine, a save system, a logger — each documented page by page, so you know exactly what you are buying before you buy it.',
    'hero.ctaDocs': 'Browse the docs',
    'hero.ctaStore': 'Get them on a store',
    'products.heading': 'The packages',
    'product.readDocs': 'Read the docs',
    'product.getIt': 'Get it on',
    'product.comingSoon': 'Coming soon',
    'ecosystem.heading': 'How they fit together',
    'ecosystem.note1':
      'Beasty Save System ships inside Beasty Visual Novel. If you own the novel engine, the save system is already there — do not import it twice.',
    'ecosystem.note2':
      'Beasty Console is optional for the save system, which detects it at runtime and falls back to Unity’s console when absent. Each package can be bought and used on its own.',
    'ecosystem.requirements':
      'Unity 6000.2 or newer · Mono and IL2CPP · Windows, macOS, Linux, Android, iOS and consoles. WebGL is not supported in 1.0.0.',
    'docs.onThisPage': 'On this page',
    'docs.overview': 'Overview',
    'docs.menu': 'Menu',
    'docs.searchPlaceholder': 'Search the docs…',
    'docs.buyStrip': 'Like what you read? Get',
    'docs.previous': 'Previous',
    'docs.next': 'Next',
  },
  es: {
    skipToContent: 'Saltar al contenido',
    'nav.docs': 'Documentación',
    'nav.home': 'Inicio',
    'logo.alt': 'Beasty Components — inicio',
    'theme.toggle': 'Cambiar tema de color',
    'lang.switch': 'Idioma',
    'footer.contact': 'Contacto',
    'footer.tagline': 'Beasty Components — herramientas para Unity por bauflow.',
    'footer.rights': 'Los nombres de producto y el código son © bauflow.',
    'hero.eyebrow': 'Beasty Components',
    'hero.title': 'Herramientas que vienen con su manual.',
    'hero.sub':
      'Herramientas para Unity — un motor de novela visual, un sistema de guardado, un logger — cada una documentada página a página, para que sepas exactamente qué compras antes de comprarlo.',
    'hero.ctaDocs': 'Explorar la documentación',
    'hero.ctaStore': 'Consíguelos en una tienda',
    'products.heading': 'Los paquetes',
    'product.readDocs': 'Leer la documentación',
    'product.getIt': 'Consíguelo en',
    'product.comingSoon': 'Muy pronto',
    'ecosystem.heading': 'Cómo encajan entre sí',
    'ecosystem.note1':
      'Beasty Save System viene incluido dentro de Beasty Visual Novel. Si tienes el motor de novelas, el sistema de guardado ya está ahí — no lo importes dos veces.',
    'ecosystem.note2':
      'Beasty Console es opcional para el sistema de guardado, que lo detecta en tiempo de ejecución y usa la consola de Unity cuando no está. Cada paquete se puede comprar y usar por separado.',
    'ecosystem.requirements':
      'Unity 6000.2 o superior · Mono e IL2CPP · Windows, macOS, Linux, Android, iOS y consolas. WebGL no está soportado en 1.0.0.',
    'docs.onThisPage': 'En esta página',
    'docs.overview': 'Descripción general',
    'docs.menu': 'Menú',
    'docs.searchPlaceholder': 'Buscar en la documentación…',
    'docs.buyStrip': '¿Te gusta lo que lees? Consigue',
    'docs.previous': 'Anterior',
    'docs.next': 'Siguiente',
  },
};

export function t(lang: Lang, key: string): string {
  return UI[lang][key] ?? UI.en[key] ?? key;
}
