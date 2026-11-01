// Revisión del sitio construido en un navegador real (Chrome/Edge del sistema).
//
//   npm run build && npm run ui:check [-- --consent] [-- --routes /a/,/b/]
//
// Por cada ruta × ancho (375, 768, 1280) × tema (dark, light):
//   (a) sin scroll horizontal: scrollWidth <= innerWidth
//   (b) sin errores de JavaScript (pageerror / console.error), salvo fallos de red de dominios externos
//   y guarda una captura de página completa en dist-shots/<ruta>__<ancho>__<tema>.png
// Además, con prefers-reduced-motion: reduce (1280, oscuro): ninguna animación en marcha tras cargar.
// --consent  marca el permiso de widgets (beasty_widgets_consent) antes de navegar.
// Sale con código 1 si alguna comprobación falla.

import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/chrome.mjs';
import { serveDist } from './lib/serve-dist.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SHOTS = join(ROOT, 'dist-shots');
const WIDTHS = [375, 768, 1280];
const THEMES = ['dark', 'light'];

const args = process.argv.slice(2);
const consent = args.includes('--consent');
const routesArg = args[args.indexOf('--routes') + 1];

function defaultRoutes() {
  const routes = ['/', '/es/', '/docs/beasty-save-system/getting-started/save-with-code/', '/es/docs/beasty-visual-novel/', '/contact/'];
  for (const base of ['projects', join('es', 'projects')]) {
    const dir = join(DIST, base);
    if (!existsSync(dir)) continue;
    for (const id of readdirSync(dir)) routes.push(`/${base.replace(/\\/g, '/')}/${id}/`);
  }
  return routes;
}

// Las rutas se aceptan con o sin barras («docs/x» = «/docs/x/»): en Git Bash, un argumento que
// empieza por «/» se convierte en ruta de Windows (o usar MSYS_NO_PATHCONV=1).
const normalize = (r) => '/' + r.replace(/^\/+|\/+$/g, '') + (r.replace(/^\/+|\/+$/g, '') ? '/' : '');
const routes =
  args.includes('--routes') && routesArg ? routesArg.split(',').filter(Boolean).map(normalize) : defaultRoutes();
const slug = (route) => route.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'index';

if (!existsSync(DIST)) {
  console.error('ui-check: no existe dist/. Ejecuta antes `npm run build`.');
  process.exit(1);
}

rmSync(SHOTS, { recursive: true, force: true });
mkdirSync(SHOTS, { recursive: true });

const server = await serveDist(DIST);
const browser = await puppeteer.launch({ executablePath: findChrome(), args: ['--hide-scrollbars'] });
const failures = [];
let checks = 0;

async function openPage({ width, theme, reducedMotion = false }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.evaluateOnNewDocument(
    (t, c) => {
      try {
        localStorage.setItem('bauflow_theme', t);
        if (c) localStorage.setItem('beasty_widgets_consent', 'granted');
        else localStorage.removeItem('beasty_widgets_consent');
      } catch {}
    },
    theme,
    consent
  );
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const url = m.location()?.url ?? '';
    // Recursos de otros dominios (widgets de tienda, etc.) no son errores del sitio.
    if (url && !url.startsWith(server.url)) return;
    errors.push(`console.error: ${m.text()}`);
  });
  return { page, errors };
}

try {
  for (const route of routes) {
    for (const width of WIDTHS) {
      for (const theme of THEMES) {
        const tag = `${route} @${width} ${theme}`;
        const { page, errors } = await openPage({ width, theme });
        try {
          await page.goto(server.url + route, { waitUntil: 'networkidle0', timeout: 45000 });
          await new Promise((r) => setTimeout(r, 400));
          const { scrollWidth, innerWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          }));
          checks++;
          if (scrollWidth > innerWidth) failures.push(`${tag}: scroll horizontal (${scrollWidth} > ${innerWidth})`);
          checks++;
          if (errors.length) failures.push(`${tag}: ${errors.join(' | ')}`);
          await page.screenshot({ path: join(SHOTS, `${slug(route)}__${width}__${theme}.png`), fullPage: true });
        } catch (e) {
          failures.push(`${tag}: ${e.message}`);
        } finally {
          await page.close();
        }
      }
    }

    // Movimiento reducido: nada debe seguir animándose.
    const { page } = await openPage({ width: 1280, theme: 'dark', reducedMotion: true });
    try {
      await page.goto(server.url + route, { waitUntil: 'networkidle0', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1500));
      const running = await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === 'running').length
      );
      checks++;
      if (running > 0) failures.push(`${route} reduced-motion: ${running} animación(es) en marcha`);
    } catch (e) {
      failures.push(`${route} reduced-motion: ${e.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  await server.close();
}

const shots = readdirSync(SHOTS).length;
console.log(`ui-check: ${routes.length} rutas, ${checks} comprobaciones, ${shots} capturas en dist-shots/`);
if (failures.length) {
  console.error(`ui-check: ${failures.length} fallo(s):`);
  for (const f of failures) console.error('  ✖ ' + f);
  process.exit(1);
}
console.log('ui-check: OK');
