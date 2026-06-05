/* ================================================================
   PROYECTOS — Agrega, elimina o modifica proyectos aquí.
   Ver HOW-TO-ADD-PROJECT.md para instrucciones detalladas.
   ================================================================ */

var PROJECTS = [
  {
    id:          "save-system",
    name:        "BeastySaveSystem",
    version:     "1.0.0",
    description: "Sistema de guardado para Unity con cifrado AES-256, gestión de slots múltiples y 21 conversores de tipos de Unity integrados. Soporta async/await y carga por referencia para MonoBehaviours.",
    tags:        ["Unity", "C#", "Plugin"],
    price:       "$15.99",
    freeDemo:    true,
    docUrl:      "/projects/save-system/",
    storeUrl:    "#"
  }

  /* Para agregar un nuevo proyecto, copia el bloque de arriba
     (desde el { hasta el }) y pégalo aquí, separado por una coma.
     Ejemplo:

  ,{
    id:          "inventory-system",
    name:        "BeastyInventory",
    version:     "1.0.0",
    description: "Descripción del proyecto.",
    tags:        ["Unity", "C#"],
    price:       "$12.99",
    freeDemo:    false,
    docUrl:      "/projects/inventory-system/",
    storeUrl:    "#"
  }

  */
];
