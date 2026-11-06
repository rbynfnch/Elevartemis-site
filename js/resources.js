/* =========================================================
   Elevartemis — Resources page
   Builds every card from js/resources-data.js
   ========================================================= */
(function () {
  'use strict';

  var D = window.ELEVARTEMIS_RESOURCES;
  if (!D) return;
  var NL = D.NEWSLETTER || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slug(s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function findAny(id) { return byId(D.guides, id) || byId(D.tools, id) || byId(D.articles, id) || (D.featuredTool && D.featuredTool.id === id ? D.featuredTool : null); }

  var ICONS = {
    seed: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 5-3 8-8 7z"/><path d="M12 14c0-3-2-5-7-5 0 4 2 6 7 5z"/>',
    people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.6c2.8.2 4.8 2 5.5 5.4"/>',
    browser: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/><path d="M8 14l2.5 2.5L16 12"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    Template: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    Worksheet: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h5"/>',
    Checklist: '<path d="M4 6l2 2 3-3M4 13l2 2 3-3M4 20l2 2"/><path d="M12 7h8M12 14h8M12 21h8"/>',
    Calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || 'ico') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.Template) + '</svg>';
  }

  /* ---------- calls to action ---------- */
  function ctaFor(item, verb) {
    if (item.url) {
      if (item.gated && window.ElevartemisNewsletter && window.ElevartemisNewsletter.connected) {
        return '<button type="button" class="res-cta" data-gate="' + esc(item.id) + '">' + esc(verb) + icon('arrow', 'ico-sm') + '</button>';
      }
      return '<a class="res-cta" href="' + esc(item.url) + '" target="_blank" rel="noopener">' + esc(verb) + icon('arrow', 'ico-sm') + '</a>';
    }
    return '<span class="res-soon">Coming soon</span><a class="res-notify" href="#brief-bottom" data-notify>Get it when it\'s ready</a>';
  }
  function verbFor(format) {
    var f = String(format).toLowerCase();
    if (f.indexOf('template') > -1 || f.indexOf('planner') > -1 || f.indexOf('worksheet') > -1) return 'Get the template';
    if (f.indexOf('checklist') > -1) return 'Get the checklist';
    return 'Download free';
  }

  /* ---------- staggered entrance for rendered cards ---------- */
  function animateIn(container) {
    var cards = container.children;
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.setProperty('--i', i);
      cards[i].classList.add('enter');
    }
    if (reduceMotion) { for (var j = 0; j < cards.length; j++) cards[j].classList.add('in'); return; }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        for (var k = 0; k < cards.length; k++) cards[k].classList.add('in');
      });
    });
  }
  function revealWhenVisible(container) {
    if (!('IntersectionObserver' in window) || reduceMotion) { animateIn(container); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { animateIn(container); io.disconnect(); }
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(container);
  }

  /* ---------- filter chips (shared) ---------- */
  function buildFilters(el, categories, items, onChange) {
    var all = ['All'].concat(categories);
    el.innerHTML = all.map(function (c, i) {
      var n = c === 'All' ? items.length : items.filter(function (x) { return x.category === c; }).length;
      return '<button type="button" class="chip" aria-pressed="' + (i === 0) + '" data-cat="' + esc(c) + '">' + esc(c) + ' <span>' + n + '</span></button>';
    }).join('');
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      setFilter(el, b.getAttribute('data-cat')); onChange(b.getAttribute('data-cat'));
    });
  }
  function setFilter(el, cat) {
    Array.prototype.forEach.call(el.querySelectorAll('.chip'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === cat));
    });
  }

  /* ---------- guides ---------- */
  var guideGrid = document.getElementById('guideGrid');
  function renderGuides(cat, animate) {
    var list = D.guides.filter(function (g) { return cat === 'All' || g.category === cat; });
    guideGrid.innerHTML = list.map(function (g) {
      return '<article class="res-card guide-card" id="res-' + esc(g.id) + '" data-cat="' + slug(g.category) + '">' +
        '<div class="cover" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26"/><circle cx="30" cy="30" r="17"/><circle cx="30" cy="30" r="8"/></svg><span>' + esc(g.format) + '</span></div>' +
        '<div class="res-body">' +
          '<p class="res-meta"><span class="res-cat">' + esc(g.category) + '</span><span class="res-format">' + esc(g.format) + (g.gated ? ' · Free with email' : '') + '</span></p>' +
          '<h3 class="res-title">' + esc(g.title) + '</h3>' +
          '<p class="res-desc">' + esc(g.desc) + '</p>' +
          '<div class="res-actions">' + ctaFor(g, verbFor(g.format)) + '</div>' +
        '</div></article>';
    }).join('');
    if (animate) animateIn(guideGrid);
  }
  var guideFilters = document.getElementById('guideFilters');
  buildFilters(guideFilters, D.guideCategories, D.guides, function (cat) { renderGuides(cat, true); });
  renderGuides('All', false);
  revealWhenVisible(guideGrid);

  /* ---------- tools ---------- */
  var ft = D.featuredTool;
  if (ft) {
    document.getElementById('featuredTool').innerHTML =
      '<article class="checkup" id="res-' + esc(ft.id) + '">' +
        '<div class="checkup-copy">' +
          '<span class="core-chip">' + (ft.url ? 'Interactive tool' : 'Interactive tool: coming soon') + '</span>' +
          '<h3 class="checkup-title">' + esc(ft.title) + '</h3>' +
          '<p>' + esc(ft.desc) + '</p>' +
          '<div class="res-actions">' + (ft.url
            ? '<a class="btn btn-orange btn-lg" href="' + esc(ft.url) + '">Start the checkup</a>'
            : '<a class="btn btn-orange btn-lg" href="#brief-bottom" data-notify>Tell me when it\'s live</a>') + '</div>' +
        '</div>' +
        '<div class="checkup-visual" aria-hidden="true">' +
          '<div class="gauge"><svg viewBox="0 0 120 70"><path class="g-track" d="M10 62a50 50 0 0 1 100 0"/><path class="g-fill" d="M10 62a50 50 0 0 1 100 0"/></svg><span>Your score</span></div>' +
          '<ul class="checkup-items"><li>Clear headline</li><li>Mobile friendly</li><li>Easy to contact</li><li>Found in local search</li></ul>' +
        '</div>' +
      '</article>';
  }
  var toolGrid = document.getElementById('toolGrid');
  toolGrid.innerHTML = D.tools.map(function (t) {
    return '<article class="res-card tool-card" id="res-' + esc(t.id) + '">' +
      '<div class="tool-top">' + icon(t.kind, 'tool-ico') + '<span class="res-format">' + esc(t.kind) + (t.interactive ? ' · Interactive' : '') + '</span></div>' +
      '<h3 class="res-title sm">' + esc(t.title) + '</h3>' +
      '<p class="res-desc">' + esc(t.desc) + '</p>' +
      '<div class="res-actions">' + ctaFor(t, t.interactive ? 'Open the tool' : verbFor(t.kind)) + '</div>' +
    '</article>';
  }).join('') +
    '<article class="res-card tool-card suggest">' +
      '<h3 class="res-title sm">Wish there was a tool for it?</h3>' +
      '<p class="res-desc">Tell us what would make your marketing easier. We build new resources based on what owners ask for.</p>' +
      '<div class="res-actions"><a class="res-cta" href="mailto:' + esc(NL.fallbackEmail || 'hello@elevartemis.com') + '?subject=' + encodeURIComponent('Resource idea') + '">Suggest a resource' + icon('arrow', 'ico-sm') + '</a></div>' +
    '</article>';
  revealWhenVisible(toolGrid);

  /* ---------- library ---------- */
  var libGrid = document.getElementById('libraryGrid');
  function renderLibrary(cat, animate) {
    var list = D.articles.filter(function (a) { return cat === 'All' || a.category === cat; });
    libGrid.innerHTML = list.map(function (a) {
      var rel = a.related ? findAny(a.related) : null;
      return '<article class="res-card article-card" id="res-' + esc(a.id) + '">' +
        '<p class="res-meta"><span class="res-cat">' + esc(a.category) + '</span></p>' +
        '<h3 class="res-title">' + (a.url ? '<a href="' + esc(a.url) + '">' + esc(a.title) + '</a>' : esc(a.title)) + '</h3>' +
        '<p class="res-desc">' + esc(a.excerpt) + '</p>' +
        '<div class="article-foot">' +
          (a.url ? '<a class="res-cta" href="' + esc(a.url) + '">Read the article' + icon('arrow', 'ico-sm') + '</a>' : '<span class="res-soon">Article coming soon</span>') +
          (rel ? '<a class="pair" href="#res-' + esc(rel.id) + '" data-jump="' + esc(rel.id) + '"><span>Pairs with</span>' + esc(rel.title) + '</a>' : '') +
          (a.service ? '<a class="pair svc" href="' + esc(a.service.href) + '"><span>Want help?</span>' + esc(a.service.label) + '</a>' : '') +
        '</div></article>';
    }).join('');
    if (animate) animateIn(libGrid);
  }
  buildFilters(document.getElementById('libraryFilters'), D.articleCategories, D.articles, function (cat) { renderLibrary(cat, true); });
  renderLibrary('All', false);
  revealWhenVisible(libGrid);

  /* ---------- jump to a resource and highlight it ---------- */
  function jumpTo(id) {
    var el = document.getElementById('res-' + id);
    if (!el && byId(D.guides, id)) { setFilter(guideFilters, 'All'); renderGuides('All', false); el = document.getElementById('res-' + id); }
    if (!el) return;
    el.classList.add('in');
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    var focusable = el.querySelector('a, button');
    if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  }

  /* ---------- start here ---------- */
  var opts = document.getElementById('startOptions');
  var pathEl = document.getElementById('startPath');
  opts.innerHTML = D.paths.map(function (p) {
    return '<button type="button" class="start-opt" aria-pressed="false" aria-controls="startPath" data-path="' + esc(p.id) + '">' +
      icon(p.icon, 'start-ico') + '<span>' + esc(p.label) + '</span></button>';
  }).join('');
  pathEl.innerHTML = '<p class="start-hint">Choose one above to see your starting point.</p>';

  function stepCard(kind, item) {
    if (!item) return '';
    return '<a class="path-step" href="#res-' + esc(item.id) + '" data-jump="' + esc(item.id) + '">' +
      '<span class="path-kind">' + kind + '</span>' +
      '<span class="path-title">' + esc(item.title) + '</span>' +
      '<span class="path-go">' + (item.url ? 'Open' : 'See it') + icon('arrow', 'ico-sm') + '</span></a>';
  }
  function showPath(id) {
    var p = byId(D.paths, id); if (!p) return;
    Array.prototype.forEach.call(opts.querySelectorAll('.start-opt'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-path') === id));
    });
    pathEl.innerHTML =
      '<div class="path-panel">' +
        '<div class="path-intro"><p class="path-label">' + esc(p.label) + '</p><p>' + esc(p.intro) + '</p></div>' +
        '<div class="path-steps">' +
          stepCard('1. Read', byId(D.guides, p.guide)) +
          stepCard('2. Use', byId(D.tools, p.tool)) +
          stepCard('3. Learn more', byId(D.articles, p.article)) +
        '</div>' +
        (p.service ? '<p class="path-service">When you want a hand with it: <a href="' + esc(p.service.href) + '">' + esc(p.service.label) + '</a></p>' : '') +
      '</div>';
  }
  opts.addEventListener('click', function (e) {
    var b = e.target.closest('.start-opt'); if (!b) return;
    showPath(b.getAttribute('data-path'));
    if (window.innerWidth < 900) pathEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  });

  /* delegated clicks: jumps, "notify me", email gate */
  document.addEventListener('click', function (e) {
    var j = e.target.closest('[data-jump]');
    if (j) { e.preventDefault(); jumpTo(j.getAttribute('data-jump')); return; }
    var n = e.target.closest('[data-notify]');
    if (n) {
      e.preventDefault();
      var band = document.getElementById('brief-bottom');
      band.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () { document.getElementById('briefEmailBottom').focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
      return;
    }
    var g = e.target.closest('[data-gate]');
    if (g) openGate(g.getAttribute('data-gate'));
  });

  /* ---------- newsletter signup ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleForm(form, after, source) {
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
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Adding you…'; }
      var src = typeof source === 'function' ? source() : (source || 'Resources page');
      window.ElevartemisNewsletter.subscribe(email, src).then(function (r) {
        msg.className = 'brief-msg ' + (r.ok ? 'is-ok' : 'is-error');
        msg.textContent = r.message;
        if (r.ok) { input.value = ''; if (after) after(form); }
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.brief-form'), function (f) { handleForm(f); });

  /* ---------- email gate ---------- */
  var gate = document.getElementById('gate');
  var gateItem = null;
  function openGate(id) {
    gateItem = findAny(id); if (!gateItem || !gate.showModal) { if (gateItem && gateItem.url) window.open(gateItem.url, '_blank'); return; }
    gate.querySelector('.gate-title').textContent = gateItem.title;
    var msg = gate.querySelector('.brief-msg'); msg.textContent = ''; msg.className = 'brief-msg';
    gate.showModal();
  }
  if (gate) {
    gate.querySelector('.gate-close').addEventListener('click', function () { gate.close(); });
    gate.addEventListener('click', function (e) { if (e.target === gate) gate.close(); });
    handleForm(gate.querySelector('form'), function (form) {
      if (gateItem && gateItem.url) {
        var msg = form.querySelector('.brief-msg');
        msg.innerHTML = 'Thanks! <a href="' + esc(gateItem.url) + '" target="_blank" rel="noopener">Open your download</a>';
      }
    }, function () { return 'Download: ' + (gateItem ? gateItem.title : 'resource'); });
  }
})();
