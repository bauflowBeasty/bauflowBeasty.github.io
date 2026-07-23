---
name: release
description: Publica una versión de un asset Beasty: cierra su changelog, sube el número de versión en los cuatro sitios donde vive, refleja todo en la documentación EN y ES, y verifica. Úsalo cuando Álvaro diga "voy a publicar la 1.0.0", "saca la versión X de Y", "cierra la versión" o invoque /release.
---

# Publicar una versión

Se ejecuta **desde este repositorio**, pero toca los dos proyectos: el número de versión vive tanto aquí
como en el proyecto Unity (`E:\Beasty\BeastyVisualNovel`), y puedes editar allí directamente.

**Cada asset se versiona por separado.** Beasty Save System puede ir por la 1.0.1 mientras Beasty Visual
Novel sigue en la 1.0.0. Nunca subas la versión de un asset que no cambió.

## Antes de empezar

Pregunta a Álvaro **qué asset** y **qué versión**, si no lo ha dicho. Y comprueba el punto de partida:

```
npm run doc:sync
```

La sección «Versiones» te dice qué versión declara hoy cada asset y si los cuatro sitios coinciden. Si algo
ya está desalineado antes de empezar, arréglalo primero o pregunta.

## Los cuatro sitios donde vive la versión

| Dónde | Qué hay que cambiar |
|---|---|
| `E:\…\Assets\BeastyComponents\<asset>\<Asset>_CHANGELOG.md` | La cabecera `## X.Y.Z — unreleased` |
| `E:\…\Assets\BeastyComponents\<asset>\README.md` | La línea `**Version X.Y.Z** — requires Unity…` |
| `src/data/products.ts` | El campo `version` del producto |
| `docs/changelogs/<Asset>_CHANGELOG.md` + páginas `<producto>/changelog.md` (EN y ES) | El reflejo de todo lo anterior |

## Procedimiento

### 1. Cerrar la versión en el changelog canónico (proyecto Unity)

En `E:\…\Assets\BeastyComponents\<asset>\<Asset>_CHANGELOG.md`:

- `## X.Y.Z — unreleased` pasa a `## X.Y.Z — YYYY-MM-DD`, con la fecha real de publicación.
- **Elimina la sección `### Pre-release changes`** (decisión de Álvaro, 2026-07-21). Quien compra la versión
  publicada nunca tuvo las builds anteriores: esas viñetas describen cambios respecto a algo que no vivió, y
  varias marcan `(**breaking**)` sobre una API que para él es nueva.
  **Antes de borrarla, lee cada viñeta**: si alguna aporta información que sigue siendo verdad y útil —una
  garantía de comportamiento, una advertencia— fúndela en la sección temática que le corresponda, redactada
  como descripción del comportamiento actual, no como cambio. Si dudas de alguna, pregunta a Álvaro.
- No abras una sección `## <siguiente> — unreleased` vacía. La creará el comando `/changelog` del proyecto
  Unity la próxima vez que haya algo que anotar.

### 2. Subir el número donde toque

- README del asset (proyecto Unity): la línea `**Version X.Y.Z**`.
- `src/data/products.ts`: el campo `version` de ese producto.

### 3. Reflejar en la documentación

- Copia el changelog canónico a `docs/changelogs/<Asset>_CHANGELOG.md`.
- Refleja los mismos cambios en `src/content/docs/en/<producto>/changelog.md` y en su gemela ES
  (`title: "Historial de cambios"`, `## X.Y.Z — <fecha>`; en ES la fecha va en formato español).
- Busca menciones sueltas del número de versión en las páginas y revísalas una a una:

```
Grep pattern="X\.Y\.Z" path="src/content/docs"
```

  Hay frases del tipo «WebGL is not supported in 1.0.0» en FAQ y troubleshooting: decide con Álvaro si la
  limitación sigue siendo cierta en la versión nueva antes de cambiar el número.

### 4. Enlaces de tienda

Si es la primera publicación del asset, sus `storeLinks` en `products.ts` tienen `url: null`, que la web
renderiza como «Coming soon». Pregunta a Álvaro si ya tiene las URLs de Asset Store e itch.io para
sustituirlas.

### 5. Verificar

```
npm run doc:index
npm run build
npm run doc:links
npm run doc:sync
```

La sección «Versiones» de `doc:sync` debe mostrar la versión nueva y la fecha, con los tres sitios
coincidiendo.

### 6. Cerrar

Recuérdale a Álvaro los pasos que solo puede dar él:

1. **Check-in en Plastic** de los cambios del proyecto Unity (changelog y README).
2. **Commit aquí, y merge de `Develop` a `main`** — el deploy de GitHub Pages solo corre al empujar a `main`,
   así que sin ese merge la documentación publicada sigue mostrando la versión anterior.
3. **Subir el paquete** a Asset Store / itch.io con esa misma versión.

Y dile explícitamente qué versión quedó publicada y qué asset.

## La documentación no se versiona

Decisión de Álvaro (2026-07-21): **el sitio describe siempre la última versión de cada asset**. No hay
árboles `/v1.0/`, `/v1.1/`, y no se conservan páginas de versiones antiguas. La historia la lleva el
changelog, que sí está completo y publicado como una página más.

Consecuencia práctica: cuando la documentación de una página deje de ser cierta por un cambio de versión, se
**reescribe** esa página, no se duplica.
