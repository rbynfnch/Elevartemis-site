/* =========================================================
   Elevartemis Marketing Group — Home page interactions
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('siteHeader');
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  var heroMedia = document.querySelector('.hero-media');
  var hero = document.querySelector('.hero');

  /* ---------- 1. Hero entrance ---------- */
  function startHero() {
    // two frames so the starting styles paint before the transition kicks in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
    });
  }
  var heroImg = document.getElementById('heroImg');
  if (heroImg && !heroImg.complete) {
    heroImg.addEventListener('load', startHero, { once: true });
    heroImg.addEventListener('error', startHero, { once: true });
    setTimeout(startHero, 1200); // safety net on slow connections
  } else {
    startHero();
  }

  /* ---------- 2. Header: shrink + solidify on scroll ---------- */
  function onScrollHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  /* ---------- 3. Hero parallax (subtle) ---------- */
  var ticking = false;
  function onScrollParallax() {
    if (reduceMotion || !heroMedia || !hero) return;
    var y = window.scrollY;
    if (y > hero.offsetHeight) return;
    heroMedia.style.transform = 'translate3d(0,' + (y * -0.12) + 'px,0)';
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollHeader();
      onScrollParallax();
      ticking = false;
    });
  }, { passive: true });
  onScrollHeader();

  /* ---------- 4. Mobile menu ---------- */
  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }
  menuToggle.addEventListener('click', function () {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) setMenu(false);
  });

  /* ---------- 5. Scroll reveals ---------- */
  var revealTargets = document.querySelectorAll('[data-reveal], [data-sequence], #processSteps, .cta');

  function markDone(el) {
    // after the entrance finishes, remove stagger delays so hovers feel instant
    var delay = parseFloat(getComputedStyle(el).transitionDelay) || 0;
    setTimeout(function () { el.classList.add('reveal-done'); }, 900 + delay * 1000);
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.hasAttribute('data-reveal')) markDone(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible', 'reveal-done'); });
  }

  /* ---------- 6. Active nav link follows the section in view ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sectionIds = ['top', 'about', 'contact'];
  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (a) {
      var match = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', match);
      if (match) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && document.body.dataset.page === 'home') {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 7. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
