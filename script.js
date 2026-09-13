const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const progress = document.querySelector('[data-progress]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const sections = sectionLinks.map(link => document.getElementById(link.dataset.sectionLink)).filter(Boolean);

const updatePageState = () => {
  header.classList.toggle('scrolled', window.scrollY > 28);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  const marker = window.scrollY + window.innerHeight * .35;
  const active = sections.reduce((current, section) => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    return sectionTop <= marker ? section : current;
  }, sections[0]);
  sectionLinks.forEach(link => link.classList.toggle('is-active', link.dataset.sectionLink === active.id));
};
updatePageState();
window.addEventListener('scroll', updatePageState, { passive: true });

const closeMenu = () => {
  if (mobileMenu.open) mobileMenu.close();
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  if (typeof mobileMenu.showModal === 'function') mobileMenu.showModal();
  else mobileMenu.setAttribute('open', '');
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
});

mobileMenu.addEventListener('close', closeMenu);
mobileMenu.querySelectorAll('[data-menu-close]').forEach(control => control.addEventListener('click', closeMenu));
document.querySelector('[data-year]').textContent = new Date().getFullYear();

if (reducedMotion) {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -8%' });
  document.querySelectorAll('.reveal').forEach((element,index) => {
    element.style.transitionDelay = `${Math.min(index % 3,2) * 65}ms`;
    revealObserver.observe(element);
  });

  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  const updateParallax = () => {
    parallaxItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const rate = Number(item.dataset.parallax || 0);
      item.querySelector('img').style.transform = `translateY(${(rect.top - window.innerHeight / 2) * rate}px)`;
    });
  };
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    if (reducedMotion || !Number.isFinite(target)) {
      element.textContent = String(target);
    } else {
      const start = target - 12;
      const duration = 1250;
      const startedAt = performance.now();
      const tick = now => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(start + (target - start) * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    counterObserver.unobserve(element);
  });
}, { threshold: .65 });
counters.forEach(counter => counterObserver.observe(counter));

const lensArea = document.querySelector('[data-lens]');
const lens = lensArea.querySelector('.detail-lens');
if (window.matchMedia('(pointer:fine)').matches) {
  lensArea.addEventListener('pointermove', event => {
    const rect = lensArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    lens.style.left = `${x - 75}px`;
    lens.style.top = `${y - 75}px`;
    lens.style.backgroundPosition = `${-x * 1.45 + 75}px ${-y * 1.45 + 75}px`;
  });
}

const track = document.querySelector('[data-track]');
const slides = [...track.querySelectorAll('.project-slide')];
const current = document.querySelector('[data-track-current]');
let dragging = false;
let startX = 0;
let startScroll = 0;

const slideStep = () => slides[0].getBoundingClientRect().width + 24;
const updateTrackIndex = () => {
  const index = Math.max(0,Math.min(slides.length - 1,Math.round(track.scrollLeft / slideStep())));
  current.textContent = String(index + 1).padStart(2,'0');
};

document.querySelector('[data-track-next]').addEventListener('click', () => track.scrollBy({ left: slideStep(), behavior: reducedMotion ? 'auto' : 'smooth' }));
document.querySelector('[data-track-prev]').addEventListener('click', () => track.scrollBy({ left: -slideStep(), behavior: reducedMotion ? 'auto' : 'smooth' }));
track.addEventListener('scroll', updateTrackIndex, { passive: true });
track.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') track.scrollBy({ left: slideStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
  if (event.key === 'ArrowLeft') track.scrollBy({ left: -slideStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
});
track.addEventListener('pointerdown', event => {
  dragging = true;
  startX = event.clientX;
  startScroll = track.scrollLeft;
  track.classList.add('is-dragging');
  track.setPointerCapture(event.pointerId);
});
track.addEventListener('pointermove', event => {
  if (!dragging) return;
  track.scrollLeft = startScroll - (event.clientX - startX);
});
const stopDrag = event => {
  if (!dragging) return;
  dragging = false;
  track.classList.remove('is-dragging');
  if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
};
track.addEventListener('pointerup', stopDrag);
track.addEventListener('pointercancel', stopDrag);
