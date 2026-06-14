(function () {
  var headerHTML = '<header class="header">'
    + '<div class="container">'
    + '<a href="/" class="logo" aria-label="Beasty Components">'
    + '<img class="logo-img logo-img--dark" src="/assets/images/logo%20for%20Dark.svg" alt="Beasty Components" aria-hidden="true">'
    + '<img class="logo-img logo-img--light" src="/assets/images/logo%20for%20Light.svg" alt="Beasty Components" aria-hidden="true">'
    + '<span class="logo-text">easty<span>Components</span></span>'
    + '</a>'
    + '<button class="hamburger" id="hamburger" data-i18n-aria="nav.openMenu" aria-label="Open menu" aria-expanded="false">'
    + '<span></span><span></span><span></span>'
    + '</button>'
    + '<nav class="navbar" id="navbar">'
    + '<ul>'
    + '<li><a href="/" id="nav-link-projects" data-i18n="nav.projects">Projects</a></li>'
    + '<li><a href="#contact" data-i18n="nav.contact">Contact</a></li>'
    + '<li>'
    + '<button id="theme-toggle" aria-label="Toggle theme">'
    + '<span class="light-icon">&#9728;</span>'
    + '<span class="dark-icon">&#9790;</span>'
    + '</button>'
    + '</li>'
    + '<li class="lang-switcher">'
    + '<button data-lang-btn="en">EN</button>'
    + '<span>|</span>'
    + '<button data-lang-btn="es">ES</button>'
    + '</li>'
    + '</ul>'
    + '</nav>'
    + '</div>'
    + '</header>';

  var placeholder = document.getElementById('site-header');
  if (placeholder) {
    placeholder.outerHTML = headerHTML;
  } else {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  }

  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    var projectsLink = document.getElementById('nav-link-projects');
    if (projectsLink) projectsLink.classList.add('active');
  }

  var btn    = document.getElementById('hamburger');
  var navbar = document.getElementById('navbar');
  if (btn && navbar) {
    btn.addEventListener('click', function () {
      var open = navbar.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !navbar.contains(e.target)) {
        navbar.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
