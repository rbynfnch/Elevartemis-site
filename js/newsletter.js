/* =========================================================
   Elevartemis — Newsletter signup (shared by every page)
   Settings live in js/resources-data.js → NEWSLETTER.

   • Formspree link   → sends the email to Formspree and waits
                        for a real "OK" before saying thanks.
   • Other providers  → posts to the provider in the background.
   • No link yet      → opens the visitor's email app.
   ========================================================= */
(function () {
  'use strict';

  var NL = (window.ELEVARTEMIS_RESOURCES && window.ELEVARTEMIS_RESOURCES.NEWSLETTER) || {};
  var FALLBACK = NL.fallbackEmail || 'Elevartemis@gmail.com';

  function viaFormspree(email, source) {
    var data = new FormData();
    data.append('email', email);
    data.append('source', source || document.title);
    data.append('_subject', 'New Elevartemis Brief subscriber');
    return fetch(NL.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        return { ok: true, message: "You're on the list. The next Brief will land in your inbox." };
      })
      .catch(function () {
        return { ok: false, message: 'Something went wrong. Please try again, or email ' + FALLBACK + ' and we\'ll add you.' };
      });
  }

  function viaHiddenForm(email) {
    var frameName = 'nl-frame';
    if (!document.getElementById(frameName)) {
      var f = document.createElement('iframe');
      f.name = frameName; f.id = frameName; f.hidden = true; f.title = 'Newsletter';
      document.body.appendChild(f);
    }
    var form = document.createElement('form');
    form.action = NL.action; form.method = 'post'; form.target = frameName; form.hidden = true;
    var input = document.createElement('input');
    input.type = 'email'; input.name = NL.emailField || 'email'; input.value = email;
    form.appendChild(input); document.body.appendChild(form); form.submit(); form.remove();
    return Promise.resolve({ ok: true, message: "You're in. Check your inbox to confirm your subscription." });
  }

  function viaEmailApp(email) {
    window.location.href = 'mailto:' + FALLBACK +
      '?subject=' + encodeURIComponent('Subscribe me to the Elevartemis Brief') +
      '&body=' + encodeURIComponent('Please add ' + email + ' to the Elevartemis Brief.');
    return Promise.resolve({ ok: true, message: "Your email app should open with a short note. Send it and you're on the list." });
  }

  window.ElevartemisNewsletter = {
    connected: !!NL.action,
    subscribe: function (email, source) {
      if (!NL.action) return viaEmailApp(email);
      if (/formspree\.io/i.test(NL.action)) return viaFormspree(email, source);
      return viaHiddenForm(email);
    }
  };
})();
