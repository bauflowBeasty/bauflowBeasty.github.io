(function () {
  var toggle  = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('doc-sidebar');
  var overlay = document.getElementById('sidebar-overlay');

  function closeSidebar() {
    if (sidebar)  sidebar.classList.remove('open');
    if (overlay)  overlay.classList.remove('open');
  }

  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  if (sidebar) {
    sidebar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 820) closeSidebar();
      });
    });
  }

  /* Resaltar enlace activo al hacer scroll */
  var sections = document.querySelectorAll('section[id]');
  var links    = document.querySelectorAll('#doc-sidebar a[href^="#"]');

  if (!sections.length || !links.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        var active = document.querySelector('#doc-sidebar a[href="#' + e.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();
