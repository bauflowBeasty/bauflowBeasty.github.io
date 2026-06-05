(function () {
  var root = document.documentElement;
  var btn  = document.getElementById('theme-toggle');
  var saved = localStorage.getItem('theme') || 'dark';

  root.setAttribute('data-theme', saved);

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();
