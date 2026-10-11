/* ============================================================
   ARTEMON AEROSPACE — Script
   Defense-grade UI interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('siteHeader');
  const hero   = document.getElementById('home');

  /* ── Header: transparent over hero → solid dark on scroll ── */
  function updateHeader() {
    const threshold = hero ? hero.offsetHeight * 0.15 : 80;
    header.classList.toggle('scrolled', window.scrollY > threshold);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });


  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navList   = document.getElementById('navList');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navList.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navList.querySelectorAll('.nav-a:not(.drop-trigger)').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navList.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Mobile accordion dropdown
  navList.querySelectorAll('.drop-trigger').forEach(trigger => {
    trigger.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        trigger.closest('.has-drop').classList.toggle('open');
      }
    });
  });


  /* ── Smooth scroll with header offset ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 78;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - headerH - 8,
        behavior: 'smooth'
      });
    });
  });


  /* ── Footer accordion (mobile only) ── */
  document.querySelectorAll('.footer-acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth > 768) return; // desktop: do nothing
      const col = btn.closest('.footer-accordion');
      const isOpen = col.classList.contains('open');
      // Close all
      document.querySelectorAll('.footer-accordion.open').forEach(c => c.classList.remove('open'));
      // Toggle clicked (open if was closed)
      if (!isOpen) col.classList.add('open');
      btn.setAttribute('aria-expanded', col.classList.contains('open'));
    });
  });


  /* ── Contact form → Google Apps Script ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlakuLyh3WjlNH8bTi2VT9Xq9b83imT8GohjdSZRA_8pzHG3c2svGJ9c0bYkdMKuNRBA/exec";
    const submitBtn  = document.getElementById('cfSubmit');
    const successEl  = document.getElementById('cfSuccess');
    const errorEl    = document.getElementById('cfError');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      successEl.classList.remove('show');
      errorEl.classList.remove('show');
      submitBtn.disabled = true;
      submitBtn.querySelector('.cf-btn-text').textContent = 'Sending…';

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          body: new FormData(contactForm),
          mode: 'no-cors'
        });
        successEl.classList.add('show');
        contactForm.reset();
      } catch (err) {
        console.error(err);
        errorEl.classList.add('show');
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('.cf-btn-text').textContent = 'Send Message';
      }
    });
  }

  /* ── Trust bar Swiper (mobile only) ── */
  let trustSwiper = null;

  function initTrustSwiper() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !trustSwiper) {
      trustSwiper = new Swiper('.trust-swiper', {
        slidesPerView: 1.65,
        spaceBetween: 0,
        loop: true,
        speed: 700,
        autoplay: {
          delay: 2200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        grabCursor: true,
      });
    } else if (!isMobile && trustSwiper) {
      trustSwiper.destroy(true, true);
      trustSwiper = null;
    }
  }
  initTrustSwiper();

  /* ── Why cards Swiper (mobile only) ── */
  let whySwiper = null;

  function initWhySwiper() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !whySwiper) {
      whySwiper = new Swiper('.why-swiper', {
        slidesPerView: 1.12,
        spaceBetween: 14,
        loop: false,
        speed: 450,
        grabCursor: true,
        breakpoints: {
          480: { slidesPerView: 1.35, spaceBetween: 16 },
          600: { slidesPerView: 1.65, spaceBetween: 16 },
        }
      });
    } else if (!isMobile && whySwiper) {
      whySwiper.destroy(true, true);
      whySwiper = null;
    }
  }
  initWhySwiper();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { initTrustSwiper(); initWhySwiper(); }, 150);
  });


  /* ── Stat counter animation ── */
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const el = entry.target, target = +el.dataset.target;
      const steps = 60, dur = 1400;
      let cur = 0;
      const tick = setInterval(() => {
        cur = Math.min(cur + target / steps, target);
        el.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(tick);
      }, dur / steps);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-num').forEach(el => countObserver.observe(el));

});


/* ── About video: load on play click ── */
function loadAboutVideo() {
  const iframe  = document.querySelector('.about-iframe');
  const poster  = document.getElementById('aboutPoster');
  const dataSrc = iframe ? iframe.getAttribute('data-src') : '';
  if (dataSrc && dataSrc.trim() !== '') {
    const sep = dataSrc.includes('?') ? '&' : '?';
    iframe.src = dataSrc + sep + 'autoplay=1';
    if (poster) poster.style.display = 'none';
  }
}
