(function () {
  var DEFAULT = 'en';
  var KEY = 'bauflow_lang';
  var _callbacks = [];

  function getLang() {
    return localStorage.getItem(KEY) || DEFAULT;
  }

  function setLang(lang) {
    localStorage.setItem(KEY, lang);
    _apply(lang);
    if (typeof window.renderProjects === 'function') window.renderProjects(lang);
    _callbacks.forEach(function (cb) { cb(lang); });
  }

  function onChange(cb) {
    _callbacks.push(cb);
  }

  function _pick(obj, key) {
    return key.split('.').reduce(function (o, k) {
      return (o != null && k in o) ? o[k] : undefined;
    }, obj);
  }

  function _apply(lang) {
    if (typeof TRANSLATIONS === 'undefined') return;
    var t = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = _pick(t, el.getAttribute('data-i18n'));
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = _pick(t, el.getAttribute('data-i18n-html'));
      if (v !== undefined) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = _pick(t, el.getAttribute('data-i18n-aria'));
      if (v !== undefined) el.setAttribute('aria-label', v);
    });

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
    });
  }

  function _init() {
    var lang = getLang();
    _apply(lang);

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang-btn')); });
    });

    if (typeof window.renderProjects === 'function') window.renderProjects(lang);
    _callbacks.forEach(function (cb) { cb(lang); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  window.i18n = { getLang: getLang, setLang: setLang, onChange: onChange };
})();
