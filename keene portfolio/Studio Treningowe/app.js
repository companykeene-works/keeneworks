const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Otwórz menu');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  if (open) {
    closeMenu();
  } else {
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Zamknij menu');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

let previousScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  header?.classList.toggle('is-scrolled', currentScroll > 24);
  header?.classList.toggle('is-hidden', currentScroll > previousScroll && currentScroll > 160 && !document.body.classList.contains('menu-open'));
  previousScroll = currentScroll;
}, { passive: true });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const parallaxImage = document.querySelector('[data-parallax] img');
if (parallaxImage && !reducedMotion) {
  window.addEventListener('scroll', () => {
    const container = parallaxImage.parentElement.getBoundingClientRect();
    if (container.bottom > 0 && container.top < window.innerHeight) {
      const offset = (container.top / window.innerHeight) * -18;
      parallaxImage.style.transform = `scale(1.045) translateY(${offset}px)`;
    }
  }, { passive: true });
}

document.querySelectorAll('details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (detail.open) {
      document.querySelectorAll('details[open]').forEach((other) => {
        if (other !== detail) other.removeAttribute('open');
      });
    }
  });
});

const form = document.querySelector('[data-trial-form]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  const name = new FormData(form).get('name')?.toString().trim().split(' ')[0] || 'Super';
  status.textContent = `${name}, mamy to. Oddzwonimy i znajdziemy dobry termin na Twój start.`;
  status.classList.add('is-success');
  form.reset();
  status.focus?.();
});
