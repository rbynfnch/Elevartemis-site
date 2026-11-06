/* =========================================================
   Elevartemis — About page interactions
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Philosophy numbers drift gently as you scroll ---------- */
  var nums = document.querySelectorAll('.phil-num');
  if (!reduceMotion && nums.length) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      nums.forEach(function (n) {
        var r = n.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1
        n.style.setProperty('--py', (progress * 40).toFixed(1) + 'px');
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Newsletter (settings in js/resources-data.js) ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.querySelectorAll('.brief-form').forEach(function (form) {
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var msg = form.querySelector('.brief-msg');
      var email = input.value.trim();
      if (!EMAIL_RE.test(email)) {
        input.setAttribute('aria-invalid', 'true'); msg.className = 'brief-msg is-error';
        msg.textContent = 'Please enter a valid email address.'; input.focus(); return;
      }
      input.removeAttribute('aria-invalid');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Adding you…';
      window.ElevartemisNewsletter.subscribe(email, 'About page').then(function (r) {
        msg.className = 'brief-msg ' + (r.ok ? 'is-ok' : 'is-error');
        msg.textContent = r.message;
        if (r.ok) input.value = '';
        btn.disabled = false; btn.textContent = label;
      });
    });
  });
})();
