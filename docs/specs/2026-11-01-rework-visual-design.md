# Rework visual del sitio Beasty Components — diseño

> Fecha: 2026-11-01 · Estado: decisiones acordadas con Álvaro en conversación; documento pendiente de
> su revisión final, después irá el plan.
> Maquetas de referencia (locales, no versionadas): `.superpowers/brainstorm/874-1793550757/content/`
> — `layout-v2.html`, `widgets.html`, `palette.html` (opción «Rojo protagonista»), `juice.html` (nivel 3),
> `docs.html` (variante A), `typography.html` (opción A).

## 1. Intención y por qué

La web actual se siente «hecha por IA» y de plantilla. Álvaro lo concreta así:

- **La portada parece una plantilla.** El esquema (título a la izquierda, ventana de código falsa a la
  derecha, tres tarjetas de solo texto iguales, diagrama hecho con caracteres) es el patrón genérico de
  miles de webs generadas.
- **La paleta no convence.** En concreto, el fondo marrón chocolate (`#1a1715` y familia) no le gusta.
- **Todo es estático, le falta «juice»** en el sentido de game feel: que la web responda al ratón y
  tenga movimiento.
- **No escala.** Hoy son 3 assets de Unity, pero vendrán más herramientas de desarrollo y también
  **aplicaciones completas** (Android, iOS, PC). La portada actual sería un muro de tarjetas de texto
  iguales y el menú superior, que lista cada producto, se rompería.

Además quiere **widgets de tienda** (Unity Asset Store, itch.io) para cada proyecto publicado.

«Beasty» es la compañía y «Components» es el sector («como Samsung Electrodomésticos»). La identidad
existente es el nombre y el logo: una «B» con el rojo `#e62443` sobre gris casi negro `#252424`.

## 2. Objetivos, no objetivos y antiobjetivos

**Objetivos**
- Una identidad visual propia y reconocible: rojo y negro con mucho carácter, tipografía con
  personalidad y movimiento con «modo juego».
- Una portada y una navegación que aguanten de 3 a varias decenas de proyectos de distintos tipos y
  plataformas sin rediseñar nada.
- Añadir un proyecto nuevo = rellenar datos en `src/data/products.ts`. Filtros, menús, tarjetas,
  botones de tienda y widgets se generan solos.
- Widgets oficiales de tienda en la página de cada proyecto.

**No objetivos**
- **No cambiar contenido.** Ningún texto de `ui-strings.ts`, de `products.ts` (lemas, descripciones,
  nombres) ni de las 94 páginas de docs EN/ES. Solo cambia el aspecto. Se pueden añadir **strings de
  interfaz nuevas** que exijan los elementos nuevos (p. ej. «Proyectos», «Todo», «Dónde conseguirlo»,
  «Copiar», «¡Copiado!», «Otros proyectos»), siempre en EN y ES.
- No crear ya páginas de apps que no existen. Solo dejar el camino preparado (ver §6.6).
- No reescribir los textos de bienvenida para hablar de apps además de Unity. Eso será una tarea de
  contenido aparte, cuando exista la primera app.

**Antiobjetivos** (sería un fracaso aunque «funcione»)
- Que vuelva a parecer una plantilla: hero de dos columnas con mockup de código, tarjetas de texto
  idénticas o degradados morados genéricos.
- Que las páginas de documentación cansen o distraigan la lectura (bloques rojos grandes, tarjetas que
  se inclinan en mitad del texto).
- Que la portada se llene de widgets o tarde en cargar por ellos.
- Que se muestren filtros vacíos (p. ej. «Android» sin ningún proyecto de Android).
- Romper la búsqueda (Pagefind), el chequeo de enlaces, la generación de PDF o el bilingüismo EN/ES.

## 3. Restricciones

- **Stack:** Astro 5, sitio estático en GitHub Pages vía Actions. Sin framework de UI. El JS se limita
  a scripts pequeños e independientes por componente (como hoy `HeroScript`/`ThemeToggle`).
- **Tema claro/oscuro** con `html[data-theme]`, el script anti-flash `theme-init.js` y el toggle
  existente. Todo el sistema visual sigue saliendo de los tokens de `src/styles/tokens.css`. Los
  componentes no ponen colores a mano.
- **Bilingüe:** EN canónico, ES espejo. Todo string nuevo de interfaz va en `ui-strings.ts` en los dos
  idiomas.
- **Generador de PDF** (`scripts/build-pdf.mjs`): extrae `<article class="doc-content" …>` del HTML y
  elimina `<p class="machine doc-crumb">…</p>` y `<aside class="buy-cta" …>…</aside>`. Si cambia el
  marcado de esas piezas, **hay que actualizar el script en el mismo cambio** y verificar `npm run doc:pdf`.
- **Pagefind:** se conserva `data-pagefind-body` y `data-pagefind-meta` en el artículo de docs.
- **Accesibilidad:** contraste AA en ambos temas (incluido el texto blanco sobre rojo), foco visible y
  navegación por teclado del desplegable «Proyectos», del selector de proyecto y de los filtros. Con
  `prefers-reduced-motion: reduce` se desactivan las entradas, inclinaciones, rebotes y focos; la web
  queda completa y estática.
- **Rama y publicación (decisión de Álvaro):** se trabaja en **`Develop`**, encima de la documentación
  de Visual Novel 1.1.0, que está pendiente de aprobación en la Asset Store. El rediseño **se publica
  junto con la 1.1.0**: cuando Unity apruebe la versión, Álvaro hará él mismo el paso a `main`. Por
  tanto, el destacado mostrará «NUEVO · v1.1.0». Nadie más fusiona a `main`.
- **Reglas del repo:** actualizar `PROJECT_MAP.md` al crear, mover o eliminar archivos. Actualizar
  `HOW-TO-ADD-PROJECT.md` con los campos nuevos de producto. No editar `dist/`.

## 4. Decisiones de Álvaro

| Tema | Decisión |
|---|---|
| Estructura de portada | **Proyecto destacado arriba + catálogo con filtros debajo** (opción B de `layout.html`). El catálogo **siempre** va debajo del destacado. |
| Filtros | **Dinámicos:** solo aparecen las plataformas que tiene al menos un proyecto. |
| Plataformas | **Un proyecto puede estar en varias plataformas** y aparece en cada filtro correspondiente. |
| Widgets | **Portada con botones de tienda pequeños; widgets completos en la página de cada proyecto** (opción A de `widgets.html`). |
| Página de proyecto | Lleva al final el **catálogo de los demás proyectos**. |
| Paleta | **«Rojo protagonista»:** base negra neutra; el rojo rellena bloques enteros (p. ej. el destacado), no solo acentos. Sin marrón. |
| Movimiento | **«Modo juego»** (nivel 3 de `juice.html`). |
| Docs | **Variante A «Limpia»** de `docs.html`, con selector de proyecto en el lateral. |
| Tipografía | **Unbounded** (títulos) + **Manrope** (texto). |
| Contenido | Ningún texto existente cambia. |
| Rama | Trabajo en `Develop`; sale con VN 1.1.0 cuando Unity la apruebe; Álvaro pasa a `main`. |
| Carga de widgets | **Con permiso del visitante:** clic para cargar, o consentimiento que lo recuerde. |

## 5. Decisiones mías (Claude) que Álvaro vio y no objetó

- Con **una sola plataforma** en total, la barra de filtros no se muestra. Cada filtro muestra cuántos
  proyectos tiene.
- El **proyecto destacado** se elige a mano con un campo en `products.ts`. Si no se marca ninguno, se
  usa el lanzamiento más reciente. El destacado **no se repite** en la cuadrícula del catálogo.
- Las **tarjetas del catálogo** no llevan botones de tienda: portada, nombre, lema y etiquetas de
  plataforma. Toda la tarjeta enlaza a la página del proyecto.
- **Código:** JetBrains Mono.
- **Docs más tranquilas:** el rojo solo en la página activa del menú, los títulos (marcador en rombo),
  los enlaces, el código en línea y los botones. El movimiento se limita a micro-respuestas: hover del
  menú, el «golpecito» del botón Copiar, el despliegue del selector de proyecto y la transición de
  tema.
- **Se respeta `prefers-reduced-motion`.**
- **Texto de bienvenida:** se conservan `hero.eyebrow`, `hero.title`, `hero.sub`, `hero.ctaDocs` y
  `hero.ctaStore` en una entrada breve encima del destacado. Se **elimina la ventana de código falsa**
  (`HeroScript.astro`, `welcome.vnbeasty`).
- **«Cómo encajan entre sí»** (`ecosystem.*`) se conserva con sus textos, debajo del catálogo. El
  diagrama ASCII pasa a ser un diagrama visual con las portadas de los paquetes y flechas etiquetadas
  («incluye» / «opcional»).
- **Menú superior:** desaparece la lista de productos y entra un desplegable **«Proyectos»** con
  portadas, que escala a muchos proyectos. En docs, el **selector de proyecto** está arriba del menú
  lateral.
- **Proyectos sin documentación:** página de proyecto sencilla generada desde `products.ts` (§6.6).
  Los que tienen docs siguen usando el índice de su documentación como página de proyecto.
- **Los widgets siguen el tema** de la web (versión clara/oscura) y cambian al alternarlo.
- **Contacto y pie de página** se rediseñan con el mismo sistema; el formulario no cambia.
- **Botón «Copiar»** nuevo en los bloques de código. Hoy no existe y se vio en la maqueta de docs.
- **Miga de pan de docs:** pasa de la versión «máquina» (`beasty-save-system / guides / x.md`) a una
  legible («Save System › Guías»). Ver §6.5 para el PDF.

Añadidas tras la revisión del constructor (Álvaro debe confirmarlas al leer):

- **Búsqueda en la cabecera**, global, con Ctrl/⌘ K (§6.2), como en la maqueta de docs.
- **Reglas de filtros y destacado** (§6.3): los contadores salen de todos los proyectos, «Todo» sin
  contador, y el destacado reaparece en la cuadrícula cuando hay un filtro de plataforma activo.
- **Código siempre oscuro, también en tema claro** (§6.5). Así se vio en la maqueta, pero cambia lo
  que hay hoy.
- **Notas y advertencias se distinguen** (neutro frío / ámbar) y no van en rojo (§6.5).

## 6. Diseño por partes

### 6.1 Sistema visual (tokens)

Se reescribe `tokens.css` manteniendo los **nombres de token existentes** (para no romper
componentes) y se añaden los que hagan falta. Valores de partida, tomados de las maquetas aprobadas
y ajustables por el constructor para cumplir AA:

| Token | Oscuro (por defecto) | Claro |
|---|---|---|
| `--bg` | `#121212` | `#f7f7f5` |
| `--surface` | `#1a1a1a` | `#ffffff` |
| `--surface-raised` | `#222222` | `#f0f0ee` |
| `--surface-code` | `#0b0b0b` | `#0b0b0b` (código oscuro también en tema claro; **cambio respecto a hoy**, ver §6.5) |
| `--border` / `--border-strong` | `#2c2c2c` / `#3a3a3a` | `#e3e3e0` / `#cfcfcb` |
| `--text` / `--text-muted` / `--text-faint` | `#f2f2f2` / `#a0a0a0` / `#707070` | `#151515` / `#5a5a5a` / `#8a8a8a` |
| `--accent` (rellenos, bloques) | `#e62443` | `#d11a39` |
| `--accent-text` (enlaces) | `#ff5a72` | `#c0122f` |
| `--accent-soft` | `rgba(230,36,67,.12)` | `rgba(209,26,57,.08)` |
| `--accent-on` | `#ffffff` | `#ffffff` |

- **Superficie de marca:** token nuevo para los bloques rojos grandes (destacado), con texto `#fff`,
  texto secundario `#ffe1e6` y etiqueta («NUEVO · vX») en `#121212`.
- **Callouts:** `--note` (neutro frío, p. ej. gris azulado) y `--warn` (ámbar) se reajustan a la base
  neutra, sin tonos marrones. **No son rojos** (ver §6.5).
- **Tipografía:** `--font-display: 'Unbounded'`, `--font-body: 'Manrope'`, `--font-mono: 'JetBrains
  Mono'`, autoalojadas con paquetes `@fontsource` (o `@fontsource-variable`) como hoy. Se retiran
  Bricolage e IBM Plex de `package.json` y de `BaseLayout.astro`. Unbounded es ancha: los tamaños
  `--text-hero`/`--text-xl` probablemente deban bajar para que los nombres largos («Beasty Visual
  Novel») no desborden en móvil.
- **Movimiento:** tokens de easing con rebote (`cubic-bezier(.34,1.56,.64,1)`) y de salida
  (`cubic-bezier(.22,1,.36,1)`), más duraciones.

### 6.2 Cabecera y pie

- **Cabecera:** logo, desplegable **«Proyectos»** (lista con miniatura de portada + nombre, agrupable
  por plataforma si crece), enlace a Contacto, **búsqueda**, cambio de idioma y de tema. Pegajosa como
  hoy.
- **Búsqueda (Pagefind):** sale del lateral de docs y pasa a la cabecera, como en la maqueta aprobada
  (`docs.html`), con atajo **Ctrl/⌘ K**. Es global: está en todas las páginas y busca en las docs de
  todos los proyectos, con el nombre del producto en cada resultado (ya existe
  `data-pagefind-meta="product:…"`). En móvil se reduce a un icono que abre la búsqueda a pantalla
  completa. Para no penalizar la portada, la UI de Pagefind se carga la primera vez que se abre la
  búsqueda. Si se prioriza el proyecto actual dentro de docs lo decide el constructor.
- **Pie:** mismos textos (`footer.*`), nuevo estilo.

### 6.3 Portada (`LandingPage.astro`)

En orden:

1. **Entrada breve:** eyebrow, título, subtítulo y dos botones con los textos actuales. Sin mockup de
   código.
2. **Proyecto destacado:** bloque rojo de marca con portada grande, «NUEVO · v{version}», nombre, lema y
   **botones de tienda pequeños con logo**, todos con el mismo estilo; caben 6–8 sin agobiar. Al pasar el
   ratón, un foco de luz sigue el cursor. Enlaza a la página del proyecto.
3. **Filtros:** «Todo» + una pastilla por plataforma existente. Ocultos si solo hay una plataforma.
   Al filtrar, el catálogo se reordena con animación de rebote escalonada. Reglas:
   - Las plataformas y sus **contadores salen de todos los proyectos**, incluido el destacado. Así un
     filtro nunca queda vacío ni falta uno que debería existir.
   - **«Todo» no lleva contador.**
   - Con «Todo» activo, la cuadrícula **omite el destacado** (ya está arriba). Con un filtro de
     plataforma activo, la cuadrícula muestra **todos** los proyectos de esa plataforma, **destacado
     incluido**, y el número de tarjetas coincide con el contador.
4. **Catálogo:** cuadrícula de tarjetas de portada. Al pasar el ratón: inclinación 3D que sigue el
   cursor, brillo, elevación, zoom de la imagen y borde rojo. Entrada escalonada con rebote al cargar.
5. **«Cómo encajan entre sí»:** textos actuales + diagrama visual.

Comportamiento de referencia: `juice.html` nivel 3. Los filtros funcionan en el cliente con un script
pequeño. Sin JS, se ve el catálogo completo y los filtros no se muestran.

### 6.4 Página de proyecto y widgets

- Para productos con docs, la página de proyecto es el **índice de su documentación** (`/docs/<id>/`),
  con el layout de docs más una sección **«Dónde conseguirlo»** con los widgets. Ubicación exacta dentro
  de la página: decide el constructor (p. ej. tras la introducción).
- Al final, sección **«Otros proyectos»** con el catálogo (sin el proyecto actual).
- **Widgets:**
  - **Unity Asset Store:** iframe de Link Maker
    (`https://assetstore.unity.com/linkmaker/embed/package/<id>/widget-…`). Álvaro confirmó que Link
    Maker ofrece variantes clara y oscura. Los nombres exactos de las variantes **no están
    verificados**: hay que sacarlos del código que genera `https://assetstore.unity.com/linkmaker`.
    IDs: Visual Novel `393138`, Save System `301626`, Console `386438` (ya en `storeLinks`).
  - **itch.io:** `https://itch.io/embed/<id>` (552×167; parámetros `dark=true`, `linkback=true`, colores
    opcionales). IDs (de `/data.json` de cada página): Visual Novel `4897713`, Save System `4790139`,
    Console `4846251`.
  - **Google Play / App Store** (futuro): insignias oficiales enlazadas, no iframes.
  - **Carga con permiso (decisión de Álvaro):** los widgets vienen de dominios de terceros y pueden
    dejar cookies, así que **no se cargan solos**.
    - Cada widget empieza como una **fachada** local: portada, nombre de la tienda y botón «Mostrar
      widget de {tienda}», con una línea breve que avisa de que se carga contenido de esa tienda.
    - Al pulsar se carga el iframe.
    - Junto a la fachada, una casilla **«Recordar mi elección»**, marcada por defecto, guarda el permiso
      en `localStorage`. En visitas siguientes los widgets se cargan directamente en todas las páginas.
    - Un enlace discreto junto a los widgets permite **retirar el permiso**.
    - No hay banner global de cookies. Lo único de terceros son los widgets, porque las fuentes son
      locales y el formulario de contacto solo envía al pulsar (decisión mía).
  - **Comportamiento:** con permiso, carga diferida (`loading="lazy"`) y alternancia del `src` o de la
    variante al cambiar de tema. Si una tienda no tiene widget, se muestra su botón con logo. Sin JS,
    la fachada se queda como enlace a la tienda.
- La tira `BuyCta` («¿Te gusta lo que lees? Consigue…») se conserva en las páginas de docs con el nuevo
  estilo: botones con logo de tienda.

### 6.5 Páginas de documentación (`DocLayout.astro`, `doc.css`)

Referencia: `docs.html`, variante A.

- **Tres columnas:** lateral (selector de proyecto + grupos; la búsqueda sale de aquí y va a la
  cabecera, §6.2), contenido y «En esta página». Se conserva el cajón móvil existente.
- **Selector de proyecto:** botón con miniatura + nombre que despliega con rebote la lista de
  proyectos que tienen docs.
- **Menú lateral:** al pasar el ratón, desplazamiento de 3 px y una barra roja que crece. La página
  activa lleva fondo suave y barra roja.
- **Títulos H2** con marcador en rombo rojo. Enlaces en `--accent-text` con subrayado suave. Código en
  línea teñido de rojo.
- **Bloques de código:** cabecera con el lenguaje y botón **Copiar** con aplastamiento al pulsar y
  estado «¡Copiado!».
  - **Siempre oscuros, también en tema claro**, como en la maqueta aprobada. Es un **cambio respecto a
    hoy**: ahora en tema claro salen blancos con Shiki `github-light`.
  - Un único tema Shiki oscuro que case con `#0b0b0b`; cuál exactamente lo decide el constructor.
- **Callouts** (blockquotes `> **Note**` / `> **Warning**`, en ES «Nota» / «Advertencia»; hoy unos 46
  y 44, que se ven iguales).
  - **Se distinguen:** la nota en neutro frío (`--note`) y la advertencia en ámbar (`--warn`), con
    fondo suave, borde izquierdo e icono.
  - **No usan rojo:** son unos 90 bloques y en rojo cansarían (antiobjetivo).
  - La clasificación se hace en el build (plugin remark/rehype que lee la palabra en negrita inicial
    en EN y ES) **sin tocar el contenido**. Un blockquote sin esa palabra queda como nota.
- **Miga de pan legible.** Si se mantiene la clase `doc-crumb`, el PDF sigue limpiándola. Si cambia,
  hay que actualizar `build-pdf.mjs`.

### 6.6 Modelo de datos (`products.ts`)

Campos nuevos (los nombres los decide el constructor):

- **Portada:** imagen local, no enlazada a itch. Se parte de las portadas de itch.io a su resolución
  original (las URLs `img.itch.zone` de `/data.json`, sin el recorte `315x250`). Álvaro puede
  sustituirlas después.
- **Plataformas:** lista, p. ej. `['unity']`, `['android','ios']`. Las etiquetas visibles salen de un
  mapa central.
- **Tiendas:** se amplía `storeLinks` con el tipo de tienda conocido (`unity`, `itch`, `google-play`,
  `app-store`, `steam`…), su logo y el ID del widget cuando exista.
- **Destacado:** booleano opcional.
- **Fecha de lanzamiento:** para el destacado por defecto y el orden del catálogo.
- **Docs:** `docsEntry` pasa a ser **opcional**. El tipo `Product['id']` y `SIDEBARS` dejan de ser una
  unión cerrada de tres IDs para que un proyecto nuevo no obligue a tocar tipos. Proyectos sin docs →
  ruta generada `/projects/<id>/` (y `/es/projects/<id>/`) con portada, lema, descripción, «Dónde
  conseguirlo» y «Otros proyectos». No se generan páginas para los tres productos actuales, que
  tienen docs.

### 6.7 Contacto

`ContactPage.astro` con el nuevo sistema. Formulario (Web3Forms) y textos sin cambios.

## 7. Lo que queda al constructor

- Ajuste fino de colores para AA, tamaños tipográficos, espaciados y curvas de animación, partiendo de
  las maquetas.
- Estructura de componentes nuevos (tarjeta, filtros, desplegable, selector, widgets, diagrama) y su
  ubicación.
- Logos de tienda: SVG locales, respetando las guías de marca de cada tienda.
- Si el diagrama del ecosistema se genera desde datos o se dibuja a mano.
- Nombres de campos y de strings nuevas.

## 8. Verificación

- `npm run build` sin errores; `npm run doc:links` limpio; `npm run doc:pdf` genera los tres PDF sin
  restos de miga ni de `BuyCta`.
- **Revisión visual** de portada, una página de docs, página de proyecto (índice de docs) y contacto,
  en **EN y ES**, **claro y oscuro**, a 375 px, ~768 px y escritorio, sin scroll horizontal.
- Con `prefers-reduced-motion: reduce` no hay animaciones.
- **Escalado:** prueba temporal con 2–3 productos ficticios (incluido uno Android+iOS sin docs) para
  ver que aparecen los filtros, los contadores, el desplegable y la página `/projects/<id>/`. Se
  retiran antes de cerrar.
- Ningún diff en `src/content/docs/**` ni cambios en textos existentes de `ui-strings.ts`/`products.ts`.
