const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const progress = document.querySelector('[data-progress]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const sections = sectionLinks.map(link => document.getElementById(link.dataset.sectionLink)).filter(Boolean);
const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
let sectionTops = [];
let pageFrame = 0;

const measureSections = () => {
  sectionTops = sections.map(section => ({ section, top: section.offsetTop }));
};

const renderPageState = () => {
  pageFrame = 0;
  header.classList.toggle('scrolled', window.scrollY > 28);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  const marker = window.scrollY + window.innerHeight * .35;
  const active = sectionTops
    .filter(item => item.top <= marker)
    .sort((a, b) => b.top - a.top)[0]?.section || sections[0];
  sectionLinks.forEach(link => link.classList.toggle('is-active', link.dataset.sectionLink === active.id));

  if (!reducedMotion && window.innerWidth > 820) {
    parallaxItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const rate = Number(item.dataset.parallax || 0);
      item.querySelector('img').style.transform = `translate3d(0,${(rect.top - window.innerHeight / 2) * rate}px,0)`;
    });
  }
};

const schedulePageState = () => {
  if (!pageFrame) pageFrame = requestAnimationFrame(renderPageState);
};

measureSections();
renderPageState();
window.addEventListener('scroll', schedulePageState, { passive: true });
window.addEventListener('resize', () => {
  measureSections();
  if (window.innerWidth <= 820) parallaxItems.forEach(item => item.querySelector('img').style.removeProperty('transform'));
  schedulePageState();
}, { passive: true });
window.addEventListener('load', () => { measureSections(); schedulePageState(); }, { once: true });

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
const trackProgress = document.querySelector('[data-track-progress]');
const trackNext = document.querySelector('[data-track-next]');
const trackPrev = document.querySelector('[data-track-prev]');
let dragging = false;
let startX = 0;
let startScroll = 0;
let projectIndex = 0;
let trackFrame = 0;

const targetForSlide = index => Math.min(
  slides[index].offsetLeft - track.offsetLeft,
  Math.max(0, track.scrollWidth - track.clientWidth)
);

const syncTrackUI = () => {
  current.textContent = String(projectIndex + 1).padStart(2,'0');
  trackPrev.disabled = projectIndex === 0;
  trackNext.disabled = projectIndex === slides.length - 1;
  trackProgress.value = projectIndex + 1;
  trackProgress.setAttribute('aria-label', `Projekt ${projectIndex + 1} von ${slides.length}`);
};

const updateTrackIndex = () => {
  trackFrame = 0;
  projectIndex = slides.reduce((closest, slide, index) => {
    const distance = Math.abs(targetForSlide(index) - track.scrollLeft);
    return distance < closest.distance ? { index, distance } : closest;
  }, { index: 0, distance: Infinity }).index;
  syncTrackUI();
};

const scrollToProject = index => {
  projectIndex = Math.max(0, Math.min(slides.length - 1, index));
  syncTrackUI();
  track.scrollTo({ left: targetForSlide(projectIndex), behavior: reducedMotion ? 'auto' : 'smooth' });
};

trackNext.addEventListener('click', () => scrollToProject(projectIndex + 1));
trackPrev.addEventListener('click', () => scrollToProject(projectIndex - 1));
track.addEventListener('scroll', () => {
  if (!trackFrame) trackFrame = requestAnimationFrame(updateTrackIndex);
}, { passive: true });
track.addEventListener('scrollend', () => {
  updateTrackIndex();
  const target = targetForSlide(projectIndex);
  if (Math.abs(track.scrollLeft - target) > 2) track.scrollTo({ left: target, behavior: 'auto' });
}, { passive: true });
track.addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  scrollToProject(projectIndex + (event.key === 'ArrowRight' ? 1 : -1));
});
track.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse') return;
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
window.addEventListener('resize', () => scrollToProject(projectIndex), { passive: true });
syncTrackUI();

const awardsTrack = document.querySelector('[data-awards-track]');
const awardCards = [...awardsTrack.children];
const awardCurrent = document.querySelector('[data-award-current]');
const updateAwardIndex = () => {
  const firstCard = awardCards[0];
  if (!firstCard) return;
  const gap = parseFloat(getComputedStyle(awardsTrack).columnGap) || 0;
  const index = Math.max(0, Math.min(awardCards.length - 1, Math.round(awardsTrack.scrollLeft / (firstCard.getBoundingClientRect().width + gap))));
  awardCurrent.textContent = String(index + 1).padStart(2, '0');
  awardCards.forEach((card, cardIndex) => card.classList.toggle('is-current', cardIndex === index));
};
awardsTrack.addEventListener('scroll', updateAwardIndex, { passive: true });
awardsTrack.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  const gap = parseFloat(getComputedStyle(awardsTrack).columnGap) || 0;
  awardsTrack.scrollBy({ left: direction * (awardCards[0].getBoundingClientRect().width + gap), behavior: reducedMotion ? 'auto' : 'smooth' });
});
updateAwardIndex();
