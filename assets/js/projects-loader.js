(function () {
  function renderProjects(lang) {
    var grid = document.getElementById('projects-grid');
    if (!grid || typeof PROJECTS === 'undefined') return;

    lang = lang || (typeof i18n !== 'undefined' ? i18n.getLang() : null)
                || localStorage.getItem('bauflow_lang')
                || 'en';

    var viewDocs = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang])
      ? TRANSLATIONS[lang].home.viewDocs
      : (lang === 'es' ? 'Ver Docs' : 'View Docs');

    var freeLabel = 'FREE Demo';

    grid.innerHTML = PROJECTS.map(function (p) {
      var tags = p.tags.map(function (t) {
        return '<span class="tag">' + t + '</span>';
      }).join('');

      var desc = (p.description && typeof p.description === 'object')
        ? (p.description[lang] || p.description.en)
        : p.description;

      var freeDemo = p.freeDemo
        ? '<span class="price-free">' + freeLabel + '</span>'
        : '';

      return [
        '<article class="project-card">',
        '  <div class="card-tags">' + tags + '</div>',
        '  <div>',
        '    <span class="card-name">' + p.name + '</span>',
        '    <span class="card-version">v' + p.version + '</span>',
        '  </div>',
        '  <p class="card-desc">' + desc + '</p>',
        '  <div class="card-footer">',
        '    <div class="price-tag">' + p.price + freeDemo + '</div>',
        '    <a href="' + p.docUrl + '" class="card-link">' + viewDocs + '</a>',
        '  </div>',
        '</article>'
      ].join('\n');
    }).join('\n');
  }

  window.renderProjects = renderProjects;

  /* i18n.js se encarga de llamar renderProjects en init y en cada cambio.
     Este auto-run es el fallback por si i18n no está cargado. */
  if (typeof i18n === 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { renderProjects(); });
    } else {
      renderProjects();
    }
  }
})();
