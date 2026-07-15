---
title: "Primeros pasos"
description: "De un proyecto vacío a un log clasificado en la Beasty Console, en unos dos minutos."
---

De un proyecto vacío a un log clasificado en la Beasty Console, en unos dos minutos.

## Requisitos

- Unity 6000.2 o más reciente.
- Sin dependencias. El paquete no referencia ningún otro asset ni ninguna librería externa.
- La API de logging funciona en el editor y en las builds, en todas las plataformas. La ventana Beasty
  Console es una herramienta de editor.

## Importación

Importa el paquete desde el Package Manager, en My Assets. Se instala en
`Assets/BeastyComponents/BeastyDebugLogger/`:

- `Scripts/` — la API de logging. Esto es lo que se incluye en tu build.
- `Editor/` — la ventana Beasty Console. Esto nunca se incluye en la build.

Nada que configurar. No hay un asset de settings ni configuración de escena.

## Tu primer log

Agrega esto a cualquier MonoBehaviour:

```csharp
using BeastyDebugLoggerConsole;

BeastyDebugLogger.LogInfo("Save file loaded.");
```

Entra en Play Mode. La línea aparece en la propia Consola de Unity, en verde, con una etiqueta de info
delante.

## Abrir la consola

La ventana está en `Tools > Beasty VN > Diagnostics > Console`.

> **Nota**
> La ventana vive bajo el menú `Beasty VN` aunque este paquete no tiene ninguna dependencia de Beasty Visual
> Novel y funciona perfectamente sin él. La ruta de menú es compartida; el código no.

Lo que ves:

- Una barra de herramientas: Clear, Collapse, Clear on Play, Error Pause, y un campo de búsqueda.
- Una segunda barra de toggles de filtro, uno por nivel; cada uno muestra cuántas entradas de ese nivel
  han llegado. Haz clic en uno para ocultar ese nivel.
- La lista, una fila por entrada: el glifo del nivel, la hora, el mensaje.
- Un panel de detalle debajo. Selecciona una fila para leer el mensaje completo y su stack trace.

La consola no reemplaza la Consola de Unity. Escucha en paralelo a ella, así que muestra todos los logs del
proyecto, incluidas las llamadas simples a `Debug.Log` de tu propio código y de paquetes de terceros.

## Siguientes pasos

- [Logging](/es/docs/beasty-debug-logger/guides/logging/) — los once niveles, y cuándo usar cada uno.
- [La ventana Beasty Console](/es/docs/beasty-debug-logger/guides/console-window/) — cada control, y los comportamientos que
  sorprenden a más de uno.
