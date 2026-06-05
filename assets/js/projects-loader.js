(function () {
  var grid = document.getElementById('projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  grid.innerHTML = PROJECTS.map(function (p) {
    var tags = p.tags.map(function (t) {
      return '<span class="tag">' + t + '</span>';
    }).join('');

    var freeDemo = p.freeDemo
      ? '<span class="price-free">FREE Demo</span>'
      : '';

    return [
      '<article class="project-card">',
      '  <div class="card-tags">' + tags + '</div>',
      '  <div>',
      '    <span class="card-name">' + p.name + '</span>',
      '    <span class="card-version">v' + p.version + '</span>',
      '  </div>',
      '  <p class="card-desc">' + p.description + '</p>',
      '  <div class="card-footer">',
      '    <div class="price-tag">' + p.price + freeDemo + '</div>',
      '    <a href="' + p.docUrl + '" class="card-link">Ver Docs</a>',
      '  </div>',
      '</article>'
    ].join('\n');
  }).join('\n');
})();
