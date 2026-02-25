/* =============================================
   SATRONI.PY — app.js
   ============================================= */

'use strict';

// ── Número de WhatsApp ──────────────────────────
const WA_NUMBER = '595971636747';

// ── Helpers ─────────────────────────────────────
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

function buildWaUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ── WhatsApp links ───────────────────────────────
// Todos los elementos con class "whatsapp" y data-message abren WA
function initWhatsApp() {
  $$('.whatsapp').forEach(el => {
    el.addEventListener('click', e => {
      const msg = el.dataset.message;
      if (!msg) return;
      e.preventDefault();
      window.open(buildWaUrl(msg), '_blank', 'noopener,noreferrer');
    });
  });
}

// ── Modal ────────────────────────────────────────
function initModal() {
  const modal     = $('#modal');
  const modalTitle = $('#modal-title');
  const modalSpecs = $('#modal-specs');
  const closeBtn  = $('#close-modal');

  if (!modal) return;

  function openModal(title, specs) {
    modalTitle.textContent = title;
    modalSpecs.textContent = specs;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Cards con data-title / data-specs abren el modal al hacer clic
  $$('.card[data-title]').forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.title, card.dataset.specs);
    });
    // Accesibilidad teclado
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.title, card.dataset.specs);
      }
    });
  });

  // Pero si el clic viene del botón WA dentro de la card, NO abrir modal
  $$('.card .btn-whatsapp').forEach(btn => {
    btn.addEventListener('click', e => e.stopPropagation());
  });

  closeBtn.addEventListener('click', closeModal);

  // Clic fuera del contenido
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Exponer para uso externo (stock-limitado usa onclick en el HTML original)
  window.openModal = openModal;
}

// ── Acordeón FAQ ─────────────────────────────────
function initAccordion() {
  $$('.accordion .item').forEach(item => {
    const trigger = $('h3', item);
    const content = $('.content', item);
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás
      $$('.accordion h3[aria-expanded="true"]').forEach(h => {
        if (h !== trigger) {
          h.setAttribute('aria-expanded', 'false');
          const c = h.nextElementSibling;
          if (c) { c.style.display = 'none'; c.setAttribute('aria-hidden', 'true'); }
        }
      });

      // Toggle actual
      trigger.setAttribute('aria-expanded', String(!expanded));
      content.style.display = expanded ? 'none' : 'block';
      content.setAttribute('aria-hidden', String(expanded));
    });

    // Teclado
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
}

// ── Modo oscuro ──────────────────────────────────
function initTheme() {
  const btn  = $('#toggle-theme');
  const body = document.body;
  if (!btn) return;

  const saved = localStorage.getItem('satroni-theme');
  if (saved === 'night') applyNight(true);

  btn.addEventListener('click', () => {
    const isNight = body.classList.contains('night-mode');
    applyNight(!isNight);
    localStorage.setItem('satroni-theme', !isNight ? 'night' : 'day');
  });

  function applyNight(on) {
    body.classList.toggle('night-mode', on);
    btn.textContent = on ? '☀️' : '🌙';
    btn.setAttribute('aria-label', on ? 'Modo claro' : 'Modo oscuro');
  }
}

// ── Menú hamburguesa ─────────────────────────────
function initHamburger() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  const header    = $('header');
  if (!hamburger || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    mobileNav.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Cerrar al hacer clic en un link
  $$('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ── Header sombra al hacer scroll ────────────────
function initHeaderScroll() {
  const header = $('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Animación de entrada para cards (IntersectionObserver) ──
function initCardAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.card').forEach(card => {
    card.classList.add('anim-card');
    observer.observe(card);
  });
}

// ── Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initWhatsApp();
  initModal();
  initAccordion();
  initTheme();
  initHamburger();
  initHeaderScroll();
  initCardAnimations();
});
