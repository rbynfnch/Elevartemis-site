/* =========================================================
   Elevartemis — Contact form
   Two light steps, friendly validation, and delivery via a
   form service (set the form's action) or email as a fallback.
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var FALLBACK_EMAIL = 'hello@elevartemis.com';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var step1 = document.getElementById('step1');
  var step2 = document.getElementById('step2');
  var fill = document.getElementById('progressFill');
  var label = document.getElementById('progressLabel');
  var card = document.getElementById('formCard');
  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------- validation (step 1 only; everything else is optional) ---------- */
  var rules = [
    { id: 'name', msg: "We'd love to know what to call you." },
    { id: 'business', msg: "What's the name of your business?" },
    { id: 'email', msg: 'Please add an email so we can write back.', test: function (v) { return EMAIL_RE.test(v); }, bad: "That email doesn't look quite right." }
  ];

  function validateStep1() {
    var firstBad = null;
    rules.forEach(function (r) {
      var input = document.getElementById(r.id);
      var err = document.getElementById(r.id + '-err');
      var v = input.value.trim();
      var msg = '';
      if (!v) msg = r.msg;
      else if (r.test && !r.test(v)) msg = r.bad;
      err.textContent = msg;
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', r.id + '-err');
        if (!firstBad) firstBad = input;
      } else {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      }
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  // clear an error as soon as it's fixed
  rules.forEach(function (r) {
    document.getElementById(r.id).addEventListener('input', function () {
      if (this.getAttribute('aria-invalid') === 'true') {
        var v = this.value.trim();
        if (v && (!r.test || r.test(v))) {
          this.removeAttribute('aria-invalid');
          document.getElementById(r.id + '-err').textContent = '';
        }
      }
    });
  });

  /* ---------- step navigation ---------- */
  function goTo(n) {
    var two = n === 2;
    form.classList.toggle('on-step-2', two);
    fill.style.width = two ? '100%' : '50%';
    label.textContent = two ? 'Step 2 of 2 · What you\'re working on' : 'Step 1 of 2 · About you';
    var target = two ? step2 : step1;
    target.classList.remove('entering'); void target.offsetWidth; target.classList.add('entering');

    if (two) {
      var first = document.getElementById('name').value.trim().split(/\s+/)[0];
      document.getElementById('hiName').textContent = first ? ', ' + first : '';
    }
    var top = card.getBoundingClientRect().top;
    if (top < 80) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    var focusEl = two ? step2.querySelector('input') : document.getElementById('name');
    setTimeout(function () { focusEl.focus({ preventScroll: true }); }, reduceMotion ? 0 : 350);
  }

  document.getElementById('toStep2').addEventListener('click', function () {
    if (validateStep1()) goTo(2);
  });
  document.getElementById('backTo1').addEventListener('click', function () { goTo(1); });

  /* ---------- progressive reveals ---------- */
  var other = document.getElementById('needOther');
  var otherWrap = document.getElementById('otherWrap');
  other.addEventListener('change', function () { otherWrap.hidden = !other.checked; if (other.checked) document.getElementById('other_need').focus(); });

  var deadlineWrap = document.getElementById('deadlineWrap');
  form.querySelectorAll('input[name="timing"]').forEach(function (r) {
    r.addEventListener('change', function () { deadlineWrap.hidden = !document.getElementById('timingProject').checked; });
  });

  /* ---------- gather answers ---------- */
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function checked(name) {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; });
  }
  function summary() {
    var needs = checked('needs');
    if (val('other_need')) needs = needs.map(function (n) { return n === 'Something else' ? 'Something else: ' + val('other_need') : n; });
    var lines = [
      'Name: ' + val('name'),
      'Business: ' + val('business'),
      'Email: ' + val('email'),
      'Website: ' + (val('website') || '-'),
      'Phone: ' + (val('phone') || '-'),
      '',
      'Working on: ' + (needs.join(', ') || '-'),
      'Where they are: ' + (checked('timing')[0] || '-') + (val('deadline') ? ' (timing: ' + val('deadline') + ')' : ''),
      'Budget: ' + (checked('budget')[0] || '-'),
      '',
      "What's going on:",
      val('details') || '-'
    ];
    return lines.join('\n');
  }

  /* ---------- confirmation ---------- */
  function showDone(mode) {
    form.hidden = true;
    var done = document.getElementById('done');
    document.getElementById('doneSent').hidden = mode !== 'sent';
    document.getElementById('doneMail').hidden = mode !== 'mail';
    done.hidden = false;
    card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    done.focus({ preventScroll: true });
  }

  /* ---------- submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Enter pressed on step 1: move forward instead of sending
    if (!form.classList.contains('on-step-2')) {
      if (validateStep1()) goTo(2);
      return;
    }
    if (!validateStep1()) { goTo(1); return; }

    // spam trap filled in: quietly pretend it worked
    if (val('company_url')) { showDone('sent'); return; }

    status.textContent = '';
    var action = form.getAttribute('action');

    if (action) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      var data = new FormData(form);
      data.append('_subject', 'New conversation: ' + val('business'));
      data.append('summary', summary());
      fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          showDone('sent');
        })
        .catch(function () {
          status.innerHTML = 'Something went wrong on our end. Please try again, or email us at <a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>.';
        })
        .then(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Start the Conversation';
        });
      return;
    }

    // No form service connected yet: hand the message to the visitor's email app
    window.location.href = 'mailto:' + FALLBACK_EMAIL +
      '?subject=' + encodeURIComponent('Let\'s talk: ' + val('business')) +
      '&body=' + encodeURIComponent(summary());
    showDone('mail');
  });
})();
