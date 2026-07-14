---
title: "La ventana Beasty Console"
description: "La ventana que te devuelve tus logs: clasifica cada entrada por nivel, le da a cada nivel un toggle de filtro y un contador, y te lleva de una línea de stack tr"
---

La ventana que te devuelve tus logs: clasifica cada entrada por nivel, le da a cada nivel un toggle de
filtro y un contador, y te lleva de una línea de stack trace al archivo en tu IDE.

Ábrela en `Tools > Beasty VN > Diagnostics > Console`. Es una ventana de editor; no se incluye en una
build.

![La Beasty Console con los filtros de nivel y el panel de detalle](/docs-images/beasty-debug-logger/log-console-window.png)

## La barra de herramientas

| Control | Qué hace |
|---|---|
| Clear | Vacía la lista y pone en cero todos los contadores. |
| Collapse | Agrupa mensajes idénticos en una sola fila, mostrando `(Nx)`. |
| Clear on Play | Limpia la lista al entrar en Play Mode. |
| Error Pause | Pausa el editor en el primer error o excepción. |
| Campo de búsqueda | Filtro de subcadena sin distinción de mayúsculas sobre el texto del mensaje. |

Error Pause reacciona a la severidad de Unity, lo que significa solo errores y excepciones. Un
`LogCaution` no pausará el editor; consulta [Logging](/es/docs/beasty-debug-logger/guides/logging/).

## Los filtros de nivel

Debajo de la barra de herramientas hay un toggle por nivel, cada uno mostrando su recuento en vivo. Haz
clic en un toggle para ocultar ese nivel de la lista; haz clic de nuevo para que vuelva. Pasa el cursor
sobre él para ver una descripción de una línea de para qué sirve el nivel.

Hay un toggle para cada nivel que la API puede producir, más dos para todo lo demás: Plain y Unknown.

## La lista

Cada fila es `glifo  [HH:mm:ss]  mensaje`, coloreada por nivel. Con Collapse activado, un mensaje repetido
muestra su cantidad de repeticiones al final de la fila.

Haz clic en una fila para seleccionarla. El panel de detalle debajo muestra el mensaje completo y el stack
trace, ambos como texto seleccionable, así que puedes arrastrar sobre ellos y copiar.

## Abrir el archivo

Las líneas de stack trace que apuntan a un archivo real se dibujan como enlaces. Haz clic en una para abrir
ese archivo en esa línea en tu IDE.

Hacer doble clic en la fila hace lo mismo, pero elige el frame por ti: abre el primer frame que sea código
tuyo, saltando el propio wrapper del logger. Ese suele ser la línea que querías.

Los frames de assemblies compilados no tienen una ruta de archivo real y no son enlaces.

## El divisor

La barra entre la lista y el panel de detalle es arrastrable. Arrástrala hacia arriba para leer un stack
trace largo, hacia abajo para ver más filas.

## Comportamientos que vale la pena conocer

Esto no son bugs. Es cómo funciona la ventana, y conocerlos ahora te ahorrará un ticket de soporte más
adelante.

**Muestra todo, no solo los logs de Beasty.** La ventana escucha el flujo de logs de Unity, así que recibe
cada log del proyecto: tus propias llamadas a `Debug.Log`, y mensajes de paquetes de terceros. Una entrada
que no puede clasificar se archiva como Plain (un log simple) o Unknown. Si quieres que todo esté
clasificado, loguea a través de [la API](/es/docs/beasty-debug-logger/guides/logging/).

**Collapse no es retroactivo.** Activar Collapse agrupa mensajes que llegan *a partir de ese momento*. Las
entradas que ya están en la lista quedan como están. Limpia la lista primero si quieres una vista colapsada
limpia.

**Los contadores ignoran el campo de búsqueda.** El número en cada toggle de filtro cuenta cada entrada de
ese nivel que ha llegado, sin importar lo que hayas escrito en el cuadro de búsqueda ni lo que esté
actualmente oculto. Solo Clear los reinicia.

**La lista no sobrevive a una recompilación.** Un cambio de script dispara un domain reload, y el reload
descarta la lista. Los logs de antes de la recompilación desaparecen. Por eso también la lista está vacía
cuando reabres la ventana después de una compilación.

**La visualización elimina todo entre `<` y `>`.** La ventana elimina las etiquetas de rich-text para que
el marcado de color no aparezca como texto literal en pantalla. Las elimina con una regla poco selectiva,
así que un mensaje que legítimamente contiene corchetes angulares pierde ese fragmento en la visualización:
loguea `Deprecated call: GetComponent<Rigidbody2D>` y la fila se lee `Deprecated call: GetComponent`. El
mensaje llegó a Unity intacto — solo se ve afectada la visualización. Si los corchetes importan, escribe
el mensaje sin ellos.

## Ver también

- [Logging](/es/docs/beasty-debug-logger/guides/logging/)
- [Preguntas frecuentes](/es/docs/beasty-debug-logger/faq/)
