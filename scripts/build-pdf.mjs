// Genera un PDF de documentación básica por asset a partir del sitio ya construido (dist/),
// y lo copia a la carpeta del asset en el proyecto Unity para que viaje en el .unitypackage.
//
// Requiere `npm run build` previo (lee el HTML de dist/). Las imágenes se resuelven desde
// public/docs-images/: una captura que todavía no existe se omite del PDF, igual que en el sitio.
// Volver a ejecutar tras añadir capturas o editar páginas: npm run build && npm run doc:pdf
//
// Ruta del proyecto Unity: docs/sync-state.json (o la variable de entorno BEASTY_PROJECT).
// Navegador: Chrome/Edge del sistema (o la variable de entorno BEASTY_CHROME).

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://bauflowbeasty.github.io';

const ASSETS = [
  {
    carpeta: 'BeastySaveSystem',
    producto: 'beasty-save-system',
    paginas: [
      'index',
      'getting-started/installation',
      'getting-started/save-without-code',
      'getting-started/save-with-code',
      'guides/save-manager-window',
    ],
  },
  {
    carpeta: 'BeastyVN',
    producto: 'beasty-visual-novel',
    paginas: [
      'index',
      'getting-started/installation',
      'getting-started/core-concepts',
      'getting-started/editor-tour',
      'getting-started/your-first-scene',
    ],
  },
  {
    carpeta: 'BeastyConsole',
    producto: 'beasty-console',
    paginas: ['index', 'getting-started', 'guides/logging', 'guides/console-window'],
  },
];

const estado = JSON.parse(readFileSync(join(raiz, 'docs', 'sync-state.json'), 'utf8'));
const proyectoUnity = process.env.BEASTY_PROJECT || estado.proyectoUnity;
const productos = readFileSync(join(raiz, 'src', 'data', 'products.ts'), 'utf8');

function datosProducto(nombreClave) {
  // En products.ts cada producto lista name: '...' seguido de version: '...'
  const re = /name:\s*'([^']+)',\s*version:\s*'([^']+)'/g;
  for (const m of productos.matchAll(re)) {
    if (m[1].toLowerCase().replace(/\s+/g, '-') === nombreClave) return { nombre: m[1], version: m[2] };
  }
  throw new Error(`No encuentro '${nombreClave}' en products.ts`);
}

function buscarChrome() {
  if (process.env.BEASTY_CHROME) return process.env.BEASTY_CHROME;
  const candidatos = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const hallado = candidatos.find((c) => existsSync(c));
  if (!hallado) throw new Error('No encuentro Chrome ni Edge; define BEASTY_CHROME.');
  return hallado;
}

function extraerCapitulo(producto, pagina) {
  const rel = pagina === 'index' ? '' : pagina + '/';
  const ruta = join(raiz, 'dist', 'docs', producto, ...rel.split('/').filter(Boolean), 'index.html');
  const html = readFileSync(ruta, 'utf8');
  const m = html.match(/<article class="doc-content"[^>]*>([\s\S]*?)<\/article>/);
  if (!m) throw new Error(`Sin <article class="doc-content"> en ${ruta}`);
  let cuerpo = m[1];

  cuerpo = cuerpo.replace(/<p class="machine doc-crumb">[\s\S]*?<\/p>/g, '');
  cuerpo = cuerpo.replace(/<aside class="buy-cta"[\s\S]*?<\/aside>/g, '');

  // Imágenes: resolver desde public/docs-images; una captura que no existe se omite.
  let omitidas = 0;
  cuerpo = cuerpo.replace(/<img\b[^>]*>/g, (etiqueta) => {
    const src = etiqueta.match(/src="([^"]+)"/)?.[1];
    if (!src || !src.startsWith('/docs-images/')) return etiqueta;
    const archivo = join(raiz, 'public', ...src.split('/').filter(Boolean));
    if (!existsSync(archivo)) {
      omitidas++;
      return '';
    }
    return etiqueta.replace(/src="[^"]+"/, `src="${pathToFileURL(archivo).href}"`);
  });

  // Enlaces internos → URL absoluta del sitio, para que funcionen desde el PDF.
  cuerpo = cuerpo.replace(/href="\/(?!\/)/g, `href="${SITE}/`);

  const titulo = cuerpo.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].trim() ?? pagina;
  return { titulo, cuerpo, omitidas };
}

const CSS = `
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 10.5pt; line-height: 1.55;
         color: #1c1c1c; margin: 0; }
  a { color: #0f766e; text-decoration: none; }
  h1 { font-size: 20pt; margin: 0 0 .4em; line-height: 1.2; }
  h2 { font-size: 14pt; margin: 1.4em 0 .4em; break-after: avoid; }
  h3 { font-size: 11.5pt; margin: 1.2em 0 .3em; break-after: avoid; }
  p { margin: .5em 0; }
  img { max-width: 100%; border: 1px solid #d8d8d8; border-radius: 4px; margin: .5em 0; }
  pre { background: #f6f8fa; border: 1px solid #e4e6e8; border-radius: 4px; padding: 8px 10px;
        font-size: 8.8pt; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
  code { font-family: Consolas, 'Courier New', monospace; font-size: .92em; }
  p code, li code, td code { background: #f2f3f5; padding: 0 3px; border-radius: 3px; }
  table { border-collapse: collapse; width: 100%; font-size: 9.3pt; margin: .6em 0; }
  th, td { border: 1px solid #d0d3d6; padding: 4px 8px; text-align: left; vertical-align: top; }
  th { background: #f2f3f5; }
  blockquote { border-left: 3px solid #0f766e; margin: .8em 0; padding: .2em 0 .2em 12px; color: #444; }
  ul, ol { margin: .4em 0; padding-left: 1.4em; }
  .chapter { break-before: page; }
  .cover { height: 92vh; display: flex; flex-direction: column; justify-content: center; }
  .cover .marca { letter-spacing: .25em; text-transform: uppercase; font-size: 10pt; color: #0f766e; }
  .cover h1 { font-size: 32pt; margin: .2em 0; }
  .cover .version { font-size: 13pt; color: #555; }
  .cover .nota { margin-top: 3em; color: #444; }
  .toc { break-before: page; }
  .toc ol { font-size: 12pt; line-height: 2; }
`;

function armarHtml(nombre, version, producto, capitulos) {
  const toc = capitulos.map((c) => `<li>${c.titulo}</li>`).join('\n');
  const cuerpo = capitulos.map((c) => `<section class="chapter">${c.cuerpo}</section>`).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${nombre} — Documentation</title><style>${CSS}</style></head><body>
<div class="cover">
  <div class="marca">Beasty Components</div>
  <h1>${nombre}</h1>
  <div class="version">Documentation · v${version}</div>
  <div class="nota">
    <p>This PDF covers the basics: installation, core concepts and your first steps.</p>
    <p>The full, always-current documentation lives at<br>
       <a href="${SITE}/docs/${producto}/">${SITE}/docs/${producto}/</a></p>
  </div>
</div>
<div class="toc"><h1>Contents</h1><ol>${toc}</ol></div>
${cuerpo}
</body></html>`;
}

const salida = join(raiz, 'dist-pdf');
mkdirSync(salida, { recursive: true });
const chrome = buscarChrome();
const browser = await puppeteer.launch({ executablePath: chrome });

try {
  for (const asset of ASSETS) {
    const { nombre, version } = datosProducto(asset.producto);
    const capitulos = asset.paginas.map((p) => extraerCapitulo(asset.producto, p));
    const omitidas = capitulos.reduce((n, c) => n + c.omitidas, 0);

    const htmlPath = join(salida, `${asset.carpeta}.html`);
    writeFileSync(htmlPath, armarHtml(nombre, version, asset.producto, capitulos));

    const pdfPath = join(salida, `${asset.carpeta}_Documentation.pdf`);
    const page = await browser.newPage();
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;font-size:8px;color:#888;display:flex;justify-content:space-between;padding:0 16mm;">
        <span>${nombre} · v${version}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' },
    });
    await page.close();

    const destino = join(proyectoUnity, 'Assets', 'BeastyComponents', asset.carpeta);
    let copiado = '';
    if (existsSync(destino)) {
      copyFileSync(pdfPath, join(destino, `${asset.carpeta}_Documentation.pdf`));
      copiado = ` → copiado a ${destino}`;
    } else {
      copiado = ` ⚠ no existe ${destino}; PDF solo en dist-pdf/`;
    }
    const aviso = omitidas ? ` (${omitidas} captura(s) pendientes omitidas)` : '';
    console.log(`✓ ${asset.carpeta}_Documentation.pdf: ${capitulos.length} capítulos${aviso}${copiado}`);
  }
} finally {
  await browser.close();
}
