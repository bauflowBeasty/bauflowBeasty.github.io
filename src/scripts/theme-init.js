// Runs inline in <head> before first paint to avoid theme flash.
// Order: saved choice -> OS preference -> dark.
(function () {
  var saved = null;
  try {
    saved = localStorage.getItem('bauflow_theme');
  } catch (e) {}
  var theme =
    saved === 'light' || saved === 'dark'
      ? saved
      : window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
  document.documentElement.dataset.theme = theme;
})();
