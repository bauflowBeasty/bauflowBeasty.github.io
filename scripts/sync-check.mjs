/**
 * Informa de qué documentación se ha quedado atrás respecto al proyecto Unity.
 *
 * Modelo de changelogs (decisión de Álvaro, 2026-10-31):
 *   - El changelog canónico (proyecto Unity) es detallado mientras la versión está `unreleased`: es el
 *     canal de traspaso hacia la documentación. Al publicar (/release) esa versión se reduce a un resumen.
 *   - docs/changelogs/ es una COPIA EXACTA del canónico: registra lo que ya se documentó. Una viñeta que
 *     está en el canónico y no en la copia es trabajo pendiente para /sync-docs.
 *   - Las páginas <producto>/changelog.md son siempre un RESUMEN, agrupado en ### New / Improved / Fixed
 *     (ES: Nuevo / Mejorado / Corregido). En las versiones publicadas el resumen es idéntico al canónico;
 *     en la versión `unreleased` es un borrador propio que /release copiará al canónico.
 *
 * Comprueba, en este orden:
 *   1. Changelog canónico vs copia local (viñeta a viñeta) → lo pendiente de documentar
 *   2. Copia local vs página EN: mismas versiones; las publicadas, viñeta a viñeta; formato del resumen
 *   3. Página ES vs página EN (mismas versiones y viñetas por sección; el texto está traducido)
 *   4. Archivos .cs tocados en el proyecto Unity según Plastic (pendientes de check-in)
 *   5. Versiones alineadas en los cuatro sitios
 *   6. Si DOC-INDEX.md se ha quedado obsoleto
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

const sinFrontmatter = (s) => s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

/**
 * Separa un changelog en versiones `## X.Y.Z — estado` y, dentro, en secciones `###`.
 * Una versión está publicada si su estado lleva una fecha (tiene dígitos); `unreleased` / `sin publicar` no.
 */
function versiones(md) {
  const out = [];
  let version = null;
  let seccion = null;
  let buffer = [];
  const cerrar = () => {
    if (seccion) seccion.vinetas = vinetas(buffer.join('\n'));
    buffer = [];
  };
  for (const linea of sinFrontmatter(md).split(/\r?\n/)) {
    const mv = linea.match(/^##\s+(\d+\.\d+\.\d+)\s*[—-]\s*(.+?)\s*$/);
    const ms = linea.match(/^###\s+(.+?)\s*$/);
    if (mv) {
      cerrar();
      seccion = { titulo: '(sin sección)', vinetas: [] };
      version = { version: mv[1], estado: mv[2], publicada: /\d/.test(mv[2]), secciones: [seccion] };
      out.push(version);
    } else if (ms && version) {
      cerrar();
      seccion = { titulo: ms[1], vinetas: [] };
      version.secciones.push(seccion);
    } else if (seccion) {
      buffer.push(linea);
    }
  }
  cerrar();
  for (const v of out) {
    v.secciones = v.secciones.filter((s) => s.titulo !== '(sin sección)' || s.vinetas.length);
    v.todas = v.secciones.flatMap((s) => s.vinetas);
  }
  return out;
}

/** Secciones permitidas en el resumen de las páginas de changelog (docs/GUIA-ESTILO-DOCS.md). */
const SECCIONES_RESUMEN = {
  en: ['New', 'Improved', 'Fixed'],
  es: ['Nuevo', 'Mejorado', 'Corregido'],
};
/** Una viñeta de resumen más larga que esto ya no es un resumen. */
const MAX_VINETA_RESUMEN = 240;

const corto = (v) => `«${v.slice(0, 90)}…»`;

// ── 1 y 2: changelogs ────────────────────────────────────────────────────────
seccion('1. Changelogs: proyecto Unity → docs/changelogs/ → páginas de docs');

if (!existsSync(PROYECTO)) {
  aviso(`no encuentro el proyecto Unity en ${PROYECTO}. Ajusta docs/sync-state.json o BEASTY_PROJECT.`);
} else {
  for (const [asset, cfg] of Object.entries(estado.assets)) {
    const canonico = join(PROYECTO, 'Assets', 'BeastyComponents', asset, cfg.changelog);
    const local = join('docs', 'changelogs', cfg.changelog);
    if (!existsSync(local)) { aviso(`${asset}: falta la copia local docs/changelogs/${cfg.changelog}`); continue; }

    // 1. Canónico frente a la copia local: lo que /sync-docs aún no ha documentado.
    if (!existsSync(canonico)) {
      aviso(`${asset}: no existe el changelog canónico (${canonico}); compruebo solo la copia local y las páginas`);
    } else {
      const vCanon = vinetas(readFileSync(canonico, 'utf8'));
      const vLocal = vinetas(readFileSync(local, 'utf8'));
      const soloCanon = vCanon.filter((v) => !vLocal.includes(v));
      const soloLocal = vLocal.filter((v) => !vCanon.includes(v));
      if (!soloCanon.length && !soloLocal.length) bien(`${asset}: changelog canónico == copia local`);
      if (soloCanon.length) {
        aviso(`${asset}: ${soloCanon.length} viñeta(s) del canónico sin documentar todavía (no están en la copia local):`);
        for (const v of soloCanon) console.log(`       · ${corto(v)}`);
      }
      for (const v of soloLocal) {
        aviso(`${asset}: viñeta SOLO en la copia local (el canónico la cambió o la quitó; vuelve a copiarlo): ${corto(v)}`);
      }
    }

    // 2. La copia local frente a la página EN, que es un resumen.
    const paginaEn = join('src', 'content', 'docs', 'en', cfg.producto, 'changelog.md');
    if (!existsSync(paginaEn)) { aviso(`${asset}: no existe la página ${paginaEn}`); continue; }
    const verLocal = versiones(readFileSync(local, 'utf8'));
    const verEn = versiones(readFileSync(paginaEn, 'utf8'));
    const antes = problemas;

    const numsLocal = verLocal.map((v) => v.version).join(', ');
    const numsEn = verEn.map((v) => v.version).join(', ');
    if (numsLocal !== numsEn) aviso(`${asset}: versiones distintas — copia local [${numsLocal}], página EN [${numsEn}]`);

    for (const vl of verLocal) {
      const ve = verEn.find((v) => v.version === vl.version);
      if (!ve) continue;
      if (ve.estado !== vl.estado) aviso(`${asset} ${vl.version}: la cabecera dice «${vl.estado}» en la copia local y «${ve.estado}» en la página EN`);
      if (vl.publicada) {
        // Publicada: el canónico ya es el resumen, así que la página lo reproduce viñeta a viñeta.
        for (const v of vl.todas.filter((x) => !ve.todas.includes(x))) aviso(`${asset} ${vl.version}: la página EN no refleja ${corto(v)}`);
        for (const v of ve.todas.filter((x) => !vl.todas.includes(x))) aviso(`${asset} ${vl.version}: la página EN tiene de más ${corto(v)}`);
      } else if (!ve.todas.length) {
        aviso(`${asset} ${vl.version}: la página EN no tiene aún el resumen de esta versión`);
      }
    }
    for (const ve of verEn) {
      for (const s of ve.secciones) {
        if (!SECCIONES_RESUMEN.en.includes(s.titulo)) {
          aviso(`${asset} ${ve.version}: sección «${s.titulo}» en la página EN; el resumen usa solo ${SECCIONES_RESUMEN.en.join(' / ')}`);
        }
      }
      for (const v of ve.todas.filter((x) => x.length > MAX_VINETA_RESUMEN)) {
        aviso(`${asset} ${ve.version}: viñeta de ${v.length} caracteres, demasiado larga para un resumen: ${corto(v)}`);
      }
    }
    if (problemas === antes) bien(`${asset}: página EN al día (resumen con las mismas versiones que la copia local)`);

    // 3. La página ES frente a la EN: mismas versiones, secciones y viñetas por sección (el texto está traducido).
    const paginaEs = join('src', 'content', 'docs', 'es', cfg.producto, 'changelog.md');
    if (!existsSync(paginaEs)) { aviso(`${asset}: no existe la página ES ${paginaEs}`); continue; }
    const verEs = versiones(readFileSync(paginaEs, 'utf8'));
    const antesEs = problemas;
    const numsEs = verEs.map((v) => v.version).join(', ');
    if (numsEs !== numsEn) aviso(`${asset}: versiones distintas — página EN [${numsEn}], página ES [${numsEs}]`);
    for (const ve of verEn) {
      const vs = verEs.find((v) => v.version === ve.version);
      if (!vs) continue;
      if (vs.publicada !== ve.publicada) aviso(`${asset} ${ve.version}: publicada en una página y sin publicar en la otra`);
      const cuenta = (v) => v.secciones.map((s) => s.vinetas.length).join('/');
      if (cuenta(vs) !== cuenta(ve)) {
        aviso(`${asset} ${ve.version}: viñetas por sección EN ${cuenta(ve)} y ES ${cuenta(vs)}`);
      }
      for (const s of vs.secciones) {
        if (!SECCIONES_RESUMEN.es.includes(s.titulo)) {
          aviso(`${asset} ${vs.version}: sección «${s.titulo}» en la página ES; el resumen usa solo ${SECCIONES_RESUMEN.es.join(' / ')}`);
        }
      }
    }
    if (problemas === antesEs) bien(`${asset}: página ES al día (mismas versiones y viñetas por sección)`);
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

/**
 * Última versión PUBLICADA (cabecera con fecha) de un changelog, y la que está en curso si la hay.
 * products.ts y el README declaran la publicada: la `unreleased` sube a esos sitios al hacer /release.
 */
function versionDelChangelog(ruta) {
  const todas = versiones(readFileSync(ruta, 'utf8'));
  const publicada = todas.find((v) => v.publicada);
  if (!publicada) return null;
  const enCurso = todas.find((v) => !v.publicada);
  return { version: publicada.version, estado: publicada.estado, enCurso: enCurso?.version ?? null };
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
      const curso = ch.enCurso ? `; ${ch.enCurso} en curso, sin publicar` : '';
      bien(`${asset}: ${ch.version} (${ch.estado}) — changelog, products.ts y README coinciden${curso}`);
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
