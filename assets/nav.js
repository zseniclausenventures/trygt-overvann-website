/* Trygt Overvann AS — navigation enhancements (no SPA routing) */
(function () {
  'use strict';

  // Scroll state on nav bar
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Mobile menu toggle
  var toggle = document.getElementById('navToggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Mark current page link
  var path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (href !== '/' && path.indexOf(href) === 0)) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // Optional: handle Formspree contact form if present
  var form = document.getElementById('contactForm');
  if (form) {
    var FORMSPREE_ID = form.dataset.formspreeId || 'xreyeavp';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      if (btn) { btn.textContent = 'Sender...'; btn.disabled = true; }
      fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.style.display = 'none';
          var s = document.getElementById('form-success');
          if (s) s.style.display = 'block';
        } else {
          var er = document.getElementById('form-error');
          if (er) er.style.display = 'block';
          if (btn) { btn.textContent = 'Send henvendelse'; btn.disabled = false; }
        }
      }).catch(function () {
        var er = document.getElementById('form-error');
        if (er) er.style.display = 'block';
        if (btn) { btn.textContent = 'Send henvendelse'; btn.disabled = false; }
      });
    });
  }
})();
