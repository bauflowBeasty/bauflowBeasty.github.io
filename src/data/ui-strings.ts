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
    'footer.contactLink': 'Contact form',
    'contact.title': 'Contact',
    'contact.metaDescription':
      'Questions about a Beasty Components asset? Send a message and get a reply by email.',
    'contact.intro':
      'Found a bug, hit a wall, or have a pre-purchase question? Write below — replies go to the email you enter.',
    'contact.emailLabel': 'Your email',
    'contact.messageLabel': 'Message',
    'contact.send': 'Send message',
    'contact.sending': 'Sending…',
    'contact.sent': 'Sent. You’ll get a reply by email.',
    'contact.error': 'Something went wrong. Please try again in a minute.',
    // Rework visual (2026-11): new interface strings
    'nav.projects': 'Projects',
    'search.open': 'Search',
    'search.close': 'Close search',
    'catalog.all': 'All',
    'catalog.filterLabel': 'Filter by platform',
    'catalog.others': 'Other projects',
    'featured.new': 'New',
    'where.heading': 'Where to get it',
    'widget.show': 'Show {store} widget',
    'widget.notice': 'Loads content from {store}, which may set cookies.',
    'widget.remember': 'Remember my choice',
    'widget.revoke': 'Stop loading store widgets automatically',
    'code.copy': 'Copy',
    'code.copied': 'Copied!',
    'docs.projectSwitch': 'Switch project',
    'ecosystem.includes': 'includes',
    'ecosystem.optional': 'optional',
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
    'footer.contactLink': 'Formulario de contacto',
    'contact.title': 'Contacto',
    'contact.metaDescription':
      '¿Dudas sobre un asset de Beasty Components? Envía un mensaje y recibe respuesta por correo.',
    'contact.intro':
      '¿Encontraste un bug, te atascaste o tienes una duda antes de comprar? Escribe aquí — la respuesta llega al correo que indiques.',
    'contact.emailLabel': 'Tu correo',
    'contact.messageLabel': 'Mensaje',
    'contact.send': 'Enviar mensaje',
    'contact.sending': 'Enviando…',
    'contact.sent': 'Enviado. Recibirás respuesta por correo.',
    'contact.error': 'Algo falló. Inténtalo de nuevo en un minuto.',
    // Rework visual (2026-11): new interface strings
    'nav.projects': 'Proyectos',
    'search.open': 'Buscar',
    'search.close': 'Cerrar búsqueda',
    'catalog.all': 'Todo',
    'catalog.filterLabel': 'Filtrar por plataforma',
    'catalog.others': 'Otros proyectos',
    'featured.new': 'Nuevo',
    'where.heading': 'Dónde conseguirlo',
    'widget.show': 'Mostrar widget de {store}',
    'widget.notice': 'Carga contenido de {store}, que puede usar cookies.',
    'widget.remember': 'Recordar mi elección',
    'widget.revoke': 'Dejar de cargar los widgets automáticamente',
    'code.copy': 'Copiar',
    'code.copied': '¡Copiado!',
    'docs.projectSwitch': 'Cambiar de proyecto',
    'ecosystem.includes': 'incluye',
    'ecosystem.optional': 'opcional',
  },
};

export function t(lang: Lang, key: string): string {
  return UI[lang][key] ?? UI.en[key] ?? key;
}

/** t() with {placeholder} substitution: tf('es', 'widget.show', { store: 'itch.io' }). */
export function tf(lang: Lang, key: string, vars: Record<string, string>): string {
  return t(lang, key).replace(/\{(\w+)\}/g, (m, name: string) => vars[name] ?? m);
}
