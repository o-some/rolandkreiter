const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 36);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

const closeMenu = () => {
  if (mobileMenu.open) mobileMenu.close();
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

menuButton.addEventListener('click', () => {
  if (typeof mobileMenu.showModal === 'function') mobileMenu.showModal();
  else mobileMenu.setAttribute('open', '');
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
});

mobileMenu.addEventListener('close', closeMenu);
mobileMenu.querySelectorAll('[data-menu-close]').forEach(control => control.addEventListener('click', closeMenu));

document.querySelector('[data-year]').textContent = new Date().getFullYear();

if (reducedMotion) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });

  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    revealObserver.observe(el);
  });

  const portrait = document.querySelector('.portrait-frame');
  window.addEventListener('pointermove', event => {
    if (window.innerWidth < 900) return;
    const x = (event.clientX / window.innerWidth - .5) * 7;
    const y = (event.clientY / window.innerHeight - .5) * 7;
    portrait.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) rotateZ(2deg)`;
  }, { passive: true });
}
