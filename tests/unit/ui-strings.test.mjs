import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UI, tf } from '../../src/data/ui-strings.ts';

// Strings de interfaz añadidas por el rework (Global Constraints del plan).
const NEW_KEYS = {
  'nav.projects': ['Projects', 'Proyectos'],
  'search.open': ['Search', 'Buscar'],
  'search.close': ['Close search', 'Cerrar búsqueda'],
  'catalog.all': ['All', 'Todo'],
  'catalog.filterLabel': ['Filter by platform', 'Filtrar por plataforma'],
  'catalog.others': ['Other projects', 'Otros proyectos'],
  'featured.new': ['New', 'Nuevo'],
  'where.heading': ['Where to get it', 'Dónde conseguirlo'],
  'widget.show': ['Show {store} widget', 'Mostrar widget de {store}'],
  'widget.notice': ['Loads content from {store}, which may set cookies.', 'Carga contenido de {store}, que puede usar cookies.'],
  'widget.remember': ['Remember my choice', 'Recordar mi elección'],
  'widget.revoke': ['Stop loading store widgets automatically', 'Dejar de cargar los widgets automáticamente'],
  'code.copy': ['Copy', 'Copiar'],
  'code.copied': ['Copied!', '¡Copiado!'],
  'docs.projectSwitch': ['Switch project', 'Cambiar de proyecto'],
  'ecosystem.includes': ['includes', 'incluye'],
  'ecosystem.optional': ['optional', 'opcional'],
};

test('EN and ES have exactly the same keys', () => {
  assert.deepEqual(Object.keys(UI.en).sort(), Object.keys(UI.es).sort());
});

test('the rework strings exist with their exact EN and ES values', () => {
  for (const [key, [en, es]] of Object.entries(NEW_KEYS)) {
    assert.equal(UI.en[key], en, `en.${key}`);
    assert.equal(UI.es[key], es, `es.${key}`);
  }
});

test('tf replaces {placeholders}', () => {
  assert.equal(tf('es', 'widget.show', { store: 'itch.io' }), 'Mostrar widget de itch.io');
  assert.equal(
    tf('en', 'widget.notice', { store: 'Unity Asset Store' }),
    'Loads content from Unity Asset Store, which may set cookies.'
  );
});
