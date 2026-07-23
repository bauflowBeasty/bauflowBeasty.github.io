/**
 * Informa de qué documentación se ha quedado atrás respecto al proyecto Unity.
 *
 * Comprueba, en este orden:
 *   1. Changelog canónico (proyecto Unity) vs copia local en docs/changelogs/
 *   2. Copia local vs página de docs EN (viñeta a viñeta)
 *   3. Página ES vs página EN (recuento de viñetas por sección; el texto está traducido)
 *   4. Archivos .cs tocados en el proyecto Unity según Plastic (pendientes + desde el marcador)
 *   5. Si DOC-INDEX.md se ha quedado obsoleto
 *
 * No modifica nada: solo informa. La ruta del proyecto Unity sale de docs/sync-state.json,
 * y se puede sobrescribir con la variable de entorno BEASTY_PROJECT.
 *
 * Uso: npm run doc:sync
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

const ESTADO = join('docs', 'sync-state.json');
const estado = JSON.parse(readFileSync(ESTADO, 'utf8'));
const PROYECTO = process.env.BEASTY_PROJECT || estado.proyectoUnity;

let problemas = 0;
const seccion = (t) => console.log(`\n${t}\n${'─'.repeat(t.length)}`);
const bien = (t) => console.log(`  ✓ ${t}`);
const aviso = (t) => { problemas++; console.log(`  ⚠ ${t}`); };

/** Texto de cada viñeta, con las líneas continuadas unidas y los espacios normalizados. */
function vinetas(md) {
  const out = [];
  let actual = null;
  for (const linea of md.split(/\r?\n/)) {
    if (/^\s*[-*]\s+/.test(linea)) {
      if (actual) out.push(actual);
      actual = linea.replace(/^\s*[-*]\s+/, '').trim();
    } else if (actual && /^\s+\S/.test(linea)) {
      actual += ' ' + linea.trim();
    } else if (actual) {
      out.push(actual);
      actual = null;
    }
  }
  if (actual) out.push(actual);
  return out.map((v) => v.replace(/\s+/g, ' ').trim());
}

/** Viñetas por sección `###`, para comparar EN y ES sin depender del idioma. */
function vinetasPorSeccion(md) {
  const mapa = new Map();
  let seccionActual = '(sin sección)';
  let indice = 0;
  for (const bloque of md.split(/^(###\s+.+)$/m)) {
    if (/^###\s+/.test(bloque)) { seccionActual = bloque.replace(/^###\s+/, '').trim(); indice++; }
    else mapa.set(`${indice}`, { titulo: seccionActual, n: vinetas(bloque).length });
  }
  return mapa;
}

const sinFrontmatter = (s) => s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

// ── 1 y 2: changelogs ────────────────────────────────────────────────────────
seccion('1. Changelogs: proyecto Unity → docs/changelogs/ → páginas de docs');

if (!existsSync(PROYECTO)) {
  aviso(`no encuentro el proyecto Unity en ${PROYECTO}. Ajusta docs/sync-state.json o BEASTY_PROJECT.`);
} else {
  for (const [asset, cfg] of Object.entries(estado.assets)) {
    const canonico = join(PROYECTO, 'Assets', 'BeastyComponents', asset, cfg.changelog);
    const local = join('docs', 'changelogs', cfg.changelog);
    if (!existsSync(canonico)) { aviso(`${asset}: no existe el changelog canónico (${canonico})`); continue; }
    if (!existsSync(local)) { aviso(`${asset}: falta la copia local docs/changelogs/${cfg.changelog}`); continue; }

    const vCanon = vinetas(readFileSync(canonico, 'utf8'));
    const vLocal = vinetas(readFileSync(local, 'utf8'));
    const soloCanon = vCanon.filter((v) => !vLocal.includes(v));
    const soloLocal = vLocal.filter((v) => !vCanon.includes(v));
    if (!soloCanon.length && !soloLocal.length) bien(`${asset}: changelog canónico == copia local`);
    for (const v of soloCanon) aviso(`${asset}: viñeta SOLO en el canónico → falta traerla: «${v.slice(0, 90)}…»`);
    for (const v of soloLocal) aviso(`${asset}: viñeta SOLO en la copia local → falta llevarla al asset: «${v.slice(0, 90)}…»`);

    // La copia local frente a la página EN de docs.
    const paginaEn = join('src', 'content', 'docs', 'en', cfg.producto, 'changelog.md');
    if (!existsSync(paginaEn)) { aviso(`${asset}: no existe la página ${paginaEn}`); continue; }
    const vPagina = vinetas(sinFrontmatter(readFileSync(paginaEn, 'utf8')));
    const faltanEnPagina = vLocal.filter((v) => !vPagina.includes(v));
    const sobranEnPagina = vPagina.filter((v) => !vLocal.includes(v));
    if (!faltanEnPagina.length && !sobranEnPagina.length) bien(`${asset}: copia local == página EN de docs`);
    for (const v of faltanEnPagina) aviso(`${asset}: la página EN no refleja «${v.slice(0, 90)}…»`);
    for (const v of sobranEnPagina) aviso(`${asset}: la página EN tiene de más «${v.slice(0, 90)}…»`);

    // La página ES, por recuento de viñetas por sección (el texto está traducido).
    const paginaEs = join('src', 'content', 'docs', 'es', cfg.producto, 'changelog.md');
    if (!existsSync(paginaEs)) { aviso(`${asset}: no existe la página ES ${paginaEs}`); continue; }
    const secEn = vinetasPorSeccion(sinFrontmatter(readFileSync(paginaEn, 'utf8')));
    const secEs = vinetasPorSeccion(sinFrontmatter(readFileSync(paginaEs, 'utf8')));
    if (secEn.size !== secEs.size) {
      aviso(`${asset}: EN tiene ${secEn.size} secciones de changelog y ES tiene ${secEs.size}`);
    } else {
      const desajustes = [...secEn.entries()].filter(([k, v]) => secEs.get(k)?.n !== v.n);
      if (!desajustes.length) bien(`${asset}: página ES al día (mismo número de viñetas por sección)`);
      for (const [k, v] of desajustes) {
        aviso(`${asset}: sección «${v.titulo}» tiene ${v.n} viñetas en EN y ${secEs.get(k)?.n} en ES`);
      }
    }
  }
}

// ── 3: código tocado en el proyecto Unity ────────────────────────────────────
seccion('2. Código del proyecto Unity (Plastic SCM)');

function cm(args) {
  return execFileSync(estado.plasticCli, args, {
    encoding: 'utf8', cwd: PROYECTO, timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'],
  });
}

if (!existsSync(estado.plasticCli)) {
  aviso(`no encuentro cm.exe en ${estado.plasticCli}; me salto el diff de código.`);
} else {
  try {
    const salida = cm(['status', '--machinereadable', '--fieldseparator=|']);
    // Formatos: `CH|<ruta>|…` y, en los movidos, `MV|100%|<origen>|<destino>|…`.
    // La ruta buena es siempre el ÚLTIMO campo que termina en .cs (el destino, en un movimiento).
    const cs = salida
      .split(/\r?\n/)
      .filter((l) => /Assets[\\/]BeastyComponents/.test(l))
      .map((l) => l.split('|').filter((c) => /\.cs$/i.test(c.trim())).pop())
      .filter(Boolean)
      .map((p) => p.trim().replace(/^.*?Assets[\\/]/i, 'Assets/').replace(/\\/g, '/'));

    if (!cs.length) bien('sin cambios .cs pendientes de check-in en Assets/BeastyComponents');
    else {
      console.log(`  ${cs.length} archivo(s) .cs pendientes de check-in:`);
      for (const l of [...new Set(cs)].slice(0, 30)) console.log(`     ${l}`);
      if (cs.length > 30) console.log(`     … y ${cs.length - 30} más`);
      console.log('  → revisa si alguno cambia comportamiento documentado (busca sus símbolos en docs/DOC-INDEX.md).');
    }
  } catch (e) {
    // El aviso de certificado de Plastic sale por stdout, no por stderr.
    const msg = [e.stdout, e.stderr, e.message].filter(Boolean).map(String).join('\n');
    if (/certificate|certificado/i.test(msg)) {
      aviso('Plastic pide aceptar el certificado del servidor una vez. Ejecuta `! cm status` en la sesión y responde Y.');
    } else {
      aviso(`no pude consultar Plastic: ${msg.split(/\r?\n/)[0]}`);
    }
  }
}

// ── 4: versiones alineadas ───────────────────────────────────────────────────
seccion('3. Versiones');

/** Primera cabecera `## X.Y.Z — algo` de un changelog. */
function versionDelChangelog(ruta) {
  const m = readFileSync(ruta, 'utf8').match(/^##\s+(\d+\.\d+\.\d+)\s*[—-]\s*(.+)$/m);
  return m ? { version: m[1], estado: m[2].trim() } : null;
}

const productsTs = readFileSync(join('src', 'data', 'products.ts'), 'utf8');
/** Versión declarada en products.ts para un id de producto. */
function versionDeProducts(id) {
  // La coma descarta la unión de tipos (`id: 'a' | 'b' | 'c'`), que no lleva versión.
  const bloque = productsTs.split(/\{\s*\n\s*id:/).find((b) => b.startsWith(` '${id}',`));
  return bloque?.match(/version:\s*'([^']+)'/)?.[1] ?? null;
}

if (existsSync(PROYECTO)) {
  for (const [asset, cfg] of Object.entries(estado.assets)) {
    const local = join('docs', 'changelogs', cfg.changelog);
    if (!existsSync(local)) continue;
    const ch = versionDelChangelog(local);
    const enProducts = versionDeProducts(cfg.producto);
    const readme = join(PROYECTO, 'Assets', 'BeastyComponents', asset, 'README.md');
    const enReadme = existsSync(readme)
      ? readFileSync(readme, 'utf8').match(/\*\*Version\s+(\d+\.\d+\.\d+)\*\*/)?.[1] ?? null
      : null;

    if (!ch) { aviso(`${asset}: no reconozco la cabecera de versión del changelog`); continue; }
    const desalineadas = [
      ['products.ts', enProducts],
      ['README del asset', enReadme],
    ].filter(([, v]) => v && v !== ch.version);

    if (!desalineadas.length) {
      bien(`${asset}: ${ch.version} (${ch.estado}) — changelog, products.ts y README coinciden`);
    } else {
      for (const [donde, v] of desalineadas) {
        aviso(`${asset}: el changelog dice ${ch.version} y ${donde} dice ${v}`);
      }
    }
    if (enProducts === null) aviso(`${asset}: no encuentro version para '${cfg.producto}' en products.ts`);
    if (enReadme === null) aviso(`${asset}: el README del asset no declara **Version X.Y.Z**`);
  }
}

// ── 5: frescura del índice ───────────────────────────────────────────────────
seccion('4. Frescura de docs/DOC-INDEX.md');

const INDICE = join('docs', 'DOC-INDEX.md');
if (!existsSync(INDICE)) aviso('no existe; genéralo con `npm run doc:index`.');
else {
  const tIndice = statSync(INDICE).mtimeMs;
  const masNuevas = [];
  const recorrer = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) recorrer(p);
      else if (e.name.endsWith('.md') && statSync(p).mtimeMs > tIndice) masNuevas.push(p.split(sep).join('/'));
    }
  };
  recorrer(join('src', 'content', 'docs', 'en'));
  if (!masNuevas.length) bien('al día');
  else aviso(`${masNuevas.length} página(s) EN cambiaron después de generarlo. Ejecuta \`npm run doc:index\`.`);
}

console.log(
  problemas
    ? `\n${problemas} punto(s) que revisar.\n`
    : '\nTodo sincronizado.\n'
);
