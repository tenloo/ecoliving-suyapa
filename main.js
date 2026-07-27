/* =========================================================
   ecoliving suyapa — interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Tracking helpers (GA4 + Meta Pixel, fail-safe) ---------- */
  function track(name, params) {
    try { if (window.gtag) gtag('event', name, params || {}); } catch (e) {}
  }
  function fbTrack(ev, params) {
    try { if (window.fbq) fbq('track', ev, params || {}); } catch (e) {}
  }
  // Click tracking: WhatsApp, brochure/lead-magnet and plan CTAs
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a,button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var cta = a.getAttribute('data-cta');
    if (href.indexOf('wa.me') !== -1) {
      track('whatsapp_click', { cta: cta || 'whatsapp' });
      fbTrack('Contact');
    } else if (cta) {
      track('cta_click', { cta: cta });
      if (cta === 'brochure') fbTrack('ViewContent', { content_name: 'lista-precios' });
    }
  }, true);

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var setMenu = function (open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', function () {
    setMenu(!menu.classList.contains('open'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  /* ---------- Interest segmented control ---------- */
  var segBtns = document.querySelectorAll('.seg__btn');
  var interestInput = document.getElementById('f-interes');
  segBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      segBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      interestInput.value = btn.getAttribute('data-interest');
    });
  });

  /* ---------- Hero form submit ---------- */
  var form = document.getElementById('hero-form');
  var fields = form.querySelector('[data-form-fields]');
  var success = form.querySelector('[data-form-success]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Collect data (ready to wire to a backend / WhatsApp / email service)
    var data = {
      nombre: form.nombre.value.trim(),
      telefono: form.telefono.value.trim(),
      correo: form.correo.value.trim(),
      interes: interestInput.value
    };
    // eslint-disable-next-line no-console
    console.log('Lead ecoliving suyapa:', data);
    // --- Conversión: lead capturado ---
    track('generate_lead', { interes: data.interes });
    fbTrack('Lead', { content_name: data.interes });
    fields.hidden = true;
    success.hidden = false;
    success.setAttribute('role', 'status');
  });

  /* ---------- FAQ accordion ---------- */
  var faqData = [
    { q: '¿Dónde queda el proyecto?', a: 'En la zona de Suyapa, Boulevard Suyapa, Tegucigalpa — a pocos pasos de la UNAH. Agendá una visita y coordinamos el punto exacto.' },
    { q: '¿Cuánto cuestan los apartamentos?', a: 'Un apartaestudio (23–33 m²) parte desde unos $69,000 y los apartamentos de 1 y 2 habitaciones (31–52 m²) desde unos $94,500. Para venta tenemos unidades con acabados y en obra gris. Reservás con $3,000 y una prima del 10%. El precio de renta lo confirmamos según disponibilidad.' },
    { q: '¿Cuándo entregan el proyecto?', a: 'El proyecto está en preventa: inicia en septiembre y la entrega estimada es en diciembre de 2026. Dejanos tus datos y te compartimos el calendario y los planes de pago vigentes.' },
    { q: '¿El parqueo está incluido?', a: 'Sí. Cada apartamento incluye un parqueo.' },
    { q: '¿Puedo comprar para rentar?', a: 'Sí. Es una zona universitaria con demanda constante de estudiantes y jóvenes profesionales, ideal para comprar y rentar. Te preparamos la información para inversionistas.' },
    { q: '¿Cómo agendo una visita?', a: 'Llená el formulario de arriba o escribinos por WhatsApp al +504 9460-1511. La sala de ventas atiende de lunes a viernes de 8:00 a.m. a 5:00 p.m. y sábados de 8:00 a.m. a 12:00 m.' }
  ];

  var list = document.getElementById('faqList');
  var openIndex = 0; // first open by default

  faqData.forEach(function (item, idx) {
    var num = '0' + (idx + 1);
    var el = document.createElement('div');
    el.className = 'faq' + (idx === openIndex ? ' open' : '');
    el.innerHTML =
      '<button class="faq__btn" aria-expanded="' + (idx === openIndex) + '" aria-controls="faq-p-' + idx + '">' +
        '<span class="faq__q"><span class="faq__num">' + num + '</span>' + item.q + '</span>' +
        '<span class="faq__icon" aria-hidden="true">+</span>' +
      '</button>' +
      '<div class="faq__panel" id="faq-p-' + idx + '" role="region"><p>' + item.a + '</p></div>';
    list.appendChild(el);
  });

  var faqEls = Array.prototype.slice.call(list.querySelectorAll('.faq'));
  var setPanel = function (el, open) {
    var panel = el.querySelector('.faq__panel');
    var btn = el.querySelector('.faq__btn');
    var icon = el.querySelector('.faq__icon');
    el.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    icon.textContent = open ? '–' : '+';
    panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
  };
  // init open panel height
  faqEls.forEach(function (el, i) { setPanel(el, i === openIndex); });

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.faq__btn');
    if (!btn) return;
    var el = btn.parentElement;
    var isOpen = el.classList.contains('open');
    faqEls.forEach(function (other) { if (other !== el) setPanel(other, false); });
    setPanel(el, !isOpen);
  });
  // keep open panel sized on resize
  window.addEventListener('resize', function () {
    faqEls.forEach(function (el) {
      if (el.classList.contains('open')) {
        var p = el.querySelector('.faq__panel');
        p.style.maxHeight = p.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Carruseles ----------
     Se inicializa cada .carousel-viewport de la página. Las flechas se buscan
     dentro del .carousel contenedor, no en todo el documento, para que cada
     carrusel controle solamente el suyo. */
  Array.prototype.forEach.call(document.querySelectorAll('.carousel-viewport'), function (vp) {
    var root = vp.closest('.carousel') || vp.parentNode;
    var carTrack = vp.querySelector('.carousel-track');
    if (!carTrack) return;
    var prevBtn = root.querySelector('.car-prev');
    var nextBtn = root.querySelector('.car-next');
    var step = function () {
      var slide = carTrack.firstElementChild;
      return slide ? slide.getBoundingClientRect().width + 16 : vp.clientWidth * 0.8;
    };
    var updateArrows = function () {
      var maxScroll = vp.scrollWidth - vp.clientWidth - 4;
      var sinDesborde = vp.scrollWidth <= vp.clientWidth + 4;
      if (prevBtn) prevBtn.disabled = sinDesborde || vp.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = sinDesborde || vp.scrollLeft >= maxScroll;
    };
    if (nextBtn) nextBtn.addEventListener('click', function () { vp.scrollBy({ left: step(), behavior: 'smooth' }); });
    if (prevBtn) prevBtn.addEventListener('click', function () { vp.scrollBy({ left: -step(), behavior: 'smooth' }); });
    vp.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    // drag to scroll (pointer)
    var isDown = false, startX = 0, startLeft = 0, moved = 0;
    vp.addEventListener('pointerdown', function (e) {
      isDown = true; moved = 0; startX = e.clientX; startLeft = vp.scrollLeft;
      vp.style.scrollSnapType = 'none';
    });
    window.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX; moved = Math.abs(dx);
      vp.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!isDown) return;
      isDown = false; vp.style.scrollSnapType = '';
    });
    // suppress click (lightbox) right after a drag
    vp.addEventListener('click', function (e) {
      if (moved > 8) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  });

  /* ---------- Lightbox ---------- */
  var openers = Array.prototype.slice.call(document.querySelectorAll('#galeria .g-open'));
  var lb = document.getElementById('lightbox');
  if (lb && openers.length) {
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCaption');
    var lbIndex = 0;
    var lastFocus = null;

    var render = function (i) {
      lbIndex = (i + openers.length) % openers.length;
      var o = openers[lbIndex];
      var img = o.querySelector('img');
      lbImg.src = o.getAttribute('data-src') || img.getAttribute('src');
      lbImg.alt = img ? img.getAttribute('alt') : '';
      lbCap.textContent = o.getAttribute('data-caption') || '';
    };
    var openLb = function (i) {
      lastFocus = document.activeElement;
      render(i);
      lb.hidden = false;
      requestAnimationFrame(function () { lb.classList.add('open'); });
      document.body.style.overflow = 'hidden';
      document.getElementById('lbClose').focus();
    };
    var closeLb = function () {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () { lb.hidden = true; }, 280);
      if (lastFocus) lastFocus.focus();
    };
    openers.forEach(function (o, i) {
      o.addEventListener('click', function () { openLb(i); });
    });
    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbNext').addEventListener('click', function () { render(lbIndex + 1); });
    document.getElementById('lbPrev').addEventListener('click', function () { render(lbIndex - 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') render(lbIndex + 1);
      else if (e.key === 'ArrowLeft') render(lbIndex - 1);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
