/* ==========================================================
   TRANSLATIONS — assembler
   Combina los módulos por idioma y proyecto.
   Agregar idioma nuevo: copia una carpeta en data/translations/
   y añade una línea aquí.
   ========================================================== */

var TRANSLATIONS = {
  en: Object.assign({},
    typeof _T_EN_SHARED !== 'undefined' ? _T_EN_SHARED : {},
    typeof _T_EN_SAVE   !== 'undefined' ? _T_EN_SAVE   : {},
    typeof _T_EN_DL     !== 'undefined' ? _T_EN_DL     : {}
  ),
  es: Object.assign({},
    typeof _T_ES_SHARED !== 'undefined' ? _T_ES_SHARED : {},
    typeof _T_ES_SAVE   !== 'undefined' ? _T_ES_SAVE   : {},
    typeof _T_ES_DL     !== 'undefined' ? _T_ES_DL     : {}
  )
};
