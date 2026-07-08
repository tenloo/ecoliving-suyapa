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
    { q: '¿Dónde queda exactamente?', a: 'En el Boulevard Suyapa, Tegucigalpa, justo frente a la UNAH. Cruzás la calle y estás en la universidad — sin buses, sin taxis.' },
    { q: '¿Qué incluye la cuota mensual?', a: 'Habitación privada amoblada, WiFi de alta velocidad, lavandería, seguridad 24/7 y acceso a todas las áreas comunes: gimnasio, rooftop, coworking, lounge y más. La energía se mide por consumo individual.' },
    { q: '¿Cuándo entregan el proyecto?', a: 'El proyecto está en construcción y en etapa de preventa. Dejanos tus datos y te compartimos el calendario de entrega y los planes de pago vigentes.' },
    { q: '¿Puedo comprar para rentar?', a: 'Sí. El modelo de coliving frente a la UNAH tiene demanda constante de estudiantes y jóvenes profesionales — ideal para inversionistas. Te preparamos la información de retorno.' },
    { q: '¿Cómo agendo una visita?', a: 'Llená el formulario de arriba o escribinos por WhatsApp. Te contactamos en menos de 24 horas para coordinar tu visita al showroom.' }
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

  /* ---------- Gallery carousel ---------- */
  var vp = document.getElementById('galCarousel');
  if (vp) {
    var carTrack = vp.querySelector('.carousel-track');
    var prevBtn = document.querySelector('.car-prev');
    var nextBtn = document.querySelector('.car-next');
    var step = function () {
      var slide = carTrack.querySelector('.g-slide');
      return slide ? slide.getBoundingClientRect().width + 16 : vp.clientWidth * 0.8;
    };
    var updateArrows = function () {
      var maxScroll = vp.scrollWidth - vp.clientWidth - 4;
      if (prevBtn) prevBtn.disabled = vp.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = vp.scrollLeft >= maxScroll;
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
  }

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
