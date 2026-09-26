/* =========================================================
   Elevartemis — Our Work page interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Scrolling screenshots: measure how far each can travel ---------- */
  var shots = document.querySelectorAll('.scroll-shot, .auto-pan');

  function measure(img) {
    var screen = img.parentElement;
    var shift = Math.max(0, img.offsetHeight - screen.offsetHeight);
    img.style.setProperty('--shift', shift + 'px');
    // longer pages scroll for longer, so the speed feels constant
    img.style.setProperty('--dur', Math.min(14, Math.max(4, shift / 450)) + 's');
  }
  function measureAll() { shots.forEach(measure); }

  shots.forEach(function (img) {
    if (img.complete) measure(img);
    else img.addEventListener('load', function () { measure(img); });
  });
  window.addEventListener('resize', measureAll);

  /* ---------- 2. Campaign asset tabs (keyboard accessible) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.asset-tabs [role="tab"]'));

  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- 3. Category nav follows the section in view ---------- */
  var catLinks = Array.prototype.slice.call(document.querySelectorAll('.cat-link'));
  if ('IntersectionObserver' in window && catLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        catLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.cat-section').forEach(function (s) { spy.observe(s); });
  }
})();
