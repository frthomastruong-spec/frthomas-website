/* PREMIUM theme interactions */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- document language + SEO head ---------- */
  document.documentElement.setAttribute('lang', 'en');
  document.title = 'Fr. Thomas Truong — Catholic Priest · Speaker · Writer';
  function setMeta(name, content, attr) {
    var sel = attr === 'property' ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var el = document.querySelector(sel);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr || 'name', name); document.head.appendChild(el); }
    el.setAttribute('content', content);
  }
  setMeta('description', 'Fr. Thomas Truong — Catholic priest, speaker and writer in Vancouver. Homilies, Scripture, Catholic formation, and ministry.');
  setMeta('og:title', 'Fr. Thomas Truong — Catholic Priest · Speaker · Writer', 'property');
  setMeta('og:description', 'Helping people encounter Christ through faith, reflection, and everyday life.', 'property');
  setMeta('og:type', 'website', 'property');
  setMeta('og:image', 'https://frthomas.com/assets/images/home-hero.jpg', 'property');
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Fr. Thomas Truong',
    jobTitle: 'Catholic Priest',
    description: 'Catholic priest, speaker and writer serving at St. Francis Xavier Parish, Vancouver.',
    url: 'https://frthomas.com/',
    address: { '@type': 'PostalAddress', addressLocality: 'Vancouver', addressCountry: 'CA' }
  });
  document.head.appendChild(ld);

  /* ---------- header scroll state ---------- */
  var header = document.getElementById('prHeader');
  function onScrollHeader() { header.classList.toggle('scrolled', window.scrollY > 40); }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- mobile fullscreen menu ---------- */
  var burger = document.getElementById('prBurger');
  var menu = document.getElementById('prMenu');
  var lastFocus = null;
  function openMenu() {
    lastFocus = document.activeElement;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    var first = menu.querySelector('nav a');
    if (first) first.focus();
  }
  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  burger.addEventListener('click', function () {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menu.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  /* ---------- scroll reveals ---------- */
  var rvEls = document.querySelectorAll('.pr-rv');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    rvEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- subtle parallax (GPU-friendly, rAF-throttled) ---------- */
  var heroBg = document.querySelector('.pr-hero-bg');
  var verseBg = document.querySelector('.pr-verse-bg');
  if (!reduceMotion && (heroBg || verseBg)) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (heroBg && y < window.innerHeight * 1.2) heroBg.style.transform = 'translateY(' + (y * 0.18) + 'px)';
        if (verseBg) {
          var r = verseBg.parentElement.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) {
            verseBg.style.transform = 'translateY(' + ((r.top + r.height / 2 - window.innerHeight / 2) * -0.08) + 'px)';
          }
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- active nav highlighting ---------- */
  var navLinks = document.querySelectorAll('.pr-nav a[data-nav]');
  var sections = ['about', 'ministry', 'reflections', 'contact'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ('IntersectionObserver' in window && navLinks.length) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-nav') === en.target.id); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { nio.observe(s); });
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById('prYear');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
