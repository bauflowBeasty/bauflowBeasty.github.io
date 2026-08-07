---
title: "Guardados en la nube con Firebase"
description: "Importa el SDK de Firebase y elige backend: Firestore o Realtime Database, guardados por usuario con inicio de sesión anónimo, y nada más que configurar."
---

El asset incluye dos backends en la nube construidos sobre Firebase: **Firestore** y **Realtime
Database**. Ambos almacenan los guardados de cada jugador bajo su propio id de usuario, inician sesión de
forma anónima cuando nada más lo ha hecho, y no necesitan más configuración que importar el SDK de
Firebase. Esta página recorre la puesta en marcha, muestra dónde viven los datos, y da las reglas de
seguridad que la disposición espera.

## Qué necesitas

1. Un proyecto de Firebase, y el **SDK de Firebase para Unity** configurado en tu proyecto de Unity tal
   como lo describe la propia guía de Google (el SDK llega como archivos `.unitypackage` o paquetes UPM,
   más el archivo de configuración de Firebase de tu proyecto).
2. El paquete de **Firebase Auth** — los dos backends lo necesitan para la disposición por usuario.
3. **Firestore** o **Realtime Database** — el backend que vayas a usar.

Esa es toda la lista. Los módulos de Firebase del asset se compilan solos cuando el SDK está presente y
se quedan fuera del build cuando no lo está: un proyecto sin Firebase compila, corre y guarda en local
exactamente como antes.

## Los módulos se compilan solos

Tres scripting defines controlan los módulos, y el editor los gestiona por ti:

| Define | Controla | Vigila |
|---|---|---|
| `BEASTY_HAS_FIREBASE_AUTH` | El módulo de Auth (inicio de sesión anónimo) | `Firebase.Auth` |
| `BEASTY_HAS_FIRESTORE` | El backend de Firestore | `Firebase.Firestore` |
| `BEASTY_HAS_FIREBASE_RTDB` | El backend de Realtime Database | `Firebase.Database` |

En una instalación por UPM los módulos detectan los paquetes directamente. En una instalación por
`.unitypackage`, un detector (`FirebaseSdkDetector`) añade y quita los defines por build target según el
SDK aparece o desaparece del proyecto — nunca editas los Player Settings a mano, y quitar el SDK los
limpia de nuevo. Cuando cambia algo lo dice en la consola: «Firebase SDK detection updated the scripting
defines.»

## Elige el backend

Abre tu `BeastySaveManager` y pon **Storage** en **Firebase Firestore** (`firestore`) o en
**Firebase Realtime Database** (`realtime-db`). Esa es la única decisión:

- Las llamadas de guardado y carga van ahora a la nube, por usuario, de forma asíncrona. El Save Mode
  queda fijado en `Asynchronous`.
- Los archivos locales dejan de escribirse; `Folder`, `Extension` y `DataPath` se deshabilitan en el
  editor.
- Nada más cambia en tu escena — los botones conectados a `SaveAll`/`LoadAll` siguen funcionando.

¿Cuál de los dos? **Firestore** si empiezas de cero — su disposición (documentos y subcolecciones) encaja
con la estructura del guardado de forma natural. **Realtime Database** si tu proyecto ya vive ahí. El save
system se comporta idéntico en ambos.

## Quién tiene la sesión iniciada

El módulo de Auth registra un proveedor de usuario que resuelve la identidad en este orden:

1. **Un usuario que tu juego ya haya iniciado** — email, Google, cualquier cosa que Firebase Auth
   soporte — se usa tal cual. El save system nunca cierra la sesión de un usuario ni cambia su sesión.
2. Si no lo hay, el primer guardado **inicia sesión de forma anónima** y ese uid es el dueño de los
   guardados desde entonces.

El inicio de sesión anónimo tiene que estar habilitado en la consola de Firebase (Authentication ▸
Sign-in method). Si no lo está, los guardados fallan con el error tipado `AuthRequired` y el mensaje
«Anonymous sign-in did not produce a user. Is Anonymous auth enabled in the Firebase console?».

Para controlar la identidad tú mismo, asigna `BeastySaveUsers.Provider` — consulta
[custom-backends.md](/es/docs/beasty-save-system/advanced/custom-backends/).

## Dónde viven los datos

![La consola de Firestore mostrando un guardado: el documento de cabecera y su subcolección de chunks](/docs-images/beasty-save-system/save-firebase-console-data.png)

Los dos backends almacenan el mismo texto de sobre que escribiría un guardado a archivo — checksum,
versiones, metadatos, cifrado opcional — bajo el usuario con la sesión iniciada:

**Firestore.** Un documento *cabecera* por slot en `users/{uid}/saves/{slot}`, con el número de trozos y
una marca de tiempo del servidor. El texto del sobre vive en una subcolección `chunks`, partido en piezas
de hasta 500 000 caracteres, porque Firestore limita un documento a 1 MiB. Las copias de seguridad
replican la misma disposición bajo `users/{uid}/backups/{slot}`. Las escrituras van en lote, así que un
guardado reemplaza sus trozos de forma atómica.

**Realtime Database.** El sobre vive como una cadena plana en `users/{uid}/saves/{slot}` (con el nombre
del slot escapado para los caracteres que Realtime Database prohíbe en las claves), junto a una marca de
tiempo del servidor. Un pequeño índice de nombres bajo `users/{uid}/slots` mantiene `ListSlotsAsync`
barato, y las copias de seguridad replican el nodo de guardado bajo `users/{uid}/backups`.

## Reglas de seguridad

La disposición es por usuario a propósito: escribe las reglas de modo que **cada uid solo pueda leer y
escribir su propio subárbol**. Para Firestore:

```text
match /users/{uid}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

Para Realtime Database:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

Sin reglas como estas, cualquier jugador con sesión iniciada puede leer — o sobrescribir — los guardados
de cualquier otro.

## Cuando algo sale mal

Los modos de fallo de la nube son tipados, como cualquier otro error:

- **`AuthRequired`** — no se pudo resolver ningún usuario. Comprueba que el inicio de sesión anónimo esté
  habilitado, o que tu propio inicio de sesión haya corrido.
- **`NetworkError`** — la operación falló por el camino, o a un guardado almacenado le falta un trozo.
  Deja que el jugador reintente.
- **`Corrupt`** — un documento de cabecera de Firestore sin un número de trozos válido. Los datos
  almacenados están incompletos o los escribió otra cosa.
- **`BackendUnavailable`** — el módulo no compiló. Falta el SDK, o los defines aún no se han puesto al
  día (busca en la consola el mensaje del detector).

Con el registro en nivel **Verbose**, cada operación en la nube registra el id de usuario resuelto, y las
lecturas de Firestore dicen si el snapshot vino del servidor o de la **caché sin conexión** del SDK — lo
primero que comprobar cuando un dispositivo muestra datos desactualizados. Consulta
[logging.md](/es/docs/beasty-save-system/guides/logging/).

## Probar contra un proyecto real

Una suite de tests en vivo (`BeastySaveSystem.Firebase.Tests`) viene con el asset y compila solo con el
SDK de Firebase instalado **y** el scripting define `BEASTY_DEV_TOOLS` activo, como el resto de los tests
internos. Ejecuta idas y vueltas reales a Firestore — guardar, frescura con doble lectura, inicio de
sesión anónimo, detección de cabecera corrupta — contra el proyecto de Firebase para el que esté
configurado tu proyecto de Unity. Cada paso esperado tiene un timeout duro que nombra el paso atascado en
lugar de colgar el Test Runner.

## Ver también

- [storage-backends.md](/es/docs/beasty-save-system/guides/storage-backends/) — el desplegable Storage, el Save Mode y la identidad de usuario
- [async-saving.md](/es/docs/beasty-save-system/guides/async-saving/) — la API asíncrona que exigen los backends en la nube
- [results-and-errors.md](/es/docs/beasty-save-system/reference/results-and-errors/) — `AuthRequired`, `NetworkError` y el resto
- [logging.md](/es/docs/beasty-save-system/guides/logging/) — el diagnóstico Verbose de las operaciones en la nube
- [encryption.md](/es/docs/beasty-save-system/guides/encryption/) — el sobre en la nube es el mismo sobre
