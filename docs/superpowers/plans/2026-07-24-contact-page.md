# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una página de contacto (`/contact/` y `/es/contact/`) con un formulario que envía los mensajes al correo de Álvaro vía **Web3Forms**, y eliminar toda referencia directa al correo en el sitio (hoy: un `mailto:` en el footer) para que la única vía de contacto sea el formulario.

**Architecture:** Mismo patrón que la portada: un componente compartido `ContactPage.astro` con prop `lang`, montado por dos rutas finas (`src/pages/contact.astro` y `src/pages/es/contact.astro`). El formulario hace POST a `https://api.web3forms.com/submit`; con JS activado se envía por `fetch` sin salir de la página (estados enviando/enviado/error); sin JS funciona igualmente como POST HTML normal (Web3Forms muestra su página de confirmación). No hay backend propio: GitHub Pages sigue sirviendo solo estáticos.

**Tech Stack:** Astro 5, CSS con los tokens existentes (`tokens.css`), `<script>` vanilla en el componente, Web3Forms (plan gratuito, 250 envíos/mes).

## Global Constraints

- **Prerequisito bloqueante:** la access key de Web3Forms la obtiene Álvaro en web3forms.com con su correo. Hasta tenerla, el código usa la constante `ACCESS_KEY = 'PENDING-REPLACE-ME'` en `ContactPage.astro` con un comentario `TODO`. La key es pública por diseño (no revela el correo): se commitea en el código sin problema.
- El correo de Álvaro **no debe aparecer en ningún archivo de `src/`** al terminar (verificado con Grep en Task 4). La asociación key→correo vive en el servidor de Web3Forms.
- Anti-spam/abuso: honeypot `botcheck` (checkbox oculto que Web3Forms descarta server-side), `maxlength` en ambos campos (email 200, mensaje 5000), `type="email" required`. Nada del input del usuario se re-renderiza en la página (los mensajes de estado son strings fijos de `ui-strings.ts`) ⇒ sin superficie XSS. La sanitización de cabeceras de email la hace Web3Forms.
- La regla «cero requests a terceros» del rediseño aplica a **assets en carga**; sigue cumpliéndose: el único request externo es el POST del formulario, iniciado por el usuario al enviar.
- Todos los strings visibles nuevos van a `src/data/ui-strings.ts` (EN y ES) — nada hardcodeado en el componente.
- Ningún archivo > ~200 líneas.
- No es página de docs: **no** se toca `sidebars.ts` ni se regenera `DOC-INDEX`.
- Commits frecuentes, mensajes en inglés, footer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Strings de UI del formulario

**Files:**
- Modify: `src/data/ui-strings.ts`

**Steps:**
- [ ] Añadir en `en:` y `es:` las claves:

| Clave | EN | ES |
|---|---|---|
| `contact.title` | `Contact` | `Contacto` |
| `contact.metaDescription` | `Questions about a Beasty Components asset? Send a message and get a reply by email.` | `¿Dudas sobre un asset de Beasty Components? Envía un mensaje y recibe respuesta por correo.` |
| `contact.intro` | `Found a bug, hit a wall, or have a pre-purchase question? Write below — replies go to the email you enter.` | `¿Encontraste un bug, te atascaste o tienes una duda antes de comprar? Escribe aquí — la respuesta llega al correo que indiques.` |
| `contact.emailLabel` | `Your email` | `Tu correo` |
| `contact.messageLabel` | `Message` | `Mensaje` |
| `contact.send` | `Send message` | `Enviar mensaje` |
| `contact.sending` | `Sending…` | `Enviando…` |
| `contact.sent` | `Sent. You’ll get a reply by email.` | `Enviado. Recibirás respuesta por correo.` |
| `contact.error` | `Something went wrong. Please try again in a minute.` | `Algo falló. Inténtalo de nuevo en un minuto.` |
| `footer.contactLink` | `Contact form` | `Formulario de contacto` |

- [ ] Commit: `feat: UI strings for contact page`

### Task 2: Componente ContactPage + rutas EN/ES

**Files:**
- Create: `src/components/ContactPage.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/es/contact.astro`

**Interfaces (Produces):** `ContactPage` props `{ lang: Lang }`. Usa `BaseLayout` con `title`/`description` desde `ui-strings` y `altHref` a la misma página en el otro idioma (`/es/contact/` ↔ `/contact/`), igual que hace la portada.

**Esqueleto del formulario (dentro de ContactPage.astro):**

```html
<form id="contact-form" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value={ACCESS_KEY} />
  <input type="hidden" name="subject" value="Soporte Beasty Components" />
  <input type="hidden" name="from_name" value="Beasty Components — web" />
  <!-- honeypot: oculto por CSS, los bots lo marcan y Web3Forms descarta el envío -->
  <input type="checkbox" name="botcheck" class="botcheck" tabindex="-1" autocomplete="off" />

  <label for="cf-email">{t(lang, 'contact.emailLabel')}</label>
  <input id="cf-email" type="email" name="email" required maxlength="200" autocomplete="email" />

  <label for="cf-message">{t(lang, 'contact.messageLabel')}</label>
  <textarea id="cf-message" name="message" required maxlength="5000" rows="8"></textarea>

  <button type="submit">{t(lang, 'contact.send')}</button>
  <p class="form-status" role="status" aria-live="polite"></p>
</form>
```

**Script (vanilla, en el mismo componente):** interceptar `submit` con `preventDefault`; `fetch` al `action` con `FormData`; durante el envío deshabilitar el botón y poner `contact.sending` en `.form-status`; con `response.ok && json.success` → limpiar el formulario y poner `contact.sent`; si no → `contact.error` y rehabilitar el botón. Los tres textos llegan al script vía `data-*` attributes en el `<form>` (patrón sin hardcodear strings en JS). Sin JS, el POST HTML normal sigue funcionando.

**Estilos:** tokens existentes (`--surface`, `--border`, `--accent`, `--space-*`, `--radius-*`, `--text-sm`). Formulario en una columna, ancho máx. ~40rem centrado. `.botcheck { display: none; }`. Foco visible en inputs (outline con `--accent`).

**Steps:**
- [ ] `ContactPage.astro` con `const ACCESS_KEY = 'PENDING-REPLACE-ME'; // TODO: key real de Web3Forms de Álvaro` en el frontmatter
- [ ] Rutas `contact.astro` (EN) y `es/contact.astro` (ES), finas como las de la portada
- [ ] `npm run dev`: la página renderiza en ambos idiomas, LangSwitch alterna entre ellas, tema claro/oscuro OK
- [ ] Commit: `feat: contact page with Web3Forms form (EN/ES)`

### Task 3: Quitar el correo del sitio (footer)

**Files:**
- Modify: `src/components/Footer.astro`

**Steps:**
- [ ] Sustituir la línea del `mailto:` (`Footer.astro:20`) por un enlace interno a la página de contacto respetando el idioma: `<a href={`${prefix}/contact/`}>{t(lang, 'footer.contactLink')}</a>` (derivar `prefix` de `lang` como hace `Header.astro:15`). El eyebrow `footer.contact` se queda como está.
- [ ] Verificar que el correo no aparece en ningún otro sitio: Grep `mailto:|bauflowbeasty|gmail` sobre `src/` ⇒ 0 resultados
- [ ] Commit: `feat: footer links to contact page instead of exposing email`

### Task 4: Verificación, key real y mapa

**Files:**
- Modify: `PROJECT_MAP.md`
- Modify: `src/components/ContactPage.astro` (key real)

**Steps:**
- [ ] Pedir a Álvaro la access key (web3forms.com → su correo → key por email) y reemplazar `PENDING-REPLACE-ME`
- [ ] `npm run build` OK y `npm run doc:links` sin enlaces rotos (el enlace nuevo del footer aparece en todas las páginas)
- [ ] Prueba real en `npm run dev`: enviar un mensaje de prueba desde `/contact/` y confirmar que llega al correo de Álvaro; probar también el estado de error (p. ej. desconectando la red)
- [ ] Actualizar `PROJECT_MAP.md`: nuevas entradas (`ContactPage.astro`, `pages/contact.astro`, `pages/es/contact.astro`) y fecha de última actualización
- [ ] Commit: `feat: live Web3Forms key, project map update`
