---
title: "Qué se guarda"
description: "Las reglas del sistema: qué parte de tus datos termina en el archivo, cuál no, y qué errores hacen fallar un guardado por completo. Léela una vez, cuanto antes."
---

Las reglas del sistema: qué parte de tus datos termina en el archivo, cuál no, y qué errores hacen
fallar un guardado por completo. Lee esta página una vez, cuanto antes. Es la diferencia entre un sistema de guardado que
funciona y una tarde entera preguntándote por qué desapareció el sombrero del jugador.

## La versión corta

Beasty Save System guarda **campos**, no propiedades. Guarda los mismos campos que serializaría el propio Unity:
los `public` y los marcados con `[SerializeField]`. Guarda casi todos los tipos de datos ordinarios de C# y de Unity.

**No** guarda referencias a objetos de Unity — un `Sprite`, un `GameObject`, un `AudioClip`, otro
componente. Eso es a propósito, y esta página explica qué hacer en su lugar.

## Qué se guarda

### Campos

| Regla | |
|---|---|
| Campos `public` | Guardados |
| Campos `[SerializeField] private` | Guardados |
| Campos privados heredados de una clase base | Guardados, si son `[SerializeField]` |
| Campos `private` simples sin atributo | No guardados |
| Propiedades (cualquier cosa con `{ get; set; }`) | **Nunca guardadas** |

Si aparece en el propio inspector de Unity, es el tipo de cosa que se guarda.

> **Advertencia**
> Las propiedades no se guardan. `public int Level { get; set; }` no escribe nada en el archivo y no lee nada
> de vuelta. Esta es la sorpresa más común de todas. Si un valor debe persistir, conviértelo en un campo.

### Tipos

Todos estos se guardan y recuperan correctamente:

- **Primitivos**: `int`, `long`, `float`, `double`, `bool`, `string`, `char`, `byte`, y el resto.
- **Enums**.
- **Nullables**: `int?`, `float?`, etcétera.
- **`DateTime`**.
- **Colecciones**: arrays, `List<T>`, `Dictionary<K,V>`, `HashSet<T>`, `SortedSet<T>`, `Queue<T>`,
  `Stack<T>`.
- **Tipos de valor de Unity**: `Vector2`, `Vector3`, `Vector4`, `Quaternion`, `Color`, `Rect`, `Bounds` y el
  resto de los tipos matemáticos.
- **Tus propias clases y structs**, anidados tan profundamente como quieras, siempre que sigan las reglas de arriba.

### Componentes en la escena

Cuando guardas una escena con `BeastySaveManager.SaveAll`, cada componente que marcaste en un `BeastySaveable` lo
escribe un convertidor. `Transform`, `Camera`, `Light`, `SpriteRenderer`, `Texture2D` y cualquier
`MonoBehaviour` que escribiste están siempre disponibles. `Animator`, `AudioSource`, `ParticleSystem`, colliders,
`TMP_Text` y los componentes de uGUI vienen de módulos opcionales.

Cada convertidor almacena una lista específica y documentada de campos — no "todo". La lista exacta de campos está
en [converter-modules.md](/es/docs/beasty-save-system/reference/converter-modules/). Léela antes de confiar en uno. Algunas
lagunas llaman la atención: los **triggers de `Animator` se ignoran**, `MeshCollider.sharedMesh` **nunca se guarda**, y
`Light.cookie` se escribe pero **nunca se restaura**.

## Qué NO se guarda

### Referencias a objetos de Unity

Un campo que apunta a un `UnityEngine.Object` — un `Sprite`, un `GameObject`, un `Transform`, un
`AudioClip`, un `Material`, otro `MonoBehaviour` — **no** se escribe en el archivo de guardado. Tampoco se guarda una
colección de ellos (`List<GameObject>`, `Sprite[]`).

Al guardar un `MonoBehaviour`, esos campos se omiten. Al cargar, se dejan exactamente como están.

**Esto es deliberado, y en general es una buena noticia.** Significa que:

- Cargar un guardado no borra las referencias que conectaste en el inspector.
- Tus enlaces de prefab, tus asignaciones de sprite, tus slots de material — todo sigue ahí después de una carga.
- Un archivo de guardado no puede editarse para hacer que tu juego cargue un asset arbitrario.

El cableado de la escena sobrevive a una carga. Eso es exactamente lo que quieres.

> **Advertencia**
> Una excepción peligrosa: un campo `UnityEngine.Object` dentro de una **clase C# plana** (no un
> `MonoBehaviour`) no se omite — hace que **el guardado falle** con `SerializationFailed`. Si le das a
> `BeastySave.Save` una clase de datos que contiene un `Sprite`, obtienes un resultado de error, no un archivo. Mantén las
> referencias a objetos de Unity completamente fuera de tus clases de guardado.

### Qué hacer en su lugar

Guarda algo que *identifique* al objeto, y vuelve a buscarlo cuando cargues.

En lugar de esto:

```csharp
[Serializable]
public class PlayerData
{
    public Sprite hat;          // incorrecto: no se guarda desde un MonoBehaviour,
                                //             y hace fallar el guardado desde una clase plana
}
```

Haz esto:

```csharp
[Serializable]
public class PlayerData
{
    public string hatId = "hat.red";   // un id que tú controlas
}
```

y, al cargar, convierte `hatId` de vuelta en un sprite con la búsqueda que tu juego ya tenga — un
catálogo `ScriptableObject`, un `Dictionary<string, Sprite>` en un manager, una llamada a `Resources.Load`. El
id es el dato de guardado. El sprite es un detalle de tiempo de ejecución.

El mismo patrón se aplica a un prefab ("¿qué tipo de enemigo es este?" → guarda un id de tipo, genera a partir de él), a un
objetivo ("¿a quién sigue el jugador?" → guarda un id, resuélvelo después de cargar) y a cualquier otra cosa que hubieras
almacenado como una referencia.

### Assets referenciados por nombre, dentro de los convertidores incorporados

Algunos de los convertidores de módulo sí almacenan un nombre de asset en lugar de omitir la referencia: `AudioSource.clip`,
`Image.sprite`, y los materiales de física compartidos en los convertidores de collider. Al cargar, se vuelven a resolver
con `Resources.Load`.

Eso tiene una consecuencia que debes conocer: **solo funciona si el asset vive en una carpeta `Resources/`.** Si
no se resuelve, la referencia ya conectada en la escena se deja intacta — sin error, sin crash, solo el
valor anterior. Si dependes de esto, pon el asset en `Resources/`. Si eso no le conviene a tu proyecto, guarda un
id en tu propio script y resuélvelo tú mismo, como arriba.

## Los errores que hacen fallar un guardado

Estos errores no se omiten en silencio: cada uno hace que `BeastySave.Save` devuelva un `SaveResult` fallido, y no se
escribe ningún archivo.

### Un ciclo de referencias

**Síntoma.** El guardado falla con un mensaje que dice que los datos de guardado deben ser acíclicos.

**Causa.** El objeto A contiene a B, y B contiene a A. O un nodo contiene a su padre, que contiene a sus hijos. JSON es un
árbol; no tiene forma de expresar "esto es el mismo objeto otra vez".

**Solución.** Rompe el ciclo antes de guardar. La respuesta habitual es mantener el enlace de hijo a padre fuera de los
datos de guardado — almacena un *id* de padre en lugar de una *referencia* al padre, y reconstruye los enlaces después de cargar.

### NaN o Infinity

**Síntoma.** El guardado falla, y el valor culpable es un `float` o `double` en tus datos.

**Causa.** `NaN` e `Infinity` no son números JSON válidos. No hay forma de escribirlos.

**Solución.** Casi siempre significan que algo ya salió mal en la lógica de tu juego — una división por cero, una
normalización de un vector cero. Encuentra dónde el valor se volvió `NaN` y arréglalo. Si un valor realmente puede
faltar, usa un nullable (`float?`) en lugar de un `NaN` mágico.

### Un diccionario con una clave que no es string-like

**Síntoma.** El guardado falla en un `Dictionary`.

**Causa.** Las claves de un objeto JSON son strings. Beasty Save System acepta claves que se mapean limpiamente a un string:
`string`, primitivos, y enums. Cualquier otra cosa — una clave `Vector3`, una clave de tu propia clase — no se puede
escribir.

**Solución.** Cambia el tipo de la clave a un `string`, un `int` o un enum. Si tu clave es de verdad un valor compuesto,
codifícala en un string, o reemplaza el diccionario por una `List` de pares clave/valor.

### Anidamiento más profundo que 512 niveles

**Síntoma.** El guardado (o un parseo de un archivo editado a mano) falla por profundidad.

**Causa.** El motor JSON tiene un límite de anidamiento de 512 niveles. Existe para que un archivo malformado o
malicioso no pueda reventar la pila.

**Solución.** En la práctica, llegar a 512 niveles significa una estructura recursiva accidental — muy a menudo el mismo
problema que el ciclo de referencias de arriba. Aplana los datos.

### Un `ulong` mayor que `long.MaxValue`

**Síntoma.** El guardado falla en un campo `ulong`.

**Causa.** Los números JSON se escriben como valores con signo de 64 bits. Un `ulong` por encima de `long.MaxValue`
(9,223,372,036,854,775,807) no tiene representación.

**Solución.** Usa `long`, o almacena el valor como un `string` si realmente necesitas el rango completo de `ulong`.

## Checklist para una clase de guardado

- Campos, no propiedades.
- Ningún `UnityEngine.Object` en ninguna parte — guarda ids en su lugar.
- Sin ciclos.
- Las claves de diccionario son strings, primitivos o enums.
- Ningún `NaN` colándose desde tus operaciones matemáticas.

Si tu clase pasa esa lista, se guarda y recupera correctamente.

## Ver también

- [converter-modules.md](/es/docs/beasty-save-system/reference/converter-modules/) — exactamente qué campos almacena cada convertidor incorporado
- [custom-converters.md](/es/docs/beasty-save-system/advanced/custom-converters/) — enseñar al sistema un tipo que no conoce
- [strict-vs-tolerant.md](/es/docs/beasty-save-system/guides/strict-vs-tolerant/) — qué pasa cuando un campo no se puede leer de vuelta
- [results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/) — cada código de error
- [scene-state.md](/es/docs/beasty-save-system/guides/scene-state/) — guardar la escena en lugar de tu propia clase
