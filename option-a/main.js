/* Prairie Ember Landscape Co. | Option A: Golden hour
   Progressive enhancement only: everything is visible and usable without this file. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Slow parallax on full-bleed photos ---------- */
  var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) {
    return { el: el, img: el.querySelector('img'), speed: parseFloat(el.getAttribute('data-parallax')) || 0.15 };
  });
  var ticking = false;

  function updateParallax() {
    ticking = false;
    var vh = window.innerHeight;
    layers.forEach(function (layer) {
      var rect = layer.el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      // distance of the section centre from the viewport centre
      var delta = (rect.top + rect.height / 2) - vh / 2;
      var max = rect.height * 0.09; // image is oversized by ~10% top and bottom
      var y = Math.max(-max, Math.min(max, -delta * layer.speed));
      layer.img.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateParallax); }
  }
  function enableParallax() {
    if (reduceMotion.matches) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      layers.forEach(function (l) { l.img.style.transform = ''; });
      return;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateParallax();
  }
  if (layers.length) {
    enableParallax();
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', enableParallax);
  }

  /* ---------- Before / after slider ---------- */
  document.querySelectorAll('[data-ba]').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    if (!range) return;
    var set = function () {
      ba.style.setProperty('--pos', range.value + '%');
      range.setAttribute('aria-valuetext', range.value + '% before photo shown');
    };
    range.addEventListener('input', set);
    set();
  });

  /* ---------- Preview-only form: never sends ---------- */
  var form = document.getElementById('consult-form');
  var send = document.getElementById('consult-send');
  var status = document.getElementById('form-status');
  if (form && send && status) {
    var preview = function (e) {
      if (e) e.preventDefault();
      var hp = form.querySelector('#f-website');
      if (hp && hp.value) return; // honeypot filled: silently ignore
      if (!form.reportValidity()) return;
      status.textContent = '';
      window.setTimeout(function () { status.textContent = 'Preview only. Nothing was sent.'; }, 50);
    };
    send.addEventListener('click', preview);
    form.addEventListener('submit', preview);
  }
})();
