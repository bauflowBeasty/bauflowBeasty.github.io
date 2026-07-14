/* ================================================================
   PROYECTOS — Agrega, elimina o modifica proyectos aquí.
   Ver HOW-TO-ADD-PROJECT.md para instrucciones detalladas.
   ================================================================ */

var PROJECTS = [
  {
    id:          "save-system",
    name:        "BeastySaveSystem",
    version:     "1.0.0",
    description: {
      en: "Unity save system with AES-256 encryption, multiple save slots, and 21 built-in Unity type converters. Supports async/await and load-by-reference for MonoBehaviours.",
      es: "Sistema de guardado para Unity con cifrado AES-256, gestión de slots múltiples y 21 conversores de tipos de Unity integrados. Soporta async/await y carga por referencia para MonoBehaviours."
    },
    tags:        ["Unity", "C#", "Plugin"],
    price:       "$9.99",
    freeDemo:    false,
    docUrl:      "/projects/save-system/",
    storeUrl:    ""
  }

 ,{
    id:          "debug-logger",
    name:        "BeastyConsole",
    version:     "1.0.0",
    description: {
      en: "Color-coded, emoji-enhanced logging system for Unity with an integrated custom console window. 12 semantic log levels, master switch, per-call conditional printing, and one-click IDE navigation.",
      es: "Sistema de logging para Unity con colores y emojis, con ventana de consola personalizada integrada. 12 niveles semánticos, switch global, impresión condicional por llamada y navegación directa al IDE."
    },
    tags:        ["Unity", "C#", "Plugin"],
    price:       "$4.99",
    freeDemo:    false,
    docUrl:      "/projects/debug-logger/",
    storeUrl:    ""
  }

  /* Para agregar un nuevo proyecto, copia el bloque de arriba
     (desde el { hasta el }) y pégalo aquí, separado por una coma.
     Ejemplo:

  ,{
    id:          "inventory-system",
    name:        "BeastyInventory",
    version:     "1.0.0",
    description: {
      en: "Project description in English.",
      es: "Descripción del proyecto en español."
    },
    tags:        ["Unity", "C#"],
    price:       "$12.99",
    freeDemo:    false,
    docUrl:      "/projects/inventory-system/",
    storeUrl:    "#"
  }

  */
];
