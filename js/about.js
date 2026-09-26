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

  /* ---------- Newsletter (same settings as the Resources page) ---------- */
  var NL = (window.ELEVARTEMIS_RESOURCES && window.ELEVARTEMIS_RESOURCES.NEWSLETTER) || {};
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function sendToProvider(email) {
    var frameName = 'nl-frame';
    if (!document.getElementById(frameName)) {
      var f = document.createElement('iframe'); f.name = frameName; f.id = frameName; f.hidden = true; f.title = 'Newsletter';
      document.body.appendChild(f);
    }
    var form = document.createElement('form');
    form.action = NL.action; form.method = 'post'; form.target = frameName; form.hidden = true;
    var input = document.createElement('input'); input.type = 'email'; input.name = NL.emailField || 'email'; input.value = email;
    form.appendChild(input); document.body.appendChild(form); form.submit(); form.remove();
  }

  document.querySelectorAll('.brief-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var msg = form.querySelector('.brief-msg');
      var email = input.value.trim();
      if (!EMAIL_RE.test(email)) {
        input.setAttribute('aria-invalid', 'true'); msg.className = 'brief-msg is-error';
        msg.textContent = 'Please enter a valid email address.'; input.focus(); return;
      }
      input.removeAttribute('aria-invalid'); msg.className = 'brief-msg is-ok';
      if (NL.action) {
        sendToProvider(email);
        msg.textContent = "You're in. Check your inbox to confirm your subscription.";
      } else {
        var to = NL.fallbackEmail || 'hello@elevartemis.com';
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Subscribe me to the Elevartemis Brief') +
          '&body=' + encodeURIComponent('Please add ' + email + ' to the Elevartemis Brief.');
        msg.textContent = "Your email app should open with a short note. Send it and you're on the list.";
      }
    });
  });
})();
