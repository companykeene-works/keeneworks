/* =========================================================================
   Biuro Rachunkowe Monika Panfil - skrypty strony
   Bez zależności zewnętrznych. Vanilla JS.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 1. Menu mobilne (hamburger) ---------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Otwórz menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    });

    // Zamknij menu po kliknięciu w link
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // Zamknij menu klawiszem Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 2. Cień nagłówka po przewinięciu ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Animacje pojawiania się (reveal on scroll) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showEl(el) { el.classList.add('is-visible'); }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    // Bez animacji / bez wsparcia - pokaż wszystko od razu
    revealEls.forEach(showEl);
  } else {
    var io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showEl(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });

    // Zabezpieczenie: gdyby obserwator nie zadziałał (nietypowa przeglądarka,
    // wstrzymana karta), po chwili od załadowania odsłoń wszystko, co jest
    // w widocznym obszarze - treść nigdy nie zostaje ukryta.
    window.addEventListener('load', function () {
      setTimeout(function () {
        revealEls.forEach(function (el) {
          if (el.classList.contains('is-visible')) return;
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) showEl(el);
        });
      }, 300);
    });
  }

  /* ---------- 4. Rok w stopce ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 5. Formularz kontaktowy ---------- */
  /*
    Domyślnie (USE_API = false) formularz działa przez mailto.
    Aby wysyłać przez własny backend, ustaw USE_API = true 
    oraz wdróż endpoint POST /api/contact.
  */
  var USE_API = false;
  var CONTACT_EMAIL = 'biuro@monikapanfil.pl';

  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('form-status');

  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Walidacja natywna
      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus('Uzupełnij wymagane pola.', 'err');
        return;
      }

      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        topic: form.topic.value,
        message: form.message.value.trim()
      };

      if (USE_API) {
        // --- Wariant z backendem ---
        setStatus('Wysyłanie…', '');
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Błąd serwera');
            form.reset();
            setStatus('Dziękuję! Wiadomość została wysłana. Odpowiem najszybciej jak to możliwe.', 'ok');
          })
          .catch(function () {
            setStatus('Nie udało się wysłać. Zadzwoń lub napisz bezpośrednio na ' + CONTACT_EMAIL + '.', 'err');
          });
      } else {
        // --- Wariant mailto (bez backendu) ---
        var subject = 'Zapytanie ze strony' + (data.topic ? ' - ' + data.topic : '');
        var body =
          'Imię i nazwisko: ' + data.name + '\n' +
          'E-mail: ' + data.email + '\n' +
          'Telefon: ' + (data.phone || '-') + '\n' +
          'Temat: ' + (data.topic || '-') + '\n\n' +
          data.message;
        window.location.href =
          'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
        setStatus('Otwieram program pocztowy… Jeśli się nie otworzył, napisz na ' + CONTACT_EMAIL + '.', 'ok');
      }
    });
  }

  /* ---------- 6. Przełącznik trybu ciemnego (Dark Mode) ---------- */
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var currentTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // Aktualizacja meta tagu theme-color dla przeglądarek mobilnych
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', newTheme === 'dark' ? '#13110e' : '#f7f3ec');
      }
    });
  }

  /* ---------- 7. Baner cookies i zewnętrzne skrypty ---------- */
  var cookieBanner = document.getElementById('cookie-banner');
  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');

  function loadThirdPartyServices() {
    // 1. Google Analytics
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-YEM2BXF97E';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-YEM2BXF97E');

    // 2. Google Maps
    var mapIframe = document.getElementById('google-map-iframe');
    var mapPlaceholder = document.getElementById('map-cookie-placeholder');
    if (mapIframe && mapIframe.dataset.src) {
      mapIframe.src = mapIframe.dataset.src;
      mapIframe.style.display = 'block';
      if (mapPlaceholder) mapPlaceholder.style.display = 'none';
    }

    // 3. Elfsight Reviews
    var reviewsPlaceholder = document.getElementById('reviews-cookie-placeholder');
    if (reviewsPlaceholder) {
      var elfScript = document.createElement('script');
      elfScript.src = 'https://elfsightcdn.com/platform.js';
      elfScript.async = true;
      document.body.appendChild(elfScript);
      reviewsPlaceholder.style.display = 'none';
    }
  }

  // Odczyt decyzji z localStorage
  var cookieConsent = localStorage.getItem('cookie-consent');

  if (cookieConsent === 'accepted') {
    loadThirdPartyServices();
  } else if (cookieConsent !== 'declined') {
    // Pokaż baner z lekkim opóźnieniem
    setTimeout(function() {
      if (cookieBanner) {
        cookieBanner.classList.add('show');
      }
    }, 1000);
  }

  if (acceptBtn && cookieBanner) {
    acceptBtn.addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'accepted');
      cookieBanner.classList.remove('show');
      loadThirdPartyServices();
    });
  }

  if (declineBtn && cookieBanner) {
    declineBtn.addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // Obsługa przycisków zarządzania zgodą w stopce
  var manageConsentBtns = document.querySelectorAll('.manage-consent-btn');
  for (var i = 0; i < manageConsentBtns.length; i++) {
    manageConsentBtns[i].addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('cookie-consent');
      if (cookieBanner) {
        cookieBanner.classList.add('show');
      }
    });
  }

  /* ---------- 8. Odtwarzanie filmu dronem ---------- */
  window.playDronVideo = function() {
    var container = document.querySelector('.video-container');
    var video = document.getElementById('dron-video');
    var btn = document.querySelector('.custom-play-btn');
    if (video && container) {
      video.setAttribute('controls', 'true');
      video.play();
      container.classList.add('playing');
      if (btn) {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      }
    }
  };
})();
